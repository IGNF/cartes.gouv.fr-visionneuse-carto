import Button from 'ol-ext/control/Button.js';
import Bar from 'ol-ext/control/Bar.js';
import Toggle from 'ol-ext/control/Toggle.js';
import TextButton from 'ol-ext/control/TextButton.js';

import './fileBar.scss'


// Titre de la carte
const mapTitle = new TextButton({
  html: 'Carte sans titre',
  attributes: {
    title: 'Carte sans titre',
    'data-attr': 'mapTitle'
  },
  className: 'fr-px-2w fr-py-1w fr-text map-title'
});

const buttons = [
  new Button({
    classButton: 'map-item fr-icon-send-plane-line fr-link--icon-left',
    attributes: {
      'data-action': 'share-map',
      type: 'button',
      // 'aria-controls': modal.getId(),
      'data-fr-opened': 'false'
    },
    html: 'Partager',
    // handleClick: Action.open,
  }),
  new Button({
    classButton: 'map-item fr-icon-download-line fr-link--icon-left',
    attributes: {
      'data-action': 'export-map',
      type: 'button'
    },
    html: 'Exporter',
    // handleClick: exportMap,
  }), new Button({
    classButton: 'map-item fr-icon-printer-line fr-link--icon-left',
    attributes: {
      'data-action': 'print-map',
      type: 'button'
    },
    html: 'Imprimer',
    /*
    handleClick: () => {
      carte.getControl('printDlg').print();
    },
    */
  })
];

const bar1 = new Bar({
  className: 'ol-bar--column',
  controls: buttons
});

const mainBar = new Bar({
  className: 'ol-bar--separator ol-bar--column fr-p-2w map-file-actions',
  controls: [mapTitle, bar1]
});

let fileToggle = new Toggle({
  classButton: 'fr-btn fr-btn--tertiary-no-outline fr-icon-ign-add-data',
  attributes: {
    title: 'Gestion ma carte',
    'aria-label': 'Gestion ma carte',
  },
  bar: mainBar
});

const mapTitleBar = new TextButton({
  html: 'Carte sans titre',
  attributes: {
    title: 'Carte sans titre',
    'data-attr': 'mapTitle'
  },
  className: 'fr-px-2w fr-py-1w fr-text map-title map-title-bar'
});

// Barre principale
let filebar = new Bar({
  className: 'ol-bar--separator ol-bar--row map-handle',
  controls: [fileToggle, mapTitleBar]
});

export default filebar;
