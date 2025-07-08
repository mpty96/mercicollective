//________________________________________________________________________________________________//
//----------------------------------- INICIO DE SESIÓN Y PANTALLA DE CARGA -----------------------------------//
//________________________________________________________________________________________________//

window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loadingScreen');
  const loadingBar = document.getElementById('loadingBar');

  document.body.classList.add('apple-lockdown');

  setTimeout(() => {
    loadingBar.style.width = '100%';
  }, 300);

  setTimeout(() => {
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
      loadingScreen.style.display = 'none';
      document.getElementById('appleMenu')?.classList.add('show');
    }, 800);
  }, 2200);
});

function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const message = document.getElementById('message');
  
  // Contraseña predeterminada
  const correctPassword = "LongLifeMerci327."; // Contraseña deseada

  // Validar que se ingrese nombre de usuario
  if (!username.trim()) {
    if (message) {
      message.textContent = "Por favor ingresa tu nombre de usuario.";
      message.style.color = "red";
    }
    return;
  }

  // Validar que se ingrese contraseña
  if (!password.trim()) {
    if (message) {
      message.textContent = "Por favor ingresa la contraseña.";
      message.style.color = "red";
    }
    return;
  }

  // Validar contraseña correcta
  if (password !== correctPassword) {
    if (message) {
      message.textContent = "Contraseña incorrecta. Inténtalo de nuevo.";
      message.style.color = "red";
    }
    return;
  }

  // Si llegamos aquí, todo está correcto
  if (message) {
    message.textContent = "Iniciando sesión...";
    message.style.color = "green";
  }

  const menu = document.getElementById('appleMenu');
  
  // Efecto suave de salida
  menu.classList.remove('show');

  setTimeout(() => {
    menu.style.display = 'none';
    document.body.classList.remove('apple-lockdown');
    // Agregar clase para mostrar el escritorio con efecto
    document.body.classList.add('loaded');
  }, 600); // Tiempo para que termine la animación de salida
}

function togglePassword() {
  const passwordInput = document.getElementById('password');
  const passwordToggle = document.querySelector('.password-toggle');
  
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    passwordToggle.classList.remove('password-hidden');
    passwordToggle.classList.add('password-visible');
  } else {
    passwordInput.type = 'password';
    passwordToggle.classList.remove('password-visible');
    passwordToggle.classList.add('password-hidden');
  }
}


//________________________________________________________________________________________________//
//---------------------------------- INICIALIZACIÓN GLOBAL ----------------------------------//
//________________________________________________________________________________________________//

window.addEventListener('DOMContentLoaded', () => {
  audioPlayer?.();
  activateAppleLockdown();
  initializeCoverflow?.();
  updateTopBarDateTimeWeather?.();

  // Ocultar contraseña al escribir
  const passwordToggle = document.querySelector('.password-toggle');
  passwordToggle.classList.add('password-hidden');

  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobile) {
    ['gallery', 'merch'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.style.display = 'none';
        el.style.position = 'absolute';
        el.style.opacity = '0';
        el.style.visibility = 'hidden';
        el.style.display = 'block';
        el.offsetHeight;
        el.style.display = 'none';
        el.style.position = '';
        el.style.opacity = '';
        el.style.visibility = '';
      }
    });

    document.querySelectorAll('#gallery img, #merch img').forEach(img => {
      const preload = new Image();
      preload.src = img.src;
    });

    const dummy = document.createElement('div');
    dummy.style.height = '1px';
    document.body.appendChild(dummy);
    dummy.offsetHeight;
    document.body.removeChild(dummy);

    console.log("📱 Precarga para móviles completada.");
  }

  document.querySelectorAll('.login-input').forEach(input => {
    input.addEventListener('blur', () => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    });
  });

  document.querySelectorAll(".mac-window").forEach(windowEl => {
    const iframes = windowEl.querySelectorAll("iframe");

    iframes.forEach(iframe => {
      iframe.dataset.originalPointerEvents = iframe.style.pointerEvents || "auto";
      iframe.style.pointerEvents = "none";
    });

    const updatePointerEvents = () => {
      const isVisible = getComputedStyle(windowEl).display !== "none" && windowEl.classList.contains("show");

      iframes.forEach(iframe => {
        const rect = iframe.getBoundingClientRect();
        const isOnScreen = (
          rect.width > 0 && rect.height > 0 &&
          rect.bottom > 0 && rect.right > 0 &&
          rect.top < window.innerHeight &&
          rect.left < window.innerWidth
        );

        iframe.style.pointerEvents = (isVisible && isOnScreen)
          ? iframe.dataset.originalPointerEvents || "auto"
          : "none";
      });
    };

    const observer = new MutationObserver(updatePointerEvents);
    observer.observe(windowEl, { attributes: true, attributeFilter: ['style', 'class'] });

    const scrollable = windowEl.querySelector(".mac-window-content") || windowEl;
    scrollable.addEventListener('scroll', updatePointerEvents);
    window.addEventListener('scroll', updatePointerEvents);
    window.addEventListener('resize', updatePointerEvents);
  });
});

