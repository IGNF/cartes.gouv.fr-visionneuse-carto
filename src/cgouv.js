/** @file
 * Patch des carte/stormymap depuis MCutils, pour les faire fonctionner avec l'UX GPF.
 * Patch Carte with GPFCarte, and load fonts.
 */

import 'mcutils/cgouv/gpfStyleFn.js'
import loadFonts from 'mcutils/cgouv/loadFonts.js'
import story from './storymap.js';
import "./mcutils/Feature.js";

// Check fonts are loaded
loadFonts(() => {
  [0, 1].forEach(k => {
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
