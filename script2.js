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
      document.body.classList.remove('apple-lockdown');
      document.body.classList.add('loaded');

      if (typeof registerUser === "function") {
        registerUser("visitante");
      }
    }, 800);
  }, 2200);
});

function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const message = document.getElementById('message');
  
  // Contraseña
  const correctPassword = "LongLifeMerci."; //<----- Contraseña deseada entre comillas

  // Validar que se ingrese nombre de usuario
  if (!username.trim()) {
    if (message) {
      message.textContent = "Por favor ingresa tu nombre de usuario.";
      message.style.color = "red";
    }
    return;
  }

  /* contraseña--------------------------*/

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

  /*-------------------------------*/



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
  initializePrices();

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

    /* precarga de imagenes de manera local
    document.querySelectorAll('#gallery img, #merch img').forEach(img => {
      const preload = new Image();
      preload.src = img.src;
    });
      */

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

    if (id === 'contact') {
      const contactIcon = document.getElementById('icon-contact');
      const closeIcon = document.getElementById('icon-close-contact');

      contactIcon.style.visibility = 'hidden';
      contactIcon.style.pointerEvents = 'none';

      closeIcon.style.display = 'block';
    }

    openWindowsOnMobile.add(id);
    el.offsetHeight;

    setTimeout(() => {
      el.classList.add('show');
      bringToFront(el);
    }, 10);

    return;
  }

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

