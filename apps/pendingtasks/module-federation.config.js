module.exports = {
  name: 'pendingtasks',
  exposes: {
    './Module': 'apps/pendingtasks/src/app/remote-entry/entry.module.ts',
  },
  devServer: {
    allowedHosts: [
      'http://localhost:4211',
      'https://www.bergertechbd.com',
      'https://bergerpaintsbd.sharepoint.com/sites/BergerTech'
    ],
  },
};
