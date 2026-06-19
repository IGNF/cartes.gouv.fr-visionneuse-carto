import config from 'mcutils/config/config.js'
import StoryMap from 'mcutils/StoryMap.js'
import { getUrlParameter } from 'mcutils/control/url.js'

import GeoportalZoom from 'geopf-extensions-openlayers/src/packages/Controls/Zoom/GeoportalZoom.js';
import layerSwitcher from './controls/layerSwitcher.js';
import searchEngine from './controls/searchEngine.js';
// import setPrintDlg from './controls/setPrintDlg.js';
import fullScreenBar from './controls/fullScreen.js';
import { fullScreen } from './controls/fullScreen.js';
import ScaleLine from 'ol/control/ScaleLine.js';
import Beta from './controls/Beta.js';
import api from 'mcutils/api/api.js'
// import fileBar from './controls/fileBar.js';
import Carte from 'mcutils/Carte.js'
import GPFCarte from 'mcutils/cgouv/Carte.js'
import { setLogo, setTitle } from './utils/story.js';
import openTitle, { addCloseButtonTitle } from './utils/openTitle.js';

// Patch Carte with GPFCarte
['read'].forEach(k => {
  Carte.prototype[k] = GPFCarte.prototype[k];
})

// Get parameters
const params = {
  mapID: getUrlParameter('map'),
  file: getUrlParameter('file')
}
if (!params.file && !params.mapID) {
  // Try to get ID in the url path: path/ID/TITLE
  const path = document.location.pathname.split('/');
  params.mapID = path[path.length - 2];
}

// The storymap
const story = new StoryMap({
  // fullscreen: false,
  target: (params.mapID || params.file) ? document.querySelector('[data-role="storymap"]') : null,
});

/**
 * Charge une carte dans la storymap
 * @param {StoryMap} story Storymap sur laquelle écrire
 * @param {Object} params paramètre
 * @returns 
 */
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
    console.log(e)
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
  [0, 1].forEach(k => {
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
      const zoom = new GeoportalZoom({ position: 'bottom-right' });
      carte._controls.zoom = zoom;
      carte.getMap().addControl(zoom);
      // Add search engine
      carte._controls.searchBar = searchEngine;
      carte.getMap().addControl(searchEngine);
      carte.getControl('title').setTitle(story.getTitle() || 'Titre');

      // TODO : Gestion de fichier 
      // carte.getMap().addControl(fileBar);
      // fileBar.element.querySelectorAll('[data-attr="mapTitle"]').forEach(elt => {
      //   elt.innerText = story.getTitle() || 'Carte sans titre';
      //   elt.title = story.getTitle() || 'Carte sans titre';
      // })
      // TODO : Impression
      // fileBar.element.querySelector('[data-action="print-map"]')?.addEventListener('click', () => {
      //   carte.getControl('printDlg').print();
      // });
      // setPrintDlg(carte);

      // Add control
      carte.getMap().addControl(new Beta);

      // Mode plein écran
      carte.getMap().addControl(fullScreen);
      carte.getMap().addControl(fullScreenBar);
      fullScreenBar.setPosition("bottom-right")

      // Scale line
      carte._controls.scaleLine = new ScaleLine();
      carte.getMap().addControl(carte._controls.scaleLine);


      // Ajoute les options de la storymap dans la storymap après lecture de la carte
      const storyParam = carte.get("story");
      console.log(storyParam, k)
      if (storyParam && k === 0) {
        Object.entries(storyParam).forEach(([key, value]) => {
          story.set(key, value)
        })
      }

      // Modifie le DOM de la storymap pour afficher le titre / sous-titre
      if (story.get("title") || story.get("subTitle")) {
        setTitle(story, { title: story.get("title"), subTitle: story.get("subTitle") })
      }

      // N'affiche pas le logo  s'il n'y en a pas
      story.target.dataset.logo = story.get("logo") ? "" : "none";
      setLogo(story, story.get("logo"));

      // Affiche le titre s'il y'en a un
      story.get("showTitle") ? story.showTitle(true) : story.showTitle(false);

      // Ajoute un écouteur d'événement sur le titre
      const btnCloseAdded = addCloseButtonTitle(story);
      if (btnCloseAdded) {
        story.element.titleDiv.addEventListener("click", () => openTitle(story))
      }
    }
  })


  /** @type {import('mcutils/cgouv/Carte.js').default} */
  const carte = story.getCarte();
  carte.getMap().getLayers().forEach(layer => {
    const info = layerSwitcher.getLayerInfo(layer);

    const opacity = layer.getOpacity();
    const visibility = layer.getVisible();
    const grayscale = layer.get("grayscale");
    const locked = layer.get("locked");
    const layerOptions = {
      layer: layer,
      name: layer.name, // only geoportal layers
      service: layer.service, // only geoportal layers
      opacity: opacity != null ? opacity : 1,
      visibility: visibility != null ? visibility : true,
      grayscale: grayscale,
      locked: locked,
      producer: info._producer || null,
      thumbnail: info._thumbnail || null,
      title: info._title,
      description: info._description || null,
      legends: info._legends || [],
      metadata: info._metadata || [],
      quicklookUrl: info._quicklookUrl || null
    };
    console.log(layerOptions)
  })
});

window.api = api;

export default story;