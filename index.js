"use strict";
var Joystick = require('./joystick');

var joystick = new Joystick();

joystick.on("xaxis", function() {
	console.log("Look pa we're emitting events");
});