function updateTopBarDateTimeWeather() {
  const now = new Date();
  const dayStr = now.toLocaleDateString('es-CL', { weekday: 'short' });
  const dateStr = now.toLocaleDateString('es-CL', { year: 'numeric', month: 'short', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
  const rightInfo = document.getElementById('topbar-right-info');
  if (rightInfo) {
    rightInfo.textContent = `${dayStr}. ${dateStr} - ${timeStr}`;
  }
}

const slowVideos = document.querySelectorAll('.slow-video');
  slowVideos.forEach(video => {
    video.playbackRate = 0.5; // Reduce la velocidad a la mitad
  });

  // Opción adicional: permitir click para abrir detalles
  slowVideos.forEach(video => {
    video.addEventListener('click', () => {
      const data = JSON.parse(video.dataset.product);
      openMerchDetail(data);
    });
  });

setInterval(updateTopBarDateTimeWeather, 60000);
updateTopBarDateTimeWeather();


//________________________________________________________________________________________________//
//------------------------------------- MANEJO DE VENTANAS -------------------------------------//
//________________________________________________________________________________________________//

const openWindowsOnMobile = new Set();

function isMobileDevice() {
  return window.innerWidth <= 768;
}

function bringToFront(el) {
  const allWindows = document.querySelectorAll(".mac-window, .genie-window");
  let maxZ = 1000;
  allWindows.forEach(w => {
    const z = parseInt(window.getComputedStyle(w).zIndex) || 1000;
    if (z > maxZ) maxZ = z;
  });
  el.style.zIndex = maxZ + 1;
}

function openWindow(id) {
  const el = document.getElementById(id);
  if (!el) return;

  if (isMobileDevice()) {
  // Cierra cualquier otra ventana abierta en móviles antes de abrir la nueva
  openWindowsOnMobile.forEach(openId => {
    if (openId !== id) closeWindow(openId);
  });

    
    // Asegurar que la ventana esté correctamente posicionada
    el.style.position = 'fixed';
    el.style.left = '50%';
    el.style.top = '50%';
    el.style.transform = 'translate(-50%, -50%)';
    el.style.display = 'flex';
    el.style.visibility = 'visible';
    el.style.opacity = '1';
    
    // Para ventana de contacto
    if (id === 'contact') {
      document.getElementById('icon-close-contact').style.display = 'flex';
    }
    
    // Añadir al set y forzar el reflow antes de la animación
    openWindowsOnMobile.add(id);
    el.offsetHeight; // Forzar reflow
    
    // Aplicar clase show para la animación
    setTimeout(() => {
      el.classList.add('show');
      bringToFront(el);
    }, 10);
    
    return;
  }

  // Resto del código para desktop se mantiene igual...
  if (id === 'contact') {
    const icon = document.getElementById('icon-contact');
    const rect = icon.getBoundingClientRect();
    document.querySelectorAll(".mac-window.show, .genie-window.show").forEach(win => {
      win.classList.remove('show');
      win.style.display = 'none';
    });
    document.getElementById('icon-close-contact').style.display = 'flex';
    document.getElementById('icon-close-safari').style.display = 'none';
    document.querySelector('.dock').style.display = 'none';
    document.getElementById('desktop').style.display = 'none';
    el.style.top = `${rect.top}px`;
    el.style.left = `${rect.left}px`;
    el.style.transform = 'scale(0.1)';
    el.style.opacity = '0';
    el.style.display = 'flex';
    setTimeout(() => {
      el.style.top = '50%';
      el.style.left = '50%';
      el.style.transform = 'translate(-50%, -50%) scale(1)';
      el.style.opacity = '1';
    }, 10);
  } else {
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const dockHeight = 90;
    el.style.display = 'block';
    el.style.visibility = 'hidden';
    el.style.transform = 'none';
    const winHeight = el.offsetHeight || 400;
    const winWidth = el.offsetWidth || 500;
    el.style.display = 'none';
    el.style.visibility = 'visible';
    const maxTop = screenH - winHeight - dockHeight;
    const maxLeft = screenW - winWidth;
    const minTop = 40;
    const minLeft = 40;
    const top = Math.floor(Math.random() * (maxTop - minTop + 1)) + minTop;
    const left = Math.floor(Math.random() * (maxLeft - minLeft + 1)) + minLeft;
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
    el.style.transform = 'none';
    el.style.display = 'flex';
    setTimeout(() => el.classList.add('show'), 10);
    bringToFront(el);
  }
}

// También actualiza la función closeWindow para móviles
function closeWindow(id) {
  const el = document.getElementById(id);
  if (!el) return;

  if (isMobileDevice()) {
    if (id === 'contact') {
      document.getElementById('icon-close-contact').style.display = 'none';
    }
    
    el.classList.remove('show');
    
    setTimeout(() => {
      el.style.display = 'none';
      el.style.visibility = 'hidden';
      el.style.opacity = '0';
      // Remover del set DESPUÉS de que termine la animación
      openWindowsOnMobile.delete(id);
    }, 300);
    return;
  }

  // Resto del código para desktop se mantiene igual...
  if (id === 'contact') {
    const icon = document.getElementById('icon-contact');
    const rect = icon.getBoundingClientRect();
    el.style.transform = 'scale(0.1)';
    el.style.opacity = '0';
    el.style.top = `${rect.top}px`;
    el.style.left = `${rect.left}px`;
    setTimeout(() => {
      el.style.display = 'none';
      el.style.transform = 'translate(-50%, -50%) scale(1)';
      el.style.top = '50%';
      el.style.left = '50%';
      document.querySelector('.dock').style.display = 'flex';
      document.getElementById('desktop').style.display = 'flex';
      document.getElementById('icon-close-contact').style.display = 'none';
      document.getElementById('icon-close-safari').style.display = 'none';
    }, 600);
  } else {
    el.classList.remove('show');
    setTimeout(() => {
      el.style.display = 'none';
    }, 300);
  }
}

// Función adicional para debugear en móviles
function debugMobileWindow(id) {
  const el = document.getElementById(id);
  if (!el) return;
  
  console.log(`Debug ventana ${id}:`, {
    display: el.style.display,
    visibility: el.style.visibility,
    opacity: el.style.opacity,
    hasShowClass: el.classList.contains('show'),
    inOpenSet: openWindowsOnMobile.has(id),
    position: el.style.position,
    transform: el.style.transform
  });
}

function handleOrientationChange() {
  if (isMobileDevice()) {
    openWindowsOnMobile.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.style.display === 'flex') {
        el.style.left = '50%';
        el.style.top = '50%';
        el.style.transform = 'translate(-50%, -50%)';
      }
    });
  }
}

