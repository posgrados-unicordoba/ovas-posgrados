/* Interacciones del OVA gthdo-pdi-u01-t01. */


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

        // ===== ÁRBOL DE DECISIONES: El Consultor vs. El Interventor =====
        const dtSteps = [
            {
                situation: 'La empresa TalentoVivo S.A.S. lleva 3 años con una rotación de personal del 40% anual. El gerente te llama urgente: quiere una solución para "el problema de los empleados que se van". El equipo de RRHH está desbordado y la alta gerencia exige resultados en 30 días.',
                question: '¿Cuál es tu primer movimiento como experto?',
                hint: 'Reflexiona: ¿el síntoma es el problema real, o hay algo más profundo?',
                options: [
                    {
                        id: 'A',
                        icon: 'fa-bolt',
                        label: 'Ruta del Consultor Técnico',
                        text: 'Diseñar de inmediato un plan de incentivos salariales y un programa de retención exprés para frenar la rotación en 30 días.',
                        type: 'tecnica'
                    },
                    {
                        id: 'B',
                        icon: 'fa-magnifying-glass-chart',
                        label: 'Ruta del Interventor Reflexivo',
                        text: 'Solicitar un período de diagnóstico participativo de 2 semanas: entrevistas con equipos, análisis de clima y revisión de procesos antes de proponer cualquier acción.',
                        type: 'intervencion'
                    }
                ],
                consequences: {
                    tecnica: {
                        label: '⚡ Resultado a corto plazo',
                        color: '#d97706',
                        bg: '#fffbeb',
                        text: 'Los incentivos reducen la rotación un 15% en el primer mes. El gerente queda satisfecho temporalmente. Sin embargo, a los 6 meses la rotación regresa porque el clima organizacional tóxico y la falta de reconocimiento no fueron abordados.',
                        lesson: 'La consultoría técnica resuelve síntomas. Sin diagnóstico sistémico, el problema reaparece con mayor intensidad.'
                    },
                    intervencion: {
                        label: '🔍 Resultado del diagnóstico',
                        color: '#059669',
                        bg: '#f0fdf4',
                        text: 'El diagnóstico revela que el 70% de los empleados que renuncian menciona liderazgo autoritario y falta de autonomía. Este hallazgo cambia completamente el foco: no es un problema salarial, es un problema de cultura y estilo de dirección.',
                        lesson: 'La intervención comienza siempre con un diagnóstico riguroso. Comprender el sistema antes de actuar es la diferencia entre el consultor y el interventor.'
                    }
                }
            },
            {
                situation: 'Con el diagnóstico en mano (o la solución técnica aplicada), el gerente te pide ahora diseñar el plan de acción. Los mandos medios se muestran resistentes al cambio y algunos líderes de área descalifican el proceso.',
                question: '¿Cómo gestionas la resistencia al cambio?',
                hint: 'La resistencia es información, no un obstáculo. ¿Qué harías con ella?',
                options: [
                    {
                        id: 'A',
                        icon: 'fa-gavel',
                        label: 'Imposición desde arriba',
                        text: 'Pedir a la alta gerencia que emita una directiva obligatoria para que todos los líderes participen en el proceso de cambio sin excepción.',
                        type: 'tecnica'
                    },
                    {
                        id: 'B',
                        icon: 'fa-people-arrows',
                        label: 'Cogestión participativa',
                        text: 'Crear mesas de trabajo con los líderes resistentes para explorar sus miedos y convertirlos en agentes de cambio, integrando sus perspectivas al plan.',
                        type: 'intervencion'
                    }
                ],
                consequences: {
                    tecnica: {
                        label: '⚡ Resultado de la imposición',
                        color: '#d97706',
                        bg: '#fffbeb',
                        text: 'Los líderes cumplen formalmente pero sabotean el proceso de manera pasiva: no comunican los cambios a sus equipos, no participan activamente y generan un clima de desconfianza. El plan técnico se implementa a medias.',
                        lesson: 'El cambio impuesto genera resistencia encubierta. Sin legitimidad social, ninguna intervención prospera a largo plazo.'
                    },
                    intervencion: {
                        label: '🤝 Resultado de la cogestión',
                        color: '#059669',
                        bg: '#f0fdf4',
                        text: 'Tres de los cinco líderes resistentes se convierten en patrocinadores del proceso al sentirse escuchados. Sus equipos adoptan los cambios con mayor disposición porque confían en sus líderes.',
                        lesson: 'La intervención organizacional involucra a todos los actores del sistema. La participación transforma la resistencia en compromiso.'
                    }
                }
            },
            {
                situation: 'El proceso de intervención lleva 4 meses. Se han hecho cambios reales en cultura, comunicación y estilos de liderazgo. El gerente pregunta: "¿Cómo sabemos que esto funcionó? ¿Cuándo terminamos?"',
                question: '¿Cómo defines el cierre y la evaluación de la intervención?',
                hint: 'Una intervención exitosa construye capacidad interna. ¿Cuándo es realmente autónoma la organización?',
                options: [
                    {
                        id: 'A',
                        icon: 'fa-file-circle-check',
                        label: 'Informe final y cierre',
                        text: 'Entregar un informe con los indicadores de rotación mejorados, cobrar los honorarios y cerrar el contrato. La organización ya tiene las herramientas.',
                        type: 'tecnica'
                    },
                    {
                        id: 'B',
                        icon: 'fa-seedling',
                        label: 'Transferencia y autonomía',
                        text: 'Diseñar un plan de sostenibilidad: capacitar a un equipo interno como "agentes de cambio", establecer métricas de seguimiento y acordar un acompañamiento esporádico de 6 meses para consolidar los aprendizajes.',
                        type: 'intervencion'
                    }
                ],
                consequences: {
                    tecnica: {
                        label: '📋 Resultado del cierre abrupto',
                        color: '#d97706',
                        bg: '#fffbeb',
                        text: 'A los 8 meses del cierre, la organización vuelve a los patrones anteriores porque no internalizó las prácticas. Los líderes no saben cómo sostener el cambio sin el consultor externo. Se genera dependencia.',
                        lesson: 'Cerrar sin transferencia de capacidad genera dependencia consultora. El cambio no es sostenible si la organización no aprende a autogestionarlo.'
                    },
                    intervencion: {
                        label: '🌱 Resultado de la transferencia',
                        color: '#059669',
                        bg: '#f0fdf4',
                        text: 'El equipo interno de agentes de cambio continúa el proceso. Un año después, la rotación bajó del 40% al 11%. La organización incorporó la metodología de diagnóstico-acción como práctica regular de gestión.',
                        lesson: 'La intervención exitosa hace al interventor prescindible. El objetivo final es que la organización aprenda a transformarse a sí misma.'
                    }
                }
            }
        ];

        const TOTAL_STEPS = dtSteps.length;
        let dtCurrentStep = 0;
        let dtChoices = [];
        let dtSelectedType = null;

        const dtSituationText = document.getElementById('dt-situation-text');
        const dtQuestionTitle = document.getElementById('dt-question-title');
        const dtQuestionHint = document.getElementById('dt-question-hint');
        const dtOptionsContainer = document.getElementById('dt-options');
        const dtConsequence = document.getElementById('dt-consequence');
        const dtConsequenceLabel = document.getElementById('dt-consequence-label');
        const dtConsequenceText = document.getElementById('dt-consequence-text');
        const dtConsequenceLesson = document.getElementById('dt-consequence-lesson');
        const dtNextBtn = document.getElementById('dt-next-btn');
        const dtFinal = document.getElementById('dt-final');
        const dtFinalIcon = document.getElementById('dt-final-icon');
        const dtFinalTitle = document.getElementById('dt-final-title');
        const dtFinalDesc = document.getElementById('dt-final-desc');
        const dtScorePills = document.getElementById('dt-score-pills');
        const dtRestartBtn = document.getElementById('dt-restart-btn');
        const dtStepLabel = document.getElementById('dt-step-label');
        const dtProgressBar = document.getElementById('dt-progress-bar');

        function dtRenderStep() {
            const step = dtSteps[dtCurrentStep];
            dtSelectedType = null;
            dtStepLabel.textContent = `Paso ${dtCurrentStep + 1} de ${TOTAL_STEPS}`;
            dtProgressBar.style.width = `${Math.round(((dtCurrentStep + 1) / TOTAL_STEPS) * 100)}%`;

            dtSituationText.textContent = step.situation;
            dtQuestionTitle.textContent = step.question;
            dtQuestionHint.textContent = step.hint;

            dtOptionsContainer.innerHTML = '';
            step.options.forEach(opt => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'dt-option-btn text-left p-5 rounded-2xl border-2 transition-all duration-200 hover:shadow-md';
                btn.style.cssText = 'border-color: var(--line); background: var(--surface-soft); cursor: pointer;';
                btn.dataset.type = opt.type;
                btn.innerHTML = `
                    <div class="flex items-start gap-3">
                        <div class="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg" style="background: var(--accent); color: white;">
                            <i class="fa-solid ${opt.icon}"></i>
                        </div>
                        <div>
                            <p class="font-bold text-sm mb-1" style="color: var(--heading);">${opt.label}</p>
                            <p class="text-sm leading-relaxed" style="color: var(--text);">${opt.text}</p>
                        </div>
                    </div>`;
                btn.addEventListener('click', () => dtSelectOption(opt.type, step));
                dtOptionsContainer.appendChild(btn);
            });

            dtConsequence.classList.add('hidden');
            document.getElementById('dt-question-box').classList.remove('hidden');
        }

        function dtSelectOption(type, step) {
            dtSelectedType = type;
            const cons = step.consequences[type];

            document.querySelectorAll('.dt-option-btn').forEach(b => {
                b.style.opacity = '0.5';
                b.style.pointerEvents = 'none';
                if (b.dataset.type === type) {
                    b.style.opacity = '1';
                    b.style.borderColor = cons.color;
                    b.style.background = cons.bg;
                }
            });

            dtConsequenceLabel.textContent = cons.label;
            dtConsequenceLabel.style.color = cons.color;
            dtConsequenceText.textContent = cons.text;
            dtConsequenceLesson.textContent = '💡 ' + cons.lesson;
            dtConsequence.style.background = cons.bg;
            dtConsequence.style.borderColor = cons.color;
            dtConsequence.classList.remove('hidden');

            dtChoices.push(type);

            const isLast = dtCurrentStep === TOTAL_STEPS - 1;
            dtNextBtn.innerHTML = isLast
                ? 'Ver mi perfil <i class="fa-solid fa-flag-checkered ml-2"></i>'
                : 'Continuar <i class="fa-solid fa-arrow-right ml-2"></i>';

            dtConsequence.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        dtNextBtn.addEventListener('click', () => {
            if (dtCurrentStep < TOTAL_STEPS - 1) {
                dtCurrentStep++;
                dtRenderStep();
                document.getElementById('dt-situation').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                dtShowFinal();
            }
        });

        function dtShowFinal() {
            const interventorCount = dtChoices.filter(c => c === 'intervencion').length;

            document.getElementById('dt-question-box').classList.add('hidden');
            dtConsequence.classList.add('hidden');
            document.getElementById('dt-situation').classList.add('hidden');
            document.querySelector('.mb-6').style.display = 'none';

            dtProgressBar.style.width = '100%';

            let icon, title, desc, cardBg;
            if (interventorCount === 3) {
                icon = '🏆';
                title = 'Interventor Experto';
                desc = 'Has tomado las decisiones propias de un interventor organizacional profundo. Tu enfoque sistémico, participativo y orientado a la transferencia de capacidades refleja exactamente lo que la intervención organizacional busca: transformar culturas, no solo resolver problemas. ¡Estás listo para diseñar tu propio proyecto de intervención!';
                cardBg = '#f0fdf4';
            } else if (interventorCount === 2) {
                icon = '📈';
                title = 'Consultor en Transición';
                desc = 'Tienes una comprensión sólida de la intervención reflexiva, aunque en algún momento el instinto técnico tomó el control. Revisa las consecuencias de esa decisión: ¿qué habría cambiado si hubieras optado por el enfoque de intervención en todos los pasos?';
                cardBg = '#eff6ff';
            } else if (interventorCount === 1) {
                icon = '🔧';
                title = 'Consultor Técnico';
                desc = 'Tu perfil predominante es el del consultor técnico: eficiente a corto plazo, orientado a resultados rápidos. La intervención organizacional te invita a ir más profundo: el cambio sostenible requiere diagnóstico, participación y transferencia. ¡Vuelve a intentarlo con esta mirada!';
                cardBg = '#fffbeb';
            } else {
                icon = '⚡';
                title = 'Especialista en Soluciones Rápidas';
                desc = 'Optaste siempre por la vía técnica. Aunque es eficaz en emergencias puntuales, no genera transformación. La intervención organizacional propone ir a las raíces del sistema. Te recomendamos revisar el contenido del tema y volver a intentar la simulación.';
                cardBg = '#fff7ed';
            }

            dtFinalIcon.textContent = icon;
            dtFinalTitle.textContent = title;
            dtFinalDesc.textContent = desc;
            document.getElementById('dt-final-card').style.background = cardBg;

            dtScorePills.innerHTML = dtChoices.map((c, i) => `
                <span class="px-3 py-1 rounded-full text-xs font-bold" style="background: ${c === 'intervencion' ? '#d1fae5' : '#fef3c7'}; color: ${c === 'intervencion' ? '#065f46' : '#92400e'};">
                    Paso ${i + 1}: ${c === 'intervencion' ? '✓ Intervención' : '⚡ Técnico'}
                </span>`).join('');

            dtFinal.classList.remove('hidden');
            dtFinal.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        dtRestartBtn.addEventListener('click', () => {
            dtCurrentStep = 0;
            dtChoices = [];
            dtSelectedType = null;
            dtFinal.classList.add('hidden');
            document.getElementById('dt-situation').classList.remove('hidden');
            document.querySelector('.mb-6').style.display = '';
            dtProgressBar.style.width = '33%';
            dtRenderStep();
            document.getElementById('decision-tree-container').scrollIntoView({ behavior: 'smooth' });
        });

        if (document.getElementById('decision-tree-container')) {
            dtRenderStep();
        }

        // Quiz functionality - one question at a time
        const quizQuestions = [
            {
                question: "¿Cuál es la diferencia entre consultoría técnica e intervención reflexiva?",
                options: [
                    { value: "a", text: "La consultoría técnica se enfoca en soluciones específicas, mientras la intervención reflexiva implica un proceso de cambio profundo con reflexión sobre problemáticas complejas.", explicacion: "Correcto. La consultoría técnica entrega soluciones específicas a un problema definido; la intervención reflexiva acompaña un cambio profundo en el que la organización reflexiona sobre problemáticas complejas." },
                    { value: "b", text: "La consultoría técnica es más costosa que la intervención reflexiva.", explicacion: "No es la respuesta. La diferencia no está en el costo, sino en el enfoque: una resuelve un problema puntual y la otra transforma la forma como la organización entiende sus problemas." },
                    { value: "c", text: "No existe diferencia entre ambas modalidades.", explicacion: "No es la respuesta. Son modalidades distintas: la consultoría técnica aplica soluciones concretas y la intervención reflexiva promueve un cambio de fondo." }
                ],
                correct: "a"
            },
            {
                question: "¿Qué establece el Decreto 1330 de 2019 sobre los proyectos de intervención?",
                options: [
                    { value: "a", text: "Que los proyectos de intervención son opcionales en especializaciones.", explicacion: "No es la respuesta. El decreto no los presenta como opcionales: los ubica dentro de la gestión curricular de calidad de los programas." },
                    { value: "b", text: "Que los proyectos de intervención deben ser exclusivamente de investigación teórica.", explicacion: "No es la respuesta. El decreto no los limita a la teoría; en las especializaciones se privilegia la aplicación en contextos reales." },
                    { value: "c", text: "Que los programas deben demostrar calidad en gestión curricular y fomentar creación de conocimiento. El proyecto de intervención se configura como 'Proyecto Aplicado'.", explicacion: "Correcto. El Decreto 1330 de 2019 exige a los programas demostrar calidad curricular y fomentar la creación de conocimiento; en las especializaciones, el proyecto de intervención toma la forma de Proyecto Aplicado." }
                ],
                correct: "c"
            },
            {
                question: "¿Cuáles son las modalidades más valoradas en especializaciones de gerencia?",
                options: [
                    { value: "a", text: "Solo la tesis tradicional de investigación.", explicacion: "No es la respuesta. La tesis tradicional no es la modalidad más valorada en una especialización de gerencia, cuyo énfasis está en la aplicación." },
                    { value: "b", text: "El Proyecto Aplicado (emprendimiento, desarrollo tecnológico o social) y la Investigación-Acción por su impacto directo.", explicacion: "Correcto. El Proyecto Aplicado y la Investigación-Acción son las más valoradas porque generan un impacto directo en las organizaciones." },
                    { value: "c", text: "Solo la monografía sin aplicación práctica.", explicacion: "No es la respuesta. Una monografía sin aplicación práctica no responde al propósito de una especialización de gerencia." }
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
