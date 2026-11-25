# OVA de posgrado

Repositorio de los objetos virtuales de aprendizaje (OVA) de los programas de posgrado.

Los OVA se publican en <https://posgrados-unicordoba.github.io/ovas-posgrados/> para enlazarlos desde Moodle. Esa dirección muestra una portada sin enlaces y ninguna página se deja indexar en los buscadores.

**Listado con el enlace de cada OVA:** no se publica. Para verlo, en la raíz del repositorio corre `node scripts/generar-enlaces.mjs` y abre `sitio/index.html` en el navegador.

## Estructura

Cada OVA vive en una ruta de cinco niveles: nivel / programa / curso / unidad / tema.

```
ovas-posgrados/
├── README.md
├── catalogo.csv
├── logos/            (logo de CINTIA para las especializaciones)
├── scripts/          (validar, migrar, quemar Tailwind, generar enlaces)
├── esp/        (especialización)
├── mae/        (maestría)
└── doc/        (doctorado)
```

Ejemplo: `esp/gthdo/pobh/u01/t01/`

Si un curso tiene un solo OVA por unidad, la ruta termina en la unidad: `esp/gthdo/pobh/u01/`.

Además de los OVA de tema, un curso puede tener:

| Carpeta | Qué es | ¿Obligatorio? |
|---|---|---|
| `uNN/presentacion/` | Presentación de la unidad (propósito, objetivos y ruta de sus temas). | No |
| `uNN/diagnostico/` | Diagnóstico de la unidad. No lleva el menú de 7 secciones. | No |
| `uNN/actividades/` | Actividades evaluativas de la unidad. No lleva el menú de 7 secciones. | No |
| `bibliografia/` | Bibliografía del curso | Sí |
| `rubrica/` | Rúbrica del curso (si hay una por unidad, van todas en la misma página) | Sí |
| `mapa/` | Mapa conceptual del curso | No |

```
esp/gthdo/pobh/
├── u01/t01 … t05
├── u01/diagnostico
├── u01/actividades
├── bibliografia
├── rubrica
└── mapa
```

## Convenciones

- Todo en minúsculas, sin tildes, sin ñ y sin espacios.
- Guion medio (`-`) como separador, nunca guion bajo (`_`).
- Los programas se nombran con las iniciales de las palabras importantes de su nombre, sin el nivel, de 2 a 5 letras (Gerencia del Talento Humano y Desarrollo Organizacional → `gthdo`). Para sugerirla: `node scripts/sugerir-sigla.mjs --nombre-programa "Nombre del programa"`.
- Los cursos se nombran con una sigla de 2 a 4 letras; si van en secuencia, terminan en su número (Metodología de la investigación I → `mi1`).
- Si el programa o el curso ya tiene una sigla interna, se usa esa (con el mismo formato); el script solo sugiere una cuando no la hay.
- Toda sigla se registra en `catalogo.csv`.
- Unidades y temas con dos dígitos: `u01`, `t01`.
- Cada OVA contiene `README.md`, `index.html`, `estilos.css`, `script.js`, `tailwind.css`, `iconos.css` (si usa íconos) y la carpeta `img/`.
- `tailwind.css` se quema con solo las clases que usa el OVA: `node scripts/quemar-tailwind.mjs <ruta-del-ova>`. Nunca se carga Tailwind desde `cdn.tailwindcss.com`.
- En el `<head>`, `estilos.css` va antes que `tailwind.css` (el orden en que cargaba el CDN).
- Los íconos de Font Awesome se guardan en `iconos.css` con `node scripts/guardar-iconos.mjs <ruta-del-ova>`: solo los que usa el OVA, sin cargarlos de internet.
- El logo va en `img/logo.webp`: CINTIA en especializaciones, el del programa en maestrías y doctorados. Los recursos del curso (bibliografía, rúbrica, mapa) no llevan logo.
- Todo OVA carga el plugin de accesibilidad justo antes de `</body>`: `<script src="https://elens.ecodestudio.dev/elens.js"></script>`. No se agregan controles de voz propios.
- Código del OVA: `gthdo-pobh-u01-t01` (o `gthdo-pobh-u01` si es por unidad). Los complementos de la unidad: `gthdo-pobh-u01-diagnostico`, `gthdo-pobh-u01-actividades`. Los recursos del curso: `gthdo-pobh-bibliografia`, `gthdo-pobh-rubrica`, `gthdo-pobh-mapa`.
- Los mensajes de commit empiezan por el código del OVA: `gthdo-pobh-u01-t01: corrige enlaces de la actividad 2`.

## Catálogo

`catalogo.csv` registra la sigla y el nombre completo de cada programa y curso. Antes de crear la carpeta de un curso nuevo, se agrega su fila. Una sigla asignada no se cambia.

## Scripts

Requieren [Node.js](https://nodejs.org). La primera vez, en la raíz del repositorio: `npm install`.

| Comando | Para qué |
|---|---|
| `node scripts/validar-ova.mjs` | Revisa que cada OVA cumpla las reglas. Corre solo en cada Pull Request. |
| `node scripts/migrar-ova.mjs <carpeta-original> <ruta-destino>` | Lleva un OVA existente a la estructura del repositorio. |
| `node scripts/quemar-tailwind.mjs <ruta-del-ova>` | Vuelve a generar el `tailwind.css` de un OVA. |
| `node scripts/guardar-iconos.mjs <ruta-del-ova>` | Vuelve a generar el `iconos.css` de un OVA. |
| `node scripts/generar-enlaces.mjs` | Arma en `sitio/` el listado de OVA con sus enlaces, para verlo en tu computador (no se publica). En GitHub corre sola en cada push a `main` y publica los OVA con una portada sin enlaces. |
