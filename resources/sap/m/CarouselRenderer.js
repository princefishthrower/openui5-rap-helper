/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/library","sap/base/strings/capitalize","sap/ui/core/Core","sap/ui/Device"],function(e,t,r,s){"use strict";var o=e.CarouselArrowsPlacement;var a=e.PlacementType;var n=r.getLibraryResourceBundle("sap.m");var i={apiVersion:2};i._BULLETS_TO_NUMBERS_THRESHOLD=9;i.render=function(e,t){var r=t.getPages(),n=r.length,i=t.getPageIndicatorPlacement(),l=t.getArrowsPlacement(),d=t._getPageNumber(t.getActivePage());this._renderOpeningDiv(e,t);if(i===a.Top){this._renderPageIndicatorAndArrows(e,t,{iPageCount:n,iIndex:d,sArrowsPlacement:l,bBottom:false,bShowPageIndicator:t.getShowPageIndicator()})}this._renderInnerDiv(e,t,r,i);if(s.system.desktop&&n>t._getNumberOfItemsToShow()&&l===o.Content){this._renderHudArrows(e,t)}if(i===a.Bottom){this._renderPageIndicatorAndArrows(e,t,{iPageCount:n,iIndex:d,sArrowsPlacement:l,bBottom:true,bShowPageIndicator:t.getShowPageIndicator()})}e.close("div")};i._renderOpeningDiv=function(e,t){var r=t.getTooltip_AsString();e.openStart("div",t).class("sapMCrsl").class("sapMCrslFluid").style("width",t.getWidth()).style("height",t.getHeight()).attr("data-sap-ui-customfastnavgroup",true).attr("tabindex",0).accessibilityState(t,{role:"listbox"});if(r){e.attr("title",r)}e.openEnd()};i._renderInnerDiv=function(e,t,r,s){e.openStart("div").class("sapMCrslInner");if(r.length>1&&(t.getShowPageIndicator()||t.getArrowsPlacement()===o.PageIndicator)){if(s===a.Bottom){e.class("sapMCrslBottomOffset");if(t.getArrowsPlacement()===o.PageIndicator){e.class("sapMCrslBottomArrowsOffset")}}else{e.class("sapMCrslTopOffset");if(t.getArrowsPlacement()===o.PageIndicator){e.class("sapMCrslTopArrowsOffset")}}}e.openEnd();var n=function(r,s,o){e.openStart("div",t.getId()+"-"+r.getId()+"-slide").class("sapMCrslItem").accessibilityState(r,{role:"option",posinset:s+1,setsize:o.length}).openEnd();i._renderPageInScrollContainer(e,t,r);e.close("div")};if(r.length){r.forEach(n)}else{e.renderControl(t._getErrorPage())}e.close("div")};i._renderPageIndicatorAndArrows=function(e,t,r){var a=r.iPageCount,l=s.system.desktop&&r.sArrowsPlacement===o.PageIndicator,d=t.getId(),c=[],p=t._getNumberOfItemsToShow(),g=1;if(a<=t._getNumberOfItemsToShow()){return}if(!r.bShowPageIndicator&&!l){return}if(r.bBottom){c.push("sapMCrslControlsBottom")}else{c.push("sapMCrslControlsTop")}if(l){e.openStart("div").class("sapMCrslControls");c.forEach(function(t){e.class(t)});e.openEnd();e.openStart("div").class("sapMCrslControlsContainer");c.forEach(function(t){e.class(t)});e.openEnd()}else{e.openStart("div").class("sapMCrslControlsNoArrows");c.forEach(function(t){e.class(t)});e.openEnd()}if(l){this._renderArrow(e,t,"previous")}e.openStart("div",d+"-pageIndicator");if(!r.bShowPageIndicator){e.style("opacity","0")}if(a<i._BULLETS_TO_NUMBERS_THRESHOLD){e.class("sapMCrslBulleted").openEnd();for(var f=1;f<=a-p+1;f++){e.openStart("span").attr("data-slide",g).accessibilityState({role:"img",label:n.getText("CAROUSEL_POSITION",[f,a])}).openEnd().text(f).close("span");g++}}else{e.class("sapMCrslNumeric").openEnd();var C=n.getText("CAROUSEL_PAGE_INDICATOR_TEXT",[r.iIndex+1,a-p+1]);e.openStart("span",d+"-"+"slide-number").openEnd().text(C).close("span")}e.close("div");if(l){this._renderArrow(e,t,"next")}if(!l){e.close("div")}if(l){e.close("div").close("div")}};i._renderHudArrows=function(e,t){var r;if(t.getShowPageIndicator()){if(t.getPageIndicatorPlacement()===a.Top){r="sapMCrslHudTop"}else if(t.getPageIndicatorPlacement()===a.Bottom){r="sapMCrslHudBottom"}}else{r="sapMCrslHudMiddle"}e.openStart("div",t.getId()+"-hud").class("sapMCrslHud").class(r).openEnd();this._renderArrow(e,t,"previous");this._renderArrow(e,t,"next");e.close("div")};i._renderArrow=function(e,r,s){var o=s.slice(0,4);e.openStart("a").class("sapMCrsl"+t(o)).attr("tabindex","-1").attr("data-slide",o).attr("title",n.getText("PAGINGBUTTON_"+s.toUpperCase())).openEnd();e.openStart("div").class("sapMCrslArrowInner").openEnd();e.renderControl(r._getNavigationArrow(s==="previous"?"Left":"Right"));e.close("div").close("a")};i._renderPageInScrollContainer=function(e,t,r){e.openStart("div").class("sapMScrollCont").class("sapMScrollContH").style("width","100%").style("height","100%").openEnd();e.openStart("div").class("sapMScrollContScroll").openEnd();e.openStart("div").class("sapMCrslItemTable").openEnd();e.openStart("div").class("sapMCrslItemTableCell");if(r.isA("sap.m.Image")){var a="sapMCrslImgNoArrows",n=s.system.desktop&&t.getArrowsPlacement()===o.PageIndicator;if(n){a="sapMCrslImg"}e.class(a)}e.openEnd();e.renderControl(r.addStyleClass("sapMCrsPage"));e.close("div");e.close("div");e.close("div");e.close("div")};return i},true);