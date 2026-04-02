import config from 'mcutils/config/config.js'
import StoryMap from 'mcutils/Storymap.js'
import { getUrlParameter, hasUrlParameter } from 'mcutils/control/url.js'

import api from 'mcutils/api/api.js'

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

export default story;