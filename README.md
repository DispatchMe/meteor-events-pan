events-pan
==========

Adds `Events.Pan` event touch pan handler

Usage:

```js
  // Instanciate
  var e = new Events.Pan(element);

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
      time: 0,
      x: 0,
      y: 0
    }
  }
```