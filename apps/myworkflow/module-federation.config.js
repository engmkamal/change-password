module.exports = {
  name: 'myworkflow',
  exposes: {
    './Module': 'apps/myworkflow/src/app/remote-entry/entry.module.ts',
  },
};
