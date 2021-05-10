/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Control","sap/ui/Device","sap/ui/core/LocaleData","sap/ui/core/delegate/ItemNavigation","sap/ui/unified/calendar/CalendarUtils","sap/ui/unified/calendar/CalendarDate","sap/ui/unified/DateRange","sap/ui/unified/DateTypeRange","sap/ui/unified/library","sap/ui/core/format/DateFormat","sap/ui/core/library","sap/ui/core/Locale","./MonthRenderer","sap/ui/dom/containsOrEquals","sap/ui/events/KeyCodes","sap/ui/thirdparty/jquery"],function(e,t,a,i,s,r,o,n,l,h,d,g,u,p,c,f){"use strict";var y=d.CalendarType;var m=l.CalendarDayType;var D=e.extend("sap.ui.unified.calendar.Month",{metadata:{library:"sap.ui.unified",properties:{date:{type:"object",group:"Data"},intervalSelection:{type:"boolean",group:"Behavior",defaultValue:false},singleSelection:{type:"boolean",group:"Behavior",defaultValue:true},showHeader:{type:"boolean",group:"Appearance",defaultValue:false},firstDayOfWeek:{type:"int",group:"Appearance",defaultValue:-1},nonWorkingDays:{type:"int[]",group:"Appearance",defaultValue:null},primaryCalendarType:{type:"sap.ui.core.CalendarType",group:"Appearance"},secondaryCalendarType:{type:"sap.ui.core.CalendarType",group:"Appearance"},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},showWeekNumbers:{type:"boolean",group:"Appearance",defaultValue:true}},aggregations:{selectedDates:{type:"sap.ui.unified.DateRange",multiple:true,singularName:"selectedDate"},specialDates:{type:"sap.ui.unified.DateTypeRange",multiple:true,singularName:"specialDate"},disabledDates:{type:"sap.ui.unified.DateRange",multiple:true,singularName:"disabledDate"}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"},legend:{type:"sap.ui.unified.CalendarLegend",multiple:false}},events:{select:{},focus:{parameters:{date:{type:"object"},otherMonth:{type:"boolean"},restoreOldDate:{type:"boolean"}}},weekNumberSelect:{allowPreventDefault:true,parameters:{weekNumber:{type:"int"},weekDays:{type:"sap.ui.unified.DateRange"}}}}}});D.prototype.init=function(){var e=sap.ui.getCore().getConfiguration().getCalendarType();this.setProperty("primaryCalendarType",e);this.setProperty("secondaryCalendarType",e);this._oFormatYyyymmdd=h.getInstance({pattern:"yyyyMMdd",calendarType:y.Gregorian});this._oFormatLong=h.getInstance({style:"long",calendarType:e});this._mouseMoveProxy=f.proxy(this._handleMouseMove,this);this._iColumns=7;this._aVisibleDays=[]};D.prototype._getAriaRole=function(){return"gridcell"};D.prototype.exit=function(){if(this._oItemNavigation){this.removeDelegate(this._oItemNavigation);this._oItemNavigation.destroy();delete this._oItemNavigation}if(this._sInvalidateMonth){clearTimeout(this._sInvalidateMonth)}this._aVisibleDays=null};D.prototype.getFocusDomRef=function(){return this._oItemNavigation.getItemDomRefs()[this._oItemNavigation.getFocusedIndex()]};D.prototype.onAfterRendering=function(){v.call(this);L.call(this)};D.prototype.onmouseover=function(e){var t=f(e.target),a=this.getSelectedDates()[0],i,s;if(!this._isMarkingUnfinishedRangeAllowed()){return}if(!t.hasClass("sapUiCalItemText")&&!t.hasClass("sapUiCalItem")){return}if(t.hasClass("sapUiCalItemText")){t=t.parent()}i=parseInt(this._oFormatYyyymmdd.format(a.getStartDate()));s=t.data("sapDay");if(this.hasListeners("datehovered")){this.fireEvent("datehovered",{date1:i,date2:s})}else{this._markDatesBetweenStartAndHoveredDate(i,s)}};D.prototype._markDatesBetweenStartAndHoveredDate=function(e,t){var a,i,s,r;a=this.$().find(".sapUiCalItem");if(e>t){e=e+t;t=e-t;e=e-t}for(r=0;r<a.length;r++){i=f(a[r]);s=i.data("sapDay");if(s>e&&s<t){i.addClass("sapUiCalItemSelBetween")}else{i.removeClass("sapUiCalItemSelBetween")}}};D.prototype.onsapfocusleave=function(e){if(!e.relatedControlId||!p(this.getDomRef(),sap.ui.getCore().byId(e.relatedControlId).getFocusDomRef())){if(this._bMouseMove){this._unbindMousemove(true);var t=this._selectDay(this._getDate());if(!t&&this._oMoveSelectedDate){this._selectDay(this._oMoveSelectedDate)}this._bMoveChange=false;this._bMousedownChange=false;this._oMoveSelectedDate=undefined;M.call(this)}if(this._bMousedownChange){this._bMousedownChange=false;M.call(this)}}};D.prototype.removeAllSelectedDates=function(){this._bDateRangeChanged=true;var e=this.removeAllAggregation("selectedDates");return e};D.prototype.destroySelectedDates=function(){this._bDateRangeChanged=true;var e=this.destroyAggregation("selectedDates");return e};D.prototype.removeAllSpecialDates=function(){this._bDateRangeChanged=true;var e=this.removeAllAggregation("specialDates");return e};D.prototype.destroySpecialDates=function(){this._bDateRangeChanged=true;var e=this.destroyAggregation("specialDates");return e};D.prototype.removeAllDisabledDates=function(){this._bDateRangeChanged=true;var e=this.removeAllAggregation("disabledDates");return e};D.prototype.destroyDisabledDates=function(){this._bDateRangeChanged=true;var e=this.destroyAggregation("disabledDates");return e};D.prototype.setDate=function(e){var t=r.fromLocalJSDate(e,this.getPrimaryCalendarType());C.call(this,t,false);return this};D.prototype._setDate=function(e){var t=e.toLocalJSDate();this.setProperty("date",t,true);this._oDate=e};D.prototype._getDate=function(){if(!this._oDate){this._oDate=r.fromLocalJSDate(new Date,this.getPrimaryCalendarType())}return this._oDate};D.prototype.displayDate=function(e){var t=r.fromLocalJSDate(e,this.getPrimaryCalendarType());C.call(this,t,true);return this};D.prototype.setPrimaryCalendarType=function(e){this.setProperty("primaryCalendarType",e);this._oFormatLong=h.getInstance({style:"long",calendarType:e});if(this._oDate){this._oDate=new r(this._oDate,e)}return this};D.prototype.setSecondaryCalendarType=function(e){this._bSecondaryCalendarTypeSet=true;this.setProperty("secondaryCalendarType",e);this.invalidate();this._oFormatSecondaryLong=h.getInstance({style:"long",calendarType:e});return this};D.prototype._getSecondaryCalendarType=function(){var e;if(this._bSecondaryCalendarTypeSet){e=this.getSecondaryCalendarType();var t=this.getPrimaryCalendarType();if(e===t){e=undefined}}return e};D.prototype._getLocale=function(){var e=this.getParent();if(e&&e.getLocale){return e.getLocale()}else if(!this._sLocale){this._sLocale=sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale().toString()}return this._sLocale};D.prototype._getLocaleData=function(){var e=this.getParent();if(e&&e._getLocaleData){return e._getLocaleData()}else if(!this._oLocaleData){var t=this._getLocale();var i=new g(t);this._oLocaleData=a.getInstance(i)}return this._oLocaleData};D.prototype._getFormatLong=function(){var e=this._getLocale();if(this._oFormatLong.oLocale.toString()!==e){var t=new g(e);this._oFormatLong=h.getInstance({style:"long",calendarType:this.getPrimaryCalendarType()},t);if(this._oFormatSecondaryLong){this._oFormatSecondaryLong=h.getInstance({style:"long",calendarType:this._getSecondaryCalendarType()},t)}}return this._oFormatLong};D.prototype.getIntervalSelection=function(){var e=this.getParent();if(e&&e.getIntervalSelection){return e.getIntervalSelection()}else{return this.getProperty("intervalSelection")}};D.prototype.getSingleSelection=function(){var e=this.getParent();if(e&&e.getSingleSelection){return e.getSingleSelection()}else{return this.getProperty("singleSelection")}};D.prototype.getSelectedDates=function(){var e=this.getParent();if(e&&e.getSelectedDates){return e.getSelectedDates()}else{return this.getAggregation("selectedDates",[])}};D.prototype.getSpecialDates=function(){var e=this.getParent();if(e&&e.getSpecialDates){return e.getSpecialDates()}else{return this.getAggregation("specialDates",[])}};D.prototype.getDisabledDates=function(){var e=this.getParent();if(e&&e.getDisabledDates){return e.getDisabledDates()}else{return this.getAggregation("disabledDates",[])}};D.prototype.getPrimaryCalendarType=function(){var e=this.getParent();if(e&&e.getPrimaryCalendarType){return e.getPrimaryCalendarType()}return this.getProperty("primaryCalendarType")};D.prototype._getShowHeader=function(){var e=this.getParent();if(e&&e._getShowMonthHeader){return e._getShowMonthHeader()}else{return this.getProperty("showHeader")}};D.prototype.getAriaLabelledBy=function(){var e=this.getParent();if(e&&e.getAriaLabelledBy){return e.getAriaLabelledBy()}else{return this.getAssociation("ariaLabelledBy",[])}};D.prototype.getLegend=function(){var e=this.getParent();if(e&&e.getLegend){return e.getLegend()}else{return this.getAssociation("legend",[])}};D.prototype._getFirstDayOfWeek=function(){var e=this.getParent();var t=0;if(e&&e.getFirstDayOfWeek){t=e.getFirstDayOfWeek()}else{t=this.getProperty("firstDayOfWeek")}if(t<0||t>6){var a=this._getLocaleData();t=a.getFirstDayOfWeek()}return t};D.prototype._getNonWorkingDays=function(){var e=this.getParent();var t;if(e&&e.getNonWorkingDays){t=e.getNonWorkingDays()}else{t=this.getProperty("nonWorkingDays")}if(t&&!Array.isArray(t)){t=[]}return t};D.prototype._checkDateSelected=function(e){s._checkCalendarDate(e);var t=0;var a=this.getSelectedDates();var i=e.toUTCJSDate().getTime();var o=this.getPrimaryCalendarType();for(var n=0;n<a.length;n++){var l=a[n];var h=l.getStartDate();var d=0;if(h){h=r.fromLocalJSDate(h,o);d=h.toUTCJSDate().getTime()}var g=l.getEndDate();var u=0;if(g){g=r.fromLocalJSDate(g,o);u=g.toUTCJSDate().getTime()}if(i===d&&!g){t=1;break}else if(i===d&&g){t=2;if(g&&i===u){t=5}break}else if(g&&i===u){t=3;break}else if(g&&i>d&&i<u){t=4;break}if(this.getSingleSelection()){break}}return t};D.prototype._getDateTypes=function(e){s._checkCalendarDate(e);var t,a,i,r=[];var o=this._getSpecialDates();var n=e.toUTCJSDate().getTime();var l=new Date(Date.UTC(0,0,1));for(var h=0;h<o.length;h++){var d=o[h];var g=d.getStartDate();var u=s.MAX_MILLISECONDS;if(g){l.setUTCFullYear(g.getFullYear(),g.getMonth(),g.getDate());u=l.getTime()}var p=d.getEndDate();var c=-s.MAX_MILLISECONDS;if(p){l.setUTCFullYear(p.getFullYear(),p.getMonth(),p.getDate());c=l.getTime()}i=d.getType()===m.NonWorking;if(n===u&&!p||n>=u&&n<=c){if(!i&&!t){t={type:d.getType(),tooltip:d.getTooltip_AsString(),color:d.getColor()};r.push(t)}else if(i&&!a){a={type:d.getType(),tooltip:d.getTooltip_AsString()};r.push(a)}if(t&&a){break}}}return r};D.prototype._checkDateEnabled=function(e){s._checkCalendarDate(e);var t=true;var a=this.getDisabledDates();var i=e.toUTCJSDate().getTime();var o=this.getPrimaryCalendarType();var n=this.getParent();if(n&&n._oMinDate&&n._oMaxDate){if(i<n._oMinDate.valueOf()||i>n._oMaxDate.valueOf()){return false}}for(var l=0;l<a.length;l++){var h=a[l];var d=h.getStartDate();var g=0;if(d){d=r.fromLocalJSDate(d,o);g=d.toUTCJSDate().getTime()}var u=h.getEndDate();var p=0;if(u){u=r.fromLocalJSDate(u,o);p=u.toUTCJSDate().getTime()}if(u){if(i>g&&i<p){t=false;break}}else if(i===g){t=false;break}}return t};D.prototype._handleMouseMove=function(e){if(!this.$().is(":visible")){this._unbindMousemove(true)}var t=f(e.target);if(t.hasClass("sapUiCalItemText")){t=t.parent()}if(this._sLastTargetId&&this._sLastTargetId===t.attr("id")){return}this._sLastTargetId=t.attr("id");if(t.hasClass("sapUiCalItem")){var a=this._getDate();if(!p(this.getDomRef(),e.target)){var i=this.getSelectedDates();if(i.length>0&&this.getSingleSelection()){var s=i[0].getStartDate();if(s){s=r.fromLocalJSDate(s,this.getPrimaryCalendarType())}var o=r.fromLocalJSDate(this._oFormatYyyymmdd.parse(t.attr("data-sap-day")));if(o.isSameOrAfter(s)){b.call(this,s,o)}else{b.call(this,o,s)}}}else{var n=r.fromLocalJSDate(this._oFormatYyyymmdd.parse(t.attr("data-sap-day")),this.getPrimaryCalendarType());if(!n.isSame(a)){if(t.hasClass("sapUiCalItemOtherMonth")){this.fireFocus({date:n.toLocalJSDate(),otherMonth:true})}else{this._setDate(n);var l=this._selectDay(n,true);if(l){this._oMoveSelectedDate=new r(n,this.getPrimaryCalendarType())}this._bMoveChange=true}}}}};D.prototype.onmousedown=function(e){this._oMousedownPosition={clientX:e.clientX,clientY:e.clientY};if(!!e.button||t.support.touch||!this._isWeekSelectionAllowed()||!e.target.classList.contains("sapUiCalWeekNum")){return}var a=f(e.target),i=a.siblings().eq(0).attr("data-sap-day"),s=this._oFormatYyyymmdd.parse(i),o=r.fromLocalJSDate(s,this.getPrimaryCalendarType());this._handleWeekSelection(o,true)};D.prototype.onmouseup=function(e){var a=e.button!==2;if(this._bMouseMove){this._unbindMousemove(true);var i=this._getDate();var s=this._oItemNavigation.getItemDomRefs();for(var r=0;r<s.length;r++){var o=f(s[r]);if(!o.hasClass("sapUiCalItemOtherMonth")){if(o.attr("data-sap-day")===this._oFormatYyyymmdd.format(i.toUTCJSDate(),true)){o.trigger("focus");break}}}if(this._bMoveChange){var n=this._selectDay(i);if(!n&&this._oMoveSelectedDate){this._selectDay(this._oMoveSelectedDate)}this._bMoveChange=false;this._bMousedownChange=false;this._oMoveSelectedDate=undefined;M.call(this)}}if(this._bMousedownChange){this._bMousedownChange=false;M.call(this)}else if(t.support.touch&&a&&this._areMouseEventCoordinatesInThreshold(e.clientX,e.clientY,10)){var l=e.target.classList,h=l.contains("sapUiCalItemText")||l.contains("sapUiCalDayName"),d=l.contains("sapUiCalWeekNum"),g=this._getSelectedDateFromEvent(e);if(d&&this._isWeekSelectionAllowed()){this._handleWeekSelection(g,true)}else if(h&&e.shiftKey&&this._isConsecutiveDaysSelectionAllowed()){this._handleConsecutiveDaysSelection(g)}else if(h){this._selectDay(g,false,false);M.call(this)}}};D.prototype.onsapselect=function(e){if(this.bSpaceButtonPressed){return}var t=this._selectDay(this._getSelectedDateFromEvent(e));if(t){M.call(this)}e.stopPropagation();e.preventDefault()};D.prototype.onkeydown=function(e){if(e.which===c.SPACE){this.bSpaceButtonPressed=true}};D.prototype.onkeyup=function(e){if(e.which===c.SPACE){this.bSpaceButtonPressed=false}};D.prototype.onsapselectmodifiers=function(e){var t=this._getSelectedDateFromEvent(e),a;if(this._isWeekSelectionAllowed()&&e.shiftKey&&e.keyCode===c.SPACE){a=s._getFirstDateOfWeek(t);this._handleWeekSelection(a,false)}else if(this._isConsecutiveDaysSelectionAllowed()&&e.shiftKey&&e.keyCode===c.ENTER){this._handleConsecutiveDaysSelection(t)}e.preventDefault()};D.prototype.onsappageupmodifiers=function(e){var t=new r(this._getDate(),this.getPrimaryCalendarType());var a=t.getYear();if(e.metaKey||e.ctrlKey){t.setYear(a-10)}else{t.setYear(a-1)}this.fireFocus({date:t.toLocalJSDate(),otherMonth:true});e.preventDefault()};D.prototype.onsappagedownmodifiers=function(e){var t=new r(this._getDate(),this.getPrimaryCalendarType());var a=t.getYear();if(e.metaKey||e.ctrlKey){t.setYear(a+10)}else{t.setYear(a+1)}this.fireFocus({date:t.toLocalJSDate(),otherMonth:true});e.preventDefault()};D.prototype._updateSelection=function(){var e=this.getSelectedDates();if(e.length>0){var t=this.getPrimaryCalendarType();var a=e.map(function(e){var a=e.getStartDate();if(a){return r.fromLocalJSDate(a,t)}});var i=e[0].getEndDate();if(i){i=r.fromLocalJSDate(i,t)}b.call(this,a,i)}};D.prototype._isValueInThreshold=function(e,t,a){var i=e-a,s=e+a;return t>=i&&t<=s};D.prototype._areMouseEventCoordinatesInThreshold=function(e,t,a){return this._oMousedownPosition&&this._isValueInThreshold(this._oMousedownPosition.clientX,e,a)&&this._isValueInThreshold(this._oMousedownPosition.clientY,t,a)?true:false};D.prototype._bindMousemove=function(e){f(window.document).on("mousemove",this._mouseMoveProxy);this._bMouseMove=true;if(e){this.fireEvent("_bindMousemove")}};D.prototype._unbindMousemove=function(e){f(window.document).off("mousemove",this._mouseMoveProxy);this._bMouseMove=undefined;this._sLastTargetId=undefined;if(e){this.fireEvent("_unbindMousemove")}};D.prototype.onThemeChanged=function(){if(this._bNoThemeChange||!this.getDomRef()){return}var e=this.getDomRef().querySelectorAll(".sapUiCalWH:not(.sapUiCalDummy)"),t=this._getLocaleData(),a=this._getFirstWeekDay(),i=t.getDaysStandAlone("abbreviated",this.getPrimaryCalendarType()),s,r;this._bNamesLengthChecked=undefined;this._bLongWeekDays=undefined;for(r=0;r<e.length;r++){s=e[r];s.textContent=i[(r+a)%7]}L.call(this)};D.prototype._handleBorderReached=function(e){var t=e.getParameter("event");var a=0;var i=this._getDate();var s=new r(i,this.getPrimaryCalendarType());if(t.type){switch(t.type){case"sapnext":case"sapnextmodifiers":if(t.keyCode===c.ARROW_DOWN){s.setDate(s.getDate()+7)}else{s.setDate(s.getDate()+1)}break;case"sapprevious":case"sappreviousmodifiers":if(t.keyCode===c.ARROW_UP){s.setDate(s.getDate()-7)}else{s.setDate(s.getDate()-1)}break;case"sappagedown":a=s.getMonth()+1;s.setMonth(a);if(a%12!==s.getMonth()){while(a!==s.getMonth()){s.setDate(s.getDate()-1)}}break;case"sappageup":a=s.getMonth()-1;s.setMonth(a);if(a<0){a=11}if(a!==s.getMonth()){while(a!==s.getMonth()){s.setDate(s.getDate()-1)}}break;default:break}this.fireFocus({date:s.toLocalJSDate(),otherMonth:true});if(this._isMarkingUnfinishedRangeAllowed()){var o=this.getSelectedDates()[0],n=parseInt(this._oFormatYyyymmdd.format(o.getStartDate())),l=parseInt(this._oFormatYyyymmdd.format(s.toLocalJSDate()));this._markDatesBetweenStartAndHoveredDate(n,l)}}};D.prototype.checkDateFocusable=function(e){s._checkJSDateObject(e);var t=this._getDate();var a=r.fromLocalJSDate(e,this.getPrimaryCalendarType());return s._isSameMonthAndYear(a,t)};D.prototype.applyFocusInfo=function(e){this._oItemNavigation.focusItem(this._oItemNavigation.getFocusedIndex());return this};D.prototype._renderHeader=function(){if(this._getShowHeader()){var e=this._getDate();var t=this._getLocaleData();var a=t.getMonthsStandAlone("wide",this.getPrimaryCalendarType());this.$("Head").text(a[e.getMonth()])}};D.prototype._getFirstWeekDay=function(){return this._getFirstDayOfWeek()};D.prototype._isMonthNameLong=function(e){var t;var a;for(t=0;t<e.length;t++){a=e[t];if(Math.abs(a.clientWidth-a.scrollWidth)>1){return true}}return false};D.prototype._getVisibleDays=function(e,t){var a,i,s,o,n,l,h;if(!e){return this._aVisibleDays}this._aVisibleDays=[];l=this._getFirstDayOfWeek();n=new r(e,this.getPrimaryCalendarType());n.setDate(1);o=n.getDay()-l;if(o<0){o=7+o}if(o>0){n.setDate(1-o)}i=new r(n);a=(e.getMonth()+1)%12;do{h=i.getYear();s=new r(i,this.getPrimaryCalendarType());if(t&&h<1){s._bBeforeFirstYear=true;this._aVisibleDays.push(s)}else if(h>0&&h<1e4){this._aVisibleDays.push(s)}i.setDate(i.getDate()+1)}while(i.getMonth()!==a||i.getDay()!==l);return this._aVisibleDays};D.prototype._handleMousedown=function(e,a){var i=e.target.classList.contains("sapUiCalWeekNum"),s=!e.button,o=this._getSelectedDateFromEvent(e);if(!s||t.support.touch){return this}if(i){this._isWeekSelectionAllowed()&&this._handleWeekSelection(o,true);return this}else if(e.shiftKey&&this._isConsecutiveDaysSelectionAllowed()){this._handleConsecutiveDaysSelection(o);return this}var n=this._selectDay(a);if(n){this._bMousedownChange=true}if(this._bMouseMove){this._unbindMousemove(true);this._bMoveChange=false;this._oMoveSelectedDate=undefined}else if(n&&this.getIntervalSelection()&&this.$().is(":visible")){this._bindMousemove(true);this._oMoveSelectedDate=new r(a,this.getPrimaryCalendarType())}e.preventDefault();e.setMark("cancelAutoClose")};D.prototype._getSelectedDateFromEvent=function(e){var t=e.target,a,i;if(t.classList.contains("sapUiCalWeekNum")){a=t.nextSibling.getAttribute("data-sap-day")}else{a=t.getAttribute("data-sap-day")||t.parentNode.getAttribute("data-sap-day")}i=this._oFormatYyyymmdd.parse(a);return i?r.fromLocalJSDate(i,this.getPrimaryCalendarType()):null};D.prototype._handleWeekSelection=function(e,t){var a=s.calculateWeekNumber(e.toUTCJSDate(),e.getYear(),this._getLocale(),this._getLocaleData()),i=this._getLastWeekDate(e),r=this.getSingleSelection(),o=this.getIntervalSelection();if(!r&&!o){this._handleWeekSelectionByMultipleDays(a,e,i)}else if(r&&o){this._handleWeekSelectionBySingleInterval(a,e,i)}t&&this._focusDate(e);return this};D.prototype._handleConsecutiveDaysSelection=function(e){var t=this.getSelectedDates(),a=t.length&&t[t.length-1].getStartDate(),i=a?r.fromLocalJSDate(a):e,s;s=this._areAllDaysBetweenSelected(i,e);this._toggleDaysBetween(i,e,!s);return this};D.prototype._isWeekSelectionAllowed=function(){var e=this.getSingleSelection(),t=this.getIntervalSelection(),a=this.getPrimaryCalendarType(),i=this.getFirstDayOfWeek()!==-1,s=!e&&!t,r=e&&t,o=r||s;return a===y.Gregorian&&!i&&o};D.prototype._isConsecutiveDaysSelectionAllowed=function(){var e=this.getSingleSelection(),t=this.getIntervalSelection();return!e&&!t};D.prototype._isMarkingUnfinishedRangeAllowed=function(){var e=this.getSelectedDates()[0],t=!!(e&&e.getStartDate()&&!e.getEndDate());return this.getIntervalSelection()&&t};D.prototype._handleWeekSelectionByMultipleDays=function(e,t,a){var i,s;if(this._areAllDaysBetweenSelected(t,a)){i=null}else{i=new o({startDate:t.toLocalJSDate(),endDate:a.toLocalJSDate()})}s=this.fireWeekNumberSelect({weekNumber:e,weekDays:i});if(s){this._toggleDaysBetween(t,a,!!i)}return this};D.prototype._handleWeekSelectionBySingleInterval=function(e,t,a){var i=new o({startDate:t.toLocalJSDate(),endDate:a.toLocalJSDate()}),s=this.getParent(),r=this,n;if(s&&s.getSelectedDates){r=s}if(this._isIntervalSelected(i)){i=null}n=this.fireWeekNumberSelect({weekNumber:e,weekDays:i});if(n){r.removeAllSelectedDates();r.addSelectedDate(i)}return this};D.prototype._isIntervalSelected=function(e){var t=this.getSelectedDates(),a=t.length&&t[0],i=a&&a.getEndDate();return a&&a.getStartDate().getTime()===e.getStartDate().getTime()&&i&&a.getEndDate().getTime()===e.getEndDate().getTime()};D.prototype._getLastWeekDate=function(e){return new r(e).setDate(e.getDate()+6)};D.prototype._toggleDaysBetween=function(e,t,a){var i=this._arrangeStartAndEndDates(e,t),s=new r(i.startDate),o;do{o=this._checkDateSelected(s);if(!o&&a||o&&!a){this._selectDay(s);M.call(this)}s.setDate(s.getDate()+1)}while(s.isSameOrBefore(i.endDate));return this};D.prototype._areAllDaysBetweenSelected=function(e,t){var a=this._arrangeStartAndEndDates(e,t),i=new r(a.startDate),s=true;do{if(!this._checkDateSelected(i)){s=false;break}i.setDate(i.getDate()+1)}while(i.isSameOrBefore(a.endDate));return s};D.prototype._arrangeStartAndEndDates=function(e,t){var a=e.isSameOrBefore(t);return{startDate:a?e:t,endDate:a?t:e}};D.prototype._selectDay=function(e,t){if(!this._checkDateEnabled(e)){return false}var a=this.getSelectedDates();var i;var s=this._oItemNavigation.getItemDomRefs();var n;var l;var h=0;var d=this.getParent();var g=this;var u;var p=this.getPrimaryCalendarType();if(d&&d.getSelectedDates){g=d}if(this.getSingleSelection()){if(a.length>0){i=a[0];u=i.getStartDate();if(u){u=r.fromLocalJSDate(u,p)}}else{i=new o;g.addAggregation("selectedDates",i,true)}if(this.getIntervalSelection()&&(!i.getEndDate()||t)&&u){var c;if(e.isBefore(u)){c=u;u=e;if(!t){i.setProperty("startDate",u.toLocalJSDate(),true);i.setProperty("endDate",c.toLocalJSDate(),true)}}else if(e.isSameOrAfter(u)){c=e;if(!t){i.setProperty("endDate",c.toLocalJSDate(),true)}}b.call(this,u,c)}else{b.call(this,e);i.setProperty("startDate",e.toLocalJSDate(),true);i.setProperty("endDate",undefined,true)}}else{if(this.getIntervalSelection()){throw new Error("Calender don't support multiple interval selection")}else{var y=this._checkDateSelected(e);if(y>0){for(h=0;h<a.length;h++){u=a[h].getStartDate();if(u&&e.isSame(r.fromLocalJSDate(u,p))){g.removeAggregation("selectedDates",h,true);break}}}else{i=new o({startDate:e.toLocalJSDate()});g.addAggregation("selectedDates",i,true)}l=this._oFormatYyyymmdd.format(e.toUTCJSDate(),true);for(h=0;h<s.length;h++){n=f(s[h]);if(n.attr("data-sap-day")===l){if(y>0){n.removeClass("sapUiCalItemSel");n.attr("aria-selected","false")}else{n.addClass("sapUiCalItemSel");n.attr("aria-selected","true")}}}}}return true};D.prototype._getSpecialDates=function(){var e=this.getParent();if(e&&e._getSpecialDates){return e._getSpecialDates()}else{var t=this.getSpecialDates();for(var a=0;a<t.length;a++){var i=t[a].getSecondaryType()===l.CalendarDayType.NonWorking&&t[a].getType()!==l.CalendarDayType.NonWorking;if(i){var s=new n;s.setType(l.CalendarDayType.NonWorking);s.setStartDate(t[a].getStartDate());if(t[a].getEndDate()){s.setEndDate(t[a].getEndDate())}t.push(s)}}return t}};function v(){var e=this._oFormatYyyymmdd.format(this._getDate().toUTCJSDate(),true),t=0,a=this.getDomRef(),s=a.querySelectorAll(".sapUiCalItem");for(var r=0;r<s.length;r++){if(s[r].getAttribute("data-sap-day")===e){t=r;break}}if(!this._oItemNavigation){this._oItemNavigation=new i;this._oItemNavigation.attachEvent(i.Events.AfterFocus,_,this);this._oItemNavigation.attachEvent(i.Events.FocusAgain,S,this);this._oItemNavigation.attachEvent(i.Events.BorderReached,this._handleBorderReached,this);this.addDelegate(this._oItemNavigation);if(this._iColumns>1){this._oItemNavigation.setHomeEndColumnMode(true,true)}this._oItemNavigation.setDisabledModifiers({sapnext:["alt"],sapprevious:["alt"],saphome:["alt"],sapend:["alt"]});this._oItemNavigation.setCycling(false);this._oItemNavigation.setColumns(this._iColumns,true)}this._oItemNavigation.setRootDomRef(a);this._oItemNavigation.setItemDomRefs(s);this._oItemNavigation.setFocusedIndex(t);this._oItemNavigation.setPageSize(s.length)}function _(e){var t=e.getParameter("index");var a=e.getParameter("event");if(!a){return}var i=this._getDate();var s=new r(i,this.getPrimaryCalendarType());var o=false;var n=true;var l=this._oItemNavigation.getItemDomRefs();var h=0;var d=f(l[t]);var g;if(d.hasClass("sapUiCalItemOtherMonth")){if(a.type==="saphomemodifiers"&&(a.metaKey||a.ctrlKey)){s.setDate(1);this._focusDate(s)}else if(a.type==="sapendmodifiers"&&(a.metaKey||a.ctrlKey)){for(h=l.length-1;h>0;h--){g=f(l[h]);if(!g.hasClass("sapUiCalItemOtherMonth")){s=r.fromLocalJSDate(this._oFormatYyyymmdd.parse(g.attr("data-sap-day")),this.getPrimaryCalendarType());break}}this._focusDate(s)}else{o=true;s=r.fromLocalJSDate(this._oFormatYyyymmdd.parse(d.attr("data-sap-day")),this.getPrimaryCalendarType());if(!s){s=new r(i)}this._focusDate(i);if(a.type==="mousedown"||this._sTouchstartYyyyMMdd&&a.type==="focusin"&&this._sTouchstartYyyyMMdd===d.attr("data-sap-day")){n=false;this.fireFocus({date:i.toLocalJSDate(),otherMonth:false,restoreOldDate:true})}if(a.originalEvent&&a.originalEvent.type==="touchstart"){this._sTouchstartYyyyMMdd=d.attr("data-sap-day")}else{this._sTouchstartYyyyMMdd=undefined}}}else{if(f(a.target).hasClass("sapUiCalWeekNum")){this._focusDate(s)}else{s=r.fromLocalJSDate(this._oFormatYyyymmdd.parse(d.attr("data-sap-day")),this.getPrimaryCalendarType());this._setDate(s)}this._sTouchstartYyyyMMdd=undefined}if(a.type==="mousedown"&&this.getIntervalSelection()){this._sLastTargetId=d.attr("id")}if(n){this.fireFocus({date:s.toLocalJSDate(),otherMonth:o})}if(a.type==="mousedown"){this._handleMousedown(a,s,t)}if(a.type==="sapnext"||a.type==="sapprevious"){var u=this.getSelectedDates()[0],p,c;if(!this._isMarkingUnfinishedRangeAllowed()){return}p=parseInt(this._oFormatYyyymmdd.format(u.getStartDate()));c=d.data("sapDay");this._markDatesBetweenStartAndHoveredDate(p,c)}}function S(e){var t=e.getParameter("index");var a=e.getParameter("event");if(!a){return}if(a.type==="mousedown"){var i=this._getDate();if(this.getIntervalSelection()){var s=this._oItemNavigation.getItemDomRefs();this._sLastTargetId=s[t].id}this._handleMousedown(a,i,t)}}function C(e,t){s._checkCalendarDate(e);var a=e.getYear();s._checkYearInValidRange(a);var i=true;if(!this.getDate()||!e.isSame(r.fromLocalJSDate(this.getDate(),e.getCalendarType()))){var o=new r(e);i=this.checkDateFocusable(e.toLocalJSDate());this.setProperty("date",e.toLocalJSDate(),true);this._oDate=o}if(this.getDomRef()){if(i){this._focusDate(this._oDate,true,t)}else{I.call(this,t)}}}D.prototype._focusDate=function(e,t,a){if(!t){this.setDate(e.toLocalJSDate())}var i=this._oFormatYyyymmdd.format(e.toUTCJSDate(),true);var s=this._oItemNavigation.getItemDomRefs();var r;for(var o=0;o<s.length;o++){r=f(s[o]);if(r.attr("data-sap-day")===i){if(document.activeElement!==s[o]){if(a){this._oItemNavigation.setFocusedIndex(o)}else{this._oItemNavigation.focusItem(o)}}break}}};function I(e){var t=this.getRenderer().getStartDate(this),a=this.getDomRef(),i=this.getDomRef().querySelector(".sapUiCalRowWeekNumbers"),s,r=0,o=0;if(this._sLastTargetId){s=this._oItemNavigation.getItemDomRefs();for(r=0;r<s.length;r++){if(s[r].id===this._sLastTargetId){o=r;break}}}if(a){var n=sap.ui.getCore().createRenderManager();this.getRenderer().renderMonth(n,this,t);n.flush(a);if(i){this.getRenderer().renderWeekNumbers(n,this);n.flush(i)}n.destroy()}this._renderHeader();this.fireEvent("_renderMonth",{days:a.querySelectorAll(".sapUiCalItem").length});v.call(this);if(!e){this._oItemNavigation.focusItem(this._oItemNavigation.getFocusedIndex())}if(this._sLastTargetId){s=this._oItemNavigation.getItemDomRefs();if(o<=s.length-1){this._sLastTargetId=s[o].id}}}function b(e,t){if(!Array.isArray(e)){e=[e]}var a=this._oItemNavigation.getItemDomRefs();var i;var o=0;var n=false;var l=false;if(!t){var h=e.map(function(e){return this._oFormatYyyymmdd.format(e.toUTCJSDate(),true)},this);for(o=0;o<a.length;o++){i=f(a[o]);n=false;l=false;if(h.indexOf(i.attr("data-sap-day"))>-1){i.addClass("sapUiCalItemSel");i.attr("aria-selected","true");n=true}else if(i.hasClass("sapUiCalItemSel")){i.removeClass("sapUiCalItemSel");i.attr("aria-selected","false")}if(i.hasClass("sapUiCalItemSelStart")){i.removeClass("sapUiCalItemSelStart")}else if(i.hasClass("sapUiCalItemSelBetween")){i.removeClass("sapUiCalItemSelBetween")}else if(i.hasClass("sapUiCalItemSelEnd")){i.removeClass("sapUiCalItemSelEnd")}T.call(this,i,n,l)}}else{var d;for(o=0;o<a.length;o++){i=f(a[o]);n=false;l=false;d=r.fromLocalJSDate(this._oFormatYyyymmdd.parse(i.attr("data-sap-day")),y.Gregorian);if(d.isSame(e[0])){i.addClass("sapUiCalItemSelStart");n=true;i.addClass("sapUiCalItemSel");i.attr("aria-selected","true");if(t&&d.isSame(t)){i.addClass("sapUiCalItemSelEnd");l=true}i.removeClass("sapUiCalItemSelBetween")}else if(t&&s._isBetween(d,e[0],t)){i.addClass("sapUiCalItemSel");i.attr("aria-selected","true");i.addClass("sapUiCalItemSelBetween");i.removeClass("sapUiCalItemSelStart");i.removeClass("sapUiCalItemSelEnd")}else if(t&&d.isSame(t)){i.addClass("sapUiCalItemSelEnd");l=true;i.addClass("sapUiCalItemSel");i.attr("aria-selected","true");i.removeClass("sapUiCalItemSelStart");i.removeClass("sapUiCalItemSelBetween")}else{if(i.hasClass("sapUiCalItemSel")){i.removeClass("sapUiCalItemSel");i.attr("aria-selected","false")}if(i.hasClass("sapUiCalItemSelStart")){i.removeClass("sapUiCalItemSelStart")}else if(i.hasClass("sapUiCalItemSelBetween")){i.removeClass("sapUiCalItemSelBetween")}else if(i.hasClass("sapUiCalItemSelEnd")){i.removeClass("sapUiCalItemSelEnd")}}T.call(this,i,n,l)}}}function T(e,t,a){if(!this.getIntervalSelection()){return}var i="";var s=[];var r=this.getId();var o=false;i=e.attr("aria-describedby");if(i){s=i.split(" ")}var n=-1;var l=-1;for(var h=0;h<s.length;h++){var d=s[h];if(d===r+"-Start"){n=h}if(d===r+"-End"){l=h}}if(n>=0&&!t){s.splice(n,1);o=true;if(l>n){l--}}if(l>=0&&!a){s.splice(l,1);o=true}if(n<0&&t){s.push(r+"-Start");o=true}if(l<0&&a){s.push(r+"-End");o=true}if(o){i=s.join(" ");e.attr("aria-describedby",i)}}function M(){if(this._bMouseMove){this._unbindMousemove(true)}this.fireSelect()}function L(){if(!this._bNamesLengthChecked){var e,t=this.getDomRef().querySelectorAll(".sapUiCalWH:not(.sapUiCalDummy)"),a=this._isMonthNameLong(t),i,s,r,o;if(a){this._bLongWeekDays=false;i=this._getLocaleData();s=this._getFirstWeekDay();r=i.getDaysStandAlone("narrow",this.getPrimaryCalendarType());for(o=0;o<t.length;o++){e=t[o];e.textContent=r[(o+s)%7]}}else{this._bLongWeekDays=true}this._bNamesLengthChecked=true}}return D});