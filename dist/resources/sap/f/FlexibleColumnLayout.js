/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","./library","sap/ui/Device","sap/ui/core/ResizeHandler","sap/ui/core/Control","sap/m/library","sap/m/Button","sap/m/NavContainer","sap/ui/core/Configuration","sap/ui/core/theming/Parameters","sap/ui/dom/units/Rem","./FlexibleColumnLayoutRenderer","sap/base/Log","sap/base/assert","sap/base/util/merge"],function(e,t,n,i,o,s,r,a,u,l,d,h,p,m,g){"use strict";var C=t.LayoutType;var c=o.extend("sap.f.FlexibleColumnLayout",{metadata:{properties:{autoFocus:{type:"boolean",group:"Behavior",defaultValue:true},layout:{type:"sap.f.LayoutType",defaultValue:C.OneColumn},defaultTransitionNameBeginColumn:{type:"string",group:"Appearance",defaultValue:"slide"},defaultTransitionNameMidColumn:{type:"string",group:"Appearance",defaultValue:"slide"},defaultTransitionNameEndColumn:{type:"string",group:"Appearance",defaultValue:"slide"},backgroundDesign:{type:"sap.m.BackgroundDesign",group:"Appearance",defaultValue:s.BackgroundDesign.Transparent},restoreFocusOnBackNavigation:{type:"boolean",group:"Behavior",defaultValue:false}},aggregations:{beginColumnPages:{type:"sap.ui.core.Control",multiple:true,forwarding:{getter:"_getBeginColumn",aggregation:"pages"}},midColumnPages:{type:"sap.ui.core.Control",multiple:true,forwarding:{getter:"_getMidColumn",aggregation:"pages"}},endColumnPages:{type:"sap.ui.core.Control",multiple:true,forwarding:{getter:"_getEndColumn",aggregation:"pages"}},_beginColumnNav:{type:"sap.m.NavContainer",multiple:false,visibility:"hidden"},_midColumnNav:{type:"sap.m.NavContainer",multiple:false,visibility:"hidden"},_endColumnNav:{type:"sap.m.NavContainer",multiple:false,visibility:"hidden"},_beginColumnBackArrow:{type:"sap.m.Button",multiple:false,visibility:"hidden"},_midColumnForwardArrow:{type:"sap.m.Button",multiple:false,visibility:"hidden"},_midColumnBackArrow:{type:"sap.m.Button",multiple:false,visibility:"hidden"},_endColumnForwardArrow:{type:"sap.m.Button",multiple:false,visibility:"hidden"}},associations:{initialBeginColumnPage:{type:"sap.ui.core.Control",multiple:false},initialMidColumnPage:{type:"sap.ui.core.Control",multiple:false},initialEndColumnPage:{type:"sap.ui.core.Control",multiple:false}},events:{stateChange:{parameters:{layout:{type:"sap.f.LayoutType"},maxColumnsCount:{type:"int"},isNavigationArrow:{type:"boolean"},isResize:{type:"boolean"}}},beginColumnNavigate:{allowPreventDefault:true,parameters:{from:{type:"sap.ui.core.Control"},fromId:{type:"string"},to:{type:"sap.ui.core.Control"},toId:{type:"string"},firstTime:{type:"boolean"},isTo:{type:"boolean"},isBack:{type:"boolean"},isBackToTop:{type:"boolean"},isBackToPage:{type:"boolean"},direction:{type:"string"}}},afterBeginColumnNavigate:{parameters:{from:{type:"sap.ui.core.Control"},fromId:{type:"string"},to:{type:"sap.ui.core.Control"},toId:{type:"string"},firstTime:{type:"boolean"},isTo:{type:"boolean"},isBack:{type:"boolean"},isBackToTop:{type:"boolean"},isBackToPage:{type:"boolean"},direction:{type:"string"}}},midColumnNavigate:{allowPreventDefault:true,parameters:{from:{type:"sap.ui.core.Control"},fromId:{type:"string"},to:{type:"sap.ui.core.Control"},toId:{type:"string"},firstTime:{type:"boolean"},isTo:{type:"boolean"},isBack:{type:"boolean"},isBackToTop:{type:"boolean"},isBackToPage:{type:"boolean"},direction:{type:"string"}}},afterMidColumnNavigate:{parameters:{from:{type:"sap.ui.core.Control"},fromId:{type:"string"},to:{type:"sap.ui.core.Control"},toId:{type:"string"},firstTime:{type:"boolean"},isTo:{type:"boolean"},isBack:{type:"boolean"},isBackToTop:{type:"boolean"},isBackToPage:{type:"boolean"},direction:{type:"string"}}},endColumnNavigate:{allowPreventDefault:true,parameters:{from:{type:"sap.ui.core.Control"},fromId:{type:"string"},to:{type:"sap.ui.core.Control"},toId:{type:"string"},firstTime:{type:"boolean"},isTo:{type:"boolean"},isBack:{type:"boolean"},isBackToTop:{type:"boolean"},isBackToPage:{type:"boolean"},direction:{type:"string"}}},afterEndColumnNavigate:{parameters:{from:{type:"sap.ui.core.Control"},fromId:{type:"string"},to:{type:"sap.ui.core.Control"},toId:{type:"string"},firstTime:{type:"boolean"},isTo:{type:"boolean"},isBack:{type:"boolean"},isBackToTop:{type:"boolean"},isBackToPage:{type:"boolean"},direction:{type:"string"}}},columnResize:{parameters:{beginColumn:{type:"boolean"},midColumn:{type:"boolean"},endColumn:{type:"boolean"}}}}}});c.COLUMN_RESIZING_ANIMATION_DURATION=560;c.PINNED_COLUMN_CLASS_NAME="sapFFCLPinnedColumn";c.COLUMN_ORDER=["begin","mid","end"];c.prototype.init=function(){this._iWidth=0;this._oColumnFocusInfo={begin:{},mid:{},end:{}};this._initNavContainers();this._initButtons();this._oLayoutHistory=new _;this._oAnimationEndListener=new f;this._oRenderedColumnPagesBoolMap={};this._iNavigationArrowWidth=d.toPx(l.get("_sap_f_FCL_navigation_arrow_width"));this._oColumnWidthInfo={begin:0,mid:0,end:0}};c.prototype._onNavContainerRendered=function(e){var t=e.srcControl,n=t.getPages().length>0,i=this._hasAnyColumnPagesRendered();this._setColumnPagesRendered(t.getId(),n);if(this._hasAnyColumnPagesRendered()!==i){this._hideShowArrows()}};c.prototype._createNavContainer=function(e){var t=e.charAt(0).toUpperCase()+e.slice(1);var n=new a(this.getId()+"-"+e+"ColumnNav",{autoFocus:this.getAutoFocus(),navigate:function(t){this._handleNavigationEvent(t,false,e)}.bind(this),afterNavigate:function(t){this._handleNavigationEvent(t,true,e)}.bind(this),defaultTransitionName:this["getDefaultTransitionName"+t+"Column"]()});n.addDelegate({onAfterRendering:this._onNavContainerRendered},this);this["_"+e+"ColumnFocusOutDelegate"]={onfocusout:function(t){this._oColumnFocusInfo[e]=t.target}};n.addEventDelegate(this["_"+e+"ColumnFocusOutDelegate"],this);return n};c.prototype._handleNavigationEvent=function(e,t,n){var i,o;if(t){i="after"+(n.charAt(0).toUpperCase()+n.slice(1))+"ColumnNavigate"}else{i=n+"ColumnNavigate"}o=this.fireEvent(i,e.mParameters,true);if(!o){e.preventDefault()}};c.prototype._getColumnByStringName=function(e){if(e==="end"){return this._getEndColumn()}else if(e==="mid"){return this._getMidColumn()}else{return this._getBeginColumn()}};c.prototype._getBeginColumn=function(){return this.getAggregation("_beginColumnNav")};c.prototype._getMidColumn=function(){return this.getAggregation("_midColumnNav")};c.prototype._getEndColumn=function(){return this.getAggregation("_endColumnNav")};c.prototype._flushColumnContent=function(e){var t=this.getAggregation("_"+e+"ColumnNav"),n=sap.ui.getCore().createRenderManager();n.renderControl(t);n.flush(this._$columns[e].find(".sapFFCLColumnContent")[0],undefined,true);n.destroy()};c.prototype.setLayout=function(e){e=this.validateProperty("layout",e);var t=this.getLayout();if(t===e){return this}var n=this.setProperty("layout",e,true);this._oLayoutHistory.addEntry(e);this._hideShowArrows();this._resizeColumns();return n};c.prototype.setAutoFocus=function(e){e=this.validateProperty("autoFocus",e);var t=this.getAutoFocus();if(t===e){return this}this._getNavContainers().forEach(function(t){t.setAutoFocus(e)});return this.setProperty("autoFocus",e,true)};c.prototype.onBeforeRendering=function(){this._deregisterResizeHandler();this._oAnimationEndListener.cancelAll()};c.prototype.onAfterRendering=function(){this._measureControlWidth();this._registerResizeHandler();this._cacheDOMElements();this._hideShowArrows();this._resizeColumns();this._flushColumnContent("begin");this._flushColumnContent("mid");this._flushColumnContent("end");this._fireStateChange(false,false)};c.prototype._restoreFocusToColumn=function(t){var n=this._oColumnFocusInfo[t];if(!n||e.isEmptyObject(n)){n=this._getFirstFocusableElement(t)}e(n).trigger("focus")};c.prototype._getFirstFocusableElement=function(e){var t=this._getColumnByStringName(e),n=t.getCurrentPage();if(n){return n.$().firstFocusableDomRef()}return null};c.prototype._isFocusInSomeOfThePreviousColumns=function(){var e=c.COLUMN_ORDER.indexOf(this._sPreviuosLastVisibleColumn)-1,t;for(;e>=0;e--){t=this._getColumnByStringName(c.COLUMN_ORDER[e]);if(t&&t._isFocusInControl(t)){return true}}return false};c.prototype._getControlWidth=function(){if(this._iWidth===0){this._measureControlWidth()}return this._iWidth};c.prototype._measureControlWidth=function(){if(this.$().is(":visible")){this._iWidth=this.$().width()}else{this._iWidth=0}};c.prototype.exit=function(){this._removeNavContainersFocusOutDelegate();this._oRenderedColumnPagesBoolMap=null;this._oColumnFocusInfo=null;this._deregisterResizeHandler();this._handleEvent(e.Event("Destroy"))};c.prototype._removeNavContainersFocusOutDelegate=function(){c.COLUMN_ORDER.forEach(function(e){this._getColumnByStringName(e).removeEventDelegate(this["_"+e+"ColumnFocusOutDelegate"])},this)};c.prototype._registerResizeHandler=function(){m(!this._iResizeHandlerId,"Resize handler already registered");this._iResizeHandlerId=i.register(this,this._onResize.bind(this))};c.prototype._deregisterResizeHandler=function(){if(this._iResizeHandlerId){i.deregister(this._iResizeHandlerId);this._iResizeHandlerId=null}};c.prototype._initNavContainers=function(){this.setAggregation("_beginColumnNav",this._createNavContainer("begin"),true);this.setAggregation("_midColumnNav",this._createNavContainer("mid"),true);this.setAggregation("_endColumnNav",this._createNavContainer("end"),true)};c.prototype._getNavContainers=function(){return[this._getBeginColumn(),this._getMidColumn(),this._getEndColumn()]};c.prototype._initButtons=function(){var e=new r(this.getId()+"-beginBack",{icon:"sap-icon://slim-arrow-left",tooltip:c._getResourceBundle().getText("FCL_BEGIN_COLUMN_BACK_ARROW"),type:"Transparent",press:this._onArrowClick.bind(this,"left")}).addStyleClass("sapFFCLNavigationButton").addStyleClass("sapFFCLNavigationButtonRight");this.setAggregation("_beginColumnBackArrow",e,true);var t=new r(this.getId()+"-midForward",{icon:"sap-icon://slim-arrow-right",tooltip:c._getResourceBundle().getText("FCL_MID_COLUMN_FORWARD_ARROW"),type:"Transparent",press:this._onArrowClick.bind(this,"right")}).addStyleClass("sapFFCLNavigationButton").addStyleClass("sapFFCLNavigationButtonLeft");this.setAggregation("_midColumnForwardArrow",t,true);var n=new r(this.getId()+"-midBack",{icon:"sap-icon://slim-arrow-left",tooltip:c._getResourceBundle().getText("FCL_MID_COLUMN_BACK_ARROW"),type:"Transparent",press:this._onArrowClick.bind(this,"left")}).addStyleClass("sapFFCLNavigationButton").addStyleClass("sapFFCLNavigationButtonRight");this.setAggregation("_midColumnBackArrow",n,true);var i=new r(this.getId()+"-endForward",{icon:"sap-icon://slim-arrow-right",tooltip:c._getResourceBundle().getText("FCL_END_COLUMN_FORWARD_ARROW"),type:"Transparent",press:this._onArrowClick.bind(this,"right")}).addStyleClass("sapFFCLNavigationButton").addStyleClass("sapFFCLNavigationButtonLeft");this.setAggregation("_endColumnForwardArrow",i,true)};c.prototype._cacheDOMElements=function(){this._cacheColumns();if(!n.system.phone){this._cacheArrows()}};c.prototype._cacheColumns=function(){this._$columns={begin:this.$("beginColumn"),mid:this.$("midColumn"),end:this.$("endColumn")}};c.prototype._cacheArrows=function(){this._oColumnSeparatorArrows={beginBack:this.$("beginBack"),midForward:this.$("midForward"),midBack:this.$("midBack"),endForward:this.$("endForward")}};c.prototype._getVisibleColumnsCount=function(){return c.COLUMN_ORDER.filter(function(e){return this._getColumnSize(e)>0},this).length};c.prototype._getVisibleArrowsCount=function(){if(!this._oColumnSeparatorArrows){return 0}return Object.keys(this._oColumnSeparatorArrows).filter(function(e){return this._oColumnSeparatorArrows[e].data("visible")},this).length};c.prototype._getTotalColumnsWidth=function(e){var t=this._getVisibleArrowsCount();if(e){t++}return this._getControlWidth()-t*this._iNavigationArrowWidth};c.prototype._resizeColumns=function(){var e,t,o=c.COLUMN_ORDER.slice(),s=sap.ui.getCore().getConfiguration().getRTL(),r=sap.ui.getCore().getConfiguration().getAnimationMode(),a=r!==u.AnimationMode.none&&r!==u.AnimationMode.minimal,l,d,h,p,m,_,f,y={};if(!this.isActive()){return}d=this._getVisibleColumnsCount();if(d===0){return}p=this.getLayout();h=this._getMaxColumnsCountForLayout(p,c.DESKTOP_BREAKPOINT);m=o[h-1];f=this.getRestoreFocusOnBackNavigation()&&this._isNavigatingBackward(m)&&!this._isFocusInSomeOfThePreviousColumns();_=d===3&&p===C.ThreeColumnsEndExpanded;t=this._getTotalColumnsWidth(_);if(a){o.forEach(function(e){var t=this._shouldConcealColumn(h,e),n=this._shouldRevealColumn(h,e===m),i=this._$columns[e];i.toggleClass(c.PINNED_COLUMN_CLASS_NAME,t||n)},this);o.forEach(function(e){y[e]=this._oAnimationEndListener.isWaitingForColumnResizeEnd(this._$columns[e])},this);this._oAnimationEndListener.cancelAll()}o.forEach(function(o){var s=this._$columns[o],r=s.get(0),u,l,d,p,C,c,E;e=this._getColumnSize(o);u=Math.round(t*(e/100));if([100,0].indexOf(e)!==-1){l=e+"%"}else{l=u+"px"}E={previousAnimationCompleted:!y[s],iNewWidth:u,shouldRestoreFocus:f&&o===m,hidden:e===0&&this._oColumnWidthInfo[o]===0};if(a){d=this._shouldRevealColumn(h,o===m);p=this._shouldConcealColumn(h,o);C=d||p;E=g(E,{hasAnimations:true,shouldConcealColumn:p,pinned:C});c=this._canResizeColumnWithAnimation(o,E)}if(!p){s.toggleClass("sapFFCLColumnActive",e>0)}s.toggleClass("sapFFCLColumnInset",_&&o==="mid");s.removeClass("sapFFCLColumnHidden");s.removeClass("sapFFCLColumnOnlyActive");s.removeClass("sapFFCLColumnLastActive");s.removeClass("sapFFCLColumnFirstActive");if(c){i.suspend(r);this._oAnimationEndListener.waitForColumnResizeEnd(s).then(function(){i.resume(r)}).catch(function(){i.resume(r)})}if(!p){s.width(l)}else{this._oAnimationEndListener.waitForAllColumnsResizeEnd().then(function(){s.width(l)}).catch(function(){})}if(c||C){this._oAnimationEndListener.waitForAllColumnsResizeEnd().then(this._afterColumnResize.bind(this,o,E)).catch(function(){})}else{this._afterColumnResize(o,E)}if(!n.system.phone){this._updateColumnContextualSettings(o,u);this._updateColumnCSSClasses(o,u)}},this);l=o.filter(function(e){return this._getColumnSize(e)>0},this);if(s){o.reverse()}if(l.length===1){this._$columns[l[0]].addClass("sapFFCLColumnOnlyActive")}if(l.length>1){this._$columns[l[0]].addClass("sapFFCLColumnFirstActive");this._$columns[l[l.length-1]].addClass("sapFFCLColumnLastActive")}this._storePreviousResizingInfo(h,m)};c.prototype._afterColumnResize=function(e,t){var n=this._$columns[e],i=t.shouldConcealColumn,o=t.iNewWidth,s=t.shouldRestoreFocus;n.toggleClass(c.PINNED_COLUMN_CLASS_NAME,false);if(i){n.removeClass("sapFFCLColumnActive")}n.toggleClass("sapFFCLColumnHidden",o===0);this._cacheColumnWidth(e,o);if(s){this._restoreFocusToColumn(e)}};c.prototype._getColumnWidth=function(e){var t=this._$columns[e].get(0),n=t.style.width,i=parseInt(n),o;if(/px$/.test(n)){return i}o=/%$/.test(n);if(o&&i===100){return this._getControlWidth()}if(o&&i===0){return 0}return t.offsetWidth};c.prototype._cacheColumnWidth=function(e,t){var n;if(this._oColumnWidthInfo[e]!==t){n={};c.COLUMN_ORDER.forEach(function(t){n[t+"Column"]=t===e});this.fireColumnResize(n)}this._oColumnWidthInfo[e]=t};c.prototype._storePreviousResizingInfo=function(e,t){var n=this.getLayout();this._iPreviousVisibleColumnsCount=e;this._bWasFullScreen=n===C.MidColumnFullScreen||n===C.EndColumnFullScreen;this._sPreviuosLastVisibleColumn=t};c.prototype._isNavigatingBackward=function(e){return this._bWasFullScreen||c.COLUMN_ORDER.indexOf(this._sPreviuosLastVisibleColumn)>c.COLUMN_ORDER.indexOf(e)};c.prototype._shouldRevealColumn=function(e,t){return e>this._iPreviousVisibleColumnsCount&&!this._bWasFullScreen&&t};c.prototype._shouldConcealColumn=function(e,t){return e<this._iPreviousVisibleColumnsCount&&t===this._sPreviuosLastVisibleColumn&&!this._bWasFullScreen&&this._getColumnSize(t)===0};c.prototype._canResizeColumnWithAnimation=function(e,t){var n,i,o=t.iNewWidth,s=t.hasAnimations,r=t.pinned,a=t.hidden,u=!t.previousAnimationCompleted;if(!s||r||a){return false}n=this._$columns[e];if(u){return n.width()!==o}i=!n.get(0).style.width;if(i){return false}return this._getColumnWidth(e)!==o};c.prototype._propagateContextualSettings=function(){};c.prototype._updateColumnContextualSettings=function(e,t){var n,i;n=this.getAggregation("_"+e+"ColumnNav");if(!n){return}i=n._getContextualSettings();if(!i||i.contextualWidth!==t){n._applyContextualSettings({contextualWidth:t})}};c.prototype._updateColumnCSSClasses=function(e,t){var i="";this._$columns[e].removeClass("sapUiContainer-Narrow sapUiContainer-Medium sapUiContainer-Wide sapUiContainer-ExtraWide");if(t<n.media._predefinedRangeSets[n.media.RANGESETS.SAP_STANDARD_EXTENDED].points[0]){i="Narrow"}else if(t<n.media._predefinedRangeSets[n.media.RANGESETS.SAP_STANDARD_EXTENDED].points[1]){i="Medium"}else if(t<n.media._predefinedRangeSets[n.media.RANGESETS.SAP_STANDARD_EXTENDED].points[2]){i="Wide"}else{i="ExtraWide"}this._$columns[e].addClass("sapUiContainer-"+i)};c.prototype._getColumnSize=function(e){var t=this.getLayout(),n=this._getColumnWidthDistributionForLayout(t),i=n.split("/"),o={begin:0,mid:1,end:2},s=i[o[e]];return parseInt(s)};c.prototype.getMaxColumnsCount=function(){return this._getMaxColumnsCountForWidth(this._getControlWidth())};c.prototype._getMaxColumnsCountForWidth=function(e){if(e>=c.DESKTOP_BREAKPOINT){return 3}if(e>=c.TABLET_BREAKPOINT&&e<c.DESKTOP_BREAKPOINT){return 2}if(e>0){return 1}return 0};c.prototype._getMaxColumnsCountForLayout=function(e,t){var n=this._getMaxColumnsCountForWidth(t),i=this._getColumnWidthDistributionForLayout(e,false,n),o=i.split("/"),s={begin:0,mid:1,end:2},r,a,u=0;Object.keys(s).forEach(function(e){r=o[s[e]];a=parseInt(r);if(a){u++}});return u};c.prototype._onResize=function(e){var t=e.oldSize.width,n=e.size.width,i,o;this._iWidth=n;if(n===0){return}i=this._getMaxColumnsCountForWidth(t);o=this._getMaxColumnsCountForWidth(n);this._resizeColumns();if(o!==i){this._hideShowArrows();this._fireStateChange(false,true)}};c.prototype._setColumnPagesRendered=function(e,t){this._oRenderedColumnPagesBoolMap[e]=t};c.prototype._hasAnyColumnPagesRendered=function(){return Object.keys(this._oRenderedColumnPagesBoolMap).some(function(e){return this._oRenderedColumnPagesBoolMap[e]},this)};c.prototype._onArrowClick=function(e){var t=this.getLayout(),n=typeof c.SHIFT_TARGETS[t]!=="undefined"&&typeof c.SHIFT_TARGETS[t][e]!=="undefined",i;m(n,"An invalid layout was used for determining arrow behavior");i=n?c.SHIFT_TARGETS[t][e]:C.OneColumn;this.setLayout(i);if(c.ARROWS_NAMES[i][e]!==c.ARROWS_NAMES[t][e]&&n){var o=e==="right"?"left":"right";this._oColumnSeparatorArrows[c.ARROWS_NAMES[i][o]].focus()}this._fireStateChange(true,false)};c.prototype._hideShowArrows=function(){var e=this.getLayout(),t={},i=[],o,s;if(!this.isActive()||n.system.phone){return}o=this.getMaxColumnsCount();if(o>1){t[C.TwoColumnsBeginExpanded]=["beginBack"];t[C.TwoColumnsMidExpanded]=["midForward"];t[C.ThreeColumnsMidExpanded]=["midForward","midBack"];t[C.ThreeColumnsEndExpanded]=["endForward"];t[C.ThreeColumnsMidExpandedEndHidden]=["midForward","midBack"];t[C.ThreeColumnsBeginExpandedEndHidden]=["beginBack"];if(typeof t[e]==="object"){i=t[e]}}s=this._hasAnyColumnPagesRendered();Object.keys(this._oColumnSeparatorArrows).forEach(function(e){this._toggleButton(e,i.indexOf(e)!==-1,s)},this)};c.prototype._toggleButton=function(e,t,n){this._oColumnSeparatorArrows[e].toggle(t&&n);this._oColumnSeparatorArrows[e].data("visible",t)};c.prototype._fireStateChange=function(e,t){if(this._getControlWidth()===0){return}this.fireStateChange({isNavigationArrow:e,isResize:t,layout:this.getLayout(),maxColumnsCount:this.getMaxColumnsCount()})};c.prototype.setInitialBeginColumnPage=function(e){this._getBeginColumn().setInitialPage(e);this.setAssociation("initialBeginColumnPage",e,true);return this};c.prototype.setInitialMidColumnPage=function(e){this._getMidColumn().setInitialPage(e);this.setAssociation("initialMidColumnPage",e,true);return this};c.prototype.setInitialEndColumnPage=function(e){this._getEndColumn().setInitialPage(e);this.setAssociation("initialEndColumnPage",e,true);return this};c.prototype.to=function(e,t,n,i){if(this._getBeginColumn().getPage(e)){this._getBeginColumn().to(e,t,n,i)}else if(this._getMidColumn().getPage(e)){this._getMidColumn().to(e,t,n,i)}else{this._getEndColumn().to(e,t,n,i)}return this};c.prototype.backToPage=function(e,t,n){if(this._getBeginColumn().getPage(e)){this._getBeginColumn().backToPage(e,t,n)}else if(this._getMidColumn().getPage(e)){this._getMidColumn().backToPage(e,t,n)}else{this._getEndColumn().backToPage(e,t,n)}return this};c.prototype._safeBackToPage=function(e,t,n,i){if(this._getBeginColumn().getPage(e)){this._getBeginColumn()._safeBackToPage(e,t,n,i)}else if(this._getMidColumn().getPage(e)){this._getMidColumn()._safeBackToPage(e,t,n,i)}else{this._getEndColumn()._safeBackToPage(e,t,n,i)}};c.prototype.toBeginColumnPage=function(e,t,n,i){this._getBeginColumn().to(e,t,n,i);return this};c.prototype.toMidColumnPage=function(e,t,n,i){this._getMidColumn().to(e,t,n,i);return this};c.prototype.toEndColumnPage=function(e,t,n,i){this._getEndColumn().to(e,t,n,i);return this};c.prototype.backBeginColumn=function(e,t){return this._getBeginColumn().back(e,t)};c.prototype.backMidColumn=function(e,t){return this._getMidColumn().back(e,t)};c.prototype.backEndColumn=function(e,t){return this._getEndColumn().back(e,t)};c.prototype.backBeginColumnToPage=function(e,t,n){return this._getBeginColumn().backToPage(e,t,n)};c.prototype.backMidColumnToPage=function(e,t,n){return this._getMidColumn().backToPage(e,t,n)};c.prototype.backEndColumnToPage=function(e,t,n){return this._getEndColumn().backToPage(e,t,n)};c.prototype.backToTopBeginColumn=function(e,t){this._getBeginColumn().backToTop(e,t);return this};c.prototype.backToTopMidColumn=function(e,t){this._getMidColumn().backToTop(e,t);return this};c.prototype.backToTopEndColumn=function(e,t){this._getEndColumn().backToTop(e,t);return this};c.prototype.getCurrentBeginColumnPage=function(){return this._getBeginColumn().getCurrentPage()};c.prototype.getCurrentMidColumnPage=function(){return this._getMidColumn().getCurrentPage()};c.prototype.getCurrentEndColumnPage=function(){return this._getEndColumn().getCurrentPage()};c.prototype.setDefaultTransitionNameBeginColumn=function(e){this.setProperty("defaultTransitionNameBeginColumn",e,true);this._getBeginColumn().setDefaultTransitionName(e);return this};c.prototype.setDefaultTransitionNameMidColumn=function(e){this.setProperty("defaultTransitionNameMidColumn",e,true);this._getMidColumn().setDefaultTransitionName(e);return this};c.prototype.setDefaultTransitionNameEndColumn=function(e){this.setProperty("defaultTransitionNameEndColumn",e,true);this._getEndColumn().setDefaultTransitionName(e);return this};c.prototype._getLayoutHistory=function(){return this._oLayoutHistory};c.prototype._getColumnWidthDistributionForLayout=function(e,t,n){var i={},o;n||(n=this.getMaxColumnsCount());if(n===0){o="0/0/0"}else{i[C.OneColumn]="100/0/0";i[C.MidColumnFullScreen]="0/100/0";i[C.EndColumnFullScreen]="0/0/100";if(n===1){i[C.TwoColumnsBeginExpanded]="0/100/0";i[C.TwoColumnsMidExpanded]="0/100/0";i[C.ThreeColumnsMidExpanded]="0/0/100";i[C.ThreeColumnsEndExpanded]="0/0/100";i[C.ThreeColumnsMidExpandedEndHidden]="0/0/100";i[C.ThreeColumnsBeginExpandedEndHidden]="0/0/100"}else{i[C.TwoColumnsBeginExpanded]="67/33/0";i[C.TwoColumnsMidExpanded]="33/67/0";i[C.ThreeColumnsMidExpanded]=n===2?"0/67/33":"25/50/25";i[C.ThreeColumnsEndExpanded]=n===2?"0/33/67":"25/25/50";i[C.ThreeColumnsMidExpandedEndHidden]="33/67/0";i[C.ThreeColumnsBeginExpandedEndHidden]="67/33/0"}o=i[e]}if(t){o=o.split("/").map(function(e){return parseInt(e)})}return o};c.DESKTOP_BREAKPOINT=1280;c.TABLET_BREAKPOINT=960;c.ARROWS_NAMES={TwoColumnsBeginExpanded:{left:"beginBack"},TwoColumnsMidExpanded:{right:"midForward"},ThreeColumnsMidExpanded:{left:"midBack",right:"midForward"},ThreeColumnsEndExpanded:{right:"endForward"},ThreeColumnsMidExpandedEndHidden:{left:"midBack",right:"midForward"},ThreeColumnsBeginExpandedEndHidden:{left:"beginBack"}};c._getResourceBundle=function(){return sap.ui.getCore().getLibraryResourceBundle("sap.f")};c.SHIFT_TARGETS={TwoColumnsBeginExpanded:{left:C.TwoColumnsMidExpanded},TwoColumnsMidExpanded:{right:C.TwoColumnsBeginExpanded},ThreeColumnsMidExpanded:{left:C.ThreeColumnsEndExpanded,right:C.ThreeColumnsMidExpandedEndHidden},ThreeColumnsEndExpanded:{right:C.ThreeColumnsMidExpanded},ThreeColumnsMidExpandedEndHidden:{left:C.ThreeColumnsMidExpanded,right:C.ThreeColumnsBeginExpandedEndHidden},ThreeColumnsBeginExpandedEndHidden:{left:C.ThreeColumnsMidExpandedEndHidden}};function _(){this._aLayoutHistory=[]}_.prototype.addEntry=function(e){if(typeof e!=="undefined"){this._aLayoutHistory.push(e)}};_.prototype.getClosestEntryThatMatches=function(e){var t;for(t=this._aLayoutHistory.length-1;t>=0;t--){if(e.indexOf(this._aLayoutHistory[t])!==-1){return this._aLayoutHistory[t]}}};function f(){this._oListeners={};this._aPendingPromises=[];this._oPendingPromises={};this._oCancelPromises={};this._oPendingPromiseAll=null}f.prototype.waitForColumnResizeEnd=function(e){var t=e.get(0).id,n;if(!this._oPendingPromises[t]){n=new Promise(function(n,i){p.debug("FlexibleColumnLayout","wait for column "+t+" to resize");this._attachTransitionEnd(e,function(){p.debug("FlexibleColumnLayout","completed column "+t+" resize");this._cleanUp(e);n()}.bind(this));this._oCancelPromises[t]={cancel:function(){p.debug("FlexibleColumnLayout","cancel column "+t+" resize");this._cleanUp(e);i()}.bind(this)}}.bind(this));this._aPendingPromises.push(n);this._oPendingPromises[t]=n}return this._oPendingPromises[t]};f.prototype.waitForAllColumnsResizeEnd=function(){if(!this._oPendingPromiseAll){this._oPendingPromiseAll=new Promise(function(e,t){this.iTimer=setTimeout(function(){Promise.all(this._aPendingPromises).then(function(){p.debug("FlexibleColumnLayout","completed all columns resize");e()},0).catch(function(){t()});this.iTimer=null}.bind(this))}.bind(this))}return this._oPendingPromiseAll};f.prototype.isWaitingForColumnResizeEnd=function(e){var t=e.get(0).id;return!!this._oListeners[t]};f.prototype.cancelAll=function(){Object.keys(this._oCancelPromises).forEach(function(e){this._oCancelPromises[e].cancel()},this);this._oPendingPromises={};this._aPendingPromises=[];this._oCancelPromises={};this._oPendingPromiseAll=null;if(this.iTimer){clearTimeout(this.iTimer);this.iTimer=null}p.debug("FlexibleColumnLayout","detached all listeners for columns resize")};f.prototype._attachTransitionEnd=function(e,t){var n=e.get(0).id;if(!this._oListeners[n]){e.on("webkitTransitionEnd transitionend",t);this._oListeners[n]=t}};f.prototype._detachTransitionEnd=function(e){var t=e.get(0).id;if(this._oListeners[t]){e.off("webkitTransitionEnd transitionend",this._oListeners[t]);this._oListeners[t]=null}};f.prototype._cleanUp=function(e){if(e.length){var t=e.get(0).id;this._detachTransitionEnd(e);delete this._oPendingPromises[t];delete this._oCancelPromises[t]}};return c});