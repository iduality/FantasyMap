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

  world: {

    northern_marches: {
      name: "Northern Marches",
      type: "region",
      x: 1510,
      y: 760,
      summary: "The fortified mountain approach to Ironhold.",
      description: "The Northern Marches describe the defended valleys and lower passes that feed into Ironhold. Stone towers, beacon ridges, and narrow roads make the region strategically vital even before a traveler reaches the capital proper.",
      tags: ["region", "mountains", "fortified", "passes"]
    },

    western_lowlands: {
      name: "Western Lowlands",
      type: "region",
      x: 1225,
      y: 1085,
	  hidden: true,
      summary: "The fertile river plain west of the heights.",
      description: "Broad fields, riverside mills, and crossing roads define the Western Lowlands. The region is less dramatic than the mountain marches, but it is where grain, tolls, and river traffic turn into the kingdom's daily wealth.",
      tags: ["region", "riverlands", "agriculture", "trade"]
    },

    fair_heights: {
      name: "Fair Heights",
      type: "region",
      x: 3065,
      y: 1460,
      summary: "A broad upland of pale rivers and exposed ridges.",
      description: "The Fair Heights are not a single peak but a spread of rolling high ground cut by shining waterways and shallow valleys. In clear weather they can be seen from leagues away, and travelers use them to orient the road south.",
      tags: ["region", "highlands", "rivers", "landmark"]
    },

    ironhold: {
      name: "Ironhold",
      type: "capital",
      parentId: "northern_marches",
      x: 1470,
      y: 820,
      summary: "Mountain capital of Valdris.",
      description: "Ironhold is a fortress-capital hewn into the lower mountain face, with terraces, gates, and smoke-black towers overlooking the valley roads. Court officials, armorers, and caravan brokers give the city a constant, disciplined rhythm.",
      tags: ["capital", "fortress", "mountains", "court"]
    },

    stonewatch: {
      name: "Stonewatch",
      type: "town",
      parentId: "northern_marches",
      x: 1835,
      y: 920,
      summary: "A gate-town at the eastern pass road.",
      description: "Stonewatch keeps a hard eye on the pass road that curls out of the mountains. Mule trains, patrol columns, and customs riders all funnel through its gates before being loosed onto the lower roads.",
      tags: ["town", "pass", "watch", "customs"]
    },

    mattenos: {
      name: "Mattenos",
      type: "city",
      parentId: "western_lowlands",
      x: 1215,
      y: 1180,
      summary: "A river market at the western crossing.",
      description: "Built around a vital crossing and several converging roads, Mattenos serves as Valdris's busiest open market. Barges, drovers, and millers crowd its quays, while teamsters use the city as a staging point before turning inland.",
      tags: ["trade", "river", "market", "crossing"]
    },

    willowford: {
      name: "Willowford",
      type: "town",
      parentId: "western_lowlands",
      x: 1580,
      y: 1320,
      summary: "A smaller ford settlement south of the market roads.",
      description: "Willowford is quieter than Mattenos but no less useful, serving ferrymen, drovers, and grain wagons moving along the lower crossings. Its inns are plain and reliable, which is all most travelers ask of them.",
      tags: ["ford", "town", "river", "grain"]
    },

    zantos_keep: {
      name: "Zanto's Keep",
      type: "town",
      parentId: "fair_heights",
      x: 2490,
      y: 1610,
      summary: "A hill keep guarding the southern road.",
      description: "Zanto's Keep grew around a relay station and old watchtower. It now serves as a disciplined hill town where riders change mounts, patrols resupply, and travelers gather news before pressing farther south.",
      tags: ["garrison", "roads", "relay", "watchtower"]
    },

    klineheart: {
      name: "Klineheart",
      type: "town",
      parentId: "fair_heights",
      x: 2485,
      y: 1720,
      summary: "A quiet settlement below the fair heights.",
      description: "Klineheart sits at the edge of the uplands where the road bends toward the Barrens route. Though smaller than nearby keeps, it is known for stables, traveling masons, and a dependable spring that keeps caravans stopping longer than expected.",
      tags: ["settlement", "roads", "spring", "caravan"]
    },

    emberfall: {
      name: "Emberfall",
      type: "town",
      parentId: "fair_heights",
      x: 2875,
      y: 1695,
      summary: "A windswept town on the eastern approach.",
      description: "Emberfall sits where the high road thins into harsher country. Teamsters stop here to tighten harness, exchange news, and decide whether to push on toward the Barrens or turn back toward safer roads.",
      tags: ["town", "road", "uplands", "caravan"]
    },

    sunken_crypt: {
      name: "The Sunken Crypt",
      type: "ruin",
      parentId: "fair_heights",
      x: 3335,
      y: 1840,
      summary: "A buried ruin swallowed by marsh and silt.",
      description: "Only fractured stone and a sloping stair remain visible above the marshwater. Locals avoid the place after dusk, claiming bells can still be heard beneath the mud when the air is still enough.",
      hidden: true,
      tags: ["ruin", "hidden", "marsh", "crypt"]
    },

    forgotten_temple: {
      name: "Temple of the Forgotten",
      type: "ruin",
      parentId: "fair_heights",
      x: 3070,
      y: 1380,
      summary: "An abandoned shrine in the eastern hills.",
      description: "The temple sits isolated among broken stone and scrub, its surviving columns visible only from the ridgeline above. It is known more through rumor than pilgrimage, and few travelers willingly camp within sight of it.",
      hidden: false,
      tags: ["temple", "hidden", "ruin", "hills"]
    }

  },

  barrens: {

    central_barrens: {
      name: "Central Barrens",
      type: "region",
      x: 1120,
      y: 335,
      summary: "A hard, open tract of caravan roads and dry flats.",
      description: "The Central Barrens are crossed more often than they are settled. Old trails, half-kept wells, and hard horizons define the region, and most travelers learn quickly to trust landmarks more than maps.",
      tags: ["region", "barrens", "roads", "open country"]
    },

    crossroads: {
      name: "Crossroads",
      type: "town",
      parentId: "central_barrens",
      x: 790,
      y: 315,
      summary: "A dusty junction town on the Barrens route.",
      description: "Crossroads is less a planned town than a knot of wells, corrals, sheds, and inns that grew where the road splits across the Barrens. Teamsters, scouts, and wandering traders all leave their mark here before vanishing back into the dust.",
      tags: ["trade", "roads", "junction", "wells"]
    },

    red_mesa: {
      name: "Red Mesa",
      type: "landmark",
      parentId: "central_barrens",
      x: 1180,
      y: 180,
      summary: "A wind-cut escarpment visible across the open plain.",
      description: "Red Mesa rises sharply from the surrounding flats and catches the evening light from leagues away. Travelers use it as a hard visual anchor when the road disappears beneath sand and scrub.",
      tags: ["landmark", "cliffs", "desert", "navigation"]
    },

    ashfall_camp: {
      name: "Ashfall Camp",
      type: "town",
      parentId: "central_barrens",
      x: 1340,
      y: 560,
      summary: "A seasonal camp at the edge of the caravan tracks.",
      description: "Ashfall Camp expands and contracts with the trade season. Canvas streets, cookfires, and repair yards fill the flats when caravans are moving, then thin out again until only a few hard-used sheds remain.",
      tags: ["camp", "caravan", "seasonal", "repairs"]
    },

    salt_hollows: {
      name: "Salt Hollows",
      type: "town",
      parentId: "central_barrens",
      x: 1015,
      y: 600,
      summary: "A low camp clustered around bitter wells.",
      description: "Salt Hollows survives on stubbornness, scavenged timber, and a few unpleasant wells. Its value lies in being exactly where weary travelers need it, not in any comfort it offers.",
      tags: ["town", "wells", "camp", "barrens"]
    },

    buried_gate: {
      name: "The Buried Gate",
      type: "ruin",
      parentId: "central_barrens",
      x: 1620,
      y: 355,
      summary: "A half-exposed stone threshold in the dust.",
      description: "The Buried Gate is little more than a great worked arch emerging from the earth at an angle. Sand gathers around it no matter the season, and no one agrees what stood here before the Barrens swallowed it.",
      hidden: true,
      tags: ["ruin", "hidden", "gate", "buried"]
    },

    shattered_obelisk: {
      name: "Shattered Obelisk",
      type: "ruin",
      parentId: "central_barrens",
      x: 1485,
      y: 210,
      summary: "A broken monument jutting from the flats.",
      description: "The obelisk split long ago, but even its fragments cast long shadows over the flats. Prospectors camp nearby from time to time, convinced there is more stone hidden under the dust.",
      hidden: true,
      tags: ["ruin", "hidden", "obelisk", "monument"]
    }

  }

};
