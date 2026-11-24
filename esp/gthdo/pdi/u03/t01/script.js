/* Interacciones del OVA gthdo-pdi-u03-t01. */


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

        // Quiz - Preguntas acotadas según formato FDOC-088 y Guía 1 - Tema 1
        const quizData = [
            { 
                q: "Según la Guía 1, ¿en qué se diferencia fundamentalmente la ética de las virtudes de la ética deontológica?", 
                options: [
                    "La ética de las virtudes se centra en el carácter del agente; la deontología, en el cumplimiento del 'deber ser' independientemente de las consecuencias",
                    "La deontología se centra en el carácter del agente; la ética de las virtudes, en el cumplimiento de normas universales",
                    "Ambas corrientes son equivalentes y llegan siempre a las mismas conclusiones prácticas",
                    "La deontología pertenece al ámbito personal y la ética de las virtudes al ámbito profesional"
                ], 
                correct: 0,
                explicaciones: ["Correcto. La ética de las virtudes pone el foco en el carácter de quien actúa; la deontología, en cumplir el «deber ser» sin importar las consecuencias.", "No es la respuesta. Está invertido: es la ética de las virtudes la que mira el carácter, y la deontología la que se centra en el deber.", "No es la respuesta. Son corrientes distintas y pueden llevar a conclusiones diferentes ante un mismo dilema.", "No es la respuesta. Ninguna de las dos se limita a un ámbito: ambas aplican a la vida personal y a la profesional."] 
            },
            { 
                q: "De acuerdo con la Guía 1 (Parte 2), ¿qué son los 'recursos morales' según Domingo García-Marzá?", 
                options: [
                    "Los activos financieros destinados a programas de responsabilidad social empresarial",
                    "Los manuales de ética y códigos de conducta formales de la organización",
                    "Capacidades que conducen al entendimiento mutuo —diálogo, confianza y acuerdo— como mecanismos para la satisfacción de intereses",
                    "Las sanciones disciplinarias que regulan el comportamiento del personal"
                ], 
                correct: 2,
                explicaciones: ["No es la respuesta. García-Marzá no habla de activos financieros: los recursos morales son capacidades relacionales.", "No es la respuesta. Los manuales y códigos son instrumentos formales; los recursos morales son capacidades que se construyen en la relación.", "Correcto. Para García-Marzá, los recursos morales son capacidades —diálogo, confianza y acuerdo— que conducen al entendimiento mutuo.", "No es la respuesta. Las sanciones son mecanismos de control, no recursos morales."] 
            },
            { 
                q: "Según la Guía 1 (Parte 3), ¿en qué situaciones de la gestión del talento humano es más frecuente el choque entre la moral personal y la moral del rol?", 
                options: [
                    "En la elaboración de informes de gestión y reportes financieros",
                    "En la selección de proveedores y la negociación de contratos",
                    "En la planeación estratégica anual y el diseño del organigrama",
                    "En procesos de despido, reestructuración o manejo de información confidencial"
                ], 
                correct: 3,
                explicaciones: ["No es la respuesta. Los informes de gestión rara vez enfrentan la moral personal con la del rol.", "No es la respuesta. La negociación con proveedores puede plantear dilemas, pero no es la situación que la guía destaca.", "No es la respuesta. La planeación y el diseño del organigrama no son, según la guía, los puntos de mayor tensión ética.", "Correcto. Despidos, reestructuraciones y manejo de información confidencial son las situaciones en que más chocan la moral personal y la moral del rol."] 
            },
            { 
                q: "Según el FDOC-088 y la Guía 1, ¿cuál es el propósito del Código de Integridad de la Universidad de Córdoba en la práctica profesional del especialista en GTHDO?", 
                options: [
                    "Establecer un ranking de desempeño entre los especialistas del programa",
                    "Promover la honestidad, el respeto y la transparencia para prevenir la corrupción y favorecer el interés general sobre el particular",
                    "Reemplazar los principios éticos personales por normas institucionales obligatorias",
                    "Regular exclusivamente el uso de tecnología e inteligencia artificial en los procesos de selección"
                ], 
                correct: 1,
                explicaciones: ["No es la respuesta. El Código de Integridad no busca clasificar a los especialistas por desempeño.", "Correcto. El Código de Integridad promueve la honestidad, el respeto y la transparencia para prevenir la corrupción y anteponer el interés general.", "No es la respuesta. El Código no reemplaza los principios personales: los complementa con valores compartidos.", "No es la respuesta. El Código no se limita a la tecnología ni a la IA: orienta toda la práctica profesional."] 
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

        // ===== ACTIVIDAD: DILEMA DE INTEGRIDAD =====
        const wizardTitles = { 1: 'Corriente ética', 2: 'Recursos morales', 3: 'Resolución y prompt' };
        const wizardWidths  = { 1: '33%', 2: '66%', 3: '100%' };

        function wizardNext(step) {
            document.querySelectorAll('.wizard-step').forEach(el => el.classList.add('hidden'));
            const target = document.getElementById('wizard-step-' + step);
            if (target) target.classList.remove('hidden');
            document.getElementById('wizard-label').textContent = 'Paso ' + step + ' de 3';
            document.getElementById('wizard-title-small').textContent = wizardTitles[step];
            document.getElementById('wizard-bar').style.width = wizardWidths[step];
            initDilemaCounters();
        }

        function initDilemaCounters() {
            ['paso1-justificacion', 'paso2-dialogo', 'paso2-confianza', 'paso2-acuerdo', 'paso3-resolucion'].forEach(id => {
                const field = document.getElementById(id);
                if (field) {
                    field.addEventListener('input', () => updateCounter(id));
                    updateCounter(id);
                }
            });
        }

        function generarPromptDilema() {
            const corriente = document.querySelector('input[name="corriente"]:checked');
            const justificacion = document.getElementById('paso1-justificacion')?.value.trim();
            const dialogo = document.getElementById('paso2-dialogo')?.value.trim();
            const confianza = document.getElementById('paso2-confianza')?.value.trim();
            const acuerdo = document.getElementById('paso2-acuerdo')?.value.trim();
            const resolucion = document.getElementById('paso3-resolucion')?.value.trim();

            const faltantes = [];
            if (!corriente) faltantes.push('Paso 1: selecciona una corriente ética');
            if (!justificacion) faltantes.push('Paso 1: justificación de la corriente');
            if (!dialogo) faltantes.push('Paso 2: análisis del Diálogo');
            if (!confianza) faltantes.push('Paso 2: análisis de la Confianza');
            if (!acuerdo) faltantes.push('Paso 2: análisis del Acuerdo legítimo');
            if (!resolucion) faltantes.push('Paso 3: propuesta de resolución');

            if (faltantes.length > 0) {
                alert('Por favor completa los siguientes campos antes de generar el prompt:\n\n• ' + faltantes.join('\n• '));
                return;
            }

            const corrienteLabel = { virtudes: 'Ética de las virtudes', deontologia: 'Ética deontológica', ambas: 'Ambas de forma complementaria' }[corriente.value];

            const prompt = `Eres un docente experto en ética organizacional de la Especialización en Gerencia del Talento Humano y Desarrollo Organizacional (Unicórdoba). Un estudiante ha analizado el siguiente dilema de integridad profesional y debes darle retroalimentación formativa, constructiva y didáctica, usando los criterios del FDOC-088: dominio del contenido, síntesis y pensamiento crítico, aplicación práctica y rigor técnico.

CASO: "La reestructuración silenciosa"
Laura es especialista en GTH. La gerencia le informa en confidencialidad que en 30 días se realizarán 12 despidos. Le piden no comunicar nada al personal mientras coordina sus evaluaciones de desempeño y planes de bienestar. Un trabajador a desvincular, amigo cercano de Laura, le pidió consejo sobre si pedir un crédito bancario de largo plazo basado en su "estabilidad laboral".

ANÁLISIS DEL ESTUDIANTE:

PASO 1 — Corriente ética elegida: ${corrienteLabel}
Justificación: ${justificacion}

PASO 2 — Recursos morales (García-Marzá):
• Diálogo: ${dialogo}
• Confianza: ${confianza}
• Acuerdo legítimo: ${acuerdo}

PASO 3 — Resolución desde la ética del rol:
${resolucion}

Por favor responde con:
1. ¿La corriente ética elegida es la más pertinente para este caso? ¿Por qué?
2. ¿La justificación demuestra comprensión de la diferencia entre ética de las virtudes y deontología?
3. ¿El análisis de los recursos morales (diálogo, confianza, acuerdo) es preciso y aplicado al caso?
4. ¿La propuesta de resolución del Paso 3 equilibra correctamente confidencialidad, honestidad e interés general, en línea con el Código de Integridad de Unicórdoba?
5. ¿Qué aspectos debería profundizar el estudiante para mejorar su análisis ético?
Sé específico, didáctico y usa ejemplos cuando sea posible.`;

            const promptBox = document.getElementById('dilema-prompt');
            if (promptBox) promptBox.value = prompt;

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(prompt).then(() => {
                    mostrarMensajeDilema('✅ Prompt copiado al portapapeles. Pégalo en Google Gemini para recibir tu retroalimentación.');
                }).catch(() => {
                    mostrarMensajeDilema('Copia el prompt manualmente del recuadro y pégalo en Google Gemini.');
                });
            } else {
                mostrarMensajeDilema('Copia el prompt manualmente del recuadro y pégalo en Google Gemini.');
            }
        }

        function mostrarMensajeDilema(msg) {
            const el = document.getElementById('dilema-message');
            if (el) { el.textContent = msg; el.classList.remove('hidden'); }
        }

        function limpiarDilema() {
            document.querySelectorAll('input[name="corriente"]').forEach(r => r.checked = false);
            ['paso1-justificacion', 'paso2-dialogo', 'paso2-confianza', 'paso2-acuerdo', 'paso3-resolucion'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = '';
            });
            const promptBox = document.getElementById('dilema-prompt');
            if (promptBox) promptBox.value = '';
            const msg = document.getElementById('dilema-message');
            if (msg) { msg.textContent = ''; msg.classList.add('hidden'); }
            wizardNext(1);
            const seccion = document.getElementById('actividad');
            if (seccion) seccion.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // ===== FLIP CARDS Y DOMContentLoaded =====
        document.addEventListener('DOMContentLoaded', function() {
            const flipCards = document.querySelectorAll('.flip-card');
            flipCards.forEach(card => {
                card.addEventListener('click', function() {
                    this.classList.toggle('flipped');
                });
            });

            initDilemaCounters();
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
