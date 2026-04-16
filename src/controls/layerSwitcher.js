import LayerSwitcher from 'geopf-extensions-openlayers/src/packages/Controls/LayerSwitcher/LayerSwitcher.js';
import Modal from '../controls/Modal/Modal.js';
import Action from '../actions/Action.js';
import md2html from 'mcutils/md/md2html.js';

const modalInfo = new Modal({
  id: 'modal-layer-info',
  title: 'Informations sur la couche',
  size: 'sm',
});

const layerInfoAction = new Action({
  id: 'layer-info',
  title: 'Informations sur la couche',
  content: 'content',
  buttons: [
    {
      label: "OK",
      kind: 0,
      close: true,
    }
  ],
});

const layerSwitcher = new LayerSwitcher({
  options: {
    tipLabel: 'Couches', // Optional label for button
    groupSelectStyle: 'group', // Can be 'children' [default], 'group' or 'none'
    collapsed: true,
    panel: true,
    counter: false,
    allowEdit: false,
    allowDelete: false,
    allowTooltips: true,
    advancedTools: [{
      label: 'Infos', 
      className: 'fr-icon-information-line',
      cb: (e, switcher, layer) => { 
        const title = layer.get('title') || layer.get('name') || '';
        const info = layer.get('desc') || '*Aucune description disponible*';
        layerInfoAction.title = title;
        layerInfoAction.content = md2html(info);
        Action.open(modalInfo, 'layer-info');
      },
    }, {
      key: LayerSwitcher.switcherButtons.EXTENT,
      label: 'Recenter',
    }]
  }
});

// Set Style
layerSwitcher.container.classList.add('ol-right');
const switcherBtn = layerSwitcher.container.querySelector("[id^=GPshowLayersListPicto]");
switcherBtn.classList.remove('fr-btn--tertiary', 'gpf-btn--tertiary');
switcherBtn.classList.add('gpf-btn--primary');

// Extent
layerSwitcher.on("layerswitcher:extent", e => {
  const source = e.layer.layer.getSource();
  if (source.getExtent) {
    const extent = source.getExtent();
    if (extent) {
      layerSwitcher.getMap().getView().fit(extent);
      const zoom = layerSwitcher.getMap().getView().getZoom();
      if (zoom > 18) {
        layerSwitcher.getMap().getView().setZoom(18);
      } else {
        layerSwitcher.getMap().getView().setZoom(zoom - 0.5);
      }
    }
  }
});

export default layerSwitcher;