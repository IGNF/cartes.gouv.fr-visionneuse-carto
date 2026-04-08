/** @file
 * Patch des carte/stormymap depuis MCutils, pour les faire fonctionner avec l'UX GPF.
 * Patch Carte with GPFCarte, and load fonts.
 */

import 'mcutils/cgouv/gpfStyleFn.js'
import Carte from 'mcutils/Carte.js'
import GPFCarte from 'mcutils/cgouv/Carte.js'
import loadFonts from 'mcutils/cgouv/loadFonts.js'
import story from './storymap.js';

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

