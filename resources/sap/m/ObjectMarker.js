/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Control","sap/ui/core/Renderer","sap/ui/Device","sap/m/library","sap/ui/core/library","sap/ui/core/Icon","sap/m/TextRenderer","sap/m/Text","sap/m/LinkRenderer","sap/m/Link","./ObjectMarkerRenderer"],function(e,t,i,r,n,a,s,o,l,p,c){"use strict";var g=n.TextAlign;var u=r.ObjectMarkerVisibility;var y=e.extend("sap.m.ObjectMarker",{metadata:{library:"sap.m",designtime:"sap/m/designtime/ObjectMarker.designtime",properties:{type:{type:"sap.m.ObjectMarkerType",group:"Misc"},visibility:{type:"sap.m.ObjectMarkerVisibility",group:"Misc"},additionalInfo:{type:"string",group:"Misc",defaultValue:""}},aggregations:{_innerControl:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"}},associations:{ariaDescribedBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaDescribedBy"},ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{press:{type:{type:"sap.m.ObjectMarkerType"}}},dnd:{draggable:true,droppable:false}}});var d=sap.ui.getCore().getLibraryResourceBundle("sap.m");y.M_PREDEFINED_TYPES={Flagged:{icon:{src:"sap-icon://flag",visibility:{small:true,large:true}},text:{value:d.getText("OM_FLAG"),visibility:{small:false,large:false}}},Favorite:{icon:{src:"sap-icon://favorite",visibility:{small:true,large:true}},text:{value:d.getText("OM_FAVORITE"),visibility:{small:false,large:false}}},Draft:{icon:{src:"sap-icon://request",visibility:{small:false,large:false}},text:{value:d.getText("OM_DRAFT"),visibility:{small:true,large:true}}},Locked:{icon:{src:"sap-icon://private",visibility:{small:true,large:true}},text:{value:d.getText("OM_LOCKED"),visibility:{small:false,large:true}}},Unsaved:{icon:{src:"sap-icon://user-edit",visibility:{small:true,large:true}},text:{value:d.getText("OM_UNSAVED"),visibility:{small:false,large:true}}},LockedBy:{icon:{src:"sap-icon://private",visibility:{small:true,large:true}},text:{value:d.getText("OM_LOCKED_BY"),visibility:{small:false,large:true}}},UnsavedBy:{icon:{src:"sap-icon://user-edit",visibility:{small:true,large:true}},text:{value:d.getText("OM_UNSAVED_BY"),visibility:{small:false,large:true}}}};y.prototype.init=function(){i.media.initRangeSet("DeviceSet",[600],"px",["small","large"])};y.prototype.onAfterRendering=function(){this._attachMediaContainerWidthChange(this._handleMediaChange,this,"DeviceSet")};y.prototype.onBeforeRendering=function(){this._cleanup();this._adjustControl(true)};y.prototype.exit=function(){this._cleanup()};y.prototype.attachPress=function(){var t=this._getInnerControl();Array.prototype.unshift.apply(arguments,["press"]);e.prototype.attachEvent.apply(this,arguments);if(this.hasListeners("press")&&t&&t instanceof _){t.destroy();this.setAggregation("_innerControl",this._createCustomLink(),true);this._adjustControl()}return this};y.prototype.detachPress=function(){var t=this._getInnerControl();Array.prototype.unshift.apply(arguments,["press"]);e.prototype.detachEvent.apply(this,arguments);if(!this.hasListeners("press")&&t&&t instanceof v){t.destroy();this.setAggregation("_innerControl",this._createCustomText(),true);this._adjustControl()}return this};y.prototype._cleanup=function(){this._detachMediaContainerWidthChange(this._handleMediaChange,this,"DeviceSet")};y.prototype._handleMediaChange=function(){this._adjustControl()};y.prototype._adjustControl=function(e){var t=y.M_PREDEFINED_TYPES[this.getType()],i=this._getInnerControl(),r=this.getAdditionalInfo(),n=this._isIconVisible(),a=this._isTextVisible(),s=n&&!a,o=this.getType(),l;if(!i){return false}if(t){l=this._getMarkerText(t,o,r)}if(n){i.setIcon(t.icon.src,e);i._getIconAggregation().setDecorative(!s);this.addStyleClass("sapMObjectMarkerIcon")}else{i.setIcon(null,e);this.removeStyleClass("sapMObjectMarkerIcon")}if(a){i.setAggregation("tooltip",null,e);i.setText(l,e);this.addStyleClass("sapMObjectMarkerText")}else{if(i.getIcon()){i.setAggregation("tooltip",l,e)}i.setText(null,e);this.removeStyleClass("sapMObjectMarkerText")}return true};y.prototype._getMarkerText=function(e,t,i){switch(t){case"LockedBy":return i===""?d.getText("OM_LOCKED_BY_ANOTHER_USER"):d.getText("OM_LOCKED_BY",[i]);case"UnsavedBy":return i===""?d.getText("OM_UNSAVED_BY_ANOTHER_USER"):d.getText("OM_UNSAVED_BY",[i]);default:return i===""?e.text.value:e.text.value+" "+i}};y.prototype._isIconVisible=function(){var e=y.M_PREDEFINED_TYPES[this.getType()],t=this.getVisibility(),i=this._getDeviceType(),r=e&&e.icon.visibility[i]||false;return t===u.IconOnly||t===u.IconAndText||t!==u.TextOnly&&r};y.prototype._isTextVisible=function(){var e=y.M_PREDEFINED_TYPES[this.getType()],t=this.getVisibility(),i=this._getDeviceType(),r=e&&e.text.visibility[i]||false;return t===u.TextOnly||t===u.IconAndText||t!==u.IconOnly&&r};y.prototype._getDeviceType=function(){return this._getCurrentMediaContainerRange("DeviceSet").name.toLowerCase()};y.prototype._getInnerControl=function(){var e=this.getAggregation("_innerControl");if(!e&&this.getType()){e=this._createInnerControl();this.setAggregation("_innerControl",e,true);this._adjustControl(true)}return e};y.prototype._createInnerControl=function(){if(this.hasListeners("press")){return this._createCustomLink()}else{return this._createCustomText()}};y.prototype._createCustomLink=function(){var e=new v(this.getId()+"-link",{wrapping:true});e.attachPress(function(e){this.firePress({type:this.getType()})},this);return e};y.prototype._createCustomText=function(){return new _(this.getId()+"-text",{textAlign:g.Initial})};["getAriaLabelledBy","addAriaLabelledBy","removeAriaLabelledBy","removeAllAriaLabelledBy","getAriaDescribedBy","addAriaDescribedBy","removeAriaDescribedBy","removeAllAriaDescribedBy","getAccessibilityInfo"].map(function(e){var t=/^add/.test(e);y.prototype[e]=function(){var i=this._getInnerControl(),r;if(i&&i[e]){r=i[e].apply(i,arguments)}return t?this:r}});var h=t.extend(s);h.apiVersion=2;h.renderText=function(e,t){e.renderControl(t._getIconAggregation());s.renderText(e,t)};var _=o.extend("sap.m.internal.ObjectMarkerCustomText",{metadata:{library:"sap.m",properties:{icon:{type:"sap.ui.core.URI",group:"Data",defaultValue:null}},aggregations:{_iconControl:{type:"sap.ui.core.Icon",multiple:false,visibility:"hidden"}}},renderer:h});_.prototype.setIcon=function(e,t){var i=this._getIconAggregation();this.setProperty("icon",e,t);i.setSrc(e);return this};_.prototype._getIconAggregation=function(){var e=this.getAggregation("_iconControl");if(!e){e=new a;this.setAggregation("_iconControl",e,true)}return e};var f=t.extend(l);f.apiVersion=2;f.renderText=function(e,t){e.renderControl(t._getIconAggregation());l.renderText(e,t)};var v=p.extend("sap.m.internal.ObjectMarkerCustomLink",{metadata:{library:"sap.m",properties:{icon:{type:"sap.ui.core.URI",group:"Data",defaultValue:null}},aggregations:{_iconControl:{type:"sap.ui.core.Icon",multiple:false,visibility:"hidden"}}},renderer:f});v.prototype.setIcon=function(e,t){var i=this._getIconAggregation();this.setProperty("icon",e,t);i.setSrc(e);return this};v.prototype._getTabindex=function(){return"0"};v.prototype._getIconAggregation=function(){var e=this.getAggregation("_iconControl");if(!e){e=new a;this.setAggregation("_iconControl",e,true)}return e};return y});