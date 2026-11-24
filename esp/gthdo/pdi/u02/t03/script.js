/* Interacciones del OVA gthdo-pdi-u02-t03. */


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
                q: "Según el marco de las 7S de McKinsey, ¿cuál de los siguientes factores es considerado un elemento 'blando' del sistema organizacional?", 
                options: [
                    "Estructura (Structure)", 
                    "Sistemas (Systems)", 
                    "Valores compartidos (Shared Values)", 
                    "Estrategia (Strategy)"
                ], 
                correct: 2,
                explicaciones: ["No es la respuesta. La estructura es un elemento «duro» de las 7S: se puede definir y documentar formalmente.", "No es la respuesta. Los sistemas (procesos y procedimientos) son un elemento «duro» de las 7S.", "Correcto. Los valores compartidos son un elemento «blando» y el centro del modelo de las 7S: conectan y dan sentido a los demás factores.", "No es la respuesta. La estrategia es un elemento «duro» de las 7S."] 
            },
            { 
                q: "¿Qué característica principal distingue a la holocracia de una jerarquía tradicional de mando y control?", 
                options: [
                    "Cargos fijos y escalas de reporte permanentes", 
                    "Roles dinámicos y autoridad distribuida en círculos autónomos", 
                    "Unidad de mando centralizada en el máximo directivo", 
                    "Procesos rígidos definidos por el organigrama"
                ], 
                correct: 1,
                explicaciones: ["No es la respuesta. Los cargos fijos y las escalas de reporte permanentes son propios de la jerarquía tradicional.", "Correcto. La holocracia reemplaza los cargos fijos por roles dinámicos y distribuye la autoridad en círculos autónomos.", "No es la respuesta. La unidad de mando centralizada caracteriza el modelo de mando y control, no la holocracia.", "No es la respuesta. Los procesos rígidos definidos por el organigrama son propios de la jerarquía tradicional."] 
            },
            { 
                q: "¿Qué busca una organización fractal según el principio de simplicidad organizacional?", 
                options: [
                    "Aumentar los niveles jerárquicos para mejorar el control", 
                    "Que cada unidad mínima funcione como un microcosmos de la visión total", 
                    "Que cada equipo dependa de aprobaciones centrales para actuar", 
                    "Que la estrategia se defina una sola vez al año"
                ], 
                correct: 1,
                explicaciones: ["No es la respuesta. La organización fractal busca simplificar, no añadir niveles jerárquicos.", "Correcto. En una organización fractal, cada unidad mínima funciona como un microcosmos que refleja la visión total.", "No es la respuesta. La organización fractal da autonomía a cada unidad para actuar sin depender de aprobaciones centrales.", "No es la respuesta. La organización fractal requiere una estrategia viva y compartida, no definida una sola vez al año."] 
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

        // ===== ACTIVIDAD 1: DIAGNÓSTICO 7S =====
        const s7Campos = [
            { key: 'strategy', label: 'Estrategia (Strategy)', help: 'Claridad y coherencia de la estrategia.' },
            { key: 'structure', label: 'Estructura (Structure)', help: 'Organización de equipos y toma de decisiones.' },
            { key: 'systems', label: 'Sistemas (Systems)', help: 'Procesos, herramientas e información.' },
            { key: 'sharedValues', label: 'Valores compartidos (Shared Values)', help: 'Cultura y valores que guían la organización.' },
            { key: 'style', label: 'Estilo (Style)', help: 'Liderazgo y forma de trabajar.' },
            { key: 'staff', label: 'Personal (Staff)', help: 'Talento y capacidades disponibles.' },
            { key: 'skills', label: 'Habilidades (Skills)', help: 'Competencias clave alineadas a la estrategia.' }
        ];

        const s7ModelLabels = {
            agil: 'Estructura ágil / equipos autónomos',
            holocracia: 'Holocracia',
            fractal: 'Organización fractal',
            star: 'Modelo Star de Galbraith',
            '7s': 'Re-alineación 7S',
            otro: 'Otro'
        };

        function renderS7Form() {
            const container = document.getElementById('s7-form-container');
            if (!container) return;
            const scoreOptions = ['<option value="">Puntuación</option>', '<option value="1">1 — Muy débil</option>', '<option value="2">2 — Débil</option>', '<option value="3">3 — Regular</option>', '<option value="4">4 — Fuerte</option>', '<option value="5">5 — Muy fuerte</option>'].join('');
            let html = `<div class="mb-4">
                <label class="block text-sm font-bold mb-2" style="color: var(--heading)">Caso a diagnosticar</label>
                <textarea id="s7-caso" rows="4" maxlength="500" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2" style="border-color: var(--line);" placeholder="Describe la organización, área o situación que vas a diagnosticar..."></textarea>
                <div class="mt-1 flex items-center gap-2">
                    <span class="text-xs font-semibold" style="color: var(--heading);" data-counter-for="s7-caso">0/500</span>
                    <div class="w-24 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                        <div class="h-full rounded-full transition-all duration-300" style="width: 0%; background: var(--accent);" data-progress-for="s7-caso"></div>
                    </div>
                </div>
            </div><div class="space-y-3" id="s7-items">`;
            s7Campos.forEach(s => {
                html += `<div class="s7-row p-4 rounded-lg border" style="border-color: var(--line);">
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        <div class="md:col-span-4">
                            <p class="text-sm font-bold" style="color: var(--heading);">${s.label}</p>
                            <p class="text-xs" style="color: var(--text);">${s.help}</p>
                        </div>
                        <div class="md:col-span-3">
                            <select id="s7-score-${s.key}" class="w-full px-3 py-2 border rounded-lg text-sm" style="border-color: var(--line);">${scoreOptions}</select>
                        </div>
                        <div class="md:col-span-5">
                            <textarea id="s7-just-${s.key}" rows="2" maxlength="250" class="w-full px-3 py-2 border rounded-lg text-sm" style="border-color: var(--line);" placeholder="Justificación..."></textarea>
                            <div class="mt-1 flex items-center gap-2">
                                <span class="text-xs font-semibold" style="color: var(--heading);" data-counter-for="s7-just-${s.key}">0/250</span>
                                <div class="w-24 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                                    <div class="h-full rounded-full transition-all duration-300" style="width: 0%; background: var(--accent);" data-progress-for="s7-just-${s.key}"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
            });
            html += `</div><div class="mt-4">
                <label class="block text-sm font-bold mb-2" style="color: var(--heading)">Factor más débil</label>
                <select id="s7-factor-debil" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2" style="border-color: var(--line);">
                    <option value="">Selecciona el factor</option>
                    ${s7Campos.map(s => `<option value="${s.key}">${s.label}</option>`).join('')}
                </select>
            </div><div class="mt-4">
                <label class="block text-sm font-bold mb-2" style="color: var(--heading)">Diagnóstico general</label>
                <textarea id="s7-diagnostico" rows="3" maxlength="400" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2" style="border-color: var(--line);" placeholder="Resumen de la situación y sus principales desalineaciones..."></textarea>
                <div class="mt-1 flex items-center gap-2">
                    <span class="text-xs font-semibold" style="color: var(--heading);" data-counter-for="s7-diagnostico">0/400</span>
                    <div class="w-24 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                        <div class="h-full rounded-full transition-all duration-300" style="width: 0%; background: var(--accent);" data-progress-for="s7-diagnostico"></div>
                    </div>
                </div>
            </div><div class="mt-4">
                <label class="block text-sm font-bold mb-2" style="color: var(--heading)">Modelo de rediseño recomendado</label>
                <select id="s7-modelo" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2" style="border-color: var(--line);">
                    <option value="">Selecciona un modelo</option>
                    <option value="agil">Estructura ágil / equipos autónomos</option>
                    <option value="holocracia">Holocracia</option>
                    <option value="fractal">Organización fractal</option>
                    <option value="star">Modelo Star de Galbraith</option>
                    <option value="7s">Re-alineación 7S</option>
                    <option value="otro">Otro</option>
                </select>
            </div><div class="mt-4">
                <label class="block text-sm font-bold mb-2" style="color: var(--heading)">Intervenciones clave</label>
                <textarea id="s7-intervenciones" rows="3" maxlength="400" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2" style="border-color: var(--line);" placeholder="Máximo 3 acciones concretas para mejorar la situación..."></textarea>
                <div class="mt-1 flex items-center gap-2">
                    <span class="text-xs font-semibold" style="color: var(--heading);" data-counter-for="s7-intervenciones">0/400</span>
                    <div class="w-24 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                        <div class="h-full rounded-full transition-all duration-300" style="width: 0%; background: var(--accent);" data-progress-for="s7-intervenciones"></div>
                    </div>
                </div>
            </div>`;
            container.innerHTML = html;
        }

        function get7SData() {
            const data = { scores: {}, justifications: {} };
            s7Campos.forEach(c => {
                data.scores[c.key] = document.getElementById(`s7-score-${c.key}`)?.value || '';
                data.justifications[c.key] = document.getElementById(`s7-just-${c.key}`)?.value || '';
            });
            data.caso = document.getElementById('s7-caso')?.value || '';
            data.factorDebil = document.getElementById('s7-factor-debil')?.value || '';
            data.diagnostico = document.getElementById('s7-diagnostico')?.value || '';
            data.modelo = document.getElementById('s7-modelo')?.value || '';
            data.intervenciones = document.getElementById('s7-intervenciones')?.value || '';
            return data;
        }

        function validar7S() {
            const d = get7SData();
            const missing = [];
            if (!d.caso.trim()) missing.push('Caso a diagnosticar');
            s7Campos.forEach(c => {
                if (!d.scores[c.key]) missing.push(`Puntuación de ${c.label}`);
                if (!d.justifications[c.key].trim()) missing.push(`Justificación de ${c.label}`);
            });
            if (!d.factorDebil) missing.push('Factor más débil');
            if (!d.diagnostico.trim()) missing.push('Diagnóstico general');
            if (!d.modelo) missing.push('Modelo de rediseño');
            if (!d.intervenciones.trim()) missing.push('Intervenciones clave');
            return missing;
        }

        function generarPrompt7S() {
            const missing = validar7S();
            if (missing.length > 0) {
                alert('Por favor complete todos los campos antes de generar el prompt:\n\n• ' + missing.join('\n• '));
                return;
            }
            const d = get7SData();
            let diagnosticLines = '';
            s7Campos.forEach(c => {
                diagnosticLines += `- ${c.label}: ${d.scores[c.key]}/5 - ${d.justifications[c.key]}\n`;
            });
            const factorDebilLabel = s7Campos.find(c => c.key === d.factorDebil)?.label || d.factorDebil;
            const modeloLabel = s7ModelLabels[d.modelo] || d.modelo;
            const prompt = `Actúa como un consultor experto en diseño organizacional y en el modelo de las 7S de McKinsey. A continuación te comparto un diagnóstico realizado por un estudiante. Tu trabajo es revisarlo y dar retroalimentación constructiva, profesional y didáctica. No reescribas el diagnóstico completo; indica qué está bien, qué puede mejorar y qué preguntas faltan.

Caso a diagnosticar:
---
${d.caso}
---

Diagnóstico del estudiante:
${diagnosticLines}Factor más débil: ${factorDebilLabel}
Diagnóstico general: ${d.diagnostico}
Modelo de rediseño recomendado: ${modeloLabel}
Intervenciones clave: ${d.intervenciones}

Por favor responde con:
1. Evaluación general del diagnóstico.
2. Análisis de la coherencia entre las puntuaciones y el caso.
3. ¿Es correcto el factor más débil? ¿Por qué?
4. ¿El modelo de rediseño recomendado es el más adecuado? Sugiere alternativas si aplica.
5. ¿Las intervenciones son concretas y aplicables?
6. Preguntas o puntos que el estudiante debería revisar.`;
            const promptBox = document.getElementById('s7-prompt');
            if (promptBox) promptBox.value = prompt;
            copiarPrompt7S(prompt);
        }

        function copiarPrompt7S(prompt) {
            const text = prompt || document.getElementById('s7-prompt')?.value || '';
            if (!text) return;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(() => {
                    mostrarMensaje7S('Prompt copiado al portapapeles. Pégalo en Google Gemini para recibir la retroalimentación.');
                }).catch(() => {
                    mostrarMensaje7S('No se pudo copiar automáticamente. Copia el prompt del recuadro.');
                });
            } else {
                mostrarMensaje7S('Copia el prompt manualmente del recuadro.');
            }
        }

        function mostrarMensaje7S(msg) {
            const el = document.getElementById('s7-message');
            if (el) {
                el.textContent = msg;
                el.classList.remove('hidden');
            }
        }

        function initS7Counters() {
            const s7CounterIds = ['s7-caso', 's7-diagnostico', 's7-intervenciones'].concat(s7Campos.map(c => 's7-just-' + c.key));
            s7CounterIds.forEach(id => {
                const field = document.getElementById(id);
                if (field) {
                    field.addEventListener('input', () => updateCounter(id));
                    updateCounter(id);
                }
            });
        }

        function limpiar7S() {
            const container = document.getElementById('s7-form-container');
            if (container) {
                renderS7Form();
                initS7Counters();
            }
            const promptBox = document.getElementById('s7-prompt');
            if (promptBox) promptBox.value = '';
            const msg = document.getElementById('s7-message');
            if (msg) {
                msg.textContent = '';
                msg.classList.add('hidden');
            }
        }

        // ===== ACTIVIDAD 2: PROPUESTA DE REDISEÑO ORGANIZACIONAL =====
        const redisenoFields = ['rediseno-contexto', 'rediseno-problema', 'rediseno-justificacion', 'rediseno-elementos', 'rediseno-resultados'];

        const redisenoModelLabels = {
            agil: 'Estructura ágil / equipos autónomos',
            holocracia: 'Holocracia',
            fractal: 'Organización fractal',
            star: 'Modelo Star de Galbraith',
            '7s': 'Re-alineación 7S',
            otro: 'Otro'
        };

        function getRedisenoData() {
            return {
                contexto: document.getElementById('rediseno-contexto')?.value || '',
                problema: document.getElementById('rediseno-problema')?.value || '',
                modelo: document.getElementById('rediseno-modelo')?.value || '',
                justificacion: document.getElementById('rediseno-justificacion')?.value || '',
                elementos: document.getElementById('rediseno-elementos')?.value || '',
                resultados: document.getElementById('rediseno-resultados')?.value || ''
            };
        }

        function clearRedisenoForm() {
            redisenoFields.forEach(id => {
                const field = document.getElementById(id);
                if (field) {
                    field.value = '';
                    updateCounter(id);
                }
            });
            const modelo = document.getElementById('rediseno-modelo');
            if (modelo) modelo.value = '';
        }

        function toggleExportMenuRediseno() {
            const menu = document.getElementById('export-menu-rediseno');
            const isHidden = menu.classList.contains('hidden');
            if (!isHidden) {
                menu.classList.add('hidden');
                return;
            }
            const d = getRedisenoData();
            if (!d.contexto && !d.problema && !d.modelo && !d.justificacion && !d.elementos && !d.resultados) {
                alert('Por favor complete al menos un campo antes de exportar.');
                return;
            }
            window.exportRedisenoData = d;
            menu.classList.remove('hidden');
            setTimeout(() => {
                document.addEventListener('click', closeExportMenuOutsideRediseno);
            }, 100);
        }

        function closeExportMenuOutsideRediseno(event) {
            const menu = document.getElementById('export-menu-rediseno');
            const button = event.target.closest('button[onclick="toggleExportMenuRediseno()"]');
            const dd = document.getElementById('export-dropdown-rediseno');
            if (dd && !dd.contains(event.target) && !button) {
                menu.classList.add('hidden');
                document.removeEventListener('click', closeExportMenuOutsideRediseno);
            }
        }

        function exportRedisenoToTxt() {
            const d = window.exportRedisenoData || getRedisenoData();
            const modeloLabel = redisenoModelLabels[d.modelo] || 'No especificado';
            const content = `PROPUESTA DE REDISEÑO ORGANIZACIONAL - TEMA 3
================================================
Fecha: ${new Date().toLocaleDateString('es-ES')}

CONTEXTO ORGANIZACIONAL
----------------------------------
${d.contexto || 'No especificado'}

PROBLEMA U OPORTUNIDAD DE DISEÑO
----------------------------------
${d.problema || 'No especificado'}

MODELO DE REDISEÑO PROPUESTO
----------------------------------
${modeloLabel}

JUSTIFICACIÓN DE LA ELECCIÓN
----------------------------------
${d.justificacion || 'No especificado'}

ELEMENTOS CLAVE A INTERVENIR
----------------------------------
${d.elementos || 'No especificado'}

RESULTADOS ESPERADOS
----------------------------------
${d.resultados || 'No especificado'}

================================================
Generado desde OVA - Gerencia del Talento Humano
Universidad de Córdoba`;
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Propuesta_Redisenio_Tema3_${new Date().toISOString().split('T')[0]}.txt`;
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
            URL.revokeObjectURL(url);
            document.getElementById('export-menu-rediseno').classList.add('hidden');
        }

        function exportRedisenoToWord() {
            const d = window.exportRedisenoData || getRedisenoData();
            const modeloLabel = redisenoModelLabels[d.modelo] || 'No especificado';
            const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
                <head><meta charset='utf-8'><title>Propuesta de Rediseño Organizacional - Tema 3</title></head>
                <body>
                    <h2>Propuesta de Rediseño Organizacional - Tema 3</h2>
                    <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
                    <h3>Contexto organizacional</h3><p>${(d.contexto || 'No especificado').replace(/\n/g, '<br>')}</p>
                    <h3>Problema u oportunidad de diseño</h3><p>${(d.problema || 'No especificado').replace(/\n/g, '<br>')}</p>
                    <h3>Modelo de rediseño propuesto</h3><p>${modeloLabel}</p>
                    <h3>Justificación de la elección</h3><p>${(d.justificacion || 'No especificado').replace(/\n/g, '<br>')}</p>
                    <h3>Elementos clave a intervenir</h3><p>${(d.elementos || 'No especificado').replace(/\n/g, '<br>')}</p>
                    <h3>Resultados esperados</h3><p>${(d.resultados || 'No especificado').replace(/\n/g, '<br>')}</p>
                </body></html>`;
            const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Propuesta_Redisenio_Tema3_${new Date().toISOString().split('T')[0]}.doc`;
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
            URL.revokeObjectURL(url);
            document.getElementById('export-menu-rediseno').classList.add('hidden');
        }

        // ===== FLIP CARDS Y DOMContentLoaded =====
        document.addEventListener('DOMContentLoaded', function() {
            const flipCards = document.querySelectorAll('.flip-card');
            flipCards.forEach(card => {
                card.addEventListener('click', function() {
                    this.classList.toggle('flipped');
                });
            });

            redisenoFields.forEach(id => {
                const field = document.getElementById(id);
                if (field) {
                    field.addEventListener('input', () => updateCounter(id));
                    updateCounter(id);
                }
            });

            renderS7Form();
            initS7Counters();
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
