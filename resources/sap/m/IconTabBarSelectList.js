/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","sap/ui/core/Control","sap/ui/core/Core","sap/ui/core/delegate/ItemNavigation","./IconTabBarDragAndDropUtil","sap/ui/core/dnd/DropPosition","./IconTabBarSelectListRenderer","sap/ui/thirdparty/jquery"],function(e,t,o,i,r,n,a,s){"use strict";var g=t.extend("sap.m.IconTabBarSelectList",{metadata:{library:"sap.m",aggregations:{items:{type:"sap.m.IconTab",multiple:true,singularName:"item",dnd:true}},events:{selectionChange:{parameters:{selectedItem:{type:"sap.m.IconTabFilter"}}}}}});g.prototype.init=function(){this._oItemNavigation=new i;this._oItemNavigation.setCycling(false);this.addEventDelegate(this._oItemNavigation);this._oItemNavigation.setPageSize(10);this._oIconTabHeader=null;this._oTabFilter=null};g.prototype.exit=function(){this._oItemNavigation.destroy();this._oItemNavigation=null;this._oIconTabHeader=null;this._oTabFilter=null};g.prototype.onBeforeRendering=function(){if(!this._oIconTabHeader){return}this.destroyDragDropConfig();this._setsDragAndConfiguration()};g.prototype.onAfterRendering=function(){this._initItemNavigation();this.getItems().forEach(function(e){if(e._onAfterParentRendering){e._onAfterParentRendering()}})};g.prototype._setsDragAndConfiguration=function(){if(this._oIconTabHeader.getEnableTabReordering()&&!this.getDragDropConfig().length){r.setDragDropAggregations(this,"Vertical",this._oIconTabHeader._getDropPosition())}};g.prototype._initItemNavigation=function(){var e=this.getItems(),t=[],o=this._oIconTabHeader.oSelectedItem,i=-1,r,n;for(n=0;n<e.length;n++){r=e[n];if(r.isA("sap.m.IconTabFilter")){var a=r._getAllSubFiltersDomRefs();t=t.concat(r.getDomRef(),a)}if(o&&this.getSelectedItem()&&this.getSelectedItem()._getRealTab()===o){i=n}}if(o&&t.indexOf(o.getDomRef())!==-1){i=t.indexOf(o.getDomRef())}this._oItemNavigation.setRootDomRef(this.getDomRef()).setItemDomRefs(t).setSelectedIndex(i)};g.prototype.getVisibleItems=function(){return this.getItems().filter(function(e){return e.getVisible()})};g.prototype.getVisibleTabFilters=function(){return this.getVisibleItems().filter(function(e){return e.isA("sap.m.IconTabFilter")})};g.prototype.setSelectedItem=function(e){this._selectedItem=e};g.prototype.getSelectedItem=function(){return this._selectedItem};g.prototype.ontap=function(e){var t=e.srcControl;if(!t){return}if(!t.isA("sap.m.IconTabFilter")){return}if(this._oIconTabHeader._isUnselectable(t)){return}e.preventDefault();if(t!=this.getSelectedItem()){this.fireSelectionChange({selectedItem:t})}};g.prototype.onsapenter=g.prototype.ontap;g.prototype.onsapspace=g.prototype.ontap;g.prototype.checkIconOnly=function(){this._bIconOnly=this.getVisibleTabFilters().every(function(e){return!e.getText()&&!e.getCount()});return this._bIconOnly};g.prototype._handleDragAndDrop=function(e){var t=e.getParameter("dropPosition"),o=e.getParameter("draggedControl"),i=e.getParameter("droppedControl"),a=i._getRealTab().getParent(),s=this._oIconTabHeader.getMaxNestingLevel();if(this._oTabFilter._bIsOverflow){a=this._oIconTabHeader}if(t===n.On){a=i._getRealTab()}r.handleDrop(a,t,o._getRealTab(),i._getRealTab(),true,s);this._oIconTabHeader._setItemsForStrip();this._oIconTabHeader._initItemNavigation();this._oTabFilter._setSelectListItems();this._initItemNavigation();i._getRealTab().getParent().$().trigger("focus")};g.prototype.ondragrearranging=function(e){if(!this._oIconTabHeader.getEnableTabReordering()){return}var t=e.srcControl,o=e.keyCode,i=this.indexOfItem(t),n=this;r.moveItem.call(n,t,o,n.getItems().length-1);this._initItemNavigation();t.$().trigger("focus");if(i===this.indexOfItem(t)){return}n=t._getRealTab().getParent();if(this._oTabFilter._bIsOverflow&&t._getRealTab()._getNestedLevel()===1){this._oIconTabHeader._moveTab(t._getRealTab(),o,this._oIconTabHeader.getItems().length-1)}else{r.moveItem.call(n,t._getRealTab(),o,n.getItems().length-1)}};g.prototype.onsaphomemodifiers=g.prototype.ondragrearranging;g.prototype.onsapendmodifiers=g.prototype.ondragrearranging;g.prototype.onsapincreasemodifiers=g.prototype.ondragrearranging;g.prototype.onsapdecreasemodifiers=g.prototype.ondragrearranging;return g});