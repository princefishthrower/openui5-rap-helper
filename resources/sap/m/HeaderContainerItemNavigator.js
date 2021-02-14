/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/delegate/ItemNavigation","sap/base/assert","sap/ui/dom/containsOrEquals","sap/ui/events/KeyCodes"],function(t,e,o,n){"use strict";var a=t.extend("sap.m.HeaderContainerItemNavigator");a.prototype.focusItem=function(t,e){if(e.type==="mousedown"){var o=this.aItemDomRefs[t].focus;this.aItemDomRefs[t].focus=function(){};this._callParent("focusItem",arguments);this.aItemDomRefs[t].focus=o;return}this._callParent("focusItem",arguments)};a.prototype._callParent=function(e,o){if(typeof t.prototype[e]==="function"){t.prototype[e].apply(this,o)}};a.prototype.onsaphome=function(t){if(this._skipNavigation(t)){return}this._callParent("onsaphome",arguments)};a.prototype.onsapend=function(t){if(this._skipNavigation(t)){return}this._callParent("onsapend",arguments)};a.prototype.onsapnext=function(t){if(this._skipNavigation(t)){return}this._callParent("onsapnext",arguments)};a.prototype.onsapprevious=function(t){if(this._skipNavigation(t,true,false)){return}this._callParent("onsapprevious",arguments)};a.prototype._skipNavigation=function(t){return Array.prototype.indexOf.call(this.aItemDomRefs,t.target)===-1};return a});