"use strict";
var Joystick = require('./joystick');
var arDrone = require('ar-drone');
var client = arDrone.createClient();

var myjoystick = new Joystick();
var isLanded = 1;

myjoystick.on("x-axis", function(data) {
	console.log("x "+data);
	if (data > 1500) {
		client.right(0.3);	
	} else if (data < 900) {
		client.left(0.3);	
	} else {
		client.stop();
	}
});

myjoystick.on("y-axis", function(data) {
	console.log("y "+data);
	if (data < 1500) {
		client.front(0.3);	
	} else if (data > 900) {
		client.back(0.3);	
	} else {
		client.stop();
	}
});

myjoystick.on("fire-button", function(data)  {
	console.log("fire");
	if (isLanded == 1) {
		isLanded = 0;
		client.takeoff();	
	} else if (isLanded == 0) {
		isLanded = 1;
		client.land();	
	}
});

process.on("sigint", function() {
	client.land();
});
