/* Interacciones del OVA gthdo-pobh-u01-t02. */


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
                question: "Según el Proyecto Tuning, ¿qué dimensiones debe integrar un perfil de cargo basado en competencias?",
                options: [
                    { value: "a", text: "Experiencia laboral, nivel salarial y ubicación geográfica." },
                    { value: "b", text: "El saber, el hacer y el ser." },
                    { value: "c", text: "Títulos académicos, certificaciones y años de antigüedad." }
                ],
                correct: "b"
            },
            {
                question: "¿Qué significan las siglas del Método STAR utilizado en entrevistas de incidentes críticos?",
                options: [
                    { value: "a", text: "Sistema, Tecnología, Análisis y Reporte." },
                    { value: "b", text: "Situación, Tarea, Acción y Resultado." },
                    { value: "c", text: "Selección, Talento, Aptitud y Rendimiento." }
                ],
                correct: "b"
            },
            {
                question: "¿Cuál es el objetivo principal del Employer Branding en el proceso de reclutamiento moderno?",
                options: [
                    { value: "a", text: "Reducir los costos de publicidad en bolsas de empleo." },
                    { value: "b", text: "Proyectar una cultura organizacional atractiva que refleje el propósito y los valores de la empresa." },
                    { value: "c", text: "Automatizar completamente el proceso de selección sin intervención humana." }
                ],
                correct: "b"
            },
            {
                question: "¿Por qué la tendencia de reclutamiento para 2026 exige un enfoque de diversidad, equidad e inclusión (DEI)?",
                options: [
                    { value: "a", text: "Porque la Generación Z valora la autenticidad y el propósito social por encima de las promesas de marketing." },
                    { value: "b", text: "Porque es un requisito legal obligatorio en todos los países de América Latina." },
                    { value: "c", text: "Porque elimina por completo la necesidad de entrevistas presenciales." }
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

        // ===== PESTAÑAS DE ACTIVIDADES =====
        document.querySelectorAll('.act-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.act-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.act-panel').forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(tab.dataset.actTarget).classList.add('active');
            });
        });

        // ===== ACTIVIDAD 1: ¿HUMANO O ALGORITMO? =====
        const paradigmasQuestions = [
            { text: "Filtrar 500 hojas de vida por palabras clave y requisitos mínimos del cargo.", correct: "ia", explanation: "Los ATS (Applicant Tracking Systems) son ideales para analizar grandes volúmenes de datos y filtrar por criterios objetivos de forma rápida." },
            { text: "Evaluar el ajuste cultural y los valores del candidato durante la entrevista.", correct: "humano", explanation: "El ajuste cultural requiere empatía, lectura emocional y comprensión del contexto, habilidades exclusivamente humanas." },
            { text: "Detectar lenguaje sesgado o excluyente en la descripción de una vacante.", correct: "ambos", explanation: "La IA puede identificar patrones de sesgo algorítmico, pero el reclutador humano debe validar el contexto y aplicar el criterio DEI." },
            { text: "Programar y enviar correos personalizados de seguimiento a los candidatos.", correct: "ia", explanation: "La hiper-personalización automatizada mejora la experiencia del candidato y reduce tiempos operativos del reclutador." },
            { text: "Tomar la decisión final de contratación considerando potencial de desarrollo.", correct: "humano", explanation: "La decisión final debe ser humana: involucra juicio profesional, intuición y responsabilidad ética sobre el futuro del candidato." },
            { text: "Auditar si los filtros automáticos del ATS están generando sesgos de género o edad.", correct: "ambos", explanation: "La auditoría algorítmica combina análisis de datos (IA) con interpretación ética y legal (humano) para garantizar equidad en el proceso." }
        ];

        function renderParadigmas() {
            const container = document.getElementById('paradigmas-questions');
            if (!container) return;
            container.innerHTML = paradigmasQuestions.map((q, i) => `
                <div class="p-5 rounded-xl border-2 paradigma-card" data-idx="${i}" style="background: var(--surface-soft); border-color: var(--line);">
                    <p class="text-xs font-bold uppercase tracking-widest mb-2" style="color: #6c757d;">Decisión ${i+1}</p>
                    <p class="font-semibold mb-4" style="color: var(--heading);">${q.text}</p>
                    <div class="flex flex-wrap gap-3">
                        <label class="flex items-center gap-1.5 text-sm font-semibold cursor-pointer px-3 py-1.5 rounded-lg border transition-all" style="border-color: var(--line); background: white;">
                            <input type="radio" name="paradigma-${i}" value="ia" class="paradigma-radio"> <i class="fa-solid fa-robot" style="color: #4285f4;"></i> IA / ATS
                        </label>
                        <label class="flex items-center gap-1.5 text-sm font-semibold cursor-pointer px-3 py-1.5 rounded-lg border transition-all" style="border-color: var(--line); background: white;">
                            <input type="radio" name="paradigma-${i}" value="humano" class="paradigma-radio"> <i class="fa-solid fa-user" style="color: #0f9d58;"></i> Reclutador humano
                        </label>
                        <label class="flex items-center gap-1.5 text-sm font-semibold cursor-pointer px-3 py-1.5 rounded-lg border transition-all" style="border-color: var(--line); background: white;">
                            <input type="radio" name="paradigma-${i}" value="ambos" class="paradigma-radio"> <i class="fa-solid fa-handshake" style="color: #d97706;"></i> Ambos
                        </label>
                    </div>
                    <div class="paradigma-feedback mt-3 hidden"></div>
                </div>
            `).join('');
        }

        window.evaluateParadigmas = function() {
            let totalCorrect = 0;
            paradigmasQuestions.forEach((q, i) => {
                const card = document.querySelector(`.paradigma-card[data-idx="${i}"]`);
                const selected = document.querySelector(`input[name="paradigma-${i}"]:checked`);
                const feedbackDiv = card.querySelector('.paradigma-feedback');
                const isCorrect = selected && selected.value === q.correct;
                if (isCorrect) totalCorrect++;

                card.querySelectorAll('label').forEach(l => { l.style.borderColor = 'var(--line)'; l.style.background = 'white'; });
                if (selected) {
                    const selectedLabel = selected.parentElement;
                    selectedLabel.style.borderColor = isCorrect ? 'var(--accent)' : '#dc2626';
                    selectedLabel.style.background = isCorrect ? '#f0fdf4' : '#fef2f2';
                }

                card.style.borderColor = isCorrect ? 'var(--accent)' : '#dc2626';
                feedbackDiv.innerHTML = `<p class="text-xs"><span>${isCorrect ? '✅' : '❌'}</span> ${q.explanation}</p>`;
                feedbackDiv.classList.remove('hidden');
            });

            const summary = document.getElementById('paradigmas-summary');
            const pct = Math.round((totalCorrect / paradigmasQuestions.length) * 100);
            let msg = pct >= 75 ? '¡Excelente! Comprendes el balance entre IA y criterio humano en el reclutamiento.' : pct >= 50 ? 'Buen avance. Revisa la retroalimentación para distinguir mejor los roles.' : 'Necesitas repasar los conceptos de reclutamiento human-centric con IA.';
            summary.innerHTML = `
                <p class="text-lg font-bold" style="color: var(--heading);">Resultado: ${totalCorrect}/${paradigmasQuestions.length} aciertos (${pct}%)</p>
                <div class="w-full h-3 rounded-full bg-gray-200 mt-3 overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-500" style="width: ${pct}%; background: ${pct >= 75 ? 'var(--accent)' : pct >= 50 ? '#d97706' : '#dc2626'};"></div>
                </div>
                <p class="mt-3 text-sm font-semibold" style="color: ${pct >= 75 ? 'var(--accent)' : pct >= 50 ? '#d97706' : '#dc2626'};">${msg}</p>
            `;
            summary.classList.remove('hidden');
        }

        window.clearParadigmas = function() {
            document.querySelectorAll('.paradigma-radio').forEach(r => r.checked = false);
            document.querySelectorAll('.paradigma-card').forEach(card => {
                card.style.borderColor = 'var(--line)';
                const fb = card.querySelector('.paradigma-feedback');
                fb.classList.add('hidden');
                fb.innerHTML = '';
                card.querySelectorAll('label').forEach(l => { l.style.borderColor = 'var(--line)'; l.style.background = 'white'; });
            });
            document.getElementById('paradigmas-summary').classList.add('hidden');
            document.getElementById('actividad').scrollIntoView({ behavior: 'smooth' });
        }

        // ===== ACTIVIDAD 2: CONSTRUCTOR STAR =====
        const starFragments = [
            { text: "En mi cargo anterior, el equipo de reclutamiento recibía más de 300 postulaciones semanales y no contaba con un sistema automatizado de filtrado.", correct: "situacion", explanation: "Describe el contexto y las circunstancias en las que se encontraba el candidato." },
            { text: "Mi responsabilidad era implementar un ATS que redujera el tiempo de preselección sin perder candidatos con alto potencial.", correct: "tarea", explanation: "Define el objetivo o la responsabilidad asignada dentro de esa situación." },
            { text: "Investigué tres plataformas ATS, lideré una prueba piloto de 4 semanas y capacité al equipo en el uso de filtros por competencias con auditoría de sesgos.", correct: "accion", explanation: "Son las acciones concretas y específicas que el candidato realizó personalmente." },
            { text: "El tiempo de preselección se redujo un 60%, la diversidad de candidatos entrevistados aumentó un 25% y el equipo reportó mayor satisfacción con el proceso.", correct: "resultado", explanation: "Muestra el impacto medible y los logros obtenidos gracias a las acciones tomadas." }
        ];

        function renderStar() {
            const container = document.getElementById('star-questions');
            if (!container) return;
            const starLabels = [
                { value: 'situacion', label: 'Situación', icon: 'fa-map-pin', color: '#4285f4' },
                { value: 'tarea', label: 'Tarea', icon: 'fa-crosshairs', color: '#0f9d58' },
                { value: 'accion', label: 'Acción', icon: 'fa-bolt', color: '#d97706' },
                { value: 'resultado', label: 'Resultado', icon: 'fa-trophy', color: '#dc2626' }
            ];
            container.innerHTML = starFragments.map((q, i) => `
                <div class="p-5 rounded-xl border-2 star-card" data-idx="${i}" style="background: var(--surface-soft); border-color: var(--line);">
                    <p class="text-xs font-bold uppercase tracking-widest mb-2" style="color: #6c757d;">Fragmento ${i+1}</p>
                    <p class="font-semibold mb-4" style="color: var(--heading);">"${q.text}"</p>
                    <div class="flex flex-wrap gap-3">
                        ${starLabels.map(s => `
                            <label class="flex items-center gap-1.5 text-sm font-semibold cursor-pointer px-3 py-1.5 rounded-lg border transition-all" style="border-color: var(--line); background: white;">
                                <input type="radio" name="star-${i}" value="${s.value}" class="star-radio"> <i class="fa-solid ${s.icon}" style="color: ${s.color};"></i> ${s.label}
                            </label>
                        `).join('')}
                    </div>
                    <div class="star-feedback mt-3 hidden"></div>
                </div>
            `).join('');
        }

        window.evaluateStar = function() {
            let totalCorrect = 0;
            starFragments.forEach((q, i) => {
                const card = document.querySelector(`.star-card[data-idx="${i}"]`);
                const selected = document.querySelector(`input[name="star-${i}"]:checked`);
                const feedbackDiv = card.querySelector('.star-feedback');
                const isCorrect = selected && selected.value === q.correct;
                if (isCorrect) totalCorrect++;

                card.querySelectorAll('label').forEach(l => { l.style.borderColor = 'var(--line)'; l.style.background = 'white'; });
                if (selected) {
                    const selectedLabel = selected.parentElement;
                    selectedLabel.style.borderColor = isCorrect ? 'var(--accent)' : '#dc2626';
                    selectedLabel.style.background = isCorrect ? '#f0fdf4' : '#fef2f2';
                }

                card.style.borderColor = isCorrect ? 'var(--accent)' : '#dc2626';
                feedbackDiv.innerHTML = `<p class="text-xs"><span>${isCorrect ? '✅' : '❌'}</span> ${q.explanation}</p>`;
                feedbackDiv.classList.remove('hidden');
            });

            const summary = document.getElementById('star-summary');
            const pct = Math.round((totalCorrect / starFragments.length) * 100);
            let msg = pct >= 75 ? '¡Excelente! Dominas la estructura del método STAR para entrevistas por competencias.' : pct >= 50 ? 'Buen avance. Revisa la retroalimentación para distinguir mejor cada componente.' : 'Necesitas repasar el método STAR. Recuerda: Situación → Tarea → Acción → Resultado.';
            summary.innerHTML = `
                <p class="text-lg font-bold" style="color: var(--heading);">Resultado: ${totalCorrect}/${starFragments.length} aciertos (${pct}%)</p>
                <div class="w-full h-3 rounded-full bg-gray-200 mt-3 overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-500" style="width: ${pct}%; background: ${pct >= 75 ? 'var(--accent)' : pct >= 50 ? '#d97706' : '#dc2626'};"></div>
                </div>
                <p class="mt-3 text-sm font-semibold" style="color: ${pct >= 75 ? 'var(--accent)' : pct >= 50 ? '#d97706' : '#dc2626'};">${msg}</p>
            `;
            summary.classList.remove('hidden');
        }

        window.clearStar = function() {
            document.querySelectorAll('.star-radio').forEach(r => r.checked = false);
            document.querySelectorAll('.star-card').forEach(card => {
                card.style.borderColor = 'var(--line)';
                const fb = card.querySelector('.star-feedback');
                fb.classList.add('hidden');
                fb.innerHTML = '';
                card.querySelectorAll('label').forEach(l => { l.style.borderColor = 'var(--line)'; l.style.background = 'white'; });
            });
            document.getElementById('star-summary').classList.add('hidden');
            document.getElementById('actividad').scrollIntoView({ behavior: 'smooth' });
        }

        // Renderizar actividades al cargar
        renderStar();
        renderParadigmas();

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
