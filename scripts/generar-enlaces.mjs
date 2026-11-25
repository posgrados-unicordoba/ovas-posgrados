#!/usr/bin/env node
/**
 * Arma el sitio que publica GitHub Pages: los OVA y una página principal con
 * el enlace de cada uno, organizados por nivel, programa, curso y unidad.
 *
 * - Encuentra los OVA igual que el validador (carpeta con index.html).
 * - Toma los nombres de programas y cursos de catalogo.csv.
 * - Toma el nombre de cada OVA de su <title>.
 * - Ordena por carpeta (u01, u02… / t01, t02…), que ya es el orden del curso.
 *   Los complementos de cada unidad (diagnóstico, actividades) van al final de su unidad, y los
 *   recursos del curso (bibliografía, rúbrica, mapa conceptual) en su propio bloque.
 *
 * Uso local:   node scripts/generar-enlaces.mjs
 *              → crea la carpeta sitio/ (no se sube: está en .gitignore).
 *                Abre sitio/index.html en el navegador: ahí está el listado
 *                con el enlace de cada OVA para copiarlo en Moodle.
 * En CI:       lo ejecuta .github/workflows/publicar.yml en cada push a main
 *              y GitHub Pages publica la carpeta sitio/.
 *
 * Visibilidad: el listado completo solo se arma en el computador. Lo que se
 * publica en GitHub Pages lleva en su lugar una portada sin enlaces, y todas
 * las páginas (OVA y portada) llevan <meta name="robots" content="noindex">
 * para que los buscadores no las muestren. Los OVA siguen abriendo con su
 * enlace desde Moodle. Para armar localmente la versión pública: --publicar.
 */

import { writeFileSync, readFileSync, readdirSync, existsSync, rmSync, mkdirSync, cpSync } from 'node:fs';
import { join } from 'node:path';
import {
  NIVELES, RECURSOS, COMPLEMENTOS, COMPLEMENTOS_PRIMERO, RECURSOS_OBLIGATORIOS, leer, rel, encontrarOvas, partesRuta, codigoDe, etiquetaDe,
  leerCatalogo, buscarEnCatalogo, tituloDe,
} from './comun.mjs';

const ROOT = process.cwd();
const SALIDA = join(ROOT, 'sitio');
const BASE = 'https://posgrados-unicordoba.github.io/ovas-posgrados';
// En GitHub Actions (o con --publicar) se arma la versión pública, sin listado.
const PUBLICAR = process.env.GITHUB_ACTIONS === 'true' || process.argv.includes('--publicar');
const NOINDEX = '<meta name="robots" content="noindex, nofollow">';

const { filas, error } = leerCatalogo(ROOT);
if (error) console.warn(`⚠️  ${error} Se mostrarán las siglas en lugar de los nombres.`);

// --- Datos ------------------------------------------------------------------
const ovas = [];
for (const dir of encontrarOvas(ROOT)) {
  const r = rel(ROOT, dir);
  const p = partesRuta(r);
  if (!p || !NIVELES[p.nivel]) continue; // fuera de la estructura: lo reporta el validador
  const nombres = buscarEnCatalogo(filas || [], p);
  ovas.push({
    ...p,
    ruta: r,
    codigo: codigoDe(p),
    titulo: tituloDe(leer(join(dir, 'index.html'))) || codigoDe(p),
    nombrePrograma: nombres.programa || p.programa,
    nombreCurso: nombres.curso || p.curso,
  });
}
// Orden: unidades (temas y luego la evaluación) y al final los recursos del curso.
const orden = (o) => o.tipo === 'recurso' ? `zzz${Object.keys(RECURSOS).indexOf(o.recurso)}` : `${o.unidad}/${o.tipo === 'complemento' ? `${COMPLEMENTOS_PRIMERO.includes(o.complemento) ? '00' : 'zz'}${Object.keys(COMPLEMENTOS).indexOf(o.complemento)}` : o.tema || ''}`;
ovas.sort((a, b) => `${a.nivel}/${a.programa}/${a.curso}`.localeCompare(`${b.nivel}/${b.programa}/${b.curso}`) || orden(a).localeCompare(orden(b)));

// --- Página -----------------------------------------------------------------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const unicos = (arr) => [...new Set(arr)];

