/**
 * MAPS defines each map image, its coordinate space, and its zoom behavior.
 *
 * Complete entry example:
 * world: {
 *   label: "Kingdom of Valdris",
 *   image: "assets/maps/world.jpg",
 *   width: 4627,
 *   height: 2315,
 *   defaultView: {
 *     zoom: 0.62,
 *     panX: -520,
 *     panY: -210
 *   },
 *   zoom: {
 *     min: 0.35,
 *     max: 4,
 *     step: 0.1
 *   },
 *   detailZoomThresholds: [0.9, 1.45]
 * }
 *
 * Required attributes:
 * - label: string map name shown in the selector and UI.
 * - image: string path to the map image asset.
 * - width: number pixel width of the source image.
 * - height: number pixel height of the source image.
 * - defaultView.zoom: number initial zoom used when this map is opened.
 * - defaultView.panX: number initial horizontal offset in map pixels after zoom.
 * - defaultView.panY: number initial vertical offset in map pixels after zoom.
 * - zoom.min: number lowest zoom the user can reach on this map.
 * - zoom.max: number highest zoom the user can reach on this map.
 * - zoom.step: number amount added or removed per zoom interaction.
 *
 * Optional attributes:
 * - detailZoomThresholds: number[] sorted low-to-high zoom breakpoints that unlock POI
 *   types with higher detail levels. The first value reveals detail level 1, the second
 *   reveals detail level 2, and so on.
 *
 * Notes for calculated values:
 * - defaultView.zoom/panX/panY are easiest to find by opening the map, adjusting to the
 *   desired starting composition, then copying the live view values from the app state or
 *   browser console.
 * - detailZoomThresholds should match the zoom levels where you want extra POI detail to
 *   appear. In this app, a POI type with detailLevel 1 appears at the first threshold,
 *   detailLevel 2 at the second threshold, and so on.
 */
window.MAPS = {

  world: {
    label: "Kingdom of Valdris",
    image: "assets/maps/world.jpg",
    width: 4627,
    height: 2315,

    defaultView: {
      zoom: 0.62,
      panX: -520,
      panY: -210
    },

    zoom: {
      min: 0.35,
      max: 4,
      step: 0.1
    },

    detailZoomThresholds: [0.9, 1.45]
  },

  barrens: {
    label: "The Barrens",
    image: "assets/maps/barrens.jpg",
    width: 2000,
    height: 813,

    defaultView: {
      zoom: 0.72,
      panX: -180,
      panY: -48
    },

    zoom: {
      min: 0.4,
      max: 5,
      step: 0.1
    },

    detailZoomThresholds: [0.95, 1.5]
  },

  calder: {
    label: "Calder",
    image: "assets/maps/calder.png",
    width: 5000,
    height: 5000,

    defaultView: {
      zoom: 1,
      panX: 0,
      panY: 0
    },

    zoom: {
      min: 0.4,
      max: 5,
      step: 0.1
    },

    detailZoomThresholds: [0.95, 1.5]
  }

};
