/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library"],function(e){"use strict";var n={apiVersion:2};n.render=function(e,n){var a=n._getState(),i="sapFDynamicPageTitle",t=n.getBackgroundDesign(),r=n._getARIALabelReferences(n._bExpandedState)||n.DEFAULT_HEADER_TEXT_ID,d=n._getAriaDescribedByReferences();e.openStart("div",n);e.class(i);if(t){e.class(i+t)}e.openEnd();e.openStart("span",n.getId()+"-focusSpan").class("sapFDynamicPageTitleFocusSpan").attr("role","button").attr("aria-expanded",n._bExpandedState).attr("aria-labelledby",r).attr("aria-describedby",d).attr("tabindex",0);e.openEnd().close("span");this._renderTopArea(e,a);this._renderMainArea(e,a);this._renderSnappedExpandedContentArea(e,a);if(a.hasSnappedTitleOnMobile){this._renderSnappedTitleOnMobile(e,a)}e.renderControl(a.expandButton);e.close("div")};n._renderTopArea=function(e,n){if(n.hasTopContent){e.openStart("div",n.id+"-top");e.class("sapFDynamicPageTitleTop");if(n.hasOnlyBreadcrumbs){e.class("sapFDynamicPageTitleTopBreadCrumbsOnly")}if(n.hasOnlyNavigationActions){e.class("sapFDynamicPageTitleTopNavActionsOnly")}e.openEnd();this._renderTopBreadcrumbsArea(e,n);this._renderTopNavigationArea(e,n);e.close("div")}};n._renderTopBreadcrumbsArea=function(e,n){if(n.breadcrumbs){e.openStart("div",n.id+"-breadcrumbs");e.class("sapFDynamicPageTitleTopLeft");e.openEnd();e.renderControl(n.breadcrumbs);e.close("div")}};n._renderTopNavigationArea=function(e,n){if(n.hasNavigationActions){e.openStart("div",n.id+"-topNavigationArea");e.class("sapFDynamicPageTitleTopRight");e.openEnd();e.close("div")}};n._renderMainArea=function(e,n){e.openStart("div",n.id+"-main");e.class("sapFDynamicPageTitleMain");if(!n.hasContent){e.class("sapFDynamicPageTitleMainNoContent")}e.openEnd();e.openStart("div");e.class("sapFDynamicPageTitleMainInner");e.openEnd();this._renderMainHeadingArea(e,n);this._renderMainContentArea(e,n);this._renderMainActionsArea(e,n);e.close("div");this._renderMainNavigationArea(e,n);e.close("div")};n._renderMainHeadingArea=function(e,a){e.openStart("div",a.id+"-left-inner");e.class("sapFDynamicPageTitleMainHeading");e.style("flex-shrink",a.headingAreaShrinkFactor);e.openEnd();e.openStart("div");e.class("sapFDynamicPageTitleHeading-CTX");e.class("sapFDynamicPageTitleMainHeadingInner");e.openEnd();if(a.heading){e.renderControl(a.heading)}else{if(a.snappedHeading){n._renderSnappedHeading(e,a)}if(a.expandedHeading){n._renderExpandHeading(e,a)}}e.close("div");e.close("div")};n._renderMainContentArea=function(e,n){e.openStart("div",n.id+"-content");e.class("sapFDynamicPageTitleMainContent");e.class("sapFDynamicPageTitleContent-CTX");e.style("flex-shrink",n.contentAreaShrinkFactor);if(n.contentAreaFlexBasis){e.style("flex-basis",n.contentAreaFlexBasis)}e.openEnd();n.content.forEach(e.renderControl,e);e.close("div")};n._renderMainActionsArea=function(e,n){e.openStart("div",n.id+"-mainActions");e.class("sapFDynamicPageTitleMainActions");e.style("flex-shrink",n.actionsAreaShrinkFactor);if(n.actionsAreaFlexBasis){e.style("flex-basis",n.actionsAreaFlexBasis)}e.openEnd();if(n.hasActions){e.renderControl(n.actionBar)}e.close("div")};n._renderMainNavigationArea=function(e,n){if(n.hasNavigationActions){e.openStart("div",n.id+"-mainNavigationAreaWrapper");e.class("sapFDynamicPageTitleMainNavigationArea");e.openEnd();e.renderControl(n.separator);e.openStart("div",n.id+"-mainNavigationArea");e.class("sapFDynamicPageTitleMainNavigationAreaInner");e.openEnd();e.close("div");e.close("div")}};n._renderSnappedExpandedContentArea=function(e,a){if(a.hasAdditionalContent){e.openStart("div");e.class("sapFDynamicPageTitleMainHeadingSnappedExpandContent");e.openEnd();if(a.hasSnappedContent&&!a.hasSnappedTitleOnMobile){n._renderSnappedContent(e,a)}if(a.hasExpandedContent){n._renderExpandContent(e,a)}e.close("div")}};n._renderExpandHeading=function(e,n){e.openStart("div",n.id+"-expand-heading-wrapper");e.openEnd();e.renderControl(n.expandedHeading);e.close("div")};n._renderSnappedHeading=function(e,n){e.openStart("div",n.id+"-snapped-heading-wrapper");if(!n.isSnapped){e.class("sapUiHidden")}e.openEnd();e.renderControl(n.snappedHeading);e.close("div")};n._renderExpandContent=function(e,n){e.openStart("div",n.id+"-expand-wrapper");e.openEnd();n.expandedContent.forEach(e.renderControl,e);e.close("div")};n._renderSnappedContent=function(e,n){e.openStart("div",n.id+"-snapped-wrapper");if(!n.isSnapped){e.class("sapUiHidden")}e.class("sapFDynamicPageTitleSnapped");e.openEnd();n.snappedContent.forEach(e.renderControl,e);e.close("div")};n._renderSnappedTitleOnMobile=function(e,n){e.openStart("div",n.id+"-snapped-title-on-mobile-wrapper");if(!n.isSnapped){e.class("sapUiHidden")}e.class("sapFDynamicPageTitleSnappedTitleOnMobile");e.openEnd();e.renderControl(n.snappedTitleOnMobileContext);e.renderControl(n.snappedTitleOnMobileIcon);e.close("div")};return n},true);