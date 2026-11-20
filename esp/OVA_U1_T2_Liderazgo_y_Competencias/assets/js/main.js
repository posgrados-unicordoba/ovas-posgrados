(function () {
    'use strict';
    var root = document.getElementById('ova-embed');
    if (!root) return;
    var $ = function (id) { return document.getElementById(id); };
    var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); };

    /* ================= NAVEGACIÓN ================= */
    var links = root.querySelectorAll('.sidebar-link');
    var panes = root.querySelectorAll('.content-pane');
    var mobileNav = $('mobile-nav');
    function goTop() {
        // Lleva la vista al inicio de forma inmediata (ignora el scroll suave del CSS)
        try { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); } catch (e) { window.scrollTo(0, 0); }
        document.documentElement.scrollTop = 0; document.body.scrollTop = 0;
        // Moodle: si el OVA está embebido en un iframe, también sube la página contenedora hasta el OVA
        try {
            if (window.self !== window.top && window.frameElement) window.frameElement.scrollIntoView({ behavior: 'auto', block: 'start' });
        } catch (e) { /* iframe de otro dominio: el navegador no permite mover la página contenedora */ }
    }
    function showPane(id) {
        panes.forEach(function (p) { p.classList.toggle('active', p.id === id); });
        links.forEach(function (l) { l.classList.toggle('active', l.dataset.target === id); });
        if (mobileNav) mobileNav.value = id;
        goTop();
    }
    links.forEach(function (l) {
        l.addEventListener('click', function (e) { e.preventDefault(); showPane(l.dataset.target); });
    });
    if (mobileNav) mobileNav.addEventListener('change', function () { showPane(mobileNav.value); });

    /* ================= ACORDEÓN ================= */
    root.querySelectorAll('.accordion-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var content = btn.nextElementSibling;
            var icon = btn.querySelector('.fa-chevron-down');
            var open = content.classList.toggle('hidden') === false;
            if (icon) icon.style.transform = open ? 'rotate(180deg)' : '';
            btn.setAttribute('aria-expanded', open);
        });
    });

    /* ================= TARJETAS FLIP (toque en móvil) ================= */
    root.querySelectorAll('.flip-card').forEach(function (c) {
        c.setAttribute('tabindex', '0');
        c.addEventListener('click', function () { c.classList.toggle('flipped'); });
        c.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); c.classList.toggle('flipped'); } });
    });

    /* =====================================================================
       ACTIVIDAD (asistente por pasos)
       ===================================================================== */
    var COMPS = {
        AA: { name: 'Capacidad de abstracción y análisis', short: 'Abstracción y análisis', type: 'Dura' },
        TIC: { name: 'Habilidades en el uso de las tecnologías de la información y de la comunicación', short: 'Uso de TIC', type: 'Dura' },
        CE: { name: 'Compromiso ético', short: 'Compromiso ético', type: 'Blanda' },
        RS: { name: 'Responsabilidad social', short: 'Responsabilidad social', type: 'Blanda' },
        CI: { name: 'Habilidad para trabajar en contextos internacionales', short: 'Contextos internacionales', type: 'Blanda' }
    };
    var COMP_ORDER = ['AA', 'TIC', 'CE', 'RS', 'CI'];
    var PHASES = {
        1: { days: 'Días 1-30', name: 'Conectar', short: '1-30', icon: 'fa-handshake-angle', color: '#17a2b8' },
        2: { days: 'Días 31-60', name: 'Aprender y aportar', short: '31-60', icon: 'fa-seedling', color: '#569151' },
        3: { days: 'Días 61-90', name: 'Ganar autonomía', short: '61-90', icon: 'fa-rocket', color: '#3d6a3a' }
    };
    // Las 9 acciones de la guía. ideal = fase ideal. fb.early = mensaje "prematuro"; fb.late = mensaje "tardío".
    var ACTIONS = {
        1: { title: 'Bienvenida 1:1 con el líder', desc: 'Conversación individual de bienvenida con su líder sobre expectativas, propósito del equipo y valores de la organización.', comp: 'CE', ideal: 1,
             fb: { ideal: 'Buena decisión. Empezar por el propósito y las expectativas crea confianza desde el primer día y es la base del liderazgo que acompaña.',
                   late: 'Llega tarde. Si las expectativas y el propósito no se acuerdan al inicio, el colaborador trabaja semanas sin saber qué se espera de él, que es justo la ansiedad que el onboarding debe evitar.' } },
        2: { title: 'Inducción en datos y tableros', desc: 'Inducción en las fuentes de datos y los tableros de analítica de personas que usará el equipo.', comp: 'TIC', ideal: 1,
             fb: { ideal: 'Correcto. Antes de analizar, necesita conocer los datos y las herramientas; es el cimiento técnico de las fases siguientes.',
                   late: 'Demasiado tarde. Sin acceso y conocimiento de las herramientas no puede ejecutar el análisis de la fase 2 ni trabajar con autonomía en la fase 3.' } },
        3: { title: 'Presentaciones con áreas vecinas y buddy', desc: 'Presentaciones con áreas vecinas y un compañero guía (buddy) para entender cómo su trabajo impacta a otras áreas.', comp: 'RS', ideal: 1,
             fb: { ideal: 'Muy bien. Conocer a las personas y el impacto de su trabajo rompe los silos desde el inicio y fortalece el arraigo.',
                   late: 'Tardío. Las relaciones y el contexto organizacional son más útiles al comienzo; después, el colaborador ya trabajó aislado y los silos se consolidan.' } },
        4: { title: 'Mini-proyecto guiado de rotación', desc: 'Mini-proyecto guiado: analizar la rotación de un área con acompañamiento y proponer dos hipótesis de mejora.', comp: 'AA', ideal: 2,
             fb: { ideal: 'Correcto. Es una aplicación acotada y acompañada de lo aprendido: aporta valor sin exigir autonomía total todavía.',
                   early: 'Prematuro. Aún no conoce los datos ni el contexto de la empresa, por lo que el análisis sería superficial y generaría frustración.',
                   late: 'Tardío. Dejarlo para el final retrasa el aporte de valor y no deja tiempo para que ejercite el análisis con acompañamiento antes de la autonomía.' } },
        5: { title: 'Retroalimentación bidireccional con el líder', desc: 'Sesión de retroalimentación bidireccional con su líder, donde el colaborador también opina sobre su propio onboarding.', comp: 'CE', ideal: 2,
             fb: { ideal: 'Muy bien. A mitad del proceso, el diálogo honesto en ambos sentidos permite ajustar el plan y refleja un liderazgo que escucha.',
                   early: 'Prematuro. Aún no tiene experiencia suficiente para opinar con fundamento sobre su integración.',
                   late: 'Tardío. Ya no hay margen para corregir el rumbo; una retroalimentación a mitad de camino permite ajustar mientras todavía importa.' } },
        6: { title: 'Trabajo con equipo de otra región o país', desc: 'Trabajo conjunto con un equipo de otra región o país en un reporte comparativo de indicadores de talento.', comp: 'CI', ideal: 2,
             fb: { ideal: 'Correcto. Con las bases ya construidas, puede colaborar con equipos distintos sin perderse en el contexto.',
                   early: 'Prematuro. Aún está conociendo a su propio equipo y la organización; sumar un contexto internacional en esa etapa genera sobrecarga.',
                   late: 'Tardío. En la última fase el colaborador ya debería estar liderando con autonomía; la colaboración con otros contextos es más útil antes, mientras todavía aprende y aporta con acompañamiento.' } },
        7: { title: 'Análisis autónomo y recomendación a gerencia', desc: 'Liderar de forma autónoma un análisis completo y presentar una recomendación a la gerencia.', comp: 'AA', ideal: 3,
             fb: { ideal: 'Excelente. Es el cierre natural del onboarding: el colaborador demuestra autonomía y pensamiento crítico, tal como busca el modelo Tuning.',
                   early: 'Prematuro. Presentar recomendaciones a la gerencia sin haber construido conocimiento, relaciones y práctica acompañada expone al colaborador a un fracaso evitable.' } },
        8: { title: 'Automatizar un reporte recurrente', desc: 'Automatizar un reporte recurrente de indicadores de talento con las herramientas de analítica del equipo.', comp: 'TIC', ideal: 3,
             fb: { ideal: 'Bien ubicada. Automatizar exige dominio de datos y herramientas, lo que solo se logra después de las dos primeras fases.',
                   early: 'Prematuro. Automatizar algo que aún no comprende bien puede replicar errores a gran escala.' } },
        9: { title: 'Mentoría al siguiente nuevo ingreso', desc: 'Mentoría al siguiente nuevo ingreso: compartir lo aprendido y las claves para integrarse al equipo.', comp: 'RS', ideal: 3,
             fb: { ideal: 'Excelente. Transmitir lo aprendido consolida su propio aprendizaje y refleja el propósito compartido que promueve el liderazgo violeta.',
                   early: 'Prematuro. Aún no tiene suficiente experiencia para orientar a otra persona; primero necesita integrarse.' } }
    };
    // Orden de presentación (mezclado de forma fija para no revelar la secuencia) y su letra visible
    var BANK_ORDER = [5, 1, 8, 3, 7, 2, 9, 4, 6];
    var LETTER = {};
    BANK_ORDER.forEach(function (id, i) { LETTER[id] = 'ABCDEFGHI'.charAt(i); });

    var MIN_REF = 600, MAX_REF = 1200;
    var place, verified, finished, step, cur, tab, advanceTimer, lastAllOk = null;
    function resetState() {
        place = {}; BANK_ORDER.forEach(function (id) { place[id] = 0; });
        verified = false; finished = false; step = 1; cur = 0; tab = 1;
    }
    resetState();

    function typeChip(type) {
        return type === 'Dura'
            ? '<span class="chip chip-dura"><i class="fa-solid fa-gear"></i> Dura</span>'
            : '<span class="chip chip-blanda"><i class="fa-solid fa-heart"></i> Blanda</span>';
    }
    function compChip(key) { return '<span class="chip chip-comp" title="' + esc(COMPS[key].name) + '">' + esc(COMPS[key].short) + '</span>'; }
    function status(id) { var p = place[id], i = ACTIONS[id].ideal; return p === i ? 'ideal' : (p < i ? 'early' : 'late'); }
    function statusLabel(s) { return s === 'ideal' ? 'En su fase ideal' : (s === 'early' ? 'Prematura' : 'Tardía'); }
    function scrollToWizard() {
        var w = $('wizard'), r = w.getBoundingClientRect();
        if (r.top < 0 || r.top > window.innerHeight * 0.5) w.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /* ---------- reglas de validación ---------- */
    function evaluate() {
        var r = { phase: {}, covered: {}, placed: 0, ideal: 0 };
        [1, 2, 3].forEach(function (p) { r.phase[p] = { Blanda: 0, Dura: 0, n: 0 }; });
        BANK_ORDER.forEach(function (id) {
            var p = place[id];
            if (!p) return;
            r.placed++;
            var c = ACTIONS[id].comp;
            r.phase[p][COMPS[c].type]++; r.phase[p].n++;
            r.covered[c] = true;
            if (p === ACTIONS[id].ideal) r.ideal++;
        });
        r.rules = [
            { ok: r.phase[1].Blanda > 0, text: 'Días 1-30: al menos una acción de competencia blanda' },
            { ok: r.phase[1].Dura > 0, text: 'Días 1-30: al menos una acción de competencia dura' },
            { ok: r.phase[2].Blanda > 0, text: 'Días 31-60: al menos una acción de competencia blanda' },
            { ok: r.phase[2].Dura > 0, text: 'Días 31-60: al menos una acción de competencia dura' },
            { ok: r.phase[3].Blanda > 0, text: 'Días 61-90: al menos una acción de competencia blanda' },
            { ok: r.phase[3].Dura > 0, text: 'Días 61-90: al menos una acción de competencia dura' },
            { ok: COMP_ORDER.every(function (k) { return r.covered[k]; }), text: 'Las 5 competencias Tuning del cargo están cubiertas' },
            { ok: r.placed === 9, text: 'Las 9 acciones están ubicadas en el cronograma' }
        ];
        r.okCount = r.rules.filter(function (x) { return x.ok; }).length;
        r.allOk = r.okCount === 8;
        return r;
    }

    /* ---------- paso 1 ---------- */
    function renderComps(ev) {
        $('compTags').innerHTML = COMP_ORDER.map(function (k) {
            var ok = !!ev.covered[k];
            return '<div class="comp-tag' + (ok ? ' covered' : '') + '"><span class="min-w-0">' +
                (ok ? '<i class="fa-solid fa-circle-check mr-1" style="color:#16a34a;"></i>' : '<i class="fa-regular fa-circle mr-1" style="color:#adb5bd;"></i>') +
                esc(COMPS[k].name) + '</span>' + typeChip(COMPS[k].type) + '</div>';
        }).join('');
    }

    /* ---------- paso 2: tarjeta de decisión ---------- */
    function renderDots() {
        $('actDots').innerHTML = BANK_ORDER.map(function (id, i) {
            var p = place[id];
            return '<button type="button" class="dot' + (i === cur ? ' active' : '') + (p ? ' ph' + p : '') + '" data-dot="' + i + '" aria-label="Acción ' + LETTER[id] + (p ? ', ubicada en ' + PHASES[p].days : ', sin ubicar') + '"' + (i === cur ? ' aria-current="true"' : '') + '>' + LETTER[id] + '</button>';
        }).join('');
    }
    function renderDecision(ev) {
        var id = BANK_ORDER[cur], a = ACTIONS[id];
        var html = '<div class="dc-head"><span class="dc-count">Acción ' + (cur + 1) + ' de 9</span>' +
            (place[id] ? '<span class="chip chip-comp"><i class="fa-solid fa-location-dot"></i> En ' + PHASES[place[id]].days + '</span>' : '<span class="chip chip-comp" style="color:#6c757d;">Sin ubicar</span>') + '</div>' +
            '<div class="dc-title"><span class="a-id">' + LETTER[id] + '</span><span>' + esc(a.title) + '</span></div>' +
            '<p class="dc-desc">' + esc(a.desc) + '</p>' +
            '<div class="flex flex-wrap gap-1">' + compChip(a.comp) + typeChip(COMPS[a.comp].type) + '</div>' +
            '<p class="dc-ask">¿En qué fase la ubicarías?</p>' +
            '<div class="phase-choices" role="group" aria-label="Elegir fase para la acción ' + LETTER[id] + '">' +
            [1, 2, 3].map(function (p) {
                var sel = place[id] === p;
                return '<button type="button" class="phase-choice pc' + p + (sel ? ' selected' : '') + '" data-assign="' + id + '" data-phase="' + p + '" data-src="card"' + (verified ? ' disabled' : '') + ' aria-pressed="' + sel + '">' +
                    '<i class="fa-solid ' + PHASES[p].icon + '"></i><span><strong>' + PHASES[p].days + '</strong><small>' + PHASES[p].name + '</small></span>' +
                    (sel ? '<i class="fa-solid fa-circle-check pc-check"></i>' : '') + '</button>';
            }).join('') + '</div>' +
            '<div class="dc-nav"><button type="button" class="link-btn" data-move="-1"' + (cur === 0 ? ' disabled' : '') + '><i class="fa-solid fa-chevron-left mr-1"></i> Acción anterior</button>' +
            '<button type="button" class="link-btn" data-move="1"' + (cur === 8 ? ' disabled' : '') + '>Acción siguiente <i class="fa-solid fa-chevron-right ml-1"></i></button></div>';
        $('decisionCard').innerHTML = html;
        var msg = '';
        if (verified) msg = '<div class="notice info"><i class="fa-solid fa-lock mr-1"></i>Tu plan ya fue verificado. Para cambiar una ubicación, ve al paso 3 y presiona <strong>Ajustar cronograma</strong>.</div>';
        else if (ev.placed === 9) msg = '<div class="notice ok"><i class="fa-solid fa-circle-check mr-1"></i>¡Ubicaste las 9 acciones! Presiona <strong>Siguiente</strong> para revisar tu cronograma.</div>';
        $('decisionMsg').innerHTML = msg;
        renderDots();
    }

    /* ---------- paso 3: cronograma ---------- */
    function assignButtons(id) {
        return [1, 2, 3].map(function (p) {
            var c = place[id] === p;
            return '<button type="button" class="assign-btn' + (c ? ' current' : '') + '" data-assign="' + id + '" data-phase="' + p + '"' +
                ((c || verified) ? ' disabled' : '') + ' aria-label="Mover la acción ' + LETTER[id] + ' a ' + PHASES[p].days + '">' + PHASES[p].short + '</button>';
        }).join('');
    }
    function renderTimeline(ev) {
        $('phaseTabs').innerHTML = [1, 2, 3].map(function (p) {
            return '<button type="button" class="phase-tab pt' + p + (tab === p ? ' active' : '') + '" data-tab="' + p + '" role="tab" aria-selected="' + (tab === p) + '">' +
                '<span>Días ' + PHASES[p].short + '</span><span class="pt-n">' + ev.phase[p].n + '</span></button>';
        }).join('');
        $('timelineGrid').innerHTML = [1, 2, 3].map(function (p) {
            var ph = PHASES[p];
            var ids = BANK_ORDER.filter(function (id) { return place[id] === p; });
            var body = ids.length ? ids.map(function (id) {
                var a = ACTIONS[id], s = verified ? status(id) : '';
                var fb = verified ? '<div class="fb-box ' + s + '"><strong>' + (s === 'ideal' ? '<i class="fa-solid fa-circle-check mr-1"></i>' : '<i class="fa-solid fa-triangle-exclamation mr-1"></i>') +
                    statusLabel(s) + '.</strong> ' + esc(a.fb[s].replace(/^(Prematuro|Tardío)\.\s*/, '')) + '</div>' : '';
                return '<div class="placed-card ' + s + '">' +
                    '<div class="flex items-start gap-2"><span class="a-id sm">' + LETTER[id] + '</span><span class="p-title">' + esc(a.title) + '</span></div>' +
                    '<div class="flex flex-wrap gap-1">' + compChip(a.comp) + typeChip(COMPS[a.comp].type) + '</div>' +
                    (verified ? fb : '<div class="mini-assign"><span class="text-xs" style="color:#6c757d;">Mover a:</span>' + assignButtons(id) + '<button type="button" class="remove-btn" data-remove="' + id + '" aria-label="Quitar la acción ' + LETTER[id] + ' del cronograma"><i class="fa-solid fa-xmark mr-1"></i>Quitar</button></div>') +
                    '</div>';
            }).join('') : '<div class="ph-empty">Aún no hay acciones en esta fase.</div>';
            var cnt = ev.phase[p];
            return '<div class="phase-col p' + p + (tab === p ? ' tab-active' : '') + '">' +
                '<div class="ph-head"><div class="ph-days">' + ph.days + '</div><div class="ph-name"><i class="fa-solid ' + ph.icon + ' mr-1"></i>' + ph.name + '</div></div>' +
                '<div class="ph-count"><span class="chip chip-blanda">Blandas: ' + cnt.Blanda + '</span><span class="chip chip-dura">Duras: ' + cnt.Dura + '</span></div>' +
                '<div class="ph-body">' + body + '</div></div>';
        }).join('');
    }
    function renderRules(ev) {
        var html = ev.rules.map(function (r) {
            return '<li class="rule-line ' + (r.ok ? 'ok' : 'pending') + '">' +
                (r.ok ? '<i class="fa-solid fa-circle-check"></i>' : '<i class="fa-regular fa-circle" style="color:#adb5bd;"></i>') +
                '<span>' + r.text + '</span></li>';
        }).join('');
        html += '<li class="rule-line info"><i class="fa-solid fa-chart-simple"></i><span>Acciones en su fase ideal: ' +
            (verified ? '<strong>' + ev.ideal + ' de 9</strong>' : '<em>se muestra al presionar Verificar</em>') + '</span></li>';
        $('ruleList').innerHTML = html;
        $('rulesCount').textContent = ev.okCount;
        // la lista se pliega sola cuando todos los criterios se cumplen (el estudiante puede abrirla)
        if (ev.allOk !== lastAllOk) { $('rulesBox').open = !ev.allOk; lastAllOk = ev.allOk; }
        var msg = '';
        if (verified) {
            msg += '<div class="notice ok"><i class="fa-solid fa-circle-check mr-1"></i>Tu plan cumple los criterios de equilibrio y cobertura. Ahora cuéntanos cómo el liderazgo violeta facilitaría la adaptación del colaborador.</div>';
            if (ev.ideal < 9) msg += '<div class="notice warn"><i class="fa-solid fa-triangle-exclamation mr-1"></i>Revisa la retroalimentación de las tarjetas marcadas como prematuras o tardías (en cada fase): la secuencia también importa en un onboarding. Si quieres, presiona <strong>Ajustar cronograma</strong> y vuelve a verificar.</div>';
        } else if (!ev.allOk) {
            msg = '<div class="notice info"><i class="fa-solid fa-circle-info mr-1"></i>El botón <strong>Verificar</strong> se habilita cuando se cumplan los 8 criterios.</div>';
        }
        $('validationMsg').innerHTML = msg;
        $('verifyPlan').classList.toggle('hidden', verified);
        $('verifyPlan').disabled = !ev.allOk;
        $('editPlan').classList.toggle('hidden', !verified);
    }

    /* ---------- paso 4 ---------- */
    function renderReflect() {
        $('reflectWrap').classList.toggle('is-locked', !verified);
        $('reflectWrap').classList.toggle('hidden', finished);
        $('reflectInput').disabled = !verified;
        $('actResults').classList.toggle('hidden', !finished);
        updateReflectCounter();
    }

    /* ---------- encabezado y navegación ---------- */
    function renderChrome(ev) {
        var done = { 1: step > 1 || ev.placed > 0, 2: ev.placed === 9, 3: verified, 4: finished };
        root.querySelectorAll('#wzPills .wz-pill').forEach(function (pill) {
            var n = +pill.dataset.go;
            pill.classList.toggle('active', n === step);
            pill.classList.toggle('done', !!done[n] && n !== step);
            pill.setAttribute('aria-selected', n === step);
            pill.querySelector('.n').innerHTML = (done[n] && n !== step) ? '<i class="fa-solid fa-check"></i>' : n;
        });
        $('wzBar').style.width = (step * 25) + '%';
        $('wzPlaced').textContent = ev.placed;
        $('wzRules').textContent = ev.okCount;
        [1, 2, 3, 4].forEach(function (n) { $('wz' + n).classList.toggle('hidden', n !== step); });
        $('wzPrev').disabled = step === 1;
        var next = $('wzNext'), hint = '';
        next.classList.toggle('hidden', step === 4);
        if (step === 1) { next.innerHTML = 'Comenzar <i class="fa-solid fa-arrow-right ml-1"></i>'; next.disabled = false; }
        if (step === 2) {
            next.innerHTML = 'Ver cronograma <i class="fa-solid fa-arrow-right ml-1"></i>'; next.disabled = false;
            if (ev.placed < 9) hint = 'Te faltan ' + (9 - ev.placed) + ' acciones por ubicar (puedes revisarlas en el cronograma).';
        }
        if (step === 3) {
            next.innerHTML = 'Ir a la reflexión <i class="fa-solid fa-arrow-right ml-1"></i>'; next.disabled = !verified;
            if (!verified) hint = 'Verifica tu plan para pasar a la reflexión.';
        }
        $('wzHint').textContent = hint;
    }
    function renderAll() {
        var ev = evaluate();
        renderComps(ev); renderDecision(ev); renderTimeline(ev); renderRules(ev); renderReflect(); renderChrome(ev);
    }
    function goStep(n) {
        // el paso 4 se puede abrir siempre, pero permanece bloqueado hasta verificar el plan
        step = Math.max(1, Math.min(4, n));
        if (step === 2) { // abre la primera acción sin ubicar
            var firstFree = BANK_ORDER.findIndex(function (id) { return !place[id]; });
            if (firstFree >= 0 && place[BANK_ORDER[cur]]) cur = firstFree;
        }
        renderAll();
        scrollToWizard();
    }
    $('wzPrev').addEventListener('click', function () { goStep(step - 1); });
    $('wzNext').addEventListener('click', function () { if (!this.disabled) goStep(step + 1); });
    root.querySelectorAll('#wzPills .wz-pill').forEach(function (p) {
        p.addEventListener('click', function () { goStep(+p.dataset.go); });
    });

    /* ---------- interacción: asignar / mover / quitar ---------- */
    function nextFree(from) {
        for (var k = 1; k <= 9; k++) { var i = (from + k) % 9; if (!place[BANK_ORDER[i]]) return i; }
        return -1;
    }
    root.addEventListener('click', function (e) {
        var b = e.target.closest('[data-assign]');
        if (b && root.contains(b) && !b.disabled && !verified) {
            var id = +b.dataset.assign, p = +b.dataset.phase, from = place[id];
            place[id] = p;
            if (b.dataset.src === 'card') {
                renderAll();
                clearTimeout(advanceTimer);
                var nf = nextFree(cur);
                if (nf >= 0) advanceTimer = setTimeout(function () { cur = nf; renderAll(); }, 350);
            } else {
                tab = p;
                renderAll();
                $('assignToast').textContent = 'Acción ' + LETTER[id] + ' ' + (from ? 'movida' : 'ubicada') + ' a ' + PHASES[p].days + ' · ' + PHASES[p].name + '.';
            }
            return;
        }
        var r = e.target.closest('[data-remove]');
        if (r && root.contains(r) && !verified) {
            var rid = +r.dataset.remove;
            place[rid] = 0;
            renderAll();
            $('assignToast').textContent = 'Acción ' + LETTER[rid] + ' quitada del cronograma. Ubícala de nuevo en el paso 2.';
            return;
        }
        var d = e.target.closest('[data-dot]');
        if (d && root.contains(d)) { clearTimeout(advanceTimer); cur = +d.dataset.dot; renderAll(); return; }
        var m = e.target.closest('[data-move]');
        if (m && root.contains(m) && !m.disabled) { clearTimeout(advanceTimer); cur = Math.max(0, Math.min(8, cur + +m.dataset.move)); renderAll(); return; }
        var t = e.target.closest('[data-tab]');
        if (t && root.contains(t)) { tab = +t.dataset.tab; renderAll(); }
    });

    $('verifyPlan').addEventListener('click', function () {
        var ev = evaluate();
        if (!ev.allOk) return;
        verified = true;
        $('assignToast').textContent = '';
        // en el celular se abre la primera fase con una acción fuera de su fase ideal
        var firstOff = BANK_ORDER.filter(function (id) { return status(id) !== 'ideal'; }).map(function (id) { return place[id]; }).sort()[0];
        if (firstOff) tab = firstOff;
        renderAll();
        $('validationMsg').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    $('editPlan').addEventListener('click', function () {
        // Vuelve a editar: se oculta la retroalimentación y se bloquea el paso 4, pero se conserva la reflexión escrita
        verified = false; finished = false; closeMenu();
        renderAll();
        scrollToWizard();
    });

    /* ---------- reflexión ---------- */
    var reflect = $('reflectInput');
    function updateReflectCounter() {
        var n = reflect.value.length;
        var fmt = function (x) { return x.toLocaleString('es-CO'); };
        $('reflectCounter').textContent = fmt(n) + '/1.200 caracteres';
        var bar = $('reflectBar');
        bar.style.width = Math.min(100, n / MAX_REF * 100) + '%';
        bar.style.background = n >= MIN_REF ? '#16a34a' : '#d97706';
        $('reflectHint').textContent = n >= MIN_REF ? '✓ Extensión suficiente' : 'Te faltan ' + fmt(MIN_REF - n) + ' caracteres (mínimo 600)';
        $('reflectHint').style.color = n >= MIN_REF ? '#16a34a' : '#6c757d';
        $('finishPlan').disabled = !verified || n < MIN_REF;
    }
    reflect.addEventListener('input', function () { $('reflectMsg').textContent = ''; updateReflectCounter(); });

    function phaseLines(p) {
        return BANK_ORDER.filter(function (id) { return place[id] === p; }).map(function (id) {
            var a = ACTIONS[id];
            return { a: a, s: status(id), comp: COMPS[a.comp] };
        });
    }
    function renderResults() {
        var ev = evaluate();
        var html = '<div class="p-3 rounded-lg" style="background: var(--surface); border: 2px solid var(--line);"><p class="text-xs font-bold m-0" style="color: var(--heading);">Caso</p><p class="text-sm mt-1 mb-0">Analista de People Analytics que inicia en una mediana empresa, acompañado por un líder de área. Acciones en su fase ideal: <strong>' + ev.ideal + ' de 9</strong>.</p></div>';
        html += '<div class="grid md:grid-cols-3 gap-3">' + [1, 2, 3].map(function (p) {
            return '<div class="review-phase" style="background: var(--surface);"><div class="rp-head" style="background:' + PHASES[p].color + ';">' + PHASES[p].days + ' · ' + PHASES[p].name + '</div><ul>' +
                phaseLines(p).map(function (l) {
                    return '<li><strong>' + esc(l.a.title) + '</strong><br><span style="color:#6c757d;">' + esc(l.comp.name) + ' · ' + l.comp.type + '</span><br>' +
                        '<span style="color:' + (l.s === 'ideal' ? '#16a34a' : '#b45309') + ';font-weight:600;">' + statusLabel(l.s) + '</span></li>';
                }).join('') + '</ul></div>';
        }).join('') + '</div>';
        html += '<div class="p-3 rounded-lg" style="background: var(--surface); border: 2px solid var(--line);"><p class="text-xs font-bold m-0" style="color: var(--heading);">Reflexión: liderazgo violeta en el onboarding</p><div class="text-sm mt-1" style="white-space: pre-wrap;">' + esc(reflect.value.trim()) + '</div></div>';
        $('actReview').innerHTML = html;
    }
    $('finishPlan').addEventListener('click', function () {
        if (!verified) return;
        if (reflect.value.length < MIN_REF) { $('reflectMsg').textContent = 'Tu reflexión debe tener al menos 600 caracteres (máximo 1.200).'; return; }
        finished = true;
        renderResults();
        renderAll();
        scrollToWizard();
    });
    $('editReflect').addEventListener('click', function () {
        finished = false; closeMenu();
        renderAll();
        reflect.focus();
    });

    /* ---------- copiar / exportar ---------- */
    function plainSummary() {
        var ev = evaluate();
        var t = 'MI PLAN DE ONBOARDING DE 90 DÍAS\nGerencia del Talento Humano · Unidad 1 · Tema 2\n\n' +
            'Caso: Analista de People Analytics que inicia en una mediana empresa, acompañado por un líder de área.\n' +
            'Acciones en su fase ideal: ' + ev.ideal + ' de 9\n';
        [1, 2, 3].forEach(function (p) {
            t += '\n' + PHASES[p].days.toUpperCase() + ' · ' + PHASES[p].name.toUpperCase() + '\n';
            phaseLines(p).forEach(function (l) { t += '- ' + l.a.title + ' (' + l.comp.name + ' · ' + l.comp.type + ') — ' + statusLabel(l.s) + '\n'; });
        });
        return t + '\nREFLEXIÓN: LIDERAZGO VIOLETA EN EL ONBOARDING\n' + reflect.value.trim() + '\n';
    }
    function summaryHTML() {
        var ev = evaluate(), f = 'font-family:Poppins,Arial,sans-serif;';
        var h = '<h1 style="color:#569151;' + f + '">Mi plan de onboarding de 90 días</h1>' +
            '<p style="color:#6c757d;' + f + '">Gerencia del Talento Humano · Unidad 1 · Tema 2</p>' +
            '<p style="' + f + '"><b>Caso:</b> Analista de People Analytics que inicia en una mediana empresa, acompañado por un líder de área.<br><b>Acciones en su fase ideal:</b> ' + ev.ideal + ' de 9</p>';
        [1, 2, 3].forEach(function (p) {
            h += '<h2 style="color:#3d6a3a;' + f + 'font-size:14pt;">' + PHASES[p].days + ' · ' + PHASES[p].name + '</h2><table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%;' + f + 'font-size:10pt;"><tr style="background:#e8f0e9;"><th align="left">Acción</th><th align="left">Competencia Tuning</th><th align="left">Tipo</th><th align="left">Ubicación</th></tr>' +
                phaseLines(p).map(function (l) { return '<tr><td>' + esc(l.a.title) + '</td><td>' + esc(l.comp.name) + '</td><td>' + l.comp.type + '</td><td>' + statusLabel(l.s) + '</td></tr>'; }).join('') + '</table>';
        });
        return h + '<h2 style="color:#3d6a3a;' + f + 'font-size:14pt;">Reflexión: liderazgo violeta en el onboarding</h2><p style="' + f + 'word-wrap:break-word;overflow-wrap:anywhere">' + esc(reflect.value.trim()).replace(/\n/g, '<br>') + '</p>';
    }
    var copyMsg = $('actCopyMsg');
    function flash(msg) { copyMsg.textContent = msg; setTimeout(function () { copyMsg.textContent = ''; }, 3000); }
    $('actCopy').addEventListener('click', function () {
        var txt = plainSummary();
        var fallback = function () {
            var ta = document.createElement('textarea'); ta.value = txt; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
            document.body.appendChild(ta); ta.select();
            try { document.execCommand('copy'); flash('Resumen copiado al portapapeles.'); } catch (e) { flash('No se pudo copiar automáticamente.'); }
            document.body.removeChild(ta);
        };
        if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(txt).then(function () { flash('Resumen copiado al portapapeles.'); }, fallback);
        else fallback();
    });
    var dlBtn = $('actDownloadBtn'), dlMenu = $('actDownloadMenu');
    function closeMenu() { dlMenu.classList.add('hidden'); dlBtn.setAttribute('aria-expanded', 'false'); }
    dlBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = dlMenu.classList.toggle('hidden') === false;
        dlBtn.setAttribute('aria-expanded', open);
    });
    document.addEventListener('click', function (e) { if (!dlMenu.contains(e.target) && !dlBtn.contains(e.target)) closeMenu(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
    function download(name, content, type) {
        var blob = content instanceof Blob ? content : new Blob([content], { type: type });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob); a.download = name;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 1500);
    }
    $('actDownloadWord').addEventListener('click', function () {
        var doc = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>Plan de onboarding de 90 días</title></head><body>' + summaryHTML() + '</body></html>';
        download('Plan_Onboarding_90_dias.doc', '﻿' + doc, 'application/msword'); closeMenu(); flash('Archivo Word exportado.');
    });
    $('actDownloadPdf').addEventListener('click', function () {
        var ev = evaluate(), G = '#3d6a3a', T = '#374151', MUT = '#6c757d';
        var blocks = [
            { text: 'Mi plan de onboarding de 90 días', size: 17, bold: true, color: '#569151', after: 2 },
            { text: 'Gerencia del Talento Humano · Unidad 1 · Tema 2 · Actividad interactiva', size: 9, color: MUT, after: 10 },
            { line: true, after: 10 },
            { text: 'Caso: Analista de People Analytics que inicia en una mediana empresa, acompañado por un líder de área.', size: 10.5, color: T, after: 3 },
            { text: 'Acciones en su fase ideal: ' + ev.ideal + ' de 9', size: 10.5, bold: true, color: T, after: 12 }
        ];
        [1, 2, 3].forEach(function (p) {
            blocks.push({ text: PHASES[p].days + ' · ' + PHASES[p].name, size: 12, bold: true, color: G, after: 4 });
            phaseLines(p).forEach(function (l) {
                blocks.push({ text: '• ' + l.a.title, size: 10.5, bold: true, color: T, indent: 8, after: 1 });
                blocks.push({ text: l.comp.name + ' · ' + l.comp.type + ' — ' + statusLabel(l.s), size: 9.5, color: MUT, indent: 18, after: 5 });
            });
            blocks.push({ text: '', size: 4, after: 6 });
        });
        blocks.push({ text: 'Reflexión: liderazgo violeta en el onboarding', size: 12, bold: true, color: G, after: 4 });
        blocks.push({ text: reflect.value.trim(), size: 10.5, color: T, after: 4 });
        var blob = window.OvaPDF.build(blocks, { title: 'Plan de onboarding de 90 días', footer: 'CINTIA — Universidad de Córdoba' });
        download('Plan_Onboarding_90_dias.pdf', blob, 'application/pdf'); closeMenu(); flash('Archivo PDF exportado.');
    });

    /* ---------- reiniciar ---------- */
    function restartActivity() {
        clearTimeout(advanceTimer);
        resetState();
        reflect.value = '';
        $('reflectMsg').textContent = ''; $('assignToast').textContent = '';
        closeMenu(); $('actReview').innerHTML = '';
        renderAll();
        scrollToWizard();
    }
    root.querySelectorAll('.restart-btn').forEach(function (b) { b.addEventListener('click', restartActivity); });
    renderAll();

    /* =====================================================================
       AUTOEVALUACIÓN (resultados y retroalimentación solo al Verificar)
       ===================================================================== */
    var quiz = [
        { q: 'El Proyecto Tuning América Latina define las competencias como la integración de:', c: 0, o: [
            ['El saber, el hacer y el ser', 'Correcto. Este enfoque integral permite evaluar con comportamientos observables y medibles, no con percepciones subjetivas.'],
            ['Solo conocimientos técnicos', 'Incorrecto. Tuning va más allá de los conocimientos técnicos: incluye también el hacer y el ser.'],
            ['Solo habilidades blandas', 'Incorrecto. Las competencias integran conocimientos, habilidades y valores; no se limitan a las blandas.'],
            ['La antigüedad y el cargo', 'Incorrecto. Las competencias describen lo que la persona sabe, hace y es, no su posición ni su tiempo en la empresa.']] },
        { q: 'Según Daniel Goleman, ¿qué factor es el predictor más fuerte del éxito de un líder?', c: 1, o: [
            ['El nivel jerárquico', 'Incorrecto. La autoridad formal no es el predictor más fuerte; el liderazgo moderno es una función de servicio y facilitación.'],
            ['La inteligencia emocional', 'Correcto. El autoconocimiento, la empatía y la gestión de relaciones son la base del liderazgo integrador.'],
            ['Los años de experiencia', 'Incorrecto. La experiencia ayuda, pero Goleman destaca la inteligencia emocional como el predictor más fuerte.'],
            ['El dominio técnico exclusivo', 'Incorrecto. El dominio técnico por sí solo no explica el éxito del líder frente a las competencias emocionales.']] },
        { q: '¿Cuánto puede aumentar la retención de nuevos empleados un buen programa de onboarding de 90 días?', c: 2, o: [
            ['Hasta un 20%', 'Incorrecto. La cifra que cita el contenido del curso es mayor.'],
            ['Hasta un 50%', 'Incorrecto. El contenido del curso señala un impacto más alto.'],
            ['Hasta un 82%', 'Correcto. Un onboarding estratégico, más allá de la inducción administrativa, genera arraigo y conexión desde el primer día.'],
            ['No tiene impacto medible', 'Incorrecto. Un onboarding bien diseñado tiene un impacto medible en la retención.']] },
        { q: "El 'liderazgo violeta' se caracteriza principalmente por:", c: 1, o: [
            ['Priorizar la autoridad jerárquica formal', 'Incorrecto. El liderazgo violeta supera la autoridad formal y se orienta al servicio y la facilitación.'],
            ['Integrar variables económicas, humanas y sociales con pensamiento sistémico', 'Correcto. Surge para responder a entornos complejos que exigen una visión integradora.'],
            ['Centrarse exclusivamente en resultados financieros', 'Incorrecto. Integra variables económicas, pero también humanas y sociales.'],
            ['Evitar la mediación en conversaciones difíciles', 'Incorrecto. Al contrario: prioriza la capacidad de mediar en conversaciones difíciles.']] },
        { q: '¿Cuál de las siguientes NO es una competencia genérica del Proyecto Tuning?', c: 3, o: [
            ['Capacidad de abstracción y análisis', 'Incorrecto. Sí es una de las competencias genéricas destacadas del Proyecto Tuning.'],
            ['Compromiso ético', 'Incorrecto. Sí es una de las competencias genéricas destacadas del Proyecto Tuning.'],
            ['Habilidad para trabajar en contextos internacionales', 'Incorrecto. Sí es una de las competencias genéricas destacadas del Proyecto Tuning.'],
            ['Dominio exclusivo de un software contable específico', 'Correcto. Las competencias Tuning son transversales y genéricas, no están atadas a una herramienta técnica puntual.']] }
    ];
    var letters = ['a', 'b', 'c', 'd'];
    var qi = 0;
    var qSel = quiz.map(function () { return null; });
    function okIcon(ok) { return '<i class="fa-solid ' + (ok ? 'fa-circle-check' : 'fa-circle-xmark') + ' mr-1"></i>'; }
    function explain(s) { return String(s).replace(/^(Correcto|Incorrecto)\.\s*/, ''); }
    function renderQuiz() {
        var item = quiz[qi], sel = qSel[qi], last = qi === quiz.length - 1;
        $('quiz-title').textContent = 'Pregunta ' + (qi + 1);
        $('quiz-progress').textContent = (qi + 1) + '/' + quiz.length;
        $('quiz-text').textContent = item.q;
        var box = $('quiz-options'); box.innerHTML = '';
        item.o.forEach(function (opt, i) {
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'quiz-option' + (i === sel ? ' selected' : '');
            b.setAttribute('aria-pressed', i === sel);
            b.innerHTML = letters[i] + ') ' + esc(opt[0]);
            b.addEventListener('click', function () { qSel[qi] = i; $('quiz-message').innerHTML = ''; renderQuiz(); });
            box.appendChild(b);
        });
        $('quiz-prev').disabled = qi === 0;
        $('quiz-next').innerHTML = last ? '<i class="fa-solid fa-check mr-1"></i> Verificar' : 'Siguiente <i class="fa-solid fa-arrow-right ml-1"></i>';
    }
    function showQuizResults() {
        var score = qSel.reduce(function (s, a, i) { return s + (a === quiz[i].c ? 1 : 0); }, 0);
        $('quiz-score').textContent = score;
        $('quiz-feedback').textContent = score === quiz.length ? '¡Excelente! Dominas las competencias Tuning, el liderazgo violeta y el onboarding estratégico.'
            : score >= 3 ? 'Buen trabajo. Repasa en el Contenido las partes donde tuviste dudas.'
            : 'Te recomendamos revisar nuevamente la ruta del tema y las tres partes del Contenido antes de continuar.';
        $('quiz-review').innerHTML = quiz.map(function (item, i) {
            var ok = qSel[i] === item.c, mine = item.o[qSel[i]];
            return '<div class="p-3 rounded-lg" style="background: var(--surface); border: 2px solid var(--line);">' +
                '<p class="text-sm font-bold" style="color: var(--heading);"><span style="color:' + (ok ? '#16a34a' : '#dc2626') + ';">' + okIcon(ok) + '</span>' + (i + 1) + '. ' + esc(item.q) + '</p>' +
                (ok ? '' : '<p class="text-xs mt-2" style="color:#991b1b;">Tu respuesta: <strong>' + letters[qSel[i]] + ') ' + esc(mine[0]) + '</strong>. ' + esc(explain(mine[1])) + '</p>') +
                '<p class="text-sm mt-2" style="color:#166534;">Respuesta correcta: <strong>' + letters[item.c] + ') ' + esc(item.o[item.c][0]) + '</strong></p>' +
                '<p class="text-xs mt-1" style="color: var(--text);">' + esc(explain(item.o[item.c][1])) + '</p></div>';
        }).join('');
        $('quiz-box').classList.add('hidden');
        $('quiz-results').classList.remove('hidden');
    }
    $('quiz-prev').addEventListener('click', function () { if (qi > 0) { qi--; $('quiz-message').innerHTML = ''; renderQuiz(); } });
    $('quiz-next').addEventListener('click', function () {
        if (qSel[qi] === null) { $('quiz-message').innerHTML = '<span style="color:#dc2626;">Selecciona una opción para continuar.</span>'; return; }
        if (qi < quiz.length - 1) { qi++; renderQuiz(); }
        else {
            var miss = qSel.map(function (a, i) { return a === null ? i + 1 : null; }).filter(function (x) { return x !== null; });
            if (miss.length) { $('quiz-message').innerHTML = '<span style="color:#dc2626;">Te falta responder: pregunta ' + miss.join(', ') + '.</span>'; return; }
            showQuizResults();
            goTop();
        }
    });
    $('quiz-restart').addEventListener('click', function () {
        qi = 0;
        qSel = quiz.map(function () { return null; });
        $('quiz-message').innerHTML = '';
        $('quiz-results').classList.add('hidden'); $('quiz-box').classList.remove('hidden'); renderQuiz();
        goTop();
    });
    renderQuiz();
})();
