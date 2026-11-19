/* Interacciones del OVA gthdo-pobh-u02-t01. */

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
            question: "¿Cuál es la principal diferencia entre cultura y clima organizacional según Edgar Schein?",
            options: [
                { value: "a", text: "No existe diferencia; ambos conceptos son sinónimos." },
                { value: "b", text: "La cultura es el sistema profundo de supuestos, valores y creencias; el clima es la percepción temporal del ambiente de trabajo." },
                { value: "c", text: "La cultura se mide con encuestas de satisfacción laboral; el clima no se puede medir." }
            ],
            correct: "b"
        },
        {
            question: "¿Qué significa desarrollar agilidad cultural en una organización?",
            options: [
                { value: "a", text: "Aplicar metodologías ágiles como Scrum en todos los procesos operativos." },
                { value: "b", text: "Cambiar los supuestos, valores y comportamientos para adaptarse con rapidez y resiliencia." },
                { value: "c", text: "Reducir el número de niveles jerárquicos eliminando cargos directivos." }
            ],
            correct: "b"
        },
        {
            question: "¿Cuál es una característica central de las organizaciones líquidas?",
            options: [
                { value: "a", text: "Estructuras rígidas y permanentes que garantizan estabilidad a largo plazo." },
                { value: "b", text: "Liderazgo paternalista y centralizado en una sola persona." },
                { value: "c", text: "Estructuras flexibles, colaborativas y adaptables al cambio continuo." }
            ],
            correct: "c"
        },
        {
            question: "En un entorno BANI (Brítico, Ansioso, No lineal, Incomprensible), ¿por qué el bienestar psicológico es especialmente relevante?",
            options: [
                { value: "a", text: "Ayuda a las personas a regular la incertidumbre, mantener el rendimiento y prevenir el agotamiento." },
                { value: "b", text: "Elimina la complejidad y la ambigüedad inherentes al entorno." },
                { value: "c", text: "Sustituye la necesidad de una estrategia organizacional clara." }
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

    const contrastItems = [
        {
            id: 'contrast-1',
            texto: 'En esta organización se cree que "el error es parte del aprendizaje" y se comparten lecciones sin culpabilizar a las personas.',
            correct: 'cultura',
            cultura: { alerta: 'Correcto: Cultura', msg: 'Se trata de un supuesto profundo compartido sobre el error y el aprendizaje, es decir, un valor cultural estable.', color: 'var(--accent)', bg: '#f0fdf4' },
            clima: { alerta: 'Incorrecto', msg: 'No es solo una percepción temporal del ambiente; describe una creencia estable del grupo.', color: '#dc2626', bg: '#fef2f2' }
        },
        {
            id: 'contrast-2',
            texto: 'Durante los últimos tres meses los equipos perciben alta presión por plazos ajustados y poco reconocimiento.',
            correct: 'clima',
            clima: { alerta: 'Correcto: Clima', msg: 'Es una percepción situacional del ambiente de trabajo en un período determinado.', color: 'var(--accent)', bg: '#f0fdf4' },
            cultura: { alerta: 'Incorrecto', msg: 'Se trata de una percepción temporal (clima), no de un valor profundo e históricamente arraigado.', color: '#dc2626', bg: '#fef2f2' }
        },
        {
            id: 'contrast-3',
            texto: 'La toma de decisiones importantes siempre requiere aprobación del máximo dirigente; centralización histórica del poder.',
            correct: 'cultura',
            cultura: { alerta: 'Correcto: Cultura', msg: 'La centralización es un patrón de creencias y prácticas arraigadas sobre cómo se ejerce el poder.', color: 'var(--accent)', bg: '#f0fdf4' },
            clima: { alerta: 'Incorrecto', msg: 'No es un clima temporal; es un modelo estable de liderazgo y control.', color: '#dc2626', bg: '#fef2f2' }
        },
        {
            id: 'contrast-4',
            texto: 'Tras la implementación de sprints, los colaboradores sienten que pueden proponer ideas sin temor a sanción.',
            correct: 'clima',
            clima: { alerta: 'Correcto: Clima', msg: 'Es una percepción del ambiente psicosocial que se puede modificar con prácticas concretas.', color: 'var(--accent)', bg: '#f0fdf4' },
            cultura: { alerta: 'Incorrecto', msg: 'Si bien refuerza la cultura, la afirmación describe una percepción temporal del entorno laboral (clima).', color: '#dc2626', bg: '#fef2f2' }
        }
    ];

    function renderContraste() {
        const container = document.getElementById('contrast-checks');
        document.getElementById('contrast-resultado').classList.add('hidden');
        if (!container) return;
        container.innerHTML = contrastItems.map(item => `
            <div class="p-4 rounded-xl border contrast-card" id="card-${item.id}" style="background: var(--surface-soft); border-color: var(--line);">
                <p class="text-sm font-semibold mb-3" style="color: var(--heading);">${item.texto}</p>
                <div class="flex gap-4">
                    <label class="flex items-center gap-2 text-sm cursor-pointer font-semibold">
                        <input type="radio" name="${item.id}" value="cultura" class="contrast-radio"> Cultura
                    </label>
                    <label class="flex items-center gap-2 text-sm cursor-pointer font-semibold">
                        <input type="radio" name="${item.id}" value="clima" class="contrast-radio"> Clima
                    </label>
                </div>
                <div class="contrast-feedback mt-3 hidden p-3 rounded-lg text-xs font-semibold"></div>
            </div>
        `).join('');
    }

    window.verificarContraste = function() {
        let correctCount = 0;
        let answeredCount = 0;
        contrastItems.forEach(item => {
            const selected = document.querySelector(`input[name="${item.id}"]:checked`);
            const card = document.getElementById(`card-${item.id}`);
            const fb = card.querySelector('.contrast-feedback');
            if (!selected) {
                fb.innerHTML = '⚠️ Selecciona una opción para este ítem.';
                fb.style.background = '#fef9c3';
                fb.style.color = '#92400e';
                fb.classList.remove('hidden');
                return;
            }
            answeredCount++;
            const isCorrect = selected.value === item.correct;
            if (isCorrect) correctCount++;
            const result = item[selected.value];
            card.style.borderColor = isCorrect ? 'var(--accent)' : '#dc2626';
            fb.innerHTML = `<span>${result.alerta}:</span> ${result.msg}`;
            fb.style.background = result.bg;
            fb.style.color = result.color;
            fb.classList.remove('hidden');
        });

        const summary = document.getElementById('contrast-resultado');
        if (answeredCount === contrastItems.length) {
            const pct = Math.round((correctCount / contrastItems.length) * 100);
            const msg = pct === 100 ? '¡Excelente! Diferencias correctamente cultura y clima organizacional.' : pct >= 50 ? `Acertaste ${correctCount} de ${contrastItems.length}. Revisa las retroalimentaciones para afianzar el contraste.` : `Acertaste ${correctCount} de ${contrastItems.length}. Te sugiero revisar la diferencia entre cultura (profunda y estable) y clima (percepción temporal).`;
            summary.innerHTML = `
                <p class="text-base font-bold" style="color: var(--heading);">Resultado: ${correctCount}/${contrastItems.length} aciertos</p>
                <div class="w-full h-3 rounded-full bg-gray-200 mt-2 overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-500" style="width: ${pct}%; background: ${pct === 100 ? 'var(--accent)' : pct >= 50 ? '#d97706' : '#dc2626'};"></div>
                </div>
                <p class="mt-2 text-sm font-semibold" style="color: ${pct === 100 ? 'var(--accent)' : pct >= 50 ? '#d97706' : '#dc2626'};">${msg}</p>
            `;
            summary.classList.remove('hidden');
        }
    }

    window.limpiarContraste = function() {
        document.querySelectorAll('.contrast-radio').forEach(r => r.checked = false);
        contrastItems.forEach(item => {
            const card = document.getElementById(`card-${item.id}`);
            card.style.borderColor = 'var(--line)';
            const fb = card.querySelector('.contrast-feedback');
            fb.classList.add('hidden');
            fb.innerHTML = '';
        });
        document.getElementById('contrast-resultado').classList.add('hidden');
        document.getElementById('actividad').scrollIntoView({ behavior: 'smooth' });
    }

    const casoQuestions = [
        {
            text: "¿Cuál es el problema principal que enfrenta Innovación Digital S.A.S.?",
            options: [
                { value: "a", text: "No usar suficientes herramientas ágiles como Scrum y sprints.", correct: false, feedback: "La empresa ya usa herramientas ágiles; el problema es que las prácticas culturales no las acompañan." },
                { value: "b", text: "Agilidad de procesos sin agilidad cultural: los supuestos de control y miedo al error siguen vigentes.", correct: true, feedback: "Correcto. La cultura no cambió junto con los procesos, lo que genera fricción, estrés y estancamiento." },
                { value: "c", text: "La rotación se debe exclusivamente a salarios bajos.", correct: false, feedback: "No hay evidencia de salarios bajos; el caso señala miedo al error, control centralizado y carga laboral." }
            ]
        },
        {
            text: "¿Qué acción prioriza para desarrollar agilidad cultural?",
            options: [
                { value: "a", text: "Reducir el número de reuniones diarias para evitar fatiga.", correct: false, feedback: "Disminuir reuniones no ataca los supuestos culturales de control y miedo al error." },
                { value: "b", text: "Distribuir la toma de decisiones y promover espacios seguros para experimentar.", correct: true, feedback: "Correcto. La agilidad cultural requiere empoderamiento, psychological safety y tolerancia al error." },
                { value: "c", text: "Comprar más licencias de software de gestión de proyectos.", correct: false, feedback: "Las herramientas tecnológicas no sustituyen un cambio cultural profundo." }
            ]
        },
        {
            text: "¿Por qué el bienestar psicológico es crítico en este contexto BANI / 2026?",
            options: [
                { value: "a", text: "Porque reduce la imagen externa de la empresa ante clientes.", correct: false, feedback: "El bienestar psicológico impacta primero en el talento interno, no en la imagen externa." },
                { value: "b", text: "Porque evita agotamiento cognitivo, ansiedad y rotación de talento clave.", correct: true, feedback: "Correcto. En entornos inciertos, el bienestar psicológico protege el capital humano y sostiene el rendimiento." },
                { value: "c", text: "Porque es un requisito legal obligatorio de las metodologías ágiles.", correct: false, feedback: "El bienestar psicológico no es un requisito de Scrum; es un factor de sostenibilidad del desempeño." }
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
        let msg = pct >= 80 ? '¡Excelente! Comprendes cómo diagnosticar y promover agilidad cultural en contextos de transformación organizacional.' : pct >= 50 ? 'Buen avance. Revisa la retroalimentación para fortalecer tu análisis de cultura, clima y bienestar.' : 'Repasa el contenido del Tema 1. Recuerda: la agilidad cultural va más allá de las herramientas; implica cambiar supuestos, valores y comportamientos.';
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

    renderContraste();
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
