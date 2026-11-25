/* Interacciones del OVA gthdo-pobh-u03-t03. */


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
                question: "Según el Modelo de 8 Pasos de Kotter, ¿cuál es el primer paso para liderar un cambio organizacional exitoso?",
                options: [
                    { value: "a", text: "Formar una coalición de líderes influyentes.", explicacion: "No es la respuesta. Formar la coalición guía es el segundo paso de Kotter: sin una urgencia compartida, es difícil que los líderes se comprometan con el cambio." },
                    { value: "b", text: "Crear un sentido de urgencia que movilice a la organización.", explicacion: "Correcto. Kotter inicia con el sentido de urgencia: si la organización no percibe por qué debe cambiar, los demás pasos (coalición, visión, comunicación) pierden fuerza." },
                    { value: "c", text: "Comunicar la visión estratégica a todos los niveles.", explicacion: "No es la respuesta. Comunicar la visión es un paso posterior; antes hay que crear urgencia, formar la coalición y construir la visión que se va a comunicar." }
                ],
                correct: "b"
            },
            {
                question: "En el modelo ADKAR de Prosci, ¿qué elemento representa la motivación personal para participar y apoyar el cambio?",
                options: [
                    { value: "a", text: "Awareness (Conciencia).", explicacion: "No es la respuesta. Awareness es saber por qué se necesita el cambio; entender la razón no garantiza querer participar en él." },
                    { value: "b", text: "Knowledge (Conocimiento).", explicacion: "No es la respuesta. Knowledge es saber cómo cambiar (habilidades y comportamientos); llega después de que la persona ya desea el cambio." },
                    { value: "c", text: "Desire (Deseo).", explicacion: "Correcto. Desire es la decisión personal de apoyar y participar en el cambio: la motivación propia que se construye después de la conciencia y antes del conocimiento." }
                ],
                correct: "c"
            },
            {
                question: "¿Qué caracteriza a la Gobernanza Híbrida como nuevo estándar de gestión de proyectos hacia el 2026?",
                options: [
                    { value: "a", text: "Aplicar exclusivamente metodologías ágiles en todos los proyectos.", explicacion: "No es la respuesta. La gobernanza híbrida no descarta los métodos tradicionales: combina lo ágil con controles formales donde se necesitan." },
                    { value: "b", text: "Combinar rigurosidad en hitos financieros con flexibilidad radical en la entrega de valor.", explicacion: "Correcto. La gobernanza híbrida mantiene control riguroso en hitos y presupuesto, y deja flexibilidad para iterar en la forma como se entrega valor." },
                    { value: "c", text: "Eliminar la planificación tradicional para acelerar la ejecución.", explicacion: "No es la respuesta. Eliminar la planificación aumenta el riesgo; el modelo híbrido conserva la planificación de hitos y la equilibra con agilidad." }
                ],
                correct: "b"
            },
            {
                question: "¿Por qué es un error común iniciar la gestión del cambio directamente con capacitación, según el modelo ADKAR?",
                options: [
                    { value: "a", text: "Porque la capacitación solo funciona en modalidad presencial.", explicacion: "No es la respuesta. La modalidad no es el problema; ADKAR señala que el orden de los elementos importa más que el formato de la capacitación." },
                    { value: "b", text: "Porque sin Conciencia y Deseo previos, las personas no tienen disposición para aprender.", explicacion: "Correcto. En ADKAR, la capacitación corresponde al Conocimiento; si antes no hay Conciencia del porqué y Deseo de participar, las personas no se disponen a aprender." },
                    { value: "c", text: "Porque la capacitación debe realizarse únicamente al final del proceso de cambio.", explicacion: "No es la respuesta. La capacitación no va al final: en ADKAR viene después de la Conciencia y el Deseo, y antes de la Habilidad y el Refuerzo." }
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

        // ===== ACTIVIDAD: STEPPER + PLANTILLAS =====
        const actFieldIds = ['casePropioText','kotter1','kotter2','kotter3','kotter4','adkar1','adkar2','adkar3','adkar4','adkar5','gov1','gov2','gov3'];
        const ACT_KEY = 'ova_tema3_actividad';
        const actStepLabels = ['Caso', 'Modelo de Kotter', 'Diagnóstico ADKAR', 'Gobernanza Híbrida'];
        const actSteps = document.querySelectorAll('.act-step');
        const actStepTitle = document.getElementById('actStepTitle');
        const actProgressBar = document.getElementById('actProgressBar');
        const actPrev = document.getElementById('actPrev');
        const actNext = document.getElementById('actNext');
        let actCurrentStep = 0;

        const actExportWrap = document.getElementById('actExportWrap');

        function renderActStep() {
            actSteps.forEach((s, i) => s.classList.toggle('hidden', i !== actCurrentStep));
            actStepTitle.textContent = `Paso ${actCurrentStep + 1} de ${actSteps.length} — ${actStepLabels[actCurrentStep]}`;
            actProgressBar.style.width = `${((actCurrentStep + 1) / actSteps.length) * 100}%`;
            actPrev.disabled = actCurrentStep === 0;
            actNext.textContent = actCurrentStep === actSteps.length - 1 ? 'Guardar y finalizar' : 'Siguiente';
            if (actExportWrap) {
                if (actCurrentStep === actSteps.length - 1) { actExportWrap.classList.remove('hidden'); actExportWrap.style.display = 'inline-block'; }
                else { actExportWrap.classList.add('hidden'); actExportWrap.style.display = 'none'; }
            }
        }

        if (actPrev) actPrev.addEventListener('click', () => {
            if (actCurrentStep > 0) { actCurrentStep--; renderActStep(); document.getElementById('actividad').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        });

        if (actNext) actNext.addEventListener('click', () => {
            if (actCurrentStep < actSteps.length - 1) {
                saveActData();
                actCurrentStep++;
                renderActStep();
                document.getElementById('actividad').scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                saveActData();
            }
        });

        // Toggle caso propio
        const useCasePropio = document.getElementById('useCasePropio');
        const casePropioBox = document.getElementById('casePropioBox');
        if (useCasePropio) {
            useCasePropio.addEventListener('change', function() {
                casePropioBox.classList.toggle('hidden', !this.checked);
            });
        }

        // Load saved data
        function loadActData() {
            try {
                const saved = JSON.parse(localStorage.getItem(ACT_KEY));
                if (!saved) return;
                actFieldIds.forEach(id => {
                    const el = document.getElementById(id);
                    if (el && saved[id]) el.value = saved[id];
                });
                if (saved._usePropio && useCasePropio) {
                    useCasePropio.checked = true;
                    casePropioBox.classList.remove('hidden');
                }
            } catch(e) {}
        }

        // Save data
        function saveActData() {
            const data = {};
            actFieldIds.forEach(id => {
                const el = document.getElementById(id);
                if (el) data[id] = el.value;
            });
            if (useCasePropio) data._usePropio = useCasePropio.checked;
            localStorage.setItem(ACT_KEY, JSON.stringify(data));
            const msg = document.getElementById('actSaveMsg');
            if (msg) {
                msg.textContent = '✓ Guardado';
                setTimeout(() => { msg.textContent = ''; }, 3000);
            }
        }

        const actSave = document.getElementById('actSave');
        if (actSave) actSave.addEventListener('click', saveActData);

        // Clear data
        const actClear = document.getElementById('actClear');
        if (actClear) actClear.addEventListener('click', () => {
            actFieldIds.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
            if (useCasePropio) { useCasePropio.checked = false; casePropioBox.classList.add('hidden'); }
            localStorage.removeItem(ACT_KEY);
            document.querySelectorAll('.char-count').forEach(c => c.textContent = '0');
            const msg = document.getElementById('actSaveMsg');
            if (msg) { msg.textContent = '✓ Limpiado'; setTimeout(() => { msg.textContent = ''; }, 3000); }
            document.getElementById('actividad').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        // Export dropdown toggle
        const actExportBtn = document.getElementById('actExportBtn');
        const actExportMenu = document.getElementById('actExportMenu');
        if (actExportBtn && actExportMenu) {
            actExportBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                actExportMenu.classList.toggle('hidden');
            });
            document.addEventListener('click', () => actExportMenu.classList.add('hidden'));
            actExportMenu.addEventListener('click', () => actExportMenu.classList.add('hidden'));
        }

        // Character counters
        document.querySelectorAll('.act-field').forEach(ta => {
            const counter = document.querySelector(`.char-count[data-for="${ta.id}"]`);
            if (!counter) return;
            const update = () => { counter.textContent = ta.value.length; };
            ta.addEventListener('input', update);
            update();
        });

        // Build export content
        function buildExportText() {
            const labels = {
                casePropioText: 'MI CASO PROPIO',
                kotter1: '1. ¿Cómo crearías un sentido de urgencia?',
                kotter2: '2. ¿Quiénes formarían tu coalición y por qué?',
                kotter3: '3. ¿Cuál sería la visión del cambio?',
                kotter4: '4. ¿Qué ganancias rápidas propondrías?',
                adkar1: 'A — Awareness: ¿Qué saben o no saben del cambio?',
                adkar2: 'D — Desire: ¿Qué los motiva o bloquea?',
                adkar3: 'K — Knowledge: ¿Qué formación necesitan?',
                adkar4: 'A — Ability: ¿Cómo demostrarían la capacidad?',
                adkar5: 'R — Reinforcement: ¿Cómo sostendrías el cambio?',
                gov1: 'Hitos fijos (predictivos)',
                gov2: 'Sprints ágiles de adopción',
                gov3: 'Indicadores de People Analytics'
            };
            let text = 'ACTIVIDAD — DISEÑO DE UN PLAN DE GESTIÓN DEL CAMBIO\n';
            text += 'Tema 3: Modelos metodológicos de gestión del cambio organizacional\n';
            text += '='.repeat(60) + '\n\n';

            const cp = document.getElementById('casePropioText');
            if (cp && cp.value.trim()) {
                text += 'MI CASO PROPIO\n' + '-'.repeat(40) + '\n' + cp.value.trim() + '\n\n';
            }

            text += 'PLANTILLA 1: MODELO DE KOTTER\n' + '-'.repeat(40) + '\n';
            ['kotter1','kotter2','kotter3','kotter4'].forEach(id => {
                const el = document.getElementById(id);
                text += '\n' + labels[id] + '\n' + (el && el.value.trim() ? el.value.trim() : '(sin respuesta)') + '\n';
            });

            text += '\n\nPLANTILLA 2: DIAGNÓSTICO ADKAR\n' + '-'.repeat(40) + '\n';
            ['adkar1','adkar2','adkar3','adkar4','adkar5'].forEach(id => {
                const el = document.getElementById(id);
                text += '\n' + labels[id] + '\n' + (el && el.value.trim() ? el.value.trim() : '(sin respuesta)') + '\n';
            });

            text += '\n\nPLANTILLA 3: GOBERNANZA HÍBRIDA\n' + '-'.repeat(40) + '\n';
            ['gov1','gov2','gov3'].forEach(id => {
                const el = document.getElementById(id);
                text += '\n' + labels[id] + '\n' + (el && el.value.trim() ? el.value.trim() : '(sin respuesta)') + '\n';
            });

            return text;
        }

        // Export TXT
        document.getElementById('actExportTxt')?.addEventListener('click', () => {
            const blob = new Blob([buildExportText()], { type: 'text/plain;charset=utf-8' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'Actividad_Tema3_GestionCambio.txt';
            a.click();
            URL.revokeObjectURL(a.href);
        });

        // Export Word (.doc HTML)
        document.getElementById('actExportWord')?.addEventListener('click', () => {
            const text = buildExportText();
            const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>Actividad Tema 3</title>
<style>body{font-family:Calibri,sans-serif;font-size:11pt;line-height:1.6}h1{font-size:14pt;color:#17a2b8}h2{font-size:12pt;color:#333;margin-top:18pt}p{margin:4pt 0}</style></head>
<body>${text.split('\n').map(line => {
                if (line.startsWith('ACTIVIDAD')) return '<h1>' + line + '</h1>';
                if (line.startsWith('PLANTILLA') || line.startsWith('MI CASO')) return '<h2>' + line + '</h2>';
                if (line.startsWith('=') || line.startsWith('-')) return '<hr>';
                if (line.startsWith('Tema 3:')) return '<p><em>' + line + '</em></p>';
                return '<p>' + line + '</p>';
            }).join('')}</body></html>`;
            const blob = new Blob([html], { type: 'application/msword' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'Actividad_Tema3_GestionCambio.doc';
            a.click();
            URL.revokeObjectURL(a.href);
        });

        loadActData();
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
 */
function pantallasDeDos(cfg) {
  var POR = cfg.porPantalla || 2;
  var grupos = cfg.grupos.filter(Boolean).map(function (g) { return [].concat(g).filter(Boolean); }).filter(function (g) { return g.length; });
  var finales = (cfg.finales || []).filter(Boolean);
  var paginas = Math.ceil(grupos.length / POR);
  if (paginas <= 1) return null;
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
    var ultimo = grupos[grupos.length - 1];
    (cfg.navDespuesDe || ultimo[ultimo.length - 1]).after(nav);
    btnAnt.addEventListener('click', function () { ir(actual - 1, true); });
    btnSig.addEventListener('click', function () { ir(actual + 1, true); });
    cfg.nav = nav;
  } else {
    grupos[0][0].before(aviso);
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
      var campo = g.querySelector('textarea, select, input, button') || g;
      if (campo === g && !g.hasAttribute('tabindex')) g.setAttribute('tabindex', '-1');
      campo.focus({ preventScroll: true });
      g.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  ir(0, false);
  return { ir: ir, paginas: paginas };
}

/* Igual, pero se vuelve a armar si el script redibuja el formulario (por ejemplo, al limpiar). */
function pantallasDeDosAlRedibujar(contenedor, armar) {
  var actual = null, armando = false;
  function rearmar() {
    if (armando) return;
    armando = true;
    if (actual && actual.nav) actual.nav.remove();
    var cfg = armar();
    pantallasDeDos(cfg);
    actual = cfg;
    armando = false;
  }
  rearmar();
  new MutationObserver(function (m) {
    var propio = function (n) { return n.nodeType === 1 && n.classList.contains('pantallas-nav'); };
    if (m.some(function (r) { return [].some.call(r.addedNodes, function (n) { return !propio(n); }); })) rearmar();
  }).observe(contenedor, { childList: true });
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

// Pasos 2 a 4, con los mismos botones Anterior y Siguiente: de 2 en 2.
document.addEventListener('DOMContentLoaded', function () {
  ['actStep1', 'actStep2', 'actStep3'].forEach(function (id) {
    var paso = document.getElementById(id);
    pantallasDeDosEnLista(paso && paso.querySelector('.space-y-4'), {
      paso: paso, siguiente: document.getElementById('actNext'), anterior: document.getElementById('actPrev')
    });
  });
});
