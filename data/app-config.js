/**
 * APP_CONFIG defines the application's global startup and UI behavior settings.
 *
 * Complete entry example:
 * {
 *   defaultMapId: "world",
 *   ui: {
 *     showMapSelector: true,
 *     showSearch: true,
 *     showLegend: true,
 *     showBreadcrumbs: true,
 *     showZoomControls: true,
 *     showPoiLabels: true,
 *     alwaysShowLabels: true,
 *     showTags: true
 *   },
 *   behavior: {
 *     resetViewOnMapChange: true,
 *     clampPanToMapBounds: true,
 *     hiddenPoiHotkey: "Ctrl+Shift+H",
 *     coordinatesHotkey: "Ctrl+Shift+C"
 *   },
 *   search: {
 *     caseSensitive: false,
 *     includeDescription: true,
 *     includeTags: true
 *   }
 * }
 *
 * Required attributes:
 * - defaultMapId: string map key that must exist in MAPS.
 * - ui: object containing UI visibility toggles.
 * - behavior: object containing map interaction behavior toggles.
 * - search: object containing search behavior toggles.
 *
 * Optional attributes:
 * - None currently. Add new attributes only after updating app logic to read them.
 */

window.APP_CONFIG = {

  defaultMapId: "calder",

  ui: {
    showMapSelector: true,
    showSearch: true,
    showLegend: true,
    showBreadcrumbs: true,
    showZoomControls: true,
    showPoiLabels: true,
    alwaysShowLabels: true,
    showTags: true
  },

  behavior: {
    resetViewOnMapChange: true,
    clampPanToMapBounds: true,
    hiddenPoiHotkey: "Ctrl+Shift+H",
    coordinatesHotkey: "Ctrl+Shift+C"
  },

  search: {
    caseSensitive: false,
    includeDescription: true,
    includeTags: true
  }
};
