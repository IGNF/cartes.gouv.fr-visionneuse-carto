import config from 'mcutils/config/config.js'
import StoryMap from 'mcutils/Storymap.js'
import { getUrlParameter } from 'mcutils/control/url.js'

import GeoportalZoom from 'geopf-extensions-openlayers/src/packages/Controls/Zoom/GeoportalZoom.js';
import layerSwitcher from './controls/layerSwitcher.js';
import searchEngine from './controls/searchEngine.js';
import setPrintDlg from './controls/setPrintDlg.js';
import fileBar from './controls/fileBar.js';
import api from 'mcutils/api/api.js'

import './storymap.scss'

// Get parameters
const params = {
  mapID: getUrlParameter('map'),
  file: getUrlParameter('file')
}
if (!params.file && !params.mapID) {
  // Try to get ID in the url path: path/ID/TITLE
  const path = document.location.pathname.split('/');
  params.mapID = path[path.length-2];
}

// The storymap
const story = new StoryMap({
  fullscreen: true,
  target: (params.mapID || params.file) ? document.querySelector('[data-role="storymap"]') : null,
});

function loadMap(story, params) {
  if (!params.mapID) return false;

  // Get the map
  api.getMap(params.mapID, (e) => {
    if (e.error) {
      e.type = 'error';
      story.dispatchEvent(e)
      return;
    }
    if (e.premium === 'edugeo') story.set('key', config.edugeoKey)
    if (!e.active) document.body.dataset.active = 0;
    if (!e.valid) document.body.dataset.valid = 0;
    // Load story
    story.load(e)
  })
  // OK
  return true;
}

if (!loadMap(story, params)) {
  alert('Aucun ID de carte trouvé dans les paramètres de l\'URL. Veuillez ajouter "?map=ID" à l\'adresse de la page.');
};

// Replace controls
story.on('read', () => {
  // remove controls
  [0,1].forEach(k => {
    const carte = story.getCarte(k);
    if (carte) {
      // Remove controls
      ['layerSwitcher', 'searchBar', 'scaleLine', 'searchBar', 'scaleLine'].forEach(ctrl => {
        carte.getMap().removeControl(carte.getControl(ctrl));
      });
      // Add layerSwitcher
      carte._controls.layerSwitcher = layerSwitcher;
      carte.getMap().addControl(layerSwitcher);
      // Add Zoom
      const zoom = new GeoportalZoom({ position: 'bottom-right'});
      carte._controls.zoom = zoom;
      carte.getMap().addControl(zoom);
      // Add search engine
      carte._controls.searchBar = searchEngine;
      carte.getMap().addControl(searchEngine);
      // Add filebar
      carte.getMap().addControl(fileBar);
      fileBar.element.querySelectorAll('[data-attr="mapTitle"]').forEach(elt => {
        elt.innerText = story.getTitle() || 'Carte sans titre';
        elt.title = story.getTitle() || 'Carte sans titre';
      })
      story.getCarte().getControl('title').setTitle(story.getTitle() || 'Titre');
      // Print
      fileBar.element.querySelector('[data-action="print-map"]').addEventListener('click', () => {
        carte.getControl('printDlg').print();
      });
      setPrintDlg(carte);
    }
  })
});

export default story;