function handleResize() {
  const wasMobile = openWindowsOnMobile.size > 0;
  const isNowMobile = isMobileDevice();
  if (wasMobile && !isNowMobile) {
    openWindowsOnMobile.clear();
  }
  handleOrientationChange();
}

window.addEventListener('orientationchange', handleOrientationChange);
window.addEventListener('resize', handleResize);

document.querySelectorAll('.mac-window').forEach(win => {
  const header = win.querySelector('.mac-window-header');
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;
  header.style.cursor = 'grab';

  header.addEventListener('mousedown', e => {
    isDragging = true;
    bringToFront(win);
    win.classList.add('dragging');
    const rect = win.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    win.style.transform = 'none';
    win.style.left = `${rect.left}px`;
    win.style.top = `${rect.top}px`;
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const dockHeight = 90;
    const winWidth = win.offsetWidth;
    const winHeight = win.offsetHeight;
    let newLeft = e.clientX - offsetX;
    let newTop = e.clientY - offsetY;
    if (newLeft < 0) newLeft = 0;
    if (newTop < 0) newTop = 0;
    if (newLeft + winWidth > screenW) newLeft = screenW - winWidth;
    if (newTop + winHeight > screenH - dockHeight) newTop = screenH - dockHeight - winHeight;
    win.style.left = `${newLeft}px`;
    win.style.top = `${newTop}px`;
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    win.classList.remove('dragging');
    document.body.style.userSelect = '';
  });
});

//________________________________________________________________________________________________//
//-------------------------------------- COVERFLOW --------------------------------------//
//________________________________________________________________________________________________//

function refreshVideoData() {
  const updatedVideos = getVideosFromHTML();
  videos.splice(0, videos.length, ...updatedVideos);
  updateCoverflow();
}

let currentVideoIndex = 0;
let currentVirtualIndex = 0;

function updateTrackInfo() {
  // Obtener el video actual
  const currentVideo = videos[currentVideoIndex];
  
  if (!currentVideo) return;
  
  // Actualizar información en el header de iTunes si existe
  const titleElement = document.querySelector('.window-title');
  if (titleElement) {
    titleElement.textContent = `${currentVideo.title} - ${currentVideo.artist}`;
  }
  
  // Actualizar información en algún elemento de info del track (si existe)
  const trackInfoElement = document.querySelector('.track-info');
  if (trackInfoElement) {
    trackInfoElement.innerHTML = `
      <div class="current-track">
        <div class="track-title">${currentVideo.title}</div>
        <div class="track-artist">${currentVideo.artist}</div>
        <div class="track-album">${currentVideo.album}</div>
        <div class="track-time">${currentVideo.time}</div>
      </div>
    `;
  }
  
  // Actualizar footer con información del track actual
  const footer = document.querySelector('.itunes-footer');
  if (footer) {
    const totalItems = videos.length;
    const currentPosition = currentVideoIndex + 1;
    footer.textContent = `${currentPosition} of ${totalItems} items - ${currentVideo.title} by ${currentVideo.artist}`;
  }
  
  // Log para debug (opcional)
  console.log('Track actualizado:', currentVideo.title, 'por', currentVideo.artist);
}

function getVideosFromHTML() {
  const videoRows = document.querySelectorAll('.video-row');
  return Array.from(videoRows).map(row => {
    return {
      title: row.querySelector('.row-cell.name').textContent.trim().replace(/🎵\s*/, ''),
      time: row.querySelector('.row-cell.time').textContent.trim(),
      artist: row.querySelector('.row-cell.artist').textContent.trim(),
      album: row.querySelector('.row-cell.album').textContent.trim(),
      genre: 'Music Video'
    };
  });
}

const videos = getVideosFromHTML();

function getCircularIndex(index) {
  const total = document.querySelectorAll('#coverflowTrack .coverflow-item').length;
  return ((index % total) + total) % total;
}


function updateCoverflow() {
  const track = document.getElementById('coverflowTrack');
  const items = Array.from(track.children);
  const total = items.length;
  const itemWidth = items[0].offsetWidth + 30;
  const visualIndex = getCircularIndex(currentVirtualIndex);
  const offsetX = -visualIndex * itemWidth + (track.parentElement.offsetWidth / 2 - itemWidth / 2);
  track.style.transition = 'transform 0.5s ease';
  track.style.transform = `translateX(${offsetX}px)`;
  items.forEach(item => item.className = 'coverflow-item');
  items.forEach((item, i) => {
    const rel = i - visualIndex;
    if (rel === 0) item.classList.add('center');
    else if (rel === -1 || rel === total - 1) item.classList.add('left');
    else if (rel === 1 || rel === -total + 1) item.classList.add('right');
    else if (rel === -2 || rel === total - 2) item.classList.add('far-left');
    else if (rel === 2 || rel === -total + 2) item.classList.add('far-right');
  });

  document.querySelectorAll(".video-row").forEach((row, index) => {
    if (index === currentVideoIndex) {
      row.classList.add("selected");
    } else {
      row.classList.remove("selected");
    }
  });
  updateTrackInfo?.();
}

function moveCoverflow(direction) {
  currentVirtualIndex += direction;
  currentVideoIndex = getCircularIndex(currentVirtualIndex);
  updateCoverflow();
}

function selectVideo(index) {
  const total = videos.length;
  const current = getCircularIndex(currentVirtualIndex);
  let diff = index - current;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;
  currentVirtualIndex += diff;
  currentVideoIndex = index;
  updateCoverflow();
}

