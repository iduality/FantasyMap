/**
 * POI_LINKS defines named routes or collections that connect POIs across one or more maps.
 *
 * Complete entry example:
 * barrens_route: {
 *   label: "Southern Trade Route",
 *   entries: [
 *     { mapId: "world", poiId: "zantos_keep" },
 *     { mapId: "world", poiId: "klineheart" },
 *     { mapId: "barrens", poiId: "crossroads" }
 *   ]
 * }
 *
 * Required attributes:
 * - label: string display name for the route or linked collection.
 * - entries: array of POI references in display/travel order.
 * - entries[].mapId: string map key that must exist in MAPS and POIS.
 * - entries[].poiId: string POI key that must exist inside the referenced map's POIS list.
 *
 * Optional attributes:
 * - None currently. Add new attributes only after updating app logic to read them.
 */
window.POI_LINKS = {

};
