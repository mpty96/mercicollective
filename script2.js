//=========================================================================================================//
//----------------------------------- INICIO DE SESIÓN Y PANTALLA DE CARGA --------------------------------//
//=========================================================================================================//

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
  
  // Contraseña
  const correctPassword = "Jordan2025."; //<----- Contraseña deseada entre comillas

  // Validar que se ingrese nombre de usuario
  if (!username.trim()) {
    if (message) {
      message.textContent = "Por favor ingresa tu nombre de usuario.";
      message.style.color = "red";
    }
    return;
  }

  /* DESACTIVAR TEMPORALMENTE CONTRASEÑA
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
*/


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
    registerUser(username);
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

//================================================================================================//
//---------------------------------- INICIALIZACIÓN GLOBAL ---------------------------------------//
//================================================================================================//

window.addEventListener('DOMContentLoaded', () => {
  audioPlayer?.();
  activateAppleLockdown?.();
  initializeCoverflow?.();
  updateTopBarDateTimeWeather?.();
  updateCartNotificationBadge();

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
    video.playbackRate = 0.5; 
  });
  slowVideos.forEach(video => {
    video.addEventListener('click', () => {
      const data = JSON.parse(video.dataset.product);
      openMerchDetail(data);
    });
  });

setInterval(updateTopBarDateTimeWeather, 60000);
updateTopBarDateTimeWeather();

//================================================================================================//
//------------------------------------- MANEJO DE VENTANAS ---------------------------------------//
//================================================================================================//

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
    openWindowsOnMobile.add(id);
    el.offsetHeight; 
    setTimeout(() => {
      el.classList.add('show');
      bringToFront(el);
    }, 10);
    
    return;
  }

  // CODIGO PARA VERSIÖN PC
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

// Función closeWindow para móviles
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
      openWindowsOnMobile.delete(id);
    }, 300);
    return;
  }
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

// Función para debugear en móviles
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

//=================================================================================================//
//------------------------------------------- COVERFLOW -------------------------------------------//
//=================================================================================================//

function refreshVideoData() {
  const updatedVideos = getVideosFromHTML();
  videos.splice(0, videos.length, ...updatedVideos);
  updateCoverflow();
}

let currentVideoIndex = 0;
let currentVirtualIndex = 0;

