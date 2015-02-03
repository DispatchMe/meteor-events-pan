if (typeof Events === 'undefined')
  Events = {};

Events.Pan = function(container, options) {
  var self = this;

  // Make sure we return an instance
  if (!(self instanceof Events.Pan))
    return new Events.Pan(container);

  options = _.extend({
    historyLength: 20, // History length
    minimumTime: 8, // Time diff will never be 0
    passthrough: false,
    moveTreshold: 3 // Threshold before working with this as a scroll
  }, options);

  // Initialize our internal event handler
  // XXX: Use jquery eventhandling
  var _eventEmitter = new EventEmitter();

  // Keep track of time
  var currentTime = +new Date();

  // Initialize velocity
  var velocity = { time: currentTime, x: 0, y: 0 };

  var history = [];

  var firstEvent = function() {
    return history.length ? history[0] : {};
  };

  var lastEvent = function() {
    return history.length ? history[history.length-1] : {};
  };

  var inScroll = false;

  // Touch start handle
  var touchStart = function(evt) {
    if (inScroll) evt.preventDefault();

    // Get current touch
    var touch = evt.targetTouches[0];

    // Reset in scroll flag
    inScroll = false;

    // Keep track of time
    currentTime = +new Date();

    var e = {
      delta: {
        time: 0,
        x: 0,
        y: 0
      },
      position: {
        x: touch.pageX,
        y: touch.pageY
      },
      velocity: {
        x: 0,
        y: 0
      },
      time: currentTime,
    };

    // Reset history
    history = [];

    // Initialize
    while (history.length < options.historyLength) {
      // Fill out history
      history.unshift(e);
    }

    _eventEmitter.emit('start', _.clone(e));
  };


  var touchMove = function(evt) {
    if (inScroll) evt.preventDefault();
    // Get touch
    var touch = evt.targetTouches[0];

    // Update current time
    currentTime = +new Date();

    // Get the last event
    var last = lastEvent();

    // Calc deltas
    var delta = {
      x: touch.pageX - last.position.x,
      y: touch.pageY - last.position.y,
      time: Math.max(currentTime - last.time, options.minimumTime)
    };

    // Calc moved distance
    var dist = Math.sqrt(delta.x*delta.x + delta.y*delta.y);

    // Check if this is a move
    if (!options.passthrough && !inScroll && dist > options.moveTreshold) {
      // Set in scroll flag true
      inScroll = true;

      // Prevent default
      evt.preventDefault();
    }

    var e = {
      delta: delta,
      position: {
        // Save this touch
        x: touch.pageX,
        y: touch.pageY,
      },
      velocity: {
        // XXX: Calculate velocity vector pixel / ms
        // Calculate velocity and flatten out a short average
        x: (delta.x / delta.time)/10,
        y: (delta.y / delta.time)/10
      },
      time: currentTime,
    };

    // Add to history
    history.push(e);

    // Maintain history limit
    if (history.length > options.historyLength) history.shift();

    // Emit move event
    _eventEmitter.emit('move', e);
  };


  var touchEnd = function(evt) {
    if (inScroll) evt.preventDefault();

    // Update current time
    currentTime = +new Date();

    var first = firstEvent();
    var last = lastEvent();

    // Calculate delta time
    var dtime = currentTime - last.time;

    var delta = {
      x: last.position.x - first.position.x,
      y: last.position.y - first.position.y,
      time: Math.max(last.time - first.time, options.minimumTime)
    };

    var e = {
      delta: delta,
      position: _.clone(last.position),
      velocity: {
        // Average of velocity x
        x: _.reduce(history, function(memo, val) {
          return memo + val.velocity.x;
        }, 0) / history.length,
        // Average of velocity y
        y: _.reduce(history, function(memo, val) {
          return memo + val.velocity.y;
        }, 0) / history.length,
        // x: (delta.x / delta.time)/10,
        // y: (delta.y / delta.time)/10
      },
      time: currentTime,
      releaseTime: dtime
    };

    // Reset in scroll flag
    inScroll = false;

    // Emit end event
    _eventEmitter.emit('end', e);
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