function selectVideoFromList(index) {
  if (index === currentVideoIndex) return;
  const total = videos.length;
  if (currentVideoIndex === total - 1 && index === 0) return moveCoverflow(1);
  if (currentVideoIndex === 0 && index === total - 1) return moveCoverflow(-1);
  selectVideo(index);
  updateCoverflow();
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') moveCoverflow(-1);
  if (e.key === 'ArrowRight') moveCoverflow(1);
});

function initializeCoverflow() {
  updateCoverflow();
}

//--- Soporte YouTube móvil ---//
//--- Soporte YouTube móvil ---//
let ytPlayers = [];
let ytAPIReady = false;
let playersReadyCount = 0;
let totalPlayers = 0;
let volumeControlSetup = false;

function initializeYouTubePlayers() {
  if (!isMobileDevice() || !ytAPIReady) return;

  // Selector correcto para los iframes en el coverflow
  const iframes = document.querySelectorAll('#gallery .coverflow-item iframe');
  ytPlayers = [];
  playersReadyCount = 0;
  totalPlayers = iframes.length;
  
  console.log(`🎬 Inicializando ${totalPlayers} players de YouTube`);

  iframes.forEach((iframe, index) => {
    const videoId = iframe.src.match(/embed\/([^?]+)/)?.[1];
    if (!videoId) {
      totalPlayers--;
      return;
    }

    const playerId = `youtube-player-${index}`;
    iframe.id = playerId;

    // Actualizar src del iframe con parámetros necesarios
    iframe.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}&controls=1&modestbranding=1`;

    // Inicializar posición del array
    ytPlayers[index] = null;

    try {
      ytPlayers[index] = new YT.Player(playerId, {
        videoId,
        playerVars: {
          enablejsapi: 1,
          origin: window.location.origin,
          controls: 1,
          modestbranding: 1,
          rel: 0
        },
        events: {
          onReady: event => {
            console.log(`✅ Player ${index} listo para video: ${videoId}`);
            ytPlayers[index] = event.target;
            playersReadyCount++;

            // Aplicar volumen inicial si existe el slider
            const slider = document.getElementById("galleryVolumeControl");
            if (slider) {
              const vol = parseInt(slider.value);
              try {
                event.target.setVolume(vol);
                console.log(`🎚 Volumen inicial aplicado a player ${index}:`, vol);
              } catch (e) {
                console.warn(`⚠️ No se pudo aplicar volumen a player ${index}`, e);
              }
            }

            // Verificar si todos los players están listos
            if (playersReadyCount === totalPlayers && !volumeControlSetup) {
              console.log(`🎉 Todos los players (${totalPlayers}) están listos`);
              setupGalleryVolumeControl();
            }
          },
          onError: event => {
            console.error(`❌ Error en player ${index}:`, event.data);
          }
        }
      });
    } catch (e) {
      console.error(`❌ Error creando player ${index}:`, e);
      totalPlayers--;
    }
  });

  // Si no hay iframes, configurar el control de volumen inmediatamente
  if (totalPlayers === 0) {
    setupGalleryVolumeControl();
  }
}

// Cargar API de YouTube solo en móviles
if (isMobileDevice() && !window.YT) {
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  const firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode.insertBefore(tag, firstScript);
}

// Callback unificado para cuando la API esté lista
window.onYouTubeIframeAPIReady = () => {
  console.log('🚀 YouTube API lista');
  ytAPIReady = true;
  initializeYouTubePlayers();
};

// Control de volumen YouTube móvil
function isGalleryVisible() {
  const gallery = document.getElementById("gallery");
  return gallery && gallery.classList.contains("show") && getComputedStyle(gallery).display !== "none";
}

function setupGalleryVolumeControl() {
  if (volumeControlSetup) return; // Evitar setup múltiple
  
  const slider = document.getElementById("galleryVolumeControl");
  if (!slider) {
    console.warn('⚠️ Slider de volumen no encontrado');
    return;
  }

  // Remover listener previo si existe
  slider.removeEventListener("input", handleVolumeChange);
  
  // Agregar nuevo listener
  slider.addEventListener("input", handleVolumeChange);
  volumeControlSetup = true;
  console.log('🎚 Control de volumen configurado correctamente');
}

function handleVolumeChange() {
  const volume = parseInt(this.value);
  if (!isGalleryVisible()) return;

  console.log(`🔊 Intentando cambiar volumen a: ${volume}`);

  if (isMobileDevice()) {
    let successCount = 0;
    let attemptCount = 0;
    
    ytPlayers.forEach((player, i) => {
      if (player && typeof player.setVolume === "function") {
        attemptCount++;
        try {
          player.setVolume(volume);
          successCount++;
          console.log(`🔊 Volumen actualizado en móvil para player ${i}:`, volume);
        } catch (e) {
          console.warn(`⚠️ Error al actualizar volumen en player ${i}:`, e);
        }
      } else {
        console.warn(`⚠️ Player ${i} no válido o sin función setVolume`);
      }
    });
    
    console.log(`📊 Volumen aplicado a ${successCount}/${attemptCount} players activos`);
  } else {
    // Fallback para escritorio
    document.querySelectorAll("#gallery .coverflow-item iframe").forEach((iframe, index) => {
      try {
        iframe.contentWindow.postMessage(JSON.stringify({
          event: "command",
          func: "setVolume",
          args: [volume]
        }), "*");
        console.log(`🖥 Volumen enviado a iframe ${index} (escritorio)`);
      } catch (e) {
        console.warn(`⚠️ Error enviando volumen a iframe ${index}:`, e);
      }
    });
  }
}

// Funciones para integrar con selectVideo
function reinitializePlayersAfterSelection() {
  if (isMobileDevice() && ytAPIReady) {
    console.log('🔄 Reinicializando players después de selección...');
    setTimeout(() => {
      volumeControlSetup = false; // Permitir nueva configuración
      initializeYouTubePlayers();
    }, 500);
  }
}

// Hook para selectVideo (agregar esto a tu función selectVideo existente)
const originalSelectVideo = window.selectVideo;
if (originalSelectVideo) {
  window.selectVideo = function(index) {
    originalSelectVideo(index);
    reinitializePlayersAfterSelection();
  };
}

// Hook para selectVideoFromList (agregar esto a tu función selectVideoFromList existente)
const originalSelectVideoFromList = window.selectVideoFromList;
if (originalSelectVideoFromList) {
  window.selectVideoFromList = function(index) {
    originalSelectVideoFromList(index);
    reinitializePlayersAfterSelection();
  };
}

// Reforzar inicialización de players al actualizar coverflow
const originalUpdateCoverflow = window.updateCoverflow;
if (originalUpdateCoverflow) {
  window.updateCoverflow = function () {
    originalUpdateCoverflow();
    if (isMobileDevice() && ytAPIReady) {
      setTimeout(() => {
        volumeControlSetup = false;
        initializeYouTubePlayers();
      }, 100);
    }
  };
}

// Inicialización cuando se abre la ventana
function initializeGalleryOnOpen() {
  if (isMobileDevice() && ytAPIReady) {
    setTimeout(() => {
      volumeControlSetup = false;
      initializeYouTubePlayers();
    }, 200);
  }
}

// Función de respaldo para asegurar inicialización
function ensureYouTubeInitialization() {
  if (isMobileDevice() && ytAPIReady && isGalleryVisible() && !volumeControlSetup) {
    console.log('🔧 Ejecutando inicialización de respaldo...');
    initializeYouTubePlayers();
  }
}

// Ejecutar verificación cada 2 segundos si es necesario
setInterval(ensureYouTubeInitialization, 2000);


//________________________________________________________________________________________________//
//-------------------------------------- SOUNDCLOUD Y VOLUMEN --------------------------------------//
//________________________________________________________________________________________________//

function audioPlayer() {
  if (document.body.classList.contains('apple-lockdown')) return;

  const audio = document.getElementById('audioPlayer');
  const canvas = document.getElementById('visualizerCanvas');
  const ctx = canvas.getContext('2d');
  const volumeSlider = document.getElementById('volumeControl');
  const barCount = 32;
  let isPlaying = false;
  let scWidget1 = null;
  let scWidget2 = null;

  function drawSimulator() {
    requestAnimationFrame(drawSimulator);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const barWidth = canvas.width / barCount;
    for (let i = 0; i < barCount; i++) {
      const barHeight = isPlaying ? Math.random() * canvas.height : 4;
      ctx.fillStyle = '#a75ed4';
      ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 2, barHeight);
    }
  }

  drawSimulator();

  function setupWidget(widget) {
    widget.bind(SC.Widget.Events.READY, () => {
      widget.setVolume(parseFloat(volumeSlider.value) * 100);
    });
    widget.bind(SC.Widget.Events.PLAY, () => isPlaying = true);
    widget.bind(SC.Widget.Events.PAUSE, () => isPlaying = false);
    widget.bind(SC.Widget.Events.FINISH, () => isPlaying = false);
  }

  const iframe1 = document.getElementById('sc-player-1');
  const iframe2 = document.getElementById('sc-player-2');

  iframe1?.addEventListener('load', () => {
    scWidget1 = SC.Widget(iframe1);
    setupWidget(scWidget1);
  });

  iframe2?.addEventListener('load', () => {
    scWidget2 = SC.Widget(iframe2);
    setupWidget(scWidget2);
  });

  function updateVolumeAll() {
    const volume = parseFloat(volumeSlider.value);
    audio.volume = volume;
    scWidget1?.setVolume(volume * 100);
    scWidget2?.setVolume(volume * 100);
    const percent = volume * 100;
    volumeSlider.style.background = `linear-gradient(to right, #4a72c8 0%, #4a72c8 ${percent}%, #ffffff ${percent}%, #ffffff 100%)`;
  }

  if (volumeSlider) {
    volumeSlider.addEventListener('input', updateVolumeAll);
    updateVolumeAll();
  }
}


//________________________________________________________________________________________________//
//-------------------------------------- MERCHANDISING --------------------------------------//
//________________________________________________________________________________________________//
function openMerchDetail(product) {
  const mainImageContainer = document.getElementById("mainMerchImageContainer");
  const title = document.getElementById("merchTitle");
  const price = document.getElementById("merchPrice");
  const thumbs = document.getElementById("merchThumbs");

  // Limpiar contenedor principal
  mainImageContainer.innerHTML = "";
  
  // Crear elemento principal según el tipo de archivo
  if (product.main.endsWith('.mp4') || product.main.endsWith('.webm') || product.main.endsWith('.ogg')) {
    const mainVideo = document.createElement("video");
    mainVideo.id = "mainMerchImage";
    mainVideo.src = "imagenes/" + product.main;
    mainVideo.alt = "Vista Principal";
    mainVideo.autoplay = true;
    mainVideo.muted = true;
    mainVideo.loop = true;
    mainVideo.playsinline = true;
    // Mejoras para calidad de video
    mainVideo.preload = "auto";
    mainVideo.style.imageRendering = "crisp-edges";
    mainVideo.addEventListener('loadedmetadata', () => {
      mainVideo.playbackRate = 0.5;
    });
    mainImageContainer.appendChild(mainVideo);
  } else {
    const mainImage = document.createElement("img");
    mainImage.id = "mainMerchImage";
    mainImage.src = "imagenes/" + product.main;
    mainImage.alt = "Vista Principal";
    mainImageContainer.appendChild(mainImage);
  }

  title.textContent = product.title;
  price.textContent = product.price;
  thumbs.innerHTML = "";

  product.thumbnails.forEach(img => {
    // Verificar si es un video o una imagen
    if (img.endsWith('.mp4') || img.endsWith('.webm') || img.endsWith('.ogg')) {
      // Crear elemento video para thumbnails
      const thumb = document.createElement("video");
      thumb.src = "imagenes/" + img;
      thumb.alt = "Thumb";
      thumb.autoplay = true;
      thumb.muted = true;
      thumb.loop = true;
      thumb.playsinline = true;
      thumb.preload = "auto";
      thumb.style.imageRendering = "crisp-edges";
      thumb.onclick = () => changeMainImage(img);
      // Establecer velocidad reducida para thumbnails
      thumb.addEventListener('loadedmetadata', () => {
        thumb.playbackRate = 0.5;
      });
      thumbs.appendChild(thumb);
    } else {
      // Crear elemento imagen para thumbnails normales
      const thumb = document.createElement("img");
      thumb.src = "imagenes/" + img;
      thumb.alt = "Thumb";
      thumb.onclick = () => changeMainImage(img);
      thumbs.appendChild(thumb);
    }
  });

  document.getElementById("merchList").style.display = "none";
  document.getElementById("merchDetail").style.display = "flex";

  window.selectedProduct = product;
}

function changeMainImage(src) {
  const mainImageContainer = document.getElementById("mainMerchImageContainer");
  
  // Limpiar contenedor
  mainImageContainer.innerHTML = "";
  
  // Verificar si es un video
  if (src.endsWith('.mp4') || src.endsWith('.webm') || src.endsWith('.ogg')) {
    // Crear nuevo elemento video
    const videoElement = document.createElement("video");
    videoElement.id = "mainMerchImage";
    videoElement.src = "imagenes/" + src;
    videoElement.alt = "Vista Principal";
    videoElement.autoplay = true;
    videoElement.muted = true;
    videoElement.loop = true;
    videoElement.playsinline = true;
    videoElement.preload = "auto";
    videoElement.style.imageRendering = "crisp-edges";
    
    // Establecer velocidad reducida
    videoElement.addEventListener('loadedmetadata', () => {
      videoElement.playbackRate = 0.5;
    });
    
    mainImageContainer.appendChild(videoElement);
  } else {
    // Crear nuevo elemento imagen
    const imgElement = document.createElement("img");
    imgElement.id = "mainMerchImage";
    imgElement.src = "imagenes/" + src;
    imgElement.alt = "Vista Principal";
    
    mainImageContainer.appendChild(imgElement);
  }
}

function handleRedButton() {
  const detailView = document.getElementById("merchDetail");
  const isDetailVisible = window.getComputedStyle(detailView).display !== "none";
  if (isDetailVisible) {
    showMerchList();
  } else {
    closeWindow('merch');
  }
}

function showMerchList() {
  document.getElementById("merchDetail").style.display = "none";
  document.getElementById("merchList").style.display = "flex";
}

//PRECARGAR VIDEOS E IMAGENES PARA AGILIZAR VENTANA MERCH
const preloadCache = new Map();

function precargarImagenesMerch() {
  const currentProduct = window.selectedProduct;
  if (!currentProduct) return;

  // Crear clave única para el producto
  const cacheKey = `${currentProduct.title}_${currentProduct.price}`;
  
  // Si ya está en cache, no hacer nada
  if (preloadCache.has(cacheKey)) {
    return;
  }

  // Crear conjunto de promesas para precarga
  const preloadPromises = [];
  
  // Precargar video principal - manejar casos específicos
  let videoFileName = currentProduct.video;
  if (!videoFileName) {
    // Determinar el video basado en el título del producto
    if (currentProduct.title.includes('White')) {
      videoFileName = 'polera1_blanca.mp4';
    } else if (currentProduct.title.includes('Black')) {
      videoFileName = 'polera1_negra.mp4';
    }
  }
  
  if (videoFileName) {
    const videoPromise = new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata'; // Solo metadata para ser más eficiente
      video.muted = true;
      video.loop = true;
      
      video.addEventListener('loadedmetadata', () => {
        resolve(video);
      });
      
      video.addEventListener('error', () => {
        reject(new Error(`Error cargando video: ${videoFileName}`));
      });
      
      video.src = `imagenes/${videoFileName}`;
    });
    
    preloadPromises.push(videoPromise);
  }
  
  // Precargar imagen principal si existe
  if (currentProduct.main) {
    const imagePromise = new Promise((resolve, reject) => {
      const img = new Image();
      
      img.addEventListener('load', () => {
        resolve(img);
      });
      
      img.addEventListener('error', () => {
        reject(new Error(`Error cargando imagen: ${currentProduct.main}`));
      });
      
      img.src = `imagenes/${currentProduct.main}`;
    });
    
    preloadPromises.push(imagePromise);
  }
  
  // Precargar imágenes adicionales si existen
  if (currentProduct.gallery && Array.isArray(currentProduct.gallery)) {
    currentProduct.gallery.forEach(imageSrc => {
      const imagePromise = new Promise((resolve, reject) => {
        const img = new Image();
        
        img.addEventListener('load', () => {
          resolve(img);
        });
        
        img.addEventListener('error', () => {
          reject(new Error(`Error cargando imagen de galería: ${imageSrc}`));
        });
        
        img.src = `imagenes/${imageSrc}`;
      });
      
      preloadPromises.push(imagePromise);
    });
  }
  
  // Ejecutar todas las precargas
  Promise.allSettled(preloadPromises)
    .then(results => {
      // Almacenar en cache
      preloadCache.set(cacheKey, {
        timestamp: Date.now(),
        elements: results.filter(r => r.status === 'fulfilled').map(r => r.value)
      });
      
      // Limpiar cache antigua (opcional - elementos más antiguos de 5 minutos)
      cleanupCache();
    })
    .catch(error => {
      console.warn('Error en precarga:', error);
    });
}

