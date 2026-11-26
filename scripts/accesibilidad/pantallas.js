/* Plantilla del componente "pantallas de 2 elementos" (criterio 3 de CINTIA).
 * Cómo usarlo en un OVA:
 *   1. Copia este archivo completo al final de script.js del OVA.
 *   2. Copia pantallas.css al final de estilos.css del OVA.
 *   3. Debajo, conéctalo a la actividad. Ejemplos de los OVA ya corregidos:
 *        pantallasDeDosEnLista(document.querySelector('#act-proposal .space-y-5'));
 *        pantallasDeDosEnLista(document.querySelector('#act-evp .space-y-5'), { aplanar: '.grid' });
 *        pantallasDeDosPorHijos(document.getElementById('paradigmas-questions'));
 *        pantallasDeDosPorHijos(document.getElementById('caso-questions'), { porPantalla: 1 });
 *        pantallasDeDosPorHijos(document.getElementById('sim-rows'), { finales: false, alCrecer: 'ultima' });
 *   4. Ábrelo en el navegador y recorre las pantallas: máximo 2 elementos en cada una.
 */

/* ===== Pantallas de 2 elementos =====
 * Criterio 3 de la lista de verificación técnica y pedagógica de CINTIA:
 * las actividades largas se muestran en pantallas consecutivas, con máximo
 * 2 elementos por vista. Los campos ocultos siguen en la página: guardar,
 * exportar y generar el prompt leen todas las respuestas.
 *
 * pantallasDeDos({
 *   grupos:    [elementos o arreglos de elementos],  // cada uno es un "elemento"
 *   finales:   [elementos],   // botones finales: se ven solo en la última pantalla
 *   navDespuesDe: elemento,   // dónde va la barra Anterior / Siguiente (opcional)
 *   paso, siguiente, anterior // si la actividad ya tiene pasos: se usan sus botones
 *   cambiarTexto: false       // no tocar el texto del botón Siguiente (si lleva ícono)
 * })
 * Forma corta: pantallasDeDosEnLista(lista, opciones) toma como elementos los hijos de
 * la lista que tienen un campo, y deja para la última pantalla lo que va después de ella.
 * pantallasDeDosPorHijos(lista, opciones) toma cada hijo de la lista como un elemento
 * (preguntas con botones de opción, objetivos con casillas, filas que se agregan).
 *
 * Qué es un elemento (equipo pedagógico, 26 de noviembre de 2026): cada contenedor horizontal
 * completo, con su enunciado y sus opciones. Se divide la actividad compleja que obliga a
 * hacer scroll; si casi toda cabe en una pantalla, puede quedar en una sola.
 */
