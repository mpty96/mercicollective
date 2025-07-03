  window.addEventListener('DOMContentLoaded', () => {
    audioPlayer(); // <- llamada a tu función
  });

function audioPlayer(){
const audio = document.getElementById('audioPlayer');
const canvas = document.getElementById('visualizerCanvas');
const ctx = canvas.getContext('2d');
const volumeSlider = document.getElementById('volumeControl');

  const barCount = 32;
  let isPlaying = false;

  function drawSimulator() {
    requestAnimationFrame(drawSimulator);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const barWidth = canvas.width / barCount;

    for (let i = 0; i < barCount; i++) {
      let barHeight = isPlaying
        ? Math.random() * canvas.height
        : 4; // altura mínima cuando está quieto

      ctx.fillStyle = '#a75ed4';
      ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 2, barHeight);
    }
  }
  drawSimulator();

  // ✅ SOLO UNA VEZ
  const scWidget1 = SC.Widget(document.getElementById('sc-player-1'));
  const scWidget2 = SC.Widget(document.getElementById('sc-player-2'));

  function setupWidget(widget) {
    widget.bind(SC.Widget.Events.READY, () => {
      // Inicializa el volumen al valor actual del slider
      const initialVolume = parseFloat(volumeSlider.value) * 100;
      widget.setVolume(initialVolume);
    });

    widget.bind(SC.Widget.Events.PLAY, () => {
      isPlaying = true;
    });

    widget.bind(SC.Widget.Events.PAUSE, () => {
      isPlaying = false;
    });

    widget.bind(SC.Widget.Events.FINISH, () => {
      isPlaying = false;
    });
  }

  setupWidget(scWidget1);
  setupWidget(scWidget2);

  if (volumeSlider) {
    // Inicializar volumen del audio
    audio.volume = parseFloat(volumeSlider.value);

    volumeSlider.addEventListener('input', () => {
      const volume = parseFloat(volumeSlider.value);

      // HTML audio
      audio.volume = volume;

      // ✅ SOUND CLOUD
      scWidget1.setVolume(volume * 100);
      scWidget2.setVolume(volume * 100);

      updateVolumeBackground();
    });

    updateVolumeBackground();
  }

  function updateVolumeBackground() {
    const val = parseFloat(volumeSlider.value);
    const percent = val * 100;
    volumeSlider.style.background = `linear-gradient(to right, #4a72c8 0%, #4a72c8 ${percent}%, #ffffff ${percent}%, #ffffff 100%)`;
  }
}

//-------------------------------------- FECHA Y HORA --------------------------------------//

function updateTopBarDateTimeWeather() {
  const now = new Date();

  const dayStr = now.toLocaleDateString('es-CL', { weekday: 'short' }); // Ej: "mar."
  const dateStr = now.toLocaleDateString('es-CL', { year: 'numeric', month: 'short', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });

  const rightInfo = document.getElementById('topbar-right-info');
  rightInfo.textContent = `${dayStr}. ${dateStr} - ${timeStr}`;
}

// Ejecuta al inicio y cada minuto para mantener la hora actualizada
setInterval(updateTopBarDateTimeWeather, 60000);
updateTopBarDateTimeWeather();

function toggleAppleMenu() {
  const menu = document.getElementById('appleMenu');
  menu.classList.toggle('show');
}

function createAccount() {
  const username = document.getElementById('username').value;
    if (username) {
      document.getElementById('message').textContent = "Cuenta creada exitosamente para: " + username;
    }
}

//------------------------------------------ FUNCION ABRIR Y CERRAR VENTANAS -----------------------------------------//

// Función para detectar si es dispositivo móvil
function isMobileDevice() {
  return window.innerWidth <= 768;
}

// Variable para rastrear ventanas abiertas en móviles
let openWindowsOnMobile = new Set();


