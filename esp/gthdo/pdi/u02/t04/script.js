/* Interacciones del OVA gthdo-pdi-u02-t04. */


        // Navegación sidebar
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                document.querySelectorAll('.content-pane').forEach(p => p.classList.remove('active'));
                document.getElementById(link.dataset.target).classList.add('active');
                
                // Inicializar quiz cuando se navega a evaluación
                if (link.dataset.target === 'evaluacion') {
                    setTimeout(() => {
                        renderQuiz();
                    }, 100);
                }
            });
        });

        // Mobile nav
        document.getElementById('mobile-nav').addEventListener('change', (e) => {
            document.querySelectorAll('.content-pane').forEach(p => p.classList.remove('active'));
            document.getElementById(e.target.value).classList.add('active');
        });

        // Acordeón
        document.querySelectorAll('.accordion-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const content = btn.nextElementSibling;
                content.classList.toggle('hidden');
                const icon = btn.querySelector('.fa-chevron-down');
                if (icon) icon.style.transform = content.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
            });
        });

        // Quiz - Preguntas acotadas según formato 088 y guía
        const quizData = [
            { 
                q: "Según Argyris y Schön, ¿qué distingue al aprendizaje de bucle doble del aprendizaje de bucle simple?", 
                options: [
                    "Ajusta la acción para cumplir la norma sin cuestionarla", 
                    "Reflexiona sobre los supuestos, objetivos y valores que generan el desajuste", 
                    "Se limita a corregir errores técnicos de forma inmediata", 
                    "Replica las rutinas defensivas de la organización"
                ], 
                correct: 1,
                explicaciones: ["No es la respuesta. Ajustar la acción para cumplir la norma sin cuestionarla describe el aprendizaje de bucle simple.", "Correcto. El bucle doble cuestiona los supuestos, objetivos y valores que originan el desajuste, no solo la acción.", "No es la respuesta. Corregir errores técnicos de forma inmediata es propio del bucle simple.", "No es la respuesta. Las rutinas defensivas bloquean el aprendizaje de bucle doble; no lo caracterizan."] 
            },
            { 
                q: "¿Qué son las rutinas defensivas en el aprendizaje organizacional?", 
                options: [
                    "Comportamientos diseñados para evitar incomodidad o conflicto, pero que perpetúan el error", 
                    "Protocolos formales para responder ante emergencias organizacionales", 
                    "Prácticas de mejora continua basadas en evidencia", 
                    "Rutinas de trabajo que garantizan la eficiencia operativa"
                ], 
                correct: 0,
                explicaciones: ["Correcto. Para Argyris, las rutinas defensivas evitan la incomodidad o el conflicto, pero impiden reconocer el error y por eso lo perpetúan.", "No es la respuesta. Los protocolos de emergencia son procedimientos formales, no rutinas defensivas.", "No es la respuesta. La mejora continua basada en evidencia favorece el aprendizaje; las rutinas defensivas lo frenan.", "No es la respuesta. Las rutinas defensivas no garantizan eficiencia: ocultan los problemas y los mantienen."] 
            },
            { 
                q: "Según Peter Senge, ¿cuál de las siguientes es una de las cinco disciplinas de una organización inteligente?", 
                options: [
                    "Pensamiento Sistémico", 
                    "Control de Calidad Total", 
                    "Gestión por Competencias", 
                    "Análisis de Puestos"
                ], 
                correct: 0,
                explicaciones: ["Correcto. El pensamiento sistémico es la quinta disciplina de Senge y la que integra a las demás.", "No es la respuesta. El control de calidad total es un enfoque de gestión de la calidad, no una de las cinco disciplinas.", "No es la respuesta. La gestión por competencias es un modelo de talento humano, no una disciplina de Senge.", "No es la respuesta. El análisis de puestos es una técnica de gestión humana, no una de las cinco disciplinas."] 
            }
        ];

        let currentQ = 0;
        let answers = [];
        const quizBox = document.getElementById('quiz-box');
        const quizSummary = document.getElementById('quiz-summary');

        function renderQuiz() {
            // Verificar que los elementos existan antes de renderizar
            const quizTitle = document.getElementById('quiz-title');
            const quizProgress = document.getElementById('quiz-progress');
            const quizText = document.getElementById('quiz-text');
            const quizOptions = document.getElementById('quiz-options');
            
            if (!quizTitle || !quizProgress || !quizText || !quizOptions) {
                console.log('Elementos del quiz no encontrados, reintentando...');
                setTimeout(renderQuiz, 100);
                return;
            }
            
            quizTitle.textContent = `Pregunta ${currentQ + 1}`;
            quizProgress.textContent = `${currentQ + 1}/${quizData.length}`;
            quizText.textContent = quizData[currentQ].q;
            const opts = document.getElementById('quiz-options');
            opts.innerHTML = '';
            quizData[currentQ].options.forEach((opt, i) => {
                const btn = document.createElement('button');
                btn.className = `quiz-option w-full text-left border rounded-lg p-4 transition-all ${answers[currentQ] === i ? 'border-[var(--accent)] bg-[var(--surface-soft)]' : 'border-[var(--line)] hover:bg-[var(--surface-soft)]'}`;
                btn.innerHTML = `<span class="font-semibold">${String.fromCharCode(65+i)}.</span> ${opt}`;
                btn.onclick = () => { answers[currentQ] = i; renderQuiz(); };
                opts.appendChild(btn);
            });
            document.getElementById('quiz-prev').disabled = currentQ === 0;
            document.getElementById('quiz-next').textContent = currentQ === quizData.length - 1 ? 'Finalizar' : 'Siguiente';
        }

        document.getElementById('quiz-next').addEventListener('click', () => {
            if (currentQ < quizData.length - 1) { currentQ++; renderQuiz(); }
            else {
                quizBox.classList.add('hidden');
                quizSummary.classList.remove('hidden');
                let correct = 0;
                let html = '';
                quizData.forEach((q, i) => {
                    const isCorrect = answers[i] === q.correct;
                    if (isCorrect) correct++;
                    html += `<div class="p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}"><p class="font-semibold">${i+1}. ${q.q}</p><p class="text-sm mt-2">Tu respuesta: ${String.fromCharCode(65+answers[i])}. ${q.options[answers[i]]}</p>${!isCorrect ? `<p class="text-sm mt-1 text-green-700">Correcta: ${String.fromCharCode(65+q.correct)}. ${q.options[q.correct]}</p>` : ''}${q.explicaciones ? `<p class="text-sm mt-2">${q.explicaciones[answers[i]]}</p>` : ''}</div>`;
                });
                html += `<p class="text-center font-bold text-lg mt-4">Puntuación: ${correct}/${quizData.length} (${Math.round(correct/quizData.length*100)}%)</p>`;
                document.getElementById('summary-content').innerHTML = html;
            }
        });

        document.getElementById('quiz-prev').addEventListener('click', () => { if (currentQ > 0) { currentQ--; renderQuiz(); } });
        document.getElementById('quiz-restart').addEventListener('click', () => { currentQ = 0; answers = []; quizBox.classList.remove('hidden'); quizSummary.classList.add('hidden'); renderQuiz(); });

        // ===== CONTADORES =====
        function updateCounter(fieldId) {
            const field = document.getElementById(fieldId);
            const counter = document.querySelector(`[data-counter-for="${fieldId}"]`);
            const progressBar = document.querySelector(`[data-progress-for="${fieldId}"]`);
            if (field && counter) {
                const currentLength = field.value.length;
                const maxLength = field.maxLength;
                counter.textContent = `${currentLength}/${maxLength}`;
                if (progressBar) {
                    progressBar.style.width = `${(currentLength / maxLength) * 100}%`;
                }
            }
        }

        // ===== ACTIVIDAD: CINCO DISCIPLINAS DE SENGE =====
        const sengeDisciplines = [
            { key: 'sistemico', label: 'Pensamiento Sistémico', desc: 'Busca ver la organización como un conjunto interrelacionado, donde las decisiones afectan al todo y no solo a una parte.' },
            { key: 'personal', label: 'Dominio Personal', desc: 'Cada persona clarifica su propósito, se compromete con el aprendizaje continuo y expande su capacidad de crear resultados.' },
            { key: 'mentales', label: 'Modelos Mentales', desc: 'Se examinan las suposiciones internas que guían la percepción y la acción, permitiendo corregir sesgos limitantes.' },
            { key: 'vision', label: 'Visión Compartida', desc: 'Construye un propósito común que alinea energías y compromisos hacia metas significativas para la organización.' },
            { key: 'equipo', label: 'Aprendizaje en Equipo', desc: 'Fomenta el diálogo reflexivo y la coordinación entre miembros para que el equipo aprenda más allá de la suma individual.' }
        ];

        let sengeAnswers = Array(sengeDisciplines.length).fill(null);
        let sengeSelectedKey = null;

        function renderSengeGame() {
            const labelsContainer = document.getElementById('senge-labels');
            const descContainer = document.getElementById('senge-descriptions');
            if (!labelsContainer || !descContainer) return;

            const assignedKeys = new Set(sengeAnswers.filter(k => k));
            labelsContainer.innerHTML = sengeDisciplines.map(d => {
                const isSelected = sengeSelectedKey === d.key;
                return `
                    <div class="senge-label px-3 py-2 rounded-lg border text-sm font-semibold cursor-move select-none transition-all duration-200 hover:shadow-md ${assignedKeys.has(d.key) ? 'hidden' : ''}" 
                         data-key="${d.key}" 
                         draggable="true"
                         style="${isSelected ? 'box-shadow: 0 0 0 2px #17a2b8;' : ''}">
                        ${d.label}
                    </div>
                `;
            }).join('');

            descContainer.innerHTML = sengeDisciplines.map((d, i) => {
                const assignedKey = sengeAnswers[i];
                const assignedLabel = assignedKey ? sengeDisciplines.find(s => s.key === assignedKey)?.label : null;
                return `
                    <div class="senge-dropzone p-3 rounded-lg border transition-all duration-200" data-index="${i}">
                        <div class="flex items-center gap-3">
                            <span class="senge-number flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white">${i + 1}</span>
                            <p class="text-sm flex-1">${d.desc}</p>
                            <div class="senge-slot min-w-[160px] min-h-[42px] rounded-lg border border-dashed flex items-center justify-center text-xs px-2 text-center transition-all duration-200" style="${sengeSelectedKey ? 'background: #f0f9ff; border-color: #17a2b8;' : ''}">
                                ${assignedLabel ? `<span class="senge-assigned text-sm font-semibold cursor-pointer" data-key="${assignedKey}" draggable="true">${assignedLabel}</span>` : '<span>Suelta aquí</span>'}
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            attachSengeEvents();
        }

        function attachSengeEvents() {
            const labelsContainer = document.getElementById('senge-labels');

            document.querySelectorAll('.senge-label').forEach(el => {
                el.addEventListener('dragstart', e => {
                    e.dataTransfer.setData('text/plain', el.dataset.key);
                    el.classList.add('opacity-50');
                });
                el.addEventListener('dragend', () => {
                    document.querySelectorAll('.senge-label').forEach(l => l.classList.remove('opacity-50'));
                });
                el.addEventListener('click', () => {
                    sengeSelectedKey = sengeSelectedKey === el.dataset.key ? null : el.dataset.key;
                    renderSengeGame();
                });
            });

            document.querySelectorAll('.senge-dropzone').forEach(zone => {
                const slot = zone.querySelector('.senge-slot');
                zone.addEventListener('dragover', e => {
                    e.preventDefault();
                    slot.style.borderColor = '#17a2b8';
                    slot.style.backgroundColor = '#D8EBF8';
                });
                zone.addEventListener('dragleave', () => {
                    slot.style.borderColor = '';
                    slot.style.backgroundColor = '';
                });
                zone.addEventListener('drop', e => {
                    e.preventDefault();
                    const key = e.dataTransfer.getData('text/plain');
                    assignSengeLabel(key, parseInt(zone.dataset.index));
                    slot.style.borderColor = '';
                    slot.style.backgroundColor = '';
                });
                zone.addEventListener('click', () => {
                    const index = parseInt(zone.dataset.index);
                    if (sengeSelectedKey) {
                        assignSengeLabel(sengeSelectedKey, index);
                    } else if (sengeAnswers[index]) {
                        removeSengeAssignment(sengeAnswers[index]);
                    }
                });
            });

            document.querySelectorAll('.senge-assigned').forEach(el => {
                el.addEventListener('dragstart', e => {
                    e.dataTransfer.setData('text/plain', el.dataset.key);
                    el.classList.add('opacity-50');
                });
                el.addEventListener('dragend', () => {
                    document.querySelectorAll('.senge-assigned').forEach(l => l.classList.remove('opacity-50'));
                });
                el.addEventListener('click', e => {
                    e.stopPropagation();
                    removeSengeAssignment(el.dataset.key);
                });
            });

            labelsContainer.addEventListener('dragover', e => e.preventDefault());
            labelsContainer.addEventListener('drop', e => {
                e.preventDefault();
                const key = e.dataTransfer.getData('text/plain');
                removeSengeAssignment(key);
            });
        }

        function assignSengeLabel(key, index) {
            sengeAnswers = sengeAnswers.map(k => k === key ? null : k);
            sengeAnswers[index] = key;
            sengeSelectedKey = null;
            renderSengeGame();
        }

        function removeSengeAssignment(key) {
            sengeAnswers = sengeAnswers.map(k => k === key ? null : k);
            sengeSelectedKey = null;
            renderSengeGame();
        }

        function initSengeGame() {
            sengeAnswers = Array(sengeDisciplines.length).fill(null);
            sengeSelectedKey = null;
            renderSengeGame();
        }

        function verificarSenge() {
            let correct = 0;
            let html = '';
            sengeDisciplines.forEach((d, i) => {
                const answer = sengeAnswers[i] || '';
                const isCorrect = answer === d.key;
                if (isCorrect) correct++;
                html += `<div class="p-3 rounded-lg mb-2 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}">
                    <p class="font-semibold text-sm">${i + 1}. ${d.desc}</p>
                    <p class="text-xs mt-1">Tu respuesta: ${answer ? sengeDisciplines.find(s => s.key === answer)?.label || answer : 'Sin respuesta'}</p>
                    ${!isCorrect ? `<p class="text-xs mt-1 text-green-700">Correcta: ${d.label}</p>` : ''}
                </div>`;
            });
            html += `<p class="text-center font-bold text-lg mt-3">Puntuación: ${correct}/${sengeDisciplines.length}</p>`;
            const result = document.getElementById('senge-result');
            result.innerHTML = html;
            result.classList.remove('hidden');
        }

        function reiniciarSenge() {
            initSengeGame();
            const result = document.getElementById('senge-result');
            result.innerHTML = '';
            result.classList.add('hidden');
        }

        // ===== FLIP CARDS Y DOMContentLoaded =====
        document.addEventListener('DOMContentLoaded', function() {
            const flipCards = document.querySelectorAll('.flip-card');
            flipCards.forEach(card => {
                card.addEventListener('click', function() {
                    this.classList.toggle('flipped');
                });
            });

            initSengeGame();
            renderQuiz();
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