function pantallasDeDos(cfg) {
  var POR = cfg.porPantalla || 2;
  var grupos = cfg.grupos.filter(Boolean).map(function (g) { return [].concat(g).filter(Boolean); }).filter(function (g) { return g.length; });
  var finales = (cfg.finales || []).filter(Boolean);
  var paginas = Math.ceil(grupos.length / POR);
  if (paginas <= 1) {
    // Cabe en una pantalla: todo a la vista (por si antes había pantallas y se quitaron elementos).
    grupos.forEach(function (g) { g.forEach(function (el) { el.style.display = ''; }); });
    finales.forEach(function (f) { f.style.display = ''; });
    return null;
  }
  var actual = 0, btnAnt = null, btnSig = null, textoBase = null;

  var aviso = document.createElement('p');
  aviso.className = 'pantallas-aviso';
  aviso.setAttribute('aria-live', 'polite');

  function boton(texto, clase) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = clase; b.textContent = texto;
    return b;
  }
  function visible() { return !cfg.paso || !cfg.paso.classList.contains('hidden'); }

  if (!cfg.siguiente) {
    var nav = document.createElement('div');
    nav.className = 'pantallas-nav';
    btnAnt = boton('← Anterior', 'btn-soft');
    btnSig = boton('Siguiente →', 'btn-main');
    nav.append(btnAnt, aviso, btnSig);
    cfg.aviso = null;
    var ultimo = grupos[grupos.length - 1];
    (cfg.navDespuesDe || ultimo[ultimo.length - 1]).after(nav);
    btnAnt.addEventListener('click', function () { ir(actual - 1, true); });
    btnSig.addEventListener('click', function () { ir(actual + 1, true); });
    cfg.nav = nav;
  } else {
    grupos[0][0].before(aviso);
    cfg.aviso = aviso;
    cfg.siguiente.addEventListener('click', function (e) {
      if (!visible()) return;
      if (actual < paginas - 1) { e.stopImmediatePropagation(); e.preventDefault(); ir(actual + 1, true); }
      else pantallasDeDos.direccion = 1;
    }, true);
    if (cfg.anterior) cfg.anterior.addEventListener('click', function (e) {
      if (!visible()) return;
      if (actual > 0) { e.stopImmediatePropagation(); e.preventDefault(); ir(actual - 1, true); }
      else pantallasDeDos.direccion = -1;
    }, true);
    var estaba = visible();
    new MutationObserver(function () {
      var ahora = visible();
      if (ahora && !estaba) {
        textoBase = cfg.siguiente.textContent;
        ir(pantallasDeDos.direccion === -1 ? paginas - 1 : 0, false);
        pantallasDeDos.direccion = 1;
      }
      estaba = ahora;
    }).observe(cfg.paso, { attributes: true, attributeFilter: ['class'] });
  }

  function ir(n, enfocar) {
    actual = Math.max(0, Math.min(paginas - 1, n));
    grupos.forEach(function (g, i) {
      var ver = Math.floor(i / POR) === actual;
      g.forEach(function (el) { el.style.display = ver ? '' : 'none'; });
    });
    finales.forEach(function (f) { f.style.display = actual === paginas - 1 ? '' : 'none'; });
    aviso.textContent = 'Pantalla ' + (actual + 1) + ' de ' + paginas;
    if (btnAnt) {
      btnAnt.disabled = actual === 0;
      btnSig.disabled = actual === paginas - 1;
      btnSig.style.visibility = actual === paginas - 1 ? 'hidden' : '';
    }
    if (cfg.siguiente && cfg.cambiarTexto !== false && visible()) {
      if (textoBase === null) textoBase = cfg.siguiente.textContent;
      cfg.siguiente.textContent = actual < paginas - 1 ? 'Siguiente' : textoBase;
    }
    if (cfg.anterior && actual > 0 && visible()) cfg.anterior.disabled = false;
    if (enfocar) {
      var g = grupos[actual * POR][0];
      var campo = g.querySelector('textarea, select, input') || g.querySelector('button') || g;
      if (campo === g && !g.hasAttribute('tabindex')) g.setAttribute('tabindex', '-1');
      campo.focus({ preventScroll: true });
      g.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  ir(0, false);
  return { ir: ir, paginas: paginas };
}

/* Igual, pero se vuelve a armar si el script redibuja el formulario (por ejemplo, al limpiar)
 * o si agrega o quita elementos. Con cfg.alCrecer = 'ultima', al agregar un elemento se pasa
 * a la pantalla donde quedó (por ejemplo, "Agregar problema" lleva a la pantalla nueva). */
function pantallasDeDosAlRedibujar(contenedor, armar) {
  var actual = null, armando = false, antes = 0, control = { api: null };
  function rearmar() {
    if (armando) return;
    armando = true;
    if (actual && actual.nav) actual.nav.remove();
    if (actual && actual.aviso) actual.aviso.remove();
    var cfg = armar();
    var api = pantallasDeDos(cfg);
    if (api && cfg.alCrecer === 'ultima' && antes && cfg.grupos.length > antes) api.ir(api.paginas - 1, true);
    antes = cfg.grupos.length;
    actual = cfg; control.api = api;
    armando = false;
  }
  rearmar();
  var propio = function (n) { return n.nodeType === 1 && (n.classList.contains('pantallas-nav') || n.classList.contains('pantallas-aviso')); };
  new MutationObserver(function (m) {
    if (m.some(function (r) {
      return [].some.call(r.addedNodes, function (n) { return n.nodeType === 1 && !propio(n); })
        || [].some.call(r.removedNodes, function (n) { return n.nodeType === 1 && !propio(n); });
    })) rearmar();
  }).observe(contenedor, { childList: true });
  return control;
}
/* Elementos = cada hijo de la lista (una pregunta, un objetivo, un rol...), aunque sus campos
 * sean casillas o botones de opción. Lo que va después de la lista (resumen, Verificar,
 * Reiniciar) se ve en la última pantalla. Reiniciar o Limpiar vuelven a la pantalla 1.
 * opciones.porPantalla: 1 en un caso de estudio (el caso queda arriba, una pregunta por pantalla).
 * opciones.finales: false para dejar a la vista lo que va después de la lista.
 * opciones.alCrecer: 'ultima' para ir a la pantalla nueva cuando se agrega un elemento. */
function pantallasDeDosPorHijos(lista, opciones) {
  if (!lista) return null;
  opciones = opciones || {};
  var despues = [];
  for (var h = lista.nextElementSibling; h; h = h.nextElementSibling)
    if (!h.classList.contains('pantallas-nav') && !h.classList.contains('pantallas-aviso')) despues.push(h);
  var control = pantallasDeDosAlRedibujar(lista, function () {
    var grupos = [].filter.call(lista.children, function (c) {
      return !c.classList.contains('pantallas-nav') && !c.classList.contains('pantallas-aviso');
    });
    var cfg = { grupos: grupos, finales: opciones.finales === false ? [] : despues, navDespuesDe: lista };
    for (var k in opciones) if (k !== 'finales') cfg[k] = opciones[k];
    return cfg;
  });
  despues.forEach(function (d) {
    [].forEach.call(d.querySelectorAll('button'), function (b) {
      if (/reiniciar|limpiar/i.test(b.textContent)) b.addEventListener('click', function () {
        setTimeout(function () { if (control.api) control.api.ir(0, false); });
      });
    });
  });
  return control;
}

/* Elementos = hijos de la lista que tienen un campo (un título suelto va con el elemento que sigue).
 * opciones.aplanar: selector de un hijo cuyos propios hijos son elementos (por ejemplo, una grilla). */
function pantallasEnLista(lista, opciones) {
  opciones = opciones || {};
  var CAMPO = 'textarea, select, input[type=text], input[type=number], input:not([type])';
  var hijos = [];
  [].forEach.call(lista.children, function (c) {
    if (c.classList.contains('pantallas-aviso') || c.classList.contains('pantallas-nav')) return;
    if (opciones.aplanar && c.matches(opciones.aplanar)) [].push.apply(hijos, c.children); else hijos.push(c);
  });
  var grupos = [], suelto = [];
  hijos.forEach(function (c) {
    suelto.push(c);
    if (c.matches(CAMPO) || c.querySelector(CAMPO)) { grupos.push(suelto); suelto = []; }
  });
  if (suelto.length && grupos.length) grupos[grupos.length - 1] = grupos[grupos.length - 1].concat(suelto);
  var finales = [], despues = [];
  for (var h = lista.nextElementSibling; h; h = h.nextElementSibling)
    if (!h.classList.contains('pantallas-nav') && !h.classList.contains('pantallas-aviso')) despues.push(h);
  // En una actividad por pasos, lo que va después de la lista (por ejemplo, un prompt) es su propia pantalla.
  if (opciones.paso) {
    if (despues.some(function (d) { return d.matches(CAMPO) || d.querySelector(CAMPO); })) grupos.push(despues);
  } else finales = despues;
  var cfg = { grupos: grupos, finales: finales, navDespuesDe: lista };
  for (var k in opciones) if (k !== 'aplanar') cfg[k] = opciones[k];
  return cfg;
}
function pantallasDeDosEnLista(lista, opciones) {
  return lista ? pantallasDeDos(pantallasEnLista(lista, opciones)) : null;
}
/* ===== fin de pantallas de 2 elementos ===== */
