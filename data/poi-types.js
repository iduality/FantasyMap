/**
 * POI_TYPES defines the visual style and reveal rules for each POI category.
 *
 * Complete entry example:
 * capital: {
 *   label: "Capital",
 *   iconImg: "assets/icons/capital.svg",
 *   color: "#67a8ff",
 *   layer: "settlements",
 *   markerSize: 28,
 *   showInLegend: true,
 *   detailLevel: 0
 * }
 *
 * Required attributes:
 * - label: string display name shown in the legend and detail panel.
 * - iconImg: string path to the icon asset used for the marker.
 * - color: string CSS color used for marker tint and legend styling.
 * - layer: string layer key that must exist in LAYERS.
 *
 * Optional attributes:
 * - markerSize: number marker size in pixels. Defaults to 22 if omitted.
 * - showInLegend: boolean. Defaults to shown unless app logic is changed to hide it.
 * - detailLevel: number reveal tier for this POI type. Defaults to 0 if omitted.
 *
 * Notes for calculated values:
 * - detailLevel works together with MAPS[mapId].detailZoomThresholds. Use 0 for POI types
 *   that should always be visible, 1 for types that appear at the first threshold, 2 for
 *   types that appear at the second threshold, and so on.
 * - markerSize is best tuned visually by comparing icon readability at the map's common zoom
 *   levels and adjusting until the marker feels balanced against nearby labels.
 */
window.POI_TYPES = {

  capital: {
    label: "Capital",
    iconImg: "assets/icons/capital.svg",
    color: "#67a8ff",
    layer: "settlements",
    markerSize: 28,
    showInLegend: true,
    detailLevel: 0
  },

  city: {
    label: "City",
    iconImg: "assets/icons/city.svg",
    color: "#67a8ff",
    layer: "settlements",
    markerSize: 24,
    showInLegend: true,
    detailLevel: 0
  },

  town: {
    label: "Town",
    iconImg: "assets/icons/town.svg",
    color: "#67a8ff",
    layer: "settlements",
    markerSize: 20,
    showInLegend: true,
    detailLevel: 1
  },

  landmark: {
    label: "Landmark",
    iconImg: "assets/icons/landmark.svg",
    color: "#45d1b0",
    layer: "landforms",
    markerSize: 22,
    showInLegend: true,
    detailLevel: 1
  },

  region: {
    label: "Region",
    iconImg: "assets/icons/region.svg",
    color: "#45d1b0",
    layer: "landforms",
    markerSize: 24,
    showInLegend: true,
    detailLevel: 0
  },

  ruin: {
    label: "Ruin",
    iconImg: "assets/icons/ruin.svg",
    color: "#ee6b63",
    layer: "ruins",
    markerSize: 20,
    showInLegend: true,
    detailLevel: 2
  }

};
