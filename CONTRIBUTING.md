# Cómo agregar o actualizar un OVA

Esta guía explica, paso a paso, cómo subir un OVA de posgrado a este repositorio.
Las reglas de nombres y carpetas están resumidas en el [README](README.md).

Ningún OVA entra a `main` directamente: todo cambio llega por un **Pull Request (PR)**.
Cada PR pasa por el **validador** (`scripts/validar-ova.mjs`), que GitHub ejecuta solo,
y por la **aprobación** de la responsable del repositorio. Si el validador encuentra un
error, el PR no se puede fusionar hasta corregirlo.

---

## 1. Antes de empezar (una sola vez)

1. Instala [Node.js](https://nodejs.org) (versión 20 o superior).
2. Descarga el repositorio en tu computador (por ejemplo, con GitHub Desktop).
3. En la carpeta del repositorio, abre una terminal y ejecuta:

   ```
   npm install
   ```

   Esto instala las herramientas que usan los scripts: Tailwind, los íconos de
   Font Awesome y el generador de códigos QR.

---

## 2. Registrar el curso en el catálogo

Si el curso es nuevo, agrega su fila al final de `catalogo.csv` **antes** de crear la carpeta:

```
nivel,sigla-programa,programa,sigla-curso,curso,fecha,responsable
esp,gthdo,Gerencia del Talento Humano y Desarrollo Organizacional,pobh,Psicología Organizacional y Bienestar Humano,2026-11-10,Mónica Trochez
```

- **Programa:** su sigla oficial de la universidad, en minúsculas y sin la abreviatura del nivel (EspGTHDO → `gthdo`), de 2 a 5 letras.
- **Curso:** de 2 a 4 letras, con las iniciales de las palabras importantes (Psicología Organizacional y Bienestar Humano → `pobh`).
- Si un nombre tiene comas, va entre comillas: `"Gestión, cambio y cultura"`.
- Una sigla asignada **no se cambia**.

---

## 3. Migrar un OVA que ya existe

Para llevar un OVA existente a la estructura del repositorio:

```
node scripts/migrar-ova.mjs "<carpeta del OVA original>" <ruta-destino>
```

Ejemplo:

```
node scripts/migrar-ova.mjs "C:\Users\monic\Documents\Tema3" esp/gthdo/pobh/u02/t03
```

Si el curso todavía no está en el catálogo, agrega `--programa "…"` y `--curso "…"` y el
script lo registra.

El script no toca la carpeta original. En la copia nueva:

1. Separa los estilos en `estilos.css` y el JavaScript en `script.js`.
2. Quita el CDN de Tailwind y genera `tailwind.css` solo con las clases del OVA.
3. Guarda en `iconos.css` los íconos de Font Awesome que usa el OVA.
4. Convierte los códigos QR en imágenes locales (`img/qr-01.png`…).
5. Deja el logo en `img/logo.webp` (en especializaciones, el de CINTIA).
6. Agrega el plugin de accesibilidad `elens.js`.
7. Hace que los enlaces externos abran en pestaña nueva.
8. Crea el `README.md` del OVA.
9. Valida el resultado y muestra lo que falta corregir.

Los archivos de Office (la guía del curso, el formato 088) se quedan fuera: el repositorio
solo guarda el OVA.

---

## 4. Crear o editar un OVA

Cada OVA vive en su carpeta, `nivel/programa/curso/uNN/tNN/`, con estos archivos:

| Archivo | Qué contiene |
|---|---|
| `README.md` | Título, código y datos del OVA, y su historial de versiones |
| `index.html` | El contenido del OVA |
| `estilos.css` | Los estilos propios del OVA |
| `script.js` | Todo el JavaScript (no se deja código dentro del HTML) |
| `tailwind.css` | Las clases de Tailwind que usa el OVA. **No se edita a mano** |
| `iconos.css` | Los íconos de Font Awesome que usa el OVA. **No se edita a mano** |
| `img/` | `logo.webp`, los QR y demás imágenes |

En el `<head>` del `index.html`, el orden es: `iconos.css`, `estilos.css`, `tailwind.css`.

**Cada vez que cambies clases de Tailwind o agregues un ícono**, vuelve a generar sus archivos:

```
node scripts/quemar-tailwind.mjs esp/gthdo/pobh/u02/t03
node scripts/guardar-iconos.mjs esp/gthdo/pobh/u02/t03
```

Si trabajas con un agente de IA, pásale el archivo [`context.md`](context.md): tiene todas
las reglas técnicas y de accesibilidad de un OVA.

---

## 5. Validar en tu computador

Antes de subir, ejecuta el validador:

```
node scripts/validar-ova.mjs esp/gthdo/pobh/u02/t03
```

- ❌ **Errores:** bloquean el PR. Hay que corregirlos.
- ⚠️ **Advertencias:** no bloquean, pero conviene revisarlas.

Al final, el validador imprime un bloque por OVA listo para pegar en un agente de IA,
con cada problema y su solución.

Si no tienes internet, agrega `--sin-enlaces`: el validador se salta la comprobación de
enlaces externos (en GitHub siempre se hace).

---

## 6. Subir el OVA

1. Crea una rama nueva con el código del OVA (ej.: `gthdo-pobh-u02-t03`).
2. Haz commit con un mensaje que empiece por el código:
   `gthdo-pobh-u02-t03: agrega el OVA del tema 3`.
3. Abre un Pull Request hacia `main` y completa la lista de verificación que aparece.
4. Espera a que el validador termine (el check **Reglas de los OVA**). Si falla, abre
   el detalle, corrige y vuelve a subir: el check se repite solo.
5. La responsable del repositorio revisa y aprueba. Al fusionar, `ENLACES-OVAS.md` se
   actualiza solo con el enlace del OVA.

---

## 7. Actualizar un OVA

Un OVA se actualiza **en su misma carpeta**: la ruta y el enlace no cambian, y GitHub
conserva todas las versiones anteriores.

1. Edita los archivos dentro de la carpeta del OVA. Nunca crees carpetas como `t01-v2`.
2. Asigna la nueva versión: un cambio menor (texto, enlace, imagen) suma al segundo
   número, 1.0 → 1.1; un cambio mayor (rediseño, contenido nuevo) suma al primero, 1.1 → 2.0.
3. Agrega una fila al historial del `README.md`, la más reciente arriba.
4. Sube el cambio con un mensaje de commit que empiece por el código.
5. Registra la actualización en la herramienta de registro.

---

## 8. Qué revisa el validador

### Errores (bloquean el PR)

| Tema | Regla |
|---|---|
| Ruta | `nivel/programa/curso/uNN/tNN/` (o `uNN/` si el curso es por unidad); un curso no mezcla los dos tipos |
| Siglas | Nivel `esp`, `mae` o `doc`; programa de 2 a 5 letras; curso de 2 a 4; programa y curso registrados en `catalogo.csv` |
| Nombres | Archivos y carpetas en minúsculas, sin tildes, sin ñ, sin espacios ni guion bajo |
| Archivos | `README.md`, `index.html`, `estilos.css`, `script.js`, `tailwind.css`, `img/logo.webp`, e `iconos.css` si usa íconos |
| README | Título igual al `<title>` del OVA y código que coincide con la ruta |
| Sin internet | Ni Tailwind ni Font Awesome desde internet; QR guardados como imágenes, no generados en línea |
| Código separado | Sin bloques `<style>` ni `<script>` con código dentro del HTML; `estilos.css` antes de `tailwind.css` |
| Tailwind | Si el OVA usa `#ova-embed`, su `tailwind.css` se quemó con esa configuración |
| Íconos | Todo ícono que usa el OVA está guardado en `iconos.css` |
| Logo | CINTIA en especializaciones; el del programa en maestrías y doctorados |
| Accesibilidad | Plugin `elens.js` antes de `</body>` |
| Créditos | Un solo pie de página con CINTIA y Universidad de Córdoba |
| Secciones | Las 7, en orden: introducción, objetivos, contenido, actividad (o actividades), evaluación, recursos, bibliografía |
| Autoevaluación | Entre 3 y 10 preguntas |
| Enlaces | Abren en pestaña nueva y funcionan (no están rotos) |
| QR | De al menos 2 × 2 cm |
| Videos | Con subtítulos (`<track kind="captions">`) |
| Rutas | Relativas, y todos los archivos que usa el OVA existen |
| Tamaño | Ningún archivo de más de 100 MB |
| Contenido | Bibliografía con referencias; sin texto de relleno |

### Advertencias (no bloquean)

- La autoevaluación no explica por qué cada opción es correcta o incorrecta.
- Los objetivos no usan verbos de orden superior (taxonomía SOLO) o no tienen íconos.
- Las cajas de actividad tienen bordes de menos de 2 px.
- Navegación con teclado: elementos que solo responden al mouse, falta de estilos de foco,
  acordeones o pestañas sin `aria-expanded`, o el foco no pasa al contenido nuevo.
- Videos de YouTube o Vimeo (sus subtítulos se revisan a mano), o sin transcripción.
- Enlaces que el sitio no deja comprobar (hay que abrirlos a mano).
- Dependencias de otros servicios externos, archivos de Office dentro del OVA o archivos
  de más de 20 MB.

### Lo que revisa una persona

El validador no reemplaza la revisión del equipo pedagógico. Estos criterios se revisan a mano:

- Máximo 2 elementos por vista en las actividades, con instrucciones paso a paso.
- Contraste de colores y de los bordes de las cajas de actividad.
- Textos en bloques cortos, sin fatiga visual.
- Figuras con título claro, tamaño legible y crédito de autoría.
- Que la navegación completa con teclado (Tab y flechas) funcione bien.
- Que la retroalimentación de la autoevaluación explique bien cada respuesta.

La lista del Pull Request recoge estos puntos.