function updateTrackInfo() {
  const currentVideo = videos[currentVideoIndex];
  
  if (!currentVideo) return;
  const titleElement = document.querySelector('.window-title');
  if (titleElement) {
    titleElement.textContent = `${currentVideo.title} - ${currentVideo.artist}`;
  }
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
  
  // Log para debug
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

function setupGalleryVolumeControl() {
  const slider = document.getElementById("galleryVolumeControl");
  if (!slider) return;

  slider.addEventListener("input", function () {
    const volume = parseInt(this.value);
    if (!isGalleryVisible()) return;

    ytPlayers.forEach(player => {
      try {
        if (player && typeof player.setVolume === "function") {
          player.setVolume(volume);
        }
      } catch (e) {
      }
    });
  });
}

// === YouTube API ===
let ytPlayers = [];
let ytAPIReady = false;

function initializeYouTubePlayers() {

  const iframes = document.querySelectorAll('#coverflowTrack iframe');

  ytPlayers = [];
  let playersReady = 0; 
  iframes.forEach((iframe, index) => {
    console.log(`Procesando iframe ${index}:`, iframe);
    
    const src = iframe.src;
    const videoId = src.match(/embed\/([^?]+)/)?.[1];
    if (!videoId) return;

    const playerId = `youtube-player-${index}`;
    iframe.id = playerId;

    ytPlayers[index] = new YT.Player(playerId, {
      videoId,
      playerVars: {
        enablejsapi: 1,
        origin: window.location.origin
      },
      events: {
        onReady: event => {
          ytPlayers[index] = event.target;
          playersReady++;
          console.log(`✅ Player ${index} listo:`, videoId);
          if (playersReady === iframes.length) {
            setupGalleryVolumeControl();
          }
        }
      }
    });
  });
}

window.onYouTubeIframeAPIReady = () => {
  ytAPIReady = true;
  initializeYouTubePlayers();
  waitForYouTubeAPIAndSetupVolume(); 
};

function isGalleryVisible() {
  const gallery = document.getElementById("gallery");
  return gallery && gallery.classList.contains("show") && getComputedStyle(gallery).display !== "none";
}

//================================================================================================//
//------------------------------------- SOUNDCLOUD Y VOLUMEN -------------------------------------//
//================================================================================================//

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

//================================================================================================//
//---------------------------------------------- MERCH -------------------------------------------//
//================================================================================================//

function openMerchDetail(product) {
  const mainImageContainer = document.getElementById("mainMerchImageContainer");
  const title = document.getElementById("merchTitle");
  const price = document.getElementById("merchPrice");
  const thumbs = document.getElementById("merchThumbs");
  const merchDetail = document.getElementById("merchDetail");
  const merchWindow = document.getElementById("merch");
  const buyButton = document.querySelector("#merchDetail button");

  const sizeSelector = document.querySelector(".size-selector");
  const sizeSelect = document.getElementById("size");

  const windowContent = merchWindow.querySelector('.mac-window-content');
  if (windowContent) {
    windowContent.scrollTop = 0;
  }
  
  sizeSelector.style.display = product.hasSize ? "block" : "none";
  
  if (product.hasSize) {
    sizeSelect.innerHTML = "";
    const sizes = product.sizes || ["S", "M", "L"];
    sizes.forEach(size => {
      const option = document.createElement("option");
      option.value = size;
      option.textContent = size;
      sizeSelect.appendChild(option);
    });
  }

  if (product.available === false) {
    buyButton.disabled = true;
    buyButton.style.opacity = "0.5";
    buyButton.style.cursor = "not-allowed";
    buyButton.style.textDecoration = "line-through";
  } else {
    buyButton.disabled = false;
    buyButton.style.opacity = "1";
    buyButton.style.cursor = "pointer";
    buyButton.style.textDecoration = "none";
  }

  mainImageContainer.innerHTML = "";
  
  const mainImage = document.createElement("img");
  mainImage.id = "mainMerchImage";
  mainImage.src = "imagenes/" + product.main;
  mainImage.alt = "Vista Principal";
  mainImageContainer.appendChild(mainImage);

  title.textContent = product.title;
  price.textContent = product.price;
  thumbs.innerHTML = "";

  product.thumbnails.forEach(img => {
    const thumb = document.createElement("img");
    thumb.src = "imagenes/" + img;
    thumb.alt = "Thumb";
    thumb.onclick = () => changeMainImage(img);
    thumbs.appendChild(thumb);
  });

  document.getElementById("merchList").style.display = "none";
  document.getElementById("merchListBBJuanki").style.display = "none";
  merchDetail.style.display = "flex";
  
  if (window.innerWidth <= 768) {
    const windowContent = merchWindow.querySelector('.mac-window-content');
    if (windowContent) {
      windowContent.scrollTop = 0;
      windowContent.style.overflow = "hidden";
    }
    merchDetail.style.overflow = "hidden";
    merchDetail.style.height = "100%";
  }

  window.selectedProduct = product;
}

function changeMainImage(src) {
  const mainImageContainer = document.getElementById("mainMerchImageContainer");
  mainImageContainer.innerHTML = "";
  
  const imgElement = document.createElement("img");
  imgElement.id = "mainMerchImage";
  imgElement.src = "imagenes/" + src;
  imgElement.alt = "Vista Principal";
  
  mainImageContainer.appendChild(imgElement);
}

function handleBackFromDetail() {
  const merchDetail = document.getElementById("merchDetail");
  const merchWindow = document.getElementById("merch");
  
  merchDetail.style.display = "none";
  
  // Si el producto viene de BBJuanki, volver a esa lista
  if (window.selectedProduct && window.selectedProduct.fromBBJ) {
    document.getElementById("merchListBBJuanki").style.display = "flex";
  } else {
    document.getElementById("merchList").style.display = "flex";
  }
  
  // RESTAURAR SCROLL solo en móviles
  if (window.innerWidth <= 768) {
    const windowContent = merchWindow.querySelector('.mac-window-content');
    if (windowContent) {
      windowContent.style.overflow = "auto";
    }
    merchDetail.style.overflow = "";
  }
}

function handleRedButton() {
  const detailView = document.getElementById("merchDetail");
  const bbjView = document.getElementById("merchListBBJuanki");
  const policyView = document.getElementById("merchPolicy");
  
  const isDetailVisible = window.getComputedStyle(detailView).display !== "none";
  const isBBJVisible = window.getComputedStyle(bbjView).display !== "none";
  const isPolicyVisible = window.getComputedStyle(policyView).display !== "none";
  
  if (isDetailVisible) {
    handleBackFromDetail();
  } else if (isBBJVisible) {
    backToMainMerch();
  } else if (isPolicyVisible) {
    closePolicyView();
  } else {
    closeWindow('merch');
  }
}

function showMerchList() {
  document.getElementById("merchDetail").style.display = "none";
  document.getElementById("merchList").style.display = "flex";

  const windowContent = merchWindow.querySelector('.mac-window-content');
  if (windowContent) {
    windowContent.scrollTop = 0;
  }
}

function showBBJuankiCollection() {
  const merchWindow = document.getElementById("merch");
  const windowContent = merchWindow.querySelector('.mac-window-content');
  
  if (windowContent) {
    windowContent.scrollTop = 0;
  }
  
  document.getElementById("merchList").style.display = "none";
  document.getElementById("merchDetail").style.display = "none";
  document.getElementById("merchPolicy").style.display = "none";
  document.getElementById("merchListBBJuanki").style.display = "flex";
}

function backToMainMerch() {
  document.getElementById("merchListBBJuanki").style.display = "none";
  document.getElementById("merchDetail").style.display = "none";
  document.getElementById("merchList").style.display = "flex";
}


//================================================================================================//
//-------------------------------------- CARRITO DE COMPRAS --------------------------------------//
//================================================================================================//

let cart = [];

function getShopifyProductID(title, size) {
  const variants = {
    "FREE LOHAN WHITE TEE": {
      S: "46381412647165",
      M: "46381412679933",
      L: "46381412712701",
      "baby tee 7/8": "46914291368189",
      "baby tee 9/10": "46914291400957"
    },

    "FREE LOHAN BLACK TEE": {
      S: "46381471990013",
      M: "46381472022781",
      L: "46381472055549",
      "baby tee 7/8": "46914290876669",
      "baby tee 9/10": "46914290909437"
    },

    "MERCI POLO SHIRT": {
      S: "46872843256061",
      M: "46872843288829",
      L: "46872843321597"
    },

    "FA SWAG WHITE TEE": {
      S: "46872776769789",
      M: "46872776802557",
      L: "46872776835325" 
    },

    "FA WHITE TEE": {
      S: "46709795487997",
      M: "46872776802557",
      L: "46872776835325",
      "baby tee 7/8": "46721852932349",
      "baby tee 9/10": "46721852899581"
    },

    "FA BLACK TEE": {
      S: "46709797912829",
      M: "46709795520765",
      L: "46709795553533",
      "baby tee 7/8": "46721850802429",
      "baby tee 9/10": "46721850835197"
    },

    "FA SWAG BLACK TEE": {
      S: "46872773558525",
      M: "46872773591293",
      L: "46872773624061" 
    },

    "Sticker #FA SWAG Blanco": "46873246171389",
    "Sticker #FA SWAG Negro": "46864147218685",
    "CD BBJUANKI": "46709799158013"
  };

  return typeof variants[title] === "object"
    ? variants[title]?.[size] || null
    : variants[title] || null;
}

function formatCLP(value) {
  return `${value.toLocaleString('es-CL')}`;
}

function updateCartNotificationBadge() {
  const badge = document.getElementById('cartNotificationBadge');
  if (!badge) return;
  
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  
  if (totalItems > 0) {
    badge.classList.remove('hidden');
    
    if (totalItems > 99) {
      badge.textContent = '99+';
      badge.classList.add('large-number');
    } else {
      badge.textContent = totalItems.toString();
      badge.classList.remove('large-number');
    }
    
    badge.classList.remove('updated');
    setTimeout(() => {
      badge.classList.add('updated');
    }, 10);
    
    setTimeout(() => {
      badge.classList.remove('updated');
    }, 400);
    
  } else {
    badge.classList.add('hidden');
  }
}

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
    
    let gifSrc = '';
    if (item.title.includes('White')) {
      gifSrc = 'freelohan_blanca.gif';
    } else if (item.title.includes('Black')) {
      gifSrc = 'freelohan_negra.gif';
    } else if (item.main) {
      gifSrc = item.main;
    }

    const sizeInfo = item.hasSize ? ` - SIZE ${item.size}` : '';
    
    cartItem.innerHTML = `
      <button class="remove-btn" onclick="removeFromCart(${index})">x</button>
      <img src="imagenes/${gifSrc}" alt="${item.title}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;">
      <div class="cart-item-text">
        <p>${item.title}${sizeInfo}</p>
      </div>
      <div>${item.quantity}</div>
      <div>${formatCLP(itemTotal)}</div>
    `;
    cartContainer.appendChild(cartItem);
  });

  totalContainer.textContent = formatCLP(totalPrice);
  checkoutLink.href = cartShopifyItems.length > 0 ? shopifyBase + cartShopifyItems.join(",") : "#";
  
  updateCartNotificationBadge();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

