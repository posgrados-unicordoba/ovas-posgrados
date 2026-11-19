#!/usr/bin/env node
/**
 * Validador de los OVA de posgrado (repositorio posgrados-unicordoba/ovas-posgrados).
 *
 * Recorre esp/, mae/ y doc/, encuentra cada OVA (carpeta con index.html) y
 * revisa que cumpla las reglas de:
 *   - la guía de organización (rutas, siglas, nombres, archivos, README),
 *   - la tabla de componentes del equipo pedagógico,
 *   - la lista de verificación técnica y pedagógica de CINTIA.
 *
 * Tipos de OVA (según la carpeta):
 *   uNN/tNN (o uNN)   OVA de tema (o de unidad): todas las reglas, con el menú
 *                     de 7 secciones y la autoevaluación.
 *   uNN/diagnostico,  OVA complementarios de la unidad (opcionales): reglas
 *   uNN/actividades   técnicas y pedagógicas, sin las 7 secciones.
 *   bibliografia,     Recursos del curso: solo reglas técnicas y sin logo. La bibliografía y
 *   rubrica, mapa     la rúbrica son obligatorias en todo curso (si faltan, avisa);
 *                     el mapa conceptual es opcional.
 *
 *   ❌ ERRORES      → reglas obligatorias. Si alguno falla, el script termina con
 *                     código 1 y GitHub Actions bloquea el Pull Request.
 *   ⚠️  ADVERTENCIAS → se informan pero NO bloquean. Señalan lo que conviene
 *                     revisar a mano (por ejemplo, la navegación con teclado).
 *
 * El validador solo mira el OVA. No reemplaza la revisión del equipo
 * pedagógico: criterios como "máximo 2 elementos por vista" o el contraste de
 * los colores se revisan a mano.
 *
 * Uso local:   node scripts/validar-ova.mjs
 *              node scripts/validar-ova.mjs esp/gthdo/pobh/u02/t03   (solo ese OVA)
 *              node scripts/validar-ova.mjs --sin-enlaces   (sin comprobar los enlaces externos)
 * En CI:       lo ejecuta .github/workflows/validar.yml en cada Pull Request.
 *
 * No usa dependencias externas (solo módulos nativos de Node).
 */

import { readdirSync, statSync, existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import {
  NIVELES, SIGLA_PROGRAMA, SIGLA_CURSO, UNIDAD, TEMA, QUEMAR, RECURSOS, RECURSOS_OBLIGATORIOS, COMPLEMENTOS,
  leer, rel, encontrarOvas, partesRuta, codigoDe, leerCatalogo, buscarEnCatalogo, tituloDe, aTexto, iconosUsados,
} from './comun.mjs';

const ICONOS = 'node scripts/guardar-iconos.mjs <carpeta-del-ova>';

const ROOT = process.cwd();

const SECCIONES = ['introduccion', 'objetivos', 'contenido', ['actividad', 'actividades'], 'evaluacion', 'recursos', 'bibliografia'];
const NOMBRE_SECCION = (s) => (Array.isArray(s) ? s.join('" o "') : s);
const ID_SECCION = /id=["'](introduccion|objetivos|contenido|actividad|actividades|evaluacion|recursos|bibliografia)["']/;
const NOMBRE_VALIDO = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\.[a-z0-9]+)*$/;
const ARCHIVOS = ['README.md', 'index.html', 'estilos.css', 'script.js', 'tailwind.css'];
const ELENS = 'https://elens.ecodestudio.dev/elens.js';
const MB = 1024 * 1024;
const PERMITIDOS_EXTERNOS = /^(https?:)?\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com|elens\.ecodestudio\.dev)(\/|$)/i;

// Verbos de la taxonomía SOLO. Los de orden superior son los niveles
// relacional y abstracto ampliado; los de nivel bajo, uni y multiestructural.
const VERBOS_SUPERIORES = /^(analizar|aplicar|argumentar|comparar|construir|contrastar|crear|criticar|desarrollar|dise[ñn]ar|elaborar|evaluar|explicar|formular|generalizar|gestionar|hipotetizar|implementar|integrar|interpretar|justificar|planificar|plantear|proponer|reflexionar|relacionar|resolver|sintetizar|teorizar|transferir|valorar|fundamentar|diagnosticar|orientar|liderar|estructurar|investigar|modelar|optimizar|transformar)$/i;
const VERBOS_BAJOS = /^(identificar|reconocer|definir|enumerar|listar|nombrar|memorizar|recordar|describir|conocer|repetir|se[ñn]alar|clasificar|combinar)$/i;

// --- Problemas ------------------------------------------------------------
const problemas = [];
const err = (ova, que, arreglo) => problemas.push({ ova, nivel: 'error', que, arreglo });
const warn = (ova, que, arreglo) => problemas.push({ ova, nivel: 'aviso', que, arreglo });

// --- Utilidades -----------------------------------------------------------

/** Todos los archivos y carpetas dentro del OVA (rutas relativas a él). */
function listar(dir, base = dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    acc.push({ ruta: rel(base, full), nombre: name, dir: st.isDirectory(), tam: st.size });
    if (st.isDirectory()) listar(full, base, acc);
  }
  return acc;
}

/** Fragmento de una sección: desde su id hasta la siguiente sección. */
function seccion(html, ids) {
  const lista = Array.isArray(ids) ? ids : [ids];
  const m = new RegExp(`id=["'](${lista.join('|')})["']`).exec(html);
  if (!m) return '';
  const resto = html.slice(m.index + 5);
  const sig = ID_SECCION.exec(resto);
  const frag = sig ? html.slice(m.index, m.index + 5 + sig.index) : html.slice(m.index);
  return frag.replace(/<footer[\s\S]*?<\/footer>/gi, '');
}