// Función auxiliar para limpiar cache antigua
function cleanupCache() {
  const now = Date.now();
  const maxAge = 5 * 60 * 1000; // 5 minutos
  
  for (const [key, value] of preloadCache.entries()) {
    if (now - value.timestamp > maxAge) {
      preloadCache.delete(key);
    }
  }
}

// Función alternativa más agresiva para precarga completa
function precargarImagenesMerchCompleta() {
  const currentProduct = window.selectedProduct;
  if (!currentProduct) return;

  const cacheKey = `${currentProduct.title}_${currentProduct.price}_complete`;
  
  if (preloadCache.has(cacheKey)) {
    return;
  }

  const preloadPromises = [];
  
  // Precargar video completo
  if (currentProduct.video) {
    const videoPromise = new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'auto'; // Precarga completa
      video.muted = true;
      
      video.addEventListener('canplaythrough', () => {
        resolve(video);
      });
      
      video.addEventListener('error', () => {
        reject(new Error(`Error cargando video: ${currentProduct.video}`));
      });
      
      video.src = `imagenes/${currentProduct.video}`;
    });
    
    preloadPromises.push(videoPromise);
  }
  
  // Resto de la lógica igual...
  Promise.allSettled(preloadPromises)
    .then(results => {
      preloadCache.set(cacheKey, {
        timestamp: Date.now(),
        elements: results.filter(r => r.status === 'fulfilled').map(r => r.value)
      });
    });
}

