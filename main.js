/* ========================================
   Miauguau - Shared JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* --- Mobile Menu Toggle --- */
  var mobileBtn = document.querySelector('.mobile-menu-btn');
  var navbar = document.querySelector('.top-navbar');
  var mobileOverlay = null;
  var mobileDrawer = null;

  if (mobileBtn) {
    // Create overlay
    mobileOverlay = document.createElement('div');
    mobileOverlay.className = 'mobile-overlay';
    mobileOverlay.addEventListener('click', closeMobileMenu);

    // Create drawer
    mobileDrawer = document.createElement('div');
    mobileDrawer.className = 'mobile-drawer';
    mobileDrawer.innerHTML = buildMobileNav();

    document.body.appendChild(mobileOverlay);
    document.body.appendChild(mobileDrawer);

    mobileBtn.addEventListener('click', function () {
      var isOpen = mobileDrawer.classList.contains('mobile-drawer--open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  function buildMobileNav() {
    var navLinks = document.querySelectorAll('.desktop-nav .nav-link');
    var searchHTML = '';
    var searchBar = document.querySelector('.search-bar');
    if (searchBar) {
      searchHTML = '<div class="mobile-drawer__search">' + searchBar.outerHTML + '</div>';
    }

    var linksHTML = '<nav class="mobile-drawer__nav">';
    navLinks.forEach(function (link) {
      var isActive = link.href === window.location.href ||
                     link.href === window.location.origin + window.location.pathname;
      var activeClass = isActive ? ' mobile-drawer__link--active' : '';
      linksHTML += '<a class="mobile-drawer__link' + activeClass + '" href="' + link.href + '">' +
                   link.textContent + '</a>';
    });
    linksHTML += '</nav>';

    var ctaBtn = document.querySelector('.btn-adopt-nav');
    var ctaHTML = '';
    if (ctaBtn) {
      ctaHTML = '<div class="mobile-drawer__cta"><a class="mobile-drawer__btn-adopt" href="adoptar.html">' +
                ctaBtn.textContent + '</a></div>';
    }

    return searchHTML + linksHTML + ctaHTML;
  }

  function openMobileMenu() {
    mobileDrawer.classList.add('mobile-drawer--open');
    mobileOverlay.classList.add('mobile-overlay--visible');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileDrawer.classList.remove('mobile-drawer--open');
    mobileOverlay.classList.remove('mobile-overlay--visible');
    document.body.style.overflow = '';
  }

  /* --- Active Nav Link --- */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  var allNavLinks = document.querySelectorAll('.nav-link');
  allNavLinks.forEach(function (link) {
    var linkPage = link.getAttribute('href').split('/').pop();
    if (linkPage === currentPage) {
      link.classList.add('nav-link--active');
    }
  });

  /* --- Smooth Scroll --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = this.getAttribute('href');
      if (target.length > 1) {
        var el = document.querySelector(target);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  /* --- Back to Top Button --- */
  var backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', 'Volver arriba');
  backToTop.innerHTML = '<span class="material-symbols-outlined">keyboard_arrow_up</span>';
  document.body.appendChild(backToTop);

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      backToTop.classList.add('back-to-top--visible');
    } else {
      backToTop.classList.remove('back-to-top--visible');
    }
  });

  /* --- Scroll Reveal Animations --- */
  var revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* --- Search Bar Functionality --- */
  var searchInputs = document.querySelectorAll('.search-input');
  searchInputs.forEach(function (input) {
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        var query = input.value.trim().toLowerCase();
        if (query) {
          // Simple highlight-based search: scroll to matching text
          highlightAndScroll(query);
        }
      }
    });
  });

  function highlightAndScroll(query) {
    // Remove existing highlights
    document.querySelectorAll('.search-highlight').forEach(function (el) {
      el.classList.remove('search-highlight');
    });

    // Find and highlight
    var mainContent = document.querySelector('.main-content');
    if (!mainContent) return;

    var walker = document.createTreeWalker(mainContent, NodeFilter.SHOW_TEXT, null, false);
    var found = false;
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

    // Remove highlight after 3 seconds
    setTimeout(function () {
      document.querySelectorAll('.search-highlight').forEach(function (el) {
        el.classList.remove('search-highlight');
      });
    }, 3000);
  }

  /* --- Navbar Scroll Effect --- */
  var lastScroll = 0;
  window.addEventListener('scroll', function () {
    var currentScroll = window.scrollY;
    if (currentScroll > 80) {
      navbar.classList.add('top-navbar--scrolled');
    } else {
      navbar.classList.remove('top-navbar--scrolled');
    }
    lastScroll = currentScroll;
  });

  /* --- Filter Chips (Adoption Page) --- */
  var filterChips = document.querySelectorAll('.filter-chip');
  if (filterChips.length > 0) {
    filterChips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        // Remove active from all
        filterChips.forEach(function (c) {
          c.classList.remove('filter-chip--active');
        });
        // Add active to clicked
        chip.classList.add('filter-chip--active');
      });
    });
  }

  /* --- Dark Mode Toggle --- */
  var darkToggle = document.createElement('button');
  darkToggle.className = 'dark-mode-toggle';
  darkToggle.setAttribute('aria-label', 'Cambiar modo oscuro');
  darkToggle.innerHTML = '<span class="material-symbols-outlined">dark_mode</span>';

  // Insert before mobile menu button
  var mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  if (mobileMenuBtn) {
    mobileMenuBtn.parentNode.insertBefore(darkToggle, mobileMenuBtn);
  }

  // Check saved preference
  var savedTheme = localStorage.getItem('miauguau-theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    darkToggle.innerHTML = '<span class="material-symbols-outlined">light_mode</span>';
  }

  darkToggle.addEventListener('click', function () {
    var isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      darkToggle.innerHTML = '<span class="material-symbols-outlined">dark_mode</span>';
      localStorage.setItem('miauguau-theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      darkToggle.innerHTML = '<span class="material-symbols-outlined">light_mode</span>';
      localStorage.setItem('miauguau-theme', 'dark');
    }
  });

  /* --- FAQ Accordion --- */
  var faqItems = document.querySelectorAll('.faq-item__question');
  faqItems.forEach(function (question) {
    question.addEventListener('click', function () {
      var item = question.closest('.faq-item');
      var isOpen = item.classList.contains('faq-item--open');

      // Close all other items
      document.querySelectorAll('.faq-item--open').forEach(function (openItem) {
        openItem.classList.remove('faq-item--open');
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('faq-item--open');
      }
    });
  });

  /* --- Pet Detail Modal --- */
  var petCards = document.querySelectorAll('.pet-card');
  if (petCards.length > 0) {
    // Create modal overlay
    var modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = '<div class="modal-card" style="position:relative;">' +
      '<button class="modal-card__close" aria-label="Cerrar"><span class="material-symbols-outlined">close</span></button>' +
      '<img class="modal-card__image" src="" alt="">' +
      '<div class="modal-card__body">' +
        '<h3 class="modal-card__name"></h3>' +
        '<p class="modal-card__info"></p>' +
        '<p class="modal-card__description"></p>' +
        '<div class="modal-card__tags"></div>' +
        '<a class="modal-card__adopt-btn" href="contacto.html">Iniciar Proceso de Adopción</a>' +
      '</div>' +
    '</div>';
    document.body.appendChild(modalOverlay);

    // Close modal on overlay click or close button
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay || e.target.closest('.modal-card__close')) {
        modalOverlay.classList.remove('modal-overlay--visible');
        document.body.style.overflow = '';
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modalOverlay.classList.contains('modal-overlay--visible')) {
        modalOverlay.classList.remove('modal-overlay--visible');
        document.body.style.overflow = '';
      }
    });

    // Pet descriptions data
    var petDescriptions = {
      'Luna': 'Luna es una perrita dulce y juguetona que llegó a nuestro refugio después de ser encontrada en la calle. Le encanta jugar con pelotas y es muy cariñosa con los niños. Está lista para encontrar una familia que la llene de amor.',
      'Max': 'Max es un perro leal y protector que necesita un hogar con urgencia. Fue rescatado de una situación de abandono y se ha recuperado maravillosamente. Es ideal para familias con espacio al aire libre.',
      'Mía': 'Mía es una gatita curiosa y traviesa que siempre está explorando. Le encanta subirse a los muebles y jugar con hilos. Es perfecta para departamentos y se lleva bien con otras mascotas.',
      'Thor': 'Thor es un perro enérgico y adiestrado que disfruta los paseos largos y el ejercicio. Es muy sociable con otros perros y le encanta correr en el parque. Ideal para personas activas.',
      'Kira': 'Kira es una gata cariñosa y tranquila que ama los mimos y el calor del hogar. Fue rescatada en condiciones delicadas y ahora busca una familia que le dé la estabilidad que necesita con urgencia.',
      'Rocky': 'Rocky es un perro adulto tranquilo y dócil. No necesita mucho ejercicio, solo amor y un lugar cómodo para descansar. Es ideal para personas mayores o familias que buscan un compañero sereno.'
    };

    // Open modal on pet card button click
    petCards.forEach(function (card) {
      var adoptBtn = card.querySelector('.pet-card__adopt-btn');
      if (adoptBtn) {
        adoptBtn.addEventListener('click', function (e) {
          e.preventDefault();
          var name = card.querySelector('.pet-card__name').textContent;
          var info = card.querySelector('.pet-card__info').textContent;
          var image = card.querySelector('.pet-card__image');
          var tags = card.querySelectorAll('.pet-card__tag');
          var desc = petDescriptions[name] || 'Esta mascota está buscando un hogar amoroso. Contáctanos para más información.';

          modalOverlay.querySelector('.modal-card__image').src = image ? image.src : '';
          modalOverlay.querySelector('.modal-card__image').alt = name;
          modalOverlay.querySelector('.modal-card__name').textContent = name;
          modalOverlay.querySelector('.modal-card__info').textContent = info;
          modalOverlay.querySelector('.modal-card__description').textContent = desc;

          var tagsContainer = modalOverlay.querySelector('.modal-card__tags');
          tagsContainer.innerHTML = '';
          tags.forEach(function (tag) {
            var tagClone = tag.cloneNode(true);
            tagsContainer.appendChild(tagClone);
          });

          modalOverlay.classList.add('modal-overlay--visible');
          document.body.style.overflow = 'hidden';
        });
      }
    });
  }

  /* --- Donation Cards Toggle --- */
  var donationCards = document.querySelectorAll('.donation-card');
  donationCards.forEach(function (card) {
    card.addEventListener('click', function () {
      donationCards.forEach(function (c) {
        c.classList.remove('donation-card--selected');
      });
      card.classList.add('donation-card--selected');
    });
  });

});
