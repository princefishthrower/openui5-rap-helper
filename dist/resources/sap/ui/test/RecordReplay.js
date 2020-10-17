/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/Object","sap/ui/test/actions/Press","sap/ui/test/actions/EnterText","sap/ui/test/autowaiter/_autoWaiterAsync","sap/ui/test/_ControlFinder","sap/ui/test/selectors/_ControlSelectorGenerator","sap/ui/test/_OpaLogger"],function(e,t,n,r,o,i,c){"use strict";var s=e.extend("sap.ui.test.RecordReplay",{});var a=c.getLogger("sap.ui.test.RecordReplay");s.InteractionType={Press:"PRESS",EnterText:"ENTER_TEXT"};s.findControlSelectorByDOMElement=function(e){return new Promise(function(t,n){var r=o._getControlForElement(e.domElement);if(!r){n(new Error("Could not find control for DOM element "+e.domElement.id))}var c=Object.assign({control:r},e);i._generate(c).then(function(n){var i=o._getDomElementIDSuffix(e.domElement,r);if(i){a.debug("DOM element ID suffix is "+i);n.interaction={idSuffix:i}}t(n)}).catch(function(t){n(new Error("No control selector found for DOM element "+e.domElement.id+". Error: "+t))})})};s.findDOMElementByControlSelector=function(e){return new Promise(function(t,n){try{var r=o._findElements(e.selector)[0];if(r){t(r)}else{n(new Error("No DOM element found using the control selector "+JSON.stringify(e.selector)))}}catch(t){n(new Error("No DOM element found using the control selector "+JSON.stringify(e.selector)+". Error: "+t))}})};s.interactWithControl=function(e){var r=JSON.stringify(e.selector);return new Promise(function(i,c){var l;switch(e.interactionType){case s.InteractionType.Press:l=new t;break;case s.InteractionType.EnterText:l=new n({text:e.enterText});break;default:c(new Error("Could not interact with control "+r+". Unsupported interaction type: "+e.interactionType+" . Supported interaction types are: "+Object.keys(s.InteractionType).join(", ")))}try{var u=o._findControls(e.selector)[0];if(!u){throw new Error("No controls found using selector "+r)}l.executeOn(u);a.debug("Executed action "+e.interactionType+" on control "+r);i()}catch(t){c(new Error("Could not execute interaction "+e.interactionType+" on control "+r+". Error: "+t))}})};s.waitForUI5=function(e){e=e||{};r.extendConfig(e);return new Promise(function(e,t){r.waitAsync(function(n){if(n){t(new Error(n))}else{e()}})})};return s});