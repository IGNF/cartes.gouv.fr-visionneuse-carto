import SearchEngine from 'geopf-extensions-openlayers/src/packages/Controls/SearchEngine/SearchEngineAdvanced.js';
import InseeAdvancedSearch from "geopf-extensions-openlayers/src/packages/Controls/SearchEngine/InseeAdvancedSearch.js";
import LocationAdvancedSearch from "geopf-extensions-openlayers/src/packages/Controls/SearchEngine/LocationAdvancedSearch.js";
import CoordinateAdvancedSearch from "geopf-extensions-openlayers/src/packages/Controls/SearchEngine/CoordinateAdvancedSearch.js";
import ParcelAdvancedSearch from "geopf-extensions-openlayers/src/packages/Controls/SearchEngine/ParcelAdvancedSearch.js";

const insee = new InseeAdvancedSearch({
})

const location = new LocationAdvancedSearch({
})

const coordinates = new CoordinateAdvancedSearch({
})

const parcel = new ParcelAdvancedSearch()

/** Search Engine control
 */
const searchEngine = new SearchEngine({
  collapsed: false,
  collapsible: false,
  advancedSearch: [insee, location, coordinates, parcel],
  returnTrueGeometry: true,
  placeholder: "Rechercher",
});

export default searchEngine;