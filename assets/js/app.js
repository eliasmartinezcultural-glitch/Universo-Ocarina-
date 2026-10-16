(() => {
  "use strict";

  const scriptUrl = document.currentScript && document.currentScript.src;
  const dataUrl = scriptUrl ? new URL("../../data/catalogo.json", scriptUrl).href : "data/catalogo.json";
  const fallbackCategories = [
    {id:"audiovisual",number:"01 / IMAGEN",title:"Audiovisual",description:"Documentales, videos, entrevistas, cortometrajes y fotografía en movimiento."},
    {id:"radio",number:"02 / SONIDO",title:"Radio y sonido",description:"Radio online, programas, entrevistas, archivos de audio y producciones sonoras."},
    {id:"tecnologia",number:"03 / CÓDIGO",title:"Tecnología y proyectos digitales",description:"Páginas web, aplicaciones, videojuegos, mapas interactivos y herramientas digitales."},
    {id:"escritos",number:"04 / IDEAS",title:"Escritos e investigaciones",description:"Textos, documentos, informes, ensayos, investigaciones y proyectos escritos."},
    {id:"territorio",number:"05 / MEMORIA",title:"Cultura, territorio y memoria",description:"Historias locales, personas, lugares, patrimonio, fotografías y memoria regional."}
  ];
  const $ = id => document.getElementById(id);
  const doors = $("doorsGrid");
  const collectionPanel = $("collectionPanel");
  const resultsPanel = $("resultsPanel");
  const searchInput = $("searchInput");
  const clearSearch = $("clearSearch");
  const searchHint = $("searchHint");
  const menuToggle = $("menuToggle");
  const siteNav = $("siteNav");
  let catalog = {categories:fallbackCategories,items:[]};

  const categoryFor = id => catalog.categories.find(category => category.id === id) || fallbackCategories.find(category => category.id === id);
  const publicItems = () => catalog.items.filter(item => item && item.visibility === "public" && item.status === "published");
  const normalize = value => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  const categoryName = id => (categoryFor(id) || {}).title || "Colección";
  const itemCategories = item => Array.isArray(item.categories) && item.categories.length ? item.categories : (item.category ? [item.category] : []);

  function safeHash(hash) {
    try { history.replaceState(null, "", hash); } catch (_) { location.hash = hash; }
  }

  function renderDoorCounts() {
    document.querySelectorAll("[data-category]").forEach(door => {
      const count = publicItems().filter(item => itemCategories(item).includes(door.dataset.category)).length;
      door.setAttribute("aria-label", categoryName(door.dataset.category) + (count ? ", " + count + " obras publicadas" : ", todavía sin obras publicadas"));
    });
  }

  function youtubeId(value) {
    try {
      const url = new URL(String(value || ""));
      if (url.hostname === "youtu.be") return url.pathname.split("/").filter(Boolean)[0] || "";
      if (url.hostname === "youtube.com" || url.hostname.endsWith(".youtube.com")) {
        if (url.pathname === "/watch") return url.searchParams.get("v") || "";
        const parts = url.pathname.split("/").filter(Boolean);
        if (["embed","shorts","live"].includes(parts[0])) return parts[1] || "";
      }
    } catch (_) {}
    return "";
  }

  function itemCard(item) {
    const title = escapeHtml(item.title || "Obra sin título");
    const description = escapeHtml(item.summary || "");
    const category = escapeHtml(categoryName(itemCategories(item)[0]));
    const href = String(item.url || "");
    const safeHref = /^https?:\/\//i.test(href) ? href : "";
    let media = "";
    let action = safeHref ? '<a href="' + escapeHtml(safeHref) + '" target="_blank" rel="noopener noreferrer">Abrir obra ↗</a>' : "";

    if (item.type === "video" && youtubeId(safeHref)) {
      const videoId = youtubeId(safeHref);
      media = '<div class="catalog-media catalog-video"><iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(videoId) + '" title="Video: ' + title + '" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>';
      action = '<a href="' + escapeHtml(safeHref) + '" target="_blank" rel="noopener noreferrer">Ver en YouTube ↗</a>';
    } else if (item.type === "radio" && /^https?:\/\//i.test(String(item.stream_url || ""))) {
      const streamUrl = escapeHtml(String(item.stream_url));
      media = '<div class="catalog-media catalog-audio"><p>TRANSMISIÓN EN VIVO</p><audio controls preload="none" src="' + streamUrl + '">Tu navegador no puede reproducir este audio.</audio><p class="audio-status" aria-live="polite" data-state="idle">Lista para reproducir. Pulsá el botón de reproducción.</p></div>';
      action = '<a href="' + streamUrl + '" target="_blank" rel="noopener noreferrer">Abrir señal ↗</a>';
    }
    return '<article class="result-item"><div class="result-copy"><strong>' + title + '</strong><p>' + category + (description ? " · " + description : "") + '</p></div>' + media + '<div class="result-actions">' + action + '</div></article>';
  }

  function wireMediaStatus(root) {
    if (!root) return;
    root.querySelectorAll(".catalog-audio audio").forEach(audio => {
      const status = audio.closest(".catalog-audio")?.querySelector(".audio-status");
      if (!status || audio.dataset.statusBound === "true") return;
      audio.dataset.statusBound = "true";
      audio.addEventListener("playing", () => { status.textContent = "La señal está reproduciendo."; status.dataset.state = "playing"; });
      audio.addEventListener("waiting", () => { status.textContent = "Conectando con la señal…"; status.dataset.state = "waiting"; });
      audio.addEventListener("stalled", () => { status.textContent = "La señal dejó de enviar datos. Esperá unos segundos o volvé a reproducir."; status.dataset.state = "warning"; });
      audio.addEventListener("error", () => {
        status.textContent = "No se pudo reproducir la señal desde este navegador. Probá «Abrir señal» o volvé a intentarlo más tarde.";
        status.dataset.state = "error";
      });
      audio.addEventListener("pause", () => {
        if (!audio.error && !audio.ended) { status.textContent = "Reproducción pausada."; status.dataset.state = "idle"; }
      });
    });
  }

  function openCollection(id, updateUrl = true) {
    const category = categoryFor(id);
    if (!category || !doors || !collectionPanel || !resultsPanel) return;
    doors.hidden = true;
    resultsPanel.hidden = true;
    collectionPanel.hidden = false;
    $("collectionNumber").textContent = category.number || "";
    $("collectionTitle").textContent = category.title || "Colección";
    $("collectionDescription").textContent = category.description || "";
    const items = publicItems().filter(item => itemCategories(item).includes(id));
    $("collectionCount").textContent = items.length + (items.length === 1 ? " obra publicada" : " obras publicadas");
    $("collectionItems").innerHTML = items.map(itemCard).join("");
    wireMediaStatus($("collectionItems"));
    $("emptyState").hidden = items.length > 0;
    if (updateUrl) safeHash("#coleccion-" + id);
    $("collectionTitle").focus?.({preventScroll:true});
    $("collectionPanel").scrollIntoView({behavior:"smooth",block:"start"});
  }

  function showDoors() {
    if (collectionPanel) collectionPanel.hidden = true;
    if (resultsPanel) resultsPanel.hidden = true;
    if (doors) doors.hidden = false;
    safeHash("#puertas");
    $("doorsTitle").focus?.({preventScroll:true});
    $("puertas").scrollIntoView({behavior:"smooth",block:"start"});
  }

  function searchCatalog(query) {
    const q = normalize(query);
    clearSearch.hidden = !query;
    if (!q) {
      resultsPanel.hidden = true;
      collectionPanel.hidden = true;
      doors.hidden = false;
      searchHint.textContent = publicItems().length
        ? "Buscá por título, categoría, tema o palabra clave."
        : "La búsqueda recorrerá el catálogo a medida que incorporemos materiales.";
      return;
    }
    collectionPanel.hidden = true;
    doors.hidden = true;
    resultsPanel.hidden = false;
    const results = publicItems().filter(item => {
      const labels = itemCategories(item).map(categoryName).join(" ");
      return normalize([item.title,item.summary,item.author,item.type,labels,...(item.tags || [])].join(" ")).includes(q);
    });
    $("resultsTitle").textContent = "Resultados";
    $("resultsSummary").textContent = results.length
      ? results.length + (results.length === 1 ? " coincidencia encontrada." : " coincidencias encontradas.")
      : "No encontramos obras publicadas con esa búsqueda. Probá otra palabra.";
    $("resultsList").innerHTML = results.map(itemCard).join("");
    wireMediaStatus($("resultsList"));
    searchHint.textContent = "Buscando en el contenido público disponible.";
  }

  if (!doors || !collectionPanel || !resultsPanel || !searchInput) {
    console.error("Universo Ocarina: faltan elementos esenciales en index.html.");
    return;
  }

  // Delegación: todas las puertas siguen funcionando aunque se modifiquen sus elementos internos.
  doors.addEventListener("click", event => {
    const door = event.target.closest("[data-category]");
    if (!door) return;
    event.preventDefault();
    openCollection(door.dataset.category);
  });
  $("backFromCollection").addEventListener("click", showDoors);
  $("backToDoors").addEventListener("click", showDoors);
  searchInput.addEventListener("input", event => searchCatalog(event.target.value));
  clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    searchCatalog("");
    searchInput.focus();
  });

  menuToggle.addEventListener("click", () => {
    const open = siteNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });
  siteNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    siteNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }));

  renderDoorCounts();
  const initialId = location.hash.startsWith("#coleccion-") ? location.hash.slice("#coleccion-".length) : "";
  if (fallbackCategories.some(category => category.id === initialId)) openCollection(initialId, false);

  fetch(dataUrl, {cache:"no-store"})
    .then(response => {
      if (!response.ok) throw new Error("HTTP " + response.status);
      return response.json();
    })
    .then(data => {
      if (!data || !Array.isArray(data.categories) || !Array.isArray(data.items)) throw new Error("Formato de catálogo inválido");
      catalog = {categories:data.categories,items:data.items};
      renderDoorCounts();
      if (initialId && fallbackCategories.some(category => category.id === initialId)) openCollection(initialId, false);
      else if (searchInput.value) searchCatalog(searchInput.value);
    })
    .catch(error => {
      // La navegación no depende de que el catálogo cargue: las cinco puertas quedan disponibles.
      catalog = {categories:fallbackCategories,items:[]};
      renderDoorCounts();
      searchHint.textContent = "Las puertas funcionan, pero no se pudo cargar el catálogo. Revisá la publicación de data/catalogo.json.";
      console.error("Universo Ocarina: no se pudo cargar el catálogo.", error);
    });
})();