// FUNCION ABRIR VENTANAS
function openWindow(id) {
  const el = document.getElementById(id);
  if (!el) return;

  // FUNCIONES PARA CELULARES - Forzar display para móviles
  if (isMobileDevice() && getComputedStyle(el).display === 'none') {
    el.style.display = 'flex';
  }

  if (isMobileDevice()) {
    // 3. Prevenir que se abra si ya está abierta
    if (openWindowsOnMobile.has(id)) {
      return; // No hacer nada si ya está abierta
    }

   // 1. Quitar posición aleatoria - 2. Centrar siempre
    el.style.left = '50%';
    el.style.top = '50%';
    el.style.transform = 'translate(-50%, -50%)';
    el.style.display = 'flex';
    if (id === 'contact') {
      document.getElementById('icon-close-contact').style.display = 'flex';
    }
    
    // Agregar a ventanas abiertas
    openWindowsOnMobile.add(id);
    
    setTimeout(() => el.classList.add('show'), 10);
    bringToFront(el);
    return;
  }

  // LOGICA PARA COMPUTADORES
  if (id === 'contact') {
    const icon = document.getElementById('icon-contact');
    const iconRect = icon.getBoundingClientRect();

    document.querySelectorAll(".mac-window.show, .genie-window.show").forEach(win => {
      win.classList.remove('show');
      win.style.display = 'none';
    });

    document.getElementById('icon-close-contact').style.display = 'flex';
    document.getElementById('icon-close-safari').style.display = 'none';
    document.querySelector('.dock').style.display = 'none';
    document.getElementById('desktop').style.display = 'none';

    el.style.top = `${iconRect.top}px`;
    el.style.left = `${iconRect.left}px`;
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

    // Obtener medidas
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const dockHeight = 90;

    // Forzar display para medir altura real
    el.style.display = 'block';
    el.style.visibility = 'hidden';
    el.style.transform = 'none';
    const winHeight = el.offsetHeight || 400;
    const winWidth = el.offsetWidth || 500;
    el.style.display = 'none';
    el.style.visibility = 'visible';

    // Calcular límites seguros
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

// FUNCION TRAER AL FRENTE VENTANAS
function bringToFront(el) {
  // Aumentar z-index progresivamente
  const allWindows = document.querySelectorAll(".mac-window, .genie-window");
  let maxZ = 1000;

  allWindows.forEach(w => {
    const z = parseInt(window.getComputedStyle(w).zIndex) || 1000;
    if (z > maxZ) maxZ = z;
  });

  el.style.zIndex = maxZ + 1;
}


// FUNCION CERRAR VENTANAS 
function closeWindow(id) {
  const el = document.getElementById(id);

  // CAMBIOS PARA MÓVILES
  if (isMobileDevice()) {
    // Remover de ventanas abiertas
    openWindowsOnMobile.delete(id);
    if (id === 'contact') {
      document.getElementById('icon-close-contact').style.display = 'none';
    }
    el.classList.remove('show');
    setTimeout(() => {
      el.style.display = 'none';
    }, 300);
    return;
  }

  if (id === 'contact') {
    const icon = document.getElementById('icon-contact');
    const iconRect = icon.getBoundingClientRect();

    // Animar de regreso al ícono
    el.style.transform = 'scale(0.1)';
    el.style.opacity = '0';
    el.style.top = `${iconRect.top}px`;
    el.style.left = `${iconRect.left}px`;

    // Esperar la animación antes de ocultar
    setTimeout(() => {
      el.style.display = 'none';
      el.style.transform = 'translate(-50%, -50%) scale(1)'; // Reset
      el.style.top = '50%';
      el.style.left = '50%';
      document.querySelector('.dock').style.display = 'flex';
      document.getElementById('desktop').style.display = 'flex';
      document.getElementById('icon-close-contact').style.display = 'none';
      document.getElementById('icon-close-safari').style.display = 'none';
    }, 600);
  } 
  else {
    el.classList.remove('show');
    setTimeout(() => {
      el.style.display = 'none';
    }, 300);
  }
}

// Función para limpiar ventanas abiertas en móviles al cambiar orientación
function handleOrientationChange() {
  if (isMobileDevice()) {
    // Recentrar todas las ventanas abiertas
    openWindowsOnMobile.forEach(windowId => {
      const el = document.getElementById(windowId);
      if (el && el.style.display === 'flex') {
        el.style.left = '50%';
        el.style.top = '50%';
        el.style.transform = 'translate(-50%, -50%)';
      }
    });
  }
}

// ARRASTRAR VENTANAS
document.querySelectorAll('.mac-window').forEach(win => {
  const header = win.querySelector('.mac-window-header');
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  header.style.cursor = 'grab';

  header.addEventListener('mousedown', (e) => {
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

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const dockHeight = 90;

    const winWidth = win.offsetWidth;
    const winHeight = win.offsetHeight;

    let newLeft = e.clientX - offsetX;
    let newTop = e.clientY - offsetY;

    // Limitar bordes
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


function openLink(url) {
  window.open(url, '_blank');
}

// Función para manejar el redimensionamiento de ventana
function handleResize() {
  // Si cambió de móvil a desktop o viceversa, limpiar estado
  const wasMobile = openWindowsOnMobile.size > 0;
  const isMobileNow = isMobileDevice();
  
  if (wasMobile && !isMobileNow) {
    // Cambió de móvil a desktop, limpiar estado móvil
    openWindowsOnMobile.clear();
  }
  
  // Recentrar ventanas en móviles
  handleOrientationChange();
}

// Event listeners para manejar cambios de orientación y redimensionamiento
window.addEventListener('orientationchange', handleOrientationChange);
window.addEventListener('resize', handleResize);


//---------------------------------------- DETALLES DEL MERCH ----------------------------------------//

function changeMainImage(src) {
  const mainImage = document.getElementById("mainMerchImage");
  mainImage.src = "imagenes/" + src;
}

function handleRedButton() {
  const detailView = document.getElementById("merchDetail");

  // Verificamos si está visible, aunque sea inline
  const isDetailVisible = window.getComputedStyle(detailView).display !== "none";

  if (isDetailVisible) {
    showMerchList();
  } else {
    closeWindow('merch');
  }
}

function showMerchList() {

  // Mostrar lista de productos y ocultar detalles
  document.getElementById("merchDetail").style.display = "none";
  document.getElementById("merchList").style.display = "flex";
}

//----------------------------------------- SOCIAL MEDIA -----------------------------------------//

function openSocialWindow() {
  const social = document.getElementById("socialWindow");

  // Ocultar todo
  document.querySelector('.dock').style.display = 'none';
  document.getElementById('desktop').style.display = 'none';

  // Ocultar todas las ventanas abiertas
  document.querySelectorAll(".mac-window.show, .genie-window.show, .fullscreen-window.show").forEach(win => {
    win.classList.remove('show');
    win.style.display = 'none';
  });

  // CAMBIOS PARA MÓVILES
  if (isMobileDevice()) {
    openWindowsOnMobile.add('socialWindow');
  }

  // Cambiar fondo
  document.body.dataset.originalBg = document.body.style.backgroundImage;
  document.body.style.backgroundImage = "url('imagenes/socialmedia.jpg')";

  // Mostrar ventana y botón
  social.style.display = 'flex';
  setTimeout(() => social.classList.add('show'), 10);
  document.getElementById('icon-close-safari').style.display = 'flex';
}


function closeSocialWindow() {
  const social = document.getElementById("socialWindow");

  // CAMBIOS PARA MÓVILES
  if (isMobileDevice()) {
    openWindowsOnMobile.delete('socialWindow');
  }
  social.classList.remove('show');
  setTimeout(() => {
    social.style.display = 'none';
  }, 300);

  social.classList.remove('show');
  setTimeout(() => {
    social.style.display = 'none';
  }, 300);


  // Restaurar fondo original
  document.body.style.backgroundImage = document.body.dataset.originalBg || "";

  // Restaurar escritorio y dock
  document.querySelector('.dock').style.display = 'flex';
  document.getElementById('desktop').style.display = 'flex';

  // Ocultar el botón de cerrar Safari
  document.getElementById('icon-close-safari').style.display = 'none';
}

const precargarFondos = () => {
    const fondoSocial = new Image();
    fondoSocial.src = "imagenes/socialmedia.jpg";
  };

  window.addEventListener("load", precargarFondos);


//----------------------------------------- CARRITO DE COMPRAS -----------------------------------------//
let cart = [];

function openMerchDetail(product) {
  const mainImage = document.getElementById("mainMerchImage");
  const title = document.getElementById("merchTitle");
  const price = document.getElementById("merchPrice");
  const thumbs = document.getElementById("merchThumbs");

  mainImage.src = "imagenes/" + product.main;
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
  document.getElementById("merchDetail").style.display = "flex";

  // Guardar el producto en una variable global para el carrito
  window.selectedProduct = product;
}

function addToCart() {
  const size = document.getElementById("size").value;

  if (!size) {
    alert("Por favor selecciona una talla.");
    return;
  }

  const newItem = {
    ...window.selectedProduct,
    size: size,
    quantity: 1,
  };

  // Verificar si ya existe el mismo producto con la misma talla
  const existingIndex = cart.findIndex(item =>
    item.title === newItem.title && item.size === newItem.size
  );

  if (existingIndex !== -1) {
    // Si existe, aumenta cantidad
    cart[existingIndex].quantity += 1;
  } else {
    // Si no existe, lo agrega como nuevo
    cart.push(newItem);
  }

  updateCart();
  showShoppingCart();
}

function updateCart() {
  const cartContainer = document.getElementById("cartItems");
  const totalContainer = document.getElementById("totalPrice");
  const checkoutButton = document.querySelector(".checkout-btn");
  const checkoutLink = checkoutButton.closest("a");

  cartContainer.innerHTML = "";
  let totalPrice = 0;

  // 🟣 Construir link de Shopify Cart
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

    cartItem.innerHTML = `
      <button class="remove-btn" onclick="removeFromCart(${index})">x</button>
      <img src="imagenes/${item.main}" alt="${item.title}" />
      <div class="cart-item-text">
        <p>${item.title} - SIZE ${item.size}</p>
      </div>
      <div>${item.quantity}</div>
      <div>${formatCLP(itemTotal)}</div>
    `;

    cartContainer.appendChild(cartItem);
  });

  totalContainer.textContent = formatCLP(totalPrice);

  // Actualizar el link del botón de Checkout
  if (cartShopifyItems.length > 0) {
    checkoutLink.href = shopifyBase + cartShopifyItems.join(",");
  } else {
    checkoutLink.href = "#";
  }
}

function getShopifyProductID(title, size) {
  const variants = {
    "Lindsay Lohan White Tee": {
      S: "46381412647165",
      M: "46381412679933",
      L: "46381412712701",
      XL: "46381412745469"
    },
    "Lindsay Lohan Black Tee": {
      S: "46381471990013",
      M: "46381472022781",
      L: "46381472055549",
      XL: "46381472088317"
    }
  };

  return variants[title]?.[size] || null;
}


function showShoppingCart() {
  const cartWindow = document.getElementById("shoppingCart");

  // CAMBIOS PARA MÓVILES
  if (isMobileDevice()) {
    if (openWindowsOnMobile.has('shoppingCart')) {
      return; // No abrir si ya está abierta
    }
    openWindowsOnMobile.add('shoppingCart');
    
    // Centrar en móviles
    cartWindow.style.left = '50%';
    cartWindow.style.top = '50%';
    cartWindow.style.transform = 'translate(-50%, -50%)';
  }
  
  cartWindow.style.display = "flex";
  setTimeout(() => cartWindow.classList.add("show"), 10);
  bringToFront(cartWindow);
}

function formatCLP(value) {
  return `${value.toLocaleString('es-CL')}`;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

// Añadir al carrito desde la ventana de detalles del producto
document.querySelector("#merchDetail button").onclick = addToCart;


function precargarImagenesMerch() {
  const imagenes = [
    'polera.gif', 'polera2.jpg', 'polera3.jpg',
    'polera2.gif', 'polera4.jpg', 'weon.jpeg'
  ];

  imagenes.forEach(src => {
    const img = new Image();
    i.src = 'imagenes/' + src;
    img.onload = () => console.log(`Imagen precargada: ${src}`);
  });
}
window.addEventListener('load', precargarImagenesMerch);

//--------------------------------------------- GALERIA DE VIDEOS ------------------------------------------//

let currentVideoIndex = 0; // Video central por defecto

// Función para leer automáticamente los datos desde el HTML
function getVideosFromHTML() {
  const videoRows = document.querySelectorAll('.video-row');
  const videos = [];
  
  videoRows.forEach(row => {
    const nameCell = row.querySelector('.row-cell.name').textContent.trim();
    const timeCell = row.querySelector('.row-cell.time').textContent.trim();
    const artistCell = row.querySelector('.row-cell.artist').textContent.trim();
    const albumCell = row.querySelector('.row-cell.album').textContent.trim();
    
    const cleanTitle = nameCell.replace(/🎵\s*/, ''); // Limpiar emoji
    videos.push({
      title: cleanTitle,
      time: timeCell,
      artist: artistCell,
      album: albumCell,
      genre: "Music Video"
    });
  });

  return videos;
}

// Cargar videos automáticamente del HTML
const videos = getVideosFromHTML();

// Actualizar estado del coverflow visualmente
function updateCoverFlow() {
  const items = document.querySelectorAll('.coverflow-item');
  const track = document.getElementById('coverflowTrack');
  const rows = document.querySelectorAll('.video-row');

  items.forEach((item, index) => {
    item.className = 'coverflow-item';

    if (index === currentVideoIndex) {
      item.classList.add('center');
    } else if (index === currentVideoIndex - 1) {
      item.classList.add('left');
    } else if (index === currentVideoIndex + 1) {
      item.classList.add('right');
    } else if (index < currentVideoIndex - 1) {
      item.classList.add('far-left');
    } else if (index > currentVideoIndex + 1) {
      item.classList.add('far-right');
    }

    // Ocultar los que están demasiado lejos
    if (Math.abs(index - currentVideoIndex) > 3) {
      item.style.opacity = "0";
      item.style.pointerEvents = "none";
    } else {
      item.style.opacity = "1";
      item.style.pointerEvents = "auto";
    }
  });

  // Centramos el video activo en pantalla desplazando el track
  const itemWidth = 240 + 30; // 240px de ancho + 30px de gap
  const offset = (items.length - 1) * itemWidth / 2 - currentVideoIndex * itemWidth;
  track.style.transform = `translateX(${offset}px)`;

  // Actualizar lista
  rows.forEach((row, index) => {
    row.classList.toggle('selected', index === currentVideoIndex);
  });

  updateTrackInfo();
}

// Actualizar información debajo del coverflow (opcional)
function updateTrackInfo() {
  const trackInfo = document.querySelector('.track-info');
  const video = videos[currentVideoIndex];

  if (trackInfo && video) {
    trackInfo.innerHTML = `
      <img src="imagenes/MERCI.png">
      <div>${video.title}</div>
      <div>${video.artist}</div>
      <div>0:00 - ${video.time}</div>
    `;
  }
}

// Cambiar de video hacia izquierda o derecha
function moveCoverflow(direction) {
  const items = document.querySelectorAll('.coverflow-item');
  currentVideoIndex += direction;

  if (currentVideoIndex < 0) currentVideoIndex = 0;
  if (currentVideoIndex >= items.length) currentVideoIndex = items.length - 1;

  updateCoverFlow();
}

// Seleccionar video manualmente
function selectVideo(index) {
  if (index >= 0 && index < videos.length) {
    currentVideoIndex = index;
    updateCoverFlow();
  }
}

function selectVideoFromList(index) {
  selectVideo(index);
}

// Navegación por teclado
document.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowLeft') moveCoverflow(-1);
  if (e.key === 'ArrowRight') moveCoverflow(1);
});

// Función para recargar los datos desde HTML (si es dinámico)
function refreshVideoData() {
  const updatedVideos = getVideosFromHTML();
  videos.splice(0, videos.length, ...updatedVideos);
  updateCoverFlow();
}

// Si ya está cargado
if (document.readyState !== 'loading') {
  updateCoverFlow();
}

// Control de volumen para iframes de YouTube (Movies)
document.getElementById("galleryVolumeControl").addEventListener("input", function () {
  const volume = this.value;
  const iframes = document.querySelectorAll("#gallery iframe");
  iframes.forEach(iframe => {
    iframe.contentWindow.postMessage(JSON.stringify({
      event: "command",
      func: "setVolume",
      args: [volume]
    }), "*");
  });
});




//----------------------------------------------- CORREOS ----------------------------------------------//

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

  const mailto = `mailto:${destinatario}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent('From: ' + correo + '\n\n' + mensaje)}`;
  window.location.href = mailto;
}

//----------------------------------------- VOLUMEN SOUNDCLOUD ---------------------------------------//
const iframes = [
    SC.Widget(document.getElementById('sc-player-1')),
    SC.Widget(document.getElementById('sc-player-2'))
]

  const volumeSlider = document.getElementById("volumeControl");
  
  iframes.forEach(widget => {
    widget.bind(SC.Widget.Events.READY, function () {
      volumeSlider.addEventListener("input", () => {
        const volume = parseFloat(volumeSlider.value);
        widget.setVolume(volume * 100);
      });
    });
  });

if (volumeSlider) {
    const audio = document.getElementById('audioPlayer');
    // Inicializar volumen del audio
    audio.volume = parseFloat(volumeSlider.value);

    volumeSlider.addEventListener('input', () => {
      const volume = parseFloat(volumeSlider.value);

      // HTML audio
      audio.volume = volume;

      // ✅ SOUND CLOUD
      scWidget1.setVolume(volume * 100);
      scWidget2.setVolume(volume * 100);

      updateVolumeBackground();
    });

    updateVolumeBackground();
  }

function updateVolumeBackground() {
    const val = parseFloat(volumeSlider.value);
    const percent = val * 100;
    volumeSlider.style.background = `linear-gradient(to right, #4a72c8 0%, #4a72c8 ${percent}%, #ffffff ${percent}%, #ffffff 100%)`;
  }

volumeSlider.addEventListener("input", updateVolumeBackground);
updateVolumeBackground();


  
// ----------------------------------- INICIO DE SESION -------------------------------- //

document.addEventListener('DOMContentLoaded', () => {
  const appleMenu = document.getElementById('appleMenu');

  if (appleMenu) {
    document.body.classList.add('apple-lockdown');
    appleMenu.classList.add('show');
    appleMenu.style.display = 'flex'; // asegúrate de que se muestre al inicio
  }
});

function login() {
  const username = document.getElementById('username').value;
  if (!username.trim()) {
    document.getElementById('message').textContent = "Por favor ingresa tu nombre de usuario.";
    document.getElementById('message').style.color = "red";
    return;
  }

  // Oculta el recuadro suavemente
  const menu = document.getElementById('appleMenu');
  menu.classList.remove('show');

  // Espera que se desvanezca antes de mostrar el resto
  setTimeout(() => {
    menu.style.display = 'none';
    document.body.classList.remove('apple-lockdown');
  }, 400);
}


//PRECARGAR VENTANAS GALERIA DE VIDEOS Y MERCH para que no demoren en abrir en celular.
document.addEventListener("DOMContentLoaded", () => {
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (!isMobile) return;

  const preloadWindows = ['gallery', 'merch'];

   // 👇 NUEVO: Forzar display none para ciertas ventanas en móviles
  if (isMobileDevice()) {
    ['gallery', 'merch'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
  }


  preloadWindows.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    // Mostrar de forma invisible para forzar el layout
    el.style.position = 'absolute';
    el.style.opacity = '0';
    el.style.visibility = 'hidden';
    el.style.display = 'block';

    // Forzar reflow individual
    el.offsetHeight;

    // Restaurar estilos
    el.style.display = 'none';
    el.style.position = '';
    el.style.opacity = '';
    el.style.visibility = '';
  });

  // Precargar imágenes
  const imgs = document.querySelectorAll('#gallery img, #merch img');
  imgs.forEach(img => {
    const preload = new Image();
    preload.src = img.src;
  });

  // 🚨 Forzar reflow global con dummy element (mejora dispositivos lentos)
  const dummy = document.createElement('div');
  dummy.style.height = '1px';
  document.body.appendChild(dummy);
  dummy.offsetHeight; // Forzar reflow general
  document.body.removeChild(dummy);

  console.log("Precarga de ventanas + imágenes + reflow forzado completado.");
});

// Evita clics en iframes ocultos
document.addEventListener("DOMContentLoaded", () => {
  const allWindows = document.querySelectorAll(".mac-window, .itunes-window");

  allWindows.forEach(win => {
    const iframes = win.querySelectorAll("iframe");
    iframes.forEach(iframe => {
      iframe.dataset.originalPointerEvents = iframe.style.pointerEvents || "auto";
      iframe.style.pointerEvents = "none"; // Desactivado al inicio
    });
  });
});

function activateAppleLockdown() {
  const menu = document.getElementById('appleMenu');
  if (!menu) {
    console.error("No se encontró #appleMenu");
    return;
  }

  document.body.classList.add('apple-lockdown');
  menu.classList.add('show');
  console.log("Modo bloqueo activado correctamente");
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', activateAppleLockdown);
} else {
  activateAppleLockdown(); // DOM ya estaba listo
}


// Detecta pérdida de foco en el input (cuando se oculta el teclado)
document.querySelectorAll('.login-input').forEach(input => {
  input.addEventListener('blur', () => {
    // Restaura scroll al top para evitar recorte visual
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  });
});
