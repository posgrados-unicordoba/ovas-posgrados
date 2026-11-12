#!/usr/bin/env node
/**
 * Guarda dentro del OVA los íconos de Font Awesome que usa, para que no
 * dependa de internet (cdnjs.cloudflare.com), igual que tailwind.css.
 *
 * Uso:   node scripts/guardar-iconos.mjs esp/gthdo/pobh/u02/t03
 *        (se pueden pasar varias carpetas)
 *
 * Qué hace:
 *   1. Busca en index.html y script.js los íconos que usa el OVA
 *      (<i class="fa-solid fa-check">, y también los que arma el JavaScript).
 *   2. Escribe iconos.css con SOLO esos íconos, incrustados como SVG.
 *      Las mismas etiquetas <i class="fa-…"> los muestran con el mismo tamaño
 *      y el color del texto. No hay que cambiar el HTML ni el JavaScript.
 *      (Van incrustados y no como archivos sueltos porque el navegador no
 *      carga máscaras desde archivos locales: al abrir el OVA desde la
 *      carpeta, los íconos no se verían.)
 *   4. Cambia en el index.html el enlace de Font Awesome por iconos.css.
 *
 * Si después se agrega un ícono nuevo al OVA, se vuelve a ejecutar.
 * Requiere haber ejecutado una vez, en la raíz del repositorio: npm install
 *
 * Íconos: Font Awesome Free 6.4.0 (https://fontawesome.com), licencia CC BY 4.0.
 */

import { existsSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { leer, FA_UTILIDADES, iconosUsados, fragmentosConClases } from './comun.mjs';

const FA = join(dirname(fileURLToPath(import.meta.url)), '..', 'node_modules', '@fortawesome', 'fontawesome-free');
const ESTILOS = ['solid', 'regular', 'brands'];
/** Alias de Font Awesome 6 (fa-sync → arrows-rotate, fa-times → xmark…). */
function leerAlias() {
  const alias = new Map();
  const yml = readFileSync(join(FA, 'metadata', 'icons.yml'), 'utf8').split('\n');
  let actual = null; let enNombres = false;
  for (const l of yml) {
    const k = /^([a-z0-9-]+):\s*$/.exec(l);
    if (k) { actual = k[1]; enNombres = false; continue; }
    if (/^ {4}names:\s*$/.test(l)) { enNombres = true; continue; }
    const n = /^ {6}- ([a-z0-9-]+)\s*$/.exec(l);
    if (enNombres && n && actual) alias.set(n[1], actual);
    else if (!/^ {6}- /.test(l)) enNombres = false;
  }
  return alias;
}

/** Reglas de utilidades de Font Awesome (fa-fw, fa-lg, fa-spin…) que use el OVA. */
function utilidades(usadas) {
  if (!usadas.size) return '';
  const css = readFileSync(join(FA, 'css', 'all.min.css'), 'utf8');
  const reglas = [];
  const animaciones = new Set();
  for (const m of css.matchAll(/(?:^|})([^{}@]+)\{([^{}]*)\}/g)) {
    const selectores = m[1].split(',');
    const ok = selectores.some((s) => [...usadas].some((u) => new RegExp(`^\\.fa-${u}(?![a-z0-9-])`).test(s.trim())));
    if (!ok || /:before|:after/.test(m[1])) continue;
    reglas.push(`${m[1]}{${m[2]}}`);
    for (const a of m[2].matchAll(/animation-name:\s*(fa-[a-z-]+)/g)) animaciones.add(a[1]);
  }
  for (const nombre of animaciones) {
    for (const pref of ['@-webkit-keyframes', '@keyframes']) {
      const i = css.indexOf(`${pref} ${nombre}{`);
      if (i < 0) continue;
      let prof = 0; let j = css.indexOf('{', i);
      for (; j < css.length; j++) { if (css[j] === '{') prof++; else if (css[j] === '}' && --prof === 0) break; }
      reglas.push(css.slice(i, j + 1));
    }
  }
  return reglas.join('\n');
}

