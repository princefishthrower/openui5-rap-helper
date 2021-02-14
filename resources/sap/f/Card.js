/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Control","sap/f/CardRenderer","sap/f/library","sap/m/library","sap/ui/core/InvisibleText","sap/ui/core/Core","sap/m/BadgeEnabler"],function(e,t,a,i,r,o,n){"use strict";var s=a.cards.HeaderPosition;var d=i.BadgeState;var p=3e3;var u=e.extend("sap.f.Card",{metadata:{library:"sap.f",interfaces:["sap.f.ICard"],properties:{width:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:"100%"},height:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:"auto"},headerPosition:{type:"sap.f.cards.HeaderPosition",group:"Appearance",defaultValue:s.Top}},aggregations:{header:{type:"sap.f.cards.IHeader",multiple:false},content:{type:"sap.ui.core.Control",multiple:false}}},renderer:t});n.call(u.prototype);u.prototype.init=function(){this._oRb=o.getLibraryResourceBundle("sap.f");this._ariaText=new r({id:this.getId()+"-ariaText"});this._ariaText.setText(this._oRb.getText("ARIA_ROLEDESCRIPTION_CARD"));this._ariaContentText=new r({id:this.getId()+"-ariaContentText"});this._ariaContentText.setText(this._oRb.getText("ARIA_LABEL_CARD_CONTENT"));this.initBadgeEnablement({accentColor:"AccentColor6"})};u.prototype.exit=function(){this._oRb=null;if(this._ariaText){this._ariaText.destroy();this._ariaText=null}if(this._ariaContentText){this._ariaContentText.destroy();this._ariaContentText=null}};u.prototype.getCardHeader=function(){return this.getHeader()};u.prototype.getCardHeaderPosition=function(){return this.getHeaderPosition()};u.prototype.getCardContent=function(){return this.getContent()};u.prototype.getFocusDomRef=function(){return this.getCardHeader()?this.getCardHeader().getDomRef():this.getDomRef()};u.prototype.onfocusin=function(){this._startBadgeHiding()};u.prototype._startBadgeHiding=function(){if(this._iHideBadgeTimeout){return}this._iHideBadgeTimeout=setTimeout(this._hideBadge.bind(this),p)};u.prototype._hideBadge=function(){var e=this.getBadgeCustomData();if(e){e.setVisible(false)}this._iHideBadgeTimeout=null};u.prototype.onBadgeUpdate=function(e,t,a){var i=this.getCardHeader(),r,o;if(i){r=i.getDomRef()}else{r=this.getDomRef("contentSection")}if(!r){return}o=r.getAttribute("aria-labelledby")||"";switch(t){case d.Appear:o=a+" "+o;r.setAttribute("aria-labelledby",o);break;case d.Disappear:o=o.replace(a,"").trim();r.setAttribute("aria-labelledby",o);break}};u.prototype.getAriaLabelBadgeText=function(){return this.getBadgeCustomData().getValue()};return u});