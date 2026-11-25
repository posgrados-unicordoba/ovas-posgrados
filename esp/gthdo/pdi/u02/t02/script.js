/* Interacciones del OVA gthdo-pdi-u02-t02. */


        // Navegación sidebar
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                document.querySelectorAll('.content-pane').forEach(p => p.classList.remove('active'));
                document.getElementById(link.dataset.target).classList.add('active');
                
                // Inicializar quiz cuando se navega a evaluación
                if (link.dataset.target === 'evaluacion') {
                    setTimeout(() => {
                        renderQuiz();
                    }, 100);
                }
            });
        });

        // Mobile nav
        document.getElementById('mobile-nav').addEventListener('change', (e) => {
            document.querySelectorAll('.content-pane').forEach(p => p.classList.remove('active'));
            document.getElementById(e.target.value).classList.add('active');
        });

        // Acordeón
        document.querySelectorAll('.accordion-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const content = btn.nextElementSibling;
                content.classList.toggle('hidden');
                const icon = btn.querySelector('.fa-chevron-down');
                if (icon) icon.style.transform = content.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
            });
        });

        // Quiz - Preguntas acotadas según formato 088 y guía
        const quizData = [
            { 
                q: "Según el modelo de Kotter, ¿cuál es el primer paso para liderar una transformación organizacional exitosa?", 
                options: [
                    "Definir la visión estratégica del cambio", 
                    "Crear un sentido de urgencia que muestre la insostenibilidad del estado actual", 
                    "Formar una coalición guía de líderes influyentes", 
                    "Generar triunfos a corto plazo"
                ], 
                correct: 1,
                explicaciones: ["No es la respuesta. La visión es un paso posterior; Kotter propone empezar por crear sentido de urgencia.", "Correcto. El primer paso del modelo de Kotter es crear un sentido de urgencia que muestre que el estado actual no es sostenible.", "No es la respuesta. La coalición guía es el segundo paso, una vez existe la urgencia.", "No es la respuesta. Los triunfos a corto plazo aparecen en las etapas avanzadas del modelo."] 
            },
            { 
                q: "En el modelo ADKAR de Prosci, ¿qué dimensión representa la disposición emocional para apoyar el cambio?", 
                options: [
                    "Conciencia del porqué del cambio", 
                    "Conocimiento de cómo cambiar", 
                    "Deseo de participar en el cambio", 
                    "Habilidad para ejecutar el nuevo comportamiento"
                ], 
                correct: 2,
                explicaciones: ["No es la respuesta. La conciencia (Awareness) es entender por qué se necesita el cambio, no la disposición emocional a apoyarlo.", "No es la respuesta. El conocimiento (Knowledge) se refiere a saber cómo cambiar.", "Correcto. El deseo (Desire) es la dimensión emocional de ADKAR: la disposición personal a participar y apoyar el cambio.", "No es la respuesta. La habilidad (Ability) es la capacidad de poner en práctica el nuevo comportamiento."] 
            },
            { 
                q: "¿Cuál es la principal ventaja de desarrollar una cultura de adaptabilidad en las organizaciones en 2025?", 
                options: [
                    "Mantener los procesos sin modificaciones para dar estabilidad", 
                    "Reducir la necesidad de comunicación interna", 
                    "Responder con rapidez ante entornos BANI y cambios acelerados", 
                    "Eliminar la toma de riesgos en la innovación"
                ], 
                correct: 2,
                explicaciones: ["No es la respuesta. La adaptabilidad implica justamente lo contrario: ajustar los procesos cuando el entorno cambia.", "No es la respuesta. Una cultura adaptable necesita más comunicación, no menos.", "Correcto. Una cultura de adaptabilidad permite responder con rapidez en entornos BANI y ante cambios acelerados.", "No es la respuesta. La adaptabilidad acepta el riesgo como parte de la innovación; no lo elimina."] 
            }
        ];

        let currentQ = 0;
        let answers = [];
        const quizBox = document.getElementById('quiz-box');
        const quizSummary = document.getElementById('quiz-summary');

        function renderQuiz() {
            // Verificar que los elementos existan antes de renderizar
            const quizTitle = document.getElementById('quiz-title');
            const quizProgress = document.getElementById('quiz-progress');
            const quizText = document.getElementById('quiz-text');
            const quizOptions = document.getElementById('quiz-options');
            
            if (!quizTitle || !quizProgress || !quizText || !quizOptions) {
                console.log('Elementos del quiz no encontrados, reintentando...');
                setTimeout(renderQuiz, 100);
                return;
            }
            
            quizTitle.textContent = `Pregunta ${currentQ + 1}`;
            quizProgress.textContent = `${currentQ + 1}/${quizData.length}`;
            quizText.textContent = quizData[currentQ].q;
            const opts = document.getElementById('quiz-options');
            opts.innerHTML = '';
            quizData[currentQ].options.forEach((opt, i) => {
                const btn = document.createElement('button');
                btn.className = `quiz-option w-full text-left border rounded-lg p-4 transition-all ${answers[currentQ] === i ? 'border-[var(--accent)] bg-[var(--surface-soft)]' : 'border-[var(--line)] hover:bg-[var(--surface-soft)]'}`;
                btn.innerHTML = `<span class="font-semibold">${String.fromCharCode(65+i)}.</span> ${opt}`;
                btn.onclick = () => { answers[currentQ] = i; renderQuiz(); };
                opts.appendChild(btn);
            });
            document.getElementById('quiz-prev').disabled = currentQ === 0;
            document.getElementById('quiz-next').textContent = currentQ === quizData.length - 1 ? 'Finalizar' : 'Siguiente';
        }

        document.getElementById('quiz-next').addEventListener('click', () => {
            if (currentQ < quizData.length - 1) { currentQ++; renderQuiz(); }
            else {
                quizBox.classList.add('hidden');
                quizSummary.classList.remove('hidden');
                let correct = 0;
                let html = '';
                quizData.forEach((q, i) => {
                    const isCorrect = answers[i] === q.correct;
                    if (isCorrect) correct++;
                    html += `<div class="p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}"><p class="font-semibold">${i+1}. ${q.q}</p><p class="text-sm mt-2">Tu respuesta: ${String.fromCharCode(65+answers[i])}. ${q.options[answers[i]]}</p>${!isCorrect ? `<p class="text-sm mt-1 text-green-700">Correcta: ${String.fromCharCode(65+q.correct)}. ${q.options[q.correct]}</p>` : ''}${q.explicaciones ? `<p class="text-sm mt-2">${q.explicaciones[answers[i]]}</p>` : ''}</div>`;
                });
                html += `<p class="text-center font-bold text-lg mt-4">Puntuación: ${correct}/${quizData.length} (${Math.round(correct/quizData.length*100)}%)</p>`;
                document.getElementById('summary-content').innerHTML = html;
            }
        });

        document.getElementById('quiz-prev').addEventListener('click', () => { if (currentQ > 0) { currentQ--; renderQuiz(); } });
        document.getElementById('quiz-restart').addEventListener('click', () => { currentQ = 0; answers = []; quizBox.classList.remove('hidden'); quizSummary.classList.add('hidden'); renderQuiz(); });

        // ===== PESTAÑAS DE ACTIVIDADES =====
        document.querySelectorAll('.act-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.act-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.act-panel').forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(tab.dataset.actTarget).classList.add('active');
            });
        });

        // ===== CONTADORES =====
        function updateCounter(fieldId) {
            const field = document.getElementById(fieldId);
            const counter = document.querySelector(`[data-counter-for="${fieldId}"]`);
            const progressBar = document.querySelector(`[data-progress-for="${fieldId}"]`);
            if (field && counter) {
                const currentLength = field.value.length;
                const maxLength = field.maxLength;
                counter.textContent = `${currentLength}/${maxLength}`;
                if (progressBar) {
                    progressBar.style.width = `${(currentLength / maxLength) * 100}%`;
                }
            }
        }

        // ===== ACTIVIDAD 1: PLAN DE COMUNICACIÓN =====
        const planFields = ['change-context', 'hito-urgencia', 'hito-coalicion', 'hito-vision', 'hito-comunicacion', 'hito-triunfo'];

        function getPlanData() {
            return {
                context: document.getElementById('change-context')?.value || '',
                urgencia: document.getElementById('hito-urgencia')?.value || '',
                coalicion: document.getElementById('hito-coalicion')?.value || '',
                vision: document.getElementById('hito-vision')?.value || '',
                comunicacion: document.getElementById('hito-comunicacion')?.value || '',
                triunfo: document.getElementById('hito-triunfo')?.value || ''
            };
        }

        function clearPlanForm() {
            planFields.forEach(id => {
                const field = document.getElementById(id);
                if (field) {
                    field.value = '';
                    updateCounter(id);
                }
            });
        }

        function toggleExportMenuPlan() {
            const menu = document.getElementById('export-menu-plan');
            const isHidden = menu.classList.contains('hidden');
            if (!isHidden) {
                menu.classList.add('hidden');
                return;
            }
            const d = getPlanData();
            if (!d.context && !d.urgencia && !d.coalicion && !d.vision && !d.comunicacion && !d.triunfo) {
                alert('Por favor complete al menos un campo antes de exportar.');
                return;
            }
            window.exportPlanData = d;
            menu.classList.remove('hidden');
            setTimeout(() => {
                document.addEventListener('click', closeExportMenuOutsidePlan);
            }, 100);
        }

        function closeExportMenuOutsidePlan(event) {
            const menu = document.getElementById('export-menu-plan');
            const button = event.target.closest('button[onclick="toggleExportMenuPlan()"]');
            const dd = document.getElementById('export-dropdown-plan');
            if (dd && !dd.contains(event.target) && !button) {
                menu.classList.add('hidden');
                document.removeEventListener('click', closeExportMenuOutsidePlan);
            }
        }

        function exportPlanToTxt() {
            const d = window.exportPlanData || getPlanData();
            const content = `PLAN DE COMUNICACIÓN DE 5 HITOS - TEMA 2
================================================
Fecha: ${new Date().toLocaleDateString('es-ES')}

CONTEXTO DEL CAMBIO DIGITAL
----------------------------------
${d.context || 'No especificado'}

1. SENTIDO DE URGENCIA
----------------------
${d.urgencia || 'No especificado'}

2. COALICIÓN GUÍA
-----------------
${d.coalicion || 'No especificado'}

3. VISIÓN ESTRATÉGICA
---------------------
${d.vision || 'No especificado'}

4. COMUNICACIÓN MULTI-CANAL
---------------------------
${d.comunicacion || 'No especificado'}

5. TRIUNFO RÁPIDO
-----------------
${d.triunfo || 'No especificado'}

================================================
Generado desde OVA - Gerencia del Talento Humano
Universidad de Córdoba`;
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Plan_Comunicacion_5_Hitos_${new Date().toISOString().split('T')[0]}.txt`;
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
            URL.revokeObjectURL(url);
            document.getElementById('export-menu-plan').classList.add('hidden');
        }

        function exportPlanToWord() {
            const d = window.exportPlanData || getPlanData();
            const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
                <head><meta charset='utf-8'><title>Plan de Comunicación 5 Hitos</title></head>
                <body>
                    <h2>Plan de Comunicación de 5 Hitos - Tema 2</h2>
                    <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
                    <h3>Contexto del cambio digital</h3><p>${(d.context || 'No especificado').replace(/\n/g, '<br>')}</p>
                    <h3>1. Sentido de urgencia</h3><p>${(d.urgencia || 'No especificado').replace(/\n/g, '<br>')}</p>
                    <h3>2. Coalición guía</h3><p>${(d.coalicion || 'No especificado').replace(/\n/g, '<br>')}</p>
                    <h3>3. Visión estratégica</h3><p>${(d.vision || 'No especificado').replace(/\n/g, '<br>')}</p>
                    <h3>4. Comunicación multi-canal</h3><p>${(d.comunicacion || 'No especificado').replace(/\n/g, '<br>')}</p>
                    <h3>5. Triunfo rápido</h3><p>${(d.triunfo || 'No especificado').replace(/\n/g, '<br>')}</p>
                </body></html>`;
            const blob = new Blob(['﻿', html], { type: 'application/msword' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Plan_Comunicacion_5_Hitos_${new Date().toISOString().split('T')[0]}.doc`;
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
            URL.revokeObjectURL(url);
            document.getElementById('export-menu-plan').classList.add('hidden');
        }

        // ===== ACTIVIDAD 2: DIAGNÓSTICO ADKAR =====
        const adkarLabels = {
            awareness: 'Conciencia (Awareness)',
            desire: 'Deseo (Desire)',
            knowledge: 'Conocimiento (Knowledge)',
            ability: 'Habilidad (Ability)',
            reinforcement: 'Refuerzo (Reinforcement)'
        };

        function checkAdkar() {
            const items = document.querySelectorAll('.adkar-item');
            let correct = 0;
            items.forEach(item => {
                const correctValue = item.dataset.correct;
                const select = item.querySelector('.adkar-select');
                const feedback = item.querySelector('.adkar-feedback');
                const selected = select.value;
                feedback.classList.remove('hidden');
                if (selected === correctValue) {
                    correct++;
                    item.style.borderColor = '#22c55e';
                    item.style.backgroundColor = '#f0fdf4';
                    feedback.textContent = `✓ Correcto. La etapa es ${adkarLabels[correctValue]}.`;
                    feedback.style.color = '#15803d';
                } else {
                    item.style.borderColor = '#ef4444';
                    item.style.backgroundColor = '#fef2f2';
                    feedback.textContent = `✗ Incorrecto. La etapa correcta es ${adkarLabels[correctValue]}.`;
                    feedback.style.color = '#b91c1c';
                }
            });
            const summary = document.getElementById('adkar-summary');
            summary.classList.remove('hidden');
            summary.textContent = `Resultado: ${correct}/${items.length} correctas`;
            summary.style.background = correct === items.length ? '#dcfce7' : '#fef3c7';
            summary.style.color = correct === items.length ? '#166534' : '#92400e';
        }

        function resetAdkar() {
            document.querySelectorAll('.adkar-item').forEach(item => {
                const select = item.querySelector('.adkar-select');
                const feedback = item.querySelector('.adkar-feedback');
                select.value = '';
                feedback.classList.add('hidden');
                feedback.textContent = '';
                item.style.borderColor = '';
                item.style.backgroundColor = '';
            });
            document.getElementById('adkar-summary').classList.add('hidden');
        }

        // ===== FLIP CARDS Y DOMContentLoaded =====
        document.addEventListener('DOMContentLoaded', function() {
            const flipCards = document.querySelectorAll('.flip-card');
            flipCards.forEach(card => {
                card.addEventListener('click', function() {
                    this.classList.toggle('flipped');
                });
            });

            planFields.forEach(id => {
                const field = document.getElementById(id);
                if (field) {
                    field.addEventListener('input', () => updateCounter(id));
                    updateCounter(id);
                }
            });

            renderQuiz();
        });

/* ===== Navegación con teclado (criterio 1 de CINTIA) =====
   Complementa las interacciones de arriba sin cambiarlas:
   - al cambiar de sección o de paso, el foco pasa al contenido nuevo;
   - acordeones y coach avisan si están abiertos (aria-expanded);
   - las tarjetas giratorias y las tarjetas de ambientación se usan con Tab y Enter;
   - en la autoevaluación, las opciones dicen cuál está elegida y el foco sigue a la pregunta;
   - las pestañas de las actividades se recorren con las flechas.
   Lo agrega scripts/migrar-ova.mjs (plantilla: scripts/accesibilidad/teclado.js).
   Cada parte solo actúa si el OVA tiene ese componente. */
(function () {
    // Lleva el foco a un elemento que normalmente no lo recibe (un título).
    function enfocar(el) {
        if (!el) return;
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
        el.setAttribute('data-foco-titulo', '');
        el.focus({ preventScroll: false });
    }
    const tituloDe = (contenedor) => contenedor && contenedor.querySelector('h2, h3, h4');

    document.addEventListener('DOMContentLoaded', () => {
        // Secciones: aria-current en el menú y foco en el título de la sección.
        const links = document.querySelectorAll('.sidebar-link');
        const marcarActual = () => links.forEach(l => {
            if (l.classList.contains('active')) l.setAttribute('aria-current', 'page');
            else l.removeAttribute('aria-current');
        });
        marcarActual();
        links.forEach(link => link.addEventListener('click', () => {
            marcarActual();
            enfocar(tituloDe(document.getElementById(link.dataset.target)));
        }));
        const mobileNav = document.getElementById('mobile-nav');
        if (mobileNav) mobileNav.addEventListener('change', () => {
            marcarActual();
            enfocar(tituloDe(document.getElementById(mobileNav.value)));
        });

        // Acordeones: aria-expanded y aria-controls.
        document.querySelectorAll('.accordion-btn').forEach((btn, i) => {
            const panel = btn.nextElementSibling;
            if (!panel) return;
            if (!panel.id) panel.id = `acordeon-${i + 1}`;
            btn.setAttribute('aria-controls', panel.id);
            const actualizar = () => btn.setAttribute('aria-expanded', String(!panel.classList.contains('hidden')));
            actualizar();
            btn.addEventListener('click', actualizar);
        });

        // Botones del coach del taller: aria-expanded.
        document.querySelectorAll('[onclick^="toggleCoach("]').forEach(btn => {
            const n = btn.getAttribute('onclick').match(/\d+/);
            const coach = n && document.getElementById(`coach-${n[0]}`);
            if (!coach) return;
            btn.setAttribute('aria-controls', coach.id);
            const actualizar = () => btn.setAttribute('aria-expanded', String(!coach.classList.contains('hidden')));
            actualizar();
            btn.addEventListener('click', actualizar);
        });

        // Tarjetas giratorias: se enfocan con Tab y se giran con Enter o Espacio.
        document.querySelectorAll('.flip-card').forEach(card => {
            const frente = card.querySelector('.flip-card-front');
            const nombre = frente ? frente.textContent.replace(/\s+/g, ' ').trim() : 'Tarjeta';
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-pressed', 'false');
            card.setAttribute('aria-label', `${nombre}. Presiona Enter para ver el detalle.`);
            // Si el OVA ya gira la tarjeta al hacer clic, no se gira dos veces.
            let antes = false;
            card.addEventListener('click', () => { antes = card.classList.contains('flipped'); }, true);
            card.addEventListener('click', () => {
                if (card.classList.contains('flipped') === antes) card.classList.toggle('flipped');
                card.setAttribute('aria-pressed', String(card.classList.contains('flipped')));
            });
            card.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
            });
        });

        // Pestañas de actividades: rol de pestaña, cuál está activa y flechas para moverse.
        const grupos = new Map();
        document.querySelectorAll('.act-tab[data-act-target]').forEach(tab => {
            const g = tab.parentElement;
            if (!grupos.has(g)) grupos.set(g, []);
            grupos.get(g).push(tab);
        });
        grupos.forEach((tabs, contenedor) => {
            contenedor.setAttribute('role', 'tablist');
            const marcar = () => tabs.forEach(t => {
                const activa = t.classList.contains('active');
                t.setAttribute('aria-selected', String(activa));
                t.setAttribute('tabindex', activa ? '0' : '-1');
            });
            tabs.forEach((tab, i) => {
                const panel = document.getElementById(tab.dataset.actTarget);
                tab.setAttribute('role', 'tab');
                if (panel) { tab.setAttribute('aria-controls', panel.id); panel.setAttribute('role', 'tabpanel'); }
                tab.addEventListener('click', () => setTimeout(marcar));
                tab.addEventListener('keydown', e => {
                    const paso = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
                    if (!paso) return;
                    e.preventDefault();
                    const otra = tabs[(i + paso + tabs.length) % tabs.length];
                    otra.focus();
                    otra.click();
                });
            });
            marcar();
        });

        // Tarjetas de ambientación: su detalle se revela al enfocarlas (ver estilos.css).
        document.querySelectorAll('.mini-card').forEach(card => card.setAttribute('tabindex', '0'));

        // Autoevaluación: opción elegida (aria-pressed) y foco en la pregunta nueva.
        const opciones = document.getElementById('quiz-options');
        const marcarOpciones = () => opciones && opciones.querySelectorAll('.quiz-option').forEach(b => {
            b.type = 'button';
            b.setAttribute('aria-pressed', String(b.classList.contains('selected')));
        });
        if (opciones) {
            marcarOpciones();
            opciones.addEventListener('click', () => setTimeout(marcarOpciones));
            new MutationObserver(marcarOpciones).observe(opciones, { childList: true });
        }
        const texto = document.getElementById('quiz-text');
        if (texto) texto.setAttribute('aria-live', 'polite');
        ['quiz-prev', 'quiz-next'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', () => setTimeout(() => {
                const resultados = document.getElementById('quiz-results');
                if (resultados && !resultados.classList.contains('hidden')) enfocar(resultados.querySelector('h3, h4, p'));
                else enfocar(document.getElementById('quiz-title'));
            }));
        });
        const reiniciar = document.getElementById('quiz-restart');
        if (reiniciar) reiniciar.addEventListener('click', () => setTimeout(() => enfocar(document.getElementById('quiz-title'))));
    });

    // Taller por pasos: el foco pasa al título del paso que se muestra.
    const enfocarPaso = () => setTimeout(() => {
        const panel = document.querySelector('#tallerStepper .step-panel:not(.hidden)');
        enfocar(tituloDe(panel));
    }, 50);
    ['nextTallerStep', 'prevTallerStep', 'reiniciarTaller'].forEach(nombre => {
        const original = window[nombre];
        if (typeof original === 'function') window[nombre] = function (...args) {
            const r = original.apply(this, args);
            enfocarPaso();
            return r;
        };
    });
})();

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
 */
function pantallasDeDos(cfg) {
  var POR = cfg.porPantalla || 2;
  var grupos = cfg.grupos.filter(Boolean).map(function (g) { return [].concat(g).filter(Boolean); }).filter(function (g) { return g.length; });
  var finales = (cfg.finales || []).filter(Boolean);
  var paginas = Math.ceil(grupos.length / POR);
  if (paginas <= 1) return null;
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
    var ultimo = grupos[grupos.length - 1];
    (cfg.navDespuesDe || ultimo[ultimo.length - 1]).after(nav);
    btnAnt.addEventListener('click', function () { ir(actual - 1, true); });
    btnSig.addEventListener('click', function () { ir(actual + 1, true); });
    cfg.nav = nav;
  } else {
    grupos[0][0].before(aviso);
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
      var campo = g.querySelector('textarea, select, input, button') || g;
      if (campo === g && !g.hasAttribute('tabindex')) g.setAttribute('tabindex', '-1');
      campo.focus({ preventScroll: true });
      g.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  ir(0, false);
  return { ir: ir, paginas: paginas };
}

/* Igual, pero se vuelve a armar si el script redibuja el formulario (por ejemplo, al limpiar). */
function pantallasDeDosAlRedibujar(contenedor, armar) {
  var actual = null, armando = false;
  function rearmar() {
    if (armando) return;
    armando = true;
    if (actual && actual.nav) actual.nav.remove();
    var cfg = armar();
    pantallasDeDos(cfg);
    actual = cfg;
    armando = false;
  }
  rearmar();
  new MutationObserver(function (m) {
    var propio = function (n) { return n.nodeType === 1 && n.classList.contains('pantallas-nav'); };
    if (m.some(function (r) { return [].some.call(r.addedNodes, function (n) { return !propio(n); }); })) rearmar();
  }).observe(contenedor, { childList: true });
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

// Plan de comunicación: de 2 en 2.
document.addEventListener('DOMContentLoaded', function () {
  pantallasDeDosEnLista(document.querySelector('#act-plan .space-y-4'), { aplanar: '.grid' });
});
