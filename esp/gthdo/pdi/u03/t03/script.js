/* Interacciones del OVA gthdo-pdi-u03-t03. */



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



        // Quiz - Preguntas del Tema 3: Valor Compartido (CSV)

        const quizData = [

            { 

                q: "¿Cuál es la diferencia fundamental entre la RSE tradicional y la Creación de Valor Compartido (CSV)?", 

                options: [
                    "La RSE es obligatoria por ley, mientras que el CSV es voluntario y opcional para las empresas",
                    "No hay diferencia real: ambos conceptos describen las mismas prácticas empresariales con distinto nombre",
                    "El CSV se enfoca exclusivamente en el medio ambiente, mientras que la RSE abarca temas sociales y de gobernanza",
                    "La RSE distribuye valor ya creado mediante donaciones, mientras que el CSV expande simultáneamente el valor económico y social"
                ], 

                correct: 3,
                explicaciones: ["No es la respuesta. La diferencia no es legal: ambas son, en general, decisiones voluntarias de la empresa.", "No es la respuesta. Sí hay diferencia: el Valor Compartido integra lo social en el modelo de negocio, en vez de tratarlo como algo aparte.", "No es la respuesta. El Valor Compartido no se limita al medio ambiente.", "Correcto. La RSE tradicional reparte valor ya creado (donaciones, filantropía); el Valor Compartido crea a la vez valor económico y social."] 

            },

            { 

                q: "Según Porter y Kramer (2011), ¿cuáles son las tres vías para crear Valor Compartido?", 

                options: [
                    "Reducción de costos, aumento de ventas y mejora de la imagen corporativa",
                    "Reinventar productos y mercados, redefinir la productividad en la cadena de valor y desarrollar clusters locales",
                    "Filantropía estratégica, voluntariado corporativo y reportes de sostenibilidad GRI",
                    "Gestión ambiental, inclusión laboral y cumplimiento de los ODS de la ONU"
                ], 

                correct: 1,
                explicaciones: ["No es la respuesta. Reducir costos o mejorar la imagen no son las vías que proponen Porter y Kramer.", "Correcto. Porter y Kramer proponen reinventar productos y mercados, redefinir la productividad en la cadena de valor y desarrollar clusters locales.", "No es la respuesta. Filantropía, voluntariado y reportes GRI son prácticas de RSE, no las tres vías del Valor Compartido.", "No es la respuesta. Son temas de sostenibilidad, pero no las tres vías definidas por Porter y Kramer."] 

            },

            { 

                q: "¿Cuál es el rol del gerente de Talento Humano en una estrategia de Creación de Valor Compartido?", 

                options: [
                    "Liderar iniciativas que mejoren el bienestar de los empleados y la comunidad, generando simultáneamente mayor productividad y competitividad",
                    "Supervisar exclusivamente el cumplimiento legal de las normas laborales vigentes",
                    "Diseñar campañas de publicidad que comuniquen las iniciativas sociales de la empresa",
                    "Gestionar los reportes financieros de sostenibilidad para los inversionistas externos"
                ], 

                correct: 0,
                explicaciones: ["Correcto. Talento Humano lidera iniciativas que mejoran el bienestar de empleados y comunidad y, al mismo tiempo, elevan la productividad y la competitividad.", "No es la respuesta. Cumplir la ley laboral es necesario, pero no basta para crear Valor Compartido.", "No es la respuesta. La comunicación publicitaria no es el aporte central de Talento Humano al Valor Compartido.", "No es la respuesta. Los reportes financieros de sostenibilidad no son el rol de Talento Humano en esta estrategia."] 

            },

            { 
                q: "Según el tema, ¿por qué problemas sociales como la falta de capacitación, el ausentismo o la rotación representan una oportunidad de Valor Compartido?", 
                options: [
                    "Porque la ley obliga a las empresas a resolverlos mediante donaciones",
                    "Porque son responsabilidad exclusiva del Estado y la empresa solo debe acompañarlos",
                    "Porque en realidad son costos empresariales que la empresa puede resolver con rentabilidad",
                    "Porque resolverlos mejora la imagen corporativa, aunque no cambie la rentabilidad"
                ],
                correct: 2,
                explicaciones: ["No es la respuesta. El Valor Compartido no parte de una obligación legal ni de las donaciones: integra lo social en la estrategia del negocio.", "No es la respuesta. El Valor Compartido plantea lo contrario: la empresa puede y debe atender estos problemas desde su propio negocio.", "Correcto. Según la intersección estratégica, la falta de capacitación, el ausentismo y la rotación son costos empresariales; resolverlos genera a la vez valor social y rentabilidad.", "No es la respuesta. No se trata de imagen: resolver estos problemas reduce costos y aumenta la productividad, es decir, sí mejora la rentabilidad."]
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

        document.getElementById('quiz-restart').addEventListener('click', () => { currentQ = 0; answers = []; quizBox.classList.remove('hidden'); quizSummary.classList.add('hidden'); renderQuiz(); quizBox.scrollIntoView({ behavior: 'smooth', block: 'start' }); });



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



        // ===== ACTIVIDAD 1: ANÁLISIS DE CASO RSE vs CSV =====
        const casosSituaciones = [
            { empresa: 'Nestlé — Plan Nescafé', situacion: 'Nestlé rediseñó su proceso de compra de café trabajando directamente con pequeños agricultores empobrecidos: les brindó asesoría agronómica, acceso a insumos y pagó un sobreprecio por granos de mayor calidad. El resultado fue triple: los agricultores aumentaron sus ingresos, el impacto ambiental de las fincas disminuyó y Nestlé aseguró un suministro confiable de café de alta calidad.', correcta: 'cadena', opciones: [ { valor: 'rse', etiqueta: 'RSE tradicional — filantropía o donación' }, { valor: 'productos', etiqueta: 'CVC Vía 1 — Reinventar productos y mercados' }, { valor: 'cadena', etiqueta: 'CVC Vía 2 — Redefinir productividad en la cadena de valor' }, { valor: 'cluster', etiqueta: 'CVC Vía 3 — Desarrollar clusters locales' } ], explicacion: 'Es la Vía 2 (cadena de valor). Nestlé no dona — transforma su cadena de abastecimiento mejorando condiciones sociales y ambientales de proveedores, generando simultáneamente valor económico (mejor café, menor costo de riesgo) y valor social (ingresos dignos para agricultores).' },
            { empresa: 'Empresa de telecomunicaciones — Programa Escuelas Conectadas', situacion: 'Una empresa de telecomunicaciones dona computadores y conexión a internet a 50 escuelas rurales como parte de su programa de RSE anual, sin ningún vínculo con su modelo de negocio ni con expansión de mercado. El programa tiene cobertura mediática y mejora la imagen corporativa.', correcta: 'rse', opciones: [ { valor: 'rse', etiqueta: 'RSE tradicional — filantropía o donación' }, { valor: 'productos', etiqueta: 'CVC Vía 1 — Reinventar productos y mercados' }, { valor: 'cadena', etiqueta: 'CVC Vía 2 — Redefinir productividad en la cadena de valor' }, { valor: 'cluster', etiqueta: 'CVC Vía 3 — Desarrollar clusters locales' } ], explicacion: 'Es RSE tradicional. La donación no está conectada a la estrategia de negocio ni genera expansión de mercado. Distribuye valor ya creado sin expandir el valor económico y social simultáneamente, que es la clave del CSV.' },
            { empresa: 'Patagonia — Materiales reciclados y reparación de prendas', situacion: 'Patagonia rediseñó toda su línea de productos usando materiales reciclados y lanzó el programa "Worn Wear" para reparar prendas usadas y revenderlas. Esto redujo la huella ambiental, abrió un nuevo segmento de mercado de consumidores conscientes y diferenció la marca en un mercado saturado.', correcta: 'productos', opciones: [ { valor: 'rse', etiqueta: 'RSE tradicional — filantropía o donación' }, { valor: 'productos', etiqueta: 'CVC Vía 1 — Reinventar productos y mercados' }, { valor: 'cadena', etiqueta: 'CVC Vía 2 — Redefinir productividad en la cadena de valor' }, { valor: 'cluster', etiqueta: 'CVC Vía 3 — Desarrollar clusters locales' } ], explicacion: 'Es la Vía 1 (productos y mercados). Patagonia identificó una necesidad social real (consumo responsable) y la convirtió en propuesta de valor central. Resultado: nuevo mercado, ventaja competitiva y reducción de impacto ambiental — valor compartido genuino.' },
            { empresa: 'Empresa láctea colombiana — Proveedores locales', situacion: 'Una empresa láctea en Córdoba capacitó a 200 ganaderos locales en buenas prácticas de ordeño, manejo sanitario e inocuidad. Creó un centro de acopio propio y garantizó compra directa a precio justo. Esto mejoró la calidad de la leche recibida, redujo intermediarios y fortaleció la economía ganadera regional.', correcta: 'cluster', opciones: [ { valor: 'rse', etiqueta: 'RSE tradicional — filantropía o donación' }, { valor: 'productos', etiqueta: 'CVC Vía 1 — Reinventar productos y mercados' }, { valor: 'cadena', etiqueta: 'CVC Vía 2 — Redefinir productividad en la cadena de valor' }, { valor: 'cluster', etiqueta: 'CVC Vía 3 — Desarrollar clusters locales' } ], explicacion: 'Es la Vía 3 (clusters locales). La empresa fortaleció el ecosistema productivo de sus proveedores locales. Al mejorar las capacidades del entorno, se beneficia directamente: mejor materia prima, menor costo logístico y desarrollo económico regional.' },
            { empresa: 'Banco colombiano — Crédito para base de la pirámide', situacion: 'Un banco diseñó un producto financiero simplificado (microcrédito digital sin fiador) dirigido específicamente a emprendedores informales de estratos 1 y 2 que históricamente no podían acceder al sistema bancario. El producto generó utilidades, amplió la base de clientes y promovió la inclusión financiera.', correcta: 'productos', opciones: [ { valor: 'rse', etiqueta: 'RSE tradicional — filantropía o donación' }, { valor: 'productos', etiqueta: 'CVC Vía 1 — Reinventar productos y mercados' }, { valor: 'cadena', etiqueta: 'CVC Vía 2 — Redefinir productividad en la cadena de valor' }, { valor: 'cluster', etiqueta: 'CVC Vía 3 — Desarrollar clusters locales' } ], explicacion: 'Es la Vía 1 (productos y mercados). El banco identificó una necesidad social no resuelta (exclusión financiera) y la convirtió en un negocio rentable. Resolver un problema social real abriendo simultáneamente un mercado nuevo y lucrativo es el ejemplo clásico de CSV.' }
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
            const fbHtml = ya ? `<div class="mt-4 p-3 rounded-lg text-xs leading-relaxed ${ya.correcto ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}" style="border:1px solid ${ya.correcto ? '#86efac' : '#fca5a5'}"><p class="font-bold mb-1">${ya.correcto ? '✅ Correcto' : '❌ Incorrecto'}</p><p>${c.explicacion}</p></div>` : '';
            card.innerHTML = `<p class="text-xs font-bold uppercase tracking-widest mb-1" style="color:var(--accent)">${c.empresa}</p><p class="text-sm leading-relaxed mb-4" style="color:var(--text)">${c.situacion}</p><p class="text-xs font-bold mb-2" style="color:var(--heading)">¿A qué categoría corresponde esta situación?</p><div class="space-y-2">${opcionesHtml}</div>${fbHtml}`;
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
            const sel = document.querySelector('input[name="caso-opcion"]:checked');
            if (!sel) { alert('Selecciona una opción antes de verificar.'); return; }
            casoResultados[casoStep] = { seleccion: sel.value, correcto: sel.value === casosSituaciones[casoStep].correcta };
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
            const nivel = pct === 100 ? '🟢 Excelente — dominas la diferencia entre RSE y CSV' : pct >= 60 ? '🟡 Bien encaminado — revisa las 3 vías de Porter y Kramer' : '🔴 En proceso — vuelve al Contenido para reforzar los conceptos CVC';
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

        // ===== ACTIVIDAD 2: DISEÑO DE INICIATIVA CVC =====
        function actualizarContador(inputId, spanId, max) {
            const el = document.getElementById(inputId);
            const sp = document.getElementById(spanId);
            if (!el || !sp) return;
            const len = el.value.length;
            sp.textContent = len;
            sp.style.color = len >= max ? '#dc2626' : '#6c757d';
        }

        const viaLabels = { productos: 'Vía 1 — Reinventar productos y mercados', cadena: 'Vía 2 — Redefinir productividad en la cadena de valor', cluster: 'Vía 3 — Desarrollar clusters locales' };
        const viaConsejos = {
            productos: '💡 Para la Vía 1: piensa en qué necesidad social real de tu comunidad podría convertirse en un producto o servicio rentable para la organización.',
            cadena: '💡 Para la Vía 2: identifica un problema de tus empleados o proveedores (ausentismo, capacitación, bienestar) que si lo resuelves reduce costos o aumenta la productividad.',
            cluster: '💡 Para la Vía 3: ¿tu organización puede fortalecer a proveedores locales, universidades o instituciones cercanas para mejorar su propio entorno competitivo?'
        };

        function previsualizarDiseno() {
            const org = document.getElementById('diseno-org')?.value.trim();
            const via = document.getElementById('diseno-via')?.value;
            const problema = document.getElementById('diseno-problema')?.value.trim();
            const valor = document.getElementById('diseno-valor')?.value.trim();
            const fb = document.getElementById('diseno-feedback');
            if (!org || !via || !problema || !valor) { alert('Completa todos los campos antes de previsualizar.'); return; }
            fb.innerHTML = `<p class="font-bold mb-2" style="color:var(--heading)">Vista previa de tu iniciativa CVC</p><p><strong>Organización:</strong> ${org}</p><p class="mt-1"><strong>Estrategia:</strong> ${viaLabels[via]}</p><p class="mt-1"><strong>Problema social que resuelve:</strong> ${problema}</p><p class="mt-1"><strong>Valor económico generado:</strong> ${valor}</p><p class="mt-3 text-xs p-2 rounded" style="background:#e0f2fe;">${viaConsejos[via]}</p>`;
            fb.classList.remove('hidden');
        }

        function limpiarDiseno() {
            ['diseno-org', 'diseno-problema', 'diseno-valor'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
            [['diseno-org','cnt-org',100],['diseno-problema','cnt-problema',500],['diseno-valor','cnt-valor',500]].forEach(([i,s,m]) => actualizarContador(i,s,m));
            const via = document.getElementById('diseno-via'); if (via) via.value = '';
            const fb = document.getElementById('diseno-feedback'); if (fb) { fb.innerHTML = ''; fb.classList.add('hidden'); }
            scrollToActividad();
        }

        function exportarDiseno(formato) {
            const org = document.getElementById('diseno-org')?.value.trim();
            const via = document.getElementById('diseno-via')?.value;
            const problema = document.getElementById('diseno-problema')?.value.trim();
            const valor = document.getElementById('diseno-valor')?.value.trim();
            if (!org || !via || !problema || !valor) { alert('Completa todos los campos antes de exportar.'); return; }
            const texto = 'INICIATIVA DE CREACIÓN DE VALOR COMPARTIDO (CVC)\nGerencia del Talento Humano y Desarrollo Organizacional\nUniversidad de Córdoba — Tema 3\n\nOrganización: ' + org + '\nEstrategia CVC: ' + viaLabels[via] + '\n\nProblema social que resuelve:\n' + problema + '\n\nValor económico generado para la empresa:\n' + valor;
            if (formato === 'txt') { descargarArchivo('iniciativa-cvc.txt', texto, 'text/plain'); }
            else if (formato === 'word') { exportarComoWord('iniciativa-cvc', '<h2>Iniciativa de Creación de Valor Compartido</h2><h3>Gerencia del Talento Humano — Universidad de Córdoba</h3><p><strong>Organización:</strong> ' + org + '</p><p><strong>Estrategia CVC:</strong> ' + viaLabels[via] + '</p><h4>Problema social que resuelve</h4><p>' + problema + '</p><h4>Valor económico generado para la empresa</h4><p>' + valor + '</p>'); }
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
