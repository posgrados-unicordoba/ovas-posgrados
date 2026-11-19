/* Interacciones del OVA gthdo-pobh-u01-t01. */


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
                question: "¿Cuál es la diferencia principal entre la psicología industrial tradicional y la psicología organizacional contemporánea?",
                options: [
                    { value: "a", text: "La psicología industrial se enfoca en las emociones y la psicología organizacional en la eficiencia." },
                    { value: "b", text: "La psicología industrial prioriza la eficiencia de las tareas, mientras que la psicología organizacional integra emociones, pensamientos y dinámicas grupales." },
                    { value: "c", text: "No existe diferencia; ambas son la misma disciplina con nombres distintos." }
                ],
                correct: "b"
            },
            {
                question: "¿Qué variables psicológicas se destacan en el ciclo de vida del talento según el Tema 1?",
                options: [
                    { value: "a", text: "Percepción, motivación y aprendizaje." },
                    { value: "b", text: "Número de empleados, presupuesto y tecnología." },
                    { value: "c", text: "Estructura organizacional, procesos y normativa." }
                ],
                correct: "a"
            },
            {
                question: "¿Qué tendencias se consideran críticas para la experiencia del empleado hacia el 2026?",
                options: [
                    { value: "a", text: "El uso exclusivo de evaluaciones de desempeño anuales." },
                    { value: "b", text: "La neuroarquitectura y la orquestación humano-agente con inteligencia artificial." },
                    { value: "c", text: "La eliminación de espacios de trabajo colaborativos." }
                ],
                correct: "b"
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

        // ===== CLASIFICADOR DE PARADIGMAS =====
        const paradigmasQuestions = [
            { text: "El trabajador es considerado una pieza del engranaje fabril cuyo rendimiento debe maximizarse mediante controles y estímulos externos.", correct: "industrial", explanation: "Este enfoque prioriza la eficiencia y el control, propio de la psicología industrial tradicional." },
            { text: "Se analizan las emociones, pensamientos y dinámicas grupales como determinantes del comportamiento organizacional.", correct: "organizacional", explanation: "La psicología organizacional contemporánea integra el bienestar emocional y las relaciones humanas." },
            { text: "La intervención se centra en diseñar ambientes de trabajo saludables y sostenibles para el 2026.", correct: "organizacional", explanation: "Este enfoque actual considera el bienestar y la sostenibilidad humana como ventaja competitiva." },
            { text: "Se mide el tiempo y movimiento de los operarios para estandarizar las tareas productivas.", correct: "industrial", explanation: "La optimización de tiempos y movimientos es característica del enfoque tradicional." }
        ];

        function renderParadigmas() {
            const container = document.getElementById('paradigmas-questions');
            if (!container) return;
            container.innerHTML = paradigmasQuestions.map((q, i) => `
                <div class="p-5 rounded-xl border-2 paradigma-card" data-idx="${i}" style="background: var(--surface-soft); border-color: var(--line);">
                    <p class="text-xs font-bold uppercase tracking-widest mb-2" style="color: #6c757d;">Enunciado ${i+1}</p>
                    <p class="font-semibold mb-4" style="color: var(--heading);">${q.text}</p>
                    <div class="flex flex-wrap gap-3">
                        <label class="flex items-center gap-1.5 text-sm font-semibold cursor-pointer px-3 py-1.5 rounded-lg border transition-all" style="border-color: var(--line); background: white;">
                            <input type="radio" name="paradigma-${i}" value="industrial" class="paradigma-radio"> Psicología industrial tradicional
                        </label>
                        <label class="flex items-center gap-1.5 text-sm font-semibold cursor-pointer px-3 py-1.5 rounded-lg border transition-all" style="border-color: var(--line); background: white;">
                            <input type="radio" name="paradigma-${i}" value="organizacional" class="paradigma-radio"> Psicología organizacional contemporánea
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
            let msg = pct >= 75 ? '¡Excelente! Dominas la diferencia entre ambos paradigmas.' : pct >= 50 ? 'Buen avance. Revisa la retroalimentación para reforzar.' : 'Necesitas repasar los conceptos. Lee con atención la retroalimentación.';
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

        // ===== CRUCIGRAMA CONCEPTUAL =====
        const crucigramaWords = [
            { word: 'PERCEPCION', clue: 'Proceso psicológico de interpretación de estímulos del entorno laboral.' },
            { word: 'MOTIVACION', clue: 'Incentivos internos y externos que impulsan la conducta del colaborador.' },
            { word: 'APRENDIZAJE', clue: 'Adquisición de conductas y conocimientos a partir de la experiencia.' },
            { word: 'TALENTO', clue: 'Capital humano que la organización debe atraer, desarrollar y retener.' },
            { word: 'NEUROCIENCIA', clue: 'Disciplina que estudia el cerebro y aplica insights al diseño de espacios laborales.' }
        ];

        function renderCrucigrama() {
            const container = document.getElementById('crucigrama-words');
            if (!container) return;
            container.innerHTML = crucigramaWords.map((w, i) => `
                <div class="crucigrama-word p-4 rounded-xl border-2" style="background: var(--surface-soft); border-color: var(--line);" data-word="${w.word}">
                    <div class="flex items-start gap-3">
                        <span class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" style="background: var(--accent); color: white;">${i+1}</span>
                        <div class="flex-1">
                            <p class="text-sm font-semibold mb-2" style="color: var(--heading);">${w.clue}</p>
                            <div class="flex flex-wrap gap-1" id="crucigrama-inputs-${i}">
                                ${w.word.split('').map((letter, j) => `<input type="text" maxlength="1" class="crucigrama-input w-10 h-10 text-center font-bold uppercase border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-600" style="border-color: var(--line);" data-index="${j}" oninput="this.value = this.value.toUpperCase(); moveToNextCrucigrama(this, ${j}, ${w.word.length})" onkeydown="moveOnKeyCrucigrama(event, this, ${j}, ${w.word.length})">`).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        window.moveToNextCrucigrama = function(input, index, length) {
            if (input.value.length === 1 && index < length - 1) {
                const next = input.parentElement.querySelector(`input[data-index="${index + 1}"]`);
                if (next) next.focus();
            }
        }

        window.moveOnKeyCrucigrama = function(event, input, index, length) {
            if (event.key === 'Backspace' && input.value === '' && index > 0) {
                const prev = input.parentElement.querySelector(`input[data-index="${index - 1}"]`);
                if (prev) prev.focus();
            }
        }

        window.evaluateCrucigrama = function() {
            let totalCorrect = 0;
            let totalLetters = 0;
            crucigramaWords.forEach((w, i) => {
                const inputs = document.querySelectorAll(`#crucigrama-inputs-${i} input`);
                const wordDiv = inputs[0].closest('.crucigrama-word');
                let wordCorrect = 0;
                inputs.forEach((input, j) => {
                    const letter = input.value.toUpperCase();
                    const correct = w.word[j];
                    totalLetters++;
                    if (letter === correct) {
                        wordCorrect++;
                        totalCorrect++;
                        input.style.borderColor = 'var(--accent)';
                        input.style.background = '#f0fdf4';
                    } else {
                        input.style.borderColor = '#dc2626';
                        input.style.background = '#fef2f2';
                    }
                });
                wordDiv.style.borderColor = wordCorrect === w.word.length ? 'var(--accent)' : '#dc2626';
            });

            const summary = document.getElementById('crucigrama-summary');
            const pct = Math.round((totalCorrect / totalLetters) * 100);
            let msg = pct >= 90 ? '¡Excelente! Dominas el vocabulario del tema.' : pct >= 70 ? 'Buen avance. Revisa las palabras que faltan.' : 'Necesitas repasar los conceptos clave.';
            summary.innerHTML = `
                <p class="text-lg font-bold" style="color: var(--heading);">Resultado: ${totalCorrect}/${totalLetters} letras correctas (${pct}%)</p>
                <div class="w-full h-3 rounded-full bg-gray-200 mt-3 overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-500" style="width: ${pct}%; background: ${pct >= 90 ? 'var(--accent)' : pct >= 70 ? '#d97706' : '#dc2626'};"></div>
                </div>
                <p class="mt-3 text-sm font-semibold" style="color: ${pct >= 90 ? 'var(--accent)' : pct >= 70 ? '#d97706' : '#dc2626'};">${msg}</p>
            `;
            summary.classList.remove('hidden');
        }

        window.clearCrucigrama = function() {
            document.querySelectorAll('.crucigrama-input').forEach(input => {
                input.value = '';
                input.style.borderColor = 'var(--line)';
                input.style.background = 'white';
            });
            document.querySelectorAll('.crucigrama-word').forEach(word => {
                word.style.borderColor = 'var(--line)';
            });
            document.getElementById('crucigrama-summary').classList.add('hidden');
            document.getElementById('actividad').scrollIntoView({ behavior: 'smooth' });
        }

        // Renderizar actividades al cargar
        renderCrucigrama();
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
