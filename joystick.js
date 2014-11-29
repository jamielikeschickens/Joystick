"use strict";
var EventEmitter = require('events').EventEmitter;
var util = require('util');

function Joystick() {
	EventEmitter.call(this);

	var HID = require('node-hid');
	var devices = HID.devices(0x06a3, 0x075c);
	var joystick = new HID.HID(devices[0].path);
	console.log(joystick);
	var _this = this;

	joystick.on("data", function(data) {
		// All data recieved is little endian
		
		// X and Y are 11 bits 0-2047
		console.log(data);
		
		// 11 bits so first 8 bits from are B0
		var x_b0 = data.readUInt8(0);

		// next 3 bits from bits 0-2 from 2nd byte in buffer
		var x_b1 = data.readUInt8(1);
		x_b1 = (x_b1 & 0x07)

		var x = x_b0 | (x_b1 << 8);
		_this.emit("x-axis", x);

		// 1111 1000
		var y_b0 = data.readUInt8(1);
		y_b0 = (y_b0 & 0xF8) >>> 3;

		// 0011 1111
		var y_b1 = data.readUInt8(2);
		y_b1 = (y_b1 & 0x3F);
		
		var y = y_b0 | (y_b1 << 5);
		_this.emit("y-axis", y);


		// Rudder
		// 10 bits 0 - 1023
		
		// 2-bits 1100 0000
		var rz_b0_0 = data.readUInt8(2);
		rz_b0_0 = (rz_b0_0 & 0xC0) >>> 6;

		// 6-bits 0011 1111
		var rz_b0_1 = data.readUInt8(3);
		rz_b0_1 = (rz_b0_1 & 0x3F) << 2;

		var rz_b0 = rz_b0_0 | rz_b0_1;

		// 2-bits 1100 0000 
		var rz_b1 = data.readUInt8(3);
		rz_b1 = (rz_b1 & 0xC0) >>> 6;	

		var rz = rz_b0 | (rz_b1 << 8);
		_this.emit("rudder-axis", rz);
		
		// Throttle
		// 8 bits 0-255
		
		// 8-bits 1111 1111
		var th = data.readUInt8(4);
		// Need to flip axis
		th = 255 - th;
		_this.emit("throttle-axis", th);

		// Fire button
		// 9th byte index 8
		// Set to 2 when pressed
		var fire = data.readUInt8(8);
		fire = (fire & 0x02) >>> 1; 
		_this.emit("fire-button", fire);

	});

}
util.inherits(Joystick, EventEmitter);

module.exports = Joystick;


