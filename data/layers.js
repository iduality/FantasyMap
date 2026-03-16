/**
 * LAYERS defines the layer registry used by POI types and the layer toggle UI.
 *
 * Complete entry example:
 * kingdoms: {
 *   label: "Kingdoms",
 *   visible: true,
 *   showInLayerList: true
 * }
 *
 * Required attributes:
 * - label: string shown in the layer list and related UI.
 * - visible: boolean default on/off state for the layer.
 *
 * Optional attributes:
 * - showInLayerList: boolean. Defaults to shown unless explicitly set to false.
 */
window.LAYERS = {

  kingdoms: {
    label: "Kingdoms",
    visible: true,
    showInLayerList: true
  },

  settlements: {
    label: "Cities & Towns",
    visible: true,
    showInLayerList: true
  },

  landforms: {
    label: "Land Features",
    visible: true,
    showInLayerList: true
  },

  ruins: {
    label: "Dungeons & Ruins",
    visible: true,
    showInLayerList: true
  }

};
