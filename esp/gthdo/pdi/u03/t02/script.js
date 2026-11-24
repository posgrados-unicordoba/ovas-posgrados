/* Interacciones del OVA gthdo-pdi-u03-t02. */


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

        // Quiz - Preguntas acotadas según formato FDOC-088 y Guía 2 - Tema 2
        const quizData = [
            { 
                q: "Según la Guía 2 (Parte 1), ¿cuál es el planteamiento central de la Teoría de los Stakeholders de Edward Freeman?", 
                options: [
                    "El éxito de la empresa depende exclusivamente de maximizar el retorno al accionista en el corto plazo",
                    "El éxito sostenible de una organización depende de su capacidad para gestionar los intereses de todos sus grupos de interés",
                    "Los stakeholders son únicamente los empleados directos de la organización y sus directivos",
                    "La RSE es una estrategia de marketing para mejorar la imagen corporativa sin compromisos reales"
                ], 
                correct: 1,
                explicaciones: ["No es la respuesta. Esa es la visión centrada en el accionista, a la que Freeman se opone.", "Correcto. Para Freeman, el éxito sostenible depende de gestionar los intereses de todos los grupos de interés, no solo los del accionista.", "No es la respuesta. Los stakeholders incluyen también clientes, proveedores, comunidad y Estado, entre otros.", "No es la respuesta. La teoría de los stakeholders no reduce la RSE a marketing: exige compromisos reales con cada grupo."] 
            },
            { 
                q: "De acuerdo con la Guía 2 (Parte 2), ¿cuál es el rol del gerente de Talento Humano en las dimensiones ASG de la sostenibilidad corporativa?", 
                options: [
                    "Liderar exclusivamente el componente Ambiental, reduciendo la huella de carbono de la organización",
                    "Gestionar los reportes financieros de sostenibilidad para los inversionistas externos",
                    "Supervisar el cumplimiento normativo ambiental ante las entidades reguladoras del Estado",
                    "Liderar el componente Social (inclusión, diversidad, equidad salarial) y el de Gobernanza (transparencia y anticorrupción)"
                ], 
                correct: 3,
                explicaciones: ["No es la respuesta. El componente ambiental no es el principal campo de acción del gerente de Talento Humano.", "No es la respuesta. Los reportes financieros para inversionistas no son el rol central de Talento Humano en ASG.", "No es la respuesta. El cumplimiento ambiental ante reguladores corresponde a otras áreas.", "Correcto. Talento Humano lidera el componente Social (inclusión, diversidad, equidad salarial) y aporta a la Gobernanza (transparencia y anticorrupción)."] 
            },
            { 
                q: "Según la Guía 2 (Parte 3), ¿qué son los 'stakeholders silenciosos' en el marco de las decisiones de sostenibilidad?", 
                options: [
                    "Los empleados que no participan en los comités de ética de la organización",
                    "Los accionistas minoritarios que no asisten a las asambleas generales de la empresa",
                    "Las familias, sindicatos y generaciones futuras afectadas por las decisiones de sostenibilidad actuales",
                    "Los proveedores que no tienen voz en los procesos de negociación contractual"
                ], 
                correct: 2,
                explicaciones: ["No es la respuesta. No participar en un comité no convierte a un empleado en stakeholder silencioso.", "No es la respuesta. Los accionistas minoritarios tienen mecanismos para hacerse oír; no son los stakeholders silenciosos.", "Correcto. Son las familias, los sindicatos y las generaciones futuras: los afecta la decisión, pero no suelen tener voz en ella.", "No es la respuesta. Los proveedores negocian directamente con la empresa; no son a quienes la guía llama silenciosos."] 
            },
            { 
                q: "Según el FDOC-088 y la Guía 2, ¿con qué marco global articulan sus estrategias las organizaciones líderes en RSE para profesionalizar la gestión de la sostenibilidad?", 
                options: [
                    "Con los Objetivos de Desarrollo Sostenible (ODS) de la Agenda 2030 del Pacto Mundial de la ONU",
                    "Con los principios del Fondo Monetario Internacional para la gobernanza corporativa",
                    "Con los estándares ISO 9001 de gestión de calidad aplicados al talento humano",
                    "Con el Código de Integridad de la Universidad de Córdoba para la ética profesional"
                ], 
                correct: 0,
                explicaciones: ["Correcto. Las organizaciones líderes alinean su RSE con los Objetivos de Desarrollo Sostenible de la Agenda 2030 y el Pacto Mundial.", "No es la respuesta. El FMI no es el marco de referencia para la gestión de la RSE.", "No es la respuesta. La ISO 9001 es un estándar de calidad, no un marco global de sostenibilidad.", "No es la respuesta. El Código de Integridad orienta la ética profesional en la universidad, no la estrategia global de RSE."] 
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

        // ===== UTILIDAD: SCROLL AL TOPE DE ACTIVIDAD =====
        function scrollToActividad() {
            const panel = document.querySelector('.act-panel.active');
            if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // ===== UTILIDAD: EXPORTAR =====
        function descargarArchivo(nombre, contenido, tipo) {
            const blob = new Blob([contenido], { type: tipo });
            const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nombre; a.click();
        }
        function exportarComoWord(nombre, htmlContent) {
            const doc = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>${nombre}</title></head><body>${htmlContent}</body></html>`;
            descargarArchivo(nombre + '.doc', doc, 'application/msword');
        }

        // ===== ACTIVIDAD 1: TABLERO DE PRIORIZACIÓN RSE (paginado) =====
        const tableroIniciativas = [
            { id: 't1', label: 'Programa de equidad salarial de género', dim: 'S', dimNombre: 'Social', icono: 'fa-venus-mars', color: '#569151', stakeholders: 'Empleados y familias', experto: 20, razon: 'Mayor impacto directo en el bienestar de los empleados como stakeholders primarios.' },
            { id: 't2', label: 'Reporte público de sostenibilidad (GRI)', dim: 'G', dimNombre: 'Gobernanza', icono: 'fa-file-contract', color: '#1d4ed8', stakeholders: 'Inversionistas y sociedad', experto: 10, razon: 'Fortalece la transparencia y la confianza con inversionistas ESG.' },
            { id: 't3', label: 'Jardín infantil para hijos de empleados', dim: 'S', dimNombre: 'Social', icono: 'fa-children', color: '#569151', stakeholders: 'Empleados y familias', experto: 15, razon: 'Alta valoración por parte de los empleados, impacto en retención y clima laboral.' },
            { id: 't4', label: 'Reducción de huella de carbono', dim: 'A', dimNombre: 'Ambiental', icono: 'fa-leaf', color: '#15803d', stakeholders: 'Comunidades y generaciones futuras', experto: 18, razon: 'Alineación directa con ODS 13 y demanda de fondos de inversión ESG.' },
            { id: 't5', label: 'Línea ética y canal de denuncias anónimas', dim: 'G', dimNombre: 'Gobernanza', icono: 'fa-shield-halved', color: '#1d4ed8', stakeholders: 'Empleados y sociedad', experto: 8, razon: 'Costo relativamente bajo con alto impacto en la cultura de integridad.' },
            { id: 't6', label: 'Inclusión laboral de personas con discapacidad', dim: 'S', dimNombre: 'Social', icono: 'fa-wheelchair', color: '#569151', stakeholders: 'Grupos vulnerables y empleados', experto: 12, razon: 'Cumplimiento normativo y diferenciación como empleador responsable.' },
            { id: 't7', label: 'Gestión responsable de residuos industriales', dim: 'A', dimNombre: 'Ambiental', icono: 'fa-recycle', color: '#15803d', stakeholders: 'Comunidades aledañas y ambiente', experto: 10, razon: 'Mitiga riesgos legales y protege a stakeholders silenciosos: el entorno natural.' },
            { id: 't8', label: 'Capacitación en derechos laborales y ODS', dim: 'S', dimNombre: 'Social', icono: 'fa-graduation-cap', color: '#569151', stakeholders: 'Empleados y sindicatos', experto: 7, razon: 'Bajo costo, alto impacto cultural a largo plazo.' }
        ];
        const TABLERO_TOTAL = 100;
        let tableroStep = 0;
        let tableroValues = Array(8).fill(0);

        function renderTableroCard() {
            const ini = tableroIniciativas[tableroStep];
            const disponible = TABLERO_TOTAL - tableroValues.reduce((a, b) => a + b, 0) + tableroValues[tableroStep];
            const card = document.getElementById('tablero-card'); if (!card) return;
            card.innerHTML = `
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg flex-shrink-0" style="background:${ini.color}">
                        <i class="fa-solid ${ini.icono}"></i>
                    </div>
                    <div>
                        <p class="font-extrabold text-base leading-tight" style="color:var(--heading)">${ini.label}</p>
                        <p class="text-xs mt-0.5" style="color:var(--text)">Dimensión <strong style="color:${ini.color}">${ini.dim} — ${ini.dimNombre}</strong> · ${ini.stakeholders}</p>
                    </div>
                </div>
                <div class="flex items-center justify-between mb-2">
                    <label class="text-sm font-bold" style="color:var(--heading)">¿Cuánto asignas?</label>
                    <span class="text-2xl font-extrabold" style="color:var(--accent)" id="tablero-val-actual">$${tableroValues[tableroStep]}M</span>
                </div>
                <input type="range" id="tablero-slider-actual" min="0" max="${disponible + tableroValues[tableroStep]}" value="${tableroValues[tableroStep]}" step="1"
                    class="w-full h-3 rounded-lg appearance-none cursor-pointer mb-3" style="accent-color:var(--accent);"
                    oninput="onTableroSlide(${tableroStep}, this.value)">
                <p class="text-xs text-center" style="color:var(--text)">Disponible restante: <strong id="tablero-disp-inline">${disponible}M</strong> de ${TABLERO_TOTAL}M</p>`;
            const paso = document.getElementById('tablero-paso-label'); if (paso) paso.textContent = 'Iniciativa ' + (tableroStep + 1) + ' de ' + tableroIniciativas.length;
            const bar = document.getElementById('tablero-progress-bar'); if (bar) bar.style.width = ((tableroStep + 1) / tableroIniciativas.length * 100) + '%';
            actualizarRestanteTablero();
            const btnPrev = document.getElementById('tablero-btn-prev'); if (btnPrev) btnPrev.classList.toggle('hidden', tableroStep === 0);
            const btnNext = document.getElementById('tablero-btn-next'); if (btnNext) btnNext.classList.toggle('hidden', tableroStep === tableroIniciativas.length - 1);
            const btnVer = document.getElementById('tablero-btn-ver'); if (btnVer) btnVer.classList.toggle('hidden', tableroStep !== tableroIniciativas.length - 1);
        }

        function onTableroSlide(idx, val) {
            tableroValues[idx] = parseInt(val);
            const disp = TABLERO_TOTAL - tableroValues.reduce((a, b) => a + b, 0);
            const valEl = document.getElementById('tablero-val-actual'); if (valEl) valEl.textContent = '$' + val + 'M';
            const dispEl = document.getElementById('tablero-disp-inline'); if (dispEl) dispEl.textContent = disp + 'M';
            actualizarRestanteTablero();
        }

        function actualizarRestanteTablero() {
            const usado = tableroValues.reduce((a, b) => a + b, 0);
            const restEl = document.getElementById('tablero-restante'); if (restEl) restEl.textContent = '$' + (TABLERO_TOTAL - usado) + 'M disponibles';
        }

        function pasoTablero(dir) {
            tableroStep = Math.max(0, Math.min(tableroIniciativas.length - 1, tableroStep + dir));
            document.getElementById('tablero-resultado')?.classList.add('hidden');
            renderTableroCard();
        }

        function verResultadoTablero() {
            const usado = tableroValues.reduce((a, b) => a + b, 0);
            const res = document.getElementById('tablero-resultado'); if (!res) return;
            let html = '<p class="font-bold text-sm mb-3" style="color:var(--heading)">📊 Tu distribución vs. Propuesta experta</p>';
            tableroIniciativas.forEach((ini, i) => {
                const tuVal = tableroValues[i];
                const expVal = ini.experto;
                const diff = tuVal - expVal;
                const pct = (tuVal / TABLERO_TOTAL) * 100;
                const pctExp = (expVal / TABLERO_TOTAL) * 100;
                html += `<div class="mb-3 p-3 rounded-lg" style="background:var(--surface); border:1px solid var(--line)">
                    <p class="text-xs font-semibold mb-1" style="color:var(--heading)">${ini.label}</p>
                    <div class="flex items-center gap-2 mb-1"><span class="text-xs w-20 flex-shrink-0" style="color:var(--accent)">Tú: $${tuVal}M</span>
                    <div class="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden"><div class="h-full rounded-full" style="width:${pct}%;background:var(--accent);opacity:0.8;"></div></div></div>
                    <div class="flex items-center gap-2 mb-1"><span class="text-xs w-20 flex-shrink-0 text-gray-500">Exp: $${expVal}M</span>
                    <div class="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden"><div class="h-full rounded-full bg-gray-400" style="width:${pctExp}%;"></div></div></div>
                    <p class="text-xs ${diff > 5 ? 'text-blue-600' : diff < -5 ? 'text-red-500' : 'text-green-600'}">${diff > 5 ? '↑ Más de lo sugerido' : diff < -5 ? '↓ Menos de lo sugerido' : '✓ Alineado'} · ${ini.razon}</p></div>`;
            });
            html += `<p class="text-xs mt-2 p-3 rounded-lg" style="background:#f0f9ff;color:#0369a1">💡 Total invertido: $${usado}M de $${TABLERO_TOTAL}M. La propuesta experta prioriza equidad salarial y reducción de huella de carbono como pilares de mayor impacto ASG.</p>`;
            res.innerHTML = html; res.classList.remove('hidden');
        }

        function limpiarTablero() {
            tableroStep = 0; tableroValues = Array(8).fill(0);
            const res = document.getElementById('tablero-resultado'); if (res) { res.innerHTML = ''; res.classList.add('hidden'); }
            renderTableroCard();
            scrollToActividad();
        }

        function exportarTablero(formato) {
            const usado = tableroValues.reduce((a, b) => a + b, 0);
            if (usado === 0) { alert('Primero distribuye el presupuesto.'); return; }
            const lineas = tableroIniciativas.map((ini, i) => ini.label + ' (Dim. ' + ini.dim + '): $' + tableroValues[i] + 'M');
            const texto = 'TABLERO DE PRIORIZACIÓN RSE — Tema 2\nGerencia del Talento Humano y Desarrollo Organizacional\nUniversidad de Córdoba\n\nPresupuesto total: $' + TABLERO_TOTAL + 'M | Utilizado: $' + usado + 'M\n\nDISTRIBUCIÓN:\n' + lineas.join('\n');
            if (formato === 'txt') { descargarArchivo('tablero-rse.txt', texto, 'text/plain'); }
            else if (formato === 'word') { exportarComoWord('tablero-rse', '<h2>Tablero de Priorización RSE — Tema 2</h2><pre>' + texto + '</pre>'); }
        }

        function initTablero() { tableroStep = 0; tableroValues = Array(8).fill(0); renderTableroCard(); }

        // ===== ACTIVIDAD 2: VOTACIÓN DE STAKEHOLDERS =====
        const votosRoles = [
            { id: 'v1', rol: 'Gerente de Talento Humano', icono: 'fa-user-tie', color: '#569151', perfil: 'Lideras el área de personas de MinCo S.A. Tu prioridad es el bienestar de los 400 empleados potenciales y el cumplimiento de los compromisos ODS de la empresa.', dim: 'S — Social' },
            { id: 'v2', rol: 'Líder de comunidad campesina', icono: 'fa-house-flag', color: '#b45309', perfil: 'Representas a 3 comunidades rurales que dependen del agua del río que atraviesa la zona de la nueva planta. Tu prioridad es el agua, la tierra y el futuro de tus hijos.', dim: 'A — Ambiental' },
            { id: 'v3', rol: 'Inversionista de largo plazo', icono: 'fa-chart-line', color: '#1d4ed8', perfil: 'Tienes el 12% de las acciones de MinCo. Tu prioridad es el retorno sostenible: sabes que los proyectos con alto riesgo ambiental pueden devaluar la empresa ante fondos ESG.', dim: 'G — Gobernanza' }
        ];

        function renderVotos() {
            const cont = document.getElementById('votos-roles'); if (!cont) return;
            cont.innerHTML = votosRoles.map(r => `
                <div class="p-4 rounded-xl border" style="border-color: ${r.color}; border-left-width: 5px; background: var(--surface-soft);">
                    <div class="flex items-center gap-3 mb-2">
                        <div class="w-10 h-10 rounded-full flex items-center justify-center text-white" style="background:${r.color}"><i class="fa-solid ${r.icono}"></i></div>
                        <div><p class="font-bold text-sm" style="color:${r.color}">${r.rol}</p><p class="text-xs" style="color:var(--text)">Dimensión ${r.dim}</p></div>
                    </div>
                    <p class="text-xs leading-relaxed mb-3 italic" style="color:var(--text)">"${r.perfil}"</p>
                    <div class="flex flex-wrap gap-2 mb-3">
                        <label class="flex items-center gap-1.5 cursor-pointer text-sm font-semibold px-3 py-1.5 rounded-lg border" style="border-color:${r.color}">
                            <input type="radio" name="voto-${r.id}" value="apruebo"> ✅ Apruebo
                        </label>
                        <label class="flex items-center gap-1.5 cursor-pointer text-sm font-semibold px-3 py-1.5 rounded-lg border" style="border-color:${r.color}">
                            <input type="radio" name="voto-${r.id}" value="rechazo"> ❌ Rechazo
                        </label>
                        <label class="flex items-center gap-1.5 cursor-pointer text-sm font-semibold px-3 py-1.5 rounded-lg border" style="border-color:${r.color}">
                            <input type="radio" name="voto-${r.id}" value="abstención"> ⚖️ Me abstengo
                        </label>
                    </div>
                    <textarea id="arg-${r.id}" rows="2" maxlength="400" class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none" style="border-color:var(--line);" placeholder="Argumenta tu voto desde la perspectiva de este stakeholder..."></textarea>
                </div>
            `).join('');
        }

        function verPanelVotos() {
            const missing = votosRoles.filter(r => !document.querySelector(`input[name="voto-${r.id}"]:checked`) || !document.getElementById('arg-' + r.id)?.value.trim());
            if (missing.length > 0) { alert('Completa el voto y el argumento de todos los roles antes de continuar.'); return; }
            const panel = document.getElementById('votos-panel'); if (!panel) return;
            const votos = votosRoles.map(r => ({ rol: r.rol, icono: r.icono, color: r.color, voto: document.querySelector(`input[name="voto-${r.id}"]:checked`)?.value || '', arg: document.getElementById('arg-' + r.id)?.value || '' }));
            const aprueba = votos.filter(v => v.voto === 'apruebo').length;
            const rechaza = votos.filter(v => v.voto === 'rechazo').length;
            const decision = aprueba > rechaza ? '🟡 El proyecto se APROBARÍA con reservas' : aprueba < rechaza ? '🔴 El proyecto se RECHAZARÍA' : '⚖️ Empate — se requiere mediación';
            let html = `<div class="p-4 rounded-xl text-center mb-4" style="background:var(--surface-soft); border: 2px solid var(--accent)"><p class="font-extrabold text-lg" style="color:var(--heading)">Resultado del panel de stakeholders</p><p class="text-base font-bold mt-1">${decision}</p><p class="text-xs mt-2" style="color:var(--text)">Aprueba: ${aprueba} · Rechaza: ${rechaza} · Abstención: ${3 - aprueba - rechaza}</p></div>`;
            votos.forEach(v => { html += `<div class="p-3 rounded-lg border mb-2" style="border-left: 4px solid ${v.color}; background:var(--surface-soft)"><p class="font-bold text-sm" style="color:${v.color}"><i class="fa-solid ${v.icono} mr-1"></i>${v.rol} → ${v.voto.toUpperCase()}</p><p class="text-xs mt-1 leading-relaxed" style="color:var(--text)">${v.arg}</p></div>`; });
            html += `<div class="mt-3 p-3 rounded-lg text-xs" style="background:#f0f9ff; color:#0369a1">💡 Este ejercicio ilustra la Teoría de Stakeholders de Freeman: las decisiones organizacionales sostenibles requieren considerar voces con diferente influencia y legitimidad, incluyendo las comunidades y las generaciones futuras como stakeholders silenciosos.</div>`;
            panel.innerHTML = html; panel.classList.remove('hidden');
        }

        function limpiarVotos() {
            votosRoles.forEach(r => { const radios = document.querySelectorAll(`input[name="voto-${r.id}"]`); radios.forEach(rb => rb.checked = false); const ta = document.getElementById('arg-' + r.id); if (ta) ta.value = ''; });
            const p = document.getElementById('votos-panel'); if (p) { p.innerHTML = ''; p.classList.add('hidden'); }
            scrollToActividad();
        }

        function exportarVotos(formato) {
            const missing = votosRoles.filter(r => !document.querySelector(`input[name="voto-${r.id}"]:checked`));
            if (missing.length > 0) { alert('Completa todos los votos antes de exportar.'); return; }
            const votos = votosRoles.map(r => ({ rol: r.rol, voto: document.querySelector(`input[name="voto-${r.id}"]:checked`)?.value || '', arg: document.getElementById('arg-' + r.id)?.value || '' }));
            const texto = `VOTACIÓN DE STAKEHOLDERS — Tema 2\nGerencia del Talento Humano y Desarrollo Organizacional\nUniversidad de Córdoba\n\nDilema: Expansión de MinCo S.A. en San Marcos, Sucre.\n\n${votos.map(v => `ROL: ${v.rol}\nVoto: ${v.voto.toUpperCase()}\nArgumento: ${v.arg}`).join('\n\n')}`;
            if (formato === 'txt') { descargarArchivo('votacion-stakeholders.txt', texto, 'text/plain'); }
            else if (formato === 'word') { exportarComoWord('votacion-stakeholders', '<h2>Votación de Stakeholders — Tema 2</h2>' + votos.map(v => `<h3>${v.rol} → ${v.voto}</h3><p>${v.arg}</p>`).join('')); }
        }

        function initVotos() { renderVotos(); }

        // ===== ACTIVIDAD 3: DETECTA LA PRÁCTICA RSE (paginada) =====
        const detectaNoticias = [
            { titular: 'Ecopetrol publica su primer informe de sostenibilidad bajo estándares GRI con metas de carbono neutro al 2050.', dimCorrecta: 'G', stkCorrecto: 'inversionistas', tipoCorrecto: 'buena', expDim: 'Gobernanza (G): los informes de sostenibilidad son mecanismos de rendición de cuentas y transparencia corporativa.', expStk: 'Inversionistas y sociedad en general son los principales beneficiados de la transparencia.', expTipo: 'Buena práctica: compromisos medibles, verificables y alineados con estándares internacionales GRI.' },
            { titular: 'Empresa textil lanza colección "eco-friendly" fabricada con telas convencionales, pero la empaca en bolsas biodegradables y la publicita como "100% sostenible".', dimCorrecta: 'A', stkCorrecto: 'consumidores', tipoCorrecto: 'greenwashing', expDim: 'Ambiental (A): el discurso apunta a lo ambiental, pero sin cambio real en el proceso productivo.', expStk: 'Los consumidores son el público objetivo del engaño — se les vende sostenibilidad sin sustancia.', expTipo: 'Greenwashing: el cambio es cosmético. El proceso productivo no cambia — clásico caso de lavado verde.' },
            { titular: 'Bavaria implementa política de equidad salarial certificada, garantizando igual remuneración entre hombres y mujeres en todos los niveles jerárquicos.', dimCorrecta: 'S', stkCorrecto: 'empleados', tipoCorrecto: 'buena', expDim: 'Social (S): la equidad salarial es un pilar central del componente social desde la gestión de Talento Humano.', expStk: 'Los empleados, especialmente mujeres, son los beneficiarios directos de esta política.', expTipo: 'Buena práctica: política verificable, con certificación independiente y compromisos concretos y medibles.' },
            { titular: 'Empresa de telecomunicaciones dona árboles por cada plan vendido, pero no divulga cuántos árboles sobreviven ni dónde se plantan.', dimCorrecta: 'A', stkCorrecto: 'consumidores', tipoCorrecto: 'greenwashing', expDim: 'Ambiental (A): la promesa de plantar árboles apunta directamente a la dimensión ambiental.', expStk: 'Los consumidores son el público objetivo del mensaje, pero no los verdaderos beneficiados.', expTipo: 'Greenwashing: sin trazabilidad, sin métricas públicas ni verificación independiente del impacto real.' },
            { titular: 'Alpina implementa un canal ético anónimo para denuncias de acoso y corrupción, con seguimiento independiente y reporte público de casos resueltos.', dimCorrecta: 'G', stkCorrecto: 'empleados', tipoCorrecto: 'buena', expDim: 'Gobernanza (G): los mecanismos de denuncia y anticorrupción son el núcleo del pilar de gobernanza.', expStk: 'Los empleados son los principales usuarios y beneficiados de los canales éticos internos.', expTipo: 'Buena práctica: tiene anonimato, seguimiento externo y transparencia en resultados — estándares GRI G4.' },
            { titular: 'Constructora incluye en su informe anual el logo de los 17 ODS sin describir ninguna meta, indicador ni acción concreta asociada a ninguno de ellos.', dimCorrecta: 'G', stkCorrecto: 'inversionistas', tipoCorrecto: 'greenwashing', expDim: 'Gobernanza (G): el uso de ODS en reportes corporativos es un mecanismo de transparencia y gobernanza.', expStk: 'Inversionistas e instituciones son los destinatarios de este tipo de informe anual.', expTipo: 'Greenwashing (SDG-washing): usar los logos ODS sin compromisos concretos es una práctica engañosa cada vez más denunciada.' }
        ];
        let detectaStep = 0;
        let detectaResultados = [];

        function renderDetectaCard() {
            const n = detectaNoticias[detectaStep];
            const card = document.getElementById('detecta-card'); if (!card) return;
            const ya = detectaResultados[detectaStep];
            const fbHtml = ya ? `<div class="mt-4 p-3 rounded-lg space-y-1.5 text-xs" style="background:var(--surface);border:1px solid var(--line)">
                <p class="${ya.dimOk ? 'text-green-700' : 'text-red-600'}"><strong>Dimensión:</strong> ${ya.dimOk ? '✓ Correcto' : '✗ Incorrecto'} — ${n.expDim}</p>
                <p class="${ya.stkOk ? 'text-green-700' : 'text-red-600'}"><strong>Stakeholders:</strong> ${ya.stkOk ? '✓ Correcto' : '✗ Incorrecto'} — ${n.expStk}</p>
                <p class="${ya.tipoOk ? 'text-green-700' : 'text-red-600'}"><strong>Tipo:</strong> ${ya.tipoOk ? '✓ Correcto' : '✗ Incorrecto'} — ${n.expTipo}</p>
                <p class="font-bold pt-1" style="color:var(--heading)">Puntuación: ${ya.score}/3</p>
            </div>` : '';
            card.innerHTML = `
                <p class="text-xs font-bold uppercase tracking-widest mb-3" style="color:var(--accent)">Noticia ${detectaStep + 1} de ${detectaNoticias.length}</p>
                <p class="text-sm leading-relaxed font-semibold mb-5" style="color:var(--heading)">"${n.titular}"</p>
                <div class="grid grid-cols-1 gap-3">
                    <div>
                        <label class="block text-xs font-bold mb-1" style="color:var(--text)">¿Qué dimensión ASG representa?</label>
                        <select id="detecta-dim" class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none" style="border-color:var(--line);" ${ya ? 'disabled' : ''}>
                            <option value="">Selecciona...</option>
                            <option value="A" ${ya && ya.dim==='A' ? 'selected' : ''}>A — Ambiental</option>
                            <option value="S" ${ya && ya.dim==='S' ? 'selected' : ''}>S — Social</option>
                            <option value="G" ${ya && ya.dim==='G' ? 'selected' : ''}>G — Gobernanza</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold mb-1" style="color:var(--text)">¿Qué stakeholders están involucrados?</label>
                        <select id="detecta-stk" class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none" style="border-color:var(--line);" ${ya ? 'disabled' : ''}>
                            <option value="">Selecciona...</option>
                            <option value="empleados" ${ya && ya.stk==='empleados' ? 'selected' : ''}>Empleados</option>
                            <option value="consumidores" ${ya && ya.stk==='consumidores' ? 'selected' : ''}>Consumidores</option>
                            <option value="inversionistas" ${ya && ya.stk==='inversionistas' ? 'selected' : ''}>Inversionistas</option>
                            <option value="comunidades" ${ya && ya.stk==='comunidades' ? 'selected' : ''}>Comunidades</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold mb-1" style="color:var(--text)">¿Buena práctica o greenwashing?</label>
                        <select id="detecta-tipo" class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none" style="border-color:var(--line);" ${ya ? 'disabled' : ''}>
                            <option value="">Selecciona...</option>
                            <option value="buena" ${ya && ya.tipo==='buena' ? 'selected' : ''}>✅ Buena práctica</option>
                            <option value="greenwashing" ${ya && ya.tipo==='greenwashing' ? 'selected' : ''}>⚠️ Greenwashing</option>
                        </select>
                    </div>
                </div>
                ${fbHtml}`;
            const paso = document.getElementById('detecta-paso-label'); if (paso) paso.textContent = 'Noticia ' + (detectaStep + 1) + ' de ' + detectaNoticias.length;
            const bar = document.getElementById('detecta-progress-bar'); if (bar) bar.style.width = ((detectaStep + 1) / detectaNoticias.length * 100) + '%';
            const totalCorr = detectaResultados.filter(Boolean).reduce((a, r) => a + r.score, 0);
            const totalMax = detectaResultados.filter(Boolean).length * 3;
            const mini = document.getElementById('detecta-score-mini'); if (mini) mini.textContent = totalCorr + ' / ' + totalMax + ' correctas';
            const btnVerif = document.getElementById('detecta-btn-verificar'); if (btnVerif) btnVerif.classList.toggle('hidden', !!ya);
            const btnNext = document.getElementById('detecta-btn-next');
            if (btnNext) btnNext.classList.toggle('hidden', !ya || detectaStep === detectaNoticias.length - 1);
            const btnPrev = document.getElementById('detecta-btn-prev'); if (btnPrev) btnPrev.classList.toggle('hidden', detectaStep === 0);
            if (ya && detectaStep === detectaNoticias.length - 1 && detectaResultados.filter(Boolean).length === detectaNoticias.length) mostrarResultadoGlobal();
        }

        function verificarNoticiaActual() {
            const n = detectaNoticias[detectaStep];
            const dim = document.getElementById('detecta-dim')?.value;
            const stk = document.getElementById('detecta-stk')?.value;
            const tipo = document.getElementById('detecta-tipo')?.value;
            if (!dim || !stk || !tipo) { alert('Selecciona una opción en los tres criterios.'); return; }
            const dimOk = dim === n.dimCorrecta;
            const stkOk = stk === n.stkCorrecto;
            const tipoOk = tipo === n.tipoCorrecto;
            detectaResultados[detectaStep] = { dim, stk, tipo, dimOk, stkOk, tipoOk, score: [dimOk, stkOk, tipoOk].filter(Boolean).length };
            renderDetectaCard();
        }

        function pasoDetecta(dir) {
            detectaStep = Math.max(0, Math.min(detectaNoticias.length - 1, detectaStep + dir));
            const rg = document.getElementById('detecta-resultado-global'); if (rg) rg.classList.add('hidden');
            renderDetectaCard();
        }

        function mostrarResultadoGlobal() {
            const total = detectaResultados.filter(Boolean).reduce((a, r) => a + r.score, 0);
            const max = detectaNoticias.length * 3;
            const pct = Math.round((total / max) * 100);
            const nivel = pct >= 80 ? '🟢 Excelente — dominas la identificación de prácticas RSE' : pct >= 55 ? '🟡 Bien encaminado — refuerza los conceptos de greenwashing' : '🔴 En proceso — revisa las dimensiones ASG y sus aplicaciones';
            const rg = document.getElementById('detecta-resultado-global');
            if (!rg) return;
            rg.innerHTML = `<p class="font-extrabold text-lg mb-1" style="color:var(--heading)">Resultado global</p><p class="text-4xl font-black my-2" style="color:var(--accent)">${pct}%</p><p class="text-sm">${total} / ${max} respuestas correctas</p><p class="mt-3 font-semibold">${nivel}</p>`;
            rg.classList.remove('hidden');
        }

        function reiniciarDetecta() {
            detectaStep = 0; detectaResultados = [];
            const rg = document.getElementById('detecta-resultado-global'); if (rg) { rg.innerHTML = ''; rg.classList.add('hidden'); }
            renderDetectaCard();
            scrollToActividad();
        }

        function initDetecta() { detectaStep = 0; detectaResultados = []; renderDetectaCard(); }

        // ===== FLIP CARDS Y DOMContentLoaded =====
        document.addEventListener('DOMContentLoaded', function() {
            const flipCards = document.querySelectorAll('.flip-card');
            flipCards.forEach(card => {
                card.addEventListener('click', function() {
                    this.classList.toggle('flipped');
                });
            });

            initTablero();
            initVotos();
            initDetecta();
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
