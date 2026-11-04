/*
 * EcoMap SA — mapa e filtros.
 *
 * IMPORTANTE: para ativar o mapa interativo do Google, configure uma chave
 * da Maps JavaScript API na constante GOOGLE_MAPS_API_KEY abaixo.
 * Restrinja a chave ao domínio do seu site e à API Maps JavaScript.
 */
(() => {
  "use strict";

  const GOOGLE_MAPS_API_KEY = "AIzaSyCmG-WuIDjaVbZBsPCD_CE2pcb0Mf3LVH4";
  const FILTERS_KEY = "ecomapMapFilters";
  const SELECTED_KEY = "ecomapSelectedPoint";
  const LOCATION_KEY = "ecomapUserLocation";

  // Endereços e horários consultados no portal oficial do Semasa.
  // Coordenadas são aproximadas para posicionamento inicial dos marcadores.
  const POINTS = [
    {
      id: "vila-linda",
      name: "Ecoponto Vila Linda",
      category: "ecoponto",
      address: "R. Cametá, 81 - Vila Linda, Santo André - SP, 09180-001",
      hours: "Seg a sáb (inclusive feriados): 9h–12h e 13h–17h",
      description: "As Estações de Coleta do Semasa são ecopontos em Santo André, exclusivos para moradores, que recebem diversos tipos de resíduos. Consulte o Semasa para confirmar os materiais aceitos nesta unidade.",
      position: { lat: -23.6812, lng: -46.5277 },
      mapsQuery: "Ecoponto Vila Linda, Rua Cametá 81, Santo André SP"
    },
    {
      id: "paraiso",
      name: "Ecoponto Paraíso",
      category: "ecoponto",
      address: "R. Juquiá, 200 - Paraíso, Santo André - SP",
      hours: "Dom a dom (inclusive feriados): 9h–12h e 13h–17h",
      description: "Estação de Coleta do Semasa. Recebe resíduos conforme as regras municipais de descarte e os materiais aceitos pela unidade. Exclusiva para moradores de Santo André.",
      position: { lat: -23.6755, lng: -46.5456 },
      mapsQuery: "Estação de Coleta Paraíso, Rua Juquiá 200, Santo André SP"
    },
    {
      id: "centro",
      name: "Ecoponto Centro",
      category: "ecoponto",
      address: "Travessa São Bento, 15 - Bairro Jardim, Santo André - SP",
      hours: "Seg a sáb (inclusive feriados): 9h–12h e 13h–17h",
      description: "Estação de Coleta do Semasa para moradores de Santo André. Confira previamente os tipos e os limites de resíduos aceitos pelo serviço municipal.",
      position: { lat: -23.6563, lng: -46.5322 },
      mapsQuery: "Estação de Coleta Centro, Travessa São Bento 15, Santo André SP"
    },

    // ---- Parques, ciclovias e eventos sustentáveis ----
    // Endereços e horários conferidos em fontes públicas (Prefeitura de Santo André,
    // Semasa e imprensa local). ATENÇÃO: as coordenadas (position) são APROXIMADAS —
    // para ajustar, clique com o botão direito no local no Google Maps e copie lat/lng.
    // Para cadastrar um novo local, copie um dos blocos abaixo e troque os dados.
    // category aceita: "ecoponto", "evento", "parque" ou "ciclovia".
    {
      id: "parque-celso-daniel",
      name: "Parque Celso Daniel",
      category: "parque",
      address: "Av. Dom Pedro II, 940 - Jardim, Santo André - SP, 09080-000",
      hours: "Todos os dias: 6h–22h",
      description: "Inaugurado em 1974, é um dos principais parques de Santo André, com lagos, pista de caminhada e de corrida, playground, área para pets e uma figueira centenária tombada como patrimônio cultural da cidade. Entrada gratuita.",
      position: { lat: -23.6600, lng: -46.5220 },
      mapsQuery: "Parque Prefeito Celso Daniel, Avenida Dom Pedro II 940, Santo André SP"
    },
    {
      id: "parque-central",
      name: "Parque Central",
      category: "parque",
      address: "R. José Bonifácio, s/nº - Vila Assunção, Santo André - SP",
      hours: "Todos os dias: 6h–20h",
      description: "Inaugurado em 1992, é o maior e mais completo parque urbano de Santo André, com mais de 10 mil árvores, pista de caminhada e corrida, ciclovia interna e bicicletário, quadras poliesportivas e equipamentos de ginástica.",
      position: { lat: -23.6740, lng: -46.5300 },
      mapsQuery: "Parque Central, Rua José Bonifácio, Vila Assunção, Santo André SP"
    },
    {
      id: "ciclorrota-pedroso-estacao",
      name: "Ciclorrota Parque do Pedroso – Estação Santo André",
      category: "ciclovia",
      address: "Trecho entre o Parque Natural do Pedroso (Estrada do Pedroso, 3.000) e a Estação Prefeito Celso Daniel – Santo André (R. Itambé, 67 - Centro)",
      hours: "Via pública: acesso livre",
      description: "Rota cicloviária sinalizada implantada em 2015 pela Prefeitura para ligar o Parque do Pedroso à estação Prefeito Celso Daniel – Santo André (CPTM). O ponto no mapa marca a ponta da estação. Confirme o percurso e a sinalização atuais antes de pedalar.",
      position: { lat: -23.6521, lng: -46.5282 },
      mapsQuery: "Estação Prefeito Celso Daniel - Santo André, Rua Itambé 67, Santo André SP"
    },
    {
      id: "arraia-sustentavel",
      name: "Arraiá Sustentável — Parque do Pedroso",
      category: "evento",
      address: "Estrada do Pedroso, 3.000 - Parque Miami, Santo André - SP",
      hours: "Evento anual do Junho Verde. Última edição: dom, 28/06/2026, 10h–16h. Consulte o Semasa para as próximas datas.",
      description: "Evento gratuito do Junho Verde (Semasa e Secretaria de Meio Ambiente e Mudanças Climáticas) com brincadeiras juninas de temática ambiental, quadrilha, comidas típicas e bingo, além de trilha monitorada até a Terceira Torre do Antigo Teleférico (com inscrição prévia). Acontece no Parque Natural Municipal do Pedroso, maior unidade de conservação da cidade.",
      position: { lat: -23.7130, lng: -46.5440 },
      mapsQuery: "Parque Natural Municipal do Pedroso, Estrada do Pedroso 3000, Santo André SP"
    }
  ];

  // Aparência e textos de cada categoria. O ecoponto mantém o ícone original (♻);
  // as demais usam o mesmo balão verde com um ícone branco próprio.
  // "glyph" é o desenho do ícone (SVG em uma área de 32x32).
  const GLYPH_ATTRS = 'fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"';
  const CATEGORY_META = {
    ecoponto: {
      plural: "ecoponto(s)",
      keywords: "ecoponto ecopontos estacao de coleta ponto de coleta reciclagem",
      note: "Consulte as regras e os materiais aceitos no site oficial do Semasa antes de levar seus resíduos."
    },
    evento: {
      plural: "evento(s)",
      keywords: "evento eventos sustentavel sustentaveis programacao",
      note: "Datas e programação podem mudar. Confirme no site do Semasa antes de ir.",
      glyph: '<rect x="8.5" y="10.5" width="15" height="13.5" rx="2.4"/><path d="M8.5 15.5H23.5M12.5 8.5V12M19.5 8.5V12"/><circle cx="16" cy="20" r="1.4" fill="#fff" stroke="none"/>'
    },
    parque: {
      plural: "parque(s)",
      keywords: "parque parques area verde natureza",
      note: "Horários e regras de uso podem mudar. Confirme no site da Prefeitura de Santo André antes de visitar.",
      glyph: '<circle cx="16" cy="12.5" r="5" fill="#fff" stroke="none"/><circle cx="11.8" cy="16" r="4" fill="#fff" stroke="none"/><circle cx="20.2" cy="16" r="4" fill="#fff" stroke="none"/><rect x="14.8" y="17" width="2.4" height="8" rx="1" fill="#fff" stroke="none"/>'
    },
    ciclovia: {
      plural: "ciclovia(s)",
      keywords: "ciclovia ciclovias ciclofaixa ciclorrota bicicleta bike ciclismo",
      note: "Siga a sinalização local e confirme o trecho atualizado no site da Prefeitura de Santo André.",
      glyph: '<circle cx="10" cy="20" r="4"/><circle cx="22" cy="20" r="4"/><path d="M10 20H15.5M15.5 20L13.5 12.5H19.5M15.5 20L19.5 12.5M19.5 12.5L22 20M19.5 12.5L19.8 10.5H21.5M12 11H15"/>'
    }
  };

  const DEFAULT_FILTERS = {
    categories: ["ecoponto", "evento", "parque", "ciclovia"],
    distance: "all"
  };

  let map = null;
  let markers = [];
  let infoWindow = null;
  let userPosition = null;
  let selectedPointId = new URLSearchParams(location.search).get("id") || localStorage.getItem(SELECTED_KEY) || "vila-linda";
  let filters = readFilters();

  function readFilters() {
    try {
      const saved = JSON.parse(localStorage.getItem(FILTERS_KEY) || "null");
      if (saved && Array.isArray(saved.categories)) {
        return { categories: saved.categories, distance: String(saved.distance || "all") };
      }
    } catch (_) {}
    return { ...DEFAULT_FILTERS, categories: [...DEFAULT_FILTERS.categories] };
  }

  function saveFilters() {
    localStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
  }

  function setStatus(message, isError = false) {
    const status = document.getElementById("mapStatus");
    if (status) {
      status.textContent = message;
      status.classList.toggle("is-error", isError);
    }
    const filterStatus = document.getElementById("filterLocationStatus");
    if (filterStatus && message) filterStatus.textContent = message;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[char]));
  }

  // Texto sem acentos e em minúsculas, para a busca ignorar "á", "ç" etc.
  function normalizeText(value) {
    return String(value || "").toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  // A busca encontra o local pelo nome, pelo endereço ou pela categoria
  // (ex.: "parque", "bicicleta", "evento", "reciclagem").
  function matchesQuery(point, rawQuery) {
    const query = normalizeText(rawQuery).trim();
    if (!query) return true;
    const meta = CATEGORY_META[point.category] || {};
    return [point.name, point.address, meta.keywords].some(text => normalizeText(text).includes(query));
  }

  // Ícone usado na lista de resultados (balão verde da lateral).
  function categoryIconHtml(category) {
    const meta = CATEGORY_META[category];
    if (!meta || !meta.glyph) return "♻";
    return `<svg viewBox="0 0 32 32" width="18" height="18" aria-hidden="true" ${GLYPH_ATTRS}>${meta.glyph}</svg>`;
  }

  // Aparência do marcador no mapa: ecopontos continuam exatamente como antes;
  // as outras categorias usam o mesmo balão verde com o ícone da categoria.
  function markerAppearance(point) {
    const meta = CATEGORY_META[point.category];
    if (!meta || !meta.glyph) {
      return {
        label: { text: "♻", color: "#ffffff", fontSize: "15px", fontWeight: "700" },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: "#39b94a",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 3,
          scale: 15
        }
      };
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34">` +
      `<circle cx="17" cy="17" r="15" fill="#39b94a" stroke="#ffffff" stroke-width="3"/>` +
      `<g transform="translate(1 1)" ${GLYPH_ATTRS}>${meta.glyph}</g></svg>`;
    return {
      icon: {
        url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
        scaledSize: new google.maps.Size(34, 34),
        anchor: new google.maps.Point(17, 17)
      }
    };
  }

  function distanceKm(a, b) {
    const toRad = deg => deg * Math.PI / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const h = Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    return 6371 * 2 * Math.asin(Math.sqrt(h));
  }

  function isVisible(point) {
    if (!filters.categories.includes(point.category)) return false;
    const limit = Number(filters.distance);
    if (filters.distance !== "all" && limit && userPosition) {
      return distanceKm(userPosition, point.position) <= limit;
    }
    if (filters.distance !== "all" && limit && !userPosition) return false;
    return true;
  }

  function directionsUrl(point) {
    return "https://www.google.com/maps/dir/?api=1&destination=" +
      encodeURIComponent(point.mapsQuery);
  }

  function detailsUrl(point) {
    return "local.html?id=" + encodeURIComponent(point.id);
  }

  function infoContent(point) {
    return `<div class="eco-info-window">
      <strong>${escapeHtml(point.name)}</strong>
      <p>${escapeHtml(point.address)}</p>
      <p><b>Horário:</b> ${escapeHtml(point.hours)}</p>
      <a href="${detailsUrl(point)}">Ver detalhes</a>
      <a href="${directionsUrl(point)}" target="_blank" rel="noopener noreferrer">Como chegar ↗</a>
    </div>`;
  }

  function renderResults(visiblePoints) {
    const container = document.getElementById("ecoResults");
    if (!container) return;
    if (!visiblePoints.length) {
      container.innerHTML = '<p class="eco-empty">Nenhum local corresponde aos filtros. Confira a categoria ou permita o acesso à localização para filtrar por distância.</p>';
      return;
    }
    const shownCategories = [...new Set(visiblePoints.map(point => point.category))];
    const noun = shownCategories.length === 1 && CATEGORY_META[shownCategories[0]]
      ? CATEGORY_META[shownCategories[0]].plural
      : "local(is)";
    container.innerHTML = `<p class="eco-results-title">${visiblePoints.length} ${noun} encontrado(s)</p>` +
      visiblePoints.map(point => `<button type="button" class="eco-result ${point.id === selectedPointId ? "selected" : ""}" data-point-id="${point.id}">
        <span class="eco-result-icon">${categoryIconHtml(point.category)}</span><span><strong>${escapeHtml(point.name)}</strong><small>${escapeHtml(point.address)}</small></span><span aria-hidden="true">›</span>
      </button>`).join("");
    container.querySelectorAll("[data-point-id]").forEach(button => {
      button.addEventListener("click", () => selectPoint(button.dataset.pointId, true));
    });
  }

  function applyFilters() {
    const visiblePoints = POINTS.filter(isVisible);
    markers.forEach(({ point, marker }) => marker.setMap(isVisible(point) ? map : null));
    renderResults(visiblePoints);
    const selected = visiblePoints.find(point => point.id === selectedPointId) || visiblePoints[0];
    const viewButton = document.getElementById("viewSelectedPoint");
    if (viewButton) {
      if (selected) {
        selectedPointId = selected.id;
        localStorage.setItem(SELECTED_KEY, selected.id);
        viewButton.href = detailsUrl(selected);
        viewButton.textContent = "Ver " + selected.name;
      } else {
        viewButton.href = "local.html?id=vila-linda";
        viewButton.textContent = "Ver ecoponto";
      }
    }
    const queryInput = document.getElementById("mapSearch");
    if (queryInput && queryInput.value.trim()) {
      const searchPoints = visiblePoints.filter(p => matchesQuery(p, queryInput.value));
      markers.forEach(({ point, marker }) => marker.setMap(searchPoints.some(p => p.id === point.id) ? map : null));
      renderResults(searchPoints);
    }
    syncFilterControls();
  }

  function syncFilterControls() {
    document.querySelectorAll(".eco-filter").forEach(input => {
      input.checked = filters.categories.includes(input.value);
    });
    document.querySelectorAll('input[name="ecoDistance"]').forEach(input => {
      input.checked = input.value === filters.distance;
    });
  }

  function readFilterControls() {
    filters.categories = [...new Set([...document.querySelectorAll(".eco-filter:checked")].map(input => input.value))];
    const distance = document.querySelector('input[name="ecoDistance"]:checked');
    filters.distance = distance ? distance.value : "all";
    saveFilters();
  }

  function selectPoint(id, panToPoint) {
    const point = POINTS.find(p => p.id === id);
    if (!point) return;
    selectedPointId = id;
    localStorage.setItem(SELECTED_KEY, id);
    const viewButton = document.getElementById("viewSelectedPoint");
    if (viewButton) {
      viewButton.href = detailsUrl(point);
      viewButton.textContent = "Ver " + point.name;
    }
    if (map) {
      const record = markers.find(item => item.point.id === id);
      if (record) {
        if (panToPoint) {
          map.panTo(record.marker.getPosition());
          map.setZoom(15);
        }
        if (infoWindow) infoWindow.setContent(infoContent(point));
        else infoWindow = new google.maps.InfoWindow({ content: infoContent(point) });
        infoWindow.open({ map, anchor: record.marker });
      }
    }
    document.querySelectorAll(".eco-result").forEach(el => el.classList.toggle("selected", el.dataset.pointId === id));
  }

  // Recupera a localização previamente autorizada/salva para que ela continue
  // disponível ao navegar entre Filtros e Mapa.
  function restoreSavedLocation() {
    try {
      const saved = JSON.parse(localStorage.getItem(LOCATION_KEY) || "null");
      if (saved && Number.isFinite(Number(saved.lat)) && Number.isFinite(Number(saved.lng))) {
        userPosition = { lat: Number(saved.lat), lng: Number(saved.lng) };
      }
    } catch (_) {
      userPosition = null;
    }
  }

  // Solicita a localização e permite executar uma ação somente depois que
  // as coordenadas estiverem disponíveis (por exemplo, abrir o mapa filtrado).
  function requestUserLocation(onSuccess) {
    if (!navigator.geolocation) {
      setStatus("Este navegador não oferece acesso à localização. Você ainda pode navegar pelo mapa.", true);
      return;
    }
    setStatus("Solicitando sua localização...");
    navigator.geolocation.getCurrentPosition(position => {
      userPosition = { lat: position.coords.latitude, lng: position.coords.longitude };
      localStorage.setItem(LOCATION_KEY, JSON.stringify(userPosition));
      if (map) {
        map.setCenter(userPosition);
        map.setZoom(13);
      }
      if (filters.distance !== "all") applyFilters();
      setStatus("Localização ativada. Os filtros de distância usam sua posição atual.");
      if (typeof onSuccess === "function") onSuccess();
    }, () => {
      setStatus("Não foi possível obter sua localização. Verifique a permissão do navegador e tente novamente.", true);
    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 });
  }

  function useMyLocation() {
    requestUserLocation();
  }

  function setupControls() {
    syncFilterControls();
    document.querySelectorAll(".eco-filter, input[name='ecoDistance']").forEach(input => {
      input.addEventListener("change", readFilterControls);
    });

    const applyButton = document.getElementById("applyMapFilters");
    if (applyButton) applyButton.addEventListener("click", () => {
      readFilterControls();
      if (filters.distance !== "all" && !userPosition) {
        requestUserLocation(() => applyFilters());
        return;
      }
      applyFilters();
    });

    const saveButton = document.getElementById("saveEcoFilters");
    if (saveButton) saveButton.addEventListener("click", () => {
      readFilterControls();
      const openFilteredMap = () => {
        saveFilters();
        setStatus("Filtros salvos! Abrindo o mapa...");
        location.href = "mapa.html";
      };
      if (filters.distance !== "all" && !userPosition) {
        requestUserLocation(openFilteredMap);
        return;
      }
      openFilteredMap();
    });

    const resetButton = document.getElementById("resetEcoFilters");
    if (resetButton) resetButton.addEventListener("click", () => {
      filters = { ...DEFAULT_FILTERS, categories: [...DEFAULT_FILTERS.categories] };
      saveFilters();
      syncFilterControls();
      const search = document.getElementById("mapSearch");
      if (search) search.value = "";
      setStatus("Filtros limpos.");
    });

    const locationButton = document.getElementById("useMyLocation");
    if (locationButton) locationButton.addEventListener("click", useMyLocation);

    const search = document.getElementById("mapSearch");
    if (search) {
      search.addEventListener("input", applyFilters);
      search.addEventListener("keydown", event => {
        if (event.key === "Enter") {
          if (!search.value.trim()) return;
          const match = POINTS.find(p => matchesQuery(p, search.value));
          if (match) {
            // Se o local pertence a um filtro desmarcado, ativa o filtro para o marcador aparecer.
            if (!filters.categories.includes(match.category)) {
              filters.categories.push(match.category);
              saveFilters();
              applyFilters();
            }
            selectPoint(match.id, true);
          }
        }
      });
    }
    const clear = document.getElementById("clearMapSearch");
    if (clear) clear.addEventListener("click", () => {
      if (search) search.value = "";
      applyFilters();
    });
  }

  function initGoogleMap() {
    const mapElement = document.getElementById("ecoMap");
    if (!mapElement) return;
    if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === "COLE_SUA_CHAVE_API_AQUI") {
      mapElement.innerHTML = `<div class="map-key-help">
        <div class="map-key-help-icon">♻</div>
        <h3>Seu mapa está preparado!</h3>
        <p>Para carregar o Google Maps, adicione sua chave da <b>Maps JavaScript API</b> no arquivo <code>js/mapa.js</code>, na constante <code>GOOGLE_MAPS_API_KEY</code>.</p>
        <p>Os filtros e os detalhes dos ecopontos já estão configurados. Depois de inserir a chave, o mapa será exibido aqui.</p>
        <a href="https://console.cloud.google.com/google/maps-apis/overview" target="_blank" rel="noopener noreferrer">Configurar Google Maps ↗</a>
      </div>`;
      setStatus("Falta configurar a chave da API do Google Maps.", true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js?key=" + encodeURIComponent(GOOGLE_MAPS_API_KEY) + "&loading=async&callback=ecoGoogleMapsReady&v=weekly";
    script.async = true;
    script.onerror = () => {
      setStatus("Não foi possível carregar o Google Maps. Confira a chave, o faturamento e as APIs ativadas.", true);
    };
    window.ecoGoogleMapsReady = () => {
      map = new google.maps.Map(mapElement, {
        center: { lat: -23.6639, lng: -46.5383 },
        zoom: 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        clickableIcons: false,
        styles: [
          { elementType: "geometry", stylers: [{ color: "#f2f7ef" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#49614c" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#f7fff5" }] },
          { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
          { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#dcebd8" }] },
          { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#d4efc9" }] },
          { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#347747" }] },
          { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9eee8" }] },
          { featureType: "transit", elementType: "geometry", stylers: [{ color: "#e3d8f2" }] }
        ]
      });
      infoWindow = new google.maps.InfoWindow();
      markers = POINTS.map(point => {
        const marker = new google.maps.Marker({
          map,
          position: point.position,
          title: point.name,
          ...markerAppearance(point)
        });
        marker.addListener("click", () => selectPoint(point.id, false));
        return { point, marker };
      });
      setStatus("Mapa carregado. Selecione um marcador para ver os detalhes.");
      applyFilters();
      if (selectedPointId) selectPoint(selectedPointId, false);
    };
    document.head.appendChild(script);
  }

  function renderLocationDetails() {
    const details = document.getElementById("ecoLocationDetails");
    if (!details) return;
    const params = new URLSearchParams(location.search);
    const id = params.get("id") || selectedPointId;
    const point = POINTS.find(p => p.id === id) || POINTS[0];
    selectedPointId = point.id;
    localStorage.setItem(SELECTED_KEY, point.id);
    document.title = point.name + " — EcoMap";
    const put = (elementId, value) => {
      const element = document.getElementById(elementId);
      if (element) element.textContent = value;
    };
    put("localName", point.name);
    put("localHours", point.hours);
    put("localAddress", point.address);
    put("localDescription", point.description);
    const photo = details.querySelector(".location-photo");
    if (photo) photo.alt = point.name;
    // A foto e o aviso da página são de ecoponto; para as outras categorias
    // não exibimos a foto de ecoponto e usamos o aviso da categoria.
    const meta = CATEGORY_META[point.category];
    if (point.category !== "ecoponto") {
      if (photo) photo.style.display = "none";
      const note = details.querySelector(".local-note");
      if (note && meta) note.textContent = meta.note;
    }
    const directions = document.getElementById("localDirections");
    if (directions) directions.href = directionsUrl(point);
  }

  document.addEventListener("DOMContentLoaded", () => {
    // Guarda nome e categoria dos locais para a página "Registrar visita".
    // A foto vem de assets/locais/<id>.jpg (se existir) ou do Street View do endereço do local.
    const hasKey = GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== "COLE_SUA_CHAVE_API_AQUI";
    const photoUrl = point => hasKey
      ? "https://maps.googleapis.com/maps/api/streetview?size=640x320&source=outdoor&radius=50&return_error_code=true&location=" +
        encodeURIComponent(point.position.lat + "," + point.position.lng) + "&key=" + encodeURIComponent(GOOGLE_MAPS_API_KEY)
      : "";
    try {
      localStorage.setItem("ecomapPointsIndex", JSON.stringify(POINTS.map(point => ({
        id: point.id, name: point.name, category: point.category,
        address: point.address, photo: photoUrl(point)
      }))));
    } catch (_) {}
    restoreSavedLocation();
    setupControls();
    renderLocationDetails();
    initGoogleMap();
  });
})();