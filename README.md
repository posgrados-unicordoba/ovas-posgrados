# OVA de posgrado

Repositorio de los objetos virtuales de aprendizaje (OVA) de los programas de posgrado.

## Estructura

Cada OVA vive en una ruta de cinco niveles: nivel / programa / curso / unidad / tema.

```
ovas-posgrados/
├── README.md
├── catalogo.csv
├── esp/        (especialización)
├── mae/        (maestría)
└── doc/        (doctorado)
```

Ejemplo: `esp/gp/gth/u01/t01/`

Si un curso tiene un solo OVA por unidad, la ruta termina en la unidad: `esp/gp/gth/u01/`.

## Convenciones

- Todo en minúsculas, sin tildes, sin ñ y sin espacios.
- Guion medio (`-`) como separador, nunca guion bajo (`_`).
- Programas y cursos se nombran con una sigla de 2 a 4 letras registrada en `catalogo.csv`.
- Unidades y temas con dos dígitos: `u01`, `t01`.
- Cada OVA contiene `README.md`, `index.html`, `estilos.css`, `script.js` y, si las usa, la carpeta `img/`.
- Código del OVA: `gp-gth-u01-t01` (o `gp-gth-u01` si es por unidad).
- Los mensajes de commit empiezan por el código del OVA: `gp-gth-u01-t01: corrige enlaces de la actividad 2`.

## Catálogo

`catalogo.csv` registra la sigla y el nombre completo de cada programa y curso. Antes de crear la carpeta de un curso nuevo, se agrega su fila. Una sigla asignada no se cambia.
