/**
 * Funciones compartidas por los scripts del repositorio de OVA de posgrado.
 * Solo usa módulos nativos de Node: no hay que instalar nada para usarlas.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

export const NIVELES = { esp: 'Especialización', mae: 'Maestría', doc: 'Doctorado' };

/** Carpetas que nunca son OVA. */
export const IGNORAR = new Set(['plantilla', 'scripts', 'logos', 'node_modules', '.git', '.github']);

export const SIGLA_PROGRAMA = /^[a-z]{2,5}$/;
export const SIGLA_CURSO = /^[a-z]{2,4}$/;
export const UNIDAD = /^u\d{2}$/;
export const TEMA = /^t\d{2}$/;

export const QUEMAR = 'node scripts/quemar-tailwind.mjs <carpeta-del-ova>';

/** Lee un archivo de texto sin el BOM que deja el Bloc de notas de Windows. */
export function leer(ruta) {
  return readFileSync(ruta, 'utf8').replace(/^﻿/, '');
}

/** Ruta con "/" aunque se ejecute en Windows. */
export const rel = (root, ruta) => relative(root, ruta).split(sep).join('/');

/** Carpetas que contienen un index.html dentro de esp/, mae/ y doc/. */
export function encontrarOvas(root) {
  const acc = [];
  const recorrer = (dir) => {
    for (const name of readdirSync(dir).sort()) {
      if (name.startsWith('.') || IGNORAR.has(name)) continue;
      const full = join(dir, name);
      if (!statSync(full).isDirectory()) continue;
      if (existsSync(join(full, 'index.html'))) acc.push(full);
      else recorrer(full);
    }
  };
  for (const nivel of Object.keys(NIVELES)) {
    const base = join(root, nivel);
    if (existsSync(base)) recorrer(base);
  }
  return acc;
}

/**
 * Interpreta la ruta de un OVA. Devuelve null si no tiene 4 ni 5 niveles.
 *   esp/gthdo/pobh/u02/t03  → por tema
 *   esp/gthdo/pobh/u02      → por unidad
 */
export function partesRuta(rutaRelativa) {
  const p = rutaRelativa.split('/');
  if (p.length !== 4 && p.length !== 5) return null;
  const [nivel, programa, curso, unidad, tema = null] = p;
  return { nivel, programa, curso, unidad, tema, tipo: tema ? 'tema' : 'unidad' };
}

/** Código único del OVA: gthdo-pobh-u02-t03 (o gthdo-pobh-u02 si es por unidad). */
export function codigoDe({ programa, curso, unidad, tema }) {
  return [programa, curso, unidad, tema].filter(Boolean).join('-');
}

/** Lee catalogo.csv. Admite comillas para nombres con comas. */
export function leerCatalogo(root) {
  const f = join(root, 'catalogo.csv');
  if (!existsSync(f)) return { filas: [], error: 'No existe catalogo.csv en la raíz del repositorio.' };
  const lineas = leer(f).split(/\r?\n/).filter((l) => l.trim());
  const celdas = (linea) => {
    const out = []; let cur = ''; let q = false;
    for (let i = 0; i < linea.length; i++) {
      const c = linea[i];
      if (q) {
        if (c === '"' && linea[i + 1] === '"') { cur += '"'; i++; }
        else if (c === '"') q = false;
        else cur += c;
      } else if (c === '"') q = true;
      else if (c === ',') { out.push(cur.trim()); cur = ''; }
      else cur += c;
    }
    out.push(cur.trim());
    return out;
  };
  const cab = celdas(lineas[0] || '');
  const filas = lineas.slice(1).map((l) => {
    const v = celdas(l);
    return Object.fromEntries(cab.map((k, i) => [k, v[i] ?? '']));
  });
  return { filas, cabecera: cab };
}

/** Busca el programa y el curso de un OVA en el catálogo. */
export function buscarEnCatalogo(filas, { nivel, programa, curso }) {
  const delPrograma = filas.filter((f) => f.nivel === nivel && f['sigla-programa'] === programa);
  const delCurso = delPrograma.find((f) => f['sigla-curso'] === curso);
  return {
    programa: delPrograma[0]?.programa || null,
    curso: delCurso?.curso || null,
  };
}

/** Texto del <title>, con los espacios colapsados. */
export function tituloDe(html) {
  const m = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
  return m ? m[1].replace(/\s+/g, ' ').trim() : '';
}

/** Texto plano de un fragmento HTML. */
export const aTexto = (frag) => frag.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

// --- Íconos de Font Awesome -------------------------------------------------
/** Clases fa-… que indican el estilo, no un ícono. */
export const FA_ESTILOS = new Set(['fa', 'solid', 'regular', 'brands', 'classic', 'sharp', 'light', 'thin', 'duotone']);
/** Clases fa-… de utilidades (tamaño, giro, animación), no íconos. */
export const FA_UTILIDADES = new Set([
  'fw', '2xs', 'xs', 'sm', 'lg', 'xl', '2xl', ...Array.from({ length: 10 }, (_, i) => `${i + 1}x`),
  'spin', 'spin-pulse', 'spin-reverse', 'pulse', 'beat', 'fade', 'beat-fade', 'bounce', 'flip', 'shake',
  'rotate-90', 'rotate-180', 'rotate-270', 'rotate-by', 'flip-horizontal', 'flip-vertical', 'flip-both',
  'border', 'pull-left', 'pull-right', 'li', 'ul', 'stack', 'stack-1x', 'stack-2x', 'inverse', 'width-auto',
]);

/** Textos donde puede haber clases: atributos class="…" y cadenas del JavaScript. */
export function fragmentosConClases(texto) {
  const out = [];
  for (const m of texto.matchAll(/class=(["'])([^"']*)\1/g)) out.push(m[2]);
  for (const m of texto.matchAll(/(["'`])((?:(?!\1)[^\\\n]|\\.)*?)\1/g)) if (m[2].includes('fa-')) out.push(m[2]);
  return out;
}

/** Íconos que usa un OVA: [{ nombre, estilo }] (estilo: solid, regular o brands). */
export function iconosUsados(texto) {
  const vistos = new Map();
  for (const f of fragmentosConClases(texto)) {
    if (!/(?<![a-z0-9-])fa-(solid|regular|brands)\b|(?<![a-z0-9-])fa[srb]\b|(?<![a-z0-9-])fa-[a-z]/.test(f)) continue;
    const estilo = /\b(fa-regular|far)\b/.test(f) ? 'regular' : /\b(fa-brands|fab)\b/.test(f) ? 'brands' : 'solid';
    for (const m of f.matchAll(/(?<![a-z0-9-])fa-([a-z0-9]+(?:-[a-z0-9]+)*)/g)) {
      const n = m[1];
      if (FA_ESTILOS.has(n) || FA_UTILIDADES.has(n)) continue;
      vistos.set(`${estilo}:${n}`, { nombre: n, estilo });
    }
  }
  return [...vistos.values()];
}