function handleBackFromCart() {
  closeWindow('shoppingCart');
  openWindow('merch');
}

function addToCart() {
  const sizeSelector = document.getElementById("size");
  const size = window.selectedProduct.hasSize && sizeSelector ? sizeSelector.value : null;
  
  if (window.selectedProduct.hasSize && !size) {
    alert("Por favor selecciona una talla.");
    return;
  }
  
  const newItem = {
    ...window.selectedProduct,
    quantity: 1
  };
  
  if (window.selectedProduct.hasSize) {
    newItem.size = size;
  }
  
  const existingIndex = cart.findIndex(item => {
    if (item.hasSize) {
      return item.title === newItem.title && item.size === newItem.size;
    } else {
      return item.title === newItem.title;
    }
  });
  
  if (existingIndex !== -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push(newItem);
  }
  
  updateCart();
  openWindow('shoppingCart');
}

document.querySelector("#merchDetail button")?.addEventListener("click", addToCart);


//================================================================================================//
//-------------------------------------- POLÍTICAS DE MERCH --------------------------------------//
//================================================================================================//

const policies = {
  shipping: {
    title: "Políticas de Envío",
    content: `
      <p>• Los envíos de regiones y zonas rurales de la Región Metropolitana son realizados por Starken.</p>
      <p>• Habrán zonas rurales a las cuales Starken sólo llega a SUCURSAL.</p>
      <p>• Los pedidos tienen un plazo de entrega entre 5 a 10 días hábiles luego de efectuar la compra.</p>
      <br>
      <p><strong>LOS ENVIOS POR CYBER DAY TIENEN UNA EXTENSIÓN EN SU PLAZO DE ENTREGA POR ALTA DEMANDA, HASTA 14 DÍAS HÁBILES.</strong></p>
      <br>
      <p>Enviamos un correo cuando es preparado el pedido:</p> 
      <p>• Serás notificado con el correo y número de seguimiento cuando el pedido sea despachado desde la sucursal de origen.</p>
      <p>• En caso de daño, extravío, siniestro de su pedido o entrega en malas condiciones, 
      Merci hará todas las gestiones pertinentes al caso. Por favor contactar con nosotros vía mail o Instagram para poder ayudarte con tu situación.</p>
    `
  },
  returns: {
    title: "Cambios y Devoluciones",
    content: `
      <p>• Tienes un plazo de 10 días hábiles a partir de la fecha de recepción del producto para hacer válido el cambio, 
      ya sea por talla u otra prenda, siempre y cuando esté sin uso, con su respectiva etiqueta.</p>
      <p>• Todas las compras desde su recepción tienen 2 meses de garantía presentando fallas de fabrica.</p>
      <p>• Tienes la opción de no pagar el envío de tu cambio y realizarlo de manera presencial en nuestra oficina de Santiago (Tienda Archived), previa coordinación por mensajes. 
      Puedes comunicarte a través de nuestra red social instagram o via mail merci.creativecollect@gmail.com</p>
      <p>• No realizamos reembolsos de dinero a menos que presente falla de fábrica y esté dentro del plazo legal 2 meses. 
      Este reembolso demora hasta 10 días hábiles en efectuarse desde que se devuelve el producto.</p>
    `
  }
};

