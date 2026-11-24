/* Interacciones del OVA gthdo-pdi-u03-t05. */


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

        // Quiz - Preguntas acotadas del Tema 5
        const quizData = [
            {
                q: "¿Cuál de los siguientes es un principio ético de la UNESCO para el uso de la IA en talento humano?",
                options: [
                    "Maximizar la velocidad de contratación sin importar el método",
                    "Ocultar a los candidatos que se usa IA en la selección",
                    "Reducir costos de personal eliminando todas las revisiones humanas",
                    "Supervisión humana — garantizar intervención humana en decisiones automatizadas"
                ],
                correct: 3,
                explicaciones: ["No es la respuesta. La UNESCO no prioriza la velocidad: pide que la IA respete la dignidad y los derechos de las personas.", "No es la respuesta. La transparencia es un principio ético: los candidatos deben saber que se usa IA.", "No es la respuesta. Eliminar las revisiones humanas va en contra del principio de supervisión humana.", "Correcto. La supervisión humana es un principio de la UNESCO: siempre debe haber intervención humana en las decisiones automatizadas."]
            },
            {
                q: "¿Qué herramienta permite comparar los beneficios sociales y ambientales frente a los costos financieros, asignando un valor monetario al impacto?",
                options: [
                    "SROI (Social Return on Investment)",
                    "ROI tradicional únicamente",
                    "Encuesta de clima laboral",
                    "Matriz de stakeholders"
                ],
                correct: 0,
                explicaciones: ["Correcto. El SROI (retorno social de la inversión) asigna un valor monetario al impacto social y ambiental para compararlo con los costos.", "No es la respuesta. El ROI tradicional mide solo el retorno financiero, sin el impacto social o ambiental.", "No es la respuesta. La encuesta de clima laboral mide percepciones internas, no el retorno social de una inversión.", "No es la respuesta. La matriz de stakeholders identifica grupos de interés; no mide el impacto en dinero."]
            },
            {
                q: "¿Qué significa que un indicador de impacto sea SMART?",
                options: [
                    "Solo medible con datos financieros",
                    "Específico, medible, alcanzable, relevante y con tiempo definido",
                    "Social, monetario, amplio, recurrente y temporal",
                    "Subjetivo, manual, anual, revisable y teórico"
                ],
                correct: 1,
                explicaciones: ["No es la respuesta. Un indicador SMART no tiene que ser financiero.", "Correcto. SMART significa específico, medible, alcanzable, relevante y con tiempo definido.", "No es la respuesta. Esas palabras no corresponden a la sigla SMART.", "No es la respuesta. Un indicador SMART es lo opuesto: objetivo, medible y con plazo claro."]
            },
            {
                q: "¿Cuál es el propósito de las plataformas ESG en la rendición de cuentas organizacional?",
                options: [
                    "Reemplazar completamente el juicio humano en decisiones estratégicas",
                    "Eliminar la necesidad de comunicar resultados a los stakeholders",
                    "Recopilar, estructurar y reportar datos ambientales, sociales y de gobernanza para cumplir normativas y mejorar el impacto",
                    "Almacenar únicamente información financiera de la empresa"
                ],
                correct: 2,
                explicaciones: ["No es la respuesta. Las plataformas ESG apoyan el juicio humano; no lo reemplazan.", "No es la respuesta. Las plataformas ESG sirven justamente para comunicar resultados a los stakeholders.", "Correcto. Las plataformas ESG recopilan, estructuran y reportan datos ambientales, sociales y de gobernanza para cumplir normas y mejorar el impacto.", "No es la respuesta. Las plataformas ESG manejan información ambiental, social y de gobernanza, no solo financiera."]
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
                const label = document.createElement('label');
                const selected = answers[currentQ] === i;
                label.className = `quiz-option w-full text-left border rounded-lg p-4 transition-all ${selected ? 'border-[var(--accent)] bg-[var(--surface-soft)]' : 'border-[var(--line)] hover:bg-[var(--surface-soft)]'}`;
                const input = document.createElement('input');
                input.type = 'radio';
                input.name = 'quiz-option';
                input.value = i;
                input.checked = selected;
                input.addEventListener('change', () => { answers[currentQ] = i; renderQuiz(); });
                const span = document.createElement('span');
                span.className = 'font-semibold';
                span.textContent = `${String.fromCharCode(65+i)}. `;
                label.appendChild(input);
                label.appendChild(span);
                label.appendChild(document.createTextNode(opt));
                opts.appendChild(label);
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
        document.getElementById('quiz-restart').addEventListener('click', () => { currentQ = 0; answers = []; quizBox.classList.remove('hidden'); quizSummary.classList.add('hidden'); renderQuiz(); document.getElementById('evaluacion').scrollIntoView({ behavior: 'smooth', block: 'start' }); });

        // ===== PESTAÑAS DE ACTIVIDADES =====
        document.querySelectorAll('.act-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.act-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.act-panel').forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(tab.dataset.actTarget).classList.add('active');
            });
        });

        // ===== UTILIDAD: SCROLL AL TOPE DE ACTIVIDAD =====
        function scrollToActividad() {
            const panel = document.querySelector('.act-panel.active');
            if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // ===== ACTIVIDAD 1: AUDITORÍA DE IA =====
        const casosSituaciones = [
            {
                empresa: 'Selección de personal — Decisión automatizada sin intervención humana',
                situacion: 'Un algoritmo descarta automáticamente hojas de vida sin que un profesional de talento humano revise el motivo. Los candidatos no pueden apelar ni saber por qué fueron rechazados.',
                correcta: 'supervision',
                opciones: [
                    { valor: 'transparencia', etiqueta: 'Transparencia — informar claramente que se usa IA y cómo' },
                    { valor: 'privacidad', etiqueta: 'Privacidad — proteger los datos personales de los candidatos' },
                    { valor: 'supervision', etiqueta: 'Supervisión humana — garantizar intervención humana en decisiones automatizadas' },
                    { valor: 'explicabilidad', etiqueta: 'Explicabilidad — entender por qué la IA tomó una decisión' },
                    { valor: 'inocuidad', etiqueta: 'Inocuidad — evitar daños, sesgos o discriminación' }
                ],
                explicacion: 'Correcto: es Supervisión humana. La UNESCO exige que una persona pueda intervenir, revisar y apelar decisiones automatizadas que afecten derechos laborales.'
            },
            {
                empresa: 'Evaluación de desempeño — Modelo opaco',
                situacion: 'El sistema de evaluación de desempeño asigna puntuaciones a los empleados, pero ni los evaluados ni los gerentes comprenden qué variables ponderó el modelo para llegar a esos resultados.',
                correcta: 'explicabilidad',
                opciones: [
                    { valor: 'transparencia', etiqueta: 'Transparencia — informar claramente que se usa IA y cómo' },
                    { valor: 'privacidad', etiqueta: 'Privacidad — proteger los datos personales de los candidatos' },
                    { valor: 'supervision', etiqueta: 'Supervisión humana — garantizar intervención humana en decisiones automatizadas' },
                    { valor: 'explicabilidad', etiqueta: 'Explicabilidad — entender por qué la IA tomó una decisión' },
                    { valor: 'inocuidad', etiqueta: 'Inocuidad — evitar daños, sesgos o discriminación' }
                ],
                explicacion: 'Correcto: es Explicabilidad. Se debe poder entender e interpretar las razones detrás de una decisión automatizada, especialmente si afecta la carrera de una persona.'
            },
            {
                empresa: 'Reclutamiento — Sesgo histórico en los datos',
                situacion: 'Un algoritmo de selección fue entrenado con datos históricos donde la mayoría de los contratados eran hombres jóvenes. El sistema comienza a penalizar automáticamente perfiles de mujeres mayores de 40 años.',
                correcta: 'inocuidad',
                opciones: [
                    { valor: 'transparencia', etiqueta: 'Transparencia — informar claramente que se usa IA y cómo' },
                    { valor: 'privacidad', etiqueta: 'Privacidad — proteger los datos personales de los candidatos' },
                    { valor: 'supervision', etiqueta: 'Supervisión humana — garantizar intervención humana en decisiones automatizadas' },
                    { valor: 'explicabilidad', etiqueta: 'Explicabilidad — entender por qué la IA tomó una decisión' },
                    { valor: 'inocuidad', etiqueta: 'Inocuidad — evitar daños, sesgos o discriminación' }
                ],
                explicacion: 'Correcto: es Inocuidad. Los sistemas de IA no deben causar daño, reproducir sesgos históricos ni discriminar a grupos vulnerables.'
            },
            {
                empresa: 'Aplicación de empleo — Datos sensibles sin consentimiento',
                situacion: 'La plataforma de selección solicita a los candidatos información sobre su estado de salud, religión y vida familiar, sin explicar para qué se usarán ni obtener un consentimiento explícito.',
                correcta: 'privacidad',
                opciones: [
                    { valor: 'transparencia', etiqueta: 'Transparencia — informar claramente que se usa IA y cómo' },
                    { valor: 'privacidad', etiqueta: 'Privacidad — proteger los datos personales de los candidatos' },
                    { valor: 'supervision', etiqueta: 'Supervisión humana — garantizar intervención humana en decisiones automatizadas' },
                    { valor: 'explicabilidad', etiqueta: 'Explicabilidad — entender por qué la IA tomó una decisión' },
                    { valor: 'inocuidad', etiqueta: 'Inocuidad — evitar daños, sesgos o discriminación' }
                ],
                explicacion: 'Correcto: es Privacidad. La recolección de datos sensibles requiere consentimiento informado, finalidad legítima y protección adecuada de la información personal.'
            },
            {
                empresa: 'Onboarding digital — Uso de IA sin notificación',
                situacion: 'La empresa utiliza un asistente virtual de IA para orientar a los nuevos empleados, pero no informa que sus conversaciones son analizadas por un sistema automatizado ni quién tiene acceso a esos registros.',
                correcta: 'transparencia',
                opciones: [
                    { valor: 'transparencia', etiqueta: 'Transparencia — informar claramente que se usa IA y cómo' },
                    { valor: 'privacidad', etiqueta: 'Privacidad — proteger los datos personales de los candidatos' },
                    { valor: 'supervision', etiqueta: 'Supervisión humana — garantizar intervención humana en decisiones automatizadas' },
                    { valor: 'explicabilidad', etiqueta: 'Explicabilidad — entender por qué la IA tomó una decisión' },
                    { valor: 'inocuidad', etiqueta: 'Inocuidad — evitar daños, sesgos o discriminación' }
                ],
                explicacion: 'Correcto: es Transparencia. Las personas tienen derecho a saber cuándo interactúan con un sistema de IA, para qué se usan sus datos y quién tiene acceso a ellos.'
            }
        ];
        let casoStep = 0;
        let casoResultados = [];

        function renderCasoCard() {
            const c = casosSituaciones[casoStep];
            const card = document.getElementById('caso-card'); if (!card) return;
            const ya = casoResultados[casoStep];
            const opcionesHtml = c.opciones.map(op =>
                `<label class="flex items-start gap-2 cursor-pointer p-3 rounded-lg border transition-colors ${ya ? (op.valor === c.correcta ? 'border-green-500 bg-green-50' : (op.valor === ya.seleccion && op.valor !== c.correcta ? 'border-red-400 bg-red-50' : 'border-gray-200')) : 'border-gray-200 hover:border-gray-400'}" style="${ya ? 'cursor:default;' : ''}">
                    <input type="radio" name="caso-opcion" value="${op.valor}" ${ya ? 'disabled' : ''} ${ya && ya.seleccion === op.valor ? 'checked' : ''} class="mt-0.5 flex-shrink-0">
                    <span class="text-sm leading-snug">${op.etiqueta}</span>
                </label>`
            ).join('');
            const fbHtml = ya ? `<div class="mt-4 p-3 rounded-lg text-xs leading-relaxed ${ya.correcto ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}" style="border:1px solid ${ya.correcto ? '#86efac' : '#fca5a5'}">
                <p class="font-bold mb-1">${ya.correcto ? '✅ Correcto' : '❌ Incorrecto'}</p>
                <p>${c.explicacion}</p>
            </div>` : '';
            card.innerHTML = `
                <p class="text-xs font-bold uppercase tracking-widest mb-1" style="color:var(--accent)">${c.empresa}</p>
                <p class="text-sm leading-relaxed mb-4" style="color:var(--text)">${c.situacion}</p>
                <p class="text-xs font-bold mb-2" style="color:var(--heading)">¿A qué categoría corresponde esta situación?</p>
                <div class="space-y-2">${opcionesHtml}</div>
                ${fbHtml}`;
            const paso = document.getElementById('caso-paso-label'); if (paso) paso.textContent = 'Caso ' + (casoStep + 1) + ' de ' + casosSituaciones.length;
            const bar = document.getElementById('caso-progress-bar'); if (bar) bar.style.width = ((casoStep + 1) / casosSituaciones.length * 100) + '%';
            const correctas = casoResultados.filter(r => r && r.correcto).length;
            const respondidas = casoResultados.filter(Boolean).length;
            const mini = document.getElementById('caso-score-mini'); if (mini) mini.textContent = correctas + ' / ' + respondidas + ' correctas';
            const btnVerif = document.getElementById('caso-btn-verificar'); if (btnVerif) btnVerif.classList.toggle('hidden', !!ya);
            const btnNext = document.getElementById('caso-btn-next'); if (btnNext) btnNext.classList.toggle('hidden', !ya || casoStep === casosSituaciones.length - 1);
            const btnPrev = document.getElementById('caso-btn-prev'); if (btnPrev) btnPrev.classList.toggle('hidden', casoStep === 0);
            if (ya && casoStep === casosSituaciones.length - 1 && casoResultados.filter(Boolean).length === casosSituaciones.length) mostrarResultadoCaso();
        }

        function verificarCaso() {
            const seleccionado = document.querySelector('input[name="caso-opcion"]:checked');
            if (!seleccionado) { alert('Selecciona una opción antes de verificar.'); return; }
            const correcto = seleccionado.value === casosSituaciones[casoStep].correcta;
            casoResultados[casoStep] = { seleccion: seleccionado.value, correcto };
            renderCasoCard();
        }

        function pasoCaso(dir) {
            casoStep = Math.max(0, Math.min(casosSituaciones.length - 1, casoStep + dir));
            const rg = document.getElementById('caso-resultado-global'); if (rg) rg.classList.add('hidden');
            renderCasoCard();
        }

        function mostrarResultadoCaso() {
            const correctas = casoResultados.filter(r => r && r.correcto).length;
            const total = casosSituaciones.length;
            const pct = Math.round((correctas / total) * 100);
            const nivel = pct === 100 ? '🟢 Excelente — dominas los principios éticos de la UNESCO para la IA' : pct >= 60 ? '🟡 Bien encaminado — revisa los principios de transparencia, privacidad, supervisión, explicabilidad e inocuidad' : '🔴 En proceso — vuelve al Contenido para reforzar la ética digital y la IA';
            const rg = document.getElementById('caso-resultado-global'); if (!rg) return;
            rg.innerHTML = `<p class="font-extrabold text-lg mb-1" style="color:var(--heading)">Resultado del análisis</p><p class="text-4xl font-black my-2" style="color:var(--accent)">${pct}%</p><p class="text-sm">${correctas} de ${total} casos identificados correctamente</p><p class="mt-3 font-semibold">${nivel}</p>`;
            rg.classList.remove('hidden');
        }

        function reiniciarCaso() {
            casoStep = 0; casoResultados = [];
            const rg = document.getElementById('caso-resultado-global'); if (rg) { rg.innerHTML = ''; rg.classList.add('hidden'); }
            renderCasoCard();
            scrollToActividad();
        }

        // ===== ACTIVIDAD 2: MAPA DE STAKEHOLDERS =====
        function initStakeholders() {
            const chips = document.querySelectorAll('.stakeholder-chip');
            const zones = document.querySelectorAll('.stakeholder-zone');
            const pool = document.getElementById('stakeholders-pool');
            let draggedEl = null;

            chips.forEach(chip => {
                chip.addEventListener('dragstart', (e) => {
                    draggedEl = chip;
                    chip.classList.add('dragging');
                    e.dataTransfer.setData('text/plain', chip.dataset.stakeholder);
                });
                chip.addEventListener('dragend', () => {
                    chip.classList.remove('dragging');
                    draggedEl = null;
                    zones.forEach(z => z.classList.remove('drag-over'));
                });
                chip.addEventListener('click', () => {
                    // Fallback táctil: si está en el pool, mover a la zona con menos fichas; si está en zona, volver al pool
                    if (chip.parentElement.id === 'stakeholders-pool') {
                        const zoneContents = document.querySelectorAll('.zone-content');
                        let min = null;
                        zoneContents.forEach(zc => { if (!min || zc.children.length < min.children.length) min = zc; });
                        if (min) min.appendChild(chip);
                    } else if (chip.parentElement.classList.contains('zone-content')) {
                        pool.appendChild(chip);
                    }
                });
            });

            zones.forEach(zone => {
                zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('drag-over'); });
                zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
                zone.addEventListener('drop', (e) => {
                    e.preventDefault();
                    zone.classList.remove('drag-over');
                    if (draggedEl) {
                        zone.querySelector('.zone-content').appendChild(draggedEl);
                    }
                });
            });

            pool.addEventListener('dragover', (e) => { e.preventDefault(); pool.classList.add('drag-over'); });
            pool.addEventListener('dragleave', () => pool.classList.remove('drag-over'));
            pool.addEventListener('drop', (e) => {
                e.preventDefault();
                pool.classList.remove('drag-over');
                if (draggedEl) pool.appendChild(draggedEl);
            });
        }

        function verificarStakeholders() {
            const zones = document.querySelectorAll('.stakeholder-zone');
            let correctas = 0;
            let total = 0;
            let feedback = [];
            zones.forEach(zone => {
                zone.classList.remove('correct-zone', 'incorrect-zone');
                const zoneId = zone.dataset.zone;
                const chips = zone.querySelectorAll('.stakeholder-chip');
                let zoneCorrect = true;
                chips.forEach(chip => {
                    total++;
                    if (chip.dataset.correct === zoneId) {
                        correctas++;
                    } else {
                        zoneCorrect = false;
                        feedback.push(`<span style="color:#ef4444">❌ ${chip.textContent}</span> debería estar en <strong>${zoneLabel(chip.dataset.correct)}</strong>.`);
                    }
                });
                if (chips.length > 0 && zoneCorrect) zone.classList.add('correct-zone');
                if (chips.length > 0 && !zoneCorrect) zone.classList.add('incorrect-zone');
            });

            const pool = document.getElementById('stakeholders-pool');
            const pendientes = pool.querySelectorAll('.stakeholder-chip').length;

            const fb = document.getElementById('stakeholder-feedback');
            if (pendientes > 0) {
                fb.innerHTML = `<p class="font-bold mb-2">⚠️ Faltan ${pendientes} stakeholder(s) por ubicar.</p><p>Arrastra todos los elementos antes de verificar.</p>`;
                fb.classList.remove('hidden');
                return;
            }

            const pct = Math.round((correctas / total) * 100);
            let mensaje = `<p class="font-bold mb-2">Resultado: ${correctas} de ${total} correctas (${pct}%)</p>`;
            if (pct === 100) mensaje += `<p>🟢 Excelente — identificaste bien el poder e interés de cada grupo.</p>`;
            else if (pct >= 60) mensaje += `<p>🟡 Bien encaminado — revisa los grupos que tienen alto poder o alto interés.</p>`;
            else mensaje += `<p>🔴 En proceso — vuelve al contenido y repasa la matriz de stakeholders.</p>`;
            if (feedback.length > 0) mensaje += `<div class="mt-2 space-y-1">${feedback.join('')}</div>`;
            fb.innerHTML = mensaje;
            fb.classList.remove('hidden');
        }

        function zoneLabel(zoneId) {
            return {
                'alto-poder-alto-interes': 'Alto poder / Alto interés',
                'alto-poder-bajo-interes': 'Alto poder / Bajo interés',
                'bajo-poder-alto-interes': 'Bajo poder / Alto interés',
                'bajo-poder-bajo-interes': 'Bajo poder / Bajo interés'
            }[zoneId] || zoneId;
        }

        function reiniciarStakeholders() {
            const pool = document.getElementById('stakeholders-pool');
            document.querySelectorAll('.stakeholder-chip').forEach(chip => {
                pool.appendChild(chip);
            });
            document.querySelectorAll('.stakeholder-zone').forEach(zone => zone.classList.remove('correct-zone', 'incorrect-zone'));
            const fb = document.getElementById('stakeholder-feedback');
            if (fb) { fb.innerHTML = ''; fb.classList.add('hidden'); }
            scrollToActividad();
        }

        // ===== FLIP CARDS Y DOMContentLoaded =====
        document.addEventListener('DOMContentLoaded', function() {
            const flipCards = document.querySelectorAll('.flip-card');
            flipCards.forEach(card => {
                card.addEventListener('click', function() {
                    this.classList.toggle('flipped');
                });
            });

            renderCasoCard();
            renderQuiz();
            initStakeholders();
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
