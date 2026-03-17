/**
 * POIS defines the point-of-interest catalog for each map using that map image's pixel
 * coordinate system.
 *
 * Complete entry example:
 * world: {
 *   ironhold: {
 *     name: "Ironhold",
 *     type: "capital",
 *     parentId: "northern_marches",
 *     x: 1470,
 *     y: 820,
 *     summary: "Mountain capital of Valdris.",
 *     description: "Ironhold is a fortress-capital hewn into the lower mountain face...",
 *     hidden: false,
 *     tags: ["capital", "fortress", "mountains", "court"]
 *   }
 * }
 *
 * Required attributes:
 * - name: string display name shown on the map and in detail views.
 * - type: string POI type key that must exist in POI_TYPES.
 * - x: number horizontal position in source image pixels.
 * - y: number vertical position in source image pixels.
 * - summary: string short description shown in compact UI contexts.
 * - description: string full description shown in the POI detail panel.
 * - tags: string[] search/category terms.
 *
 * Optional attributes:
 * - parentId: string key of another POI on the same map, used for hierarchy/breadcrumbs.
 * - hidden: boolean. Set to true to hide the POI until "Hidden POIs" is enabled.
 *
 * Notes for calculated values:
 * - x and y are easiest to find by clicking or measuring directly on the source map image in
 *   an editor, then using those pixel coordinates here.
 * - parentId is optional, but when used it should point to a broader location such as a region
 *   so the POI can appear in the correct hierarchy.
 */

window.POIS = {

  calder: {
   
    marsh_castle: {
      name: "March Castle",
      type: "city",
      parentId: "calder",
      x: 457,
      y: 532,
      summary: "Sample Summary",
      description: "Sample description.",
      hidden: false,
      tags: []
    },

    squalls_end: {
      name: "Squall's End",
      type: "city",
      parentId: "calder",
      x: 401,
      y: 1064,
      summary: "Sample Summary",
      description: "Sample description.",
      hidden: false,
      tags: []
    },

    kirekwall: {
      name: "Kirekwall",
      type: "city",
      parentId: "calder",
      x: 1043,
      y: 867,
      summary: "Sample Summary",
      description: "Sample description.",
      hidden: false,
      tags: ["farming", "peaceful", "impending doom"]
    },

    mattenos: {
      name: "Mattenos",
      type: "city",
      parentId: "calder",
      x: 1242,
      y: 1355,
      summary: "Sample Summary",
      description: "Sample description.",
      hidden: false,
      tags: []
    },

    kield: {
      name: "Kield",
      type: "city",
      parentId: "calder",
      x: 1145,
      y: 2017,
      summary: "Sample Summary",
      description: "Sample description.",
      hidden: false,
      tags: []
    },

    rishada: {
      name: "Rishada",
      type: "city",
      parentId: "calder",
      x: 1145,
      y: 2077,
      summary: "Sample Summary",
      description: "Sample description.",
      hidden: false,
      tags: []
    },
	
    low_tower: {
      name: "Low Tower",
      type: "city",
      parentId: "calder",
      x: 1435,
      y: 596,
      summary: "Sample Summary",
      description: "Sample description.",
      hidden: false,
      tags: []
    },	
	
    rockytopp_fortress: {
      name: "Rockytopp Fortress",
      type: "ruin",
      parentId: "calder",
      x: 2328,
      y: 867,
      summary: "Sample Summary",
      description: "Sample description.",
      hidden: false,
      tags: []
    },	
    
    volsgo: {
      name: "Volsgo",
      type: "city",
      parentId: "calder",
      x: 2673,
      y: 728,
      summary: "Sample Summary",
      description: "Sample description.",
      hidden: false,
      tags: []
    },		
	
    tilshire: {
      name: "Tilshire",
      type: "city",
      parentId: "calder",
      x: 2968,
      y: 292,
      summary: "Sample Summary",
      description: "Sample description.",
      hidden: false,
      tags: []
    },		
	
    arkala: {
      name: "Arkala",
      type: "city",
      parentId: "calder",
      x: 3560,
      y: 457,
      summary: "Sample Summary",
      description: "Sample description.",
      hidden: false,
      tags: []
    },		
	
    ark_forgress: {
      name: "Ark Fortress",
      type: "city",
      parentId: "calder",
      x: 3612,
      y: 428,
      summary: "Sample Summary",
      description: "Sample description.",
      hidden: false,
      tags: []
    },		
	
   calmarnock: {
      name: "Carlmarnock",
      type: "city",
      parentId: "calder",
      x: 3313,
      y: 705,
      summary: "Sample Summary",
      description: "Sample description.",
      hidden: false,
      tags: []
    },		
	
    hurtlepool: {
      name: "Hurtlepool",
      type: "city",
      parentId: "calder",
      x: 3856,
      y: 735,
      summary: "Sample Summary",
      description: "Sample description.",
      hidden: false,
      tags: []
    },		
	
    caldwell: {
      name: "Caldwell",
      type: "capital",
      parentId: "calder",
      x: 2529,
      y: 2402,
      summary: "Sample Summary",
      description: "Sample description.",
      hidden: false,
      tags: []
    },	

    heart_lake: {
      name: "Heart Lake",
      type: "region",
      parentId: "calder",
      x: 2874,
      y: 1896,
      summary: "Sample Summary",
      description: "Sample description.",
      hidden: false,
      tags: []
    },		

    drowning_mans_dungeon: {
      name: "Drowning Man's Dungeon",
      type: "ruin",
      parentId: "heart_lake",
      x: 2965,
      y: 1938,
      summary: "Sample Summary",
      description: "Sample description.",
      hidden: false,
      tags: []
    },			
	
    the_citadel: {
      name: "The Citadel",
      type: "ruin",
      parentId: "calder",
      x: 2724,
      y: 2020,
      summary: "Sample Summary",
      description: "Sample description.",
      hidden: false,
      tags: []
    },		
	
    victorheart: {
      name: "Victorheart",
      type: "town",
      parentId: "calder",
      x: 2770,
      y: 2046,
      summary: "Sample Summary",
      description: "Sample description.",
      hidden: false,
      tags: []
    },			
	
  }
};

