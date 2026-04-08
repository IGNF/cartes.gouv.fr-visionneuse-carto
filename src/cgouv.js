/** @file
 * Patch des carte/stormymap depuis MCutils, pour les faire fonctionner avec l'UX GPF.
 * Patch Carte with GPFCarte, and load fonts.
 */

import 'mcutils/cgouv/gpfStyleFn.js'
import Carte from 'mcutils/Carte.js'
import GPFCarte from 'mcutils/cgouv/Carte.js'
import loadFonts from 'mcutils/cgouv/loadFonts.js'
import story from './storymap.js';

import layerSwitcher from './controls/layerSwitcher.js';
import GeoportalZoom from 'geopf-extensions-openlayers/src/packages/Controls/Zoom/GeoportalZoom.js';

import './cgouv.scss'

// Check fonts are loaded
loadFonts(() => {
  [0,1].forEach(k => {
    const carte = story.getCarte(k);
    if (carte) {
      carte.getMap().getLayers().forEach(l => {
        if (l.layerVector_) {
          l.clearCache();
          l.layerVector_.changed();
        }
      });
    }
  });
});

// Patch Carte with GPFCarte
['read'].forEach (k => {
  Carte.prototype[k] = GPFCarte.prototype[k];
})

// Replace controles
story.on('read', () => {
  // remove controls
  [0,1].forEach(k => {
    const carte = story.getCarte(k);
    if (carte) {
      // Remove controls
      ['layerSwitcher', 'searchBar', 'scaleLine', 'searchBar', 'scaleLine'].forEach(ctrl => {
        carte.getMap().removeControl(carte.getControl(ctrl));
      });
      // Add new controls
      carte._controls.layerSwitcher = layerSwitcher;
      carte.getMap().addControl(layerSwitcher);
      const zoom = new GeoportalZoom({ position: 'bottom-right'});
      carte._controls.zoom = zoom;
      carte.getMap().addControl(zoom);
    }
  })
});