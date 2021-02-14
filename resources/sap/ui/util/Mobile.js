/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/Device","sap/base/Log","sap/ui/thirdparty/jquery"],function(e,t,n){"use strict";var i={};if(e.os.windows_phone){var o;o=document.createElement("meta");o.setAttribute("name","msapplication-tap-highlight");o.setAttribute("content","no");document.head.appendChild(o);o=document.createElement("style");o.appendChild(document.createTextNode("@-ms-viewport{width:device-width;}"));document.head.appendChild(o)}var a=false;i.init=function(t){var o=n("head");if(!a){a=true;t=n.extend({},{viewport:true,statusBar:"default",hideBrowser:true,preventScroll:true,preventPhoneNumberDetection:true,useFullScreenHeight:true,homeIconPrecomposed:false,mobileWebAppCapable:"default"},t);if(e.os.ios&&t.preventPhoneNumberDetection){o.append(n('<meta name="format-detection" content="telephone=no">'))}else if(e.browser.msie){o.append(n('<meta http-equiv="cleartype" content="on">'));o.append(n('<meta name="msapplication-tap-highlight" content="no">'))}var s=e.os.ios&&e.os.version>=7&&e.os.version<8&&e.browser.name==="sf";if(t.viewport){var r;var l=e.resize.height;var p=e.resize.width;if(s&&e.system.phone){r="minimal-ui, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"}else if(s&&e.system.tablet){r="initial-scale=1.0, maximum-scale=1.0, user-scalable=no"}else if(e.os.ios&&e.system.phone&&Math.max(window.screen.height,window.screen.width)===568){r="user-scalable=0, initial-scale=1.0"}else if(e.os.android&&e.os.version<3){r="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"}else{r="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"}o.append(n('<meta name="viewport" content="'+r+'">'));if((l!==window.innerHeight||p!==window.innerWidth)&&e.resize._update){e.resize._update()}}if(t.mobileWebAppCapable==="default"){if(e.os.ios){o.append(n('<meta name="apple-mobile-web-app-capable" content="yes">'))}}if(e.os.ios){o.append(n('<meta name="apple-mobile-web-app-status-bar-style" content="'+t.statusBar+'">'))}if(t.useFullScreenHeight){n(function(){document.documentElement.style.height="100%"})}if(t.preventScroll&&e.os.ios){n(function(){document.documentElement.style.position="fixed";document.documentElement.style.overflow="hidden";document.documentElement.style.height="100%";document.documentElement.style.width="100%"})}}if(t&&t.homeIcon){var c;if(typeof t.homeIcon==="string"){c={phone:t.homeIcon}}else{c=n.extend({},t.homeIcon)}c.precomposed=t.homeIconPrecomposed||c.precomposed;c.favicon=t.homeIcon.icon||c.favicon;c.icon=undefined;i.setIcons(c)}if(t&&t.mobileWebAppCapable!=="default"){i.setWebAppCapable(t.mobileWebAppCapable)}};i.setIcons=function(i){if(!i||typeof i!=="object"){t.warning("Call to sap/ui/util/Mobile.setIcons() has been ignored because there were no icons given or the argument was not an object.");return}var o=n("head"),a=i.precomposed?"-precomposed":"",s=function(e){return i[e]||i["tablet@2"]||i["phone@2"]||i["phone"]||i["tablet"]},r={phone:"",tablet:"76x76","phone@2":"120x120","tablet@2":"152x152"};if(i["favicon"]){var l=o.find("[rel^=shortcut]");l.each(function(){if(this.rel==="shortcut icon"){n(this).remove()}});if(e.browser.msie){var p=n('<link rel="shortcut icon">');o.append(p);p.attr("href",i["favicon"])}else{o.append(n('<link rel="shortcut icon" href="'+i["favicon"]+'">'))}}if(s("phone")){o.find("[rel=apple-touch-icon]").remove();o.find("[rel=apple-touch-icon-precomposed]").remove()}for(var c in r){i[c]=i[c]||s(c);if(i[c]){var m=r[c];o.append(n('<link rel="apple-touch-icon'+a+'" '+(m?'sizes="'+m+'"':"")+' href="'+i[c]+'">'))}}};i.setWebAppCapable=function(t){if(!e.system.tablet&&!e.system.phone){return}var i=n("head"),o=["","apple"],a="mobile-web-app-capable",s=t?"yes":"no",r,l,p;for(r=0;r<o.length;r++){l=o[r]?o[r]+"-"+a:a;p=i.children('meta[name="'+l+'"]');if(p.length){p.attr("content",s)}else{i.append(n('<meta name="'+l+'" content="'+s+'">'))}}};return i});