const esExterna = (url) => /^(https?:)?\/\//i.test(url);
const esEspecial = (url) => /^(#|mailto:|tel:|data:|javascript:|blob:)/i.test(url) || url.includes('${');

/** Todas las referencias a archivos locales: src/href en el HTML y url() en el CSS. */
function referenciasLocales(html, css) {
  const refs = [];
  for (const m of html.matchAll(/\s(?:src|href)=["']([^"']+)["']/gi)) refs.push(m[1]);
  for (const m of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) refs.push(m[1]);
  return [...new Set(refs.map((r) => r.trim()))]
    .filter((r) => r && !esExterna(r) && !esEspecial(r))
    .map((r) => r.split('#')[0].split('?')[0])
    .filter(Boolean);
}

/** Ancho en píxeles de una etiqueta <img>, si se puede saber. 1 cm ≈ 37.8 px. */
function anchoPx(tag) {
  const est = /style=["'][^"']*width\s*:\s*([\d.]+)\s*(px|cm|mm|rem)/i.exec(tag);
  if (est) {
    const n = parseFloat(est[1]);
    return { cm: n * 37.8, mm: n * 3.78, rem: n * 16, px: n }[est[2].toLowerCase()];
  }
  const attr = /\swidth=["']?(\d+)/i.exec(tag);
  if (attr) return parseInt(attr[1], 10);
  const tw = /class=["'][^"']*\bw-(\d+)\b/i.exec(tag);
  if (tw) return parseInt(tw[1], 10) * 4;
  const twArb = /class=["'][^"']*\bw-\[(\d+)px\]/i.exec(tag);
  if (twArb) return parseInt(twArb[1], 10);
  return null;
}

/** Cuenta las preguntas de la autoevaluación, sea cual sea el motor del quiz. */
function contarPreguntas(js, secEval) {
  let hay = false, n = 0;
  // (a) un arreglo JS de preguntas con claves question/pregunta/prompt/enunciado.
  if (/\b(?:quizData|quizQuestions|preguntas|questions|quiz)\s*=\s*\[/.test(js)) {
    hay = true;
    n = Math.max(n, (js.match(/\b(?:question|pregunta|prompt|enunciado)\s*:/gi) || []).length);
  }
  // (b) todas las respuestas en un solo atributo: data-correct='[0,1,2]'.
  for (const m of secEval.matchAll(/data-correct=['"]\s*\[([^\]]*)\]/g)) {
    hay = true; n = Math.max(n, m[1].split(',').filter((s) => s.trim()).length);
  }
  // (c) una respuesta por pregunta: data-correct="B".
  const sueltas = (secEval.match(/data-correct=['"](?!\s*\[)[^'"]+['"]/g) || []).length;
  if (sueltas) { hay = true; n = Math.max(n, sueltas); }
  // (d) formulario con un grupo de radio/checkbox por pregunta.
  const grupos = new Set();
  for (const re of [/<input[^>]*type=["'](?:radio|checkbox)["'][^>]*name=["']([^"']+)["']/gi,
    /<input[^>]*name=["']([^"']+)["'][^>]*type=["'](?:radio|checkbox)["']/gi]) {
    for (const m of secEval.matchAll(re)) grupos.add(m[1]);
  }
  if (grupos.size) { hay = true; n = Math.max(n, grupos.size); }
  return { hay, n };
}

/** Clases CSS usadas en un fragmento. */
const clasesDe = (frag) => new Set([...frag.matchAll(/class=["']([^"']+)["']/g)].flatMap((m) => m[1].split(/\s+/)));

/** ¿Alguna regla del CSS para estas clases tiene un borde de al menos 2px? */
function bordeGruesoEnCss(css, clases) {
  for (const m of css.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
    const selector = m[1]; const cuerpo = m[2];
    const ancho = /border(?:-(?:left|right|top|bottom))?(?:-width)?\s*:\s*([\d.]+)px/i.exec(cuerpo);
    if (!ancho || parseFloat(ancho[1]) < 2) continue;
    for (const c of selector.matchAll(/\.([a-zA-Z0-9_-]+)/g)) if (clases.has(c[1])) return true;
  }
  return false;
}

const sha = (ruta) => createHash('sha256').update(readFileSync(ruta)).digest('hex');

// --- Catálogo y logo de referencia ---------------------------------------
const catalogo = leerCatalogo(ROOT);
const LOGO_CINTIA = join(ROOT, 'logos', 'cintia.webp');
const hashCintia = existsSync(LOGO_CINTIA) ? sha(LOGO_CINTIA) : null;

// --- Qué OVA validar ------------------------------------------------------
const pedidos = process.argv.slice(2).filter((a) => !a.startsWith('--'));
let ovas = encontrarOvas(ROOT);
if (pedidos.length) {
  const set = new Set(pedidos.map((p) => resolve(p)));
  ovas = ovas.filter((d) => set.has(resolve(d)));
}

if (catalogo.error) err('catalogo.csv', catalogo.error,
  'Crea catalogo.csv en la raíz con la cabecera: nivel,sigla-programa,programa,sigla-curso,curso,fecha,responsable.');

if (!ovas.length) {
  console.log('ℹ️  No se encontraron OVA para validar.');
  process.exit(catalogo.error ? 1 : 0);
}

const tiposPorCurso = new Map();
const enlacesPorUrl = new Map(); // url → OVA que la usan (para comprobar que funcionen)

for (const dir of ovas) {
  const r = rel(ROOT, dir);
  const p = partesRuta(r);

  // 1) Ruta: nivel / programa / curso / uNN / tNN (o termina en la unidad)
  if (!p) {
    err(r, `La carpeta del OVA está en el nivel equivocado: tiene ${r.split('/').length} niveles y deben ser 5 (tema o evaluación) o 4 (unidad o recurso del curso).`,
      `Muévela a nivel/programa/curso/uNN/tNN/ (ej: esp/gthdo/pobh/u02/t03/), a uNN/${Object.keys(COMPLEMENTOS).join('/ o uNN/')}/ si es un complemento de la unidad, o a nivel/programa/curso/${Object.keys(RECURSOS).join('/, ')}/ si es un recurso del curso.`);
    continue;
  }
  if (!NIVELES[p.nivel])
    err(r, `El nivel "${p.nivel}" no es válido.`, 'La primera carpeta debe ser esp (especialización), mae (maestría) o doc (doctorado).');
  if (!SIGLA_PROGRAMA.test(p.programa))
    err(r, `La sigla del programa "${p.programa}" no es válida.`,
      'Usa la sigla oficial del programa en minúsculas, sin la abreviatura del nivel, de 2 a 5 letras (ej: EspGTHDO → gthdo).');
  if (!SIGLA_CURSO.test(p.curso))
    err(r, `La sigla del curso "${p.curso}" no es válida.`, 'Usa de 2 a 4 letras minúsculas: las iniciales de las palabras importantes (ej: Psicología Organizacional y Bienestar Humano → pobh).');
  if (p.tipo !== 'recurso' && !UNIDAD.test(p.unidad))
    err(r, `La carpeta "${p.unidad}" no es una unidad ni un recurso del curso.`,
      `Si es una unidad, renómbrala como u + dos dígitos (u01, u02…). Si es un recurso del curso, usa uno de estos nombres: ${Object.keys(RECURSOS).join(', ')}.`);
  if (p.tema && !TEMA.test(p.tema))
    err(r, `La carpeta "${p.tema}" no tiene el formato correcto.`, `Renómbrala como t + dos dígitos, sin nombre (t01, t02…), o con el nombre de un complemento de la unidad: ${Object.keys(COMPLEMENTOS).join(', ')}.`);
  const esOva = p.tipo === 'tema' || p.tipo === 'unidad'; // con menú de 7 secciones y autoevaluación

  const claveCurso = `${p.nivel}/${p.programa}/${p.curso}`;
  if (!tiposPorCurso.has(claveCurso)) tiposPorCurso.set(claveCurso, new Map());
  if (esOva) tiposPorCurso.get(claveCurso).set(r, p.tipo);

  // 2) Catálogo
  if (!catalogo.error) {
    const enCat = buscarEnCatalogo(catalogo.filas, p);
    if (!enCat.programa)
      err(r, `El programa "${p.programa}" (${p.nivel}) no está registrado en catalogo.csv.`,
        `Agrega al final de catalogo.csv la fila del curso: ${p.nivel},${p.programa},<nombre del programa>,${p.curso},<nombre del curso>,<AAAA-MM-DD>,<responsable>.`);
    else if (!enCat.curso)
      err(r, `El curso "${p.curso}" del programa "${p.programa}" no está registrado en catalogo.csv.`,
        `Agrega al final de catalogo.csv: ${p.nivel},${p.programa},${enCat.programa},${p.curso},<nombre del curso>,<AAAA-MM-DD>,<responsable>.`);
  }

  // 3) Nombres de archivos y carpetas, y tamaño
  const contenido = listar(dir);
  for (const a of contenido) {
    if (a.ruta === 'README.md') continue;
    if (!NOMBRE_VALIDO.test(a.nombre))
      err(r, `El nombre "${a.ruta}" tiene mayúsculas, tildes, ñ, espacios, guion bajo u otros caracteres no permitidos.`,
        'Renómbralo en minúsculas, sin tildes ni ñ, con guion medio como separador (ej: img/mapa-procesos.png), y corrige su referencia en el HTML.');
    if (!a.dir && a.tam > 100 * MB)
      err(r, `El archivo "${a.ruta}" pesa ${(a.tam / MB).toFixed(0)} MB. GitHub no acepta archivos de más de 100 MB.`,
        'Comprímelo o reemplázalo por un enlace externo.');
    else if (!a.dir && a.tam > 20 * MB)
      warn(r, `El archivo "${a.ruta}" pesa ${(a.tam / MB).toFixed(0)} MB, lo que hace lento el OVA.`, 'Comprímelo si es posible.');
    if (!a.dir && /\.(docx?|pptx?|xlsx?)$/i.test(a.nombre))
      warn(r, `El OVA trae el archivo de Office "${a.ruta}".`, 'Si es la guía del curso o el formato 088, sácalo del OVA: el repositorio solo guarda los archivos del OVA.');
  }

  // 4) Archivos obligatorios
  for (const f of ARCHIVOS) {
    if (!existsSync(join(dir, f)))
      err(r, `Falta el archivo obligatorio ${f}.`,
        f === 'tailwind.css' ? `Quémalo con: ${QUEMAR}`
          : f === 'README.md' ? 'Crea el README.md con la plantilla de la guía de organización (título, código y datos).'
            : `Crea ${f} en la carpeta del OVA. Los estilos van en estilos.css y todo el JavaScript en script.js.`);
  }
  // Los recursos del curso (bibliografía, rúbrica, mapa) no llevan logo.
  const llevaLogo = p.tipo !== 'recurso';
  if (llevaLogo && !existsSync(join(dir, 'img', 'logo.webp')))
    err(r, 'Falta el logo en img/logo.webp.', 'Copia el logo a img/logo.webp: el de CINTIA (logos/cintia.webp) en especializaciones, el del programa en maestrías y doctorados.');

  const html = leer(join(dir, 'index.html'));
  const css = existsSync(join(dir, 'estilos.css')) ? leer(join(dir, 'estilos.css')) : '';
  const js = existsSync(join(dir, 'script.js')) ? leer(join(dir, 'script.js')) : '';
  const tw = existsSync(join(dir, 'tailwind.css')) ? leer(join(dir, 'tailwind.css')) : '';
  const htmlLimpio = html.replace(/<!--[\s\S]*?-->/g, '');
  const codigo = htmlLimpio + '\n' + js;
  const titulo = tituloDe(html);

  // 5) Logo correcto según el nivel
  if (llevaLogo && hashCintia && existsSync(join(dir, 'img', 'logo.webp'))) {
    const esCintia = sha(join(dir, 'img', 'logo.webp')) === hashCintia;
    if (p.nivel === 'esp' && !esCintia)
      err(r, 'Las especializaciones llevan el logo de CINTIA, y img/logo.webp es otro.', 'Reemplaza img/logo.webp por una copia de logos/cintia.webp.');
    if ((p.nivel === 'mae' || p.nivel === 'doc') && esCintia)
      err(r, `Las ${p.nivel === 'mae' ? 'maestrías' : 'doctorados'} llevan el logo de su programa, y img/logo.webp es el de CINTIA.`,
        'Reemplaza img/logo.webp por el logo del programa.');
  }
  if (llevaLogo && !/src=["']img\/logo\.webp["']/.test(html))
    err(r, 'El index.html no muestra el logo desde img/logo.webp.', 'Cambia la ruta de la imagen del logo a src="img/logo.webp".');

  // 6) README
  const readme = existsSync(join(dir, 'README.md')) ? leer(join(dir, 'README.md')) : null;
  if (readme !== null) {
    const primera = (readme.split(/\r?\n/).find((l) => l.trim()) || '').replace(/^#\s*/, '').trim();
    const cod = codigoDe(p);
    if (!primera || /^\[/.test(primera))
      err(r, 'La primera línea del README.md no tiene el título.', `Escribe en la primera línea: # ${titulo || '<el mismo título del <title>>'}`);
    else if (titulo && primera !== titulo)
      err(r, `El título del README.md ("${primera}") no coincide con el <title> del index.html ("${titulo}").`,
        'Deja el mismo título en la primera línea del README.md y en la etiqueta <title>.');
    const mc = /\*\*C[óo]digo:\*\*\s*([a-z0-9-]+)/i.exec(readme);
    if (!mc)
      err(r, 'El README.md no tiene la línea del código del OVA.', `Agrega: **Código:** ${cod}`);
    else if (mc[1] !== cod && mc[1] !== `${p.nivel}-${cod}`)
      err(r, `El código del README.md (${mc[1]}) no corresponde a la ruta del OVA.`, `Según su carpeta, el código es ${cod}.`);
    if (/\[(Nombre completo del programa|Nombre completo del curso|AAAA-MM-DD|T[íi]tulo del tema[^\]]*)\]/.test(readme))
      warn(r, 'El README.md tiene campos de la plantilla sin completar (entre corchetes).', 'Completa la fecha y demás datos del README.md.');
  }

  // 7) Archivos separados: estilos.css, script.js y Tailwind quemado
  if (html.includes('cdn.tailwindcss.com'))
    err(r, 'El OVA carga Tailwind desde internet (cdn.tailwindcss.com). Ese servicio dejó de funcionar y el OVA se ve sin diseño.',
      `Borra el <script src="https://cdn.tailwindcss.com"> (y el bloque tailwind.config si lo hay), enlaza <link rel="stylesheet" href="tailwind.css"> y quémalo con: ${QUEMAR}`);
  const posTw = html.search(/<link[^>]+href=["']tailwind\.css["']/i);
  const posEst = html.search(/<link[^>]+href=["']estilos\.css["']/i);
  if (posTw < 0)
    err(r, 'El index.html no enlaza tailwind.css.', 'Agrega en el <head>: <link rel="stylesheet" href="tailwind.css">');
  if (posEst < 0)
    err(r, 'El index.html no enlaza estilos.css.', 'Agrega en el <head>, antes de tailwind.css: <link rel="stylesheet" href="estilos.css">');
  if (posTw >= 0 && posEst >= 0 && posTw < posEst)
    err(r, 'tailwind.css está enlazado antes que estilos.css. El OVA se diseñó con el CDN de Tailwind, que cargaba sus estilos al final; en este orden cambian botones, bordes y espacios.',
      'En el <head>, pon primero estilos.css y después tailwind.css.');
  const cssExtra = [...htmlLimpio.matchAll(/<link\b[^>]*rel=["']?stylesheet[^>]*>/gi)].map((m) => /href=["']([^"']+)["']/i.exec(m[0])?.[1])
    .filter((h) => h && !/^(https?:)?\/\//i.test(h) && !/^(\.\/)?(tailwind|estilos|iconos)\.css$/i.test(h));
  if (cssExtra.length)
    err(r, `El OVA carga estilos de otros archivos (${cssExtra.join(', ')}). Los estilos propios van todos en estilos.css.`,
      'Pasa el contenido de esos archivos a estilos.css, en el mismo orden, y borra sus <link> y los archivos.');
  const jsExtra = [...htmlLimpio.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/gi)].map((m) => m[1])
    .filter((s) => !/^(https?:)?\/\//i.test(s) && !/^(\.\/)?script\.js$/i.test(s));
  if (jsExtra.length)
    err(r, `El OVA carga JavaScript de otros archivos (${jsExtra.join(', ')}). Todo el JavaScript va en script.js.`,
      'Pasa el contenido de esos archivos a script.js, en el mismo orden en que se cargaban, y borra sus <script> y los archivos.');
  if (!/<script[^>]+src=["']script\.js["']/i.test(html))
    err(r, 'El index.html no carga script.js.', 'Agrega antes de </body>: <script src="script.js"></script>');
  const estilosEnLinea = (htmlLimpio.match(/<style[\s>]/gi) || []).length;
  if (estilosEnLinea)
    err(r, `El index.html tiene ${estilosEnLinea} bloque(s) <style>. Los estilos deben ir en estilos.css.`,
      'Mueve el contenido de cada <style> a estilos.css y borra el bloque del HTML.');
  const scriptsEnLinea = [...htmlLimpio.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter((m) => !/application\/ld\+json/i.test(m[1]) && m[2].trim());
  if (scriptsEnLinea.length)
    err(r, `El index.html tiene ${scriptsEnLinea.length} bloque(s) <script> con código. Todo el JavaScript debe ir en script.js.`,
      'Mueve el código de cada <script> a script.js (en el mismo orden) y deja solo <script src="script.js"></script>.');
  // Íconos: guardados en iconos.css, no desde internet.
  if (/<link\b[^>]*href=["'][^"']*font-?awesome[^"']*["']|<script\b[^>]*src=["'][^"']*(kit\.)?fontawesome/i.test(htmlLimpio))
    err(r, 'El OVA carga los íconos de Font Awesome desde internet. Si ese servicio falla o la red lo bloquea, los íconos desaparecen (incluidos los de los objetivos).',
      `Guarda los íconos en el OVA con: ${ICONOS.replace('<carpeta-del-ova>', r)}`);
  const usados = iconosUsados(codigo);
  if (usados.length) {
    const icss = existsSync(join(dir, 'iconos.css')) ? leer(join(dir, 'iconos.css')) : null;
    if (icss === null)
      err(r, `El OVA usa ${usados.length} ícono(s) de Font Awesome, pero no tiene iconos.css.`, `Genéralo con: ${ICONOS.replace('<carpeta-del-ova>', r)}`);
    else {
      if (!/<link[^>]+href=["']iconos\.css["']/i.test(html))
        err(r, 'El OVA tiene iconos.css, pero el index.html no lo enlaza.', 'Agrega en el <head>, antes de estilos.css: <link rel="stylesheet" href="iconos.css">');
      const faltan = usados.filter(({ nombre, estilo }) => !new RegExp(`\\.fa-${estilo === 'solid' ? '' : `${estilo}\\.fa-`}${nombre}[ ,{]`).test(icss)
        && !new RegExp(`(^|[\\s,])\\.fa-${nombre}[ ,{]`, 'm').test(icss));
      if (faltan.length)
        err(r, `Hay ${faltan.length} ícono(s) que el OVA usa pero no están guardados en iconos.css: ${faltan.map((f) => `fa-${f.nombre}`).join(', ')}. No se verán.`,
          `Vuelve a generar iconos.css con: ${ICONOS.replace('<carpeta-del-ova>', r)} (si alguno no es un ícono, cambia el nombre de esa clase para que no empiece por "fa-").`);
    }
  }
  if (tw && /id=["']ova-embed["']/.test(html) && !tw.includes('#ova-embed'))
    err(r, 'El OVA está hecho para incrustarse en el aula (#ova-embed), pero su tailwind.css se quemó sin esa configuración. Dentro del aula se verá distinto.',
      `Vuelve a quemarlo con: ${QUEMAR}`);
  if (tw && /tailwindcss v3\.\d+\.\d+/.test(tw) && tw.length > 2_000_000)
    warn(r, 'tailwind.css es muy grande: parece Tailwind completo y no solo las clases del OVA.', `Quémalo de nuevo con: ${QUEMAR}`);

  // 8) Plugin de accesibilidad
  const posElens = html.lastIndexOf(ELENS);
  if (posElens < 0)
    err(r, 'Falta el plugin de accesibilidad elens.js (lectura por voz, contraste, tamaño de letra), que es obligatorio.',
      `Agrega justo antes de </body>: <script src="${ELENS}"></script>`);
  else if (/<script/i.test(html.slice(posElens).replace(/^[\s\S]*?<\/script>/i, '')))
    warn(r, 'El plugin elens.js no es el último script del documento.', 'Muévelo para que quede justo antes de </body>.');
  if (/speechSynthesis|SpeechSynthesisUtterance/.test(codigo))
    warn(r, 'El OVA trae su propia lectura por voz (speechSynthesis), que se duplica con la de elens.js.', 'Quita los controles de voz propios.');

  // 9) Créditos CINTIA / Universidad de Córdoba, exactamente una vez
  const creditos = (html.replace(/\s+/g, ' ').match(/Centro de Innovaci(?:ó|o|&oacute;)n en TIC[^<]*CINTIA/gi) || []).length;
  if (creditos === 0)
    err(r, 'Falta el pie de página con los créditos de CINTIA y la Universidad de Córdoba.',
      'Copia el bloque <footer> de créditos de la plantilla (Centro de Innovación en TIC para el apoyo de la Docencia CINTIA – Universidad de Córdoba).');
  else if (creditos > 1)
    err(r, `El pie de página con los créditos de CINTIA está repetido ${creditos} veces.`, 'Deja un solo bloque de créditos, al final del OVA.');
  else if (!/Universidad de C(?:ó|o|&oacute;)rdoba/i.test(html))
    err(r, 'Los créditos mencionan a CINTIA pero falta "Universidad de Córdoba".', 'Agrega "Universidad de Córdoba" al bloque de créditos.');

  // 10) Las 7 secciones, en orden (solo los OVA de tema o de unidad)
  const pos = [];
  for (const s of esOva ? SECCIONES : []) {
    const m = new RegExp(`id=["'](${[].concat(s).join('|')})["']`).exec(html);
    if (!m) err(r, `Falta la sección obligatoria "${NOMBRE_SECCION(s)}".`,
      'Un OVA tiene 7 secciones: introduccion, objetivos, contenido, actividad (o actividades), evaluacion, recursos y bibliografia.');
    else pos.push(m.index);
  }
  if (pos.some((x, i) => i > 0 && x < pos[i - 1]))
    err(r, 'Las secciones no están en el orden correcto.', 'Ordénalas así: introducción → objetivos → contenido → actividad(es) → evaluación → recursos → bibliografía.');

  const sec = {
    intro: seccion(htmlLimpio, 'introduccion'),
    obj: seccion(htmlLimpio, 'objetivos'),
    cont: seccion(htmlLimpio, 'contenido'),
    act: seccion(htmlLimpio, ['actividad', 'actividades']),
    eval: seccion(htmlLimpio, 'evaluacion'),
    rec: seccion(htmlLimpio, 'recursos'),
    bib: seccion(htmlLimpio, 'bibliografia'),
  };

  // 11) Rutas relativas y archivos que existen
  for (const m of codigo.matchAll(/(["'(])((?:[A-Za-z]:\\|file:\/\/|\/Users\/|\/home\/)[^"')]*)/g))
    err(r, `Hay una ruta absoluta del computador de alguien: ${m[2].slice(0, 60)}`, 'Usa rutas relativas a la carpeta del OVA (ej: img/foto.png).');
  for (const ref of referenciasLocales(htmlLimpio, css)) {
    const destino = join(dir, decodeURI(ref).replace(/^\.\//, ''));
    if (!existsSync(destino))
      err(r, `El OVA usa "${ref}", pero ese archivo no existe en su carpeta.`, 'Agrega el archivo o corrige la ruta (recuerda que GitHub distingue mayúsculas de minúsculas).');
  }

  // 12) CINTIA 6 — enlaces externos en pestaña nueva
  for (const m of codigo.matchAll(/<a\b[^>]*href=["'](https?:\/\/[^"'\s]+)["']/gi)) {
    if (m[1].includes('${')) continue;
    if (!enlacesPorUrl.has(m[1])) enlacesPorUrl.set(m[1], new Set());
    enlacesPorUrl.get(m[1]).add(r);
  }
  const sinPestana = [...codigo.matchAll(/<a\b[^>]*href=["'](https?:\/\/[^"']+)["'][^>]*>/gi)].filter((m) => !/target=["']_blank["']/i.test(m[0]));
  if (sinPestana.length)
    err(r, `${sinPestana.length} enlace(s) externo(s) no abren en pestaña nueva y sacarían al estudiante del aula virtual (ej: ${sinPestana[0][1].slice(0, 70)}).`,
      'Agrega target="_blank" rel="noopener" a cada enlace externo.');

  // 13) CINTIA 5 — QR locales de al menos 2 × 2 cm
  if (codigo.includes('api.qrserver.com') || /chart\.googleapis\.com\/chart\?[^"']*cht=qr/.test(codigo))
    err(r, 'Los códigos QR se generan desde internet (api.qrserver.com). Deben ser imágenes guardadas en el OVA.',
      'Genera cada QR como imagen PNG en img/ (ej: img/qr-01.png) y cambia el src de cada uno.');
  for (const m of htmlLimpio.matchAll(/<img\b[^>]*src=["']([^"']*qr[^"']*)["'][^>]*>/gi)) {
    const ancho = anchoPx(m[0]);
    if (ancho !== null && ancho < 75)
      err(r, `El QR "${m[1]}" mide unos ${(ancho / 37.8).toFixed(1)} cm; el mínimo es 2 × 2 cm.`, 'Dale un tamaño de al menos 2 cm: style="width:2cm;height:2cm".');
  }

  // 14) CINTIA 7 — videos con subtítulos
  for (const m of htmlLimpio.matchAll(/<video\b[\s\S]*?<\/video>/gi)) {
    if (!/<track\b[^>]*kind=["'](captions|subtitles)["']/i.test(m[0]))
      err(r, 'Hay un video sin subtítulos (<track kind="captions">).', 'Agrega subtítulos propios y sincronizados (un archivo .vtt) con <track kind="captions" src="…" srclang="es" label="Español" default>.');
  }
  if (/<video\b/i.test(htmlLimpio) && !/transcripci[oó]n|<a\b[^>]*download/i.test(htmlLimpio))
    warn(r, 'Hay un video sin enlace de descarga ni transcripción.', 'Agrega la transcripción o un botón de descarga del video, como pide la tabla del equipo pedagógico.');
  if (/<iframe\b[^>]*src=["'][^"']*(youtube\.com|youtu\.be|vimeo\.com)/i.test(htmlLimpio))
    warn(r, 'Hay un video incrustado de YouTube o Vimeo. No se puede comprobar automáticamente si sus subtítulos son propios y sincronizados.',
      'Revisa a mano que tenga subtítulos editados (no autogenerados) y transcripción o audiodescripción.');

  // 15) CINTIA 8 — el PDF descargable es para el eFlip, que no forma parte del
  //     OVA. Las tarjetas giratorias del OVA no exigen PDF: no se valida aquí.

  // 16) Autoevaluación: de 3 a 10 preguntas, con retroalimentación (solo OVA de tema o de unidad)
  const q = esOva ? contarPreguntas(codigo, sec.eval) : { hay: true, n: 0 };
  if (!esOva) { /* los complementos y los recursos no llevan autoevaluación */ }
  else if (!q.hay)
    err(r, 'No se encontró la autoevaluación (ni un arreglo de preguntas en script.js ni respuestas marcadas en la sección de evaluación).',
      'Implementa la autoevaluación con las preguntas de la guía: entre 3 y 10, una por página.');
  else if (q.n > 0 && q.n < 3)
    err(r, `La autoevaluación tiene ${q.n} pregunta(s). El mínimo es 3.`, 'Agrega preguntas hasta llegar a 3.');
  else if (q.n > 10)
    err(r, `La autoevaluación tiene ${q.n} preguntas. El máximo es 10.`, 'Deja como máximo 10 preguntas.');
  if (esOva && q.hay && /\b(?:question|pregunta|prompt|enunciado)\s*:/.test(codigo)
      && !/\b(?:explicaci[oó]n|explanation|retroalimentaci[oó]n|feedback|justificaci[oó]n|argumento)\s*:/i.test(codigo))
    warn(r, 'Las preguntas de la autoevaluación no traen una explicación de por qué cada opción es correcta o incorrecta.',
      'Agrega a cada pregunta (o a cada opción) un texto de retroalimentación que explique la respuesta correcta y los distractores.');

  // 17) Objetivos: verbos de orden superior e íconos
  if (esOva && sec.obj) {
    const verbos = [...aTexto(sec.obj).matchAll(/(?:^|[.:;•\-–>\s])([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:ar|er|ir))\b/g)].map((m) => m[1]);
    const bajos = [...new Set(verbos.filter((v) => VERBOS_BAJOS.test(v)))];
    if (!verbos.some((v) => VERBOS_SUPERIORES.test(v)))
      warn(r, 'Los objetivos no parecen redactarse con verbos en infinitivo de orden superior (taxonomía SOLO).',
        'Inicia cada objetivo con un verbo como Analizar, Aplicar, Diseñar, Evaluar, Argumentar o Proponer.');
    if (bajos.length)
      warn(r, `Los objetivos usan verbos de nivel bajo en la taxonomía SOLO: ${bajos.join(', ')}.`,
        'En posgrado se piden verbos de orden superior (relacional o abstracto ampliado): Analizar, Diseñar, Evaluar, Proponer…');
    if (!/<i\b[^>]*class=["'][^"']*\b(fa|fa-[a-z]+|bi|material-icons)\b|<svg\b|<img\b/i.test(sec.obj))
      warn(r, 'Los objetivos no tienen íconos.', 'Agrega a cada cuadro de meta un ícono que represente la competencia.');
  }

  // 18) Actividades: bordes visibles (1.5 a 2 pt ≈ 2 px o más). En la evaluación
  //     de la unidad (diagnóstico, actividades), toda la página cuenta.
  const actividades = p.tipo === 'complemento' ? htmlLimpio.replace(/<footer[\s\S]*?<\/footer>/gi, '') : esOva ? sec.act : '';
  if (actividades) {
    const clases = clasesDe(actividades);
    const grueso = [...clases].some((c) => /^border(?:-[lrtbxy])?-(2|4|8)$/.test(c) || /^border(?:-[lrtbxy])?-\[(\d+(?:\.\d+)?)px\]$/.test(c) && parseFloat(c.match(/\[(\d+(?:\.\d+)?)px\]/)[1]) >= 2)
      || /border(?:-(?:left|right|top|bottom))?(?:-width)?\s*:\s*(?:[2-9]|\d{2,})(?:\.\d+)?px/i.test(actividades)
      || bordeGruesoEnCss(css, clases);
    if (!grueso)
      warn(r, 'Las cajas de actividad parecen tener bordes de menos de 2 px, que se pierden en baja visión.',
        'Dales bordes de 1.5 a 2 pt (2 a 3 px) con buen contraste, por ejemplo border-2 o border: 2px solid.');
  }

  // 19) Navegación con teclado (lo que se puede detectar sin abrir el OVA)
  const clicNoBoton = [...htmlLimpio.matchAll(/<(div|span|li|p|img|section|article|h\d)\b[^>]*\sonclick=/gi)]
    .filter((m) => !/tabindex=|role=["']button["']/i.test(m[0]));
  if (clicNoBoton.length)
    warn(r, `${clicNoBoton.length} elemento(s) <${clicNoBoton[0][1]}> responden al clic pero no se pueden usar con el teclado.`,
      'Usa <button> para todo lo que se pueda pulsar, o agrega tabindex="0" y role="button".');
  if (/tabindex=["']?[1-9]/i.test(htmlLimpio))
    warn(r, 'Hay elementos con tabindex mayor que 0, que alteran el orden lógico al navegar con Tab.', 'Usa tabindex="0" o quita el atributo.');
  if (!/:focus/.test(css + htmlLimpio) && !/\bfocus(-visible)?:/.test(htmlLimpio + js))
    warn(r, 'No hay estilos de foco: al navegar con Tab no se ve dónde está el estudiante.',
      'Agrega en estilos.css un estilo visible para el foco, por ejemplo: #ova-embed :focus-visible { outline: 3px solid #1d4ed8; outline-offset: 2px; }');
  if (/acorde[oó]n|accordion|collaps|toggle|flip-?card|act-tab|tab-btn|role=["']tab["']/i.test(htmlLimpio + js) && !/aria-expanded|aria-selected/i.test(codigo))
    warn(r, 'Hay acordeones, pestañas o tarjetas que se abren, pero ningún aria-expanded ni aria-selected.',
      'Indica en cada botón si su contenido está abierto (aria-expanded="true"/"false") y, al abrirlo, mueve el foco al contenido.');
  if (!/\.focus\(/.test(js) && /content-pane|tab-panel|act-panel|showSection|mostrarSeccion/i.test(htmlLimpio + js))
    warn(r, 'Al cambiar de sección o de pestaña, el foco no se traslada al contenido nuevo.',
      'Después de mostrar la sección, llama a .focus() sobre su título (con tabindex="-1").');

  // 20) Recursos y bibliografía
  if (esOva && sec.rec) {
    if (!/<img\b[^>]*src=["'][^"']*qr/i.test(sec.rec))
      warn(r, 'La sección Recursos no tiene códigos QR.', 'Agrega a cada recurso su QR local de 2 × 2 cm (img/qr-*.png).');
  }
  // En la página de bibliografía del curso, las referencias pueden estar en el HTML o en script.js.
  const bib = esOva ? sec.bib : p.recurso === 'bibliografia' ? htmlLimpio.replace(/<footer[\s\S]*?<\/footer>/gi, '') + '\n' + js : '';
  if (bib) {
    const textoBib = aTexto(bib).replace(/^.*?Bibliograf[íi]a|^.*?Referencias/i, '').trim();
    if (textoBib.length < 40)
      err(r, 'La sección Bibliografía está vacía o casi vacía.', 'Agrega las referencias de la guía: autor, año, título y enlace.');
    else if (!/\b(19|20)\d{2}\b/.test(textoBib))
      warn(r, 'Las referencias de la bibliografía no tienen año.', 'Cada fuente lleva autor, año y título.');
  }

  // 21) Encabezado, tipografía, relleno y dependencias externas
  if (!titulo) err(r, 'El index.html no tiene <title>.', 'Agrega <title> con el título (el mismo de la primera línea del README.md).');
  if (!/<h1\b/i.test(htmlLimpio))
    warn(r, 'La página no tiene un título principal <h1>.', esOva ? 'El encabezado de bienvenida debe mostrar el nombre de la unidad y el tema en un <h1>.' : 'Muestra el título de la página en un <h1>.');
  if (!/Poppins/i.test(html + css))
    warn(r, 'No se usa la tipografía Poppins de la plantilla.', "Carga Poppins (Google Fonts) y aplícala con font-family: 'Poppins', sans-serif.");
  const RELLENO = /(lorem ipsum|\bFIXME\b|\[TODO\]|\[por completar\]|pendiente de contenido|contenido pendiente)/i;
  if (RELLENO.test(htmlLimpio))
    err(r, 'El OVA tiene texto de relleno sin completar (ej: "Lorem ipsum", "[TODO]").', 'Reemplázalo por el contenido real.');
  const externos = [...new Set([...htmlLimpio.matchAll(/<(?:script|link)\b[^>]*(?:src|href)=["']((?:https?:)?\/\/[^"']+)["']/gi)]
    .map((m) => m[1]).filter((u) => !PERMITIDOS_EXTERNOS.test(u) && !u.includes('cdn.tailwindcss.com') && !/font-?awesome/i.test(u))
    .map((u) => u.replace(/^(https?:)?\/\//, '').split('/')[0]))];
  if (externos.length)
    warn(r, `El OVA depende de servicios externos que podrían dejar de funcionar, como pasó con el CDN de Tailwind: ${externos.join(', ')}.`,
      'Si es posible, guarda esos archivos en la carpeta del OVA.');
}

// 22) Un curso usa un solo tipo: o todo por tema, o todo por unidad
for (const [curso, mapa] of tiposPorCurso) {
  const tipos = new Set(mapa.values());
  if (tipos.size > 1)
    for (const [r, t] of mapa)
      err(r, `El curso ${curso} mezcla OVA por tema y OVA por unidad (este es por ${t}).`,
        'Un curso usa un solo tipo para todas sus unidades: o todos sus OVA van en uNN/tNN/, o todos en uNN/.');
}

// 22b) Todo curso tiene bibliografía y rúbrica. Es una advertencia: los OVA de un
//      curso se suben de a uno y estos recursos pueden llegar después.
const todos = encontrarOvas(ROOT).map((d) => partesRuta(rel(ROOT, d))).filter(Boolean);
for (const curso of new Set(ovas.map((d) => partesRuta(rel(ROOT, d))).filter(Boolean).map((x) => `${x.nivel}/${x.programa}/${x.curso}`))) {
  const tiene = new Set(todos.filter((x) => `${x.nivel}/${x.programa}/${x.curso}` === curso && x.recurso).map((x) => x.recurso));
  const faltan = RECURSOS_OBLIGATORIOS.filter((x) => !tiene.has(x));
  if (faltan.length)
    warn(curso, `El curso todavía no tiene ${faltan.map((x) => RECURSOS[x].toLowerCase()).join(' ni ')}, ${faltan.length > 1 ? 'que son obligatorias' : 'que es obligatoria'}.`,
      `Súbelas en ${faltan.map((x) => `${curso}/${x}/`).join(' y ')} (si el curso tiene una rúbrica por unidad, van todas en la misma página).`);
}

// 23) CINTIA 5 — los enlaces externos funcionan (llevan al recurso).
//     Necesita internet: en GitHub Actions siempre la hay. Para saltarlo en un
//     equipo sin conexión: node scripts/validar-ova.mjs --sin-enlaces
//     Solo bloquea cuando el enlace está roto sin duda (404, 410 o un sitio que
//     no existe). Si el sitio no deja comprobarlo (403, tiempo agotado…), avisa.
async function probar(url) {
  const intento = async (method) => {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 15000);
    try {
      const res = await fetch(url, {
        method, redirect: 'follow', signal: ctrl.signal,
        headers: { 'user-agent': 'Mozilla/5.0 (validador de OVA de posgrado; Universidad de Cordoba)', accept: 'text/html,*/*' },
      });
      return { status: res.status };
    } catch (e) {
      return { error: e.cause?.code || (e.name === 'AbortError' ? 'TIEMPO' : e.message) };
    } finally { clearTimeout(t); }
  };
  let r = await intento('HEAD');
  if (r.error || r.status >= 400) r = await intento('GET');
  return r;
}

if (!process.argv.includes('--sin-enlaces') && enlacesPorUrl.size) {
  const urls = [...enlacesPorUrl.keys()];
  const resultados = new Map();
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(6, urls.length) }, async () => {
    while (i < urls.length) { const u = urls[i++]; resultados.set(u, await probar(u)); }
  }));
  // Si ni siquiera responde GitHub, el problema es la conexión, no los enlaces.
  const control = await probar('https://github.com');
  const sinRed = Boolean(control.error) || [...resultados.values()].every((x) => x.error);
  if (sinRed) {
    console.warn(`ℹ️  No se pudieron comprobar los ${urls.length} enlaces externos (parece que no hay conexión a internet). En GitHub se comprueban al abrir el PR.`);
  } else {
    for (const [u, res] of resultados) {
      for (const r of enlacesPorUrl.get(u)) {
        if (res.status === 404 || res.status === 410)
          err(r, `El enlace ${u} está roto (la página no existe: error ${res.status}).`, 'Busca la dirección correcta del recurso y actualiza el enlace y su código QR.');
        else if (res.error === 'ENOTFOUND')
          err(r, `El enlace ${u} lleva a un sitio que no existe.`, 'Revisa que la dirección esté bien escrita; actualiza el enlace y su código QR.');
        else if (res.error || res.status >= 400)
          warn(r, `No se pudo confirmar que el enlace ${u} funcione (${res.error ? `error ${res.error}` : `el sitio respondió ${res.status}`}).`,
            'Ábrelo en el navegador: si funciona, no hay que hacer nada; si no, actualiza el enlace y su código QR.');
      }
    }
  }
}

// --- Resultados -----------------------------------------------------------
const errores = problemas.filter((x) => x.nivel === 'error');
const avisos = problemas.filter((x) => x.nivel === 'aviso');
const bloque = (x) => `  ${x.nivel === 'error' ? '❌' : '⚠️ '} ${x.ova}\n     Problema:      ${x.que}\n     Cómo corregir: ${x.arreglo}`;

if (avisos.length) {
  console.warn(`\n⚠️  ${avisos.length} advertencia(s) (no bloquean el PR, pero conviene revisarlas):\n`);
  console.warn(avisos.map(bloque).join('\n\n'));
}
if (errores.length) {
  console.error(`\n🚫 Validación FALLIDA — ${errores.length} error(es) que impiden fusionar el Pull Request:\n`);
  console.error(errores.map(bloque).join('\n\n'));
  console.error('\n📖 Reglas completas en CONTRIBUTING.md.');
}

if (problemas.some((x) => x.ova.split('/').length !== 3)) {
  const porOva = new Map();
  // Los avisos del curso (falta la rúbrica…) no son cambios dentro de un OVA.
  for (const x of problemas) { if (x.ova.split('/').length === 3) continue; if (!porOva.has(x.ova)) porOva.set(x.ova, []); porOva.get(x.ova).push(x); }
  console.log('\n' + '═'.repeat(70));
  console.log('📋 PARA CORREGIR CON UN AGENTE DE IA');
  console.log('Copia el bloque del OVA que quieras arreglar y pégalo en tu agente de IA.');
  console.log('Luego vuelve a correr:  node scripts/validar-ova.mjs');
  console.log('═'.repeat(70) + '\n');
  for (const [ova, items] of porOva) {
    console.log(`── OVA: ${ova} ──`);
    console.log(`Eres un asistente que edita un Objeto Virtual de Aprendizaje (OVA) de posgrado. Trabaja en la carpeta "${ova}". ` +
      'Corrige EXACTAMENTE los puntos de abajo, sin cambiar nada más y respetando las reglas de CONTRIBUTING.md:');
    items.forEach((x, i) => console.log(`${i + 1}. ${x.nivel === 'error' ? '[CORREGIR OBLIGATORIO]' : '[Recomendado]'} ${x.que}\n   Solución: ${x.arreglo}`));
    console.log(`Al terminar, si cambiaste clases de Tailwind o íconos, vuelve a generar sus archivos con: ${QUEMAR.replace('<carpeta-del-ova>', ova)} y ${ICONOS.replace('<carpeta-del-ova>', ova)}\n`);
  }
}

if (errores.length) process.exit(1);
console.log(avisos.length
  ? `✅ Validación OK — ${ovas.length} OVA cumplen las reglas obligatorias (con ${avisos.length} advertencia(s)).`
  : `✅ Validación OK — ${ovas.length} OVA cumplen todas las reglas.`);
