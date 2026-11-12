#!/usr/bin/env node
/**
 * Genera ENLACES-OVAS.md: el enlace público de cada OVA de posgrado,
 * organizado por nivel, programa, curso y unidad.
 *
 * - Encuentra los OVA igual que el validador (carpeta con index.html).
 * - Toma los nombres de programas y cursos de catalogo.csv.
 * - Toma el nombre de cada OVA de su <title>.
 * - Ordena por carpeta (u01, u02… / t01, t02…), que ya es el orden del curso.
 *
 * Uso local:   node scripts/generar-enlaces.mjs
 *              node scripts/generar-enlaces.mjs --check   → no escribe; sale con
 *                                                           código 1 si está viejo
 * En CI:       lo ejecuta .github/workflows/enlaces.yml en cada push a main y
 *              commitea el resultado si cambió.
 *
 * La salida es determinista (sin fechas), para que CI solo commitee cuando de
 * verdad cambió algo.
 */

import { writeFileSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  NIVELES, leer, rel, encontrarOvas, partesRuta, codigoDe, leerCatalogo, buscarEnCatalogo, tituloDe,
} from './comun.mjs';

const ROOT = process.cwd();
const SALIDA = join(ROOT, 'ENLACES-OVAS.md');
const BASE = 'https://posgrados-unicordoba.github.io/ovas-posgrados';

const { filas, error } = leerCatalogo(ROOT);
if (error) console.warn(`⚠️  ${error} Se mostrarán las siglas en lugar de los nombres.`);

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
    url: `${BASE}/${r}/`,
  });
}
ovas.sort((a, b) => a.ruta.localeCompare(b.ruta));

const L = [
  '# Enlaces de los OVA de posgrado',
  '',
  `Todos los OVA están publicados en GitHub Pages sobre <${BASE}/>.`,
  'Cada enlace abre el OVA directamente en el navegador.',
  '',
  '> ⚙️ **Este archivo se genera solo.** Lo actualiza `scripts/generar-enlaces.mjs`',
  '> en cada push a `main`. No lo edites a mano: los cambios se perderían.',
  '> Los nombres de programas y cursos salen de `catalogo.csv`.',
  '',
];

const unicos = (arr) => [...new Set(arr)];
for (const nivel of Object.keys(NIVELES)) {
  const delNivel = ovas.filter((o) => o.nivel === nivel);
  if (!delNivel.length) continue;
  L.push(`## ${NIVELES[nivel]}`, '');
  for (const prog of unicos(delNivel.map((o) => o.programa))) {
    const delProg = delNivel.filter((o) => o.programa === prog);
    L.push(`### ${delProg[0].nombrePrograma} (\`${prog}\`)`, '');
    for (const cur of unicos(delProg.map((o) => o.curso))) {
      const delCurso = delProg.filter((o) => o.curso === cur);
      L.push(`#### ${delCurso[0].nombreCurso} (\`${cur}\`) · ${delCurso.length} OVA`, '');
      for (const uni of unicos(delCurso.map((o) => o.unidad))) {
        L.push(`**Unidad ${uni.slice(1)}**`, '');
        for (const o of delCurso.filter((x) => x.unidad === uni))
          L.push(`- [${o.titulo}](${o.url}) · \`${o.codigo}\``);
        L.push('');
      }
    }
  }
}
L.push('---', '', `**${ovas.length} OVA enlazados.**`, '');
const contenido = L.join('\n');

// Se comparan los saltos de línea normalizados (en Windows git puede bajar el
// archivo con CRLF y no por eso está desactualizado).
const anterior = existsSync(SALIDA) ? readFileSync(SALIDA, 'utf8').replace(/\r\n/g, '\n') : null;
if (anterior === contenido) {
  console.log(`✅ ENLACES-OVAS.md ya está al día (${ovas.length} OVA).`);
  process.exit(0);
}
if (process.argv.includes('--check')) {
  console.error('🚫 ENLACES-OVAS.md está desactualizado. Ejecuta: node scripts/generar-enlaces.mjs');
  process.exit(1);
}
writeFileSync(SALIDA, contenido, 'utf8');
console.log(`✏️  ENLACES-OVAS.md actualizado: ${ovas.length} OVA enlazados.`);
