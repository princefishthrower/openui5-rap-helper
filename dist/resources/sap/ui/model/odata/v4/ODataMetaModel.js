/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./ValueListType","./lib/_Helper","sap/base/assert","sap/base/Log","sap/base/util/isEmptyObject","sap/base/util/JSTokenizer","sap/base/util/ObjectPath","sap/ui/base/SyncPromise","sap/ui/model/BindingMode","sap/ui/model/ChangeReason","sap/ui/model/ClientListBinding","sap/ui/model/Context","sap/ui/model/ContextBinding","sap/ui/model/MetaModel","sap/ui/model/PropertyBinding","sap/ui/model/odata/OperationMode","sap/ui/model/odata/type/Boolean","sap/ui/model/odata/type/Byte","sap/ui/model/odata/type/Date","sap/ui/model/odata/type/DateTimeOffset","sap/ui/model/odata/type/Decimal","sap/ui/model/odata/type/Double","sap/ui/model/odata/type/Guid","sap/ui/model/odata/type/Int16","sap/ui/model/odata/type/Int32","sap/ui/model/odata/type/Int64","sap/ui/model/odata/type/Raw","sap/ui/model/odata/type/SByte","sap/ui/model/odata/type/Single","sap/ui/model/odata/type/Stream","sap/ui/model/odata/type/String","sap/ui/model/odata/type/TimeOfDay","sap/ui/thirdparty/URI"],function(e,t,n,i,r,o,a,s,u,f,l,c,d,p,h,y,m,g,v,$,C,b,O,M,P,w,x,E,U,S,T,A,j){"use strict";var L,D=new Map,R=i.Level.DEBUG,I=/\$\(/g,V=/^-?\d+$/,q,N,k="sap.ui.model.odata.v4.ODataMetaModel",B,W=/\(.*\)$/,F=new x,_=/\$\)/g,G=new Map,K={messageChange:true},z={"Edm.Boolean":{Type:m},"Edm.Byte":{Type:g},"Edm.Date":{Type:v},"Edm.DateTimeOffset":{constraints:{$Precision:"precision"},Type:$},"Edm.Decimal":{constraints:{"@Org.OData.Validation.V1.Minimum/$Decimal":"minimum","@Org.OData.Validation.V1.Minimum@Org.OData.Validation.V1.Exclusive":"minimumExclusive","@Org.OData.Validation.V1.Maximum/$Decimal":"maximum","@Org.OData.Validation.V1.Maximum@Org.OData.Validation.V1.Exclusive":"maximumExclusive",$Precision:"precision",$Scale:"scale"},Type:C},"Edm.Double":{Type:b},"Edm.Guid":{Type:O},"Edm.Int16":{Type:M},"Edm.Int32":{Type:P},"Edm.Int64":{Type:w},"Edm.SByte":{Type:E},"Edm.Single":{Type:U},"Edm.Stream":{Type:S},"Edm.String":{constraints:{"@com.sap.vocabularies.Common.v1.IsDigitSequence":"isDigitSequence",$MaxLength:"maxLength"},Type:T},"Edm.TimeOfDay":{constraints:{$Precision:"precision"},Type:A}},H={},J="@com.sap.vocabularies.Common.v1.ValueList",Q="@com.sap.vocabularies.Common.v1.ValueListMapping",X="@com.sap.vocabularies.Common.v1.ValueListReferences",Y="@com.sap.vocabularies.Common.v1.ValueListWithFixedValues",Z=i.Level.WARNING;function ee(e,t,n,i){var r,o=e.mSchema2MetadataUrl[t];if(!o){o=e.mSchema2MetadataUrl[t]={};o[n]=false}else if(!(n in o)){r=Object.keys(o)[0];if(o[r]){ae(e,"A schema cannot span more than one document: "+t+" - expected reference URI "+r+" but instead saw "+n,i)}o[n]=false}}function te(e,t,n,i){var r,o,a,u;function f(e){var r,a;if(!(n in e)){i(Z,o," does not contain ",n);return}i(R,"Including ",n," from ",o);for(a in e){if(a[0]!=="$"&&se(a)===n){r=e[a];t[a]=r;oe(r,t.$Annotations)}}}if(n in t){return t[n]}u=e.mSchema2MetadataUrl[n];if(u){a=Object.keys(u);if(a.length>1){ae(e,"A schema cannot span more than one document: "+"schema is referenced by following URLs: "+a.join(", "),n)}o=a[0];u[o]=true;i(R,"Namespace ",n," found in $Include of ",o);r=e.mMetadataUrl2Promise[o];if(!r){i(R,"Reading ",o);r=e.mMetadataUrl2Promise[o]=s.resolve(e.oRequestor.read(o)).then(e.validate.bind(e,o))}r=r.then(f);if(n in t){return t[n]}t[n]=r;return r}}function ne(e,t){if(e===t){return""}if(e.startsWith(t)&&e[t.length]==="#"&&e.indexOf("@",t.length)<0){return e.slice(t.length+1)}}function ie(e){var t=ne(e,Q);return t!==undefined?t:ne(e,J)}function re(e,t){return t.some(function(t){return e==="$ReturnType"?t.$ReturnType:t.$Parameter&&t.$Parameter.some(function(t){return t.$Name===e})})}function oe(e,t,n){var i;function r(e,t){var i;for(i in t){if(n||!(i in e)){e[i]=t[i]}}}for(i in e.$Annotations){if(!(i in t)){t[i]={}}r(t[i],e.$Annotations[i])}delete e.$Annotations}function ae(e,t,n){var i=new Error(n+": "+t);e.oModel.reportError(t,k,i);throw i}function se(e){return e.slice(0,e.lastIndexOf(".")+1)}q=d.extend("sap.ui.model.odata.v4.ODataMetaContextBinding",{constructor:function(e,t,i){n(!i||i.getModel()===e,"oContext must belong to this model");d.call(this,e,t,i)},initialize:function(){var e=this.oModel.createBindingContext(this.sPath,this.oContext);this.bInitial=false;if(e!==this.oElementContext){this.oElementContext=e;this._fireChange()}},setContext:function(e){n(!e||e.getModel()===this.oModel,"oContext must belong to this model");if(e!==this.oContext){this.oContext=e;if(!this.bInitial){this.initialize()}}}});N=l.extend("sap.ui.model.odata.v4.ODataMetaListBinding",{constructor:function(){l.apply(this,arguments)},_fireFilter:function(){},_fireSort:function(){},checkUpdate:function(e){var t=this.oList.length;this.update();if(e||this.oList.length!==t){this._fireChange({reason:f.Change})}},fetchContexts:function(){var e,t=this.oModel.resolve(this.sPath,this.oContext),n=this;if(!t){return s.resolve([])}e=t.endsWith("@");if(!e&&!t.endsWith("/")){t+="/"}return this.oModel.fetchObject(t).then(function(i){if(!i){return[]}if(e){t=t.slice(0,-1)}return Object.keys(i).filter(function(t){return t[0]!=="$"&&e!==(t[0]!=="@")}).map(function(e){return new c(n.oModel,t+e)})})},getContexts:function(e,t){this.iCurrentStart=e||0;this.iCurrentLength=Math.min(t||Infinity,this.iLength-this.iCurrentStart);return this.getCurrentContexts()},getCurrentContexts:function(){var e=[],t,n=this.iCurrentStart+this.iCurrentLength;for(t=this.iCurrentStart;t<n;t+=1){e.push(this.oList[this.aIndices[t]])}if(this.oList.dataRequested){e.dataRequested=true}return e},setContexts:function(e){this.oList=e;this.updateIndices();this.applyFilter();this.applySort();this.iLength=this._getLength()},update:function(){var e=[],t=this.fetchContexts(),n=this;if(t.isFulfilled()){e=t.getResult()}else{t.then(function(e){n.setContexts(e);n._fireChange({reason:f.Change})});e.dataRequested=true}this.setContexts(e)}});B=h.extend("sap.ui.model.odata.v4.ODataMetaPropertyBinding",{constructor:function(){h.apply(this,arguments);this.vValue=undefined},checkUpdate:function(e,t){var n,i=this;function r(n){if(e||n!==i.vValue){i.vValue=n;i._fireChange({reason:t||f.Change})}return n}n=this.oModel.fetchObject(this.sPath,this.oContext,this.mParameters).then(r);if(this.mParameters&&this.mParameters.$$valueAsPromise&&n.isPending()){r(n.unwrap())}else if(n.isRejected()){n.unwrap()}},getValue:function(){return this.vValue},setContext:function(e){if(this.oContext!==e){this.oContext=e;if(this.bRelative){this.checkUpdate(false,f.Context)}}},setValue:function(){throw new Error("Unsupported operation: ODataMetaPropertyBinding#setValue")}});var ue=p.extend("sap.ui.model.odata.v4.ODataMetaModel",{constructor:function(e,t,n,i,r){p.call(this);this.aAnnotationUris=n&&!Array.isArray(n)?[n]:n;this.sDefaultBindingMode=u.OneTime;this.mETags={};this.dLastModified=new Date(0);this.oMetadataPromise=null;this.oModel=i;this.mMetadataUrl2Promise={};this.oRequestor=e;this.mSchema2MetadataUrl={};this.mSupportedBindingModes={OneTime:true,OneWay:true};this.bSupportReferences=r!==false;this.mUnsupportedFilterOperators={All:true,Any:true};this.sUrl=t}});ue.prototype.$$valueAsPromise=true;ue.prototype._mergeAnnotations=function(e,t){var n=this;this.validate(this.sUrl,e);e.$Annotations={};Object.keys(e).forEach(function(t){if(e[t].$kind==="Schema"){ee(n,t,n.sUrl);oe(e[t],e.$Annotations)}});t.forEach(function(t,i){var r,o;n.validate(n.aAnnotationUris[i],t);for(o in t){if(o[0]!=="$"){if(o in e){ae(n,"A schema cannot span more than one document: "+o,n.aAnnotationUris[i])}r=t[o];e[o]=r;if(r.$kind==="Schema"){ee(n,o,n.aAnnotationUris[i]);oe(r,e.$Annotations,true)}}}})};ue.prototype.attachEvent=function(e){if(!(e in K)){throw new Error("Unsupported event '"+e+"': v4.ODataMetaModel#attachEvent")}return p.prototype.attachEvent.apply(this,arguments)};ue.prototype.bindContext=function(e,t){return new q(this,e,t)};ue.prototype.bindList=function(e,t,n,i){return new N(this,e,t,n,i)};ue.prototype.bindProperty=function(e,t,n){return new B(this,e,t,n)};ue.prototype.bindTree=function(){throw new Error("Unsupported operation: v4.ODataMetaModel#bindTree")};ue.prototype.fetchCanonicalPath=function(e){return this.fetchUpdateData("",e).then(function(t){if(!t.editUrl){throw new Error(e.getPath()+": No canonical path for transient entity")}if(t.propertyPath){throw new Error("Context "+e.getPath()+" does not point to an entity. It should be "+t.entityPath)}return"/"+t.editUrl})};ue.prototype.fetchData=function(){return this.fetchEntityContainer().then(function(e){return JSON.parse(JSON.stringify(e))})};ue.prototype.fetchEntityContainer=function(e){var t,n=this;if(!this.oMetadataPromise){t=[s.resolve(this.oRequestor.read(this.sUrl,false,e))];if(this.aAnnotationUris){this.aAnnotationUris.forEach(function(i){t.push(s.resolve(n.oRequestor.read(i,true,e)))})}if(!e){this.oMetadataPromise=s.all(t).then(function(e){var t=e[0];n._mergeAnnotations(t,e.slice(1));return t})}}return this.oMetadataPromise};ue.prototype.fetchObject=function(e,t,n){var r=this.resolve(e,t),u=this;if(!r){i.error("Invalid relative path w/o context",e,k);return s.resolve(null)}return this.fetchEntityContainer().then(function(f){var l,d,p,h,y,m,g,v,$;function C(e,t,n){var i,r,o,a,s="";if(t){r=t.indexOf("@@");if(r>0){t=t.slice(0,r)}}else{t=e}n=n||"";if(l){m=a=$.filter(M);if(a.length!==1){return P(Z,"Expected a single overload, but found "+a.length)}if(l!==H){s=a[0].$Parameter[0].$isCollection?"Collection("+l+")":l}o=v+"("+s+")"+n;if(f.$Annotations[o]){if(t==="@"){$=f.$Annotations[o];i=f.$Annotations[v+n];if(i){$=Object.assign({},i,$)}return false}if(t in f.$Annotations[o]){v=o;$=f;return true}}}v+=n;$=f;return true}function b(e,t){var i,r,s,f=e.indexOf("@",2);if(f>-1){return P(Z,"Unsupported path after ",e.slice(0,f))}e=e.slice(2);s=e.indexOf("(");if(s>0){if(!e.endsWith(")")){return P(Z,"Expected ')' instead of '",e.slice(-1),"'")}try{r=o.parseJS("["+e.slice(s+1,-1).replace(I,"{").replace(_,"}")+"]")}catch(e){return P(Z,e.message,": ",e.text.slice(1,e.at),"<--",e.text.slice(e.at,-1))}e=e.slice(0,s)}i=e[0]==="."?a.get(e.slice(1),n.scope):n&&a.get(e,n.scope)||(e==="requestCurrencyCodes"||e==="requestUnitsOfMeasure"?u[e].bind(u):a.get(e));if(typeof i!=="function"){return P(Z,e," is not a function but: "+i)}try{$=i($,{$$valueAsPromise:n&&n.$$valueAsPromise,arguments:r,context:new c(u,t),schemaChildName:g,overload:m.length===1?m[0]:undefined})}catch(t){P(Z,"Error calling ",e,": ",t)}return true}function O(e,t){var n;if(e==="$ReturnType"){if(t.$ReturnType){$=t.$ReturnType;return true}}else if(e&&t.$Parameter){n=t.$Parameter.filter(function(t){return t.$Name===e});if(n.length){$=n[0];return true}}return false}function M(e){return!e.$IsBound&&l===H||e.$IsBound&&l===e.$Parameter[0].$Type}function P(e){var t;if(i.isLoggable(e,k)){t=Array.isArray(p)?p.join("/"):p;i[e===R?"debug":"warning"](Array.prototype.slice.call(arguments,1).join("")+(t?" at /"+t:""),r,k)}if(e===Z){$=undefined}return false}function w(e,t){var n;function i(){p=p||v&&t&&v+"/"+t;return P.apply(this,arguments)}l=$&&$.$Type||l;if(u.bSupportReferences&&!(e in f)){n=se(e);$=te(u,f,n,i)}if(e in f){v=h=g=e;$=m=f[g];if(!s.isThenable($)){return true}}if(s.isThenable($)&&$.isPending()){return i(R,"Waiting for ",n)}return i(Z,"Unknown qualified name ",e)}function x(e,t,n){var i,r;if(e==="$Annotations"){return P(Z,"Invalid segment: $Annotations")}if(t&&typeof $==="object"&&e in $){if(e[0]==="$"||V.test(e)){y=false}}else{i=e.indexOf("@@");if(i<0){if(e.endsWith("@sapui.name")){i=e.length-11}else{i=e.indexOf("@")}}if(i>0){if(!x(e.slice(0,i),t,n)){return false}e=e.slice(i);r=true}if(typeof $==="string"&&!(r&&(e==="@sapui.name"||e[1]==="@"))&&!E($,n.slice(0,t))){return false}if(y){if(e[0]==="$"&&e!=="$Parameter"&&e!=="$ReturnType"||V.test(e)){y=false}else{if(r){}else if(e[0]!=="@"&&e.indexOf(".")>0){return w(e)}else if($&&"$Type"in $){if(!w($.$Type,"$Type")){return false}}else if($&&"$Action"in $){if(!w($.$Action,"$Action")){return false}l=H}else if($&&"$Function"in $){if(!w($.$Function,"$Function")){return false}l=H}else if(!t){v=h=g=g||f.$EntityContainer;$=m=m||f[g];if(Array.isArray($)&&O(e,$[0])){return true}if(e&&e[0]!=="@"&&!(e in m)){return P(Z,"Unknown child ",e," of ",g)}}if(Array.isArray($)){if(e==="$Parameter"){return true}if(e.startsWith("@$ui5.overload@")){e=e.slice(14);r=true}if(r){if(e[1]!=="@"&&!C(e)){return false}}else{if(e!==n[t]&&n[t][e.length+1]!=="@"&&re(e,$)){h=e;return C(e,n[t].slice(e.length),"/"+h)}if(l){$=$.filter(M)}if(e==="@$ui5.overload"){return true}if($.length!==1){return P(Z,"Expected a single overload, but found "+$.length)}if(O(e,$[0])){return true}$=$[0].$ReturnType;v+="/0/$ReturnType";if($){if(e==="value"&&!(f[$.$Type]&&f[$.$Type].value)){h=undefined;return true}if(!w($.$Type,"$Type")){return false}}if(!e){return true}}}}}if(!e){return t+1>=n.length||P(Z,"Invalid empty segment")}if(e[0]==="@"){if(e==="@sapui.name"){$=h;if($===undefined){P(Z,"Unsupported path before @sapui.name")}else if(t+1<n.length){P(Z,"Unsupported path after @sapui.name")}return false}if(e[1]==="@"){if(t+1<n.length){return P(Z,"Unsupported path after ",e)}return b(e,[""].concat(n.slice(0,t),n[t].slice(0,i)).join("/"))}}if(!$||typeof $!=="object"){$=undefined;return!d&&P(R,"Invalid segment: ",e)}if(y&&e[0]==="@"){l=$.$Type||l;$=f.$Annotations[v]||{};y=false}else if(e==="$"&&t+1<n.length){return P(Z,"Unsupported path after $")}}if(e!=="@"&&e!=="$"){if(e[0]==="@"){d=true}h=y||e[0]==="@"?e:undefined;v=y?v+"/"+e:undefined;$=$[e]}return true}function E(e,t){var n;if(p){return P(Z,"Invalid recursion")}p=t;d=false;y=true;$=f;n=e.split("/").every(x);p=undefined;return n}if(!E(r.slice(1))&&s.isThenable($)){$=$.then(function(){return u.fetchObject(e,t,n)})}return $})};ue.prototype.fetchUI5Type=function(e,t){var n=this.getMetaContext(e),o=this;if(e.endsWith("/$count")){L=L||new w;return s.resolve(L)}return this.fetchObject(undefined,n).catch(function(){}).then(function(a){var s=F,u;if(!a){i.warning("No metadata for path '"+e+"', using "+s.getName(),undefined,k);return s}if(t){if(r(t)){t=undefined}else if("parseKeepsEmptyString"in t&&a.$Type!=="Edm.String"){if(Object.keys(t).length===1){t=undefined}else{t=Object.assign({},t);delete t.parseKeepsEmptyString}}}if(!t&&a["$ui5.type"]){return a["$ui5.type"]}if(a.$isCollection){i.warning("Unsupported collection type, using "+s.getName(),e,k)}else{u=z[a.$Type];if(u){s=new u.Type(t,o.getConstraints(a,n.getPath()))}else{i.warning("Unsupported type '"+a.$Type+"', using "+s.getName(),e,k)}}if(!t){a["$ui5.type"]=s}return s})};ue.prototype.fetchUpdateData=function(e,n,i){var r=n.getModel(),o=r.resolve(e,n),a=this;function u(e){var t=new Error(o+": "+e);r.reportError(e,k,t);throw t}return this.fetchObject(this.getMetaPath(o)).then(function(){return a.fetchEntityContainer()}).then(function(r){var a,f=r[r.$EntityContainer],l,c,d,p,h,y,m,g;function v(e){var t=e.indexOf("(");return t>=0?e.slice(t):""}function $(e){a.push({path:h,prefix:e,type:g})}function C(e){var t=e.indexOf("(");return t>=0?e.slice(0,t):e}function b(e){if(e.includes("($uid=")){$(C(e))}else{a.push(e)}}m=o.slice(1).split("/");p=m.shift();h="/"+p;l=h;d=decodeURIComponent(C(p));c=f[d];if(!c){u("Not an entity set: "+d)}g=r[c.$Type];e="";y="";a=[];b(p);m.forEach(function(n){var i,o;h+="/"+n;if(V.test(n)){$(a.pop());l+="/"+n}else{o=decodeURIComponent(C(n));y=t.buildPath(y,o);i=g[o];if(!i){u("Not a (navigation) property: "+o)}g=r[i.$Type];if(i.$kind==="NavigationProperty"){if(c.$NavigationPropertyBinding&&y in c.$NavigationPropertyBinding){d=c.$NavigationPropertyBinding[y];c=f[d];y="";a=[encodeURIComponent(d)+v(n)];if(!i.$isCollection){$(a.pop())}}else{b(n)}l=h;e=""}else{e=t.buildPath(e,n)}}});if(i){return s.resolve({editUrl:undefined,entityPath:l,propertyPath:e})}return s.all(a.map(function(e){if(typeof e==="string"){return e}return n.fetchValue(e.path).then(function(n){var r;if(!n){u("No instance to calculate key predicate at "+e.path)}if(t.hasPrivateAnnotation(n,"transient")){i=true;return undefined}r=t.getPrivateAnnotation(n,"predicate");if(!r){u("No key predicate known at "+e.path)}return e.prefix+r},function(t){u(t.message+" at "+e.path)})})).then(function(t){return{editUrl:i?undefined:t.join("/"),entityPath:l,propertyPath:e}})})};ue.prototype.fetchValueListMappings=function(e,n,i,r){var o=this,a=e.getMetaModel();function s(){var e=r[0],t="";if(r.length!==1){throw new Error("Expected a single overload, but found "+r.length)}if(e.$IsBound){t=e.$Parameter[0].$isCollection?"Collection("+e.$Parameter[0].$Type+")":e.$Parameter[0].$Type}return n+"("+t+")"}return a.fetchEntityContainer().then(function(r){var u,f=r.$Annotations,l,c=t.namespace(n),d={},p=o===a,h,y;if(i.$Name){l=s()+"/"+i.$Name;y=n+"/"+i.$Name}h=Object.keys(f).filter(function(n){if(t.namespace(n)===c){if(l?n===l||n===y:o.getObject("/"+n)===i){return true}if(p||y&&t.getMetaPath(n)===y){return false}throw new Error("Unexpected annotation target '"+n+"' with namespace of data service in "+e.sServiceUrl)}return false});if(!h.length){throw new Error("No annotation '"+J.slice(1)+"' in "+e.sServiceUrl)}if(h.length===1){u=f[h[0]]}else{u=Object.assign({},f[y],f[l])}Object.keys(u).forEach(function(t){var n=ie(t);if(n!==undefined){d[n]=u[t];["CollectionRoot","SearchSupported"].forEach(function(n){if(n in u[t]){throw new Error("Property '"+n+"' is not allowed in annotation '"+t.slice(1)+"' for target '"+h[0]+"' in "+e.sServiceUrl)}})}else if(!p){throw new Error("Unexpected annotation '"+t.slice(1)+"' for target '"+h[0]+"' with namespace of data service in "+e.sServiceUrl)}});return d})};ue.prototype.fetchValueListType=function(t){var n=this.getMetaContext(t),i=this;return this.fetchObject(undefined,n).then(function(r){var o,a;if(!r){throw new Error("No metadata for "+t)}o=i.getObject("@",n);if(o[Y]){return e.Fixed}for(a in o){if(ne(a,X)!==undefined||ne(a,Q)!==undefined){return e.Standard}if(ne(a,J)!==undefined){return o[a].SearchSupported===false?e.Fixed:e.Standard}}return e.None})};ue.prototype.getAbsoluteServiceUrl=function(e){var t=new j(this.sUrl).absoluteTo(document.baseURI).pathname().toString();return new j(e).absoluteTo(t).filename("").toString()};ue.prototype.getAllPathReductions=function(e,t,n,i){var r=t.split("/").length,o,a={},s=e.split("/"),u=this;function f(e,t,o,s){var l,c,d;function p(i){if(!n){f(e,t,l-1,true)}if(s){t=t.slice();e=e.slice()}t.splice(l,i);e.splice(l,i);if(!n){a[e.join("/")]=true}}for(l=o;l>=r;l-=1){c=V.test(e[l+1])?l+2:l+1;if(c<e.length&&t[l].$Partner===e[c]&&!t[c].$isCollection&&t[c].$Partner===e[l].replace(W,"")){p(c-l+1)}else if(Array.isArray(t[l])&&e[l+1]==="$Parameter"){d=u.getObject(u.getMetaPath(e.slice(0,l+1).join("/")+"/@$ui5.overload"));if(d.length===1&&d[0].$Parameter[0].$Name===e[l+2]){p(3)}}else if(i&&t[l].$isCollection){break}}}o=s.map(function(e,t){return t<r||e[0]==="#"||e[0]==="@"||V.test(e)||e==="$Parameter"?{}:u.getObject(u.getMetaPath(s.slice(0,t+1).join("/")))||{}});a[e]=true;if(!(i&&o[s.length-1].$isCollection)){f(s,o,s.length-2)}return n?s.join("/"):Object.keys(a)};ue.prototype.getConstraints=function(e,t){var n,i,r,o=z[e.$Type];function a(e,t){if(t!==undefined){i=i||{};i[e]=t}}if(o){r=o.constraints;for(n in r){a(r[n],n[0]==="@"?this.getObject(t+n):e[n])}if(e.$Nullable===false){a("nullable",false)}}return i};ue.prototype.getData=t.createGetMethod("fetchData");ue.prototype.getETags=function(){return this.mETags};ue.prototype.getLastModified=function(){return this.dLastModified};ue.prototype.getMetaContext=function(e){return new c(this,this.getMetaPath(e))};ue.prototype.getMetaPath=function(e){return t.getMetaPath(e)};ue.prototype.getObject=t.createGetMethod("fetchObject");ue.prototype.getOrCreateSharedModel=function(e,t,n){var i,r;e=this.getAbsoluteServiceUrl(e);i=!!n+e;r=G.get(i);if(!r){r=new this.oModel.constructor({autoExpandSelect:n,groupId:t,httpHeaders:this.oModel.getHttpHeaders(),operationMode:y.Server,serviceUrl:e,sharedRequests:true,synchronizationMode:"None"});G.set(i,r)}return r};ue.prototype.getOriginalProperty=function(){throw new Error("Unsupported operation: v4.ODataMetaModel#getOriginalProperty")};ue.prototype.getProperty=ue.prototype.getObject;ue.prototype.getReducedPath=function(e,t){return this.getAllPathReductions(e,t,true,true)};ue.prototype.getUI5Type=t.createGetMethod("fetchUI5Type",true);ue.prototype.getUnitOrCurrencyPath=function(e){var t=this.getObject("@",this.getMetaContext(e)),n=t&&(t["@Org.OData.Measures.V1.Unit"]||t["@Org.OData.Measures.V1.ISOCurrency"]);return n&&n.$Path};ue.prototype.getValueListType=t.createGetMethod("fetchValueListType",true);ue.prototype.isList=function(){throw new Error("Unsupported operation: v4.ODataMetaModel#isList")};ue.prototype.refresh=function(){throw new Error("Unsupported operation: v4.ODataMetaModel#refresh")};ue.prototype.requestCodeList=function(e,t,n){var r=this.fetchEntityContainer().getResult(),o=r[r.$EntityContainer],a=this;if(n&&n.context){if(n.context.getModel()!==this||n.context.getPath()!=="/"){throw new Error("Unsupported context: "+n.context)}}if(t!==undefined&&t!==o){throw new Error("Unsupported raw value: "+t)}return this.requestObject("/@com.sap.vocabularies.CodeList.v1."+e).then(function(e){var t,n,r,o,s;if(!e){return null}t=a.getAbsoluteServiceUrl(e.Url)+"#"+e.CollectionPath;o=D.get(t);if(o){return o}r=a.getOrCreateSharedModel(e.Url,"$direct");n=r.getMetaModel();s="/"+e.CollectionPath+"/";o=n.requestObject(s).then(function(t){var o=s+"@Org.OData.Core.V1.AlternateKeys",a=n.getObject(o),u,f=g(t.$Key),l=s+f+"@com.sap.vocabularies.Common.v1.",c,d,p=s+f+"@com.sap.vocabularies.CodeList.v1.StandardCode/$Path",h,y;function m(t,n){var r=n.getProperty(f),o={Text:n.getProperty(y),UnitSpecificScale:n.getProperty(d)};if(h){o.StandardCode=n.getProperty(h)}if(o.UnitSpecificScale===null){i.error("Ignoring customizing w/o unit-specific scale for code "+r+" from "+e.CollectionPath,e.Url,k)}else{t[r]=o}return t}function g(e){var t;if(e&&e.length===1){t=e[0]}else{throw new Error("Single key expected: "+s)}return typeof t==="string"?t:t[Object.keys(t)[0]]}if(a){if(a.length!==1){throw new Error("Single alternative expected: "+o)}else if(a[0].Key.length!==1){throw new Error("Single key expected: "+o+"/0/Key")}f=a[0].Key[0].Name.$PropertyPath}d=n.getObject(l+"UnitSpecificScale/$Path");y=n.getObject(l+"Text/$Path");c=[f,d,y];h=n.getObject(p);if(h){c.push(h)}u=r.bindList("/"+e.CollectionPath,null,null,null,{$select:c});return u.requestContexts(0,Infinity).then(function(t){if(!t.length){i.error("Customizing empty for ",r.sServiceUrl+e.CollectionPath,k)}return t.reduce(m,{})}).finally(function(){u.destroy()})});D.set(t,o);return o})};ue.prototype.requestCurrencyCodes=function(e,t){return this.requestCodeList("CurrencyCodes",e,t)};ue.prototype.requestData=t.createRequestMethod("fetchData");ue.prototype.requestObject=t.createRequestMethod("fetchObject");ue.prototype.requestUI5Type=t.createRequestMethod("fetchUI5Type");ue.prototype.requestUnitsOfMeasure=function(e,t){return this.requestCodeList("UnitsOfMeasure",e,t)};ue.prototype.requestValueListInfo=function(e,n){var i=this.getMetaPath(e),r=i.slice(0,i.lastIndexOf("/")).replace("/$Parameter",""),o=r.slice(r.lastIndexOf("/")+1),a=this;if(!o.includes(".")){o=undefined}return Promise.all([o||this.requestObject(r+"/@sapui.name"),this.requestObject(i),this.requestObject(i+"@"),this.requestObject(i+Y),this.requestObject(r+"/@$ui5.overload")]).then(function(i){var r=i[2],o=i[3],s={},u=i[1],f={};function l(i,r,u,l){if(o!==undefined&&"SearchSupported"in i){throw new Error("Must not set 'SearchSupported' in annotation "+"'com.sap.vocabularies.Common.v1.ValueList' and annotation "+"'com.sap.vocabularies.Common.v1.ValueListWithFixedValues'")}if("CollectionRoot"in i){l=a.getOrCreateSharedModel(i.CollectionRoot,undefined,n);if(f[r]&&f[r].$model===l){s[r]=undefined}}if(s[r]){throw new Error("Annotations '"+J.slice(1)+"' with identical qualifier '"+r+"' for property "+e+" in "+s[r]+" and "+u)}s[r]=u;i=t.clone(i);i.$model=l;delete i.CollectionRoot;delete i.SearchSupported;f[r]=i}if(!u){throw new Error("No metadata for "+e)}return Promise.all(Object.keys(r).filter(function(e){return ne(e,X)!==undefined}).map(function(e){var t=r[e];return Promise.all(t.map(function(e){var t=a.getOrCreateSharedModel(e,undefined,n);return a.fetchValueListMappings(t,i[0],u,i[4]).then(function(n){Object.keys(n).forEach(function(i){l(n[i],i,e,t)})})}))})).then(function(){var t;Object.keys(r).filter(function(e){return ie(e)!==undefined}).forEach(function(e){l(r[e],ie(e),a.sUrl,a.oModel)});t=Object.keys(f);if(!t.length){throw new Error("No annotation '"+X.slice(1)+"' for "+e)}if(o){if(t.length>1){throw new Error("Annotation '"+Y.slice(1)+"' but multiple '"+J.slice(1)+"' for property "+e)}return{"":f[t[0]]}}return f})})};ue.prototype.requestValueListType=t.createRequestMethod("fetchValueListType");ue.prototype.resolve=function(e,t){var n,i;if(!e){return t?t.getPath():undefined}i=e[0];if(i==="/"){return e}if(!t){return undefined}if(i==="."){if(e[1]!=="/"){throw new Error("Unsupported relative path: "+e)}e=e.slice(2)}n=t.getPath();return i==="@"||n.endsWith("/")?n+e:n+"/"+e};ue.prototype.setLegacySyntax=function(){throw new Error("Unsupported operation: v4.ODataMetaModel#setLegacySyntax")};ue.prototype.toString=function(){return k+": "+this.sUrl};ue.prototype.validate=function(e,t){var n,i,r,o,a,s;if(!this.bSupportReferences){return t}for(s in t.$Reference){a=t.$Reference[s];s=new j(s).absoluteTo(this.sUrl).toString();if("$IncludeAnnotations"in a){ae(this,"Unsupported IncludeAnnotations",e)}for(n in a.$Include){o=a.$Include[n];if(o in t){ae(this,"A schema cannot span more than one document: "+o+" - is both included and defined",e)}ee(this,o,s,e)}}r=t.$LastModified?new Date(t.$LastModified):null;this.mETags[e]=t.$ETag?t.$ETag:r;i=t.$Date?new Date(t.$Date):new Date;r=r||i;if(this.dLastModified<r){this.dLastModified=r}delete t.$Date;delete t.$ETag;delete t.$LastModified;return t};return ue});