function showPolicy(type) {
  const policyContainer = document.getElementById("merchPolicy");
  const merchList = document.getElementById("merchList");
  const merchListBBJ = document.getElementById("merchListBBJuanki");
  const merchDetail = document.getElementById("merchDetail");
  const policyTitle = document.getElementById("policyTitle");
  const policyText = document.getElementById("policyText");
  const footer = document.querySelector(".merch-footer");
  
  policyTitle.textContent = policies[type].title;
  policyText.innerHTML = policies[type].content;
  
  merchList.style.display = "none";
  merchListBBJ.style.display = "none";
  merchDetail.style.display = "none";
  policyContainer.style.display = "flex";
  
  // Ocultar footer y reiniciar scroll
  if (footer) footer.style.display = "none";
  policyContainer.scrollTop = 0;
}

function closePolicyView() {
  const policyContainer = document.getElementById("merchPolicy");
  const merchList = document.getElementById("merchList");
  const footer = document.querySelector(".merch-footer");
  
  policyContainer.style.display = "none";
  merchList.style.display = "flex";
  
  // Mostrar footer nuevamente
  if (footer) footer.style.display = "flex";
}

function showPolicyBBJ(type) {
  const policyContainer = document.getElementById("merchPolicy");
  const merchList = document.getElementById("merchListBBJuanki");
  const merchDetail = document.getElementById("merchDetailBBJuanki");
  const policyTitle = document.getElementById("policyTitle");
  const policyText = document.getElementById("policyText");
  const footer = document.querySelector(".merch-footer");
  
  policyTitle.textContent = policies[type].title;
  policyText.innerHTML = policies[type].content;
  
  merchList.style.display = "none";
  merchDetail.style.display = "none";
  policyContainer.style.display = "flex";
  
  // Ocultar footer y reiniciar scroll
  if (footer) footer.style.display = "none";
  policyContainer.scrollTop = 0;
}