// Función para obtener elemento precargado del cache
function getPreloadedElement(filename) {
  for (const [key, value] of preloadCache.entries()) {
    const element = value.elements.find(el => 
      el.src && el.src.includes(filename)
    );
    if (element) {
      return element.cloneNode(true);
    }
  }
  return null;
}

// Función específica para obtener video precargado por título de producto
function getPreloadedVideoByTitle(productTitle) {
  let videoFileName = '';
  
  if (productTitle.includes('White')) {
    videoFileName = 'polera1_blanca.mp4';
  } else if (productTitle.includes('Black')) {
    videoFileName = 'polera1_negra.mp4';
  }
  
  return videoFileName ? getPreloadedElement(videoFileName) : null;
}

// Función para precargar ambos videos al inicio (opcional)
function precargarTodosLosVideos() {
  const videos = ['polera1_blanca.mp4', 'polera1_negra.mp4'];
  
  videos.forEach(videoFile => {
    if (!preloadCache.has(videoFile)) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.loop = true;
      
      video.addEventListener('loadedmetadata', () => {
        preloadCache.set(videoFile, {
          timestamp: Date.now(),
          elements: [video]
        });
      });
      
      video.src = `imagenes/${videoFile}`;
    }
  });
}

// Función para controlar la velocidad de los videos
function setVideoSpeed(speed = 0.5) {
  const videos = document.querySelectorAll('video.merch-gif');
  videos.forEach(video => {
    video.playbackRate = speed; // 0.5 = mitad de velocidad, 1 = velocidad normal, 2 = doble velocidad
  });
}

