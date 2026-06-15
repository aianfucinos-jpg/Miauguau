/* ========================================
   Miauguau - Contact Page JavaScript
   v4.0 - Ultra-robust email suggestion + submit
   ======================================== */

(function () {
  'use strict';

  var commonDomains = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
    'live.com', 'aol.com', 'icloud.com', 'mail.com',
    'protonmail.com', 'zoho.com', 'yandex.com', 'qq.com',
    'terra.com', 'uol.com.br', 'bol.com.br', 'yahoo.com.ar',
    'hotmail.es'
  ];

  function levenshtein(a, b) {
    var tmp, i, j, prev, val;
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    if (a.length > b.length) { tmp = a; a = b; b = tmp; }
    var row = new Array(a.length + 1);
    for (i = 0; i <= a.length; i++) row[i] = i;
    for (i = 1; i <= b.length; i++) {
      prev = i;
      for (j = 1; j <= a.length; j++) {
        if (b[i - 1] === a[j - 1]) val = row[j - 1];
        else val = Math.min(row[j - 1] + 1, Math.min(prev + 1, row[j] + 1));
        row[j - 1] = prev;
        prev = val;
      }
      row[a.length] = prev;
    }
    return row[a.length];
  }

  function findClosestDomain(domain) {
    if (!domain || domain.length < 2) return null;
    var lowerDomain = domain.toLowerCase().trim();
    var bestMatch = null;
    var bestDist = Infinity;
    // More aggressive threshold: allow up to 40% of domain length or at least 3
    var maxDist = Math.max(3, Math.floor(lowerDomain.length * 0.4));
    for (var i = 0; i < commonDomains.length; i++) {
      if (lowerDomain === commonDomains[i]) return null; // exact match = no suggestion needed
      var dist = levenshtein(lowerDomain, commonDomains[i]);
      if (dist < bestDist && dist <= maxDist) {
        bestDist = dist;
        bestMatch = commonDomains[i];
      }
    }
    return bestMatch;
  }

  function checkEmailDomain(emailValue) {
    if (!emailValue) return null;
    var value = emailValue.trim();
    var atPos = value.indexOf('@');
    if (atPos < 1 || atPos >= value.length - 1) return null;
    var domain = value.substring(atPos + 1);
    if (domain.length < 2) return null;
    return findClosestDomain(domain);
  }

  function init() {
    var contactForm = document.getElementById('contactForm');
    if (!contactForm || contactForm._contactoInit) return;
    contactForm._contactoInit = true;

    var emailInput = document.getElementById('email');
    var nameInput = document.getElementById('name');
    var messageInput = document.getElementById('message');
    var subjectInput = document.getElementById('subject');
    var submitBtn = contactForm.querySelector('.btn-submit');

    if (!emailInput || !submitBtn) return;

    // Track suggested email
    var currentSuggestedEmail = null;

    // Extra safety: prevent form from actually submitting via HTML attributes
    contactForm.setAttribute('action', 'javascript:void(0)');
    contactForm.setAttribute('onsubmit', 'return false;');

    /* ============================================
       EMAIL SUGGESTION UI
       ============================================ */

    function showSuggestion(suggestedDomain) {
      removeSuggestion();
      if (!suggestedDomain) return;

      var localPart = emailInput.value.split('@')[0] || '';
      var fullSuggestion = localPart + '@' + suggestedDomain;
      currentSuggestedEmail = fullSuggestion;

      var el = document.createElement('div');
      el.className = 'email-suggestion';
      el.setAttribute('role', 'alert');
      el.innerHTML =
        '<span class="material-symbols-outlined email-suggestion__icon">spellcheck</span>' +
        '<span class="email-suggestion__text">' +
          '¿Quisiste decir ' +
          '<button type="button" class="email-suggestion__domain">' + fullSuggestion + '</button>' +
          '?' +
        '</span>' +
        '<button type="button" class="email-suggestion__btn">' +
          '<span class="material-symbols-outlined" style="font-size:14px;">arrow_forward</span>' +
          'Cambiar' +
        '</button>';

      var group = emailInput.closest('.form-group');
      group.appendChild(el);

      function applySuggestion(evt) {
        if (evt) {
          evt.preventDefault();
          evt.stopPropagation();
        }
        emailInput.value = fullSuggestion;
        currentSuggestedEmail = null;
        removeSuggestion();
        emailInput.classList.remove('form-input--error');
        emailInput.classList.add('form-input--success');
        var err = group.querySelector('.form-error');
        if (err) err.remove();
      }

      el.querySelector('.email-suggestion__domain').addEventListener('click', applySuggestion);
      el.querySelector('.email-suggestion__btn').addEventListener('click', applySuggestion);
    }

    function removeSuggestion() {
      var group = emailInput.closest('.form-group');
      if (!group) return;
      var existing = group.querySelector('.email-suggestion');
      if (existing) existing.remove();
    }

    function checkAndShowSuggestion() {
      var suggestion = checkEmailDomain(emailInput.value);
      if (suggestion) {
        showSuggestion(suggestion);
      } else {
        currentSuggestedEmail = null;
        removeSuggestion();
      }
    }

    /* --- Email input listeners --- */
    var debounceTimer = null;

    emailInput.addEventListener('keyup', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(checkAndShowSuggestion, 300);
    });

    emailInput.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(checkAndShowSuggestion, 300);
    });

    emailInput.addEventListener('blur', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(checkAndShowSuggestion, 150);
    });

    /* ============================================
       FORM VALIDATION
       ============================================ */

    var validators = {
      name: function (value) {
        if (!value.trim()) return 'Por favor ingresa tu nombre';
        if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
        return '';
      },
      email: function (value) {
        if (!value.trim()) return 'Por favor ingresa tu email';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Por favor ingresa un email válido';
        return '';
      },
      subject: function (value) {
        if (!value) return 'Por favor selecciona un asunto';
        return '';
      },
      message: function (value) {
        if (!value.trim()) return 'Por favor escribe tu mensaje';
        if (value.trim().length < 10) return 'El mensaje debe tener al menos 10 caracteres';
        return '';
      }
    };

    function showError(input, message) {
      input.classList.add('form-input--error');
      input.classList.remove('form-input--success');
      var group = input.closest('.form-group');
      var existing = group.querySelector('.form-error');
      if (existing) existing.remove();
      if (message) {
        var el = document.createElement('p');
        el.className = 'form-error';
        el.textContent = message;
        group.appendChild(el);
      }
    }

    function showSuccess(input) {
      input.classList.remove('form-input--error');
      input.classList.add('form-input--success');
      var group = input.closest('.form-group');
      var existing = group.querySelector('.form-error');
      if (existing) existing.remove();
    }

    // Blur validation
    var formFields = contactForm.querySelectorAll('.form-input, .form-select, .form-textarea');
    formFields.forEach(function (field) {
      field.addEventListener('blur', function () {
        var name = field.getAttribute('name');
        if (validators[name] && field.value.trim()) {
          var error = validators[name](field.value);
          if (error) showError(field, error);
          else showSuccess(field);
        }
      });
      field.addEventListener('focus', function () {
        field.classList.remove('form-input--error');
      });
    });

    /* ============================================
       FORM SUBMISSION
       - Handles both click and submit events
       - NEVER blocks for domain issues
       ============================================ */

    var isSubmitting = false;

    function handleSubmit(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      // Prevent double-submit
      if (isSubmitting) return;
      isSubmitting = true;

      // Validate all fields
      var isValid = true;
      formFields.forEach(function (field) {
        var name = field.getAttribute('name');
        if (validators[name]) {
          var error = validators[name](field.value);
          if (error) {
            showError(field, error);
            isValid = false;
          } else {
            showSuccess(field);
          }
        }
      });

      if (!isValid) {
        isSubmitting = false;
        var firstError = contactForm.querySelector('.form-input--error, .form-select--error, .form-textarea--error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstError.focus();
        }
        return;
      }

      // Get email info before clearing
      var submittedEmail = emailInput.value.trim();
      var suggestedEmail = currentSuggestedEmail;

      // If no suggestion was detected yet, check one more time
      if (!suggestedEmail) {
        var lastCheck = checkEmailDomain(submittedEmail);
        if (lastCheck) {
          suggestedEmail = submittedEmail.split('@')[0] + '@' + lastCheck;
        }
      }

      // Submit button state
      var originalHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="material-symbols-outlined animate-spin">sync</span> Enviando...';
      submitBtn.disabled = true;

      setTimeout(function () {
        submitBtn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> ¡Mensaje Enviado!';
        submitBtn.classList.add('btn-submit--success');

        showEmailWarning(submittedEmail, suggestedEmail);

        setTimeout(function () {
          submitBtn.innerHTML = originalHTML;
          submitBtn.classList.remove('btn-submit--success');
          submitBtn.disabled = false;
          isSubmitting = false;
          contactForm.reset();
          currentSuggestedEmail = null;
          removeSuggestion();
          formFields.forEach(function (field) {
            field.classList.remove('form-input--success');
            field.classList.remove('form-input--error');
          });
        }, 5000);
      }, 1500);
    }

    // Attach to BOTH the button click AND form submit for maximum reliability
    submitBtn.addEventListener('click', handleSubmit);
    contactForm.addEventListener('submit', handleSubmit);

    /* ============================================
       POST-SUBMIT EMAIL WARNING
       ============================================ */

    function showEmailWarning(submittedEmail, suggestedEmail) {
      var existing = document.querySelector('.email-confirm-warning');
      if (existing) existing.remove();

      var warning = document.createElement('div');
      warning.className = 'email-confirm-warning';
      warning.setAttribute('role', 'alert');

      var emailNote;
      if (suggestedEmail && suggestedEmail !== submittedEmail) {
        emailNote =
          '<p class="email-confirm-warning__highlight">' +
            'Ingresaste <strong>' + submittedEmail + '</strong>. ¿No quisiste decir <strong>' + suggestedEmail + '</strong>?' +
          '</p>';
      } else {
        emailNote =
          '<p class="email-confirm-warning__highlight">' +
            'Prestá atención al email que ingresaste para asegurarte de que esté bien escrito.' +
          '</p>';
      }

      warning.innerHTML =
        '<div class="email-confirm-warning__icon">' +
          '<span class="material-symbols-outlined">mark_email_unread</span>' +
        '</div>' +
        '<div class="email-confirm-warning__content">' +
          '<p class="email-confirm-warning__title">¡Revisá tu email!</p>' +
          emailNote +
          '<p class="email-confirm-warning__text">Si no recibís una respuesta en las próximas 48 horas, por favor volvé a enviar el formulario verificando que tu dirección de email sea correcta.</p>' +
        '</div>' +
        '<button type="button" class="email-confirm-warning__close" title="Cerrar">' +
          '<span class="material-symbols-outlined">close</span>' +
        '</button>';

      var formCard = document.querySelector('.form-card');
      if (formCard) {
        formCard.parentNode.insertBefore(warning, formCard.nextSibling);
      } else {
        contactForm.parentNode.insertBefore(warning, contactForm.nextSibling);
      }

      warning.querySelector('.email-confirm-warning__close').addEventListener('click', function () {
        warning.style.opacity = '0';
        warning.style.transform = 'translateY(-10px)';
        setTimeout(function () { warning.remove(); }, 300);
      });

      setTimeout(function () {
        if (warning.parentNode) {
          warning.style.opacity = '0';
          warning.style.transform = 'translateY(-10px)';
          setTimeout(function () { warning.remove(); }, 300);
        }
      }, 15000);

      warning.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    /* --- Floating parallax effect --- */
    var card = document.querySelector('.form-shadow');
    if (card) {
      var ticking = false;
      card.style.transition = 'transform 0.15s ease-out';
      document.addEventListener('mousemove', function (e) {
        if (!ticking) {
          window.requestAnimationFrame(function () {
            var x = (window.innerWidth / 2 - e.pageX) / 80;
            var y = (window.innerHeight / 2 - e.pageY) / 80;
            card.style.transform = 'rotateY(' + x + 'deg) rotateX(' + y + 'deg)';
            ticking = false;
          });
          ticking = true;
        }
      });
    }
  }

  // Multiple initialization strategies for maximum reliability
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Also try after a short delay in case DOM isn't fully ready
  setTimeout(function () {
    var form = document.getElementById('contactForm');
    if (form && !form._contactoInit) {
      init();
    }
  }, 100);

})();
