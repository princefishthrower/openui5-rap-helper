/*global QUnit*/

sap.ui.define([
	"openui5-rap-helper/openui5-rap-helper/controller/OpenUI5RapHelper.controller"
], function (Controller) {
	"use strict";

	QUnit.module("OpenUI5RapHelper Controller");

	QUnit.test("I should test the OpenUI5RapHelper controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});