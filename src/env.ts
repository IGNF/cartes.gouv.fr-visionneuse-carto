export const env = import.meta.env;

const dashboardEnv =
  (typeof window !== "undefined" && window.__DASHBOARD_VISIONNEUSE_ENV) || {};

// Permet la surcharge de l'API au déploiement sans reconstruire l'application.
export const apiURL = dashboardEnv.apiUrl ?? env.API_URL ?? "";