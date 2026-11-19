# Contexto para agentes de IA: OVA de posgrado

Este archivo es para un agente de IA (Claude u otro) que crea, migra o corrige un Objeto
Virtual de Aprendizaje (OVA) de este repositorio. Cumple **todas** las reglas de abajo: el
validador (`scripts/validar-ova.mjs`) bloquea el Pull Request si falta alguna obligatoria.

Los OVA son de programas de posgrado (especializaciones, maestrías y doctorados) de la
Universidad de Córdoba, producidos por CINTIA (Centro de Innovación en TIC para el apoyo
de la Docencia). El público son profesionales; el OVA se incrusta en el aula virtual.

---

## 1. Dónde va y cómo se llama

- Ruta: `nivel/programa/curso/uNN/tNN/` (ej.: `esp/gthdo/pobh/u02/t03/`).
  Si el curso tiene un OVA por unidad: `nivel/programa/curso/uNN/`. Un curso usa un solo tipo.
- Complementos de la unidad (opcionales): `nivel/programa/curso/uNN/diagnostico/` y `uNN/actividades/`.
- Recursos del curso: `nivel/programa/curso/bibliografia/`, `rubrica/` (obligatorios) y
  `mapa/` (opcional). Si hay una rúbrica por unidad, van todas en la misma página.
- Nivel: `esp` (especialización), `mae` (maestría) o `doc` (doctorado).
- Siglas: programa de 2 a 5 letras (su sigla oficial), curso de 2 a 4. Ambas deben estar
  en `catalogo.csv`. No inventes siglas: si no están, pregunta.
- Código del OVA: `programa-curso-uNN-tNN` (ej.: `gthdo-pobh-u02-t03`); `gthdo-pobh-u02-diagnostico`
  para un complemento de la unidad; `gthdo-pobh-rubrica` para un recurso del curso.
- Todo archivo y carpeta en minúsculas, sin tildes, sin ñ, sin espacios, con guion medio.
  Nunca guion bajo. Ej.: `img/mapa-procesos.png`.

## 2. Archivos del OVA

| Archivo | Regla |
|---|---|
| `README.md` | Primera línea `# <título>`, igual al `<title>` del HTML. Línea `**Código:** <código>`. Sin nombres de diseñadores ni docentes |
| `index.html` | Solo marcado. Sin bloques `<style>` ni `<script>` con código |
| `estilos.css` | Todos los estilos propios |
| `script.js` | Todo el JavaScript, en un solo archivo |
| `tailwind.css` | Generado. No lo edites: `node scripts/quemar-tailwind.mjs <ruta-del-ova>` |
| `iconos.css` | Generado. No lo edites: `node scripts/guardar-iconos.mjs <ruta-del-ova>` |
| `img/` | `logo.webp`, QR (`qr-01.png`…) y demás imágenes |

Orden en el `<head>`:

```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="iconos.css">
<link rel="stylesheet" href="estilos.css">
<link rel="stylesheet" href="tailwind.css">
```

Al final del `<body>`:

```html
<script src="script.js"></script>
<script src="https://elens.ecodestudio.dev/elens.js"></script>
</body>
```

**Nunca:**

- Cargar Tailwind desde `cdn.tailwindcss.com` ni Font Awesome desde internet.
- Generar QR desde internet (`api.qrserver.com`). Los QR son imágenes PNG en `img/`.
- Usar rutas absolutas (`C:\Users\…`, `file://`). Todas las rutas son relativas a la carpeta del OVA.
- Agregar lectura por voz propia (`speechSynthesis`): la da el plugin `elens.js`.
- Poner nombres de personas (diseñadores, docentes) en el OVA o en su README.

Si cambias clases de Tailwind o agregas íconos, vuelve a generar `tailwind.css` e `iconos.css`.

## 3. Estructura del OVA

- El contenido va dentro de `<div id="ova-embed">`. `tailwind.css` se quema para aplicar
  solo ahí, así no choca con los estilos del aula virtual.
- Tipografía Poppins. Los colores se pueden personalizar; no hay paleta obligatoria.
- Logo en `img/logo.webp`: el de CINTIA (`logos/cintia.webp`) en especializaciones; el del
  programa en maestrías y doctorados. Los recursos del curso (bibliografía, rúbrica, mapa)
  no llevan logo.
- Un solo pie de página de créditos, al final: Centro de Innovación en TIC para el apoyo
  de la Docencia CINTIA – Universidad de Córdoba.
