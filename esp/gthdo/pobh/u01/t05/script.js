/* Interacciones del OVA gthdo-pobh-u01-t05. */


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
                question: "¿Qué establece la Reforma Laboral 2025 respecto al tipo de contrato que debe predominar para favorecer la retención?",
                options: [
                    { value: "a", text: "El contrato a término fijo como regla general." },
                    { value: "b", text: "El contrato indefinido como regla general, limitando la temporalidad." },
                    { value: "c", text: "El contrato por obra o labor para todos los cargos operativos." }
                ],
                correct: "b"
            },
            {
                question: "Según la Reforma Laboral 2025, ¿a partir de qué hora inicia la jornada nocturna en Colombia?",
                options: [
                    { value: "a", text: "A las 10:00 p.m." },
                    { value: "b", text: "A las 8:00 p.m." },
                    { value: "c", text: "A las 6:00 p.m." }
                ],
                correct: "c"
            },
            {
                question: "¿Qué norma colombiana de 2025 reforma los Comités de Convivencia para fortalecer la prevención del acoso laboral y sexual?",
                options: [
                    { value: "a", text: "Resolución 3461 de 2025." },
                    { value: "b", text: "Decreto 1072 de 2015." },
                    { value: "c", text: "Ley 1010 de 2006." }
                ],
                correct: "a"
            },
            {
                question: "¿Qué sucede con el Comportamiento de Ciudadanía Organizacional (CCO) cuando una empresa adopta políticas de inclusión y no discriminación?",
                options: [
                    { value: "a", text: "Disminuye porque genera más obligaciones al empleado." },
                    { value: "b", text: "Se mantiene igual, pues el CCO depende solo del salario." },
                    { value: "c", text: "Se fortalece porque el empleado percibe la empresa como un agente ético y responsable." }
                ],
                correct: "c"
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
            if (currentQuestion > 0) { currentQuestion--; renderQuestion(); }
        });

        quizNext.addEventListener('click', () => {
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
            document.getElementById('evaluacion').scrollIntoView({ behavior: 'smooth' });
        });

        if (quizBox) renderQuestion();

        document.querySelectorAll('.act-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.act-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.act-panel').forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(tab.dataset.actTarget).classList.add('active');
            });
        });

        const normItems = [
            {
                id: 'norm-1',
                texto: '¿La empresa usa contratos indefinidos como regla general, limitando los contratos a término fijo a casos justificados?',
                cumple: { alerta: '✅ Cumple', msg: 'La Reforma Laboral 2025 establece el contrato indefinido como norma general. Tu empresa está alineada.', color: 'var(--accent)', bg: '#f0fdf4' },
                riesgo: { alerta: '⚠️ Riesgo', msg: 'Usar contratos a término fijo sin justificación expone a la empresa a demandas por estabilidad laboral y deteriora la retención.', color: '#dc2626', bg: '#fef2f2' }
            },
            {
                id: 'norm-2',
                texto: '¿Los turnos nocturnos inician a partir de las 6:00 p.m. con los recargos correspondientes (dominical 100%)?',
                cumple: { alerta: '✅ Cumple', msg: 'La jornada nocturna desde las 6:00 p.m. y el recargo dominical del 100% están correctamente aplicados.', color: 'var(--accent)', bg: '#f0fdf4' },
                riesgo: { alerta: '⚠️ Riesgo', msg: 'No aplicar los recargos nocturnos desde las 6:00 p.m. genera pasivos laborales y desmotiva a los trabajadores de turno.', color: '#dc2626', bg: '#fef2f2' }
            },
            {
                id: 'norm-3',
                texto: '¿El Comité de Convivencia se reúne al menos bimensualmente y tiene protocolos escritos de prevención del acoso conforme a la Resolución 3461 de 2025?',
                cumple: { alerta: '✅ Cumple', msg: 'El Comité de Convivencia activo y con protocolos escritos es el principal mecanismo de prevención del acoso laboral y sexual.', color: 'var(--accent)', bg: '#f0fdf4' },
                riesgo: { alerta: '⚠️ Riesgo', msg: 'El incumplimiento de la Resolución 3461/2025 expone a la empresa a sanciones y es un factor crítico de rotación voluntaria.', color: '#dc2626', bg: '#fef2f2' }
            },
            {
                id: 'norm-4',
                texto: '¿La empresa tiene políticas de inclusión y cuotas de contratación para personas con discapacidad?',
                cumple: { alerta: '✅ Cumple', msg: 'Las políticas de inclusión fortalecen el Comportamiento de Ciudadanía Organizacional (CCO) y la retención ética.', color: 'var(--accent)', bg: '#f0fdf4' },
                riesgo: { alerta: '⚠️ Riesgo', msg: 'La ausencia de políticas de inclusión puede generar riesgos legales y debilita el compromiso organizacional del equipo.', color: '#dc2626', bg: '#fef2f2' }
            }
        ];

        function renderNorm() {
            const container = document.getElementById('norm-checks');
            document.getElementById('norm-resultado').classList.add('hidden');
            if (!container) return;
            container.innerHTML = normItems.map(item => `
                <div class="p-4 rounded-xl border norm-card" id="card-${item.id}" style="background: var(--surface-soft); border-color: var(--line);">
                    <p class="text-sm font-semibold mb-3" style="color: var(--heading);">${item.texto}</p>
                    <div class="flex gap-4">
                        <label class="flex items-center gap-2 text-sm cursor-pointer font-semibold">
                            <input type="radio" name="${item.id}" value="cumple" class="norm-radio"> Sí, cumple
                        </label>
                        <label class="flex items-center gap-2 text-sm cursor-pointer font-semibold">
                            <input type="radio" name="${item.id}" value="riesgo" class="norm-radio"> No / Desconozco
                        </label>
                    </div>
                    <div class="norm-feedback mt-3 hidden p-3 rounded-lg text-xs font-semibold"></div>
                </div>
            `).join('');
        }

        window.verificarNormativa = function() {
            let cumpleCount = 0;
            normItems.forEach(item => {
                const selected = document.querySelector(`input[name="${item.id}"]:checked`);
                const card = document.getElementById(`card-${item.id}`);
                const fb = card.querySelector('.norm-feedback');
                if (!selected) {
                    fb.innerHTML = '⚠️ Selecciona una opción para este ítem.';
                    fb.style.background = '#fef9c3';
                    fb.style.color = '#92400e';
                    fb.classList.remove('hidden');
                    return;
                }
                const result = item[selected.value];
                if (selected.value === 'cumple') cumpleCount++;
                card.style.borderColor = result.color;
                fb.innerHTML = `<span>${result.alerta}:</span> ${result.msg}`;
                fb.style.background = result.bg;
                fb.style.color = result.color;
                fb.classList.remove('hidden');
            });

            const summary = document.getElementById('norm-resultado');
            const pct = Math.round((cumpleCount / normItems.length) * 100);
            const msg = pct === 100 ? '¡Excelente! Tu empresa cumple todos los requisitos normativos de la Reforma Laboral 2025.' : pct >= 50 ? `Cumples ${cumpleCount} de ${normItems.length} requisitos. Revisa los ítems en riesgo para evitar sanciones y mejorar la retención.` : `Solo cumples ${cumpleCount} de ${normItems.length} requisitos. Se recomienda una auditoría normativa urgente.`;
            summary.innerHTML = `
                <p class="text-base font-bold" style="color: var(--heading);">Resultado: ${cumpleCount}/${normItems.length} requisitos cumplidos</p>
                <div class="w-full h-3 rounded-full bg-gray-200 mt-2 overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-500" style="width: ${pct}%; background: ${pct === 100 ? 'var(--accent)' : pct >= 50 ? '#d97706' : '#dc2626'};"></div>
                </div>
                <p class="mt-2 text-sm font-semibold" style="color: ${pct === 100 ? 'var(--accent)' : pct >= 50 ? '#d97706' : '#dc2626'};">${msg}</p>
            `;
            summary.classList.remove('hidden');
        }

        window.limpiarNormativa = function() {
            document.querySelectorAll('.norm-radio').forEach(r => r.checked = false);
            normItems.forEach(item => {
                const card = document.getElementById(`card-${item.id}`);
                card.style.borderColor = 'var(--line)';
                const fb = card.querySelector('.norm-feedback');
                fb.classList.add('hidden');
                fb.innerHTML = '';
            });
            document.getElementById('norm-resultado').classList.add('hidden');
            document.getElementById('actividad').scrollIntoView({ behavior: 'smooth' });
        }

        const casoQuestions = [
            {
                text: "¿Cuál es la primera acción que debe tomar RRHH ante las tres denuncias anónimas de acoso laboral?",
                options: [
                    { value: "a", text: "Llamar al jefe de planta a dar su versión antes de cualquier otra acción.", correct: false, feedback: "Escuchar primero al señalado puede comprometer la imparcialidad del proceso y exponer a los denunciantes a represalias." },
                    { value: "b", text: "Convocar de manera urgente el Comité de Convivencia para activar el protocolo de investigación.", correct: true, feedback: "Correcto. La Resolución 3461/2025 exige que el Comité de Convivencia sea el órgano que active y lidere el proceso de investigación ante denuncias de acoso." },
                    { value: "c", text: "Archivar las denuncias porque son anónimas y no tienen validez legal.", correct: false, feedback: "Las denuncias anónimas no pierden validez. Ignorarlas expone a la empresa a sanciones por omisión y aumenta el riesgo de rotación." }
                ]
            },
            {
                text: "¿Qué norma colombiana obliga a la empresa a tener protocolos escritos de prevención del acoso laboral y sexual?",
                options: [
                    { value: "a", text: "Decreto 1072 de 2015.", correct: false, feedback: "El Decreto 1072 es el reglamento único del trabajo, pero no regula específicamente los protocolos de convivencia y acoso de 2025." },
                    { value: "b", text: "Ley 1010 de 2006.", correct: false, feedback: "La Ley 1010 define el acoso laboral, pero la Resolución 3461 de 2025 es la norma vigente que reforma los Comités de Convivencia y exige protocolos escritos." },
                    { value: "c", text: "Resolución 3461 de 2025.", correct: true, feedback: "Correcto. La Resolución 3461/2025 reforma los Comités de Convivencia y exige protocolos escritos de prevención del acoso laboral y sexual en todas las empresas." }
                ]
            },
            {
                text: "¿Qué riesgo de retención representa no actuar ante las denuncias, considerando que dos denunciantes han manifestado intención de renunciar?",
                options: [
                    { value: "a", text: "Solo afecta la imagen pública de la empresa ante clientes.", correct: false, feedback: "El impacto interno es más inmediato: la pérdida de talento y el deterioro del clima organizacional preceden a cualquier efecto en la imagen externa." },
                    { value: "b", text: "Ninguno, porque el jefe de planta es indispensable para la producción.", correct: false, feedback: "La 'indispensabilidad' de un colaborador no justifica tolerar el acoso. Priorizar la producción sobre la dignidad laboral destruye el CCO y acelera la rotación." },
                    { value: "c", text: "Pérdida de los denunciantes, deterioro del CCO en el equipo y riesgo de sanciones legales.", correct: true, feedback: "Correcto. No actuar genera rotación inmediata de los denunciantes, deteriora el Comportamiento de Ciudadanía Organizacional del equipo y expone a la empresa a sanciones por omisión." }
                ]
            }
        ];

        function renderCaso() {
            const container = document.getElementById('etico-questions');
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

        window.evaluarEtico = function() {
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

            const summary = document.getElementById('etico-summary');
            const pct = Math.round((totalCorrect / casoQuestions.length) * 100);
            let msg = pct >= 80 ? '¡Excelente! Comprendes cómo actuar éticamente ante el acoso laboral y el impacto en la retención corporativa.' : pct >= 50 ? 'Buen avance. Revisa la retroalimentación para fortalecer tu criterio ético y normativo.' : 'Repasa el contenido del Tema 5. Recuerda: ante el acoso laboral, la norma y la dignidad del trabajador siempre prevalecen sobre la "indispensabilidad".';
            summary.innerHTML = `
                <p class="text-lg font-bold" style="color: var(--heading);">Resultado: ${totalCorrect}/${casoQuestions.length} aciertos (${pct}%)</p>
                <div class="w-full h-3 rounded-full bg-gray-200 mt-3 overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-500" style="width: ${pct}%; background: ${pct >= 80 ? 'var(--accent)' : pct >= 50 ? '#d97706' : '#dc2626'};"></div>
                </div>
                <p class="mt-3 text-sm font-semibold" style="color: ${pct >= 80 ? 'var(--accent)' : pct >= 50 ? '#d97706' : '#dc2626'};">${msg}</p>
            `;
            summary.classList.remove('hidden');
        }

        window.limpiarEtico = function() {
            document.querySelectorAll('.caso-radio').forEach(r => r.checked = false);
            document.querySelectorAll('.caso-card').forEach(card => {
                card.style.borderColor = 'var(--line)';
                const fb = card.querySelector('.caso-feedback');
                fb.classList.add('hidden');
                fb.innerHTML = '';
                card.querySelectorAll('label').forEach(l => { l.style.borderColor = 'var(--line)'; l.style.background = 'white'; });
            });
            document.getElementById('etico-summary').classList.add('hidden');
            document.getElementById('actividad').scrollIntoView({ behavior: 'smooth' });
        }

        renderNorm();
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
 * pantallasDeDosPorHijos(lista, opciones) toma cada hijo de la lista como un elemento
 * (preguntas con botones de opción, objetivos con casillas, filas que se agregan).
 *
 * Qué es un elemento (equipo pedagógico, 26 de noviembre de 2026): cada contenedor horizontal
 * completo, con su enunciado y sus opciones. Se divide la actividad compleja que obliga a
 * hacer scroll; si casi toda cabe en una pantalla, puede quedar en una sola.
 */
function pantallasDeDos(cfg) {
  var POR = cfg.porPantalla || 2;
  var grupos = cfg.grupos.filter(Boolean).map(function (g) { return [].concat(g).filter(Boolean); }).filter(function (g) { return g.length; });
  var finales = (cfg.finales || []).filter(Boolean);
  var paginas = Math.ceil(grupos.length / POR);
  if (paginas <= 1) {
    // Cabe en una pantalla: todo a la vista (por si antes había pantallas y se quitaron elementos).
    grupos.forEach(function (g) { g.forEach(function (el) { el.style.display = ''; }); });
    finales.forEach(function (f) { f.style.display = ''; });
    return null;
  }
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
    cfg.aviso = null;
    var ultimo = grupos[grupos.length - 1];
    (cfg.navDespuesDe || ultimo[ultimo.length - 1]).after(nav);
    btnAnt.addEventListener('click', function () { ir(actual - 1, true); });
    btnSig.addEventListener('click', function () { ir(actual + 1, true); });
    cfg.nav = nav;
  } else {
    grupos[0][0].before(aviso);
    cfg.aviso = aviso;
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
      var campo = g.querySelector('textarea, select, input') || g.querySelector('button') || g;
      if (campo === g && !g.hasAttribute('tabindex')) g.setAttribute('tabindex', '-1');
      campo.focus({ preventScroll: true });
      g.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  ir(0, false);
  return { ir: ir, paginas: paginas };
}

/* Igual, pero se vuelve a armar si el script redibuja el formulario (por ejemplo, al limpiar)
 * o si agrega o quita elementos. Con cfg.alCrecer = 'ultima', al agregar un elemento se pasa
 * a la pantalla donde quedó (por ejemplo, "Agregar problema" lleva a la pantalla nueva). */
function pantallasDeDosAlRedibujar(contenedor, armar) {
  var actual = null, armando = false, antes = 0, control = { api: null };
  function rearmar() {
    if (armando) return;
    armando = true;
    if (actual && actual.nav) actual.nav.remove();
    if (actual && actual.aviso) actual.aviso.remove();
    var cfg = armar();
    var api = pantallasDeDos(cfg);
    if (api && cfg.alCrecer === 'ultima' && antes && cfg.grupos.length > antes) api.ir(api.paginas - 1, true);
    antes = cfg.grupos.length;
    actual = cfg; control.api = api;
    armando = false;
  }
  rearmar();
  var propio = function (n) { return n.nodeType === 1 && (n.classList.contains('pantallas-nav') || n.classList.contains('pantallas-aviso')); };
  new MutationObserver(function (m) {
    if (m.some(function (r) {
      return [].some.call(r.addedNodes, function (n) { return n.nodeType === 1 && !propio(n); })
        || [].some.call(r.removedNodes, function (n) { return n.nodeType === 1 && !propio(n); });
    })) rearmar();
  }).observe(contenedor, { childList: true });
  return control;
}
/* Elementos = cada hijo de la lista (una pregunta, un objetivo, un rol...), aunque sus campos
 * sean casillas o botones de opción. Lo que va después de la lista (resumen, Verificar,
 * Reiniciar) se ve en la última pantalla. Reiniciar o Limpiar vuelven a la pantalla 1.
 * opciones.porPantalla: 1 en un caso de estudio (el caso queda arriba, una pregunta por pantalla).
 * opciones.finales: false para dejar a la vista lo que va después de la lista.
 * opciones.alCrecer: 'ultima' para ir a la pantalla nueva cuando se agrega un elemento. */
function pantallasDeDosPorHijos(lista, opciones) {
  if (!lista) return null;
  opciones = opciones || {};
  var despues = [];
  for (var h = lista.nextElementSibling; h; h = h.nextElementSibling)
    if (!h.classList.contains('pantallas-nav') && !h.classList.contains('pantallas-aviso')) despues.push(h);
  var control = pantallasDeDosAlRedibujar(lista, function () {
    var grupos = [].filter.call(lista.children, function (c) {
      return !c.classList.contains('pantallas-nav') && !c.classList.contains('pantallas-aviso');
    });
    var cfg = { grupos: grupos, finales: opciones.finales === false ? [] : despues, navDespuesDe: lista };
    for (var k in opciones) if (k !== 'finales') cfg[k] = opciones[k];
    return cfg;
  });
  despues.forEach(function (d) {
    [].forEach.call(d.querySelectorAll('button'), function (b) {
      if (/reiniciar|limpiar/i.test(b.textContent)) b.addEventListener('click', function () {
        setTimeout(function () { if (control.api) control.api.ir(0, false); });
      });
    });
  });
  return control;
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

// Caso ético: el caso queda arriba y va una pregunta por pantalla.
document.addEventListener('DOMContentLoaded', function () {
  pantallasDeDosPorHijos(document.getElementById('etico-questions'), { porPantalla: 1 });
});