function closePolicyViewBBJ() {
  const policyContainer = document.getElementById("merchPolicy");
  const merchList = document.getElementById("merchListBBJuanki");
  const footer = document.querySelector(".merch-footer");
  
  policyContainer.style.display = "none";
  merchList.style.display = "flex";
  
  // Mostrar footer nuevamente
  if (footer) footer.style.display = "flex";
}

//===========================================================================================//
//-------------------------------------- SOCIAL MEDIA ---------------------------------------//
//===========================================================================================//

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

  // Ocultar GIFs temporalmente en móviles
  const gifImgs = social.querySelectorAll('.social-icons img');
  if (isMobileDevice()) {
  let loadedCount = 0;
  const clones = [];

  gifImgs.forEach(img => {
    const clone = img.cloneNode(true);
    clone.style.visibility = 'hidden';
    img.replaceWith(clone);

    clone.onload = () => {
      loadedCount++;
      if (loadedCount === gifImgs.length) {
        document.querySelectorAll('.social-icons img').forEach(i => i.style.visibility = 'visible');
      }
    };

    if (clone.complete) {
      clone.onload();
    }

    clones.push(clone);
  });
}
  social.style.display = 'flex';
  setTimeout(() => social.classList.add('show'), 10);
  document.getElementById('icon-close-safari').style.display = 'flex';
}

function closeSocialWindow() {
  const social = document.getElementById("socialWindow");

  if (isMobileDevice()) {
    openWindowsOnMobile.delete('socialWindow');
  }

  social.classList.remove('show');
  setTimeout(() => {
    social.style.display = 'none';
  }, 300);

  document.body.style.backgroundImage = document.body.dataset.originalBg || "";
  document.querySelector('.dock').style.display = 'flex';
  document.getElementById('desktop').style.display = 'flex';
  document.getElementById('icon-close-safari').style.display = 'none';
}

function precargarFondos() {
  const fondoSocial = new Image();
  fondoSocial.src = "imagenes/socialmedia.webp";
  const iconosGif = [
    "imagenes/cd_yt.gif",
    "imagenes/cd_ig.gif",
    "imagenes/cd_sc.gif"
  ];

  iconosGif.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

window.addEventListener("load", precargarFondos);

//================================================================================================//
//-------------------------------------- ENVIAR CORREOS ------------------------------------------//
//================================================================================================//

function enviarCorreo(destino) {
  if (window.event) window.event.preventDefault();

  const form = document.querySelector("form.retro-form");

  // Validación nativa del navegador (HTML5)
  if (!form.checkValidity()) {
    form.reportValidity(); 
    return;
  }

  const correo = document.getElementById('correo').value;
  const asunto = document.getElementById('asunto').value;
  const mensaje = document.getElementById('mensaje').value;

  let destinatario = "";
  if (destino === 'awge') destinatario = "ncarosanchezz@gmail.com";
  if (destino === 'support') destinatario = "merci.creativecollect@gmail.com";

  const templateParams = {
    from_email: correo,
    to_email: destinatario,
    subject: asunto,
    message: mensaje
  };

  emailjs.send('service_z0j54pu', 'template_xk11bu9', templateParams)
    .then(function(response) {
       mostrarMensaje("Mensaje enviado correctamente!", true);
       form.reset();
    }, function(error) {
       mostrarMensaje("Error al enviar mensaje.", false);
       console.error('EmailJS Error:', error);
    });
}

function mostrarMensaje(texto, exito = true) {
  const contenedor = document.getElementById('mensaje-envio');
  const contenido = document.getElementById('contenido-mensaje');
  contenido.innerText = texto;

  // Cambiar color de fondo según éxito o error
  contenedor.style.backgroundColor = exito ? '#bcbcbc' : '#ffcccc';
  contenedor.style.borderColor = exito ? '#444' : '#a00';

  contenedor.style.display = 'flex';
}

function cerrarMensaje() {
  document.getElementById('mensaje-envio').style.display = 'none';
}

