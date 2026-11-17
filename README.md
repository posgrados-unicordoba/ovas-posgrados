# OVA de posgrado

Repositorio de los objetos virtuales de aprendizaje (OVA) de los programas de posgrado.

**Listado de todos los OVA publicados:** <https://posgrados-unicordoba.github.io/ovas-posgrados/>
Esa página se actualiza sola cada vez que entra un OVA nuevo a `main`.

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

## Convenciones

- Todo en minúsculas, sin tildes, sin ñ y sin espacios.
- Guion medio (`-`) como separador, nunca guion bajo (`_`).
- Los programas usan su sigla oficial de la universidad, en minúsculas y sin la abreviatura del nivel (EspGTHDO → `gthdo`), de 2 a 5 letras.
- Los cursos se nombran con una sigla de 2 a 4 letras.
- Toda sigla se registra en `catalogo.csv`.
- Unidades y temas con dos dígitos: `u01`, `t01`.
- Cada OVA contiene `README.md`, `index.html`, `estilos.css`, `script.js`, `tailwind.css`, `iconos.css` (si usa íconos) y la carpeta `img/`.
- `tailwind.css` se quema con solo las clases que usa el OVA: `node scripts/quemar-tailwind.mjs <ruta-del-ova>`. Nunca se carga Tailwind desde `cdn.tailwindcss.com`.
- En el `<head>`, `estilos.css` va antes que `tailwind.css` (el orden en que cargaba el CDN).
- Los íconos de Font Awesome se guardan en `iconos.css` con `node scripts/guardar-iconos.mjs <ruta-del-ova>`: solo los que usa el OVA, sin cargarlos de internet.
- El logo va en `img/logo.webp`: CINTIA en especializaciones, el del programa en maestrías y doctorados.
- Todo OVA carga el plugin de accesibilidad justo antes de `</body>`: `<script src="https://elens.ecodestudio.dev/elens.js"></script>`. No se agregan controles de voz propios.
- Código del OVA: `gthdo-pobh-u01-t01` (o `gthdo-pobh-u01` si es por unidad).
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
| `node scripts/generar-enlaces.mjs` | Arma en `sitio/` la página con el listado de OVA, para verla en tu computador. En GitHub corre sola en cada push a `main` y se publica. |
