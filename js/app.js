(function () {
  var APP_CONFIG = window.APP_CONFIG || {};
  var MAPS = window.MAPS || {};
  var LAYERS = window.LAYERS || {};
  var POI_TYPES = window.POI_TYPES || {};
  var POIS = window.POIS || {};
  var POI_LINKS = window.POI_LINKS || {};
  var HIDDEN_LAYER_ID = "__hidden__";
  var app = document.getElementById("app");

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function paragraphHtml(text, className) {
    var value = text == null ? "" : String(text);
    var paragraphs = value.split(/\r?\n/).filter(function (part) {
      return part.trim() !== "";
    });

    if (!paragraphs.length) {
      paragraphs = [value];
    }

    return paragraphs.map(function (part) {
      return '<p class="' + className + '">' + escapeHtml(part) + "</p>";
    }).join("");
  }

  function detailLevelForZoom(mapDef, zoom) {
    var thresholds = (mapDef.detailZoomThresholds || []).slice().sort(function (a, b) {
      return a - b;
    });
    var level = 0;

    thresholds.forEach(function (threshold, index) {
      if (zoom >= threshold) {
        level = index + 1;
      }
    });

    return level;
  }

  function minimumZoomForDetailLevel(mapDef, detailLevel) {
    var thresholds = (mapDef.detailZoomThresholds || []).slice().sort(function (a, b) {
      return a - b;
    });

    if (!detailLevel || detailLevel <= 0) {
      return mapDef.zoom.min;
    }

    if (thresholds[detailLevel - 1] != null) {
      return thresholds[detailLevel - 1];
    }

    return mapDef.zoom.max;
  }

  function getLayerColor(layerId) {
    var colors = {
      kingdoms: "#f3cc4f",
      settlements: "#65b8ff",
      landforms: "#4fd1a5",
      ruins: "#ee6b63",
      __hidden__: "#8f8b9f"
    };

    return colors[layerId] || "#f3cc4f";
  }

  function hexToRgb(hex) {
    var clean = hex.replace("#", "");
    var expanded = clean.length === 3
      ? clean.split("").map(function (part) { return part + part; }).join("")
      : clean;

    return [
      parseInt(expanded.slice(0, 2), 16),
      parseInt(expanded.slice(2, 4), 16),
      parseInt(expanded.slice(4, 6), 16)
    ];
  }

  function markerDisplay(poiType, hidden) {
    var baseColor = poiType.color || getLayerColor(poiType.layer);
    var color = hidden ? getLayerColor(HIDDEN_LAYER_ID) : baseColor;
    var alpha = hidden ? "0.08" : "0.15";
    return {
      color: color,
      background: "rgba(" + hexToRgb(color).join(",") + "," + alpha + ")"
    };
  }

  function markerInnerHtml(poiType) {
    var iconImg = poiType.iconImg || poiType.icon || "";

    if (iconImg) {
      return '<img class="poi-marker-icon" src="' + escapeHtml(iconImg) + '" alt="">' +
        '<span class="poi-marker-fallback" aria-hidden="true" style="display:none;"><span class="poi-marker-dot"></span></span>';
    }

    return '<span class="poi-marker-fallback" aria-hidden="true"><span class="poi-marker-dot"></span></span>';
  }

  function normalizeHotkey(hotkey) {
    return String(hotkey || "")
      .toLowerCase()
      .replace(/\s+/g, "")
      .split("+")
      .filter(Boolean);
  }

  function isHotkeyMatch(event, hotkey) {
    var parts = normalizeHotkey(hotkey);
    var key = String(event.key || "").toLowerCase();

    if (!parts.length) {
      return false;
    }

    return parts.indexOf("ctrl") !== -1 === !!event.ctrlKey &&
      parts.indexOf("shift") !== -1 === !!event.shiftKey &&
      parts.indexOf("alt") !== -1 === !!event.altKey &&
      parts.indexOf("meta") !== -1 === !!event.metaKey &&
      parts[parts.length - 1] === key;
  }

  function buildPoiLinkLookup() {
    var lookup = {};
    var groups = POI_LINKS;

    Object.keys(groups).forEach(function (groupId) {
      var group = groups[groupId];
      (group.entries || []).forEach(function (entry) {
        var key = entry.mapId + "::" + entry.poiId;
        if (!lookup[key]) {
          lookup[key] = [];
        }

        lookup[key].push({
          groupId: groupId,
          label: group.label || groupId,
          entries: group.entries || []
        });
      });
    });

    return lookup;
  }

  function validateData() {
    var warnings = [];

    if (!MAPS[APP_CONFIG.defaultMapId]) {
      warnings.push("Default map does not exist.");
    }

    Object.keys(MAPS).forEach(function (mapId) {
      var mapDef = MAPS[mapId];

      ["label", "image", "width", "height"].forEach(function (field) {
        if (!mapDef[field]) {
          warnings.push("Map '" + mapId + "' is missing '" + field + "'.");
        }
      });

      Object.keys((POIS && POIS[mapId]) || {}).forEach(function (poiId) {
        var poi = POIS[mapId][poiId];
        var poiType = POI_TYPES[poi.type];

        if (!poiType) {
          warnings.push("POI '" + mapId + "/" + poiId + "' references missing type '" + poi.type + "'.");
          return;
        }

        if (!LAYERS[poiType.layer]) {
          warnings.push("POI type '" + poi.type + "' references missing layer '" + poiType.layer + "'.");
        }

        if (poi.x < 0 || poi.y < 0 || poi.x > mapDef.width || poi.y > mapDef.height) {
          warnings.push("POI '" + mapId + "/" + poiId + "' is outside map bounds.");
        }
      });
    });

    return warnings;
  }

  var state = {
    currentMapId: APP_CONFIG.defaultMapId,
    selectedPoiId: null,
    zoom: 1,
    panX: 0,
    panY: 0,
    layers: {},
    showHidden: false,
    showCoordinates: false,
    searchQuery: "",
    mouseX: null,
    mouseY: null,
    drag: null,
    dragMoved: false,
    poiLinkLookup: buildPoiLinkLookup()
  };

  var pendingSearchFocus = null;

  Object.keys(LAYERS).forEach(function (layerId) {
    state.layers[layerId] = LAYERS[layerId].visible !== false;
  });

  function currentMap() {
    return MAPS[state.currentMapId];
  }

  function currentPois() {
    return POIS[state.currentMapId] || {};
  }

  function poiById(mapId, poiId) {
    return (POIS[mapId] || {})[poiId] || null;
  }

  function currentPoi() {
    var poi = state.selectedPoiId ? currentPois()[state.selectedPoiId] : null;
    if (poi && !isPoiVisible(poi)) {
      return null;
    }
    return poi;
  }

  function breadcrumbEntries() {
    var trail = [];
    var poiId = state.selectedPoiId;
    var seen = {};

    while (poiId) {
      var poi = currentPois()[poiId];
      if (!poi || seen[poiId]) {
        break;
      }
      trail.unshift({ poiId: poiId, poi: poi });
      seen[poiId] = true;
      poiId = poi.parentId || null;
    }

    return trail;
  }

  function poiLabel(mapId, poiId) {
    var poi = poiById(mapId, poiId);
    if (poi) {
      return poi.name;
    }
    return poiId;
  }

  function resetView() {
    var mapDef = currentMap();
    state.zoom = mapDef.defaultView.zoom;
    state.panX = mapDef.defaultView.panX;
    state.panY = mapDef.defaultView.panY;
  }

  function computeTransformBounds() {
    var viewport = document.getElementById("mapViewport");
    var mapDef = currentMap();

    if (!viewport || !mapDef) {
      return null;
    }

    var rect = viewport.getBoundingClientRect();
    var scaledWidth = mapDef.width * state.zoom;
    var scaledHeight = mapDef.height * state.zoom;

    return {
      rect: rect,
      minPanX: Math.min(0, rect.width - scaledWidth),
      minPanY: Math.min(0, rect.height - scaledHeight)
    };
  }

  function clampPan() {
    var bounds = computeTransformBounds();
    if (!bounds) {
      return;
    }

    if (bounds.minPanX === 0) {
      state.panX = (bounds.rect.width - currentMap().width * state.zoom) / 2;
    } else if (APP_CONFIG.behavior.clampPanToMapBounds) {
      state.panX = clamp(state.panX, bounds.minPanX, 0);
    }

    if (bounds.minPanY === 0) {
      state.panY = (bounds.rect.height - currentMap().height * state.zoom) / 2;
    } else if (APP_CONFIG.behavior.clampPanToMapBounds) {
      state.panY = clamp(state.panY, bounds.minPanY, 0);
    }
  }

  function isPoiVisible(poi) {
    var poiType = POI_TYPES[poi.type];

    if (!poiType) {
      return false;
    }

    if (state.layers[poiType.layer] === false) {
      return false;
    }

    if ((poiType.detailLevel || 0) > detailLevelForZoom(currentMap(), state.zoom)) {
      return false;
    }

    if (poi.hidden === true) {
      return state.showHidden;
    }

    return true;
  }

  function isPoiSelectable(poi) {
    return !!poi && isPoiVisible(poi);
  }

  function isLinkedPoiVisible(mapId, poiId) {
    var poi = poiById(mapId, poiId);
    if (!poi) {
      return false;
    }

    if (poi.hidden === true && !state.showHidden) {
      return false;
    }

    return true;
  }

  function searchResults() {
    var query = state.searchQuery.trim();
    if (!query) {
      return [];
    }

    var caseSensitive = APP_CONFIG.search.caseSensitive;
    var needle = caseSensitive ? query : query.toLowerCase();

    return Object.keys(currentPois()).map(function (poiId) {
      var poi = currentPois()[poiId];
      if (!isPoiSelectable(poi)) {
        return null;
      }
      var haystacks = [poi.name, poi.summary];

      if (APP_CONFIG.search.includeDescription) {
        haystacks.push(poi.description);
      }

      if (APP_CONFIG.search.includeTags && Array.isArray(poi.tags)) {
        haystacks.push(poi.tags.join(" "));
      }

      var matched = haystacks.some(function (value) {
        if (!value) {
          return false;
        }

        var source = caseSensitive ? String(value) : String(value).toLowerCase();
        return source.indexOf(needle) !== -1;
      });

      return matched ? { poiId: poiId, poi: poi } : null;
    }).filter(Boolean);
  }

  function panelTitle(icon, text) {
    return '<div class="panel-title-row"><h2 class="panel-title">' + icon + " " + text + "</h2></div>";
  }

  function renderBreadcrumbs() {
    var mapDef = currentMap();
    var crumbs = [
      '<button class="crumb crumb-link" type="button" data-breadcrumb-root="true">' + escapeHtml(mapDef.label) + "</button>"
    ];

    breadcrumbEntries().forEach(function (entry) {
      crumbs.push('<span class="crumb-sep">›</span>');
      crumbs.push('<button class="crumb crumb-link" type="button" data-breadcrumb-poi-id="' + escapeHtml(entry.poiId) + '">' + escapeHtml(entry.poi.name) + "</button>");
    });

    return '' +
      '<section class="panel pad breadcrumb-panel">' +
      '<div class="breadcrumbs">' + crumbs.join("") + "</div>" +
      "</section>";
  }

  function renderMapSelectorPanel() {
    var options = Object.keys(MAPS).map(function (mapId) {
      var selected = mapId === state.currentMapId ? " selected" : "";
      return '<option value="' + escapeHtml(mapId) + '"' + selected + '>' + escapeHtml(MAPS[mapId].label) + "</option>";
    }).join("");

    return '' +
      '<section class="panel pad">' +
      '<div class="map-meta right">' +
      '<select class="map-select" id="mapSelect">' + options + "</select>" +
      "</div>" +
      "</section>";
  }

  function renderPoiPanel() {
    var poi = currentPoi();

    if (!poi) {
      return "";
    }

    var poiType = POI_TYPES[poi.type];
    var key = state.currentMapId + "::" + state.selectedPoiId;
    var linkedGroups = state.poiLinkLookup[key] || [];
    var tags = Array.isArray(poi.tags) ? poi.tags : [];
    var summary = poi.summary ? '<p class="poi-panel-summary">' + escapeHtml(poi.summary) + "</p>" : "";

    var tagHtml = APP_CONFIG.ui.showTags && tags.length
      ? '<div class="poi-section"><div class="section-label">Tags</div><div class="pill-list">' + tags.map(function (tag) {
        return '<span class="pill">' + escapeHtml(tag) + "</span>";
      }).join("") + "</div></div>"
      : "";

    var crossRefs = [];
    linkedGroups.forEach(function (group) {
      group.entries.filter(function (entry) {
        return !(entry.mapId === state.currentMapId && entry.poiId === state.selectedPoiId) &&
          isLinkedPoiVisible(entry.mapId, entry.poiId);
      }).forEach(function (entry) {
        crossRefs.push({
          groupLabel: group.label,
          mapId: entry.mapId,
          poiId: entry.poiId
        });
      });
    });

    var linkHtml = crossRefs.length
      ? '<div class="poi-section"><div class="linked-list">' + crossRefs.map(function (entry) {
        return '<button class="linked-item" type="button" data-link-map-id="' + escapeHtml(entry.mapId) + '" data-link-poi-id="' + escapeHtml(entry.poiId) + '"><span class="linked-destination">' + escapeHtml(MAPS[entry.mapId].label) + " · " + escapeHtml(poiLabel(entry.mapId, entry.poiId)) + "</span></button>";
      }).join("") + "</div></div>"
      : "";

    return '' +
      '<section class="panel poi-detail-panel">' +
      '<div class="poi-panel-header-wrap">' +
      '<div class="poi-panel-header">' +
      "<div>" +
      '<h2 class="poi-panel-title">' + escapeHtml(poi.name) + "</h2>" +
      '<div class="poi-panel-type">' + escapeHtml(poiType.label) + (poi.hidden ? " · Hidden POI" : "") + "</div>" +
      '<div class="poi-panel-coords">(' + poi.x + ", " + poi.y + ')</div>' +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="poi-panel-body">' +
      summary +
      paragraphHtml(poi.description || poi.summary || "No description provided.", "poi-panel-description") +
      linkHtml +
      tagHtml +
      "</div>" +
      "</section>";
  }

  function renderSearchPanel() {
    var results = searchResults();
    var clearButton = state.searchQuery.trim()
      ? '<button class="search-clear-button" id="searchClearButton" type="button" aria-label="Clear search">×</button>'
      : "";

    if (clearButton) {
      clearButton = '<button class="search-clear-button" id="searchClearButton" type="button" aria-label="Clear search">&times;</button>';
    }

    var resultsHtml = "";
    if (state.searchQuery.trim()) {
      resultsHtml = '<div class="search-results">';
      if (results.length) {
        resultsHtml += results.map(function (result) {
          var typeLabel = POI_TYPES[result.poi.type] ? POI_TYPES[result.poi.type].label : result.poi.type;
          return '<button class="result-item" type="button" data-result-poi-id="' + escapeHtml(result.poiId) + '"><span class="result-item-title">' + escapeHtml(result.poi.name) + '</span><span class="result-item-meta">' + escapeHtml(typeLabel) + "</span></button>";
        }).join("");
      } else {
        resultsHtml += '<div class="result-item">No matches on this map.</div>';
      }
      resultsHtml += "</div>";
    }

    return '' +
      '<section class="panel pad search-shell">' +
      '<div class="search-input-row">' +
      '<span class="search-icon" aria-hidden="true">⌕</span>' +
      '<input id="searchInput" class="search-input" type="search" placeholder="Search map..." value="' + escapeHtml(state.searchQuery) + '">' +
      clearButton +
      "</div>" +
      resultsHtml +
      "</section>";
  }

  function renderZoomPanel() {
    var mapDef = currentMap();
    var percent = Math.round(((state.zoom - mapDef.zoom.min) / (mapDef.zoom.max - mapDef.zoom.min)) * 100);

    return '' +
      '<section class="panel pad">' +
      '<div class="zoom-controls">' +
      '<button class="zoom-button" id="zoomOutButton" type="button">−</button>' +
      '<input class="zoom-range" id="zoomRange" type="range" min="0" max="100" value="' + percent + '">' +
      '<button class="zoom-button" id="zoomInButton" type="button">+</button>' +
      "</div>" +
      "</section>";
  }

  function renderCoordinatesPanel() {
    if (!state.showCoordinates) {
      return "";
    }

    var mouseX = state.mouseX == null ? "-" : Math.round(state.mouseX);
    var mouseY = state.mouseY == null ? "-" : Math.round(state.mouseY);
    var zoom = Math.round(state.zoom * 100) / 100;
    var panX = Math.round(state.panX);
    var panY = Math.round(state.panY);

    return '' +
      '<section class="panel pad coordinates-panel" aria-live="polite">' +
      '<div class="coordinates-line">zoom: ' + zoom + ', pan: ' + panX + ', ' + panY + "</div>" +
      '<div class="coordinates-line">mouse: ' + mouseX + ', ' + mouseY + "</div>" +
      "</section>";
  }

  function renderLayerPanel() {
    var layerButtons = Object.keys(LAYERS).filter(function (layerId) {
      return LAYERS[layerId].showInLayerList !== false;
    }).map(function (layerId) {
      var enabled = state.layers[layerId] !== false;
      return '' +
        '<button class="layer-item' + (enabled ? "" : " is-disabled") + '" type="button" data-layer-id="' + escapeHtml(layerId) + '">' +
        '<span class="layer-swatch" style="background:' + getLayerColor(layerId) + ';"></span>' +
        '<span class="layer-name">' + escapeHtml(LAYERS[layerId].label) + "</span>" +
        '<span>' + (enabled ? "◉" : "○") + "</span>" +
        "</button>";
    }).join("");

    return '' +
      '<section class="panel pad">' +
      panelTitle("◫", "Layers") +
      '<div class="layers-list">' + layerButtons + "</div>" +
      "</section>";
  }

  function renderMarkers() {
    return Object.keys(currentPois()).map(function (poiId) {
      var poi = currentPois()[poiId];
      var poiType = POI_TYPES[poi.type];

      if (!poiType || !isPoiVisible(poi)) {
        return "";
      }

      var display = markerDisplay(poiType, poi.hidden === true);
      var size = poiType.markerSize || 22;
      var selected = state.selectedPoiId === poiId ? " is-selected" : "";
      var markerScale = clamp(1 / state.zoom, 1, 3.6);
      var iconHtml = markerInnerHtml(poiType);

      return '' +
        '<button class="poi-marker' + selected + '" type="button" data-poi-id="' + escapeHtml(poiId) + '" style="left:' + poi.x + "px;top:" + poi.y + 'px;color:' + display.color + ';">' +
        '<span class="poi-marker-core" style="width:' + size + "px;height:" + size + ';background:' + display.background + ';--poi-marker-scale:' + markerScale + ';">' +
        iconHtml +
        "</span>" +
        "</button>";
    }).join("");
  }

  function renderLabels() {
    if (!APP_CONFIG.ui.showPoiLabels) {
      return "";
    }

    return Object.keys(currentPois()).map(function (poiId) {
      var poi = currentPois()[poiId];
      var poiType = POI_TYPES[poi.type];

      if (!poiType || !isPoiVisible(poi)) {
        return "";
      }

      var selected = state.selectedPoiId === poiId ? " is-selected" : "";
      var labelScale = Math.max(1 / state.zoom, 1);
      var labelClass = "poi-label-button";
      var labelOffset = (poiType.markerSize || 22) / 2 + 12;

      if (APP_CONFIG.ui.alwaysShowLabels) {
        labelClass += " is-always-visible";
      }
      if (poi.summary) {
        labelClass += " has-summary";
      }

      return '' +
        '<button class="' + labelClass + selected + '" type="button" data-poi-id="' + escapeHtml(poiId) + '" style="left:' + poi.x + "px;top:" + (poi.y + labelOffset) + 'px;color:' + escapeHtml(poiType.color || getLayerColor(poiType.layer)) + ';--poi-label-scale:' + labelScale + ';">' +
        '<span class="poi-label-title">' + escapeHtml(poi.name) + "</span>" +
        (poi.summary
          ? '<span class="poi-label-summary">' + escapeHtml(poi.summary) + "</span>"
          : "") +
        "</button>";
    }).join("");
  }

  function render() {
    var mapDef = currentMap();

    app.innerHTML = '' +
      '<div class="app-shell">' +
      '<div class="map-stage">' +
      '<div class="map-viewport" id="mapViewport">' +
      '<div class="map-canvas" id="mapCanvas" style="width:' + mapDef.width + "px;height:" + mapDef.height + 'px;">' +
      '<img class="map-image" draggable="false" src="' + escapeHtml(mapDef.image) + '" alt="' + escapeHtml(mapDef.label) + '">' +
      '<div class="poi-layer">' + renderMarkers() + renderLabels() + "</div>" +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="floating-column left">' +
      renderBreadcrumbs() +
      renderPoiPanel() +
      "</div>" +
      '<div class="floating-column right">' +
      renderMapSelectorPanel() +
      renderZoomPanel() +
      renderLayerPanel() +
      renderSearchPanel() +
      "</div>" +
      renderCoordinatesPanel() +
      "</div>";

    syncMapTransform();
    attachDomEvents();
    restorePendingSearchFocus();
  }

  function restorePendingSearchFocus() {
    if (!pendingSearchFocus) {
      return;
    }

    var searchInput = document.getElementById("searchInput");
    if (!searchInput) {
      pendingSearchFocus = null;
      return;
    }

    searchInput.focus();
    if (typeof pendingSearchFocus.start === "number" && typeof pendingSearchFocus.end === "number") {
      searchInput.setSelectionRange(pendingSearchFocus.start, pendingSearchFocus.end);
    }

    pendingSearchFocus = null;
  }

  function syncMapTransform() {
    clampPan();

    var canvas = document.getElementById("mapCanvas");
    if (!canvas) {
      return;
    }

    canvas.style.transform = "translate(" + state.panX + "px, " + state.panY + "px) scale(" + state.zoom + ")";
    syncCoordinatesPanel();
  }

  function syncCoordinatesPanel() {
    var panel = document.querySelector(".coordinates-panel");
    if (!panel) {
      return;
    }

    var lines = panel.querySelectorAll(".coordinates-line");
    if (lines.length < 2) {
      return;
    }

    var zoom = Math.round(state.zoom * 100) / 100;
    var panX = Math.round(state.panX);
    var panY = Math.round(state.panY);
    var mouseX = state.mouseX == null ? "-" : Math.round(state.mouseX);
    var mouseY = state.mouseY == null ? "-" : Math.round(state.mouseY);

    lines[0].textContent = "zoom: " + zoom + ", pan: " + panX + ", " + panY;
    lines[1].textContent = "mouse: " + mouseX + ", " + mouseY;
  }

  function updateMouseCoordinates(clientX, clientY) {
    var viewport = document.getElementById("mapViewport");
    var mapDef = currentMap();

    if (!viewport || !mapDef) {
      state.mouseX = null;
      state.mouseY = null;
      syncCoordinatesPanel();
      return;
    }

    var rect = viewport.getBoundingClientRect();
    var localX = clientX - rect.left;
    var localY = clientY - rect.top;

    state.mouseX = clamp((localX - state.panX) / state.zoom, 0, mapDef.width);
    state.mouseY = clamp((localY - state.panY) / state.zoom, 0, mapDef.height);
    syncCoordinatesPanel();
  }

  function setHoveredPoi(poiId) {
    Array.prototype.forEach.call(document.querySelectorAll(".poi-marker.is-hovered, .poi-label-button.is-hovered"), function (element) {
      element.classList.remove("is-hovered");
    });

    if (!poiId) {
      return;
    }

    Array.prototype.forEach.call(document.querySelectorAll('[data-poi-id="' + poiId + '"]'), function (element) {
      element.classList.add("is-hovered");
    });
  }

  function adjustZoom(nextZoom, anchor) {
    var mapDef = currentMap();
    var bounds = computeTransformBounds();
    if (!bounds) {
      return;
    }

    var pointX = anchor ? anchor.x : bounds.rect.width / 2;
    var pointY = anchor ? anchor.y : bounds.rect.height / 2;
    var worldX = (pointX - state.panX) / state.zoom;
    var worldY = (pointY - state.panY) / state.zoom;

    state.zoom = clamp(nextZoom, mapDef.zoom.min, mapDef.zoom.max);
    state.panX = pointX - worldX * state.zoom;
    state.panY = pointY - worldY * state.zoom;
    render();
  }

  function changeMap(mapId, preserveView) {
    state.currentMapId = mapId;
    state.selectedPoiId = null;

    if (!preserveView && APP_CONFIG.behavior.resetViewOnMapChange) {
      resetView();
    }

    render();
  }

  function focusPoi(mapId, poiId) {
    var preserveView = mapId === state.currentMapId;
    changeMap(mapId, preserveView);

    var poi = poiById(mapId, poiId);
    var poiType = poi ? POI_TYPES[poi.type] : null;
    var mapDef = currentMap();
    var bounds = computeTransformBounds();

    state.selectedPoiId = poiId;
    if (poi && poiType) {
      state.zoom = Math.max(state.zoom, minimumZoomForDetailLevel(mapDef, poiType.detailLevel || 0));
      bounds = computeTransformBounds();
    }

    if (poi && bounds) {
      state.panX = bounds.rect.width / 2 - poi.x * state.zoom;
      state.panY = bounds.rect.height / 2 - poi.y * state.zoom;
    }

    render();
  }

  function attachDomEvents() {
    var viewport = document.getElementById("mapViewport");
    var mapSelect = document.getElementById("mapSelect");
    var searchInput = document.getElementById("searchInput");
    var searchClearButton = document.getElementById("searchClearButton");
    var zoomRange = document.getElementById("zoomRange");
    var zoomIn = document.getElementById("zoomInButton");
    var zoomOut = document.getElementById("zoomOutButton");

    if (mapSelect) {
      mapSelect.onchange = function (event) {
        changeMap(event.target.value, false);
      };
    }

    if (searchInput) {
      searchInput.oninput = function (event) {
        state.searchQuery = event.target.value;
        pendingSearchFocus = {
          start: event.target.selectionStart,
          end: event.target.selectionEnd
        };
        render();
      };

      searchInput.onkeydown = function (event) {
        if (event.key === "Escape") {
          state.searchQuery = "";
          pendingSearchFocus = {
            start: 0,
            end: 0
          };
          render();
        }
      };
    }

    if (searchClearButton) {
      searchClearButton.onclick = function () {
        state.searchQuery = "";
        render();
      };
    }

    if (zoomRange) {
      zoomRange.oninput = function (event) {
        var mapDef = currentMap();
        var ratio = Number(event.target.value) / 100;
        var nextZoom = mapDef.zoom.min + ratio * (mapDef.zoom.max - mapDef.zoom.min);
        var bounds = computeTransformBounds();
        if (!bounds) {
          return;
        }

        var pointX = bounds.rect.width / 2;
        var pointY = bounds.rect.height / 2;
        var worldX = (pointX - state.panX) / state.zoom;
        var worldY = (pointY - state.panY) / state.zoom;

        state.zoom = clamp(nextZoom, mapDef.zoom.min, mapDef.zoom.max);
        state.panX = pointX - worldX * state.zoom;
        state.panY = pointY - worldY * state.zoom;
        syncMapTransform();
      };

      zoomRange.onchange = function () {
        render();
      };
    }

    if (zoomIn) {
      zoomIn.onclick = function () {
        adjustZoom(state.zoom + currentMap().zoom.step);
      };
    }

    if (zoomOut) {
      zoomOut.onclick = function () {
        adjustZoom(state.zoom - currentMap().zoom.step);
      };
    }

    if (viewport) {
      viewport.onpointerdown = function (event) {
        if (event.target.closest(".poi-marker, .poi-label-button")) {
          return;
        }

        state.drag = {
          startX: event.clientX,
          startY: event.clientY,
          panX: state.panX,
          panY: state.panY
        };
        state.dragMoved = false;

        viewport.classList.add("is-dragging");
        updateMouseCoordinates(event.clientX, event.clientY);
      };

      viewport.onpointermove = function (event) {
        updateMouseCoordinates(event.clientX, event.clientY);
      };

      viewport.onpointerleave = function () {
        state.mouseX = null;
        state.mouseY = null;
        syncCoordinatesPanel();
      };

      viewport.onwheel = function (event) {
        event.preventDefault();
        updateMouseCoordinates(event.clientX, event.clientY);
        var rect = viewport.getBoundingClientRect();
        var nextZoom = state.zoom + (event.deltaY < 0 ? currentMap().zoom.step : -currentMap().zoom.step);
        adjustZoom(nextZoom, {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        });
      };
    }

    window.onpointermove = function (event) {
      updateMouseCoordinates(event.clientX, event.clientY);

      if (!state.drag) {
        return;
      }

      if (Math.abs(event.clientX - state.drag.startX) > 4 || Math.abs(event.clientY - state.drag.startY) > 4) {
        state.dragMoved = true;
      }

      state.panX = state.drag.panX + (event.clientX - state.drag.startX);
      state.panY = state.drag.panY + (event.clientY - state.drag.startY);
      syncMapTransform();
    };

    window.onpointerup = function () {
      var shouldClearSelection = state.drag && !state.dragMoved;
      state.drag = null;
      state.dragMoved = false;
      var currentViewport = document.getElementById("mapViewport");
      if (currentViewport) {
        currentViewport.classList.remove("is-dragging");
      }

      if (shouldClearSelection) {
        state.selectedPoiId = null;
        render();
      }
    };

    Array.prototype.forEach.call(document.querySelectorAll("[data-layer-id]"), function (button) {
      button.onclick = function () {
        var layerId = button.getAttribute("data-layer-id");
        state.layers[layerId] = state.layers[layerId] === false;
        var selectedPoi = state.selectedPoiId ? currentPois()[state.selectedPoiId] : null;
        if (selectedPoi && !isPoiVisible(selectedPoi)) {
          state.selectedPoiId = null;
        }
        render();
      };
    });

    Array.prototype.forEach.call(document.querySelectorAll("[data-poi-id]"), function (button) {
      button.onmouseenter = function () {
        setHoveredPoi(button.getAttribute("data-poi-id"));
      };

      button.onmouseleave = function () {
        setHoveredPoi(null);
      };

      button.onfocus = function () {
        setHoveredPoi(button.getAttribute("data-poi-id"));
      };

      button.onblur = function () {
        setHoveredPoi(null);
      };

      button.onclick = function () {
        state.selectedPoiId = button.getAttribute("data-poi-id");
        render();
      };
    });

    Array.prototype.forEach.call(document.querySelectorAll("[data-result-poi-id]"), function (button) {
      button.onclick = function () {
        focusPoi(state.currentMapId, button.getAttribute("data-result-poi-id"));
        state.searchQuery = "";
        render();
      };
    });

    Array.prototype.forEach.call(document.querySelectorAll("[data-breadcrumb-root]"), function (button) {
      button.onclick = function () {
        state.selectedPoiId = null;
        render();
      };
    });

    Array.prototype.forEach.call(document.querySelectorAll("[data-breadcrumb-poi-id]"), function (button) {
      button.onclick = function () {
        state.selectedPoiId = button.getAttribute("data-breadcrumb-poi-id");
        render();
      };
    });

    Array.prototype.forEach.call(document.querySelectorAll("[data-link-map-id][data-link-poi-id]"), function (button) {
      button.onclick = function () {
        focusPoi(button.getAttribute("data-link-map-id"), button.getAttribute("data-link-poi-id"));
      };
    });

    Array.prototype.forEach.call(document.querySelectorAll(".poi-marker-icon"), function (img) {
      img.onerror = function () {
        img.style.display = "none";
        var fallback = img.parentElement.querySelector(".poi-marker-fallback");
        if (fallback) {
          fallback.style.display = "inline";
        }
      };
    });

    window.onkeydown = function (event) {
      var target = event.target;
      var tagName = target && target.tagName ? target.tagName.toLowerCase() : "";
      var isTypingTarget = tagName === "input" || tagName === "textarea" || (target && target.isContentEditable);

      if (isTypingTarget) {
        return;
      }

      if (isHotkeyMatch(event, APP_CONFIG.behavior.hiddenPoiHotkey)) {
        event.preventDefault();
        state.showHidden = !state.showHidden;

        var selectedPoi = state.selectedPoiId ? currentPois()[state.selectedPoiId] : null;
        if (selectedPoi && !isPoiVisible(selectedPoi)) {
          state.selectedPoiId = null;
        }

        render();
        return;
      }

      if (isHotkeyMatch(event, APP_CONFIG.behavior.coordinatesHotkey)) {
        event.preventDefault();
        state.showCoordinates = !state.showCoordinates;
        render();
      }
    };
  }

  resetView();

  var warnings = validateData();
  if (warnings.length) {
    console.warn("Map viewer data warnings:\n" + warnings.join("\n"));
  }

  render();
})();