- Siete secciones, con estos `id` y en este orden:
  `introduccion`, `objetivos`, `contenido`, `actividad` (o `actividades`), `evaluacion`,
  `recursos`, `bibliografia`. **Solo en los OVA de tema (o de unidad).** Los complementos de
  la unidad y los recursos del curso no llevan este menú ni autoevaluación, pero cumplen todas
  las demás reglas de este archivo (archivos, pie, accesibilidad, enlaces, QR).

## 4. Componente de cada sección

| Sección | Componente | Criterio pedagógico y de accesibilidad (DUA) |
|---|---|---|
| Encabezado | Encabezado institucional de bienvenida | Portada del módulo con el nombre de la unidad y el tema, en un `<h1>`/`<h2>` visible. Fondo de color institucional y fuente nítida |
| `introduccion` | Tarjeta de ambientación y video de apertura | Bloques breves que sitúan al estudiante, plantean el reto o pregunta central y anticipan el producto final. Si hay video: subtítulos propios y sincronizados, y descarga o transcripción |
| `objetivos` | Cuadros de metas de aprendizaje con íconos | Verbos en infinitivo de orden superior (taxonomía SOLO): Analizar, Aplicar, Diseñar, Evaluar, Argumentar, Proponer… No uses Identificar, Definir, Enumerar, Describir. Un ícono por meta, sin saturar |
| `contenido` | Acordeones, pestañas colapsables y tarjetas giratorias | Bloques cortos para evitar la fatiga visual. Figuras con título, tamaño legible y crédito de autoría |
| `actividad` | Vistas fragmentadas (1 a 2 ítems por pantalla) | Cajas con bordes de 1.5 a 2 pt (2 a 3 px) y buen contraste. Instrucciones paso a paso. Navegación completa con teclado |
| `evaluacion` | Cuestionario de 1 pregunta por página | Entre 3 y 10 preguntas. Retroalimentación que explica la respuesta correcta y cada distractor (una `explicacion` por opción, visible al final) |
| `recursos` | Tarjeta de recurso complementario | Enlace activo que abre en pestaña nueva y QR local de al menos 2 × 2 cm |
| `bibliografia` | Tarjetas de fuentes documentales | Una tarjeta por fuente con autor, año y título, y un enlace que abre en pestaña nueva |

Formato de las preguntas de la autoevaluación en `script.js`:

```js
const quizQuestions = [
  {
    question: "¿…?",
    options: [
      { value: "a", text: "…", explicacion: "Por qué esta opción es correcta o incorrecta." },
      { value: "b", text: "…", explicacion: "…" },
      { value: "c", text: "…", explicacion: "…" }
    ],
    correct: "a"
  }
];
```

## 5. Accesibilidad (lista de verificación de CINTIA)

- **Teclado:** todo lo que se pulsa es `<button>` o `<a>` (o lleva `tabindex="0"` y
  `role="button"` y responde a Enter y Espacio). Nada de `tabindex` mayor que 0.
- **Foco visible:** estilo `:focus-visible` claro en `estilos.css`.
- **Foco al contenido:** al cambiar de sección, pestaña o paso, mueve el foco al título del
  contenido nuevo (`tabindex="-1"` y `.focus()`).
- **Estado:** acordeones y botones que despliegan llevan `aria-expanded`; las pestañas,
  `aria-selected`; las opciones elegidas, `aria-pressed`.
- **Lo que se revela al pasar el mouse** (tarjetas giratorias, detalles) también se revela
  con el foco y con Enter.
- **Bordes:** las cajas de actividad, de 1.5 a 2 pt con contraste visible.
- **Máximo 2 elementos interactivos por vista.**
- **Textos largos:** en paneles colapsables.
- **Enlaces externos:** siempre `target="_blank" rel="noopener"`, y deben funcionar.
- **QR:** imagen local de al menos 2 × 2 cm (`style="width:2cm;height:2cm"` o 76 px o más).
- **Videos:** `<track kind="captions" srclang="es">` con subtítulos propios y sincronizados.

## 6. Al terminar

```
node scripts/quemar-tailwind.mjs <ruta-del-ova>
node scripts/guardar-iconos.mjs <ruta-del-ova>
node scripts/validar-ova.mjs <ruta-del-ova>
```

Corrige todos los errores (❌) y, en lo posible, las advertencias (⚠️). Si migras un OVA
existente, usa `node scripts/migrar-ova.mjs <carpeta-original> <ruta-destino>`, que hace la
mayor parte del trabajo.
