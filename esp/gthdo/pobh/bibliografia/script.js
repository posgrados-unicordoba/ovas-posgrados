/* Interacciones del OVA gthdo-pobh-bibliografia. */

    const units = {
      UA01: 'Atracción, Selección y Retención del Talento Humano',
      UA02: 'Gestión de la cultura organizacional y clima laboral',
      UA03: 'Liderazgo disruptivo y gestión del cambio'
    };

    const platformMeta = {
      ebookcentral: { label: 'EbookCentral', color: 'bg-[#0097a7]/10 text-[#006978] border-[#0097a7]/20 hover:bg-[#0097a7]/20' },
      google: { label: 'Google Scholar', color: 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100' },
      dialnet: { label: 'Dialnet', color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' },
      researchgate: { label: 'ResearchGate', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' },
      repositorio: { label: 'Repositorio', color: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100' }
    };

    // Códigos QR guardados en img/ (uno por referencia, apuntan al primer enlace).
// Si agregas una referencia o cambias su título, genera su QR y agrégalo aquí.
const QR_LOCALES = {
  werther_administracion_personal: 'img/qr-01.png',
  chiavenato_gestion_talento_humano: 'img/qr-02.png',
  vivanco_talento_humano_implicaciones: 'img/qr-03.png',
  chiavenato_comportamiento_organizacional: 'img/qr-04.png',
  robbins_comportamiento_organizacional: 'img/qr-05.png',
  davis_comportamiento_humano_trabajo: 'img/qr-06.png',
  aguirre_clima_laboral_hospital: 'img/qr-07.png',
  muchinsky_psicologia_aplicada_trabajo: 'img/qr-08.png',
  papalia_desarrollo_humano: 'img/qr-09.png',
  kaufmann_introduccion_comportamiento_humano: 'img/qr-10.png'
};

function buildLink(platform, author, title) {
      const q = encodeURIComponent(title);
      const aq = encodeURIComponent(`${author} ${title}`);
      switch (platform) {
        case 'ebookcentral':
          return `https://ezproxyucor.unicordoba.edu.co/login?url=https://ebookcentral.proquest.com/lib/unicordobasp/search.action?query=${q}`;
        case 'google':
          return `https://scholar.google.com/scholar?q=${aq}`;
        case 'dialnet':
          return `https://dialnet.unirioja.es/servlet/busqueda?tipo=1&query=${q}`;
        case 'researchgate':
          return `https://www.researchgate.net/search/publication?q=${q}`;
        case 'repositorio':
          return `https://repositorio.unicordoba.edu.co/busqueda?search=${q}`;
        default:
          return '#';
      }
    }

    const rawItems = [
      {
        key: 'werther_administracion_personal',
        unit: 'UA01',
        author: 'Werther, W. B.',
        title: 'Administración de personal y recursos humanos',
        type: 'libro',
        platforms: ['ebookcentral', 'google']
      },
      {
        key: 'chiavenato_gestion_talento_humano',
        unit: 'UA01',
        author: 'Chiavenato, I.',
        title: 'Gestión del talento humano',
        type: 'libro',
        platforms: ['ebookcentral', 'google', 'researchgate']
      },
      {
        key: 'vivanco_talento_humano_implicaciones',
        unit: 'UA01',
        author: 'Vivanco Vargas, M.',
        title: 'El talento humano y sus implicaciones en el trabajo',
        type: 'libro',
        platforms: ['google']
      },
      {
        key: 'chiavenato_comportamiento_organizacional',
        unit: 'UA02',
        author: 'Chiavenato, I.',
        title: 'Comportamiento organizacional',
        type: 'libro',
        platforms: ['ebookcentral', 'google', 'researchgate']
      },
      {
        key: 'robbins_comportamiento_organizacional',
        unit: 'UA02',
        author: 'Robbins, S. P.',
        title: 'Comportamiento organizacional',
        type: 'libro',
        platforms: ['ebookcentral', 'google', 'researchgate']
      },
      {
        key: 'davis_comportamiento_humano_trabajo',
        unit: 'UA02',
        author: 'Davis, K.',
        title: 'El comportamiento humano en el trabajo',
        type: 'libro',
        platforms: ['ebookcentral', 'google', 'researchgate']
      },
      {
        key: 'aguirre_clima_laboral_hospital',
        unit: 'UA02',
        author: 'Aguirre Sierra, M. C.',
        title: 'Evaluación clima laboral – E.S.E. Hospital San Jerónimo, Montería 2016',
        type: 'documento',
        platforms: ['researchgate', 'google']
      },
      {
        key: 'muchinsky_psicologia_aplicada_trabajo',
        unit: 'UA03',
        author: 'Muchinsky, P. M.',
        title: 'Psicología aplicada al trabajo',
        type: 'libro',
        platforms: ['ebookcentral', 'google', 'researchgate']
      },
      {
        key: 'papalia_desarrollo_humano',
        unit: 'UA03',
        author: 'Papalia, D. E.',
        title: 'Desarrollo humano',
        type: 'libro',
        platforms: ['ebookcentral', 'google', 'researchgate']
      },
      {
        key: 'kaufmann_introduccion_comportamiento_humano',
        unit: 'UA03',
        author: 'Kaufmann, H.',
        title: 'Introducción al estudio del comportamiento humano',
        type: 'libro',
        platforms: ['google', 'researchgate']
      }
    ];

    function normalizeText(text) {
      return (text || '').replace(/\s+/g, ' ').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    const items = rawItems.map(it => ({ ...it, searchText: normalizeText(`${it.author} ${it.title} ${it.unit} ${units[it.unit]}`) }));

    const container = document.getElementById('references-container');
    const searchInput = document.getElementById('reference-search');
    const unitPills = Array.from(document.querySelectorAll('.filter-chip[data-unit]'));
    const typePills = Array.from(document.querySelectorAll('.filter-chip[data-type]'));

    const state = {
      unit: '',
      type: '',
      query: ''
    };

    const typeMeta = {
      libro: {
        label: 'Libro',
        border: 'border-[#2e7d32]',
        pill: 'bg-[#f0f9f0] text-[#1a472a]'
      },
      documento: {
        label: 'Documento',
        border: 'border-[#0097a7]',
        pill: 'bg-[#e0f2f1] text-[#006978]'
      }
    };

    function createPlatformLinks(platforms, author, title) {
      return platforms.map(p => {
        const meta = platformMeta[p] || { label: p, color: 'bg-slate-50 text-slate-700 border-slate-200' };
        const url = buildLink(p, author, title);
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="platform-chip inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${meta.color}"><span class="w-1.5 h-1.5 rounded-full"></span>${meta.label}</a>`;
      }).join('');
    }

    function createCard(item, idx) {
      const meta = typeMeta[item.type] || { label: 'Recurso', border: 'border-slate-300', pill: 'bg-slate-50 text-slate-700' };
      const article = document.createElement('article');
      article.className = `reference-card fade-in bg-white rounded-xl p-5 border-l-4 ${meta.border}`;
      article.dataset.type = item.type;
      article.dataset.unit = item.unit;
      article.style.setProperty('--delay', `${idx * 45}ms`);

      const refNum = String(idx + 1).padStart(2, '0');
      const links = createPlatformLinks(item.platforms, item.author, item.title);
      const primaryUrl = buildLink(item.platforms[0], item.author, item.title);
      const qrUrl = QR_LOCALES[item.key] || '';

      article.innerHTML = `
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Referencia ${refNum}</p>
            <h3 class="title-font text-lg text-[#1a472a] mt-1 leading-snug">${item.title}</h3>
            <p class="text-slate-700 text-sm font-medium mt-1">${item.author}</p>
          </div>
          <span class="type-pill uppercase shrink-0 ${meta.pill} px-2 py-1 rounded-full">${meta.label}</span>
        </div>
        <div class="card-actions mt-auto pt-4 flex items-end justify-between gap-3">
          <div class="flex flex-wrap gap-2">
            ${links}
          </div>
          <a href="${primaryUrl}" target="_blank" rel="noopener noreferrer" title="Abrir recurso principal / Código QR" class="shrink-0">
            <img src="${qrUrl}" alt="Código QR para ${item.title}" class="h-20 w-20 rounded-xl border border-slate-200 bg-white p-1 hover:scale-105 transition-transform" />
          </a>
        </div>
      `;

      return article;
    }

    function render(list) {
      container.innerHTML = '';

      if (!list.length) {
        const empty = document.createElement('div');
        empty.className = 'rounded-2xl border border-slate-200 bg-white/80 p-8 text-center text-slate-600 shadow-sm';
        empty.textContent = 'No hay referencias para mostrar con los filtros seleccionados.';
        container.appendChild(empty);
        return;
      }

      // Sin filtro de unidad: un único grid sin headers de unidad.
      if (!state.unit) {
        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5';
        list.forEach((item, idx) => {
          grid.appendChild(createCard(item, idx));
        });
        container.appendChild(grid);
        return;
      }

      // Con unidad filtrada: mostrar solo esa sección con su header.
      const section = document.createElement('section');
      section.className = 'unit-section';
      section.setAttribute('aria-labelledby', `unit-${state.unit}`);

      const header = document.createElement('div');
      header.className = 'unit-header rounded-r-xl px-5 py-4 mb-5';
      header.innerHTML = `
        <p class="text-xs font-bold uppercase tracking-widest text-[#0097a7]">${state.unit}</p>
        <h2 id="unit-${state.unit}" class="title-font text-xl md:text-2xl text-[#1a472a] mt-1">${units[state.unit]}</h2>
      `;
      section.appendChild(header);

      const grid = document.createElement('div');
      grid.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5';
      list.forEach((item, idx) => {
        grid.appendChild(createCard(item, idx));
      });
      section.appendChild(grid);
      container.appendChild(section);
    }

    function applyFilters() {
      const query = normalizeText(state.query || '');
      const filtered = items.filter((it) => {
        if (state.unit && it.unit !== state.unit) return false;
        if (state.type && it.type !== state.type) return false;
        if (query && !it.searchText.includes(query)) return false;
        return true;
      });

      filtered.sort((a, b) => a.unit.localeCompare(b.unit) || a.author.localeCompare(b.author));
      render(filtered);
    }

    function updatePills(pills, activeValue, key) {
      pills.forEach(p => {
        const val = p.getAttribute(`data-${key}`) || '';
        const active = val === activeValue;
        p.classList.toggle('is-active', active);
        p.setAttribute('aria-pressed', String(active));
      });
    }

    unitPills.forEach(pill => {
      pill.addEventListener('click', () => {
        state.unit = pill.getAttribute('data-unit') || '';
        updatePills(unitPills, state.unit, 'unit');
        applyFilters();
      });
    });

    typePills.forEach(pill => {
      pill.addEventListener('click', () => {
        state.type = pill.getAttribute('data-type') || '';
        updatePills(typePills, state.type, 'type');
        applyFilters();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        state.query = searchInput.value || '';
        applyFilters();
      });
    }

    applyFilters();

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
