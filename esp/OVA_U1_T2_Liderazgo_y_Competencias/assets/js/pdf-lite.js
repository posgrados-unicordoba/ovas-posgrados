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
