import ol_ext_element from 'ol-ext/util/element.js';
import {getUid} from 'ol/util';

import './PrintDialog.scss';

function setPrintDlg(carte) {
  const printDlg = carte.getControl('printDlg');
  printDlg.getContentElement().querySelectorAll('.ol-print-param input[type="text"]').forEach(input => {
    input.className = 'fr-input';
  });
  printDlg.getContentElement().querySelectorAll('.ol-print-param select').forEach(input => {
    input.className = 'fr-select';
    const id = input.id || 'printSelect-' + getUid({});
    input.id = id;
    const label = input.previousElementSibling;
    if (label && label.tagName === 'LABEL') {
      label.setAttribute('for', id);
    }
  });
  printDlg.getContentElement().querySelectorAll('.ol-print-param button').forEach(input => {
    input.className = 'GPBtn gpf-btn fr-btn';
  });
  printDlg.getContentElement().querySelector('.ol-orientation').prepend(ol_ext_element.create('span', {
    className: 'fr-mr-1w',
    html: 'Orientation :'
  }));
  // Copy to clipboard
  let copyInfo;
  printDlg.getContentElement().querySelectorAll('.ol-clipboard-copy').forEach(elt => {
    if (/legend/.test(elt.parentNode.className) && !carte.getControl('legend').getMap()) {
      printDlg.getContentElement().dataset.noLegend = '';
    } else {
      elt.parentNode.append(elt);
      elt.innerHTML = `<div class="fr-alert fr-alert--success">
      <p>L'image a été copiée.</p>
      </div>`;
      copyInfo = elt;
    }
  });
  printDlg.getPrintControl().on('print', (e) => {
    if (e.clipboard) {
      copyInfo.classList.add('fr-visible');
      setTimeout(() => {
        copyInfo.classList.remove('fr-visible');
      }, 3000);
    }
  });
  // Dialog shown, focus on first input
  printDlg.on('show', () => {
    setTimeout(() => {
      printDlg.getContentElement().querySelectorAll('.ol-orientation input').forEach(input => {
        if (input.checked) {
          input.focus();
        }
      });
    }, 100);
  });
  //
}

export default setPrintDlg;