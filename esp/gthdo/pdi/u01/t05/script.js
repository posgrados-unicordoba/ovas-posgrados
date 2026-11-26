/* Interacciones del OVA gthdo-pdi-u01-t05. */


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
                question: "¿Qué característica diferencia un objetivo SMART de uno genérico en un proyecto de intervención organizacional?",
                options: [
                    { value: "a", text: "El objetivo SMART es más extenso y detallado en su redacción.", explicacion: "No es la respuesta. Un objetivo SMART no se distingue por su extensión, sino por cumplir criterios que permiten verificar si se logró." },
                    { value: "b", text: "El objetivo SMART solo necesita ser medible y temporal, los demás criterios son opcionales.", explicacion: "No es la respuesta. Los cinco criterios son necesarios: un objetivo medible pero poco específico o irrelevante no orienta bien la intervención." },
                    { value: "c", text: "El objetivo SMART incluye criterios de especificidad, medición, alcanzabilidad, relevancia y temporalidad que permiten evaluar su cumplimiento.", explicacion: "Correcto. SMART significa específico, medible, alcanzable, relevante y con plazo definido; esos cinco criterios hacen posible evaluar si el objetivo se cumplió." }
                ],
                correct: "c"
            },
            {
                question: "¿Qué propone el modelo centrado en la tarea y en el humano para el diseño de proyectos de intervención?",
                options: [
                    { value: "a", text: "Equilibrar la optimización de procesos con el bienestar emocional del colaborador, integrando la Propuesta de Valor al Empleado (EVP).", explicacion: "Correcto. El modelo combina la mejora de procesos (la tarea) con el bienestar emocional (lo humano), y usa la Propuesta de Valor al Empleado para integrarlos." },
                    { value: "b", text: "Priorizar exclusivamente la eficiencia operativa sobre el bienestar del colaborador.", explicacion: "No es la respuesta. El modelo busca equilibrio; priorizar solo la eficiencia deja por fuera la dimensión humana." },
                    { value: "c", text: "Eliminar los indicadores de productividad para centrarse únicamente en el clima laboral.", explicacion: "No es la respuesta. El modelo no elimina la productividad: la equilibra con el bienestar de las personas." }
                ],
                correct: "a"
            },
            {
                question: "¿Por qué es fundamental incluir un plan de mejora continua en el diseño del proyecto de intervención?",
                options: [
                    { value: "a", text: "Porque el proyecto se ejecuta una sola vez y no requiere seguimiento posterior.", explicacion: "No es la respuesta. Un proyecto de intervención necesita seguimiento: sin él no se sabe si el cambio se sostiene." },
                    { value: "b", text: "Porque permite ajustar la intervención según los hallazgos de la fase de observación, utilizando indicadores cuantitativos y cualitativos para medir el impacto a largo plazo.", explicacion: "Correcto. La mejora continua permite ajustar la intervención con lo que se observa y medir su impacto en el tiempo con indicadores cuantitativos y cualitativos." },
                    { value: "c", text: "Porque es un requisito formal del formato 088 pero no tiene aplicación práctica.", explicacion: "No es la respuesta. El plan de mejora continua no es un trámite: es la herramienta para sostener y ajustar los resultados de la intervención." }
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

        // ===== EVALUADOR SMART =====
        const smartAnswers = {
            1: { correct: ['R'], explanations: { S: 'No especifica qué área, departamento ni quién ejecuta.', M: 'No incluye cifra, porcentaje ni indicador medible.', A: 'Sin detalles de recursos o alcance, no se puede determinar si es alcanzable.', R: 'Sí es relevante: el clima laboral es un problema organizacional legítimo.', T: 'No define ningún plazo o fecha límite.' } },
            2: { correct: ['S','M','A','R','T'], explanations: { S: 'Define área (comercial), acción (reducir rotación) y medio (incentivos no monetarios).', M: 'Incluye un indicador claro: 20% de reducción.', A: 'Un programa de incentivos no monetarios es viable con recursos moderados.', R: 'La rotación de personal impacta directamente la productividad y costos.', T: 'Tiene plazo definido: primer semestre de 2026.' } },
            3: { correct: ['R'], explanations: { S: 'No precisa qué personal, qué habilidades ni cómo se hará.', M: 'No incluye porcentaje, cifra ni indicador de éxito.', A: 'Sin alcance definido no se puede evaluar viabilidad.', R: 'Sí es relevante: las habilidades blandas impactan la productividad.', T: '"En algún momento del próximo año" es vago, no es un plazo concreto.' } },
            4: { correct: ['S','M','A','R','T'], explanations: { S: 'Define qué (evaluación 360°), quién (cargos directivos), dónde (E.S.E. Hospital San Jerónimo).', M: 'Incluye indicador: 100% de los cargos directivos.', A: 'Un piloto para cargos directivos es un alcance manejable.', R: 'La evaluación de desempeño es clave en gestión del talento humano.', T: 'Tiene plazo: antes de octubre de 2026.' } }
        };

        window.evaluateSmart = function() {
            let totalCorrect = 0;
            let totalPossible = 0;

            Object.keys(smartAnswers).forEach(objId => {
                const answer = smartAnswers[objId];
                const card = document.querySelector(`.smart-obj-card[data-obj="${objId}"]`);
                const feedbackDiv = card.querySelector('.smart-obj-feedback');
                const checkboxes = card.querySelectorAll('.smart-check');

                let html = '<div class="space-y-1">';
                let objCorrect = 0;

                checkboxes.forEach(cb => {
                    const criteria = cb.dataset.criteria;
                    const isChecked = cb.checked;
                    const shouldBeChecked = answer.correct.includes(criteria);
                    const isRight = isChecked === shouldBeChecked;

                    if (isRight) { objCorrect++; totalCorrect++; }
                    totalPossible++;

                    const icon = isRight ? '✅' : '❌';
                    const label = cb.parentElement;
                    label.style.borderColor = isRight ? 'var(--accent)' : '#dc2626';
                    label.style.background = isRight ? '#f0fdf4' : '#fef2f2';

                    html += `<p class="text-xs"><span>${icon} <strong>${criteria}</strong>:</span> ${answer.explanations[criteria]}</p>`;
                });

                html += `<p class="mt-2 text-xs font-bold" style="color: ${objCorrect === 5 ? 'var(--accent)' : objCorrect >= 3 ? '#d97706' : '#dc2626'};">${objCorrect}/5 aciertos</p>`;
                html += '</div>';

                card.style.borderColor = objCorrect === 5 ? 'var(--accent)' : objCorrect >= 3 ? '#d97706' : '#dc2626';
                feedbackDiv.innerHTML = html;
                feedbackDiv.classList.remove('hidden');
            });

            const summary = document.getElementById('smart-summary');
            const pct = Math.round((totalCorrect / totalPossible) * 100);
            let msg = '';
            if (pct >= 90) msg = '¡Excelente! Dominas la metodología SMART para formular objetivos de intervención.';
            else if (pct >= 70) msg = 'Buen desempeño. Revisa las retroalimentaciones para afinar tu comprensión.';
            else msg = 'Necesitas repasar los criterios SMART. Revisa cada retroalimentación con atención.';

            summary.innerHTML = `
                <p class="text-lg font-bold" style="color: var(--heading);">Resultado: ${totalCorrect}/${totalPossible} aciertos (${pct}%)</p>
                <div class="w-full h-3 rounded-full bg-gray-200 mt-3 overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-500" style="width: ${pct}%; background: ${pct >= 90 ? 'var(--accent)' : pct >= 70 ? '#d97706' : '#dc2626'};"></div>
                </div>
                <p class="mt-3 text-sm font-semibold" style="color: ${pct >= 90 ? 'var(--accent)' : pct >= 70 ? '#d97706' : '#dc2626'};">${msg}</p>
            `;
            summary.classList.remove('hidden');
        }

        window.clearSmart = function() {
            document.querySelectorAll('.smart-check').forEach(cb => cb.checked = false);
            document.querySelectorAll('.smart-obj-card').forEach(card => {
                card.style.borderColor = 'var(--line)';
                const fb = card.querySelector('.smart-obj-feedback');
                fb.classList.add('hidden');
                fb.innerHTML = '';
                card.querySelectorAll('label').forEach(l => { l.style.borderColor = 'var(--line)'; l.style.background = 'white'; });
            });
            document.getElementById('smart-summary').classList.add('hidden');
        }

        // ===== CANVAS EVP =====
        window.getEvpData = function() {
            const lines = [];
            lines.push('CANVAS DE PROPUESTA DE VALOR AL EMPLEADO (EVP)');
            lines.push('Gerencia de Talento Humano y Desarrollo Organizacional — Unidad 1, Tema 5');
            lines.push('Fecha: ' + new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }));
            lines.push('='.repeat(60));
            lines.push('');
            lines.push('PROBLEMA IDENTIFICADO:');
            lines.push(document.getElementById('evp-problem').value.trim() || 'Sin completar');
            lines.push('');
            lines.push('SOLUCIÓN PROPUESTA:');
            lines.push(document.getElementById('evp-solution').value.trim() || 'Sin completar');
            lines.push('');
            lines.push('BENEFICIARIOS:');
            lines.push(document.getElementById('evp-beneficiaries').value.trim() || 'Sin completar');
            lines.push('');
            lines.push('INDICADOR DE ÉXITO:');
            lines.push(document.getElementById('evp-indicator').value.trim() || 'Sin completar');
            lines.push('');
            lines.push('PLAZO DE EJECUCIÓN:');
            lines.push(document.getElementById('evp-timeline').value.trim() || 'Sin completar');
            lines.push('');
            lines.push('='.repeat(60));
            lines.push('Generado desde el OVA — Tema 5: Diseño de Proyectos');
            return lines;
        }

        window.toggleExportMenuEvp = function() {
            const menu = document.getElementById('export-menu-evp');
            menu.classList.toggle('hidden');
        }

        window.exportEvpToTxt = function() {
            const lines = window.getEvpData();
            const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = 'canvas_evp.txt'; a.click();
            URL.revokeObjectURL(url);
            document.getElementById('export-menu-evp').classList.add('hidden');
        }

        window.exportEvpToWord = function() {
            const lines = window.getEvpData();
            const htmlContent = `<html><head><meta charset='utf-8'><title>Canvas EVP</title></head><body style="font-family:Calibri,sans-serif;font-size:12pt;line-height:1.6;">${lines.map(l => l.startsWith('=') ? '<hr>' : l === '' ? '<br>' : `<p style="margin:4px 0;">${l}</p>`).join('')}</body></html>`;
            const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = 'canvas_evp.doc'; a.click();
            URL.revokeObjectURL(url);
            document.getElementById('export-menu-evp').classList.add('hidden');
        }

        window.clearEvp = function() {
            document.getElementById('evp-problem').value = '';
            document.getElementById('evp-solution').value = '';
            document.getElementById('evp-beneficiaries').value = '';
            document.getElementById('evp-indicator').value = '';
            document.getElementById('evp-timeline').value = '';
        }

        // Cerrar menus de exportar al hacer click fuera
        document.addEventListener('click', (e) => {
            const smartMenu = document.getElementById('export-menu-smart');
            const evpMenu = document.getElementById('export-menu-evp');
            if (smartMenu && !e.target.closest('#export-dropdown-smart')) smartMenu.classList.add('hidden');
            if (evpMenu && !e.target.closest('#export-dropdown-evp')) evpMenu.classList.add('hidden');
        });

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

// Canvas EVP: de 2 en 2.
document.addEventListener('DOMContentLoaded', function () {
  pantallasDeDosEnLista(document.querySelector('#act-evp .space-y-5'), { aplanar: '.grid' });
});

// Evaluador SMART: 2 objetivos por pantalla.
document.addEventListener('DOMContentLoaded', function () {
  pantallasDeDosPorHijos(document.getElementById('smart-objectives'));
});
