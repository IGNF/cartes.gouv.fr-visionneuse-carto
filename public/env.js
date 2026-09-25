// Ce fichier est remplacé à partir des variables d'environnement au démarrage du conteneur.
(() => {
  window.__DASHBOARD_VISIONNEUSE_ENV = {
    apiUrl: undefined,
  };
  Object.freeze(window.__DASHBOARD_VISIONNEUSE_ENV);
  Object.defineProperty(window, "__DASHBOARD_VISIONNEUSE_ENV", {
    configurable: false,
    writable: false,
  });
})();