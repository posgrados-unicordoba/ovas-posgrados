/* Interacciones del OVA gthdo-pobh-u03-t05. */

document.addEventListener('DOMContentLoaded', () => {
        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        const contentPanes = document.querySelectorAll('.content-pane');
        const mobileNav = document.getElementById('mobile-nav');

        function switchPane(targetId) {
            contentPanes.forEach(pane => pane.classList.remove('active'));
            const pane = document.getElementById(targetId);
            if (pane) pane.classList.add('active');
            sidebarLinks.forEach(link => link.classList.toggle('active', link.dataset.target === targetId));
            if (mobileNav && mobileNav.value !== targetId) mobileNav.value = targetId;
        }

        sidebarLinks.forEach(link => link.addEventListener('click', event => {
            event.preventDefault();
            switchPane(link.dataset.target);
        }));

        if (mobileNav) {
            mobileNav.addEventListener('change', () => switchPane(mobileNav.value));
        }

        // Accordion functionality
        const accordionBtns = document.querySelectorAll('.accordion-btn');
        accordionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const content = btn.nextElementSibling;
                const icon = btn.querySelector('.fa-chevron-down');
                content.classList.toggle('hidden');
                icon.classList.toggle('rotate-180');
            });
        });

        // Quiz functionality - one question at a time
        const quizQuestions = [
            {
                question: "Al diseñar una hoja de ruta para la transformación organizacional, ¿cuál de los siguientes elementos es indispensable para conectar el propósito superior con la ejecución operativa?",
                options: [
                    { value: "a", text: "La implementación exclusiva de nuevas tecnologías de información." },
                    { value: "b", text: "Un análisis de impacto detallado en personas, procesos y sistemas, junto con un sistema de medición de adopción." },
                    { value: "c", text: "El aumento de la rentabilidad financiera a corto plazo sin considerar el ecosistema." },
                    { value: "d", text: "La reducción de costos operativos mediante la eliminación de programas de bienestar." }
                ],
                correct: "b",
                feedback: "¡Correcto! Un plan de nivel de especialización debe incluir un análisis de impacto detallado en personas, procesos y sistemas, además de métricas de adopción y eficiencia para asegurar que la transformación sea ágil y con propósito."
            },
            {
                question: "Según el marco de los Objetivos de Desarrollo Sostenible (ODS) aplicado a la gestión del talento, ¿cuáles son los objetivos prioritarios para alinear las prácticas humanas en 2026?",
                options: [
                    { value: "a", text: "ODS 1 (Fin de la pobreza) y ODS 2 (Hambre cero)." },
                    { value: "b", text: "ODS 5 (Igualdad de género) y ODS 13 (Acción por el clima)." },
                    { value: "c", text: "ODS 8 (Trabajo Decente) y ODS 10 (Reducción de Desigualdades)." },
                    { value: "d", text: "ODS 9 (Industria e Innovación) y ODS 11 (Ciudades Sostenibles)." }
                ],
                correct: "c",
                feedback: "¡Muy bien! El especialista utiliza específicamente los marcos del ODS 8 y el ODS 10 para alinear la gestión humana con las expectativas de una sociedad que ya no acepta el \"beneficio a cualquier costo\"."
            },
            {
                question: "¿Cómo se define el concepto de \"Sostenibilidad Humana\" en los planes de transformación e innovación?",
                options: [
                    { value: "a", text: "La capacidad de la organización para mantener niveles de producción máximos durante crisis." },
                    { value: "b", text: "El uso de herramientas digitales para reemplazar la mano de obra humana por inteligencia artificial." },
                    { value: "c", text: "La capacidad de regenerar el capital humano a través del bienestar integral y el aprendizaje continuo para evitar el desgaste." },
                    { value: "d", text: "La gestión de recursos ambientales exclusivamente dentro de las oficinas corporativas." }
                ],
                correct: "c",
                feedback: "¡Exacto! La Sostenibilidad Humana se define como la capacidad crítica de regenerar el capital humano, asegurando que el rendimiento organizacional no implique el desgaste o agotamiento de las personas."
            },
            {
                question: "¿Cuál es la finalidad de formular planes que demuestren un Retorno Social de la Inversión (SROI) positivo?",
                options: [
                    { value: "a", text: "Justificar el cumplimiento únicamente de la normativa laboral vigente." },
                    { value: "b", text: "Cuantificar cómo la mejora en salud mental y el desarrollo de habilidades reducen costos por rotación y aumentan la inteligencia colectiva." },
                    { value: "c", text: "Aumentar la visibilidad de la marca empleadora sin realizar cambios estructurales internos." },
                    { value: "d", text: "Evaluar el desempeño individual basándose solo en métricas cuantitativas de productividad." }
                ],
                correct: "b",
                feedback: "¡Correcto! El SROI permite demostrar que cuidar a las personas es una inversión estratégica que reduce el absentismo, fortalece la marca empleadora y asegura la competitividad en mercados éticamente exigentes."
            },
            {
                question: "En la integración de criterios ESG (Ambiental, Social y Gobernanza), ¿qué debe reflejar una Propuesta de Valor al Empleado (PVE) moderna?",
                options: [
                    { value: "a", text: "Beneficios económicos tradicionales desvinculados de la cultura organizacional." },
                    { value: "b", text: "Compromisos reales con la sostenibilidad, la diversidad y la inclusión de \"beneficios verdes\"." },
                    { value: "c", text: "El uso de la transformación digital como un fin último de la organización." },
                    { value: "d", text: "La priorización de sistemas de control disciplinario sobre el bienestar humano." }
                ],
                correct: "b",
                feedback: "¡Excelente! Una PVE alineada con criterios ESG debe integrar \"beneficios verdes\" (como transporte sustentable) y asegurar la equidad e inclusión real en todos los niveles de la organización."
            }
        ];

        let currentQuestion = 0;
        let userAnswers = {};

        const quizBox = document.getElementById('quiz-box');
        const quizResults = document.getElementById('quiz-results');
        const quizTitle = document.getElementById('quiz-title');
        const quizProgress = document.getElementById('quiz-progress');
        const quizText = document.getElementById('quiz-text');
        const quizOptions = document.getElementById('quiz-options');
        const quizPrev = document.getElementById('quiz-prev');
        const quizNext = document.getElementById('quiz-next');
        const quizScore = document.getElementById('quiz-score');
        const quizLevel = document.getElementById('quiz-level');
        const quizFeedback = document.getElementById('quiz-feedback');
        const quizReview = document.getElementById('quiz-review');
        const quizRestart = document.getElementById('quiz-restart');

        function renderQuestion() {
            const q = quizQuestions[currentQuestion];
            quizTitle.textContent = `Pregunta ${currentQuestion + 1}`;
            quizProgress.textContent = `${currentQuestion + 1}/${quizQuestions.length}`;
            quizText.textContent = q.question;

            quizOptions.innerHTML = '';
            q.options.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'quiz-option';
                btn.textContent = opt.text;
                btn.dataset.value = opt.value;
                if (userAnswers[currentQuestion] === opt.value) {
                    btn.classList.add('selected');
                }
                btn.addEventListener('click', () => {
                    userAnswers[currentQuestion] = opt.value;
                    document.querySelectorAll('.quiz-option').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                });
                quizOptions.appendChild(btn);
            });

            quizPrev.disabled = currentQuestion === 0;
            quizNext.textContent = currentQuestion === quizQuestions.length - 1 ? 'Finalizar' : 'Siguiente';
        }

        quizPrev.addEventListener('click', () => {
            if (currentQuestion > 0) {
                currentQuestion--;
                renderQuestion();
            }
        });

        quizNext.addEventListener('click', () => {
            // Validate that current question is answered
            if (!userAnswers[currentQuestion]) {
                alert('Por favor selecciona una respuesta antes de continuar.');
                return;
            }

            if (currentQuestion < quizQuestions.length - 1) {
                currentQuestion++;
                renderQuestion();
            } else {
                showResults();
            }
        });

        function showResults() {
            let score = 0;
            let reviewHTML = '';

            quizQuestions.forEach((q, i) => {
                const userAnswer = userAnswers[i];
                const isCorrect = userAnswer === q.correct;
                if (isCorrect) score++;

                const userOption = q.options.find(opt => opt.value === userAnswer);
                const correctOption = q.options.find(opt => opt.value === q.correct);

                reviewHTML += `
                    <div class="p-4 rounded-lg" style="background: ${isCorrect ? 'var(--surface-soft)' : 'var(--surface)'}; border: 1px solid ${isCorrect ? 'var(--accent)' : 'var(--line)'};">
                        <p class="font-bold" style="color: var(--heading);">Pregunta ${i + 1}</p>
                        <p class="mt-2 text-sm" style="color: var(--text);">${q.question}</p>
                        <p class="mt-2 text-sm" style="color: var(--text);"><strong>Tu respuesta:</strong> ${userOption ? userOption.text : 'Sin respuesta'}</p>
                        ${!isCorrect ? `<p class="mt-1 text-sm" style="color: var(--accent);"><strong>Respuesta correcta:</strong> ${correctOption.text}</p>` : ''}
                        <p class="mt-1 text-sm font-semibold" style="color: ${isCorrect ? 'var(--accent)' : '#dc2626'};">${isCorrect ? '✓ Correcto' : '✗ Incorrecto'}</p>
                        ${isCorrect ? `<p class="mt-2 text-xs italic" style="color: var(--text);">${q.feedback}</p>` : ''}
                    </div>
                `;
            });

            quizScore.textContent = score;

            const levels = {
                0: 'Prestructural',
                1: 'Prestructural',
                2: 'Uniestructural',
                3: 'Multiestructural',
                4: 'Relacional (3.8 - 4.5)',
                5: 'Abstracto Ampliado (4.6 - 5.0)'
            };
            quizLevel.textContent = levels[score];

            quizFeedback.textContent = score === quizQuestions.length
                ? '¡Excelente! Alcanzaste el nivel Abstracto Ampliado, demostrando una comprensión profunda y precisa de la aplicabilidad de los conceptos en diversos contextos.'
                : score === quizQuestions.length - 1
                    ? 'Muy bien. Alcanzaste el nivel Relacional, integrando correctamente los criterios de sostenibilidad organizacional.'
                    : 'Te recomiendo repasar el contenido del tema para fortalecer tu comprensión de los criterios ESG, ODS y SROI.';
            quizReview.innerHTML = reviewHTML;

            quizBox.classList.add('hidden');
            quizResults.classList.remove('hidden');
        }

        quizRestart.addEventListener('click', () => {
            currentQuestion = 0;
            userAnswers = {};
            quizBox.classList.remove('hidden');
            quizResults.classList.add('hidden');
            renderQuestion();
            // Scroll to top of evaluation section
            document.getElementById('evaluacion').scrollIntoView({ behavior: 'smooth' });
        });

        // Initialize quiz
        if (quizBox) {
            renderQuestion();
        }

        // ===== ACTIVIDAD: SIMULADOR DE TRANSFORMACIÓN SOSTENIBLE 2026 =====
        const ACT_KEY = 'ova_tema5_actividad';
        const transformInput = document.getElementById('transformInput');
        const transformWordCount = document.getElementById('transformWordCount');
        const ethicsCheck = document.getElementById('ethicsCheck');
        const validarPropuestaBtn = document.getElementById('validarPropuestaBtn');
        const transformOutput = document.getElementById('transformOutput');
        const transformPrompt = document.getElementById('transformPrompt');
        const actReviewMsg = document.getElementById('actReviewMsg');
        const actSaveMsg = document.getElementById('actSaveMsg');
        const actClear = document.getElementById('actClear');

        const AGENT_SYSTEM_PROMPT = `Actúa como un experto en Gerencia de Talento Humano y Desarrollo Organizacional. Tu función es evaluar la propuesta de transformación del estudiante basándote estrictamente en los siguientes criterios del curso:
1. Enfoque ESG y ODS: La propuesta debe mencionar acciones para el ODS 8 (Trabajo Decente) o el ODS 10 (Reducción de Desigualdades).
2. Sostenibilidad Humana: Debe evitar planes que generen desgaste laboral y priorizar la "capacidad de regenerar el capital humano" a través del bienestar y aprendizaje continuo.
3. Rigor Técnico (SROI): El estudiante debe proponer al menos un indicador para medir el impacto social o la eficiencia, como la reducción de costos por rotación o mejora en salud mental.
4. Propuesta de Valor al Empleado (PVE): Debe incluir "beneficios verdes" o compromisos reales con la diversidad.

Formato de respuesta para el estudiante:
- Diagnóstico rápido: (1 frase sobre la coherencia del plan).
- Fortaleza: (Lo mejor de la propuesta según los criterios ESG).
- Oportunidad de Mejora: (Qué falta para lograr un SROI positivo).
- Nivel de Desempeño: (Asignar un nivel: Prestructural, Uniestructural, Multiestructural, Relacional o Abstracto Ampliado, basándose en la rúbrica del curso).`;

        function countWords(text) {
            const trimmed = text.trim();
            return trimmed ? trimmed.split(/\s+/).length : 0;
        }

        function updateValidateState() {
            const words = countWords(transformInput.value);
            const hasText = words > 0;
            const checked = ethicsCheck.checked;
            validarPropuestaBtn.disabled = !(hasText && checked && words <= 300);
        }

        if (transformInput) {
            transformInput.addEventListener('input', () => {
                let words = transformInput.value.trim().split(/\s+/).filter(Boolean);
                if (words.length > 300) {
                    words = words.slice(0, 300);
                    transformInput.value = words.join(' ');
                }
                transformWordCount.textContent = words.length;
                updateValidateState();
            });
        }

        if (ethicsCheck) ethicsCheck.addEventListener('change', updateValidateState);

        function buildTransformPrompt() {
            const propuesta = transformInput.value.trim();
            return `${AGENT_SYSTEM_PROMPT}\n\nPROPUESTA DEL ESTUDIANTE:\n${propuesta}`;
        }

        if (validarPropuestaBtn) {
            validarPropuestaBtn.addEventListener('click', () => {
                if (validarPropuestaBtn.disabled) return;
                transformPrompt.value = buildTransformPrompt();
                transformOutput.classList.remove('hidden');
                localStorage.setItem(ACT_KEY, JSON.stringify({ propuesta: transformInput.value, ethics: ethicsCheck.checked }));
                if (actSaveMsg) {
                    actSaveMsg.textContent = '✓ Propuesta validada';
                    setTimeout(() => { actSaveMsg.textContent = ''; }, 3000);
                }
                transformOutput.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }

        const copyPromptBtn = document.getElementById('copyPromptBtn');
        if (copyPromptBtn) {
            copyPromptBtn.addEventListener('click', () => {
                const prompt = transformPrompt.value || buildTransformPrompt();
                navigator.clipboard.writeText(prompt).then(() => {
                    if (actReviewMsg) {
                        actReviewMsg.textContent = '✓ Prompt copiado. Abriendo ChatGPT...';
                        setTimeout(() => { actReviewMsg.textContent = ''; }, 4000);
                    }
                    window.open('https://chatgpt.com/', '_blank', 'noopener,noreferrer');
                }).catch(() => {
                    if (actReviewMsg) {
                        actReviewMsg.textContent = 'No se pudo copiar automáticamente. Copia el texto del campo y pégalo en ChatGPT.';
                    }
                });
            });
        }

        if (actClear) {
            actClear.addEventListener('click', () => {
                transformInput.value = '';
                transformWordCount.textContent = '0';
                ethicsCheck.checked = false;
                updateValidateState();
                transformOutput.classList.add('hidden');
                localStorage.removeItem(ACT_KEY);
                if (actSaveMsg) { actSaveMsg.textContent = '✓ Limpiado'; setTimeout(() => { actSaveMsg.textContent = ''; }, 3000); }
                document.getElementById('actividad').scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }

        // Load saved data
        (function loadActData() {
            try {
                const saved = JSON.parse(localStorage.getItem(ACT_KEY));
                if (!saved) return;
                if (transformInput && saved.propuesta) {
                    transformInput.value = saved.propuesta;
                    transformWordCount.textContent = countWords(saved.propuesta);
                }
                if (ethicsCheck && saved.ethics) ethicsCheck.checked = true;
                updateValidateState();
            } catch(e) {}
        })();

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
