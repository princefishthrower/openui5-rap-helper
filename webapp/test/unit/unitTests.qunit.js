/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"openui5-rap-helper/openui5-rap-helper/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});