export function guardarIconos(dirOva) {
  if (!existsSync(FA)) throw new Error('Falta Font Awesome en node_modules. Ejecuta una vez, en la raíz del repositorio: npm install');
  const dir = resolve(dirOva);
  const indice = join(dir, 'index.html');
  let html = leer(indice);
  const js = existsSync(join(dir, 'script.js')) ? leer(join(dir, 'script.js')) : '';
  const alias = leerAlias();

  // 1) Íconos usados y su estilo (sólido por defecto).
  const pedidos = new Map(); // "estilo:nombre" → ícono a guardar
  const desconocidos = new Set();
  for (const { nombre: n, estilo } of iconosUsados(`${html}\n${js}`)) {
    const canon = alias.get(n) || n;
    const existe = ESTILOS.find((e) => existsSync(join(FA, 'svgs', e, `${canon}.svg`)));
    if (!existe) { desconocidos.add(n); continue; }
    const est = existsSync(join(FA, 'svgs', estilo, `${canon}.svg`)) ? estilo : existe;
    pedidos.set(`${est}:${n}`, { estilo: est, clase: n, canon });
  }
  const utils = new Set();
  for (const f of fragmentosConClases(`${html}\n${js}`))
    for (const m of f.matchAll(/(?<![a-z0-9-])fa-([a-z0-9]+(?:-[a-z0-9]+)*)/g)) if (FA_UTILIDADES.has(m[1])) utils.add(m[1]);

  // 2) Una regla por ícono, con el SVG incrustado (sin el comentario de
  //    licencia de cada archivo: la atribución va una vez en la cabecera).
  const reglas = [];
  const copiados = new Set();
  for (const { estilo, clase, canon } of [...pedidos.values()].sort((a, b) => a.clase.localeCompare(b.clase))) {
    const svg = readFileSync(join(FA, 'svgs', estilo, `${canon}.svg`), 'utf8').replace(/<!--[\s\S]*?-->/g, '').trim();
    copiados.add(`${estilo}:${canon}`);
    const [, ancho, alto] = /viewBox="0 0 (\d+) (\d+)"/.exec(svg) || [0, 512, 512];
    const sel = estilo === 'solid' ? `.fa-${clase}` : `.fa-${estilo}.fa-${clase}, .fa${estilo[0]}.fa-${clase}`;
    const datos = `data:image/svg+xml,${encodeURIComponent(svg).replace(/'/g, '%27')}`;
    reglas.push(`${sel} { width: ${(+ancho / +alto).toFixed(4).replace(/0+$/, '').replace(/\.$/, '')}em; --fa-icono: url("${datos}"); }`);
  }
  // Las versiones anteriores de este script guardaban los SVG en img/iconos/.
  rmSync(join(dir, 'img', 'iconos'), { recursive: true, force: true });

  // 3) iconos.css
  const css = `/* Íconos del OVA: Font Awesome Free 6.4.0 (https://fontawesome.com),
   licencia CC BY 4.0. Solo los ${copiados.size} íconos que usa este OVA, incrustados aquí.
   Generado por scripts/guardar-iconos.mjs: no editar a mano; si se agrega un ícono, se vuelve a generar. */

/* El ícono se dibuja con una máscara del color del texto. El carácter invisible
   de ::before le da el mismo alto y la misma línea base que tenía la letra de
   la fuente de Font Awesome, así que ocupa exactamente el mismo espacio;
   flex-shrink evita que se encoja dentro de filas o columnas flexibles. */
.fa, .fa-solid, .fa-regular, .fa-brands, .fas, .far, .fab {
  display: var(--fa-display, inline-block);
  width: 1em;
  flex-shrink: 0;
  line-height: 1;
  font-style: normal;
  background-color: currentColor;
  -webkit-mask: var(--fa-icono) no-repeat center / contain;
  mask: var(--fa-icono) no-repeat center / contain;
}
.fa::before, .fa-solid::before, .fa-regular::before, .fa-brands::before, .fas::before, .far::before, .fab::before {
  content: "\\200b";
}

${reglas.join('\n')}
${utilidades(utils)}
`;
  writeFileSync(join(dir, 'iconos.css'), css);

  // 4) Cambiar el enlace de Font Awesome por iconos.css.
  const reFa = /<link\b[^>]*href=["'][^"']*font-?awesome[^"']*["'][^>]*>/i;
  if (reFa.test(html)) html = html.replace(reFa, '<link rel="stylesheet" href="iconos.css">');
  else if (pedidos.size && !/href=["']iconos\.css["']/.test(html))
    html = html.replace(/(\s*)<link rel="stylesheet" href="estilos\.css">/, '$1<link rel="stylesheet" href="iconos.css">$1<link rel="stylesheet" href="estilos.css">');
  html = html.replace(/[ \t]*<script\b[^>]*src=["'][^"']*(fontawesome|kit\.fontawesome)[^"']*["'][^>]*>\s*<\/script>\s*\n?/gi, '');
  writeFileSync(indice, html);

  return { iconos: copiados.size, desconocidos: [...desconocidos] };
}

// Uso directo desde la terminal.
if (process.argv[1]?.endsWith('guardar-iconos.mjs')) {
  const carpetas = process.argv.slice(2);
  if (!carpetas.length) {
    console.error('Uso: node scripts/guardar-iconos.mjs <carpeta-del-ova> [otra-carpeta…]');
    process.exit(1);
  }
  let fallos = 0;
  for (const c of carpetas) {
    try {
      const { iconos, desconocidos } = guardarIconos(c);
      console.log(`✅ ${c}: ${iconos} ícono(s) guardados en iconos.css.`);
      if (desconocidos.length) console.log(`   ⚠️  Clases que no son íconos de Font Awesome 6.4 (revisa si son un error): ${desconocidos.map((d) => `fa-${d}`).join(', ')}`);
    } catch (e) {
      fallos++;
      console.error(`❌ ${c}: ${e.message}`);
    }
  }
  process.exit(fallos ? 1 : 0);
}
