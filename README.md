events-pan
==========

Adds `Events.Pan` event touch pan handler

Usage:

```js
  // Instanciate
  var e = new Events.Pan(element, options);

  // Listen to events
  e.on('start', function(evt) {});
  e.on('move', function(evt) {});
  e.on('end', function(evt) {});

  // Clean up
  e.destroy();
```

Event object:
```js
  {
    delta: {
      time: 0,
      x: 0,
      y: 0
    },
    position: {
      x: 0,
      y: 0
    },
    velocity: {
      x: 0,
      y: 0
    }
    time: 0,
    releaseTime: 0 // only at end event
  }
```

### Options
The options are good defaults, use with care.
```js
{
  historyLength: 20,  // Event history length
  minimumTime: 8,     // Time diff will never be 0 - may not be 0
  passthrough: false  // By default we preventDefault event behaviour
}
```