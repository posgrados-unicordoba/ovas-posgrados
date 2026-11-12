#!/usr/bin/env node
/**
 * Quema el tailwind.css de un OVA: un archivo con SOLO las clases de Tailwind
 * que usan su index.html y su script.js. Así el OVA no depende del CDN
 * (cdn.tailwindcss.com) ni carga Tailwind completo.
 *
 * Uso:   node scripts/quemar-tailwind.mjs esp/gthdo/pobh/u02/t03
 *        (se pueden pasar varias carpetas)
 *
 * Por qué un script y no solo el comando de npx: los OVA de posgrado se
 * incrustan en el aula virtual dentro de <div id="ova-embed">. Para no chocar
 * con los estilos del aula, Tailwind tiene que (1) aplicar sus clases solo
 * dentro de #ova-embed y (2) no tocar los estilos base de la página. Con el
 * CDN eso se configuraba en el propio HTML; al quemar, hay que pasárselo a la
 * herramienta. Este script lo hace solo cuando el OVA tiene id="ova-embed".
 *
 * Requiere Node.js. La primera vez, npx descarga Tailwind 3.4.17.
 */

import { existsSync, writeFileSync, rmSync, mkdtempSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { leer } from './comun.mjs';

export function quemarTailwind(dirOva) {
  const dir = resolve(dirOva);
  const indice = join(dir, 'index.html');
  if (!existsSync(indice)) throw new Error(`No hay index.html en ${dirOva}`);

  const incrustado = /id=["']ova-embed["']/.test(leer(indice));
  const contenido = join(dir, '**/*.{html,js}').split('\\').join('/');
  const config = {
    content: [contenido, `!${join(dir, 'tailwind.css').split('\\').join('/')}`],
    ...(incrustado ? { important: '#ova-embed', corePlugins: { preflight: false } } : {}),
  };

  const tmp = mkdtempSync(join(tmpdir(), 'quemar-'));
  const archivoConfig = join(tmp, 'tailwind.config.cjs');
  writeFileSync(archivoConfig, `module.exports = ${JSON.stringify(config, null, 2)};\n`);

  // En Windows npx se ejecuta a través de la consola: las rutas van entre comillas.
  const win = process.platform === 'win32';
  const q = (s) => (win ? `"${s}"` : s);
  const r = spawnSync(
    'npx',
    ['--yes', 'tailwindcss@3.4.17', '-c', q(archivoConfig), '-o', q(join(dir, 'tailwind.css')), '--minify'],
    { stdio: ['ignore', 'pipe', 'pipe'], shell: win, encoding: 'utf8' },
  );
  rmSync(tmp, { recursive: true, force: true });
  if (r.status !== 0) throw new Error(`Tailwind falló en ${dirOva}:\n${r.stderr || r.stdout}`);
  return { incrustado };
}

// Uso directo desde la terminal.
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('quemar-tailwind.mjs')) {
  const carpetas = process.argv.slice(2);
  if (!carpetas.length) {
    console.error('Uso: node scripts/quemar-tailwind.mjs <carpeta-del-ova> [otra-carpeta…]');
    process.exit(1);
  }
  let fallos = 0;
  for (const c of carpetas) {
    try {
      const { incrustado } = quemarTailwind(c);
      console.log(`✅ ${c}: tailwind.css quemado${incrustado ? ' (solo dentro de #ova-embed)' : ''}.`);
    } catch (e) {
      fallos++;
      console.error(`❌ ${e.message}`);
    }
  }
  process.exit(fallos ? 1 : 0);
}
