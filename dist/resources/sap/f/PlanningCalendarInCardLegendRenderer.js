/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/PlanningCalendarLegendRenderer","sap/ui/core/Renderer"],function(e,t){"use strict";var n=t.extend(e);n.apiVersion=2;n.renderItemsHeader=function(e,t){};n.renderAppointmentsItemsHeader=function(e,t){};n.renderAdditionalContent=function(e,t){};n.renderAdditionalItems=function(e,t){var n=t.getAppointmentItems(),i=t.getVisibleLegendItemsCount(),r,s;if(t.getItems().length>=i){r=0}else if(t.getItems().length+t.getAppointmentItems().length>i){r=i-t.getItems().length}else{r=t.getAppointmentItems().length}for(s=0;s<r;s++){this.renderLegendItem(e,"sapUiCalLegDayType"+t._getItemType(n[s],n).slice(4),n[s],["sapUiUnifiedLegendSquareColor","sapMPlanCalLegendAppCircle"])}if(t.getItems().length+t.getAppointmentItems().length>i){e.renderControl(t._getMoreLabel(t.getItems().length+t.getAppointmentItems().length-i))}};n.defineItemsLength=function(e,t){var n=e.getVisibleLegendItemsCount();if(t>=n){return n}else{return t}};return n},true);