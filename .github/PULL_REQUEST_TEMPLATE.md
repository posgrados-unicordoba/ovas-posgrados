## OVA

**Código:** <!-- ej.: gthdo-pobh-u02-t03 -->
**Tipo de cambio:** <!-- OVA nuevo · migración · actualización menor (1.0 → 1.1) · actualización mayor (1.1 → 2.0) -->
**Qué cambió:** <!-- una o dos líneas -->

## Lo revisa el validador

El check **Reglas de los OVA** revisa solo la estructura, los archivos, los enlaces y las
reglas técnicas. Si falla, abre el detalle, corrige y vuelve a subir. Antes de abrir el PR:

- [ ] Ejecuté `node scripts/validar-ova.mjs <ruta-del-ova>` y no hay errores.
- [ ] Si cambié clases o íconos, volví a generar `tailwind.css` e `iconos.css`.
- [ ] El curso está en `catalogo.csv`.
- [ ] El `README.md` tiene la versión y el historial al día.

## Lo reviso yo (el validador no puede)

- [ ] El OVA abre bien en el navegador y se ve como se diseñó (computador y celular).
- [ ] Puedo recorrer todo el OVA solo con el teclado (Tab, Enter y flechas) y siempre veo dónde está el foco.
- [ ] Las actividades muestran máximo 2 elementos por vista, con instrucciones paso a paso.
- [ ] Las cajas de actividad tienen bordes visibles (1.5 a 2 pt) y buen contraste.
- [ ] Los textos largos están en bloques cortos o paneles colapsables.
- [ ] Las figuras tienen título, tamaño legible y crédito de autoría.
- [ ] La autoevaluación explica por qué cada opción es correcta o incorrecta.
- [ ] Los QR llevan al mismo recurso que su enlace.
- [ ] Si hay videos: tienen subtítulos propios y sincronizados, y descarga o transcripción.
- [ ] El OVA no muestra nombres de diseñadores ni docentes.
- [ ] Registré el OVA (o su actualización) en la herramienta de registro.
