#!/usr/bin/env node
/**
 * Migra un OVA de posgrado tal como está hoy a la estructura del repositorio.
 *
 * Uso (parado en la raíz del repositorio):
 *
 *   node scripts/migrar-ova.mjs <carpeta-del-ova-original> <ruta-destino> [opciones]
 *
 * La ruta destino dice qué es:
 *   esp/gthdo/pobh/u02/t03         OVA del tema 3 de la unidad 2
 *   esp/gthdo/pobh/u02/diagnostico OVA complementarios de la unidad 2: diagnostico o actividades
 *   esp/gthdo/pobh/bibliografia    recursos del curso: bibliografia, rubrica o mapa
 *
 *   node scripts/migrar-ova.mjs "C:\Users\usuario\Documents\Tema3" esp/gthdo/pobh/u02/t03 ^
 *        --programa "Gerencia del Talento Humano y Desarrollo Organizacional" ^
 *        --curso "Psicología Organizacional y Bienestar Humano" ^
 *        --responsable "Nombre Apellido"
 *
 * Opciones:
 *   --programa "…"     Nombre completo del programa (solo si aún no está en catalogo.csv)
 *   --curso "…"        Nombre completo del curso (solo si aún no está en catalogo.csv)
 *   --responsable "…"  Quién registra el curso en el catálogo
 *   --fecha AAAA-MM-DD Fecha de carga (por defecto, hoy)
 *   --reemplazar       Sobrescribe la carpeta destino si ya existe
 *
 * Qué hace, sin tocar la carpeta original:
 *   1. Separa los <style> en estilos.css y los <script> en script.js.
 *   2. Quita el CDN de Tailwind y quema tailwind.css con solo las clases del OVA
 *      (conservando la configuración de #ova-embed si el OVA la usa).
 *   3. Convierte los QR de api.qrserver.com en imágenes locales img/qr-NN.png.
 *   4. Pasa las imágenes a img/ con nombres válidos; el logo queda en img/logo.webp
 *      (en especializaciones, el de CINTIA: logos/cintia.webp).
 *   5. Guarda en iconos.css los íconos de Font Awesome que usa (sin internet).
 *   6. Agrega el plugin de accesibilidad elens.js si falta, y la navegación con
 *      teclado (foco visible, aria-expanded, foco al contenido nuevo, tarjetas
 *      y pestañas con Enter y flechas) con las plantillas de scripts/accesibilidad/.
 *   7. Hace que los enlaces externos abran en pestaña nueva.
 *   8. Crea el README.md y, si hace falta, registra el curso en catalogo.csv.
 *   9. Valida el resultado.
 *
 * Deja fuera los archivos de Office (la guía del curso, el formato 088…).
 * Requiere Node.js y, para los QR, haber ejecutado una vez: npm install
 */

import { readdirSync, statSync, existsSync, mkdirSync, writeFileSync, copyFileSync, rmSync, appendFileSync } from 'node:fs';
import { join, extname, basename, dirname, resolve, posix } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  NIVELES, SIGLA_PROGRAMA, SIGLA_CURSO, UNIDAD, TEMA, RECURSOS, COMPLEMENTOS,
  leer, rel, partesRuta, codigoDe, leerCatalogo, buscarEnCatalogo, tituloDe,
} from './comun.mjs';
import { quemarTailwind } from './quemar-tailwind.mjs';
import { guardarIconos } from './guardar-iconos.mjs';

const ROOT = process.cwd();
const ELENS = '<script src="https://elens.ecodestudio.dev/elens.js"></script>';
const IMAGENES = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.avif']);
const OFFICE = new Set(['.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx']);
const DOCUMENTOS = new Set(['.txt', '.pdf', '.md', '.zip', '.rar', '.rtf', '.odt']);

// --- Argumentos -----------------------------------------------------------
const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
const posicionales = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--') && args[i - 1] !== '--reemplazar'));
const [origen, destinoRel] = posicionales;

