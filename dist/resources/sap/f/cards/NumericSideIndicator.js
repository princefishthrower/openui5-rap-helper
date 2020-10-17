/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Control","sap/m/Text","sap/f/cards/NumericSideIndicatorRenderer"],function(t,e,i){"use strict";var r=t.extend("sap.f.cards.NumericSideIndicator",{metadata:{library:"sap.f",properties:{title:{type:"string",group:"Appearance"},number:{type:"string",group:"Data"},unit:{type:"string",group:"Data"}},aggregations:{_title:{type:"sap.m.Text",multiple:false,visibility:"hidden"},_number:{type:"sap.m.Text",multiple:false,visibility:"hidden"},_unit:{type:"sap.m.Text",multiple:false,visibility:"hidden"}}},renderer:i});r.prototype.setTitle=function(t){this.setProperty("title",t,true);this._getTitle().setText(t);return this};r.prototype.setNumber=function(t){this.setProperty("number",t,true);this._getNumber().setText(t);return this};r.prototype.setUnit=function(t){this.setProperty("unit",t,true);this._getUnit().setText(t);return this};r.prototype._getTitle=function(){var t=this.getAggregation("_title");if(!t){t=new e({id:this.getId()+"-title",wrapping:false});this.setAggregation("_title",t)}return t};r.prototype._getNumber=function(){var t=this.getAggregation("_number");if(!t){t=new e({id:this.getId()+"-number"});this.setAggregation("_number",t)}return t};r.prototype._getUnit=function(){var t=this.getAggregation("_unit");if(!t){t=new e({id:this.getId()+"-unit"});this.setAggregation("_unit",t)}return t};return r});