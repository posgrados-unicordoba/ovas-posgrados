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
 *                Abre sitio/index.html en el navegador para verla.
 * En CI:       lo ejecuta .github/workflows/publicar.yml en cada push a main
 *              y GitHub Pages publica la carpeta sitio/.
 *
 * El listado no se guarda en el repositorio: se arma al publicar. Así funciona
 * aunque la rama main esté protegida.
 */

import { writeFileSync, existsSync, rmSync, mkdirSync, cpSync } from 'node:fs';
import { join } from 'node:path';
import {
  NIVELES, RECURSOS, COMPLEMENTOS, RECURSOS_OBLIGATORIOS, leer, rel, encontrarOvas, partesRuta, codigoDe, etiquetaDe,
  leerCatalogo, buscarEnCatalogo, tituloDe,
} from './comun.mjs';

const ROOT = process.cwd();
const SALIDA = join(ROOT, 'sitio');
const BASE = 'https://posgrados-unicordoba.github.io/ovas-posgrados';

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
const orden = (o) => o.tipo === 'recurso' ? `zzz${Object.keys(RECURSOS).indexOf(o.recurso)}` : `${o.unidad}/${o.tipo === 'complemento' ? `zz${Object.keys(COMPLEMENTOS).indexOf(o.complemento)}` : o.tema || ''}`;
ovas.sort((a, b) => `${a.nivel}/${a.programa}/${a.curso}`.localeCompare(`${b.nivel}/${b.programa}/${b.curso}`) || orden(a).localeCompare(orden(b)));

// --- Página -----------------------------------------------------------------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const unicos = (arr) => [...new Set(arr)];

const bloques = [];
for (const nivel of Object.keys(NIVELES)) {
  const delNivel = ovas.filter((o) => o.nivel === nivel);
  if (!delNivel.length) continue;
  bloques.push(`<section class="nivel"><h2>${NIVELES[nivel]}</h2>`);
  for (const prog of unicos(delNivel.map((o) => o.programa))) {
    const delProg = delNivel.filter((o) => o.programa === prog);
    bloques.push(`<section class="programa"><h3>${esc(delProg[0].nombrePrograma)}</h3>`);
    for (const cur of unicos(delProg.map((o) => o.curso))) {
      const delCurso = delProg.filter((o) => o.curso === cur);
      const nOva = delCurso.filter((o) => o.tipo !== 'recurso').length;
      bloques.push(`<details class="curso" open><summary><span>${esc(delCurso[0].nombreCurso)}</span><span class="cuenta">${nOva} OVA</span></summary>`);
      const item = (o) => {
        const buscar = esc(`${o.titulo} ${etiquetaDe(o)} ${o.codigo} ${o.nombreCurso} ${o.nombrePrograma}`.toLowerCase());
        const tipo = o.tipo === 'complemento' || o.tipo === 'recurso' ? `<span class="tipo">${etiquetaDe(o)}</span>` : '';
        return `<li data-buscar="${buscar}"><span>${tipo}<a href="${o.ruta}/">${esc(o.titulo)}</a></span><code>${o.codigo}</code></li>`;
      };
      for (const uni of unicos(delCurso.filter((o) => o.tipo !== 'recurso').map((o) => o.unidad))) {
        bloques.push(`<h4>Unidad ${Number(uni.slice(1))}</h4><ul>`);
        for (const o of delCurso.filter((x) => x.tipo !== 'recurso' && x.unidad === uni)) bloques.push(item(o));
        bloques.push('</ul>');
      }
      const recursos = delCurso.filter((o) => o.tipo === 'recurso');
      if (recursos.length) {
        bloques.push('<h4>Recursos del curso</h4><ul>');
        for (const o of recursos) bloques.push(item(o));
        bloques.push('</ul>');
      }
      const faltan = RECURSOS_OBLIGATORIOS.filter((x) => !recursos.some((o) => o.recurso === x));
      if (faltan.length) bloques.push(`<p class="falta">Falta subir: ${faltan.map((x) => RECURSOS[x].toLowerCase()).join(' y ')}.</p>`);
      bloques.push('</details>');
    }
    bloques.push('</section>');
  }
  bloques.push('</section>');
}

