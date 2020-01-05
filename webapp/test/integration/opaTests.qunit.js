/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"openui5-rap-helper/openui5-rap-helper/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});