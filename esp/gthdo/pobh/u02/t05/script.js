/* Interacciones del OVA gthdo-pobh-u02-t05. */


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
                question: "Una organización solo implementa actividades recreativas (viernes de integración, gimnasio) para mejorar el bienestar de sus colaboradores, pero no evidencia cambios en el compromiso ni el desempeño. Desde la perspectiva del Modelo PERMA, ¿cuál es la explicación más adecuada?",
                options: [
                    { value: "a", text: "El bienestar depende exclusivamente de factores extrínsecos como el ocio, por lo que basta con aumentar la frecuencia de las actividades.", feedback: "Incorrecto. El Modelo PERMA no reduce el bienestar a factores extrínsecos recreativos; aumentar su frecuencia no activa los demás pilares del modelo." },
                    { value: "b", text: "El enfoque recreativo aislado no aborda los cinco pilares estructurales del bienestar (P-E-R-M-A), como el sentido de propósito o el compromiso profundo, que requieren intervenciones más integrales.", feedback: "Correcto. El Modelo PERMA plantea que el bienestar es multidimensional y estructural; las actividades recreativas pueden aportar al pilar de emociones positivas, pero sin intervenciones que también fortalezcan el compromiso, los vínculos, el propósito y el logro, el impacto será superficial y no sostenible." },
                    { value: "c", text: "El Modelo PERMA no aplica a organizaciones que ya realizan actividades de bienestar.", feedback: "Incorrecto. El modelo aplica a cualquier organización; el punto no es si existen actividades, sino si abordan los cinco pilares de forma integral." },
                    { value: "d", text: "La falta de resultados indica que el Modelo PERMA es principalmente teórico y difícil de aplicar en contextos reales.", feedback: "Incorrecto. El caso no evidencia una limitación del modelo, sino una aplicación parcial de este por parte de la organización." }
                ],
                correct: "b"
            },
            {
                question: "El área de Talento Humano de una empresa colombiana diseña una \"Ruta de la Felicidad\" que incluye bonos de gimnasio, día libre en cumpleaños y capacitaciones. Sin embargo, la rotación voluntaria no disminuye. ¿Cuál es la razón más probable, según el enfoque de salario emocional visto en el contenido?",
                options: [
                    { value: "a", text: "Los beneficios ofrecidos no son suficientes en cantidad; se necesita aumentar el número de incentivos no monetarios.", feedback: "Incorrecto. El problema no es la cantidad de beneficios, sino que estén desconectados de las necesidades reales del colaborador y su entorno." },
                    { value: "b", text: "La Ruta no considera el equilibrio vida-trabajo ni el impacto en el núcleo familiar del colaborador, ni políticas de equidad, elementos clave para que el salario emocional impacte la retención.", feedback: "Correcto. El contenido señala que el diseño debe ser inclusivo con el núcleo familiar e integrar equidad y diversidad; sin estos elementos, la Ruta de la Felicidad pierde impacto en la retención." },
                    { value: "c", text: "El salario emocional únicamente sustituye los bonos económicos, por lo que la empresa debería enfocarse en aumentar los salarios.", feedback: "Incorrecto. El salario emocional complementa, no sustituye, la compensación económica." },
                    { value: "d", text: "La rotación voluntaria depende exclusivamente de factores externos al control de la organización, como el mercado laboral.", feedback: "Incorrecto. El contenido enfatiza que las organizaciones pueden reducir la rotación voluntaria mediante estrategias internas bien diseñadas." }
                ],
                correct: "b"
            },
            {
                question: "Una empresa permite el teletrabajo total, pero sus líderes continúan enviando mensajes y solicitando entregas fuera del horario laboral, generando agotamiento en los equipos. ¿Qué elemento del contenido explica mejor esta situación?",
                options: [
                    { value: "a", text: "El teletrabajo, por definición, ya garantiza la autonomía real y la desconexión digital de los colaboradores.", feedback: "Incorrecto. El contenido distingue entre \"teletrabajo\" como modalidad y \"autonomía real\" como práctica cultural; tener la modalidad remota no garantiza, por sí sola, la desconexión digital." },
                    { value: "b", text: "La flexibilidad real requiere protocolos culturales explícitos de desconexión digital, más allá de la modalidad de trabajo remoto en sí misma.", feedback: "Correcto. Hacia 2026 la flexibilidad exige protocolos culturales explícitos —no solo la modalidad remota— que eviten mensajes fuera de horario salvo emergencias reales." },
                    { value: "c", text: "El agotamiento se debe únicamente a la carga de trabajo, sin relación con las prácticas de comunicación fuera de horario.", feedback: "Incorrecto. El contenido identifica la falta de protocolos de desconexión digital como un factor directo de estrés crónico y burnout." },
                    { value: "d", text: "La presencialidad estratégica es incompatible con el teletrabajo, por lo que la empresa debería eliminar la modalidad remota.", feedback: "Incorrecto. El contenido presenta la presencialidad estratégica y el teletrabajo como complementarios, no excluyentes." }
                ],
                correct: "b"
            },
            {
                question: "Un especialista en Talento Humano debe presentar ante la gerencia un plan de mejora de clima laboral, pero solo cuenta con presupuesto limitado para una sola iniciativa. ¿Cuál sería la decisión más alineada con el enfoque integral visto en esta guía?",
                options: [
                    { value: "a", text: "Priorizar exclusivamente una actividad recreativa masiva, ya que genera visibilidad inmediata ante la organización.", feedback: "Incorrecto. Una actividad aislada, aunque visible, no aborda el carácter estructural del bienestar que exige el Modelo PERMA." },
                    { value: "b", text: "Diseñar una intervención acotada pero que combine al menos un elemento de PERMA, uno de salario emocional/Ruta de la Felicidad y un protocolo de desconexión digital, sustentada en indicadores.", feedback: "Correcto. El enfoque integral del contenido sugiere combinar los tres ejes de forma articulada y basada en evidencia, incluso con recursos limitados." },
                    { value: "c", text: "Enfocar todo el presupuesto en la medición del clima laboral, sin implementar ninguna acción de mejora este periodo.", feedback: "Incorrecto. Medir sin intervenir no genera mejoras; el plan de mejora requiere diagnóstico y acción." },
                    { value: "d", text: "Replicar exactamente un plan de bienestar de otra empresa del sector, sin adaptarlo a los indicadores propios de la organización.", feedback: "Incorrecto. Replicar sin adaptar ignora el diagnóstico propio de la organización, principio central del diseño de planes de mejora basados en datos." }
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
        const quizMessage = document.getElementById('quiz-message');

        function renderQuestion() {
            const q = quizQuestions[currentQuestion];
            quizTitle.textContent = `Pregunta ${currentQuestion + 1}`;
            quizProgress.textContent = `${currentQuestion + 1}/${quizQuestions.length}`;
            quizText.textContent = q.question;
            if (quizMessage) quizMessage.textContent = '';

            quizOptions.innerHTML = '';
            q.options.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'quiz-option';
                btn.setAttribute('role', 'radio');
                btn.setAttribute('aria-checked', userAnswers[currentQuestion] === opt.value ? 'true' : 'false');
                btn.textContent = opt.text;
                btn.dataset.value = opt.value;
                if (userAnswers[currentQuestion] === opt.value) {
                    btn.classList.add('selected');
                }
                btn.addEventListener('click', () => {
                    userAnswers[currentQuestion] = opt.value;
                    if (quizMessage) quizMessage.textContent = '';
                    document.querySelectorAll('.quiz-option').forEach(b => { b.classList.remove('selected'); b.setAttribute('aria-checked', 'false'); });
                    btn.classList.add('selected');
                    btn.setAttribute('aria-checked', 'true');
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
            // Validate that current question is answered (inline message, no popup)
            if (!userAnswers[currentQuestion]) {
                if (quizMessage) quizMessage.textContent = 'Por favor selecciona una respuesta antes de continuar.';
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

                reviewHTML += `
                    <div class="p-4 rounded-lg" style="background: ${isCorrect ? 'var(--surface-soft)' : 'var(--surface)'}; border: 1px solid ${isCorrect ? 'var(--accent)' : 'var(--line)'};">
                        <p class="font-bold" style="color: var(--heading);">Pregunta ${i + 1}</p>
                        <p class="mt-2 text-sm" style="color: var(--text);">${q.question}</p>
                        <p class="mt-2 text-sm" style="color: var(--text);"><strong>Tu respuesta:</strong> ${userOption ? userOption.text : 'Sin respuesta'}</p>
                        <p class="mt-2 text-sm" style="color: ${isCorrect ? 'var(--accent)' : '#dc2626'};">${userOption ? userOption.feedback : ''}</p>
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

        // ===== ACTIVIDAD: DISEÑA TU RUTA DE BIENESTAR (wizard de 5 pasos) =====
        const actSteps = [
            {
                label: "Diagnóstico",
                prompt: "A partir de los indicadores del caso (o de los de tu propia organización), interpreta los datos e identifica en qué pilar del Modelo PERMA (P-E-R-M-A) hay mayor debilidad. Justifica tu lectura.",
                maxLength: 500
            },
            {
                label: "Diseño de acciones",
                prompt: "Propón 3 acciones concretas de mejora, una por cada eje trabajado en el contenido (Modelo PERMA; salario emocional / Ruta de la Felicidad; flexibilidad real y desconexión digital). Indica responsable y tiempo estimado para cada una.",
                maxLength: 700
            },
            {
                label: "Protocolo de desconexión digital",
                prompt: "Redacta, en máximo 5 líneas, un mini-protocolo de desconexión digital aplicable al equipo del caso.",
                maxLength: 400
            },
            {
                label: "Justificación con evidencia (cita en formato APA)",
                prompt: "Sustenta tus acciones citando en formato APA al menos una fuente teórica de las referencias del curso, complementada con un dato o benchmark del sector.",
                maxLength: 500
            },
            {
                label: "Indicador de éxito y proyección de impacto",
                prompt: "Propón una métrica cuantificable (ej. reducción % de rotación voluntaria, mejora en eNPS) y justifica la meta, proyectando el impacto esperado a 6 meses.",
                maxLength: 400
            }
        ];

        // Caso de partida: caso propio opcional del estudiante
        const DEFAULT_CASE_TEXT = 'Caso de referencia — Absentismo por salud mental: 21% (meta 10%). Rotación voluntaria: 27% (meta 12%). eNPS: +8 (meta +30). Mensajes fuera de horario: frecuentes (meta: solo emergencias). Voz del colaborador: "Me gusta mi equipo, pero siempre estoy pendiente del celular incluso los fines de semana. Ya no sé cuándo termina mi jornada."';
        const customCaseInput = document.getElementById('customCaseInput');
        const customCaseCounter = document.getElementById('customCaseCounter');

        function updateCounter(inputEl, counterEl, max) {
            if (!inputEl || !counterEl) return;
            const len = inputEl.value.length;
            counterEl.textContent = `${len}/${max} caracteres`;
            counterEl.style.color = len >= max ? '#dc2626' : '#6c757d';
        }

        if (customCaseInput) {
            customCaseInput.addEventListener('input', () => updateCounter(customCaseInput, customCaseCounter, 600));
            updateCounter(customCaseInput, customCaseCounter, 600);
        }

        // Autodiagnóstico interactivo PERMA + asistente (reglas pedagógicas, no llamada externa)
        const PERMA_PILLARS = [
            { key: 'P', name: 'Emociones positivas' },
            { key: 'E', name: 'Compromiso' },
            { key: 'R', name: 'Vínculos' },
            { key: 'M', name: 'Propósito' },
            { key: 'A', name: 'Logro' }
        ];
        const PERMA_TIPS = {
            P: 'Diseña micro-momentos de reconocimiento y gratitud en las reuniones de equipo antes de escalar a beneficios recreativos costosos.',
            E: 'Revisa el nivel de autonomía y desafío intelectual en las tareas asignadas; rediseña al menos una responsabilidad clave (Job Crafting) para generar mayor involucramiento.',
            R: 'Evalúa la calidad —no solo la frecuencia— de los espacios de interacción; prioriza formatos de conexión genuina (mentorías cruzadas) sobre eventos masivos.',
            M: 'Conecta explícitamente las tareas operativas con el propósito organizacional; una sesión sobre el "para qué" del rol puede fortalecer este pilar más que un incentivo monetario.',
            A: 'Introduce hitos visibles de progreso y reconocimiento de logros intermedios, no solo metas anuales; el reconocimiento oportuno sostiene mejor la motivación que el diferido.'
        };
        let permaValues = { P: 3, E: 3, R: 3, M: 3, A: 3 };
        const permaSlidersEl = document.getElementById('permaSliders');
        const permaWeakestEl = document.getElementById('permaWeakest');
        const permaSuggestionEl = document.getElementById('permaSuggestion');

        function renderPermaSliders() {
            if (!permaSlidersEl) return;
            permaSlidersEl.innerHTML = PERMA_PILLARS.map(p => `
                <div>
                    <div class="flex justify-between text-xs font-semibold mb-1" style="color: var(--text);">
                        <span>${p.key} — ${p.name}</span>
                        <span id="permaVal${p.key}">${permaValues[p.key]}/5</span>
                    </div>
                    <input type="range" min="1" max="5" step="1" value="${permaValues[p.key]}" data-pillar="${p.key}" class="perma-slider" style="width: 100%; accent-color: var(--accent);">
                </div>
            `).join('');
            permaSlidersEl.querySelectorAll('.perma-slider').forEach(sl => {
                sl.addEventListener('input', () => {
                    permaValues[sl.dataset.pillar] = parseInt(sl.value, 10);
                    const valEl = document.getElementById('permaVal' + sl.dataset.pillar);
                    if (valEl) valEl.textContent = sl.value + '/5';
                    updatePermaAssistant();
                });
            });
        }

        function updatePermaAssistant() {
            if (!permaWeakestEl) return;
            const min = Math.min(...Object.values(permaValues));
            const weakest = PERMA_PILLARS.filter(p => permaValues[p.key] === min);
            permaWeakestEl.textContent = weakest.map(p => `${p.key} — ${p.name}`).join(' y ') + ` (puntaje ${min}/5)`;
            permaSuggestionEl.textContent = weakest.map(p => PERMA_TIPS[p.key]).join(' ');
        }

        function getPermaSummaryText() {
            const lines = PERMA_PILLARS.map(p => `${p.key} (${p.name}): ${permaValues[p.key]}/5`);
            return `Autodiagnóstico PERMA (interactivo)\n${lines.join('\n')}\nPilar(es) más débil(es): ${permaWeakestEl ? permaWeakestEl.textContent : ''}\nSugerencia del asistente: ${permaSuggestionEl ? permaSuggestionEl.textContent : ''}`;
        }

        renderPermaSliders();
        updatePermaAssistant();

        let actStep = 0;
        let actAnswers = {};
        const actStepBox = document.getElementById('actStepBox');
        const actStepPrompt = document.getElementById('actStepPrompt');
        const actStepLabel = document.getElementById('actStepLabel');
        const actStepInput = document.getElementById('actStepInput');
        const actStepTitle = document.getElementById('actStepTitle');
        const actProgressBar = document.getElementById('actProgressBar');
        const actPrev = document.getElementById('actPrev');
        const actNext = document.getElementById('actNext');
        const actMessage = document.getElementById('actMessage');
        const actResults = document.getElementById('actResults');
        const actReview = document.getElementById('actReview');
        const actRestart = document.getElementById('actRestart');
        const actCopy = document.getElementById('actCopy');
        const actCopyMsg = document.getElementById('actCopyMsg');
        const actStepCounter = document.getElementById('actStepCounter');
        const actDownloadBtn = document.getElementById('actDownloadBtn');
        const actDownloadMenu = document.getElementById('actDownloadMenu');
        const actDownloadWord = document.getElementById('actDownloadWord');
        const actDownloadTxt = document.getElementById('actDownloadTxt');

        function renderActStep() {
            if (!actStepBox) return;
            const s = actSteps[actStep];
            actStepTitle.textContent = `Paso ${actStep + 1} de ${actSteps.length} — ${s.label}`;
            actProgressBar.style.width = `${((actStep + 1) / actSteps.length) * 100}%`;
            actStepPrompt.textContent = s.prompt;
            actStepLabel.textContent = s.label;
            actStepInput.value = actAnswers[actStep] || '';
            actStepInput.setAttribute('maxlength', s.maxLength);
            updateCounter(actStepInput, actStepCounter, s.maxLength);
            actMessage.textContent = '';

            actPrev.disabled = actStep === 0;
            actNext.textContent = actStep === actSteps.length - 1 ? 'Ver mi Ruta de Bienestar' : 'Siguiente';
        }

        function getCaseText() {
            const custom = customCaseInput ? customCaseInput.value.trim() : '';
            return custom ? `Caso propio del estudiante: ${custom}` : DEFAULT_CASE_TEXT;
        }

        function showActResults() {
            actAnswers[actStep] = actStepInput.value.trim();

            let reviewHTML = `
                <div class="p-3 rounded-lg" style="background: var(--surface-soft); border: 1px solid var(--line);">
                    <p class="font-bold text-sm" style="color: var(--heading);">0. Caso utilizado</p>
                    <p class="text-xs mt-2 whitespace-pre-wrap" style="color: var(--text);">${getCaseText().replace(/</g, '&lt;')}</p>
                </div>
                <div class="p-3 rounded-lg" style="background: var(--surface-soft); border: 1px solid var(--line);">
                    <p class="font-bold text-sm" style="color: var(--heading);">0.5 Autodiagnóstico PERMA (interactivo)</p>
                    <p class="text-xs mt-2 whitespace-pre-wrap" style="color: var(--text);">${getPermaSummaryText().replace(/</g, '&lt;')}</p>
                </div>
            `;
            actSteps.forEach((s, i) => {
                const answer = actAnswers[i] || 'Sin respuesta';
                reviewHTML += `
                    <div class="p-3 rounded-lg" style="background: var(--surface-soft); border: 1px solid var(--line);">
                        <p class="font-bold text-sm" style="color: var(--heading);">${i + 1}. ${s.label}</p>
                        <p class="text-xs mt-2 whitespace-pre-wrap" style="color: var(--text);">${answer.replace(/</g, '&lt;')}</p>
                    </div>
                `;
            });

            actReview.innerHTML = reviewHTML;
            actResults.classList.remove('hidden');
            actStepBox.parentElement.classList.add('hidden');
            actResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        function goActNext() {
            const value = actStepInput.value.trim();
            if (!value) {
                actMessage.textContent = 'Escribe tu respuesta antes de continuar.';
                return;
            }
            actAnswers[actStep] = value;

            if (actStep < actSteps.length - 1) {
                actStep++;
                renderActStep();
            } else {
                showActResults();
            }
        }

        function goActPrev() {
            actAnswers[actStep] = actStepInput.value.trim();
            if (actStep > 0) {
                actStep--;
                renderActStep();
            }
        }

        function restartAct() {
            actStep = 0;
            actAnswers = {};
            permaValues = { P: 3, E: 3, R: 3, M: 3, A: 3 };
            renderPermaSliders();
            updatePermaAssistant();
            actResults.classList.add('hidden');
            actStepBox.parentElement.classList.remove('hidden');
            actCopyMsg.textContent = '';
            renderActStep();
            document.getElementById('actividad').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        function buildSummaryText() {
            const lines = actSteps.map((s, i) => `${i + 1}. ${s.label}\n${actAnswers[i] || 'Sin respuesta'}`);
            return `Ruta de Bienestar — Plan de mejora de clima laboral\nTema 5 — Psicología Organizacional y Bienestar Humano\n\n0. Caso utilizado\n${getCaseText()}\n\n0.5 ${getPermaSummaryText()}\n\n${lines.join('\n\n')}`;
        }

        function copyActSummary() {
            const summary = buildSummaryText();
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(summary).then(() => {
                    actCopyMsg.textContent = 'Resumen copiado al portapapeles.';
                }).catch(() => {
                    actCopyMsg.textContent = 'No se pudo copiar automáticamente; selecciona y copia el texto manualmente.';
                });
            } else {
                actCopyMsg.textContent = 'Tu navegador no permite copiar automáticamente; selecciona y copia el texto manualmente.';
            }
        }

        function escapeHtmlForDoc(str) {
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/\n/g, '<br>');
        }

        function downloadBlob(content, filename, mime) {
            const blob = new Blob([content], { type: mime });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        }

        function downloadActTxt() {
            downloadBlob(buildSummaryText(), 'Ruta-de-Bienestar-Tema5.txt', 'text/plain;charset=utf-8');
            if (actDownloadMenu) actDownloadMenu.classList.add('hidden');
        }

        function downloadActWord() {
            const parts = [
                '<h1 style="color:#3d6a3a;">Ruta de Bienestar — Plan de mejora de clima laboral</h1>',
                '<p><em>Tema 5 — Psicología Organizacional y Bienestar Humano</em></p>',
                `<h2>0. Caso utilizado</h2><p>${escapeHtmlForDoc(getCaseText())}</p>`,
                `<h2>0.5 Autodiagnóstico PERMA (interactivo)</h2><p>${escapeHtmlForDoc(getPermaSummaryText())}</p>`
            ];
            actSteps.forEach((s, i) => {
                parts.push(`<h2>${i + 1}. ${escapeHtmlForDoc(s.label)}</h2><p>${escapeHtmlForDoc(actAnswers[i] || 'Sin respuesta')}</p>`);
            });
            const htmlDoc = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><meta charset='utf-8'><title>Ruta de Bienestar</title></head>
<body style="font-family: Calibri, Arial, sans-serif; font-size: 11pt;">${parts.join('')}</body></html>`;
            downloadBlob(htmlDoc, 'Ruta-de-Bienestar-Tema5.doc', 'application/msword');
            if (actDownloadMenu) actDownloadMenu.classList.add('hidden');
        }

        if (actNext) actNext.addEventListener('click', goActNext);
        if (actPrev) actPrev.addEventListener('click', goActPrev);
        if (actRestart) actRestart.addEventListener('click', restartAct);
        if (actCopy) actCopy.addEventListener('click', copyActSummary);
        if (actStepInput) actStepInput.addEventListener('input', () => {
            actMessage.textContent = '';
            updateCounter(actStepInput, actStepCounter, actSteps[actStep].maxLength);
        });

        if (actDownloadBtn) {
            actDownloadBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isHidden = actDownloadMenu.classList.contains('hidden');
                actDownloadMenu.classList.toggle('hidden');
                actDownloadBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
            });
            document.addEventListener('click', () => {
                actDownloadMenu.classList.add('hidden');
                actDownloadBtn.setAttribute('aria-expanded', 'false');
            });
            actDownloadMenu.addEventListener('click', (e) => e.stopPropagation());
        }
        if (actDownloadWord) actDownloadWord.addEventListener('click', downloadActWord);
        if (actDownloadTxt) actDownloadTxt.addEventListener('click', downloadActTxt);

        renderActStep();

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
