interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  readonly API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface DashboardVisionneuseEnv {
  readonly apiUrl?: string;
}

interface Window {
  readonly __DASHBOARD_VISIONNEUSE_ENV?: DashboardVisionneuseEnv;
}