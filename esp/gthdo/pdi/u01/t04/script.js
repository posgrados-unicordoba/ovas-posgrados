/* Interacciones del OVA gthdo-pdi-u01-t04. */

        // Navegación sidebar
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                document.querySelectorAll('.content-pane').forEach(p => p.classList.remove('active'));
                document.getElementById(link.dataset.target).classList.add('active');
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

        // Quiz
        const quizData = [
            { q: "¿Cuál es la diferencia principal entre el Diagnóstico Funcional y el Diagnóstico Cultural?", options: ["El funcional mide 'qué se hace y cómo'; el cultural explica 'por qué se hace'", "El funcional se centra en valores y el cultural en procesos", "No existe diferencia, ambos miden lo mismo", "El cultural solo se aplica en empresas internacionales"], correct: 0 },
            { q: "¿Cuáles son las 7 dimensiones del Framework 7S de McKinsey?", options: ["Estrategia, Estructura, Sistemas, Valores compartidos, Habilidades, Estilo y Personal", "Planeación, Organización, Dirección, Control, Evaluación, Retroalimentación y Cierre", "Diagnóstico, Análisis, Diseño, Implementación, Evaluación, Ajuste y Cierre", "Misión, Visión, Objetivos, Metas, Indicadores, Procesos y Resultados"], correct: 0 },
            { q: "¿Qué instrumento estadístico se utiliza para analizar la fiabilidad de las herramientas de diagnóstico organizacional?", options: ["Análisis de Pareto", "Diagrama de Ishikawa", "Alpha de Cronbach", "Matriz DOFA"], correct: 2 }
        ];

        let currentQ = 0;
        let answers = [];
        const quizBox = document.getElementById('quiz-box');
        const quizSummary = document.getElementById('quiz-summary');

        function renderQuiz() {
            document.getElementById('quiz-title').textContent = `Pregunta ${currentQ + 1}`;
            document.getElementById('quiz-progress').textContent = `${currentQ + 1}/${quizData.length}`;
            document.getElementById('quiz-text').textContent = quizData[currentQ].q;
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
                    html += `<div class="p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}"><p class="font-semibold">${i+1}. ${q.q}</p><p class="text-sm mt-2">Tu respuesta: ${String.fromCharCode(65+answers[i])}. ${q.options[answers[i]]}</p>${!isCorrect ? `<p class="text-sm mt-1 text-green-700">Correcta: ${String.fromCharCode(65+q.correct)}. ${q.options[q.correct]}</p>` : ''}</div>`;
                });
                html += `<p class="text-center font-bold text-lg mt-4">Puntuación: ${correct}/${quizData.length} (${Math.round(correct/quizData.length*100)}%)</p>`;
                document.getElementById('summary-content').innerHTML = html;
            }
        });

        document.getElementById('quiz-prev').addEventListener('click', () => { if (currentQ > 0) { currentQ--; renderQuiz(); } });
        document.getElementById('quiz-restart').addEventListener('click', () => { currentQ = 0; answers = []; quizBox.classList.remove('hidden'); quizSummary.classList.add('hidden'); renderQuiz(); });

        // ===== ACTIVIDAD: DRAG & DROP =====
        let draggedEl = null;
        const scenarioOrigins = {};

        document.querySelectorAll('.drag-card[draggable]').forEach(card => {
            card.addEventListener('dragstart', (e) => {
                draggedEl = card;
                card.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', card.id);
            });
            card.addEventListener('dragend', () => {
                card.classList.remove('dragging');
                draggedEl = null;
                document.querySelectorAll('.drop-zone').forEach(z => z.classList.remove('drag-over'));
            });
        });

        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('drag-over'); });
            zone.addEventListener('dragleave', () => { zone.classList.remove('drag-over'); });
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');
                if (!draggedEl) return;
                const content = zone.querySelector('.drop-zone-content');
                scenarioOrigins[draggedEl.id] = zone.dataset.method;
                draggedEl.classList.add('placed');
                draggedEl.classList.remove('correct', 'incorrect');
                content.appendChild(draggedEl);
            });
        });

        // También permitir devolver al origen haciendo clic
        document.getElementById('drag-scenarios').addEventListener('dragover', (e) => e.preventDefault());
        document.getElementById('drag-scenarios').addEventListener('drop', (e) => {
            e.preventDefault();
            if (!draggedEl) return;
            draggedEl.classList.remove('placed', 'correct', 'incorrect');
            delete scenarioOrigins[draggedEl.id];
            document.getElementById('drag-scenarios').appendChild(draggedEl);
        });

        function verifyDragDrop() {
            const feedback = document.getElementById('drag-feedback');
            const allCards = document.querySelectorAll('.drag-card[data-correct]');
            let correctCount = 0;
            const totalCards = allCards.length;
            const explanations = {
                'scenario-1': 'Cuestionarios de gran escala miden variables funcionales como satisfacción y eficiencia → Diagnóstico Funcional.',
                'scenario-2': 'Descubrir valores y creencias compartidas es el objetivo del → Diagnóstico Cultural.',
                'scenario-3': 'El análisis de redes de comunicación formal examina estructuras operativas → Diagnóstico Funcional.',
                'scenario-4': 'Rituales, símbolos y normas no escritas son elementos culturales → Diagnóstico Cultural.',
                'scenario-5': 'Indicadores de producción y tiempos de respuesta son métricas funcionales → Diagnóstico Funcional.',
                'scenario-6': 'Grupos focales sobre resistencia al cambio exploran narrativas culturales → Diagnóstico Cultural.'
            };

            allCards.forEach(card => {
                const correctMethod = card.dataset.correct;
                const placedIn = scenarioOrigins[card.id];
                if (placedIn === correctMethod) {
                    card.classList.add('correct');
                    card.classList.remove('incorrect');
                    correctCount++;
                } else if (placedIn) {
                    card.classList.add('incorrect');
                    card.classList.remove('correct');
                }
            });

            let html = `<p class="font-bold mb-3" style="color: var(--heading);">Resultado: ${correctCount}/${totalCards} correctas</p>`;
            allCards.forEach(card => {
                const isCorrect = scenarioOrigins[card.id] === card.dataset.correct;
                html += `<div class="mt-2 p-3 rounded-lg text-xs ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}">
                    <span class="font-bold">${card.querySelector('.font-bold').textContent}:</span> ${explanations[card.id]}
                    ${isCorrect ? '<span class="text-green-600 font-bold ml-1">✓</span>' : '<span class="text-red-600 font-bold ml-1">✗</span>'}
                </div>`;
            });

            feedback.innerHTML = html;
            feedback.classList.remove('hidden');
            feedback.style.background = correctCount === totalCards ? '#f0fdf4' : '#fffbeb';
            feedback.style.border = correctCount === totalCards ? '1px solid #bbf7d0' : '1px solid #fde68a';
        }

        function resetDragDrop() {
            const container = document.getElementById('drag-scenarios');
            document.querySelectorAll('.drag-card[data-correct]').forEach(card => {
                card.classList.remove('placed', 'correct', 'incorrect');
                container.appendChild(card);
            });
            document.querySelectorAll('.drop-zone-content').forEach(c => c.innerHTML = '');
            document.getElementById('drag-feedback').classList.add('hidden');
            Object.keys(scenarioOrigins).forEach(k => delete scenarioOrigins[k]);
        }

        renderQuiz();

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
