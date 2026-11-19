/* Interacciones del OVA gthdo-pobh-u01-t04. */


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
                question: "¿Qué mide principalmente la tasa de rotación en una organización?",
                options: [
                    { value: "a", text: "La salud del ambiente laboral y la estabilidad del talento." },
                    { value: "b", text: "El tiempo promedio para cubrir una vacante." },
                    { value: "c", text: "El costo total de un proceso de selección." }
                ],
                correct: "a"
            },
            {
                question: "¿Qué revela el indicador de tiempo de contratación?",
                options: [
                    { value: "a", text: "La satisfacción general del empleado." },
                    { value: "b", text: "La eficiencia del proceso de atracción y selección." },
                    { value: "c", text: "El nivel de compromiso afectivo con la organización." }
                ],
                correct: "b"
            },
            {
                question: "Al calcular el costo de rotación, ¿qué elementos deben incluirse además de la liquidación?",
                options: [
                    { value: "a", text: "Solo el salario del nuevo empleado." },
                    { value: "b", text: "La pérdida de productividad y la memoria institucional durante la curva de aprendizaje." },
                    { value: "c", text: "El costo de las vacaciones de todo el equipo." }
                ],
                correct: "b"
            },
            {
                question: "¿Qué tipo de People Analytics permite anticipar riesgos de fuga de talento usando datos demográficos y encuestas de pulso?",
                options: [
                    { value: "a", text: "People Analytics descriptivo." },
                    { value: "b", text: "People Analytics predictivo." },
                    { value: "c", text: "People Analytics correctivo." }
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

        // ===== ACTIVIDAD 1: CALCULADORA DE ROTACIÓN Y COSTO DE REEMPLAZO =====
        window.calcularRotacion = function() {
            const empleados = parseFloat(document.getElementById('calc-empleados').value);
            const salidas = parseFloat(document.getElementById('calc-salidas').value);
            const salario = parseFloat(document.getElementById('calc-salario').value);
            const reclutamiento = parseFloat(document.getElementById('calc-reclutamiento').value);
            const dias = parseFloat(document.getElementById('calc-dias').value);
            const productividad = parseFloat(document.getElementById('calc-productividad').value);

            if ([empleados, salidas, salario, reclutamiento, dias, productividad].some(v => isNaN(v) || v < 0)) {
                alert('Por favor completa todos los campos con valores numéricos válidos.');
                return;
            }

            const tasaRotacion = (salidas / empleados) * 100;
            const costoPorVacante = reclutamiento + productividad;
            const costoTotal = costoPorVacante * salidas;
            const salariosEquivalentes = costoTotal / salario;

            const rotacionInterpretacion = tasaRotacion > 20 ? 'alta' : tasaRotacion > 10 ? 'moderada' : 'baja';
            const diasInterpretacion = dias > 45 ? 'alto' : dias > 30 ? 'moderado' : 'bajo';

            const resultado = document.getElementById('calc-resultado');
            resultado.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="p-3 rounded-lg" style="background: white; border: 1px solid var(--line);">
                        <p class="text-xs font-bold uppercase tracking-widest" style="color: #6c757d;">Tasa de rotación</p>
                        <p class="text-2xl font-extrabold" style="color: var(--heading);">${tasaRotacion.toFixed(1)}%</p>
                        <p class="text-xs mt-1" style="color: var(--text);">Nivel: <strong>${rotacionInterpretacion}</strong></p>
                    </div>
                    <div class="p-3 rounded-lg" style="background: white; border: 1px solid var(--line);">
                        <p class="text-xs font-bold uppercase tracking-widest" style="color: #6c757d;">Tiempo de cubrimiento</p>
                        <p class="text-2xl font-extrabold" style="color: var(--heading);">${dias.toFixed(0)} días</p>
                        <p class="text-xs mt-1" style="color: var(--text);">Nivel: <strong>${diasInterpretacion}</strong></p>
                    </div>
                    <div class="p-3 rounded-lg" style="background: white; border: 1px solid var(--line);">
                        <p class="text-xs font-bold uppercase tracking-widest" style="color: #6c757d;">Costo por reemplazo</p>
                        <p class="text-2xl font-extrabold" style="color: var(--heading);">$${costoPorVacante.toLocaleString('es-CO')}</p>
                        <p class="text-xs mt-1" style="color: var(--text);">Equivalente a ${(costoPorVacante / salario).toFixed(1)} salarios mensuales</p>
                    </div>
                    <div class="p-3 rounded-lg" style="background: white; border: 1px solid var(--line);">
                        <p class="text-xs font-bold uppercase tracking-widest" style="color: #6c757d;">Costo total del periodo</p>
                        <p class="text-2xl font-extrabold" style="color: var(--heading);">$${costoTotal.toLocaleString('es-CO')}</p>
                        <p class="text-xs mt-1" style="color: var(--text);">Equivalente a ${salariosEquivalentes.toFixed(1)} salarios mensuales</p>
                    </div>
                </div>
                <div class="mt-4 p-3 rounded-lg" style="background: var(--surface); border: 1px solid var(--line);">
                    <p class="text-sm font-semibold" style="color: var(--heading);">Interpretación:</p>
                    <p class="text-sm mt-1" style="color: var(--text);">Una rotación de <strong>${tasaRotacion.toFixed(1)}%</strong> con <strong>${dias.toFixed(0)} días</strong> para cubrir una vacante sugiere que el proceso de selección ${tasaRotacion > 20 ? 'tiene brechas serias: posiblemente atrae perfiles que no encajan o no filtra competencias críticas.' : tasaRotacion > 10 ? 'presenta oportunidades de mejora en la atracción y el ajuste cultural-técnico.' : 'está controlado, pero conviene seguir monitoreando la calidad de la contratación.'}</p>
                </div>
            `;
            resultado.classList.remove('hidden');
        }

        window.limpiarCalculadora = function() {
            ['calc-empleados', 'calc-salidas', 'calc-salario', 'calc-reclutamiento', 'calc-dias', 'calc-productividad'].forEach(id => {
                document.getElementById(id).value = '';
            });
            document.getElementById('calc-resultado').classList.add('hidden');
            document.getElementById('calc-resultado').innerHTML = '';
            document.getElementById('actividad').scrollIntoView({ behavior: 'smooth' });
        }

        // ===== ACTIVIDAD 2: CASO DE DIAGNÓSTICO DE BRECHAS =====
        const casoQuestions = [
            {
                text: "¿Cuál es la brecha principal del proceso de selección actual de FinTech Nova?",
                options: [
                    { value: "a", text: "El salario ofrecido es inferior al mercado.", correct: false, feedback: "El caso no menciona compensación como problema; el 45% de los contratados no cumple competencias técnicas, lo que apunta a un filtro de selección inadecuado." },
                    { value: "b", text: "El proceso no filtra adecuadamente las competencias técnicas requeridas.", correct: true, feedback: "Correcto. El 45% de incumplimiento de competencias técnicas a los seis meses indica una brecha en la evaluación de habilidades durante la selección." },
                    { value: "c", text: "Falta capacitación en habilidades blandas.", correct: false, feedback: "Las habilidades blandas no son el problema central; la brecha es técnica y del proceso de selección." }
                ]
            },
            {
                text: "¿Qué indicador de People Analytics priorizarías para diagnosticar primero la eficiencia del proceso?",
                options: [
                    { value: "a", text: "Tiempo para cubrir una vacante (time-to-fill).", correct: false, feedback: "Aunque 68 días es alto, el problema principal no es la velocidad, sino la calidad de la contratación." },
                    { value: "b", text: "Tasa de rotación voluntaria.", correct: false, feedback: "La rotación es una consecuencia, pero no revela por qué los contratados no cumplen las competencias." },
                    { value: "c", text: "Calidad de contratación (hiring quality) o tasa de éxito a los seis meses.", correct: true, feedback: "Correcto. La calidad de contratación mide si los seleccionados cumplen las competencias y permanecen, lo que explica tanto la rotación como el incumplimiento técnico." }
                ]
            },
            {
                text: "¿Qué intervención es más pertinente para cerrar la brecha de selección?",
                options: [
                    { value: "a", text: "Agregar una prueba técnica o caso práctico validado por el líder de área.", correct: true, feedback: "Correcto. Validar competencias técnicas con una prueba o caso práctico reduce la brecha entre el perfil requerido y el perfil real de los contratados." },
                    { value: "b", text: "Publicar la vacante en más portales de empleo.", correct: false, feedback: "Más volumen de candidatos no resuelve el problema de calidad; puede incluso aumentar el tiempo de filtrado." },
                    { value: "c", text: "Aumentar el número de entrevistas con RRHH.", correct: false, feedback: "Más entrevistas de RRHH sin un criterio técnico no garantiza que el candidato cumpla las competencias requeridas." }
                ]
            }
        ];

        function renderCaso() {
            const container = document.getElementById('caso-questions');
            if (!container) return;
            container.innerHTML = casoQuestions.map((q, i) => `
                <div class="p-5 rounded-xl border-2 caso-card" data-idx="${i}" style="background: var(--surface-soft); border-color: var(--line);">
                    <p class="text-xs font-bold uppercase tracking-widest mb-2" style="color: #6c757d;">Pregunta ${i+1}</p>
                    <p class="font-semibold mb-4" style="color: var(--heading);">${q.text}</p>
                    <div class="space-y-2">
                        ${q.options.map(opt => `
                            <label class="flex items-start gap-2 text-sm font-semibold cursor-pointer p-3 rounded-lg border transition-all" style="border-color: var(--line); background: white;">
                                <input type="radio" name="caso-${i}" value="${opt.value}" class="caso-radio mt-1">
                                <span style="color: var(--text);">${opt.text}</span>
                            </label>
                        `).join('')}
                    </div>
                    <div class="caso-feedback mt-3 hidden"></div>
                </div>
            `).join('');
        }

        window.evaluarCaso = function() {
            let totalCorrect = 0;
            casoQuestions.forEach((q, i) => {
                const card = document.querySelector(`.caso-card[data-idx="${i}"]`);
                const selected = document.querySelector(`input[name="caso-${i}"]:checked`);
                const selectedOption = q.options.find(o => o.value === (selected ? selected.value : null));
                const isCorrect = selectedOption && selectedOption.correct;
                if (isCorrect) totalCorrect++;

                const feedbackDiv = card.querySelector('.caso-feedback');
                card.querySelectorAll('label').forEach(l => { l.style.borderColor = 'var(--line)'; l.style.background = 'white'; });
                if (selected) {
                    const selectedLabel = selected.parentElement;
                    selectedLabel.style.borderColor = isCorrect ? 'var(--accent)' : '#dc2626';
                    selectedLabel.style.background = isCorrect ? '#f0fdf4' : '#fef2f2';
                }

                card.style.borderColor = isCorrect ? 'var(--accent)' : '#dc2626';
                feedbackDiv.innerHTML = `<p class="text-xs"><span>${isCorrect ? '✅' : '❌'}</span> ${selectedOption ? selectedOption.feedback : 'Selecciona una respuesta.'}</p>`;
                feedbackDiv.classList.remove('hidden');
            });

            const summary = document.getElementById('caso-summary');
            const pct = Math.round((totalCorrect / casoQuestions.length) * 100);
            let msg = pct >= 80 ? '¡Excelente! Identificaste correctamente la brecha de selección, el indicador clave y la intervención más pertinente.' : pct >= 50 ? 'Buen avance. Revisa la retroalimentación para fortalecer el análisis de brechas en selección.' : 'Necesitas repasar el contenido del Tema 4. Recuerda: diagnosticar primero la calidad de contratación y luego intervenir el filtro técnico.';
            summary.innerHTML = `
                <p class="text-lg font-bold" style="color: var(--heading);">Resultado: ${totalCorrect}/${casoQuestions.length} aciertos (${pct}%)</p>
                <div class="w-full h-3 rounded-full bg-gray-200 mt-3 overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-500" style="width: ${pct}%; background: ${pct >= 80 ? 'var(--accent)' : pct >= 50 ? '#d97706' : '#dc2626'};"></div>
                </div>
                <p class="mt-3 text-sm font-semibold" style="color: ${pct >= 80 ? 'var(--accent)' : pct >= 50 ? '#d97706' : '#dc2626'};">${msg}</p>
            `;
            summary.classList.remove('hidden');
        }

        window.limpiarCaso = function() {
            document.querySelectorAll('.caso-radio').forEach(r => r.checked = false);
            document.querySelectorAll('.caso-card').forEach(card => {
                card.style.borderColor = 'var(--line)';
                const fb = card.querySelector('.caso-feedback');
                fb.classList.add('hidden');
                fb.innerHTML = '';
                card.querySelectorAll('label').forEach(l => { l.style.borderColor = 'var(--line)'; l.style.background = 'white'; });
            });
            document.getElementById('caso-summary').classList.add('hidden');
            document.getElementById('actividad').scrollIntoView({ behavior: 'smooth' });
        }

        // Renderizar actividades al cargar
        renderCaso();

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
