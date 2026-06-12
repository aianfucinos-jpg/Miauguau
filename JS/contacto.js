/* ========================================
   Miauguau - Contact Page JavaScript
   ======================================== */

   document.addEventListener('DOMContentLoaded', function () {

    var contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
  
    /* --- Form Validation --- */
    var validators = {
      name: function (value) {
        if (!value.trim()) return 'Por favor ingresa tu nombre';
        if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
        return '';
      },
      email: function (value) {
        if (!value.trim()) return 'Por favor ingresa tu email';
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) return 'Por favor ingresa un email válido';
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
      var existingError = group.querySelector('.form-error');
      if (existingError) existingError.remove();
      if (message) {
        var errorEl = document.createElement('p');
        errorEl.className = 'form-error';
        errorEl.textContent = message;
        group.appendChild(errorEl);
      }
    }
  
    function showSuccess(input) {
      input.classList.remove('form-input--error');
      input.classList.add('form-input--success');
      var group = input.closest('.form-group');
      var existingError = group.querySelector('.form-error');
      if (existingError) existingError.remove();
    }
  
    // Real-time validation on blur
    var formFields = contactForm.querySelectorAll('.form-input, .form-select, .form-textarea');
    formFields.forEach(function (field) {
      field.addEventListener('blur', function () {
        var name = field.getAttribute('name');
        if (validators[name]) {
          var error = validators[name](field.value);
          if (error) {
            showError(field, error);
          } else {
            showSuccess(field);
          }
        }
      });
  
      // Clear error on focus
      field.addEventListener('focus', function () {
        field.classList.remove('form-input--error');
      });
    });
  
    /* --- Form Submission --- */
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
  
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
        // Scroll to first error
        var firstError = contactForm.querySelector('.form-input--error, .form-select--error, .form-textarea--error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstError.focus();
        }
        return;
      }
  
      var btn = e.target.querySelector('.btn-submit');
      var originalHTML = btn.innerHTML;
  
      btn.innerHTML =
        '<span class="material-symbols-outlined animate-spin">sync</span> Enviando...';
      btn.disabled = true;
  
      setTimeout(function () {
        btn.innerHTML =
          '<span class="material-symbols-outlined">check_circle</span> ¡Mensaje Enviado!';
        btn.classList.add('btn-submit--success');
  
        setTimeout(function () {
          btn.innerHTML = originalHTML;
          btn.classList.remove('btn-submit--success');
          btn.disabled = false;
          e.target.reset();
  
          // Clear all success states
          formFields.forEach(function (field) {
            field.classList.remove('form-input--success');
          });
        }, 3000);
      }, 1500);
    });
  
    /* --- Floating parallax effect for the form card (throttled) --- */
    var card = document.querySelector('.form-shadow');
    if (!card) return;
  
    var ticking = false;
    card.style.transition = 'transform 0.15s ease-out';
  
    document.addEventListener('mousemove', function (e) {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          var x = (window.innerWidth / 2 - e.pageX) / 80;
          var y = (window.innerHeight / 2 - e.pageY) / 80;
          card.style.transform =
            'rotateY(' + x + 'deg) rotateX(' + y + 'deg)';
          ticking = false;
        });
        ticking = true;
      }
    });
  
  });
  
