/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./GridContainerRenderer","./GridContainerSettings","./GridContainerUtils","./library","./dnd/GridKeyboardDragAndDrop","sap/base/strings/capitalize","sap/ui/base/ManagedObjectObserver","sap/ui/core/Control","sap/ui/core/Core","sap/ui/core/ResizeHandler","sap/ui/core/delegate/ItemNavigation","sap/ui/core/InvisibleRenderer","sap/ui/Device","sap/ui/events/KeyCodes","sap/ui/layout/cssgrid/VirtualGrid","sap/ui/thirdparty/jquery"],function(t,e,i,r,o,n,s,a,l,u,f,h,p,g,d,c){"use strict";var m=l.getConfiguration().getRTL();var y=16;var _=["sap.f.Card","sap.ui.integration.widgets.Card","sap.m.GenericTile"];function I(){return!p.browser.msie&&!(p.browser.edge&&p.browser.version<y)}function v(t){var e=t.getLayoutData();return e?e.getColumns():1}function C(t){var e=t.getLayoutData();return e?e.getActualRows():1}function R(t){var e=t.getLayoutData();return e?e.hasAutoHeight():true}function D(t){if(t.onfocusin){t.onfocusin()}}var A=a.extend("sap.f.GridContainer",{metadata:{library:"sap.f",interfaces:["sap.f.dnd.IGridDroppable"],properties:{width:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:""},minHeight:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:"2rem"},containerQuery:{type:"boolean",group:"Behavior",defaultValue:false},snapToRow:{type:"boolean",group:"Appearance",defaultValue:false},allowDenseFill:{type:"boolean",group:"Appearance",defaultValue:false},inlineBlockLayout:{type:"boolean",group:"Appearance",defaultValue:false}},defaultAggregation:"items",aggregations:{items:{type:"sap.ui.core.Control",multiple:true,singularName:"item",dnd:true},layout:{type:"sap.f.GridContainerSettings",multiple:false},layoutXS:{type:"sap.f.GridContainerSettings",multiple:false},layoutS:{type:"sap.f.GridContainerSettings",multiple:false},layoutM:{type:"sap.f.GridContainerSettings",multiple:false},layoutL:{type:"sap.f.GridContainerSettings",multiple:false},layoutXL:{type:"sap.f.GridContainerSettings",multiple:false},_defaultLayout:{type:"sap.f.GridContainerSettings",multiple:false,visibility:"hidden"}},events:{layoutChange:{parameters:{layout:{type:"string"}}},borderReached:{parameters:{event:{type:"jQuery.Event"}}}},dnd:{draggable:false,droppable:true}}});A.prototype.bUseExtendedChangeDetection=true;A.prototype.getActiveLayoutSettings=function(){var t=this.getAggregation(this._sActiveLayout);if(!t&&this._sActiveLayout==="layoutXS"){t=this.getAggregation("layoutS")}if(!t){t=this.getAggregation("layout")||this.getAggregation("_defaultLayout")}return t};A.prototype._onBeforeItemRendering=function(){var t=this.getParent();if(t._reflectItemVisibilityToWrapper(this)&&!I()){t._scheduleIEPolyfill()}};A.prototype._onAfterItemRendering=function(){var t=this.getParent(),e;if(t._hasOwnVisualFocus(this)){e=this.getFocusDomRef();e.setAttribute("tabindex",-1);e.tabIndex=-1}if(!t._resizeListeners[this.getId()]){t._resizeListeners[this.getId()]=u.register(this,t._resizeItemHandler)}t._setItemNavigationItems();if(!I()){t._scheduleIEPolyfill();return}t._applyItemAutoRows(this)};A.prototype._reflectItemVisibilityToWrapper=function(t){var e=this._getItemWrapper(t),i;if(!e){return false}i=c(e);if(t.getVisible()&&i.hasClass("sapFGridContainerInvisiblePlaceholder")){i.removeClass("sapFGridContainerInvisiblePlaceholder")}else if(!t.getVisible()&&!i.hasClass("sapFGridContainerInvisiblePlaceholder")){i.addClass("sapFGridContainerInvisiblePlaceholder");return true}return false};A.prototype._onItemChange=function(t){if(t.name!=="items"||!t.child){return}if(t.mutation==="insert"){t.child.addEventDelegate(this._itemDelegate,t.child)}else if(t.mutation==="remove"){t.child.removeEventDelegate(this._itemDelegate,t.child)}};A.prototype._deregisterResizeListeners=function(){var t,e;for(t in this._resizeListeners){e=this._resizeListeners[t];u.deregister(e)}delete this._resizeListeners;p.resize.detachHandler(this._resizeDeviceHandler)};A.prototype._setItemNavigationItems=function(){if(!this._isRenderingFinished){return}var t=this,e=[];if(!t._oItemNavigation){t._oItemNavigation=(new f).setCycling(false).attachEvent(f.Events.FocusLeave,this._onItemNavigationFocusLeave,this).attachEvent(f.Events.BorderReached,this._onItemNavigationBorderReached,this).setDisabledModifiers({sapnext:["alt","meta","ctrl"],sapprevious:["alt","meta","ctrl"]}).setFocusedIndex(0);t._oItemNavigation.focusItem=function(e,i){if(e==this.iFocusedIndex&&this.aItemDomRefs[this.iFocusedIndex]==document.activeElement){this.fireEvent(f.Events.FocusAgain,{index:e,event:i});return}this.fireEvent(f.Events.BeforeFocus,{index:e,event:i});this.setFocusedIndex(e);this.bISetFocus=true;if(i&&c(this.aItemDomRefs[this.iFocusedIndex]).data("sap.INRoot")){var r=c(this.aItemDomRefs[this.iFocusedIndex]).data("sap.INRoot");r._sFocusEvent=i.type}if(!t._bIsMouseDown){this.aItemDomRefs[this.iFocusedIndex].focus()}this.fireEvent(f.Events.AfterFocus,{index:e,event:i})};t.addDelegate(this._oItemNavigation)}t.$().children().map(function(t,i){if(i.getAttribute("class").indexOf("sapFGridContainerItemWrapper")>-1){e.push(i)}});t._oItemNavigation.setRootDomRef(t.getDomRef());t._oItemNavigation.setItemDomRefs(e)};A.prototype._onItemNavigationFocusLeave=function(t){var e=this._oItemNavigation.getFocusedDomRef();this._oItemNavigation.getItemDomRefs().forEach(function(t,i){if(e===t){var r=i++;this._oItemNavigation.setFocusedIndex(r)}}.bind(this));this._oItemNavigationFocusLeft=true};A.prototype._detectActiveLayout=function(){var t=this.getContainerQuery()&&this.getDomRef()?this._getComputedWidth():p.resize.width,e=p.media.getCurrentRange("GridContainerRangeSet",t),i="layout"+e.name,r=this.getActiveLayoutSettings(),o=false;if(!t){return false}if(this._sActiveLayout!==i){this.addStyleClass("sapFGridContainer"+n(i));if(this._sActiveLayout){this.removeStyleClass("sapFGridContainer"+n(this._sActiveLayout))}this._sActiveLayout=i;o=r!==this.getActiveLayoutSettings();this.fireLayoutChange({layout:this._sActiveLayout})}return o};A.prototype._getActiveGridStyles=function(){var t=this.getActiveLayoutSettings(),e=t.getColumns()||"auto-fill",i=t.getColumnSize(),r=t.getMinColumnSize(),o=t.getMaxColumnSize(),n={"grid-gap":t.getGap()};if(r&&o){n["grid-template-columns"]="repeat("+e+", minmax("+r+", "+o+"))"}else{n["grid-template-columns"]="repeat("+e+", "+i+")"}if(this.getInlineBlockLayout()){n["grid-auto-rows"]="min-content"}else{n["grid-auto-rows"]=t.getRowSize()}return n};A.prototype.init=function(){this._oRb=l.getLibraryResourceBundle("sap.f");this.setAggregation("_defaultLayout",new e);this._initRangeSet();this._resizeListeners={};this._oItemNavigation=null;this._itemDelegate={onBeforeRendering:this._onBeforeItemRendering,onAfterRendering:this._onAfterItemRendering};this._itemsObserver=new s(this._onItemChange.bind(this));this._itemsObserver.observe(this,{aggregations:["items"]});this._resizeHandler=this._resize.bind(this);this._resizeDeviceHandler=this._resizeDevice.bind(this);p.resize.attachHandler(this._resizeDeviceHandler);this._resizeItemHandler=this._resizeItem.bind(this);if(!I()){this._attachDndPolyfill()}};A.prototype.insertItem=function(t,e){this.insertAggregation("items",t,e,true);if(!this.getDomRef()||!I()||!t.getVisible()){this.invalidate();return this}var i=l.createRenderManager(),r=this._createItemWrapper(t),o=this._getItemAt(e+1),n=this.getDomRef();if(o){n.insertBefore(r,this._getItemWrapper(o))}else{n.insertBefore(r,n.lastChild)}t.addStyleClass("sapFGridContainerItemInnerWrapper");i.render(t,r);i.destroy();return this};A.prototype.removeItem=function(t){var e=this.removeAggregation("items",t,true),i=this.getDomRef(),r=e.getDomRef();if(!i||!r||!I()){this.invalidate();return e}i.removeChild(r.parentElement);return e};A.prototype.onBeforeRendering=function(){this._detectActiveLayout();var t=this._resizeListeners[this.getId()];if(t){u.deregister(t)}this._isRenderingFinished=false};A.prototype.onAfterRendering=function(){this._resizeListeners[this.getId()]=u.register(this.getDomRef(),this._resizeHandler);this._isRenderingFinished=true;this._setItemNavigationItems();this._applyLayout(true)};A.prototype.exit=function(){this._deregisterResizeListeners();if(this._itemsObserver){this._itemsObserver.disconnect();delete this._itemsObserver}if(this._oItemNavigation){this.removeDelegate(this._oItemNavigation);this._oItemNavigation.destroy();delete this._oItemNavigation;this._oItemNavigation=null}if(!I()){this._detachDndPolyfill()}};A.prototype._initRangeSet=function(){if(!p.media.hasRangeSet("GridContainerRangeSet")){p.media.initRangeSet("GridContainerRangeSet",[375,600,1024,1440],"px",["XS","S","M","L","XL"])}};A.prototype._resize=function(){if(!this._isWidthChanged()){return}var t=this._detectActiveLayout();this._applyLayout(t)};A.prototype._resizeDevice=function(){if(!this.getContainerQuery()){this._resize()}};A.prototype._isWidthChanged=function(){var t=this._getComputedWidth(),e=p.resize.width;if(this._lastGridWidth===t&&this._lastViewportWidth===e){return false}this._lastGridWidth=t;this._lastViewportWidth=e;return true};A.prototype._getComputedWidth=function(){if(!this.getDomRef()){return null}return this.getDomRef().getBoundingClientRect().width};A.prototype._resizeItem=function(t){if(!I()){if(!this._bDraggingInAnotherContainer){this._scheduleIEPolyfill()}this._bDraggingInAnotherContainer=false;return}this._applyItemAutoRows(t.control)};A.prototype._applyLayout=function(t){if(!this._isRenderingFinished){return}if(!I()){this._scheduleIEPolyfill(t);return}if(t){this.$().css(this._getActiveGridStyles());this.getItems().forEach(this._applyItemAutoRows.bind(this))}this._enforceMaxColumns()};A.prototype._applyItemAutoRows=function(t){if(!this._isRenderingFinished){return}if(this.getInlineBlockLayout()){return}if(R(t)){var e=t.$(),i=this.getActiveLayoutSettings(),r=i.calculateRowsForItem(e.outerHeight());if(!r){return}e.parent().css({"grid-row":"span "+Math.max(r,C(t))})}};A.prototype._enforceMaxColumns=function(){var t=this.getActiveLayoutSettings(),e=t.getComputedColumnsCount(this.$().innerWidth());if(!e){return}this.getItems().forEach(function(t){t.$().parent().css("grid-column","span "+Math.min(v(t),e))})};A.prototype._getItemAt=function(t){var e=this.getItems(),i;if(t<0){t=0}if(e.length&&e[t]){i=e[t]}return i};A.prototype._createItemWrapper=function(e){var i=t.getStylesForItemWrapper(e,this),r=i.styles,o=i.classes,n=document.createElement("div");n.setAttribute("tabindex","0");r.forEach(function(t,e){n.style.setProperty(e,t)});o.forEach(function(t){n.classList.add(t)});return n};A.prototype._scheduleIEPolyfill=function(t){if(this._iPolyfillCallId){clearTimeout(this._iPolyfillCallId)}if(t){this._applyIEPolyfillLayout();return}this._iPolyfillCallId=setTimeout(this._applyIEPolyfillLayout.bind(this),0)};A.prototype._applyIEPolyfillLayout=function(){if(!this._isRenderingFinished){return}if(this.bIsDestroyed){return}var t=this.$(),e=t.innerWidth(),i=this.getActiveLayoutSettings(),r=i.getMinColumnSizeInPx()||i.getColumnSizeInPx(),o=i.getRowSizeInPx(),n=i.getGapInPx(),s=i.getComputedColumnsCount(e),a=parseInt(t.css("padding-top").replace("px","")),l=parseInt(t.css("padding-left").replace("px","")),u=this.getItems();if(!r||!o){return}if(!u.length){return}var f=new d;f.init({numberOfCols:Math.max(1,s),cellWidth:r,cellHeight:o,unitOfMeasure:"px",gapSize:n,topOffset:a?a:0,leftOffset:l?l:0,allowDenseFill:this.getAllowDenseFill(),rtl:m,width:e});var h,p,g,c,y,_,I=[];var D=function(t){f.fitElement(t+"",this._polyfillDropIndicator.columns||i.calculateColumnsForItem(Math.round(this._polyfillDropIndicator.width)),this._polyfillDropIndicator.rows||i.calculateRowsForItem(Math.round(this._polyfillDropIndicator.height)));I.push({id:t+"",domRef:this._polyfillDropIndicator.domRef})}.bind(this);for(h=0,p=0;h<u.length;h++){if(this._polyfillDropIndicator&&this._polyfillDropIndicator.insertAt===h){D(p);p++}g=u[h];c=g.$();if(!c.is(":visible")){continue}y=v(g);if(R(g)){_=this._calcAutoRowsForPolyfill(g,i)}else{_=C(g)}f.fitElement(p+"",y,_);I.push({id:p+"",domRef:c.parent()});p++}if(this._polyfillDropIndicator&&this._polyfillDropIndicator.insertAt>=u.length){D(u.length)}f.calculatePositions();I.forEach(function(t){var e=f.getItems()[t.id];t.domRef.css({position:"absolute",top:e.top,left:e.left,width:e.width,height:e.height})});t.css("height",f.getHeight()+"px");if(!this.getWidth()&&i.getColumns()){if(!this.getContainerQuery()){t.css("width",f.getWidth()+"px")}}};A.prototype._calcAutoRowsForPolyfill=function(t,e){var i=t.$(),r,o;if(i.hasClass("sapFCardAnalytical")){r=i[0].scrollHeight}else{r=i.outerHeight()}o=Math.max(e.calculateRowsForItem(r),C(t));return o};A.prototype._polyfillAfterDragOver=function(t){var e=t.getParameter("indicator");this._polyfillDropIndicator={rows:t.getParameter("rows"),columns:t.getParameter("columns"),width:t.getParameter("width"),height:t.getParameter("height"),domRef:e,insertAt:t.getParameter("indicatorIndex")};this._scheduleIEPolyfill()};A.prototype._polyfillAfterDragEnd=function(t){this._polyfillDropIndicator=null};A.prototype._polyfillDraggingInAnotherContainer=function(){this._bDraggingInAnotherContainer=true};A.prototype._attachDndPolyfill=function(){this.attachEvent("_gridPolyfillAfterDragOver",this._polyfillAfterDragOver,this);this.attachEvent("_gridPolyfillAfterDragEnd",this._polyfillAfterDragEnd,this);this.attachEvent("_gridPolyfillDraggingInAnotherContainer",this._polyfillDraggingInAnotherContainer,this)};A.prototype._detachDndPolyfill=function(){this.detachEvent("_gridPolyfillAfterDragOver",this._polyfillAfterDragOver,this);this.detachEvent("_gridPolyfillAfterDragEnd",this._polyfillAfterDragEnd,this);this.detachEvent("_gridPolyfillDraggingInAnotherContainer",this._polyfillDraggingInAnotherContainer,this)};A.prototype.forwardTab=function(t){this.$(t?"after":"before").focus()};A.prototype.onsaptabnext=function(t){if(!this._oItemNavigation){return}var e=this._oItemNavigation.getItemDomRefs(),i=this._oItemNavigation.getFocusedIndex(),r=c(e[i]),o=[];var n=r.find(":sapTabbable");n.map(function(t,e){if(e.className.indexOf("DummyArea")===-1){o.push(e)}});var s=c(o),a=s.length===1?0:s.length-1;if(a===-1||s.control(a)&&s.control(a).getId()===t.target.id){this._lastFocusedElement=t.target;this.forwardTab(true)}};A.prototype.onsaptabprevious=function(t){if(!this._isItemWrapper(t.target)){this._lastFocusedElement=t.target;return}var e=t.target.id;if(e===this.getId("nodata")){this.forwardTab(false)}else if(e===this.getId("trigger")){this.focusPrevious();t.preventDefault()}this._lastFocusedElement=null;this.forwardTab(false)};A.prototype.onmousedown=function(t){this._bIsMouseDown=true};A.prototype.onmouseup=function(t){var e=c(t.target).closest(".sapFGridContainerItemWrapperNoVisualFocus"),i;if(e.length){i=e.children().eq(0).control()[0];if(i&&i.getFocusDomRef()===document.activeElement){this._lastFocusedElement=null;e.focus();D(i)}}this._bIsMouseDown=false};A.prototype.onfocusin=function(t){var e=c(t.target).closest(".sapFGridContainerItemWrapperNoVisualFocus"),i,r,o;if(e.length){i=e.children().eq(0).control()[0];if(i){D(i);if(!this._bIsMouseDown&&i.getFocusDomRef()===t.target){this._lastFocusedElement=null;e.focus();return}}}if(t.target.classList.contains("sapFGridContainerItemWrapper")){this._lastFocusedElement=null}if(this._oItemNavigationFocusLeft){this._oItemNavigationFocusLeft=false;r=this._oItemNavigation.getItemDomRefs();o=this._oItemNavigation.getFocusedIndex();if(this._lastFocusedElement){this._lastFocusedElement.focus()}else{r[o].focus()}}};A.prototype.onsapfocusleave=function(){this._bIsMouseDown=false};A.prototype._onItemNavigationBorderReached=function(t){this.fireEvent("borderReached",{event:t instanceof c.Event?t:t.getParameter("event")})};A.prototype.onsapnext=function(t){var e=this._oItemNavigation.getItemDomRefs();if(e.indexOf(t.target)===-1){t.stopImmediatePropagation(true)}var i=c(t.target.firstElementChild).control(0);if(t.keyCode===g.ARROW_DOWN){t.stopImmediatePropagation(true);var r=this._getClosestItemBelowInThisContainer(i);if(r){this._getItemWrapper(r).focus()}else{this._onItemNavigationBorderReached(t)}}};A.prototype.onsapprevious=function(t){var e=this._oItemNavigation.getItemDomRefs();if(e.indexOf(t.target)===-1){t.stopImmediatePropagation(true)}var i=c(t.target.firstElementChild).control(0);if(t.keyCode===g.ARROW_UP){t.stopImmediatePropagation(true);var r=this._getClosestItemAboveInThisContainer(i);if(r){this._getItemWrapper(r).focus()}else{this._onItemNavigationBorderReached(t)}}};["onkeypress","onkeyup","onkeydown","onsapenter","onsapselect","onsapspace"].forEach(function(t){A.prototype[t]=function(e){if(!this._isItemWrapper(e.target)){return}if(t==="onsapspace"){e.preventDefault()}var i=c(e.target.firstChild).control()[0];if(i){var r=i.getFocusDomRef(),o=c(r).control()[0];if(o&&o[t]){o[t].call(o,e)}}}});A.prototype._hasOwnVisualFocus=function(t){return _.indexOf(t.getMetadata().getName())>-1};A.prototype._moveItem=function(t){if(!this._isItemWrapper(t.target)){return}var e=c(t.target.firstElementChild).control(0),i=this.getItems().length,r=this.indexOfItem(e),n=-1,s=null,a="After";switch(t.keyCode){case g.ARROW_RIGHT:n=l.getConfiguration().getRTL()?r-1:r+1;if(n>=0&&n<i){s=this.getItems()[n]}break;case g.ARROW_LEFT:n=l.getConfiguration().getRTL()?r+1:r-1;if(n>=0&&n<i){s=this.getItems()[n]}break;case g.ARROW_UP:s=this._getClosestItemAbove(e);var u=s.getParent();if(this!==u){a="Before"}break;case g.ARROW_DOWN:s=this._getClosestItemBelow(e);if(this!==s.getParent()){a="Before"}break;default:break}n=this.indexOfItem(s);if(!s){return}t.stopPropagation();if(this===s.getParent()&&n<r){a="Before"}o.fireDnDByKeyboard(e,s,a,t);this._setItemNavigationItems()};A.prototype.onsapincreasemodifiers=A.prototype._moveItem;A.prototype.onsapdecreasemodifiers=A.prototype._moveItem;A.prototype._getClosestItemBelowInThisContainer=function(t){var e=this.getItems().map(this._getItemWrapper).filter(function(e){return i.isBelow(t,e)});var r=i.findClosest(t,e);if(r){return c(r.firstElementChild).control(0)}return null};A.prototype._getClosestItemBelow=function(t){var e=this._getClosestItemBelowInThisContainer(t);if(e){return e}var r=Array.from(document.querySelectorAll(".sapFGridContainerItemWrapper")).filter(function(e){return i.isBelow(t,e)});e=i.findClosest(t,r);if(e){return c(e.firstElementChild).control(0)}return null};A.prototype._getClosestItemAboveInThisContainer=function(t){var e=this.getItems().map(this._getItemWrapper).filter(function(e){return i.isAbove(t,e)});var r=i.findClosest(t,e);if(r){return c(r.firstElementChild).control(0)}return null};A.prototype._getClosestItemAbove=function(t){var e=this._getClosestItemAboveInThisContainer(t);if(e){return e}var r=Array.from(document.querySelectorAll(".sapFGridContainerItemWrapper")).filter(function(e){return i.isAbove(t,e)});e=i.findClosest(t,r);if(e){return c(e.firstElementChild).control(0)}return null};A.prototype.focusItem=function(t){var e,i=this._oItemNavigation;this._setItemNavigationItems();e=i.getItemDomRefs();if(e[t]){e[t].focus()}};A.prototype._isItemWrapper=function(t){return t.classList.contains("sapFGridContainerItemWrapper")};A.prototype._getItemWrapper=function(t){var e=t.getDomRef(),i;if(e){return e.parentElement}i=document.getElementById(h.createInvisiblePlaceholderId(t));if(i){return i.parentElement}return null};return A});