const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>OVA de posgrado · Universidad de Córdoba</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  :root { --tinta: #1f2a37; --suave: #5b6675; --linea: #dde3e8; --fondo: #f6f8f7; --verde: #3d6a3a; --verde-claro: #e8f0e7; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: 'Poppins', system-ui, sans-serif; color: var(--tinta); background: var(--fondo); line-height: 1.5; }
  header { background: var(--verde); color: #fff; padding: 32px 20px 28px; }
  header div, main { max-width: 860px; margin: 0 auto; }
  header h1 { margin: 0 0 4px; font-size: 1.6rem; font-weight: 600; }
  header p { margin: 0; opacity: .9; }
  main { padding: 24px 20px 48px; }
  label { display: block; font-weight: 500; margin-bottom: 6px; }
  input { width: 100%; padding: 12px 14px; font: inherit; border: 2px solid var(--linea); border-radius: 10px; background: #fff; }
  input:focus-visible, a:focus-visible, summary:focus-visible { outline: 3px solid var(--verde); outline-offset: 2px; }
  .total { color: var(--suave); font-size: .9rem; margin: 10px 0 0; }
  h2 { font-size: 1.25rem; margin: 32px 0 12px; padding-bottom: 6px; border-bottom: 2px solid var(--verde); }
  h3 { font-size: 1.05rem; margin: 20px 0 10px; color: var(--verde); }
  details { background: #fff; border: 1px solid var(--linea); border-radius: 12px; margin-bottom: 12px; padding: 4px 16px 10px; }
  summary { cursor: pointer; font-weight: 500; padding: 10px 0; display: flex; justify-content: space-between; gap: 12px; }
  .cuenta { color: var(--suave); font-weight: 400; font-size: .9rem; white-space: nowrap; }
  h4 { font-size: .85rem; text-transform: uppercase; letter-spacing: .04em; color: var(--suave); margin: 10px 0 4px; }
  ul { list-style: none; margin: 0; padding: 0; }
  li { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; padding: 8px 0; border-top: 1px solid var(--linea); }
  li:first-child { border-top: 0; }
  a { color: var(--tinta); text-decoration: none; font-weight: 500; }
  a:hover { color: var(--verde); text-decoration: underline; }
  code { font-size: .78rem; color: var(--suave); background: var(--verde-claro); padding: 2px 6px; border-radius: 6px; white-space: nowrap; }
  .vacio { color: var(--suave); }
  .tipo { display: inline-block; font-size: .72rem; font-weight: 600; color: var(--verde); background: var(--verde-claro); padding: 1px 8px; border-radius: 999px; margin-right: 8px; }
  .falta { font-size: .85rem; color: #8a5a00; background: #fff6e0; border-radius: 8px; padding: 6px 10px; margin: 10px 0 4px; }
  footer { text-align: center; color: var(--suave); font-size: .85rem; padding: 0 20px 32px; }
  @media (max-width: 560px) { li { flex-direction: column; gap: 2px; } }
</style>
</head>
<body>
<header><div>
  <h1>OVA de posgrado</h1>
  <p>Objetos virtuales de aprendizaje de las especializaciones, maestrías y doctorados</p>
</div></header>
<main>
  <label for="buscar">Buscar un OVA</label>
  <input id="buscar" type="search" placeholder="Título, curso, programa o código" autocomplete="off">
  <p class="total" id="total" aria-live="polite">${ovas.length} publicados</p>
  ${bloques.join('\n  ') || '<p class="vacio">Todavía no hay OVA publicados.</p>'}
  <p class="vacio" id="nada" hidden>Ningún OVA coincide con la búsqueda.</p>
</main>
<footer>Centro de Innovación en TIC para el apoyo de la Docencia CINTIA – Universidad de Córdoba</footer>
<script>
  const campo = document.getElementById('buscar');
  campo.addEventListener('input', () => {
    const q = campo.value.trim().toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '');
    let n = 0;
    document.querySelectorAll('li[data-buscar]').forEach(li => {
      const ok = !q || li.dataset.buscar.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').includes(q);
      li.hidden = !ok; if (ok) n++;
    });
    document.querySelectorAll('.falta').forEach(p => { p.hidden = Boolean(q); });
    document.querySelectorAll('h4').forEach(h => { const ul = h.nextElementSibling; const ver = [...ul.children].some(li => !li.hidden); h.hidden = !ver; ul.hidden = !ver; });
    document.querySelectorAll('details, .programa, .nivel').forEach(s => { s.hidden = !s.querySelector('li:not([hidden])'); if (q && s.tagName === 'DETAILS') s.open = true; });
    document.getElementById('total').textContent = q ? n + ' de ${ovas.length}' : '${ovas.length} publicados';
    document.getElementById('nada').hidden = n > 0;
  });
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
writeFileSync(join(SALIDA, 'index.html'), html, 'utf8');
// La dirección …/enlaces/ también lleva al listado.
mkdirSync(join(SALIDA, 'enlaces'));
writeFileSync(join(SALIDA, 'enlaces', 'index.html'),
  '<!DOCTYPE html><meta charset="UTF-8"><meta http-equiv="refresh" content="0; url=../"><link rel="canonical" href="../"><title>OVA de posgrado</title><a href="../">Ir al listado de OVA</a>\n');
writeFileSync(join(SALIDA, '.nojekyll'), '');

console.log(`✅ Sitio armado en sitio/ con ${ovas.length} páginas enlazadas. Página principal: ${BASE}/`);
