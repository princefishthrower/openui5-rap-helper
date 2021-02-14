/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Element","sap/ui/core/IconPool","./TabStripItem","./library"],function(e,t,r,a){"use strict";var p=e.extend("sap.m.TabContainerItem",{metadata:{library:"sap.ui.core",properties:{name:{type:"string",group:"Misc",defaultValue:""},additionalText:{type:"string",group:"Misc",defaultValue:""},icon:{type:"sap.ui.core.URI",group:"Appearance",defaultValue:null},iconTooltip:{type:"string",group:"Accessibility",defaultValue:null},key:{type:"string",group:"Data",defaultValue:null},modified:{type:"boolean",group:"Misc",defaultValue:false}},aggregations:{content:{type:"sap.ui.core.Control",multiple:true,defaultValue:null},_image:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"}},events:{itemPropertyChanged:{parameters:{itemChanged:{type:"sap.m.TabContainerItem"},propertyKey:{type:"string"},propertyValue:{type:"any"}}}},dnd:{draggable:true,droppable:false}}});p.prototype.setProperty=function(t,r,a){this.fireItemPropertyChanged({itemChanged:this,propertyKey:t,propertyValue:r});return e.prototype.setProperty.call(this,t,r,a)};p.prototype.setIcon=function(e){return r.prototype._setIcon.call(this,e,true)};p.prototype._getImage=function(){return this.getAggregation("_image")};return p});