import { setRemoteDefinitions } from '@nrwl/angular/mf';

//== comment out below line while running in http://localhost:4200 ==

fetch('/assets/module-federation.manifest.json')
//fetch('https://bergerpaintsbd.sharepoint.com/sites/BergerTech/Style Library/bergertechportal/PortalHome/V1/assets/module-federation.manifest.json')
  .then((res) => res.json())
  .then((definitions) => setRemoteDefinitions(definitions))
  .then(() => import('./bootstrap').catch((err) => console.error(err)));
