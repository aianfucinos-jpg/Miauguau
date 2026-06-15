/* ========================================
   Miauguau - Chatbot Widget
   Sistema de reglas con palabras clave
   100% gratis, sin APIs externas
   ======================================== */

(function () {
  'use strict';

  /* --- Base de conocimiento con palabras clave --- */
  var knowledge = [
    {
      keywords: ['adoptar', 'adopcion', 'adopción', 'adoptar perro', 'adoptar gato', 'quiero adoptar', 'como adopto', 'proceso de adopcion'],
      response: '🐾 ¡Qué lindo que quieras adoptar! El proceso es:\n\n1️⃣ Completá el formulario en nuestra web\n2️⃣ Entrevista con nuestro equipo\n3️⃣ Visita al refugio para conocer a tu futura mascota\n4️⃣ ¡Firma del acta de adopción!\n\n¿Querés saber más sobre algún paso?',
      quickReplies: ['Requisitos', 'Costo de adopción', 'Ver mascotas', 'Horarios']
    },
    {
      keywords: ['horario', 'horarios', 'cuando', 'qué hora', 'que hora', 'abren', 'cierran', 'visitar', 'visita'],
      response: '🕐 Nuestros horarios:\n\n• Lunes a Viernes: 9:00 - 18:00\n• Sábados: 10:00 - 14:00\n• Domingos: Cerrado\n\n¡Te esperamos! 🐾',
      quickReplies: ['Ubicación', 'Adoptar', 'Voluntariado']
    },
    {
      keywords: ['donar', 'donacion', 'donación', 'colaborar', 'ayuda económica', 'aportar', 'contribuir', 'dinero'],
      response: '💚 Podés ayudarnos de varias formas:\n\n• Transferencia bancaria: CBU 000123456789\n• MercadoPago: @miauguau\n• Donación de alimento o insumos en el refugio\n\n¡Cada peso cuenta para nuestros animales! 🐾',
      quickReplies: ['Voluntariado', 'Ubicación', 'Contacto']
    },
    {
      keywords: ['voluntario', 'voluntariado', 'ayudar', 'colaborar como', 'ofrecer ayuda', 'trabajar'],
      response: '🤝 ¡Siempre necesitamos voluntarios! Podés:\n\n• Pasear perros\n• Ayudar en eventos\n• Social media\n• Transporte de animales\n• Limpieza y cuidado\n\nEscribinos a Miauguau@gmail.com y te contamos más 🐾',
      quickReplies: ['Horarios', 'Ubicación', 'Contacto']
    },
    {
      keywords: ['ubicacion', 'ubicación', 'direccion', 'dirección', 'donde', 'dónde', 'mapa', 'llegar', 'direccion del refugio'],
      response: '📍 Estamos en Buenos Aires, Argentina.\n\nBarrio de Palermo, cerca del Parque Las Heras.\n\nPodés visitarnos en nuestro horario de atención o escribirnos a Miauguau@gmail.com para coordinar 🐾',
      quickReplies: ['Horarios', 'Contacto', 'Adoptar']
    },
    {
      keywords: ['vacunar', 'vacuna', 'castrar', 'castracion', 'castración', 'veterinario', 'vet', 'esterilizar', 'esterilizacion', 'chip'],
      response: '🏥 Todos nuestros animales son:\n\n• Vacunados\n• Castrados/Esterilizados\n• Desparasitados\n• Con chip identificatorio\n\nSi necesitás un veterinario de confianza, consultanos 🐾',
      quickReplies: ['Costo de adopción', 'Adoptar', 'Cuidados']
    },
    {
      keywords: ['requisito', 'requisitos', 'necesito para adoptar', 'que necesito', 'condiciones', 'pedir', 'solicitar'],
      response: '📋 Los requisitos para adoptar son:\n\n• Ser mayor de 18 años\n• Tener un espacio seguro para la mascota\n• Comprometerse con su cuidado integral\n• Completar el formulario de adopción\n• Visita previa al hogar\n\n¡No es complicado, nos importa el bienestar del animal! 💚',
      quickReplies: ['Proceso de adopción', 'Costo de adopción', 'Ver mascotas']
    },
    {
      keywords: ['costo', 'precio', 'cuanto cuesta', 'cuánto cuesta', 'valor', 'tarifa', 'se paga', 'es gratis', 'gratis'],
      response: '💰 La adopción tiene un costo simbólico que cubre:\n\n• Vacunación completa\n• Esterilización/Castración\n• Microchip identificatorio\n• Desparasitación\n\nEste monto está muy por debajo del costo real de estos servicios. ¡Es una inversión en la salud de tu nuevo amigo! 🐾',
      quickReplies: ['Requisitos', 'Ver mascotas', 'Contacto']
    },
    {
      keywords: ['perro', 'perrito', 'can', 'cachorro', 'puppy', 'perritos'],
      response: '🐕 ¡Tenemos perros increíbles esperando un hogar!\n\nTenemos de todas las edades y tamaños: cachorros, jóvenes y adultos. Cada uno con su propia personalidad.\n\nVisitá nuestra sección de adopciones para conocerlos 🐾',
      quickReplies: ['Ver mascotas', 'Requisitos', 'Proceso de adopción']
    },
    {
      keywords: ['gato', 'gatito', 'felino', 'minino', 'gatitos'],
      response: '🐱 ¡Nuestros gatos son adorables!\n\nTenemos gatitos juguetones y gatos adultos tranquilos. Todos están listos para dar y recibir amor.\n\nVisitá nuestra sección de adopciones para conocerlos 🐾',
      quickReplies: ['Ver mascotas', 'Requisitos', 'Costo de adopción']
    },
    {
      keywords: ['cuidado', 'cuidados', 'alimentar', 'alimentacion', 'comida', 'alimento', 'bañar', 'pasear'],
      response: '🏠 Consejos básicos de cuidado:\n\n• Alimentación balanceada y agua fresca\n• Visitas regulares al veterinario\n• Paseos diarios (para perros)\n• Juego y estimulación mental\n• Amor y paciencia\n\n¿Tenés alguna pregunta específica sobre cuidados? 🐾',
      quickReplies: ['Vacunas', 'Veterinario', 'Adoptar']
    },
    {
      keywords: ['contacto', 'contactar', 'telefono', 'teléfono', 'email', 'mail', 'whatsapp', 'llamar', 'escribir'],
      response: '📞 Podés contactarnos de varias formas:\n\n• Email: Miauguau@gmail.com\n• Instagram: @miauguau\n• Facebook: Miauguau Pet Rescue\n• O visitá nuestra página de contacto\n\n¡Respondemos lo antes posible! 💚',
      quickReplies: ['Ubicación', 'Horarios', 'Voluntariado']
    },
    {
      keywords: ['urgente', 'emergencia', 'emergencia animal', 'animal herido', 'perro herido', 'gato herido', 'maltrato', 'abandono', 'denunciar'],
      response: '🚨 Si es una emergencia animal:\n\n• Línea de emergencia: 0800-ANIMALES\n• Email urgente: Miauguau@gmail.com\n• Si hay maltrato: denunciá al 911\n\nNo dudes en actuar, cada minuto cuenta. 🙏',
      quickReplies: ['Contacto', 'Ubicación', 'Voluntariado']
    },
    {
      keywords: ['gracias', 'muchas gracias', 'genial', 'excelente', 'perfecto', 'increible', 'buenisimo', 'ok', 'dale'],
      response: '💚 ¡De nada! Me alegra poder ayudarte.\n\nSi tenés más preguntas, no dudes en escribirme. Estoy acá para lo que necesites.\n\n¡Que tengas un lindo día! 🐾',
      quickReplies: ['Adoptar', 'Donar', 'Voluntariado']
    },
    {
      keywords: ['hola', 'buenas', 'buen dia', 'buenos dias', 'buenas tardes', 'buenas noches', 'hey', 'hi', 'que tal', 'como estas'],
      response: '¡Hola! 👋🐾 ¡Bienvenido a Miauguau!\n\nSoy el asistente virtual del refugio. ¿En qué puedo ayudarte hoy?',
      quickReplies: ['Adoptar', 'Donar', 'Horarios', 'Ubicación', 'Voluntariado']
    },
    {
      keywords: ['chau', 'adios', 'adiós', 'nos vemos', 'hasta luego', 'bye', 'me voy', 'listo'],
      response: '👋 ¡Hasta luego! Fue un placer ayudarte.\n\nAcordate que siempre podés volver si tenés más preguntas. ¡Esperamos verte pronto en el refugio! 🐾💚',
      quickReplies: []
    }
  ];

  /* --- Respuesta por defecto --- */
  var defaultResponse = {
    response: '🐾 No estoy segura de entender tu pregunta. Podés intentar preguntarme sobre:\n\n• 🏠 Adopción de mascotas\n• 📋 Requisitos para adoptar\n• 💰 Costo de adopción\n• 🕐 Horarios del refugio\n• 📍 Ubicación\n• 💚 Donaciones\n• 🤝 Voluntariado\n• 🏥 Vacunas y salud\n• 📞 Contacto\n\nO escribinos directamente a Miauguau@gmail.com 💚',
    quickReplies: ['Adoptar', 'Horarios', 'Donar', 'Contacto']
  };

  /* --- Normalizar texto (quitar acentos, pasar a minúsculas) --- */
  function normalize(text) {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  /* --- Similitud de Levenshtein simplificada para fuzzy matching --- */
  function similarity(a, b) {
    if (a === b) return 1;
    if (a.length === 0 || b.length === 0) return 0;
    var longer = a.length > b.length ? a : b;
    var shorter = a.length > b.length ? b : a;
    if (longer.indexOf(shorter) !== -1) return shorter.length / longer.length;
    var matches = 0;
    for (var i = 0; i < shorter.length; i++) {
      if (longer.indexOf(shorter[i]) !== -1) matches++;
    }
    return matches / longer.length;
  }

  /* --- Buscar la mejor respuesta --- */
  function getBotResponse(userMessage) {
    var lowerMsg = normalize(userMessage);
    var words = lowerMsg.split(/\s+/);

    var bestMatch = null;
    var bestScore = 0;

    for (var i = 0; i < knowledge.length; i++) {
      var entry = knowledge[i];
      var score = 0;

      // Coincidencia exacta de palabras clave
      for (var j = 0; j < entry.keywords.length; j++) {
        var kw = normalize(entry.keywords[j]);
        if (lowerMsg.includes(kw)) {
          score += kw.split(/\s+/).length * 2; // Multi-palabra = más peso
        }
      }

      // Fuzzy matching para palabras individuales
      for (var w = 0; w < words.length; w++) {
        if (words[w].length < 3) continue;
        for (var k = 0; k < entry.keywords.length; k++) {
          var kwNorm = normalize(entry.keywords[k]);
          var kwWords = kwNorm.split(/\s+/);
          for (var kwW = 0; kwW < kwWords.length; kwW++) {
            if (kwWords[kwW].length < 3) continue;
            var sim = similarity(words[w], kwWords[kwW]);
            if (sim > 0.8) {
              score += sim;
            }
          }
        }
      }

      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry;
      }
    }

    if (bestMatch && bestScore > 0) {
      return bestMatch;
    }

    return defaultResponse;
  }

  /* --- Detectar contexto de la página actual --- */
  function getPageContext() {
    var path = window.location.pathname.toLowerCase();
    if (path.includes('adoptar') || path.includes('adopcion')) return 'adopcion';
    if (path.includes('concientizar') || path.includes('conciencia')) return 'concientizar';
    if (path.includes('contacto') || path.includes('contact')) return 'contacto';
    return 'inicio';
  }

  /* --- Mensaje de bienvenida según contexto --- */
  function getWelcomeMessage() {
    var context = getPageContext();
    switch (context) {
      case 'adopcion':
        return {
          response: '🐾 ¡Hola! Veo que estás mirando nuestras mascotas en adopción. ¿Te gustaría saber más sobre alguna de ellas o tenés preguntas sobre el proceso?',
          quickReplies: ['Proceso de adopción', 'Requisitos', 'Costo', 'Perros', 'Gatos']
        };
      case 'concientizar':
        return {
          response: '💚 ¡Hola! Estás en nuestra sección de concientización. ¿Querés saber más sobre cómo ayudar a los animales o tenés alguna consulta?',
          quickReplies: ['Voluntariado', 'Donar', 'Maltrato animal', 'Esterilización']
        };
      case 'contacto':
        return {
          response: '📞 ¡Hola! ¿Necesitas contactarnos? Puedo ayudarte con información sobre horarios, ubicación, o resolver tus dudas directamente.',
          quickReplies: ['Horarios', 'Ubicación', 'Voluntariado', 'Donar']
        };
      default:
        return {
          response: '🐾 ¡Hola! Soy el asistente virtual de Miauguau. ¿En qué puedo ayudarte hoy?',
          quickReplies: ['Adoptar', 'Donar', 'Horarios', 'Ubicación', 'Voluntariado']
        };
    }
  }

  /* --- Sonido de notificación de nuevo mensaje --- */
  var notificationSound = null;
  function initNotificationSound() {
    try {
      var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      notificationSound = {
        ctx: audioCtx,
        play: function () {
          try {
            var oscillator = this.ctx.createOscillator();
            var gainNode = this.ctx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(this.ctx.destination);
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, this.ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(587, this.ctx.currentTime + 0.15);
            gainNode.gain.setValueAtTime(0.15, this.ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
            oscillator.start(this.ctx.currentTime);
            oscillator.stop(this.ctx.currentTime + 0.25);
          } catch (e) { }
        }
      };
    } catch (e) { }
  }

  function playNotificationSound() {
    if (notificationSound) {
      notificationSound.play();
    }
  }

  /* --- Crear el widget del chatbot --- */
  function createChatWidget() {
    // Inicializar sonido de notificación
    initNotificationSound();

    // Botón flotante
    var fab = document.createElement('button');
    fab.className = 'chat-fab chat-fab--glow';
    fab.setAttribute('aria-label', 'Abrir chat de ayuda');
    fab.innerHTML = '<span class="material-symbols-outlined" style="font-variation-settings: \'FILL\' 1;">pets</span>';
    document.body.appendChild(fab);

    // Badge de notificación
    var badge = document.createElement('span');
    badge.className = 'chat-fab__badge';
    badge.textContent = '1';
    fab.appendChild(badge);

    // Panel de chat
    var panel = document.createElement('div');
    panel.className = 'chat-panel';
    panel.innerHTML =
      '<div class="chat-panel__glow-ambient"></div>' +
      '<div class="chat-panel__header">' +
        '<div class="chat-panel__header-info">' +
          '<div class="chat-panel__avatar">' +
            '<span class="material-symbols-outlined" style="font-variation-settings: \'FILL\' 1; font-size:20px;">pets</span>' +
          '</div>' +
          '<div>' +
            '<p class="chat-panel__title">Miauguau Bot</p>' +
            '<p class="chat-panel__status">En línea</p>' +
          '</div>' +
        '</div>' +
        '<div class="chat-panel__header-actions">' +
          '<button class="chat-panel__btn chat-panel__btn--clear" aria-label="Limpiar chat" title="Limpiar chat">' +
            '<span class="material-symbols-outlined">delete_sweep</span>' +
          '</button>' +
          '<button class="chat-panel__btn chat-panel__btn--minimize" aria-label="Minimizar chat" title="Minimizar">' +
            '<span class="material-symbols-outlined">minimize</span>' +
          '</button>' +
          '<button class="chat-panel__btn chat-panel__btn--close" aria-label="Cerrar chat" title="Cerrar">' +
            '<span class="material-symbols-outlined">close</span>' +
          '</button>' +
        '</div>' +
      '</div>' +
      '<div class="chat-panel__messages"></div>' +
      '<div class="chat-panel__quick-replies"></div>' +
      '<div class="chat-panel__input-area">' +
        '<form class="chat-panel__form">' +
          '<input type="text" class="chat-panel__input" placeholder="Escribí tu mensaje..." autocomplete="off">' +
          '<button type="submit" class="chat-panel__send" aria-label="Enviar mensaje">' +
            '<span class="material-symbols-outlined">send</span>' +
          '</button>' +
        '</form>' +
      '</div>' +
      '<div class="chat-panel__footer">' +
        '<span class="chat-panel__footer-text">Powered by Miauguau 🐾</span>' +
      '</div>';
    document.body.appendChild(panel);

    var messagesContainer = panel.querySelector('.chat-panel__messages');
    var quickRepliesContainer = panel.querySelector('.chat-panel__quick-replies');
    var inputForm = panel.querySelector('.chat-panel__form');
    var inputEl = panel.querySelector('.chat-panel__input');
    var sendBtn = panel.querySelector('.chat-panel__send');
    var closeBtn = panel.querySelector('.chat-panel__btn--close');
    var minimizeBtn = panel.querySelector('.chat-panel__btn--minimize');
    var clearBtn = panel.querySelector('.chat-panel__btn--clear');
    var isOpen = false;
    var hasWelcomed = false;

    /* --- Toggle chat panel con animación suave --- */
    function toggleChat() {
      isOpen = !isOpen;
      if (isOpen) {
        panel.classList.add('chat-panel--open');
        panel.classList.add('chat-panel--glow-active');
        fab.classList.add('chat-fab--hidden');
        fab.classList.remove('chat-fab--unread-pulse');
        badge.style.display = 'none';
        inputEl.focus();
        if (!hasWelcomed) {
          hasWelcomed = true;
          var welcome = getWelcomeMessage();
          setTimeout(function () {
            addBotMessage(welcome.response, welcome.quickReplies);
          }, 400);
        }
        // Restore from localStorage
        restoreChat();
      } else {
        panel.classList.remove('chat-panel--open');
        panel.classList.remove('chat-panel--glow-active');
        fab.classList.remove('chat-fab--hidden');
      }
    }

    /* --- Cerrar panel con animación suave --- */
    function closePanel() {
      isOpen = false;
      panel.classList.remove('chat-panel--open');
      panel.classList.remove('chat-panel--glow-active');
      fab.classList.remove('chat-fab--hidden');
    }

    fab.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', closePanel);
    minimizeBtn.addEventListener('click', closePanel);

    /* --- Limpiar historial de chat --- */
    clearBtn.addEventListener('click', function () {
      messagesContainer.innerHTML = '';
      quickRepliesContainer.innerHTML = '';
      try {
        localStorage.removeItem('miauguau-chat-history');
      } catch (e) { }
      hasWelcomed = false;
      // Re-show welcome after clearing
      hasWelcomed = true;
      var welcome = getWelcomeMessage();
      setTimeout(function () {
        addBotMessage(welcome.response, welcome.quickReplies);
      }, 300);
    });

    /* --- Agregar mensaje del bot --- */
    function addBotMessage(text, quickReplies) {
      // Mostrar indicador de escritura
      var typing = document.createElement('div');
      typing.className = 'chat-message chat-message--bot chat-message--typing';
      typing.innerHTML =
        '<div class="chat-message__avatar">' +
          '<span class="material-symbols-outlined" style="font-variation-settings: \'FILL\' 1; font-size:16px;">pets</span>' +
        '</div>' +
        '<div class="chat-message__bubble">' +
          '<div class="chat-typing-indicator">' +
            '<span></span><span></span><span></span>' +
          '</div>' +
        '</div>';
      messagesContainer.appendChild(typing);
      scrollToBottom();

      // Simular tiempo de escritura
      var typingDelay = Math.min(800 + text.length * 8, 2000);
      setTimeout(function () {
        typing.remove();

        var msg = document.createElement('div');
        msg.className = 'chat-message chat-message--bot';
        // Convertir newlines a <br> y emojis se preservan
        var formattedText = text.replace(/\n/g, '<br>');
        msg.innerHTML =
          '<div class="chat-message__avatar">' +
            '<span class="material-symbols-outlined" style="font-variation-settings: \'FILL\' 1; font-size:16px;">pets</span>' +
          '</div>' +
          '<div class="chat-message__bubble">' + formattedText + '</div>';
        messagesContainer.appendChild(msg);
        scrollToBottom();

        // Reproducir sonido de notificación
        playNotificationSound();

        // Mostrar quick replies
        if (quickReplies && quickReplies.length > 0) {
          showQuickReplies(quickReplies);
        } else {
          quickRepliesContainer.innerHTML = '';
        }

        // Guardar historial
        saveChat();
      }, typingDelay);
    }

    /* --- Agregar mensaje del usuario --- */
    function addUserMessage(text) {
      var msg = document.createElement('div');
      msg.className = 'chat-message chat-message--user';
      msg.innerHTML = '<div class="chat-message__bubble">' + escapeHtml(text) + '</div>';
      messagesContainer.appendChild(msg);
      scrollToBottom();
      quickRepliesContainer.innerHTML = '';
    }

    /* --- Mostrar quick replies --- */
    function showQuickReplies(replies) {
      quickRepliesContainer.innerHTML = '';
      var wrapper = document.createElement('div');
      wrapper.className = 'chat-quick-replies__wrapper';
      for (var i = 0; i < replies.length; i++) {
        var chip = document.createElement('button');
        chip.className = 'chat-quick-reply';
        chip.textContent = replies[i];
        chip.addEventListener('click', (function (reply) {
          return function () {
            handleUserInput(reply);
          };
        })(replies[i]));
        wrapper.appendChild(chip);
      }
      quickRepliesContainer.appendChild(wrapper);
    }

    /* --- Manejar input del usuario --- */
    function handleUserInput(text) {
      if (!text.trim()) return;
      addUserMessage(text);
      var response = getBotResponse(text);
      addBotMessage(response.response, response.quickReplies);
    }

    /* --- Form submission --- */
    inputForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var text = inputEl.value.trim();
      if (!text) return;
      inputEl.value = '';
      handleUserInput(text);
    });

    /* --- Scroll al final --- */
    function scrollToBottom() {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    /* --- Escapar HTML --- */
    function escapeHtml(text) {
      var div = document.createElement('div');
      div.appendChild(document.createTextNode(text));
      return div.innerHTML;
    }

    /* --- Guardar historial en localStorage --- */
    function saveChat() {
      try {
        var msgs = [];
        var msgEls = messagesContainer.querySelectorAll('.chat-message');
        for (var i = 0; i < msgEls.length; i++) {
          var isBot = msgEls[i].classList.contains('chat-message--bot');
          var bubble = msgEls[i].querySelector('.chat-message__bubble');
          if (bubble) {
            msgs.push({
              type: isBot ? 'bot' : 'user',
              text: bubble.innerHTML
            });
          }
        }
        localStorage.setItem('miauguau-chat-history', JSON.stringify(msgs));
      } catch (e) { }
    }

    /* --- Restaurar historial --- */
    function restoreChat() {
      if (messagesContainer.children.length > 0) return; // Ya hay mensajes
      try {
        var saved = localStorage.getItem('miauguau-chat-history');
        if (saved) {
          var msgs = JSON.parse(saved);
          // Solo restaurar últimos 20 mensajes
          var start = Math.max(0, msgs.length - 20);
          for (var i = start; i < msgs.length; i++) {
            var msg = document.createElement('div');
            msg.className = 'chat-message chat-message--' + msgs[i].type;
            if (msgs[i].type === 'bot') {
              msg.innerHTML =
                '<div class="chat-message__avatar">' +
                  '<span class="material-symbols-outlined" style="font-variation-settings: \'FILL\' 1; font-size:16px;">pets</span>' +
                '</div>' +
                '<div class="chat-message__bubble">' + msgs[i].text + '</div>';
            } else {
              msg.innerHTML = '<div class="chat-message__bubble">' + msgs[i].text + '</div>';
            }
            messagesContainer.appendChild(msg);
          }
          scrollToBottom();
        }
      } catch (e) { }
    }

    /* --- Tecla Escape para cerrar --- */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) {
        closePanel();
      }
    });

    /* --- Mostrar badge con animación de pulso dramático --- */
    setTimeout(function () {
      fab.classList.add('chat-fab--pulse');
      fab.classList.add('chat-fab--unread-pulse');
      setTimeout(function () {
        fab.classList.remove('chat-fab--pulse');
      }, 3000);
    }, 3000);
  }

  /* --- Inicializar cuando el DOM esté listo --- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createChatWidget);
  } else {
    createChatWidget();
  }

})();
