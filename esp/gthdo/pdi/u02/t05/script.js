/* Interacciones del OVA gthdo-pdi-u02-t05. */


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
                q: "Según la Guía 5, ¿de dónde proviene principalmente la autoridad del consultor de Desarrollo Organizacional?", 
                options: [
                    "De su posición jerárquica en la organización", 
                    "De su capacidad para imponer decisiones de cambio", 
                    "De su idoneidad, credibilidad y capacidad de influir", 
                    "De su dominio exclusivo de herramientas tecnológicas"
                ], 
                correct: 2,
                explicaciones: ["No es la respuesta. El consultor de DO normalmente no ocupa un cargo jerárquico en la organización cliente.", "No es la respuesta. El consultor no impone decisiones: acompaña a la organización para que ella misma decida.", "Correcto. Según la guía, la autoridad del consultor proviene de su idoneidad, su credibilidad y su capacidad de influir.", "No es la respuesta. La tecnología es una herramienta; no es la fuente de la autoridad del consultor."] 
            },
            { 
                q: "¿Cuáles son las tres dimensiones de saber que debe poseer un consultor competente según la Guía 5?", 
                options: [
                    "Saber dirigir, saber evaluar y saber informar", 
                    "Saber ser, saber hacer y saber conocer", 
                    "Saber escuchar, saber hablar y saber escribir", 
                    "Saber analizar, saber implementar y saber cerrar"
                ], 
                correct: 1,
                explicaciones: ["No es la respuesta. Dirigir, evaluar e informar son tareas, no las tres dimensiones del saber.", "Correcto. El consultor competente integra el saber ser (actitudes), el saber hacer (habilidades) y el saber conocer (conocimientos).", "No es la respuesta. Escuchar, hablar y escribir son habilidades de comunicación, no las tres dimensiones del saber.", "No es la respuesta. Analizar, implementar y cerrar se parecen a fases de un proceso, no a dimensiones del saber."] 
            },
            { 
                q: "En el proceso estructurado de consultoría, ¿qué fase corresponde a devolver los hallazgos de forma clara y asertiva para generar reflexión?", 
                options: [
                    "Entrada", 
                    "Diagnóstico", 
                    "Retroalimentación", 
                    "Terminación"
                ], 
                correct: 2,
                explicaciones: ["No es la respuesta. La entrada es el primer contacto y el acuerdo inicial con el cliente.", "No es la respuesta. En el diagnóstico se recogen y analizan los datos; los hallazgos se devuelven en la fase siguiente.", "Correcto. En la retroalimentación el consultor devuelve los hallazgos de forma clara y asertiva para generar reflexión en el cliente.", "No es la respuesta. La terminación es el cierre de la relación de consultoría."] 
            },
            { 
                q: "Según la Guía 5, a pesar del uso de Big Data e IA en la consultoría de DO, ¿dónde reside el valor real de la práctica profesional?", 
                options: [
                    "En la velocidad de procesamiento de datos", 
                    "En la empatía y la inteligencia emocional", 
                    "En la automatización de informes", 
                    "En la eliminación del juicio humano"
                ], 
                correct: 1,
                explicaciones: ["No es la respuesta. La velocidad de procesamiento la aportan la tecnología y la IA; el valor del consultor está en otro lugar.", "Correcto. Según la guía, aunque se usen Big Data e IA, el valor de la consultoría reside en la empatía y la inteligencia emocional.", "No es la respuesta. Automatizar informes es una ayuda operativa, no el valor central de la práctica.", "No es la respuesta. La guía defiende el juicio humano; no propone eliminarlo."] 
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

        // ===== PESTAÑAS DE ACTIVIDADES =====
        document.querySelectorAll('.act-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.act-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.act-panel').forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(tab.dataset.actTarget).classList.add('active');
            });
        });

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

        // ===== ACTIVIDAD 1: CASO DE CONSULTORÍA =====
        const argyrisFields = [
            { id: 'argyris-caso', label: 'Caso a analizar', max: 500, placeholder: 'Describe la organización, el área y la situación que requiere intervención de consultoría...', rows: 4 },
            { id: 'argyris-simple', label: 'Rol del consultor y tipo de intervención', max: 300, placeholder: '¿Es consultor externo o interno? ¿Qué rol desempeña (facilitador, agente de cambio, educador)?', rows: 3 },
            { id: 'argyris-doble', label: 'Competencias identificadas (saber ser, hacer, conocer)', max: 300, placeholder: '¿Qué competencias del consultor se ponen en juego en este caso? Clasifícalas según los tres saberes.', rows: 3 },
            { id: 'argyris-defensivas', label: 'Dilema ético o conflicto detectado', max: 300, placeholder: '¿Qué tensión ética, profesional o de relación consultor-cliente aparece en el caso?', rows: 3 },
            { id: 'argyris-intervencion', label: 'Propuesta de intervención', max: 400, placeholder: '¿Qué acciones propone el consultor para acompañar el cambio de forma ética y efectiva?', rows: 3 }
        ];

        function renderArgyrisForm() {
            const container = document.getElementById('argyris-form-container');
            if (!container) return;
            container.innerHTML = argyrisFields.map(f => `
                <div class="mb-4">
                    <label class="block text-sm font-bold mb-2" style="color: var(--heading)">${f.label}</label>
                    <textarea id="${f.id}" rows="${f.rows}" maxlength="${f.max}" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2" style="border-color: var(--line);" placeholder="${f.placeholder}"></textarea>
                    <div class="mt-1 flex items-center gap-2">
                        <span class="text-xs font-semibold" style="color: var(--heading);" data-counter-for="${f.id}">0/${f.max}</span>
                        <div class="w-24 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                            <div class="h-full rounded-full transition-all duration-300" style="width: 0%; background: var(--accent);" data-progress-for="${f.id}"></div>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        function initArgyrisCounters() {
            argyrisFields.forEach(f => {
                const field = document.getElementById(f.id);
                if (field) {
                    field.addEventListener('input', () => updateCounter(f.id));
                    updateCounter(f.id);
                }
            });
        }

        function getArgyrisData() {
            const data = {};
            argyrisFields.forEach(f => data[f.id] = document.getElementById(f.id)?.value || '');
            return data;
        }

        function validarArgyris() {
            const d = getArgyrisData();
            return argyrisFields.filter(f => !d[f.id].trim()).map(f => f.label);
        }

        function generarPromptArgyris() {
            const missing = validarArgyris();
            if (missing.length > 0) {
                alert('Por favor complete todos los campos antes de generar el prompt:\n\n• ' + missing.join('\n• '));
                return;
            }
            const d = getArgyrisData();
            const prompt = `Actúa como un consultor senior en Desarrollo Organizacional con amplia experiencia en intervenciones éticas y efectivas. A continuación te comparto un caso analizado por un estudiante. Revisa la propuesta y da retroalimentación constructiva, profesional y didáctica.

Caso a analizar:
---
${d['argyris-caso']}
---

Rol del consultor y tipo de intervención:
${d['argyris-simple']}

Competencias identificadas (saber ser, hacer, conocer):
${d['argyris-doble']}

Dilema ético o conflicto detectado:
${d['argyris-defensivas']}

Propuesta de intervención:
${d['argyris-intervencion']}

Por favor responde con:
1. Evaluación general del análisis.
2. ¿El rol del consultor está bien caracterizado como agente de cambio y facilitador?
3. ¿Las competencias identificadas se alinean con los tres saberes (ser, hacer, conocer)?
4. ¿El dilema ético o conflicto es realista y pertinente para la práctica profesional?
5. ¿La propuesta de intervención promueve una relación de confianza y cambio sostenible?
6. Preguntas o puntos que el estudiante debería revisar.`;
            const promptBox = document.getElementById('argyris-prompt');
            if (promptBox) promptBox.value = prompt;
            copiarPromptArgyris(prompt);
        }

        function copiarPromptArgyris(prompt) {
            const text = prompt || document.getElementById('argyris-prompt')?.value || '';
            if (!text) return;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(() => {
                    mostrarMensajeArgyris('Prompt copiado al portapapeles. Pégalo en Google Gemini para recibir la retroalimentación.');
                }).catch(() => {
                    mostrarMensajeArgyris('No se pudo copiar automáticamente. Copia el prompt del recuadro.');
                });
            } else {
                mostrarMensajeArgyris('Copia el prompt manualmente del recuadro.');
            }
        }

        function mostrarMensajeArgyris(msg) {
            const el = document.getElementById('argyris-message');
            if (el) {
                el.textContent = msg;
                el.classList.remove('hidden');
            }
        }

        function limpiarArgyris() {
            renderArgyrisForm();
            initArgyrisCounters();
            const promptBox = document.getElementById('argyris-prompt');
            if (promptBox) promptBox.value = '';
            const msg = document.getElementById('argyris-message');
            if (msg) {
                msg.textContent = '';
                msg.classList.add('hidden');
            }
        }

        // ===== ACTIVIDAD 2: FASES DEL PROCESO DE CONSULTORÍA =====
        const sengeDisciplines = [
            { key: 'entrada', label: 'Entrada', desc: 'Acuerdo inicial, definición del vínculo consultor-cliente y cuestionamiento del estado actual.' },
            { key: 'diagnostico', label: 'Diagnóstico', desc: 'Recolección y análisis de información para comprender el problema organizacional a profundidad.' },
            { key: 'retroalimentacion', label: 'Retroalimentación', desc: 'Devolución de hallazgos de forma clara y asertiva para generar reflexión en el cliente.' },
            { key: 'decisiones', label: 'Toma de decisiones', desc: 'Diseño y selección conjunta de intervenciones con el cliente y los actores clave.' },
            { key: 'terminacion', label: 'Terminación', desc: 'Cierre del proyecto, evaluación de resultados y aseguramiento de la sostenibilidad de los cambios.' }
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

            renderArgyrisForm();
            initArgyrisCounters();
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
