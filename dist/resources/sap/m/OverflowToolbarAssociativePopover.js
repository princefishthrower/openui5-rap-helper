/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./Popover","./PopoverRenderer","./OverflowToolbarAssociativePopoverControls","./OverflowToolbarLayoutData","sap/m/library"],function(t,o,e,n,r){"use strict";var s=r.PlacementType;var i=r.OverflowToolbarPriority;var a=t.extend("sap.m._overflowToolbarHelpers.OverflowToolbarAssociativePopover",{metadata:{associations:{associatedContent:{type:"sap.ui.core.Control",multiple:true}}},renderer:o.render});a.prototype.init=function(){t.prototype.init.apply(this,arguments);this.oControlsManager=new e};a.prototype.onBeforeRendering=function(){t.prototype.onBeforeRendering.apply(this,arguments);this.addStyleClass("sapMOTAPopover");this.addStyleClass("sapMOverflowToolbarMenu-CTX")};a.prototype.addAssociatedContent=function(t){this.addAssociation("associatedContent",t,true);this._preProcessControl(t);return this};a.prototype.removeAssociatedContent=function(t){var o=this.removeAssociation("associatedContent",t,true),e;if(o){e=sap.ui.getCore().byId(o);if(e){this._postProcessControl(e)}}return o};a.prototype._preProcessControl=function(t){var o=e.getControlConfig(t),r;o.listenForEvents.forEach(function(o){r="attach"+c(o);if(t[r]){t[r](this._closeOnInteraction.bind(this,t))}else{t.attachEvent(o,this._closeOnInteraction.bind(this,t))}},this);if(typeof o.preProcess==="function"){o.preProcess.call(this.oControlsManager,t)}var s=t.getLayoutData();if(s instanceof n&&s.getPriority()===i.Disappear){t.addStyleClass("sapMOTAPHidden")}return this};a.prototype._postProcessControl=function(t){var o=e.getControlConfig(t),n;o.listenForEvents.forEach(function(o){n="detach"+c(o);if(t[n]){t[n](this._closeOnInteraction,this)}else{t.detachEvent(o,this._closeOnInteraction,this)}},this);if(typeof o.postProcess==="function"){o.postProcess.call(this.oControlsManager,t)}t.removeStyleClass("sapMOTAPHidden");t.$().remove();return this};a.prototype._closeOnInteraction=function(t){var o=t.getLayoutData();if(!o||!(o instanceof n)||o.getCloseOverflowOnInteraction()){this.close()}};a.prototype._getContentIdsHash=function(){return this._getAllContent().join(".")};a.prototype._recalculateMargins=function(o,e){if(o!==s.Top){return t.prototype._recalculateMargins.apply(this,arguments)}e._fMarginBottom=e._fDocumentHeight-e._$parent.offset().top+this._arrowOffset+e._fOffsetY};a.prototype._getAllContent=function(){var t=this.getAssociatedContent().map(function(t){return sap.ui.getCore().byId(t)});if(this.getPlacement()===s.Top){t.reverse()}return this.getContent().concat(t)};a.prototype.getCurrentPosition=function(){if(!this._oCalcedPos){this._calcPlacement()}return this._oCalcedPos};function c(t){return t.substring(0,1).toUpperCase()+t.substring(1)}return a});