// Árbol plegable: nivel → programa → curso → unidad → OVA. Todo empieza
// cerrado; el buscador abre solo las ramas donde hay coincidencias.
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
const contar = (lista) => plural(lista.filter((o) => o.tipo !== 'recurso').length, 'OVA', 'OVA');
const BASE_REL = (r) => `${r}/index.html`; // con index.html para que abra el OVA también desde el computador (file://)

const item = (o) => {
  const buscar = esc(`${o.titulo} ${etiquetaDe(o)} ${o.codigo} ${o.nombreCurso} ${o.nombrePrograma}`.toLowerCase());
  // El título del tema ya dice "Tema N"; la etiqueta solo se pone a complementos y recursos.
  const etiqueta = o.tipo === 'complemento' || o.tipo === 'recurso' ? `<span class="tipo tipo-${o.tipo}">${esc(etiquetaDe(o))}</span>` : '';
  return `<li data-buscar="${buscar}">
            <div class="ova">${etiqueta}<a href="${BASE_REL(o.ruta)}">${esc(o.titulo)}</a></div>
            <div class="acciones"><code>${o.codigo}</code><button type="button" class="copiar" data-url="${BASE}/${o.ruta}/" aria-label="Copiar el enlace de ${esc(o.titulo)}">Copiar enlace</button></div>
          </li>`;
};

const arbol = [];
const resumenNivel = {};
for (const nivel of Object.keys(NIVELES)) {
  const delNivel = ovas.filter((o) => o.nivel === nivel);
  resumenNivel[nivel] = delNivel;
  if (!delNivel.length) continue;
  const programas = unicos(delNivel.map((o) => o.programa));
  arbol.push(`<details class="rama nivel" data-nivel="${nivel}">
  <summary><span class="nombre">${NIVELES[nivel] === 'Doctorado' ? 'Doctorados' : NIVELES[nivel] === 'Maestría' ? 'Maestrías' : 'Especializaciones'}</span><span class="cuenta">${plural(programas.length, 'programa', 'programas')} · ${contar(delNivel)}</span></summary>
  <div class="hijos">`);
  for (const prog of programas) {
    const delProg = delNivel.filter((o) => o.programa === prog);
    const cursos = unicos(delProg.map((o) => o.curso));
    arbol.push(`<details class="rama programa">
    <summary><span class="nombre">${esc(delProg[0].nombrePrograma)}</span><span class="cuenta">${plural(cursos.length, 'curso', 'cursos')} · ${contar(delProg)}</span></summary>
    <div class="hijos">`);
    for (const cur of cursos) {
      const delCurso = delProg.filter((o) => o.curso === cur);
      const recursos = delCurso.filter((o) => o.tipo === 'recurso');
      const faltan = RECURSOS_OBLIGATORIOS.filter((x) => !recursos.some((o) => o.recurso === x));
      arbol.push(`<details class="rama curso">
      <summary><span class="nombre">${esc(delCurso[0].nombreCurso)}</span><span class="cuenta">${contar(delCurso)}${faltan.length ? ' · <span class="falta-mini">incompleto</span>' : ''}</span></summary>
      <div class="hijos">`);
      for (const uni of unicos(delCurso.filter((o) => o.tipo !== 'recurso').map((o) => o.unidad))) {
        const deUni = delCurso.filter((x) => x.tipo !== 'recurso' && x.unidad === uni);
        arbol.push(`<details class="rama unidad">
        <summary><span class="nombre">Unidad ${Number(uni.slice(1))}</span><span class="cuenta">${contar(deUni)}</span></summary>
        <ul>${deUni.map(item).join('')}</ul>
        </details>`);
      }
      if (recursos.length) arbol.push(`<details class="rama unidad recursos">
        <summary><span class="nombre">Recursos del curso</span><span class="cuenta">${recursos.length}</span></summary>
        <ul>${recursos.map(item).join('')}</ul>
        </details>`);
      if (faltan.length) arbol.push(`<p class="falta">Falta subir: ${faltan.map((x) => RECURSOS[x].toLowerCase()).join(' y ')}.</p>`);
      arbol.push('</div></details>');
    }
    arbol.push('</div></details>');
  }
  arbol.push('</div></details>');
}

