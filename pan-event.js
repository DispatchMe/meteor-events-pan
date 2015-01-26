if (typeof Events === 'undefined')
  Events = {};

Events.Pan = function(container) {
  var self = this;

  // Make sure we return an instance
  if (!(self instanceof Events.Pan))
    return new Events.Pan(container);

  // Initialize our internal event handler
  // XXX: Use jquery eventhandling
  var _eventEmitter = new EventEmitter();

  // Keep track of time
  var currentTime = +new Date();

  // Initialize velocity
  var velocity = { time: currentTime, x: 0, y: 0 };

  // Keep track of last coordinates
  var last = {
    x: 0,
    y: 0
  };

  // Keep track of delta
  var delta = {
    time: 0,
    x: 0,
    y: 0
  };

  // Touch start handle
  var touchStart = function(evt) {
    evt.preventDefault();

    // Get current touch
    var touch = evt.targetTouches[0];

    // Reset last coordinates
    last = {
      x: touch.pageX,
      y: touch.pageY
    };

    // Keep track of delta
    delta = {
      time: 0,
      x: 0,
      y: 0
    };

    // Keep track of time
    currentTime = +new Date();

    // Reset velocity
    velocity = { time: currentTime, x: 0, y: 0 };

    _eventEmitter.emit('start', {
      delta: delta,
      position: last,
      velocity: velocity
    });
  };


  var touchMove = function(evt) {
    evt.preventDefault();
    // Get touch
    var touch = evt.targetTouches[0];

    // Update current time
    currentTime = +new Date();

    // Calc deltas
    delta = {
      x: touch.pageX - last.x,
      y: touch.pageY - last.y,
      time: currentTime - velocity.time
    };

    // XXX: Calculate velocity vector pixel / ms
    velocity.time = currentTime;

    // Calculate velocity and flatten out a short average
    if (delta.time) {
      velocity.x = ((delta.x / delta.time)/10 + (velocity.x * 1)) / 2;
      velocity.y = ((delta.y / delta.time)/10 + (velocity.y * 1)) / 2;
    }

    // Save this touch
    last.x = touch.pageX;
    last.y = touch.pageY;

    // Emit move event
    _eventEmitter.emit('move', {
      delta: delta,
      position: last,
      velocity: velocity
    });
  };


  var touchEnd = function(evt) {
    evt.preventDefault();

    // Get touch
    var touch = evt.targetTouches[0];

    // Update current time
    currentTime = +new Date();

    // Calculate delta time
    delta.time = currentTime - velocity.time;

    if (delta.time > 200) velocity = { x: 0, y: 0 };

    // Emit end event
    _eventEmitter.emit('end', {
      delta: delta,
      position: last,
      velocity: velocity
    });
  };

  // Add dom event listeners
  container.addEventListener('touchstart', touchStart, false);
  container.addEventListener('touchmove', touchMove, false);
  container.addEventListener('touchend', touchEnd, false);

  self.destroy = function() {
    // Remove dom event listeners
    container.removeEventListener('touchstart', touchStart, false);
    container.removeEventListener('touchmove', touchMove, false);
    container.removeEventListener('touchend', touchEnd, false);

    // Shut down our own event emitter
    _eventEmitter.removeAllListeners();
  };

  self.on = function(name, f) {
    return _eventEmitter.on(name, f);
  };

};