const salir = (msg) => { console.error(`❌ ${msg}`); process.exit(1); };
if (!origen || !destinoRel)
  salir('Uso: node scripts/migrar-ova.mjs <carpeta-del-ova-original> <ruta-destino> [--programa "…"] [--curso "…"]');
if (!existsSync(join(origen, 'index.html'))) salir(`No hay index.html en "${origen}".`);

const destinoNorm = destinoRel.replace(/\\/g, '/').replace(/^\.\//, '').replace(/\/$/, '');
const p = partesRuta(destinoNorm);
if (!p) salir(`La ruta destino "${destinoRel}" debe ser nivel/programa/curso/uNN/tNN, …/uNN/${Object.keys(COMPLEMENTOS).join('|')} o …/${Object.keys(RECURSOS).join('|')}.`);
if (!NIVELES[p.nivel]) salir(`El nivel "${p.nivel}" debe ser esp, mae o doc.`);
if (!SIGLA_PROGRAMA.test(p.programa)) salir(`La sigla del programa "${p.programa}" debe tener de 2 a 5 letras minúsculas.`);
if (!SIGLA_CURSO.test(p.curso)) salir(`La sigla del curso "${p.curso}" debe tener de 2 a 4 letras minúsculas (y, si el curso va en secuencia, un número al final: mi1).`);
if (p.tipo !== 'recurso' && !UNIDAD.test(p.unidad))
  salir(`"${p.unidad}" debe ser una unidad (u + dos dígitos: u01) o un recurso del curso (${Object.keys(RECURSOS).join(', ')}).`);
if (p.tema && !TEMA.test(p.tema)) salir(`"${p.tema}" debe ser un tema (t + dos dígitos: t01) o un complemento de la unidad (${Object.keys(COMPLEMENTOS).join(', ')}).`);

const destino = join(ROOT, destinoNorm);
if (existsSync(destino)) {
  if (!args.includes('--reemplazar')) salir(`Ya existe "${destinoNorm}". Usa --reemplazar para sobrescribirla.`);
  rmSync(destino, { recursive: true, force: true });
}

// --- Catálogo -------------------------------------------------------------
const hoy = opt('fecha') || new Date().toISOString().slice(0, 10);
const cat = leerCatalogo(ROOT);
if (cat.error) salir(cat.error);
let nombres = buscarEnCatalogo(cat.filas, p);
let filaNueva = null;
if (!nombres.programa || !nombres.curso) {
  const prog = nombres.programa || opt('programa');
  const cur = opt('curso');
  if (!prog || !cur)
    salir(`El curso ${p.nivel}/${p.programa}/${p.curso} no está en catalogo.csv. Pasa sus nombres con --programa "…" y --curso "…" para registrarlo.`);
  const q = (s) => (/[",]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);
  filaNueva = [p.nivel, p.programa, q(prog), p.curso, q(cur), hoy, q(opt('responsable') || '')].join(',');
  nombres = { programa: prog, curso: cur };
}

// --- Leer el OVA original -------------------------------------------------
const avisos = [];
const hechos = [];
let html = leer(join(origen, 'index.html'));

// Algunos OVA ya tenían los estilos y el JavaScript en archivos aparte
// (css/styles.css, js/script.js…). Esos archivos se reúnen en estilos.css y
// script.js, en el mismo orden en que los cargaba la página, y no se copian.
const consumidos = new Set();
const esLocal = (u) => !/^(https?:)?\/\//i.test(u) && !/^(data|blob|javascript):/i.test(u);
const rutaLocal = (u) => decodeURI(u.split('#')[0].split('?')[0]).replace(/^\.\//, '');
/** Las url(…) de un CSS que estaba en una subcarpeta pasan a ser relativas a la raíz del OVA. */
const reubicarUrls = (texto, carpeta) => (carpeta === '.' ? texto : texto.replace(/url\(\s*(["']?)([^"')]+)\1\s*\)/g, (todo, q, u) =>
  (esLocal(u) && !u.startsWith('/') && !u.startsWith('#') ? `url(${q}${posix.normalize(posix.join(carpeta, u))}${q})` : todo)));

// 1) Sacar los <script> en línea o locales (antes que los <style>: algunos
//    scripts llevan "<style>" o "</body>" dentro de sus textos).
const scripts = [];
let configTailwind = false;
html = html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (todo, attrs, cuerpo) => {
  const src = /\bsrc=["']([^"']+)["']/i.exec(attrs)?.[1];
  let codigo = cuerpo;
  if (src) {
    if (!esLocal(src)) return todo;
    const r = rutaLocal(src);
    if (!existsSync(join(origen, r))) return todo;
    consumidos.add(r);
    codigo = leer(join(origen, r));
  } else if (/application\/ld\+json/i.test(attrs) || !cuerpo.trim()) return todo;
  if (/^\s*tailwind\.config\s*=/.test(codigo)) { configTailwind = true; return ''; }
  scripts.push(codigo.replace(/^\n/, '').replace(/\s+$/, ''));
  return `<!--@@SCRIPT${scripts.length - 1}@@-->`;
});

// 2) Sacar los <style> y las hojas de estilo locales.
const estilos = [];
html = html.replace(/<style[^>]*>([\s\S]*?)<\/style>|<link\b[^>]*>/gi, (todo, cuerpo) => {
  let texto = cuerpo;
  if (cuerpo === undefined) {
    if (!/rel=["']?stylesheet/i.test(todo)) return todo;
    const href = /href=["']([^"']+)["']/i.exec(todo)?.[1];
    if (!href || !esLocal(href)) return todo;
    const r = rutaLocal(href);
    if (/^(tailwind|iconos)\.css$/i.test(r)) { consumidos.add(r); return ''; } // se vuelven a generar
    if (!existsSync(join(origen, r))) return todo;
    consumidos.add(r);
    texto = reubicarUrls(leer(join(origen, r)), posix.dirname(r));
  }
  estilos.push(texto.replace(/^\n/, '').replace(/\s+$/, ''));
  return estilos.length === 1 ? '<!--@@ESTILOS@@-->' : '';
});

// 3) Tailwind: CDN fuera, archivo local dentro.
//    El CDN inyectaba sus estilos al FINAL del <head>, después de los estilos
//    propios. Para que el OVA se vea igual, tailwind.css se carga después de
//    estilos.css (si se invierte el orden, cambian botones y bordes).
const teniaCdn = /<script[^>]*src=["']https:\/\/cdn\.tailwindcss\.com[^"']*["'][^>]*>\s*<\/script>/i.test(html);
html = html.replace(/[ \t]*<script[^>]*src=["']https:\/\/cdn\.tailwindcss\.com[^"']*["'][^>]*>\s*<\/script>\s*\n?/gi, '');
html = html.replace(/[ \t]*<link[^>]+href=["'](tailwind|estilos)\.css["'][^>]*>\s*\n?/gi, '');
const enlacesCss = '<link rel="stylesheet" href="estilos.css">\n    <link rel="stylesheet" href="tailwind.css">';
if (html.includes('<!--@@ESTILOS@@-->')) html = html.replace('<!--@@ESTILOS@@-->', enlacesCss);
else html = html.replace(/<\/head>/i, `    ${enlacesCss}\n</head>`);
if (teniaCdn) hechos.push('Quité el CDN de Tailwind' + (configTailwind ? ' y su configuración en línea (se conserva al quemar)' : '') + '.');
if (estilos.length) hechos.push(`Reuní ${estilos.length} bloque(s) de estilos en estilos.css.`);
const reunidos = [...consumidos].filter((r) => !/^(tailwind|iconos|estilos)\.css$|^script\.js$/i.test(r));
if (reunidos.length) hechos.push(`Los archivos ${reunidos.join(', ')} quedaron dentro de estilos.css y script.js.`);

// 4) Scripts: todo a script.js, cargado donde estaba el último.
if (scripts.length) {
  const ultimo = scripts.length - 1;
  for (let i = 0; i < scripts.length; i++)
    html = html.replace(`<!--@@SCRIPT${i}@@-->`, i === ultimo ? '<script src="script.js"></script>' : '');
  hechos.push(`Reuní ${scripts.length} bloque(s) de JavaScript en script.js.`);
  if (scripts.length > 1) avisos.push('Había varios <script> en distintos lugares; quedaron juntos en script.js. Revisa que todo funcione igual.');
}
let js = scripts.join('\n\n');
let css = estilos.join('\n\n');
if (!/<script[^>]+src=["']script\.js["']/i.test(html)) html = html.replace(/<\/body>(?![\s\S]*<\/body>)/i, '<script src="script.js"></script>\n</body>');

// --- Archivos del OVA original --------------------------------------------
const slug = (nombre) => nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  .replace(/ñ/g, 'n').replace(/[^a-z0-9.]+/g, '-').replace(/-+/g, '-').replace(/^-|-(?=\.)|-$/g, '');

const otrosOva = [];
function listarArchivos(dir, base = dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.')) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      // Una subcarpeta con su propio index.html es otro OVA (por ejemplo, un tema
      // dentro de la carpeta de la unidad): no se copia dentro de este.
      if (existsSync(join(full, 'index.html'))) { otrosOva.push(rel(base, full)); continue; }
      listarArchivos(full, base, acc);
    }
    else acc.push(rel(base, full));
  }
  return acc;
}

const copias = new Map(); // ruta original → ruta nueva
const dejados = [];
for (const r of listarArchivos(origen)) {
  if (r === 'index.html') continue;
  const ext = extname(r).toLowerCase();
  if (OFFICE.has(ext)) { dejados.push(r); continue; }
  if (consumidos.has(r)) continue;
  // Documentos de trabajo (la guía o el 088 en .txt o .pdf, notas, comprimidos) que el OVA
  // no usa: no van al repositorio. Si el OVA sí los enlaza, se copian.
  if (DOCUMENTOS.has(ext) && !`${html}\n${css}\n${js}`.includes(basename(r))) { dejados.push(r); continue; }
  if (ext === '.js' && /^\s*tailwind\.config\s*=/.test(leer(join(origen, r)))) { dejados.push(r); continue; } // su configuración se aplica al quemar
  if (/^(estilos\.css|script\.js|tailwind\.css|iconos\.css|readme\.md)$/i.test(r)) continue;
  if (/\.html?$/i.test(ext)) {
    if (/(original|backup|respaldo|copia|antiguo|old|viejo)/i.test(r)) { dejados.push(r); continue; }
    avisos.push(`El OVA trae otra página además de index.html (${r}). Revisa si se usa; si es una copia, bórrala.`);
  }
  const partes = r.split('/').map(slug);
  let nuevo = partes.join('/');
  if (IMAGENES.has(ext) && partes[0] !== 'img') nuevo = `img/${partes[partes.length - 1]}`;
  copias.set(r, nuevo);
}

/** Cambia una referencia exacta ("x", 'x', (x), ./x) en HTML, CSS y JS. */
function cambiarRef(viejo, nuevo) {
  const esc = viejo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(["'(=\`])(\\./)?${esc}(["')\`\\s>])`, 'g');
  html = html.replace(re, `$1${nuevo}$3`);
  css = css.replace(re, `$1${nuevo}$3`);
  js = js.replace(re, `$1${nuevo}$3`);
}

// El logo: en especializaciones, siempre el de CINTIA.
const logoCintia = join(ROOT, 'logos', 'cintia.webp');
const logoOriginal = [...copias.keys()].find((r) => /(^|\/)logo[^/]*\.(webp|png|jpe?g|svg)$/i.test(r));
if (logoOriginal && p.tipo === 'recurso') {
  // Los recursos del curso (bibliografía, rúbrica, mapa) no llevan logo.
  copias.delete(logoOriginal); dejados.push(logoOriginal);
  avisos.push('Los recursos del curso no llevan logo y no lo copié: quita del index.html la imagen del logo (y el bloque que la contiene).');
} else if (logoOriginal) { copias.set(logoOriginal, 'img/logo.webp'); }

mkdirSync(join(destino, 'img'), { recursive: true });
for (const [viejo, nuevo] of copias) {
  // En especializaciones el logo siempre se reemplaza por el de CINTIA (webp),
  // así que el formato del original no importa.
  if (nuevo === 'img/logo.webp' && p.nivel !== 'esp' && extname(viejo).toLowerCase() !== '.webp') {
    avisos.push(`El logo original (${viejo}) no es .webp; conviértelo a webp y guárdalo como img/logo.webp.`);
    copias.set(viejo, `img/${slug(basename(viejo))}`);
  }
}
for (const [viejo, nuevo] of copias) {
  mkdirSync(dirname(join(destino, nuevo)), { recursive: true });
  copyFileSync(join(origen, viejo), join(destino, nuevo));
  if (viejo !== nuevo) cambiarRef(viejo, nuevo);
}
const movidas = [...copias].filter(([a, b]) => a !== b);
if (movidas.length) hechos.push(`Pasé ${movidas.length} archivo(s) a su lugar: ${movidas.map(([a, b]) => `${a} → ${b}`).join(', ')}.`);

if (p.tipo === 'recurso') {
  // Los recursos del curso (bibliografía, rúbrica, mapa) no llevan logo.
} else if (p.nivel === 'esp') {
  if (!existsSync(logoCintia)) avisos.push('No encontré logos/cintia.webp en el repositorio para poner el logo de CINTIA.');
  else {
    copyFileSync(logoCintia, join(destino, 'img', 'logo.webp'));
    if (!logoOriginal) hechos.push('Agregué el logo de CINTIA en img/logo.webp.');
  }
} else if (!existsSync(join(destino, 'img', 'logo.webp'))) {
  avisos.push('Falta el logo del programa: guárdalo como img/logo.webp.');
}

// --- QR locales -----------------------------------------------------------
const qrs = new Map(); // texto del QR → archivo
const reQr = /https?:\/\/api\.qrserver\.com\/v1\/create-qr-code\/?\?([^"'\s)`]+)/gi;
const hallados = [...new Set([...`${html}\n${js}`.matchAll(reQr)].map((m) => m[0]))];
if (hallados.length) {
  let QRCode;
  try { QRCode = (await import('qrcode')).default; } catch {
    salir('Para convertir los QR hace falta la librería "qrcode". Ejecuta una vez, en la raíz del repositorio: npm install');
  }
  for (const url of hallados) {
    if (url.includes('${')) { // el QR se arma en el JavaScript con un dato que cambia
      avisos.push('Hay códigos QR que el JavaScript genera en api.qrserver.com con direcciones que arma al vuelo. No los pude convertir: hay que cambiarlos a mano por imágenes locales (img/qr-NN.png).');
      continue;
    }
    const params = new URLSearchParams(url.slice(url.indexOf('?') + 1).replace(/&amp;/g, '&'));
    const dato = params.get('data');
    const tam = parseInt((params.get('size') || '150x150').split('x')[0], 10) || 150;
    if (!dato) continue;
    if (!qrs.has(dato)) {
      const archivo = `img/qr-${String(qrs.size + 1).padStart(2, '0')}.png`;
      await QRCode.toFile(join(destino, archivo), dato, { width: 300, margin: 1 });
      qrs.set(dato, { archivo, tam });
    }
    const { archivo } = qrs.get(dato);
    const lado = Math.max(tam, 76); // 2 cm ≈ 76 px, el mínimo de CINTIA
    // En el HTML, fija el tamaño visible (la imagen nueva mide 300 px).
    html = html.replace(new RegExp(`<img\\b([^>]*?)src=["']${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']([^>]*)>`, 'g'), (tag, a, b) => {
      let resto = `${a}src="${archivo}"${b}`;
      const tamano = `width:${lado}px;height:${lado}px;`;
      resto = /style=["']/.test(resto) ? resto.replace(/style=(["'])/, `style=$1${tamano} `) : `${resto} style="${tamano}"`;
      return `<img${resto}>`;
    });
    js = js.split(url).join(archivo);
  }
  if (qrs.size) hechos.push(`Convertí ${hallados.length} QR de api.qrserver.com en ${qrs.size} imagen(es) local(es) (img/qr-NN.png).`);
}

// --- Plugin de accesibilidad ---------------------------------------------
if (!html.includes('elens.ecodestudio.dev/elens.js')) {
  html = html.replace(/<\/body>(?![\s\S]*<\/body>)/i, `${ELENS}\n</body>`);
  hechos.push('Agregué el plugin de accesibilidad elens.js antes de </body>.');
}

// --- Enlaces externos en pestaña nueva -------------------------------------
let enlaces = 0;
const pestana = (src) => src.replace(/<a\b([^>]*href=["']https?:\/\/[^"']+["'][^>]*)>/gi, (tag, attrs) => {
  if (/target=/i.test(attrs)) return tag;
  enlaces++;
  return `<a${attrs} target="_blank" rel="noopener">`;
});
html = pestana(html);
js = pestana(js);
if (enlaces) hechos.push(`Hice que ${enlaces} enlace(s) externo(s) abran en pestaña nueva.`);

// --- Navegación con teclado (criterio 1 de CINTIA) --------------------------
const MARCA_TECLADO = 'Navegación con teclado (criterio 1 de CINTIA)';
if (!js.includes(MARCA_TECLADO)) {
  const plantilla = (f) => leer(join(dirname(fileURLToPath(import.meta.url)), 'accesibilidad', f)).replace(/\s+$/, '');
  js = `${js.replace(/\s+$/, '')}\n\n${plantilla('teclado.js')}`;
  css = `${css.replace(/\s+$/, '')}\n\n${plantilla('teclado.css')}`;
  hechos.push('Agregué la navegación con teclado: foco visible, aria-expanded, foco al contenido nuevo, y tarjetas y pestañas con Enter y flechas.');
}

// --- Escribir archivos ----------------------------------------------------
const cabecera = (que) => `/* ${que} del OVA ${codigoDe(p)}. */\n\n`;
writeFileSync(join(destino, 'index.html'), html);
// En celular, el nombre largo del programa empuja el logo y lo vuelve ovalado.
const ARREGLO_LOGO = '\n/* El logo no se encoge en pantallas angostas (celular). */\n#ova-embed .logo-orb { flex-shrink: 0; }\n';
let cssFinal = css.includes('.logo-orb') && !css.includes('logo-orb { flex-shrink: 0; }') ? css + ARREGLO_LOGO : css;
if (cssFinal !== css) hechos.push('El logo del encabezado móvil ya no se deforma en el celular.');
// Las tarjetas giratorias tienen altura fija y el texto de atrás se sale. La altura pasa a ser
// la mínima y la tarjeta crece con el texto.
const ARREGLO_TARJETAS = '\n/* ===== Tarjetas giratorias que crecen con el texto ===== */\n#ova-embed .flip-card { display: grid; }\n#ova-embed .flip-card-inner { display: grid; height: auto; }\n#ova-embed .flip-card-front, #ova-embed .flip-card-back { position: relative; grid-area: 1 / 1; height: auto; }\n#ova-embed .flip-card-back h4 { margin-top: 0; }\n#ova-embed .flip-card-back p { margin-top: 0; margin-bottom: 0; }\n';
if (cssFinal.includes('.flip-card-back') && !cssFinal.includes('Tarjetas giratorias que crecen')) {
  cssFinal = cssFinal.replace(/(\.flip-card \{[^}]*?)\bheight:/g, '$1min-height:') + ARREGLO_TARJETAS;
  hechos.push('Las tarjetas giratorias crecen con el texto (antes el texto de atrás se salía).');
}
writeFileSync(join(destino, 'estilos.css'), cabecera('Estilos propios') + cssFinal + '\n');
writeFileSync(join(destino, 'script.js'), cabecera('Interacciones') + js + '\n');

const titulo = tituloDe(html) || '[Título]';
const TIPO = { tema: 'OVA de tema', unidad: 'OVA de unidad', complemento: `OVA complementario de la unidad (${COMPLEMENTOS[p.complemento]})`, recurso: `Recurso del curso (${RECURSOS[p.recurso]})` };
const readme = [
  `# ${titulo}`, '',
  `**Código:** ${codigoDe(p)}`,
  `**Programa:** ${nombres.programa}`,
  `**Curso:** ${nombres.curso}`,
  `**Tipo:** ${TIPO[p.tipo]}`,
  ...(p.unidad ? [`**Unidad:** ${p.unidad.slice(1)}`] : []),
  ...(p.tema ? [`**Tema:** ${p.tema.slice(1)}`] : []),
  `**Fecha de carga:** ${hoy}`, '',
  '## Archivos',
  '- index.html', '- estilos.css', '- script.js', '- tailwind.css', '- img/ (logo.webp y demás imágenes)', '',
  '## Historial',
  '| Versión | Fecha | Cambio |',
  '|---|---|---|',
  `| 1.0 | ${hoy} | Versión inicial (migración al repositorio) |`, '',
].join('\n');
writeFileSync(join(destino, 'README.md'), readme);
hechos.push('Creé el README.md con el código y los datos del OVA.');

if (filaNueva) {
  const f = join(ROOT, 'catalogo.csv');
  const actual = leer(f);
  appendFileSync(f, (actual.endsWith('\n') ? '' : '\n') + filaNueva + '\n');
  hechos.push(`Registré el curso en catalogo.csv: ${filaNueva}`);
}

// --- Íconos sin internet ----------------------------------------------------
try {
  const { iconos, desconocidos } = guardarIconos(destino);
  if (iconos) hechos.push(`Guardé en iconos.css los ${iconos} íconos de Font Awesome que usa el OVA (ya no los carga de internet).`);
  if (desconocidos.length) avisos.push(`Estas clases parecen íconos pero no existen en Font Awesome 6.4: ${desconocidos.map((d) => `fa-${d}`).join(', ')}.`);
} catch (e) {
  avisos.push(`No pude guardar los íconos: ${e.message}`);
}
if (existsSync(join(destino, 'iconos.css'))) {
  const f = join(destino, 'README.md');
  writeFileSync(f, leer(f).replace('- tailwind.css\n', '- tailwind.css\n- iconos.css\n'));
}

// --- Quemar Tailwind -------------------------------------------------------
try {
  const { incrustado } = quemarTailwind(destino);
  hechos.push(`Quemé tailwind.css con solo las clases del OVA${incrustado ? ', aplicadas dentro de #ova-embed' : ''}.`);
} catch (e) {
  avisos.push(`No pude quemar tailwind.css: ${e.message.split('\n')[0]}. Hazlo con: node scripts/quemar-tailwind.mjs ${destinoNorm}`);
}

// --- Resumen ---------------------------------------------------------------
console.log(`\n✅ OVA migrado a ${destinoNorm} (código ${codigoDe(p)})\n`);
for (const h of hechos) console.log(`   · ${h}`);
if (dejados.length) console.log(`\n   Dejé fuera (no van al repositorio): ${dejados.join(', ')}`);
if (otrosOva.length) console.log(`   No copié estas subcarpetas porque son otros OVA (se migran aparte): ${otrosOva.join(', ')}`);
if (avisos.length) {
  console.log('\n⚠️  Para revisar:');
  for (const a of avisos) console.log(`   · ${a}`);
}
console.log('\nAhora el validador revisa el resultado:\n');
const v = spawnSync(process.execPath, [join(ROOT, 'scripts', 'validar-ova.mjs'), destinoNorm], { stdio: 'inherit', cwd: ROOT });
process.exit(v.status ?? 0);
