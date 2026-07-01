// Connecte aux services géoportail
import config from "mcutils/config/config.js";
import Gp from "geoportal-access-lib/dist/GpServices-src.js"
Gp.Services.getConfig({
  customConfigFile: config.customConfigFile,
  timeOut: 20000,
  onSuccess: (e) => console.log(e),
  onFailure: (e) => {
    console.error(e);
  }
});