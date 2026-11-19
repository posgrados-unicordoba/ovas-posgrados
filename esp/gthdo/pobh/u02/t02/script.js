/* Interacciones del OVA gthdo-pobh-u02-t02. */


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
                question: "¿Qué dimensión del Modelo Denison se relaciona con el empoderamiento y el trabajo en equipo?",
                options: [
                    { value: "a", text: "Misión", explicacion: "No es la respuesta. La Misión tiene que ver con la dirección y el propósito: la visión estratégica y la alineación de objetivos que dan sentido al trabajo. El empoderamiento y el trabajo en equipo pertenecen a otra dimensión." },
                    { value: "b", text: "Participación", explicacion: "Correcto. En el Modelo Denison, la Participación (involucramiento) reúne el empoderamiento de las personas, la orientación al trabajo en equipo y el desarrollo de capacidades: el compromiso que nace de sentirse parte de las decisiones." },
                    { value: "c", text: "Adaptabilidad", explicacion: "No es la respuesta. La Adaptabilidad se refiere a la capacidad de la organización para responder al entorno, orientarse al cliente y aprender del cambio, no al empoderamiento interno de los equipos." }
                ],
                correct: "b"
            },
            {
                question: "¿Cuántos tipos culturales propone el OCAI de Cameron y Quinn?",
                options: [
                    { value: "a", text: "Dos", explicacion: "No es la respuesta. El OCAI no reduce la cultura a dos polos: cruza dos ejes (flexibilidad o control, y enfoque interno o externo), y de ese cruce salen más tipos culturales." },
                    { value: "b", text: "Tres", explicacion: "No es la respuesta. Los dos ejes del Marco de Valores en Competencia forman cuatro cuadrantes, no tres; a cada cuadrante le corresponde un tipo cultural." },
                    { value: "c", text: "Cuatro", explicacion: "Correcto. El OCAI de Cameron y Quinn propone cuatro tipos culturales: clan, adhocracia, mercado y jerarquía. Permite comparar el perfil de la cultura actual con el de la cultura deseada." }
                ],
                correct: "c"
            },
            {
                question: "¿Qué permite integrar el Employee Journey Mapping con la analítica de sentimientos en 2026?",
                options: [
                    { value: "a", text: "Eliminar la percepción subjetiva del empleado.", explicacion: "No es la respuesta. El mapeo de la experiencia y la analítica de sentimientos buscan justamente escuchar la percepción del empleado en cada momento de verdad, no eliminarla." },
                    { value: "b", text: "Diagnosticar en tiempo real y actuar preventivamente.", explicacion: "Correcto. Al cruzar los momentos de verdad del Employee Journey con lo que expresan las personas, el diagnóstico se vuelve continuo y permite intervenir antes de que un problema de clima se convierta en un riesgo." },
                    { value: "c", text: "Aplicar encuestas anuales más extensas y burocráticas.", explicacion: "No es la respuesta. Ese es el modelo que se busca superar: las encuestas anuales llegan tarde. La integración apunta a un diagnóstico dinámico y oportuno." }
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
                        ${userOption && userOption.explicacion ? `<p class="mt-2 text-sm" style="color: var(--text);">${userOption.explicacion}</p>` : ''}
                        ${!isCorrect && correctOption.explicacion ? `<p class="mt-1 text-sm" style="color: var(--text);">${correctOption.explicacion}</p>` : ''}
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

        // ===== ACTIVIDAD: CUESTIONARIO DENISON =====
        const denisonDimensiones = {
            mision: { items: ['m1','m2','m3'], nombre: 'Misión', icon: 'fa-flag' },
            adaptabilidad: { items: ['a1','a2','a3'], nombre: 'Adaptabilidad', icon: 'fa-arrows-rotate' },
            participacion: { items: ['p1','p2','p3'], nombre: 'Participación', icon: 'fa-users' },
            consistencia: { items: ['c1','c2','c3'], nombre: 'Consistencia', icon: 'fa-scale-balanced' }
        };

        function renderDenisonOptions() {
            if (!document.getElementById('denisonForm')) return;
            document.querySelectorAll('.denison-options[data-question]').forEach(container => {
                const q = container.dataset.question;
                const labels = [
                    { val: 1, text: '1 - Totalmente en desacuerdo' },
                    { val: 2, text: '2 - En desacuerdo' },
                    { val: 3, text: '3 - Neutral' },
                    { val: 4, text: '4 - De acuerdo' },
                    { val: 5, text: '5 - Totalmente de acuerdo' }
                ];
                container.innerHTML = labels.map(l => `
                    <label class='denison-option-label flex-1 text-xs text-center border rounded-lg p-2 hover:bg-green-50' style='border-color: var(--line); background: white;'>
                        <input type='radio' name='${q}' value='${l.val}' required class='mb-1'>
                        <span>${l.val}</span>
                    </label>
                `).join('');
            });
        }
        renderDenisonOptions();

        function validateDenisonStep(stepIdx) {
            const step = document.querySelectorAll('#act-denison .denison-step')[stepIdx];
            if (!step) return '';
            const names = new Set();
            step.querySelectorAll('input[type=radio]').forEach(r => names.add(r.name));
            for (const n of names) {
                if (!step.querySelector(`input[name='${n}']:checked`)) {
                    return 'Responde las tres preguntas de esta dimensión antes de continuar.';
                }
            }
            return '';
        }

        function validateDenisonAll() {
            const steps = document.querySelectorAll('#act-denison .denison-step');
            let msg = '';
            steps.forEach((step, idx) => {
                if (msg || idx > 3) return;
                const names = new Set();
                step.querySelectorAll('input[type=radio]').forEach(r => names.add(r.name));
                for (const n of names) {
                    if (!step.querySelector(`input[name='${n}']:checked`)) {
                        msg = 'Responde todas las preguntas antes de ver los resultados.';
                        break;
                    }
                }
            });
            return msg;
        }

        function calcularDenison() {
            const datos = {};
            for (const [key, dim] of Object.entries(denisonDimensiones)) {
                let suma = 0;
                for (const item of dim.items) {
                    const val = parseFloat(document.querySelector(`#act-denison input[name='${item}']:checked`).value);
                    suma += val;
                }
                datos[key] = suma / dim.items.length;
            }
            const bars = document.getElementById('denisonBars');
            bars.innerHTML = '';
            let menor = 5, mayor = 1, debil = '', fuerte = '';
            for (const [key, dim] of Object.entries(denisonDimensiones)) {
                const valor = datos[key];
                if (valor < menor) { menor = valor; debil = dim.nombre; }
                if (valor > mayor) { mayor = valor; fuerte = dim.nombre; }
                const porcentaje = (valor / 5) * 100;
                bars.innerHTML += `
                    <div>
                        <div class='flex justify-between mb-1'>
                            <span class='font-semibold text-sm'><i class='fa-solid ${dim.icon} mr-1 text-[#569151]'></i>${dim.nombre}</span>
                            <span class='font-bold text-sm'>${valor.toFixed(2)} / 5.0</span>
                        </div>
                        <div class='denison-bar-container'><div class='denison-bar-fill' style='width: ${porcentaje}%'></div></div>
                    </div>
                `;
            }
            document.getElementById('denisonInterpretacion').innerHTML = `
                La dimensión más alta es <strong>${fuerte}</strong> (${mayor.toFixed(2)}), lo que representa una fortaleza cultural.
                La dimensión más baja es <strong>${debil}</strong> (${menor.toFixed(2)}), por lo que es un área prioritaria de intervención.
                Recuerda que este es un ejercicio educativo; un diagnóstico formal requiere el instrumento DOCS validado y una muestra representativa.
            `;
        }

        function limpiarDenison() {
            const form = document.getElementById('denisonForm');
            if (form) form.reset();
            const bars = document.getElementById('denisonBars');
            if (bars) bars.innerHTML = '';
            const interp = document.getElementById('denisonInterpretacion');
            if (interp) interp.innerHTML = '';
        }

        // ===== ACTIVIDAD: OCAI =====
        const ocaiTipos = [
            { key: 'Clan', label: 'Clan (colaborativa)', color: '#e11d48', icon: 'fa-people-group' },
            { key: 'Adhocracia', label: 'Adhocracia (creativa)', color: '#d97706', icon: 'fa-lightbulb' },
            { key: 'Mercado', label: 'Mercado (competitiva)', color: '#2563eb', icon: 'fa-trophy' },
            { key: 'Jerarquia', label: 'Jerarquía (control)', color: '#4b5563', icon: 'fa-sitemap' }
        ];

        const ocaiDimensiones = [
            { id: 'dominante', nombre: '1. Característica dominante' },
            { id: 'liderazgo', nombre: '2. Liderazgo organizacional' },
            { id: 'gestion', nombre: '3. Gestión de los empleados' },
            { id: 'pegamento', nombre: '4. Pegamento organizacional' },
            { id: 'enfoque', nombre: '5. Enfoque estratégico' },
            { id: 'exito', nombre: '6. Criterios de éxito' }
        ];

        function renderOCAIOptions() {
            const container = document.getElementById('ocaiDimensions');
            if (!container) return;
            ocaiDimensiones.forEach((dim, idx) => {
                const tipoInputs = ocaiTipos.map(t => `
                    <div class='flex items-center justify-between gap-2 bg-gray-50 p-2 rounded-lg text-sm'>
                        <span class='font-medium'><i class='fa-solid ${t.icon} mr-1' style='color:${t.color}'></i>${t.label}</span>
                        <input type='number' min='0' max='100' step='1' name='ocai_actual_${dim.id}_${t.key}' data-dim='${dim.id}' data-tipo='${t.key}' data-modo='actual' oninput='actualizarSumaOCAI(this)' style='width:60px;text-align:center;border:1px solid var(--line);border-radius:6px;padding:4px;'>
                    </div>
                `).join('');
                const desInputs = ocaiTipos.map(t => `
                    <div class='flex items-center justify-between gap-2 bg-gray-50 p-2 rounded-lg text-sm'>
                        <span class='font-medium'><i class='fa-solid ${t.icon} mr-1' style='color:${t.color}'></i>${t.label}</span>
                        <input type='number' min='0' max='100' step='1' name='ocai_deseada_${dim.id}_${t.key}' data-dim='${dim.id}' data-tipo='${t.key}' data-modo='deseada' oninput='actualizarSumaOCAI(this)' style='width:60px;text-align:center;border:1px solid var(--line);border-radius:6px;padding:4px;'>
                    </div>
                `).join('');
                container.innerHTML += `
                    <div class='ocai-step ${idx === 0 ? '' : 'hidden'}'>
                        <div class='ocai-card mb-4'>
                            <h2 class='font-bold text-[#569151] mb-4'>${dim.nombre}</h2>
                            <div class='grid md:grid-cols-2 gap-6'>
                                <div>
                                    <p class='text-sm font-semibold mb-2'>Actual <span class='text-xs font-normal text-gray-500' id='ocaiSuma_actual_${dim.id}'>Suma: 0/100</span></p>
                                    <div class='space-y-2'>${tipoInputs}</div>
                                </div>
                                <div>
                                    <p class='text-sm font-semibold mb-2'>Deseada <span class='text-xs font-normal text-gray-500' id='ocaiSuma_deseada_${dim.id}'>Suma: 0/100</span></p>
                                    <div class='space-y-2'>${desInputs}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
        renderOCAIOptions();

        function actualizarSumaOCAI(input) {
            const dim = input.dataset.dim;
            const modo = input.dataset.modo;
            const inputs = document.querySelectorAll(`#act-ocai input[data-dim='${dim}'][data-modo='${modo}']`);
            let suma = 0;
            inputs.forEach(i => suma += parseFloat(i.value) || 0);
            const span = document.getElementById(`ocaiSuma_${modo}_${dim}`);
            span.textContent = `Suma: ${suma}/100`;
            span.style.color = suma === 100 ? '#16a34a' : (suma > 100 ? '#dc2626' : '#6b7280');
        }

        function validateOCAIAll() {
            let msg = '';
            ocaiDimensiones.forEach(dim => {
                if (msg) return;
                ['actual','deseada'].forEach(modo => {
                    if (msg) return;
                    const inputs = document.querySelectorAll(`#act-ocai input[data-dim='${dim.id}'][data-modo='${modo}']`);
                    let suma = 0;
                    inputs.forEach(i => suma += parseFloat(i.value) || 0);
                    if (suma !== 100) {
                        msg = `${dim.nombre} (${modo === 'actual' ? 'cultura actual' : 'cultura deseada'}) debe sumar 100. Suma actual: ${suma}.`;
                    }
                });
            });
            return msg;
        }

        function calcularOCAI() {
            const resultados = { actual: {}, deseada: {} };
            ocaiTipos.forEach(t => { resultados.actual[t.key] = 0; resultados.deseada[t.key] = 0; });
            ocaiDimensiones.forEach(dim => {
                ocaiTipos.forEach(t => {
                    resultados.actual[t.key] += parseFloat(document.querySelector(`#act-ocai input[name='ocai_actual_${dim.id}_${t.key}']`).value) || 0;
                    resultados.deseada[t.key] += parseFloat(document.querySelector(`#act-ocai input[name='ocai_deseada_${dim.id}_${t.key}']`).value) || 0;
                });
            });
            const promedios = { actual: {}, deseada: {} };
            ocaiTipos.forEach(t => {
                promedios.actual[t.key] = resultados.actual[t.key] / ocaiDimensiones.length;
                promedios.deseada[t.key] = resultados.deseada[t.key] / ocaiDimensiones.length;
            });
            function renderBarsOCAI(data, containerId) {
                const c = document.getElementById(containerId);
                c.innerHTML = '';
                ocaiTipos.forEach(t => {
                    const valor = data[t.key];
                    c.innerHTML += `
                        <div>
                            <div class='flex justify-between text-sm mb-1'>
                                <span class='font-semibold'><i class='fa-solid ${t.icon} mr-1' style='color:${t.color}'></i>${t.label}</span>
                                <span class='font-bold'>${valor.toFixed(1)}%</span>
                            </div>
                            <div class='ocai-bar-bg'><div class='ocai-bar-fill' style='width: ${valor}%; background: ${t.color};'></div></div>
                        </div>
                    `;
                });
            }
            renderBarsOCAI(promedios.actual, 'ocaiActualBars');
            renderBarsOCAI(promedios.deseada, 'ocaiDeseadaBars');
            const maxActual = ocaiTipos.reduce((a, b) => promedios.actual[b.key] > promedios.actual[a.key] ? b : a);
            const maxDeseada = ocaiTipos.reduce((a, b) => promedios.deseada[b.key] > promedios.deseada[a.key] ? b : a);
            let maxBrecha = 0, tipoBrecha = '';
            ocaiTipos.forEach(t => {
                const brecha = Math.abs(promedios.deseada[t.key] - promedios.actual[t.key]);
                if (brecha > maxBrecha) { maxBrecha = brecha; tipoBrecha = t.key; }
            });
            document.getElementById('ocaiInterpretacion').innerHTML = `
                El tipo cultural más fuerte <strong>actualmente</strong> es <strong>${maxActual.label}</strong> (${promedios.actual[maxActual.key].toFixed(1)}%).
                El tipo más valorado para el <strong>futuro deseado</strong> es <strong>${maxDeseada.label}</strong> (${promedios.deseada[maxDeseada.key].toFixed(1)}%).
                La mayor brecha se observa en <strong>${tipoBrecha}</strong> (${maxBrecha.toFixed(1)} puntos), lo que indica una prioridad de intervención.
            `;
        }

        function limpiarOCAI() {
            const form = document.getElementById('ocaiForm');
            if (form) form.reset();
            ocaiDimensiones.forEach(dim => {
                const sa = document.getElementById(`ocaiSuma_actual_${dim.id}`);
                const sd = document.getElementById(`ocaiSuma_deseada_${dim.id}`);
                if (sa) { sa.textContent = 'Suma: 0/100'; sa.style.color = '#6b7280'; }
                if (sd) { sd.textContent = 'Suma: 0/100'; sd.style.color = '#6b7280'; }
            });
            const ab = document.getElementById('ocaiActualBars');
            const db = document.getElementById('ocaiDeseadaBars');
            if (ab) ab.innerHTML = '';
            if (db) db.innerHTML = '';
            const interp = document.getElementById('ocaiInterpretacion');
            if (interp) interp.innerHTML = '';
        }

        // ===== ACTIVIDAD: EMPLOYEE JOURNEY MAP =====
        function descargarJourney() {
            const form = document.getElementById('journeyForm');
            const msg = document.getElementById('journeyMessage');
            if (!form) return;
            const data = new FormData(form);
            let texto = 'EMPLOYEE JOURNEY MAP - DIAGNÓSTICO DE CLIMA\n\n';
            const etapas = [
                ['Atracción', 'journey_atraccion'],
                ['Incorporación', 'journey_incorporacion'],
                ['Desarrollo', 'journey_desarrollo'],
                ['Retención', 'journey_retencion'],
                ['Retiro', 'journey_retiro']
            ];
            etapas.forEach(([nombre, key]) => {
                texto += `--- ${nombre} ---\n`;
                texto += `Momento: ${data.get(key + '_momento') || ''}\n`;
                texto += `Emoción: ${data.get(key + '_emocion') || ''}\n`;
                texto += `Fricción: ${data.get(key + '_friccion') || ''}\n`;
                texto += `Oportunidad: ${data.get(key + '_oportunidad') || ''}\n\n`;
            });
            const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'employee-journey-map.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            if (msg) {
                msg.style.color = '#16a34a';
                msg.textContent = 'Borrador descargado correctamente.';
            }
        }

        function limpiarJourney() {
            const form = document.getElementById('journeyForm');
            if (form) form.reset();
        }

        function setupJourneyLimits() {
            const form = document.getElementById('journeyForm');
            if (!form) return;
            form.querySelectorAll('textarea, input[type=text]').forEach(field => {
                const max = field.tagName === 'TEXTAREA' ? 500 : 200;
                field.setAttribute('maxlength', String(max));
                const counter = document.createElement('p');
                counter.className = 'text-xs text-right text-slate-500 mt-1';
                field.insertAdjacentElement('afterend', counter);
                const updateCounter = () => {
                    counter.textContent = `${field.value.length} / ${max} caracteres`;
                };
                field.addEventListener('input', updateCounter);
                updateCounter();
            });
        }
        setupJourneyLimits();

        const journeyDownloadBtn = document.getElementById('journeyDownload');
        if (journeyDownloadBtn) journeyDownloadBtn.addEventListener('click', descargarJourney);

        // ===== STEPPER GENÉRICO =====
        function setupStepper(containerId, prevId, nextId, messageId, finishText, validateStep, onFinish, onReset) {
            const container = document.getElementById(containerId);
            if (!container) return;
            const steps = container.querySelectorAll('.denison-step, .ocai-step, .journey-step');
            const prevBtn = document.getElementById(prevId);
            const nextBtn = document.getElementById(nextId);
            const msgEl = document.getElementById(messageId);
            let current = 0;
            const total = steps.length;

            function render() {
                steps.forEach((s, i) => s.classList.toggle('hidden', i !== current));
                prevBtn.disabled = current === 0;
                if (current === total - 1) {
                    nextBtn.textContent = 'Reiniciar';
                } else if (current === total - 2) {
                    nextBtn.textContent = finishText;
                } else {
                    nextBtn.textContent = 'Siguiente';
                }
            }

            function goNext() {
                if (msgEl) msgEl.textContent = '';
                if (current < total - 2) {
                    const err = validateStep ? validateStep(current) : '';
                    if (err) { if (msgEl) msgEl.textContent = err; return; }
                    current++;
                    render();
                } else if (current === total - 2) {
                    const err = validateStep ? validateStep(current) : '';
                    if (err) { if (msgEl) msgEl.textContent = err; return; }
                    if (onFinish) onFinish();
                    current++;
                    render();
                } else {
                    if (onReset) onReset();
                    current = 0;
                    render();
                    if (container && container.scrollIntoView) {
                        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            }

            function goPrev() {
                if (current > 0) { current--; render(); }
            }

            prevBtn.addEventListener('click', goPrev);
            nextBtn.addEventListener('click', goNext);
            render();
        }

        setupStepper('act-denison', 'denisonPrev', 'denisonNext', 'denisonMessage', 'Ver resultados',
            (idx) => idx === 3 ? validateDenisonAll() : validateDenisonStep(idx),
            () => { calcularDenison(); return true; },
            limpiarDenison
        );

        setupStepper('act-ocai', 'ocaiPrev', 'ocaiNext', 'ocaiMessage', 'Ver perfil',
            (idx) => idx === ocaiDimensiones.length - 1 ? validateOCAIAll() : '',
            () => { calcularOCAI(); return true; },
            limpiarOCAI
        );

        setupStepper('act-journey', 'journeyPrev', 'journeyNext', 'journeyMessage', 'Finalizar',
            () => '',
            () => { return true; },
            limpiarJourney
        );

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