function closeWindow(id) {
  const el = document.getElementById(id);
  if (!el) return;

  if (isMobileDevice()) {
    if (id === 'contact') {
      const contactIcon = document.getElementById('icon-contact');
      const closeIcon = document.getElementById('icon-close-contact');

      contactIcon.style.visibility = 'visible';
      contactIcon.style.pointerEvents = 'auto';

      closeIcon.style.display = 'none';
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


//================================================================================================//
//-------------------------------------- ADMIN PANEL - FASE 1 -------------------------------------//
//================================================================================================//

const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "merciadmin"
};

let isAdminLoggedIn = false;

function toggleAdminFileMenu(event) {
  event.stopPropagation();

  const dropdown = document.getElementById("fileDropdown");
  if (!dropdown) return;

  dropdown.classList.toggle("show");
}

function openAdminLogin(event) {
  event.stopPropagation();

  const dropdown = document.getElementById("fileDropdown");
  if (dropdown) dropdown.classList.remove("show");

  openWindow("adminLoginWindow");
}

function adminLogin() {
  const username = document.getElementById("adminUsername")?.value.trim();
  const password = document.getElementById("adminPassword")?.value.trim();
  const message = document.getElementById("adminLoginMessage");

  if (!username || !password) {
    message.textContent = "Completa usuario y contraseña.";
    return;
  }

  if (
    username !== ADMIN_CREDENTIALS.username ||
    password !== ADMIN_CREDENTIALS.password
  ) {
    message.textContent = "Credenciales incorrectas.";
    return;
  }

  isAdminLoggedIn = true;
  message.style.color = "green";
  message.textContent = "Admin conectado.";

  setTimeout(() => {
    closeWindow("adminLoginWindow");
    openWindow("adminPanelWindow");
  }, 500);
}

document.addEventListener("click", () => {
  const dropdown = document.getElementById("fileDropdown");
  if (dropdown) dropdown.classList.remove("show");
});


function adminOpenCreateProduct() {
  const form = document.getElementById("adminCreateProductForm");
  const manager = document.getElementById("adminProductManager");
  const shopPasswordPanel = document.getElementById("adminShopPasswordPanel");
  const message = document.getElementById("adminPanelMessage");

  if (!form) return;

  window.adminEditingProductId = null;
  window.adminCurrentProductPreview = null;

  adminClearProductForm();

  if (manager) manager.style.display = "none";
  if (shopPasswordPanel) shopPasswordPanel.style.display = "none";

  form.style.display = "flex";

  if (message) {
    message.style.color = "#333";
    message.textContent = "Formulario nuevo listo para agregar producto.";
  }
}


function adminClearProductForm() {
  document.getElementById("adminProductTitle").value = "";
  document.getElementById("adminProductPrice").value = "";
  document.getElementById("adminProductOldPrice").value = "";
  document.getElementById("adminProductGif").value = "";
  document.getElementById("adminProductImages").value = "";
  document.getElementById("adminProductSizes").value = "";
  document.getElementById("adminProductVariantId").value = "";
  document.getElementById("adminProductVariantMap").value = "";
  document.getElementById("adminProductCollection").value = "main";
  document.getElementById("adminProductDescription").value = "";

  const soldOut = document.getElementById("adminProductSoldOut");
  if (soldOut) soldOut.checked = false;
}


function adminPreviewProduct() {
  const productPreview = adminBuildProductFromForm();
  const message = document.getElementById("adminPanelMessage");

  if (!productPreview) return;

  console.log("Producto admin preview:", productPreview);

  if (message) {
    message.style.color = "green";
    message.textContent = "Producto previsualizado correctamente.";
  }

  window.adminCurrentProductPreview = productPreview;

  adminRemovePreviewProduct();

  if (productPreview.firebaseId) {
    document.querySelectorAll(`[data-firebase-id="${productPreview.firebaseId}"]`).forEach(el => el.remove());
  }

  adminAddProductToMerchList(productPreview, true);

  openWindow("merch");
  openMerchDetail(productPreview);
}


function adminBuildProductFromForm() {
  const title = document.getElementById("adminProductTitle")?.value.trim();
  const price = document.getElementById("adminProductPrice")?.value.trim();
  const oldPrice = document.getElementById("adminProductOldPrice")?.value.trim();
  const gif = document.getElementById("adminProductGif")?.value.trim();
  const imagesRaw = document.getElementById("adminProductImages")?.value.trim();
  const sizesRaw = document.getElementById("adminProductSizes")?.value.trim();
  const variantId = document.getElementById("adminProductVariantId")?.value.trim();
  const variantMapRaw = document.getElementById("adminProductVariantMap")?.value.trim();
  const collection = document.getElementById("adminProductCollection")?.value;
  const description = document.getElementById("adminProductDescription")?.value.trim();
  const soldOut = document.getElementById("adminProductSoldOut")?.checked || false;
  const message = document.getElementById("adminPanelMessage");

  if (!title || !price || !gif) {
    if (message) {
      message.style.color = "red";
      message.textContent = "Nombre, precio y GIF son obligatorios.";
    }
    return null;
  }

  const images = imagesRaw
    ? imagesRaw.split(",").map(img => img.trim()).filter(Boolean)
    : [];

  const sizes = sizesRaw
    ? sizesRaw.split(",").map(size => size.trim()).filter(Boolean)
    : [];

  const variantMap = {};

  if (variantMapRaw) {
    variantMapRaw.split(",").forEach(pair => {
      const [size, id] = pair.split(":").map(value => value.trim());

      if (size && id) {
        variantMap[size] = id;
      }
    });
  }

  return {
    firebaseId: window.adminEditingProductId || window.adminCurrentProductPreview?.firebaseId || null,
    position: window.adminCurrentProductPreview?.position ?? 9999,
    title,
    price,
    oldPrice: oldPrice || "",
    main: gif,
    thumbnails: [gif, ...images],
    hasSize: sizes.length > 0,
    sizes,
    available: true,
    fromBBJ: collection === "bbj",
    soldOut,
    description: description || "",
    variantId: variantId || "",
    variants: variantMap
  };
}


async function adminSaveCurrentProduct() {
  const message = document.getElementById("adminPanelMessage");
  const product = adminBuildProductFromForm();

  if (!product) return;

  let savedProduct = null;

  // EDITAR PRODUCTO EXISTENTE
  if (product.firebaseId) {
    savedProduct = await window.adminFirebaseUpdateProduct(product);
  }

  // CREAR PRODUCTO NUEVO
  else {
    savedProduct = await adminSaveProduct(product);

    if (savedProduct) {
      await adminPlaceNewProductAtTop(savedProduct);
    }
  }

  if (!savedProduct) return;

  adminRemovePreviewProduct();

  window.adminCurrentProductPreview = savedProduct;
  window.adminEditingProductId = savedProduct.firebaseId || null;

  await adminLoadSavedProducts();
  await adminRenderProductManager?.();

  if (message) {
    message.style.color = "green";
    message.textContent = product.firebaseId
      ? "Producto actualizado correctamente."
      : "Producto guardado correctamente.";
  }
}


async function adminPlaceNewProductAtTop(newProduct) {
  const products = await window.adminFirebaseLoadProducts();
  const isBBJ = newProduct.fromBBJ === true;

  const sameCollection = products
    .filter(product => (product.fromBBJ === true) === isBBJ)
    .filter(product => product.firebaseId !== newProduct.firebaseId)
    .sort((a, b) => {
      const posA = typeof a.position === "number" ? a.position : 9999;
      const posB = typeof b.position === "number" ? b.position : 9999;
      return posA - posB;
    });

  const reordered = [newProduct, ...sameCollection];

  reordered.forEach((product, index) => {
    product.position = index;
  });

  await window.adminFirebaseReorderProducts(reordered);
}


async function adminNormalizeProductPositions(isBBJ) {
  const products = await window.adminFirebaseLoadProducts();

  const sameCollection = products
    .filter(product => product.fromBBJ === isBBJ)
    .sort((a, b) => {
      const createdA = a.createdAt || 0;
      const createdB = b.createdAt || 0;
      return createdB - createdA;
    });

  await window.adminFirebaseReorderProducts(sameCollection);
}


function adminAddProductToMerchList(product, isPreview = false) {
  const targetList = product.fromBBJ
    ? document.getElementById("merchListBBJuanki")
    : document.getElementById("merchList");

  if (!targetList) return;

  const item = document.createElement("div");
  item.className = "merch-item";
  if (product.firebaseId) {
  item.dataset.firebaseId = product.firebaseId;
}

  if (isPreview) {
    item.dataset.adminPreview = "true";
  } else {
    item.dataset.adminProduct = "true";
  }

  item.innerHTML = `
    <h3>${product.title}</h3>

    <div class="merch-image-wrapper">
    <img 
      class="merch-gif"
      src="${getAssetUrl(product.main)}"
      alt="${product.title}"
      loading="lazy"
      decoding="async"
    >

    ${product.soldOut ? '<span class="sold-out-badge">SOLD OUT</span>' : ''}
  </div>

  <h4>
    ${product.oldPrice ? `<span class="old-price">${product.oldPrice}</span> ` : ""}
    <span class="${product.oldPrice ? "new-price" : "price"}">${product.price}</span>
  </h4>

    <button>BUY</button>
  `;

  if (product.soldOut) {
  item.classList.add("is-sold-out");
}

  const img = item.querySelector(".merch-gif");
  const button = item.querySelector("button");

  img.addEventListener("click", () => {
    if (product.soldOut) return;
    openMerchDetail(product);
  });

  button.addEventListener("click", () => {
    if (product.soldOut) return;
    openMerchDetail(product);
  });

  const firstProduct = targetList.querySelector(".merch-item");

  const staticItem = targetList.querySelector(".merch-static-keep");

  if (staticItem) {
    targetList.insertBefore(item, staticItem);
  } else {
    targetList.appendChild(item);
  }
}

function adminRemovePreviewProduct() {
  document.querySelectorAll('[data-admin-preview="true"]').forEach(item => {
    item.remove();
  });
}


async function adminSaveProduct(product) {

  if (typeof window.adminFirebaseSaveProduct !== "function") {
    console.error("❌ window.adminFirebaseSaveProduct no existe");
    alert("Firebase admin no está disponible todavía.");
    return null;
  }

  try {
    const savedProduct = await window.adminFirebaseSaveProduct(product);
    return savedProduct;
  } catch (error) {
    console.error("❌ Error guardando producto en Firebase:", error);
    alert("Error guardando producto. Revisa consola.");
    return null;
  }
}

async function adminLoadSavedProducts() {

  if (typeof window.adminFirebaseLoadProducts !== "function") {
    console.error("❌ window.adminFirebaseLoadProducts no existe");
    return;
  }

  try {
    const savedProducts = await window.adminFirebaseLoadProducts();

    savedProducts.sort((a, b) => {
      const posA = typeof a.position === "number" ? a.position : 9999;
      const posB = typeof b.position === "number" ? b.position : 9999;
      return posA - posB;
    });

    document.querySelectorAll('[data-admin-product="true"]').forEach(item => item.remove());

    savedProducts.forEach(product => {
      adminAddProductToMerchList(product, false);
    });
  } catch (error) {
    console.error("❌ Error cargando productos admin:", error);
  }
}

window.addEventListener("merciFirebaseAdminReady", () => {
  console.log("✅ Firebase admin listo. Cargando productos...");
  adminLoadSavedProducts();
  loadShopPasswordConfig();
});


async function adminOpenProductManager() {
  const manager = document.getElementById("adminProductManager");
  const form = document.getElementById("adminCreateProductForm");
  const message = document.getElementById("adminPanelMessage");

  if (!manager) return;

  if (form) form.style.display = "none";

  manager.style.display = manager.style.display === "none" ? "flex" : "none";

  if (message) {
    message.style.color = "#333";
    message.textContent = "Productos guardados por admin.";
  }

  await adminRenderProductManager();
}

function adminLogout() {
  isAdminLoggedIn = false;

  closeWindow("adminPanelWindow");

  const usernameInput = document.getElementById("adminUsername");
  const passwordInput = document.getElementById("adminPassword");
  const message = document.getElementById("adminLoginMessage");

  if (usernameInput) usernameInput.value = "";
  if (passwordInput) passwordInput.value = "";

  if (message) {
    message.style.color = "red";
    message.textContent = "";
  }

  alert("Sesión admin cerrada.");
}


async function adminRenderProductManager() {
  const list = document.getElementById("adminProductManagerList");
  const collectionSelect = document.getElementById("adminManagerCollection");

  if (!list) return;

  list.innerHTML = "";

  const selectedCollection = collectionSelect?.value || "main";
  const products = await window.adminFirebaseLoadProducts();

  const filteredProducts = products
    .filter(product => {
      if (selectedCollection === "bbj") return product.fromBBJ === true;
      return product.fromBBJ !== true;
    })
    .sort((a, b) => {
      const posA = typeof a.position === "number" ? a.position : 9999;
      const posB = typeof b.position === "number" ? b.position : 9999;
      return posA - posB;
    });

  if (!filteredProducts.length) {
    list.innerHTML = "<p>No hay productos guardados en esta colección.</p>";
    return;
  }

  filteredProducts.forEach((product, index) => {
    const row = document.createElement("div");
    row.className = "admin-manager-row";

    row.innerHTML = `
      <strong>${product.title}</strong>
      <span>${product.price}</span>
      <div>
        <button type="button">↑</button>
        <button type="button">↓</button>
        <button type="button">Editar</button>
        <button type="button">Eliminar</button>
      </div>
    `;

    const [upBtn, downBtn, editBtn, deleteBtn] = row.querySelectorAll("button");

    upBtn.disabled = index === 0;
    downBtn.disabled = index === filteredProducts.length - 1;

    upBtn.addEventListener("click", () => adminMoveProduct(filteredProducts, index, -1));
    downBtn.addEventListener("click", () => adminMoveProduct(filteredProducts, index, 1));
    editBtn.addEventListener("click", () => adminEditProduct(product));
    deleteBtn.addEventListener("click", () => adminDeleteProduct(product));

    list.appendChild(row);
  });
}


async function adminMoveProduct(products, index, direction) {
  const newIndex = index + direction;

  if (newIndex < 0 || newIndex >= products.length) return;

  const reordered = [...products];
  const [movedProduct] = reordered.splice(index, 1);
  reordered.splice(newIndex, 0, movedProduct);

  await window.adminFirebaseReorderProducts(reordered);

  await adminRenderProductManager();
  await adminLoadSavedProducts();

  const message = document.getElementById("adminPanelMessage");

  if (message) {
    message.style.color = "green";
    message.textContent = "Orden actualizado.";
  }
}


async function adminNormalizeAllProductPositions() {
  const products = await window.adminFirebaseLoadProducts();

  for (const isBBJ of [false, true]) {
    const sameCollection = products
      .filter(product => (product.fromBBJ === true) === isBBJ)
      .sort((a, b) => {
        const posA = typeof a.position === "number" ? a.position : 9999;
        const posB = typeof b.position === "number" ? b.position : 9999;

        if (posA !== posB) return posA - posB;

        const createdA = a.createdAt || 0;
        const createdB = b.createdAt || 0;

        return createdA - createdB;
      });

    sameCollection.forEach((product, index) => {
      product.position = index;
    });

    await window.adminFirebaseReorderProducts(sameCollection);
  }
}


function adminEditProduct(product) {
  document.getElementById("adminCreateProductForm").style.display = "flex";
  document.getElementById("adminProductManager").style.display = "none";
  document.getElementById("adminProductSoldOut").checked = product.soldOut === true;
  document.getElementById("adminProductTitle").value = product.title || "";
  document.getElementById("adminProductPrice").value = product.price || "";
  document.getElementById("adminProductOldPrice").value = product.oldPrice || "";
  document.getElementById("adminProductGif").value = product.main || "";
  document.getElementById("adminProductImages").value = (product.thumbnails || []).slice(1).join(", ");
  document.getElementById("adminProductSizes").value = (product.sizes || []).join(", ");
  document.getElementById("adminProductVariantId").value = product.variantId || "";
  document.getElementById("adminProductVariantMap").value = product.variants
    ? Object.entries(product.variants).map(([size, id]) => `${size}:${id}`).join(", ")
    : "";
  document.getElementById("adminProductCollection").value = product.fromBBJ ? "bbj" : "main";
  document.getElementById("adminProductDescription").value = product.description || "";

  window.adminCurrentProductPreview = product;
  window.adminEditingProductId = product.firebaseId || null;

  const message = document.getElementById("adminPanelMessage");
  if (message) {
    message.style.color = "green";
    message.textContent = "Editando producto existente. Puedes guardar directamente.";
  }
}

async function adminDeleteProduct(product) {
  if (!product.firebaseId) return;

  const confirmDelete = confirm(`¿Eliminar "${product.title}"?`);
  if (!confirmDelete) return;

  await window.adminFirebaseDeleteProduct(product.firebaseId);

  document.querySelectorAll(`[data-firebase-id="${product.firebaseId}"]`).forEach(el => el.remove());

  await adminRenderProductManager();
}


let merciShopConfig = {
  passwordEnabled: false,
  password: ""
};

let merciShopUnlocked = false;

async function loadShopPasswordConfig() {
  if (typeof window.adminFirebaseLoadShopConfig !== "function") {
    console.warn("Firebase shop config no disponible.");
    return;
  }

  merciShopConfig = await window.adminFirebaseLoadShopConfig();
  console.log("Shop config cargada:", merciShopConfig);
}

function adminToggleShopPasswordPanel() {
  const panel = document.getElementById("adminShopPasswordPanel");
  const createForm = document.getElementById("adminCreateProductForm");
  const manager = document.getElementById("adminProductManager");

  if (!panel) return;

  if (createForm) createForm.style.display = "none";
  if (manager) manager.style.display = "none";

  panel.style.display = panel.style.display === "none" ? "flex" : "none";

  document.getElementById("adminShopPasswordEnabled").checked = merciShopConfig.passwordEnabled === true;
  document.getElementById("adminShopPasswordValue").value = merciShopConfig.password || "";
}

async function adminSaveShopPasswordConfig() {
  const enabled = document.getElementById("adminShopPasswordEnabled")?.checked || false;
  const password = document.getElementById("adminShopPasswordValue")?.value.trim() || "";
  const message = document.getElementById("adminPanelMessage");

  if (enabled && !password) {
    if (message) {
      message.style.color = "red";
      message.textContent = "Debes ingresar una contraseña.";
    }
    return;
  }

  merciShopConfig = {
    passwordEnabled: enabled,
    password
  };

  await window.adminFirebaseSaveShopConfig(merciShopConfig);

  merciShopUnlocked = false;

  if (message) {
    message.style.color = "green";
    message.textContent = "Configuración de Shop guardada.";
  }
}


function openProtectedShop() {
  openWindow("merch");

  const overlay = document.getElementById("shopPasswordOverlay");
  const content = document.getElementById("shopContentWrapper");
  const input = document.getElementById("shopPasswordInput");
  const message = document.getElementById("shopPasswordMessage");

  if (!overlay || !content) return;

  if (!merciShopConfig.passwordEnabled || merciShopUnlocked) {
    overlay.style.display = "none";
    content.style.display = "block";
    return;
  }

  overlay.style.display = "flex";
  content.style.display = "none";

  if (input) input.value = "";
  if (message) message.textContent = "";

  setTimeout(() => input?.focus(), 100);
}

function submitShopPassword() {
  const input = document.getElementById("shopPasswordInput");
  const message = document.getElementById("shopPasswordMessage");
  const overlay = document.getElementById("shopPasswordOverlay");
  const content = document.getElementById("shopContentWrapper");

  const value = input?.value.trim() || "";

  if (value === merciShopConfig.password) {
    merciShopUnlocked = true;

    overlay.style.display = "none";
    content.style.display = "block";

    return;
  }

  if (message) {
    message.textContent = "Contraseña incorrecta.";
  }
}

document.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;

  const overlay = document.getElementById("shopPasswordOverlay");

  if (overlay && overlay.style.display === "flex") {
    submitShopPassword();
  }
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

const MERCI_ASSET_BASE = "https://res.cloudinary.com/ddyg0qocs/image/upload";

const CLOUDINARY_GIFS = {
  "shiva_god.gif": "https://res.cloudinary.com/ddyg0qocs/image/upload/v1778735534/shiva_god_gjdzi2.gif",
  "mercilovesme_black.gif": "https://res.cloudinary.com/ddyg0qocs/image/upload/v1778735531/mercilovesme_black_rejusn.gif",
  "mercilovesme_green.gif": "https://res.cloudinary.com/ddyg0qocs/image/upload/v1778735532/mercilovesme_green_angdov.gif",
  "member_chain.gif": "https://res.cloudinary.com/ddyg0qocs/image/upload/v1778735531/member_chain_vw0v18.gif",
  "hat_animal_print.gif": "https://res.cloudinary.com/ddyg0qocs/image/upload/v1778735531/hat_animal_print_ugkyye.gif",
  "destroyed_hat.gif": "https://res.cloudinary.com/ddyg0qocs/image/upload/v1778735528/destroyed_hat_uve3te.gif",
  "hat_arabe_white.gif": "https://res.cloudinary.com/ddyg0qocs/image/upload/v1778735531/hat_arabe_white_tzf1fu.gif",
  "hat_arabe_black.gif": "https://res.cloudinary.com/ddyg0qocs/image/upload/v1778735530/hat_arabe_black_xwnx5i.gif",
  "punk_white.gif": "https://res.cloudinary.com/ddyg0qocs/image/upload/v1778735533/punk_white_ymxwfi.gif",
  "punk_black.gif": "https://res.cloudinary.com/ddyg0qocs/image/upload/v1778735533/punk_black_x5vr5v.gif",
  "freelohan_blanca1.gif": "https://res.cloudinary.com/ddyg0qocs/image/upload/v1778735530/freelohan_blanca1_yhlolf.gif",
  "freelohan_negra.gif": "https://res.cloudinary.com/ddyg0qocs/image/upload/v1778735530/freelohan_negra_hn1osi.gif",
  "merci_polo_shirt.gif": "https://res.cloudinary.com/ddyg0qocs/image/upload/v1778735531/merci_polo_shirt_ofeicl.gif",
  "merci_x_bbjuanki.gif": "https://res.cloudinary.com/ddyg0qocs/image/upload/v1778738777/merci_x_bbjuanki_izoha4.gif",
  "polera_swag_blanca1.gif": "https://res.cloudinary.com/ddyg0qocs/image/upload/v1778735532/polera_swag_blanca1_wtsx1u.gif",
  "polera_swag_negra1.gif": "https://res.cloudinary.com/ddyg0qocs/image/upload/v1778735533/polera_swag_negra1_awzgyi.gif",
  "fa_blanca.gif": "https://res.cloudinary.com/ddyg0qocs/image/upload/v1778735529/fa_blanca_tz6akv.gif",
  "fa_negra.gif": "https://res.cloudinary.com/ddyg0qocs/image/upload/v1778735530/fa_negra_ucfcj3.gif",
  "sticker_swag_blanco.gif": "https://res.cloudinary.com/ddyg0qocs/image/upload/v1778735534/sticker_swag_blanco_icv3cz.gif",
  "sticker_swag_negro.gif": "https://res.cloudinary.com/ddyg0qocs/image/upload/v1778735534/sticker_swag_negro_up9lpg.gif",
  "CD.gif": "https://res.cloudinary.com/ddyg0qocs/image/upload/v1778735472/CD_sqxldw.gif",
};

function getAssetUrl(fileName) {
  if (!fileName) return "";

  if (fileName.startsWith("http")) {
    return fileName;
  }

  if (fileName.toLowerCase().endsWith(".gif")) {
    const cloudinaryPath = CLOUDINARY_GIFS[fileName];

    if (!cloudinaryPath) {
      return `imagenes/${fileName}`;
    }

    if (cloudinaryPath.startsWith("http")) {
      return cloudinaryPath;
    }

    return `${MERCI_ASSET_BASE}/${cloudinaryPath}`;
  }

  return `imagenes/${fileName}`;
}

function openMerchDetail(product) {
  const mainImageContainer = document.getElementById("mainMerchImageContainer");
  const title = document.getElementById("merchTitle");
  const priceElement = document.getElementById("merchPrice");
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
  mainImage.src = getAssetUrl(product.main);
  mainImage.loading = "lazy";
  mainImage.decoding = "async";
  mainImage.alt = "Vista Principal";
  mainImageContainer.appendChild(mainImage);

  title.textContent = product.title;

  let descriptionBox = document.getElementById("merchDescription");

  if (!descriptionBox) {
    descriptionBox = document.createElement("div");
    descriptionBox.id = "merchDescription";
    descriptionBox.className = "merch-description";
    buyButton.insertAdjacentElement("afterend", descriptionBox); // 👈 AQUÍ el cambio clave
  }

  if (product.description) {
    descriptionBox.innerHTML = `
      <span class="merch-description-label">Descripción</span>
      <p>${product.description.replace(/\n/g, "<br>")}</p>
    `;
    descriptionBox.style.display = "block";
  } else {
    descriptionBox.innerHTML = "";
    descriptionBox.style.display = "none";
  }
  
  // Actualizar precio con descuento
  if (product.oldPrice) {
    priceElement.innerHTML = `
      <span class="old-price">${product.oldPrice}</span>
      <span class="new-price">${product.price}</span>
    `;
  } else {
    priceElement.innerHTML = `<span class="new-price">${product.price}</span>`;
  }
  
  thumbs.innerHTML = "";

  product.thumbnails.forEach(img => {
    const thumb = document.createElement("img");
    thumb.src = getAssetUrl(img);
    thumb.loading = "lazy";
    thumb.decoding = "async";
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
      windowContent.style.overflowY = "auto";
      windowContent.style.overflowX = "hidden";
    }
    merchDetail.style.overflow = "hidden";
    merchDetail.style.height = "100%";
  }

  window.selectedProduct = product;
}

function formatPrice(value) {
  return '$' + Number(value).toLocaleString('es-CL');
}

function initializePrices() {
  document.querySelectorAll('.price').forEach(el => {
    const price = el.dataset.price;
    const oldPrice = el.dataset.old;

    if (oldPrice && oldPrice !== price) {
      el.innerHTML = `
        <span class="old-price">${formatPrice(oldPrice)}</span>
        <span class="new-price">${formatPrice(price)}</span>
      `;
    } else {
      el.innerHTML = `
        <span class="price">${formatPrice(price)}</span>
      `;
    }
  });
}

function changeMainImage(src) {
  const mainImageContainer = document.getElementById("mainMerchImageContainer");
  mainImageContainer.innerHTML = "";
  
  const imgElement = document.createElement("img");
  imgElement.id = "mainMerchImage";
  imgElement.src = getAssetUrl(src);
  imgElement.loading = "lazy";
  imgElement.decoding = "async";
  imgElement.alt = "Vista Principal";
  
  mainImageContainer.appendChild(imgElement);
}

function handleBackFromDetail() {
  const merchDetail = document.getElementById("merchDetail");
  const merchWindow = document.getElementById("merch");
  
  merchDetail.style.display = "none";
  
  if (window.selectedProduct && window.selectedProduct.fromBBJ) {
    document.getElementById("merchListBBJuanki").style.display = "";
  } else {
    document.getElementById("merchList").style.display = "";
  }
  
  // RESTAURAR SCROLL en celulares
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
  document.getElementById("merchList").style.display = "";

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
  document.getElementById("merchListBBJuanki").style.display = "";
}

function backToMainMerch() {
  document.getElementById("merchListBBJuanki").style.display = "none";
  document.getElementById("merchDetail").style.display = "none";
  document.getElementById("merchList").style.display = "";
}


//================================================================================================//
//-------------------------------------- CARRITO DE COMPRAS --------------------------------------//
//================================================================================================//

let cart = [];

function getShopifyProductID(title, size) {
  const variants = {

    "SHIVA G0D TEE": {
      S: "47493397446909",
      M: "47493397479677",
      L: "47493397512445",
    },

    "MERCI <3 ME BLACK TEE": {
      S: "47493391941885",
      M: "47493391974653",
      L: "47493392007421",
      XL: "47493392040189",
    },

    "MERCI <3 ME GREEN TEE": {
      S: "47493397119229",
      M: "47493397151997",
      L: "47493397184765",
      XL: "47493397217533",
    },

    "MEMBER PASS CHAIN": "47491888382205",
    "SHIT(A) CAP": "47412994769149",
    "DESTROYED HAT": "47334427033853",
    "ARABE WHITE HAT": "47334621937917",
    "ARABE BLACK HAT": "47334625575165",


    "FREE LOHAN WHITE TEE": {
      S: "46381412647165",
      M: "46381412679933",
      L: "46381412712701",
      "baby tee S": "46914291368189",
      "baby tee M": "46914291400957"
    },

    "FREE LOHAN BLACK TEE": {
      S: "46381471990013",
      M: "46381472022781",
      L: "46381472055549",
      "baby tee S": "46914290876669",
      "baby tee M": "46914290909437"
    },

    "MERCI POLO SHIRT": {
      S: "46872843256061",
      M: "46872843288829",
      L: "46872843321597"
    },

    "PUNK GOALS WHITE": {
      XS: "47163041022205",
      S: "47163041054973",
      M: "47163041087741",
      L: "47163041120509",
      XL: "47163041972477",
      "baby tee S":"47164488909053",
      "baby tee M":"47164488941821"

    },

    "PUNK GOALS BLACK": {
      XS: "47163057504509",
      S: "47163057537277",
      M: "47163057570045",
      L: "47163057602813",
      XL: "47163057635581",
      "baby tee S":"47164488057085",
      "baby tee M":"47164488089853"

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
      "baby tee S": "46721852932349",
      "baby tee M": "46721852899581"
    },

    "FA BLACK TEE": {
      S: "46709797912829",
      M: "46709795520765",
      L: "46709795553533",
      "baby tee S": "46721850802429",
      "baby tee M": "46721850835197"
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
    let shopifyId = null;

    // Producto con tallas
    if (item.hasSize && item.variants && item.size) {
      shopifyId = item.variants[item.size];
    }

    // Producto sin talla
    else if (!item.hasSize && item.variantId) {
      shopifyId = item.variantId;
    }

    // Compatibilidad antigua
    else {
      shopifyId = getShopifyProductID(item.title, item.size);
    }

    if (shopifyId) {
      cartShopifyItems.push(`${shopifyId}:${item.quantity}`);
    }
    
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    
  let gifSrc = item.main || "";
  const gifUrl = getAssetUrl(gifSrc);

    const sizeInfo = item.hasSize ? ` - SIZE ${item.size}` : '';
    
    cartItem.innerHTML = `
      <button class="remove-btn" onclick="removeFromCart(${index})">x</button>
      <img src="${gifUrl}" alt="${item.title}" loading="lazy" decoding="async" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;">
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
      <p><strong>LOS PEDIDOS EN PRE-ORDER TIENEN UN PLAZO DE PRODUCCIÓN Y ENVÍO DE HASTA 14 DÍAS HÁBILES.</strong></p>
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
  merchList.style.display = "";
  
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
  merchList.style.display = "";
  
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

