// Form submission micro-interaction
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const btn = e.target.querySelector('.btn-submit');
  const originalHTML = btn.innerHTML;

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
    }, 3000);
  }, 1500);
});

// Floating parallax effect for the form card
const card = document.querySelector('.form-shadow');

document.addEventListener('mousemove', function (e) {
  const x = (window.innerWidth / 2 - e.pageX) / 60;
  const y = (window.innerHeight / 2 - e.pageY) / 60;
  card.style.transform =
    'rotateY(' + x + 'deg) rotateX(' + y + 'deg)';
});

card.style.transition = 'transform 0.1s ease-out';
