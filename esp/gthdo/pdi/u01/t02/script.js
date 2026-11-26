/* Interacciones del OVA gthdo-pdi-u01-t02. */

        // Navegación sidebar
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                document.querySelectorAll('.content-pane').forEach(p => p.classList.remove('active'));
                document.getElementById(link.dataset.target).classList.add('active');
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

        // Quiz
        const quizData = [
            { q: "¿Qué diferencia fundamental existe entre un síntoma y una causa raíz en el contexto de intervención organizacional?", options: ["No existe diferencia; ambos son problemas iguales", "El síntoma es la manifestación visible del problema, mientras que la causa raíz es el origen profundo que genera dichos síntomas", "La causa raíz es más fácil de identificar que el síntoma", "Los síntomas solo existen en empresas grandes"], correct: 1 },
            { q: "¿Qué criterio NO forma parte de la evaluación de gravedad de un problema organizacional según el contenido del tema?", options: ["Alcance: ¿Cuántas áreas o personas se ven afectadas?", "Gravedad: ¿Cuál es el nivel de daño o riesgo?", "Urgencia: ¿Con qué rapidez se necesita una solución?", "Costo: ¿Cuánto dinero se ha gastado históricamente?"], correct: 3 },
            { q: "En la Matriz de Impacto vs. Esfuerzo, ¿qué tipo de intervención representa 'Alto Impacto, Bajo Esfuerzo'?", options: ["Proyectos estratégicos", "Victorias rápidas", "Tareas a descartar", "Tareas de relleno"], correct: 1 }
        ];

        let currentQ = 0;
        let answers = [];
        const quizBox = document.getElementById('quiz-box');
        const quizSummary = document.getElementById('quiz-summary');

        function renderQuiz() {
            document.getElementById('quiz-title').textContent = `Pregunta ${currentQ + 1}`;
            document.getElementById('quiz-progress').textContent = `${currentQ + 1}/${quizData.length}`;
            document.getElementById('quiz-text').textContent = quizData[currentQ].q;
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
                    html += `<div class="p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}"><p class="font-semibold">${i+1}. ${q.q}</p><p class="text-sm mt-2">Tu respuesta: ${String.fromCharCode(65+answers[i])}. ${q.options[answers[i]]}</p>${!isCorrect ? `<p class="text-sm mt-1 text-green-700">Correcta: ${String.fromCharCode(65+q.correct)}. ${q.options[q.correct]}</p>` : ''}</div>`;
                });
                html += `<p class="text-center font-bold text-lg mt-4">Puntuación: ${correct}/${quizData.length} (${Math.round(correct/quizData.length*100)}%)</p>`;
                document.getElementById('summary-content').innerHTML = html;
            }
        });

        document.getElementById('quiz-prev').addEventListener('click', () => { if (currentQ > 0) { currentQ--; renderQuiz(); } });
        document.getElementById('quiz-restart').addEventListener('click', () => { currentQ = 0; answers = []; quizBox.classList.remove('hidden'); quizSummary.classList.add('hidden'); renderQuiz(); });

        // ===== SIMULADOR MATRIZ IMPACTO VS. ESFUERZO =====
        const SIM_MAX = 4;
        let simCount = 0;

        const cuadrantes = [
            { id: 'vr',  label: 'Victorias Rápidas',     icon: 'fa-rocket',     bg: '#f0fdf4', border: '#86efac', text: '#166534', desc: 'Prioridad inmediata. Alto retorno con inversión mínima.' },
            { id: 'pe',  label: 'Proyectos Estratégicos', icon: 'fa-chess-king', bg: '#eff6ff', border: '#93c5fd', text: '#1e3a8a', desc: 'Requieren planificación cuidadosa y respaldo ejecutivo.' },
            { id: 'tr',  label: 'Tareas de Relleno',      icon: 'fa-clock',      bg: '#fefce8', border: '#fde047', text: '#854d0e', desc: 'Realizar solo cuando haya tiempo disponible.' },
            { id: 'des', label: 'Descartar',              icon: 'fa-trash',      bg: '#fef2f2', border: '#fca5a5', text: '#991b1b', desc: 'Consumen recursos sin retorno significativo. Evitar.' }
        ];

        function simGetCuadrante(impacto, esfuerzo) {
            if (impacto >= 3 && esfuerzo < 3) return cuadrantes[0];
            if (impacto >= 3 && esfuerzo >= 3) return cuadrantes[1];
            if (impacto < 3 && esfuerzo < 3)  return cuadrantes[2];
            return cuadrantes[3];
        }

        function simAddRow() {
            if (simCount >= SIM_MAX) return;
            simCount++;
            const n = simCount;
            const container = document.getElementById('sim-rows');
            const row = document.createElement('div');
            row.id = `sim-row-${n}`;
            row.className = 'p-5 rounded-xl border-2';
            row.style.cssText = 'background: var(--surface-soft); border-color: var(--line);';
            row.innerHTML = `
                <div class="flex items-center justify-between mb-3">
                    <label class="font-bold" style="color: var(--heading);"><i class="fa-solid fa-circle-${n} mr-2" style="color: var(--accent);"></i>Problema / Iniciativa ${n}</label>
                    ${n > 1 ? `<button type="button" onclick="simRemoveRow(${n})" class="text-xs text-red-400 hover:text-red-600 flex items-center gap-1"><i class="fa-solid fa-xmark"></i> Eliminar</button>` : ''}
                </div>
                <input type="text" id="sim-nombre-${n}" maxlength="120" class="w-full p-3 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-green-600 mb-4" style="border-color: var(--line);" placeholder="Describe el problema o iniciativa...">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-bold mb-1" style="color: var(--heading);">Impacto <span class="font-normal text-xs" style="color:#6c757d;">(1 = muy bajo · 5 = muy alto)</span></label>
                        <select id="sim-impacto-${n}" class="w-full p-3 rounded-lg border bg-white" style="border-color: var(--line);">
                            <option value="0">— Selecciona —</option>
                            <option value="1">1 - Muy bajo</option>
                            <option value="2">2 - Bajo</option>
                            <option value="3">3 - Medio</option>
                            <option value="4">4 - Alto</option>
                            <option value="5">5 - Muy alto</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-bold mb-1" style="color: var(--heading);">Esfuerzo <span class="font-normal text-xs" style="color:#6c757d;">(1 = muy bajo · 5 = muy alto)</span></label>
                        <select id="sim-esfuerzo-${n}" class="w-full p-3 rounded-lg border bg-white" style="border-color: var(--line);">
                            <option value="0">— Selecciona —</option>
                            <option value="1">1 - Muy bajo</option>
                            <option value="2">2 - Bajo</option>
                            <option value="3">3 - Medio</option>
                            <option value="4">4 - Alto</option>
                            <option value="5">5 - Muy alto</option>
                        </select>
                    </div>
                </div>
                <div id="sim-tag-${n}" class="mt-3 hidden">
                    <span class="text-xs font-bold px-3 py-1 rounded-full" id="sim-tag-label-${n}"></span>
                </div>`;
            container.appendChild(row);
            if (simCount >= SIM_MAX) document.getElementById('sim-add-btn').disabled = true;
        }

        function simRemoveRow(n) {
            const row = document.getElementById(`sim-row-${n}`);
            if (row) row.remove();
            simCount--;
            document.getElementById('sim-add-btn').disabled = false;
            document.getElementById('sim-results').classList.add('hidden');
        }

        function simClasificar() {
            const rows = document.getElementById('sim-rows').querySelectorAll('[id^="sim-row-"]');
            if (rows.length === 0) { alert('Agrega al menos un problema antes de clasificar.'); return; }

            let validos = 0;
            let agrupados = { vr: [], pe: [], tr: [], des: [] };

            rows.forEach(row => {
                const n = row.id.replace('sim-row-', '');
                const nombre = document.getElementById(`sim-nombre-${n}`)?.value.trim() || '';
                const impacto = parseInt(document.getElementById(`sim-impacto-${n}`)?.value || '0');
                const esfuerzo = parseInt(document.getElementById(`sim-esfuerzo-${n}`)?.value || '0');

                if (!nombre || impacto === 0 || esfuerzo === 0) {
                    document.getElementById(`sim-tag-${n}`).classList.add('hidden');
                    return;
                }
                validos++;
                const cuad = simGetCuadrante(impacto, esfuerzo);
                agrupados[cuad.id].push({ nombre, impacto, esfuerzo, cuad });

                const tagEl = document.getElementById(`sim-tag-${n}`);
                const tagLabel = document.getElementById(`sim-tag-label-${n}`);
                tagEl.classList.remove('hidden');
                tagLabel.textContent = `→ ${cuad.label}`;
                tagLabel.style.cssText = `background: ${cuad.bg}; color: ${cuad.text}; border: 1px solid ${cuad.border};`;
            });

            if (validos === 0) { alert('Completa al menos un problema con nombre, impacto y esfuerzo.'); return; }

            const grid = document.getElementById('sim-results-grid');
            grid.innerHTML = '';
            cuadrantes.forEach(c => {
                const items = agrupados[c.id];
                const card = document.createElement('div');
                card.className = 'p-4 rounded-xl border-2';
                card.style.cssText = `background: ${c.bg}; border-color: ${c.border};`;
                let itemsHtml = items.length > 0
                    ? items.map(i => `<li class="text-sm mt-1"><strong>${i.nombre}</strong> <span style="color:#6c757d;">(I:${i.impacto} / E:${i.esfuerzo})</span></li>`).join('')
                    : `<li class="text-sm mt-1" style="color:#9ca3af;">Ningún elemento clasificado aquí.</li>`;
                card.innerHTML = `
                    <div class="flex items-center gap-2 mb-2">
                        <i class="fa-solid ${c.icon} text-lg" style="color: ${c.text};"></i>
                        <span class="font-bold text-sm" style="color: ${c.text};">${c.label}</span>
                    </div>
                    <p class="text-xs mb-3" style="color: ${c.text}; opacity: 0.8;">${c.desc}</p>
                    <ul class="space-y-1">${itemsHtml}</ul>`;
                grid.appendChild(card);
            });
            document.getElementById('sim-results').classList.remove('hidden');
        }

        function simToggleExport() {
            document.getElementById('sim-export-menu').classList.toggle('hidden');
        }

        document.addEventListener('click', (e) => {
            const dd = document.getElementById('sim-export-dropdown');
            const menu = document.getElementById('sim-export-menu');
            if (dd && menu && !dd.contains(e.target)) menu.classList.add('hidden');
        });

        function simGetData() {
            const rows = document.getElementById('sim-rows').querySelectorAll('[id^="sim-row-"]');
            const data = [];
            rows.forEach(row => {
                const n = row.id.replace('sim-row-', '');
                const nombre = document.getElementById(`sim-nombre-${n}`)?.value.trim() || '';
                const impacto = parseInt(document.getElementById(`sim-impacto-${n}`)?.value || '0');
                const esfuerzo = parseInt(document.getElementById(`sim-esfuerzo-${n}`)?.value || '0');
                if (nombre && impacto > 0 && esfuerzo > 0) {
                    data.push({ nombre, impacto, esfuerzo, cuad: simGetCuadrante(impacto, esfuerzo).label });
                }
            });
            return data;
        }

        function simExportar(tipo) {
            const data = simGetData();
            if (data.length === 0) { alert('Clasifica al menos un problema antes de exportar.'); return; }
            document.getElementById('sim-export-menu').classList.add('hidden');

            if (tipo === 'txt') {
                let text = `SIMULADOR MATRIZ IMPACTO VS. ESFUERZO - TEMA 2\n${'='.repeat(48)}\n\n`;
                data.forEach((d, i) => {
                    text += `${i+1}. ${d.nombre}\n   Impacto: ${d.impacto}  |  Esfuerzo: ${d.esfuerzo}\n   Clasificación: ${d.cuad}\n\n`;
                });
                text += `---\nGenerado desde OVA Gerencia del Talento Humano - Tema 2`;
                const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = 'Matriz_Impacto_Esfuerzo.txt';
                document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
            } else {
                let rows = data.map(d => `<tr><td style="padding:6px 12px;border:1px solid #dee2e6;">${d.nombre}</td><td style="padding:6px 12px;border:1px solid #dee2e6;text-align:center;">${d.impacto}</td><td style="padding:6px 12px;border:1px solid #dee2e6;text-align:center;">${d.esfuerzo}</td><td style="padding:6px 12px;border:1px solid #dee2e6;">${d.cuad}</td></tr>`).join('');
                const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Matriz Impacto vs. Esfuerzo</title></head><body><h2>Simulador Matriz Impacto vs. Esfuerzo — Tema 2</h2><table style="border-collapse:collapse;width:100%;"><thead><tr style="background:#569151;color:white;"><th style="padding:8px 12px;border:1px solid #dee2e6;">Problema / Iniciativa</th><th style="padding:8px 12px;border:1px solid #dee2e6;">Impacto</th><th style="padding:8px 12px;border:1px solid #dee2e6;">Esfuerzo</th><th style="padding:8px 12px;border:1px solid #dee2e6;">Clasificación</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
                const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = 'Matriz_Impacto_Esfuerzo.doc';
                document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
            }
        }

        function simLimpiar() {
            document.getElementById('sim-rows').innerHTML = '';
            document.getElementById('sim-results').classList.add('hidden');
            simCount = 0;
            document.getElementById('sim-add-btn').disabled = false;
            simAddRow();
            document.getElementById('actividad').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        document.getElementById('sim-add-btn').addEventListener('click', simAddRow);
        simAddRow();

        renderQuiz();

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

// Matriz Impacto vs. Esfuerzo: 2 problemas por pantalla; "Agregar" lleva a la pantalla nueva.
document.addEventListener('DOMContentLoaded', function () {
  pantallasDeDosPorHijos(document.getElementById('sim-rows'), { finales: false, alCrecer: 'ultima' });
});
