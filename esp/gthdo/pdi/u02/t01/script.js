/* Interacciones del OVA gthdo-pdi-u02-t01. */

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
                q: "Según Cummings y Worley, ¿cuál es el propósito fundamental de las intervenciones de Desarrollo Organizacional en el contexto actual?", 
                options: [
                    "Imponer soluciones externas sin considerar el contexto organizacional", 
                    "Facilitar un proceso de cambio sistémico que incremente la efectividad y el bienestar", 
                    "Mantener el status quo para evitar conflictos en la organización", 
                    "Reducir costos mediante despidos masivos y reestructuraciones"
                ], 
                correct: 1,
                explicaciones: ["No es la respuesta. El DO no impone soluciones externas: construye el cambio con la organización y a partir de su contexto.", "Correcto. Para Cummings y Worley, la intervención de DO facilita un cambio sistémico y planificado que mejora la efectividad de la organización y el bienestar de las personas.", "No es la respuesta. El DO busca transformar la organización, no conservar el statu quo para evitar conflictos.", "No es la respuesta. Los despidos masivos y la reducción de costos no son el propósito del DO, que se centra en el cambio sistémico y el bienestar."] 
            },
            { 
                q: "¿Qué relación existe entre la cultura ('software') y la estructura ('hardware') organizacional según la guía del Tema 1?", 
                options: [
                    "Son elementos independientes que pueden modificarse por separado", 
                    "La estructura siempre debe preceder a los cambios culturales", 
                    "Cambiar la estructura sin transformar las creencias compartidas es un ejercicio estéril", 
                    "Solo la cultura determina el éxito de las intervenciones organizacionales"
                ], 
                correct: 2,
                explicaciones: ["No es la respuesta. Cultura y estructura están interconectadas: modificar una sin la otra no produce un cambio sostenible.", "No es la respuesta. La guía no plantea que la estructura deba ir primero; insiste en que ambas cambien de forma articulada.", "Correcto. Según la guía, cambiar el «hardware» (estructura) sin transformar el «software» (creencias compartidas) es un ejercicio estéril.", "No es la respuesta. La cultura es clave, pero no actúa sola: la estructura también condiciona el éxito de la intervención."] 
            },
            { 
                q: "En las intervenciones culturales modernas para 2025, ¿qué enfoque se recomienda para transformar los valores organizacionales?", 
                options: [
                    "Imponer nuevos valores mediante comunicados directivos", 
                    "Utilizar narrativas compartidas y espacios de co-creación donde el colaborador sea protagonista", 
                    "Contratar consultores externos que definan la cultura sin participación interna", 
                    "Mantener los valores existentes para evitar resistencia al cambio"
                ], 
                correct: 1,
                explicaciones: ["No es la respuesta. Los comunicados directivos imponen valores, pero no logran que las personas los asuman como propios.", "Correcto. Las intervenciones culturales actuales se apoyan en narrativas compartidas y espacios de co-creación en los que el colaborador es protagonista.", "No es la respuesta. Una cultura definida desde afuera, sin participación interna, difícilmente se sostiene.", "No es la respuesta. Evitar la resistencia manteniendo los valores existentes impide la transformación que se busca."] 
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

        // ===== ACTIVIDAD 1: DRAG & DROP =====
        let draggedEl = null;
        const scenarioOrigins = {};

        document.querySelectorAll('.drag-card[draggable]').forEach(card => {
            card.addEventListener('dragstart', (e) => {
                draggedEl = card;
                card.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', card.id);
            });
            card.addEventListener('dragend', () => {
                card.classList.remove('dragging');
                draggedEl = null;
                document.querySelectorAll('.drop-zone').forEach(z => z.classList.remove('drag-over'));
            });
        });

        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('drag-over'); });
            zone.addEventListener('dragleave', () => { zone.classList.remove('drag-over'); });
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');
                if (!draggedEl) return;
                const content = zone.querySelector('.drop-zone-content');
                // Si ya hay una card en esta zona, devuélvela al origen
                const existing = content.querySelector('.drag-card');
                if (existing) {
                    existing.classList.remove('placed');
                    document.getElementById('drag-scenarios').appendChild(existing);
                }
                // Guardar origen y mover
                scenarioOrigins[draggedEl.id] = zone.dataset.method;
                draggedEl.classList.add('placed');
                draggedEl.classList.remove('correct', 'incorrect');
                content.appendChild(draggedEl);
            });
        });

        // También permitir devolver al origen haciendo clic
        document.getElementById('drag-scenarios')?.addEventListener('dragover', (e) => e.preventDefault());
        document.getElementById('drag-scenarios')?.addEventListener('drop', (e) => {
            e.preventDefault();
            if (!draggedEl) return;
            draggedEl.classList.remove('placed', 'correct', 'incorrect');
            delete scenarioOrigins[draggedEl.id];
            document.getElementById('drag-scenarios').appendChild(draggedEl);
        });

        function verifyDragDrop() {
            const feedback = document.getElementById('drag-feedback');
            const allCards = document.querySelectorAll('.drag-card[data-correct]');
            let correctCount = 0;
            const explanations = {
                'scenario-1': 'El sistema de nómina tiene requisitos legales fijos → Cascada es ideal para procesos secuenciales con requisitos definidos.',
                'scenario-2': 'El onboarding con feedback iterativo semanal → Ágiles permiten ajustar en cada sprint según retroalimentación.',
                'scenario-3': 'Involucrar colaboradores como co-investigadores → Investigación-Acción disuelve la brecha investigador/investigado.',
                'scenario-4': 'Plan maestro + sprints iterativos por área → Gestión Híbrida combina rigurosidad con flexibilidad.'
            };

            allCards.forEach(card => {
                const correctMethod = card.dataset.correct;
                const placedIn = scenarioOrigins[card.id];
                if (placedIn === correctMethod) {
                    card.classList.add('correct');
                    card.classList.remove('incorrect');
                    correctCount++;
                } else if (placedIn) {
                    card.classList.add('incorrect');
                    card.classList.remove('correct');
                }
            });

            let html = `<p class="font-bold mb-3" style="color: var(--heading);">Resultado: ${correctCount}/4 correctas</p>`;
            allCards.forEach(card => {
                const isCorrect = scenarioOrigins[card.id] === card.dataset.correct;
                html += `<div class="mt-2 p-3 rounded-lg text-xs ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}">
                    <span class="font-bold">${card.querySelector('.font-bold').textContent}:</span> ${explanations[card.id]}
                    ${isCorrect ? '<span class="text-green-600 font-bold ml-1">✓</span>' : '<span class="text-red-600 font-bold ml-1">✗</span>'}
                </div>`;
            });

            feedback.innerHTML = html;
            feedback.classList.remove('hidden');
            feedback.style.background = correctCount === 4 ? '#f0fdf4' : '#fffbeb';
            feedback.style.border = correctCount === 4 ? '1px solid #bbf7d0' : '1px solid #fde68a';
        }

        function resetDragDrop() {
            const container = document.getElementById('drag-scenarios');
            document.querySelectorAll('.drag-card[data-correct]').forEach(card => {
                card.classList.remove('placed', 'correct', 'incorrect');
                container.appendChild(card);
            });
            document.querySelectorAll('.drop-zone-content').forEach(c => c.innerHTML = '');
            document.getElementById('drag-feedback').classList.add('hidden');
            Object.keys(scenarioOrigins).forEach(k => delete scenarioOrigins[k]);
        }

        // ===== ACTIVIDAD 2: MINI-PROPUESTA =====
        // Contadores de caracteres
        ['prop-name', 'prop-justification', 'prop-objective', 'prop-governance'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', () => {
                    const len = el.value.length;
                    const max = el.getAttribute('maxlength');
                    const counter = document.querySelector(`[data-counter-for="${id}"]`);
                    const progress = document.querySelector(`[data-progress-for="${id}"]`);
                    if (counter) counter.textContent = `${len}/${max}`;
                    if (progress) progress.style.width = `${(len/max)*100}%`;
                });
            }
        });

        function getPropData() {
            return {
                name: document.getElementById('prop-name')?.value || '',
                justification: document.getElementById('prop-justification')?.value || '',
                objective: document.getElementById('prop-objective')?.value || '',
                methodology: document.getElementById('prop-methodology')?.value || '',
                governance: document.getElementById('prop-governance')?.value || ''
            };
        }

        function copyPropWork() {
            const d = getPropData();
            const text = `MINI-PROPUESTA DE INTERVENCIÓN\n\nNombre: ${d.name}\n\nJustificación:\n${d.justification}\n\nObjetivo SMART:\n${d.objective}\n\nMetodología: ${d.methodology}\n\nEsquema de gobernanza:\n${d.governance}`;
            navigator.clipboard.writeText(text).then(() => alert('¡Propuesta copiada al portapapeles!'));
        }

        function toggleExportMenuProp() {
            document.getElementById('export-menu-prop').classList.toggle('hidden');
        }

        document.addEventListener('click', (e) => {
            const dd = document.getElementById('export-dropdown-prop');
            const menu = document.getElementById('export-menu-prop');
            if (dd && !dd.contains(e.target)) menu.classList.add('hidden');
        });

        function exportPropToTxt() {
            const d = getPropData();
            const text = `MINI-PROPUESTA DE INTERVENCIÓN - TEMA 3\n\nNOMBRE: ${d.name}\n\nJUSTIFICACIÓN:\n${d.justification}\n\nOBJETIVO SMART:\n${d.objective}\n\nMETODOLOGÍA SELECCIONADA: ${d.methodology}\n\nESQUEMA DE GOBERNANZA:\n${d.governance}\n\n---\nGenerado desde OVA Gerencia del Talento Humano - Tema 3`;
            const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Mini_Propuesta_${d.name.replace(/\s+/g, '_') || 'Intervencion'}.txt`;
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
            URL.revokeObjectURL(url);
            document.getElementById('export-menu-prop').classList.add('hidden');
        }

        function exportPropToWord() {
            const d = getPropData();
            const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
                <head><meta charset='utf-8'><title>Mini-Propuesta</title></head>
                <body>
                    <h2>Mini-Propuesta de Intervención - Tema 3</h2>
                    <p><strong>Nombre:</strong> ${d.name}</p>
                    <h3>Justificación:</h3><p>${d.justification.replace(/\n/g, '<br>')}</p>
                    <h3>Objetivo SMART:</h3><p>${d.objective.replace(/\n/g, '<br>')}</p>
                    <p><strong>Metodología seleccionada:</strong> ${d.methodology}</p>
                    <h3>Esquema de gobernanza:</h3><p>${d.governance.replace(/\n/g, '<br>')}</p>
                </body></html>`;
            const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Mini_Propuesta_${d.name.replace(/\s+/g, '_') || 'Intervencion'}.doc`;
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
            URL.revokeObjectURL(url);
            document.getElementById('export-menu-prop').classList.add('hidden');
        }

        function clearPropForm() {
            if (confirm('¿Estás seguro de que deseas borrar todo el contenido? Esta acción no se puede deshacer.')) {
                ['prop-name', 'prop-justification', 'prop-objective', 'prop-governance'].forEach(id => {
                    document.getElementById(id).value = '';
                    const counter = document.querySelector(`[data-counter-for="${id}"]`);
                    const progress = document.querySelector(`[data-progress-for="${id}"]`);
                    if (counter) counter.textContent = '0/' + document.getElementById(id).getAttribute('maxlength');
                    if (progress) progress.style.width = '0%';
                });
                document.getElementById('prop-methodology').value = '';
                alert('Formulario limpiado correctamente.');
            }
        }

        // Flip Cards functionality
        document.addEventListener('DOMContentLoaded', function() {
            const flipCards = document.querySelectorAll('.flip-card');
            
            flipCards.forEach(card => {
                card.addEventListener('click', function() {
                    this.classList.toggle('flipped');
                });
            });
            
            // Initialize quiz after DOM is ready
            renderQuiz();
        });

        // Load examples functionality
        function loadExample(type) {
            const examples = {
                reuniones: {
                    situation: "Las reuniones semanales del equipo de liderazgo se cancelan constantemente por 'falta de tiempo'. Cada vez se posponen para la siguiente semana, pero el problema persiste hace meses.",
                    actions: "Se envía un correo cancelando la reunión y se reagenda para la semana siguiente. Los temas importantes se dejan pendientes indefinidamente.",
                    assumptions: "Creemos que 'las reuniones son improductivas' y que 'no tenemos tiempo suficiente', pero nunca cuestionamos el formato o la agenda de las reuniones.",
                    doubleLoop: "Rediseñar el formato de reuniones: hacerlas más cortas (30 min), con agenda clara previa, y decisiones específicas. Evaluar si realmente todas las personas deben asistir a todas las reuniones.",
                    intervention: "Intervención de Procesos Humanos: Facilitar un taller de diseño de reuniones eficientes, implementar sistema de decisiones asíncronas para temas no urgentes.",
                    results: "Reducción del 70% en cancelaciones, decisiones más rápidas, mayor satisfacción del equipo, tiempo liberado para tareas estratégicas."
                },
                problemas: {
                    situation: "El sistema de gestión de clientes presenta el mismo error de sincronización cada viernes. El equipo técnico reinicia el servidor temporalmente, pero el problema vuelve a aparecer.",
                    actions: "Se reinicia el servidor cada viernes cuando ocurre el error. Se documenta el incidente pero no se investiga la causa raíz del problema.",
                    assumptions: "Asumimos que 'es un problema técnico inevitable' y que 'la solución temporal es suficiente', sin cuestionar por qué ocurre específicamente los viernes.",
                    doubleLoop: "Investigar la causa raíz: analizar logs del sistema, identificar patrones de uso los viernes, evaluar si el problema está en el código, la infraestructura o los procesos de carga de datos.",
                    intervention: "Intervención Tecnoestructural: Rediseñar la arquitectura del sistema, implementar monitoreo predictivo, crear protocolo de investigación de problemas recurrentes.",
                    results: "Eliminación del error recurrente, sistema más estable, reducción del trabajo de emergencia, mayor confianza en el sistema."
                },
                comunicacion: {
                    situation: "Los informes mensuales importantes enviados por correo electrónico frecuentemente no son leídos por los destinatarios clave. La información crítica se pierde o llega tarde.",
                    actions: "Se envían recordatorios adicionales por correo. Se crea carpetas especiales en el correo, pero los informes siguen sin ser leídos a tiempo.",
                    assumptions: "Creemos que 'la gente no lee correos' y que 'necesitamos más recordatorios', sin cuestionar si el correo es el canal adecuado o si el formato es efectivo.",
                    doubleLoop: "Evaluar canales de comunicación: quizás un dashboard interactivo, mensajes cortos por WhatsApp, o reuniones breves de 5 minutos. Rediseñar el formato para ser más visual y conciso.",
                    intervention: "Intervención Cultural: Implementar nueva cultura de comunicación multimodal, capacitar en comunicación efectiva, crear sistema de priorización de información.",
                    results: "Tasa de lectura del 95%, decisiones más informadas y oportunas, reducción del ruido comunicacional, mejor alineación estratégica."
                },
                procesos: {
                    situation: "Todo informe de gastos requiere aprobación del gerente directo, luego del departamento financiero y finalmente de la dirección. Este proceso toma 2 semanas y causa retrasos.",
                    actions: "Se agilizan algunos casos 'urgentes' saltando pasos. Se crean correos especiales para acelerar aprobaciones, pero el proceso base no cambia.",
                    assumptions: "Damos por sentado que 'más controles es más seguridad' y que 'todos los niveles son necesarios', sin evaluar el valor real de cada aprobación.",
                    doubleLoop: "Cuestionar la necesidad de las 3 aprobaciones: implementar sistema de aprobación diferenciada por montos, usar tecnología para automatizar aprobaciones rutinarias, establecer límites de confianza.",
                    intervention: "Intervención Tecnoestructural: Rediseñar el proceso de aprobación, implementar sistema automatizado con reglas de negocio, establecer matriz de delegación.",
                    results: "Reducción del tiempo de aprobación a 48 horas, menos trabajo manual, mayor autonomía de los equipos, controles más inteligentes y efectivos."
                }
            };

            const example = examples[type];
            if (example) {
                // Fill the form fields
                document.getElementById('current-situation').value = example.situation;
                document.getElementById('current-actions').value = example.actions;
                document.getElementById('hidden-assumptions').value = example.assumptions;
                document.getElementById('double-loop').value = example.doubleLoop;
                document.getElementById('od-intervention').value = example.intervention;
                document.getElementById('expected-results').value = example.results;

                // Update all counters
                ['current-situation', 'current-actions', 'hidden-assumptions', 'double-loop', 'od-intervention', 'expected-results'].forEach(id => {
                    updateCounter(id);
                });

                // Scroll to the form
                document.getElementById('current-situation').scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        // Update counter functionality
        function updateCounter(fieldId) {
            const field = document.getElementById(fieldId);
            const counter = document.querySelector(`[data-counter-for="${fieldId}"]`);
            const progressBar = document.querySelector(`[data-progress-for="${fieldId}"]`);
            
            if (field && counter) {
                const currentLength = field.value.length;
                const maxLength = field.maxLength;
                counter.textContent = `${currentLength}/${maxLength}`;
                
                if (progressBar) {
                    const percentage = (currentLength / maxLength) * 100;
                    progressBar.style.width = `${percentage}%`;
                }
            }
        }

        // Add event listeners for counters
        document.addEventListener('DOMContentLoaded', function() {
            const textareas = ['current-situation', 'current-actions', 'hidden-assumptions', 'double-loop', 'od-intervention', 'expected-results'];
            
            textareas.forEach(id => {
                const field = document.getElementById(id);
                if (field) {
                    field.addEventListener('input', () => updateCounter(id));
                    // Initialize counter
                    updateCounter(id);
                }
            });
        });

        // Clear form functionality
        function clearCaso() {
            const fields = ['current-situation', 'current-actions', 'hidden-assumptions', 'double-loop', 'od-intervention', 'expected-results'];
            
            fields.forEach(id => {
                const field = document.getElementById(id);
                if (field) {
                    field.value = '';
                    updateCounter(id);
                }
            });
        }

        // Export functionality with dropdown menu
        function toggleExportMenu() {
            const menu = document.getElementById('export-menu');
            const isHidden = menu.classList.contains('hidden');
            
            // Close menu if clicking outside
            if (!isHidden) {
                menu.classList.add('hidden');
                return;
            }
            
            // Validate content before showing menu
            const situation = document.getElementById('current-situation').value;
            const actions = document.getElementById('current-actions').value;
            const assumptions = document.getElementById('hidden-assumptions').value;
            const doubleLoop = document.getElementById('double-loop').value;
            const intervention = document.getElementById('od-intervention').value;
            const results = document.getElementById('expected-results').value;

            if (!situation && !actions && !assumptions && !doubleLoop && !intervention && !results) {
                alert('Por favor completa al menos un campo antes de exportar.');
                return;
            }
            
            // Store data globally for export functions
            window.exportData = {
                situation, actions, assumptions, doubleLoop, intervention, results
            };
            
            // Show menu
            menu.classList.remove('hidden');
            
            // Close menu when clicking outside
            setTimeout(() => {
                document.addEventListener('click', closeExportMenuOutside);
            }, 100);
        }

        function closeExportMenuOutside(event) {
            const menu = document.getElementById('export-menu');
            const button = event.target.closest('button[onclick="toggleExportMenu()"]');
            
            if (!menu.contains(event.target) && !button) {
                menu.classList.add('hidden');
                document.removeEventListener('click', closeExportMenuOutside);
            }
        }

        function exportAsWord() {
            const { situation, actions, assumptions, doubleLoop, intervention, results } = window.exportData;
            
            const content = `
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Análisis de Caso - Bucle Simple a Doble</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
                        h1 { color: #374151; border-bottom: 2px solid #D8EBF8; padding-bottom: 10px; }
                        h2 { color: #569151; margin-top: 30px; }
                        .section { margin-bottom: 20px; }
                        .label { font-weight: bold; color: #374151; }
                        .content { margin-top: 5px; padding: 10px; background: #f9fafb; border-left: 4px solid #D8EBF8; }
                    </style>
                </head>
                <body>
                    <h1>Análisis de Caso - Bucle Simple a Doble</h1>
                    <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
                    
                    <div class="section">
                        <h2>📋 Situación Actual (Bucle Simple)</h2>
                        <div class="content">${situation || 'No especificado'}</div>
                    </div>
                    
                    <div class="section">
                        <h2>⚡ Acciones Actuales</h2>
                        <div class="content">${actions || 'No especificado'}</div>
                    </div>
                    
                    <div class="section">
                        <h2>🔍 Supuestos Ocultos Identificados</h2>
                        <div class="content">${assumptions || 'No especificado'}</div>
                    </div>
                    
                    <div class="section">
                        <h2>🧠 Propuesta de Bucle Doble</h2>
                        <div class="content">${doubleLoop || 'No especificado'}</div>
                    </div>
                    
                    <div class="section">
                        <h2>🛠️ Intervención de DO Propuesta</h2>
                        <div class="content">${intervention || 'No especificado'}</div>
                    </div>
                    
                    <div class="section">
                        <h2>📈 Resultados Esperados</h2>
                        <div class="content">${results || 'No especificado'}</div>
                    </div>
                </body>
                </html>
            `;
            
            const blob = new Blob([content], { type: 'application/msword' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Analisis_Bucle_Doble_${new Date().toISOString().split('T')[0]}.doc`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            document.getElementById('export-menu').classList.add('hidden');
        }

        function exportAsTXT() {
            const { situation, actions, assumptions, doubleLoop, intervention, results } = window.exportData;
            
            const content = `ANÁLISIS DE CASO - BUCLE SIMPLE A DOBLE
================================================
Fecha: ${new Date().toLocaleDateString('es-ES')}

📋 SITUACIÓN ACTUAL (BUCLE SIMPLE)
----------------------------------
${situation || 'No especificado'}

⚡ ACCIONES ACTUALES
-------------------
${actions || 'No especificado'}

🔍 SUPUESTOS OCULTOS IDENTIFICADOS
----------------------------------
${assumptions || 'No especificado'}

🧠 PROPUESTA DE BUCLE DOBLE
---------------------------
${doubleLoop || 'No especificado'}

🛠️ INTERVENCIÓN DE DO PROPUESTA
-------------------------------
${intervention || 'No especificado'}

📈 RESULTADOS ESPERADOS
----------------------
${results || 'No especificado'}

================================================
Generado desde OVA - Gerencia del Talento Humano
Universidad de Córdoba
`;
            
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Analisis_Bucle_Doble_${new Date().toISOString().split('T')[0]}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            document.getElementById('export-menu').classList.add('hidden');
        }

        
        // Drag & Drop functionality
        let draggedElement = null;

        document.addEventListener('DOMContentLoaded', function() {
            initializeDragDrop();
        });

        function initializeDragDrop() {
            const dragCards = document.querySelectorAll('.drag-card');
            const dropZones = document.querySelectorAll('.drop-zone');

            dragCards.forEach(card => {
                card.addEventListener('dragstart', handleDragStart);
                card.addEventListener('dragend', handleDragEnd);
            });

            dropZones.forEach(zone => {
                zone.addEventListener('dragover', handleDragOver);
                zone.addEventListener('drop', handleDrop);
                zone.addEventListener('dragleave', handleDragLeave);
            });
        }

        function handleDragStart(e) {
            draggedElement = e.target;
            e.target.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        }

        function handleDragEnd(e) {
            e.target.classList.remove('dragging');
        }

        function handleDragOver(e) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.dataTransfer.dropEffect = 'move';
            
            const dropZone = e.target.closest('.drop-zone');
            if (dropZone) {
                dropZone.classList.add('drag-over');
            }
            return false;
        }

        function handleDragLeave(e) {
            const dropZone = e.target.closest('.drop-zone');
            if (dropZone) {
                dropZone.classList.remove('drag-over');
            }
        }

        function handleDrop(e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            e.preventDefault();

            const dropZone = e.target.closest('.drop-zone');
            if (dropZone && draggedElement) {
                dropZone.classList.remove('drag-over');
                const content = dropZone.querySelector('.drop-zone-content');
                content.appendChild(draggedElement);
                draggedElement = null;
            }
            return false;
        }

        function checkDragDrop() {
            const dropZones = document.querySelectorAll('.drop-zone');
            let correct = 0;
            let total = 0;

            dropZones.forEach(zone => {
                const category = zone.dataset.category;
                const cards = zone.querySelectorAll('.drag-card');
                
                cards.forEach(card => {
                    total++;
                    if (card.dataset.answer === category) {
                        card.classList.add('correct');
                        correct++;
                    } else {
                        card.classList.add('incorrect');
                    }
                });
            });

            const message = `¡Has acertado ${correct} de ${total} tarjetas!`;
            const bgColor = correct === total ? '#22c55e' : correct >= total * 0.7 ? '#f59e0b' : '#ef4444';
            
            // Show result message
            const resultDiv = document.createElement('div');
            resultDiv.className = 'mt-4 p-4 rounded-lg text-center font-bold text-white';
            resultDiv.style.background = bgColor;
            resultDiv.textContent = message;
            
            const existingResult = document.querySelector('.drag-drop-result');
            if (existingResult) {
                existingResult.remove();
            }
            
            resultDiv.classList.add('drag-drop-result');
            document.querySelector('#act-practice .section-card').appendChild(resultDiv);
        }

        function resetDragDrop() {
            const dragCards = document.querySelectorAll('.drag-card');
            const dragCardsContainer = document.getElementById('drag-cards');
            
            dragCards.forEach(card => {
                card.classList.remove('correct', 'incorrect');
                dragCardsContainer.appendChild(card);
            });

            const resultDiv = document.querySelector('.drag-drop-result');
            if (resultDiv) {
                resultDiv.remove();
            }
        }

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

// Taller práctico: de 2 en 2.
document.addEventListener('DOMContentLoaded', function () {
  pantallasDeDosEnLista(document.querySelector('#act-workshop .space-y-4'));
});