document.addEventListener('DOMContentLoaded', function() {
  setVideoSpeed(0.5); // Reproduce los videos a la mitad de velocidad
    updateCartNotificationBadge();
});

//________________________________________________________________________________________________//
//-------------------------------------- CARRITO DE COMPRAS --------------------------------------//
//________________________________________________________________________________________________//
let cart = [];

function getShopifyProductID(title, size) {
  const variants = {
    "FREE LOHAN WHITE TEE": {
      S: "46381412647165",
      M: "46381412679933",
      L: "46381412712701",
      XL: "46381412745469"
    },
    "FREE LOHAN BLACK TEE": {
      S: "46381471990013",
      M: "46381472022781",
      L: "46381472055549",
      XL: "46381472088317"
    }
  };
  return variants[title]?.[size] || null;
}

function formatCLP(value) {
  return `${value.toLocaleString('es-CL')}`;
}

function updateCartNotificationBadge() {
  const badge = document.getElementById('cartNotificationBadge');
  if (!badge) return;
  
  // Calcular total de items en el carrito
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  
  if (totalItems > 0) {
    badge.classList.remove('hidden');
    
    // Mostrar "99+" si hay más de 99 items
    if (totalItems > 99) {
      badge.textContent = '99+';
      badge.classList.add('large-number');
    } else {
      badge.textContent = totalItems.toString();
      badge.classList.remove('large-number');
    }
    
    // Animación de actualización
    badge.classList.remove('updated');
    setTimeout(() => {
      badge.classList.add('updated');
    }, 10);
    
    // Remover la animación después de que termine
    setTimeout(() => {
      badge.classList.remove('updated');
    }, 400);
    
  } else {
    badge.classList.add('hidden');
  }
}

