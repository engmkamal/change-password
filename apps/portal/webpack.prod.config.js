const { withModuleFederation } = require('@nrwl/angular/module-federation');
const config = require('./module-federation.config');
module.exports = withModuleFederation({
  ...config,
  remotes: [
    /*
    ['login', 'https://bergerpaintsbd.sharepoint.com/sites/BergerTech/Style Library/bergertechportal/dist/apps/login'],
    ['support', 'https://bergerpaintsbd.sharepoint.com/sites/BergerTech/Style Library/bergertechportal/dist/apps/support'],
    ['pendingtasks', 'https://bergerpaintsbd.sharepoint.com/sites/BergerTech/Style Library/bergertechportal/dist/apps/pendingtasks']
    */
   ]
   
  /*
   * Remote overrides for production.
   * Each entry is a pair of an unique name and the URL where it is deployed.
   *
   * e.g.
   * remotes: [
   *   ['app1', 'https://app1.example.com'],
   *   ['app2', 'https://app2.example.com'],
   * ]
   */
});
