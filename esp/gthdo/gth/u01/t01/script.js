/* Interacciones del OVA gthdo-gth-u01-t01. */

/* OvaPDF: generador de PDF ligero y autónomo (sin librerías externas) para exportar
   resultados de las actividades del OVA. Usa Helvetica (WinAnsi), ajusta el texto a los
   márgenes (incluidas palabras muy largas) y agrega páginas automáticamente. */
(function (w) {
    'use strict';
    var WID = { F1: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,278,278,355,556,556,889,667,191,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,278,278,584,584,584,556,1015,667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,278,278,278,469,556,333,556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,556,556,333,500,278,556,500,722,500,500,500,334,260,334,584,761,556,761,222,556,333,1000,556,556,333,1000,667,333,1000,761,611,761,761,222,222,333,333,350,556,1000,333,1000,500,333,944,761,500,667,278,333,556,556,556,556,260,556,333,737,370,556,584,333,737,333,400,584,333,333,333,556,537,278,333,333,365,556,834,834,834,611,667,667,667,667,667,667,1000,722,667,667,667,667,278,278,278,278,722,722,778,778,778,778,778,584,778,722,722,722,722,667,667,611,556,556,556,556,556,556,889,500,556,556,556,556,278,278,278,278,556,556,556,556,556,556,556,584,611,556,556,556,556,500,556,500], F2: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,278,333,474,556,556,889,722,238,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,333,333,584,584,584,611,975,722,722,722,722,667,611,778,722,278,556,722,611,833,722,778,667,778,722,667,611,722,667,944,667,667,611,333,278,333,584,556,333,556,611,556,611,556,333,611,611,278,278,556,278,889,611,611,611,611,389,556,333,611,556,778,556,556,500,389,280,389,584,761,556,761,278,556,500,1000,556,556,333,1000,667,333,1000,761,611,761,761,278,278,500,500,350,556,1000,333,1000,556,333,944,761,500,667,278,333,556,556,556,556,280,556,333,737,370,556,584,333,737,333,400,584,333,333,333,611,556,278,333,333,365,556,834,834,834,611,722,722,722,722,722,722,1000,722,667,667,667,667,278,278,278,278,722,722,778,778,778,778,778,584,778,722,722,722,722,667,667,611,556,556,556,556,556,556,889,556,556,556,556,556,278,278,278,278,611,611,611,611,611,611,611,584,611,611,611,611,611,556,611,556] };
    var SPECIAL = { 0x20AC: 128, 0x201A: 130, 0x0192: 131, 0x201E: 132, 0x2026: 133, 0x2020: 134, 0x2021: 135, 0x02C6: 136, 0x2030: 137, 0x0160: 138, 0x2039: 139, 0x0152: 140, 0x017D: 142,
        0x2018: 145, 0x2019: 146, 0x201C: 147, 0x201D: 148, 0x2022: 149, 0x2013: 150, 0x2014: 151, 0x02DC: 152, 0x2122: 153, 0x0161: 154, 0x203A: 155, 0x0153: 156, 0x017E: 158, 0x0178: 159 };
    var REPL = { '≥': '>=', '≤': '<=', '→': '->', '✓': 'v', '✗': 'x', ' ': ' ' };
    function toCodes(str) {
        var out = [];
        str = String(str).replace(/[≥≤→✓✗ ]/g, function (c) { return REPL[c]; });
        for (var i = 0; i < str.length; i++) {
            var c = str.charCodeAt(i);
            if (c === 9) c = 32;
            if (c >= 32 && c < 127) out.push(c);
            else if (c >= 160 && c <= 255) out.push(c);
            else if (SPECIAL[c]) out.push(SPECIAL[c]);
            else if (c >= 0xD800 && c <= 0xDBFF) { i++; out.push(63); }
            else out.push(63);
        }
        return out;
    }
    function width(codes, font, size) {
        var t = 0, tb = WID[font];
        for (var i = 0; i < codes.length; i++) t += tb[codes[i]] || 556;
        return t * size / 1000;
    }
    // Divide un párrafo en líneas que caben en maxW; corta palabras más largas que la línea
    function wrap(text, font, size, maxW) {
        var lines = [];
        String(text).split(/\r?\n/).forEach(function (para) {
            var words = para.split(/ +/), line = [];
            if (para.trim() === '') { lines.push([]); return; }
            words.forEach(function (wd) {
                if (!wd) return;
                var codes = toCodes(wd);
                while (width(codes, font, size) > maxW) {
                    // palabra demasiado larga: se corta en trozos
                    if (line.length) { lines.push(line); line = []; }
                    var n = codes.length;
                    while (n > 1 && width(codes.slice(0, n), font, size) > maxW) n--;
                    lines.push(codes.slice(0, n));
                    codes = codes.slice(n);
                }
                if (!codes.length) return;
                var cand = line.length ? line.concat([32], codes) : codes;
                if (width(cand, font, size) <= maxW) line = cand;
                else { lines.push(line); line = codes; }
            });
            lines.push(line);
        });
        return lines;
    }
    function pdfStr(codes) {
        var s = '(';
        codes.forEach(function (c) {
            if (c === 40 || c === 41 || c === 92) s += '\\' + String.fromCharCode(c);
            else if (c > 126) s += '\\' + ('00' + c.toString(8)).slice(-3);
            else s += String.fromCharCode(c);
        });
        return s + ')';
    }
    function hex2rgb(h) {
        h = (h || '#374151').replace('#', '');
        return [parseInt(h.substr(0, 2), 16) / 255, parseInt(h.substr(2, 2), 16) / 255, parseInt(h.substr(4, 2), 16) / 255]
            .map(function (v) { return v.toFixed(3); }).join(' ');
    }
    /* blocks: [{ text, size, bold, color, before, after, indent, line }] */
    function build(blocks, opts) {
        opts = opts || {};
        var PW = 595.28, PH = 841.89, M = 56, maxW = PW - 2 * M;
        var pages = [], ops = [], y = PH - M;
        function newPage() { if (ops.length) pages.push(ops.join('\n')); ops = []; y = PH - M; }
        function footer() { }
        blocks.forEach(function (b) {
            var size = b.size || 11, font = b.bold ? 'F2' : 'F1', lh = size * 1.4, ind = b.indent || 0;
            y -= (b.before || 0);
            if (b.line) {
                if (y - 6 < M) newPage();
                ops.push('0.85 0.88 0.9 RG 0.8 w ' + M + ' ' + y.toFixed(2) + ' m ' + (PW - M) + ' ' + y.toFixed(2) + ' l S');
                y -= (b.after || 8);
                return;
            }
            wrap(b.text || '', font, size, maxW - ind).forEach(function (ln) {
                if (y - lh < M) newPage();
                y -= lh;
                if (ln.length) ops.push('BT /' + font + ' ' + size + ' Tf ' + hex2rgb(b.color) + ' rg ' + (M + ind).toFixed(2) + ' ' + y.toFixed(2) + ' Td ' + pdfStr(ln) + ' Tj ET');
            });
            y -= (b.after || 4);
        });
        if (ops.length || !pages.length) pages.push(ops.join('\n'));
        // pie de página con numeración
        var total = pages.length;
        pages = pages.map(function (c, i) {
            var ft = toCodes((opts.footer ? opts.footer + '   |   ' : '') + 'Página ' + (i + 1) + ' de ' + total);
            return c + '\nBT /F1 8 Tf 0.424 0.459 0.490 rg ' + M + ' 30 Td ' + pdfStr(ft) + ' Tj ET';
        });
        // ensamblado del archivo
        var objs = [];
        objs[1] = '<< /Type /Catalog /Pages 2 0 R >>';
        objs[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';
        objs[4] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>';
        var kids = [], n = 5;
        pages.forEach(function (content) {
            var pid = n++, cid = n++;
            kids.push(pid + ' 0 R');
            objs[pid] = '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + PW + ' ' + PH + '] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ' + cid + ' 0 R >>';
            objs[cid] = '<< /Length ' + content.length + ' >>\nstream\n' + content + '\nendstream';
        });
        objs[2] = '<< /Type /Pages /Kids [' + kids.join(' ') + '] /Count ' + kids.length + ' >>';
        var info = n;
        objs[info] = '<< /Title ' + pdfStr(toCodes(opts.title || 'Documento')) + ' /Producer (OVA CINTIA) >>';
        var out = '%PDF-1.4\n', offs = [];
        for (var i = 1; i < objs.length; i++) { offs[i] = out.length; out += i + ' 0 obj\n' + objs[i] + '\nendobj\n'; }
        var xref = out.length;
        out += 'xref\n0 ' + objs.length + '\n0000000000 65535 f \n';
        for (i = 1; i < objs.length; i++) out += ('0000000000' + offs[i]).slice(-10) + ' 00000 n \n';
        out += 'trailer\n<< /Size ' + objs.length + ' /Root 1 0 R /Info ' + info + ' 0 R >>\nstartxref\n' + xref + '\n%%EOF';
        var bytes = new Uint8Array(out.length);
        for (i = 0; i < out.length; i++) bytes[i] = out.charCodeAt(i) & 255;
        return new Blob([bytes], { type: 'application/pdf' });
    }
    w.OvaPDF = { build: build };
})(window);

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
    function showPane(id) {
        panes.forEach(function (p) { p.classList.toggle('active', p.id === id); });
        links.forEach(function (l) { l.classList.toggle('active', l.dataset.target === id); });
        if (mobileNav) mobileNav.value = id;
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
        c.addEventListener('click', function () { c.classList.toggle('flipped'); });
    });

    function goTop() {
        // Lleva la vista al inicio de forma inmediata (ignora el scroll suave del CSS)
        try { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); } catch (e) { window.scrollTo(0, 0); }
        document.documentElement.scrollTop = 0; document.body.scrollTop = 0;
        // Moodle: si el OVA está embebido en un iframe, también sube la página contenedora hasta el OVA
        try {
            if (window.self !== window.top && window.frameElement) window.frameElement.scrollIntoView({ behavior: 'auto', block: 'start' });
        } catch (e) { /* iframe de otro dominio: el navegador no permite mover la página contenedora */ }
    }

    /* ================= ACTIVIDAD: NAVEGACIÓN PARTE A / PARTE B ================= */
    var partBtns = root.querySelectorAll('[data-act-part]');
    function setPart(id) {
        ['partA', 'partB'].forEach(function (p) { $(p).classList.toggle('hidden', p !== id); });
        partBtns.forEach(function (b) { b.classList.toggle('active', b.dataset.actPart === id); });
    }
    function showPart(id) {
        setPart(id);
        $('actividad').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    partBtns.forEach(function (b) { b.addEventListener('click', function () { showPart(b.dataset.actPart); }); });

    var eras = [
        { name: 'Taylorismo/Fayol', icon: 'fa-gears', c: 0,
          desc: "Frederick Taylor y Henri Fayol trataban al trabajador como una pieza más del engranaje productivo. El área de 'personal' se centraba en la nómina, el control de tiempos y la disciplina rígida.",
          o: [['Control de tiempos y disciplina rígida del trabajador', 'Correcto. El enfoque clásico centraba la gestión de personal en nómina, control de tiempos y disciplina.'],
              ['Diagnóstico de clima laboral y sentido de pertenencia', 'Incorrecto. Esa característica corresponde a la Escuela de Relaciones Humanas, no al enfoque tayloriano/fayolista.'],
              ['Analítica de datos de la fuerza laboral', 'Incorrecto. Esa característica corresponde al modelo Ulrich+, una evolución mucho más reciente.'],
              ['Orquestación entre agentes humanos y de IA', 'Incorrecto. Esa característica corresponde al paradigma contemporáneo de orquestación humano-IA.']] },
        { name: 'Escuela de Relaciones Humanas', icon: 'fa-people-group', c: 0,
          desc: 'Tras los experimentos de Hawthorne liderados por Elton Mayo, se reconoció que los factores psicológicos y sociales —como el clima laboral y la pertenencia— impactaban la productividad más que los incentivos salariales aislados.',
          o: [['Diagnóstico de clima laboral y sentido de pertenencia', 'Correcto. Hawthorne evidenció que el clima laboral y la pertenencia influían más en la productividad que el salario aislado.'],
              ['Control de tiempos y disciplina rígida del trabajador', 'Incorrecto. Esa característica corresponde al enfoque tayloriano/fayolista, previo a este paradigma.'],
              ['Cuatro roles estratégicos de RR. HH.', 'Incorrecto. Esa característica corresponde al modelo de Ulrich, décadas después de Hawthorne.'],
              ['Reskilling y upskilling continuos', 'Incorrecto. Esa característica corresponde al paradigma contemporáneo de orquestación humano-IA.']] },
        { name: 'Modelo de Ulrich', icon: 'fa-handshake', c: 0,
          desc: 'En la década de 1990, Dave Ulrich propuso que RR. HH. debía generar valor real para el negocio mediante 4 roles fundamentales: Socio Estratégico, Agente de Cambio, Experto Administrativo y Defensor del Empleado.',
          o: [['Cuatro roles estratégicos: Socio Estratégico, Agente de Cambio, Experto Administrativo y Defensor del Empleado', 'Correcto. Ulrich definió estos 4 roles para que RR. HH. genere valor real y medible para el negocio.'],
              ['Control de tiempos y disciplina rígida del trabajador', 'Incorrecto. Esa característica corresponde al enfoque tayloriano/fayolista, décadas antes del modelo de Ulrich.'],
              ['Orquestación entre agentes humanos y de IA', 'Incorrecto. Esa característica corresponde al paradigma contemporáneo, posterior al modelo de Ulrich.'],
              ['Energía estratégica basada en neurociencia', 'Incorrecto. Esa característica corresponde al paradigma contemporáneo de orquestación humano-IA.']] },
        { name: 'Orquestación humano-IA', icon: 'fa-robot', c: 0,
          desc: "La GTH se enfrenta hoy a la Revolución Digital, donde la inteligencia artificial no reemplaza al humano, sino que redefine su trabajo mediante la 'orquestación humano-agente', exigiendo procesos continuos de reskilling y upskilling.",
          o: [['La IA redefine el trabajo humano combinando capacidades humanas y de IA', 'Correcto. La IA no sustituye al humano: reconfigura roles y exige reskilling/upskilling constantes.'],
              ['Control de tiempos y disciplina rígida del trabajador', 'Incorrecto. Esa característica corresponde al enfoque tayloriano/fayolista, el paradigma más antiguo.'],
              ['Diagnóstico de clima laboral de forma aislada', 'Incorrecto. Esa característica corresponde a la Escuela de Relaciones Humanas.'],
              ['Cuatro roles fijos sin evolución posible', 'Incorrecto. El modelo de Ulrich evolucionó hacia Ulrich+, por lo que los roles no son fijos ni estáticos.']] }
    ];
    /* ================= PARTE A: CLASIFICA POR ÉPOCA (independiente) ================= */
    // Orden de opciones mezclado de forma fija para que la correcta no sea siempre la "a"
    var optOrder = [[1, 0, 2, 3], [2, 1, 0, 3], [1, 2, 3, 0], [3, 1, 0, 2]];
    var letters = ['a', 'b', 'c', 'd'];
    var eraAns = eras.map(function () { return null; });
    var verifiedA = false; // no se califica ni se retroalimenta hasta presionar Verificar
    var curEra = 0;
    function partAScore() { return eraAns.filter(function (a, i) { return a === eras[i].c; }).length; }
    function updatePartAProgress() {
        var answered = eraAns.filter(function (a) { return a !== null; }).length;
        $('partAProgress').textContent = answered + '/4 respondidas' + (verifiedA ? ' · ' + partAScore() + ' correctas' : '');
    }
    function okIcon(ok) { return '<i class="fa-solid ' + (ok ? 'fa-circle-check' : 'fa-circle-xmark') + ' mr-1"></i>'; }
    // Quita el prefijo "Correcto." / "Incorrecto." para no repetirlo en la explicación de la respuesta correcta
    function explain(s) { return String(s).replace(/^(Correcto|Incorrecto)\.\s*/, ''); }
    // Tras verificar se muestra solo la opción correcta y su retroalimentación
    function eraFeedback(era, sel) {
        var ok = sel === era.c;
        return '<div style="color:#166534;"><span style="color:' + (ok ? '#16a34a' : '#dc2626') + ';">' + okIcon(ok) + '</span>' +
            'Respuesta correcta: <strong>' + esc(era.o[era.c][0]) + '</strong>. ' + esc(explain(era.o[era.c][1])) + '</div>';
    }
    function renderEras() {
        var tabs = $('actTabs'), panels = $('actPanels');
        if (!tabs) return;
        tabs.innerHTML = '';
        eras.forEach(function (era, i) {
            var t = document.createElement('button');
            t.type = 'button';
            t.className = 'act-tab' + (i === curEra ? ' active' : '');
            t.setAttribute('role', 'tab');
            t.setAttribute('aria-selected', i === curEra);
            var mark = '';
            if (verifiedA) mark = eraAns[i] === era.c ? ' <i class="fa-solid fa-circle-check" style="color:#16a34a;"></i>' : ' <i class="fa-solid fa-circle-xmark" style="color:#dc2626;"></i>';
            else if (eraAns[i] !== null) mark = ' <i class="fa-solid fa-pen" style="color:#6c757d;" title="Respondida"></i>';
            t.innerHTML = '<i class="fa-solid ' + era.icon + '"></i>' + (i + 1) + '. ' + esc(era.name) + mark;
            t.addEventListener('click', function () { curEra = i; renderEras(); });
            tabs.appendChild(t);
        });
        var era = eras[curEra], sel = eraAns[curEra];
        panels.innerHTML = '<p class="text-xs font-bold uppercase tracking-wide" style="color: #6c757d;">Pestaña ' + (curEra + 1) + ' de 4</p>' +
            '<h4 class="text-lg font-bold mt-1" style="color: var(--heading);"><i class="fa-solid ' + era.icon + ' mr-2"></i>' + esc(era.name) + '</h4>' +
            '<p class="text-sm leading-relaxed mt-2">' + esc(era.desc) + '</p>' +
            '<p class="text-sm font-semibold mt-4" style="color: var(--text);"><strong>Micro-pregunta.</strong> ¿Cuál de estas características corresponde a este paradigma?</p>' +
            '<div class="mt-3 space-y-2" id="eraOpts"></div>' +
            '<div class="mt-3 text-sm font-semibold" id="eraFeedback" role="status" aria-live="polite"></div>';
        var box = $('eraOpts');
        optOrder[curEra].forEach(function (oi, pos) {
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'quiz-option';
            if (verifiedA) {
                b.disabled = true;
                if (oi === era.c) b.classList.add('correct');
            } else if (oi === sel) {
                b.classList.add('selected');
            }
            b.setAttribute('aria-pressed', oi === sel);
            b.innerHTML = letters[pos] + ') ' + esc(era.o[oi][0]);
            b.addEventListener('click', function () { eraAns[curEra] = oi; $('partAMessage').textContent = ''; renderEras(); updatePartAProgress(); });
            box.appendChild(b);
        });
        // Navegación inferior: Anterior / Siguiente; en la última pestaña aparecen Reiniciar Parte A y Verificar
        var last = curEra === eras.length - 1;
        $('prevEraBtn').disabled = curEra === 0;
        $('nextEraBtn').classList.toggle('hidden', last);
        $('checkA').classList.toggle('hidden', !last || verifiedA);
        $('restartABottom').classList.toggle('hidden', !last || verifiedA);
        $('eraFeedback').innerHTML = verifiedA && sel !== null ? eraFeedback(era, sel) : '';
    }
    function renderPartAResults() {
        $('partAScoreTxt').textContent = partAScore() + '/4 correctas';
        $('partAReview').innerHTML = eras.map(function (era, i) {
            return '<div class="p-3 rounded-lg" style="background: var(--surface); border: 1px solid var(--line);"><p class="text-sm font-bold" style="color: var(--heading);">' + (i + 1) + '. ' + esc(era.name) + '</p>' +
                '<div class="text-sm mt-1">' + eraFeedback(era, eraAns[i]) + '</div></div>';
        }).join('');
    }
    if ($('prevEraBtn')) $('prevEraBtn').addEventListener('click', function () {
        if (curEra > 0) { curEra--; $('partAMessage').textContent = ''; renderEras(); }
    });
    if ($('nextEraBtn')) $('nextEraBtn').addEventListener('click', function () {
        if (!verifiedA && eraAns[curEra] === null) { $('partAMessage').textContent = 'Selecciona una opción para continuar.'; return; }
        if (curEra < eras.length - 1) { curEra++; $('partAMessage').textContent = ''; renderEras(); }
    });
    if ($('checkA')) $('checkA').addEventListener('click', function () {
        var m = eras.map(function (e, i) { return eraAns[i] === null ? i + 1 : null; }).filter(function (x) { return x !== null; });
        if (m.length) { $('partAMessage').textContent = 'Responde todas las pestañas antes de verificar. Te falta: pestaña ' + m.join(', ') + '.'; return; }
        verifiedA = true;
        $('partAMessage').textContent = '';
        $('checkA').disabled = true;
        renderEras(); updatePartAProgress(); renderPartAResults();
        $('partAResults').classList.remove('hidden');
        $('partAResults').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    function restartA() {
        eraAns = eras.map(function () { return null; }); verifiedA = false; curEra = 0;
        $('checkA').disabled = false;
        $('partAMessage').textContent = '';
        $('partAResults').classList.add('hidden'); $('partAReview').innerHTML = '';
        renderEras(); updatePartAProgress();
        setPart('partA');
        goTop();
    }
    root.querySelectorAll('.restartA-btn').forEach(function (b) { b.addEventListener('click', restartA); });
    if ($('goPartB')) $('goPartB').addEventListener('click', function () { showPart('partB'); });
    renderEras();

    /* ================= PARTE B: DIAGNOSTICA EL CASO (independiente, de construcción) ================= */
    var customCase = $('customCaseInput');
    if (customCase) customCase.addEventListener('input', function () {
        $('customCaseCounter').textContent = customCase.value.length + '/600 caracteres';
    });
    var roles = [
        { name: 'Socio Estratégico', icon: 'fa-chess-knight', note: 'Conecta cada decisión de RR. HH. con la estrategia del negocio; el rol más directo cuando el problema de fondo es que RR. HH. no participa en la conversación estratégica.' },
        { name: 'Agente de Cambio', icon: 'fa-arrows-rotate', note: 'Lidera la transformación organizacional; útil si el reto principal es gestionar una transición o resistencia al cambio, más que construir la estrategia desde cero.' },
        { name: 'Experto Administrativo', icon: 'fa-folder-tree', note: 'Asegura eficiencia operativa; necesario, pero por sí solo no resuelve una desconexión entre RR. HH. y la estrategia del negocio.' },
        { name: 'Defensor del Empleado', icon: 'fa-shield-heart', note: 'Vela por el bienestar y compromiso; relevante, aunque no es el rol que conecta directamente a RR. HH. con las prioridades estratégicas del negocio.' }
    ];
    var role = null;
    var verifiedB = false;
    var MAX_CHARS = 500, MIN_CHARS = 50;
    function renderRoles() {
        var box = $('roleOptions');
        if (!box) return;
        box.innerHTML = '';
        roles.forEach(function (r, i) {
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'quiz-option' + (role === i ? ' selected' : '');
            b.disabled = verifiedB;
            b.setAttribute('aria-pressed', role === i);
            b.innerHTML = '<i class="fa-solid ' + r.icon + ' mr-2"></i>' + esc(r.name);
            b.addEventListener('click', function () { role = i; renderRoles(); $('actMessage').textContent = ''; });
            box.appendChild(b);
        });
    }
    renderRoles();
    var just = $('justInput');
    function updateJustCounter() {
        var n = just.value.length;
        $('justCounter').textContent = n + '/' + MAX_CHARS + ' caracteres';
        $('justCounter').style.color = n >= MAX_CHARS ? '#d97706' : '#6c757d';
    }
    if (just) just.addEventListener('input', function () {
        updateJustCounter();
        if (just.value.trim().length >= MIN_CHARS) $('actMessage').textContent = '';
    });
    function caseText() {
        var c = customCase && customCase.value.trim();
        return c ? 'Caso propio: ' + c : 'Caso de referencia (empresa colombiana en transformación digital): RR. HH. dedica el 90% de su tiempo a tareas administrativas (meta 50%), 0 iniciativas estratégicas lideradas en el último año (meta ≥ 2), rotación de cargos clave del 22% (meta 10%) y alta percepción de RR. HH. como "solo nómina" (meta: baja).';
    }
    function block(title, body, soft) {
        return '<div class="p-3 rounded-lg" style="background: ' + (soft ? 'var(--surface-soft)' : 'var(--surface)') + '; border: 1px solid var(--line);"><p class="text-xs font-bold" style="color: var(--heading);">' + title + '</p><div class="text-sm mt-1" style="white-space: pre-wrap;">' + body + '</div></div>';
    }
    function renderResultsB() {
        var r = roles[role];
        $('actReview').innerHTML =
            block('Contexto del caso', esc(caseText()), true) +
            block('Rol de Ulrich(+) priorizado', '<strong>' + esc(r.name) + '</strong><div class="mt-2 p-2 rounded-lg text-sm" style="background:#D8EBF8; border:1px solid #17a2b8; white-space: normal;"><i class="fa-solid fa-compass mr-1" style="color:#0c7b8a;"></i><strong style="color:#0c7b8a;">Nota orientadora:</strong> ' + esc(r.note) + '</div>', false) +
            block('Tu justificación', esc(just.value.trim()), false);
        $('actResults').classList.remove('hidden');
        $('actResults').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    function plainSummary() {
        var r = roles[role];
        return 'DIAGNÓSTICO DEL CASO — ROL DE ULRICH(+)\n\n' + caseText() + '\n\n' +
            'Rol de Ulrich(+) priorizado: ' + r.name + '\nNota orientadora: ' + r.note + '\n\n' +
            'Justificación:\n' + just.value.trim() + '\n';
    }
    function summaryHTML() {
        var f = 'font-family:Poppins,Arial,sans-serif';
        var r = roles[role];
        return '<h1 style="color:#569151;' + f + '">Diagnóstico del caso — Rol de Ulrich(+)</h1>' +
            '<p style="' + f + '">' + esc(caseText()) + '</p>' +
            '<p style="' + f + '"><b>Rol de Ulrich(+) priorizado:</b> ' + esc(r.name) + '<br><i>Nota orientadora: ' + esc(r.note) + '</i></p>' +
            '<p style="' + f + ';word-wrap:break-word;overflow-wrap:anywhere"><b>Justificación:</b><br>' + esc(just.value.trim()).replace(/\n/g, '<br>') + '</p>';
    }
    if ($('actFinish')) $('actFinish').addEventListener('click', function () {
        var msg = $('actMessage');
        if (role === null) { msg.textContent = 'Selecciona el rol de Ulrich(+) que debería priorizar la empresa.'; return; }
        if (just.value.trim().length < MIN_CHARS) { msg.textContent = 'Escribe tu justificación (mínimo ' + MIN_CHARS + ' caracteres, máximo ' + MAX_CHARS + ').'; return; }
        msg.textContent = '';
        verifiedB = true;
        just.readOnly = true; if (customCase) customCase.readOnly = true;
        $('actFinish').disabled = true;
        renderRoles();
        renderResultsB();
    });

    /* Copiar / exportar / reiniciar (Parte B) */
    var copyMsg = $('actCopyMsg');
    function flash(msg) { copyMsg.textContent = msg; setTimeout(function () { copyMsg.textContent = ''; }, 3000); }
    if ($('actCopy')) $('actCopy').addEventListener('click', function () {
        var txt = plainSummary();
        var fallback = function () {
            var ta = document.createElement('textarea'); ta.value = txt; document.body.appendChild(ta); ta.select();
            try { document.execCommand('copy'); flash('Resumen copiado al portapapeles.'); } catch (e) { flash('No se pudo copiar automáticamente.'); }
            document.body.removeChild(ta);
        };
        if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(txt).then(function () { flash('Resumen copiado al portapapeles.'); }, fallback);
        else fallback();
    });
    var dlBtn = $('actDownloadBtn'), dlMenu = $('actDownloadMenu');
    function closeMenu() { if (dlMenu) { dlMenu.classList.add('hidden'); dlBtn.setAttribute('aria-expanded', 'false'); } }
    if (dlBtn) {
        dlBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            var open = dlMenu.classList.toggle('hidden') === false;
            dlBtn.setAttribute('aria-expanded', open);
        });
        document.addEventListener('click', function (e) { if (!dlMenu.contains(e.target) && !dlBtn.contains(e.target)) closeMenu(); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
    }
    function download(name, content, type) {
        var blob = content instanceof Blob ? content : new Blob([content], { type: type });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob); a.download = name;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    }
    if ($('actDownloadPdf')) $('actDownloadPdf').addEventListener('click', function () {
        var r = roles[role], G = '#3d6a3a', T = '#374151', MUT = '#6c757d';
        var blocks = [
            { text: 'Diagnóstico del caso — Rol de Ulrich(+)', size: 17, bold: true, color: '#569151', after: 2 },
            { text: 'Gerencia del Talento Humano · Unidad 1 · Tema 1 · Actividad Parte B', size: 9, color: MUT, after: 10 },
            { line: true, after: 10 },
            { text: 'Contexto del caso', size: 12, bold: true, color: G, after: 2 },
            { text: caseText(), size: 10.5, color: T, after: 12 },
            { text: 'Rol de Ulrich(+) priorizado', size: 12, bold: true, color: G, after: 2 },
            { text: r.name, size: 10.5, bold: true, color: T, after: 4 },
            { text: 'Nota orientadora: ' + r.note, size: 10, color: '#0c7b8a', after: 12 },
            { text: 'Justificación', size: 12, bold: true, color: G, after: 2 },
            { text: just.value.trim(), size: 10.5, color: T, after: 4 }
        ];
        var blob = window.OvaPDF.build(blocks, { title: 'Diagnóstico del caso — Rol de Ulrich', footer: 'CINTIA — Universidad de Córdoba' });
        download('Diagnostico_Ulrich.pdf', blob, 'application/pdf'); closeMenu(); flash('Archivo PDF exportado.');
    });
    if ($('actDownloadWord')) $('actDownloadWord').addEventListener('click', function () {
        var doc = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>Diagnóstico Ulrich</title></head><body>' + summaryHTML() + '</body></html>';
        download('Diagnostico_Ulrich.doc', '\ufeff' + doc, 'application/msword'); closeMenu(); flash('Archivo Word exportado.');
    });
    function restartB() {
        verifiedB = false; role = null;
        just.value = ''; just.readOnly = false; updateJustCounter();
        if (customCase) { customCase.value = ''; customCase.readOnly = false; $('customCaseCounter').textContent = '0/600 caracteres'; }
        $('actFinish').disabled = false;
        $('actMessage').textContent = '';
        closeMenu(); $('actResults').classList.add('hidden'); $('actReview').innerHTML = '';
        renderRoles();
        setPart('partB');
        goTop();
    }
    root.querySelectorAll('.restartB-btn').forEach(function (b) { b.addEventListener('click', restartB); });

    /* ================= AUTOEVALUACIÓN ================= */
    var quiz = [
        { q: '¿Qué evento histórico marcó el paso de una visión puramente mecánica del trabajador a una que reconoce factores psicológicos y sociales?', c: 1, o: [
            ["La publicación de 'Human Resource Champions' de Ulrich", 'Incorrecto. Esa publicación es posterior y corresponde al modelo de Ulrich, no a la transición hacia el reconocimiento de factores psicosociales.'],
            ['Los experimentos de Hawthorne liderados por Elton Mayo', 'Correcto. Los experimentos de Hawthorne evidenciaron que el clima laboral y la pertenencia influían más en la productividad que los incentivos salariales aislados.'],
            ['La Reforma Laboral colombiana de 2025', 'Incorrecto. Esta reforma es un hito normativo reciente, no el evento histórico que marcó ese cambio de paradigma.'],
            ['La creación del modelo Ulrich+', 'Incorrecto. Ulrich+ es una evolución posterior del modelo de Ulrich, no el hito de la Escuela de Relaciones Humanas.']] },
        { q: 'Según el modelo de Ulrich, ¿cuál rol se encarga de gestionar la transformación organizacional?', c: 2, o: [
            ['Experto Administrativo', 'Incorrecto. Este rol se enfoca en la eficiencia de los servicios operativos, no en liderar la transformación.'],
            ['Defensor del Empleado', 'Incorrecto. Este rol vela por el bienestar y compromiso, no por gestionar el cambio organizacional.'],
            ['Agente de Cambio', 'Correcto. El Agente de Cambio lidera y facilita los procesos de transformación dentro de la organización.'],
            ['Socio Estratégico', 'Incorrecto. Este rol alinea la estrategia del negocio con los procesos de RR. HH., pero no es el que gestiona directamente la transformación.']] },
        { q: "El modelo 'Ulrich+' incorpora, principalmente, expertos en:", c: 1, o: [
            ['Nómina y nómina electrónica', 'Incorrecto. Esa es una función administrativa básica, no la evolución que aporta Ulrich+.'],
            ['Planificación estratégica de la fuerza laboral y analítica de datos', 'Correcto. Esta evolución libera al socio de negocio de tareas operativas para enfocarse en proyectos de alto impacto.'],
            ['Auditoría financiera externa', 'Incorrecto. Esa función no corresponde al área de talento humano ni al modelo de Ulrich+.'],
            ['Producción industrial', 'Incorrecto. Ulrich+ es un modelo de gestión de talento humano, no de producción.']] },
        { q: "En la 'orquestación humano-agente', el papel de la inteligencia artificial en la GTH es:", c: 1, o: [
            ['Reemplazar completamente al gerente de talento humano', 'Incorrecto. La IA no reemplaza al humano; redefine su trabajo.'],
            ['Redefinir el trabajo humano combinando capacidades humanas y de IA', 'Correcto. La IA reconfigura roles y exige procesos continuos de reskilling y upskilling.'],
            ['Eliminar la necesidad de procesos de upskilling', 'Incorrecto. Es todo lo contrario: este paradigma exige procesos constantes de reskilling y upskilling.'],
            ['Sustituir la neurociencia aplicada a la gestión', 'Incorrecto. La neurociencia aplicada (energía estratégica) es complementaria, no sustituida por la IA.']] },
        { q: 'Taylor y Fayol concebían al trabajador principalmente como:', c: 1, o: [
            ['Un socio estratégico del negocio', 'Incorrecto. Esa visión corresponde al modelo de Ulrich, muchas décadas después.'],
            ["Un 'homo economicus', pieza del engranaje productivo", 'Correcto. El enfoque clásico centraba la gestión de personal en nómina, control de tiempos y disciplina, sin considerar factores emocionales.'],
            ['Un arquitecto de experiencias y cultura', 'Incorrecto. Esa visión corresponde al paradigma contemporáneo de orquestación humano-IA.'],
            ['Un agente de cambio organizacional', 'Incorrecto. Ese es uno de los roles del modelo de Ulrich, no la visión tayloriana/fayolista.']] }
    ];
    var qi = 0;
    var qSel = quiz.map(function () { return null; }); // respuestas del estudiante (sin calificar hasta Verificar)
    var letters = ['a', 'b', 'c', 'd'];
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
        $('quiz-feedback').textContent = score === quiz.length ? '¡Excelente! Dominas los fundamentos y la evolución de los modelos de dirección del talento humano.'
            : score >= 3 ? 'Buen trabajo. Repasa en el acordeón de Contenido las partes donde tuviste dudas.'
            : 'Te recomendamos revisar nuevamente la ruta histórica y las tres partes del Contenido antes de continuar.';
        // Solo se muestra la opción correcta con su retroalimentación
        $('quiz-review').innerHTML = quiz.map(function (item, i) {
            var ok = qSel[i] === item.c;
            return '<div class="p-3 rounded-lg" style="background: var(--surface); border: 1px solid var(--line);">' +
                '<p class="text-sm font-bold" style="color: var(--heading);"><span style="color:' + (ok ? '#16a34a' : '#dc2626') + ';">' + okIcon(ok) + '</span>' + (i + 1) + '. ' + esc(item.q) + '</p>' +
                '<p class="text-sm mt-2" style="color:#166534;">Respuesta correcta: <strong>' + letters[item.c] + ') ' + esc(item.o[item.c][0]) + '</strong></p>' +
                '<p class="text-xs mt-1" style="color: var(--text);">' + esc(explain(item.o[item.c][1])) + '</p></div>';
        }).join('');
        $('quiz-box').classList.add('hidden');
        $('quiz-results').classList.remove('hidden');
    }
    if ($('quiz-box')) {
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
    }
})();

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
