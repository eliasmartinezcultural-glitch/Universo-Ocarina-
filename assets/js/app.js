(() => {
  "use strict";
  const dataUrl = "data/catalogo.json";
  const doorGrid = document.getElementById("doorsGrid");
  const collectionPanel = document.getElementById("collectionPanel");
  const resultsPanel = document.getElementById("resultsPanel");
  const searchInput = document.getElementById("searchInput");
  const clearSearch = document.getElementById("clearSearch");
  const searchHint = document.getElementById("searchHint");
  const menuToggle = document.getElementById("menuToggle");
  const siteNav = document.getElementById("siteNav");
  let catalog = { categories: [], items: [] };

  const fallbackCategories = [
    {id:"audiovisual",number:"01 / IMAGEN",title:"Audiovisual",description:"Documentales, videos, entrevistas, cortometrajes y fotografía en movimiento."},
    {id:"radio",number:"02 / SONIDO",title:"Radio y sonido",description:"Radio online, programas, entrevistas, archivos de audio y producciones sonoras."},
    {id:"tecnologia",number:"03 / CÓDIGO",title:"Tecnología y proyectos digitales",description:"Páginas web, aplicaciones, videojuegos, mapas interactivos y herramientas digitales."},
    {id:"escritos",number:"04 / IDEAS",title:"Escritos e investigaciones",description:"Textos, documentos, informes, ensayos, investigaciones y proyectos escritos."},
    {id:"territorio",number:"05 / MEMORIA",title:"Cultura, territorio y memoria",description:"Historias locales, personas, lugares, patrimonio, fotografías y memoria regional."}
  ];

  const byId = id => catalog.categories.find(category => category.id === id) || fallbackCategories.find(category => category.id === id);
  const visibleItems = () => catalog.items.filter(item => item && item.visibility === "public" && item.status === "published");
  const normalize = value => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  const categoryName = id => byId(id)?.title || "Colección";

  function renderDoorCounts() {
    document.querySelectorAll("[data-category]").forEach(door => {
      const count = visibleItems().filter(item => (item.categories || [item.category]).includes(door.dataset.category)).length;
      door.setAttribute("aria-label", categoryName(door.dataset.category) + (count ? ", " + count + " obras publicadas" : ", todavía sin obras publicadas"));
    });
  }

  function youtubeId(value) {
    try {
      const url = new URL(String(value || ""));
      if (url.hostname === "youtu.be") return url.pathname.split("/").filter(Boolean)[0] || "";
      if (url.hostname.endsWith("youtube.com")) {
        if (url.pathname === "/watch") return url.searchParams.get("v") || "";
        const parts = url.pathname.split("/").filter(Boolean);
        if (["embed", "shorts", "live"].includes(parts[0])) return parts[1] || "";
      }
    } catch (_) {}
    return "";
  }

  function itemCard(item) {
    const title = escapeHtml(item.title || "Obra sin título");
    const description = escapeHtml(item.summary || "");
    const category = escapeHtml(categoryName((item.categories || [item.category])[0]));
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
      media = '<div class="catalog-media catalog-audio"><p>TRANSMISIÓN EN VIVO</p><audio controls preload="none" src="' + streamUrl + '">Tu navegador no puede reproducir este audio. </audio></div>';
      action = '<a href="' + streamUrl + '" target="_blank" rel="noopener noreferrer">Abrir señal ↗</a>';
    }

    return '<article class="result-item"><div class="result-copy"><strong>' + title + '</strong><p>' + category + (description ? " · " + description : "") + '</p></div>' + media + '<div class="result-actions">' + action + '</div></article>';
  }

  function openCollection(id) {
    const category = byId(id);
    if (!category) return;
    doorGrid.hidden = true;
    resultsPanel.hidden = true;
    collectionPanel.hidden = false;
    document.getElementById("collectionNumber").textContent = category.number || "";
    document.getElementById("collectionTitle").textContent = category.title;
    document.getElementById("collectionDescription").textContent = category.description;
    const items = visibleItems().filter(item => (item.categories || [item.category]).includes(id));
    document.getElementById("collectionCount").textContent = items.length + (items.length === 1 ? " obra publicada" : " obras publicadas");
    document.getElementById("collectionItems").innerHTML = items.map(itemCard).join("");
    document.getElementById("emptyState").hidden = items.length > 0;
    document.getElementById("puertas").scrollIntoView({behavior:"smooth",block:"start"});
    history.replaceState(null, "", "#coleccion-" + id);
  }

  function showDoors() {
    collectionPanel.hidden = true;
    resultsPanel.hidden = true;
    doorGrid.hidden = false;
    history.replaceState(null, "", "#puertas");
    document.getElementById("doorsTitle").focus?.();
  }

  function searchCatalog(query) {
    const q = normalize(query);
    clearSearch.hidden = !query;
    if (!q) {
      resultsPanel.hidden = true;
      doorGrid.hidden = false;
      searchHint.textContent = visibleItems().length
        ? "Buscá por título, categoría, tema o palabra clave."
        : "La búsqueda recorrerá el catálogo a medida que incorporemos materiales.";
      return;
    }
    collectionPanel.hidden = true;
    doorGrid.hidden = true;
    resultsPanel.hidden = false;
    const results = visibleItems().filter(item => {
      const categoryLabels = (item.categories || [item.category]).map(categoryName).join(" ");
      const haystack = normalize([item.title, item.summary, item.author, item.type, categoryLabels, ...(item.tags || [])].join(" "));
      return haystack.includes(q);
    });
    document.getElementById("resultsTitle").textContent = "Resultados";
    document.getElementById("resultsSummary").textContent = results.length
      ? results.length + (results.length === 1 ? " coincidencia encontrada." : " coincidencias encontradas.")
      : "No encontramos obras publicadas con esa búsqueda. Probá otra palabra.";
    document.getElementById("resultsList").innerHTML = results.map(itemCard).join("");
    searchHint.textContent = "Buscando en el contenido público disponible.";
  }

  document.querySelectorAll("[data-category]").forEach(door => {
    door.addEventListener("click", event => {
      event.preventDefault();
      openCollection(door.dataset.category);
    });
  });
  document.getElementById("backFromCollection").addEventListener("click", showDoors);
  document.getElementById("backToDoors").addEventListener("click", showDoors);
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

  fetch(dataUrl, {cache:"no-cache"})
    .then(response => { if (!response.ok) throw new Error("Catálogo no disponible"); return response.json(); })
    .then(data => {
      if (Array.isArray(data.categories)) catalog.categories = data.categories;
      if (Array.isArray(data.items)) catalog.items = data.items;
      renderDoorCounts();
      const hash = location.hash.replace("#coleccion-", "");
      if (fallbackCategories.some(category => category.id === hash)) openCollection(hash);
    })
    .catch(() => {
      catalog.categories = fallbackCategories;
      catalog.items = [];
      renderDoorCounts();
    });
})();