const tarjetas = Object.keys(NIVELES).map((n) => {
  const l = resumenNivel[n];
  const titulo = n === 'esp' ? 'Especializaciones' : n === 'mae' ? 'Maestrías' : 'Doctorados';
  return `<button type="button" class="tarjeta" data-ir="${n}" ${l.length ? '' : 'disabled'}><span class="t-num">${l.filter((o) => o.tipo !== 'recurso').length}</span><span class="t-txt">OVA en ${titulo.toLowerCase()}</span><span class="t-sub">${plural(unicos(l.map((o) => o.programa)).length, 'programa', 'programas')} · ${plural(unicos(l.map((o) => `${o.programa}/${o.curso}`)).length, 'curso', 'cursos')}</span></button>`;
}).join('');

const totalOva = ovas.filter((o) => o.tipo !== 'recurso').length;

const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>OVA de posgrado · Universidad de Córdoba</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  :root { --tinta: #1f2a37; --suave: #5b6675; --linea: #dde3e8; --fondo: #f6f8f7; --verde: #3d6a3a; --verde-claro: #e8f0e7; --verde-medio: #c9dcc6; }
  * { box-sizing: border-box; }
  [hidden] { display: none !important; }
  body { margin: 0; font-family: 'Poppins', system-ui, sans-serif; color: var(--tinta); background: var(--fondo); line-height: 1.5; }
  header { background: var(--verde); color: #fff; padding: 32px 20px 28px; }
  header div, main { max-width: 920px; margin: 0 auto; }
  header h1 { margin: 0 0 4px; font-size: 1.6rem; font-weight: 600; }
  header p { margin: 0; opacity: .9; }
  main { padding: 24px 20px 48px; }
  .tarjetas { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px; }
  .tarjeta { font: inherit; text-align: left; background: #fff; border: 2px solid var(--linea); border-radius: 14px; padding: 14px 16px; cursor: pointer; display: flex; flex-direction: column; color: var(--tinta); }
  .tarjeta:hover:not(:disabled) { border-color: var(--verde); }
  .tarjeta:disabled { opacity: .5; cursor: default; }
  .t-num { font-size: 1.8rem; font-weight: 600; color: var(--verde); line-height: 1.1; }
  .t-txt { font-weight: 500; }
  .t-sub { font-size: .8rem; color: var(--suave); }
  .barra { display: flex; gap: 10px; align-items: end; flex-wrap: wrap; margin-bottom: 8px; }
  .barra .campo { flex: 1; min-width: 220px; }
  label { display: block; font-weight: 500; margin-bottom: 6px; }
  input { width: 100%; padding: 12px 14px; font: inherit; border: 2px solid var(--linea); border-radius: 10px; background: #fff; }
  .btn { font: inherit; font-size: .85rem; background: #fff; border: 2px solid var(--linea); border-radius: 10px; padding: 10px 12px; cursor: pointer; color: var(--tinta); }
  .btn:hover { border-color: var(--verde); }
  :focus-visible { outline: 3px solid var(--verde); outline-offset: 2px; }
  .total { color: var(--suave); font-size: .9rem; margin: 6px 0 16px; }
  details.rama { background: #fff; border: 1px solid var(--linea); border-radius: 12px; margin: 8px 0; }
  details.rama > summary { cursor: pointer; list-style: none; display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 12px 16px; }
  details.rama > summary::-webkit-details-marker { display: none; }
  details.rama > summary .nombre::before { content: '▶'; display: inline-block; width: 1.4em; font-size: .7em; vertical-align: .15em; color: var(--verde); transition: transform .15s; }
  details.rama[open] > summary .nombre::before { transform: rotate(90deg); }
  .hijos { padding: 0 12px 10px 22px; }
  .nivel { border-width: 2px; }
  .nivel > summary { font-size: 1.1rem; font-weight: 600; }
  .nivel[open] > summary { border-bottom: 2px solid var(--verde); }
  .programa > summary { font-weight: 600; color: var(--verde); }
  .curso > summary { font-weight: 500; }
  .unidad { background: var(--fondo); }
  .unidad > summary { font-size: .9rem; font-weight: 600; color: var(--suave); text-transform: uppercase; letter-spacing: .03em; padding: 8px 14px; }
  .cuenta { color: var(--suave); font-weight: 400; font-size: .82rem; white-space: nowrap; text-transform: none; letter-spacing: 0; }
  .falta-mini { color: #8a5a00; }
  ul { list-style: none; margin: 0; padding: 0 12px 8px; }
  li { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 8px 0; border-top: 1px solid var(--linea); }
  li:first-child { border-top: 0; }
  .ova { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
  .ova a { color: var(--tinta); text-decoration: none; font-weight: 500; }
  .ova a:hover { color: var(--verde); text-decoration: underline; }
  .tipo { font-size: .7rem; font-weight: 600; color: var(--verde); background: var(--verde-claro); padding: 1px 8px; border-radius: 999px; white-space: nowrap; }
  .tipo-complemento, .tipo-recurso { background: var(--verde-medio); }
  .acciones { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
  code { font-size: .75rem; color: var(--suave); background: var(--verde-claro); padding: 2px 6px; border-radius: 6px; white-space: nowrap; }
  .copiar { font: inherit; font-size: .75rem; border: 1px solid var(--linea); background: #fff; border-radius: 8px; padding: 4px 8px; cursor: pointer; color: var(--tinta); white-space: nowrap; }
  .copiar:hover { border-color: var(--verde); }
  .copiar.ok { background: var(--verde); color: #fff; border-color: var(--verde); }
  .falta { font-size: .85rem; color: #8a5a00; background: #fff6e0; border-radius: 8px; padding: 6px 10px; margin: 8px 0 4px; }
  .vacio { color: var(--suave); }
  footer { text-align: center; color: var(--suave); font-size: .85rem; padding: 0 20px 32px; }
  @media (max-width: 640px) { .tarjetas { grid-template-columns: 1fr; } li { flex-direction: column; align-items: flex-start; } .hijos { padding-left: 10px; } }
</style>
</head>
<body>
<header><div>
  <h1>OVA de posgrado</h1>
  <p>Objetos virtuales de aprendizaje de las especializaciones, maestrías y doctorados</p>
</div></header>
<main>
  <div class="tarjetas">${tarjetas}</div>
  <div class="barra">
    <div class="campo">
      <label for="buscar">Buscar un OVA</label>
      <input id="buscar" type="search" placeholder="Título, curso, programa o código" autocomplete="off">
    </div>
    <button type="button" class="btn" id="abrir">Abrir todo</button>
    <button type="button" class="btn" id="cerrar">Cerrar todo</button>
  </div>
  <p class="total" id="total" aria-live="polite">${plural(totalOva, 'OVA publicado', 'OVA publicados')}</p>
  <div id="arbol">${arbol.join('\n') || '<p class="vacio">Todavía no hay OVA publicados.</p>'}</div>
  <p class="vacio" id="nada" hidden>Ningún OVA coincide con la búsqueda.</p>
</main>
<footer>Centro de Innovación en TIC para el apoyo de la Docencia CINTIA – Universidad de Córdoba</footer>
<script>
  const ramas = () => document.querySelectorAll('#arbol details');
  const sinTildes = (t) => t.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '');
  const campo = document.getElementById('buscar');
  campo.addEventListener('input', () => {
    const q = sinTildes(campo.value.trim());
    let n = 0;
    document.querySelectorAll('li[data-buscar]').forEach((li) => {
      const ok = !q || sinTildes(li.dataset.buscar).includes(q);
      li.hidden = !ok; if (ok && !li.querySelector('.tipo-recurso')) n++;
    });
    // Las ramas sin coincidencias se ocultan; con búsqueda, las que tienen coincidencias se abren.
    [...ramas()].reverse().forEach((d) => {
      const visible = !!d.querySelector('li:not([hidden])');
      d.hidden = !visible;
      d.open = q ? visible : false;
    });
    document.querySelectorAll('.falta').forEach((p) => { p.hidden = Boolean(q); });
    document.getElementById('total').textContent = q ? n + ' de ${totalOva} OVA' : '${plural(totalOva, 'OVA publicado', 'OVA publicados')}';
    document.getElementById('nada').hidden = n > 0 || !q;
  });
  document.getElementById('abrir').addEventListener('click', () => ramas().forEach((d) => { if (!d.hidden) d.open = true; }));
  document.getElementById('cerrar').addEventListener('click', () => ramas().forEach((d) => { d.open = false; }));
  // Las tarjetas abren su nivel y llevan a él.
  document.querySelectorAll('.tarjeta[data-ir]').forEach((b) => b.addEventListener('click', () => {
    const d = document.querySelector('.nivel[data-nivel="' + b.dataset.ir + '"]');
    if (!d) return; d.open = true; d.scrollIntoView({ behavior: 'smooth', block: 'start' }); d.querySelector('summary').focus();
  }));
  // Copiar el enlace de un OVA (para pegarlo en el aula virtual).
  document.addEventListener('click', async (e) => {
    const b = e.target.closest('.copiar'); if (!b) return;
    try { await navigator.clipboard.writeText(b.dataset.url); } catch { const t = document.createElement('textarea'); t.value = b.dataset.url; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); }
    const antes = b.textContent; b.textContent = '¡Copiado!'; b.classList.add('ok');
    setTimeout(() => { b.textContent = antes; b.classList.remove('ok'); }, 1500);
  });
  // Si hay una sola especialización/programa/curso, se abre sola para no hacer clic de más.
  const nivelesConOva = document.querySelectorAll('#arbol > .nivel');
  if (nivelesConOva.length === 1) nivelesConOva[0].open = true;
</script>
</body>
</html>
`;

// --- Sitio ------------------------------------------------------------------
rmSync(SALIDA, { recursive: true, force: true });
mkdirSync(SALIDA, { recursive: true });
for (const nivel of Object.keys(NIVELES)) {
  const origen = join(ROOT, nivel);
  if (existsSync(origen)) cpSync(origen, join(SALIDA, nivel), { recursive: true, filter: (f) => !f.endsWith('README.md') });
}
// Portada pública: no muestra ni enlaza los OVA.
const portada = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${NOINDEX}
<title>OVA de posgrado · CINTIA</title>
<style>
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #f4f7f3; color: #2b3a2b; font-family: Poppins, 'Segoe UI', Arial, sans-serif; }
  main { max-width: 34rem; margin: 2rem; padding: 2rem 2.25rem; background: #fff; border: 1px solid #d8e2d6; border-radius: 14px; }
  h1 { margin: 0 0 .75rem; font-size: 1.35rem; color: #2f5d2b; }
  p { margin: .5rem 0; line-height: 1.55; }
  footer { margin-top: 1.25rem; font-size: .85rem; color: #5b6b5a; }
</style>
</head>
<body>
<main>
  <h1>Objetos virtuales de aprendizaje de posgrado</h1>
  <p>Estos recursos se consultan desde los cursos de la plataforma de posgrados de la Universidad de Córdoba.</p>
  <p>Si eres estudiante, ingresa a tu curso en la plataforma.</p>
  <footer>Centro de Innovación en TIC para el apoyo de la Docencia CINTIA – Universidad de Córdoba</footer>
</main>
</body>
</html>
`;

if (PUBLICAR) {
  writeFileSync(join(SALIDA, 'index.html'), portada, 'utf8');
} else {
  writeFileSync(join(SALIDA, 'index.html'), html.replace(/<head>/i, `<head>\n${NOINDEX}`), 'utf8');
  // La dirección …/enlaces/ también lleva al listado (solo en la copia local).
  mkdirSync(join(SALIDA, 'enlaces'));
  writeFileSync(join(SALIDA, 'enlaces', 'index.html'),
    `<!DOCTYPE html><meta charset="UTF-8">${NOINDEX}<meta http-equiv="refresh" content="0; url=../index.html"><title>OVA de posgrado</title><a href="../index.html">Ir al listado de OVA</a>\n`);
}
writeFileSync(join(SALIDA, '.nojekyll'), '');

// Todas las páginas de los OVA piden a los buscadores no indexarlas.
let marcadas = 0;
(function marcar(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const f = join(dir, e.name);
    if (e.isDirectory()) { marcar(f); continue; }
    if (!e.name.endsWith('.html')) continue;
    const s = readFileSync(f, 'utf8');
    if (/name=["']robots["']/i.test(s) || !/<head[^>]*>/i.test(s)) continue;
    writeFileSync(f, s.replace(/<head[^>]*>/i, (m) => `${m}\n${NOINDEX}`), 'utf8');
    marcadas++;
  }
})(SALIDA);

console.log(PUBLICAR
  ? `✅ Sitio público armado en sitio/: ${ovas.length} OVA, portada sin enlaces y ${marcadas} páginas marcadas para que los buscadores no las indexen.`
  : `✅ Listado armado en sitio/ con ${ovas.length} OVA. Ábrelo en el navegador: sitio/index.html (este listado no se publica).`);