// Actualizar la función updateCart existente
function updateCart() {
  const cartContainer = document.getElementById("cartItems");
  const totalContainer = document.getElementById("totalPrice");
  const checkoutButton = document.querySelector(".checkout-btn");
  const checkoutLink = checkoutButton.closest("a");
  cartContainer.innerHTML = "";
  let totalPrice = 0;
  const shopifyBase = "https://mercicollectiveshop.myshopify.com/cart/";
  const cartShopifyItems = [];

  cart.forEach((item, index) => {
    const numericPrice = parseInt(item.price.replace("$", "").replace("CLP", "").replace(/\./g, "").trim());
    const itemTotal = numericPrice * item.quantity;
    totalPrice += itemTotal;
    const shopifyId = getShopifyProductID(item.title, item.size);
    if (shopifyId) {
      cartShopifyItems.push(`${shopifyId}:${item.quantity}`);
    }
    
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    
    // Intentar diferentes propiedades para el video
    let videoSrc = '';
    if (item.video) {
      videoSrc = item.video;
    } else if (item.videoFile) {
      videoSrc = item.videoFile;
    } else if (item.videoSrc) {
      videoSrc = item.videoSrc;
    } else if (item.src) {
      videoSrc = item.src;
    } else if (item.main) {
      videoSrc = item.main;
    } else {
      // Determinar video basado en el título del producto
      if (item.title.includes('White')) {
        videoSrc = 'polera1_blanca.webm';
      } else if (item.title.includes('Black')) {
        videoSrc = 'polera1_negra.webm';
      }
    }
    
    console.log("Video source encontrado:", videoSrc);
    
    cartItem.innerHTML = `
      <button class="remove-btn" onclick="removeFromCart(${index})">x</button>
      <video autoplay muted loop style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;">
        <source src="imagenes/${videoSrc}" type="video/mp4">
        <source src="imagenes/${videoSrc}" type="video/webm">
        Tu navegador no soporta el elemento video.
      </video>
      <div class="cart-item-text">
        <p>${item.title} - SIZE ${item.size}</p>
      </div>
      <div>${item.quantity}</div>
      <div>${formatCLP(itemTotal)}</div>
    `;
    cartContainer.appendChild(cartItem);
  });

  totalContainer.textContent = formatCLP(totalPrice);
  checkoutLink.href = cartShopifyItems.length > 0 ? shopifyBase + cartShopifyItems.join(",") : "#";
  
  // Actualizar el badge de notificación
  updateCartNotificationBadge();
}

// Actualizar función removeFromCart
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

// Actualizar función addToCart
function addToCart() {
  const size = document.getElementById("size").value;
  if (!size) {
    alert("Por favor selecciona una talla.");
    return;
  }
  
  console.log("window.selectedProduct:", window.selectedProduct);
  
  const newItem = {
    ...window.selectedProduct,
    size,
    quantity: 1
  };
  
  console.log("newItem creado:", newItem);
  
  const existingIndex = cart.findIndex(item => item.title === newItem.title && item.size === newItem.size);
  if (existingIndex !== -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push(newItem);
  }
  
  console.log("Cart actualizado:", cart);
  
  updateCart();
  openWindow('shoppingCart'); // Cambié showShoppingCart() por openWindow('shoppingCart')
}


document.querySelector("#merchDetail button")?.addEventListener("click", addToCart);


//________________________________________________________________________________________________//
//-------------------------------------- SOCIAL MEDIA --------------------------------------//
//________________________________________________________________________________________________//
function openSocialWindow() {
  const social = document.getElementById("socialWindow");
  document.querySelector('.dock').style.display = 'none';
  document.getElementById('desktop').style.display = 'none';

  document.querySelectorAll(".mac-window.show, .genie-window.show, .fullscreen-window.show").forEach(win => {
    win.classList.remove('show');
    win.style.display = 'none';
  });

  if (isMobileDevice()) {
    openWindowsOnMobile.add('socialWindow');
  }

  document.body.dataset.originalBg = document.body.style.backgroundImage;
  document.body.style.backgroundImage = "url('imagenes/socialmedia.webp')";

  social.style.display = 'flex';
  setTimeout(() => social.classList.add('show'), 10);
  document.getElementById('icon-close-safari').style.display = 'flex';
  
  // Iniciar reproducción de videos
  const videos = social.querySelectorAll('video');
  videos.forEach(video => {
    video.play().catch(e => console.log('Error al reproducir video:', e));
  });
}

function closeSocialWindow() {
  const social = document.getElementById("socialWindow");

  if (isMobileDevice()) {
    openWindowsOnMobile.delete('socialWindow');
  }

  social.classList.remove('show');
  setTimeout(() => {
    social.style.display = 'none';
    // Pausar videos al cerrar
    const videos = social.querySelectorAll('video');
    videos.forEach(video => {
      video.pause();
    });
  }, 300);

  document.body.style.backgroundImage = document.body.dataset.originalBg || "";
  document.querySelector('.dock').style.display = 'flex';
  document.getElementById('desktop').style.display = 'flex';
  document.getElementById('icon-close-safari').style.display = 'none';
}

function precargarFondos() {
  const fondoSocial = new Image();
  fondoSocial.src = "imagenes/socialmedia.webp";
  
  // Precargar videos
  const videos = ['cd_yt.webm', 'cd_ig.webm', 'cd_soundcloud.webm'];
  videos.forEach(videoSrc => {
    const video = document.createElement('video');
    video.src = `imagenes/${videoSrc}`;
    video.preload = 'metadata';
  });
}

window.addEventListener("load", precargarFondos);

//________________________________________________________________________________________________//
//_______________________________________ENVIAR CORREOS___________________________________________//
//________________________________________________________________________________________________//


function enviarCorreo(destino) {
  const correo = document.getElementById('correo').value;
  const asunto = document.getElementById('asunto').value;
  const mensaje = document.getElementById('mensaje').value;

  if (!correo || !asunto || !mensaje) {
    alert("Please fill all fields.");
    return;
  }

  let destinatario = "";
  if (destino === 'merci') destinatario = "awge@example.com";
  if (destino === 'support') destinatario = "support@example.com";

  const mailto = `mailto:${destinatario}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent('From: ' + correo + '' + mensaje)}`;
  window.location.href = mailto;
}