import LayerSwitcher from 'geopf-extensions-openlayers/src/packages/Controls/LayerSwitcher/LayerSwitcher.js';
import md2html from 'mcutils/md/md2html';

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
      cb: (e, switcher, layer, options) => { 
        const info = layer.get('desc') || '*Aucune description disponible*';
        console.log(layer.get('title') || layer.get('name'));
        console.log(md2html(info)) 
      },
    }, {
      key: LayerSwitcher.switcherButtons.EXTENT,
      label: 'Recenter',
    }]
  }
});

// Set Style
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