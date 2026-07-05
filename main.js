(function () {
  'use strict';

  /* ================== SPA ROUTER ================== */
  var ROUTES = ['home', 'concientizar', 'adoptar', 'contacto'];
  var ROUTE_TITLES = {
    home: 'Miauguau — Adoptá, amá, salvá',
    concientizar: 'Miauguau — Concientización',
    adoptar: 'Miauguau — Adopciones',
    contacto: 'Miauguau — Contacto'
  };

  function getRouteFromHash() {
    var hash = window.location.hash.replace(/^#\//, '').replace(/^#/, '');
    if (!hash || ROUTES.indexOf(hash) === -1) return 'home';
    return hash;
  }

  function navigate(route, push) {
    if (ROUTES.indexOf(route) === -1) route = 'home';

    // toggle views
    var views = document.querySelectorAll('[data-page-view]');
    views.forEach(function (v) {
      v.classList.toggle('is-active', v.getAttribute('data-page-view') === route);
    });

    // update nav active
    document.querySelectorAll('[data-nav]').forEach(function (link) {
      var nav = link.getAttribute('data-nav');
      if (link.classList.contains('nav-link')) {
        link.classList.toggle('nav-link--active', nav === route);
      }
    });

    // update title
    document.title = ROUTE_TITLES[route] || ROUTE_TITLES.home;

    // update hash
    if (push !== false) {
      var newHash = route === 'home' ? '#/' : '#/' + route;
      if (window.location.hash !== newHash) {
        history.pushState({ route: route }, '', newHash);
      }
    }

    // scroll to top with smooth behavior
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // re-trigger reveal animations for the new view
    setTimeout(function () {
      var activeView = document.querySelector('[data-page-view="' + route + '"]');
      if (activeView) {
        activeView.querySelectorAll('.reveal').forEach(function (el) {
          el.classList.remove('reveal--visible');
        });
        // re-observe with the reveal observer if it exists
        if (window.__miauguauRevealObserver) {
          activeView.querySelectorAll('.reveal').forEach(function (el) {
            window.__miauguauRevealObserver.observe(el);
          });
        }
      }
    }, 50);

    // close mobile drawer if open
    closeMobileMenu();
  }

  // handle nav clicks
  document.addEventListener('click', function (e) {
    var target = e.target.closest('[data-nav]');
    if (!target) return;
    e.preventDefault();
    var route = target.getAttribute('data-nav');
    navigate(route);
  });

  // handle placeholder social links (href="#") gracefully
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a.contact-social-link[href="#"], a.footer-social[href="#"]');
    if (!link) return;
    e.preventDefault();
    var label = link.getAttribute('aria-label') || 'Red social';
    if (window.miauguauToast) {
      window.miauguauToast(label + ': próximamente estaremos en redes 🐾', 'info');
    }
  });

  // handle hash changes (back/forward)
  window.addEventListener('popstate', function () {
    navigate(getRouteFromHash(), false);
  });

  window.addEventListener('hashchange', function () {
    navigate(getRouteFromHash(), false);
  });

  /* ================== INIT ON DOM READY ================== */
  function init() {
    initToastContainer();
    initMobileMenu();
    initDarkMode();
    initScrollEffects();
    initRevealObserver();
    initBackToTop();
    initSearch();
    initFAQ();
    initPetModal();
    initNewsletter();
    initScrollProgress();
    initSmoothAnchorScroll();
    initFavorites();
    updateResultsCounter('all');

    // initial route
    navigate(getRouteFromHash(), false);
  }

  /* ================== TOAST SYSTEM ================== */
  var toastContainer = null;
  function initToastContainer() {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    toastContainer.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastContainer);
  }
  window.miauguauToast = function (message, type) {
    type = type || 'info';
    if (!toastContainer) return;
    var toast = document.createElement('div');
    toast.className = 'toast toast--' + type;
    var iconMap = { success: 'check', error: 'close', info: 'info' };
    toast.innerHTML =
      '<span class="toast__icon"><span class="material-symbols-outlined">' + (iconMap[type] || 'info') + '</span></span>' +
      '<span>' + message + '</span>';
    toastContainer.appendChild(toast);
    requestAnimationFrame(function () {
      toast.classList.add('toast--visible');
    });
    setTimeout(function () {
      toast.classList.remove('toast--visible');
      setTimeout(function () { toast.remove(); }, 400);
    }, 3500);
  };

  /* ================== FAVORITES SYSTEM ================== */
  var FAVS_KEY = 'miauguau-favorites';
  function getFavorites() {
    try { return JSON.parse(localStorage.getItem(FAVS_KEY) || '[]'); } catch (e) { return []; }
  }
  function saveFavorites(favs) {
    try { localStorage.setItem(FAVS_KEY, JSON.stringify(favs)); } catch (e) { }
  }
  function initFavorites() {
    var favs = getFavorites();
    // Mark favorite buttons as active
    document.querySelectorAll('.pet-card__fav').forEach(function (btn) {
      var name = btn.getAttribute('data-pet-name');
      if (favs.indexOf(name) !== -1) btn.classList.add('pet-card__fav--active');
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(name, btn);
      });
    });
    updateFavCount();
  }
  function toggleFavorite(name, btn) {
    var favs = getFavorites();
    var idx = favs.indexOf(name);
    if (idx === -1) {
      favs.push(name);
      btn.classList.add('pet-card__fav--active');
      window.miauguauToast(name + ' agregado a favoritos', 'success');
    } else {
      favs.splice(idx, 1);
      btn.classList.remove('pet-card__fav--active');
      window.miauguauToast(name + ' removido de favoritos', 'info');
    }
    saveFavorites(favs);
    updateFavCount();
    // If currently on favorites filter, re-apply
    var activeChip = document.querySelector('.filter-chip--active[data-filter="favorites"]');
    if (activeChip) applyPetFilter('favorites');
  }
  function updateFavCount() {
    var favs = getFavorites();
    document.querySelectorAll('.filter-chip__fav-count').forEach(function (el) {
      el.textContent = favs.length;
    });
  }

  /* ================== PET FILTERS + COUNTER ================== */
  function applyPetFilter(filter) {
    var cards = document.querySelectorAll('.pet-card');
    var visible = 0;
    var favs = getFavorites();
    cards.forEach(function (card) {
      var show = false;
      if (filter === 'all') {
        show = true;
      } else if (filter === 'favorites') {
        var name = card.querySelector('.pet-card__name')?.textContent.trim();
        show = favs.indexOf(name) !== -1;
      } else if (filter === 'urgentes') {
        show = card.getAttribute('data-pet-urgent') === 'true';
      } else if (filter === 'perros' || filter === 'gatos') {
        show = card.getAttribute('data-pet-type') === filter;
      } else if (filter === 'cachorros') {
        show = card.getAttribute('data-pet-age') === 'joven';
      } else if (filter === 'adultos') {
        show = card.getAttribute('data-pet-age') === 'adulto';
      }
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    updateResultsCounter(filter, visible);
    // Show empty state if no results
    showEmptyState(visible, filter);
  }
  function updateResultsCounter(filter, count) {
    var counter = document.getElementById('resultsCounter');
    if (!counter) return;
    if (count === undefined) {
      // Calculate based on filter
      var favs = getFavorites();
      var cards = document.querySelectorAll('.pet-card');
      count = 0;
      cards.forEach(function (card) {
        var show = false;
        if (filter === 'all') show = true;
        else if (filter === 'favorites') {
          var name = card.querySelector('.pet-card__name')?.textContent.trim();
          show = favs.indexOf(name) !== -1;
        } else if (filter === 'urgentes') show = card.getAttribute('data-pet-urgent') === 'true';
        else if (filter === 'perros' || filter === 'gatos') show = card.getAttribute('data-pet-type') === filter;
        else if (filter === 'cachorros') show = card.getAttribute('data-pet-age') === 'joven';
        else if (filter === 'adultos') show = card.getAttribute('data-pet-age') === 'adulto';
        if (show) count++;
      });
    }
    var labels = {
      all: 'mascotas', perros: 'perros', gatos: 'gatos', cachorros: 'cachorros',
      adultos: 'adultos', urgentes: 'urgentes', favorites: 'favoritos'
    };
    var label = labels[filter] || 'mascotas';
    counter.innerHTML = 'Mostrando <strong>' + count + '</strong> ' + label;
  }
  function showEmptyState(visible, filter) {
    var grid = document.querySelector('[data-page-view="adoptar"] .info-grid');
    if (!grid) return;
    var empty = grid.querySelector('.empty-state');
    if (visible === 0) {
      if (!empty) {
        empty = document.createElement('div');
        empty.className = 'empty-state';
        var messages = {
          favorites: { title: 'No tenés favoritos todavía', text: 'Tocá el corazón en cualquier mascota para guardarla acá.' },
          perros: { title: 'No hay perros disponibles', text: 'Volvé pronto, estamos rescatando más amigos.' },
          gatos: { title: 'No hay gatos disponibles', text: 'Volvé pronto, estamos rescatando más amigos.' },
          urgentes: { title: 'No hay adopciones urgentes', text: 'Por ahora todas las mascotas están en buen estado.' },
          cachorros: { title: 'No hay cachorros disponibles', text: 'Volvé pronto, llegan nuevos cachorros cada semana.' },
          adultos: { title: 'No hay adultos disponibles', text: 'Volvé pronto, estamos rescatando más amigos.' }
        };
        var msg = messages[filter] || { title: 'Sin resultados', text: 'Probá con otro filtro.' };
        empty.innerHTML =
          '<div class="empty-state__icon"><span class="material-symbols-outlined">pets</span></div>' +
          '<p class="empty-state__title">' + msg.title + '</p>' +
          '<p class="empty-state__text">' + msg.text + '</p>';
        grid.appendChild(empty);
      }
    } else {
      if (empty) empty.remove();
    }
  }

  /* ================== MOBILE MENU ================== */
  var mobileOverlay = null;
  var mobileDrawer = null;

  function initMobileMenu() {
    var btn = document.querySelector('.mobile-menu-btn');
    if (!btn) return;

    mobileOverlay = document.createElement('div');
    mobileOverlay.className = 'mobile-overlay';
    mobileOverlay.addEventListener('click', closeMobileMenu);

    mobileDrawer = document.createElement('div');
    mobileDrawer.className = 'mobile-drawer';
    mobileDrawer.innerHTML = buildMobileNav();

    document.body.appendChild(mobileOverlay);
    document.body.appendChild(mobileDrawer);

    btn.addEventListener('click', function () {
      if (mobileDrawer.classList.contains('mobile-drawer--open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  function buildMobileNav() {
    var searchHTML = '';
    var searchBar = document.querySelector('.search-bar');
    if (searchBar) {
      searchHTML = '<div class="mobile-drawer__search">' + searchBar.outerHTML + '</div>';
    }
    var linksHTML = '<nav class="mobile-drawer__nav">';
    ROUTES.forEach(function (route) {
      var labels = { home: 'Inicio', concientizar: 'Concientización', adoptar: 'Adopciones', contacto: 'Contacto' };
      var hash = route === 'home' ? '#/' : '#/' + route;
      linksHTML += '<a class="mobile-drawer__link" data-nav="' + route + '" href="' + hash + '">' + labels[route] + '</a>';
    });
    linksHTML += '</nav>';
    var ctaHTML = '<div class="mobile-drawer__cta"><button class="mobile-drawer__btn-adopt" data-nav="adoptar">Adoptar ahora</button></div>';
    return searchHTML + linksHTML + ctaHTML;
  }

  function openMobileMenu() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('mobile-drawer--open');
    mobileOverlay.classList.add('mobile-overlay--visible');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('mobile-drawer--open');
    mobileOverlay.classList.remove('mobile-overlay--visible');
    document.body.style.overflow = '';
  }

  /* ================== DARK MODE ================== */
  function initDarkMode() {
    var toggle = document.querySelector('.dark-mode-toggle');
    if (!toggle) return;

    var saved = localStorage.getItem('miauguau-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      toggle.innerHTML = '<span class="material-symbols-outlined">light_mode</span>';
    }

    toggle.addEventListener('click', function () {
      var isDark = document.documentElement.classList.contains('dark');
      if (isDark) {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        toggle.innerHTML = '<span class="material-symbols-outlined">dark_mode</span>';
        localStorage.setItem('miauguau-theme', 'light');
      } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        toggle.innerHTML = '<span class="material-symbols-outlined">light_mode</span>';
        localStorage.setItem('miauguau-theme', 'dark');
      }
    });
  }

  /* ================== SCROLL EFFECTS ================== */
  function initScrollEffects() {
    var navbar = document.querySelector('.top-navbar');
    var ticking = false;

    function update() {
      if (navbar) {
        if (window.scrollY > 40) navbar.classList.add('top-navbar--scrolled');
        else navbar.classList.remove('top-navbar--scrolled');
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  }

  /* ================== REVEAL OBSERVER ================== */
  function initRevealObserver() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('reveal--visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    window.__miauguauRevealObserver = observer;

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ================== BACK TO TOP ================== */
  function initBackToTop() {
    var btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Volver arriba');
    btn.innerHTML = '<span class="material-symbols-outlined">keyboard_arrow_up</span>';
    document.body.appendChild(btn);

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          btn.classList.toggle('back-to-top--visible', window.scrollY > 500);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ================== SEARCH ================== */
  function initSearch() {
    var inputs = document.querySelectorAll('.search-input');
    inputs.forEach(function (input) {
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          var query = input.value.trim().toLowerCase();
          if (query) {
            // navigate to adoptar and highlight matches
            navigate('adoptar');
            setTimeout(function () { highlightAndScroll(query); }, 400);
          }
        }
      });
    });
  }

  function highlightAndScroll(query) {
    document.querySelectorAll('.search-highlight').forEach(function (el) {
      el.classList.remove('search-highlight');
    });

    var activeView = document.querySelector('[data-page-view].is-active') || document;
    var petCards = activeView.querySelectorAll('.pet-card');
    var found = false;

    petCards.forEach(function (card) {
      var name = card.querySelector('.pet-card__name');
      if (name && name.textContent.toLowerCase().includes(query)) {
        card.classList.add('search-highlight');
        if (!found) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          found = true;
        }
      }
    });

    if (!found) {
      var mainContent = document.querySelector('.main-content');
      if (!mainContent) return;
      var walker = document.createTreeWalker(mainContent, NodeFilter.SHOW_TEXT, null, false);
      while (walker.nextNode()) {
        if (walker.currentNode.textContent.toLowerCase().includes(query)) {
          var parent = walker.currentNode.parentElement;
          if (parent) {
            parent.classList.add('search-highlight');
            if (!found) {
              parent.scrollIntoView({ behavior: 'smooth', block: 'center' });
              found = true;
            }
          }
        }
      }
    }

    setTimeout(function () {
      document.querySelectorAll('.search-highlight').forEach(function (el) {
        el.classList.remove('search-highlight');
      });
    }, 3000);
  }

  /* ================== FAQ ACCORDION ================== */
  function initFAQ() {
    var questions = document.querySelectorAll('.faq-item__question');
    questions.forEach(function (q) {
      q.addEventListener('click', function () {
        var item = q.closest('.faq-item');
        var isOpen = item.classList.contains('faq-item--open');
        document.querySelectorAll('.faq-item--open').forEach(function (open) {
          open.classList.remove('faq-item--open');
        });
        if (!isOpen) item.classList.add('faq-item--open');
      });
    });
  }

  /* ================== PET MODAL ================== */
  var petDescriptions = {
    'Luna': 'Luna es una perrita dulce y juguetona que llegó a nuestro refugio después de ser encontrada en la calle. Le encanta jugar con pelotas y es muy cariñosa con los niños. Está lista para encontrar una familia que la llene de amor.',
    'Max': 'Max es un perro leal y protector que necesita un hogar con urgencia. Fue rescatado de una situación de abandono y se ha recuperado maravillosamente. Es ideal para familias con espacio al aire libre.',
    'Mía': 'Mía es una gatita curiosa y traviesa que siempre está explorando. Le encanta subirse a los muebles y jugar con hilos. Es perfecta para departamentos y se lleva bien con otras mascotas.',
    'Thor': 'Thor es un perro enérgico y adiestrado que disfruta los paseos largos y el ejercicio. Es muy sociable con otros perros y le encanta correr en el parque. Ideal para personas activas.',
    'Kira': 'Kira es una gata cariñosa y tranquila que ama los mimos y el calor del hogar. Fue rescatada en condiciones delicadas y ahora busca una familia que le dé la estabilidad que necesita con urgencia.',
    'Rocky': 'Rocky es un perro adulto tranquilo y dócil. No necesita mucho ejercicio, solo amor y un lugar cómodo para descansar. Es ideal para personas mayores o familias que buscan un compañero sereno.'
  };

  function initPetModal() {
    var petCards = document.querySelectorAll('.pet-card');
    if (!petCards.length) return;

    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML =
      '<div class="modal-card">' +
        '<button class="modal-card__close" aria-label="Cerrar"><span class="material-symbols-outlined">close</span></button>' +
        '<img class="modal-card__image" src="" alt="">' +
        '<div class="modal-card__body">' +
          '<h3 class="modal-card__name"></h3>' +
          '<p class="modal-card__info"></p>' +
          '<p class="modal-card__description"></p>' +
          '<div class="modal-card__tags"></div>' +
          '<button class="modal-card__adopt-btn" data-nav="contacto" type="button">' +
            '<span class="material-symbols-outlined">favorite</span>' +
            'Iniciar proceso de adopción' +
          '</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target.closest('.modal-card__close')) {
        closeModal();
      }
    });

    // Close modal when clicking the "Iniciar proceso de adopción" button
    // (the global [data-nav] handler will still navigate to contacto)
    var modalAdoptBtn = overlay.querySelector('.modal-card__adopt-btn');
    if (modalAdoptBtn) {
      modalAdoptBtn.addEventListener('click', function () {
        closeModal();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('modal-overlay--visible')) {
        closeModal();
      }
    });

    function closeModal() {
      overlay.classList.remove('modal-overlay--visible');
      document.body.style.overflow = '';
    }

    petCards.forEach(function (card) {
      var btn = card.querySelector('.pet-card__adopt-btn');
      if (btn) {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          var name = card.querySelector('.pet-card__name').textContent.trim();
          var info = card.querySelector('.pet-card__info').textContent.trim();
          var image = card.querySelector('.pet-card__image');
          var tags = card.querySelectorAll('.pet-card__tag');
          var desc = petDescriptions[name] || 'Esta mascota está buscando un hogar amoroso. Contactanos para más información.';

          overlay.querySelector('.modal-card__image').src = image ? image.src : '';
          overlay.querySelector('.modal-card__image').alt = name;
          overlay.querySelector('.modal-card__name').textContent = name;
          overlay.querySelector('.modal-card__info').textContent = info;
          overlay.querySelector('.modal-card__description').textContent = desc;

          var tagsContainer = overlay.querySelector('.modal-card__tags');
          tagsContainer.innerHTML = '';
          tags.forEach(function (tag) {
            tagsContainer.appendChild(tag.cloneNode(true));
          });

          overlay.classList.add('modal-overlay--visible');
          document.body.style.overflow = 'hidden';
        });
      }
    });
  }

  /* ================== PET FILTERS (click delegation) ================== */
  document.addEventListener('click', function (e) {
    var chip = e.target.closest('.filter-chip');
    if (!chip) return;

    document.querySelectorAll('.filter-chip').forEach(function (c) {
      c.classList.remove('filter-chip--active');
    });
    chip.classList.add('filter-chip--active');

    var filter = chip.getAttribute('data-filter');
    applyPetFilter(filter);
  });

  /* ================== NEWSLETTER ================== */
  function initNewsletter() {
    var form = document.getElementById('newsletterForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = document.getElementById('newsletterEmail').value.trim();
      var successDiv = document.getElementById('newsletterSuccess');
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        // Show inline error for invalid email
        successDiv.hidden = false;
        successDiv.className = 'newsletter-error';
        successDiv.innerHTML = '<span class="material-symbols-outlined">error</span> Por favor ingresá un email válido.';
        form.reset();
        if (window.miauguauToast) window.miauguauToast('Email inválido. Revisá el formato.', 'error');
        setTimeout(function () {
          successDiv.hidden = true;
        }, 4000);
        return;
      }

      successDiv.hidden = false;
      successDiv.className = 'newsletter-success';
      successDiv.innerHTML = '<span class="material-symbols-outlined">check_circle</span> ¡Listo! Te sumaste a la comunidad Miauguau.';
      form.reset();
      setTimeout(function () {
        successDiv.hidden = true;
      }, 5000);
    });
  }

  /* ================== SCROLL PROGRESS BAR ================== */
  function initScrollProgress() {
    var bar = document.createElement('div');
    bar.className = 'cult-scroll-progress';
    document.body.appendChild(bar);

    var ticking = false;
    function update() {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = progress + '%';
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  }

  /* ================== SMOOTH ANCHOR SCROLL ================== */
  function initSmoothAnchorScroll() {
    document.querySelectorAll('a[href^="#"]:not([data-nav])').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href === '#' || href.length < 2) return;
        var el = document.querySelector(href);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  /* ================== BOOT ================== */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
