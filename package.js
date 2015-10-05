Package.describe({
  name: 'dispatch:events-pan',
  version: '0.0.3',
  summary: 'Touch event listener and pan event emitter',
  git: 'https://github.com/DispatchMe/meteor-events-pan.git'

});

Package.onUse(function (api) {
  api.versionsFrom('1.2');

  api.use([
    // core
    'underscore',

    // atmosphere
    'raix:eventemitter@0.1.1' // XXX: Use jQuery event handling
  ], 'web');

  api.addFiles([
    'pan-event.js'
  ], 'web');

  api.export('Events');
});
