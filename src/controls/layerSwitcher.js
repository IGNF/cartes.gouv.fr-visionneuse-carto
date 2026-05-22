import LayerSwitcher from 'geopf-extensions-openlayers/src/packages/Controls/LayerSwitcher/LayerSwitcher.js';

const layerSwitcher = new LayerSwitcher({
  options: {
    collapsed: true,
    panel: true,
    counter: true,
    allowEdit: false,
    allowDelete: false,
    allowTooltips: false,
    label: "Couches",
    advancedTools: [
      {
        key: LayerSwitcher.switcherButtons.INFO,
        label: 'Informations',
      },
      {
        key: LayerSwitcher.switcherButtons.EXTENT,
        label: 'Recenter',
      }]
  }
});

// Set Style
layerSwitcher.container.classList.remove("gpf-mobile-fullscreen")

// Passe le bouton en primary
let switcherBtn = layerSwitcher.container.querySelector("[id^=GPshowLayersListPicto]");
switcherBtn.ariaLabel = "Couches";
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