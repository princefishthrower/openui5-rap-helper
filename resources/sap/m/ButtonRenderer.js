/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/Device","sap/ui/core/library","sap/ui/core/IconPool","sap/ui/core/ShortcutHintsMixin","sap/m/library","sap/ui/core/InvisibleText"],function(e,t,a,n,i,s){"use strict";var r=i.ButtonType;var c=i.ButtonAccessibilityType;var o=t.TextDirection;var l=i.BadgeState;var p={apiVersion:2};p.render=function(t,i){var s=i.getId();var c=i.getType();var l=i.getEnabled();var u=i.getWidth();var b=i._getTooltip();var I=i._getText();var g=i.getTextDirection();var T=e.browser.internet_explorer||e.browser.edge;var A=g===o.Inherit&&!T;var B=a.getIconURI("nav-back");var _;t.openStart("button",i);t.class("sapMBtnBase");if(!i._isUnstyled()){t.class("sapMBtn");if((c===r.Back||c===r.Up)&&i._getAppliedIcon()&&!I){t.class("sapMBtnBack")}}var f=p.generateAccProps(i);if(this.renderAccessibilityAttributes){this.renderAccessibilityAttributes(t,i,f)}t.accessibilityState(i,f);if(!l){t.attr("disabled","disabled");if(!i._isUnstyled()){t.class("sapMBtnDisabled")}}else{switch(c){case r.Accept:case r.Reject:case r.Emphasized:case r.Attention:t.class("sapMBtnInverted");break;default:break}}if(b&&!n.isDOMIDRegistered(s)){t.attr("title",b)}if(u!=""||u.toLowerCase()==="auto"){t.style("width",u);if(i._getAppliedIcon()&&I){_="4rem"}else{_="2.25rem"}t.style("min-width",_)}d(i,t);t.openEnd();t.openStart("span",s+"-inner");if(!i._isUnstyled()){t.class("sapMBtnInner")}if(i._isHoverable()){t.class("sapMBtnHoverable")}if(l){t.class("sapMFocusable");if(T){t.class("sapMIE")}}if(!i._isUnstyled()){if(I){t.class("sapMBtnText")}if(c===r.Back||c===r.Up){t.class("sapMBtnBack")}if(i._getAppliedIcon()){if(i.getIconFirst()){t.class("sapMBtnIconFirst")}else{t.class("sapMBtnIconLast")}}}if(this.renderButtonAttributes){this.renderButtonAttributes(t,i)}if(!i._isUnstyled()&&c!==""){t.class("sapMBtn"+c)}d(i,t);t.openEnd();if(c===r.Back||c===r.Up){this.writeInternalIconPoolHtml(t,i,B)}if(i.getIconFirst()&&i._getAppliedIcon()){this.writeImgHtml(t,i)}if(I){t.openStart("span",s+"-content");t.class("sapMBtnContent");if(g!==o.Inherit){t.attr("dir",g.toLowerCase())}t.openEnd();if(A){t.openStart("bdi",s+"-BDI-content");t.openEnd()}t.text(I);if(A){t.close("bdi")}t.close("span")}if(!i.getIconFirst()&&i._getAppliedIcon()){this.writeImgHtml(t,i)}if(T&&l){t.openStart("span");t.class("sapMBtnFocusDiv");t.openEnd();t.close("span")}t.close("span");if(b){t.openStart("span",s+"-tooltip");t.class("sapUiInvisibleText");t.openEnd();t.text(b);t.close("span")}t.close("button")};p.writeImgHtml=function(e,t){e.renderControl(t._getImage(t.getId()+"-img",t._getAppliedIcon(),t.getActiveIcon(),t.getIconDensityAware()))};p.writeInternalIconPoolHtml=function(e,t,a){e.renderControl(t._getInternalIconBtn(t.getId()+"-iconBtn",a))};function d(e,t){if(e._bExcludeFromTabChain){t.attr("tabindex",-1)}}var u={Accept:"BUTTON_ARIA_TYPE_ACCEPT",Reject:"BUTTON_ARIA_TYPE_REJECT",Attention:"BUTTON_ARIA_TYPE_ATTENTION",Emphasized:"BUTTON_ARIA_TYPE_EMPHASIZED",Critical:"BUTTON_ARIA_TYPE_CRITICAL",Negative:"BUTTON_ARIA_TYPE_NEGATIVE",Success:"BUTTON_ARIA_TYPE_SUCCESS"};p.getButtonTypeAriaLabelId=function(e){return s.getStaticId("sap.m",u[e])};p.getBadgeTextId=function(e){return e._oBadgeData&&e._oBadgeData.value!==""&&e._oBadgeData.state!==l.Disappear?e._getBadgeInvisibleText().getId():""};p.generateAccProps=function(e){var t=e._getText(),a;if(t){a=p.generateTextButtonAccProps(e)}else{a=p.generateIconOnlyButtonAccProps(e)}a["disabled"]=null;return a};p.generateIconOnlyButtonAccProps=function(e){var t=p.getButtonTypeAriaLabelId(e.getType()),a=this.getBadgeTextId(e),n=e._getTooltip(),i=e.getId()+"-tooltip",s=e._determineAccessibilityType(),r={};switch(s){case c.Default:r["label"]={value:n,append:true};break;case c.Described:r["label"]={value:n,append:true};r["describedby"]={value:(i+" "+t+" "+a).trim(),append:true};break;case c.Labelled:r["describedby"]={value:i,append:true};break;case c.Combined:r["describedby"]={value:(i+" "+t+" "+a).trim(),append:true};break;default:break}return r};p.generateTextButtonAccProps=function(e){var t=e.getId(),a=p.getButtonTypeAriaLabelId(e.getType()),n=this.getBadgeTextId(e),i=e._getTooltip()?t+"-tooltip":"",s=t+"-content",r=e._determineAccessibilityType(),o=e._determineSelfReferencePresence(),l={},d;switch(r){case c.Default:i&&(l["describedby"]={value:i,append:true});break;case c.Described:d=(i+" "+a+" "+n).trim();d&&(l["describedby"]={value:d,append:true});break;case c.Labelled:o&&(l["labelledby"]={value:s,append:true});i&&(l["describedby"]={value:i,append:true});break;case c.Combined:d=(i+" "+a+" "+n).trim();d&&(l["describedby"]={value:d,append:true});o&&(l["labelledby"]={value:s,append:true});break;default:break}return l};return p},true);