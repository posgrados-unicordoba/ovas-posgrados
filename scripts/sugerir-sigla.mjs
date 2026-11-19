#!/usr/bin/env node
/**
 * Sugiere la sigla de un curso o de un programa con las reglas de la guía de
 * organización y revisa en catalogo.csv que no esté repetida.
 *
 * Curso:     node scripts/sugerir-sigla.mjs --nivel esp --programa gthdo --curso "Psicología Organizacional y Bienestar Humano"
 * Programa:  node scripts/sugerir-sigla.mjs --oficial EspGTHDO
 *
 * Reglas:
 *   - Programa: su sigla oficial (la de sus documentos, ej. FDOC_088-EspGTHDO),
 *     en minúsculas y sin la abreviatura del nivel (Esp, Mae, Doc): 2 a 5 letras.
 *   - Curso: las iniciales de las palabras importantes (sin artículos ni
 *     preposiciones), de 2 a 4 letras. Si ya existe en el mismo programa, se
 *     propone otra.
 *
 * Es una propuesta: la persona responsable la confirma. Una sigla registrada en
 * el catálogo no se cambia.
 */

import { NIVELES, SIGLA_PROGRAMA, SIGLA_CURSO, leerCatalogo } from './comun.mjs';

const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
const sinTildes = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const VACIAS = new Set(['y', 'e', 'o', 'u', 'de', 'del', 'la', 'las', 'el', 'los', 'en', 'para', 'por', 'a', 'al',
  'con', 'sin', 'sobre', 'entre', 'su', 'sus', 'un', 'una', 'unos', 'unas', 'lo', 'como', 'hacia', 'desde', 'segun']);

/** Sigla del programa a partir de la oficial: EspGTHDO → gthdo. */
export function siglaPrograma(oficial) {
  return sinTildes(oficial).replace(/^(esp|mae|doc)(?=[a-z]{2})/, '').replace(/[^a-z]/g, '');
}

/** Candidatas para la sigla de un curso, de la más natural a la menos. */
export function candidatasCurso(nombre) {
  const palabras = sinTildes(nombre).replace(/[^a-z0-9ñ\s-]/g, ' ').replace(/ñ/g, 'n')
    .split(/[\s-]+/).filter((p) => p && !VACIAS.has(p) && !/^\d+$/.test(p));
  if (!palabras.length) return [];
  const iniciales = palabras.map((p) => p[0]).join('');
  const out = [];
  const agregar = (s) => { if (SIGLA_CURSO.test(s) && !out.includes(s)) out.push(s); };
  if (palabras.length === 1) {
    for (const n of [3, 4, 2]) agregar(palabras[0].slice(0, n));
  } else {
    agregar(iniciales.slice(0, 4));
    // Alternativas: una letra más de la palabra principal (la primera).
    if (iniciales.length < 4) for (let i = 1; i < palabras[0].length; i++) agregar(palabras[0][0] + palabras[0][i] + iniciales.slice(1, 3));
    for (let i = 1; i < palabras[0].length; i++) agregar((palabras[0].slice(0, 1) + palabras[0][i] + iniciales.slice(1)).slice(0, 4));
    for (const p of palabras.slice(1)) for (let i = 1; i < p.length; i++) agregar((iniciales.slice(0, 3) + p[i]).slice(0, 4));
  }
  return out;
}

const { filas, error } = leerCatalogo(process.cwd());
if (error) { console.error(`❌ ${error}`); process.exit(1); }

if (opt('oficial')) {
  const s = siglaPrograma(opt('oficial'));
  if (!SIGLA_PROGRAMA.test(s)) {
    console.error(`❌ "${opt('oficial')}" da "${s}", que no tiene de 2 a 5 letras. Revisa la sigla oficial del programa.`);
    process.exit(1);
  }
  const usada = filas.filter((f) => f['sigla-programa'] === s);
  console.log(`\nSigla del programa: ${s}`);
  if (usada.length) console.log(`   Ya está en el catálogo (${[...new Set(usada.map((f) => `${f.nivel}: ${f.programa}`))].join('; ')}). Si es el mismo programa, úsala tal cual.`);
  else console.log('   Todavía no está en el catálogo: se registra con el primer curso del programa.');
  process.exit(0);
}

const nivel = opt('nivel');
const programa = opt('programa');
const curso = opt('curso');
if (!nivel || !programa || !curso) {
  console.error('Uso:  node scripts/sugerir-sigla.mjs --nivel esp --programa gthdo --curso "Nombre completo del curso"');
  console.error('      node scripts/sugerir-sigla.mjs --oficial EspGTHDO');
  process.exit(1);
}
if (!NIVELES[nivel]) { console.error('❌ El nivel debe ser esp, mae o doc.'); process.exit(1); }

const delPrograma = filas.filter((f) => f.nivel === nivel && f['sigla-programa'] === programa);
const mismoCurso = delPrograma.find((f) => sinTildes(f.curso) === sinTildes(curso));
if (mismoCurso) {
  console.log(`\nEse curso ya está en el catálogo con la sigla: ${mismoCurso['sigla-curso']}`);
  console.log(`   Ruta de sus OVA: ${nivel}/${programa}/${mismoCurso['sigla-curso']}/uNN/tNN`);
  process.exit(0);
}

const ocupadas = new Set(delPrograma.map((f) => f['sigla-curso']));
const candidatas = candidatasCurso(curso);
const libre = candidatas.find((c) => !ocupadas.has(c));
if (!libre) {
  console.error(`❌ No encontré una sigla libre de 2 a 4 letras para "${curso}". Elige una a mano y revisa que no esté en el catálogo.`);
  process.exit(1);
}

console.log(`\nSigla sugerida para "${curso}": ${libre}`);
if (libre !== candidatas[0]) console.log(`   (${candidatas[0]} ya la usa otro curso de ${programa}: ${delPrograma.find((f) => f['sigla-curso'] === candidatas[0]).curso})`);
const otras = candidatas.filter((c) => c !== libre && !ocupadas.has(c)).slice(0, 3);
if (otras.length) console.log(`   Otras opciones libres: ${otras.join(', ')}`);
console.log(`\nRuta de sus OVA: ${nivel}/${programa}/${libre}/uNN/tNN`);
if (!delPrograma.length) console.log(`\n⚠️  El programa "${programa}" (${nivel}) todavía no está en el catálogo. Revisa que sea su sigla oficial.`);
console.log(delPrograma.length
  ? `Al migrar el primer OVA, agrega --curso "${curso}" y el curso queda registrado en catalogo.csv.\n`
  : `Al migrar el primer OVA, agrega --programa "Nombre completo del programa" --curso "${curso}" y quedan registrados en catalogo.csv.\n`);
