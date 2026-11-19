/* Interacciones del OVA gthdo-pobh-u02-t04. */


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

        // Character counters with progress bars
        const textareas = document.querySelectorAll('textarea[maxlength]');
        textareas.forEach(textarea => {
            const counter = document.querySelector(`[data-counter-for="${textarea.id}"]`);
            const progress = document.querySelector(`[data-progress-for="${textarea.id}"]`);
            if (counter) {
                const updateCounter = () => {
                    const current = textarea.value.length;
                    const max = textarea.maxLength;
                    counter.textContent = `${current}/${max}`;
                    if (progress) {
                        const percentage = (current / max) * 100;
                        progress.style.width = `${percentage}%`;
                    }
                };
                textarea.addEventListener('input', updateCounter);
                updateCounter();
            }
        });

        // Initialize justification textareas counters
        const justifTextareas = document.querySelectorAll('.justif-textarea');
        justifTextareas.forEach(textarea => {
            const counter = document.querySelector(`[data-counter-for="${textarea.id}"]`);
            const progress = document.querySelector(`[data-progress-for="${textarea.id}"]`);
            if (counter) {
                const updateCounter = () => {
                    const current = textarea.value.length;
                    const max = textarea.maxLength;
                    counter.textContent = `${current}/${max}`;
                    if (progress) {
                        const percentage = (current / max) * 100;
                        progress.style.width = `${percentage}%`;
                    }
                };
                textarea.addEventListener('input', updateCounter);
                updateCounter();
            }
        });

        // Copy text functionality
        const copyBtns = document.querySelectorAll('[data-copy]');
        copyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.dataset.copy;
                const target = document.getElementById(targetId);
                if (target) {
                    target.select();
                    document.execCommand('copy');
                    const originalText = btn.textContent;
                    btn.textContent = '¡Copiado!';
                    setTimeout(() => btn.textContent = originalText, 2000);
                }
            });
        });

        if (mobileNav) mobileNav.addEventListener('change', event => switchPane(event.target.value));

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

        // McKinsey tabs functionality
        const mckinseyTabBtns = document.querySelectorAll('.mckinsey-tab-btn');
        const mckinseyTabPanes = document.querySelectorAll('.mckinsey-tab-pane');
        mckinseyTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                mckinseyTabBtns.forEach(b => {
                    b.style.background = 'var(--surface-soft)';
                    b.style.color = 'var(--heading)';
                });
                btn.style.background = '#17a2b8';
                btn.style.color = 'white';
                mckinseyTabPanes.forEach(pane => {
                    pane.classList.add('hidden');
                    pane.classList.remove('active');
                });
                const targetPane = document.querySelector(`[data-content="${targetTab}"]`);
                if (targetPane) {
                    targetPane.classList.remove('hidden');
                    targetPane.classList.add('active');
                }
            });
        });

        // Activity tabs functionality
        const activityTabBtns = document.querySelectorAll('.activity-tab-btn');
        const activityTabPanes = document.querySelectorAll('.activity-tab-pane');
        activityTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                activityTabBtns.forEach(b => {
                    b.style.background = 'var(--surface-soft)';
                    b.style.color = 'var(--heading)';
                });
                btn.style.background = 'var(--accent)';
                btn.style.color = 'white';
                activityTabPanes.forEach(pane => {
                    pane.classList.add('hidden');
                    pane.classList.remove('active');
                });
                const targetPane = document.querySelector(`[data-content="${targetTab}"]`);
                if (targetPane) {
                    targetPane.classList.remove('hidden');
                    targetPane.classList.add('active');
                }
            });
        });

        // Quiz functionality - one question at a time
        const quizQuestions = [
            {
                question: "Según la Guía 4, ¿qué permite probar que la mejora del clima impacta en resultados financieros y lealtad del cliente externo?",
                options: [
                    { value: "a", text: "Un análisis descriptivo de rotación y ausentismo." },
                    { value: "b", text: "Modelos de causalidad que cruzan indicadores de clima con resultados de negocio." },
                    { value: "c", text: "Encuestas de satisfacción anuales sin cruzar con otras métricas." }
                ],
                correct: "b"
            },
            {
                question: "¿Qué nivel de madurez de People Analytics permite anticipar riesgos de fuga de talento por clima tóxico?",
                options: [
                    { value: "a", text: "Descriptivo" },
                    { value: "b", text: "Diagnóstico" },
                    { value: "c", text: "Predictivo" },
                    { value: "d", text: "Prescriptivo" }
                ],
                correct: "c"
            },
            {
                question: "Según el formato 088, ¿cuál es una competencia clave del curso Psicología Organizacional y Bienestar Humano?",
                options: [
                    { value: "a", text: "Aplicar sanciones disciplinarias basadas en datos." },
                    { value: "b", text: "Diagnosticar factores psicosociales y proponer decisiones estratégicas con evidencia científica." },
                    { value: "c", text: "Eliminar la subjetividad de los colaboradores en el diagnóstico organizacional." }
                ],
                correct: "b"
            },
            {
                question: "Según la Guía 4, al implementar dashboards de sentimientos en 2026, ¿qué principio ético debe priorizarse?",
                options: [
                    { value: "a", text: "Reportar información agregada y anonimizada para proteger la privacidad." },
                    { value: "b", text: "Identificar y publicar los sentimientos individuales de cada colaborador." },
                    { value: "c", text: "Usar los datos para control punitivo y clasificación de empleados." }
                ],
                correct: "a"
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
                    </div>
                `;
            });

            quizScore.textContent = score;
            quizFeedback.textContent = score === quizQuestions.length ? '¡Excelente! Has respondido todas las preguntas correctamente.' : score >= quizQuestions.length / 2 ? 'Buen trabajo. Revisa las respuestas incorrectas para mejorar.' : 'Te recomiendo repasar el contenido antes de intentar nuevamente.';
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

        // ===== ACTIVIDAD: DASHBOARD DE PEOPLE ANALYTICS =====
        const dashboardQuestions = [
            {
                question: "¿Qué interpretación causal es más sólida según los datos del dashboard?",
                options: [
                    { value: "a", text: "El aumento de ausentismo explica la caída en satisfacción del cliente." },
                    { value: "b", text: "La caída de 5 puntos en confianza del equipo precedió a la caída del 10% en satisfacción del cliente." },
                    { value: "c", text: "La rotación es consecuencia directa de la baja satisfacción del cliente." }
                ],
                correct: "b",
                feedback: "El dashboard muestra una secuencia temporal: primero baja la confianza del equipo y luego la satisfacción del cliente, lo que permite plantear un modelo de causalidad para la toma de decisiones."
            },
            {
                question: "¿Qué nivel de madurez analítica representa principalmente este dashboard?",
                options: [
                    { value: "a", text: "Descriptivo: solo resume lo ocurrido." },
                    { value: "b", text: "Diagnóstico: explica por qué ocurren las tendencias." },
                    { value: "c", text: "Predictivo: modela futuros probables." },
                    { value: "d", text: "Prescriptivo: sugiere acciones concretas." }
                ],
                correct: "b",
                feedback: "Al cruzar confianza del equipo con satisfacción del cliente y rotación, el tablero permite diagnosticar relaciones causales, no solo describir datos."
            },
            {
                question: "¿Qué decisión gerencial es más apropiada para actuar de forma preventiva?",
                options: [
                    { value: "a", text: "Aplicar sanciones disciplinarias por el aumento de ausentismo." },
                    { value: "b", text: "Implementar una encuesta anual de clima para confirmar la tendencia." },
                    { value: "c", text: "Diseñar una intervención sobre confianza del equipo y monitorear el sentimiento en tiempo real." }
                ],
                correct: "c",
                feedback: "La acción preventiva se enfoca en la causa probable (confianza del equipo) con monitoreo continuo, en lugar de reaccionar punitivamente o esperar a una encuesta anual."
            },
            {
                question: "Si se decide monitorear el sentimiento del equipo mediante IA, ¿qué principio de gobernanza ética debe priorizarse?",
                options: [
                    { value: "a", text: "Publicar los comentarios individuales para identificar a los responsables." },
                    { value: "b", text: "Reportar solo información agregada y anonimizada." },
                    { value: "c", text: "Usar los datos para clasificar y sancionar empleados de bajo desempeño." }
                ],
                correct: "b",
                feedback: "La ética de datos exige proteger la privacidad individual mediante anonimización y reporte agregado, evitando usos punitivos."
            }
        ];

        let dashboardStep = 0;
        let dashboardAnswers = {};
        const dashboardQuestionBox = document.getElementById('dashboardQuestionBox');
        const dashboardQuestionText = document.getElementById('dashboardQuestionText');
        const dashboardOptions = document.getElementById('dashboardOptions');
        const dashboardStepTitle = document.getElementById('dashboardStepTitle');
        const dashboardProgressBar = document.getElementById('dashboardProgressBar');
        const dashboardPrev = document.getElementById('dashboardPrev');
        const dashboardNext = document.getElementById('dashboardNext');
        const dashboardMessage = document.getElementById('dashboardMessage');
        const dashboardResults = document.getElementById('dashboardResults');
        const dashboardScore = document.getElementById('dashboardScore');
        const dashboardReview = document.getElementById('dashboardReview');
        const dashboardRestart = document.getElementById('dashboardRestart');

        function renderDashboardStep() {
            if (!dashboardQuestionBox) return;
            const q = dashboardQuestions[dashboardStep];
            dashboardStepTitle.textContent = `Pregunta ${dashboardStep + 1} de ${dashboardQuestions.length}`;
            dashboardProgressBar.style.width = `${((dashboardStep + 1) / dashboardQuestions.length) * 100}%`;
            dashboardQuestionText.textContent = q.question;

            dashboardOptions.innerHTML = q.options.map(opt => `
                <label class="flex items-start gap-3 p-3 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors dashboard-option" data-value="${opt.value}" style="border: 1px solid var(--line); background: var(--surface);">
                    <input type="radio" name="dashboard-q" value="${opt.value}" class="mt-1" ${dashboardAnswers[dashboardStep] === opt.value ? 'checked' : ''}>
                    <span class="text-sm">${opt.text}</span>
                </label>
            `).join('');

            dashboardOptions.querySelectorAll('input[type="radio"]').forEach(radio => {
                radio.addEventListener('change', function() {
                    dashboardAnswers[dashboardStep] = this.value;
                    dashboardOptions.querySelectorAll('.dashboard-option').forEach(label => {
                        label.style.background = 'var(--surface)';
                        label.style.borderColor = 'var(--line)';
                    });
                    this.closest('.dashboard-option').style.background = '#f0fdfa';
                    this.closest('.dashboard-option').style.borderColor = 'var(--accent)';
                    dashboardMessage.textContent = '';
                });
            });

            if (dashboardAnswers[dashboardStep]) {
                const selected = dashboardOptions.querySelector(`input[value="${dashboardAnswers[dashboardStep]}"]`);
                if (selected) {
                    selected.checked = true;
                    selected.closest('.dashboard-option').style.background = '#f0fdfa';
                    selected.closest('.dashboard-option').style.borderColor = 'var(--accent)';
                }
            }

            dashboardPrev.disabled = dashboardStep === 0;
            dashboardNext.textContent = dashboardStep === dashboardQuestions.length - 1 ? 'Ver retroalimentación' : 'Siguiente';
            dashboardMessage.textContent = '';
        }

        function showDashboardResults() {
            let score = 0;
            let reviewHTML = '';

            dashboardQuestions.forEach((q, i) => {
                const userValue = dashboardAnswers[i];
                const isCorrect = userValue === q.correct;
                if (isCorrect) score++;

                const userOption = q.options.find(o => o.value === userValue) || { text: 'Sin respuesta' };
                const correctOption = q.options.find(o => o.value === q.correct);

                reviewHTML += `
                    <div class="p-3 rounded-lg" style="background: ${isCorrect ? '#ecfdf5' : '#fff1f2'}; border: 1px solid ${isCorrect ? '#34d399' : '#fda4af'};">
                        <p class="font-bold text-sm" style="color: var(--heading);">Pregunta ${i + 1}</p>
                        <p class="text-xs mt-1">${q.question}</p>
                        <p class="text-xs mt-2"><strong>Tu respuesta:</strong> ${userOption.text}</p>
                        ${!isCorrect ? `<p class="text-xs mt-1" style="color: var(--accent);"><strong>Respuesta correcta:</strong> ${correctOption.text}</p>` : ''}
                        <p class="text-xs mt-2" style="color: ${isCorrect ? '#059669' : '#be123c'};">${isCorrect ? '✓ Correcto' : '✗ Incorrecto'}</p>
                        <p class="text-xs mt-1 text-slate-600"><strong>Retroalimentación:</strong> ${q.feedback}</p>
                    </div>
                `;
            });

            dashboardScore.textContent = score;
            dashboardReview.innerHTML = reviewHTML;
            dashboardResults.classList.remove('hidden');
            dashboardQuestionBox.parentElement.classList.add('hidden');
            dashboardResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        function goDashboardNext() {
            if (!dashboardAnswers[dashboardStep]) {
                dashboardMessage.textContent = 'Selecciona una respuesta para continuar.';
                return;
            }
            if (dashboardStep < dashboardQuestions.length - 1) {
                dashboardStep++;
                renderDashboardStep();
            } else {
                showDashboardResults();
            }
        }

        function goDashboardPrev() {
            if (dashboardStep > 0) {
                dashboardStep--;
                renderDashboardStep();
            }
        }

        function restartDashboard() {
            dashboardStep = 0;
            dashboardAnswers = {};
            dashboardResults.classList.add('hidden');
            dashboardQuestionBox.parentElement.classList.remove('hidden');
            renderDashboardStep();
            document.getElementById('actividad').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        if (dashboardNext) dashboardNext.addEventListener('click', goDashboardNext);
        if (dashboardPrev) dashboardPrev.addEventListener('click', goDashboardPrev);
        if (dashboardRestart) dashboardRestart.addEventListener('click', restartDashboard);

        renderDashboardStep();

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
