/* global _pbjsGlobals */
/* eslint-env browser, es6 */ /* <- add es6 so Proxy is allowed */
/* eslint-disable no-console */
/**
 * Sevio Loader - 2.4.3 - 01.06.2026 ----
 */
(() => {
  'use strict';
  const PREBID_CONFIG = "https://config-resolver.adx.ws";
  const PREBID_ANALYTICS = "https://request.adx.ws/a";

  /**
   * Returns a Promise that resolves with:
   * { status, tcData, consentGiven }
   *
   * status: 'user_action_complete' | 'tcf_present' | 'force_load' | 'tcf_not_loaded' | 'no_cmp_found' | 'error'
   */
  const getTcfConsentStatus = (cmpType) =>
    new Promise((resolve) => {
      let poller = null;
      const pollIntervalMs = 100;

      let settled = false;
      const finish = (result) => {
        if (settled) return;
        settled = true;
        resolve(result);
        if (poller) {
          clearInterval(poller);
          poller = null;
        }
      };

      // Helper inline to determine consent from tcData (no external function)
      const checkConsentInline = (tcData) => {
        if (!tcData) return false;

        // 1) eventStatus user action = clear consent signal
        if (tcData.eventStatus === 'useractioncomplete') return true;

        // 2) check purpose consents (if present)
        if (tcData.purpose && tcData.purpose.consents) {
          try {
            for (const k in tcData.purpose.consents) {
              if (
                Object.prototype.hasOwnProperty.call(
                  tcData.purpose.consents,
                  k
                ) &&
                tcData.purpose.consents[k]
              ) {
                return true;
              }
            }
          } catch (e) {
            /* ignore */
          }
        }

        // 3) check vendor consents (if present)
        if (tcData.vendor && tcData.vendor.consents) {
          try {
            for (const k in tcData.vendor.consents) {
              if (
                Object.prototype.hasOwnProperty.call(
                  tcData.vendor.consents,
                  k
                ) &&
                tcData.vendor.consents[k]
              ) {
                return true;
              }
            }
          } catch (e) {
            /* ignore */
          }
        }

        return false;
      };

      const runMainLogic = () => {
        // 0) Ping first: if GDPR does not apply, treat as TCF present and done
        try {
          // eslint-disable-next-line no-undef
          __tcfapi('ping', 2, (pingData) => {
            if (pingData && pingData.gdprApplies === false) {
              finish({
                status: 'tcf_present',
                tcData: null,
                consentGiven: true
              });
              return;
            }

            // 1) Try getTCData immediately to capture prior state
            try {
              // eslint-disable-next-line no-undef
              __tcfapi('getTCData', 2, (tcData, successTc) => {
                if (successTc && tcData) {
                  const consentGiven = checkConsentInline(tcData);
                  if (
                    tcData.eventStatus === 'useractioncomplete' ||
                    consentGiven
                  ) {
                    finish({
                      status: 'user_action_complete',
                      tcData,
                      consentGiven
                    });
                    return;
                  }
                  if (tcData.eventStatus === 'tcloaded') {
                    finish({ status: 'tcf_present', tcData, consentGiven });
                    return;
                  }
                }
              });
            } catch (e) {
              // ignore errors from getTCData and continue to listener fallback
            }

            // 2) Attach addEventListener to catch future user actions (wait indefinitely)
            try {
              // eslint-disable-next-line no-undef
              __tcfapi('addEventListener', 2, (tcData, successEv) => {
                if (!successEv || !tcData) return;
                const consentGiven = checkConsentInline(tcData);
                if (
                  tcData.eventStatus === 'useractioncomplete' ||
                  consentGiven
                ) {
                  finish({
                    status: 'user_action_complete',
                    tcData,
                    consentGiven
                  });
                } else if (tcData.eventStatus === 'tcloaded') {
                  finish({ status: 'tcf_present', tcData, consentGiven });
                }
                // otherwise keep waiting indefinitely
              });
            } catch (e) {
              // if addEventListener throws, we can't do much without a timeout/ping
              // fall through (the promise will remain pending unless something else resolves it)
            }
          });
        } catch (e) {
          // If ping throws (unlikely), proceed with existing logic below.

          // 1) Try getTCData immediately to capture prior state
          try {
            // eslint-disable-next-line no-undef
            __tcfapi('getTCData', 2, (tcData, success) => {
              if (success && tcData) {
                const consentGiven = checkConsentInline(tcData);
                if (
                  tcData.eventStatus === 'useractioncomplete' ||
                  consentGiven
                ) {
                  finish({
                    status: 'user_action_complete',
                    tcData,
                    consentGiven
                  });
                  return;
                }
                if (tcData.eventStatus === 'tcloaded') {
                  finish({ status: 'tcf_present', tcData, consentGiven });
                  return;
                }
              }
            });
          } catch (e2) {
            // ignore
          }

          // 2) Attach addEventListener to catch future user actions (wait indefinitely)
          try {
            // eslint-disable-next-line no-undef
            __tcfapi('addEventListener', 2, (tcData, success) => {
              if (!success || !tcData) return;
              const consentGiven = checkConsentInline(tcData);
              if (tcData.eventStatus === 'useractioncomplete' || consentGiven) {
                finish({
                  status: 'user_action_complete',
                  tcData,
                  consentGiven
                });
              } else if (tcData.eventStatus === 'tcloaded') {
                finish({ status: 'tcf_present', tcData, consentGiven });
              }
            });
          } catch (e3) {
            // ignore
          }
        }
      };

      // If __tcfapi is present immediately, run the main logic and wait indefinitely for consent
      if (typeof __tcfapi === 'function') {
        runMainLogic();
        return;
      }

      // If CMP is SELF_MANAGED, poll for up to 10 attempts (100ms interval -> 1s total)
      if (cmpType === 'SELF_MANAGED') {
        let attempts = 0;
        const maxAttempts = 10; // 10 * 100ms = 1000ms = 1s
        poller = setInterval(() => {
          attempts += 1;
          if (typeof __tcfapi === 'function') {
            clearInterval(poller);
            poller = null;
            if (!settled) {
              runMainLogic();
            }
            return;
          }

          if (attempts >= maxAttempts) {
            clearInterval(poller);
            poller = null;
            // No __tcfapi after 1s of polling -> treat as no CMP found
            finish({
              status: 'no_cmp_found',
              tcData: null,
              consentGiven: false
            });
          }
        }, pollIntervalMs);

        return;
      }

      // Not SELF_MANAGED and no __tcfapi -> immediate behavior: no CMP found
      finish({ status: 'no_cmp_found', tcData: null, consentGiven: false });
    });

  const urlSearchParams = (() => {
    try {
      return new URLSearchParams(window.location.search);
    } catch {
      return new URLSearchParams('');
    }
  })();

  // Only our sevioDebug flag can enable debug
  let sevioDebugActive = false;
  const sevioDebug = urlSearchParams.get('sevioDebug');
  const sevioDebugLS = (() => {
    try {
      return window.localStorage.getItem('sevioDebug');
    } catch {
      return null;
    }
  })();

  const wrapperScriptNonce = (() => {
    try {
      const currentScript = document.currentScript;
      if (!currentScript) return '';
      return (
        currentScript.getAttribute('nonce') ||
        currentScript.nonce ||
        ''
      ).trim();
    } catch {
      return '';
    }
  })();
  const nonceObservedRoots = new WeakMap();
  const noncePatchedDocuments = new WeakSet();
  const nonceBoundIframes = new WeakSet();

  const applyNonceToScript = (scriptEl) => {
    if (!wrapperScriptNonce || !scriptEl) return;
    scriptEl.setAttribute('nonce', wrapperScriptNonce);
    scriptEl.nonce = wrapperScriptNonce;
  };

  const patchDocumentCreateElementForNonce = (doc) => {
    if (
      !wrapperScriptNonce ||
      !doc ||
      typeof doc.createElement !== 'function' ||
      noncePatchedDocuments.has(doc)
    ) {
      return;
    }

    const originalCreateElement = doc.createElement;
    doc.createElement = function createElementWithNonce(tagName) {
      const created =
        arguments.length > 1
          ? originalCreateElement.call(this, tagName, arguments[1])
          : originalCreateElement.call(this, tagName);

      if (
        created &&
        typeof tagName === 'string' &&
        tagName.toLowerCase() === 'script'
      ) {
        applyNonceToScript(created);
      }
      return created;
    };

    noncePatchedDocuments.add(doc);
  };

  const serializeSrcdocWithNonce = (srcdoc) => {
    if (!wrapperScriptNonce || !srcdoc) return srcdoc;

    const parsed = new DOMParser().parseFromString(srcdoc, 'text/html');
    const scripts = parsed.querySelectorAll('script');
    if (!scripts.length) return srcdoc;

    let changed = false;
    scripts.forEach((scriptEl) => {
      const scriptNonce = scriptEl.getAttribute('nonce');
      if (scriptNonce !== wrapperScriptNonce) {
        scriptEl.setAttribute('nonce', wrapperScriptNonce);
        changed = true;
      }
    });
    if (!changed) return srcdoc;

    const fullDocPattern = /<\s*(?:!doctype|html|head|body)\b/i;
    return fullDocPattern.test(srcdoc)
      ? parsed.documentElement.outerHTML
      : parsed.body.innerHTML;
  };

  const serializeMarkupWithNonce = (markup) => {
    if (!wrapperScriptNonce || !markup) return markup;

    const parsed = new DOMParser().parseFromString(markup, 'text/html');
    let changed = false;

    parsed.querySelectorAll('script').forEach((scriptEl) => {
      const scriptNonce = scriptEl.getAttribute('nonce');
      if (scriptNonce !== wrapperScriptNonce) {
        scriptEl.setAttribute('nonce', wrapperScriptNonce);
        changed = true;
      }
    });

    parsed.querySelectorAll('iframe[srcdoc]').forEach((iframeEl) => {
      const iframeSrcdoc = iframeEl.getAttribute('srcdoc');
      if (!iframeSrcdoc) return;
      const nonceReadySrcdoc = serializeSrcdocWithNonce(iframeSrcdoc);
      if (nonceReadySrcdoc !== iframeSrcdoc) {
        iframeEl.setAttribute('srcdoc', nonceReadySrcdoc);
        changed = true;
      }
    });

    return changed ? parsed.body.innerHTML : markup;
  };

  const observeNodeForNonce = (rootNode) => {
    if (
      !wrapperScriptNonce ||
      !rootNode ||
      typeof MutationObserver !== 'function' ||
      nonceObservedRoots.has(rootNode)
    ) {
      return;
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        Array.from(mutation.addedNodes || []).forEach((node) => {
          applyNonceToSlotNode(node);
        });
      });
    });

    observer.observe(rootNode, {
      childList: true,
      subtree: true
    });
    nonceObservedRoots.set(rootNode, observer);
  };

  const propagateNonceToIframe = (iframeEl) => {
    if (
      !wrapperScriptNonce ||
      !iframeEl ||
      iframeEl.nodeType !== 1 ||
      iframeEl.tagName !== 'IFRAME'
    ) {
      return;
    }

    iframeEl.setAttribute('nonce', wrapperScriptNonce);

    if (!nonceBoundIframes.has(iframeEl)) {
      iframeEl.addEventListener('load', () => {
        propagateNonceToIframe(iframeEl);
      });
      nonceBoundIframes.add(iframeEl);
    }

    const iframeSrcdoc = iframeEl.getAttribute('srcdoc');
    if (typeof iframeSrcdoc === 'string' && iframeSrcdoc) {
      const nonceReadySrcdoc = serializeSrcdocWithNonce(iframeSrcdoc);
      if (nonceReadySrcdoc !== iframeSrcdoc) {
        iframeEl.setAttribute('srcdoc', nonceReadySrcdoc);
      }
    }

    try {
      const iframeDoc = iframeEl.contentDocument;
      if (!iframeDoc) return;
      patchDocumentCreateElementForNonce(iframeDoc);
      const iframeRoot = iframeDoc.documentElement || iframeDoc;
      observeNodeForNonce(iframeRoot);
      applyNonceToSlotNode(iframeRoot);
    } catch {
      // ignore cross-origin frames
    }
  };

  function applyNonceToSlotNode(node) {
    if (!wrapperScriptNonce || !node || node.nodeType !== 1) return;

    const element = node;
    if (element.tagName === 'SCRIPT') {
      applyNonceToScript(element);
    } else if (element.tagName === 'IFRAME') {
      propagateNonceToIframe(element);
    }

    element.querySelectorAll('script').forEach((scriptEl) => {
      applyNonceToScript(scriptEl);
    });

    element.querySelectorAll('iframe').forEach((iframeEl) => {
      propagateNonceToIframe(iframeEl);
    });
  }

  const ensureSlotNoncePropagation = (adUnitCode) => {
    if (!wrapperScriptNonce) return;
    patchDocumentCreateElementForNonce(document);

    const slotDiv = document.getElementById(adUnitCode);
    if (!slotDiv) return;

    observeNodeForNonce(slotDiv);
    applyNonceToSlotNode(slotDiv);
  };

  // helper: run a function with console temporarily muted
  const withMutedConsole = (fn) => {
    const c = console;
    const saved = {
      log: c.log,
      info: c.info,
      warn: c.warn,
      debug: c.debug,
      group: c.group,
      groupCollapsed: c.groupCollapsed,
      groupEnd: c.groupEnd
    };
    const noop = () => {
      /*ignore */
    };
    c.log =
      c.info =
      c.warn =
      c.debug =
      c.group =
      c.groupCollapsed =
      c.groupEnd =
        noop;
    try {
      return fn();
    } finally {
      c.log = saved.log;
      c.info = saved.info;
      c.warn = saved.warn;
      c.debug = saved.debug;
      c.group = saved.group;
      c.groupCollapsed = saved.groupCollapsed;
      c.groupEnd = saved.groupEnd;
    }
  };

  /* === PREBID BUNDLE START — silence Prebid bootstrap logs === */
  withMutedConsole(() => {
    /* prebid.js v10.29.0
Updated: 2026-06-01
Modules: sevioBidAdapter, sevioAnalyticsAdapter, consentManagementTcf, consentManagementUsp, consentManagementGpp, coinzillaBidAdapter, seedtagBidAdapter, nativeRendering, userId, id5IdSystem, schain, sizeMappingV2, sharethroughBidAdapter, criteoIdSystem, euidIdSystem, sharedIdSystem, pairIdSystem, adfBidAdapter, adyoulikeBidAdapter, amxBidAdapter, cointrafficBidAdapter, equativBidAdapter, hypelabBidAdapter, pubmaticBidAdapter */
if(window.sevioPbjs&&window.sevioPbjs.libLoaded)try{window.sevioPbjs.getConfig("debug")&&console.warn("Attempted to load a copy of Prebid.js that clashes with the existing 'sevioPbjs' instance. Load aborted.")}catch(e){}else (function(){
(()=>{var e,r={1490(e,r,t){function n(e){var r,t,o;if(Array.isArray(e)){for(t=Array(r=e.length);r--;)t[r]=(o=e[r])&&"object"==typeof o?n(o):o;return t}if("[object Object]"===Object.prototype.toString.call(e)){for(r in t={},e)"__proto__"===r?Object.defineProperty(t,r,{value:n(e[r]),configurable:!0,enumerable:!0,writable:!0}):t[r]=(o=e[r])&&"object"==typeof o?n(o):o;return t}return e}t.d(r,{Q:()=>n})},3435(e,r,t){function n(e,r,t){r.split&&(r=r.split("."));for(var n,o,i=0,a=r.length,f=e;i<a&&"__proto__"!=(o=""+r[i++])&&"constructor"!==o&&"prototype"!==o;)f=f[o]=i===a?t:typeof(n=f[o])==typeof r?n:0*r[i]!=0||~(""+r[i]).indexOf(".")?{}:[]}t.d(r,{J:()=>n})},3715(e,r,t){t.d(r,{A:()=>n});const n={pbGlobal:"sevioPbjs",defineGlobal:!0,features:{NATIVE:!0,VIDEO:!0,UID2_CSTG:!0,GREEDY:!1,AUDIO:!0,LOG_NON_ERROR:!0,LOG_ERROR:!0},distUrlBase:"https://cdn.jsdelivr.net/npm/prebid.js@10.29.0/dist/chunks/",skipCalls:{}}},5481(e){
/*
* @license MIT
* Fun Hooks v1.1.0
* (c) @snapwich
*/
i.SYNC=1,i.ASYNC=2,i.QUEUE=4;var r="fun-hooks",t=Object.freeze({ready:0}),n=new WeakMap;function o(e,r){return Array.prototype.slice.call(e,r)}function i(e){var a,f={},c=[];function u(e,r){return"function"==typeof e?y.call(null,"sync",e,r):"string"==typeof e&&"function"==typeof r?y.apply(null,arguments):"object"==typeof e?l.apply(null,arguments):void 0}function l(e,r,t){var n=!0;void 0===r&&(r=Object.getOwnPropertyNames(e).filter(e=>!e.match(/^_/)),n=!1);var o={},i=["constructor"];do{r.forEach(function(r){var n=r.match(/(?:(sync|async):)?(.+)/),a=n[1]||"sync",f=n[2];if(!o[f]&&"function"==typeof e[f]&&-1===i.indexOf(f)){var c=e[f];o[f]=e[f]=y(a,c,t?[t,f]:void 0)}}),e=Object.getPrototypeOf(e)}while(n&&e);return o}function p(e){var t=Array.isArray(e)?e:e.split(".");return t.reduce(function(n,o,i){var f=n[o],u=!1;return f||(i===t.length-1?(a||c.push(function(){u||console.warn(r+": referenced '"+e+"' but it was never created")}),n[o]=s(function(e){n[o]=e,u=!0})):n[o]={})},f)}function s(e){var r=[],t=[],o=function(){},i={before:function(e,t){return f.call(this,r,"before",e,t)},after:function(e,r){return f.call(this,t,"after",e,r)},getHooks:function(e){var n=r.concat(t);"object"==typeof e&&(n=n.filter(function(r){return Object.keys(e).every(function(t){return r[t]===e[t]})}));try{Object.assign(n,{remove:function(){return n.forEach(function(e){e.remove()}),this}})}catch(e){console.error("error adding `remove` to array, did you modify Array.prototype?")}return n},removeAll:function(){return this.getHooks().remove()}},a={install:function(n,i,a){this.type=n,o=a,a(r,t),e&&e(i)}};return n.set(i.after,a),i;function f(e,n,i,a){var f={hook:i,type:n,priority:a||10,remove:function(){var n=e.indexOf(f);-1!==n&&(e.splice(n,1),o(r,t))}};return e.push(f),e.sort(function(e,r){return r.priority-e.priority}),o(r,t),this}}function y(t,f,u){var l=f.after&&n.get(f.after);if(l){if(l.type!==t)throw r+": recreated hookable with different type";return f}var y,v=u?p(u):s(),d={get:function(e,r){return v[r]||Reflect.get.apply(Reflect,arguments)}};a||c.push(b);var h=new Proxy(f,d);return n.get(h.after).install(t,h,function(e,r){var n,i=[];e.length||r.length?(e.forEach(a),n=i.push(void 0)-1,r.forEach(a),y=function(e,r,a){var f,c=i.slice(),u=0,l="async"===t&&"function"==typeof a[a.length-1]&&a.pop();function p(e){"sync"===t?f=e:l&&l.apply(null,arguments)}function s(e){if(c[u]){var n=o(arguments);return s.bail=p,n.unshift(s),c[u++].apply(r,n)}"sync"===t?f=e:l&&l.apply(null,arguments)}return c[n]=function(){var n=o(arguments,1);"async"===t&&l&&(delete s.bail,n.push(s));var i=e.apply(r,n);"sync"===t&&s(i)},s.apply(null,a),f}):y=void 0;function a(e){i.push(e.hook)}b()}),h;function b(){!a&&("sync"!==t||e.ready&i.SYNC)&&("async"!==t||e.ready&i.ASYNC)?"sync"!==t&&e.ready&i.QUEUE?d.apply=function(){var e=arguments;c.push(function(){h.apply(e[1],e[2])})}:d.apply=function(){throw r+": hooked function not ready"}:d.apply=y}}return(e=Object.assign({},t,e)).ready?u.ready=function(){a=!0,function(e){for(var r;r=e.shift();)r()}(c)}:a=!0,u.get=p,u}e.exports=i},8928(e,r,t){function n(e,r,t,n,o){for(r=r.split?r.split("."):r,n=0;n<r.length;n++)e=e?e[r[n]]:o;return e===o?t:e}t.d(r,{A:()=>n})}},t={};function n(e){var o=t[e];if(void 0!==o)return o.exports;var i=t[e]={exports:{}};return r[e](i,i.exports,n),i.exports}n.m=r,e=[],n.O=(r,t,o,i)=>{if(!t){var a=1/0;for(l=0;l<e.length;l++){for(var[t,o,i]=e[l],f=!0,c=0;c<t.length;c++)(!1&i||a>=i)&&Object.keys(n.O).every(e=>n.O[e](t[c]))?t.splice(c--,1):(f=!1,i<a&&(a=i));if(f){e.splice(l--,1);var u=o();void 0!==u&&(r=u)}}return r}i=i||0;for(var l=e.length;l>0&&e[l-1][2]>i;l--)e[l]=e[l-1];e[l]=[t,o,i]},n.n=e=>{var r=e&&e.__esModule?()=>e.default:()=>e;return n.d(r,{a:r}),r},n.d=(e,r)=>{for(var t in r)n.o(r,t)&&!n.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:r[t]})},n.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e={9673:0};n.O.j=r=>0===e[r];var r=(r,t)=>{var o,i,[a,f,c]=t,u=0;if(a.some(r=>0!==e[r])){for(o in f)n.o(f,o)&&(n.m[o]=f[o]);if(c)var l=c(n)}for(r&&r(t);u<a.length;u++)i=a[u],n.o(e,i)&&e[i]&&e[i][0](),e[i]=0;return n.O(l)},t=self.sevioPbjsChunk=self.sevioPbjsChunk||[];t.forEach(r.bind(null,0)),t.push=r.bind(null,t.push.bind(t))})();var o=n.O(void 0,[802,7769,315,1085],()=>n(7776));o=n.O(o)})();
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[802],{69(e,t,n){n.d(t,{mZ:()=>s});var r=n(466),i=n(8928),o=n(3435);const s=(0,n(2592).A_)("sync",function(e){return[a,d("source.schain","source.ext.schain","source.ext.schain"),d("device.sua","device.ext.sua","device.sua"),d("regs.gdpr","regs.ext.gdpr","regs.ext.gdpr"),d("user.consent","user.ext.consent","user.ext.consent"),d("regs.us_privacy","regs.ext.us_privacy","regs.ext.us_privacy"),d("regs.gpp","regs.ext.gpp","regs.gpp"),d("regs.gpp_sid","regs.ext.gpp_sid","regs.gpp_sid")].forEach(t=>function(e,t){t.global=e(t.global,"global FPD"),Object.entries(t.bidder).forEach(n=>{let[r,i]=n;t.bidder[r]=e(i,`bidder '${r}' FPD`)})}(t,e)),e});function a(e,t){if(!e)return e;const n=[],i=[...(e?.user?.eids??[]).map(e=>[0,e]),...(e?.user?.ext?.eids??[]).map(e=>[1,e])].filter(e=>{let[i,o]=e;return n.findIndex(e=>{let[t,n]=e;return i!==t&&(0,r.deepEqual)(n,o)})>-1?((0,r.logWarn)(`Found duplicate EID in user.eids and user.ext.eids (${t})`,o),!1):(n.push([i,o]),!0)});return i.length>0&&(0,o.J)(e,"user.ext.eids",i.map(e=>{let[t,n]=e;return n})),delete e?.user?.eids,e}function d(e,t,n){if(n!==e&&n!==t)throw new Error("invalid argument");const s=(n===e?t:e).split("."),a=s.pop(),d=s.join(".");return function(s,c){if(!s)return s;const l=(0,i.A)(s,e),u=(0,i.A)(s,t);null==l||null==u||(0,r.deepEqual)(l,u)||(0,r.logWarn)(`Conflicting ${e} and ${t} (${c}), preferring ${e}`,{[e]:l,[t]:u}),null!=(l??u)&&(0,o.J)(s,n,l??u);const g=(0,i.A)(s,d);return null!=g&&"object"==typeof g&&delete g[a],s}}},356(e,t,n){n.d(t,{Bm:()=>v,Gg:()=>I,IX:()=>S,Xj:()=>k,gs:()=>A,l6:()=>m,mT:()=>u,nk:()=>b,vO:()=>E,yl:()=>O});var r=n(466),i=n(6665),o=n(3006),s=n(1418),a=n(9794),d=n(1852),c=n(5144),l=n(2122);const u=[],g={image:{ortb:{ver:"1.2",assets:[{required:1,id:1,img:{type:3,wmin:100,hmin:100}},{required:1,id:2,title:{len:140}},{required:1,id:3,data:{type:1}},{required:0,id:4,data:{type:2}},{required:0,id:5,img:{type:1,wmin:20,hmin:20}}]},image:{required:!0},title:{required:!0},sponsoredBy:{required:!0},clickUrl:{required:!0},body:{required:!1},icon:{required:!1}}},f=$(s.h0),p=$(s.jO);function m(e){return null!=e.native&&"object"==typeof e.native}function h(e){if(e&&e.type&&function(e){if(!e||!Object.keys(g).includes(e))return(0,r.logError)(`${e} nativeParam is not supported`),!1;return!0}(e.type)&&(e=g[e.type]),!e||!e.ortb||y(e.ortb))return e}function b(e){e.forEach(e=>{const t=e.nativeParams||e?.mediaTypes?.native;t&&(e.nativeParams=h(t)),e.nativeParams&&(e.nativeOrtbRequest=e.nativeParams.ortb||function(e){if(!e&&!(0,i.Qd)(e))return void(0,r.logError)("Native assets object is empty or not an object: ",e);const t={ver:"1.2",assets:[]};for(const n in e){if(s._B.includes(n))continue;if(!s.x5.hasOwnProperty(n)){(0,r.logError)(`Unrecognized native asset code: ${n}. Asset will be ignored.`);continue}if("privacyLink"===n){t.privacy=1;continue}const o=e[n];let a=0;o.required&&(0,i.Lm)(o.required)&&(a=Number(o.required));const d={id:t.assets.length,required:a};if(n in s.h0)d.data={type:s.jO[s.h0[n]]},o.len&&(d.data.len=o.len);else if("icon"===n||"image"===n){if(d.img={type:"icon"===n?s.oA.ICON:s.oA.MAIN},o.aspect_ratios)if((0,i.cy)(o.aspect_ratios))if(o.aspect_ratios.length){const{min_width:e,min_height:t}=o.aspect_ratios[0];(0,i.Fq)(e)&&(0,i.Fq)(t)?(d.img.wmin=e,d.img.hmin=t):(0,r.logError)("image.aspect_ratios min_width or min_height are invalid: ",e,t);const n=o.aspect_ratios.filter(e=>e.ratio_width&&e.ratio_height).map(e=>`${e.ratio_width}:${e.ratio_height}`);n.length>0&&(d.img.ext={aspectratios:n})}else(0,r.logError)("image.aspect_ratios was passed, but it's empty:",o.aspect_ratios);else(0,r.logError)("image.aspect_ratios was passed, but it's not a an array:",o.aspect_ratios);o.sizes&&(2===o.sizes.length&&(0,i.Fq)(o.sizes[0])&&(0,i.Fq)(o.sizes[1])?(d.img.w=o.sizes[0],d.img.h=o.sizes[1],delete d.img.hmin,delete d.img.wmin):(0,r.logError)("image.sizes was passed, but its value is not an array of integers:",o.sizes))}else"title"===n?d.title={len:o.len||140}:"ext"===n&&(d.ext=o,delete d.required);t.assets.push(d)}return t}(e.nativeParams))})}function y(e){const t=e.assets;if(!Array.isArray(t)||0===t.length)return(0,r.logError)("assets in mediaTypes.native.ortb is not an array, or it's empty. Assets: ",t),!1;const n=t.map(e=>e.id);return t.length!==new Set(n).size||n.some(e=>e!==parseInt(e,10))?((0,r.logError)("each asset object must have 'id' property, it must be unique and it must be an integer"),!1):e.hasOwnProperty("eventtrackers")&&!Array.isArray(e.eventtrackers)?((0,r.logError)("ortb.eventtrackers is not an array. Eventtrackers: ",e.eventtrackers),!1):t.every(e=>function(e){if(!(0,i.Qd)(e))return(0,r.logError)("asset must be an object. Provided asset: ",e),!1;if(e.img){if(!(0,i.Et)(e.img.w)&&!(0,i.Et)(e.img.wmin))return(0,r.logError)("for img asset there must be 'w' or 'wmin' property"),!1;if(!(0,i.Et)(e.img.h)&&!(0,i.Et)(e.img.hmin))return(0,r.logError)("for img asset there must be 'h' or 'hmin' property"),!1}else if(e.title){if(!(0,i.Et)(e.title.len))return(0,r.logError)("for title asset there must be 'len' property defined"),!1}else if(e.data){if(!(0,i.Et)(e.data.type))return(0,r.logError)("for data asset 'type' property must be a number"),!1}else if(e.video&&!(Array.isArray(e.video.mimes)&&Array.isArray(e.video.protocols)&&(0,i.Et)(e.video.minduration)&&(0,i.Et)(e.video.maxduration)))return(0,r.logError)("video asset is not properly configured"),!1;return!0}(e))}function v(e){let{index:t=o.n.index}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};const n=t.getAdUnit(e);if(!n)return!1;const i=n.nativeOrtbRequest;return function(e,t){if(!e?.link?.url)return(0,r.logError)("native response doesn't have 'link' property. Ortb response: ",e),!1;const n=t.assets.filter(e=>1===e.required).map(e=>e.id),i=e.assets.map(e=>e.id),o=n.every(e=>i.includes(e));o||(0,r.logError)(`didn't receive a bid with all required assets. Required ids: ${n}, but received ids in response: ${i}`);return o}(e.native?.ortb||_(e.native,i),i)}function E(e,t){const n=t.native.ortb||D(t.native);return"click"===e.action?function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,{fetchURL:n=r.triggerPixel}=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};if(t){const r=(e.assets||[]).filter(e=>e.link).reduce((e,t)=>(e[t.id]=t.link,e),{}),i=e.link?.clicktrackers||[],o=r[t];let s=i;o&&(s=o.clicktrackers||[]),s.forEach(e=>n(e))}else(e.link?.clicktrackers||[]).forEach(e=>n(e))}(n,e?.assetId):function(e){let{runMarkup:t=e=>(0,r.insertHtmlIntoIframe)(e),fetchURL:n=r.triggerPixel}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},{[l.Ni]:i=[],[l.fR]:o=[]}=(0,l.$T)(e.eventtrackers||[])[l.OA]||{};e.imptrackers&&(i=i.concat(e.imptrackers));i.forEach(e=>n(e)),o=o.map(e=>`<script async src="${e}"><\/script>`),e.jstracker&&(o=o.concat([e.jstracker]));o.length&&t(o.join("\n"))}(n),e.action}function A(e,t){const n=t?.nativeOrtbRequest,r=e.native?.ortb;if(n&&r){const t=function(e,t){const n={},r=t?.assets||[];n.clickUrl=e.link?.url,n.privacyLink=e.privacy;for(const t of e?.assets||[]){const e=r.find(e=>t.id===e.id);t.title?n.title=t.title.text:t.img?n[e?.img?.type===s.oA.MAIN?"image":"icon"]={url:t.img.url,width:t.img.w,height:t.img.h}:t.data&&(n[f[p[e?.data?.type]]]=t.data.value)}n.impressionTrackers=[];let i=[];e.imptrackers&&n.impressionTrackers.push(...e.imptrackers);for(const t of e?.eventtrackers||[])t.event===l.OA&&t.method===l.Ni&&n.impressionTrackers.push(t.url),t.event===l.OA&&t.method===l.fR&&i.push(t.url);i=i.map(e=>`<script async src="${e}"><\/script>`),e?.jstracker&&i.push(e.jstracker);i.length&&(n.javascriptTrackers=i.join("\n"));return n}(r,n);Object.assign(e.native,t)}["rendererUrl","adTemplate"].forEach(n=>{const r=t?.nativeParams?.[n];r&&(e.native[n]=B(r))})}function w(e,t){let n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];const r=[];return Object.entries(e).filter(e=>{let[r,i]=e;return i&&(!1===n&&"ext"===r||null==t||t.includes(r))}).forEach(e=>{let[i,o]=e;!1===n&&"ext"===i?r.push(...w(o,t,!0)):(n||s.x5.hasOwnProperty(i))&&r.push({key:i,value:B(o)})}),r}function I(e,t,n){const r={...(0,i.SH)(e.native,["rendererUrl","adTemplate"]),assets:w(e.native,n),nativeKeys:s.x5};return e.native.ortb?r.ortb=e.native.ortb:t.mediaTypes?.native?.ortb&&(r.ortb=_(e.native,t.nativeOrtbRequest)),r}function T(e,t,n){let{index:r=o.n.index}=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{};const i={message:"assetResponse",adId:e.adId};let s=(0,d.vd)(t).native;return s?(i.native=Object.assign({},s),i.renderer=(0,c.kj)(t),i.rendererVersion=c.xh,null!=n&&(s.assets=s.assets.filter(e=>{let{key:t}=e;return n.includes(t)}))):s=I(t,r.getAdUnit(t),n),Object.assign(i,s)}const C=Object.fromEntries(Object.entries(s.x5).map(e=>{let[t,n]=e;return[n,t]}));function S(e,t){const n=e.assets.map(e=>C[e]);return T(e,t,n)}function O(e,t){return T(e,t,null)}function B(e){return e?.url||e}function R(e,t){for(;e&&t&&e!==t;)e>t?e-=t:t-=e;return e||t}function U(e){if(!y(e))return;const t={};for(const n of e.assets){if(n.title){const e={required:!!n.required&&Boolean(n.required),len:n.title.len};t.title=e}else if(n.img){const e={required:!!n.required&&Boolean(n.required)};if(n.img.w&&n.img.h)e.sizes=[n.img.w,n.img.h];else if(n.img.wmin&&n.img.hmin){const t=R(n.img.wmin,n.img.hmin);e.aspect_ratios=[{min_width:n.img.wmin,min_height:n.img.hmin,ratio_width:n.img.wmin/t,ratio_height:n.img.hmin/t}]}n.img.type===s.oA.MAIN?t.image=e:t.icon=e}else if(n.data){const e=Object.keys(s.jO).find(e=>s.jO[e]===n.data.type),r=Object.keys(s.h0).find(t=>s.h0[t]===e);t[r]={required:!!n.required&&Boolean(n.required)},n.data.len&&(t[r].len=n.data.len)}e.privacy&&(t.privacyLink={required:!1})}return t}function k(e){{if(!e||!(0,i.cy)(e))return e;if(!e.some(e=>(e?.mediaTypes||{})[a.s6]?.ortb))return e;const t=(0,i.Go)(e);for(const e of t)e.mediaTypes&&e.mediaTypes[a.s6]&&e.mediaTypes[a.s6].ortb&&(e.mediaTypes[a.s6]=Object.assign((0,r.pick)(e.mediaTypes[a.s6],s._B),U(e.mediaTypes[a.s6].ortb)),e.nativeParams=h(e.mediaTypes[a.s6]));return t}}function D(e){const t={link:{},eventtrackers:[]};return Object.entries(e).forEach(e=>{let[n,r]=e;switch(n){case"clickUrl":t.link.url=r;break;case"clickTrackers":t.link.clicktrackers=Array.isArray(r)?r:[r];break;case"impressionTrackers":(Array.isArray(r)?r:[r]).forEach(e=>{t.eventtrackers.push({event:l.OA,method:l.Ni,url:e})});break;case"javascriptTrackers":t.jstracker=Array.isArray(r)?r.join(""):r;break;case"privacyLink":t.privacy=r}}),t}function _(e,t){const n={...D(e),assets:[]};function r(e,r){let o=t.assets.find(e);null!=o&&(o=(0,i.Go)(o),r(o),n.assets.push(o))}return Object.keys(e).filter(t=>!!e[t]).forEach(t=>{const n=B(e[t]);switch(t){case"title":r(e=>null!=e.title,e=>{e.title={text:n}});break;case"image":case"icon":const e="image"===t?s.oA.MAIN:s.oA.ICON;r(t=>null!=t.img&&t.img.type===e,e=>{e.img={url:n}});break;default:t in s.h0&&r(e=>null!=e.data&&e.data.type===s.jO[s.h0[t]],e=>{e.data={value:n}})}}),n}function $(e){var t={};for(var n in e)t[e[n]]=n;return t}},466(e,t,n){n.r(t),n.d(t,{_each:()=>ee,_map:()=>ne,_setEventEmitter:()=>h,binarySearch:()=>tt,buildUrl:()=>Le,canAccessWindowTop:()=>N,checkCookieSupport:()=>ke,cleanObj:()=>Ne,compareCodeAndSlot:()=>qe,compressDataWithGZip:()=>at,contains:()=>te,convertObjectToArray:()=>Ze,createIframe:()=>J,createInvisibleIframe:()=>Y,createTrackPixelHtml:()=>de,createTrackPixelIframeHtml:()=>le,cyrb53Hash:()=>Qe,debugTurnedOn:()=>Q,deepAccess:()=>s.A,deepClone:()=>a.Go,deepEqual:()=>ze,deepSetValue:()=>d.J,delayExecution:()=>De,encodeMacroURI:()=>ce,extractDomainFromHost:()=>it,flatten:()=>ge,formatQS:()=>Fe,generateUUID:()=>T,getBidIdParameter:()=>C,getBidRequest:()=>fe,getBidderCodes:()=>me,getDefinedParams:()=>a.SH,getDocument:()=>j,getDomLoadingDuration:()=>Re,getFallbackWindow:()=>P,getParameterByName:()=>K,getPerformanceNow:()=>Be,getPrebidInternal:()=>E,getSafeframeGeometry:()=>we,getScreenOrientation:()=>c.Vv,getUniqueIdentifierStr:()=>I,getUnixTimestampFromNow:()=>Xe,getUserConfiguredParams:()=>xe,getValue:()=>pe,getWinDimensions:()=>c.Ot,getWindowLocation:()=>W,getWindowSelf:()=>q,getWindowTop:()=>x,groupBy:()=>_e,hasConsoleLogger:()=>V,hasDeviceAccess:()=>Ue,hasNonSerializableProperty:()=>nt,inIframe:()=>Ee,insertElement:()=>re,insertHtmlIntoIframe:()=>se,insertUserSyncIframe:()=>ae,internal:()=>y,isA:()=>a.KG,isAdUnitCodeMatchingSlot:()=>We,isApnGetTagDefined:()=>be,isArray:()=>a.cy,isArrayOfNums:()=>a.Uu,isBoolean:()=>a.Lm,isEmpty:()=>X,isEmptyStr:()=>Z,isFn:()=>a.fp,isGptPubadsDefined:()=>he,isGzipCompressionSupported:()=>st,isInteger:()=>a.Fq,isNumber:()=>a.Et,isPlainObject:()=>a.Qd,isSafariBrowser:()=>Ie,isSafeFrameWindow:()=>Ae,isStr:()=>a.O8,isValidMediaTypes:()=>$e,logError:()=>L,logInfo:()=>F,logMessage:()=>M,logWarn:()=>G,memoize:()=>Ke,mergeDeep:()=>He,parseGPTSingleSizeArray:()=>k,parseGPTSingleSizeArrayToRtbSize:()=>_,parseQS:()=>Me,parseQueryStringParameters:()=>S,parseSizesInput:()=>R,parseUrl:()=>Ge,pick:()=>Pe,prefixLog:()=>z,replaceAuctionPrice:()=>Ce,replaceClickThrough:()=>Se,replaceMacros:()=>Te,resetWinDimensions:()=>c.Bp,safeJSONEncode:()=>Ye,safeJSONParse:()=>Je,setOnAny:()=>rt,setScriptAttributes:()=>et,shuffle:()=>ve,sizeTupleToRtbSize:()=>D,sizeTupleToSizeString:()=>U,sizesToSizeTuples:()=>B,sortByHighestCpm:()=>ye,timestamp:()=>Oe,transformAdServerTargetingObj:()=>O,triggerNurlWithCpm:()=>ot,triggerPixel:()=>oe,uniques:()=>ue,unsupportedBidderMessage:()=>je,waitForElementToLoad:()=>ie});var r=n(1933),i=n(1418),o=n(3064),s=n(8928),a=n(6665),d=n(3435),c=n(3958);const l=Boolean(window.console),u=Boolean(l&&window.console.log),g=Boolean(l&&window.console.info),f=Boolean(l&&window.console.warn),p=Boolean(l&&window.console.error);let m;function h(e){m=e}function b(){null!=m&&m(...arguments)}const y={checkCookieSupport:ke,createTrackPixelIframeHtml:le,getWindowSelf:q,getWindowTop:x,canAccessWindowTop:N,getWindowLocation:W,insertUserSyncIframe:ae,insertElement:re,isFn:a.fp,triggerPixel:oe,logError:L,logWarn:G,logMessage:M,logInfo:F,parseQS:Me,formatQS:Fe,deepEqual:ze},v={};function E(){return v}var A,w=(A=0,function(){return++A});function I(){return w()+Math.random().toString(16).substr(2)}function T(e){return e?(e^(window&&window.crypto&&window.crypto.getRandomValues?crypto.getRandomValues(new Uint8Array(1))[0]%16:16*Math.random())>>e/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,T)}function C(e,t){return t?.[e]||""}function S(e){let t="";for(var n in e)e.hasOwnProperty(n)&&(t+=n+"="+encodeURIComponent(e[n])+"&");return t=t.replace(/&$/,""),t}function O(e){return e&&Object.getOwnPropertyNames(e).length>0?Object.keys(e).map(t=>`${t}=${encodeURIComponent(e[t])}`).join("&"):""}function B(e){return"string"==typeof e?e.split(/\s*,\s*/).map(e=>e.match(/^(\d+)x(\d+)$/i)).filter(e=>e).map(e=>{let[t,n,r]=e;return[parseInt(n,10),parseInt(r,10)]}):Array.isArray(e)?$(e)?[e]:e.filter($):[]}function R(e){return B(e).map(U)}function U(e){return e[0]+"x"+e[1]}function k(e){if($(e))return U(e)}function D(e){return{w:e[0],h:e[1]}}function _(e){if($(e))return D(e)}function $(e){return(0,a.cy)(e)&&2===e.length&&!isNaN(e[0])&&!isNaN(e[1])}function x(){return window.top}function q(){return window.self}function W(){return window.location}function j(){return document}function N(){try{if(y.getWindowTop().location.href)return!0}catch(e){return!1}}function P(e){return e||(N()?y.getWindowTop():y.getWindowSelf())}function M(){Q()&&u&&console.log.apply(console,H(arguments,"MESSAGE:"))}function F(){Q()&&g&&console.info.apply(console,H(arguments,"INFO:"))}function G(){Q()&&f&&console.warn.apply(console,H(arguments,"WARNING:")),b(i.qY.AUCTION_DEBUG,{type:"WARNING",arguments})}function L(){Q()&&p&&console.error.apply(console,H(arguments,"ERROR:")),b(i.qY.AUCTION_DEBUG,{type:"ERROR",arguments})}function z(e){function t(t){return function(){for(var n=arguments.length,r=new Array(n),i=0;i<n;i++)r[i]=arguments[i];t(e,...r)}}return{logError:t(L),logWarn:t(G),logMessage:t(M),logInfo:t(F)}}function H(e,t){e=[].slice.call(e);const n=r.$W.getCurrentBidder();return t&&e.unshift(t),n&&e.unshift(i("#aaa")),e.unshift(i("#3b88c3")),e.unshift("%cPrebid"+(n?`%c${n}`:"")),e;function i(e){return`display: inline-block; color: #fff; background: ${e}; padding: 1px 4px; border-radius: 3px;`}}function V(){return u}function Q(){return!!r.$W.getConfig("debug")}const J=(()=>{const e={border:"0px",hspace:"0",vspace:"0",marginWidth:"0",marginHeight:"0",scrolling:"no",frameBorder:"0",allowtransparency:"true"};return function(t,n){let r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};const i=t.createElement("iframe");return Object.assign(i,Object.assign({},e,n)),Object.assign(i.style,r),i}})();function Y(){return J(document,{id:I(),width:0,height:0,src:"about:blank"},{display:"none",height:"0px",width:"0px",border:"0px"})}function K(e){return Me(W().search)[e]||""}function X(e){return!e||((0,a.cy)(e)||(0,a.O8)(e)?!(e.length>0):Object.keys(e).length<=0)}function Z(e){return(0,a.O8)(e)&&(!e||0===e.length)}function ee(e,t){if((0,a.fp)(e?.forEach))return e.forEach(t,this);Object.entries(e||{}).forEach(e=>{let[n,r]=e;return t.call(this,r,n)})}function te(e,t){return(0,a.fp)(e?.includes)&&e.includes(t)}function ne(e,t){return(0,a.fp)(e?.map)?e.map(t):Object.entries(e||{}).map(n=>{let[r,i]=n;return t(i,r,e)})}function re(e,t,n,r){let i;t=t||document,i=n?t.getElementsByTagName(n):t.getElementsByTagName("head");try{if(i=i.length?i:t.getElementsByTagName("body"),i.length){i=i[0];const t=r?null:i.firstChild;return i.insertBefore(e,t)}}catch(e){}}function ie(e,t){let n=null;return new o.U9(r=>{const i=function(){e.removeEventListener("load",i),e.removeEventListener("error",i),null!=n&&window.clearTimeout(n),r()};e.addEventListener("load",i),e.addEventListener("error",i),null!=t&&(n=window.setTimeout(i,t))})}function oe(e,t,n){const r=new Image;t&&y.isFn(t)&&ie(r,n).then(t),r.src=e}function se(e){if(!e)return;const t=Y();var n;y.insertElement(t,document,"body"),(n=t.contentWindow.document).open(),n.write(e),n.close()}function ae(e,t,n){const r=y.createTrackPixelIframeHtml(e,!1,"allow-scripts allow-same-origin"),i=document.createElement("div");i.innerHTML=r;const o=i.firstChild;t&&y.isFn(t)&&ie(o,n).then(t),y.insertElement(o,document,"html",!0)}function de(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:encodeURI;if(!e)return"";let n='<div style="position:absolute;left:0px;top:0px;visibility:hidden;">';return n+='<img src="'+t(e)+'"></div>',n}function ce(e){return Array.from(e.matchAll(/\$({[^}]+})/g)).map(e=>e[1]).reduce((e,t)=>e.replace("$"+encodeURIComponent(t),"$"+t),encodeURI(e))}function le(e){let t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"";return e?((!(arguments.length>1&&void 0!==arguments[1])||arguments[1])&&(e=encodeURI(e)),t&&(t=`sandbox="${t}"`),`<iframe ${t} id="${I()}"\n      frameborder="0"\n      allowtransparency="true"\n      marginheight="0" marginwidth="0"\n      width="0" hspace="0" vspace="0" height="0"\n      style="height:0px;width:0px;display:none;"\n      scrolling="no"\n      src="${e}">\n    </iframe>`):""}function ue(e,t,n){return n.indexOf(e)===t}function ge(e,t){return e.concat(t)}function fe(e,t){if(e)return t.flatMap(e=>e.bids).find(t=>["bidId","adId","bid_id"].some(n=>t[n]===e))}function pe(e,t){return e[t]}function me(e){return e.map(e=>e.bids.map(e=>e.bidder).reduce(ge,[])).reduce(ge,[]).filter(e=>void 0!==e).filter(ue)}function he(){if(window.googletag&&(0,a.fp)(window.googletag.pubads)&&(0,a.fp)(window.googletag.pubads().getSlots))return!0}function be(){if(window.apntag&&(0,a.fp)(window.apntag.getTag))return!0}const ye=(e,t)=>t.cpm-e.cpm;function ve(e){let t=e.length;for(;t>0;){const n=Math.floor(Math.random()*t);t--;const r=e[t];e[t]=e[n],e[n]=r}return e}function Ee(){try{return y.getWindowSelf()!==y.getWindowTop()}catch(e){return!0}}function Ae(){if(!Ee())return!1;const e=y.getWindowSelf();return!(!e.$sf||!e.$sf.ext)}function we(){try{const e=q();return"function"==typeof e.$sf.ext.geom?e.$sf.ext.geom():void 0}catch(e){return void L("Error getting SafeFrame geometry",e)}}function Ie(){return/^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent)}function Te(e,t){if(e)return Object.entries(t).reduce((e,t)=>{let[n,r]=t;return e.replace(new RegExp("\\$\\{"+n+"\\}","g"),r||"")},e)}function Ce(e,t){return Te(e,{AUCTION_PRICE:t})}function Se(e,t){if(e&&t&&"string"==typeof t)return e.replace(/\${CLICKTHROUGH}/g,t)}function Oe(){return(new Date).getTime()}function Be(){return window.performance&&window.performance.now&&window.performance.now()||0}function Re(e){let t=-1;const n=(e=e||q()).performance;if(e.performance?.timing&&e.performance.timing.navigationStart>0){const e=n.timing.domLoading-n.timing.navigationStart;e>0&&(t=e)}return t}function Ue(){return!1!==r.$W.getConfig("deviceAccess")}function ke(){if(window.navigator.cookieEnabled||document.cookie.length)return!0}function De(e,t){if(t<1)throw new Error(`numRequiredCalls must be a positive number. Got ${t}`);let n=0;return function(){n++,n===t&&e.apply(this,arguments)}}function _e(e,t){return e.reduce(function(e,n){return(e[n[t]]=e[n[t]]||[]).push(n),e},{})}function $e(e){const t=["banner","native","video","audio"],n=["instream","outstream","adpod"];return!!Object.keys(e).every(e=>t.includes(e))&&(!e.video||!e.video.context||n.includes(e.video.context))}function xe(e,t,n){return e.filter(e=>e.code===t).flatMap(e=>e.bids).filter(e=>e.bidder===n).map(e=>e.params||{})}const qe=(e,t)=>e.getAdUnitPath()===t||e.getSlotElementId()===t;function We(e){return t=>qe(e,t)}function je(e,t){const n=Object.keys(e.mediaTypes||{banner:"banner"}).join(", ");return`\n    ${e.code} is a ${n} ad unit\n    containing bidders that don't support ${n}: ${t}.\n    This bidder won't fetch demand.\n  `}function Ne(e){return Object.fromEntries(Object.entries(e).filter(e=>{let[t,n]=e;return void 0!==n}))}function Pe(e,t){return"object"!=typeof e?{}:t.reduce((n,r,i)=>{if("function"==typeof r)return n;let o=r;const s=r.match(/^(.+?)\sas\s(.+?)$/i);s&&(r=s[1],o=s[2]);let a=e[r];return"function"==typeof t[i+1]&&(a=t[i+1](a,n)),void 0!==a&&(n[o]=a),n},{})}function Me(e){return e?e.replace(/^\?/,"").split("&").reduce((e,t)=>{let[n,r]=t.split("=");return/\[\]$/.test(n)?(n=n.replace("[]",""),e[n]=e[n]||[],e[n].push(r)):e[n]=r||"",e},{}):{}}function Fe(e){return Object.keys(e).map(t=>Array.isArray(e[t])?e[t].map(e=>`${t}[]=${e}`).join("&"):`${t}=${e[t]}`).join("&")}function Ge(e,t){const n=document.createElement("a");t&&"noDecodeWholeURL"in t&&t.noDecodeWholeURL?n.href=e:n.href=decodeURIComponent(e);const r=t&&"decodeSearchAsString"in t&&t.decodeSearchAsString;return{href:n.href,protocol:(n.protocol||"").replace(/:$/,""),hostname:n.hostname,port:+n.port,pathname:n.pathname.replace(/^(?!\/)/,"/"),search:r?n.search:y.parseQS(n.search||""),hash:(n.hash||"").replace(/^#/,""),host:n.host||window.location.host}}function Le(e){return(e.protocol||"http")+"://"+(e.host||e.hostname+(e.port?`:${e.port}`:""))+(e.pathname||"")+(e.search?`?${y.formatQS(e.search||"")}`:"")+(e.hash?`#${e.hash}`:"")}function ze(e,t){let{checkTypes:n=!1}=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};if(e===t)return!0;if("object"!=typeof e||null===e||"object"!=typeof t||null===t)return!1;const r=Array.isArray(e),i=Array.isArray(t);if(r&&i){if(e.length!==t.length)return!1;for(let r=0;r<e.length;r++)if(!ze(e[r],t[r],{checkTypes:n}))return!1;return!0}if(r||i)return!1;if(n&&e.constructor!==t.constructor)return!1;const o=Object.keys(e),s=Object.keys(t);if(o.length!==s.length)return!1;for(const r of o){if(!Object.prototype.hasOwnProperty.call(t,r))return!1;if(!ze(e[r],t[r],{checkTypes:n}))return!1}return!0}function He(e){for(let t=0;t<(arguments.length<=1?0:arguments.length-1);t++){const n=t+1<1||arguments.length<=t+1?void 0:arguments[t+1];(0,a.Qd)(n)&&Ve(e,n)}return e}function Ve(e,t){if(!(0,a.Qd)(e)||!(0,a.Qd)(t))return;const n=Object.keys(t);for(let r=0;r<n.length;r++){const i=n[r];if("__proto__"===i||"constructor"===i)continue;const o=t[i];(0,a.Qd)(o)?(e[i]||(e[i]={}),Ve(e[i],o)):Array.isArray(o)?Array.isArray(e[i])?o.forEach(t=>{e[i].some(e=>ze(e,t))||e[i].push(t)}):e[i]=[...o]:e[i]=o}}function Qe(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;const n=function(e,t){if((0,a.fp)(Math.imul))return Math.imul(e,t);var n=(4194303&e)*(t|=0);return 4290772992&e&&(n+=(4290772992&e)*t|0),0|n};let r=3735928559^t,i=1103547991^t;for(let t,o=0;o<e.length;o++)t=e.charCodeAt(o),r=n(r^t,2654435761),i=n(i^t,1597334677);return r=n(r^r>>>16,2246822507)^n(i^i>>>13,3266489909),i=n(i^i>>>16,2246822507)^n(r^r>>>13,3266489909),(4294967296*(2097151&i)+(r>>>0)).toString()}function Je(e){try{return JSON.parse(e)}catch(e){}}function Ye(e){try{return JSON.stringify(e)}catch(e){return""}}function Ke(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:function(e){return e};const n=new Map,r=function(){const r=t.apply(this,arguments);return n.has(r)||n.set(r,e.apply(this,arguments)),n.get(r)};return r.clear=n.clear.bind(n),r}function Xe(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"d";if(["m","d"].indexOf(t)<0)return Date.now();const n=e/("m"===t?1440:1);return Date.now()+(e&&e>0?864e5*n:0)}function Ze(e){return Object.keys(e).map(t=>({[t]:e[t]}))}function et(e,t){Object.entries(t).forEach(t=>{let[n,r]=t;return e.setAttribute(n,r)})}function tt(e,t){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:e=>e,r=0,i=e.length&&e.length-1;const o=n(t);for(;i-r>1;){const t=r+Math.round((i-r)/2);o>n(e[t])?r=t:i=t}for(;e.length>r&&o>n(e[r]);)r++;return r}function nt(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new Set;for(const n in e){const r=e[n],i=typeof r;if(void 0===r||"function"===i||"symbol"===i||r instanceof RegExp||r instanceof Map||r instanceof Set||r instanceof Date||null!==r&&"object"===i&&r.hasOwnProperty("toJSON"))return!0;if(null!==r&&"object"===i&&r.constructor===Object){if(t.has(r))return!0;if(t.add(r),nt(r,t))return!0}}return!1}function rt(e,t){for(let n,r=0;r<e.length;r++)if(n=(0,s.A)(e[r],t),n)return n}function it(e){let t=null;try{const n=/[-\w]+\.([-\w]+|[-\w]{3,}|[-\w]{1,3}\.[-\w]{2})$/i.exec(e);if(null!=n&&n.length>0){t=n[0];for(let e=1;e<n.length;e++)n[e].length>t.length&&(t=n[e])}}catch(e){t=null}return t}function ot(e,t){(0,a.O8)(e.nurl)&&""!==e.nurl&&(e.nurl=e.nurl.replace(/\${AUCTION_PRICE}/,t),oe(e.nurl))}const st=function(){let e;return function(){if(void 0!==e)return e;try{void 0===window.CompressionStream?e=!1:(new window.CompressionStream("gzip"),e=!0)}catch(t){e=!1}return e}}();async function at(e){"string"!=typeof e&&(e=JSON.stringify(e));const t=(new TextEncoder).encode(e),n=new Blob([t]).stream().pipeThrough(new window.CompressionStream("gzip")),r=await new Response(n).blob(),i=await r.arrayBuffer();return new Uint8Array(i)}},736(e,t,n){n.d(t,{Tn:()=>s,fW:()=>o,tW:()=>i,tp:()=>r});const r="prebid",i="bidder",o="userId",s="analytics"},765(e,t,n){n.d(t,{k:()=>i,rT:()=>s,uP:()=>o});var r=n(3715);function i(){return r.A.pbGlobal}function o(){return r.A.defineGlobal}function s(){return r.A.distUrlBase}},867(e,t,n){n.d(t,{EN:()=>d,gR:()=>s});var r=n(1933),i=n(466);function o(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:window;if(!e)return e;if(/\w+:\/\//.exec(e))return e;let n=t.location.protocol;try{n=t.top.location.protocol}catch(e){}return/^\/\//.exec(e)?n+e:`${n}//${e}`}function s(e){let t,{noLeadingWww:n=!1,noPort:r=!1}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};try{t=new URL(o(e))}catch(e){return}return t=r?t.hostname:t.host,n&&t.startsWith("www.")&&(t=t.substring(4)),t}function a(e){try{const t=e.querySelector("link[rel='canonical']");if(null!==t)return t.href}catch(e){}return null}const d=function(e){let t,n,r,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:window;return i.top!==i?e:function(){const o=a(i.document),s=i.location.href;return t===o&&s===n||(t=o,n=s,r=e()),r}}((c=window,function(){const e=[],t=function(e){try{if(!e.location.ancestorOrigins)return;return e.location.ancestorOrigins}catch(e){}}(c),n=r.$W.getConfig("maxNestedIframes");let d,l,u,g,f=!1,p=0,m=!1,h=!1,b=!1;do{const n=d,r=h;let o,s=!1,g=null;h=!1,d=d?d.parent:c;try{o=d.location.href||null}catch(e){s=!0}if(s)if(r){const e=n.context;try{g=e.sourceUrl,l=g,b=!0,m=!0,d===c.top&&(f=!0),e.canonicalUrl&&(u=e.canonicalUrl)}catch(e){}}else{(0,i.logWarn)("Trying to access cross domain iframe. Continuing without referrer and location");try{const e=n.document.referrer;e&&(g=e,d===c.top&&(f=!0))}catch(e){}!g&&t&&t[p-1]&&(g=t[p-1],d===c.top&&(b=!0)),g&&!m&&(l=g)}else{if(o&&(g=o,l=g,m=!1,d===c.top)){f=!0;const e=a(d.document);e&&(u=e)}d.context&&d.context.sourceUrl&&(h=!0)}e.push(g),p++}while(d!==c.top&&p<n);e.reverse();try{g=c.top.document.referrer}catch(e){}const y=f||b?l:null,v=r.$W.getConfig("pageUrl")||u||null;let E=r.$W.getConfig("pageUrl")||y||o(v,c);return y&&y.indexOf("?")>-1&&-1===E.indexOf("?")&&(E=`${E}${y.substring(y.indexOf("?"))}`),{reachedTop:f,isAmp:m,numIframes:p-1,stack:e,topmostLocation:l||null,location:y,canonicalUrl:v,page:E,domain:s(E)||null,ref:g||null,legacy:{reachedTop:f,isAmp:m,numIframes:p-1,stack:e,referer:l||null,canonicalUrl:v}}}));var c},869(e,t,n){n.d(t,{uW:()=>T,Yl:()=>C,iS:()=>U});var r=n(3006),i=n(5482),o=n(7156),s=n(1933),a=n(1418),d=n(8014),c=n(2592),l=n(9794),u=n(466),g=n(6665),f=n(8928),p=n(9236),m=n(939);const h=3e3;const b=function(){let e,t,n=(0,m.H)({monotonic:!0,ttl:()=>e,slack:0});s.$W.getConfig("targetingControls",r=>{({lock:t,lockTimeout:e=h}=r.targetingControls??{}),null==t||Array.isArray(t)?null==t&&i():t=[t],n.clear()});const[r,i]=(()=>{let e=!1;function r(e){let{slot:r}=e;t?.forEach(e=>r.getTargeting(e)?.forEach(n.delete))}return[()=>{null!=t&&!e&&(0,u.isGptPubadsDefined)()&&(googletag.pubads().addEventListener?.("slotRenderEnded",r),e=!0)},()=>{e&&(0,u.isGptPubadsDefined)()&&(googletag.pubads().removeEventListener?.("slotRenderEnded",r),e=!1)}]})();return{isLocked:e=>t?.some(t=>null!=e[t]&&n.has(e[t]))??!1,lock(e){r(),t?.forEach(t=>null!=e[t]&&n.add(e[t]))}}}();var y=[];const v=20,E="targetingControls.allowTargetingKeys",A="targetingControls.addTargetingKeys",w=`Only one of "${E}" or "${A}" can be set`,I=Object.keys(a.xS).map(e=>a.xS[e]),T={isBidNotExpired:e=>e.responseTimestamp+1e3*(0,i.cT)(e)>(0,u.timestamp)(),isUnusedBid:e=>e&&(e.status&&![a.tl.RENDERED].includes(e.status)||!e.status),isBidNotLocked:e=>!b.isLocked(e.adserverTargeting)};function C(e){return!Object.values(T).some(t=>!t(e))}const S=(0,c.A_)("sync",function(e,t){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,r=arguments.length>3&&void 0!==arguments[3]&&arguments[3],i=arguments.length>4&&void 0!==arguments[4]?arguments[4]:u.sortByHighestCpm;if(!r){const r=[],o=s.$W.getConfig("sendBidsControl.dealPrioritization"),a=(0,u.groupBy)(e,"adUnitCode");return Object.keys(a).forEach(e=>{let s=[];const d=(0,u.groupBy)(a[e],"bidderCode");Object.keys(d).forEach(e=>{s.push(d[e].reduce(t))});const c="object"==typeof n?n[e]:n;c?(s=o?s.sort(O(!0)):s.sort((e,t)=>t.cpm-e.cpm),r.push(...s.slice(0,c))):(s=s.sort(i),r.push(...s))}),r}return e});function O(){let e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];return function(t,n){return void 0!==t.adserverTargeting.hb_deal&&void 0===n.adserverTargeting.hb_deal?-1:void 0===t.adserverTargeting.hb_deal&&void 0!==n.adserverTargeting.hb_deal?1:e?n.cpm-t.cpm:n.adserverTargeting.hb_pb-t.adserverTargeting.hb_pb}}function B(e,t){if(!s.$W.getConfig("enableSendAllBids"))return 0;const n=s.$W.getConfig("sendBidsControl.bidLimit"),i=new Set(e),o={};for(const e of r.n.getAdUnits())i.has(e.code)&&(o[e.code]=e?.bidLimit||t||n);return o}const R="1.17.2";const U=function(e){const t={},n={setLatestAuctionForAdUnit(e,n){t[e]=n},resetPresetTargetingAST(e){r(e).forEach(function(e){const t=window.apntag.getTag(e);if(t&&t.keywords){const n=Object.keys(t.keywords),r={};n.forEach(e=>{y.includes(e.toLowerCase())||(r[e]=t.keywords[e])}),window.apntag.modifyTag(e,{keywords:r})}})},getAllTargeting(t,n,d){let c=arguments.length>3&&void 0!==arguments[3]?arguments[3]:p.Vk,l=arguments.length>4&&void 0!==arguments[4]?arguments[4]:u.sortByHighestCpm;d||=i(c,l);const f=r(t),b=B(f,n),{customKeysByUnit:T,filteredBids:C}=function(e,t){const n=[],r={},i=s.$W.getConfig("targetingControls.alwaysIncludeDeals"),a=s.$W.getConfig("bidTargetingExclusion"),d=t.filter(t=>{const n=e.includes(t.adUnitCode),r=!0===o.u.get(t.bidderCode,"allowZeroCpmBids")?t.cpm>=0:t.cpm>0,s=i&&t.dealId;return n&&(s||r)});return d.forEach(e=>{let t=!0;if("function"==typeof a)try{t=a(e,d)}catch(n){(0,u.logWarn)(`Error in bidTargetingExclusion function - excluding bid ${e.bidderCode} [${e.adUnitCode}]`),t=!1}t&&(n.push(e),Object.keys(e.adserverTargeting).filter(function(){const e=h();return function(t){return-1===e.indexOf(t)}}()).forEach(t=>{const n=t.substring(0,20),i=r[e.adUnitCode]||{},o=[e.adserverTargeting[t]];i[n]?i[n]=i[n].concat(o).filter(u.uniques):i[n]=o,r[e.adUnitCode]=i}))}),{filteredBids:n,customKeysByUnit:r}}(f,d);let U=function(t,n,r){const i=!0===s.$W.getConfig("targetingControls.allBidsCustomTargeting"),o=m(t,r).concat(function(e){const t=s.$W.getConfig("targetingControls.alwaysIncludeDeals"),n=s.$W.getConfig("enableSendAllBids");return function(e){let t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];const r=I.slice(),i=s.$W.getConfig("targetingControls.allowSendAllBidsTargetingKeys"),o=i?i.map(e=>a.xS[e]):r;return e.reduce((e,i)=>{if(t||n&&i.dealId){const t=function(e,t){return t.reduce((t,n)=>(e.adserverTargeting[n]&&t.push({[`${n}_${e.bidderCode}`.substring(0,v)]:[e.adserverTargeting[n]]}),t),[])}(i,r.filter(e=>void 0!==i.adserverTargeting[e]&&(n||-1!==o.indexOf(e))));t&&e.push({[i.adUnitCode]:t})}return e},[])}(e,n,t)}(t)).concat(function(t){function n(e){return e?.[a.iD.ADSERVER_TARGETING]}function r(e){const t=n(e);return Object.keys(t).map(function(e){return(0,g.O8)(t[e])&&(t[e]=t[e].split(",").map(e=>e.trim())),(0,g.cy)(t[e])||(t[e]=[t[e]]),{[e]:t[e]}})}return e.getAdUnits().filter(e=>t.includes(e.code)&&n(e)).reduce((e,t)=>{const n=r(t);return n&&e.push({[t.code]:n}),e},[])}(r)).concat(function(e){let t=s.$W.getConfig("targetingControls.version");return!1===t?[]:e.map(e=>({[e]:[{[a.xS.VERSION]:[t??R]}]}))}(r));i&&o.push(...function(e,t){return e.reduce((e,n)=>{const r=Object.assign({},n),i=t[r.adUnitCode],o=[];return i&&Object.keys(i).forEach(e=>{e&&i[e]&&o.push({[e]:i[e]})}),e.push({[r.adUnitCode]:o}),e},[])}(t,n));return o.forEach(e=>{!function(e){Object.keys(e).forEach(t=>{e[t].forEach(e=>{const t=Object.keys(e);-1===y.indexOf(t[0])&&(y=t.concat(y))})})}(e)}),o}(S(C,c,b,void 0,l),T,f);const k=Object.keys(Object.assign({},a.Zh));let D=s.$W.getConfig(E);const _=s.$W.getConfig(A);if(null!=_&&null!=D)throw new Error(w);D=null!=_?k.concat(_):D||k,Array.isArray(D)&&D.length>0&&(U=function(e,t){const n=Object.assign({},a.xS),r=Object.keys(a.xS),i={};(0,u.logInfo)(`allowTargetingKeys - allowed keys [ ${t.map(e=>n[e]).join(", ")} ]`),e.forEach(e=>{const o=Object.keys(e)[0],s=e[o].filter(e=>{const o=Object.keys(e)[0],s=0===r.filter(e=>0===o.indexOf(n[e])).length||t.find(e=>{const t=n[e];return 0===o.indexOf(t)});return i[o]=!s,s});e[o]=s});const o=Object.keys(i).filter(e=>i[e]);(0,u.logInfo)(`allowTargetingKeys - removed keys [ ${o.join(", ")} ]`);const s=e.filter(e=>e[Object.keys(e)[0]].length>0);return s}(U,D));let $=function(e){return e.map(e=>({[Object.keys(e)[0]]:e[Object.keys(e)[0]].map(e=>({[Object.keys(e)[0]]:e[Object.keys(e)[0]].join(",")})).reduce((e,t)=>Object.assign(t,e),{})})).reduce(function(e,t){var n=Object.keys(t)[0];return e[n]=Object.assign({},e[n],t[n]),e},{})}(U);const x=s.$W.getConfig("targetingControls.auctionKeyMaxChars");return x&&((0,u.logInfo)(`Detected 'targetingControls.auctionKeyMaxChars' was active for this auction; set with a limit of ${x} characters.  Running checks on auction keys...`),$=function(e,t){const n=(0,g.Go)(e),r=Object.keys(n).map(e=>({adUnitCode:e,adserverTargeting:n[e]})).sort(O());return r.reduce(function(e,r,i,o){let s=(a=r.adserverTargeting,Object.keys(a).reduce(function(e,t){return e+=`${t}%3d${encodeURIComponent(a[t])}%26`},""));var a;i+1===o.length&&(s=s.slice(0,-3));const d=r.adUnitCode,c=s.length;return c<=t?(t-=c,(0,u.logInfo)(`AdUnit '${d}' auction keys comprised of ${c} characters.  Deducted from running threshold; new limit is ${t}`,n[d]),e[d]=n[d]):(0,u.logWarn)(`The following keys for adUnitCode '${d}' exceeded the current limit of the 'auctionKeyMaxChars' setting.\nThe key-set size was ${c}, the current allotted amount was ${t}.\n`,n[d]),i+1===o.length&&0===Object.keys(e).length&&(0,u.logError)("No auction targeting keys were permitted due to the setting in setConfig(targetingControls.auctionKeyMaxChars).  Please review setup and consider adjusting."),e},{})}($,x)),f.forEach(e=>{$[e]||($[e]={}),1===Object.keys($[e]).length&&null!=$[e][a.xS.VERSION]&&delete $[e][a.xS.VERSION]}),$},setTargetingForGPT:(0,c.A_)("sync",function(t,r){const i=n.getAllTargeting(t),o=Object.fromEntries(y.map(e=>[e,null]));Object.entries(function(e,t){return(arguments.length>2&&void 0!==arguments[2]?arguments[2]:()=>window.googletag.pubads().getSlots())().reduce((e,n)=>{const r=(0,g.fp)(t)&&t(n);return Object.keys(e).filter((0,g.fp)(r)?r:(0,u.isAdUnitCodeMatchingSlot)(n)).forEach(t=>e[t].push(n)),e},Object.fromEntries(e.map(e=>[e,[]])))}(Object.keys(i),r)).forEach(e=>{let[t,n]=e;n.forEach(e=>{Object.keys(i[t]).forEach(e=>{let n=i[t][e];"string"==typeof n&&-1!==n.indexOf(",")&&(n=n.split(",")),i[t][e]=n}),(0,u.logMessage)(`Attempting to set targeting-map for slot: ${e.getSlotElementId()} with targeting-map:`,i[t]),e.updateTargetingFromMap(Object.assign({},o,i[t])),b.lock(i[t])})}),Object.keys(i).forEach(t=>{Object.keys(i[t]).forEach(n=>{"hb_adid"===n&&e.setStatusForBids(i[t][n],a.tl.BID_TARGETING_SET)})}),n.targetingDone(i),d.Ic(a.qY.SET_TARGETING,i)},"setTargetingForGPT"),targetingDone:(0,c.A_)("sync",function(e){return e},"targetingDone"),getWinningBids(e,t){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:p.Vk,s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:u.sortByHighestCpm;const a=t||i(n,s),d=r(e);return a.filter(e=>d.includes(e.adUnitCode)).filter(e=>!0===o.u.get(e.bidderCode,"allowZeroCpmBids")?e.cpm>=0:e.cpm>0).map(e=>e.adUnitCode).filter(u.uniques).map(e=>a.filter(t=>t.adUnitCode===e?t:null).reduce(p.Vk))},setTargetingForAst(e){const t=n.getAllTargeting(e);try{n.resetPresetTargetingAST(e)}catch(e){(0,u.logError)("unable to reset targeting for AST"+e)}Object.keys(t).forEach(e=>{b.lock(t[e]),Object.keys(t[e]).forEach(n=>{if((0,u.logMessage)(`Attempting to set targeting for targetId: ${e} key: ${n} value: ${t[e][n]}`),(0,g.O8)(t[e][n])||(0,g.cy)(t[e][n])){const r={},i=/pt[0-9]/;n.search(i)<0?r[n.toUpperCase()]=t[e][n]:r[n]=t[e][n],window.apntag.setKeywords(e,r,{overrideKeyValue:!0})}})})},isApntagDefined(){if(window.apntag&&(0,g.fp)(window.apntag.setKeywords))return!0}};function r(t){return"string"==typeof t?[t]:(0,g.cy)(t)?t:e.getAdUnitCodes()||[]}function i(){let n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:p.Bq,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:void 0;const i=e.getBidsReceived().reduce((e,n)=>{const r=s.$W.getConfig("useBidCache"),i=s.$W.getConfig("bidCacheFilterFunction"),o=t[n.adUnitCode]===n.auctionId,a=!(r&&!o&&"function"==typeof i)||!!i(n);return(r||o)&&a&&n?.video?.context!==l.LM&&C(n)&&(n.latestTargetedAuctionId=t[n.adUnitCode],e.push(n)),e},[]);return S(i,n,void 0,void 0,r)}function m(e,t){const r=n.getWinningBids(t,e),i=h();return r.map(e=>({[e.adUnitCode]:Object.keys(e.adserverTargeting).filter(t=>void 0===e.sendStandardTargeting||e.sendStandardTargeting||-1===i.indexOf(t)).reduce((t,n)=>{const r=[e.adserverTargeting[n]],i={[n.substring(0,v)]:r};if(n===a.xS.DEAL){const o=`${n}_${e.bidderCode}`.substring(0,v),s={[o]:r};return[...t,i,s]}return[...t,i]},[])}))}function h(){return e.getStandardBidderAdServerTargeting().map(e=>e.key).concat(I).filter(u.uniques)}return s.$W.getConfig("targetingControls",function(e){null!=(0,f.A)(e,E)&&null!=(0,f.A)(e,A)&&(0,u.logError)(w)}),n}(r.n)},939(e,t,n){n.d(t,{H:()=>l});var r=n(3064),i=n(466);let o=null,s=0,a=[];function d(){document.hidden?o=Date.now():(s+=Date.now()-(o??0),o=null,a.forEach(e=>{let{callback:t,startTime:n,setTimerId:r}=e;return r(c(t,s-n)())}),a=[])}function c(e,t){const n=s;let r=setTimeout(()=>{s===n&&null==o?e():null!=o?a.push({callback:e,startTime:n,setTimerId(e){r=e}}):r=c(e,s-n)()},t);return()=>r}function l(){let{startTime:e=i.timestamp,ttl:t=()=>null,monotonic:n=!1,slack:o=5e3}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const s=new Map,a=[],d=[],l=n?e=>d.push(e):e=>d.splice((0,i.binarySearch)(d,e,e=>e.expiry),0,e);let u,g;function f(){if(g&&clearTimeout(g),d.length>0){const e=(0,i.timestamp)();u=Math.max(e,d[0].expiry+o),g=c(()=>{const e=(0,i.timestamp)();let t=0;for(const n of d){if(n.expiry>e)break;a.forEach(e=>{try{e(n.item)}catch(e){(0,i.logError)(e)}}),s.delete(n.item),t++}d.splice(0,t),g=null,f()},u-e)}else g=null}function p(n){const i={},s=m;let a;const[d,c]=Object.entries({start:e,delta:t}).map(e=>{let t,[d,c]=e;return function(){const e=t={};r.U9.resolve(c(n)).then(n=>{e===t&&(i[d]=n,s===m&&null!=i.start&&null!=i.delta&&(a=i.start+i.delta,l(p),(null==g||u>a+o)&&f()))})}}),p={item:n,refresh:c,get expiry(){return a}};return d(),c(),p}let m={};return{[Symbol.iterator]:()=>s.keys(),add(e){!s.has(e)&&s.set(e,p(e))},has:e=>s.has(e),delete(e){const t=s.get(e);if(t)for(let e=0;e<d.length&&d[e].expiry<=t.expiry;e++)if(d[e]===t){d.splice(e,1);break}return s.delete(e)},clear(){d.length=0,f(),s.clear(),m={}},toArray:()=>Array.from(s.keys()),refresh(){d.length=0,f();for(const e of s.values())e.refresh()},onExpiry:e=>(a.push(e),()=>{const t=a.indexOf(e);t>=0&&a.splice(t,1)})}}document.addEventListener("visibilitychange",d)},1124(e,t,n){n.d(t,{j:()=>l,q:()=>g});var r=n(466),i=n(1933);const o={buckets:[{max:5,increment:.5}]},s={buckets:[{max:20,increment:.1}]},a={buckets:[{max:20,increment:.01}]},d={buckets:[{max:3,increment:.01},{max:8,increment:.05},{max:20,increment:.5}]},c={buckets:[{max:5,increment:.05},{max:10,increment:.1},{max:20,increment:.5}]};function l(e,t){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,r=parseFloat(e);return isNaN(r)&&(r=""),{low:""===r?"":u(e,o,n),med:""===r?"":u(e,s,n),high:""===r?"":u(e,a,n),auto:""===r?"":u(e,c,n),dense:""===r?"":u(e,d,n),custom:""===r?"":u(e,t,n)}}function u(e,t,n){let o="";if(!g(t))return o;const s=t.buckets.reduce((e,t)=>e.max>t.max?e:t,{max:0});let a=0;const d=t.buckets.find(t=>{if(e>s.max*n){let e=t.precision;void 0===e&&(e=2),o=(t.max*n).toFixed(e)}else{if(e<=t.max*n&&e>=a*n)return t.min=a,t;a=t.max}});return d&&(o=function(e,t,n){const o=void 0!==t.precision?t.precision:2,s=t.increment*n,a=t.min*n;let d=Math.floor;const c=i.$W.getConfig("cpmRoundingFunction");"function"==typeof c&&(d=c);const l=Math.pow(10,o+2),u=(e*l-a*l)/(s*l);let g,f;try{g=d(u)*s+a}catch(e){f=!0}(f||"number"!=typeof g)&&((0,r.logWarn)("Invalid rounding function passed in config"),g=Math.floor(u)*s+a);return g=Number(g.toFixed(10)),g.toFixed(o)}(e,d,n)),o}function g(e){if((0,r.isEmpty)(e)||!e.buckets||!Array.isArray(e.buckets))return!1;let t=!0;return e.buckets.forEach(e=>{e.max&&e.increment||(t=!1)}),t}},1385(e,t,n){n.d(t,{B1:()=>a,SL:()=>v,ad:()=>m,mW:()=>f,o2:()=>b,t6:()=>p});var r=n(466),i=n(6665),o=n(3064),s=n(1933);const a=Object.freeze({}),d="gdpr",c="gpp",l="usp",u="coppa";class g{#e;#t;#n;#r;#i=!0;#o;constructor(){this.reset()}#s(e){this.#r=!0,this.#t=e,this.#n.resolve(e)}reset(){this.#n=(0,o.v6)(),this.#e=!1,this.#t=null,this.#r=!1,this.generatedTime=null}enable(){this.#e=!0}get enabled(){return this.#e}get ready(){return this.#r}get promise(){return this.#r?o.U9.resolve(this.#t):(this.#e||this.#s(null),this.#n.promise)}setConsentData(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:(0,r.timestamp)();this.generatedTime=t,this.#i=!0,this.#s(e)}getConsentData(){return this.#e?this.#t:null}get hash(){return this.#i&&(this.#o=(0,r.cyrb53Hash)(JSON.stringify(this.#t&&this.hashFields?this.hashFields.map(e=>this.#t[e]):this.#t)),this.#i=!1),this.#o}}const f=new class extends g{hashFields=["gdprApplies","consentString"];getConsentMeta(){const e=this.getConsentData();if(e&&e.vendorData&&this.generatedTime)return{gdprApplies:e.gdprApplies,consentStringSize:(0,i.O8)(e.vendorData.tcString)?e.vendorData.tcString.length:0,generatedAt:this.generatedTime,apiVersion:e.apiVersion}}},p=new class extends g{getConsentMeta(){if(this.getConsentData()&&this.generatedTime)return{generatedAt:this.generatedTime}}},m=new class extends g{hashFields=["applicableSections","gppString"];getConsentMeta(){if(this.getConsentData()&&this.generatedTime)return{generatedAt:this.generatedTime}}},h=(()=>{function e(){return!!s.$W.getConfig("coppa")}return{getCoppa:e,getConsentData:e,getConsentMeta:e,reset(){},get promise(){return o.U9.resolve(e())},get hash(){return e()?"1":"0"}}})(),b=function(){const e={},t={},n={};return{register(r,i,o){o&&((e[i]=e[i]||{})[r]=o,t.hasOwnProperty(i)?t[i]!==o&&(t[i]=n):t[i]=o)},get(r){const i={modules:e[r]||{}};return t.hasOwnProperty(r)&&t[r]!==n&&(i.gvlid=t[r]),i}}}(),y={[d]:f,[l]:p,[c]:m,[u]:h};const v=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:y;const t=Object.entries(e);return Object.assign({get promise(){return o.U9.all(t.map(e=>{let[t,n]=e;return n.promise.then(e=>[t,e])})).then(e=>Object.fromEntries(e))},get hash(){return(0,r.cyrb53Hash)(t.map(e=>{let[t,n]=e;return n.hash}).join(":"))}},Object.fromEntries(["getConsentData","getConsentMeta","reset"].map(e=>{return[e,(n=e,function(){return Object.fromEntries(t.map(e=>{let[t,r]=e;return[t,r[n]()]}))})];var n})))}()},1418(e,t,n){n.d(t,{IY:()=>E,M:()=>i,RW:()=>g,Tf:()=>p,UE:()=>d,Zh:()=>l,_B:()=>y,as:()=>s,cA:()=>a,h0:()=>m,iD:()=>r,jO:()=>h,nl:()=>v,oA:()=>b,qY:()=>o,tl:()=>f,x5:()=>u,xS:()=>c});const r={PL_CODE:"code",PL_SIZE:"sizes",PL_BIDS:"bids",BD_BIDDER:"bidder",BD_ID:"paramsd",BD_PL_ID:"placementId",ADSERVER_TARGETING:"adserverTargeting",BD_SETTING_STANDARD:"standard"},i="pbjs_debug",o={AUCTION_INIT:"auctionInit",AUCTION_TIMEOUT:"auctionTimeout",AUCTION_END:"auctionEnd",BID_ADJUSTMENT:"bidAdjustment",BID_TIMEOUT:"bidTimeout",BID_REQUESTED:"bidRequested",BID_RESPONSE:"bidResponse",BID_REJECTED:"bidRejected",NO_BID:"noBid",SEAT_NON_BID:"seatNonBid",BID_WON:"bidWon",BIDDER_DONE:"bidderDone",BIDDER_ERROR:"bidderError",SET_TARGETING:"setTargeting",BEFORE_REQUEST_BIDS:"beforeRequestBids",BEFORE_BIDDER_HTTP:"beforeBidderHttp",REQUEST_BIDS:"requestBids",ADD_AD_UNITS:"addAdUnits",AD_RENDER_FAILED:"adRenderFailed",AD_RENDER_SUCCEEDED:"adRenderSucceeded",TCF2_ENFORCEMENT:"tcf2Enforcement",AUCTION_DEBUG:"auctionDebug",BID_VIEWABLE:"bidViewable",STALE_RENDER:"staleRender",EXPIRED_RENDER:"expiredRender",BILLABLE_EVENT:"billableEvent",BID_ACCEPTED:"bidAccepted",RUN_PAAPI_AUCTION:"paapiRunAuction",PBS_ANALYTICS:"pbsAnalytics",PAAPI_BID:"paapiBid",PAAPI_NO_BID:"paapiNoBid",PAAPI_ERROR:"paapiError",BEFORE_PBS_HTTP:"beforePBSHttp",BROWSI_INIT:"browsiInit",BROWSI_DATA:"browsiData",BROWSER_INTERVENTION:"browserIntervention"},s={PREVENT_WRITING_ON_MAIN_DOCUMENT:"preventWritingOnMainDocument",NO_AD:"noAd",EXCEPTION:"exception",CANNOT_FIND_AD:"cannotFindAd",MISSING_DOC_OR_ADID:"missingDocOrAdid"},a={bidWon:"adUnitCode"},d={LOW:"low",MEDIUM:"medium",HIGH:"high",AUTO:"auto",DENSE:"dense",CUSTOM:"custom"},c={BIDDER:"hb_bidder",AD_ID:"hb_adid",PRICE_BUCKET:"hb_pb",SIZE:"hb_size",DEAL:"hb_deal",SOURCE:"hb_source",FORMAT:"hb_format",UUID:"hb_uuid",CACHE_ID:"hb_cache_id",CACHE_HOST:"hb_cache_host",ADOMAIN:"hb_adomain",ACAT:"hb_acat",CRID:"hb_crid",DSP:"hb_dsp",VERSION:"hb_ver"},l={BIDDER:"hb_bidder",AD_ID:"hb_adid",PRICE_BUCKET:"hb_pb",SIZE:"hb_size",DEAL:"hb_deal",FORMAT:"hb_format",UUID:"hb_uuid",CACHE_HOST:"hb_cache_host",VERSION:"hb_ver"},u={title:"hb_native_title",body:"hb_native_body",body2:"hb_native_body2",privacyLink:"hb_native_privacy",privacyIcon:"hb_native_privicon",sponsoredBy:"hb_native_brand",image:"hb_native_image",icon:"hb_native_icon",clickUrl:"hb_native_linkurl",displayUrl:"hb_native_displayurl",cta:"hb_native_cta",rating:"hb_native_rating",address:"hb_native_address",downloads:"hb_native_downloads",likes:"hb_native_likes",phone:"hb_native_phone",price:"hb_native_price",salePrice:"hb_native_saleprice",rendererUrl:"hb_renderer_url",adTemplate:"hb_adTemplate"},g={SRC:"s2s",DEFAULT_ENDPOINT:"https://prebid.adnxs.com/pbs/v1/openrtb2/auction",SYNCED_BIDDERS_KEY:"pbjsSyncs"},f={BID_TARGETING_SET:"targetingSet",RENDERED:"rendered",BID_REJECTED:"bidRejected"},p={INVALID:"Bid has missing or invalid properties",INVALID_REQUEST_ID:"Invalid request ID",BIDDER_DISALLOWED:"Bidder code is not allowed by allowedAlternateBidderCodes / allowUnknownBidderCodes",FLOOR_NOT_MET:"Bid does not meet price floor",CANNOT_CONVERT_CURRENCY:"Unable to convert currency",DSA_REQUIRED:"Bid does not provide required DSA transparency info",DSA_MISMATCH:"Bid indicates inappropriate DSA rendering method",PRICE_TOO_HIGH:"Bid price exceeds maximum value"},m={body:"desc",body2:"desc2",sponsoredBy:"sponsored",cta:"ctatext",rating:"rating",address:"address",downloads:"downloads",likes:"likes",phone:"phone",price:"price",salePrice:"saleprice",displayUrl:"displayurl"},h={sponsored:1,desc:2,rating:3,likes:4,downloads:5,price:6,saleprice:7,phone:8,address:9,desc2:10,displayurl:11,ctatext:12},b={ICON:1,MAIN:3},y=["privacyIcon","clickUrl","adTemplate","rendererUrl","type"],v={REQUEST:"Prebid Request",RESPONSE:"Prebid Response",NATIVE:"Prebid Native",EVENT:"Prebid Event",INTERVENTION:"Prebid Intervention"},E="__pb_locator__"},1443(e,t,n){n.d(t,{CK:()=>y,X0:()=>p,d_:()=>v,le:()=>h,p6:()=>A,qk:()=>f,s0:()=>m,vM:()=>b});var r=n(466),i=n(7156),o=n(736),s=n(3202),a=n(5291),d=n(5808),c=n(1933),l=n(2592),u=n(8668),g=n(7610);const f="html5",p="cookie";let m=[];function h(){let{moduleName:e,moduleType:t,advertiseKeys:n=!0}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{isAllowed:i=s.io}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};function l(r,s,l,f){let p=e;const m=c.$W.getCurrentBidder();m&&t===o.tW&&u.Ay.aliasRegistry[m]===e&&(p=m);const h={[a.Zw]:s,[a.OI]:f};n&&null!=l&&(h[a.Ez]=l);return r({valid:i(d.Ue,(0,g.s)(t,p,h))})}function h(e,t,n,r,i){if(!i||"function"!=typeof i)return l(e,t,n,r);m.push(function(){let o=l(e,t,n,r);i(o)})}function b(e){const t=e.charAt(0).toUpperCase()+e.substring(1),n=()=>window[e],i=function(t){return h(function(t){if(t&&t.valid)try{return!!n()}catch(t){(0,r.logError)(`${e} api disabled`)}return!1},f,null,!1,t)};return{[`has${t}`]:i,[`${e}IsEnabled`]:e=>h(function(e){if(e&&e.valid)try{return n().setItem("prebid.cookieTest","1"),"1"===n().getItem("prebid.cookieTest")}catch(e){}finally{try{n().removeItem("prebid.cookieTest")}catch(e){}}return!1},f,null,!1,e),[`setDataIn${t}`]:(e,t,r)=>h(function(r){r&&r.valid&&i()&&n().setItem(e,t)},f,e,!0,r),[`getDataFrom${t}`]:(e,t)=>h(function(t){return t&&t.valid&&i()?n().getItem(e):null},f,e,!1,t),[`removeDataFrom${t}`]:(e,t)=>h(function(t){t&&t.valid&&i()&&n().removeItem(e)},f,e,!0,t)}}return{setCookie:function(e,t,n,r,i,o){return h(function(o){if(o&&o.valid){const o=i&&""!==i?` ;domain=${encodeURIComponent(i)}`:"",s=n&&""!==n?` ;expires=${n}`:"",a="none"===r?.toLowerCase()?"; Secure":"";document.cookie=`${e}=${encodeURIComponent(t)}${s}; path=/${o}${r?`; SameSite=${r}`:""}${a}`}},p,e,!0,o)},getCookie:function(e,t){return h(function(t){if(t&&t.valid){let t=window.document.cookie.match("(^|;)\\s*"+e+"\\s*=\\s*([^;]*)\\s*(;|$)");return t?decodeURIComponent(t[2]):null}return null},p,e,!1,t)},cookiesAreEnabled:function(e){return h(function(e){return!(!e||!e.valid)&&((0,r.checkCookieSupport)()&&v())},p,null,!1,e)},...b("localStorage"),...b("sessionStorage"),findSimilarCookies:function(e,t){return h(function(t){if(t&&t.valid){const t=[];if((0,r.hasDeviceAccess)()){const n=document.cookie.split(";");for(;n.length;){const r=n.pop();let i=r.indexOf("=");i=i<0?r.length:i;decodeURIComponent(r.slice(0,i).replace(/^\s+/,"")).indexOf(e)>=0&&t.push(decodeURIComponent(r.slice(i+1)))}}return t}},p,e,!1,t)}}}function b(){let{moduleType:e,moduleName:t,bidderCode:n}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};function r(){throw new Error("Invalid invocation for getStorageManager: must set either bidderCode, or moduleType + moduleName")}return n?((e&&e!==o.tW||t)&&r(),e=o.tW,t=n):t&&e||r(),h({moduleType:e,moduleName:t})}function y(e){return h({moduleName:e,moduleType:o.tp})}const v=(()=>{const e=y("storage");return(0,r.memoize)(function(t){let n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:e;const i=new Date((0,r.timestamp)()+1e4).toUTCString(),o=`_rdc${Date.now()}`,s="writeable";n.setCookie(o,s,i,"Lax",t);return n.getCookie(o)===s&&(n.setCookie(o,"","Thu, 01 Jan 1970 00:00:01 GMT",void 0,t),!0)})})();function E(){if(!(0,r.hasDeviceAccess)())return{allow:!1}}(0,s.qB)(d.Ue,"deviceAccess config",E),(0,s.qB)(d.yg,"deviceAccess config",E),(0,s.qB)(d.Ue,"bidderSettings.*.storageAllowed",function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:i.u;if(e[a.Dk]!==o.tW)return;let n=t.get(e[a.q7],"storageAllowed");if(n&&!0!==n){const t=e[a.Zw];n=Array.isArray(n)?n.some(e=>e===t):n===t}else n=!!n;return n?void 0:{allow:n}});const A=(0,l.A_)("sync",(e,t)=>{})},1748(e,t,n){n.d(t,{E:()=>a,m:()=>s});var r=n(765);const i=(0,r.uP)()?window:{},o=i[(0,r.k)()]=i[(0,r.k)()]||{};function s(){return o}function a(e){o.installedModules.push(e)}o.cmd=o.cmd||[],o.que=o.que||[],o.installedModules=o.installedModules||[],i===window&&(i._pbjsGlobals=i._pbjsGlobals||[],i._pbjsGlobals.push((0,r.k)()))},1780(e,t,n){n.d(t,{S:()=>s});var r=n(466),i=n(1443);const o=(0,i.CK)("fpdEnrichment"),s=(0,r.memoize)(function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:window.location.host;if(!o.cookiesAreEnabled())return e;const t=e.split(".");if(2===t.length)return e;let n,r,s=-2;do{n=t.slice(s).join("."),(0,i.d_)(n,o)?r=!1:(s+=-1,r=Math.abs(s)<=t.length)}while(r);return n})},1833(e,t,n){n.d(t,{Dy:()=>i,O$:()=>s,i8:()=>o});var r=n(466);const i=["dooh","app","site"];function o(e){return function(t){return i.reduce((n,i)=>(s(t,i)&&(null!=n?((0,r.logWarn)(`${e} specifies both '${n}' and '${i}'; dropping the latter.`),delete t[i]):n=i),n),null),t}}function s(e,t){return null!=e[t]&&Object.keys(e[t]).length>0}},1852(e,t,n){n.d(t,{$A:()=>C,BS:()=>F,Hh:()=>j,Pk:()=>N,Uc:()=>R,XO:()=>G,bw:()=>$,n6:()=>S,qn:()=>x,vB:()=>P,vW:()=>U,vd:()=>D});var r=n(466),i=n(8014),o=n(1418),s=n(1933),a=n(7464),d=n(9794),c=n(3006),l=n(5144),u=n(2592),g=n(356),f=n(8668),p=n(7841),m=n(869),h=n(2122),b=n(6652),y=n(3064);const{AD_RENDER_FAILED:v,AD_RENDER_SUCCEEDED:E,STALE_RENDER:A,BID_WON:w,EXPIRED_RENDER:I}=o.qY,{EXCEPTION:T}=o.as,C=(0,u.A_)("sync",function(e,t,n){n(c.n.findBidByAdId(e))}),S=(0,u.A_)("sync",function(e){((0,h.$T)(e.eventtrackers)[h.RO]?.[h.Ni]||[]).forEach(e=>(0,r.triggerPixel)(e)),i.Ic(w,e),c.n.addWinningBid(e)});function O(e){let{reason:t,message:n,bid:o,id:s}=e;const a={reason:t,message:n};o&&(a.bid=o,a.adId=o.adId),s&&(a.adId=s),(0,r.logError)(`Error rendering ad (id: ${s}): ${n}`),i.Ic(v,a)}function B(e){let{doc:t,bid:n,id:r}=e;const o={doc:t,bid:n,adId:r};f.Ay.callAdRenderSucceededBidder(n.adapterCode||n.bidder,n),i.Ic(E,o)}function R(e,t){switch(e.event){case o.qY.AD_RENDER_FAILED:O({bid:t,id:t.adId,reason:e.info.reason,message:e.info.message});break;case o.qY.AD_RENDER_SUCCEEDED:B({doc:null,bid:t,id:t.adId});break;case o.qY.BROWSER_INTERVENTION:!function(e){const{bid:t,intervention:n}=e;f.Ay.callOnInterventionBidder(t.adapterCode||t.bidder,t,n),i.Ic(o.qY.BROWSER_INTERVENTION,e)}({bid:t,adId:t.adId,intervention:e.intervention});break;default:(0,r.logError)(`Received event request for unsupported event: '${e.event}' (adId: '${t.adId}')`)}}function U(e,t,n){let{resizeFn:r,fireTrackers:i=g.vO}=n;if("resizeNativeHeight"===e.action)r(e.width,e.height);else i(e,t)}const k={[o.nl.EVENT]:R};k[o.nl.NATIVE]=U;const D=(0,u.A_)("sync",function(e,t){const{ad:n,adUrl:i,cpm:o,originalCpm:s,width:a,height:d,instl:c}=e,l={AUCTION_PRICE:s||o,CLICKTHROUGH:t?.clickUrl||""};return{ad:(0,r.replaceMacros)(n,l),adUrl:(0,r.replaceMacros)(i,l),width:a,height:d,instl:c}}),_=(0,u.A_)("sync",function(e){let{renderFn:t,resizeFn:n,bidResponse:i,options:s,doc:a,isMainDocument:c=a===document&&!(0,r.inIframe)()}=e;const l=i.mediaType===d.G_;if(c||l)return void O({reason:o.as.PREVENT_WRITING_ON_MAIN_DOCUMENT,message:l?"Cannot render video ad without a renderer":"renderAd was prevented from writing to the main document.",bid:i,id:i.adId});const u=D(i,s);t(Object.assign({adId:i.adId},u));const{width:g,height:f}=u;null!=(g??f)&&n(g,f)});function $(e){let{renderFn:t,resizeFn:n,adId:a,options:d,bidResponse:c,doc:l}=e;j(c,()=>{if(null!=c){if((c.status!==o.tl.RENDERED||((0,r.logWarn)(`Ad id ${a} has been rendered before`),i.Ic(A,c),!s.$W.getConfig("auctionOptions")?.suppressStaleRender))&&(m.uW.isBidNotExpired(c)||((0,r.logWarn)(`Ad id ${a} has been expired`),i.Ic(I,c),!s.$W.getConfig("auctionOptions")?.suppressExpiredRender)))try{_({renderFn:t,resizeFn:n,bidResponse:c,options:d,doc:l})}catch(e){O({reason:o.as.EXCEPTION,message:e.message,id:a,bid:c})}}else O({reason:o.as.CANNOT_FIND_AD,message:`Cannot find ad '${a}'`,id:a})})}function x(e){const t=(0,p.BO)(e.metrics);t.checkpoint("bidRender"),t.timeBetween("bidWon","bidRender","render.deferred"),t.timeBetween("auctionEnd","bidRender","render.pending"),t.timeBetween("requestBids","bidRender","render.e2e"),e.status=o.tl.RENDERED}_.before(function(e,t){const{bidResponse:n,doc:r}=t;(0,a.J7)(n.renderer)?((0,a.Pg)(n.renderer,n,r),B({doc:r,bid:n,id:n.adId}),e.bail()):e(t)},100);const q=new WeakMap,W=new WeakSet;function j(e,t){null!=e?(q.set(e,t),e.deferRendering||P(e),N(e)):t()}function N(e){W.has(e)||(W.add(e),S(e))}function P(e){const t=q.get(e);t&&(t(),x(e),q.delete(e))}let M=!1;s.$W.getConfig("auctionOptions",e=>{M=e.auctionOptions?.legacyRender??!1});const F=(0,b.o1)(()=>!M,function(e,t,n){let i;function s(e,n){O(Object.assign({id:t,bid:i},{reason:e,message:n}))}function a(t,n){const r=e.defaultView?.frameElement;r&&(t&&(r.width=t,r.style.width&&(r.style.width=`${t}px`)),n&&(r.height=n,r.style.height&&(r.style.height=`${n}px`)))}const d=(c={resizeFn:a},function(e,t,n){k.hasOwnProperty(e)&&k[e](t,n,c)});var c;function u(e){return new y.U9(t=>{"loading"===e.readyState?e.addEventListener("DOMContentLoaded",t):t()})}function g(t){t.ad&&M?(e.write(t.ad),e.close(),B({doc:e,bid:i,id:i.adId})):y.U9.all([(0,l.HH)(i),u(e)]).then(n=>{let[o]=n;return o(t,{sendMessage:(e,t)=>d(e,t,i),mkFrame:r.createIframe},e.defaultView)}).then(()=>B({doc:e,bid:i,id:i.adId}),e=>{s(e?.reason||o.as.EXCEPTION,e?.message),e?.stack&&(0,r.logError)(e)});const n=document.createComment(`Creative ${i.creativeId} served by ${i.bidder} Prebid.js Header Bidding`);(0,r.insertElement)(n,e,"html")}try{t&&e?C(t,!0,r=>{i=r,$({renderFn:g,resizeFn:a,adId:t,options:{clickUrl:n?.clickThrough},bidResponse:r,doc:e})}):s(o.as.MISSING_DOC_OR_ADID,"missing "+(t?"doc":"adId"))}catch(e){s(T,e.message)}});function G(){if(!window.frames[o.IY])if(document.body){const e=(0,r.createInvisibleIframe)();e.name=o.IY,document.body.appendChild(e)}else window.requestAnimationFrame(G)}},1933(e,t,n){n.d(t,{$W:()=>m,Ov:()=>l});var r=n(1124),i=n(466),o=n(8928),s=n(6665),a=n(1418);const d="TRUE"===(0,i.getParameterByName)(a.M).toUpperCase(),c={},l="random",u={};u[l]=!0,u.fixed=!0;const g=l,f={LOW:"low",MEDIUM:"medium",HIGH:"high",AUTO:"auto",DENSE:"dense",CUSTOM:"custom"};function p(e){const t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1]?{priceGranularity:f.MEDIUM,customPriceBucket:{},mediaTypePriceGranularity:{},bidderSequence:g,auctionOptions:{}}:{},n=(()=>{const e=["secondaryBidders","suppressStaleRender","suppressExpiredRender","legacyRender"],t=["secondaryBidders"],n=[].concat(e).concat(t);return function(r){if(!(0,s.Qd)(r))return(0,i.logWarn)("Auction Options must be an object"),!1;for(const o of Object.keys(r)){if(!n.includes(o))return(0,i.logWarn)(`Auction Options given an incorrect param: ${o}`),!1;if(t.includes(o)){if(!(0,s.cy)(r[o]))return(0,i.logWarn)(`Auction Options ${o} must be of type Array`),!1;if(!r[o].every(s.O8))return(0,i.logWarn)(`Auction Options ${o} must be only string`),!1}else if(e.includes(o)&&!(0,s.Lm)(r[o]))return(0,i.logWarn)(`Auction Options ${o} must be of type boolean`),!1}return!0}})();function o(e){return t[e]}function a(n,r){t.hasOwnProperty(n)||Object.defineProperty(e,n,{enumerable:!0}),t[n]=r}const d={publisherDomain:{set(e){null!=e&&(0,i.logWarn)("publisherDomain is deprecated and has no effect since v7 - use pageUrl instead"),a("publisherDomain",e)}},priceGranularity:{set(e){l(e)&&("string"==typeof e?a("priceGranularity",c(e)?e:f.MEDIUM):(0,s.Qd)(e)&&(a("customPriceBucket",e),a("priceGranularity",f.CUSTOM),(0,i.logMessage)("Using custom price granularity")))}},customPriceBucket:{},mediaTypePriceGranularity:{set(e){null!=e&&a("mediaTypePriceGranularity",Object.keys(e).reduce((t,n)=>(l(e[n])?"string"==typeof e?t[n]=c(e[n])?e[n]:o("priceGranularity"):(0,s.Qd)(e)&&(t[n]=e[n],(0,i.logMessage)(`Using custom price granularity for ${n}`)):(0,i.logWarn)(`Invalid price granularity for media type: ${n}`),t),{}))}},bidderSequence:{set(e){u[e]?a("bidderSequence",e):(0,i.logWarn)(`Invalid order: ${e}. Bidder Sequence was not set.`)}},auctionOptions:{set(e){n(e)&&a("auctionOptions",e)}}};return Object.defineProperties(e,Object.fromEntries(Object.entries(d).map(e=>{let[n,r]=e;return[n,Object.assign({get:o.bind(null,n),set:a.bind(null,n),enumerable:t.hasOwnProperty(n),configurable:!t.hasOwnProperty(n)},r)]}))),e;function c(e){return Object.keys(f).find(t=>e===f[t])}function l(e){if(!e)return(0,i.logError)("Prebid Error: no value passed to `setPriceGranularity()`"),!1;if("string"==typeof e)c(e)||(0,i.logWarn)("Prebid Warning: setPriceGranularity was called with invalid setting, using `medium` as default.");else if((0,s.Qd)(e)&&!(0,r.q)(e))return(0,i.logError)("Invalid custom price value passed to `setPriceGranularity()`"),!1;return!0}}const m=function(){const e=[];let t,n,r,a=null;function l(){t={};const e=p({debug:d,bidderTimeout:3e3,enableSendAllBids:true,useBidCache:false,deviceAccess:true,disableAjaxTimeout:false,maxNestedIframes:10,maxBid:5e3,userSync:{topics:c}});n&&v(Object.keys(n).reduce((t,r)=>(n[r]!==e[r]&&(t[r]=e[r]||{}),t),{})),n=e,r={}}function u(){if(a&&r&&(0,s.Qd)(r[a])){const e=r[a],t=new Set([...Object.keys(n),...Object.keys(e)]),o={};for(const r of t){const t=n[r],a=e[r];o[r]=void 0===a?t:void 0===t?a:(0,s.Qd)(a)?(0,i.mergeDeep)({},t,a):a}return o}return{...n}}const[g,f]=[u,function(){const e=u();return Object.defineProperty(e,"ortb2",{get:function(){throw new Error("invalid access to 'orbt2' config - use request parameters instead")}}),e}].map(e=>function(){if(arguments.length<=1&&"function"!=typeof(arguments.length<=0?void 0:arguments[0])){const t=arguments.length<=0?void 0:arguments[0];return t?(0,o.A)(e(),t):u()}return y(...arguments)}),[m,h]=[f,g].map(e=>function(){let t=e(...arguments);return t&&"object"==typeof t&&(t=(0,s.Go)(t)),t});function b(e){if(!(0,s.Qd)(e))return void(0,i.logError)("setConfig options must be an object");const r=Object.keys(e),o={};r.forEach(r=>{let a=e[r];(0,s.Qd)(t[r])&&(0,s.Qd)(a)&&(a=Object.assign({},t[r],a));try{o[r]=n[r]=a}catch(e){(0,i.logWarn)(`Cannot set config for property ${r} : `,e)}}),v(o)}function y(t,n){let r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},o=n;if("string"!=typeof t&&(o=t,t="*",r=n||{}),"function"!=typeof o)return void(0,i.logError)("listener must be a function");const s={topic:t,callback:o};return e.push(s),r.init&&o("*"===t?f():{[t]:f(t)}),function(){e.splice(e.indexOf(s),1)}}function v(t){const n=Object.keys(t);e.filter(e=>n.includes(e.topic)).forEach(e=>{e.callback({[e.topic]:t[e.topic]})}),e.filter(e=>"*"===e.topic).forEach(e=>e.callback(t))}function E(e){let t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];try{!function(e){if(!(0,s.Qd)(e))throw new Error("setBidderConfig bidder options must be an object");if(!Array.isArray(e.bidders)||!e.bidders.length)throw new Error("setBidderConfig bidder options must contain a bidders list with at least 1 bidder");if(!(0,s.Qd)(e.config))throw new Error("setBidderConfig bidder options must contain a config object")}(e),e.bidders.forEach(n=>{r[n]||(r[n]=p({},!1)),Object.keys(e.config).forEach(o=>{const a=e.config[o],d=r[n][o];if((0,s.Qd)(a)&&(null==d||(0,s.Qd)(d))){const e=t?i.mergeDeep:Object.assign;r[n][o]=e({},d||{},a)}else r[n][o]=a})})}catch(e){(0,i.logError)(e)}}function A(e,t){a=e;try{return t()}finally{w()}}function w(){a=null}return l(),{getCurrentBidder:function(){return a},resetBidder:w,getConfig:f,getAnyConfig:g,readConfig:m,readAnyConfig:h,setConfig:b,mergeConfig:function(e){if(!(0,s.Qd)(e))return void(0,i.logError)("mergeConfig input must be an object");const t=(0,i.mergeDeep)(u(),e);return b({...t}),t},setDefaults:function(e){(0,s.Qd)(t)?(Object.assign(t,e),Object.assign(n,e)):(0,i.logError)("defaults must be an object")},resetConfig:l,runWithBidder:A,callbackWithBidder:function(e){return function(t){return function(){if("function"==typeof t){for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return A(e,t.bind(this,...r))}(0,i.logWarn)("config.callbackWithBidder callback is not a function")}}},setBidderConfig:E,getBidderConfig:function(){return r},mergeBidderConfig:function(e){return E(e,!0)}}}()},2122(e,t,n){n.d(t,{$T:()=>a,Ni:()=>r,OA:()=>o,RO:()=>s,fR:()=>i});const r=1,i=2,o=1,s=500;function a(e){return(e??[]).reduce((e,t)=>{let{event:n,method:r,url:i}=t;const o=e[n]=e[n]??{};return(o[r]=o[r]??[]).push(i),e},{})}},2201(e,t,n){n.d(t,{RD:()=>h,g4:()=>m,hd:()=>b});var r=n(5808),i=n(7610),o=n(3202),s=n(1933),a=n(2592),d=n(466);const c={fetch:window.fetch.bind(window),makeRequest:(e,t)=>new Request(e,t),timeout(e,t){const n=new AbortController;let r=setTimeout(()=>{n.abort(),(0,d.logError)(`Request timeout after ${e}ms`,t),r=null},e);return{signal:n.signal,done(){r&&clearTimeout(r)}}}},l="GET",u="Content-Type",g=(0,a.A_)("async",function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1?arguments[1]:void 0,n=arguments.length>2?arguments[2]:void 0;return e.withCredentials&&(e.withCredentials=t&&n?(0,o.io)(r.yg,(0,i.s)(t,n)):(0,d.hasDeviceAccess)()),e},"processRequestOptions");function f(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e3,{request:t,done:n}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=arguments.length>2?arguments[2]:void 0,i=arguments.length>3?arguments[3]:void 0,o=(t,n)=>{let o;null==e||null!=n?.signal||s.$W.getConfig("disableAjaxTimeout")||(o=c.timeout(e,t),n=Object.assign({signal:o.signal},n)),g(n,r,i);let a=c.fetch(t,n);return null!=o?.done&&(a=a.finally(o.done)),a};return null==t&&null==n||(o=(e=>function(r,i){const o=new URL(null==r?.url?r:r.url,document.location).origin;let s=e(r,i);return t&&t(o),n&&(s=s.finally(()=>n(o))),s})(o)),o}function p(e,t){let n,{status:r,statusText:i="",headers:o,url:s}=e;function a(e){if(void 0===n)try{n=(new DOMParser).parseFromString(t,o?.get(u)?.split(";")?.[0])}catch(t){n=null,e&&e(t)}return n}return{readyState:XMLHttpRequest.DONE,status:r,statusText:i,responseText:t,response:t,responseType:"",responseURL:s,get responseXML(){return a(d.logError)},getResponseHeader:e=>o?.has(e)?o.get(e):null,toJSON(){return Object.assign({responseXML:a()},this)},timedOut:!1}}function m(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3e3,{request:t,done:n}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};const r=f(e,{request:t,done:n},arguments.length>2?arguments[2]:void 0,arguments.length>3?arguments[3]:void 0);return function(e,t,n){!function(e,t){const{success:n,error:r}="object"==typeof t&&null!=t?t:{success:"function"==typeof t?t:()=>null,error:(e,t)=>(0,d.logError)("Network error",e,t)};e.then(e=>e.text().then(t=>[e,t])).then(e=>{let[t,i]=e;const o=p(t,i);t.ok||304===t.status?n(i,o):r(t.statusText,o)},e=>r("",Object.assign(p({status:0},""),{reason:e,timedOut:"AbortError"===e?.name})))}(r(function(e,t){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};const r=n.method||(t?"POST":l);if(r===l&&t){const r=(0,d.parseUrl)(e,n);Object.assign(r.search,t),e=(0,d.buildUrl)(r)}const i=new Headers(n.customHeaders);i.set(u,n.contentType||"text/plain");const o={method:r,headers:i};return r!==l&&t&&(o.body=t),n.withCredentials&&(o.credentials="include"),isSecureContext&&(["browsingTopics","adAuctionHeaders"].forEach(e=>{n[e]&&(o[e]=!0)}),null!=n.suppressTopicsEnrollmentWarning&&(o.suppressTopicsEnrollmentWarning=n.suppressTopicsEnrollmentWarning)),n.keepalive&&(o.keepalive=!0),c.makeRequest(e,o)}(e,n,arguments.length>3&&void 0!==arguments[3]?arguments[3]:{})),t)}}const h=m(),b=f()},2517(e,t,n){n.d(t,{Cf:()=>a,S3:()=>i,Tb:()=>o,WR:()=>s,pS:()=>u,qN:()=>d,yB:()=>g,zt:()=>r});const r=["request","imp","bidResponse","response"],[i,o,s,a]=r,[d,c]=["default","pbs"],l=new Set(r);const{registerOrtbProcessor:u,getProcessors:g}=function(){const e={};return{registerOrtbProcessor(t){let{type:n,name:i,fn:o,priority:s=0,dialects:a=[d]}=t;if(!l.has(n))throw new Error(`ORTB processor type must be one of: ${r.join(", ")}`);a.forEach(t=>{e.hasOwnProperty(t)||(e[t]={}),e[t].hasOwnProperty(n)||(e[t][n]={}),e[t][n][i]={priority:s,fn:o}})},getProcessors:t=>e[t]||{}}}()},2592(e,t,n){n.d(t,{A_:()=>s,Gc:()=>d,Y6:()=>f,Yn:()=>c,bz:()=>g,u2:()=>p,xG:()=>u});var r=n(5481),i=n.n(r),o=n(3064);const s=i()({ready:i().SYNC|i().ASYNC|i().QUEUE}),a=(0,o.v6)();s.ready=(()=>{const e=s.ready;return function(){try{return e.apply(s)}finally{a.resolve()}}})();const d=a.promise,c=s.get;const l={};function u(e,t){let{postInstallAllowed:n=!1}=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};s("async",function(r){r.forEach(e=>t(...e)),n&&(l[e]=t)},e)([])}function g(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];const i=l[e];if(i)return i(...n);c(e).before((e,t)=>{t.push(n),e(t)})}function f(e,t){return Object.defineProperties(t,Object.fromEntries(["before","after","getHooks","removeAll"].map(t=>[t,{get:()=>e[t]}]))),t}function p(e){return f(e,function(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++)n[r]=arguments[r];return n.push(function(){}),e.apply(this,n)})}},3006(e,t,n){n.d(t,{n:()=>l});var r=n(466),i=n(7391);function o(e){Object.assign(this,{getAuction(t){let{auctionId:n}=t;if(null!=n)return e().find(e=>e.getAuctionId()===n)},getAdUnit(t){let{adUnitId:n}=t;if(null!=n)return e().flatMap(e=>e.getAdUnits()).find(e=>e.adUnitId===n)},getMediaTypes(e){let{adUnitId:t,requestId:n}=e;if(null!=n){const e=this.getBidRequest({requestId:n});if(null!=e&&(null==t||e.adUnitId===t))return e.mediaTypes}else if(null!=t){const e=this.getAdUnit({adUnitId:t});if(null!=e)return e.mediaTypes}},getBidderRequest(t){let{requestId:n,bidderRequestId:r}=t;if(null!=n||null!=r){let t=e().flatMap(e=>e.getBidRequests());return null!=r&&(t=t.filter(e=>e.bidderRequestId===r)),null==n?t[0]:t.find(e=>e.bids&&null!=e.bids.find(e=>e.bidId===n))}},getBidRequest(t){let{requestId:n}=t;if(null!=n)return e().flatMap(e=>e.getBidRequests()).flatMap(e=>e.bids).find(e=>e&&e.bidId===n)},getOrtb2(e){return this.getBidderRequest(e)?.ortb2||this.getAuction(e)?.getFPD()?.global?.ortb2}})}var s=n(1418),a=n(7841),d=n(939),c=n(5482);const l=function(){const e=(0,d.H)({startTime:e=>e.end.then(()=>e.getAuctionEnd()),ttl:e=>null==(0,c.S9)()?null:e.end.then(()=>1e3*Math.max((0,c.S9)(),...e.getBidsReceived().map(e=>e.ttl)))});(0,c.lc)(()=>e.refresh());const t={onExpiry:e.onExpiry};function n(t){for(const n of e)if(n.getAuctionId()===t)return n}function l(){return e.toArray().flatMap(e=>e.getBidsReceived())}return t.addWinningBid=function(e){const t=(0,a.BO)(e.metrics);t.checkpoint("bidWon"),t.timeBetween("auctionEnd","bidWon","adserver.pending"),t.timeBetween("requestBids","bidWon","adserver.e2e");const i=n(e.auctionId);i?i.addWinningBid(e):(0,r.logWarn)("Auction not found when adding winning bid")},Object.entries({getAllWinningBids:{name:"getWinningBids"},getBidsRequested:{name:"getBidRequests"},getNoBids:{},getAdUnits:{},getBidsReceived:{pre:e=>e.getAuctionStatus()===i.UZ},getAdUnitCodes:{post:r.uniques}}).forEach(n=>{let[r,{name:i=r,pre:o,post:s}]=n;const a=null==o?e=>e[i]():e=>o(e)?e[i]():[],d=null==s?e=>e:e=>e.filter(s);t[r]=()=>d(e.toArray().flatMap(a))}),t.getAllBidsForAdUnitCode=function(e){return l().filter(t=>t&&t.adUnitCode===e)},t.createAuction=function(t){const n=(0,i.mX)(t);return function(t){e.add(t)}(n),n},t.findBidByAdId=function(e){return l().find(t=>t.adId===e)},t.getStandardBidderAdServerTargeting=function(){return(0,i.HN)()[s.iD.ADSERVER_TARGETING]},t.setStatusForBids=function(e,r){const i=t.findBidByAdId(e);if(i&&(i.status=r),i&&r===s.tl.BID_TARGETING_SET){const e=n(i.auctionId);e&&e.setBidTargeting(i)}},t.getLastAuctionId=function(){const t=e.toArray();return t.length&&t[t.length-1].getAuctionId()},t.clearAllAuctions=function(){e.clear()},t.index=new o(()=>e.toArray()),t}()},3064(e,t,n){n.d(t,{U9:()=>o,cb:()=>s,v6:()=>a});var r=n(1748);const i=(0,r.m)().setTimeout??setTimeout,o=(0,r.m)().Promise??Promise;function s(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;return new o(t=>{i(t,e)})}function a(){let e,t,{promiseFactory:n=e=>new o(e)}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};function r(e){return t=>e(t)}return{promise:n((n,r)=>{e=n,t=r}),resolve:r(e),reject:r(t)}}},3129(e,t,n){n.d(t,{Q:()=>r});const r=(0,n(2592).A_)("sync",()=>{})},3202(e,t,n){n.d(t,{io:()=>s,qB:()=>o});var r=n(466),i=n(5291);const[o,s]=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:(0,r.prefixLog)("Activity control:");const t={};function n(e){return t[e]=t[e]||[],t[e]}function o(t,n,r,o){let s;try{s=r(o)}catch(r){e.logError(`Exception in rule ${n} for '${t}'`,r),s={allow:!1,reason:r}}return s&&Object.assign({activity:t,name:n,component:o[i.Ii]},s)}const s={};function a(t){let{activity:n,name:r,allow:i,reason:o,component:a}=t;const d=`${r} ${i?"allowed":"denied"} '${n}' for '${a}'${o?":":""}`,c=s.hasOwnProperty(d);if(c&&clearTimeout(s[d]),s[d]=setTimeout(()=>delete s[d],1e3),!c){const t=[d];o&&t.push(o),(i?e.logInfo:e.logWarn).apply(e,t)}}return[function(e,t,r){let i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:10;const o=n(e),s=o.findIndex(e=>{let[t]=e;return i<t}),a=[i,t,r];return o.splice(s<0?o.length:s,0,a),function(){const e=o.indexOf(a);e>=0&&o.splice(e,1)}},function(e,t){let r,i;for(const[s,d,c]of n(e)){if(r!==s&&i)break;r=s;const n=o(e,d,c,t);if(n){if(!n.allow)return a(n),!1;i=n}}return i&&a(i),!0}]}()},3320(e,t,n){n.d(t,{O:()=>o});var r=n(466);function i(){let{src:e="client",bidder:t="",bidId:n,transactionId:i,adUnitId:o,auctionId:s}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};var a=e;Object.assign(this,{bidderCode:t,width:0,height:0,adId:(0,r.getUniqueIdentifierStr)(),requestId:n,transactionId:i,adUnitId:o,auctionId:s,mediaType:"banner",source:a}),this.getSize=function(){return this.width+"x"+this.height}}function o(e){return new i(e)}},3391(e,t,n){n.d(t,{qh:()=>g,zt:()=>p});var r=n(466),i=n(6665),o=n(1933),s=n(1443),a=n(3202),d=n(5808),c=n(5291),l=n(736),u=n(7610);const g={syncEnabled:!0,filterSettings:{image:{bidders:"*",filter:"include"}},syncsPerBidder:5,syncDelay:3e3,auctionDelay:500};o.$W.setDefaults({userSync:(0,i.Go)(g)});const f=(0,s.CK)("usersync");const p=function(e){const t={};let n={image:[],iframe:[]};const s=new Set;let a={};const g={image:!0,iframe:!1};let f=e.config;function p(){if(f.syncEnabled&&e.browserSupportsCookies){try{!function(){if(!g.iframe)return;m(n.iframe,e=>{const[t,i]=e;(0,r.logMessage)(`Invoking iframe user sync for bidder: ${t}`),(0,r.insertUserSyncIframe)(i),function(e,t){e.image=e.image.filter(e=>e[0]!==t)}(n,t)})}(),function(){if(!g.image)return;m(n.image,e=>{const[t,n]=e;(0,r.logMessage)(`Invoking image pixel user sync for bidder: ${t}`),(0,r.triggerPixel)(n)})}()}catch(e){return(0,r.logError)("Error firing user syncs",e)}n={image:[],iframe:[]}}}function m(e,t){(0,r.shuffle)(e).forEach(t)}function h(e,t){const n=f.filterSettings;if(function(e,t){if(e.all&&e[t])return(0,r.logWarn)(`Detected presence of the "filterSettings.all" and "filterSettings.${t}" in userSync config.  You cannot mix "all" with "iframe/image" configs; they are mutually exclusive.`),!1;const n=e.all?e.all:e[t],o=e.all?"all":t;if(!n)return!1;const s=n.filter,a=n.bidders;if(s&&"include"!==s&&"exclude"!==s)return(0,r.logWarn)(`UserSync "filterSettings.${o}.filter" setting '${s}' is not a valid option; use either 'include' or 'exclude'.`),!1;if("*"!==a&&!(Array.isArray(a)&&a.length>0&&a.every(e=>(0,i.O8)(e)&&"*"!==e)))return(0,r.logWarn)(`Detected an invalid setup in userSync "filterSettings.${o}.bidders"; use either '*' (to represent all bidders) or an array of bidders.`),!1;return!0}(n,e)){g[e]=!0;const r=n.all?n.all:n[e],i="*"===r.bidders?[t]:r.bidders,o={include:(e,t)=>!e.includes(t),exclude:(e,t)=>e.includes(t)};return o[r.filter||"include"](i,t)}return!g[e]}return o.$W.getConfig("userSync",e=>{if(e.userSync){const t=e.userSync.filterSettings;(0,i.Qd)(t)&&(t.image||t.all||(e.userSync.filterSettings.image={bidders:"*",filter:"include"}))}f=Object.assign(f,e.userSync)}),e.regRule(d.Ml,"userSync config",e=>{if(!f.syncEnabled)return{allow:!1,reason:"syncs are disabled"};if(e[c.Dk]===l.tW){const n=e[c.bt],r=e[c.iK];if(!t.canBidderRegisterSync(n,r))return{allow:!1,reason:`${n} syncs are not enabled for ${r}`}}}),t.registerSync=(t,o,g)=>s.has(o)?(0,r.logMessage)(`already fired syncs for "${o}", ignoring registerSync call`):f.syncEnabled&&(0,i.cy)(n[t])?o?0!==f.syncsPerBidder&&Number(a[o])>=f.syncsPerBidder?(0,r.logWarn)(`Number of user syncs exceeded for "${o}"`):void(e.isAllowed(d.Ml,(0,u.s)(l.tW,o,{[c.bt]:t,[c.e3]:g}))&&(n[t].push([o,g]),a=function(e,t){return e[t]?e[t]+=1:e[t]=1,e}(a,o))):(0,r.logWarn)("Bidder is required for registering sync"):(0,r.logWarn)(`User sync type "${t}" not supported`),t.bidderDone=s.add.bind(s),t.syncUsers=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;if(e)return setTimeout(p,Number(e));p()},t.triggerUserSyncs=()=>{f.enableOverride&&t.syncUsers()},t.canBidderRegisterSync=(e,t)=>!f.filterSettings||!h(e,t),t}(Object.defineProperties({config:o.$W.getConfig("userSync"),isAllowed:a.io,regRule:a.qB},{browserSupportsCookies:{get:function(){return!(0,r.isSafariBrowser)()&&f.cookiesAreEnabled()}}}))},3556(e,t,n){n.d(t,{xb:()=>C,a$:()=>I});var r=n(8668),i=n(1933),o=n(3320),s=n(3391),a=n(356),d=n(6220),c=n(1418),l=n(8014),u=n(6665),g=n(466),f=n(2592),p=n(3006),m=n(7156),h=n(7841),b=n(3202),y=n(7610),v=n(736),E=n(5808);const A=["cpm","ttl","creativeId","netRevenue","currency"],w={auctionId:e=>e.ortb2?.source?.tid,transactionId:e=>e.ortb2Imp?.ext?.tid};function I(e){const t=Array.isArray(e.supportedMediaTypes)?{supportedMediaTypes:e.supportedMediaTypes}:void 0;function n(e){const n=C(e);r.Ay.registerBidAdapter(n,e.code,t)}n(e),Array.isArray(e.aliases)&&e.aliases.forEach(t=>{let i,o,s=t;(0,u.Qd)(t)&&(s=t.code,i=t.gvlid,o=t.skipPbsAliasing),r.Ay.aliasRegistry[s]=e.code,n(Object.assign({},e,{code:s,gvlid:i,skipPbsAliasing:o}))})}const T=(0,g.memoize)(e=>{let{bidderCode:t}=e;const n=(0,b.io)(E.VJ,(0,y.s)(v.tW,t));function r(e,t,r){return w.hasOwnProperty(t)?n?w[t](e):null:Reflect.get(e,t,r)}function i(e,t){const n=new Proxy(e,t);return Object.entries(e).filter(e=>{let[t,n]=e;return"function"==typeof n}).forEach(t=>{let[r,i]=t;n[r]=i.bind(e)}),n}const o=(0,g.memoize)(e=>i(e,{get:r}),e=>e.bidId);return{bidRequest:o,bidderRequest:e=>i(e,{get:(t,n,i)=>"bids"===n?e.bids.map(o):r(t,n,i)})}});function C(e){return Object.assign((t=e.code,n=t,{callBids:function(){},setBidderCode:function(e){n=e},getBidderCode:function(){return n}}),{getSpec:function(){return Object.freeze(Object.assign({},e))},registerSyncs:s,callBids:function(t,n,f,b,y,v){if(!Array.isArray(t.bids))return;const E=T(t),I={};function C(e,t){const r=(0,h.BO)(t.metrics);r.checkpoint("addBidResponse"),I[e]=!0,r.measureTime("addBidResponse.validate",()=>function(e,t){let{index:n=p.n.index}=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};function r(){const e=Object.keys(t);return A.every(n=>e.includes(n)&&![void 0,null].includes(t[n]))}function i(e){return`Invalid bid from ${t.bidderCode}. Ignoring bid: ${e}`}if(!e)return(0,g.logWarn)("No adUnitCode was supplied to addBidResponse."),!1;if(!t)return(0,g.logWarn)(`Some adapter tried to add an undefined bid for ${e}.`),!1;if(!r())return(0,g.logError)(i(`Bidder ${t.bidderCode} is missing required params. Check http://prebid.org/dev-docs/bidder-adapter-1.html for list of params.`)),!1;if("native"===t.mediaType&&!(0,a.Bm)(t,{index:n}))return(0,g.logError)(i("Native bid missing some required properties.")),!1;if("video"===t.mediaType&&!(0,d.vk)(t,{index:n}))return(0,g.logError)(i("Video bid does not have required vastUrl or renderer property")),!1;if("banner"===t.mediaType&&!function(e,t){let{index:n=p.n.index}=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};if((t.width||0===parseInt(t.width,10))&&(t.height||0===parseInt(t.height,10)))return t.width=parseInt(t.width,10),t.height=parseInt(t.height,10),!0;if(null!=t.wratio&&null!=t.hratio)return t.wratio=parseInt(t.wratio,10),t.hratio=parseInt(t.hratio,10),!0;const r=n.getBidRequest(t),i=n.getMediaTypes(t),o=r&&r.sizes||i&&i.banner&&i.banner.sizes,s=(0,g.parseSizesInput)(o);if(1===s.length){const[e,n]=s[0].split("x");return t.width=parseInt(e,10),t.height=parseInt(n,10),!0}return!1}(e,t,{index:n}))return(0,g.logError)(i("Banner bids require a width and height")),!1;return!0}(e,t))?n(e,t):n.reject(e,t,c.Tf.INVALID)}const S=[];function B(){f(),i.$W.runWithBidder(e.code,()=>{l.Ic(c.qY.BIDDER_DONE,t),s(S,t.gdprConsent,t.uspConsent,t.gppConsent)})}const k=U(t).measureTime("validate",()=>t.bids.filter(t=>function(t){if(!e.isBidRequestValid(t))return(0,g.logWarn)(`Invalid bid sent to bidder ${e.code}: ${JSON.stringify(t)}`),!1;return!0}(E.bidRequest(t))));if(0===k.length)return void B();const D={};k.forEach(e=>{D[e.bidId]=e}),O(e,k,t,b,v,{onRequest:e=>l.Ic(c.qY.BEFORE_BIDDER_HTTP,t,e),onResponse:t=>{y(e.code),S.push(t)},onPaapi:e=>{const t=D[e.bidId];t?R(t,e):(0,g.logWarn)("Received fledge auction configuration for an unknown bidId",e)},onError:(n,i)=>{i.timedOut||y(e.code),r.Ay.callBidderError(e.code,i,t),l.Ic(c.qY.BIDDER_ERROR,{error:i,bidderRequest:t}),(0,g.logError)(`Server call for ${e.code} failed: ${n} ${i.status}. Continuing without bids.`,{bidRequests:k})},onBid:t=>{const r=D[t.requestId],i=t;if(r){if(i.adapterCode=r.bidder,function(e,t){const n=m.u.get(t,"allowAlternateBidderCodes")||!1;let r=m.u.get(t,"allowedAlternateBidderCodes");if(e&&t&&t!==e&&(r=(0,u.cy)(r)?r.map(e=>e.trim().toLowerCase()).filter(e=>!!e).filter(g.uniques):r,!n||(0,u.cy)(r)&&"*"!==r[0]&&!r.includes(e)))return!0;return!1}(t.bidderCode,r.bidder))return(0,g.logWarn)(`${t.bidderCode} is not a registered partner or known bidder of ${r.bidder}, hence continuing without bid. If you wish to support this bidder, please mark allowAlternateBidderCodes as true in bidderSettings.`),void n.reject(r.adUnitCode,t,c.Tf.BIDDER_DISALLOWED);i.originalCpm=t.cpm,i.originalCurrency=t.currency,i.meta=t.meta||Object.assign({},t[r.bidder]),i.deferBilling=r.deferBilling,i.deferRendering=i.deferBilling&&(t.deferRendering??"function"!=typeof e.onBidBillable);const s=Object.assign((0,o.O)(r),i,(0,g.pick)(r,Object.keys(w)));C(r.adUnitCode,s)}else(0,g.logWarn)(`Bidder ${e.code} made bid for unknown request ID: ${t.requestId}. Ignoring.`),n.reject(null,t,c.Tf.INVALID_REQUEST_ID)},onCompletion:B})}});var t,n;function s(t,n,r,i){B(e,t,n,r,i)}}const S=["bids","paapi"],O=(0,f.A_)("async",function(e,t,n,r,i,o){let{onRequest:s,onResponse:a,onPaapi:d,onError:l,onBid:f,onCompletion:p}=o;const h=U(n);p=h.startTiming("total").stopBefore(p);const A=T(n);let w=h.measureTime("buildRequests",()=>e.buildRequests(t.map(A.bidRequest),A.bidderRequest(n)));if(Array.isArray(w)||(w=[w]),!w||0===w.length)return void p();const I=(0,g.delayExecution)(p,w.length);w.forEach(t=>{const n=h.fork();function o(e){null!=e&&(e.metrics=n.fork().renameWith()),f(e)}const p=i(function(r,i){w();try{r=JSON.parse(r)}catch(e){}r={body:r,headers:{get:i.getResponseHeader.bind(i)}},a(r);try{r=n.measureTime("interpretResponse",()=>e.interpretResponse(r,t))}catch(t){return(0,g.logError)(`Bidder ${e.code} failed to interpret the server's response. Continuing without bids`,null,t),void I()}let s,c;r&&!Object.keys(r).some(e=>!S.includes(e))?(s=r.bids,c=r.paapi):s=r,(0,u.cy)(c)&&c.forEach(d),s&&((0,u.cy)(s)?s.forEach(o):o(s)),I()}),A=i(function(e,t){w(),l(e,t),I()});s(t);const w=n.startTiming("net"),T="TRUE"===(0,g.getParameterByName)(c.M).toUpperCase()||(0,g.debugTurnedOn)();function C(n){const r=t.options;return Object.assign(n,r,{browsingTopics:!(r?.hasOwnProperty("browsingTopics")&&!r.browsingTopics)&&((m.u.get(e.code,"topicsHeader")??!0)&&(0,b.io)(E.DL,(0,y.s)(v.tW,e.code))),suppressTopicsEnrollmentWarning:r?.hasOwnProperty("suppressTopicsEnrollmentWarning")?r.suppressTopicsEnrollmentWarning:!T})}switch(t.method){case"GET":r(`${t.url}${function(e){if(e)return`?${"object"==typeof e?(0,g.parseQueryStringParameters)(e):e}`;return""}(t.data)}`,{success:p,error:A},void 0,C({method:"GET",withCredentials:!0}));break;case"POST":const n=t.options?.endpointCompression,i=e=>{let{url:t,payload:n}=e;r(t,{success:p,error:A},n,C({method:"POST",contentType:"text/plain",withCredentials:!0}))};n&&T&&(0,g.logWarn)(`Skipping GZIP compression for ${e.code} as debug mode is enabled`),n&&!T&&(0,g.isGzipCompressionSupported)()?(0,g.compressDataWithGZip)(t.data).then(e=>{const n=new URL(t.url);n.searchParams.has("gzip")||n.searchParams.set("gzip","1"),i({url:n.href,payload:e})}):i({url:t.url,payload:"string"==typeof t.data?t.data:JSON.stringify(t.data)});break;default:(0,g.logWarn)(`Skipping invalid request from ${e.code}. Request type ${t.method} must be GET or POST`),I()}})},"processBidderRequests"),B=(0,f.A_)("async",function(e,t,n,o,a){const d=i.$W.getConfig("userSync.aliasSyncEnabled");if(e.getUserSyncs&&(d||!r.Ay.aliasRegistry[e.code])){let r=e.getUserSyncs({iframeEnabled:s.zt.canBidderRegisterSync("iframe",e.code),pixelEnabled:s.zt.canBidderRegisterSync("image",e.code)},t,n,o,a);r&&(Array.isArray(r)||(r=[r]),r.forEach(t=>{s.zt.registerSync(t.type,e.code,t.url)}),s.zt.bidderDone(e.code))}},"registerSyncs"),R=(0,f.A_)("sync",(e,t)=>{},"addPaapiConfig");function U(e){return(0,h.BO)(e.metrics).renameWith(t=>[`adapter.client.${t}`,`adapters.client.${e.bidderCode}.${t}`])}},3958(e,t,n){n.d(t,{Vv:()=>d,Ot:()=>s,Bp:()=>a});var r=n(466);const i=new function e(t,n){const r={};let i={};const o=[];Object.entries(n).forEach(n=>{let[s,a]=n;if(null!=a&&"object"==typeof a){const n=new e(()=>t()?.[s],a);r[s]=n.obj,o.push(n.reset)}else!0===a&&Object.defineProperty(r,s,{get:()=>(i.hasOwnProperty(s)||(i[s]=t()?.[s]),i[s])})}),this.obj=r,this.reset=function(){o.forEach(e=>e()),i={}}}(()=>(0,r.canAccessWindowTop)()?r.internal.getWindowTop():r.internal.getWindowSelf(),{innerHeight:!0,innerWidth:!0,screen:{width:!0,height:!0},visualViewport:{width:!0,height:!0},document:{documentElement:{clientWidth:!0,clientHeight:!0,scrollTop:!0,scrollLeft:!0},body:{scrollTop:!0,scrollLeft:!0,clientWidth:!0,clientHeight:!0}}}),o={winDimensions:i},s=(()=>{let e;return function(){return(!e||Date.now()-e>20)&&(o.winDimensions.reset(),e=Date.now()),o.winDimensions.obj}})();function a(){o.winDimensions.reset()}function d(e){const t=e??((0,r.canAccessWindowTop)()?r.internal.getWindowTop():r.internal.getWindowSelf()),n=t?.screen??r.internal.getWindowSelf()?.screen??window?.screen,i=Number(n?.width),o=Number(n?.height);if(Number.isFinite(i)&&Number.isFinite(o))return o>=i?"portrait":"landscape"}},5049(e,t,n){n.d(t,{R:()=>d});var r=n(5808),i=n(7610),o=n(3202),s=n(466);const a=new WeakMap;function d(e,t,n,d,c,l){if(!(0,o.io)(r.pY,(0,i.s)(t,n)))return;if(!n||!e)return void(0,s.logError)("cannot load external script without url and moduleCode");const u="function"==typeof d||"function"==typeof d?.success||"function"==typeof d?.error;function g(e,t){null==t?"function"==typeof e?e():e.success?.():e.error?.(t)}c||(c=document);const f=h(c,e);if(f)return u&&(f.loaded?g(d,f.error):f.callbacks.push(d)),f.tag;const p=a.get(c)||{},m={error:null,loaded:!1,tag:null,callbacks:[]};return p[e]=m,a.set(c,p),u&&m.callbacks.push(d),(0,s.logWarn)(`module ${n} is loading external JavaScript`),function(t,n,r,i){r||(r=document);var o=r.createElement("script");o.type="text/javascript",o.async=!0;const a=h(r,e);a&&(a.tag=o);function d(e){a.error=e,c()}function c(){o.removeEventListener("error",d),n()}o.addEventListener("error",d),o.readyState?o.onreadystatechange=function(){"loaded"!==o.readyState&&"complete"!==o.readyState||(o.onreadystatechange=null,c())}:o.onload=function(){c()};o.src=t,i&&(0,s.setScriptAttributes)(o,i);return(0,s.insertElement)(o,r),o}(e,function(){m.loaded=!0;try{for(let e=0;e<m.callbacks.length;e++)g(m.callbacks[e],m.error)}catch(e){(0,s.logError)("Error executing callback","adloader.js:loadExternalScript",e)}},c,l);function h(e,t){const n=a.get(e);return n&&n[t]?n[t]:null}}},5144(e,t,n){n.d(t,{HH:()=>c,kj:()=>d,xh:()=>a});var r=n(3064),i=n(466),o=n(3293),s=n(2592);const a=3,d=(0,s.A_)("sync",function(e){return o.G}),c=function(){const e={};return function(t){const n=d(t);return e.hasOwnProperty(n)||(e[n]=new r.U9(e=>{const r=(0,i.createInvisibleIframe)();r.srcdoc=`\n            <script>${n}<\/script>\n            <script>\n              window.parent.postMessage(\n                  { type: 'RENDERER_READY_${t.adId}' },\n                  '*'\n            );<\/script>`;const o=n=>{n.source===r.contentWindow&&n.data?.type===`RENDERER_READY_${t.adId}`&&(window.removeEventListener("message",o),e(r.contentWindow.render))};window.addEventListener("message",o),document.body.appendChild(r)})),e[n]}}()},5291(e,t,n){n.d(t,{Dk:()=>s,Ez:()=>l,Ii:()=>o,OI:()=>u,TQ:()=>m,U3:()=>b,XG:()=>g,ZI:()=>h,Zw:()=>c,bt:()=>f,e3:()=>p,iK:()=>a,q7:()=>d});var r=n(736),i=n(2592);const o="component",s=o+"Type",a=o+"Name",d="adapterCode",c="storageType",l="storageKey",u="write",g="configName",f="syncType",p="syncUrl",m="_config";function h(e){return function(t,n,i){const c={[s]:t,[a]:n,[o]:`${t}.${n}`};return t===r.tW&&(c[d]=e(n)),b(Object.assign(c,i))}}const b=(0,i.A_)("sync",e=>e)},5482(e,t,n){n.d(t,{S9:()=>l,cT:()=>c,lc:()=>u});var r=n(1933),i=n(466);const o="minBidCacheTTL";let s=1,a=null;const d=[];function c(e){return e.ttl-(e.hasOwnProperty("ttlBuffer")?e.ttlBuffer:s)}function l(){return a}function u(e){d.push(e)}r.$W.getConfig("ttlBuffer",e=>{"number"==typeof e.ttlBuffer?s=e.ttlBuffer:(0,i.logError)("Invalid value for ttlBuffer",e.ttlBuffer)}),r.$W.getConfig(o,e=>{const t=a;a=e?.[o],a="number"==typeof a?a:null,t!==a&&d.forEach(e=>e(a))})},5808(e,t,n){n.d(t,{DL:()=>c,Ml:()=>i,Ue:()=>r,VJ:()=>u,hE:()=>l,hq:()=>d,it:()=>p,mo:()=>a,pY:()=>g,uc:()=>s,yg:()=>f,yl:()=>o});const r="accessDevice",i="syncUser",o="enrichEids",s="fetchBids",a="reportAnalytics",d="transmitEids",c="transmitUfpd",l="transmitPreciseGeo",u="transmitTid",g="loadExternalScript",f="accessRequestCredentials",p="acceptBid"},6220(e,t,n){n.d(t,{H6:()=>c,V0:()=>g,Zy:()=>u,vk:()=>f});var r=n(466),i=n(6665),o=n(1933),s=n(2592),a=n(3006),d=n(765);const c="outstream",l=[["mimes",e=>Array.isArray(e)&&e.length>0&&e.every(e=>"string"==typeof e)],["minduration",i.Fq],["maxduration",i.Fq],["startdelay",i.Fq],["maxseq",i.Fq],["poddur",i.Fq],["protocols",i.Uu],["w",i.Fq],["h",i.Fq],["podid",i.O8],["podseq",i.Fq],["rqddurs",i.Uu],["placement",i.Fq],["plcmt",i.Fq],["linearity",i.Fq],["skip",e=>[1,0].includes(e)],["skipmin",i.Fq],["skipafter",i.Fq],["sequence",i.Fq],["slotinpod",i.Fq],["mincpmpersec",i.Et],["battr",i.Uu],["maxextended",i.Fq],["minbitrate",i.Fq],["maxbitrate",i.Fq],["boxingallowed",i.Fq],["playbackmethod",i.Uu],["playbackend",i.Fq],["delivery",i.Uu],["pos",i.Fq],["api",i.Uu],["companiontype",i.Uu],["poddedupe",i.Uu]],u=new Map(l);function g(e){const t=e?.mediaTypes?.video;if(null!=t){null==t.plcmt&&(t.context===c||[2,3,4].includes(t.placement)?t.plcmt=4:t.playbackmethod?.some?.(e=>[2,6].includes(e))&&(t.plcmt=2));const n=(0,i.Uu)(t.playerSize,2)?t.playerSize:Array.isArray(t.playerSize)&&(0,i.Uu)(t.playerSize[0])?t.playerSize[0]:null,o=(0,i.Et)(t.w)&&(0,i.Et)(t.h)?[t.w,t.h]:null;let s=!1;null==n?null!=o&&(null!=t.playerSize?s=!0:t.playerSize=[o]):["w","h"].forEach((e,r)=>{null!=t[e]&&t[e]!==n[r]?s=!0:t[e]=n[r]}),s&&(0,r.logWarn)(`Ad unit "${e.code} has conflicting playerSize and w/h`,e)}}function f(e){let{index:t=a.n.index}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};const n=t.getMediaTypes(e)?.video,r=n&&n?.context,i=n&&n?.useCacheKey,o=t.getAdUnit(e);return p(e,o,n,r,i)}const p=(0,s.A_)("sync",function(e,t,n,i,s){if(n&&(s||i!==c)){const{url:t,useLocal:n}=o.$W.getConfig("cache")||{};return t||n||!e.vastXml||e.vastUrl?!(!e.vastUrl&&!e.vastXml):((0,r.logError)(`\n        This bid contains only vastXml and will not work when a prebid cache url is not specified.\n        Try enabling either prebid cache with ${(0,d.k)()}.setConfig({ cache: {url: "..."} });\n        or local cache with ${(0,d.k)()}.setConfig({ cache: { useLocal: true }});\n      `),!1)}return!(i===c&&!s)||!!(e.renderer||t&&t.renderer||n.renderer)},"checkVideoBidSetup")},6652(e,t,n){n.d(t,{JE:()=>s,o1:()=>o});var r=n(3064);function i(e,t){e()?function(){const e=window.scheduler;return"function"==typeof e?.yield?e.yield():r.U9.resolve()}().then(t):t()}function o(e,t){return function(){for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];i(e,()=>{t.apply(this,r)})}}function s(e,t,n){!function(e,t){let n=0;function r(){e.length>n?(n+=1,e[n-1](r)):"function"==typeof t&&t()}r()}(t.map(t=>n=>{i(e,()=>{t(),n()})}),n)}},6665(e,t,n){n.d(t,{Et:()=>u,Fq:()=>p,Go:()=>i,KG:()=>a,Lm:()=>f,O8:()=>c,Qd:()=>g,SH:()=>o,Uu:()=>m,cy:()=>l,fp:()=>d});var r=n(1490);function i(e){return(0,r.Q)(e)||{}}function o(e,t){return t.filter(t=>e[t]).reduce((t,n)=>Object.assign(t,{[n]:e[n]}),{})}const s=Object.prototype.toString;function a(e,t){return s.call(e)==="[object "+t+"]"}function d(e){return a(e,"Function")}function c(e){return a(e,"String")}const l=Array.isArray.bind(Array);function u(e){return a(e,"Number")}function g(e){return a(e,"Object")}function f(e){return a(e,"Boolean")}const p=Number.isInteger.bind(Number);function m(e,t){return l(e)&&(!t||e.length===t)&&e.every(e=>p(e))}},7156(e,t,n){n.d(t,{u:()=>a});var r=n(466),i=n(8928),o=n(1748),s=n(1418);const a=new class{constructor(e,t){this.getSettings=e,this.defaultScope=t}get(e,t){let n=this.getOwn(e,t);return void 0===n&&(n=this.getOwn(null,t)),n}getOwn(e,t){return e=this.#a(e),(0,i.A)(this.getSettings(),`${e}.${t}`)}getScopes(){return Object.keys(this.getSettings()).filter(e=>e!==this.defaultScope)}settingsFor(e){return(0,r.mergeDeep)({},this.ownSettingsFor(null),this.ownSettingsFor(e))}ownSettingsFor(e){return e=this.#a(e),this.getSettings()[e]||{}}#a(e){return null==e?this.defaultScope:e}}(()=>(0,o.m)().bidderSettings||{},s.iD.BD_SETTING_STANDARD)},7391(e,t,n){n.d(t,{UZ:()=>W,v8:()=>Q,NE:()=>F,HN:()=>ee,mX:()=>G});var r=n(466),i=n(6665),o=n(1124),s=n(356),a=n(2201),d=n(1933),c=n(3006);const l=new Map;function u(e){return e.vastXml?e.vastXml:(t=e.vastUrl,n=e.vastImpUrl,`<VAST version="3.0">\n    <Ad>\n      <Wrapper>\n        <AdSystem>prebid.org wrapper</AdSystem>\n        <VASTAdTagURI><![CDATA[${t}]]></VASTAdTagURI>\n        ${(n=n&&(Array.isArray(n)?n:[n]))?n.map(e=>`<Impression><![CDATA[${e}]]></Impression>`).join(""):""}\n        <Creatives></Creatives>\n      </Wrapper>\n    </Ad>\n  </VAST>`);var t,n}const g=(e,t,n)=>{e.videoCacheKey=n||(0,r.generateUUID)(),e.vastUrl||(e.vastUrl=t)},f={store:function(e,t){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:a.g4;const r={puts:e.map(e=>function(e){let{index:t=c.n.index}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};const n=u(e),r=t.getAuction(e),i={type:"xml",value:n,ttlseconds:Number(e.ttl)+15};return d.$W.getConfig("cache.vasttrack")&&(i.bidder=e.bidder,i.bidid=e.requestId,i.aid=e.auctionId),null!=r&&(i.timestamp=r.getAuctionStart()),"string"==typeof e.customCacheKey&&""!==e.customCacheKey&&(i.key=e.customCacheKey),i}(e))};n(d.$W.getConfig("cache.timeout"))(d.$W.getConfig("cache.url"),function(e){return{success:function(t){let n;try{n=JSON.parse(t).responses}catch(t){return void e(t,[])}n?e(null,n):e(new Error("The cache server didn't respond with a responses property."),[])},error:function(t,n){e(new Error(`Error storing video ad in the cache: ${t}: ${JSON.stringify(n)}`),[])}}}(t),JSON.stringify(r),{contentType:"text/plain",withCredentials:!0})}};function p(e){const t=e.map(e=>e.bidResponse);f.store(t,function(n,i){var o;n?(o=n,(0,r.logError)(`Failed to save to the video cache: ${o}. Video bids will be discarded:`,t)):e.length!==i.length?(0,r.logError)(`expected ${e.length} cache IDs, got ${i.length} instead`):i.forEach((t,n)=>{const{auctionInstance:i,bidResponse:o,afterBidAdded:s}=e[n];var a;""===t.uuid?(0,r.logWarn)("Supplied video cache key was already in use by Prebid Cache; caching attempt was rejected. Video bid must be discarded."):(g(o,(a=t.uuid,`${d.$W.getConfig("cache.url")}?uuid=${a}`),t.uuid),Q(i,o),s())})})}let m,h,b;d.$W.getConfig("cache",e=>{let{cache:t}=e;m="number"==typeof t.batchSize&&t.batchSize>0?t.batchSize:1,h="number"==typeof t.batchTimeout&&t.batchTimeout>0?t.batchTimeout:0,t.useLocal&&!b&&(b=c.n.onExpiry(e=>{e.getBidsReceived().forEach(e=>{const t=l.get(e.videoCacheKey);t&&t.startsWith("blob")&&URL.revokeObjectURL(t),l.delete(e.videoCacheKey)})}))});const y=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:setTimeout,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:p,n=[[]],r=!1;const i=e=>e();return function(o,s,a){const d=h>0?e:i;n[n.length-1].length>=m&&n.push([]),n[n.length-1].push({auctionInstance:o,bidResponse:s,afterBidAdded:a}),r||(r=!0,d(()=>{n.forEach(t),n=[[]],r=!1},h))}}();var v=n(7464),E=n(3391),A=n(2592),w=n(6220),I=n(9794),T=n(7156),C=n(8014),S=n(8668),O=n(1418),B=n(3064),R=n(7841);var U=n(1748),k=n(939),D=n(5482),_=n(3202),$=n(5808),x=n(736);const{syncUsers:q}=E.zt,W="completed";C.on(O.qY.BID_ADJUSTMENT,function(e){!function(e){const t=function(e,t,n){let{index:i=c.n.index,bs:o=T.u}=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{};n=n||i.getBidRequest(t);const s=t?.adapterCode,a=t?.bidderCode||n?.bidder,d=o.get(t?.adapterCode,"adjustAlternateBids"),l=o.getOwn(a,"bidCpmAdjustment")||o.get(d?s:a,"bidCpmAdjustment");if(l&&"function"==typeof l)try{return l(e,Object.assign({},t),n)}catch(e){(0,r.logError)("Error during bid adjustment",e)}return e}(e.cpm,e);t>=0&&(e.cpm=t)}(e)});const j={},N={},P=[],M=(0,U.m)();const F=(0,A.A_)("sync",e=>{});function G(e){let{adUnits:t,adUnitCodes:n,callback:i,cbTimeout:a,labels:f,auctionId:p,ortb2Fragments:m,metrics:h}=e;h=(0,R.BO)(h);const b=t,y=f,E=n,A=p||(0,r.generateUUID)(),T=a,U=new Set,_=(0,B.v6)(),$=(0,B.v6)();let x=[],G=i,X=[];const Z=(0,k.H)({startTime:e=>e.responseTimestamp,ttl:e=>null==(0,D.S9)()?null:1e3*Math.max((0,D.S9)(),e.ttl)});let ee,te,re,ie,oe=[],se=[],ae=[];function de(){return{auctionId:A,timestamp:ee,auctionEnd:te,auctionStatus:ie,adUnits:b,adUnitCodes:E,labels:y,bidderRequests:X,noBids:oe,bidsReceived:Z.toArray(),bidsRejected:x,winningBids:se,timeout:T,metrics:h,seatNonBids:ae}}function ce(e){if(e?C.Ic(O.qY.AUCTION_TIMEOUT,de()):clearTimeout(re),void 0===te){let n=[];e&&((0,r.logMessage)(`Auction ${A} timedOut`),n=X.filter(e=>!U.has(e.bidderRequestId)).flatMap(e=>e.bids),n.length&&C.Ic(O.qY.BID_TIMEOUT,n)),ie=W,te=Date.now(),h.checkpoint("auctionEnd"),h.timeBetween("requestBids","auctionEnd","requestBids.total"),h.timeBetween("callBids","auctionEnd","requestBids.callBids"),_.resolve(),C.Ic(O.qY.AUCTION_END,de()),V(b,p,function(){try{if(null!=G){const t=Z.toArray().filter(e=>E.includes(e.adUnitCode)).reduce(ne,{});G.apply(M,[t,e,A]),G=null}}catch(e){(0,r.logError)("Error executing bidsBackHandler",null,e)}finally{n.length&&S.Ay.callTimedOutBidders(t,n,T);const e=d.$W.getConfig("userSync")??{};e.enableOverride||q(e.syncDelay)}})}}function le(){d.$W.resetBidder(),(0,r.logInfo)(`Bids Received for Auction with id: ${A}`,Z.toArray()),ie=W,ce(!1)}function ue(e){U.add(e)}function ge(e){e.forEach(e=>{var t;t=e,X=X.concat(t)});const t={},n={bidRequests:e,run:()=>{F(this),re=setTimeout(()=>ce(!0),T),ie="inProgress",C.Ic(O.qY.AUCTION_INIT,de());const n=function(e,t){let{index:n=c.n.index}=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},i=0,a=!1;const f=new Set,p={};function m(){i--,a&&0===i&&e()}function h(e,t,n){return p[t.requestId]=!0,function(e,t){let{index:n=c.n.index}=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};const r=n.getAdUnit(e);Y(e,{index:n}),Object.assign(e,{cpm:parseFloat(e.cpm)||0,bidder:e.bidder||e.bidderCode,adUnitCode:t}),null!=r?.ttlBuffer&&(e.ttlBuffer=r.ttlBuffer)}(t,e),i++,n(m)}function b(e,i){h(e,i,e=>{const a=function(e){let{index:t=c.n.index}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};C.Ic(O.qY.BID_ADJUSTMENT,e);const n=t.getAdUnit(e);e.instl=1===n?.ortb2Imp?.instl;const r=t.getBidRequest(e)?.renderer||n.renderer,i=e.mediaType,s=t.getMediaTypes(e),a=s&&s[i];var l=a&&a.renderer,u=null;!l||!l.render||!0===l.backupOnly&&e.renderer?!r||!r.render||!0===r.backupOnly&&e.renderer||(u=r):u=l;u&&(e.renderer=v.A4.install({url:u.url,config:u.options,renderNow:null==u.url}),e.renderer.setRender(u.render));const g=K(e.mediaType,s,d.$W.getConfig("mediaTypePriceGranularity")),f=(0,o.j)(e.cpm,"object"==typeof g?g:d.$W.getConfig("customPriceBucket"),d.$W.getConfig("currency.granularityMultiplier"));return e.pbLg=f.low,e.pbMg=f.med,e.pbHg=f.high,e.pbAg=f.auto,e.pbDg=f.dense,e.pbCg=f.custom,e}(i);C.Ic(O.qY.BID_ACCEPTED,a),a.mediaType===I.G_||a.mediaType===I.FY?function(e,t,n){let{index:i=c.n.index}=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},o=!0;const s=i.getMediaTypes({requestId:t.originalRequestId||t.requestId,adUnitId:t.adUnitId})?.video,a=s&&s?.context,f=s&&s?.useCacheKey,{useLocal:p,url:m,ignoreBidderCacheKey:h}=d.$W.getConfig("cache")||{};p?(e=>{const t=u(e),n=URL.createObjectURL(new Blob([t],{type:"text/xml"}));g(e,n),l.set(e.videoCacheKey,n)})(t):m&&(f||a!==w.H6)&&(!t.videoCacheKey||h?(o=!1,J(e,t,n,s)):t.vastUrl||((0,r.logError)("videoCacheKey specified but not required vastUrl for video bid"),o=!1));o&&(Q(e,t),n())}(t,a,e):((0,s.l6)(a)&&(0,s.gs)(a,n.getAdUnit(a)),Q(t,a),e())})}function y(e,n,i){return h(e,n,e=>{n.rejectionReason=i,(0,r.logWarn)(`Bid from ${n.bidder||"unknown bidder"} was rejected: ${i}`,n),C.Ic(O.qY.BID_REJECTED,n),t.addBidRejected(n),e()})}function E(){const n=this;let o=t.getBidRequests();const s=d.$W.getConfig("auctionOptions");if(f.add(n),s&&!(0,r.isEmpty)(s)){const e=s.secondaryBidders;e&&!o.every(t=>e.includes(t.bidderCode))&&(o=o.filter(t=>!e.includes(t.bidderCode)))}a=o.every(e=>f.has(e)),n.bids.forEach(e=>{p[e.bidId]||(Y(e),t.addNoBid(e),C.Ic(O.qY.NO_BID,e))}),a&&0===i&&e()}return{addBidResponse:function(){function e(e,t){L.call({dispatch:b},e,t,(()=>{let n=!1;return r=>{n||(y(e,t,r),n=!0)}})())}return e.reject=y,e}(),adapterDone:function(){z(B.U9.resolve()).finally(()=>E.call(this))}}}(le,this);S.Ay.callBids(b,e,n.addBidResponse,n.adapterDone,{request(e,n){a(j,n),a(t,e),N[e]||(N[e]={SRA:!0,origin:n}),t[e]>1&&(N[e].SRA=!1)},done(e){j[e]--,P[0]&&i(P[0])&&P.shift()}},T,ue,m),$.resolve()}};function i(e){let t=!0;const n=d.$W.getConfig("maxRequestsPerOrigin")||4;return e.bidRequests.some(e=>{let r=1;const i=void 0!==e.src&&e.src===O.RW.SRC?"s2s":e.bidderCode;return!(e.alwaysHasCapacity&&!d.$W.getConfig("forceMaxRequestsPerOrigin"))&&(N[i]&&(!1===N[i].SRA&&(r=Math.min(e.bids.length,n)),j[N[i].origin]+r>n&&(t=!1)),!t)}),t&&e.run(),t}function a(e,t){void 0===e[t]?e[t]=1:e[t]++}i(n)||((0,r.logWarn)("queueing auction due to limited endpoint capacity"),P.push(n))}return(0,D.lc)(()=>Z.refresh()),C.on(O.qY.SEAT_NON_BID,e=>{var t;e.auctionId===A&&(t=e.seatnonbid,ae=ae.concat(t))}),{addBidReceived:function(e){Z.add(e)},addBidRejected:function(e){x=x.concat(e)},addNoBid:function(e){oe=oe.concat(e)},callBids:function(){ie="started",ee=Date.now();const e=h.measureTime("requestBids.makeRequests",()=>S.Ay.makeBidRequests(b,ee,A,T,y,m,h));(0,r.logInfo)(`Bids Requested for Auction with id: ${A}`,e),h.checkpoint("callBids"),e.length<1?((0,r.logWarn)("No valid bid requests returned for auction"),le()):H.call({dispatch:ge,context:this},e)},addWinningBid:function(e){se=se.concat(e),S.Ay.callBidWonBidder(e.adapterCode||e.bidder,e,t),e.deferBilling||S.Ay.triggerBilling(e)},setBidTargeting:function(e){S.Ay.callSetTargetingBidder(e.adapterCode||e.bidder,e)},getWinningBids:()=>se,getAuctionStart:()=>ee,getAuctionEnd:()=>te,getTimeout:()=>T,getAuctionId:()=>A,getAuctionStatus:()=>ie,getAdUnits:()=>b,getAdUnitCodes:()=>E,getBidRequests:()=>X,getBidsReceived:()=>Z.toArray(),getNoBids:()=>oe,getNonBids:()=>ae,getFPD:()=>m,getMetrics:()=>h,end:_.promise,requestsDone:$.promise,getProperties:de}}const L=(0,A.u2)((0,A.A_)("async",function(e,t,n){!function(e){const t=d.$W.getConfig("maxBid");return!t||!e.cpm||t>=Number(e.cpm)}(t)?n(O.Tf.PRICE_TOO_HIGH):(0,_.io)($.it,(0,S.sc)(x.tW,t.bidder||t.bidderCode,{bid:t,ortb2:c.n.index.getOrtb2(t),adUnit:c.n.index.getAdUnit(t)}))?this.dispatch.call(null,e,t):n(O.Tf.BIDDER_DISALLOWED)},"addBidResponse")),z=(0,A.A_)("sync",e=>e,"responsesReady"),H=(0,A.A_)("sync",function(e){this.dispatch.call(this.context,e)},"addBidderRequests"),V=(0,A.A_)("async",function(e,t,n){n&&n()},"bidsBackCallback");function Q(e,t){!function(e){let t;const n=!0===T.u.get(e.bidderCode,"allowZeroCpmBids")?e.cpm>=0:e.cpm>0;e.bidderCode&&(n||e.dealId)&&(t=function(e,t){let{index:n=c.n.index}=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};if(!t)return{};const r=n.getBidRequest(t);var i={};const o=ee(t.mediaType,e);te(i,o,t,r),e&&T.u.getOwn(e,O.iD.ADSERVER_TARGETING)&&(te(i,T.u.ownSettingsFor(e),t,r),t.sendStandardTargeting=T.u.get(e,"sendStandardTargeting"));return i}(e.bidderCode,e));e.adserverTargeting=Object.assign(e.adserverTargeting||{},t)}(t),(0,R.BO)(t.metrics).timeSince("addBidResponse","addBidResponse.total"),e.addBidReceived(t),C.Ic(O.qY.BID_RESPONSE,t)}const J=(0,A.A_)("async",function(e,t,n,r){y(e,t,n)},"callPrebidCache");function Y(e){let{index:t=c.n.index}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};const n=t.getBidderRequest(e),i=n&&n.start||e.requestTimestamp;Object.assign(e,{responseTimestamp:e.responseTimestamp||(0,r.timestamp)(),requestTimestamp:e.requestTimestamp||i}),e.timeToRespond=e.responseTimestamp-e.requestTimestamp}function K(e,t,n){if(e&&n){if(e===I.G_){const e=t?.[I.G_]?.context??"instream";if(n[`${I.G_}-${e}`])return n[`${I.G_}-${e}`]}return n[e]}}const X=e=>t=>{const n=e||function(e){let{index:t=c.n.index}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};const n=K(e.mediaType,t.getMediaTypes(e),d.$W.getConfig("mediaTypePriceGranularity"));return"string"==typeof e.mediaType&&n?"string"==typeof n?n:"custom":d.$W.getConfig("priceGranularity")}(t);return n===O.UE.AUTO?t.pbAg:n===O.UE.DENSE?t.pbDg:n===O.UE.LOW?t.pbLg:n===O.UE.MEDIUM?t.pbMg:n===O.UE.HIGH?t.pbHg:n===O.UE.CUSTOM?t.pbCg:void 0};function Z(e,t){return{key:e,val:"function"==typeof t?function(e,n){return t(e,n)}:function(e){return e[t]}}}function ee(e,t){const n=Object.assign({},T.u.settingsFor(null));if(n[O.iD.ADSERVER_TARGETING]||(n[O.iD.ADSERVER_TARGETING]=[Z(O.xS.BIDDER,"bidderCode"),Z(O.xS.AD_ID,"adId"),Z(O.xS.PRICE_BUCKET,X()),Z(O.xS.SIZE,"size"),Z(O.xS.DEAL,"dealId"),Z(O.xS.SOURCE,"source"),Z(O.xS.FORMAT,"mediaType"),Z(O.xS.ADOMAIN,e=>e.meta&&e.meta.advertiserDomains&&e.meta.advertiserDomains.length>0?[e.meta.advertiserDomains].flat()[0]:""),Z(O.xS.ACAT,e=>{const t=e?.meta?.primaryCatId;return Array.isArray(t)?t[0]||"":t||""}),Z(O.xS.DSP,e=>e.meta&&(e.meta.networkId||e.meta.networkName)?e?.meta?.networkName||e?.meta?.networkId:""),Z(O.xS.CRID,e=>e.creativeId?e.creativeId:"")]),"video"===e){const e=n[O.iD.ADSERVER_TARGETING].slice();if(n[O.iD.ADSERVER_TARGETING]=e,[O.xS.UUID,O.xS.CACHE_ID].forEach(t=>{void 0===e.find(e=>e.key===t)&&e.push(Z(t,"videoCacheKey"))}),d.$W.getConfig("cache.url")&&(!t||!1!==T.u.get(t,"sendStandardTargeting"))){const t=(0,r.parseUrl)(d.$W.getConfig("cache.url"));void 0===e.find(e=>e.key===O.xS.CACHE_HOST)&&e.push(Z(O.xS.CACHE_HOST,function(e){return e?.adserverTargeting?.[O.xS.CACHE_HOST]||t.hostname}))}}return n}function te(e,t,n,o){var s=t[O.iD.ADSERVER_TARGETING];return n.size=n.getSize(),(s||[]).forEach(function(s){var a=s.key,d=s.val;if(e[a]&&(0,r.logWarn)("The key: "+a+" is being overwritten"),(0,i.fp)(d))try{d=d(n,o)}catch(e){(0,r.logError)("bidmanager","ERROR",e)}(void 0===t.suppressEmptyKeys||!0!==t.suppressEmptyKeys)&&a!==O.xS.DEAL&&a!==O.xS.ACAT&&a!==O.xS.DSP&&a!==O.xS.CRID||!(0,r.isEmptyStr)(d)&&null!=d?e[a]=d:(0,r.logInfo)("suppressing empty key '"+a+"' from adserver targeting")}),e}function ne(e,t){return e[t.adUnitCode]||(e[t.adUnitCode]={bids:[]}),e[t.adUnitCode].bids.push(t),e}},7464(e,t,n){n.d(t,{A4:()=>d,J7:()=>c,Pg:()=>l});var r=n(5049),i=n(466),o=n(1748),s=n(736);const a=(0,o.m)();function d(e){const{url:t,config:n,id:o,callback:d,loaded:c,adUnitCode:l,renderNow:u}=e;this.url=t,this.config=n,this.handlers={},this.id=o,this.renderNow=u,this.adUnitCode=l,this.loaded=c,this.cmd=[],this.push=e=>{"function"==typeof e?this.loaded?e.call():this.cmd.push(e):(0,i.logError)("Commands given to Renderer.push must be wrapped in a function")},this.callback=d||(()=>{this.loaded=!0,this.process()}),this.render=function(){const e=arguments,n=()=>{this._render?this._render.apply(this,e):(0,i.logWarn)("No render function was provided, please use .setRender on the renderer")};!function(e){const t=a.adUnits.find(t=>t.code===e);if(!t)return!1;const n=t?.renderer,r=!!(n&&n.url&&n.render),i=t?.mediaTypes?.video?.renderer,o=!!(i&&i.url&&i.render);return!!(r&&!0!==n.backupOnly||o&&!0!==i.backupOnly)}(l)?u?n():(this.cmd.unshift(n),(0,r.R)(t,s.tp,"outstream",this.callback,this.documentContext)):((0,i.logWarn)(`External Js not loaded by Renderer since renderer url and callback is already defined on adUnit ${l}`),n())}.bind(this)}function c(e){return!(!e||!e.url&&!e.renderNow)}function l(e,t,n){let r=null;e.config&&e.config.documentResolver&&(r=e.config.documentResolver(t,document,n)),r||(r=document),e.documentContext=r,e.render(t,e.documentContext)}d.install=function(e){let{url:t,config:n,id:r,callback:i,loaded:o,adUnitCode:s,renderNow:a}=e;return new d({url:t,config:n,id:r,callback:i,loaded:o,adUnitCode:s,renderNow:a})},d.prototype.getConfig=function(){return this.config},d.prototype.setRender=function(e){this._render=e},d.prototype.setEventHandlers=function(e){this.handlers=e},d.prototype.handleVideoEvent=function(e){let{id:t,eventName:n}=e;"function"==typeof this.handlers[n]&&this.handlers[n](),(0,i.logMessage)(`Prebid Renderer event for id ${t} type ${n}`)},d.prototype.process=function(){for(;this.cmd.length>0;)try{this.cmd.shift().call()}catch(e){(0,i.logError)(`Error processing Renderer command on ad unit '${this.adUnitCode}':`,e)}}},7610(e,t,n){n.d(t,{s:()=>i});var r=n(8668);const i=(0,n(5291).ZI)(e=>r.Ay.resolveAlias(e))},7776(e,t,n){n.d(t,{WH:()=>ge,xu:()=>me,gH:()=>Ae});var r=n(1748),i=n(466),o=n(6665),s=n(8928),a=n(3435),d=n(356),c=n(1418),l=n(1852),u=n(5144),g=n(3064);const{REQUEST:f,RESPONSE:p,NATIVE:m,EVENT:h}=c.nl,b={[f]:function(e,t,n){(0,l.bw)({renderFn(t){e(Object.assign({message:p,renderer:(0,u.kj)(n),rendererVersion:u.xh},t))},resizeFn:v(t.adId,n),options:t.options,adId:t.adId,bidResponse:n})},[h]:function(e,t,n){if(null==n)return void(0,i.logError)(`Cannot find ad '${t.adId}' for x-origin event request`);if(n.status!==c.tl.RENDERED)return void(0,i.logWarn)(`Received x-origin event request without corresponding render request for ad '${n.adId}'`);return(0,l.Uc)(t,n)}};function y(){window.addEventListener("message",function(e){!function(e,t){var n=e.message?"message":"data",r={};try{r=JSON.parse(e[n])}catch(e){return}if(r&&r.adId&&r.message&&b.hasOwnProperty(r.message))(0,l.$A)(r.adId,r.message===c.nl.REQUEST,n=>{var o,s;b[r.message]((o=r.adId,s=function(e){return null==e.origin&&0===e.ports.length?function(){const e="Cannot post message to a frame with null origin. Please update creatives to use MessageChannel, see https://github.com/prebid/Prebid.js/issues/7870";throw(0,i.logError)(e),new Error(e)}:e.ports.length>0?function(t){e.ports[0].postMessage(JSON.stringify(t))}:function(t){e.source.postMessage(JSON.stringify(t),e.origin)}}(e),function(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];return s(Object.assign({},e,{adId:o}),...n)}),r,n),t&&t()})}(e)},!1)}function v(e,t){return function(n,r){!function(e){let{instl:t,adId:n,adUnitCode:r,width:o,height:s}=e;if(t)return;function a(e){if(e){const t=e.style;t.width=E(o),t.height=E(s)}else(0,i.logError)(`Unable to locate matching page element for adUnitCode ${r}.  Can't resize it to ad's dimensions.  Please review setup.`)}const d=l('iframe:not([style*="display: none"])');a(d);const c=d?.closest("ins[data-anchor-status]");function l(e){const t=u(n,r),i=document.getElementById(t);return i&&i.querySelector(e)}function u(e,t){if((0,i.isGptPubadsDefined)()){const t=f(e);if(t)return t}if((0,i.isApnGetTagDefined)()){const e=p(t);if(e)return e}return t}function f(e){const t=window.googletag.pubads().getSlots().find(t=>t.getTargetingKeys().find(n=>t.getTargeting(n).includes(e)));return t?t.getSlotElementId():null}function p(e){const t=window.apntag.getTag(e);return t&&t.targetId}c?function(e,t,n){new g.U9((r,i)=>{let o=10;const s=setInterval(()=>{let a=!1;Object.entries({width:t,height:n}).forEach(t=>{let[n,r]=t;/\d+px/.test(e.style[n])&&(e.style[n]=E(r),a=!0)}),(a||0===o--)&&(clearInterval(s),a?r():i(new Error("Could not resize anchor")))},50)})}(c,o,s):a(d?.parentElement)}({...t,width:n,height:r,adId:e})}}function E(e){return e?e+"px":"100%"}Object.assign(b,{[m]:function(e,t,n){if(null==n)return void(0,i.logError)(`Cannot find ad for x-origin event request: '${t.adId}'`);switch(t.action){case"assetRequest":(0,l.Hh)(n,()=>e((0,d.IX)(t,n)));break;case"allAssetRequest":(0,l.Hh)(n,()=>e((0,d.yl)(t,n)));break;default:(0,l.vW)(t,n,{resizeFn:v(t.adId,n)}),(0,l.Pk)(n)}}});var A=n(3391),w=n(1933),I=n(3006),T=n(869),C=n(2592),S=n(3320),O=n(5049),B=n(736),R=n(9794),U=n(7464),k=n(765);const D=`__${(0,k.k)()}_debugging__`;function _(){return(0,r.m)().installedModules.includes("debugging")}function $(e){return new g.U9((t,n)=>{(0,O.R)(e,B.tp,"debugging",{success:t,error:n})})}function x(){let{alreadyInstalled:e=_,script:t=$}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=null;return function(){return null==n&&(n=new g.U9((n,o)=>{setTimeout(()=>{if(e())n();else{const e=`${(0,k.rT)()}debugging-standalone.js`;(0,i.logMessage)(`Debugging module not installed, loading it from "${e}"...`),(0,r.m)()._installDebugging=!0,t(e).then(()=>{(0,r.m)()._installDebugging({DEBUG_KEY:D,hook:C.A_,config:w.$W,createBid:S.O,logger:(0,i.prefixLog)("DEBUG:"),utils:i,BANNER:R.D4,NATIVE:R.s6,VIDEO:R.G_,Renderer:U.A4})}).then(n,o)}})})),n}}const q=function(){let{load:e=x(),hook:t=(0,C.Yn)("requestBids")}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=null,r=!1;function o(e){for(var t=arguments.length,r=new Array(t>1?t-1:0),o=1;o<t;o++)r[o-1]=arguments[o];return(n||g.U9.resolve()).catch(e=>{(0,i.logError)("Could not load debugging module",e)}).then(()=>e.apply(this,r))}function s(){t.getHooks({hook:o}).remove(),r=!1}return{enable:function(){r||(n=e(),t.before(o,99),r=!0)},disable:s,reset:function(){n=null,s()}}}();q.reset;w.$W.getConfig("debugging",function(e){let{debugging:t}=e;t?.enabled?q.enable():q.disable()});var W=n(1443),j=n(8668),N=n(8014),P=n(7841),M=n(8034),F=n(1385),G=n(9236),L=n(6220);const z=[["format",e=>Array.isArray(e)&&e.length>0&&e.every(e=>"object"==typeof e)],["w",o.Fq],["h",o.Fq],["btype",o.Uu],["battr",o.Uu],["pos",o.Fq],["mimes",e=>Array.isArray(e)&&e.length>0&&e.every(e=>"string"==typeof e)],["topframe",e=>[1,0].includes(e)],["expdir",o.Uu],["api",o.Uu],["id",o.O8],["vcm",e=>[1,0].includes(e)]],H=new Map(z);function V(e,t){var n=this;return function(){for(var r=arguments.length,o=new Array(r),s=0;s<r;s++)o[s]=arguments[s];return document.prerendering&&e()?new Promise(e=>{document.addEventListener("prerenderingchange",()=>{(0,i.logInfo)("Auctions were suspended while page was prerendering"),e(t.apply(n,o))},{once:!0})}):Promise.resolve(t.apply(n,o))}}var Q=n(3556),J=n(69),Y=n(8417),K=n(6652);const X=(0,r.m)(),{triggerUserSyncs:Z}=A.zt,{ADD_AD_UNITS:ee,REQUEST_BIDS:te,SET_TARGETING:ne}=c.qY;function re(e,t){let n=[];return(0,o.cy)(e)&&(t?e.length===t:e.length>0)&&(e.every(e=>(0,o.Uu)(e,2))?n=e:(0,o.Uu)(e,2)&&n.push(e)),n}function ie(e,t){const n=(0,s.A)(e,`ortb2Imp.${t}`),r=(0,s.A)(e,`mediaTypes.${t}`);if(!n&&!r)return;const o={[R.G_]:L.Zy,[R.D4]:H}[t];o&&[...o].forEach(n=>{let[r,o]=n;const d=(0,s.A)(e,`mediaTypes.${t}.${r}`),c=(0,s.A)(e,`ortb2Imp.${t}.${r}`);void 0===d&&void 0===c||(void 0===d?(0,a.J)(e,`mediaTypes.${t}.${r}`,c):void 0===c?(0,a.J)(e,`ortb2Imp.${t}.${r}`,d):(0,i.deepEqual)(d,c)||((0,i.logWarn)(`adUnit ${e.code}: specifies conflicting ortb2Imp.${t}.${r} and mediaTypes.${t}.${r}, the latter will be ignored`,e),(0,a.J)(e,`mediaTypes.${t}.${r}`,c)))})}function oe(e){const t=(0,o.Go)(e),n=t.mediaTypes.banner,r=null==n.sizes?null:re(n.sizes),s=e.ortb2Imp?.banner?.format??n?.format;let d;if(null!=s){(0,a.J)(t,"ortb2Imp.banner.format",s),n.format=s;try{d=s.filter(t=>{let{w:n,h:r,wratio:o,hratio:s}=t;return null!=(n??r)&&null!=(o??s)?((0,i.logWarn)("Ad unit banner.format specifies both w/h and wratio/hratio",e),!1):null!=n&&null!=r||null!=o&&null!=s}).map(e=>{let{w:t,h:n,wratio:r,hratio:i}=e;return[t??r,n??i]})}catch(t){(0,i.logError)(`Invalid format definition on ad unit ${e.code}`,s)}null==d||null==r||(0,i.deepEqual)(r,d)||(0,i.logWarn)(`Ad unit ${e.code} has conflicting sizes and format definitions`,e)}const c=d??r??[],l=e.ortb2Imp?.banner?.expdir??n.expdir;return null!=l&&(n.expdir=l,(0,a.J)(t,"ortb2Imp.banner.expdir",l)),c.length>0?(n.sizes=c,t.sizes=c):((0,i.logError)("Detected a mediaTypes.banner object without a proper sizes field.  Please ensure the sizes are listed like: [[300, 250], ...].  Removing invalid mediaTypes.banner object from request."),delete t.mediaTypes.banner),de(t,"banner"),ie(t,"banner"),t}function se(e){const t=(0,o.Go)(e);return de(t,"audio"),ie(t,"audio"),t}function ae(e){const t=(0,o.Go)(e),n=t.mediaTypes.video;if(n.playerSize){const e="number"==typeof n.playerSize[0]?2:1,r=re(n.playerSize,e);r.length>0?(2===e&&(0,i.logInfo)("Transforming video.playerSize from [640,480] to [[640,480]] so it's in the proper format."),n.playerSize=r,t.sizes=r):((0,i.logError)("Detected incorrect configuration of mediaTypes.video.playerSize.  Please specify only one set of dimensions in a format like: [[640, 480]]. Removing invalid mediaTypes.video.playerSize property from request."),delete t.mediaTypes.video.playerSize)}return de(t,"video"),ie(t,"video"),t}function de(e,t,n){const r=(e?.mediaTypes||{})[t],s={banner:H,audio:Y.Ai,video:L.Zy}[t];(0,o.Qd)(r)?null!=r&&Object.entries(r).forEach(o=>{let[a,d]=o;if(!s.has(a))return;s.get(a)(d)||("function"==typeof n?n(a,d,e):(delete r[a],(0,i.logWarn)(`Invalid prop in adUnit "${e.code}": Invalid value for mediaTypes.${t}.${a} ORTB property. The property has been removed.`)))}):(0,i.logWarn)(`validateOrtb${t}Fields: ${t}Params must be an object.`)}function ce(e){function t(t){return(0,i.logError)(`Error in adUnit "${e.code}": ${t}. Removing native request from ad unit`,e),delete r.mediaTypes.native,r}function n(e){const list = ["types"];for(const t of list)if(s.hasOwnProperty(t)){const n=e(t);if(n)return n}}const r=(0,o.Go)(e),s=r.mediaTypes.native;if(s.ortb){if(s.ortb.assets?.some(e=>!(0,o.Et)(e.id)||e.id<0||e.id%1!=0))return t("native asset ID must be a nonnegative integer");if(n(e=>t(`ORTB native requests cannot specify "${e}"`)))return r;const e=Object.keys(c.x5).filter(e=>c.x5[e].includes("hb_native_")),a=Object.keys(s).filter(t=>e.includes(t));a.length>0&&((0,i.logError)(`when using native OpenRTB format, you cannot use legacy native properties. Deleting ${a} keys from request.`),a.forEach(e=>delete r.mediaTypes.native[e]))}else n(t=>(0,i.logWarn)(`mediaTypes.native.${t} is deprecated, consider using native ORTB instead`,e));return s.image&&s.image.sizes&&!Array.isArray(s.image.sizes)&&((0,i.logError)("Please use an array of sizes for native.image.sizes field.  Removing invalid mediaTypes.native.image.sizes property from request."),delete r.mediaTypes.native.image.sizes),s.image&&s.image.aspect_ratios&&!Array.isArray(s.image.aspect_ratios)&&((0,i.logError)("Please use an array of sizes for native.image.aspect_ratios field.  Removing invalid mediaTypes.native.image.aspect_ratios property from request."),delete r.mediaTypes.native.image.aspect_ratios),s.icon&&s.icon.sizes&&!Array.isArray(s.icon.sizes)&&((0,i.logError)("Please use an array of sizes for native.icon.sizes field.  Removing invalid mediaTypes.native.icon.sizes property from request."),delete r.mediaTypes.native.icon.sizes),r}function le(e,t){const n=e?.mediaTypes?.[t]?.pos;if(!(0,o.Et)(n)||isNaN(n)||!isFinite(n)){const n=`Value of property 'pos' on ad unit ${e.code} should be of type: Number`;(0,i.logWarn)(n),delete e.mediaTypes[t].pos}return e}function ue(e){const t=e=>`adUnit.code '${n.code}' ${e}`,n=e,r=n.mediaTypes,s=n.bids;return null==s||(0,o.cy)(s)?null==s&&null==n.ortb2Imp?((0,i.logError)(t("has no 'adUnit.bids' and no 'adUnit.ortb2Imp'. Removing adUnit from auction")),null):r&&0!==Object.keys(r).length?(null==n.ortb2Imp||null!=s&&0!==s.length||(n.bids=[{bidder:null}],(0,i.logMessage)(t("defines 'adUnit.ortb2Imp' with no 'adUnit.bids'; it will be seen only by S2S adapters"))),n):((0,i.logError)(t("does not define a 'mediaTypes' object.  This is a required field for the auction, so this adUnit has been removed.")),null):((0,i.logError)(t("defines 'adUnit.bids' that is not an array. Removing adUnit from auction")),null)}!function(){let e=null;try{e=window.sessionStorage}catch(e){}if(null!==e){const t=q;let n=null;try{n=e.getItem(D)}catch(e){}null!==n&&t.enable()}}(),X.bidderSettings=X.bidderSettings||{},X.libLoaded=!0,X.version="v10.29.0",(0,i.logInfo)("Prebid.js v10.29.0 loaded"),X.adUnits=X.adUnits||[],X.pageViewIdPerBidder=X.pageViewIdPerBidder||new Map;const ge={validateAdUnit:ue,validateBannerMediaType:oe,validateSizes:re};Object.assign(ge,{validateNativeMediaType:ce}),Object.assign(ge,{validateVideoMediaType:ae}),Object.assign(ge,{validateAudioMediaType:se});const fe=(0,C.A_)("sync",function(e){const t=[];return e.forEach(e=>{const n=ue(e);if(null==n)return;const r=n.mediaTypes;let i,o,s,a;r.banner&&(i=oe(n),r.banner.hasOwnProperty("pos")&&(i=le(i,"banner"))),r.video&&(o=ae(i||n),r.video.hasOwnProperty("pos")&&(o=le(o,"video"))),r.native&&(s=ce(o||(i||n))),r.audio&&(a=se(s||n));const d=Object.assign({},i,o,s,a);t.push(d)}),t},"checkAdUnitSetup");function pe(e,t){return function(){for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(0,i.logInfo)(`Invoking ${(0,k.k)()}.${e}`,r),t.apply(this,r)}}function me(e,t){let n=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];(0,r.m)()[e]=n?pe(e,t):t}function he(e){return be(e)[e]}function be(e){return T.iS.getAllTargeting(e)}function ye(e){return(e=e.slice()).bids=e,e}function ve(e){const t=I.n[e]().filter(e=>I.n.getAdUnitCodes().includes(e.adUnitCode)),n=I.n.getLastAuctionId();return t.map(e=>e.adUnitCode).filter(i.uniques).map(e=>t.filter(t=>t.auctionId===n&&t.adUnitCode===e)).filter(e=>e&&e[0]&&e[0].adUnitCode).map(e=>({[e[0].adUnitCode]:ye(e)})).reduce((e,t)=>Object.assign(e,t),{})}me("triggerUserSyncs",Z),me("getAdserverTargetingForAdUnitCodeStr",function(e){if(e){const t=he(e);return(0,i.transformAdServerTargetingObj)(t)}(0,i.logMessage)("Need to call getAdserverTargetingForAdUnitCodeStr with adunitCode")}),me("getHighestUnusedBidResponseForAdUnitCode",function(e){if(e){const t=I.n.getAllBidsForAdUnitCode(e).filter(T.Yl);return t.length?t.reduce(G.Vk):null}(0,i.logMessage)("Need to call getHighestUnusedBidResponseForAdUnitCode with adunitCode")}),me("getAdserverTargetingForAdUnitCode",he),me("getAdserverTargeting",be),me("getConsentMetadata",function(){return F.SL.getConsentMeta()}),me("getNoBids",function(){return ve("getNoBids")}),me("getNoBidsForAdUnitCode",function(e){return ye(I.n.getNoBids().filter(t=>t.adUnitCode===e))}),me("getBidResponses",function(){return ve("getBidsReceived")}),me("getBidResponsesForAdUnitCode",function(e){return ye(I.n.getBidsReceived().filter(t=>t.adUnitCode===e))}),me("setTargetingForGPTAsync",function(e,t){(0,i.isGptPubadsDefined)()?T.iS.setTargetingForGPT(e,t):(0,i.logError)("window.googletag is not defined on the page")}),me("setTargetingForAst",function(e){T.iS.isApntagDefined()?(T.iS.setTargetingForAst(e),N.Ic(ne,T.iS.getAllTargeting())):(0,i.logError)("window.apntag is not defined on the page")}),me("renderAd",function(e,t,n){(0,l.BS)(e,t,n)}),me("removeAdUnit",function(e){if(!e)return void(X.adUnits=[]);let t;t=(0,o.cy)(e)?e:[e],t.forEach(e=>{for(let t=X.adUnits.length-1;t>=0;t--)X.adUnits[t].code===e&&X.adUnits.splice(t,1)})});const Ee=function(){function e(e,t){return null==t||Array.isArray(t)||(t=[t]),null==t||Array.isArray(t)&&0===t.length?{included:e,excluded:[],adUnitCodes:e.map(e=>e.code).filter(i.uniques)}:(t=t.filter(i.uniques),Object.assign({adUnitCodes:t},e.reduce((e,n)=>{let{included:r,excluded:i}=e;return(t.includes(n.code)?r:i).push(n),{included:r,excluded:i}},{included:[],excluded:[]})))}const t=(0,C.A_)("async",function(t){let{bidsBackHandler:n,timeout:r,adUnits:s,adUnitCodes:a,labels:d,auctionId:c,ttlBuffer:l,ortb2:u,metrics:f,defer:p}=t??{};const m=r||w.$W.getConfig("bidderTimeout");({included:s,adUnitCodes:a}=e(s,a));let h={global:(0,i.mergeDeep)({},w.$W.getAnyConfig("ortb2")||{},u||{}),bidder:Object.fromEntries(Object.entries(w.$W.getBidderConfig()).map(e=>{let[t,n]=e;return[t,(0,o.Go)(n.ortb2)]}).filter(e=>{let[t,n]=e;return null!=n}))};h=(0,J.mZ)(h),(0,M.wU)(g.U9.resolve(h.global)).then(e=>(h.global=e,Ae({bidsBackHandler:n,timeout:m,adUnits:s,adUnitCodes:a,labels:d,auctionId:c,ttlBuffer:l,ortb2Fragments:h,metrics:f,defer:p})))},"requestBids");return(0,C.Y6)(t,pe("requestBids",V(()=>!w.$W.getConfig("allowPrerendering"),function(){let n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const r=n.adUnits||X.adUnits;n.adUnits=Array.isArray(r)?r.slice():[r];const i=(0,P.K7)();i.checkpoint("requestBids");const{included:o,excluded:s,adUnitCodes:a}=e(r,n.adUnitCodes);N.Ic(te,Object.assign(n,{adUnits:o,adUnitCodes:a}));const d=Object.assign({},n,{adUnits:n.adUnits.slice().concat(s),adUnitCodes:a,metrics:i,defer:(0,g.v6)({promiseFactory:e=>new Promise(e)})});return t.call(this,d),d.defer.promise})))}();me("requestBids",Ee,!1);const Ae=(0,C.A_)("async",function(){let{bidsBackHandler:e,timeout:t,adUnits:n,ttlBuffer:r,adUnitCodes:o,labels:s,auctionId:a,ortb2Fragments:d,metrics:c,defer:l}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const u=(0,j.pX)(w.$W.getConfig("s2sConfig")||[]);!function(e){e.forEach(e=>(0,L.V0)(e)),e.forEach(e=>(0,Y.kl)(e))}(n);const g=(0,P.BO)(c).measureTime("requestBids.validate",()=>fe(n));function f(t,n,r){if("function"==typeof e)try{e(t,n,r)}catch(e){(0,i.logError)("Error executing bidsBackHandler",null,e)}l.resolve({bids:t,timedOut:n,auctionId:r})}const p={};if(g.forEach(e=>{const t=Object.keys(e.mediaTypes||{banner:"banner"}),n=e.bids.map(e=>e.bidder).filter(Boolean),o=j.Ay.bidderRegistry,s=n.filter(e=>!u.has(e));e.adUnitId=(0,i.generateUUID)();const a=e.ortb2Imp?.ext?.tid;a&&(p.hasOwnProperty(e.code)?(0,i.logWarn)(`Multiple distinct ortb2Imp.ext.tid were provided for twin ad units '${e.code}'`):p[e.code]=a),null==r||e.hasOwnProperty("ttlBuffer")||(e.ttlBuffer=r),s.forEach(n=>{const r=o[n],s=r&&r.getSpec&&r.getSpec(),a=s&&s.supportedMediaTypes||["banner"];t.some(e=>a.includes(e))||((0,i.logWarn)((0,i.unsupportedBidderMessage)(e,n)),e.bids=e.bids.filter(e=>e.bidder!==n))})}),g&&0!==g.length){g.forEach(e=>{const t=e.ortb2Imp?.ext?.tid||p[e.code]||(0,i.generateUUID)();p.hasOwnProperty(e.code)||(p[e.code]=t),e.transactionId=t});const e=I.n.createAuction({adUnits:g,adUnitCodes:o,callback:f,cbTimeout:t,labels:s,auctionId:a,ortb2Fragments:d,metrics:c}),n=g.length;n>15&&(0,i.logInfo)(`Current auction ${e.getAuctionId()} contains ${n} adUnits.`,g),o.forEach(t=>T.iS.setLatestAuctionForAdUnit(t,e.getAuctionId())),e.callBids()}else(0,i.logMessage)("No adUnits configured. No bids requested."),f()},"startAuction");Ee.before(function(e,t){function n(e){let t;for(;t=e.shift();)t()}n(W.s0),n(Te),e.call(this,t)},49),me("addAdUnits",function(e){X.adUnits.push(...Array.isArray(e)?e:[e]),N.Ic(ee)});const we={bidWon(e){if(I.n.getBidsRequested().map(e=>e.bids.map(e=>e.adUnitCode)).reduce(i.flatten).filter(i.uniques).includes(e))return!0;(0,i.logError)('The "'+e+'" placement is not defined.')}};function Ie(e,t){return we.hasOwnProperty(e)&&we[e](t)}me("onEvent",function(e,t,n){(0,o.fp)(t)?!n||Ie(e,n)?N.on(e,t,n):(0,i.logError)('The id provided is not valid for event "'+e+'" and no handler was set.'):(0,i.logError)('The event handler provided is not a function and was not set on event "'+e+'".')}),me("offEvent",function(e,t,n){n&&!Ie(e,n)||N.AU(e,t,n)}),me("getEvents",function(){return N.kQ()}),me("registerBidAdapter",function(e,t,n){try{const r=n?(0,Q.xb)(n):e();j.Ay.registerBidAdapter(r,t)}catch(e){(0,i.logError)("Error registering bidder adapter : "+e.message)}}),me("registerAnalyticsAdapter",function(e){try{j.Ay.registerAnalyticsAdapter(e)}catch(e){(0,i.logError)("Error registering analytics adapter : "+e.message)}});const Te=[],Ce=(0,C.A_)("async",function(e){e&&!(0,i.isEmpty)(e)?j.Ay.enableAnalytics(e):(0,i.logError)(`${(0,k.k)()}.enableAnalytics should be called with option {}`)},"enableAnalyticsCb");let Se;function Oe(e){Se.promise.then(()=>{if("function"==typeof e)try{e.call()}catch(e){(0,i.logError)("Error processing command :",e.message,e.stack)}else(0,i.logError)(`Commands written into ${(0,k.k)()}.cmd.push must be wrapped in a function`)})}function Be(e,t){(0,K.JE)(()=>(0,r.m)().yield??!0,e.map(e=>()=>function(e){if(void 0===e.called)try{e.call(),e.called=!0}catch(e){(0,i.logError)("Error processing command :","prebid.js",e)}}(e)),t)}me("enableAnalytics",function(e){Te.push(Ce.bind(this,e))}),me("aliasBidder",function(e,t,n){e&&t?j.Ay.aliasBidAdapter(e,t,n):(0,i.logError)("bidderCode and alias must be passed as arguments",`${(0,k.k)()}.aliasBidder`)}),X.aliasRegistry=j.Ay.aliasRegistry,w.$W.getConfig("aliasRegistry",e=>{"private"===e.aliasRegistry&&delete X.aliasRegistry}),me("getAllWinningBids",function(){return I.n.getAllWinningBids()}),me("getAllPrebidWinningBids",function(){return(0,i.logWarn)("getAllPrebidWinningBids may be removed or renamed in a future version. This function returns bids that have won in prebid and have had targeting set but have not (yet?) won in the ad server. It excludes bids that have been rendered."),I.n.getBidsReceived().filter(e=>e.status===c.tl.BID_TARGETING_SET)}),me("getHighestCpmBids",function(e){return T.iS.getWinningBids(e)}),me("clearAllAuctions",function(){I.n.clearAllAuctions()}),me("markWinningBidAsUsed",function(e){let t,{adId:n,adUnitCode:r,analytics:o=!1,events:s=!1}=e;r&&null==n?t=T.iS.getWinningBids(r):n?t=I.n.getBidsReceived().filter(e=>e.adId===n):(0,i.logWarn)("Improper use of markWinningBidAsUsed. It needs an adUnitCode or an adId to function."),t.length>0&&(o||s?(0,l.n6)(t[0]):I.n.addWinningBid(t[0]),(0,l.qn)(t[0]))}),me("getConfig",w.$W.getAnyConfig),me("readConfig",w.$W.readAnyConfig),me("mergeConfig",w.$W.mergeConfig),me("mergeBidderConfig",w.$W.mergeBidderConfig),me("setConfig",w.$W.setConfig),me("setBidderConfig",w.$W.setBidderConfig),X.que.push(()=>y()),Se=(0,g.v6)();me("processQueue",V(()=>X.delayPrerendering,async function(){X.que.push=X.cmd.push=Oe,(0,l.XO)(),C.A_.ready(),Be(X.que,()=>{Be(X.cmd,()=>{Se.resolve()})})}),!1),me("triggerBilling",function(e){let{adId:t,adUnitCode:n}=e;I.n.getAllWinningBids().filter(e=>e.adId===t||null==t&&e.adUnitCode===n).forEach(e=>{j.Ay.triggerBilling(e),(0,l.vB)(e)})}),me("refreshPageViewId",function(){for(const e of X.pageViewIdPerBidder.keys())X.pageViewIdPerBidder.set(e,(0,i.generateUUID)())})},7841(e,t,n){n.d(t,{Ak:()=>h,BO:()=>f,K7:()=>p});var r=n(1933);const i="performanceMetrics",o=window.performance&&window.performance.now?()=>window.performance.now():()=>Date.now(),s=new WeakMap;function a(e,t,n){return function(){t&&t();try{for(var r=arguments.length,i=new Array(r),o=0;o<r;o++)i[o]=arguments[o];return e.apply(this,i)}finally{n&&n()}}}function d(){let{now:e=o,mkNode:t=l,mkTimer:n=c,mkRenamer:r=e=>e,nodes:i=s}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return function(){return function o(s){let a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:e=>({forEach(t){t(e)}});a=r(a);const d=(c="timestamps",function(e){return s.dfWalk({visit(t,n){const r=n[c];if(r.hasOwnProperty(e))return r[e]}})});var c;function l(e,t){const n=a(e);s.dfWalk({follow:(e,t)=>t.propagate&&(!e||!e.stopPropagation),visit(e,r){n.forEach(n=>{null==e?r.metrics[n]=t:(r.groups.hasOwnProperty(n)||(r.groups[n]=[]),r.groups[n].push(t))})}})}function u(t){return n(e,e=>l(t,e))}function g(){let e={};return s.dfWalk({visit(t,n){e=Object.assign({},!t||t.includeGroups?n.groups:null,n.metrics,e)}}),e}const f={startTiming:u,measureTime:function(e,t){return u(e).stopAfter(t)()},measureHookTime:function(e,t,n){const r=u(e);return n(function(e){const t=r.stopBefore(e);return t.bail=e.bail&&r.stopBefore(e.bail),t.stopTiming=r,t.untimed=e,t}(t))},checkpoint:function(t){s.timestamps[t]=e()},timeSince:function(t,n){const r=d(t),i=null!=r?e()-r:null;return null!=n&&l(n,i),i},timeBetween:function(e,t,n){const r=d(e),i=d(t),o=null!=r&&null!=i?i-r:null;return null!=n&&l(n,o),o},setMetric:l,getMetrics:g,fork:function(){let{propagate:e=!0,stopPropagation:n=!1,includeGroups:r=!1}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return o(t([[s,{propagate:e,stopPropagation:n,includeGroups:r}]]),a)},join:function(e){let{propagate:t=!0,stopPropagation:n=!1,includeGroups:r=!1}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};const o=i.get(e);null!=o&&o.addParent(s,{propagate:t,stopPropagation:n,includeGroups:r})},newMetrics:function(){return o(s.newSibling(),a)},renameWith:function(e){return o(s,e)},toJSON:()=>g()};return i.set(f,s),f}(t([]))}}function c(e,t){const n=e();let r=!1;function i(){r||(t(e()-n),r=!0)}return i.stopBefore=e=>a(e,i),i.stopAfter=e=>a(e,null,i),i}function l(e){return{metrics:{},timestamps:{},groups:{},addParent(t,n){e.push([t,n])},newSibling:()=>l(e.slice()),dfWalk(){let t,{visit:n,follow:r=()=>!0,visited:i=new Set,inEdge:o}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};if(!i.has(this)){if(i.add(this),t=n(o,this),null!=t)return t;for(const[s,a]of e)if(r(o,a)&&(t=s.dfWalk({visit:n,follow:r,visited:i,inEdge:a}),null!=t))return t}}}}const u=(()=>{const e=function(){},t=()=>({}),n={forEach:e},r=()=>null;r.stopBefore=e=>e,r.stopAfter=e=>e;const i=Object.defineProperties({dfWalk:e,newSibling:()=>i,addParent:e},Object.fromEntries(["metrics","timestamps","groups"].map(e=>[e,{get:t}])));return d({now:()=>0,mkNode:()=>i,mkRenamer:()=>()=>n,mkTimer:()=>r,nodes:{get:e,set:e}})()})();let g=!0;function f(e){return g&&e||u}r.$W.getConfig(i,e=>{g=!!e[i]});const p=(()=>{const e=d();return function(){return g?e():u}})();function m(e,t){return function(n,r){var i=this;return function(o){for(var s=arguments.length,a=new Array(s>1?s-1:0),d=1;d<s;d++)a[d-1]=arguments[d];return f(t.apply(i,a)).measureHookTime(e+n,o,e=>r.call(i,e,...a))}}}const h=m("requestBids.",e=>e.metrics);m("addBidResponse.",(e,t)=>t.metrics)},8014(e,t,n){n.d(t,{AU:()=>p,Ic:()=>b,kQ:()=>h,on:()=>f});var r=n(466),i=n(1418),o=n(939),s=n(1933);const a="eventHistoryTTL";let d=null;const c=(0,o.H)({monotonic:!0,ttl:()=>d});s.$W.getConfig(a,e=>{const t=d,n=e?.[a];d="number"==typeof n?1e3*n:null,t!==d&&c.refresh()});let l=Object.values(i.qY);const u=i.cA,g=function(){const e={};function t(e){return l.includes(e)}return{has:t,on:function(n,i,o){if(t(n)){const t=e[n]||{que:[]};o?(t[o]=t[o]||{que:[]},t[o].que.push(i)):t.que.push(i),e[n]=t}else r.logError("Wrong event name : "+n+" Valid event names :"+l)},emit:function(t){for(var n=arguments.length,i=new Array(n>1?n-1:0),o=1;o<n;o++)i[o-1]=arguments[o];!function(t,n){r.logMessage("Emitting event for: "+t);const i=n[0]||{},o=i[u[t]],s=e[t]||{que:[]};var a=Object.keys(s);const d=[];c.add({eventType:t,args:i,id:o,elapsedTime:r.getPerformanceNow()}),o&&a.includes(o)&&d.push(...s[o].que),d.push(...s.que),(d||[]).forEach(function(e){if(e)try{e(...n)}catch(e){r.logError("Error executing handler:","events.js",e,t)}})}(t,i)},off:function(t,n,i){const o=e[t];r.isEmpty(o)||r.isEmpty(o.que)&&r.isEmpty(o[i])||i&&(r.isEmpty(o[i])||r.isEmpty(o[i].que))||(i?(o[i].que||[]).forEach(function(e){const t=o[i].que;e===n&&t.splice(t.indexOf(e),1)}):(o.que||[]).forEach(function(e){const t=o.que;e===n&&t.splice(t.indexOf(e),1)}),e[t]=o)},get:function(){return e},addEvents:function(e){l=l.concat(e)},getEvents:function(){return c.toArray().map(e=>Object.assign({},e))}}}();r._setEventEmitter(g.emit.bind(g));const{on:f,off:p,get:m,getEvents:h,emit:b,addEvents:y,has:v}=g},8034(e,t,n){n.d(t,{wU:()=>O});var r=n(2592),i=n(867),o=n(1780),s=n(466),a=n(3435),d=n(8928),c=n(6665),l=n(3958),u=n(3367),g=n(1933),f=n(3064);const p=["architecture","bitness","model","platformVersion","fullVersionList"],m=["brands","mobile","platform"],h=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:window.navigator?.userAgentData;const t=e&&m.some(t=>void 0!==e[t])?Object.freeze(y(1,e)):null;return function(){return t}}(),b=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:window.navigator?.userAgentData;const t={},n=new WeakMap;return function(){let r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:p;if(!n.has(r)){const e=Array.from(r);e.sort(),n.set(r,e.join("|"))}const i=n.get(r);if(!t.hasOwnProperty(i))try{t[i]=e.getHighEntropyValues(r).then(e=>(0,s.isEmpty)(e)?null:Object.freeze(y(2,e))).catch(()=>null)}catch(e){t[i]=f.U9.resolve(null)}return t[i]}}();function y(e,t){function n(e,t){const n={brand:e};return(0,c.O8)(t)&&!(0,s.isEmptyStr)(t)&&(n.version=t.split(".")),n}const r={source:e};return t.platform&&(r.platform=n(t.platform,t.platformVersion)),(t.fullVersionList||t.brands)&&(r.browsers=(t.fullVersionList||t.brands).map(e=>{let{brand:t,version:r}=e;return n(t,r)})),void 0!==t.mobile&&(r.mobile=t.mobile?1:0),["model","bitness","architecture"].forEach(e=>{const n=t[e];(0,c.O8)(n)&&(r[e]=n)}),r}var v=n(1833),E=n(3202),A=n(7610),w=n(5808),I=n(736),T=n(183);const C={getRefererInfo:i.EN,findRootDomain:o.S,getWindowTop:s.getWindowTop,getWindowSelf:s.getWindowSelf,getHighEntropySUA:b,getLowEntropySUA:h,getDocument:s.getDocument},S=(0,v.i8)("FPD"),O=(0,r.A_)("sync",e=>{const t=[e,R().catch(()=>null),f.U9.resolve("cookieDeprecationLabel"in navigator&&(0,E.io)(w.Ue,(0,A.s)(I.tp,"cdep"))&&navigator.cookieDeprecationLabel.getValue()).catch(()=>null)];return f.U9.all(t).then(e=>{let[t,n,r]=e;const i=C.getRefererInfo();if(Object.entries(k).forEach(e=>{let[n,r]=e;const o=r(t,i);o&&Object.keys(o).length>0&&(t[n]=(0,s.mergeDeep)({},o,t[n]))}),n&&(0,a.J)(t,"device.sua",Object.assign({},n,t.device.sua)),r){const e={cdep:r};(0,a.J)(t,"device.ext",Object.assign({},e,t.device.ext))}const o=C.getDocument().documentElement.lang;if(o&&((0,a.J)(t,"site.ext.data.documentLang",o),!(0,d.A)(t,"site.content.language"))){const e=o.split("-")[0];(0,a.J)(t,"site.content.language",e)}t=S(t);for(const e of v.Dy)if((0,v.O$)(t,e)){t[e]=(0,s.mergeDeep)({},$(t,i),t[e]);break}return t})});function B(e){try{return e(C.getWindowTop())}catch(t){return e(C.getWindowSelf())}}function R(){const e=g.$W.getConfig("firstPartyData.uaHints");return Array.isArray(e)&&0!==e.length?C.getHighEntropySUA(e):f.U9.resolve(C.getLowEntropySUA())}function U(e){return(0,c.SH)(e,Object.keys(e))}const k={site(e,t){if(!v.Dy.filter(e=>"site"!==e).some(v.O$.bind(null,e)))return U({page:t.page,ref:t.ref})},device:()=>B(e=>{const t=(0,l.Ot)().screen.width,n=(0,l.Ot)().screen.height,{width:r,height:i}=(0,T.M)();return{w:t,h:n,dnt:(0,u.l)()?1:0,ua:e.navigator.userAgent,language:e.navigator.language.split("-").shift(),ext:{vpw:r,vph:i}}}),regs(){const e={};B(e=>e.navigator.globalPrivacyControl)&&(0,a.J)(e,"ext.gpc","1");const t=g.$W.getConfig("coppa");return"boolean"==typeof t&&(e.coppa=t?1:0),e}},D=(0,s.memoize)(()=>B(e=>{const t=e.document,n=Array.from(t.querySelectorAll('script[type="application/ld+json"]'));let r=[];for(const e of n)try{const t=JSON.parse(e.textContent),n=Array.isArray(t)?t:[t];for(const e of n)if("string"==typeof e.keywords){const t=e.keywords.split(",").map(e=>e.trim()).filter(e=>e.length>0);r.push(...t)}}catch(e){}return r})),_=(0,s.memoize)(()=>B(e=>e.document.querySelector('meta[name="keywords"]')?.content?.split(",").map(e=>e.trim())));function $(e,t){const n=(0,i.gR)(t.page,{noLeadingWww:!0}),r=new Set;return(g.$W.getConfig("firstPartyData.keywords.meta")??1)&&(_()??[]).forEach(e=>r.add(e)),(g.$W.getConfig("firstPartyData.keywords.json")??1)&&(D()??[]).forEach(e=>r.add(e)),U({domain:n,keywords:r.size>0?Array.from(r.keys()).join(","):void 0,publisher:U({domain:C.findRootDomain(n)})})}},8417(e,t,n){n.d(t,{Ai:()=>l,kl:()=>u});var r=n(466),i=n(6665),o=n(1933),s=n(2592),a=n(765);const d="outstream",c=[["mimes",e=>Array.isArray(e)&&e.length>0&&e.every(e=>"string"==typeof e)],["minduration",i.Fq],["maxduration",i.Fq],["startdelay",i.Fq],["maxseq",i.Fq],["poddur",i.Fq],["protocols",i.Uu],["battr",i.Uu],["maxextended",i.Fq],["minbitrate",i.Fq],["maxbitrate",i.Fq],["delivery",i.Uu],["api",i.Uu],["companiontype",i.Uu],["feed",i.Fq],["stitched",i.Fq],["nvol",i.Fq]],l=new Map(c);function u(e){}(0,s.A_)("sync",function(e,t,n,i,s){if(n&&(s||i!==d)){const{url:t,useLocal:n}=o.$W.getConfig("cache")||{};return t||n||!e.vastXml||e.vastUrl?!(!e.vastUrl&&!e.vastXml):((0,r.logError)(`\n        This bid contains only vastXml and will not work when a prebid cache url is not specified.\n        Try enabling either prebid cache with ${(0,a.k)()}.setConfig({ cache: {url: "..."} });\n        or local cache with ${(0,a.k)()}.setConfig({ cache: { useLocal: true }});\n      `),!1)}return!(i===d&&!s)||!!(e.renderer||t&&t.renderer||n.renderer)},"checkAudioBidSetup")},8668(e,t,n){n.d(t,{sc:()=>te,Ay:()=>fe,pX:()=>ae});var r=n(6665),i=n(466),o=n(356),s=n(3556),a=n(2201),d=n(1933),c=n(2592);const l="requests",u="wins",g="auctions";let f={};function p(e,t){const n=f[e]=f[e]||{bidders:{}};return t?(n.bidders[t]=n.bidders[t]||{},n.bidders[t]):n}function m(e,t){return function(n,r){const i=p(n,t&&r);return i[e]=(i[e]??0)+1,i[e]}}function h(e,t){return function(n,r){return p(n,t&&r)[e]??0}}const b=m(l,!1),y=m(l,!0),v=m(u,!0),E=m(g,!1),A=h(l,!1),w=h(l,!0),I=h(u,!0),T=h(g,!1);var C=n(867),S=n(1385),O=n(8014),B=n(1418),R=n(7841),U=n(3006),k=n(736),D=n(3202),_=n(5808),$=n(5291),x=n(8928);const q=["data","ext.data","yob","gender","keywords","kwarray","id","buyeruid","customdata"].map(e=>`user.${e}`).concat("device.ext.cdep"),W=["user.eids","user.ext.eids"],j=["user.geo.lat","user.geo.lon","device.geo.lat","device.geo.lon"],N=["device.ip"],P=["device.ipv6"];function M(e){return Object.assign({get(){},run(e,t,n,r,i){const o=n&&n[r];if(function(e){return null!=e&&("object"!=typeof e||Object.keys(e).length>0)}(o)&&i()){const e=this.get(o);void 0===e?delete n[r]:n[r]=e}}},e)}function F(e){return e.forEach(e=>{e.paths=e.paths.map(e=>{const t=e.split("."),n=t.pop();return[t.length>0?t.join("."):null,n]})}),function(t,n){const r=[];for(var i=arguments.length,o=new Array(i>2?i-2:0),s=2;s<i;s++)o[s-2]=arguments[s];const a=function(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];return function(t){return e.hasOwnProperty(t.name)||(e[t.name]=!!t.applies(...n)),e[t.name]}}(t,...o);return e.forEach(e=>{if(!1!==t[e.name])for(const[i,o]of e.paths){const s=null==i?n:(0,x.A)(n,i);if(r.push(e.run(n,i,s,o,a.bind(null,e))),!1===t[e.name])return}}),r.filter(e=>null!=e)}}function G(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:D.io;return function(n){return!t(e,n)}}function L(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:D.io;return[{name:_.DL,paths:q,applies:G(_.DL,e)},{name:_.hq,paths:W,applies:G(_.hq,e)},{name:_.hE,paths:j,applies:G(_.hE,e),get:e=>Math.round(100*(e+Number.EPSILON))/100},{name:_.hE,paths:N,applies:G(_.hE,e),get:e=>function(e){if(!e)return null;const t=e.split(".").map(Number);if(4!==t.length)return null;const n=[];for(let e=0;e<4;e++){const t=Math.max(0,Math.min(8,24-8*e));n.push(255<<8-t&255)}return t.map((e,t)=>e&n[t]).join(".")}(e)},{name:_.hE,paths:P,applies:G(_.hE,e),get:e=>function(e){if(!e)return null;let t=e.split(":").map(e=>parseInt(e,16));for(t=t.map(e=>isNaN(e)?0:e);t.length<8;)t.push(0);if(8!==t.length)return null;const n=[];for(let e=0;e<8;e++){const t=Math.max(0,Math.min(16,64-16*e));n.push(65535<<16-t&65535)}return t.map((e,t)=>e&n[t]).map(e=>e.toString(16)).join(":")}(e)},{name:_.VJ,paths:["source.tid","source.ext.tidSource"],applies:G(_.VJ,e)}].map(M)}const z=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:D.io;const t=F(L(e)),n=F(function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:D.io;return[{name:_.hq,paths:["userId","userIdAsEids"],applies:G(_.hq,e)},{name:_.VJ,paths:["ortb2Imp.ext.tid","ortb2Imp.ext.tidSource"],applies:G(_.VJ,e)}].map(M)}(e));return function(e){const r={};return{ortb2:n=>(t(r,n,e),n),bidRequest:t=>(n(r,t,e),t)}}}();(0,D.qB)(_.VJ,"enableTIDs config",()=>{if(!d.$W.getConfig("enableTIDs"))return{allow:!1,reason:"TIDs are disabled"}});var H=n(2122),V=n(1748);const Q="pbsBidAdapter",J={CLIENT:"client",SERVER:"server"},Y={isAllowed:D.io,redact:z},K={},X={},Z={};let ee=[];d.$W.getConfig("s2sConfig",e=>{e&&e.s2sConfig&&(ee=(0,r.cy)(e.s2sConfig)?e.s2sConfig:[e.s2sConfig])});const te=(0,$.ZI)(e=>ce.resolveAlias(e));function ne(e){return e.configName??e.name}const re=["nativeParams","nativeOrtbRequest","renderer"];function ie(e){let{bidderCode:t,auctionId:n,bidderRequestId:o,adUnits:s,src:a,metrics:d,getTid:c}=e;return s.reduce((e,s)=>{const l=s.bids.filter(e=>e.bidder===t);return null==t&&0===l.length&&null!=s.s2sBid&&l.push({bidder:null}),e.push(l.reduce((e,l)=>{const[u,g]=c(l.bidder,s.transactionId,l.ortb2Imp?.ext?.tid??s.ortb2Imp?.ext?.tid),f=null==(l=Object.assign({},l,{ortb2Imp:(0,i.mergeDeep)({},s.ortb2Imp,l.ortb2Imp,{ext:{tid:u,tidSource:g}})},(0,r.SH)(s,re))).mediaTypes?s.mediaTypes:l.mediaTypes;return(0,i.isValidMediaTypes)(f)?l=Object.assign({},l,{mediaTypes:f}):(0,i.logError)(`mediaTypes is not correctly configured for adunit ${s.code}`),"client"===a&&y(s.code,t),e.push(Object.assign({},l,{adUnitCode:s.code,transactionId:s.transactionId,adUnitId:s.adUnitId,sizes:f?.banner?.sizes||f?.video?.playerSize||[],bidId:l.bid_id||(0,i.generateUUID)(),bidderRequestId:o,auctionId:n,src:a,metrics:d,auctionsCount:T(s.code),bidRequestsCount:A(s.code),bidderRequestsCount:w(s.code,l.bidder),bidderWinsCount:I(s.code,l.bidder),deferBilling:!!s.deferBilling})),e},[])),e},[]).reduce(i.flatten,[]).filter(e=>""!==e)}const oe=(0,c.A_)("sync",function(e,t){let{getS2SBidders:n=ae}=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};if(null==t)return e;{const r=n(t);return e.filter(e=>{if(!r.has(e.bidder))return!1;if(null==e.s2sConfigName)return!0;const n=ne(t);return(Array.isArray(e.s2sConfigName)?e.s2sConfigName:[e.s2sConfigName]).includes(n)})}},"filterBidsForAdUnit");const se=(0,c.A_)("sync",(e,t)=>e,"setupAdUnitMediaTypes");function ae(e){(0,r.cy)(e)||(e=[e]);const t=new Set([null]);return e.filter(e=>e&&e.enabled).flatMap(e=>e.bidders).forEach(e=>t.add(e)),t}const de=(0,c.A_)("sync",function(e,t){let{getS2SBidders:n=ae}=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};const r=n(t);return(0,i.getBidderCodes)(e).reduce((e,t)=>(e[r.has(t)?J.SERVER:J.CLIENT].push(t),e),{[J.CLIENT]:[],[J.SERVER]:[]})},"partitionBidders");const ce={bidderRegistry:K,analyticsRegistry:Z,aliasRegistry:X,makeBidRequests:(0,c.A_)("sync",function(e,t,n,s,a){let c=arguments.length>5&&void 0!==arguments[5]?arguments[5]:{},l=arguments.length>6?arguments[6]:void 0;l=(0,R.BO)(l),O.Ic(B.qY.BEFORE_REQUEST_BIDS,e),(0,o.nk)(e),e.map(e=>e.code).filter(i.uniques).forEach(E);const u=c.global||{},g=c.bidder||{},f=function(){let e,t;return d.$W.getConfig("consistentTIDs")?(e="pbjsStable",t=e=>e):(e="pbjs",t=(()=>{const e={};return(t,n)=>(e.hasOwnProperty(n)||(e[n]={}),e[n].hasOwnProperty(t)||(e[n][t]=`u${(0,i.generateUUID)()}`),e[n][t])})()),function(n,r,i){return[i??t(r,n),null!=i?"pub":e]}}(),p=(()=>{const e={};return function(t,n,r){const o=((e,t)=>{const n=null!=t?t[$.XG]:"";return n?`${e}:${n}`:`${e}:`})(n,r),s=Y.redact(null!=r?r:te(k.tW,n));if(void 0!==e[o])return[e[o],s];const[a,d]=f(n,t,g[n]?.source?.tid??u.source?.tid),c=Object.freeze(s.ortb2((0,i.mergeDeep)({},u,g[n],{source:{tid:a,ext:{tidSource:d}}})));return e[o]=c,[c,s]}})();let{[J.CLIENT]:m,[J.SERVER]:h}=de(e,ee);const y=new Set;e.forEach(e=>{(0,r.Qd)(e.mediaTypes)||(e.mediaTypes={}),e.bids=e.bids.filter(t=>{if(!t.bidder)return!0;const[r]=p(n,t.bidder),i=h.includes(t.bidder)&&!m.includes(t.bidder);return Y.isAllowed(_.uc,te(k.tW,t.bidder,{bid:t,ortb2:r,adUnit:e,auctionId:n,isS2S:i}))}),e.bids.forEach(e=>{y.add(e.bidder)}),b(e.code)}),m=m.filter(e=>y.has(e)),h=h.filter(e=>y.has(e)),e=se(e,a),d.$W.getConfig("bidderSequence")===d.Ov&&(m=(0,i.shuffle)(m));const v=(0,C.EN)(),A=[];function w(e,t){const[n,r]=p(e.auctionId,e.bidderCode,t);return e.ortb2=n,e.bids=e.bids.map(e=>(e.ortb2=n,r.bidRequest(e))),e}const I=(0,V.m)();function T(e){return I.pageViewIdPerBidder.has(e)||I.pageViewIdPerBidder.set(e,(0,i.generateUUID)()),I.pageViewIdPerBidder.get(e)}ee.forEach(o=>{const s=function(e){return te(k.tp,Q,{[$.XG]:ne(e)})}(o);if(o&&o.enabled&&Y.isAllowed(_.uc,s)){const{adUnits:a,hasModuleBids:d}=function(e,t){let n=(0,r.Go)(e),o=!1;return n.forEach(e=>{const n=e.bids.filter(e=>e.module===Q&&e.params?.configName===ne(t));1===n.length?(e.s2sBid=n[0],o=!0,e.ortb2Imp=(0,i.mergeDeep)({},e.s2sBid.ortb2Imp,e.ortb2Imp)):n.length>1&&(0,i.logWarn)('Multiple "module" bids for the same s2s configuration; all will be ignored',n),e.bids=oe(e.bids,t).map(e=>(e.bid_id=(0,i.getUniqueIdentifierStr)(),e))}),n=n.filter(e=>!(t.filterBidderlessCalls&&1===e.bids.length&&null==e.bids[0].bidder||0===e.bids.length&&null==e.s2sBid)),{adUnits:n,hasModuleBids:o}}(e,o),c=(0,i.generateUUID)();(0===h.length&&d?[null]:h).forEach(e=>{const d=(0,i.generateUUID)(),u=T(e),g=l.fork(),p=w({bidderCode:e,auctionId:n,bidderRequestId:d,pageViewId:u,uniquePbsTid:c,bids:ie({bidderCode:e,auctionId:n,bidderRequestId:d,adUnits:(0,r.Go)(a),src:B.RW.SRC,metrics:g,getTid:f}),auctionStart:t,timeout:o.timeout,src:B.RW.SRC,refererInfo:v,metrics:g,alwaysHasCapacity:o.alwaysHasCapacity},s);0!==p.bids.length&&A.push(p)}),a.forEach(e=>{const t=e.bids.filter(e=>A.find(t=>t.bids.find(t=>t.bidId===e.bid_id)));e.bids=t}),A.forEach(e=>{void 0===e.adUnitsS2SCopy&&(e.adUnitsS2SCopy=a.filter(e=>e.bids.length>0||null!=e.s2sBid))})}});const U=function(e){let t=(0,r.Go)(e);return t.forEach(e=>{e.bids=oe(e.bids,null)}),t=t.filter(e=>0!==e.bids.length),t}(e);return m.forEach(e=>{const o=(0,i.generateUUID)(),a=T(e),d=l.fork(),c=K[e],u=w({bidderCode:e,auctionId:n,pageViewId:a,bidderRequestId:o,bids:ie({bidderCode:e,auctionId:n,bidderRequestId:o,adUnits:(0,r.Go)(U),src:"client",metrics:d,getTid:f}),auctionStart:t,timeout:s,refererInfo:v,metrics:d,src:"client",alwaysHasCapacity:c?.getSpec?.().alwaysHasCapacity});c||(0,i.logError)(`Trying to make a request for bidder that does not exist: ${e}`),c&&u.bids&&0!==u.bids.length&&A.push(u)}),A.forEach(e=>{S.mW.getConsentData()&&(e.gdprConsent=S.mW.getConsentData()),S.t6.getConsentData()&&(e.uspConsent=S.t6.getConsentData()),S.ad.getConsentData()&&(e.gppConsent=S.ad.getConsentData())}),A},"makeBidRequests"),callBids(e,t,n,r,o,s,c){let l=arguments.length>7&&void 0!==arguments[7]?arguments[7]:{};if(!t.length)return void(0,i.logWarn)("callBids executed with no bidRequests.  Were they filtered by labels or sizing?");const[u,g]=t.reduce((e,t)=>(e[Number(void 0!==t.src&&t.src===B.RW.SRC)].push(t),e),[[],[]]);var f=[];g.forEach(e=>{for(var t=-1,n=0;n<f.length;++n)if(e.uniquePbsTid===f[n].uniquePbsTid){t=n;break}t<=-1&&f.push(e)});let p=0;ee.forEach(e=>{if(e&&f[p]&&ae(e).has(f[p].bidderCode)){const t=(0,a.g4)(s,o?{request:o.request.bind(null,"s2s"),done:o.done}:void 0),d=e.bidders,u=K[e.adapter],m=f[p].uniquePbsTid,h=f[p].adUnitsS2SCopy,b=g.filter(e=>e.uniquePbsTid===m);if(u){const o={ad_units:h,s2sConfig:e,ortb2Fragments:l,requestBidsTimeout:s};if(o.ad_units.length){const e=b.map(e=>(e.start=(0,i.timestamp)(),function(t){t||c(e.bidderRequestId);for(var n=arguments.length,i=new Array(n>1?n-1:0),o=1;o<n;o++)i[o-1]=arguments[o];r.apply(e,[t,...i])})),s=(0,i.getBidderCodes)(o.ad_units).filter(e=>d.includes(e));(0,i.logMessage)(`CALLING S2S HEADER BIDDERS ==== ${s.length>0?s.join(", "):'No bidder specified, using "ortb2Imp" definition(s) only'}`),b.forEach(e=>{O.Ic(B.qY.BID_REQUESTED,{...e,tid:e.auctionId})}),u.callBids(o,g,n,t=>e.forEach(e=>e(t)),t)}}else(0,i.logError)("missing "+e.adapter);p++}}),u.forEach(e=>{e.start=(0,i.timestamp)();const t=K[e.bidderCode];d.$W.runWithBidder(e.bidderCode,()=>{(0,i.logMessage)("CALLING BIDDER"),O.Ic(B.qY.BID_REQUESTED,e)});const l=(0,a.g4)(s,o?{request:o.request.bind(null,e.bidderCode),done:o.done}:void 0),u=r.bind(e);try{d.$W.runWithBidder(e.bidderCode,t.callBids.bind(t,e,n,u,l,()=>c(e.bidderRequestId),d.$W.callbackWithBidder(e.bidderCode)))}catch(t){(0,i.logError)(`${e.bidderCode} Bid Adapter emitted an uncaught error when parsing their bidRequest`,{e:t,bidRequest:e}),u()}})},videoAdapters:[],registerBidAdapter(e,t){let{supportedMediaTypes:n=[]}=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};e&&t?"function"==typeof e.callBids?(K[t]=e,S.o2.register(k.tW,t,e.getSpec?.().gvlid),n.includes("video")&&ce.videoAdapters.push(t),n.includes("native")&&o.mT.push(t)):(0,i.logError)("Bidder adaptor error for bidder code: "+t+"bidder must implement a callBids() function"):(0,i.logError)("bidAdapter or bidderCode not specified")},aliasBidAdapter(e,t,n){if(void 0===K[t]){const r=K[e];if(void 0===r){const n=[];ee.forEach(r=>{if(r.bidders&&r.bidders.length){const i=r&&r.bidders;r&&i.includes(t)?X[t]=e:n.push(e)}}),n.forEach(e=>{(0,i.logError)('bidderCode "'+e+'" is not an existing bidder.',"adapterManager.aliasBidAdapter")})}else try{let a;const d=function(e){const t=[];ce.videoAdapters.includes(e)&&t.push("video");o.mT.includes(e)&&t.push("native");return t}(e);if(r.constructor.prototype!==Object.prototype)a=new r.constructor,a.setBidderCode(t);else{const{useBaseGvlid:o=!1}=n||{},d=r.getSpec(),c=o?d.gvlid:n?.gvlid;null==c&&null!=d.gvlid&&(0,i.logWarn)(`Alias '${t}' will NOT re-use the GVL ID of the original adapter ('${d.code}', gvlid: ${d.gvlid}). Functionality that requires TCF consent may not work as expected.`);const l=n&&n.skipPbsAliasing;a=(0,s.xb)(Object.assign({},d,{code:t,gvlid:c,skipPbsAliasing:l})),X[t]=e}ce.registerBidAdapter(a,t,{supportedMediaTypes:d})}catch(t){(0,i.logError)(e+" bidder does not currently support aliasing.","adapterManager.aliasBidAdapter")}}else(0,i.logMessage)('alias name "'+t+'" has been already specified.')},resolveAlias(e){let t,n=e;for(;X[n]&&(!t||!t.has(n));)n=X[n],(t=t||new Set).add(n);return n},registerAnalyticsAdapter(e){let{adapter:t,code:n,gvlid:r}=e;t&&n?"function"==typeof t.enableAnalytics?(t.code=n,Z[n]={adapter:t,gvlid:r},S.o2.register(k.Tn,n,r)):(0,i.logError)(`Prebid Error: Analytics adaptor error for analytics "${n}"\n        analytics adapter must implement an enableAnalytics() function`):(0,i.logError)("Prebid Error: analyticsAdapter or analyticsCode not specified")},enableAnalytics(e){(0,r.cy)(e)||(e=[e]),e.forEach(e=>{const t=Z[e.provider];t&&t.adapter?Y.isAllowed(_.mo,te(k.Tn,e.provider,{[$.TQ]:e}))&&t.adapter.enableAnalytics(e):(0,i.logError)(`Prebid Error: no analytics adapter found in registry for '${e.provider}'.`)})},getBidAdapter:e=>K[e],getAnalyticsAdapter:e=>Z[e],callTimedOutBidders(e,t,n){t=t.map(t=>(t.params=(0,i.getUserConfiguredParams)(e,t.adUnitCode,t.bidder),t.timeout=n,t)),t=(0,i.groupBy)(t,"bidder"),Object.keys(t).forEach(e=>{ge(e,"onTimeout",t[e])})},callBidWonBidder(e,t,n){t.params=(0,i.getUserConfiguredParams)(n,t.adUnitCode,t.bidder),v(t.adUnitCode,t.bidder),ge(e,"onBidWon",t)},triggerBilling:(()=>{const e=new WeakSet;return t=>{e.has(t)||(e.add(t),((0,H.$T)(t.eventtrackers)[H.OA]?.[H.Ni]||[]).forEach(e=>i.internal.triggerPixel(e)),ge(t.bidder,"onBidBillable",t))}})(),callSetTargetingBidder(e,t){ge(e,"onSetTargeting",t)},callBidViewableBidder(e,t){ge(e,"onBidViewable",t)},callBidderError(e,t,n){ge(e,"onBidderError",{error:t,bidderRequest:n})},callAdRenderSucceededBidder(e,t){ge(e,"onAdRenderSucceeded",t)},callOnInterventionBidder(e,t,n){ge(e,"onIntervention",{bid:t,intervention:n})},callDataDeletionRequest:(0,c.A_)("sync",function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];const r="onDataDeletionRequest";Object.keys(K).filter(e=>!X.hasOwnProperty(e)).forEach(e=>{const n=le(e,r);if(null!=n){const i=U.n.getBidsRequested().filter(t=>function(e){const t=new Set;for(;X.hasOwnProperty(e)&&!t.has(e);)t.add(e),e=X[e];return e}(t.bidderCode)===e);ue(e,r,...n,i,...t)}}),Object.entries(Z).forEach(e=>{let[n,o]=e;const s=o?.adapter?.[r];if("function"==typeof s)try{s.apply(o.adapter,t)}catch(e){(0,i.logError)(`error calling ${r} of ${n}`,e)}})})};function le(e,t){const n=K[e],r=n?.getSpec&&n.getSpec();if(r&&r[t]&&"function"==typeof r[t])return[r,r[t]]}function ue(e,t,n,r){try{(0,i.logInfo)(`Invoking ${e}.${t}`);for(var o=arguments.length,s=new Array(o>4?o-4:0),a=4;a<o;a++)s[a-4]=arguments[a];d.$W.runWithBidder(e,r.bind(n,...s))}catch(n){(0,i.logWarn)(`Error calling ${t} of ${e}`)}}function ge(e,t,n){if(n?.source!==B.RW.SRC){const r=le(e,t);null!=r&&ue(e,t,...r,n)}}const fe=ce},9236(e,t,n){function r(e,t){return e===t?0:e<t?-1:1}function i(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:e=>e;return(t,n)=>r(e(t),e(n))}function o(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:r;return(t,n)=>-e(t,n)||0}function s(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return function(e,n){for(const r of t){const t=r(e,n);if(0!==t)return t}return 0}}function a(){return function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:r;return(t,n)=>e(n,t)<0?n:t}(o(arguments.length>0&&void 0!==arguments[0]?arguments[0]:r))}n.d(t,{Bq:()=>u,Vk:()=>l});const d=i(e=>e.cpm),c=i(e=>e.responseTimestamp),l=a(s(d,o(i(e=>e.timeToRespond)))),u=a(s(d,o(c)));a(s(d,c))},9794(e,t,n){n.d(t,{D4:()=>o,FY:()=>a,G_:()=>i,LM:()=>s,s6:()=>r});const r="native",i="video",o="banner",s="adpod",a="audio"}}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[7769],{183(t,e,n){n.d(e,{M:()=>h,g:()=>c});var i=n(466),o=n(3958);function c(){try{const t=(0,i.getWindowTop)(),{scrollY:e,scrollX:n}=t,{height:o,width:c}=h();return{top:e,right:n+c,bottom:e+o,left:n}}catch(t){return{}}}function h(){const t=(0,o.Ot)();try{const e=t.innerHeight||t.document.documentElement.clientHeight||t.document.body.clientHeight||0;return{width:t.innerWidth||t.document.documentElement.clientWidth||t.document.body.clientWidth||0,height:e}}catch(t){return{}}}}}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[315],{3367(o,t,r){function n(o){return"1"===o.navigator.doNotTrack||"1"===o.doNotTrack||"1"===o.navigator.msDoNotTrack||"yes"===o.navigator.doNotTrack?.toLowerCase?.()}function a(){let o=arguments.length>0&&void 0!==arguments[0]?arguments[0]:window;try{return n(o)||o!==o.top&&n(o.top)}catch(o){return!1}}r.d(t,{l:()=>a})}}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[1085],{3293(e,n,t){t.d(n,{G:()=>r});const r='(()=>{"use strict";const e="Prebid Event",n="browserIntervention";window.render=function(t,r,i){let{ad:o,adUrl:s,width:d,height:c,instl:h}=t,{mkFrame:l,sendMessage:a}=r;if(function(){const t=window;if("ReportingObserver"in t)try{new t.ReportingObserver(t=>{var r;r=t[0],a(e,{event:n,intervention:r})},{buffered:!0,types:["intervention"]}).observe()}catch(e){}}(),!o&&!s){const e=new Error("Missing ad markup or URL");throw e.reason="noAd",e}{if(null==c){const e=i.document?.body;[e,e?.parentElement].filter(e=>null!=e?.style).forEach(e=>{e.style.height="100%"})}const e=i.document,n={width:d??"100%",height:c??"100%"};if(s&&!o?n.src=s:n.srcdoc=o,e.body.appendChild(l(e,n)),h&&i.frameElement){const e=i.frameElement.style;e.width=d?`${d}px`:"100vw",e.height=c?`${c}px`:"100vh"}}}})();'}}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[9147],{2808(e,r,s){function n(e){return e?.ortb2?.ext?.prebid?.adServerCurrency}s.d(r,{b:()=>n})}}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[7109],{3254(e,t,n){n.d(t,{c5:()=>a,q4:()=>i});var s=n(3064);const r=0,i=2;function a(e){let{apiName:t,apiVersion:n,apiArgs:a=["command","callback","parameter","version"],callbackArgs:l=["returnValue","success"],mode:c=r}=e,o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:window;const p={},u=`${t}Call`,m=`${t}Return`;function d(e){const t="string"==typeof e.data&&e.data.includes(m)?JSON.parse(e.data):e.data;if(t?.[m]?.callId){const e=t[m];p.hasOwnProperty(e.callId)&&p[e.callId](...l.map(t=>e[t]))}}const[f,g]=function(){let e,n=o,s=!1;for(;null!=n;){try{if("function"==typeof n[t]){e=n,s=!0;break}}catch(e){}try{if(n.frames[`${t}Locator`]){e=n;break}}catch(e){}if(n===o.top)break;n=n.parent}return[e,s]}();if(!f)return;function v(e){return e=Object.assign({version:n},e),a.map(t=>[t,e[t]])}function h(e,t,n,s){const r="function"==typeof e;return function(i,a){if(s&&s(),1!==c){(null==a||a?t:n)(r?void 0:i)}r&&e.apply(this,arguments)}}let C;return g?C=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return new s.U9((n,s)=>{const a=f[t](...v({...e,callback:e.callback||c===i?h(e.callback,n,s):void 0}).map(e=>{let[t,n]=e;return n}));(1===c||null==e.callback&&c===r)&&n(a)})}:(o.addEventListener("message",d,!1),C=function(e){let t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return new s.U9((n,s)=>{const r=Math.random().toString(),i={[u]:{...Object.fromEntries(v(e).filter(e=>{let[t]=e;return"callback"!==t})),callId:r}};p[r]=h(e?.callback,n,s,(t||null==e?.callback)&&(()=>{delete p[r]})),f.postMessage(i,"*"),1===c&&n()})}),Object.assign(C,{isDirect:g,close(){!g&&o.removeEventListener("message",d)}})}},9708(e,t,n){n.d(t,{Al:()=>l});var s=n(466);class r{cmpApi=null;listenerId=void 0;setCmpApi(e){this.cmpApi=e}getCmpApi(){return this.cmpApi}setCmpListenerId(e){this.listenerId=e}getCmpListenerId(){return this.listenerId}resetCmpApis(){this.cmpApi=null,this.listenerId=void 0}getRemoveListenerParams(){const e=this.getCmpApi(),t=this.getCmpListenerId();return e&&"function"==typeof e&&null!=t?{command:"removeEventListener",callback:()=>this.resetCmpApis(),parameter:t}:null}}class i extends r{constructor(e){super(),this.getConsentData=e||(()=>null)}removeCmpEventListener(){const e=this.getRemoveListenerParams();if(e){const t=this.getConsentData();e.apiVersion=t?.apiVersion||2,(0,s.logInfo)("Removing TCF CMP event listener"),this.getCmpApi()(e)}}}class a extends r{removeCmpEventListener(){const e=this.getRemoveListenerParams();e&&((0,s.logInfo)("Removing GPP CMP event listener"),this.getCmpApi()(e))}}function l(e,t){switch(e){case"tcf":return new i(t);case"gpp":return new a;default:return(0,s.logError)(`Unknown CMP type: ${e}`),null}}}}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[10],{3965(n,e,t){t.d(e,{yq:()=>c});var o=t(7841),a=t(466),s=t(6665),r=t(3064),i=t(5291),l=t(2592);function c(){let n,e,t,{namespace:c,displayName:u,consentDataHandler:m,parseConsentData:g,getNullConsent:f,cmpHandlers:d,cmpEventCleanup:p,DEFAULT_CMP:C="iab",DEFAULT_CONSENT_TIMEOUT:D=1e4}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};function h(n){return`consentManagement.${c} ${n}`}function b(n,e){return n(Object.assign({[`${c}Consent`]:m.getConsentData()},e))}function T(){return e().then(n=>{let{error:e}=n;return{error:e,consentData:m.getConsentData()}})}function k(){null==n&&(n=function(n,e){const t=new WeakSet;return(0,o.Ak)(n,function(n,o){return e().then(e=>{let{consentData:s,error:r}=e;!r||s&&t.has(r)||(t.add(r),(0,a.logWarn)(r.message,...r.args||[])),n.call(this,o)}).catch(e=>{(0,a.logError)(`${e?.message} Canceling auction as per consentManagement config.`,...e?.args||[]),n.stopTiming(),"function"==typeof o.bidsBackHandler?o.bidsBackHandler():(0,a.logError)("Error executing bidsBackHandler")})})}(c,()=>e()),(0,l.Yn)("requestBids").before(n,50),i.U3.before(b),(0,a.logInfo)(`${u} consentManagement module has been activated...`))}function E(){null!=n&&((0,l.Yn)("requestBids").getHooks({hook:n}).remove(),i.U3.getHooks({hook:b}).remove(),n=null,(0,a.logInfo)(`${u} consentManagement module has been deactivated...`))}return function(o){const i=o?.[c];if(!i||"object"!=typeof i)return(0,a.logWarn)(h("config not defined, exiting consent manager module")),E(),{};if(!1===i?.enabled)return(0,a.logWarn)(h("config enabled is set to false, disabling consent manager module")),function(){if(E(),"function"==typeof p)try{p()}catch(n){(0,a.logError)(`Error during CMP event cleanup for ${u}:`,n)}}(),{};let l,b;(0,s.O8)(i.cmpApi)?l=i.cmpApi:(l=C,(0,a.logInfo)(h(`config did not specify cmp.  Using system default setting (${C}).`))),(0,s.Et)(i.timeout)?b=i.timeout:(b=D,(0,a.logInfo)(h(`config did not specify timeout.  Using system default setting (${D}).`)));const y=(0,s.Et)(i.actionTimeout)?i.actionTimeout:null;let $;"static"===l?(0,s.Qd)(i.consentData)?(t=i.consentData,b=null,$=()=>new r.U9(n=>n(m.setConsentData(g(t))))):(0,a.logError)(h("config with cmpApi: 'static' did not specify consentData. No consents will be available to adapters.")):d.hasOwnProperty(l)?$=d[l]:(m.setConsentData(null),(0,a.logWarn)(`${u} CMP framework (${l}) is not a supported framework.  Aborting consentManagement module and resuming auction.`),$=()=>r.U9.resolve());const v=()=>function(n){let e,{name:t,consentDataHandler:o,setupCmp:a,cmpTimeout:s,actionTimeout:r,getNullConsent:i}=n;return o.enable(),new Promise((n,l)=>{let c,u=!1;function m(a){null!=e&&clearTimeout(e),e=null!=a?setTimeout(()=>{const e=o.getConsentData()??(u?c:i()),a="timeout waiting for "+(u?"user action on CMP":"CMP to load");o.setConsentData(e),n({consentData:e,error:new Error(`${t} ${a}`)})},a):null}a(function(n){c=n,u||(u=!0,null!=r&&m(r))}).then(()=>n({consentData:o.getConsentData()}),l),null!=s&&m(s)}).finally(()=>{e&&clearTimeout(e)}).catch(n=>{throw o.setConsentData(null),n})}({name:u,consentDataHandler:m,setupCmp:$,cmpTimeout:b,actionTimeout:y,getNullConsent:f});return e=(()=>{let n;return function(){return null==n&&(n=v().catch(e=>{throw n=null,e})),n}})(),k(),{cmpHandler:l,cmpTimeout:b,actionTimeout:y,staticConsentData:t,loadConsentData:T,requestBidsHook:n}}}}}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[8498],{611(e,t,r){r.d(t,{A:()=>f});const n=new WeakMap;var i=r(466),o=r(9794);var s=r(6220);const a={1:o.D4,2:o.G_,4:o.s6};var d=r(6665);var p=r(2517),c=r(1833),u=r(8417);const m={[p.S3]:{fpd:{priority:99,fn(e,t){(0,i.mergeDeep)(e,t.ortb2)}},onlyOneClient:{priority:-99,fn:(0,c.i8)("ORTB request")},props:{fn(e,t){Object.assign(e,{id:e.id||(0,i.generateUUID)(),test:e.test||0});const r=parseInt(t.timeout,10);isNaN(r)||(e.tmax=r)}}},[p.Tb]:{fpd:{priority:99,fn(e,t){(0,i.mergeDeep)(e,t.ortb2Imp)}},id:{fn(e,t){e.id=t.bidId}},banner:{fn:function(e,t,r){if(r.mediaType&&r.mediaType!==o.D4)return;const n=t?.mediaTypes?.banner;if(n){const r={topframe:!0===(0,i.inIframe)()?0:1};n.sizes&&null==t.ortb2Imp?.banner?.format&&(r.format=(0,i.sizesToSizeTuples)(n.sizes).map(i.sizeTupleToRtbSize)),n.hasOwnProperty("pos")&&(r.pos=n.pos),e.banner=(0,i.mergeDeep)(r,e.banner)}}},secure:{fn(e,t){e.secure=e.secure??1}}},[p.WR]:{mediaType:{priority:99,fn:function(e,t,r){if(e.mediaType)return;const n=r.mediaType;if(!n&&!a.hasOwnProperty(t.mtype))throw new Error("Cannot determine mediaType for response");e.mediaType=n||a[t.mtype]}},banner:{fn:function(){let{createPixel:e=e=>(0,i.createTrackPixelHtml)(decodeURIComponent(e),i.encodeMacroURI)}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return function(t,r){t.mediaType===o.D4&&(r.adm&&r.nurl?t.ad=e(r.nurl)+r.adm:r.adm?t.ad=r.adm:r.nurl&&(t.adUrl=r.nurl))}}()},props:{fn(e,t,r){Object.entries({requestId:r.bidRequest?.bidId,seatBidId:t.id,cpm:t.price,currency:r.ortbResponse.cur||r.currency,width:t.w,height:t.h,wratio:t.wratio,hratio:t.hratio,dealId:t.dealid,creative_id:t.crid,creativeId:t.crid,burl:t.burl,ttl:t.exp||r.ttl,netRevenue:r.netRevenue}).filter(e=>{let[t,r]=e;return void 0!==r}).forEach(t=>{let[r,n]=t;e[r]=n}),e.meta||(e.meta={}),t.adomain&&(e.meta.advertiserDomains=t.adomain),t.ext?.dsa&&(e.meta.dsa=t.ext.dsa),t.cat&&(e.meta.primaryCatId=t.cat[0],e.meta.secondaryCatIds=t.cat.slice(1)),t.attr&&(e.meta.attr=t.attr),t.ext?.eventtrackers&&(e.eventtrackers=(e.eventtrackers??[]).concat(t.ext.eventtrackers)),t.cattax&&(e.meta.cattax=t.cattax)}}}};function l(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];const n=t.shift(),i=t.length>1?l(...t):t[0];return Object.fromEntries(p.zt.map(e=>[e,Object.assign({},n[e],i[e])]))}function f(){let{context:e={},processors:t=b,overrides:r={},imp:o,request:s,bidResponse:a,response:d}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const c=new WeakMap;function u(e,i,o,s){let a;return function(){null==a&&(a=function(){let a=o.bind(this,function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(!n.has(e)){const t=Object.entries(e);t.sort((e,t)=>(e=e[1].priority||0)===(t=t[1].priority||0)?0:e>t?-1:1),n.set(e,t.map(e=>{let[t,r]=e;return[t,r.fn]}))}const r=n.get(e).filter(e=>{let[r]=e;return!t.hasOwnProperty(r)||t[r]}).map(function(e){let[r,n]=e;return t.hasOwnProperty(r)?t[r].bind(this,n):n});return function(){const e=Array.from(arguments);r.forEach(t=>{t.apply(this,e)})}}(t()[e]||{},r[e]||{}));return i&&(a=i.bind(this,a)),function(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];try{return a.apply(this,t)}catch(e){s.call(this,e,...t)}}}());for(var d=arguments.length,p=new Array(d),c=0;c<d;c++)p[c]=arguments[c];return a.apply(this,p)}}const m=u(p.Tb,o,function(e,t,r){const n={};return e(n,t,r),n},function(e,t,r){(0,i.logError)("Error while converting bidRequest to ORTB imp; request skipped.",{error:e,bidRequest:t,context:r})}),l=u(p.S3,s,function(e,t,r,n){const i={imp:t};return e(i,r,n),i},function(e,t,r,n){throw(0,i.logError)("Error while converting to ORTB request",{error:e,imps:t,bidderRequest:r,context:n}),e}),f=u(p.WR,a,function(e,t,r){const n={};return e(n,t,r),n},function(e,t,r){(0,i.logError)("Error while converting ORTB seatbid.bid to bidResponse; bid skipped.",{error:e,bid:t,context:r})}),y=u(p.Cf,d,function(e,t,r,n){const i={bids:t};return e(i,r,n),i},function(e,t,r,n){throw(0,i.logError)("Error while converting from ORTB response",{error:e,bidResponses:t,ortbResponse:r,context:n}),e});return{toORTB(t){let{bidderRequest:r,bidRequests:n,context:o={}}=t;n=n||r.bids;const s={req:Object.assign({bidRequests:n},e,o),imp:{}};s.req.impContext=s.imp;const a=n.map(t=>{const n=Object.assign({bidderRequest:r,reqContext:s.req},e,o),a=m(t,n);if(null!=a){if(a.hasOwnProperty("id"))return Object.assign(n,{bidRequest:t,imp:a}),s.imp[a.id]=n,a;(0,i.logError)("Converted ORTB imp does not specify an id, ignoring bid request",t,a)}}).filter(Boolean),d=l(a,r,s.req);return s.req.bidderRequest=r,null!=d&&c.set(d,s),d},fromORTB(e){let{request:t,response:r}=e;const n=c.get(t);if(null==n)throw new Error("ortbRequest passed to `fromORTB` must be the same object returned by `toORTB`");function o(e){let r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return Object.assign(e,{ortbRequest:t},r)}const s=Object.fromEntries((t.imp||[]).map(e=>[e.id,e])),a=(r?.seatbid||[]).flatMap(e=>(e.bid||[]).map(t=>{if(s.hasOwnProperty(t.impid)&&n.imp.hasOwnProperty(t.impid))return f(t,o(n.imp[t.impid],{imp:s[t.impid],seatbid:e,ortbResponse:r}));(0,i.logError)("ORTB response seatbid[].bid[].impid does not match any imp in request; ignoring bid",t)})).filter(Boolean);return y(a,r,o(n.req))}}}m[p.Tb].native={fn:function(e,t,r){if(r.mediaType&&r.mediaType!==o.s6)return;let n=t.nativeOrtbRequest;n&&(n=Object.assign({},r.nativeRequest,n),n.assets?.length?e.native=(0,i.mergeDeep)({},{request:JSON.stringify(n),ver:n.ver},e.native):(0,i.logWarn)("mediaTypes.native is set, but no assets were specified. Native request skipped.",t))}},m[p.WR].native={fn:function(e,t){if(e.mediaType===o.s6){let r;if(r="string"==typeof t.adm?JSON.parse(t.adm):t.adm,!(0,d.Qd)(r)||!Array.isArray(r.assets))throw new Error("ORTB native response contained no assets");e.native={ortb:r}}}},m[p.Tb].video={fn:function(e,t,r){if(r.mediaType&&r.mediaType!==o.G_)return;const n=t?.mediaTypes?.video;if(!(0,i.isEmpty)(n)){const t=Object.fromEntries(Object.entries(n).filter(e=>{let[t]=e;return s.Zy.has(t)}));if(n.playerSize){const e=(0,i.sizesToSizeTuples)(n.playerSize).map(i.sizeTupleToRtbSize);e.length>1&&(0,i.logWarn)("video request specifies more than one playerSize; all but the first will be ignored"),Object.assign(t,e[0])}e.video=(0,i.mergeDeep)(t,e.video)}}},m[p.WR].video={fn:function(e,t,r){e.mediaType===o.G_&&(r?.imp?.video?.w&&r?.imp?.video?.h&&([e.playerWidth,e.playerHeight]=[r.imp.video.w,r.imp.video.h]),t.adm&&(e.vastXml=t.adm),t.nurl&&(e.vastUrl=t.nurl))}},m[p.Tb].audio={fn:function(e,t,r){if(r.mediaType&&r.mediaType!==o.FY)return;const n=t?.mediaTypes?.audio;if(!(0,i.isEmpty)(n)){const t=Object.fromEntries(Object.entries(n).filter(e=>{let[t]=e;return u.Ai.has(t)}));e.audio=(0,i.mergeDeep)(t,e.audio)}}},m[p.WR].audio={fn:function(e,t){e.mediaType===o.FY&&(t.adm&&(e.vastXml=t.adm),t.nurl&&(e.vastUrl=t.nurl))}};const b=(0,i.memoize)(()=>l(m,(0,p.yB)(p.qN)))}}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[467],{4603(e,n,t){t.d(n,{Fd:()=>r,Wz:()=>d,mN:()=>i});var o=t(5767);function r(e,n,t,o,r){const a=[];return e.forEach(e=>{const s={},i=function(o,r){let a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0;const d=function(e,n,t,o,r){return e.getFloor?.({currency:r,mediaType:n,size:[t,o]}).floor||e.params.bidfloor||-1}(n,o,a,i,t);s[d]||(s[d]={...e,bidfloor:d}),s[d][r]||(s[d][r]="banner"===o?{format:[]}:e[o]),"banner"===o&&s[d][r].format.push({w:a,h:i})};e.banner?.format?.length&&e.banner.format.forEach(e=>i("banner","bannerTemp",e?.w,e?.h)),i("native","nativeTemp"),i("video","videoTemp",e.video?.w,e.video?.h),Object.values(s).forEach(n=>{if([["banner","bannerTemp"],["native","nativeTemp"],["video","videoTemp"]].forEach(e=>{let[t,o]=e;n=function(e,n,t){const o={};for(const r in e)r===n?Object.prototype.hasOwnProperty.call(e,t)&&(o[n]=e[t]):r!==t&&(o[r]=e[r]);return-1===o.bidfloor&&delete o.bidfloor,o}(n,t,o)}),n.banner||n.video||n.native){const t=function(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";let n=0,t="";for(;n++<14;)t+=e.charAt(Math.floor(62*Math.random()));return t}();o[t]=n.id,n.id=t,n.banner&&"stx"===r&&(n.banner.pos=e.banner.pos,n.banner.topframe=e.banner.topframe),a.push(n)}})}),a}const a="https://apps.smartadserver.com",s=`${a}/diff/templates/asset/csync.html`,i="eqt_pid";function d(e,n,t,r,d){if(e.iframeEnabled){window.addEventListener("message",function e(n){n.origin===a&&"getConsent"===n.data.action&&(n.source&&n.source.postMessage&&n.source.postMessage({action:"consentResponse",id:n.data.id,consents:t.vendorData.vendor.consents},n.origin),n.data.pid&&d.setDataInLocalStorage(i,n.data.pid),this.removeEventListener("message",e))});let e=(0,o.v)(s+"?","nwid",r);return e=(0,o.v)(e,"gdpr",t?.gdprApplies?"1":"0"),[{type:"iframe",url:e}]}return[]}}}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[4577],{5767(e,n,s){function o(e,n,s){return s?`${e}${n}=${encodeURIComponent(s)}&`:e}s.d(n,{v:()=>o})}}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[1912],{770(e,t,s){s.d(t,{E0:()=>g,kz:()=>n,wq:()=>p});var r=s(2201),i=s(466);const n="1.1";function o(e){return!!("object"==typeof e&&null!==e&&e.advertising_token&&e.identity_expires&&e.refresh_from&&e.refresh_token&&e.refresh_expires)}function a(e){return`UID2 shared library - ${e}`}function l(e){for(var t=arguments.length,s=new Array(t>1?t-1:0),r=1;r<t;r++)s[r-1]=arguments[r];e(a(s[0]),...s.slice(1))}class c{constructor(e,t,s,r){this._baseUrl=e.baseUrl,this._clientVersion=t,this._logInfo=function(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];return l(s,...t)},this._logWarn=r}createArrayBuffer(e){const t=new Uint8Array(e.length);for(let s=0;s<e.length;s++)t[s]=e.charCodeAt(s);return t}hasStatusResponse(e){return"object"==typeof e&&e&&e.status}isValidRefreshResponse(e){return this.hasStatusResponse(e)&&("optout"===e.status||"expired_token"===e.status||"success"===e.status&&e.body&&o(e.body))}ResponseToRefreshResult(e){return this.isValidRefreshResponse(e)?"success"===e.status?{status:e.status,identity:e.body}:"optout"===e.status?{status:e.status,identity:"optout"}:e:a("Response didn't contain a valid status")}callRefreshApi(e){const t=this._baseUrl+"/v2/token/refresh";let s,i;const n=new Promise((e,t)=>{s=e,i=t});return this._logInfo("Sending refresh request",e),(0,r.RD)(t,{success:t=>{try{if(e.refresh_response_key){this._logInfo("Decrypting refresh API response");const r=this.createArrayBuffer(atob(t));window.crypto.subtle.importKey("raw",this.createArrayBuffer(atob(e.refresh_response_key)),{name:"AES-GCM"},!1,["decrypt"]).then(e=>{this._logInfo("Imported decryption key"),window.crypto.subtle.decrypt({name:"AES-GCM",iv:r.slice(0,12),tagLength:128},e,r.slice(12)).then(e=>{const t=String.fromCharCode(...new Uint8Array(e));this._logInfo("Decrypted to:",t);const r=JSON.parse(t),n=this.ResponseToRefreshResult(r);"string"==typeof n?i(a(n)):s(n)},e=>this._logWarn(a("Call to UID2 API failed"),e))},e=>this._logWarn(a("Call to UID2 API failed"),e))}else{this._logInfo("No response decryption key available, assuming unencrypted JSON");const e=JSON.parse(t),r=this.ResponseToRefreshResult(e);"string"==typeof r?i(a(r)):s(r)}}catch(e){i(a(t))}},error:(e,t)=>{try{this._logInfo("Error status, assuming unencrypted JSON");const e=JSON.parse(t.responseText),r=this.ResponseToRefreshResult(e);"string"==typeof r?i(a(r)):s(r)}catch(t){i(a(e))}}},e.refresh_token,{method:"POST",customHeaders:{"X-UID2-Client-Version":this._clientVersion}}),n}}class u{constructor(e,t,s,r){this._storage=e,this._preferLocalStorage=t,this._storageName=s,this._logInfo=function(){for(var e=arguments.length,t=new Array(e),s=0;s<e;s++)t[s]=arguments[s];return l(r,...t)}}readCookie(e){return this._storage.cookiesAreEnabled()?this._storage.getCookie(e):null}readLocalStorage(e){return this._storage.localStorageIsEnabled()?this._storage.getDataFromLocalStorage(e):null}readModuleCookie(){return this.parseIfContainsBraces(this.readCookie(this._storageName))}writeModuleCookie(e){this._storage.setCookie(this._storageName,JSON.stringify(e),Date.now()+864e5)}readModuleStorage(){return this.parseIfContainsBraces(this.readLocalStorage(this._storageName))}writeModuleStorage(e){this._storage.setDataInLocalStorage(this._storageName,JSON.stringify(e))}readProvidedCookie(e){return JSON.parse(this.readCookie(e))}parseIfContainsBraces(e){return e?.includes("{")?JSON.parse(e):e}storeValue(e){this._preferLocalStorage?this.writeModuleStorage(e):this.writeModuleCookie(e)}getStoredValueWithFallback(){const e=this._preferLocalStorage?"local storage":"cookie",t=(this._preferLocalStorage?this.readModuleStorage:this.readModuleCookie).bind(this),s=(this._preferLocalStorage?this.writeModuleStorage:this.writeModuleCookie).bind(this),r=(this._preferLocalStorage?this.readModuleCookie:this.readModuleStorage).bind(this),i=t();if(i){if("string"==typeof i){const t=r();if(t&&"object"==typeof t)return this._logInfo(`${e} contained a basic token, but found a refreshable token fallback. Copying the fallback value to ${e}.`),s(t),t}}else{const t=r();if(t)return this._logInfo(`${e} was empty, but found a fallback value.`),"object"==typeof t&&(this._logInfo(`Copying the fallback value to ${e}.`),s(t)),t}return i}}function d(e,t,s,r,i,n){i("UID2 base url provided: ",e);return new c({baseUrl:e},s,i,n).callRefreshApi(t).then(e=>{i("Refresh endpoint responded with:",e);const s={originalToken:t,latestToken:e.identity},n=r.getStoredValueWithFallback();return n?.originalIdentity&&(s.originalIdentity=n.originalIdentity),r.storeValue(s),s})}let h;{const e=9;h={isCSTGOptionsValid(e,t){if("object"!=typeof e||null===e)return t('CSTG is not being used, but is included in the Prebid.js bundle. You can reduce the bundle size by passing "--disable UID2_CSTG" to the Prebid.js build.'),!1;const s=e;if(!s.serverPublicKey&&!s.subscriptionId)return t("CSTG has been enabled but its parameters have not been set."),!1;if("string"!=typeof s.serverPublicKey)return t("CSTG opts.serverPublicKey must be a string"),!1;const r=/^(UID2|EUID)-X-[A-Z]-.+/;return r.test(s.serverPublicKey)?"string"!=typeof s.subscriptionId?(t("CSTG opts.subscriptionId must be a string"),!1):0!==s.subscriptionId.length||(t("CSTG opts.subscriptionId is empty"),!1):(t(`CSTG opts.serverPublicKey must match the regular expression ${r}`),!1)},getValidIdentity(e,s){if(e.emailHash)return t.isBase64Hash(e.emailHash)?{email_hash:e.emailHash}:void s("CSTG opts.emailHash is invalid");if(e.phoneHash)return t.isBase64Hash(e.phoneHash)?{phone_hash:e.phoneHash}:void s("CSTG opts.phoneHash is invalid");if(e.email){const r=t.normalizeEmail(e.email);return void 0===r?void s("CSTG opts.email is invalid"):{email:r}}return e.phone?t.isNormalizedPhone(e.phone)?{phone:e.phone}:void s("CSTG opts.phone is invalid"):void 0},isStoredTokenInvalid(e,t,s,r){if(t){if("optout"===t.latestToken)return!0;const r=Object.values(e)[0];if(!this.isStoredTokenFromSameIdentity(t,r))return s("CSTG supplied new identity - ignoring stored value.",t.originalIdentity,e),!0}return!1},async generateTokenAndStore(e,t,r,i,n,o){n("UID2 cstg opts provided: ",JSON.stringify(t));const a=new s({baseUrl:e,cstg:t},n,o),l=await a.generateToken(r);n("CSTG endpoint responded with:",l);const c={originalIdentity:this.encodeOriginalIdentity(r),latestToken:l.identity};return i.storeValue(c),c},isStoredTokenFromSameIdentity:(e,t)=>!!e.originalIdentity&&(0,i.cyrb53Hash)(t,e.originalIdentity.salt)===e.originalIdentity.identity,encodeOriginalIdentity(e){const t=Object.values(e)[0],s=Math.floor(Math.random()*Math.pow(2,32));return{identity:(0,i.cyrb53Hash)(t,s),salt:s}}};class t{static EMAIL_EXTENSION_SYMBOL="+";static EMAIL_DOT=".";static GMAIL_DOMAIN="gmail.com";static isBase64Hash(e){if(!e||44!==e.length)return!1;try{return btoa(atob(e))===e}catch(e){return!1}}static isNormalizedPhone(e){return/^\+[0-9]{10,15}$/.test(e)}static normalizeEmail(e){if(!e||!e.length)return;const t=e.trim().toLowerCase();if(t.indexOf(" ")>0)return;const s=this.splitEmailIntoAddressAndDomain(t);if(!s)return;const{address:r,domain:i}=s,n=this.isGmail(i),o=this.normalizeAddressPart(r,n,n);return o?`${o}@${i}`:void 0}static splitEmailIntoAddressAndDomain(e){const t=e.split("@");if(2===t.length&&!t.some(e=>""===e))return{address:t[0],domain:t[1]}}static isGmail(e){return e===this.GMAIL_DOMAIN}static dropExtension(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.EMAIL_EXTENSION_SYMBOL;return e.split(t)[0]}static normalizeAddressPart(e,t,s){let r=e;return t&&(r=r.replaceAll(this.EMAIL_DOT,"")),s&&(r=this.dropExtension(r)),r}}class s{constructor(e,t,s){this._baseUrl=e.baseUrl,this._serverPublicKey=e.cstg.serverPublicKey,this._subscriptionId=e.cstg.subscriptionId,this._logInfo=function(){for(var e=arguments.length,s=new Array(e),r=0;r<e;r++)s[r]=arguments[r];return l(t,...s)},this._logWarn=s}hasStatusResponse(e){return"object"==typeof e&&e&&e.status}isCstgApiSuccessResponse(e){return this.hasStatusResponse(e)&&"success"===e.status&&o(e.body)}isCstgApiOptoutResponse(e){return this.hasStatusResponse(e)&&"optout"===e.status}isCstgApiClientErrorResponse(e){return this.hasStatusResponse(e)&&"client_error"===e.status&&"string"==typeof e.message}isCstgApiForbiddenResponse(e){return this.hasStatusResponse(e)&&"invalid_http_origin"===e.status&&"string"==typeof e.message}stripPublicKeyPrefix(t){return t.substring(e)}async generateCstgRequest(e){if("email_hash"in e||"phone_hash"in e)return e;if("email"in e){return{email_hash:await c.hash(e.email)}}if("phone"in e){return{phone_hash:await c.hash(e.phone)}}}async generateToken(e){const t=await this.generateCstgRequest(e);this._logInfo("Building CSTG request for",t);const s=await n.build(this.stripPublicKeyPrefix(this._serverPublicKey)),r=new TextEncoder,i=Date.now(),{iv:o,ciphertext:a}=await s.encrypt(r.encode(JSON.stringify(t)),r.encode(JSON.stringify([i]))),l=await c.exportPublicKey(s.clientPublicKey),u={payload:c.bytesToBase64(new Uint8Array(a)),iv:c.bytesToBase64(new Uint8Array(o)),public_key:c.bytesToBase64(new Uint8Array(l)),timestamp:i,subscription_id:this._subscriptionId};return this.callCstgApi(u,s)}async callCstgApi(e,t){const s=this._baseUrl+"/v2/token/client-generate";let i,n;const o=new Promise((e,t)=>{i=e,n=t});return this._logInfo("Sending CSTG request",e),(0,r.RD)(s,{success:async(e,s)=>{try{const s=c.base64ToBytes(e),r=await t.decrypt(s.slice(0,12),s.slice(12)),o=(new TextDecoder).decode(r),l=JSON.parse(o);this.isCstgApiSuccessResponse(l)?i({status:"success",identity:l.body}):this.isCstgApiOptoutResponse(l)?i({status:"optout",identity:"optout"}):n(a(`API error: Response body was invalid for HTTP status 200: ${o}`))}catch(e){n(a(e))}},error:(e,t)=>{try{if(400===t.status){const e=JSON.parse(t.responseText);this.isCstgApiClientErrorResponse(e)?n(a(`Client error: ${e.message}`)):n(a(`UID2 API error: Response body was invalid for HTTP status 400: ${t.responseText}`))}else if(403===t.status){const e=JSON.parse(t.responseText);this.isCstgApiForbiddenResponse(t)?n(a(`Forbidden: ${e.message}`)):n(a(`UID2 API error: Response body was invalid for HTTP status 403: ${t.responseText}`))}else n(a(`UID2 API error: Unexpected HTTP status ${t.status}: ${e}`))}catch(t){n(a(e))}}},JSON.stringify(e),{method:"POST"}),o}}class n{static _namedCurve="P-256";constructor(e,t){this._clientPublicKey=e,this._sharedKey=t}static async build(e){const t=await c.generateKeyPair(n._namedCurve),s=await c.importPublicKey(e,this._namedCurve),r=await c.deriveKey(s,t.privateKey);return new n(t.publicKey,r)}async encrypt(e,t){const s=window.crypto.getRandomValues(new Uint8Array(12));return{iv:s,ciphertext:await window.crypto.subtle.encrypt({name:"AES-GCM",iv:s,additionalData:t},this._sharedKey,e)}}async decrypt(e,t){return window.crypto.subtle.decrypt({name:"AES-GCM",iv:e},this._sharedKey,t)}get clientPublicKey(){return this._clientPublicKey}}class c{static base64ToBytes(e){const t=atob(e);return Uint8Array.from(t,e=>e.codePointAt(0))}static bytesToBase64(e){const t=Array.from(e,e=>String.fromCodePoint(e)).join("");return btoa(t)}static async generateKeyPair(e){const t={name:"ECDH",namedCurve:e};return window.crypto.subtle.generateKey(t,!1,["deriveKey"])}static async importPublicKey(e,t){const s={name:"ECDH",namedCurve:t};return window.crypto.subtle.importKey("spki",this.base64ToBytes(e),s,!1,[])}static exportPublicKey(e){return window.crypto.subtle.exportKey("spki",e)}static async deriveKey(e,t){return window.crypto.subtle.deriveKey({name:"ECDH",public:e},t,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"])}static async hash(e){const t=await window.crypto.subtle.digest("SHA-256",(new TextEncoder).encode(e));return this.bytesToBase64(new Uint8Array(t))}}}function p(e,t,s,r){const n=function(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];return l(s,...t)};let o=null;const a="cookie"!==e.storage,c=new u(t,a,e.internalStorage,n);n(`Module is using ${a?"local storage":"cookies"} for internal storage.`);const p=h&&h.isCSTGOptionsValid(e.cstg,r);p?(n("Module is using client-side token generation."),o=null):e.paramToken?(o=e.paramToken,n("Read token from params",o)):e.serverCookieName&&(o=c.readProvidedCookie(e.serverCookieName),n("Read token from server-supplied cookie",o));let g=c.getStoredValueWithFallback();if(n("Loaded module-stored tokens:",g),g&&"string"==typeof g){if(!o&&!p)return n("Returning legacy cookie value."),{id:g};n("Discarding superseded legacy cookie."),g=null}if(o&&g&&g.originalToken?.advertising_token!==o.advertising_token&&(n("Server supplied new token - ignoring stored value.",g.originalToken?.advertising_token,o.advertising_token),g=null),p){const t=h.getValidIdentity(e.cstg,r);if(t&&(g&&h.isStoredTokenInvalid(t,g,n,r)&&(g=null),!g||Date.now()>g.latestToken.refresh_expires)){const s=h.generateTokenAndStore(e.apiBaseUrl,e.cstg,t,c,n,r);return n("Generate token using CSTG"),{callback:e=>{s.then(t=>{n("Token generation responded, passing the new token on.",t),e(t)}).catch(e=>{(0,i.logError)("error generating token: ",e)})}}}}const y=!g?.latestToken||o&&o.identity_expires>g.latestToken.identity_expires,f=y?o:g.latestToken;if(n("UID2 module selected latest token",y,f),!f||Date.now()>f.refresh_expires)return n("Newest available token is expired and not refreshable."),{id:null};if(Date.now()>f.identity_expires){const t=d(e.apiBaseUrl,f,e.clientId,c,n,r);return n("Token is expired but can be refreshed, attempting refresh."),{callback:e=>{t.then(t=>{n("Refresh reponded, passing the updated token on.",t),e(t)}).catch(e=>{(0,i.logError)("error refreshing token: ",e)})}}}const b={originalToken:o??g?.originalToken,latestToken:f};if(p&&(b.originalIdentity=g?.originalIdentity),c.storeValue(b),Date.now()>f.refresh_from){n("Refreshing token in background with low priority.");const t=d(e.apiBaseUrl,f,e.clientId,c,n,r);return{id:b,callback:e=>{t.then(t=>{n("Background token refresh completed, updating ID.",t),e(t)}).catch(e=>{(0,i.logError)("error refreshing token in background: ",e)})}}}return{id:b}}function g(e){const t=["emailHash","phoneHash","email","phone"];for(const s of t)if(e.hasOwnProperty(s))return{[s]:e[s]};return{}}}}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[2316],{8317(e,n,s){s.d(n,{G:()=>u});var t=s(7776);const o=new Map;function u(e){let n;return o.has(e)?n=o.get(e):(n=e.getBoundingClientRect(),o.set(e,n)),n}t.gH.before((e,n)=>{o.clear(),e(n)})}}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[5783],{3824(i,n,e){function s(){return{ada:"undefined"!=typeof window&&!!window.cardano,bnb:"undefined"!=typeof window&&!!window.BinanceChain,eth:"undefined"!=typeof window&&!!window.ethereum,sol:"undefined"!=typeof window&&!!window.solana,tron:"undefined"!=typeof window&&!!window.tron}}function o(i,n){try{return i()}catch(i){return n}}function t(){return{ada:o(a,[]),bnb:o(l,[]),eth:o(d,[]),sol:o(r,[]),tron:o(u,[])}}function a(){const i=[];if("undefined"==typeof window)return i;if(window.cardano){const n=["eternl","yoroi","nufi","flint","exodus","lace","nami","gerowallet","typhon","begin"];for(const e of n)window.cardano[e]&&i.push(e)}return i}function l(){const i=[];if("undefined"==typeof window)return i;if(window.BinanceChain){const n=["isTrustWallet","isCoin98","isKaiWallet","isMetaMask","isNifyWallet"];for(const e of n)window.BinanceChain[e]&&i.push(e);i.includes("isCoin98")&&i.includes("isKaiWallet")&&i.splice(i.indexOf("isKaiWallet"),1),i.includes("isCoin98")&&i.includes("isNifyWallet")&&i.splice(i.indexOf("isNifyWallet"),1),i.includes("isCoin98")&&i.includes("isMetaMask")&&i.splice(i.indexOf("isMetaMask"),1)}return i}function d(){const i=[];if("undefined"==typeof window)return i;if(window.ethereum){const n=["isApexWallet","isAvalanche","isBackpack","isBifrost","isBitKeep","isBitski","isBlockWallet","isBraveWallet","isCoinbaseWallet","isDawn","isEnkrypt","isExodus","isFrame","isFrontier","isGamestop","isHyperPay","isImToken","isKuCoinWallet","isMathWallet","isMetaMask","isOkxWallet","isOKExWallet","isOneInchAndroidWallet","isOneInchIOSWallet","isOpera","isPhantom","isPortal","isRabby","isRainbow","isStatus","isTally","isTokenPocket","isTokenary","isTrust","isTrustWallet","isXDEFI","isZerion"];for(const e of n)window.ethereum[e]&&i.push(e);i.includes("isMetaMask")&&["isApexWallet","isAvalanche","isBitKeep","isBlockWallet","isKuCoinWallet","isMathWallet","isOKExWallet","isOkxWallet","isOneInchAndroidWallet","isOneInchIOSWallet","isOpera","isPhantom","isPortal","isRabby","isTokenPocket","isTokenary","isZerion"].some(n=>i.includes(n))&&i.splice(i.indexOf("isMetaMask"),1)}return i}function r(){const i=[];if("undefined"==typeof window)return i;if(window.solana){const n=["isPhantom","isNufi"];for(const e of n)window.solana[e]&&i.push(e);i.includes("isNufi")&&i.includes("isPhantom")&&i.splice(i.indexOf("isPhantom"),1)}return window.solflare&&i.push("isSolflare"),window.backpack&&i.push("isBackpack"),i}function u(){const i=[];if("undefined"==typeof window)return i;if(window.tron){const n=["isTronLink"];for(const e of n)window.tron[e]&&i.push(e)}return i}e.d(n,{a:()=>t,l:()=>s})}}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[1511],{6323(s,e,n){n.d(e,{n:()=>i});var r=n(1933);function i(s){const e=r.$W.getConfig("disableFingerprintingApis");return Array.isArray(e)&&e.some(e=>String(e).toLowerCase()===s.toLowerCase())}}}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[6504],{701(e,i,n){n.d(i,{m:()=>s});var r=n(6323),t=n(466);function s(e){if((0,r.n)("devicepixelratio"))return 1;try{return(0,t.getFallbackWindow)(e).devicePixelRatio}catch(e){}return 1}}}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[2284],{9556(e,t,n){n.d(t,{G:()=>r});const r='(()=>{"use strict";const e="Prebid Event",t="browserIntervention",n="Prebid Native",r={title:"text",data:"value",img:"url",video:"vasttag"};function i(e,t){return new Promise((n,r)=>{const i=t.createElement("script");i.onload=n,i.onerror=r,i.src=e,t.body.appendChild(i)})}function o(e){return Array.from(e.querySelectorAll(\'iframe[srcdoc*="render"]\'))}function s(e){const t=e.cloneNode(!0);return o(t).forEach(e=>e.parentNode.removeChild(e)),t.innerHTML}function c(e,t,n,r){let o=arguments.length>4&&void 0!==arguments[4]?arguments[4]:i;const{rendererUrl:c,assets:d,ortb:a,adTemplate:l}=t,u=r.document;return c?o(c,u).then(()=>{if("function"!=typeof r.renderAd)throw new Error(`Renderer from \'${c}\' does not define renderAd()`);const e=d||[];return e.ortb=a,r.renderAd(e)}):Promise.resolve(n(l??s(u.body)))}window.render=function(i,d,a){let{adId:l,native:u}=i,{sendMessage:f}=d,v=arguments.length>3&&void 0!==arguments[3]?arguments[3]:c;!function(){const n=window;if("ReportingObserver"in n)try{new n.ReportingObserver(n=>{var r;r=n[0],f(e,{event:t,intervention:r})},{buffered:!0,types:["intervention"]}).observe()}catch(e){}}();const{head:b,body:h}=a.document,m=()=>{h.style.display="none",h.style.display="block",f(n,{action:"resizeNativeHeight",height:h.offsetHeight||a.document.documentElement.scrollHeight,width:h.offsetWidth})};function p(e,t){const n=o(e);Array.from(e.childNodes).filter(e=>!n.includes(e)).forEach(t=>e.removeChild(t)),e.insertAdjacentHTML("afterbegin",t)}const y=function(e,t){let{assets:n=[],ortb:i,nativeKeys:o={}}=t;const s=Object.fromEntries(n.map(e=>{let{key:t,value:n}=e;return[t,n]}));let c=Object.fromEntries(Object.entries(o).flatMap(t=>{let[n,r]=t;const i=s.hasOwnProperty(n)?s[n]:void 0;return[[`##${r}##`,i],[`${r}:${e}`,i]]}));return i&&Object.assign(c,{"##hb_native_linkurl##":i.link?.url,"##hb_native_privacy##":i.privacy},Object.fromEntries((i.assets||[]).flatMap(e=>{const t=Object.keys(r).find(t=>e[t]);return[t&&[`##hb_native_asset_id_${e.id}##`,e[t][r[t]]],e.link?.url&&[`##hb_native_asset_link_id_${e.id}##`,e.link.url]].filter(e=>e)}))),c=Object.entries(c).concat([[/##hb_native_asset_(link_)?id_\\d+##/g]]),function(e){return c.reduce((e,t)=>{let[n,r]=t;return e.replaceAll(n,r||"")},e)}}(l,u);return p(b,y(s(b))),v(l,u,y,a).then(e=>{p(h,e),"function"==typeof a.postRenderAd&&a.postRenderAd({adId:l,...u}),a.document.querySelectorAll(".pb-click").forEach(e=>{const t=e.getAttribute("hb_native_asset_id");e.addEventListener("click",()=>f(n,{action:"click",assetId:t}))}),f(n,{action:"fireNativeImpressionTrackers"}),"complete"===a.document.readyState?m():a.onload=m})}})();'}}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[259],{8258(n,e,t){function o(){const n="undefined"!=typeof window&&window.navigator?window.navigator:"undefined"!=typeof navigator?navigator:null;return n&&(n.connection||n.mozConnection||n.webkitConnection)||null}function a(){const n=o();return n?{type:n.type??null,effectiveType:n.effectiveType??null,downlink:"number"==typeof n.downlink?n.downlink:null,downlinkMax:"number"==typeof n.downlinkMax?n.downlinkMax:null,rtt:"number"==typeof n.rtt?n.rtt:null,saveData:"boolean"==typeof n.saveData?n.saveData:null,bandwidth:"number"==typeof n.bandwidth?n.bandwidth:null}:null}function i(){const n=a();if(!n)return 0;switch(n.type){case"ethernet":return 1;case"wifi":return 2;case"wimax":return 6;default:switch(n.effectiveType){case"slow-2g":case"2g":return 4;case"3g":return 5;case"4g":return 6;case"5g":return 7;default:return"cellular"===n.type?3:0}}}t.d(e,{V:()=>a,Z:()=>i})}}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[4472],{4621(t,e,o){o.d(e,{gl:()=>u,tF:()=>r});var n=o(466),i=o(3958),h=o(8317);const l=function(t){let{w:e,h:o}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};const n=function(t){let{w:e,h:o}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},{width:n,height:i,left:l,top:r,right:u,bottom:f,x:m,y:g}=(0,h.G)(t);return(0===n||0===i)&&e&&o&&(n=e,i=o,u=l+e,f=r+o),{width:n,height:i,left:l,top:r,right:u,bottom:f,x:m,y:g}}(t,{w:e,h:o}),l=function(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:window,e=0,o=0;try{for(;null!=t?.frameElement;){const n=(0,h.G)(t.frameElement);e+=n.left,o+=n.top,t=t.parent}}catch(t){e=0,o=0}return{x:e,y:o}}(t?.ownerDocument?.defaultView);n.left+=l.x,n.right+=l.x,n.top+=l.y,n.bottom+=l.y;const r=(0,i.Ot)(),u=function(t){const e={left:t[0].left,right:t[0].right,top:t[0].top,bottom:t[0].bottom};for(let o=1;o<t.length;++o){if(e.left=Math.max(e.left,t[o].left),e.right=Math.min(e.right,t[o].right),e.left>=e.right)return null;if(e.top=Math.max(e.top,t[o].top),e.bottom=Math.min(e.bottom,t[o].bottom),e.top>=e.bottom)return null}return e.width=e.right-e.left,e.height=e.bottom-e.top,e}([{left:0,top:0,right:r.document.documentElement.clientWidth,bottom:r.document.documentElement.clientHeight},n]);let f,m;return null!==u?(f=u.width*u.height,m=n.width*n.height,f/m*100):0};function r(t){return!(0,n.inIframe)()&&null!==t}function u(t,e,o){return"visible"===e.document.visibilityState?l(t,o):0}}}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[7464],{6685(e,r,n){n.d(r,{k:()=>s,z:()=>i});var a=n(466),t=n(6665);const i=function(e,r){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"";if((0,t.O8)(r)&&r.length>0){const n=r.split("|").filter(e=>e.trim().length>0);r=n.map(e=>e.trim()).join("|"),e.ext.key_val=r}else(0,a.logWarn)(n+"Ignoring param : dctr with value : "+r+", expects string-value, found empty or non-string value")},s=function(e,r){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"";(0,t.cy)(r)?r.forEach(r=>{"string"==typeof r&&r.length>3?(e.pmp||(e.pmp={private_auction:0,deals:[]}),e.pmp.deals.push({id:r})):(0,a.logWarn)(`${n}Error: deal-id present in array bid.params.deals should be a string with more than 3 characters length, deal-id ignored: ${r}`)}):(0,a.logWarn)(`${n}Error: bid.params.deals should be an array of strings.`)}}}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[2630],{4369(e,t,n){n.d(t,{Ay:()=>d});var l=n(1418),s=n(2201),a=n(466),i=n(8014),r=n(1933);const o={ajax:s.RD},c="analyticsLabels",u={internal:{},publisher:{}};let p={};r.$W.getConfig(c,e=>{u.publisher=e[c],p=b()});const b=()=>Object.values(u).reduce((e,t)=>({...e,...t}),{}),g=Object.values(l.qY).filter(e=>e!==l.qY.AUCTION_DEBUG);let y=100;function d(e){let{url:t,analyticsType:n,global:s,handler:r}=e;const u=[];let b,d,f=!1,h=!0;const v=(()=>{let e,t=!1;const n=()=>{if(!t){t=!0;try{let e=0,t=0;for(;u.length>0;){e++;const n=u.length;if(u.shift()(),u.length>=n?t++:t=0,t>=10)return(0,a.logError)("Detected probable infinite loop, discarding events",u),void(u.length=0)}(0,a.logMessage)(`${d} analytics: processed ${e} events`)}finally{t=!1}}};return function(){null!=e&&(clearTimeout(e),e=null),0===y?n():e=setTimeout(n,y)}})();return Object.defineProperties({track:function(e){const{eventType:n,args:l}=e;"bundle"===this.getAdapterType()&&window[s](r,n,l);"endpoint"===this.getAdapterType()&&function(e){let{eventType:n,args:l,callback:s}=e;o.ajax(t,s,JSON.stringify({eventType:n,args:l,labels:p}))}(e)},enqueue:T,enableAnalytics:A,disableAnalytics:function(){Object.entries(b||{}).forEach(e=>{let[t,n]=e;i.AU(t,n)}),this.enableAnalytics=this._oldEnable?this._oldEnable:A,f=!1},getAdapterType:()=>n,getGlobal:()=>s,getHandler:()=>r,getUrl:()=>t},{enabled:{get:()=>f}});function T(e){let{eventType:t,args:n}=e;u.push(()=>{Object.keys(p||[]).length>0&&(n={[c]:p,...n}),this.track({eventType:t,labels:p,args:n})}),v()}function A(e){if(d=e?.provider,h="object"!=typeof e||"object"!=typeof e.options||(void 0===e.options.sampling||Math.random()<parseFloat(e.options.sampling)),h){const t=(()=>{const{includeEvents:t=g,excludeEvents:n=[]}=e||{};return new Set(Object.values(l.qY).filter(e=>t.includes(e)).filter(e=>!n.includes(e)))})();i.kQ().forEach(e=>{if(!e||!t.has(e.eventType))return;const{eventType:n,args:l}=e;T.call(this,{eventType:n,args:l})}),b=Object.fromEntries(Array.from(t).map(e=>{const t=t=>this.enqueue({eventType:e,args:t});return i.on(e,t),[e,t]}))}else(0,a.logMessage)(`Analytics adapter for "${s}" disabled by sampling`);this._oldEnable=this.enableAnalytics,this.enableAnalytics=function(){return(0,a.logMessage)(`Analytics adapter for "${s}" already enabled, unnecessary call to \`enableAnalytics\`.`)},f=!0}}}}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[5698],{1745(t,e,o){function n(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:window;try{const e=t.top.document.querySelector('meta[property="og:title"]');return t.top.document.title||e&&e.content||""}catch(t){const e=document.querySelector('meta[property="og:title"]');return document.title||e&&e.content||""}}function r(){let t,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:window;try{t=e.top.document.querySelector('meta[name="description"]')||e.top.document.querySelector('meta[property="og:description"]')}catch(e){t=document.querySelector('meta[name="description"]')||document.querySelector('meta[property="og:description"]')}return t&&t.content||""}function c(t){return t?.querySelectorAll("*")?.length??-1}o.d(e,{TP:()=>c,Wt:()=>r,wS:()=>n})}}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[3527],{2569(n,e,o){o.d(e,{X:()=>a});const a=function(){return["ethereum","web3","cardano","BinanceChain","solana","tron","tronLink","tronWeb","tronLink","starknet_argentX","walletLinkExtension","coinbaseWalletExtension","__venom","martian","razor","razorWallet","ic","cosmos","ronin","starknet_braavos","XverseProviders","compass","solflare","solflareWalletStandardInitialized","sender","rainbow"].some(n=>void 0!==window[n])?1:0}}}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[2764],{8074(o,e,n){function i(o,e){return function(){const n=document.domain.split("."),i=`_gd${Date.now()}_${e}`;for(let e,t,s=0;s<n.length;s++){const u=n.slice(s).join(".");if(o.setCookie(i,"1",void 0,void 0,u),t=o.getCookie(i),o.setCookie(i,"","Thu, 01 Jan 1970 00:00:01 GMT",void 0,u),"1"!==t)return e;e=u}}}n.d(e,{w:()=>i})}}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[4332],{6427(e,t,s){var r=s(1748),n=s(3556),a=s(9794),i=s(466),d=s(8928),o=s(3435),p=s(6665),c=s(3958),u=s(7464),m=s(2808);const l={code:"adf",aliases:[{code:"adformOpenRTB",gvlid:50},{code:"adform",gvlid:50}],gvlid:50,supportedMediaTypes:[a.s6,a.D4,a.G_],isBidRequestValid:e=>{const t=e.params||{},{mid:s,inv:r,mname:n}=t;return!!(s||r&&n)},buildRequests:(e,t)=>{let s,r;const n=t.ortb2||{},a=n.user||{};"object"==typeof n.app?s=n.app||{}:(r=n.site||{},r.page||(r.page=t.refererInfo.page));const u=n.device||{},{innerWidth:l,innerHeight:v}=(0,c.Ot)();u.w=u.w||l,u.h=u.h||v,u.ua=u.ua||navigator.userAgent;const b=n.source||{};b.fd=1;const f=n.regs||{},y=(0,i.setOnAny)(e,"params.adxDomain")||"adx.adform.net",h=(0,i.setOnAny)(e,"params.pt")||(0,i.setOnAny)(e,"params.priceType")||"net",g=(0,i.setOnAny)(e,"params.test"),A=(0,m.b)(t),I=A&&[A],O=(0,i.setOnAny)(e,"userIdAsEids"),x=(0,i.setOnAny)(e,"ortb2.source.ext.schain");O&&(0,o.J)(a,"ext.eids",O),x&&(0,o.J)(b,"ext.schain",x);const R=e.map((e,t)=>{e.netRevenue=h;const s=e.getFloor?e.getFloor({currency:A||"USD",size:"*",mediaType:"*"}):{},r=s?.floor,n=s?.currency,{mid:a,inv:o,mname:c}=e.params,u=e.ortb2Imp?.ext,m={id:t+1,tagid:a,bidfloor:r,bidfloorcur:n,ext:{...u,bidder:{inv:o,mname:c}}};if(e.nativeOrtbRequest&&e.nativeOrtbRequest.assets){const t=e.nativeOrtbRequest.assets,s=[];for(let e=0;e<t.length;e++){const r=(0,p.Go)(t[e]),n=r.img;if(n){const e=n.ext&&n.ext.aspectratios;if(e){const t=parseInt(e[0].split(":")[0],10),s=parseInt(e[0].split(":")[1],10);n.wmin=n.wmin||0,n.hmin=s*n.wmin/t|0}}s.push(r)}m.native={request:{assets:s}}}const l=(0,d.A)(e,"mediaTypes.banner");if(l&&l.sizes){const e=(0,i.parseSizesInput)(l.sizes).map(e=>{const[t,s]=e.split("x");return{w:parseInt(t,10),h:parseInt(s,10)}});m.banner={format:e}}const v=(0,d.A)(e,"mediaTypes.video");return v&&(m.video=v),m}),w={id:t.bidderRequestId,site:r,app:s,user:a,device:u,source:b,ext:{pt:h},cur:I,imp:R,regs:f};return g&&(w.is_debug=!!g,w.test=1),{method:"POST",url:"https://"+y+"/adx/openrtb",data:JSON.stringify(w),bids:e}},interpretResponse:function(e,t){let{bids:s}=t;if(!e.body)return;const{seatbid:r,cur:n}=e.body,i=(o=r.map(e=>e.bid),[].concat(...o)).reduce((e,t)=>(e[t.impid-1]=t,e),[]);var o;return s.map((e,t)=>{const s=i[t];if(s){const t=(0,d.A)(s,"ext.prebid.type"),r=(0,d.A)(s,"ext.dsa"),i={requestId:e.bidId,cpm:s.price,creativeId:s.crid,ttl:360,netRevenue:"net"===e.netRevenue,currency:n,mediaType:t,width:s.w,height:s.h,dealId:s.dealid,meta:{mediaType:t,advertiserDomains:s.adomain,dsa:r,primaryCatId:s.cat?.[0],secondaryCatIds:s.cat?.slice(1)}};return s.native?i.native={ortb:s.native}:t===a.G_?(i.vastXml=s.adm,s.nurl&&(i.vastUrl=s.nurl)):i.ad=s.adm,e.renderer||t!==a.G_||"outstream"!==(0,d.A)(e,"mediaTypes.video.context")||(i.renderer=u.A4.install({id:e.bidId,url:"https://s2.adform.net/banners/scripts/video/outstream/render.js",adUnitCode:e.adUnitCode}),i.renderer.setRender(v)),i}}).filter(Boolean)}};function v(e){e.renderer.push(()=>{window.Adform.renderOutstream(e)})}(0,n.a$)(l),(0,r.E)("adfBidAdapter")}},e=>{e.O(0,[802,7769,315,1085,9147],()=>{return t=6427,e(e.s=t);var t});e.O()}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[678],{2877(e,t,n){var i=n(1748),r=n(466),o=n(8928),a=n(3556),s=n(1933),c=n(9794),d=n(356);const p="USD",u={image:{required:!0},title:{required:!0},sponsoredBy:{required:!0},clickUrl:{required:!0},body:{required:!1},icon:{required:!1},cta:{required:!1}},l={code:"adyoulike",gvlid:259,supportedMediaTypes:[c.D4,c.s6,c.G_],aliases:["ayl"],isBidRequestValid:function(e){const t=I(h(e)),n=t.width>0&&t.height>0;return e.params&&e.params.placement&&(n||e.mediaTypes&&e.mediaTypes.native)},buildRequests:function(e,t){e=(0,d.Xj)(e);let n,i=!1;const r={Version:"1.0",Bids:e.reduce((e,t)=>{const r=function(e){if((0,o.A)(e,"mediaTypes.banner"))return c.D4;if((0,o.A)(e,"mediaTypes.video"))return c.G_;if((0,o.A)(e,"mediaTypes.native"))return c.s6}(t),a=h(t),s=I(a);e[t.bidId]={},e[t.bidId].PlacementID=t.params.placement,e[t.bidId].TransactionID=t.ortb2Imp?.ext?.tid,e[t.bidId].Width=s.width,e[t.bidId].Height=s.height,e[t.bidId].AvailableSizes=a.join(","),"function"==typeof t.getFloor&&(e[t.bidId].Pricing=function(e,t,n){const i=e.getFloor({currency:p,mediaType:n,size:[t.width,t.height]});if(!isNaN(i?.floor)&&i?.currency===p)return i.floor}(t,s,r));const d=t?.ortb2?.source?.ext?.schain;if(d&&(e[t.bidId].SChain=d),!n&&t.userIdAsEids&&t.userIdAsEids.length&&(n=t.userIdAsEids),r===c.s6){let n=t.mediaTypes.native;"image"===n.type&&(n=Object.assign({},u,n)),n.clickUrl={required:!0},e[t.bidId].Native=n}if(r===c.G_){i=!0,e[t.bidId].Video=t.mediaTypes.video;const n=t.mediaTypes.video.playerSize;Array.isArray(n)&&!Array.isArray(n[0])&&(e[t.bidId].Video.playerSize=[n])}return e},{}),PageRefreshed:m()};t.gdprConsent&&(r.gdprConsent={consentString:t.gdprConsent.consentString,consentRequired:"boolean"==typeof t.gdprConsent.gdprApplies?t.gdprConsent.gdprApplies:null}),t.uspConsent&&(r.uspConsent=t.uspConsent),t.ortb2&&(r.ortb2=t.ortb2),n&&(r.eids=n),r.pbjs_version="10.29.0";const a=JSON.stringify(r);return{method:"POST",url:g(e,t,i),data:a,options:{withCredentials:!0}}},interpretResponse:function(e,t){const n=[];var i={};if(!e||!e.body)return n;try{i=JSON.parse(t.data).Bids}catch(e){}return e.body.forEach(e=>{const t=function(e,t){if(!e||!e.Ad&&!e.Native&&!e.Vast)return;const n=t&&t[e.BidID];n&&(e.Width&&"0"!==e.Width||(e.Width=n.Width),e.Height&&"0"!==e.Height||(e.Height=n.Height));const i={requestId:e.BidID,ttl:3600,creativeId:e.CreativeID,cpm:e.Price,netRevenue:!0,currency:p,meta:e.Meta||{advertiserDomains:[]}},r=e.Vast;r?(i.width=e.Width,i.height=e.Height,i.vastXml=window.atob(r),i.mediaType="video"):n.Native?(i.native=function(e,t){if("object"==typeof e.Native)return e.Native;const n={};var i={},r={};if("string"==typeof e.Ad){i=JSON.parse(e.Ad.match(/\/\*PREBID\*\/(.*)\/\*PREBID\*\//)[1]),r=i.Content.Preview.Text;var a=i.TrackingPrefix+"/pixel?event_kind=IMPRESSION&attempt="+i.Attempt,s=i.TrackingPrefix+"/pixel?event_kind=INSERTION&attempt="+i.Attempt;i.Campaign&&(a+="&campaign="+i.Campaign,s+="&campaign="+i.Campaign),n.clickUrl=i.TrackingPrefix+"/ar?event_kind=CLICK&attempt="+i.Attempt+"&campaign="+i.Campaign+"&url="+encodeURIComponent(i.Content.Landing.Url),i.OnEvents?(n.clickTrackers=v(i.OnEvents.CLICK),n.impressionTrackers=v(i.OnEvents.IMPRESSION),n.javascriptTrackers=v(i.OnEvents.IMPRESSION,!0)):n.impressionTrackers=[],n.impressionTrackers.push(a,s)}return Object.keys(t).forEach(function(a,s){switch(a){case"title":n[a]=r.TITLE;break;case"body":n[a]=r.DESCRIPTION;break;case"cta":n[a]=r.CALLTOACTION;break;case"sponsoredBy":n[a]=i.Content.Preview.Sponsor.Name;break;case"image":const s=t.image.sizes||[];s.length||(s[0]=e.Width||300,s[1]=e.Height||250);const c=y(i,(0,o.A)(i,"Content.Preview.Thumbnail.Image"),s[0],s[1]);c&&(n[a]={url:c,width:s[0],height:s[1]});break;case"icon":const d=t.icon.sizes||[];d.length||(d[0]=50,d[1]=50);const p=y(i,(0,o.A)(i,"Content.Preview.Sponsor.Logo.Resource"),d[0],d[1]);p&&(n[a]={url:p,width:d[0],height:d[1]});break;case"privacyIcon":n[a]=y(i,(0,o.A)(i,"Content.Preview.Credit.Logo.Resource"),25,25);break;case"privacyLink":n[a]=(0,o.A)(i,"Content.Preview.Credit.Url")}}),n}(e,n.Native),i.mediaType="native"):(i.width=e.Width,i.height=e.Height,i.ad=e.Ad);return i}(e,i);t&&n.push(t)}),n},getUserSyncs:function(e,t,n,i,r){if(!e.iframeEnabled)return[];let o="";return n&&(o+="&gdpr="+(n.gdprApplies?1:0),o+="&gdpr_consent="+encodeURIComponent(n.consentString||"")),!0===s.$W.getConfig("coppa")&&(o+="&coppa=1"),i&&(o+="&us_privacy="+encodeURIComponent(i)),r?.gppString&&r?.applicableSections?.length&&(o+="&gpp="+encodeURIComponent(r.gppString),o+="&gpp_sid="+encodeURIComponent(r?.applicableSections?.join(","))),[{type:"iframe",url:`https://visitor.omnitagjs.com/visitor/isync?uid=19340f4f097d16f41f34fc0274981ca4${o}`}]}};function m(){try{if(performance&&performance.navigation)return performance.navigation.type===performance.navigation.TYPE_RELOAD}catch(e){}return!1}function g(e,t,n){const i=function(e){const t=(e||[]).find(e=>e.params.DC);return t?"-"+t.params.DC:""}(e),o=n?"/hb-api/prebid-video/v1":"/hb-api/prebid/v1";return(0,r.buildUrl)({protocol:"https",host:`hb-api${i}.omnitagjs.com`,pathname:o,search:f(t)})}function f(e){const t={};if(e){const n=e.refererInfo;n&&(n.location&&(t.RefererUrl=encodeURIComponent(n.location),n.reachedTop||(t.SafeFrame=!0)),t.PageUrl=encodeURIComponent(n.topmostLocation),t.PageReferrer=encodeURIComponent(n.location));const i=e.ortb2?.site;i&&(t.PageUrl=encodeURIComponent(i.page||n?.topmostLocation),t.PageReferrer=encodeURIComponent(i.ref||n?.location))}const n=e?.refererInfo?.canonicalUrl;return n&&(t.CanonicalUrl=encodeURIComponent(n)),t}function h(e){let t=e.sizes||[];return e.mediaTypes&&e.mediaTypes.banner&&(t=e.mediaTypes.banner.sizes||[]),e.params&&Array.isArray(e.params.size)&&(t=e.params.size,Array.isArray(t[0])||(t=[t])),(0,r.parseSizesInput)(t)}function I(e){const t={},n=e[0];if("string"!=typeof n)return t;const i=n.toUpperCase().split("X"),r=parseInt(i[0],10);r&&(t.width=r);const o=parseInt(i[1],10);return o&&(t.height=o),t}function b(e){return e?"https://blobs.omnitagjs.com/blobs/"+e.substr(16,2)+"/"+e.substr(16)+"/"+e:""}function y(e,t,n,i){let r="";if(t&&t.Kind)switch(t.Kind){case"INTERNAL":r=b(t.Data.Internal.BlobReference.Uid);break;case"EXTERNAL":const o=e.DynamicPrefix;let a=t.Data.External.Url;if(a=a.replace(/\[height\]/i,""+i),a=a.replace(/\[width\]/i,""+n),a.indexOf(o)>=0){const e=/.*url=([^&]*)/gm.exec(a);r=e?e[1]:"",r||(r=b(/.*key=([^&]*)/gm.exec(a)[1]))}else r=a}return r}function v(e,t){const n=[];return e?(e.forEach((e,i)=>{(t&&"JAVASCRIPT_URL"===e.Kind||!t&&"PIXEL_URL"===e.Kind)&&n.push(e.Url)}),n):n}(0,a.a$)(l),(0,i.E)("adyoulikeBidAdapter")}},e=>{e.O(0,[802,7769,315,1085],()=>{return t=2877,e(e.s=t);var t});e.O()}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[5369],{8288(e,t,n){var r=n(1748),i=n(3556),s=n(9794),a=n(466),o=n(8928),d=n(6665),l=n(1933),u=n(1443),c=n(2201),p=n(765);const m=(0,u.vM)({bidderCode:"amx"}),f=/\.com?\.\w{2,4}$/,g=/^\s*<\??(?:vast|xml)/i,b="https://1x1.a-mo.net/",h=b+"hbx/",y=b+"e",C="__amuidpb";function I(e,t){return null==e?[]:e.map(t).reduce((e,t)=>null!=t&&e.concat(t),[])}function v(e){return null!=(t=e.adm)&&g.test(t)?s.G_:s.D4;var t}const S=(e,t)=>null==e||typeof e===t;function A(e){const t=e.hostname.split("."),n=t.slice(t.length-(f.test(e.hostname)?3:2)).join(".");return btoa(n).replace(/=+$/,"")}const w=encodeURIComponent;function _(){try{return m.getDataFromLocalStorage(C)}catch(e){return null}}function T(e){const t=[];return Object.keys(e||{}).forEach(n=>{t.push(w(n)+"="+w(String(e[n])))}),w(t.join("&"))}function x(e){const t={};return(0,a._each)(e,e=>{t[e.bidId]=function(e){const t=(c=e.sizes,p=e.mediaTypes,c.concat((0,o.A)(p,`${s.D4}.sizes`,[])||[]).concat((0,o.A)(p,`${s.G_}.sizes`,[])||[]).sort((e,t)=>t[0]*t[1]-e[0]*e[1])[0]||[0,0]),n=e.mediaType===s.G_||s.G_ in e.mediaTypes,r=n||t[1]>100,i=(0,o.A)(e,"params.tagId"),a=null!=e.params&&"string"==typeof e.params.adUnitId&&""!==e.params.adUnitId?e.params.adUnitId:e.adUnitCode,d=[e.sizes,(0,o.A)(e,`mediaTypes.${s.D4}.sizes`,[])||[],(0,o.A)(e,`mediaTypes.${s.G_}.sizes`,[])||[]],l=(0,o.A)(e,`mediaTypes.${s.G_}`,{})||{},u={au:a,av:r,vd:l,vr:n,ms:d,aw:t[0],ah:t[1],tf:0,sc:e?.ortb2?.source?.ext?.schain||{},f:$(D(e)),rtb:e.ortb2Imp};var c,p;"string"==typeof i&&i.length>0&&(u.i=i);return u}(e)}),t}const U=(e,t)=>(0,a.triggerPixel)(`${h}g_${e}?${(0,a.formatQS)({...t,ts:Date.now(),eid:(0,a.getUniqueIdentifierStr)()})}`);function $(e){return"number"==typeof e&&isFinite(e)&&e>0?e:0}function D(e){if(!(0,d.fp)(e.getFloor))return(0,o.A)(e,"params.floor",0);try{const t=e.getFloor({currency:"USD",mediaType:"*",size:"*",bidRequest:e});return t?.floor}catch(e){return(0,a.logError)("call to getFloor failed: ",e),0}}function q(e,t,n){return(0,o.A)(e,"refererInfo."+t,n)}function O(e,t){if(null==e)return!1;const n=e[t];return null!=n&&(!!("*"===n.bidders||(0,d.cy)(n.bidders)&&-1!==n.bidders.indexOf("amx"))&&(null==n.filter||"include"===n.filter))}function R(){const e=l.$W.getConfig("userSync");if(null==e)return{d:0,l:0,t:0,e:!0};const t={d:e.syncDelay,l:e.syncsPerBidder,t:0,e:e.syncEnabled};return O(e.filterSettings,"all")?(t.t=3,t):(O(e.filterSettings,"iframe")&&(t.t|=2),O(e.filterSettings,"image")&&(t.t|=1),t)}function k(e){return null!=e?.gppConsent?e.gppConsent:e?.ortb2?.regs?.gpp??{gppString:"",applicableSections:""}}function z(e){if(null==e.refererInfo)return{r:"",t:!1,c:"",l:0,s:[]};const t=e.refererInfo;return{r:t.topmostLocation,t:t.reachedTop,l:t.numIframes,s:t.stack,c:t.canonicalUrl}}const j=(e,t)=>!!(e.amx??e[t]??e.standard??{}).allowAlternateBidderCodes,E={code:"amx",gvlid:737,supportedMediaTypes:[s.D4,s.G_],isBidRequestValid:e=>S((0,o.A)(e,"params.endpoint",null),"string")&&S((0,o.A)(e,"params.tagId",null),"string"),buildRequests(e,t){const n=(r=t,(0,a.parseUrl)(r.refererInfo?.topmostLocation||window.location.href));var r;const i=(0,o.A)(e[0],"params.tagId",null),s=(0,o.A)(e[0],"params.testMode",0),d=null!=e[0]?e[0]:{bidderRequestsCount:0,bidderWinsCount:0,bidRequestsCount:0};var u,c;return{data:{a:(0,a.generateUUID)(),B:0,b:n.host,brc:d.bidderRequestsCount||0,bwc:d.bidderWinsCount||0,trc:d.bidRequestsCount||0,tm:(c=s,!0===c||1===c||"true"===c),V:"10.29.0",vg:(0,p.k)(),i:s&&null!=i?i:A(n),l:{},f:.01,cv:"pba1.3.4",st:"prebid",h:screen.height,w:screen.width,gs:(0,o.A)(t,"gdprConsent.gdprApplies",""),gc:(0,o.A)(t,"gdprConsent.consentString",""),gpp:k(t),u:q(t,"page",n.href),do:q(t,"site",n.hostname),re:q(t,"ref"),am:_(),usp:t.uspConsent||"1---",smt:1,d:"",m:x(e),cpp:l.$W.getConfig("coppa")?1:0,fpd2:t.ortb2,tmax:t.timeout,amp:q(t,"isAmp",null),ri:z(t),sync:R(),eids:(u=e.reduce((e,t)=>(null==t||null==t.userIdAsEids||(0,a._each)(t.userIdAsEids,t=>{null!=t&&(e[t.source]=t)}),e),{}),null!=Object.values?Object.values(u):Object.keys(u).map(e=>u[e]))},method:"POST",browsingTopics:!0,url:(0,o.A)(e[0],"params.endpoint","https://prebid.a-mo.net/a/c"),withCredentials:!0}},getUserSyncs(e,t,n,r,i){const s={gdpr_consent:w(n?.consentString||""),gdpr:w(n?.gdprApplies?1:0),us_privacy:w(r||""),gpp:w(i?.gppString||""),gpp_sid:w(i?.applicableSections||"")},o={url:`https://prebid.a-mo.net/isyn?${(0,a.formatQS)(s)}`,type:"iframe"};if(null==t||0===t.length)return e.iframeEnabled?[o]:[];const d=[];let l=!1;return(0,a._each)(t,function(t){let{body:n}=t;null!=n&&null!=n.p&&n.p.hreq&&(0,a._each)(n.p.hreq,function(t){const n=-1!==t.indexOf("__st=iframe")?"iframe":"image";(e.iframeEnabled||"image"===n)&&(l=l||"iframe"===n||-1!==t.indexOf("cchain"),d.push({url:t,type:n}))})}),!l&&d.length<2&&d.push(o),d},interpretResponse(e,t){const n=e.body;if(null==n||"string"==typeof n)return[];n.am&&"string"==typeof n.am&&function(e){try{m.setDataInLocalStorage(C,e)}catch(e){}}(n.am);const{bidderSettings:i}=(0,r.m)(),a=l.$W.getCurrentBidder(),o=j(i??{},a)||j(l.$W.getConfig("bidderSettings")??{},a);return I(Object.keys(n.r),e=>I(n.r[e],n=>n.b.map(n=>{const r=v(n),i=n.adm;if(null==i)return null;const a=function(e,t,n){if(null!=e.w&&e.w>1&&null!=e.h&&e.h>1)return[e.w,e.h];const r=t.m[n];return null==r?[0,0]:[r.aw,r.ah]}(n,t.data,e),d=r===s.D4?240:300,{bc:l,ds:u,dsp:c}=n.ext??{};return{...null!=l&&o?{bidderCode:l}:{},requestId:e,cpm:n.price,width:a[0],height:a[1],creativeId:n.crid,currency:"USD",netRevenue:!0,[r===s.G_?"vastXml":"ad"]:i,meta:{advertiserDomains:n.adomain,mediaType:r,...null!=c?{networkId:c}:{},...null!=u?{demandSource:u}:{}},mediaType:r,ttl:"number"==typeof n.exp?n.exp:d}})).filter(e=>null!=e))},onSetTargeting(e){null!=e&&U("pbst",{A:e.bidder,w:e.width,h:e.height,bid:e.adId,c1:e.mediaType,np:e.cpm,aud:e.requestId,a:e.adUnitCode,c2:T(e.adserverTargeting),cn3:e.timeToRespond})},onTimeout(e){if(null==e||!e.length)return;let t=null;const n=e.map(e=>{const n=e.params||{},r=function(e){return null==e.sizes||0===e.sizes.length?[0,0]:e.sizes[0]}(e),{domain:i,page:s,ref:a}=null!=e.ortb2&&null!=e.ortb2.site?e.ortb2.site:{};return null==t&&(t={do:i,u:s,U:_(),re:a,V:"10.29.0",vg:(0,p.k)()}),{A:e.bidder,mid:n.tagId,a:n.adunitId||e.adUnitCode,bid:e.bidId,n:"g_pbto",aud:e.transactionId,w:r[0],h:r[1],cn:e.timeout,cn2:e.bidderRequestsCount,cn3:e.bidderWinsCount}}),r=JSON.stringify({c:t,e:n});(0,c.hd)(y,{body:r,keepalive:!0,withCredentials:!0,method:"POST"}).catch(e=>{})},onBidWon(e){null!=e&&U("pbwin",{A:e.bidder,w:e.width,h:e.height,bid:e.adId,C:e.mediaType===s.D4?0:1,np:e.cpm,a:e.adUnitCode})}};(0,i.a$)(E),(0,r.E)("amxBidAdapter")}},e=>{e.O(0,[802,7769,315,1085],()=>{return t=8288,e(e.s=t);var t});e.O()}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[6453],{8508(e,r,t){var a=t(1748),n=t(466),i=t(3556),s=t(9794),d=t(1933),u=t(2808),o=t(183),p=t(3367);const c="cointraffic",g=["EUR","USD","JPY","BGN","CZK","DKK","GBP","HUF","PLN","RON","SEK","CHF","ISK","NOK","HRK","RUB","TRY","AUD","BRL","CAD","CNY","HKD","IDR","ILS","INR","KRW","MXN","MYR","NZD","PHP","SGD","THB","ZAR"],l={code:c,supportedMediaTypes:[s.D4],isBidRequestValid:function(e){return!!e.params.placementId},buildRequests:function(e,r){return e.map(e=>{const t=(0,n.parseSizesInput)(e.params.size||e.mediaTypes.banner.sizes),{width:a,height:i}=(0,o.M)(),s=d.$W.getConfig(`currency.bidderCurrencyDefault.${c}`)||(0,u.b)(r)||"EUR";if(-1===g.indexOf(s))return void(0,n.logError)("Currency is not supported - "+s);return{method:"POST",url:"https://apps.adsgravity.io/v1/request/prebid",data:{placementId:e.params.placementId,currency:s,sizes:t,bidId:e.bidId,referer:r.refererInfo.ref,device:{width:a,height:i,user_agent:e.params.ua||navigator.userAgent,dnt:(0,p.l)()?1:0,language:navigator&&navigator.language?-1!==navigator.language.indexOf("-")?navigator.language.split("-")[0]:navigator.language:""}}}}).filter(e=>void 0!==e)},interpretResponse:function(e,r){const t=[],a=e.body;if((0,n.isEmpty)(a))return t;const i={requestId:a.requestId,cpm:a.cpm,currency:a.currency,netRevenue:a.netRevenue,width:a.width,height:a.height,creativeId:a.creativeId,ttl:a.ttl,ad:a.ad,meta:{advertiserDomains:a.adomain&&a.adomain.length?a.adomain:[],mediaType:a.mediaType}};return t.push(i),t}};(0,i.a$)(l),(0,a.E)("cointrafficBidAdapter")}},e=>{e.O(0,[802,7769,315,1085,9147],()=>{return r=8508,e(e.s=r);var r});e.O()}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[8534],{5045(e,t,r){var i=r(1748),a=r(466),s=r(3556);const d={code:"coinzilla",aliases:["czlla"],isBidRequestValid:function(e){return!!e.params.placementId},buildRequests:function(e,t){return 0===e.length?[]:e.map(e=>{const r=(0,a.parseSizesInput)(e.params.size||e.sizes)[0],i=r.split("x")[0],s=r.split("x")[1];return{method:"POST",url:"https://request.czilladx.com/serve/request.php",data:{placementId:e.params.placementId,width:i,height:s,bidId:e.bidId,referer:t.refererInfo.page}}})},interpretResponse:function(e,t){const r=[],i=e.body,a=i.creativeId||0,s=i.width||0,d=i.height||0,n=i.cpm||0;if(0!==s&&0!==d&&0!==n&&0!==a){const e=i.dealid||"",s=i.currency||"EUR",d=void 0===i.netRevenue||i.netRevenue,u=t.data.referer,c={requestId:i.requestId,cpm:n,width:i.width,height:i.height,creativeId:a,dealId:e,currency:s,netRevenue:d,ttl:i.timeout,referrer:u,ad:i.ad,mediaType:i.mediaType,meta:{advertiserDomains:i.advertiserDomain||[]}};r.push(c)}return r}};(0,s.a$)(d),(0,i.E)("coinzillaBidAdapter")}},e=>{e.O(0,[802,7769,315,1085],()=>{return t=5045,e(e.s=t);var t});e.O()}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[8793],{9648(e,n,t){var s=t(1748),i=t(466),a=t(3435),r=t(6665),o=t(1933),p=t(1385),l=t(8034),c=t(3254),u=t(3064),d=t(3965),g=t(9708);let h={},m=null;class C{constructor(e,n){this.message=e,this.args=null==n?[]:[n]}}class v{apiVersion="1.1";static get(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:c.c5;if(null==this.INST){const n=e({apiName:"__gpp",apiArgs:["command","callback","parameter"],mode:c.q4});if(null==n)throw new C("GPP CMP not found");this.INST=new this(n)}return this.INST}#e;#n;#t=[];initialized=!1;constructor(e){this.cmp=e,[this.#e,this.#n]=["resolve","reject"].map(e=>n=>{for(;this.#t.length;)this.#t.pop()[e](n)})}init(e){const n=this.updateWhenReady(e);return this.initialized||(e.gppVersion!==this.apiVersion&&(0,i.logWarn)(`Unrecognized GPP CMP version: ${e.apiVersion}. Continuing using GPP API version ${this.apiVersion}...`),this.initialized=!0,m||(m=(0,g.Al)("gpp")),m.setCmpApi(this.cmp),this.cmp({command:"addEventListener",callback:(e,n)=>{null==n||n?"error"===e?.pingData?.cmpStatus?this.#n(new C('CMP status is "error"; please check CMP setup',e)):this.isCMPReady(e?.pingData||{})&&["sectionChange","signalStatus"].includes(e?.eventName)&&this.#e(this.updateConsent(e.pingData)):this.#n(new C("Received error response from CMP",e)),null==p.ad.getConsentData()||null==e?.pingData||this.isCMPReady(e.pingData)||p.ad.setConsentData(null),null!=e?.listenerId&&m?.setCmpListenerId(e?.listenerId)}})),n}refresh(){return this.cmp({command:"ping"}).then(this.init.bind(this))}updateConsent(e){return new u.U9(n=>{if(null==e||(0,i.isEmpty)(e))throw new C("Received empty response from CMP",e);const t=P(e);(0,i.logInfo)("Retrieved GPP consent from CMP:",t),p.ad.setConsentData(t),n(t)})}nextUpdate(){const e=(0,u.v6)();return this.#t.push(e),e.promise}updateWhenReady(e){return this.isCMPReady(e)?this.updateConsent(e):this.nextUpdate()}isCMPReady(e){return"ready"===e.signalStatus}}const f={iab:function(){return new u.U9(e=>e(v.get().refresh()))}};function P(e){if(null!=e?.applicableSections&&!Array.isArray(e.applicableSections)||null!=e?.gppString&&!(0,r.O8)(e.gppString)||null!=e?.parsedSections&&!(0,r.Qd)(e.parsedSections))throw new C("CMP returned unexpected value during lookup process.",e);return["usnatv1","uscav1"].forEach(n=>{e?.parsedSections?.[n]&&(0,i.logWarn)(`Received invalid section from cmp: '${n}'. Some functionality may not work as expected`,e)}),S(e)}function S(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return{gppString:e?.gppString,applicableSections:e?.applicableSections||[],parsedSections:e?.parsedSections||{},gppData:e}}const y=(0,d.yq)({namespace:"gpp",displayName:"GPP",consentDataHandler:p.ad,parseConsentData:P,getNullConsent:()=>S(null),cmpHandlers:f,cmpEventCleanup:function(){m&&(m.removeCmpEventListener(),m=null),h={},p.ad.reset(),v.INST=null}});o.$W.getConfig("consentManagement",e=>function(e){return h=y(e),h.loadConsentData?.()?.catch?.(()=>null)}(e.consentManagement)),l.wU.before(function(e,n){return e(n.then(e=>{const n=p.ad.getConsentData();return n&&(Array.isArray(n.applicableSections)&&(0,a.J)(e,"regs.gpp_sid",n.applicableSections),(0,a.J)(e,"regs.gpp",n.gppString)),e}))}),(0,s.E)("consentManagementGpp")}},e=>{e.O(0,[802,7769,315,1085,7109,10],()=>{return n=9648,e(e.s=n);var n});e.O()}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[5081],{6264(e,n,t){var s=t(1748),o=t(466),r=t(3435),a=t(6665),i=t(1933),c=t(1385),l=t(2517),p=t(8034),d=t(3254),u=t(3965),g=t(9708);let f,C,m={};const v={iab:function(e){return new Promise((n,t)=>{const s=(0,d.c5)({apiName:"__tcfapi",apiVersion:2,apiArgs:["command","version","callback","parameter"]});s||t(new Error("TCF2 CMP not found.")),s.isDirect?(0,o.logInfo)("Detected CMP API is directly accessible, calling it now..."):(0,o.logInfo)("Detected CMP is outside the current iframe where Prebid.js is located, calling it now..."),b||(b=(0,g.Al)("tcf",()=>c.mW.getConsentData())),b.setCmpApi(s),s({command:"addEventListener",callback:function(s,r){if((0,o.logInfo)("Received a response from CMP",s),r){try{e(D(s))}catch(e){}if(!1===s.gdprApplies||"tcloaded"===s.eventStatus||"useractioncomplete"===s.eventStatus)try{null!==s.listenerId&&void 0!==s.listenerId&&b?.setCmpListenerId(s.listenerId),c.mW.setConsentData(D(s)),n()}catch(e){t(e)}}else t(Error("CMP unable to register callback function.  Please check CMP setup."))}})})}};let b=null;function D(e){if(function(){const n=e&&"boolean"==typeof e.gdprApplies?e.gdprApplies:f,t=e&&e.tcString;return!("boolean"==typeof n&&(!0!==n||t&&(0,a.O8)(t)))}())throw Object.assign(new Error("CMP returned unexpected value during lookup process."),{args:[e]});return P(e)}function P(e){const n={consentString:e?e.tcString:void 0,vendorData:e||void 0,gdprApplies:e&&"boolean"==typeof e.gdprApplies?e.gdprApplies:f,apiVersion:2};return e&&e.addtlConsent&&(0,a.O8)(e.addtlConsent)&&(n.addtlConsent=e.addtlConsent),n}const A=(0,u.yq)({namespace:"gdpr",displayName:"TCF",consentDataHandler:c.mW,cmpHandlers:v,parseConsentData:D,getNullConsent:()=>P(null),cmpEventCleanup:function(){b&&(b.removeCmpEventListener(),b=null),m={},c.mW.reset()}});i.$W.getConfig("consentManagement",e=>function(e){const n=e&&(e.gdpr||e.usp||e.gpp?e.gdpr:e);return null!=n?.consentData?.getTCData&&(n.consentData=n.consentData.getTCData),f=!0===n?.defaultGdprScope,C=!!n?.dsaPlatform,m=A({gdpr:n}),m.loadConsentData?.()?.catch?.(()=>null)}(e.consentManagement)),p.wU.before(function(e,n){return e(n.then(e=>{const n=c.mW.getConsentData();return n&&("boolean"==typeof n.gdprApplies&&(0,r.J)(e,"regs.ext.gdpr",n.gdprApplies?1:0),(0,r.J)(e,"user.ext.consent",n.consentString)),C&&(0,r.J)(e,"regs.ext.dsa.dsarequired",3),e}))}),(0,l.pS)({type:l.S3,name:"gdprAddtlConsent",fn:function(e,n){const t=n.gdprConsent?.addtlConsent;t&&"string"==typeof t&&(0,r.J)(e,"user.ext.ConsentedProvidersSettings.consented_providers",t)}}),(0,s.E)("consentManagementTcf")}},e=>{e.O(0,[802,7769,315,1085,7109,10],()=>{return n=6264,e(e.s=n);var n});e.O()}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[8662],{4957(n,e,t){var o=t(1748),a=t(466),s=t(3435),i=t(6665),c=t(1933),r=t(8668),u=t(1385),l=t(7841),g=t(2592),f=t(8034),d=t(3254);const m="iab";let p,P,v=m,S=50,b=!1;const D={iab:function(n){let{onSuccess:e,onError:t}=n;const o=function(){const n={};return{consentDataCallback:(o,a)=>{a&&o.uspString&&(n.usPrivacy=o.uspString),n.usPrivacy?U(n,{onSuccess:e,onError:t}):t("Unable to get USP consent string.")}}}(),s=(0,d.c5)({apiName:"__uspapi",apiVersion:1,apiArgs:["command","version","callback"]});if(!s)return t("USP CMP not found.");s.isDirect?(0,a.logInfo)("Detected USP CMP is directly accessible, calling it now..."):(0,a.logInfo)("Detected USP CMP is outside the current iframe where Prebid.js is located, calling it now...");s({command:"getUSPData",callback:o.consentDataCallback}),s({command:"registerDeletion",callback:(n,e)=>(null==e||e)&&r.Ay.callDataDeletionRequest(n)}).catch(n=>{(0,a.logError)("Error invoking CMP `registerDeletion`:",n)})},static:function(n){let{onSuccess:e,onError:t}=n;U(p,{onSuccess:e,onError:t})}};function y(n){let e=null,t=!1;function o(o,a){if(null!=e&&clearTimeout(e),t=!0,u.t6.setConsentData(o),null!=n){for(var s=arguments.length,i=new Array(s>2?s-2:0),c=2;c<s;c++)i[c-2]=arguments[c];n(a,...i)}}if(!D[v])return void o(null,`USP framework (${v}) is not a supported framework. Aborting consentManagement module and resuming auction.`);const a={onSuccess:o,onError:function(n){for(var e=arguments.length,t=new Array(e>1?e-1:0),a=1;a<e;a++)t[a-1]=arguments[a];o(null,`${n} Resuming auction without consent data as per consentManagement config.`,...t)}};D[v](a),t||(0===S?U(void 0,a):e=setTimeout(a.onError.bind(null,"USPAPI workflow exceeded timeout threshold."),S))}const h=(0,l.Ak)("usp",function(n,e){var t=this;b||w(),y(function(o){if(null!=o){for(var s=arguments.length,i=new Array(s>1?s-1:0),c=1;c<s;c++)i[c-1]=arguments[c];(0,a.logWarn)(o,...i)}n.call(t,e)})});function U(n,e){let{onSuccess:t,onError:o}=e;!n||!n.usPrivacy?o("USPAPI returned unexpected value during lookup process.",n):(!function(n){n&&n.usPrivacy&&(P=n.usPrivacy)}(n),t(P))}function w(){let n=arguments.length>0&&void 0!==arguments[0]&&arguments[0];b||((0,a.logInfo)("USPAPI consentManagement module has been activated"+(n?"":` using default values (api: '${v}', timeout: ${S}ms)`)),b=!0,u.t6.enable()),y()}c.$W.getConfig("consentManagement",n=>function(n){(n=n&&n.usp)&&"object"==typeof n||(0,a.logWarn)("consentManagement.usp config not defined, using defaults"),n&&(0,i.O8)(n.cmpApi)?v=n.cmpApi:(v=m,(0,a.logInfo)(`consentManagement.usp config did not specify cmpApi. Using system default setting (${m}).`)),n&&(0,i.Et)(n.timeout)?S=n.timeout:(S=50,(0,a.logInfo)("consentManagement.usp config did not specify timeout. Using system default setting (50).")),"static"===v&&((0,i.Qd)(n.consentData)&&(0,i.Qd)(n.consentData.getUSPData)?(n.consentData.getUSPData.uspString&&(p={usPrivacy:n.consentData.getUSPData.uspString}),S=0):(0,a.logError)("consentManagement config with cmpApi: 'static' did not specify consentData. No consents will be available to adapters.")),w(!0)}(n.consentManagement)),(0,g.Yn)("requestBids").before(h,50),f.wU.before(function(n,e){return n(e.then(n=>{const e=u.t6.getConsentData();return e&&(0,s.J)(n,"regs.ext.us_privacy",e),n}))}),(0,o.E)("consentManagementUsp")}},n=>{n.O(0,[802,7769,315,1085,7109],()=>{return e=4957,n(n.s=e);var e});n.O()}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[931],{6938(e,t,o){var n=o(1748),r=o(466),i=o(2201),a=o(867),s=o(2592),c=o(1443),d=o(736),l=o(1385);const p="criteo",g=(0,c.vM)({moduleType:d.fW,moduleName:p}),u="cto_bidid",m="cto_bundle",b="html5",I="cookie",y=new Date(0).toString(),f=new Date((0,r.timestamp)()+33696e6).toString();function S(e){let t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];const o=(0,r.parseUrl)(e,{noDecodeWholeURL:!0});return t?`${o.hostname}`:`${o.protocol}://${o.hostname}${o.port?":"+o.port:""}/`}function h(e,t){return e?.storage?.type===b?g.getDataFromLocalStorage(t):e?.storage?.type===I?g.getCookie(t):g.getCookie(t)||g.getDataFromLocalStorage(t)}function C(e,t,o,n){t&&o&&(e?.storage?.type===b?g.setDataInLocalStorage(t,o):(e?.storage?.type===I||g.setDataInLocalStorage(t,o),U(t,o,f,n,!0)))}function U(e,t,o,n,r){const i=n.split(".");for(let n=0;n<i.length;++n){const a=i.slice(i.length-n-1,i.length).join(".");try{if(g.setCookie(e,t,o,null,"."+a),r){const o=g.getCookie(e);if(o&&o===t)break}}catch(e){}}}function v(e,t,o){const n=(void 0===e?.storage?.type||e?.storage?.type===I)&&g.cookiesAreEnabled(),s=(void 0===e?.storage?.type||e?.storage?.type===b)&&g.localStorageIsEnabled(),c=S((0,a.EN)().page),d=S(document.location.href,!0),p="undefined"!=typeof criteo_pubtag,f=function(e,t,o,n,r,i,a){let s="https://gum.criteo.com/sid/json?origin=prebid"+(e?"&topUrl="+encodeURIComponent(e):"")+(t?"&domain="+encodeURIComponent(t):"")+(o?"&bundle="+encodeURIComponent(o):"")+(n?"&info="+encodeURIComponent(n):"")+(r?"&cw=1":"")+(a?"&pbt=1":"")+(i?"&lsw=1":"");const c=l.t6.getConsentData();c&&(s+=`&us_privacy=${encodeURIComponent(c)}`);const d=l.mW.getConsentData();d&&(s=s+""+(d.consentString?"&gdprString="+encodeURIComponent(d.consentString):""),s=s+"&gdpr="+(!0===d.gdprApplies?1:0));const p=l.ad.getConsentData();return p&&(s=s+""+(p.gppString?"&gpp="+encodeURIComponent(p.gppString):""),s=s+""+(p.applicableSections?"&gpp_sid="+encodeURIComponent(p.applicableSections):"")),s}(c,d,t.bundle,t.dnaBundle,n,s,p),h={success:t=>{const n=JSON.parse(t);if(n.pixels&&n.pixels.forEach(t=>function(e,t,o){o.writeBundleInStorage&&o.bundlePropertyName&&o.storageKeyName?(0,i.RD)(o.pixelUrl,{success:n=>{if(n){const r=JSON.parse(n);r&&r[o.bundlePropertyName]&&C(e,o.storageKeyName,r[o.bundlePropertyName],t)}},error:e=>{(0,r.logError)("criteoIdSystem: unable to sync user id",e)}},void 0,{method:"GET",withCredentials:!0}):(0,r.triggerPixel)(o.pixelUrl)}(e,d,t)),n.acwsUrl){("string"==typeof n.acwsUrl?[n.acwsUrl]:n.acwsUrl).forEach(e=>(0,r.triggerPixel)(e))}else n.bundle&&C(e,m,n.bundle,d);if(n.bidId){C(e,u,n.bidId,d);const t={criteoId:n.bidId};o(t)}else U(a=u,"",y,d,!0),g.removeDataFromLocalStorage(a),o();var a},error:e=>{(0,r.logError)("criteoIdSystem: unable to sync user id",e),o()}};(0,i.RD)(f,h,void 0,{method:"GET",contentType:"application/json",withCredentials:!0})}const D={name:p,gvlid:91,decode:e=>e,getId(e){const t=function(e){return{bundle:h(e,m),dnaBundle:h(e,"cto_dna_bundle"),bidId:h(e,u)}}(e);return{id:t.bidId?{criteoId:t.bidId}:void 0,callback:o=>v(e,t,o)}},eids:{criteoId:{source:"criteo.com",atype:1}}};(0,s.bz)("userId",D),(0,n.E)("criteoIdSystem")}},e=>{e.O(0,[802,7769,315,1085],()=>{return t=6938,e(e.s=t);var t});e.O()}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[5538],{6081(e,t,r){var i=r(1748),d=r(611),s=r(4603),o=r(3556),a=r(1933),p=r(9794),n=r(7464),u=r(1443),b=r(466),l=r(8928),m=r(3435);const c="equativ",h="Equativ:";let v=[],f={},g=0,y={};function q(e){return!(e.mediaTypes.video&&"{}"===JSON.stringify(e.mediaTypes.video)||e.mediaTypes.native&&"{}"===JSON.stringify(e.mediaTypes.native))}const I=(0,u.vM)({bidderCode:c}),x={code:c,gvlid:45,supportedMediaTypes:[p.D4,p.G_,p.s6],buildRequests:(e,t)=>{if(0===e.filter(q).length)return void(0,b.logError)(`${h} No useful bid requests to process. No requests will be sent.`,e);const r=[];return e.forEach(e=>{const i=A.toORTB({bidRequests:[e],bidderRequest:t});r.push({data:i,method:"POST",url:"https://ssb-global.smartadserver.com/api/bid?callerId=169"})}),r},interpretResponse:(e,t)=>(t.data?.imp?.length&&t.data.imp.forEach(e=>{e.id=f[e.id]}),e.body?.seatbid?.length&&e.body.seatbid.filter(e=>e?.bid?.length).forEach(e=>e.bid.forEach(e=>{e.impid=f[e.impid],(0,l.A)(e,"ext.feedback_token")&&(y[e.impid]=e.ext.feedback_token),e.ttl="number"==typeof e.exp&&e.exp>0?e.exp:300})),A.fromORTB({request:t.data,response:e.body})),isBidRequestValid:e=>!!((0,l.A)(e,"params.networkId")||(0,l.A)(e,"ortb2.site.publisher.id")||(0,l.A)(e,"ortb2.app.publisher.id")||(0,l.A)(e,"ortb2.dooh.publisher.id")),getUserSyncs:(e,t,r)=>(0,s.Wz)(e,t,r,g,I)},A=(0,d.A)({context:{netRevenue:!0,ttl:300},bidResponse(e,t,r){const{bidRequest:i}=r,d=e(t,r);if(d.mediaType===p.G_&&"outstream"===i.mediaTypes.video.context){const e=n.A4.install({adUnitCode:i.adUnitCode,id:i.bidId,url:"https://apps.sascdn.com/diff/video-outstream/equativ-video-outstream.js"});e.setRender(e=>{e.renderer.push(()=>{window.EquativVideoOutstream.renderAd({slotId:e.adUnitCode,vast:e.vastUrl||e.vastXml})})}),d.renderer=e}return d},imp(e,t,r){const i=e(t,r),{siteId:d,pageId:s,formatId:o}=t.params;delete i.dt,i.secure=1,i.tagid=t.adUnitCode,!(0,l.A)(t,"ortb2Imp.rwdd")&&(0,l.A)(t,"mediaTypes.video.ext.rewarded")&&(0,b.mergeDeep)(i,{rwdd:t.mediaTypes.video.ext.rewarded});const a={...d&&{siteId:d},...s&&{pageId:s},...o&&{formatId:o}};return Object.keys(a).length&&(0,b.mergeDeep)(i.ext,{bidder:a}),i},request(e,t,r,i){const d=i.bidRequests[0],o=a.$W.getConfig("currency.adServerCurrency")||"USD";let p=e((0,s.Fd)(t,d,o,f,"eqtv"),r,i),n=["ortb2.site.publisher","ortb2.app.publisher","ortb2.dooh.publisher"].find(e=>(0,l.A)(d,e))||"ortb2.site.publisher";g=(0,l.A)(d,n+".id")||d.params.networkId,(0,m.J)(p,n.replace("ortb2.","")+".id",g),[{path:"mediaTypes.video",props:["mimes","placement"]},{path:"ortb2Imp.audio",props:["mimes"]},{path:"mediaTypes.native.ortb",props:["privacy","plcmttype","eventtrackers"]}].forEach(e=>{let{path:t,props:r}=e;(0,l.A)(d,t)&&r.forEach(e=>{(0,l.A)(d,`${t}.${e}`)||(0,b.logWarn)(`${h} Property "${t}.${e}" is missing from request. Request will proceed, but the use of "${e}" is strongly encouraged.`,d)})});const u=I.getDataFromLocalStorage(s.mN);return u&&(0,m.J)(p,"user.buyeruid",u),(0,m.J)(p,"ext.equativprebidjsversion","10.29.0"),p=function(e){return e?.ext?.prebid?.previousauctioninfo&&(e.ext.prebid.previousauctioninfo.forEach(e=>{y[e?.bidId]&&(v.push({feedback_token:y[e.bidId],loss:e.bidderCpm===e.highestBidCpm?0:102,price:e.highestBidCpm}),delete y[e.bidId])}),delete e.ext.prebid),v.length&&((0,m.J)(e,"ext.bid_feedback",v[0]),v.shift()),e}(p),p}});(0,o.a$)(x),(0,i.E)("equativBidAdapter")}},e=>{e.O(0,[802,7769,315,1085,8498,467,4577],()=>{return t=6081,e(e.s=t);var t});e.O()}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[5594],{1337(e,n,r){var t=r(1748),o=r(466),i=r(8928),s=r(2592),u=r(1443),d=r(736),a=r(770);const l="euid",p=`PrebidJS-10.29.0-EUIDModule-${a.kz}`,c="EUID: ";function f(e,n){return function(){for(var r=arguments.length,t=new Array(r),o=0;o<r;o++)t[o]=arguments[o];e(n+" ",...t)}}const g=f(o.logInfo,c),v=f(o.logWarn,c),m=(0,u.vM)({moduleType:d.fW,moduleName:l});const k={name:l,gvlid:21,decode(e){const n=function(e){if("string"==typeof e){g("Found server-only token. Refresh is unavailable for this token.");return{euid:{id:e}}}if("optout"===e.latestToken)return g("Found optout token.  Refresh is unavailable for this token."),{euid:{optout:!0}};if(Date.now()<e.latestToken.identity_expires)return{euid:{id:e.latestToken.advertising_token}};return null}(e);return g("EUID decode returned",n),n},getId(e,n){if(!0!==n?.gdpr?.gdprApplies)return void(0,o.logWarn)("EUID is intended for use within the EU. The module will not run when GDPR does not apply.");if(!function(e){const n=!0===e?.gdprApplies,r=(0,i.A)(e,"vendorData.purpose.consents.1"),t=(0,i.A)(e,`vendorData.vendor.consents.${21..toString()}`);return!!(!n||r&&t)}(n?.gdpr))return void v("Unable to use EUID module due to insufficient consent. The EUID module requires storage permission.");const r={apiBaseUrl:e?.params?.euidApiBase??"https://prod.euid.eu",paramToken:e?.params?.euidToken,serverCookieName:e?.params?.euidCookie,storage:e?.params?.storage??"localStorage",clientId:p,internalStorage:"__euid_advertising_token"};r.cstg={serverPublicKey:e?.params?.serverPublicKey,subscriptionId:e?.params?.subscriptionId,...(0,a.E0)(e?.params??{})},g("EUID configuration loaded and mapped.",r);const t=(0,a.wq)(r,m,g,v);return g("EUID getId returned",t),t},eids:{euid:{source:"euid.eu",atype:3,getValue:function(e){return e.id}}}};(0,s.bz)("userId",k),(0,t.E)("euidIdSystem")}},e=>{e.O(0,[802,7769,315,1085,1912],()=>{return n=1337,e(e.s=n);var n});e.O()}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[3926],{4421(e,t,n){var r=n(1748),i=n(3556),o=n(9794),s=n(466),d=n(6665),a=n(3958),u=n(701),p=n(2201),c=n(8317),l=n(3824);const h=e=>"https://api.hypelab.com"+e;const m={code:"hypelab",supportedMediaTypes:[o.D4],aliases:["hype"],isBidRequestValid:function(e){return!!e.params?.property_slug&&!!e.params?.placement_slug},buildRequests:function(e,t){return e.map(e=>{const n=(e.userIdAsEids||[]).reduce((e,t)=>[...e,...t.uids.map(e=>e.id)],[]),r=n[0]?n[0]:"tmp_"+(0,s.generateUUID)(),i=function(e,t){if(!(0,d.fp)(e.getFloor))return e.params.bidFloor?e.params.bidFloor:null;let n;const r=e.getFloor({currency:"USD",mediaType:"banner",size:1===t.length?t[0]:"*"});(0,d.Qd)(r)&&"USD"===r.currency&&!isNaN(parseFloat(r.floor))&&(n=parseFloat(r.floor));return n}(e,e.sizes||[]),o="undefined"!=typeof window?(0,u.m)(window):1,p=(0,l.l)(),m=(0,l.a)(),f=(0,a.Ot)(),g=[Math.max(f?.document.documentElement.clientWidth||0,f?.innerWidth||0),Math.max(f?.document.documentElement.clientHeight||0,f?.innerHeight||0)],b=function(e){const t=document.getElementById(e);if(!t)return null;const n=(0,c.G)(t);return[n.left,n.top]}(e.adUnitCode),y={property_slug:e.params.property_slug,placement_slug:e.params.placement_slug,provider_version:"0.0.3",provider_name:"prebid",location:t.refererInfo?.page||"undefined"!=typeof window?window.location.href:"",sdk_version:"10.29.0",sizes:e.sizes,wids:[],floor:i,dpr:o,uuid:r,bidRequestsCount:e.bidRequestsCount,bidderRequestsCount:e.bidderRequestsCount,bidderWinsCount:e.bidderWinsCount,wp:p,wpfs:m,vp:g,pp:b};return{method:"POST",url:h("/v1/prebid_requests"),options:{contentType:"application/json",withCredentials:!0},data:y,bidId:e.bidId}})},interpretResponse:function(e,t){const{data:n}=e.body;if(!n.cpm||!n.html)return[];const r=function(e){if(!e||!e.creative_set)return{width:0,height:0};const t=e.creative_set.video||e.creative_set.image||{};return{width:t.width,height:t.height}}(n);return[{requestId:t.bidId,cpm:n.cpm,width:r.width,height:r.height,creativeId:n.creative_set_slug,currency:n.currency,netRevenue:!0,referrer:t.data.location,ttl:n.ttl,ad:n.html,mediaType:e.body.data.media_type,meta:{advertiserDomains:n.advertiser_domains||[]}}]},onTimeout:function(e){this.report("timeout",e)},onBidWon:function(e){this.report("bidWon",e)},onSetTargeting:function(e){this.report("setTargeting",e)},onBidderError:function(e){this.report("bidderError",e)},report:function(e,t){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"";if(!n)return;const r={type:e,data:t};(0,p.RD)(h(n),null,r,{method:"POST",contentType:"application/json",withCredentials:!0})},REPORTING_ROUTE:"a"};(0,i.a$)(m),(0,r.E)("hypelabBidAdapter")}},e=>{e.O(0,[802,7769,315,1085,2316,5783,1511,6504],()=>{return t=4421,e(e.s=t);var t});e.O()}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[6497],{4640(e,t,r){var n=r(1748),i=r(466),o=r(8928),s=r(3435),a=r(6665),d=r(2201),c=r(2592),g=r(867),u=r(1443),p=r(736),l=r(3064),h=r(5049);const f="id5id",w="User ID - ID5 submodule: ",m="id5-sync.com",b=(0,u.vM)({moduleType:p.fW,moduleName:"id5Id"}),v={id5id:{getValue:function(e){return e.uid},source:m,atype:1,getUidExt:function(e){if(e.ext)return e.ext}},euid:{getValue:function(e){return e.uid},getSource:function(e){return e.source},atype:3,getUidExt:function(e){if(e.ext)return e.ext}},trueLinkId:{getValue:function(e){return e.uid},getSource:function(){return"true-link-id5-sync.com"},atype:1,getUidExt:function(e){if(e.ext)return e.ext}}},y={name:"id5Id",gvlid:131,decode(e,t){const r=C(e,t.params);return this._decodeResponse(r||e,t)},_decodeResponse(e,t){if(e&&void 0!==e.ids){const r={},n={};return Object.entries(e.ids).forEach(e=>{let[t,i]=e;const o=i.eid,s=o?.uids?.[0];r[t]={uid:s?.id,ext:s?.ext},n[t]=function(){return o}}),this.eids=n,x(e,t),r}let r,n,d={};if(!e||"string"!=typeof e.universal_uid)return;r=e.universal_uid,d=e.ext||d,n=e.publisherTrueLinkId,this.eids=v;const c={id5id:{uid:r,ext:d}};(0,a.Qd)(d.euid)&&(c.euid={uid:d.euid.uids[0].id,source:d.euid.source,ext:{provider:m}}),n&&(c.trueLinkId={uid:n});switch((0,o.A)(e,"ab_testing.result")){case"control":(0,i.logInfo)(w+"A/B Testing - user is in the Control Group: ID5 ID is NOT exposed"),(0,s.J)(c,"id5id.ext.abTestingControlGroup",!0);break;case"error":(0,i.logError)(w+"A/B Testing ERROR! controlGroupPct must be a number >= 0 and <= 1");break;case"normal":(0,i.logInfo)(w+"A/B Testing - user is NOT in the Control Group"),(0,s.J)(c,"id5id.ext.abTestingControlGroup",!1)}return(0,i.logInfo)(w+"Decoded ID",c),x(e,t),c},getId(e,t,r){if(!function(e){if(!e||!e.params||!e.params.partner)return(0,i.logError)(w+"partner required to be defined"),!1;const t=e.params.partner;if("string"==typeof t||t instanceof String){const r=parseInt(t);if(isNaN(r)||r<0)return(0,i.logError)(w+"partner required to be a number or a String parsable to a positive integer"),!1;e.params.partner=r}else if("number"!=typeof t)return(0,i.logError)(w+"partner required to be a number or a String parsable to a positive integer"),!1;if(!e.storage||!e.storage.type||!e.storage.name)return(0,i.logError)(w+"storage required to be set"),!1;e.storage.name!==f&&(0,i.logWarn)(w+`storage name recommended to be '${f}'.`);return!0}(e))return;if(!D(t?.gdpr))return void(0,i.logInfo)(w+"Skipping ID5 local storage write because no consent given.");return{callback:function(n){new I(e,t?.gdpr,r,t?.usp,t?.gpp).execute().then(t=>{n(function(e,t,r){let n={};(0,a.Qd)(r)&&(void 0!==r.universal_uid||(0,a.Qd)(r.pbjs))&&Object.assign(n,(0,a.Go)(r));Object.assign(n,(0,a.Go)(e)),n.signature=e.signature,(0,a.Qd)(n.pbjs)||(n.pbjs={});return n.pbjs[t.partner]=(0,a.Go)(e),n}(t,e.params,r))}).catch(e=>{(0,i.logError)(w+"getId fetch encountered an error",e),n()})}}},extendId(e,t,r){if(!D(t?.gdpr))return(0,i.logInfo)(w+"No consent given for ID5 local storage writing, skipping nb increment."),{id:r};if(C(r,e.params)){(0,i.logInfo)(w+"using cached ID",r);const t=(0,a.Go)(r),n=C(t,e.params);return n.nbPage=E(n),{id:t}}return(0,i.logInfo)(w+" refreshing ID.  Cached object does not have ID for partner",r),this.getId(e,t,r)},primaryIds:["id5id","trueLinkId"],eids:v,_reset(){this.eids=v}};class I{constructor(e,t,r,n,i){this.submoduleConfig=e,this.gdprConsentData=t,this.cacheIdObj=(0,a.Qd)(r?.pbjs)?r.pbjs[e.params.partner]:r,this.usPrivacyData=n,this.gppData=i}async execute(){const e=this.#e();if(!this.#t())return this.#r(e);try{return await this.#n(e)}catch(t){return(0,i.logError)(w+"Error while performing ID5 external module flow. Continuing with regular flow.",t),this.#r(e)}}#t(){return"string"==typeof this.submoduleConfig.params.externalModuleUrl}async#n(e){await async function(e){return new l.U9((t,r)=>{if(window.id5Prebid)t();else try{(0,h.R)(e,p.fW,"id5",t)}catch(e){r(e)}})}(this.submoduleConfig.params.externalModuleUrl);const t=await e;return this.#i().fetchId5Id(t,this.submoduleConfig.params,(0,g.EN)(),this.gdprConsentData,this.usPrivacyData,this.gppData)}#i(){return window.id5Prebid&&window.id5Prebid.integration}async#r(e){const t=await e,r=await this.#o(t.extensionsCall),n=await this.#s(t.fetchCall,r);return this.#a(n)}async#e(){const e=this.submoduleConfig.params.configUrl||"https://id5-sync.com/api/config/prebid",t=await(0,d.hd)(e,{method:"POST",body:JSON.stringify({...this.submoduleConfig,bounce:!0}),credentials:"include"});if(!t.ok)throw new Error("Error while calling config endpoint: ",t);const r=await t.json();return(0,i.logInfo)(w+"config response received from the server",r),r}async#o(e){if(void 0===e)return;const t=e.url,r=e.method||"GET",n="GET"===r?void 0:JSON.stringify(e.body||{}),o=await(0,d.hd)(t,{method:r,body:n});if(!o.ok)throw new Error("Error while calling extensions endpoint: ",o);const s=await o.json();return(0,i.logInfo)(w+"extensions response received from the server",s),s}async#s(e,t){const r=e.url,n=e.overrides||{},o=JSON.stringify({...this.#d(),...n,extensions:t}),s=await(0,d.hd)(r,{method:"POST",body:o,credentials:"include"});if(!s.ok)throw new Error("Error while calling fetch endpoint: ",s);const a=await s.json();return(0,i.logInfo)(w+"fetch response received from the server",a),a}#d(){const e=this.submoduleConfig.params,t=this.gdprConsentData&&"boolean"==typeof this.gdprConsentData.gdprApplies&&this.gdprConsentData.gdprApplies?1:0,r=(0,g.EN)(),n=this.cacheIdObj?this.cacheIdObj.signature:void 0,o=E(this.cacheIdObj),s=window.id5Bootstrap?window.id5Bootstrap.getTrueLinkInfo():{booted:!1},a={partner:e.partner,gdpr:t,nbPage:o,o:"pbjs",tml:r.topmostLocation,ref:r.ref,cu:r.canonicalUrl,top:r.reachedTop?1:0,u:r.stack[0]||window.location.href,v:"10.29.0",storage:this.submoduleConfig.storage,localStorage:b.localStorageIsEnabled()?1:0,true_link:s};!t||void 0===this.gdprConsentData.consentString||(0,i.isEmpty)(this.gdprConsentData.consentString)||(0,i.isEmptyStr)(this.gdprConsentData.consentString)||(a.gdpr_consent=this.gdprConsentData.consentString),void 0===this.usPrivacyData||(0,i.isEmpty)(this.usPrivacyData)||(0,i.isEmptyStr)(this.usPrivacyData)||(a.us_privacy=this.usPrivacyData),this.gppData&&(a.gpp_string=this.gppData.gppString,a.gpp_sid=this.gppData.applicableSections),void 0===n||(0,i.isEmptyStr)(n)||(a.s=n),void 0===e.pd||(0,i.isEmptyStr)(e.pd)||(a.pd=e.pd),void 0===e.provider||(0,i.isEmptyStr)(e.provider)||(a.provider=e.provider);const d=e.abTesting||{enabled:!1};return d.enabled&&(a.ab_testing={enabled:!0,control_group_pct:d.controlGroupPct}),a}#a(e){try{e.privacy&&window.id5Bootstrap&&window.id5Bootstrap.setPrivacy&&window.id5Bootstrap.setPrivacy(e.privacy)}catch(e){(0,i.logError)(w+"Error while writing privacy info into local storage.",e)}return e}}function E(e){return e&&void 0!==e.nbPage?e.nbPage+1:1}function x(e,t){const r=e.tags;r&&(t.params.gamTargetingPrefix&&(window.googletag=window.googletag||{cmd:[]},window.googletag.cmd=window.googletag.cmd||[],window.googletag.cmd.push(()=>{for(const e in r)window.googletag.setConfig({targeting:{[t.params.gamTargetingPrefix+"_"+e]:r[e]}})})),t.params.exposeTargeting&&!(0,i.deepEqual)(window.id5tags?.tags,r)&&(window.id5tags=window.id5tags||{cmd:[]},window.id5tags.cmd=window.id5tags.cmd||[],window.id5tags.cmd.forEach(e=>{setTimeout(()=>e(r),0)}),window.id5tags.cmd.push=function(e){e(r),Array.prototype.push.call(window.id5tags.cmd,e)},window.id5tags.tags=r))}function D(e){const t=e&&"boolean"==typeof e.gdprApplies&&e.gdprApplies,r=(0,o.A)(e,"vendorData.purpose.consents.1"),n=(0,o.A)(e,`vendorData.vendor.consents.${131..toString()}`);return!(t&&(!r||!n))}function C(e,t){if(e?.pbjs&&(0,a.Qd)(e.pbjs))return e.pbjs[t.partner]}(0,c.bz)("userId",y),(0,n.E)("id5IdSystem")}},e=>{e.O(0,[802,7769,315,1085],()=>{return t=4640,e(e.s=t);var t});e.O()}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[8710],{8917(e,n,i){var s=i(1748),r=i(1852),t=i(356),v=i(3006),a=i(9556),b=i(5144);r.vd.before(function(e,n,i){(0,t.l6)(n)?e.bail({native:(0,t.Gg)(n,v.n.index.getAdUnit(n))}):e(n,i)}),b.kj.before(function(e,n){(0,t.l6)(n)?e.bail(a.G):e(n)}),(0,s.E)("nativeRendering")}},e=>{e.O(0,[802,7769,315,1085,2284],()=>{return n=8917,e(e.s=n);var n});e.O()}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[9831],{9174(e,o,r){var a=r(1748),t=r(2592),n=r(1443),i=r(466),l=r(736);const s="pairId",d="pairId",c=(0,n.vM)({moduleType:l.fW,moduleName:s});function p(e){return c.localStorageIsEnabled()?c.getDataFromLocalStorage(e):null}function f(e){return c.cookiesAreEnabled()?c.getCookie(e):null}const g={name:s,gvlid:755,decode:e=>e&&Array.isArray(e)?{pairId:e}:void 0,getId(e){const o=p(d)||f(d);let r=[];if(o&&"string"==typeof o)try{r=r.concat(JSON.parse(atob(o)))}catch(e){(0,i.logInfo)(e)}const a=e&&e.params||{};if(a&&a.liveramp){const e=a.liveramp.storageKey||"_lr_pairId",o=p(e)||f(e);if(o)try{const e=atob(o);if(e){const o=JSON.parse(e);o&&"object"==typeof o&&o.envelope?r=r.concat(o.envelope):(0,i.logInfo)("Pairid: Parsed object is not valid or does not contain envelope")}else(0,i.logInfo)("Pairid: Decoded value is empty")}catch(e){(0,i.logInfo)("Pairid: Error parsing JSON: ",e)}else(0,i.logInfo)("Pairid: liverampValue for pairId from storage is empty or null")}if(0!==r.length)return{id:r};(0,i.logInfo)("PairId not found.")},eids:{pairId:{source:"google.com",atype:571187}}};(0,t.bz)("userId",g),(0,a.E)("pairIdSystem")}},e=>{e.O(0,[802,7769,315,1085],()=>{return o=9174,e(e.s=o);var o});e.O()}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[1252],{755(e,t,r){var i=r(1748),n=r(466),o=r(8928),a=r(3435),s=r(6665),d=r(3556),l=r(9794),c=r(1933),p=r(7464),u=r(4621),m=r(7156),g=r(611),f=r(1418),b=r(6685),h=r(8258);const y="PubMatic: ",v=void 0,x="https://pubmatic.bbvms.com/r/".concat("$RENDERER",".js"),w=Object.values(f.h0),I=!0,O={kadpageurl:"",gender:"",yob:"",lat:"",lon:"",wiid:""},C={1:"PMP",5:"PREF",6:"PMPG"},$={banner:360,video:1800,native:1800};let _,j={},R=[],E=[],U=0;const k=(0,g.A)({context:{netRevenue:!0,ttl:360},imp(e,t,r){const{kadfloor:i,currency:n,adSlot:o="",deals:a,dctr:s,pmzoneid:d,hashedKey:l}=t.params,{adUnitCode:c,mediaTypes:p,rtd:u,ortb2:m}=t,g=e(t,r);if(!g.hasOwnProperty("banner")&&!g.hasOwnProperty("video")&&!g.hasOwnProperty("native"))return null;g.ext=g.ext||{},g.ext.pbcode=c,a&&(0,b.k)(g,a,y),s&&(0,b.z)(g,s,y);const f=P(m);if(f){const e=Object.values(f).filter(Boolean);e.length&&(g.ext.key_val=g.ext.key_val?`${g.ext.key_val}|${e.join("|")}`:e.join("|"))}return u?.jwplayer&&z(g,u.jwplayer),g.bidfloor=H("kadfloor",i),g.bidfloorcur=n?H("currency",n):"USD",q(g,t),g.hasOwnProperty("banner")&&S(g.banner,o),g.hasOwnProperty("video")&&N(p?.video,c,g),g.hasOwnProperty("native")&&M(g,p?.native),(g.hasOwnProperty("banner")||g.hasOwnProperty("video"))&&Y(g,c,t?.sizes),d&&(g.ext.pmZoneId=d),W(g,o.trim(),l),T(g),null!=g.ext?.ae&&delete g.ext.ae,null!=g.ext?.igs&&delete g.ext.igs,null!=g.ext?.paapi&&delete g.ext.paapi,["banner","video","native"].forEach(e=>{g[e]?.battr&&!Array.isArray(g[e].battr)&&delete g[e].battr}),g},request(e,t,r,i){const n=function(e,t){const r={};return t.bids.forEach(t=>{const i=e.find(e=>e.id===t.bidId);if(!i)return;const n=t.adUnitId;if(!r[n])return void(r[n]=(0,s.Go)(i));const o=r[n];(0,s.O8)(i.tagid)&&(o.tagid=i.tagid);const a=(e,t,r)=>{i[e]&&i[e][t]&&(o[e]||(o[e]={}),r?(o[e][t]||(o[e][t]=[]),o[e][t]=[...o[e][t],...i[e][t]]):o[e][t]=i[e][t])};a("ext","key_val",!1),a("ext","pmZoneId",!1),a("pmp","deals",!0)}),Object.values(r)}(t,r),o=e(n,r,i);if(R.length||o.bcat){const e=V([...R||[],...o.bcat||[]]);e.length&&(o.bcat=e)}if(E.length||o.acat){const e=X([...E||[],...o.acat||[]]);e.length&&(o.acat=e)}F(o),D(o,i?.bidRequests),J(o,r);return(r?.bidderCode?m.u.get(r.bidderCode,"allowAlternateBidderCodes"):void 0)&&B(o,r),r?.ortb2?.ext?.prebid?.previousauctioninfo&&(0,a.J)(o,"ext.previousAuctionInfo",r.ortb2.ext.prebid.previousauctioninfo),o},bidResponse(e,t,r){const i=e(t,r);i.meta&&(i.meta.mediaType=i.mediaType),G(i,t,r);const{mediaType:o,playerWidth:a,playerHeight:s}=i,{params:d,adUnitCode:c,mediaTypes:p}=r?.bidRequest;if(o===l.G_){i.width||(i.width=a),i.height||(i.height=s);const{context:e,maxduration:t}=p[o];"outstream"===e&&d.outstreamAU&&c&&(i.rendererCode=d.outstreamAU,i.renderer=Z.newRenderer(i.rendererCode,c)),L(i,e,t)}if(o===l.s6&&t.adm){try{const e=JSON.parse(t.adm.replace(/\\/g,""));i.native={ortb:{...e.native}}}catch(e){return void(0,n.logWarn)(`${y}Error: Cannot parse native response for ad response: ${t.adm}`)}i.width=t.w||0,i.height=t.h||0}return i},response:(e,t,r,i)=>e(t,r,i),overrides:{imp:{bidfloor:!1,extBidfloor:!1},bidResponse:{native:!1}}}),P=e=>{const t=e?.user?.ext?.data?.im_segments,r=e?.site?.ext?.data?.["ias-brand-safety"],i=t&&(0,s.cy)(t)&&t.length,n="object"==typeof r&&Object.keys(r).length,o={};return i&&(o.im_segments=`im_segments=${t.join(",")}`),n&&(o["ias-brand-safety"]=Object.entries(r).map(e=>{let[t,r]=e;return`${t}=${r}`}).join("|")),Object.keys(o).length?o:void 0};const A=e=>{const t={};if(e.aspect_ratios&&(0,s.cy)(e.aspect_ratios)&&e.aspect_ratios.length){const{min_width:r,min_height:i}=e.aspect_ratios[0];(0,s.Fq)(r)&&(0,s.Fq)(i)&&(t.wmin=r,t.hmin=i),t.ext={aspectratios:e.aspect_ratios.filter(e=>{let{ratio_width:t,ratio_height:r}=e;return t&&r}).map(e=>{let{ratio_width:t,ratio_height:r}=e;return`${t}:${r}`})}}return t.w=e.w||e.width,t.h=e.h||e.height,e.sizes&&2===e.sizes.length&&(0,s.Fq)(e.sizes[0])&&(0,s.Fq)(e.sizes[1])&&(t.w=e.sizes[0],t.h=e.sizes[1],delete t.wmin,delete t.hmin),e.ext&&(t.ext=e.ext),e.mimes&&(t.mimes=e.mimes),t},T=e=>{e.displaymanager||="Prebid.js",e.displaymanagerver||="10.29.0";const t=e.ext?.data?.adserver?.adslot;t&&(e.ext.dfp_ad_unit_code=t),e.ext?.data&&0===Object.keys(e.ext.data).length&&delete e.ext.data};const q=(e,t)=>{let r=-1;const i=Object.keys(t.mediaTypes),o=i.length>1;"function"!=typeof t.getFloor||c.$W.getConfig("pubmatic.disableFloors")||[l.D4,l.G_,l.s6].forEach(i=>{if(!e.hasOwnProperty(i))return;(("banner"===i?e[i]?.format?.map(e=>{let{w:t,h:r}=e;return[t,r]}):["*"])||["*"]).forEach(a=>{const d=t.getFloor({currency:e.bidfloorcur,mediaType:i,size:a});if((0,n.logInfo)(y,"floor from floor module returned for mediatype:",i," and size:",a," is: currency",d.currency,"floor",d.floor),(0,s.Qd)(d)&&d?.currency===e.bidfloorcur&&!isNaN(parseInt(d.floor))){const t=parseFloat(d.floor);o&&i!==l.D4&&((0,n.logInfo)(y,"floor from floor module returned for mediatype:",i,"is : ",t,"with currency :",e.bidfloorcur),e[i].ext={bidfloor:t,bidfloorcur:e.bidfloorcur}),(0,n.logInfo)(y,"floor from floor module:",t,"previous floor value",r,"Min:",Math.min(t,r)),r=-1===r?t:Math.min(t,r),(0,n.logInfo)(y,"new floor value:",r)}}),o&&i===l.D4&&(e[i].ext={bidfloor:r,bidfloorcur:e.bidfloorcur})}),e.bidfloor&&((0,n.logInfo)(y,"Comparing floors:","from floor module:",r,"impObj.bidfloor:",e.bidfloor,"Max:",Math.max(r,e.bidfloor)),r=Math.max(r,e.bidfloor)),e.bidfloor=r>0?r:v,(0,n.logInfo)(y,"Updated imp.bidfloor:",e.bidfloor),o&&function(e,t){t.forEach(t=>{e[t]?.ext&&e[t].ext.bidfloor===e.bidfloor&&e[t].ext.bidfloorcur===e.bidfloorcur&&delete e[t].ext})}(e,i)},S=(e,t)=>{const r=t.split(":");let i=r[0]?.split("@");i=2===i?.length?i[1].split("x"):3===i.length?i[2].split("x"):[];const n=e.format[0];2!==i.length||0===parseInt(i[0])&&0===parseInt(i[1])?(e.w=n.w,e.h=n.h):(e.w=parseInt(i[0]),e.h=parseInt(i[1])),e.format=e.format.filter(t=>!(t.w===e.w&&t.h===e.h)),e.format?.length||delete e.format,e.pos??=0},W=(e,t,r)=>{const i=t.split(":")[0].split("@");e.tagid=r||i[0]},M=(e,t)=>{if(t?.ortb||(e.native.request=JSON.stringify((e=>{const t={ver:"1.2",assets:[]};for(const r in e){if(f._B.includes(r))continue;if(!f.x5.hasOwnProperty(r)&&!w.includes(r)){(0,n.logWarn)(`${y}: Unrecognized asset: ${r}. Ignored.`);continue}if("privacyLink"===r){t.privacy=1;continue}const i=e[r],o=i.required&&(0,s.Lm)(i.required)?1:0,a={id:t.assets.length,required:o};r in f.h0?a.data={type:f.jO[f.h0[r]],...i.len&&{len:i.len},...i.ext&&{ext:i.ext}}:"icon"===r||"image"===r?a.img={type:"icon"===r?f.oA.ICON:f.oA.MAIN,...A(i)}:"title"===r?a.title={len:i.len||140,...i.ext&&{ext:i.ext}}:"ext"===r&&(a.ext=i,delete a.required),t.assets.push(a)}return t})(t))),t?.ortb){const t=JSON.parse(e.native.request),{assets:r}=t;r?.some(e=>e.title||e.img||e.data||e.video)?e.native.request=JSON.stringify({ver:"1.2",...t}):((0,n.logWarn)(`${y}: Native assets object is empty or contains invalid objects`),delete e.native)}},N=(e,t,r)=>{const i=r.video;(0,o.A)(e,"plcmt")||(0,n.logWarn)("Video.plcmt param missing for "+t),e&&(i.w||i.h)||(delete r.video,(0,n.logWarn)(`${y}Error: Missing ${e?"video size params (playersize or w&h)":"video config params"} for adunit: ${t} with mediaType set as video. Ignoring video impression in the adunit.`))},z=(e,t)=>{const r=t?.targeting;if(!r||!r.segments?.length)return;const i=`${`jw-id=${r.content.id}`}|${r.segments.map(e=>`jw-${e}=1`).join("|")}`;e.ext=e.ext||{},e.ext.key_val=e.ext.key_val?`${e.ext.key_val}|${i}`:i},B=(e,t)=>{const r=["all"],i=m.u.get(t.bidderCode,"allowedAlternateBidderCodes"),o=(0,s.cy)(i)?i.map(e=>e.trim().toLowerCase()).filter(n.uniques):r;e.ext.marketplace={allowedbidders:o.includes("*")||o.includes("all")?r:[...new Set(["pubmatic",...o.filter(e=>e&&e.trim())])]}},F=e=>{(0,a.J)(e,"at",1),(0,a.J)(e,"cur",["USD"]),e.test=window.location.href.includes("pubmaticTest=true")?1:void 0,e.source&&!Object.keys(e.source).length&&delete e.source,e.app?.publisher&&(e.app.publisher.id=U)},D=(e,t)=>{const{gender:r,yob:i,pubId:n,refURL:a,kadpageurl:s}=j,{user:d}=e;e.device&&Object.assign(e.device,{js:1,connectiontype:(0,h.Z)()}),e.user={...e.user,gender:d?.gender||r?.trim()||v,yob:d?.yob||H("yob",i)};const l=(0,o.A)(t,"0.userIdAsEids");t.length&&l?.length&&!e.user.ext?.eids&&(e.user.ext=e.user.ext||{},e.user.ext.eids=l),e.site?.publisher&&(e.site.ref=e.site.ref||a,e.site.publisher.id=n?.trim()),e.site?.page&&s&&(e.site.page=s.trim()),e.device.geo&&!e.user.geo?e.user.geo=e.device.geo:e.user.geo&&!e.device.geo&&(e.device.geo=e.user.geo)},G=(e,t,r)=>{const{ortbRequest:i,seatbid:n}=r;if(e.referrer=i.site?.ref||"",e.sspID=e.partnerImpId=t.id||"",e.ad=t.adm,e.pm_dspid=t.ext?.dspid?t.ext.dspid:null,e.pm_seat=n.seat,e.creativeId||(e.creativeId=t.id),360===Number(e.ttl)&&(e.ttl=$[e.mediaType]),t.dealid&&(e.dealChannel=t.ext?.deal_channel?C[t.ext.deal_channel]||null:"PMP"),n.ext?.buyid&&(e.adserverTargeting={hb_buyid_pubmatic:n.ext.buyid}),t.ext?.marketplace&&(e.bidderCode=t.ext.marketplace),t.ext){const{dspid:r,dchain:i,dsa:n,ibv:o}=t.ext;r&&(e.meta.networkId=e.meta.demandSource=r),i&&(e.meta.dchain=i),n&&Object.keys(n).length&&(e.meta.dsa=n),o&&(e.ext=e.ext||{},e.ext.ibv=o,e.meta.mediaType=l.G_)}const o=n.seat||t.ext?.advid;o&&(e.meta.advertiserId=e.meta.agencyId=e.meta.buyerId=o),K(t.adomain)&&(e.meta.clickUrl=e.meta.brandId=t.adomain[0]),t.cat&&K(t.cat)&&(e.meta.secondaryCatIds=t.cat,e.meta.primaryCatId=t.cat[0])},J=(e,t)=>{const{profId:r,verId:i,wiid:n}=j;e.ext={epoch:(new Date).getTime(),wrapper:{profile:r?parseInt(r):void 0,version:i?parseInt(i):void 0,wiid:n,wv:"prebid_prebid_10.29.0",wp:"pbjs",biddercode:t?.bidderCode},cpmAdjustment:_}},L=(e,t,r)=>{if(!e?.ext?.prebiddealpriority)return;if(t!==l.LM)return;const i=e?.ext?.video?.duration||r;e.video={context:l.LM,durationSeconds:i,dealTier:e.ext.prebiddealpriority}},X=e=>[...new Set(e.filter(e=>"string"==typeof e||((0,n.logWarn)(y+"acat: Each category should be a string, ignoring category: "+e),!1)).map(e=>e.trim()))],V=e=>{const t=(e=e.map(e=>"string"==typeof e?e.trim():e)).filter(e=>"string"!=typeof e||e.length<3);return(0,n.logWarn)(y+"bcat: Each category must be a string with a length greater than 3, ignoring "+t),[...new Set(e.filter(e=>"string"==typeof e&&e.length>=3))]};const Z={bootstrapPlayer:function(e){const t={code:e.adUnitCode,vastXml:e.vastXml||null,vastUrl:e.vastUrl||null};if(!t.vastXml&&!t.vastUrl)return void(0,n.logWarn)(`${y}: No vastXml or vastUrl on bid, bailing...`);const r=Z.getRendererId("pubmatic",e.rendererCode),i=document.getElementById(e.adUnitCode),o=window.bluebillywig.renderers.find(e=>e._id===r);o?o.bootstrap(t,i):(0,n.logWarn)(`${y}: Couldn't find a renderer with ${r}`)},newRenderer:function(e,t){const r=x.replace("$RENDERER",e),i=p.A4.install({url:r,loaded:!1,adUnitCode:t});try{i.setRender(Z.outstreamRender)}catch(e){(0,n.logWarn)(`${y}: Error tying to setRender on renderer`,e)}return i},outstreamRender:function(e){e.renderer.push(()=>Z.bootstrapPlayer(e))},getRendererId:function(e,t){return`${e}-${t}`}};function H(e,t){if(!(0,s.O8)(t))return t&&(0,n.logWarn)(y+"Ignoring param key: "+e+", expects string-value, found "+typeof t),v;const r={pmzoneid:()=>t.split(",").slice(0,50).map(e=>e.trim()).join(),kadfloor:()=>parseFloat(t),lat:()=>parseFloat(t),lon:()=>parseFloat(t),yob:()=>parseInt(t)};return r[e]?.()||t}function K(e){return!0===(0,s.cy)(e)&&e.length>0}function Q(){try{const e=(0,o.A)(c.$W.getBidderConfig(),"pubmatic.gzipEnabled");if(void 0!==e){const t=String(e).toLowerCase().trim();if("true"===t||"false"===t){const e="true"===t;return(0,n.logInfo)("PubMatic: Using bidder-specific gzipEnabled setting:",e),e}(0,n.logWarn)("PubMatic: Invalid gzipEnabled value in bidder config:",e)}}catch(e){(0,n.logWarn)("PubMatic: Error accessing bidder config:",e)}return(0,n.logInfo)("PubMatic: Using default gzipEnabled setting:",I),I}const Y=(e,t,r)=>{let i={w:0,h:0};e.video?.w>0&&e.video?.h>0?(i.w=e.video.w,i.h=e.video.h):i=function(e){return e&&e.length?e.reduce((e,t)=>t.h*t.w<e.h*e.w?t:e,e[0]):{w:0,h:0}}(r);const o=document.getElementById(t);if(!o)return;const a=(0,u.tF)(o)?(0,u.gl)(o,(0,n.getWindowTop)(),i):"na";e.ext||(e.ext={}),e.ext.viewability={amount:isNaN(a)?a:Math.round(a)}},ee={code:"pubmatic",gvlid:76,supportedMediaTypes:[l.D4,l.G_,l.s6],alwaysHasCapacity:!0,isBidRequestValid:e=>{if(!e||!e.params)return!1;const{publisherId:t}=e.params,r=e.mediaTypes||{},i=r[l.G_]||{};if(!(0,s.O8)(t))return(0,n.logWarn)(y+"Error: publisherId is mandatory and cannot be numeric (wrap it in quotes in your config). Call to OpenBid will not be sent for ad unit: "+JSON.stringify(e)),!1;if(r.hasOwnProperty(l.G_)){const t=(0,o.A)(e,"mediaTypes.video.mimes"),a=(0,o.A)(e,"params.video.mimes");if(!K(t)&&!K(a))return(0,n.logWarn)(y+"Error: For video ads, bid.mediaTypes.video.mimes OR bid.params.video.mimes should be present and must be a non-empty array. Call to OpenBid will not be sent for ad unit:"+JSON.stringify(e)),!1;if(!i.context)return(0,n.logError)(`${y}: No context specified in bid. Rejecting bid: `,e),!1;if("outstream"===i.context&&!(0,s.O8)(e.params.outstreamAU)&&!e.renderer&&!i.renderer)return r.hasOwnProperty(l.D4)||r.hasOwnProperty(l.s6)?(delete r[l.G_],(0,n.logWarn)(`${y}: for "outstream" bids either outstreamAU parameter must be provided or ad unit supplied renderer is required. Rejecting mediatype Video of bid: `,e),!0):((0,n.logError)(`${y}: for "outstream" bids either outstreamAU parameter must be provided or ad unit supplied renderer is required. Rejecting bid: `,e),!1)}return!0},buildRequests:(e,t)=>{const{page:r,ref:i}=t?.refererInfo||{},{publisherId:o,profId:a,verId:d}=t?.bids?.[0]?.params||{};var l;U=o?.trim()||(l=t?.bids,Array.isArray(l)&&l.length>0&&l.find(e=>e.params?.publisherId?.trim())?.params.publisherId||null)?.trim();const c=(0,n.generateUUID)();let p;R=[],E=[],j={pageURL:r||window.location.href,refURL:i||window.document.referrer,pubId:U,kadpageurl:r||window.location.href,profId:a,verId:d},e.forEach(e=>{e.params.wiid=e.params.wiid||t.auctionId||c,p=(0,s.Go)(e),((e,t)=>{Object.keys(O).forEach(r=>{const i=e[r];i&&((0,s.O8)(i)?t[r]=i:(0,n.logWarn)(`${y}Ignoring param: ${r} with value: ${O[r]}, expects string value, found ${typeof i}`))})})(p.params,j);const{bcat:r,acat:i}=p.params;r&&(R=R.concat(r)),i&&(E=E.concat(i))});const u=k.toORTB({validBidRequests:e,bidderRequest:t}),m={method:"POST",url:"https://hbopenbid.pubmatic.com/translator?source=prebid-client",data:u,bidderRequest:t,options:{endpointCompression:Q()}};return u?.imp?.length?m:null},interpretResponse:(e,t)=>{const{bids:r}=k.fromORTB({response:e.body,request:t.data});return r},getUserSyncs:(e,t,r,i,n)=>{let o=U;r&&(o+=`&gdpr=${r.gdprApplies?1:0}&gdpr_consent=${encodeURIComponent(r.consentString||"")}`),i&&(o+=`&us_privacy=${encodeURIComponent(i)}`),n?.gppString&&n?.applicableSections?.length&&(o+=`&gpp=${encodeURIComponent(n.gppString)}&gpp_sid=${encodeURIComponent(n.applicableSections.join(","))}`),!0===c.$W.getConfig("coppa")&&(o+="&coppa=1");const a=e.iframeEnabled?"iframe":"image";return[{type:a,url:("iframe"===a?"https://ads.pubmatic.com/AdServer/js/user_sync.html?kdntuid=1&p=":"https://image8.pubmatic.com/AdServer/ImgSync?p=")+o}]},onBidWon:e=>{!function(e){if(!e)return;const{originalCurrency:t,currency:r,cpm:i,originalCpm:n,meta:o}=e,a=t!==r&&(0,s.fp)(e.getCpmInNewCurrency)?e.getCpmInNewCurrency(t):i,d=e.mediaType,l=o?.mediaType;_=_||{currency:r,originalCurrency:t,adjustment:[]};const c={cpmAdjustment:Number(((n-a)/n).toFixed(2)),mediaType:d,metaMediaType:l,cpm:a,originalCpm:n},p=_?.adjustment?.findIndex(e=>e?.mediaType===d&&e?.metaMediaType===l);-1!==p?_.adjustment.splice(p,1,c):_.adjustment.push(c)}(e)}};(0,d.a$)(ee),(0,i.E)("pubmaticBidAdapter")}},e=>{e.O(0,[802,7769,315,1085,8498,2316,259,4472,7464],()=>{return t=755,e(e.s=t);var t});e.O()}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[1613],{460(n,i,e){var s=e(1748),o=e(1933),r=e(466),a=e(6665);function c(n,i,e){const s=i.split(".");let o=n;s.forEach(n=>{o[n]=o[n]||{},o=o[n]}),o.schain=(0,a.Go)(e)}e(69).mZ.before((n,i)=>{!function(n){if(!n)return n;let i=!1;function e(){i||((0,r.logWarn)('The schain module is deprecated and no longer needed; you may provide schain directly as FPD (e.g., "setConfig({ortb2: {source: {schain: {...}})")'),i=!0)}const s=o.$W.getConfig("schain");s&&s.config&&(e(),n?.global?.source?.schain?(0,r.logWarn)("Disregarding global schain config as schain is already provided in FPD"):c(n,"global.source",s.config));const a=o.$W.getBidderConfig();a&&Object.entries(a).filter(n=>{let[i,e]=n;return e.schain}).forEach(i=>{let[s,o]=i;e();const a=`bidder.${s}.source`,d=n?.bidder?.[s]?.source?.schain;d?(0,r.logWarn)(`Disregarding schain config for bidder "${s}" as schain is already provided in FPD`):c(n,a,o.schain?.config)})}(i),n(i)}),(0,s.E)("schain")}},n=>{n.O(0,[802,7769,315,1085],()=>{return i=460,n(n.s=i);var i});n.O()}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[4258],{6105(e,t,n){var r=n(1748),i=n(8317),s=n(3556),o=n(1933),a=n(9794),p=n(466),c=n(6665),d=n(3958),u=n(183),l=n(8258);const g={[a.D4]:"display",[a.G_]:"video"},b="fixed",m="mobile",y="unknown";const h=()=>{const e=(0,l.V)();switch(e?.type||e?.effectiveType){case"wifi":case"ethernet":return b;case"cellular":case"wimax":return m;default:return/iPad|iPhone|iPod/.test(navigator.userAgent)||/android/i.test(navigator.userAgent)?y:b}};function f(e){return!!e.mediaTypes&&!!e.mediaTypes.video}function v(e){return!!e.params.publisherId}function S(e){const t=I(e);return!!e.params.publisherId&&f(e)&&!!t.playerSize&&(0,c.cy)(t.playerSize)&&t.playerSize.length>0}function T(e){const t=e.params,n=(0,p._map)(Object.keys(e.mediaTypes),function(e){return g[e]}),r={id:e.bidId,transactionId:e.ortb2Imp?.ext?.tid,gpid:e.ortb2Imp?.ext?.gpid,sizes:e.sizes,supplyTypes:n,adUnitId:t.adUnitId,adUnitCode:e.adUnitCode,geom:x(e.adUnitCode),placement:t.placement,requestCount:e.bidderRequestsCount||1};f(e)&&S(e)&&(r.videoParams=I(e));const i=function(e){let t={};return"function"==typeof e.getFloor&&(t=e.getFloor({currency:"USD",mediaType:"*",size:"*"})),t?.floor}(e);return i&&(r.bidFloor=i),r}function I(e){const t=e.mediaTypes.video||{};return t.playerSize&&(0,c.cy)(t.playerSize)&&t.playerSize.length>0&&(t.w=t.playerSize[0][0],t.h=t.playerSize[0][1]),t}function C(e){const t="display"===(n=e.mediaType)?a.D4:"video"===n?a.G_:n;var n;const r={requestId:e.bidId,cpm:e.price,width:e.width,height:e.height,creativeId:e.creativeId,currency:e.currency,netRevenue:!0,mediaType:t,ttl:e.ttl,nurl:e.nurl,meta:{advertiserDomains:e&&e.adomain&&e.adomain.length>0?e.adomain:[],mediaType:e.realMediaType}};return t===a.G_?r.vastXml=e.content:r.ad=e.content,r}function w(){const e=(()=>{try{const e=performance.getEntriesByType("navigation")[0];return Math.round(e.responseStart-e.startTime)}catch(e){try{const e=performance.timing;return Math.round(e.responseStart-e.fetchStart)}catch(e){return 0}}})();return e>=0&&e<=performance.now()?e:0}function x(e){const t=document.getElementById(e);if(t){const{top:e,left:n,width:r,height:s}=(0,i.G)(t),o={width:(0,d.Ot)().innerWidth,height:(0,d.Ot)().innerHeight};return{scrollY:(0,u.g)().top||0,top:e,left:n,width:r,height:s,viewport:o}}}const z={code:"seedtag",gvlid:157,aliases:["st"],supportedMediaTypes:[a.D4,a.G_],isBidRequestValid(e){const t=f(e),n=function(e){return!!e.mediaTypes&&!!e.mediaTypes.banner}(e);return t&&n?S(e)&&"outstream"===I(e).context&&v(e):t?S(e):!!n&&v(e)},buildRequests(e,t){const n=e[0].params.publisherId,r=e[0].params.integrationType||"publisherToken",i={url:t.refererInfo.page,publisherToken:n,cmp:!!t.gdprConsent,timeout:t.timeout,version:"10.29.0",connectionType:h(),auctionStart:t.auctionStart||Date.now(),ttfb:w(),bidRequests:(0,p._map)(e,T),user:{topics:[],eids:[]},site:{},integrationType:r};if(i.cmp){const e=t.gdprConsent.gdprApplies;void 0!==e&&(i.ga=e),i.cd=t.gdprConsent.consentString}t.uspConsent&&(i.uspConsent=t.uspConsent);const s=e[0]?.ortb2?.source?.ext?.schain;s&&(i.schain=s);const a=o.$W.getConfig("coppa");a&&(i.coppa=a),t.gppConsent?i.gppConsent={gppString:t.gppConsent.gppString,applicableSections:t.gppConsent.applicableSections}:t.ortb2?.regs?.gpp&&(i.gppConsent={gppString:t.ortb2.regs.gpp,applicableSections:t.ortb2.regs.gpp_sid}),t.ortb2?.user?.data&&(i.user.topics=t.ortb2.user.data),e[0]&&e[0].userIdAsEids&&(i.user.eids=e[0].userIdAsEids),t.ortb2?.bcat&&(i.bcat=t.ortb2?.bcat),t.ortb2?.badv&&(i.badv=t.ortb2?.badv),t.ortb2?.device?.sua&&(i.sua=t.ortb2.device.sua),t.ortb2?.site?.cat&&(i.site.cat=t.ortb2.site.cat),t.ortb2?.site?.cattax&&(i.site.cattax=t.ortb2.site.cattax),t.ortb2?.site?.pagecat&&(i.site.pagecat=t.ortb2.site.pagecat),t.ortb2&&(i.ortb=t.ortb2);return{method:"POST",url:"https://s.seedtag.com/c/hb/bid",data:JSON.stringify(i)}},interpretResponse:function(e){const t=e.body;return t&&t.bids&&(0,c.cy)(t.bids)?(0,p._map)(t.bids,function(e){return C(e)}):[]},getUserSyncs(e,t){const n=t[0];if(e.iframeEnabled&&n){const e=n.body.cookieSync;return e?[{type:"iframe",url:e}]:[]}return[]},onTimeout(e){const t=function(e){let t="";if((0,c.cy)(e)&&e[0]&&(0,c.cy)(e[0].params)&&e[0].params[0]){const n=e[0].params[0],r=e[0].timeout,i=["publisherToken="+n.publisherId,"timeout="+r];n.adUnitId&&i.push("adUnitId="+n.adUnitId),t="?"+i.join("&")}return"https://s.seedtag.com/se/hb/timeout"+t}(e);(0,p.triggerPixel)(t)},onBidWon:function(e){e&&e.nurl&&(0,p.triggerPixel)(e.nurl)}};(0,s.a$)(z),(0,r.E)("seedtagBidAdapter")}},e=>{e.O(0,[802,7769,315,1085,2316,259],()=>{return t=6105,e(e.s=t);var t});e.O()}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[5022],{9637(e,t,n){var i=n(1748),s=n(2201),r=n(4369),a=n(1418),d=n(8668),o=n(466);const c="Sevio Analytics",l="ba31d2ed-a3e9-4090-b720-69935b560d4e",u="EUR",g="n/a",b=0,f=1,I=1,p=2,h=1,m=5;let v="",w="",A=!1,y={},D={},R=!1,q={},E={};class S{constructor(){let{threshold:e=.5,requiredMs:t=1e3}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};if(!("IntersectionObserver"in window))throw new Error("IntersectionObserver required for ContinuousViewability");this.threshold=e,this.requiredMs=t,this._states=new WeakMap}observe(e,t){if(!e)throw new Error("element required");if(this._states.has(e))return{stop:()=>this._cleanup(e)};const n={element:e,inViewStart:0,rafId:null,done:!1,observer:null};this._states.set(e,n);const i=i=>{if(n.done)return;if("hidden"===document.visibilityState)return;n.inViewStart=i;const s=i=>{if(n.done)return;if(!n.inViewStart)return;if(i-n.inViewStart>=this.requiredMs)return n.done=!0,a(),void(t&&t({element:e}));n.rafId=requestAnimationFrame(s)};n.rafId=requestAnimationFrame(s)},s=()=>{n.rafId&&(cancelAnimationFrame(n.rafId),n.rafId=null),n.inViewStart=0},r=new IntersectionObserver(e=>{if(!n.done)for(const t of e){(null!=t.intersectionRatio?t.intersectionRatio:0)>=this.threshold?i(performance.now()):s()}},{threshold:[this.threshold]}),a=()=>{try{r.disconnect()}catch(e){(0,o.logError)(`${c}: ${e}`)}s(),this._states.delete(e)};return n.observer=r,r.observe(e),{stop:()=>a()}}_cleanup(e){const t=this._states.get(e);if(t){try{t.observer&&t.observer.disconnect()}catch(e){(0,o.logError)(`${c}: ${e}`)}t.rafId&&cancelAnimationFrame(t.rafId),this._states.delete(e)}}}function C(e,t){return e&&t?"gam"===t?l:e.find(e=>e.code===t)?.id:l}function T(e){let t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(e)try{const n=t?w:v,i={contentType:"application/json"},r=JSON.stringify(e);(0,s.RD)(n,null,r,i)}catch(e){const t=`Error sending event - ${e.message}`;(0,o.logError)(`${c}: ${t}`)}}function N(e){const t=e.winningBid,n=e.auctionId;if(!n||!y[n])return null;const i=y[n],s=i.timestamp||Date.now(),r=new Date(isNaN(s)?s:Number(s)),a={requestId:n,tagId:e.tagDetails?.id,eventDate:r.toISOString().slice(0,10),eventTime:r.toISOString(),pageURL:window.location.href,callDuration:(i.auctionEnd||Date.now())-(i.timestamp||Date.now())+(e.gamCallDuration||b),isRefresh:!!e.isRefresh,currency:t?.currency||u,bidderRequests:[],bids:[]};return a.bidderRequests=i.bidderRequests.filter(e=>A||"sevio"!==e.bidderCode).map(t=>{const n=t?.bids?.[0],{details:s,status:r}=(e=>{if(!e)return{details:void 0,status:400};const t=i.bidsReceived.find(t=>t.requestId===e.bidId);if(t)return{details:t,status:200};const n=[...i.noBids||[],...i.seatNonBids||[],...i.bidsRejected||[]].find(t=>t.bidId===e.bidId);return n?{details:n,status:204}:{details:void 0,status:400}})(n);return{bidderId:C(e.tagDetails?.bidders,t.bidderCode),currency:s?.currency||u,callDuration:s?.timeToRespond||b,responseStatusCode:r}}),a.bids=i.bidsReceived.filter(e=>A||"sevio"!==e.bidderCode).map(n=>({bidderId:C(e.tagDetails?.bidders,n.bidderCode),bidId:n.requestId||g,w:n.width||f,h:n.height||f,crid:n.creativeId||g,adomain:n.meta?.advertiserDomains||[g],price:n.cpm||b,currency:n.currency||u,callDuration:n.timeToRespond||b,outcome:n.requestId===t?.requestId?h:m})),a}function O(e,t){const n=e.winningBid;if(!n||"sevio"===n.bidderCode&&!A)return null;const i=t||n.requestTimestamp,s=new Date(isNaN(i)?i:Number(i));return{requestId:n.auctionId,tagId:e.tagDetails?.id,eventDate:s.toISOString().slice(0,10),eventTime:s.toISOString(),isRefresh:!!e.isRefresh,eventType:e.eventType,bidderId:C(e.tagDetails?.bidders,n.bidderCode),bidId:n.requestId||g,w:n.width||f,h:n.height||f,crid:n.creativeId||g,adomain:n.meta?.advertiserDomains||[g],price:n.cpm||b,currency:n.currency||u}}const B=(0,r.Ay)({analyticsType:"bundle"}),U=Object.assign({},B,{getUrl:()=>v,enableAnalytics(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};B.enableAnalytics.call(this,e)},track(e){const{eventType:t,args:n}=e;try{switch(t){case a.qY.AUCTION_INIT:case a.qY.AUCTION_END:y[n.auctionId]=JSON.parse(JSON.stringify(n))}}catch(e){(0,o.logError)(`${c}: ${e}`)}}});function $(e){if(!e||!e.data||e.data.isEmpty)return!1;const t=null===e.data.lineItemId,n="adsense"===e.data.sourceAka||"adx"===e.data.sourceAka;return t||n}function M(e,t,n,i){return i?{auctionId:n,bidderCode:"gam",requestTimestamp:e?.requestedAt,requestId:e?.data?.responseIdentifier,creativeId:e?.data?.creativeId?String(e.data.creativeId):g,width:e?.data?.size?e.data.size[0]:f,height:e?.data?.size?e.data.size[1]:f,meta:{}}:t}U.originEnableAnalytics=U.enableAnalytics,U.enableAnalytics=function(e){U.originEnableAnalytics(e),v=e.options.auctionsUrl,w=e.options.interactionsUrl,A=e.options.sendSevioBidderEvents;try{(0,i.m)().sevioAnalytics=U}catch(e){(0,o.logError)(`${c}: cannot attach to pbjs global - ${e&&e.message?e.message:e}`)}},d.Ay.registerAnalyticsAdapter({adapter:U,code:"sevioAnalytics"}),U.sendPrebidAnalyticsEvents=function(e){const{adUnitCode:t,prebidWinningBid:n,tagDetails:i,isRefresh:s,auctionId:r}=e;setTimeout(()=>{const e=N({winningBid:n,tagDetails:i,isRefresh:s,auctionId:r});e&&0!==e.bidderRequests.length&&T(e)},500),T(O({winningBid:n,eventType:I,tagDetails:i,isRefresh:s},Date.now()),!0),function(e){const t=new S({threshold:.5,requiredMs:1e3}),n=document.getElementById(e.adUnitCode);t.observe(n,()=>{T(O(e,Date.now()),!0)})}({adUnitCode:t,winningBid:n,eventType:p,tagDetails:i,isRefresh:s})},U.enableGamEventTracking=function(){R||(window.googletag?(R=!0,window.googletag.pubads().addEventListener("slotRequested",e=>{const t=e.slot.getSlotElementId();D[t]={requestedAt:Date.now()},(0,o.logInfo)("[ANALYTICS] GAM slotRequested: ",e)}),window.googletag.pubads().addEventListener("slotResponseReceived",e=>{const t=e.slot.getSlotElementId();D[t]=D[t]||{},D[t].responseAt=Date.now(),(0,o.logInfo)("[ANALYTICS] GAM slotResponseReceived: ",e)}),window.googletag.pubads().addEventListener("impressionViewable",e=>{const t=e.slot.getSlotElementId();(0,o.logInfo)("[ANALYTICS] GAM impressionViewable:",t);const n=E[t];n&&(n(),delete E[t])}),window.googletag.pubads().addEventListener("slotRenderEnded",e=>{const t=e.slot.getSlotElementId();D[t]=D[t]||{},D[t].renderedAt=Date.now(),D[t].data=e,(0,o.logInfo)("[ANALYTICS] GAM slotRenderEnded: ",e);const n=q[t];n&&setTimeout(()=>{n(),delete q[t]},500)})):(0,o.logError)("Can't enable GAM Event Tracking. Reason: window.googletag not available."))},U.sendGamAnalyticsEvents=function(e){const{adUnitCode:t,isRefresh:n,tagDetails:i,auctionId:s,prebidWinningBid:r}=e;q[t]=()=>{const t=D[e.adUnitCode],a=$(t);let d=M(t,r,s,a);const o=N({winningBid:d,tagDetails:i,isRefresh:n,auctionId:s,gamCallDuration:"number"==typeof t?.responseAt&&"number"==typeof t?.requestedAt?t.responseAt-t.requestedAt:b});if(function(e,t,n){if(!e)return;let i=400;t&&(i=n?200:204),e.bidderRequests.push({bidderId:l,callDuration:"number"==typeof t?.responseAt&&"number"==typeof t?.requestedAt?t.responseAt-t.requestedAt:b,responseStatusCode:i,currency:u}),n&&e.bids.push({bidderId:l,bidId:t?.data?.responseIdentifier||g,w:t?.data?.size?t.data.size[0]:f,h:t?.data?.size?t.data.size[1]:f,crid:t?.data?.creativeId?String(t.data.creativeId):g,callDuration:"number"==typeof t?.responseAt&&"number"==typeof t?.requestedAt?t.responseAt-t.requestedAt:b,adomain:[g],price:b,currency:u,outcome:n?h:m})}(o,t,a),T(o),t.data.isEmpty)return;T(O({winningBid:d,eventType:I,tagDetails:i,isRefresh:n},Date.now()),!0)},E[t]=()=>{const a=D[e.adUnitCode],d=$(a);let o=M(a,r,s,d);T(O({adUnitCode:t,winningBid:o,eventType:p,tagDetails:i,isRefresh:n},Date.now()),!0)}};(0,i.E)("sevioAnalyticsAdapter")}},e=>{e.O(0,[802,7769,315,1085,2630],()=>{return t=9637,e(e.s=t);var t});e.O()}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[7517],{4468(e,r,t){var i=t(1748),n=t(466),a=t(3958),s=t(2569),o=t(3556),c=t(9794),d=t(1933),u=t(1745),p=t(611);const l=p.A({context:{ttl:300}}),f="sevio",y="https://req.adx.ws/prebid?wrapper=true",g=e=>(["native","banner"].find(r=>e.mediaTypes?.[r])||"unknown").toUpperCase(),m=e=>e?.refererInfo?.page??"";const b={code:f,gvlid:"1393",isBidRequestValid:function(e){return e?e.params?!!e.params.zone||(n.logWarn(f,"bid.params.zone is required"),!1):(n.logWarn(f,"bid.params is required"),!1):(n.logWarn(f,"Invalid bid",e),!1)},buildRequests:function(e,r){const t=d.$W.getConfig("userSync.syncEnabled"),i=d.$W.getConfig("currency"),n=i?.adServerCurrency||i?.defaultCurrency||null,o=(()=>{let e=!1,r=!1;return()=>(r||(r=!0,e=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"undefined"!=typeof window?window:void 0;try{const r=(()=>{try{return e?.top??e}catch{return e}})(),t=r?.performance||r?.webkitPerformance||r?.msPerformance||r?.mozPerformance;if(!t)return"";if("function"==typeof t.getEntriesByType){const e=t.getEntriesByType("navigation")?.[0];if(e?.responseStart>0&&e?.requestStart>0)return String(Math.round(e.responseStart-e.requestStart))}const i=t.timing;return i?.responseStart>0&&i?.requestStart>0?String(i.responseStart-i.requestStart):""}catch{return""}}()),e)})(),c=l.toORTB({bidderRequest:r,bidRequests:e});if(0===e.length)return[];const p=r?.gdprConsent,f=r?.uspConsent,b=r?.gppConsent,h=(0,s.X)();return e.map(i=>{const s="native"===g(i)?.toLowerCase(),d=i.mediaTypes?.banner?.sizes||i.mediaTypes?.native?.sizes||[],l=Array.isArray(d)?d.filter(e=>Array.isArray(e)&&2===e.length).map(e=>{let[r,t]=e;return{width:r,height:t}}):[],v=(i.mediaTypes?.native?.ortb?.assets||[]).map(e=>e.icon?{id:e.id,required:e.required||0,img:{type:1,w:e.icon.w,h:e.icon.h}}:e),k={userLanguage:navigator.language,pageUrl:i?.refererInfo?.page,pageDomain:i?.refererInfo?.referer,userId:i.userId,eids:(i.userIdAsEids||[]).map(e=>({source:e.source,id:e.uids?.[0]?.id})).filter(e=>e.source&&e.id),...n?{currency:n}:{},ads:[{sizes:l,referenceId:i.params.referenceId,tagId:i.params.zone,type:g(i),...s&&{nativeRequest:{ver:"1.2",assets:v||{}}}}],keywords:{tokens:(w=c?.site?.keywords||i.params?.keywords,w?Array.isArray(w)?w.map(e=>e.trim()).filter(Boolean):"string"==typeof w?w.split(",").map(e=>e.trim()).filter(Boolean):[]:[])},privacy:{gpp:b?.consentString||"",tcfeu:p?.consentString||"",usp:f?.uspString||""},xPageUrl:window.location.href,wdb:h,externalRef:i.bidId,userSyncOption:!1===t?"OFF":"BIDDERS",referer:m(r),pageReferer:document.referrer,context:[{source:"title",text:(0,u.wS)().slice(0,300)},{source:"meta:description",text:(0,u.Wt)().slice(0,300)}],domComplexity:(0,u.TP)(document),device:r?.ortb2?.device||{},deviceWidth:screen.width,deviceHeight:screen.height,timeout:r?.timeout,viewportHeight:a.Ot().visualViewport.height,viewportWidth:a.Ot().visualViewport.width,timeToFirstByte:o(),ext:{...r?.ortb2?.ext||{},adapter_version:"1.0.1",prebid_version:"10.29.0"}};var w;"undefined"!=typeof window&&window.sevio_wrapper;const S=r?.ortb2?.isRefresh,T=new URLSearchParams;S&&T.set("refresh","true");return{method:"POST",url:T.toString()?`${y}&${T.toString()}`:y,data:k,bidRequest:e[0]}})},interpretResponse(e){if(!e||"object"!=typeof e||!e.body||"object"!=typeof e.body||!Array.isArray(e.body.bids))return[];const r=e.body.bids;return r.forEach(e=>{if(e&&"object"==typeof e&&(e.bidder=f,"native"===(e.mediaType||"").toLowerCase())){const r=function(e){try{const r=JSON.parse(e.ad),t={};r.assets?.forEach(e=>{if(e.title?.text&&(t.title=e.title.text),e.data){const r=e.data.value,i=function(e){return"number"==typeof e?.data?.type?e.data.type:"number"==typeof e?.id?e.id:null}(e);switch(i){case 1:r&&(t.sponsored=r);break;case 2:r&&(t.desc=r);break;case 3:r&&(t.rating=r);break;case 4:r&&(t.likes=r);break;case 5:r&&(t.downloads=r);break;case 6:r&&(t.price=r);break;case 7:r&&(t.saleprice=r);break;case 8:r&&(t.phone=r);break;case 9:r&&(t.address=r);break;case 10:r&&(t.desc2=r);break;case 11:r&&(t.displayurl=r);break;case 12:r&&(t.ctatext=r)}}if(e.img){const{url:r,w:i=0,h:n=0}=e.img,a=function(e){if(!e)return null;if("number"==typeof e.img?.type)return e.img.type;if("number"==typeof e.data?.type)return e.data.type;if("number"==typeof e.id){if(13===e.id)return 1;if(14===e.id)return 3}return null}(e);1===a&&r?(t.icon=r,t.icon_width=i,t.icon_height=n):3===a&&r&&(t.image=r,t.image_width=i,t.image_height=n)}}),r.link?.url&&(t.clickUrl=r.link.url);const i=r.eventtrackers||[],n=i.filter(e=>1===e.event).map(e=>e.url).filter(Boolean),a=i.filter(e=>2===e.event).map(e=>e.url).filter(Boolean);return n.length&&(t.impressionTrackers=n),a.length&&(t.viewableTrackers=a),Array.isArray(r.link?.clicktrackers)&&r.link.clicktrackers.length>0&&(t.clickTrackers=r.link.clicktrackers),r.privacy?.url&&(t.privacyLink=r.privacy.url),r.privacy?.icon&&(t.privacyIcon=r.privacy.icon),t}catch(e){return n.logWarn("Invalid native JSON",e),null}}(e);r&&(e.native=r)}}),r},onBidWon:function(e){},onBidderError:function(e){},getUserSyncs:function(e,r){const t=[];return e.pixelEnabled&&r.length>0&&r.forEach(r=>{r.body&&r.body.userSyncs&&r.body.userSyncs.forEach(r=>{"image"===r.type&&r.url?t.push({type:"image",url:r.url}):"iframe"===r.type&&e.iframeEnabled&&t.push({type:"iframe",url:r.url})})}),t},onTimeout:function(e){},supportedMediaTypes:[c.D4,c.s6]};(0,o.a$)(b),(0,i.E)("sevioBidAdapter")}},e=>{e.O(0,[802,7769,315,1085,8498,5698,3527],()=>{return r=4468,e(e.s=r);var r});e.O()}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[5496],{8959(e,o,t){var n=t(1748),r=t(466),d=t(2592),i=t(1443),a=t(1385),u=t(736),s=t(8074);const c=(0,i.vM)({moduleType:u.fW,moduleName:"sharedId"}),l="cookie",m="html5",p="_pubcid_optout",f="PublisherCommonId";function g(e,o){if(o===l)return c.getCookie(e);if(o===m&&c.hasLocalStorage()){const o=c.getDataFromLocalStorage(`${e}_exp`);if(!o)return c.getDataFromLocalStorage(e);if(new Date(o).getTime()-Date.now()>0)return c.getDataFromLocalStorage(e)}}function I(e,o){return function(t,n){o?v(o,e,()=>{t(n()||e)})():t(e)}}function v(e){let o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",t=arguments.length>2?arguments[2]:void 0;if(!e)return;const n=(0,r.parseUrl)(e);n.search.id=encodeURIComponent("pubcid:"+o);const d=(0,r.buildUrl)(n);return function(){(0,r.triggerPixel)(d,t)}}function b(){return!!(c.cookiesAreEnabled()&&g(p,l)||c.hasLocalStorage()&&g(p,m))}const h={name:"sharedId",aliasName:"pubCommonId",gvlid:a.B1,disclosureURL:"local://prebid/sharedId-optout.json",decode(e,o){if(b())return void(0,r.logInfo)("PubCommonId decode: Has opted-out");(0,r.logInfo)(" Decoded value PubCommonId "+e);return{pubcid:e}},getId:function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},o=arguments.length>1?arguments[1]:void 0,t=arguments.length>2?arguments[2]:void 0;if(b())return void(0,r.logInfo)("PubCommonId: Has opted-out");if(o?.coppa)return void(0,r.logInfo)("PubCommonId: IDs not provided for coppa requests, exiting PubCommonId");const{params:{create:n=!0,pixelUrl:d}={}}=e;let i=t;if(!i){try{"object"==typeof window[f]&&(i=window[f].getId())}catch(e){}i||(i=n&&(0,r.hasDeviceAccess)()?(0,r.generateUUID)():void 0)}return{id:i,callback:I(i,d)}},extendId:function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},o=arguments.length>1?arguments[1]:void 0,t=arguments.length>2?arguments[2]:void 0;if(b())return(0,r.logInfo)("PubCommonId: Has opted-out"),{id:void 0};if(o?.coppa)return void(0,r.logInfo)("PubCommonId: IDs not provided for coppa requests, exiting PubCommonId");const{params:{extend:n=!1,pixelUrl:d}={}}=e;if(n){if(d){return{callback:v(d,t)}}return{id:t}}},domainOverride:(0,s.w)(c,"sharedId"),eids:{pubcid(e,o){const t={source:"pubcid.org",uids:e.map(e=>({id:e,atype:1}))};return null!=o?.params?.inserter&&(t.inserter=o.params.inserter),t}}};(0,d.bz)("userId",h),(0,n.E)("sharedIdSystem")}},e=>{e.O(0,[802,7769,315,1085,2764],()=>{return o=8959,e(e.s=o);var o});e.O()}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[89],{3240(e,t,r){var a=r(1748),i=r(3367),n=r(4603),s=r(611),o=r(3556),d=r(1933),p=r(9794),l=r(1443),u=r(466),c=r(8928),m=r(6665);const g="sharethrough";let b={},y=0,v=null;const h=(0,l.vM)({bidderCode:g});const x={getProtocol:function(){return window.location.protocol}},f=(0,s.A)({context:{netRevenue:!0,ttl:360}}),I={code:g,supportedMediaTypes:[p.G_,p.D4,p.s6],gvlid:80,isBidRequestValid:e=>!!e.params.pkey,buildRequests:(e,t)=>{const r=t.timeout,a=t.ortb2||{},s=x.getProtocol().indexOf("http")<0||x.getProtocol().indexOf("https")>-1,o={id:(0,u.generateUUID)(),at:1,cur:["USD"],tmax:r,site:{domain:(0,c.A)(t,"refererInfo.domain",window.location.hostname),page:(0,c.A)(t,"refererInfo.page",window.location.href),ref:(0,c.A)(t,"refererInfo.ref"),...a.site},device:{ua:navigator.userAgent,language:navigator.language,js:1,dnt:(0,i.l)()?1:0,h:window.screen.height,w:window.screen.width,ext:{}},regs:{coppa:!0===d.$W.getConfig("coppa")?1:0,ext:{}},source:{tid:t.ortb2?.source?.tid,ext:{version:"10.29.0",str:"4.3.0",schain:e[0]?.ortb2?.source?.ext?.schain}},bcat:(0,c.A)(t.ortb2,"bcat")||e[0].params.bcat||[],badv:(0,c.A)(t.ortb2,"badv")||e[0].params.badv||[],test:0};if(o.user=a.user??{},o.user.ext||(o.user.ext={}),o.user.ext.eids=e[0].userIdAsEids||[],e[0].params.equativNetworkId){v=!0,y=e[0].params.equativNetworkId,o.site.publisher={id:e[0].params.equativNetworkId,...o.site.publisher};const t=h.getDataFromLocalStorage(n.mN);t&&(o.user.buyeruid=t)}if(t?.ortb2?.device&&(0,u.mergeDeep)(o.device,t.ortb2.device),t.gdprConsent){const e=!0===t.gdprConsent.gdprApplies;o.regs.ext.gdpr=e?1:0,e&&(o.user.ext.consent=t.gdprConsent.consentString)}t.uspConsent&&(o.regs.ext.us_privacy=t.uspConsent,o.regs.us_privacy=t.uspConsent),t?.gppConsent?.gppString?(o.regs.gpp=t.gppConsent.gppString,o.regs.gpp_sid=t.gppConsent.applicableSections):t?.ortb2?.regs?.gpp&&(o.regs.ext.gpp=t.ortb2.regs.gpp,o.regs.ext.gpp_sid=t.ortb2.regs.gpp_sid),t?.ortb2?.regs?.ext?.dsa&&(o.regs.ext.dsa=t.ortb2.regs.ext.dsa);const p=e.map(e=>{const r={ext:{}},a=(0,c.A)(e,"ortb2Imp.ext.tid");a&&(r.ext.tid=a);const i=(0,c.A)(e,"ortb2Imp.ext.gpid");i&&(r.ext.gpid=i);const n=(0,c.A)(e,"mediaTypes.native"),o=(0,c.A)(e,"mediaTypes.video");if(t.paapi?.enabled&&e.mediaTypes.banner&&(0,u.mergeDeep)(r,{ext:{ae:1}}),o){let[e,t]=[640,360];o.playerSize&&o.playerSize[0]&&o.playerSize[0][0]&&o.playerSize[0][1]&&([e,t]=o.playerSize[0]);const a=(e,t,r)=>{if(["api","battr","mimes","playbackmethod","protocols"].includes(e)){if((!Array.isArray(t[e])||0===t[e].length)&&t[e])return void(0,u.logWarn)(`Sharethrough: Invalid video request property: "${e}" must be an array with at least 1 entry.  Value supplied: "${t[e]}".  This will not be added to the bid request.`)}t[e]&&(r.video[e]=t[e])};r.video={pos:o.pos??0,topframe:(0,u.inIframe)()?0:1,w:e,h:t};const i=["api","battr","companiontype","delivery","linearity","maxduration","mimes","minduration","placement","playbackmethod","plcmt","protocols","skip","skipafter","skipmin","startdelay"];v||i.push("companionad"),i.forEach(e=>{a(e,o,r)})}else if(v&&n){const a=f.toORTB({bidRequests:[e],bidderRequest:t});r.native={...a.imp[0].native}}else{r.banner={pos:(0,c.A)(e,"mediaTypes.banner.pos",0),topframe:(0,u.inIframe)()?0:1,format:e.sizes.map(e=>({w:+e[0],h:+e[1]}))};const t=(0,c.A)(e,"mediaTypes.banner.battr",null)||(0,c.A)(e,"ortb2Imp.banner.battr");t&&(r.banner.battr=t)}const d=v?e.adUnitCode:String(e.params.pkey);return{id:e.bidId,tagid:d,secure:s?1:0,bidfloor:w(e),...r}}).filter(e=>!!e);let l=[];if(v){const t=e[0],r=d.$W.getConfig("currency.adServerCurrency")||"USD";l=(0,n.Fd)(p,t,r,b,"stx")}return p.map(e=>({method:"POST",url:v?"https://ssb.smartadserver.com/api/bid?callerId=233":"https://btlr.sharethrough.com/universal/v1?supply_id=WYu2BXv1",data:{...o,imp:v?l:[e]}}))},interpretResponse:(e,t)=>{let{body:r}=e;if(!r||!r.seatbid||0===r.seatbid.length||!r.seatbid[0].bid||0===r.seatbid[0].bid.length)return[];const a=r.ext?.auctionConfigs,i=t.data.imp[0],n=r.seatbid[0].bid.map(e=>{const t={requestId:v?b[e.impid]:e.impid,width:+e.w,height:+e.h,cpm:+e.price,creativeId:e.crid,dealId:e.dealid||null,mediaType:i.video?p.G_:i.native?p.s6:p.D4,currency:r.cur||"USD",netRevenue:!0,ttl:"number"==typeof e.exp&&e.exp>0?e.exp:360,ad:e.adm,nurl:e.nurl,meta:{advertiserDomains:e.adomain||[],networkId:e.ext?.networkId||null,networkName:e.ext?.networkName||null,agencyId:e.ext?.agencyId||null,agencyName:e.ext?.agencyName||null,advertiserId:e.ext?.advertiserId||null,advertiserName:e.ext?.advertiserName||null,brandId:e.ext?.brandId||null,brandName:e.ext?.brandName||null,demandSource:e.ext?.demandSource||null,dchain:e.ext?.dchain||null,primaryCatId:e.ext?.primaryCatId||"",secondaryCatIds:e.ext?.secondaryCatIds||[],mediaType:e.ext?.mediaType||null}};return t.mediaType===p.G_?(t.ttl=3600,t.vastXml=e.adm):t.mediaType===p.s6&&(t.native={ortb:JSON.parse(e.adm)}),t});return a&&!v?{bids:n,paapi:r.ext?.auctionConfigs||{}}:n},getUserSyncs:(e,t,r)=>{if(v)return(0,n.Wz)(e,t,r,y,h);return e.pixelEnabled&&void 0!==(0,c.A)(t,"0.body.cookieSyncUrls")?t[0].body.cookieSyncUrls.map(e=>({type:"image",url:e})):[]},onTimeout:e=>{},onBidWon:e=>{},onSetTargeting:e=>{}};function w(e){let t=null;if("function"==typeof e.getFloor){const r=e.getFloor({currency:"USD",mediaType:e.mediaTypes&&e.mediaTypes.video?"video":"banner",size:e.sizes.map(e=>({w:e[0],h:e[1]}))});(0,m.Qd)(r)&&"USD"===r.currency&&!isNaN(parseFloat(r.floor))&&(t=parseFloat(r.floor))}return null!==t?t:0}(0,o.a$)(I),(0,a.E)("sharethroughBidAdapter")}},e=>{e.O(0,[802,7769,315,1085,8498,467,4577],()=>{return t=3240,e(e.s=t);var t});e.O()}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[1606],{109(e,i,n){var t=n(1748),r=n(466),a=n(6665),d=n(3958),o=n(2592),s=n(7776);const l={checkBidderSizeConfigFormat:function(e){let i=!0;Array.isArray(e)&&e.length>0?e.forEach(e=>{const n=Object.keys(e);i=!!(n.includes("minViewPort")&&n.includes("relevantMediaTypes")&&(0,a.Uu)(e.minViewPort,2)&&Array.isArray(e.relevantMediaTypes)&&e.relevantMediaTypes.length>0&&(e.relevantMediaTypes.length>1?e.relevantMediaTypes.every(e=>["banner","video","native"].includes(e)):["none","banner","video","native"].indexOf(e.relevantMediaTypes[0])>-1))&&(i&&!0)}):i=!1;return i},getActiveSizeBucket:f,getFilteredMediaTypes:function(e){let i,n,t;t=(0,a.Go)(e);const r={banner:void 0,video:void 0,native:void 0};i=(0,d.Ot)().innerWidth,n=(0,d.Ot)().innerHeight;const o=[i,n];Object.keys(e).forEach(i=>{const n=e[i].sizeConfig;if(n){r[i]=f(n,o);const a=n.filter(e=>e.minViewPort===r[i]&&function(e,i){switch(e){case"banner":return i.sizes&&i.sizes.length>0&&i.sizes[0].length>0;case"video":return i.playerSize&&i.playerSize.length>0&&i.playerSize[0].length>0;case"native":return i.active;default:return!1}}(i,e));t[i]=Object.assign({filteredSizeConfig:a},e[i]);const d={banner:"sizes",video:"playerSize"};t[i].filteredSizeConfig.length>0?"native"!==i&&(t[i][d[i]]=t[i].filteredSizeConfig[0][d[i]]):delete t[i]}});return{sizeBucketToSizeMap:Object.keys(r).filter(e=>void 0!==r[e]).reduce((e,i)=>(e[i]={activeSizeBucket:r[i],activeSizeDimensions:"banner"===i?t.banner?t.banner.sizes:[]:"video"===i?t.video?t.video.playerSize:[]:"NA"},e),{}),activeViewport:o,transformedMediaTypes:t}},getAdUnitDetail:function(e,i,n){const t=l.isLabelActivated(e,i,e.code,n),{sizeBucketToSizeMap:a,activeViewport:d,transformedMediaTypes:o}=t&&l.getFilteredMediaTypes(e.mediaTypes);return t&&(0,r.logInfo)(`Size Mapping V2:: Ad Unit: ${e.code}(${n}) => Active size buckets after filtration: `,a),{activeViewport:d,transformedMediaTypes:o,isLabelActivated:t}},getRelevantMediaTypesForBidder:function(e,i){const n=new Set;if(l.checkBidderSizeConfigFormat(e)){const t=l.getActiveSizeBucket(e,i);e.filter(e=>e.minViewPort===t)[0].relevantMediaTypes.forEach(e=>n.add(e))}return n},isLabelActivated:function(e,i,n,t){let a;const d=Object.keys(e).filter(e=>"labelAny"===e||"labelAll"===e);d&&d.length>1&&(0,r.logWarn)("Size Mapping V2:: "+(e.code?`Ad Unit: ${e.code}(${t}) => Ad unit has multiple label operators. Using the first declared operator: ${d[0]}`:`Ad Unit: ${n}(${t}), Bidder: ${e.bidder} => Bidder has multiple label operators. Using the first declared operator: ${d[0]}`));if(a=d[0],a&&!i)return(0,r.logWarn)("Size Mapping V2:: "+(e.code?`Ad Unit: ${e.code}(${t}) => Found '${a}' on ad unit, but 'labels' is not set. Did you pass 'labels' to pbjs.requestBids() ?`:`Ad Unit: ${n}(${t}), Bidder: ${e.bidder} => Found '${a}' on bidder, but 'labels' is not set. Did you pass 'labels' to pbjs.requestBids() ?`)),!0;if("labelAll"===a&&Array.isArray(e[a]))return 0===e.labelAll.length?((0,r.logWarn)(`Size Mapping V2:: Ad Unit: ${e.code}(${t}) => Ad unit has declared property 'labelAll' with an empty array.`),!0):e.labelAll.every(e=>i.includes(e));if("labelAny"===a&&Array.isArray(e[a]))return 0===e.labelAny.length?((0,r.logWarn)(`Size Mapping V2:: Ad Unit: ${e.code}(${t}) => Ad unit has declared property 'labelAny' with an empty array.`),!0):e.labelAny.some(e=>i.includes(e));return!0}},c=new WeakMap;function p(e){return!!e.find(e=>{if(c.has(e))return c.get(e);if(e.mediaTypes){for(const i of Object.keys(e.mediaTypes))if(e.mediaTypes[i].sizeConfig)return c.set(e,!0),!0;for(const i of e.bids&&(0,a.cy)(e.bids)?e.bids:[])if(i.sizeConfig)return c.set(e,!0),!0;return c.set(e,!1),!1}return!1})}function f(e,i){let n=[];return e.sort((e,i)=>e.minViewPort[0]-i.minViewPort[0]).forEach(e=>{i[0]>=e.minViewPort[0]&&(n=i[1]>=e.minViewPort[1]?e.minViewPort:[])}),n}(0,o.Yn)("checkAdUnitSetup").before(function(e,i){return p(i)?(i=function(e){const i=function(e,i,n){let t=!0;const d={banner:"sizes",video:"playerSize",native:"active"}[e],o={banner:"Removing mediaTypes.banner from ad unit.",video:"Removing mediaTypes.video.sizeConfig from ad unit.",native:"Removing mediaTypes.native.sizeConfig from ad unit."};return Array.isArray(i)?(i.forEach((i,l)=>{const c=Object.keys(i);if(!c.includes("minViewPort")||!c.includes(d))return(0,r.logError)(`Ad unit ${n}: Missing required property 'minViewPort' or 'sizes' from 'mediaTypes.${e}.sizeConfig[${l}]'. ${o[e]}`),void(t=!1);if(!(0,a.Uu)(i.minViewPort,2))return(0,r.logError)(`Ad unit ${n}: Invalid declaration of 'minViewPort' in 'mediaTypes.${e}.sizeConfig[${l}]'. ${o[e]}`),void(t=!1);if("banner"===e||"video"===e){let a=!1;if(Array.isArray(i[d])){const e=s.WH.validateSizes(i[d]);i[d].length>0&&0===e.length&&(t=!1,a=!0)}else t=!1,a=!0;if(a)return void(0,r.logError)(`Ad unit ${n}: Invalid declaration of '${d}' in 'mediaTypes.${e}.sizeConfig[${l}]'. ${o[e]}`)}"native"===e&&"boolean"!=typeof i[d]&&((0,r.logError)(`Ad unit ${n}: Invalid declaration of 'active' in 'mediaTypes.${e}.sizeConfig[${l}]'. ${o[e]}`),t=!1)}),t):((0,r.logError)(`Ad unit ${n}: Invalid declaration of 'sizeConfig' in 'mediaTypes.${e}.sizeConfig'. ${o[e]}`),t=!1,t)},n=[];return e.forEach(e=>{if(null==(e=s.WH.validateAdUnit(e)))return;const t=e.mediaTypes;let d,o,l;t.banner&&(t.banner.sizes?d=s.WH.validateBannerMediaType(e):t.banner.sizeConfig?(d=(0,a.Go)(e),i("banner",t.banner.sizeConfig,e.code)?d.mediaTypes.banner.sizeConfig.forEach(e=>{Array.isArray(e.sizes[0])||(e.sizes=[e.sizes])}):delete d.mediaTypes.banner):((0,r.logError)(`Ad unit ${e.code}: 'mediaTypes.banner' does not contain either 'sizes' or 'sizeConfig' property. Removing 'mediaTypes.banner' from ad unit.`),d=(0,a.Go)(e),delete d.mediaTypes.banner)),t.video&&(t.video.playerSize?o=d?s.WH.validateVideoMediaType(d):s.WH.validateVideoMediaType(e):t.video.sizeConfig&&(o=d||(0,a.Go)(e),i("video",t.video.sizeConfig,e.code)?o.mediaTypes.video.sizeConfig.forEach(e=>{Array.isArray(e.playerSize[0])||(e.playerSize=[e.playerSize])}):delete o.mediaTypes.video.sizeConfig)),t.native&&(l=o?s.WH.validateNativeMediaType(o):d?s.WH.validateNativeMediaType(d):s.WH.validateNativeMediaType(e),t.native.sizeConfig)&&(i("native",t.native.sizeConfig,e.code)||delete l.mediaTypes.native.sizeConfig);const c=Object.assign({},d,o,l);n.push(c)}),n}(i),e.bail(i)):e.call(this,i)}),(0,o.Yn)("setupAdUnitMediaTypes").before(function(e,i,n){return p(i)?e.bail(function(e,i){const n={};return e.reduce((e,t)=>{const a=(n.hasOwnProperty(t.code)||(n[t.code]=1),n[t.code]++);if(t.mediaTypes&&(0,r.isValidMediaTypes)(t.mediaTypes)){const{activeViewport:n,transformedMediaTypes:d,isLabelActivated:o}=l.getAdUnitDetail(t,i,a);o?0===Object.keys(d).length?(0,r.logInfo)(`Size Mapping V2:: Ad Unit: ${t.code}(${a}) => Ad unit disabled since there are no active media types after sizeConfig filtration.`):(t.mediaTypes=d,t.bids=t.bids.reduce((e,o)=>{if(l.isLabelActivated(o,i,t.code,a))if(o.sizeConfig){const i=l.getRelevantMediaTypesForBidder(o.sizeConfig,n);if(0===i.size)(0,r.logError)(`Size Mapping V2:: Ad Unit: ${t.code}(${a}), Bidder: ${o.bidder} => 'sizeConfig' is not configured properly. This bidder won't be eligible for sizeConfig checks and will remain active.`),e.push(o);else if(i.has("none"))(0,r.logInfo)(`Size Mapping V2:: Ad Unit: ${t.code}(${a}), Bidder: ${o.bidder} => 'relevantMediaTypes' is set to 'none' in sizeConfig for current viewport size. This bidder is disabled.`);else{let n=!1;const s=Object.fromEntries(Object.entries(d).filter(e=>{let[t,r]=e;return!!i.has(t)||(n=!0,!1)}));Object.keys(s).length>0?(n&&(o.mediaTypes=s),e.push(o)):(0,r.logInfo)(`Size Mapping V2:: Ad Unit: ${t.code}(${a}), Bidder: ${o.bidder} => 'relevantMediaTypes' does not match with any of the active mediaTypes at the Ad Unit level. This bidder is disabled.`)}}else e.push(o);else(0,r.logInfo)(`Size Mapping V2:: Ad Unit: ${t.code}(${a}), Bidder: ${o.bidder} => Label check for this bidder has failed. This bidder is disabled.`);return e},[]),e.push(t)):(0,r.logInfo)(`Size Mapping V2:: Ad Unit: ${t.code}(${a}) => Ad unit is disabled due to failing label check.`)}else(0,r.logWarn)(`Size Mapping V2:: Ad Unit: ${t.code} => Ad unit has declared invalid 'mediaTypes' or has not declared a 'mediaTypes' property`);return e},[])}(i,n)):e.call(this,i,n)}),(0,t.E)("sizeMappingV2")}},e=>{e.O(0,[802,7769,315,1085],()=>{return i=109,e(e.s=i);var i});e.O()}]);
(self.sevioPbjsChunk=self.sevioPbjsChunk||[]).push([[3469],{7355(e,t,n){var o=n(1748),r=n(1933),s=n(8014),i=n(7776),a=n(8668),c=n(1418),u=n(2592),l=n(6665),d=n(466);const f=new Map;function g(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:f;const n={};function o(e){const t=JSON.stringify([e.source?.toLowerCase(),...Object.keys(e).filter(e=>!["uids","source"].includes(e)).sort().map(t=>e[t])]);n.hasOwnProperty(t)?n[t].uids.push(...e.uids):n[t]=e}return Object.entries(e).forEach(e=>{let[n,r]=e;r=Array.isArray(r)?r:[r];const s=t.get(n);let i;if("pubProvidedId"===n)i=(0,l.Go)(r);else if("function"==typeof s)try{i=(0,l.Go)(s(r)),Array.isArray(i)||(i=[i]),i.forEach(e=>{e.uids=e.uids.filter(e=>{let{id:t}=e;return(0,l.O8)(t)})}),i=i.filter(e=>{let{uids:t}=e;return t?.length>0})}catch(e){(0,d.logError)(`Could not generate EID for "${n}"`,e)}else i=r.map(e=>function(e,t,n){if(n&&e){const t={};t.source=(0,l.fp)(n.getSource)?n.getSource(e):n.source;const o=(0,l.fp)(n.getValue)?n.getValue(e):e;if((0,l.O8)(o)){const r={id:o,atype:n.atype};if((0,l.fp)(n.getUidExt)){const t=n.getUidExt(e);t&&(r.ext=t)}if(t.uids=[r],n.inserter||(0,l.fp)(n.getInserter)){const o=(0,l.fp)(n.getInserter)?n.getInserter(e):n.inserter;null!=o&&(t.inserter=o)}if(n.matcher||(0,l.fp)(n.getMatcher)){const o=(0,l.fp)(n.getMatcher)?n.getMatcher(e):n.matcher;null!=o&&(t.matcher=o)}if(null!=n.mm&&(t.mm=n.mm),(0,l.fp)(n.getEidExt)){const o=n.getEidExt(e);o&&(t.ext=o)}return t}}return null}(e,0,s));Array.isArray(i)&&i.filter(e=>null!=e).forEach(o)}),Object.values(n)}function m(e){const t=new Map,n={};return Object.entries(e).forEach(e=>{let[o,r]=e;const s=r();if(s){n[o]=s.idObj[o];let e=s.submodule.eids?.[o];"function"==typeof e&&(i=e,e=function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return i(...t,s.config)}),t.set(o,e)}var i}),g(n,t)}var b=n(1443),h=n(3435),p=n(3129),y=n(3064),I=n(7841),w=n(1780),E=n(1385),v=n(736),D=n(3202),S=n(5808),O=n(7610),k=n(3391),$=n(5291),j=n(7391);const x="User ID",A=b.X0,C=b.qk,T="_pbjs_id_optout",U=(0,b.CK)("userId"),N={isAllowed:D.io};let P,L,_,W,q,M=[],R=[],F={},G=[];const J=(()=>{let e;return()=>(null==e&&(e=(0,I.K7)()),e)})();function B(e){return J().fork().renameWith(t=>[`userId.mod.${t}`,`userId.mods.${e}.${t}`])}function K(e,t){t=t||e.storageMgr;const n="function"==typeof e.submodule.domainOverride?e.submodule.domainOverride():null,o=e.config.storage.name;return function(e,r,s){t.setCookie(o+(e||""),r,s,"Lax",n)}}function Q(e,t){const n=e.config.storage;try{const o=new Date(Date.now()+864e5*n.expires).toUTCString(),r=(0,l.Qd)(t)?JSON.stringify(t):t;e.enabledStorageTypes.forEach(t=>{switch(t){case A:!function(e,t,n){const o=e.config.storage,r=K(e);r(null,t,n),r("_cst",pe(),n),"number"==typeof o.refreshInSeconds&&r("_last",(new Date).toUTCString(),n)}(e,r,o);break;case C:!function(e,t,n){const o=e.config.storage,r=e.storageMgr;r.setDataInLocalStorage(`${o.name}_exp`,n),r.setDataInLocalStorage(`${o.name}_cst`,pe()),r.setDataInLocalStorage(o.name,encodeURIComponent(t)),"number"==typeof o.refreshInSeconds&&r.setDataInLocalStorage(`${o.name}_last`,(new Date).toUTCString())}(e,r,o)}})}catch(e){(0,d.logError)(e)}}const H=["","_last","_cst"];const V=["","_last","_exp","_cst"];function Y(e){Oe(e),e.enabledStorageTypes.forEach(t=>{switch(t){case A:!function(e){const t=K(e,U),n=new Date(Date.now()-864e5).toUTCString();H.forEach(e=>{try{t(e,"",n)}catch(e){(0,d.logError)(e)}})}(e);break;case C:!function(e){V.forEach(t=>{try{U.removeDataFromLocalStorage(e.config.storage.name+t)}catch(e){(0,d.logError)(e)}})}(e)}})}function Z(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:void 0;const n=e.config.storage,o=t?`${n.name}_${t}`:n.name;let r;try{e.enabledStorageTypes.find(t=>{switch(t){case A:r=function(e,t){return e.storageMgr.getCookie(t)}(e,o);break;case C:r=function(e,t){const n=e.storageMgr,o=e.config.storage,r=n.getDataFromLocalStorage(`${o.name}_exp`);return""===r?n.getDataFromLocalStorage(t):r&&new Date(r).getTime()-Date.now()>0?decodeURIComponent(n.getDataFromLocalStorage(t)):void 0}(e,o)}return!!r}),"string"==typeof r&&"{"===r.trim().charAt(0)&&(r=JSON.parse(r))}catch(e){(0,d.logError)(e)}return r}function z(e,t,n){t=J().fork().startTiming("userId.callbacks.total").stopBefore(t);const o=(0,d.delayExecution)(()=>{clearTimeout(void 0),t()},e.length);e.forEach(function(e){const t=B(e.submodule.name).startTiming("callback").stopBefore(o);try{e.callback(function(o){o?(e.config.storage&&Q(e,o),e.idObj=e.submodule.decode(o,e.config),n.refresh(),Ie(n)):(0,d.logInfo)(`${x}: ${e.submodule.name} - request id responded with an empty value`),t()},Z.bind(null,e))}catch(n){(0,d.logError)(`Error in userID module '${e.submodule.name}':`,n),t()}e.callback=void 0})}function X(e,t,n){const o={};return e.forEach(e=>{const r=n(e),s=function(e){if(e.primaryIds)return e.primaryIds;const t=Object.keys(e.eids??{});if(t.length>1)throw new Error(`ID submodule ${e.name} can provide multiple IDs, but does not specify 'primaryIds'`);return t}(r);t(e).forEach(t=>{const n=o[t]=o[t]??[],i=F[t]?.indexOf(r.name)??(s.includes(t)?0:-1),a=n.findIndex(e=>{let[t]=e;return t<i});n.splice(-1===a?n.length:a,0,[i,e])})}),Object.fromEntries(Object.entries(o).map(e=>{let[t,n]=e;return[t,n.map(e=>{let[t,n]=e;return n})]}))}function ee(){const e={submodules:[],global:{},bidder:{},combined:{},refresh(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];const n=new Set(t.map(e=>e.submodule));e.submodules=e.submodules.filter(e=>!n.has(e.submodule)).concat(t),function(){const t=X(e.submodules,e=>Object.keys(e.idObj??{}),e=>e.submodule),n={},o={};function r(e,t,n){return function(){for(const{allowed:o,bidders:r,module:s}of n){if(!N.isAllowed(S.yl,(0,O.s)(v.fW,s?.config?.name,{init:!1})))continue;const i=s.idObj?.[e];if(null!=i){if(o)return s;if(t){const t=e=>e.map(e=>e.module.submodule.name).join(", ");return(0,d.logWarn)(`userID modules ${t(n)} provide the same ID ('${e}'); ${s.submodule.name} is the preferred source, but it's configured only for some bidders, unlike ${t(n.filter(e=>null==e.bidders))}. Other bidders will not see the "${e}" ID.`),null}if(null==r)return null}}return null}}Object.entries(t).forEach(e=>{let[t,s]=e,i=!0;const a=new Set;s=s.map(e=>{let t=null;return Array.isArray(e.config.bidders)&&e.config.bidders.length>0?(t=e.config.bidders,t.forEach(e=>a.add(e))):i=!1,{module:e,bidders:t}}),i||(n[t]=r(t,!0,s.map(e=>{let{bidders:t,module:n}=e;return{allowed:null==t,bidders:t,module:n}}))),a.forEach(e=>{o[e]=o[e]??{},o[e][t]=r(t,!1,s.map(t=>{let{bidders:n,module:o}=t;return{allowed:n?.includes(e),bidders:n,module:o}}))})});const s=Object.values(o).concat([n]).reduce((e,t)=>Object.assign(e,t),{});Object.assign(e,{global:n,bidder:o,combined:s})}()}};return e}function te(e){let{ortb2Fragments:t}=e;t=t??{global:{},bidder:{}},function(e){const{global:t,bidder:n}=e,{global:o,bidder:r}=P,s=m(o);s.length>0&&(0,h.J)(t,"user.ext.eids",(t.user?.ext?.eids??[]).concat(s)),Object.entries(r).forEach(e=>{let[t,o]=e;const r=m(o);r.length>0&&(0,h.J)(n,`${t}.user.ext.eids`,(n[t]?.user?.ext?.eids??[]).concat(r))})}(t)}const ne={};let oe;function re(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:ue()||[];const t=W&&e.find(e=>e.source===W);if(t&&"string"==typeof t?.uids?.[0]?.id){const e=t.uids[0].id.replace(/[\W_]/g,"");if(e.length>=32&&e.length<=150)return e;(0,d.logWarn)(`User ID - Googletag Publisher Provided ID for ${W} is not between 32 and 150 characters - ${e}`)}}const se=(0,I.Ak)("userId",function(e,t){let{mkDelay:n=y.cb,getIds:o=he}=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};y.U9.race([o().catch(()=>null),n(_)]).then(()=>{te(t),J().join((0,I.BO)(t.metrics),{propagate:!1,includeGroups:!0}),e.call(this,t)})});function ie(e,t){t.forEach(e=>{e.bids.forEach(t=>Object.defineProperty(t,"userIdAsEids",{configurable:!0,get:()=>e.ortb2.user?.ext?.eids??[]}))}),e(t)}function ae(e,t){const n={},o=t.getFPD()?.global?.user?.ext?.eids??[];t.getAdUnits().flatMap(e=>e.bids).forEach(e=>{const r=null==(s=e.bidder)?o:(n.hasOwnProperty(s)||(n[s]=(0,d.mergeDeep)({eids:[]},{eids:o},{eids:t.getFPD()?.bidder?.[s]?.user?.ext?.eids??[]}).eids),n[s]);var s;r.length>0&&(e.userIdAsEids=r)}),e(t)}function ce(){return e=P.combined,Object.fromEntries(Object.entries(e).map(e=>{let[t,n]=e;return[t,n()?.idObj?.[t]]}).filter(e=>{let[t,n]=e;return null!=n}));var e}function ue(){return m(P.combined)}function le(e){return ue().filter(t=>t.source===e)[0]}function de(e,t,n){return me().then(()=>{const o={};if((0,l.fp)(n)){(0,d.logInfo)(`${x} - Getting encrypted signal from custom function : ${n.name} & source : ${e} `);const t=n(e);o[e]=t?fe(t):null}else{const n=le(e);(0,d.logInfo)(`${x} - Getting encrypted signal for eids :${JSON.stringify(n)}`),(0,d.isEmpty)(n)||(o[n.source]=!0===t?fe(n):n.uids[0].id)}return(0,d.logInfo)(`${x} - Fetching encrypted eids: ${o[e]}`),o[e]})}function fe(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,n="";if(1===t)n="object"==typeof e?window.btoa(JSON.stringify(e)):window.btoa(e);return`${t}||${n}`}function ge(){if(!(0,d.isGptPubadsDefined)())return;const e=r.$W.getConfig("userSync.encryptedSignalSources");if(e){const t=e.registerDelay||0;setTimeout(()=>{e.sources&&e.sources.forEach(e=>{let{source:t,encrypt:n,customFunc:o}=e;t.forEach(e=>{window.googletag.secureSignalProviders.push({id:e,collectorFunction:()=>de(e,n,o)})})})},t)}else(0,d.logWarn)(`${x} - ESP : encryptedSignalSources config not defined under userSync Object`)}function me(e){return oe(e).then(()=>ce(),e=>e===ne?Promise.resolve().then(he):((0,d.logError)("Error initializing userId",e),y.U9.reject(e)))}function be(){let{submoduleNames:e}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1?arguments[1]:void 0;return me({refresh:!0,submoduleNames:e}).then(e=>(t&&(0,l.fp)(t)&&t(),e))}function he(){return me()}function pe(){let e=Number(E.SL.hash);const t=[];for(;e>0;)t.push(String.fromCharCode(255&e)),e>>>=8;return btoa(t.join(""))}function ye(e,t){const n=E.SL.getConsentData();if(e.config.storage){let o,r=Z(e),s=!1;if("number"==typeof e.config.storage.refreshInSeconds){const t=new Date(Z(e,"last"));s=t&&Date.now()-t.getTime()>1e3*e.config.storage.refreshInSeconds}if(!r||s||t||function(e){const t=Z(e,"cst");return!t||t!==pe()}(e)){const t=Object.assign({enabledStorageTypes:e.enabledStorageTypes},e.config);o=e.submodule.getId(t,n,r)}else"function"==typeof e.submodule.extendId&&(o=e.submodule.extendId(e.config,n,r));(0,l.Qd)(o)&&(o.id&&(Q(e,o.id),r=o.id),"function"==typeof o.callback&&(e.callback=o.callback)),r&&(e.idObj=e.submodule.decode(r,e.config))}else if(e.config.value)e.idObj=e.config.value;else{const t=e.submodule.getId(e.config,n);(0,l.Qd)(t)&&("function"==typeof t.callback&&(e.callback=t.callback),t.id&&(e.idObj=e.submodule.decode(t.id,e.config)))}}function Ie(e){const t=m(e.combined);if(t.length&&W){const e=re(t);e&&((0,d.isGptPubadsDefined)()?window.googletag.pubads().setPublisherProvidedId(e):(window.googletag=window.googletag||{},window.googletag.cmd=window.googletag.cmd||[],window.googletag.cmd.push(function(){window.googletag.pubads().setPublisherProvidedId(e)})))}}function we(e,t){let n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];return J().fork().measureTime("userId.init.modules",function(){if(!t.length)return[];if(t.forEach(e=>Oe(e)),!(t=t.filter(e=>(!e.config.storage||!!e.enabledStorageTypes.length)&&N.isAllowed(S.yl,(0,O.s)(v.fW,e.config.name)))).length)return(0,d.logWarn)(`${x} - no ID module configured`),[];const o=t.reduce((e,t)=>B(t.submodule.name).measureTime("init",()=>{try{ye(t,n),e.push(t)}catch(e){(0,d.logError)(`Error in userID module '${t.submodule.name}':`,e)}return e}),[]);return e.refresh(o),Ie(e),o})}function Ee(e){return e?.storage?.type?.trim().split(/\s*&\s*/)||[]}function ve(e){function t(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),o=1;o<t;o++)n[o-1]=arguments[o];(0,d.logWarn)(`Invalid userSync.userId config: ${e}`,...n)}return Array.isArray(e)?e.filter(e=>{if(!e?.name)return t('must specify "name"',e);if(e.storage){if(!e.storage.name||!e.storage.type)return t('must specify "storage.name" and "storage.type"',e);if(!function(e){return Ee(e).every(e=>De.has(e))}(e))return t('invalid "storage.type"',e);["expires","refreshInSeconds"].forEach(n=>{let o=e.storage[n];null!=o&&"number"!=typeof o&&(o=Number(o),isNaN(o)?(t(`storage.${n} must be a number and will be ignored`,e),delete e.storage[n]):e.storage[n]=o)})}return!0}):(null!=e&&t("must be an array",e),[])}const De=new Set([C,A]);const Se=[1,2,3,4,7];function Oe(e){if(e.enabledStorageTypes)return;const t=Ee(e.config);e.enabledStorageTypes=t.filter(t=>{switch(t){case C:return V.forEach(t=>{(0,b.p6)("userId",{type:"web",identifier:e.config.storage.name+t,purposes:Se})}),function(e){return!(!e.storageMgr.localStorageIsEnabled()||U.getDataFromLocalStorage(T)&&((0,d.logInfo)(`${x} - opt-out localStorage found, storage disabled`),1))}(e);case A:return H.forEach(t=>{(0,b.p6)("userId",{type:"cookie",identifier:e.config.storage.name+t,purposes:Se,maxAgeSeconds:24*(e.config.storage.expires??0)*60*60,cookieRefresh:!0})}),function(e){return!(!e.storageMgr.cookiesAreEnabled()||U.getCookie(T)&&((0,d.logInfo)(`${x} - opt-out cookie found, storage disabled`),1))}(e)}return!1})}function ke(e){f.clear(),Object.entries(X(e,e=>Object.keys(e.eids||{}),e=>e)).forEach(e=>{let[t,n]=e;return f.set(t,n[0].eids[t])})}function $e(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};ke(G);const t=ve(R);if(!t.length)return;const n=function(e,t){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:M,o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:G;const{autoRefresh:r,retainConfig:s}=e;return o.reduce((e,o)=>{const{name:i,aliasName:a}=o,c=e=>[i,a].some(t=>t?.toLowerCase()===e.toLowerCase()),u=t.find(e=>c(e.name));if(!u){if(!s)return e;const t=n.find(e=>c(e.config.name));return t?[...e,t]:e}const l={submodule:o,config:{...u,name:o.name},callback:void 0,idObj:void 0,storageMgr:(0,b.le)({moduleType:v.fW,moduleName:u.name,advertiseKeys:!1})};if(r){const e=n.find(e=>c(e.config.name));l.refreshIds=!e||!(0,d.deepEqual)(l.config,e.config)}return[...e,l]},[])}(e,t);M.splice(0,M.length),M.push(...n),M.length&&(i.gH.getHooks({hook:se}).length||(i.gH.before(se,100),a.Ay.callDataDeletionRequest.before(je),p.Q.after(e=>e(re()))),(0,d.logInfo)(`${x} - usersync config updated for ${M.length} submodules: `,M.map(e=>e.submodule.name)))}function je(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),o=1;o<t;o++)n[o-1]=arguments[o];(0,d.logInfo)("UserID: received data deletion request; deleting all stored IDs..."),M.forEach(e=>{if("function"==typeof e.submodule.onDataDeletionRequest)try{e.submodule.onDataDeletionRequest(e.config,e.idObj,...n)}catch(t){(0,d.logError)(`Error calling onDataDeletionRequest for ID submodule ${e.submodule.name}`,t)}Y(e)}),e.apply(this,n)}function xe(e){return function(){for(var t=arguments.length,n=new Array(t),o=0;o<t;o++)n[o]=arguments[o];return Promise.resolve(e.apply(this,n))}}const Ae=(e,t)=>n=>{if(n[$.Dk]!==v.fW||!n[$.OI])return;const o=e.find(e=>{return t=e.name,n[$.iK]?.toLowerCase()===t?.toLowerCase();var t});if(o&&o.storage&&n[$.Zw]!==o.storage.type){const e=`${o.name} attempts to store data in ${n[$.Zw]} while configuration allows ${o.storage.type}.`;if(t)return{allow:!1,reason:e};(0,d.logWarn)(e)}};function Ce(e){let t,{mkDelay:n=y.cb}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};W=void 0,M=[],R=[],P=ee(),oe=function(){let{mkDelay:e=y.cb}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const t=(0,y.v6)(),n=(0,y.v6)();let o,r,i=!1;function a(e){return r=J().fork(),null!=o&&o.reject(ne),o=(0,y.v6)(),y.U9.race([e,o.promise]).finally(r.startTiming("userId.total"))}const d=P,f=M;function g(e){return function(){if(d===P&&f===M)return e(...arguments)}}function m(){return E.SL.promise.finally(r.startTiming("userId.init.consent"))}let b=a(y.U9.all([u.Gc,t.promise]).then(m).then(g(()=>{we(d,f)})).then(()=>n.promise.finally(r.startTiming("userId.callbacks.pending"))).then(g(()=>{const e=d.submodules.filter(e=>(0,l.fp)(e.callback));if(e.length)return new y.U9(t=>z(e,t,d))})));return function(){let{refresh:o=!1,submoduleNames:r=null,ready:u=!1}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return u&&!i&&(i=!0,t.resolve(),_>0?n.resolve():s.on(c.qY.AUCTION_END,function t(){s.AU(c.qY.AUCTION_END,t),e(L).then(n.resolve)})),o&&i&&(b=a(b.catch(()=>null).then(m).then(g(()=>{const e=we(d,f.filter(e=>null==r||r.includes(e.submodule.name)),!0).filter(e=>null!=e.callback);if(e.length)return new y.U9(t=>z(e,t,d))})))),b}}({mkDelay:n}),null!=q&&q(),G=[],q=e.getConfig("userSync",e=>{const n=e.userSync;if(n&&(W=n.ppid,n.userIds)){const{autoRefresh:e=!1,retainConfig:o=!0,enforceStorageType:r}=n;R=n.userIds,L=(0,l.Et)(n.syncDelay)?n.syncDelay:k.qh.syncDelay,_=(0,l.Et)(n.auctionDelay)?n.auctionDelay:k.qh.auctionDelay,$e({retainConfig:o,autoRefresh:e}),t?.(),t=(0,D.qB)(S.Ue,"enforceStorageTypeRule",Ae(M.map(e=>{let{config:t}=e;return t}),r)),function(e,t){if(e){const n={},o=new Map(t.map(e=>e.aliasName?[e.aliasName,e.name]:[]));Object.keys(e).forEach(t=>{const r=(0,l.cy)(e[t])?[...e[t]].reverse():[];n[t]=r.map(e=>o.has(e)?o.get(e):e)}),F=n}else F={};P.refresh(),ke(t)}(n.idPriority,G),oe({ready:!0});const s=M.filter(e=>e.refreshIds);s.length&&be({submoduleNames:s.map(e=>e.submodule.name)})}}),a.Ay.makeBidRequests.after(ie),j.NE.before(ae),(0,i.xu)("getUserIds",ce),(0,i.xu)("getUserIdsAsEids",ue),(0,i.xu)("getEncryptedEidsForSource",xe(de)),(0,i.xu)("registerSignalSources",ge),(0,i.xu)("refreshUserIds",xe(be)),(0,i.xu)("getUserIdsAsync",xe(he)),(0,i.xu)("getUserIdsAsEidBySource",le)}Ce(r.$W),(0,u.xG)("userId",function(e){e.findRootDomain=w.S,(G||[]).find(t=>t.name===e.name)||(G.push(e),E.o2.register(v.fW,e.name,e.gvlid),$e(),oe({refresh:!0,submoduleNames:[e.name]}))},{postInstallAllowed:!0}),(0,o.E)("userId")}},e=>{e.O(0,[802,7769,315,1085],()=>{return t=7355,e(e.s=t);var t});e.O()}]);
})(),sevioPbjs.processQueue();
  });
  /* === PREBID BUNDLE END === */

  // --- Bind to sevioPbjs: hide internals but keep required API surface ---
  const realPbjs = window.sevioPbjs || (window.sevioPbjs = { que: [] });

  const allowFn = new Set([
    'requestBids',
    'setConfig',
    'getConfig',
    'getBidResponses',
    'getBidResponsesForAdUnitCode',
    'getEvents',
    'getUserIds',
    'getUserIdsAsEidBySource',
    'getUserIdsAsEids',
    'getUserIdsAsync',
    'onEvent',
    'offEvent',
    'addAdUnits',
    'processQueue',
    'que',
    'renderAd',
    'removeAdUnit',
    'enableAnalytics',
    'setTargetingForGPTAsync',
    'getAdserverTargetingForAdUnitCode',
    'getAllWinningBids',
    'getHighestCpmBids'
  ]);
  const allowProp = new Set([
    'adServers',
    'version',
    'que',
    'installedModules',
    'bidderSettings',
    'libLoaded',
    'sevioAnalytics'
  ]);

  // sevioDebug is the ONLY way to allow debug
  sevioDebugActive = sevioDebug === 'true' || sevioDebugLS === 'true';

  const clone = (v) => {
    if (v && typeof v === 'object') {
      try {
        return JSON.parse(JSON.stringify(v));
      } catch {
        /* ignore */
      }
    }
    return v;
  };

  const runtimeWriteAllow = new Set([
    'installedModules',
    'installedChunks',
    'c',
    'm',
    'p'
  ]);
  const pbProxy = new Proxy(
    {},
    {
      get: (_t, key) => {
        if (key === 'que' || key === 'cmd') return realPbjs.que;

        // mask direct reads of debug unless allowed
        if (key === 'debug' && !sevioDebugActive) return false;

        if (allowProp.has(key)) return realPbjs[key];

        if (allowFn.has(key) && typeof realPbjs[key] === 'function') {
          if (key === 'setConfig') {
            return function setConfigGuard(cfg) {
              const call = () => {
                if (!sevioDebugActive && cfg && typeof cfg === 'object') {
                  const copy = { ...cfg };
                  if ('debug' in copy) copy.debug = false;
                  return realPbjs.setConfig.call(realPbjs, copy);
                }
                return realPbjs.setConfig.apply(realPbjs, arguments);
              };
              return sevioDebugActive ? call() : withMutedConsole(call);
            };
          }
          if (key === 'getConfig') {
            return function getConfigGuard() {
              const res = realPbjs.getConfig.apply(realPbjs, arguments);
              if (!sevioDebugActive) {
                if (arguments.length === 0) {
                  const c = clone(res) || {};
                  c.debug = false;
                  return c;
                }
                if (arguments[0] === 'debug') return false;
              }
              return res;
            };
          }
          // everything else: pass-through
          return realPbjs[key].bind(realPbjs);
        }
        return undefined; // hidden if not whitelisted
      },

      set: (_t, key, value) => {
        if ((key === 'que' || key === 'cmd') && Array.isArray(value)) {
          Array.prototype.push.apply(realPbjs.que, value);
          return true;
        }
        // allow writing allowed functions/props back to realPbjs
        if (
          allowFn.has(key) ||
          allowProp.has(key) ||
          runtimeWriteAllow.has(key)
        ) {
          realPbjs[key] = value;
          return true;
        }

        if (key === 'debug' && !sevioDebugActive) return true; // ignore writes
        return false; // block adding arbitrary props
      },

      has: (_t, key) =>
        key === 'que' ||
        key === 'cmd' ||
        allowFn.has(key) ||
        allowProp.has(key),

      ownKeys: () => ['que', 'cmd', ...allowFn, ...allowProp],

      getOwnPropertyDescriptor: (_t, key) => {
        if (key === 'que' || allowFn.has(key) || allowProp.has(key)) {
          // (fix no-nested-ternary) compute value with if/else
          let value;
          if (key === 'que' || key === 'cmd') {
            value = realPbjs.que;
          } else if (allowProp.has(key)) {
            value = realPbjs[key];
          } else if (allowFn.has(key) && typeof realPbjs[key] === 'function') {
            value = realPbjs[key].bind(realPbjs);
          } else {
            value = undefined;
          }
          return {
            configurable: false,
            enumerable: true,
            writable: false,
            value
          };
        }
        return undefined;
      }
    }
  );

  // Expose ONLY the proxy on the public global
  try {
    // Prefer redefining as accessor; if not possible, fall back to assignment
    Object.defineProperty(window, 'sevioPbjs', {
      configurable: false,
      enumerable: false,
      get: () => pbProxy,
      set: (v) => {
        // Allow pushing pre-init queues: window.sevioPbjs = { que: [...] }
        if (v && Array.isArray(v.que)) {
          Array.prototype.push.apply(realPbjs.que, v.que);
        }
      }
    });
  } catch {
    // If defineProperty fails (non-configurable), just assign proxy
    window.sevioPbjs = pbProxy;
  }

  const pb = window.sevioPbjs || {};

  // --- Force debug OFF by default (overrides pbjs_debug URL param) — muted ---
  try {
    withMutedConsole(() => {
      if (pb.setConfig) pb.setConfig({ debug: false });
    });
  } catch {
    /* ignore */
  }

  // --- Debug control (only via sevioDebug) ---
  const setSevioDebug = (on) => {
    sevioDebugActive = !!on;
    try {
      if (pb.setConfig) pb.setConfig({ debug: sevioDebugActive });
    } catch {
      console.log('[SEVIODEBUG] pb.setConfig not available');
    }
    console.log('[SEVIODEBUG] Prebid debug =', sevioDebugActive);
  };

  if (sevioDebugActive) {
    setSevioDebug(true);
  }

  // queue any startup logic safely (fix no-unused-expressions)
  pb.que = pb.que || [];

  window.sevioads = (function () {
    // Run initialization only once
    if (window.sevioadsInitialized) return window.sevioads;
    window.sevioadsInitialized = true;

    // SEVIO Analytics START
    pb.enableAnalytics([
      {
        provider: 'sevioAnalytics',
        options: {
          auctionsUrl: `${PREBID_ANALYTICS}/a`,
          interactionsUrl: `${PREBID_ANALYTICS}/i`
        }
      }
    ]);
    const sendPrebidAnalyticsEvents = (args) => {
      try {
        if (pb.sevioAnalytics === undefined) {
          if (sevioDebugActive)
            console.error('[SEVIODEBUG] - Sevio analytics not yet loaded.');
          return null;
        }

        pb.sevioAnalytics.sendPrebidAnalyticsEvents(args);
      } catch (e) {
        if (sevioDebugActive)
          console.error(
            '[SEVIODEBUG] - Cant send PREBID analytics events: ',
            e
          );
      }
    };

    const sendGamAnalyticsEvents = (args) => {
      try {
        if (pb.sevioAnalytics === undefined) {
          if (sevioDebugActive)
            console.error('[SEVIODEBUG] - Sevio analytics not yet loaded.');
          return null;
        }

        pb.sevioAnalytics.sendGamAnalyticsEvents(args);
      } catch (e) {
        if (sevioDebugActive)
          console.error('[SEVIODEBUG] - Cant send GAM analytics events: ', e);
      }
    };

    const waitForSevioAnalytics = (timeout = 15000, interval = 50) => {
      return new Promise((resolve, reject) => {
        const start = Date.now();

        const check = () => {
          if (pb?.sevioAnalytics) {
            return resolve(pb.sevioAnalytics);
          }

          if (Date.now() - start >= timeout) {
            return reject(new Error('Timeout waiting for pb.sevioAnalytics'));
          }

          setTimeout(check, interval);
        };

        check();
      });
    };

    const enableGamEventTracking = async () => {
      try {
        const analytics = await waitForSevioAnalytics();
        analytics.enableGamEventTracking();
      } catch (e) {
        if (sevioDebugActive) {
          console.error('[SEVIODEBUG] - Cant enable GAM event tracking:', e);
        }
      }
    };
    // SEVIO Analytics END

    const sevioQueue = [];
    const sevioAds = [];
    const inventoriesConfig = {};
    const inventoryRefreshRegistry = {};
    const zoneIdTracker = {};
    const SEVIO_STORAGE_KEY = 'sevioads';
    const INV_CFG_REFRESH_INTERVAL_MS = 900000; // 15 minutes
    const SLOT_ID_PREFIX = 'sevio-ad';

    // === START Helper methods (private) ===
    const getPlaceholderByZoneId = function (zoneId) {
      const elements = document.querySelectorAll(
        `[data-zone="${zoneId}"]:not([id^="${SLOT_ID_PREFIX}"])`
      );
      return elements.length > 0 ? elements[0] : null;
    };

    const getVarDefaultValue = (varList, varName) => {
      if (!varList || !varName) return '';
      const varProps = varList.find((variable) => variable.name === varName);

      return varProps ? varProps.defaultValue : '';
    };

    /* Detect Keywords Start */
    const getKeywordsForZone = (ad) => {
      let keywords = ad.keywords || [];

      const jsonKeywords = detectJsonLdKeywords();
      if (jsonKeywords && jsonKeywords.length) {
        keywords.push(...jsonKeywords);
        return keywords;
      }

      const headerKeywords = detectHeaderKeywords();
      if (headerKeywords && headerKeywords.length) {
        keywords.push(...headerKeywords);
        return keywords;
      }

      const titleH1UrlKeywords = detectTitleAndH1AndUrl();
      if (titleH1UrlKeywords) {
        keywords.push(...titleH1UrlKeywords);
        return keywords;
      }

      return keywords;
    };

    const detectHeaderKeywords = () => {
      const metaTags = document.getElementsByTagName('meta');
      for (let i = 0; i < metaTags.length; i++) {
        const metaTag = metaTags[i];
        if (metaTag.getAttribute('name') === 'keywords') {
          const keywords = metaTag.getAttribute('content');
          return keywords
            ? keywords.split(',').map((keyword) => keyword.trim())
            : [];
        }
      }

      return [];
    };

    const detectJsonLdKeywords = () => {
      const scriptTags = document.querySelectorAll(
        'script[type="application/ld+json"]'
      );
      let keywords = [];

      for (let i = 0; i < scriptTags.length; i++) {
        const scriptTag = scriptTags[i];

        try {
          const jsonData = JSON.parse(scriptTag.textContent);
          const jsonObjects = Array.isArray(jsonData) ? jsonData : [jsonData];

          for (let j = 0; j < jsonObjects.length; j++) {
            const jsonObject = jsonObjects[j];

            if (
              jsonObject.keywords &&
              typeof jsonObject.keywords === 'string'
            ) {
              keywords.push(
                ...jsonObject.keywords
                  .split(',')
                  .map((keyword) => keyword.trim())
                  .filter((keyword) => keyword.length > 0)
              );
            }
          }
        } catch (error) {
          if (sevioDebugActive) console.error('Error parsing JSON-LD:', error);
        }
      }

      return keywords;
    };

    const detectTitleAndH1AndUrl = () => {
      const MAX_KEYWORDS = 12;
      const MIN_WORD_LEN = 2;

      try {
        const title = (
          document.querySelector('title')?.textContent || ''
        ).trim();
        const h1 = Array.from(document.querySelectorAll('h1'))
          .map((el) => (el.textContent || '').trim())
          .filter(Boolean)
          .join(' ');
        const { hostname, pathname } = window.location;

        // URL normalization
        const path = decodeURIComponent(pathname || '');
        const urlWithSpaces = path.replace(/[-_]+/g, ' ');
        const urlNoBreak = path.replace(/[-_]/g, '');
        const hostWords = (hostname || '').replace(/\./g, ' ');

        const raw = [title, h1, urlWithSpaces, urlNoBreak, hostWords].join(' ');

        // ---- tiny RAKE-like candidate generation & scoring ----
        const STOP = new Set([
          'a',
          'an',
          'and',
          'the',
          'of',
          'in',
          'on',
          'for',
          'to',
          'from',
          'by',
          'with',
          'as',
          'at',
          'is',
          'are',
          'was',
          'were',
          'be',
          'been',
          'being',
          'or',
          'if',
          'then',
          'else',
          'than',
          'that',
          'this',
          'those',
          'these',
          'it',
          'its',
          'into',
          'about',
          'over',
          'under',
          'between',
          'within',
          'without',
          'across',
          'up',
          'down',
          'out',
          'off',
          'per',
          'via',
          'you',
          'your',
          'we',
          'our',
          'they',
          'their',
          'i',
          'me',
          'my',
          'he',
          'she',
          'his',
          'her',
          'them',
          'us',
          'can',
          'could',
          'should',
          'would',
          'may',
          'might',
          'will',
          'just',
          'not',
          'no',
          'yes',
          'how',
          'what',
          'when',
          'where',
          'why',
          'which'
        ]);

        const norm = (s) =>
          s
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        const tokens = norm(raw).split(' ');

        // Split into candidate phrases on stopwords; cap phrase length to 3
        const phrasesTok = [];
        let cur = [];
        for (const t of tokens) {
          if (!t || STOP.has(t)) {
            if (cur.length) {
              phrasesTok.push(cur.slice(0, 3));
              cur = [];
            }
          } else {
            cur.push(t);
          }
        }
        if (cur.length) phrasesTok.push(cur.slice(0, 3));

        const phraseStrs = phrasesTok
          .filter((p) => p.length && !p.every((tok) => /^\d+$/.test(tok)))
          .map((p) => p.join(' '));

        // Word stats: frequency & degree (RAKE-like)
        const freq = Object.create(null);
        const deg = Object.create(null);
        for (const p of phraseStrs) {
          const ws = p.split(' ');
          const d = ws.length - 1;
          for (const w of ws) {
            freq[w] = (freq[w] || 0) + 1;
            deg[w] = (deg[w] || 0) + d;
          }
        }
        for (const w in freq) deg[w] += freq[w];

        // Phrase scores
        const scores = new Map();
        for (const p of phraseStrs) {
          let s = 0;
          for (const w of p.split(' ')) s += (deg[w] || 0) / (freq[w] || 1);
          scores.set(p, s);
        }

        // Rank phrases, then explode to words (implicit behavior)
        const rankedPhrases = [...scores.entries()]
          .sort(
            (a, b) =>
              b[1] - a[1] || b[0].split(' ').length - a[0].split(' ').length
          )
          .map(([p]) => p);

        const seen = new Set();
        const out = [];
        for (const ph of rankedPhrases) {
          for (const w of ph.split(' ')) {
            if (w.length >= MIN_WORD_LEN && !STOP.has(w) && !seen.has(w)) {
              seen.add(w);
              out.push(w);
              if (out.length >= MAX_KEYWORDS) break;
            }
          }
          if (out.length >= MAX_KEYWORDS) break;
        }

        return out; // resulted keywords array
      } catch {
        return [];
      }
    };
    /* Detect Keywords End */

    const doGetRequest = async (url) => {
      try {
        const res = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status} ${res.statusText}`);
        }

        return await res.text();
      } catch (err) {
        console.error('doGetRequest failed:', err);
        return null; // or rethrow, depending on your needs
      }
    };

    const updateLocalStorageKey = ({ key, nestedKey, value }) => {
      const settings = JSON.parse(localStorage.getItem(key)) || {};
      settings[nestedKey] = value;
      localStorage.setItem(key, JSON.stringify(settings));
    };

    const readLocalStorageKey = ({ key, nestedKey }) => {
      const settings = JSON.parse(localStorage.getItem(key)) || {};
      return nestedKey ? settings[nestedKey] : settings;
    };

    /* GAM Start */
    let _gptLoaderPromise = null;
    let _gptServicesEnabled = false;

    const loadGPT = () => {
      if (_gptLoaderPromise) return _gptLoaderPromise;

      _gptLoaderPromise = new Promise((resolve, reject) => {
        const GPT_SRC = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js';

        const onReady = () => {
          if (window.googletag && window.googletag.apiReady) {
            resolve(window.googletag);
          } else {
            // fallback via cmd queue
            window.googletag = window.googletag || { cmd: [] };
            window.googletag.cmd.push(() => resolve(window.googletag));
          }
        };

        // Already fully ready
        if (window.googletag?.apiReady) {
          return resolve(window.googletag);
        }

        // Script already exists
        const existingScript = [...document.scripts].find(
          (s) => s.src === GPT_SRC
        );

        if (existingScript) {
          return onReady();
        }

        // Inject script
        const script = document.createElement('script');
        applyNonceToScript(script);
        script.async = true;
        script.src = GPT_SRC;
        script.crossOrigin = 'anonymous';

        script.onload = onReady;
        script.onerror = () => reject(new Error('GPT load failed'));

        document.head.appendChild(script);
      });

      return _gptLoaderPromise;
    };

    const getGamDynamicSizes = (ad) => {
      const slotDiv = document.getElementById(ad.id);
      const maxWidth = Math.max(
        slotDiv?.clientWidth || 0,
        slotDiv?.parentElement?.clientWidth || 0,
        320
      );
      const dynamicSizes = [
        [970, 90],
        [728, 90],
        [320, 100],
        [320, 50],
        [1, 1]
      ];

      return dynamicSizes.filter((dz) => dz[0] <= maxWidth);
    };

    const defineGamSlot = async (zoneConfig, ad, sizes) => {
      await loadGPT();

      window.googletag = window.googletag || {};
      window.googletag.cmd = window.googletag.cmd || [];

      window.googletag.cmd.push(function () {
        try {
          ad.gamSlot = window.googletag
            .defineSlot(
              zoneConfig?.gamSettings?.slotId || '',
              zoneConfig?.sizeType === 'DYNAMIC'
                ? getGamDynamicSizes(ad)
                : sizes,
              ad.id
            )
            .addService(window.googletag.pubads());

          // enable single request & services only once
          if (!_gptServicesEnabled) {
            try {
              window.googletag.setConfig({
                singleRequest: true,
                disableInitialLoad: true
              });
              window.googletag.enableServices();
              enableGamEventTracking();
              // In case Adsense wins the bid, do not refresh ad further
              window.googletag
                .pubads()
                .addEventListener('slotRenderEnded', (e) => {
                  const ad = sevioAds?.find(
                    (sa) => sa.id === e.slot.getSlotElementId()
                  );
                  if (
                    ad &&
                    !e.isEmpty &&
                    (e.lineItemId === null ||
                      e.sourceAka === 'adsense' ||
                      e.sourceAka === 'adx')
                  ) {
                    ad.doNotRefresh = true;
                    if (sevioDebugActive)
                      console.info('[SEVIODEBUG][GAM] Ad refresh stop');
                  }

                  // Render default/fallback bid if available
                  if (e.isEmpty) {
                    ad.render();
                  }
                });
            } catch (e) {
              // pubads may not be ready yet; still safe because cmd queue guarantees ordering
            }
            _gptServicesEnabled = true;
          }
          window.googletag.display(ad.id);
        } catch (err) {
          if (sevioDebugActive)
            console.error('[SEVIODEBUG][GAM] defineSlot error', err);
        }
      });
    };

    const adjustGamSizeForDynamicAd = (
      adUnitCode,
      zoneConfig,
      winningBid,
      gamSlot
    ) => {
      const slotDiv = document.getElementById(adUnitCode);

      if (slotDiv && winningBid && zoneConfig.sizeType === 'DYNAMIC') {
        if (winningBid.width && winningBid.widthUnit === '%')
          winningBid.width =
            ((slotDiv.clientWidth ||
              slotDiv.parentElement?.clientWidth ||
              winningBid.width) *
              winningBid.width) /
            100;
        if (winningBid.height && winningBid.heightUnit === '%')
          winningBid.height =
            ((slotDiv.clientHeight ||
              slotDiv.parentElement?.clientHeight ||
              winningBid.height) *
              winningBid.height) /
            100;

        if (winningBid.width && winningBid.height) {
          gamSlot.setTargeting(
            'hb_size',
            `${winningBid.width}x${winningBid.height}`
          );
        } else {
          if (sevioDebugActive)
            console.log(
              '[SEVIODEBUG] Unable to adjust hb_size for dynamic banner'
            );
        }
      }
    };

    const requestAdFromGam = ({
      adUnitCode,
      isRefresh,
      zoneConfig,
      auctionId,
      winningBid,
      ad
    }) => {
      window.googletag = window.googletag || {};
      window.googletag.cmd = window.googletag.cmd || [];
      window.googletag.cmd.push(async function () {
        try {
          pb.setTargetingForGPTAsync();
          adjustGamSizeForDynamicAd(
            adUnitCode,
            zoneConfig,
            winningBid,
            ad.gamSlot
          );

          window.googletag.pubads().refresh([ad.gamSlot]);

          sendGamAnalyticsEvents({
            adUnitCode,
            isRefresh,
            tagDetails: zoneConfig,
            auctionId,
            prebidWinningBid: winningBid
          });
        } catch (e) {
          if (sevioDebugActive)
            console.error('[SEVIODEBUG][GAM] display error', e);
        }
      });
    };
    /* GAM End */

    /* Render Ads Start */
    const readInventoriesConfigFromLS = () => {
      const stored =
        readLocalStorageKey({
          key: SEVIO_STORAGE_KEY
        }) || {};
      Object.keys(stored).forEach((key) => {
        if (key.startsWith('invCfg_') && stored[key] && !stored[key].loading) {
          const inventoryId = key.replace('invCfg_', '');
          inventoriesConfig[inventoryId] = stored[key];
        }
      });
    };
    readInventoriesConfigFromLS(); // ✅ Run only once at page loading

    const scheduleInventoryConfigRefresh = (ad) => {
      if (!ad || !ad.inventoryId) return;
      const inventoryId = ad.inventoryId;
      const accountId = ad.accountId;

      if (!inventoryRefreshRegistry[inventoryId]) {
        inventoryRefreshRegistry[inventoryId] = {
          timerId: null,
          nextRefreshAt: null,
          pending: false,
          accountId
        };
      }
      const reg = inventoryRefreshRegistry[inventoryId];
      reg.accountId = accountId || reg.accountId;

      // Compute next refresh time based on stored loadedAt (fall back to now)
      const stored = inventoriesConfig[inventoryId];
      const loadedAt =
        typeof stored?.loadedAt === 'number' ? stored.loadedAt : Date.now();
      const desiredNext = loadedAt + INV_CFG_REFRESH_INTERVAL_MS;

      // If we already have a later nextRefreshAt, keep it; otherwise set it
      if (!reg.nextRefreshAt || desiredNext > reg.nextRefreshAt) {
        reg.nextRefreshAt = desiredNext;
      }

      // Clear any existing timer to reschedule reliably
      if (reg.timerId) {
        clearTimeout(reg.timerId);
        reg.timerId = null;
      }

      const doNetworkRefresh = async () => {
        try {
          reg.pending = false;

          const jsonResp = await doGetRequest(
            `${PREBID_CONFIG}/config/p/${reg.accountId}/i/${inventoryId}/`
          );
          if (!jsonResp) throw new Error('Empty response');
          const invCfg = JSON.parse(jsonResp);

          setInventoryConfig(inventoryId, { ...invCfg, loadedAt: Date.now() });
          await ensureCmpConfigured(inventoryId, invCfg.cmp);

          // schedule next refresh from now
          reg.nextRefreshAt = Date.now() + INV_CFG_REFRESH_INTERVAL_MS;
        } catch (err) {
          if (sevioDebugActive) console.error('inventory refresh failed', err);
          // retry sooner (simple backoff)
          reg.nextRefreshAt =
            Date.now() + Math.min(60 * 1000, INV_CFG_REFRESH_INTERVAL_MS);
        } finally {
          // schedule the timer again
          scheduleTimer();
        }
      };

      const DELAY_FOR_PURPOSE = 50;
      const scheduleTimer = () => {
        if (reg.timerId) {
          clearTimeout(reg.timerId);
          reg.timerId = null;
        }
        const now = Date.now();
        const msUntil = Math.max(
          0,
          (reg.nextRefreshAt || now + INV_CFG_REFRESH_INTERVAL_MS) - now
        );
        // small safety offset
        reg.timerId = setTimeout(() => {
          doNetworkRefresh();
        }, msUntil + DELAY_FOR_PURPOSE);
      };

      // Start scheduling
      scheduleTimer();
    };

    const setInventoryConfig = (inventoryId, invConfig) => {
      inventoriesConfig[inventoryId] = invConfig;
      updateLocalStorageKey({
        key: SEVIO_STORAGE_KEY,
        nestedKey: `invCfg_${inventoryId}`,
        value: invConfig
      });
    };

    const findZoneConfig = (ad) => {
      try {
        return inventoriesConfig[ad.inventoryId].zones.find(
          (zn) => zn.id === ad.zone
        );
      } catch (error) {
        if (sevioDebugActive)
          console.log(
            `[SEVIODEBUG] Cant find config for zone ${ad.zone}`,
            error
          );
      }
    };

    const configureAd = async (ad) => {
      const zoneConfig = findZoneConfig(ad);
      const cmpType = inventoriesConfig[ad.inventoryId]?.cmp?.type;
      const { status, consentGiven } = await getTcfConsentStatus(cmpType);

      // Only render if consent given, OR CMP indicates force load (non-GDPR situation), or tcf is present
      if (
        status === 'no_cmp_found' ||
        status === 'tcf_present' ||
        status === 'force_load' ||
        consentGiven ||
        cmpType === 'NONE'
      ) {
        if (ad.adType.toLowerCase() === 'banner')
          await addBannerAdUnit(ad, zoneConfig);
        if (ad.adType.toLowerCase() === 'native')
          await addNativeAdUnit(ad, zoneConfig);
      }
    };

    const getWinningBid = (adUnitCode, allResponses) => {
      const allBids =
        (
          (allResponses && allResponses[adUnitCode]) ||
          pb.getBidResponsesForAdUnitCode(adUnitCode)
        )?.bids || [];
      const dealBid = allBids.find((bid) => bid.isDeal);

      return dealBid || pb.getHighestCpmBids(adUnitCode)[0] || allBids[0];
    };

    const requestBids = ({ adUnitCode, zoneType, ad, isRefresh }) => {
      // ensure bidder-specific keys are included in adserver targeting
      pb.setConfig({
        adserverTargeting: {
          includeBidderKeys: true
        }
      });
      pb.requestBids({
        timeout: 5000,
        adUnitCodes: [adUnitCode],
        ortb2: {
          isRefresh
        },
        bidsBackHandler: async function (allResponses, timedOut, auctionId) {
          // Get winning bid if exists
          const winningBid = getWinningBid(adUnitCode, allResponses);
          const zoneConfig = findZoneConfig(ad);
          ad.render = () =>
            renderPrebidWinningBid({
              winningBid,
              adUnitCode,
              allResponses,
              zoneConfig,
              zoneType,
              isRefresh,
              auctionId,
              ad
            });

          // Check if gam enabled. If yes, render using GPT and stop further logic
          if (
            zoneType.toLowerCase() === 'banner' &&
            zoneConfig?.gamSettings?.status === 'ENABLED' &&
            (!winningBid || !winningBid.isDeal)
          ) {
            if (!ad.gamSlot) {
              const prebidSizes = getBannerSizesForPrebid({ zoneConfig, ad });
              await defineGamSlot(zoneConfig, ad, prebidSizes);
            }

            requestAdFromGam({
              adUnitCode,
              isRefresh,
              zoneConfig,
              auctionId,
              winningBid,
              ad
            });
            return;
          }

          ad.render();
        }
      });
    };

    const renderPrebidWinningBid = ({
      winningBid,
      adUnitCode,
      allResponses,
      zoneConfig,
      zoneType,
      isRefresh,
      auctionId,
      ad
    }) => {
      // If GAM is not enabled and we have no bid, we stop
      if (!winningBid) {
        if (sevioDebugActive) {
          console.log(
            '[SEVIODEBUG] - No winning bid for',
            adUnitCode,
            allResponses
          );
        }
        return;
      }

      ensureSlotNoncePropagation(adUnitCode);

      const sendAnalyticsEvents = () => {
        sendPrebidAnalyticsEvents({
          adUnitCode,
          prebidWinningBid: winningBid,
          tagDetails: zoneConfig,
          isRefresh,
          auctionId
        });
      };

      // Render banner ad in html
      if (zoneType.toLowerCase() === 'banner') {
        // We render the markup if this exists
        const markup = serializeMarkupWithNonce(winningBid.ad || '');
        if (markup) {
          const isDynamic = winningBid.isDynamic; // isDynamic - flag for dynamic banners
          const adPlaceholder = document.getElementById(adUnitCode);
          adPlaceholder.setAttribute('data-rendered', 'true');
          const tbAdDiv = document.createElement('div');
          tbAdDiv.id =
            'sevio_iframe_markup_' + winningBid.width + 'x' + winningBid.height;
          tbAdDiv.setAttribute('data-rendered', 'true');

          if (isDynamic) {
            const doc = new DOMParser().parseFromString(markup, 'text/html');
            const decoded = doc.documentElement;
            adPlaceholder.innerHTML = '';
            adPlaceholder.appendChild(decoded);
            ensureSlotNoncePropagation(adUnitCode);
          } else {
            const widthUnit =
              zoneConfig.sizeType === 'DYNAMIC' ? winningBid.widthUnit : 'px';
            const heightUnit =
              zoneConfig.sizeType === 'DYNAMIC' ? winningBid.heightUnit : 'px';

            tbAdDiv.style.maxWidth = `${winningBid.width}${widthUnit}`;
            tbAdDiv.style.width = `${winningBid.width}${widthUnit}`;
            tbAdDiv.style.height = `${winningBid.height}${heightUnit}`;
            tbAdDiv.style.display = 'inline-block';

            adPlaceholder.style.maxWidth = `${winningBid.width}${widthUnit}`;
            adPlaceholder.style.width = `${winningBid.width}${widthUnit}`;
            adPlaceholder.style.height = `${winningBid.height}${heightUnit}`;
            adPlaceholder.style.display = 'inline-block';

            tbAdDiv.innerHTML = markup;
            adPlaceholder.innerHTML = '';
            adPlaceholder.appendChild(tbAdDiv); // normal banner
            ensureSlotNoncePropagation(adUnitCode);
          }
          sendAnalyticsEvents();
          return;
        }

        // In case adUrl is present we get the adsense code
        const adUrl = winningBid.adUrl;
        const adsensePlaceholder = document.getElementById(adUnitCode);
        adsensePlaceholder.setAttribute(
          'style',
          'display: inline-block; width: inherit; height: inherit;'
        );
        if (adUrl) {
          ad.doNotRefresh = true; // Don't refresh zone if it's adsense ad
          fetch(adUrl, { method: 'GET', mode: 'cors' })
            .then((res) => {
              if (!res.ok)
                throw new Error(`HTTP ${res.status} ${res.statusText}`);
              return res.text();
            })
            .then((adsenseCode) => {
              let scriptContent =
                'sevioAdSenseContainer = (function() { ' +
                adsenseCode +
                '  return container; })();';
              try {
                eval.call(adsensePlaceholder, scriptContent);
              } catch {
                console.log(`[SEVIODEBUG] Error on external script execution.`);
              }
              if (typeof sevioAdSenseContainer !== 'undefined') {
                /* global sevioAdSenseContainer */
                adsensePlaceholder.innerHTML = '';
                adsensePlaceholder.appendChild(sevioAdSenseContainer);
                ensureSlotNoncePropagation(adUnitCode);
                // events handling for the adsense ad
                const { impURL, viewableURL } = winningBid || {};
                if (impURL) {
                  try {
                    fetch(impURL, { method: 'GET', mode: 'no-cors' });
                  } catch {
                    /* ignore */
                  }
                }

                if (viewableURL) {
                  let fired = false;
                  let inViewHoldTimer = null;

                  const cancel = () => {
                    if (inViewHoldTimer) {
                      clearTimeout(inViewHoldTimer);
                      inViewHoldTimer = null;
                    }
                  };

                  const onVisible = () => {
                    if (document.visibilityState !== 'visible') cancel();
                  };
                  document.addEventListener('visibilitychange', onVisible);

                  const io = new IntersectionObserver(
                    (entries) => {
                      if (fired) return;

                      const entry = entries[0];
                      const inView =
                        entry.isIntersecting &&
                        entry.intersectionRatio >= 0.5 &&
                        document.visibilityState === 'visible';

                      if (inView) {
                        if (!inViewHoldTimer) {
                          inViewHoldTimer = setTimeout(() => {
                            fired = true;
                            fetch(viewableURL, {
                              method: 'GET',
                              mode: 'no-cors'
                            }).catch(() => {
                              if (sevioDebugActive) {
                                console.log(
                                  `[SEVIODEBUG] sevio: could not call viewableURL -> ${viewableURL}`
                                );
                              }
                            });
                            io.disconnect();
                            document.removeEventListener(
                              'visibilitychange',
                              onVisible
                            );
                          }, 1000);
                        }
                      } else {
                        cancel();
                      }
                    },
                    { threshold: [0, 0.5, 1] }
                  ); // 50% in the VP

                  io.observe(adsensePlaceholder);
                }
                sendAnalyticsEvents();
              }
            })
            .catch((err) => {
              console.error(
                `[adUrl fetch failed for ${adUnitCode}]`,
                adUrl,
                err
              );
            });
          return;
        }
      }

      // Render native ad in html
      if (zoneType.toLowerCase() === 'native') {
        if (winningBid?.native && winningBid.native.adTemplate) {
          const native = winningBid.native;
          const nativeVariables = inventoriesConfig[
            ad.inventoryId
          ].native?.templates.find(
            (nt) => nt.id === zoneConfig.native.templateId
          )?.variables;
          const adHtml = winningBid.native.adTemplate
            .replace(
              /\[%address%]/g,
              native.address || getVarDefaultValue(nativeVariables, 'address')
            )
            .replace(/\[%clickURL%]/g, native.clickUrl || '')
            .replace(
              /\[%advDisplayURL%]/g,
              native.displayurl ||
                getVarDefaultValue(nativeVariables, 'advDisplayURL')
            )
            .replace(
              /\[%ctatext%]/g,
              native.ctatext || getVarDefaultValue(nativeVariables, 'ctatext')
            )
            .replace(
              /\[%desc%]/g,
              native.desc || getVarDefaultValue(nativeVariables, 'desc')
            )
            .replace(
              /\[%desc2%]/g,
              native.desc2 || getVarDefaultValue(nativeVariables, 'desc2')
            )
            .replace(
              /\[%downloads%]/g,
              native.downloads ||
                getVarDefaultValue(nativeVariables, 'downloads')
            )
            .replace(
              /\[%img%]/g,
              native.image || getVarDefaultValue(nativeVariables, 'img')
            )
            .replace(
              /\[%likes%]/g,
              native.likes || getVarDefaultValue(nativeVariables, 'likes')
            )
            .replace(
              /\[%phone%]/g,
              native.phone || getVarDefaultValue(nativeVariables, 'phone')
            )
            .replace(
              /\[%price%]/g,
              native.price || getVarDefaultValue(nativeVariables, 'price')
            )
            .replace(
              /\[%rating%]/g,
              native.rating || getVarDefaultValue(nativeVariables, 'rating')
            )
            .replace(
              /\[%saleprice%]/g,
              native.saleprice ||
                getVarDefaultValue(nativeVariables, 'saleprice')
            )
            .replace(
              /\[%sponsored%]/g,
              native.sponsored ||
                getVarDefaultValue(nativeVariables, 'sponsored')
            )
            .replace(
              /\[%thumbnail%]/g,
              native.icon || getVarDefaultValue(nativeVariables, 'thumbnail')
            )
            .replace(
              /\[%title%]/g,
              native.title || getVarDefaultValue(nativeVariables, 'title')
            );

          // Call impression tracking manually
          if (winningBid.native.impressionTrackers?.length) {
            winningBid.native.impressionTrackers.forEach((url) => {
              const img = new Image();
              img.src = url;
              img.style.display = 'none'; //
              document.body.appendChild(img);
            });
          }

          // Call Viewable if criteria met -
          if (winningBid.native.viewableTrackers?.length) {
            const observer = new IntersectionObserver(
              (entries, obs) => {
                entries.forEach((entry) => {
                  if (entry.isIntersecting) {
                    winningBid.native.viewableTrackers.forEach((url) => {
                      const img = new Image();
                      img.src = url;
                      img.style.display = 'none';
                      document.body.appendChild(img);
                    });

                    obs.unobserve(entry.target);
                  }
                });
              },
              {
                threshold: 0.5
              }
            );

            const adEl = document.getElementById(adUnitCode);
            if (adEl) observer.observe(adEl);
          }

          const container = document.getElementById(adUnitCode);
          container.innerHTML = adHtml;
          ensureSlotNoncePropagation(adUnitCode);
          sendAnalyticsEvents();
        }
      }
    };

    const getElementSize = (el) => {
      if (!el) return null;

      let width = Math.round(el.clientWidth || 0);
      let height = Math.round(el.clientHeight || 0);

      if ((!width || !height) && el.getBoundingClientRect) {
        const rect = el.getBoundingClientRect();
        width = Math.round(rect.width || 0);
        height = Math.round(rect.height || 0);
      }

      if (!width || !height) return null;
      return [width, height];
    };

    const selectLargestFitsByWidthOnly = (zoneSizes, parentSize) => {
      if (!Array.isArray(zoneSizes) || zoneSizes.length === 0) {
        return [];
      }

      if (!parentSize) {
        const viewportWidth =
          document.documentElement?.clientWidth || window.innerWidth || 0;

        if (!viewportWidth) {
          // cannot determine width → allow all
          return zoneSizes;
        }

        return zoneSizes
          .filter(([w]) => w <= viewportWidth)
          .sort((a, b) => b[0] - a[0]); // width DESC
      }

      const [pw] = parentSize;

      return zoneSizes.filter(([w]) => w <= pw).sort((a, b) => b[0] - a[0]); // width DESC
    };

    const getBannerSizesForPrebid = ({ zoneConfig, ad }) => {
      const zoneSizes = zoneConfig.sizes
        .filter(
          (s) => typeof s.width === 'number' && typeof s.height === 'number'
        )
        .map((s) => [s.width, s.height]);

      const placeholderRef = document.getElementById(ad.id);

      const parentEl = placeholderRef ? placeholderRef.parentElement : null;
      if (sevioDebugActive) {
        console.log('[SEVIODEBUG] - PlaceholderREF:', placeholderRef);
        console.log('[SEVIODEBUG] - ParentEl', parentEl);
        console.log('[SEVIODEBUG] - ParentSize:', getElementSize(parentEl));
        console.log('[SEVIODEBUG] - ZoneSizes:', zoneSizes);
        console.log(
          '[SEVIODEBUG] - LargestFit:',
          selectLargestFitsByWidthOnly(zoneSizes, getElementSize(parentEl))
        );
      }
      const parentSize = getElementSize(parentEl);
      const largestFit = parentEl
        ? selectLargestFitsByWidthOnly(zoneSizes, parentSize)
        : [];
      return Array.isArray(largestFit) && largestFit.length
        ? largestFit
        : [[1, 1]]; // fallback to dynamic
    };

    const addBannerAdUnit = async (ad, zoneConfig) => {
      if (!zoneConfig || !zoneConfig.bidders) {
        if (sevioDebugActive)
          console.log(
            `[SEVIODEBUG] Can't find configuration for ad: ${ad.zone}`
          );
        return;
      }

      const sizesForPrebid = getBannerSizesForPrebid({ zoneConfig, ad });
      const adUnit = {
        code: ad.id,
        mediaTypes: {
          banner: {
            sizes: sizesForPrebid
          }
        },
        bids: zoneConfig.bidders.map((bidder) => ({
          bidder: bidder.code || bidder.name,
          params: JSON.parse(bidder.params)
        })),
        ortb2Imp: {
          ext: { data: { topics: getKeywordsForZone(ad) } }
        }
      };

      if (zoneConfig?.gamSettings?.status === 'ENABLED')
        await defineGamSlot(zoneConfig, ad, sizesForPrebid);

      pb.que.push(function () {
        pb.addAdUnits([adUnit]);
        renderWithRefresh({ ad });
      });
    };

    const getOpenRTBNativeAssets = (nativeVariables) => {
      // According to OpenRTB 1.2 standard https://www.iab.com/wp-content/uploads/2018/03/OpenRTB-Native-Ads-Specification-Final-1.2.pdf
      const ASSET_METADATA = {
        // Data types
        sponsored: { type: 1, id: 1 },
        desc: { type: 2, id: 2 },
        rating: { type: 3, id: 3 },
        likes: { type: 4, id: 4 },
        downloads: { type: 5, id: 5 },
        price: { type: 6, id: 6 },
        saleprice: { type: 7, id: 7 },
        phone: { type: 8, id: 8 },
        address: { type: 9, id: 9 },
        desc2: { type: 10, id: 10 },
        advDisplayURL: { type: 11, id: 11 },
        ctatext: { type: 12, id: 12 },
        // Image types
        thumbnail: { type: 1, id: 13 },
        img: { type: 3, id: 14 },
        // Title type
        title: { id: 15 }
      };

      return nativeVariables.map((varEntity) => {
        const { id, type } = ASSET_METADATA[varEntity.name] ?? {
          type: 999,
          id: 999
        };

        if (varEntity.name === 'title') {
          return {
            id,
            required: 0,
            title: { len: 800 }
          };
        }

        if (varEntity.name === 'img') {
          return {
            id,
            required: 0,
            img: { type, wmin: 200, hmin: 50 }
          };
        }

        if (varEntity.name === 'thumbnail') {
          return {
            id,
            required: 0,
            img: { type, wmin: 50, hmin: 50 }
          };
        }

        return {
          id,
          required: 0,
          data: { type, len: 800 }
        };
      });
    };

    const addNativeAdUnit = async (ad, zoneConfig) => {
      if (!zoneConfig || !zoneConfig.bidders || !zoneConfig.native) {
        if (sevioDebugActive)
          console.log(
            `[SEVIODEBUG] Can't find configuration for ad: ${ad.zone}`
          );
        return;
      }

      const nativeConfig = inventoriesConfig[
        ad.inventoryId
      ].native.templates.find((nt) => nt.id === zoneConfig.native.templateId);
      const nativeTemplate = await doGetRequest(nativeConfig.markupUrl);
      const zoneSizes = zoneConfig.sizes
        .filter(
          (s) => typeof s.width === 'number' && typeof s.height === 'number'
        )
        .map((s) => [s.width, s.height]);
      const sizesForPrebid = zoneSizes.length ? zoneSizes : [[1, 1]];
      const adUnit = {
        code: ad.id,
        mediaTypes: {
          native: {
            sizes: sizesForPrebid,
            adTemplate: nativeTemplate,
            ortb: {
              assets: getOpenRTBNativeAssets(nativeConfig.variables)
            }
          }
        },
        bids: zoneConfig.bidders.map((bidder) => ({
          bidder: bidder.code || bidder.name,
          params: JSON.parse(bidder.params)
        })),
        ortb2Imp: {
          ext: { data: { topics: getKeywordsForZone(ad) } }
        }
      };

      pb.que.push(function () {
        pb.addAdUnits([adUnit]);
        renderWithRefresh({ ad });
      });
    };
    /* Render Ads End */

    const isCookieYesScriptPresent = () => {
      const scripts = document.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src.indexOf('cookieyes.com') !== -1) {
          return true;
        }
      }
      return false;
    };

    const injectCMP = async (cmpProvider) => {
      if (
        cmpProvider.type !== 'ENABLED' ||
        cmpProvider.details?.provider?.toLowerCase() !== 'cookieyes'
      ) {
        return;
      }

      // If the script is already present, resolve immediately
      if (isCookieYesScriptPresent()) {
        return;
      }

      const providerId = cmpProvider.details.id;

      await new Promise((resolve) => {
        const script = document.createElement('script');
        applyNonceToScript(script);
        script.type = 'text/javascript';
        script.async = true;
        script.onload = () => {
          resolve();
        };
        script.src = `https://cdn-cookieyes.com/client_data/${providerId}/script.js`;
        document.head.appendChild(script);
      });
    };

    const getGdprAppliesFromCmp = () => {
      return new Promise((resolve) => {
        const start = Date.now();

        (function waitForApi() {
          if (typeof window.__tcfapi === 'function') {
            let responded = false;

            try {
              window.__tcfapi('getTCData', 2, function (tcData, success) {
                if (responded) return;
                responded = true;

                if (
                  success &&
                  tcData &&
                  typeof tcData.gdprApplies === 'boolean'
                ) {
                  resolve(tcData.gdprApplies);
                } else {
                  resolve(undefined);
                }
              });
            } catch (e) {
              resolve(undefined);
            }

            // Safety timeout for CMP response
            setTimeout(() => {
              if (!responded) resolve(undefined);
            }, 500);

            return;
          }

          if (Date.now() - start >= 1000) {
            // __tcfapi never appeared
            resolve(undefined);
            return;
          }

          setTimeout(waitForApi, 50);
        })();
      });
    };

    const configureCmp = async (cmpProvider) => {
      const shouldWaitForCmp =
        cmpProvider['type'] === 'ENABLED' ||
        cmpProvider['type'] === 'SELF_MANAGED';
      const cmpCfg = {};

      if (shouldWaitForCmp) {
        const gdprApplies = await getGdprAppliesFromCmp();
        if (gdprApplies)
          cmpCfg.consentManagement = {
            gdpr: {
              cmpApi: 'iab',
              timeout: 15000,
              actionTimeout: 10000,
              defaultGdprScope: true
            },
            usp: {
              cmpApi: 'iab',
              timeout: 8000
            }
          };
      }

      await injectCMP(cmpProvider);

      pb.que.push(() => {
        pb.setConfig({
          bidderTimeout: 5000,
          ...cmpCfg,
          userSync: {
            userIds: [
              {
                name: 'id5Id',
                params: { partner: '1741' },
                storage: {
                  type: 'html5', // keep in LS instead of cookies
                  name: 'id5id',
                  expires: 1 // 1 day
                }
              }
            ]
          }
        });
      });
    };

    /* Refresh Ads Start */
    function createGlobalRefreshManager() {
      const refreshRegistry = new Map();
      let globalRefreshTimer = null;
      let listenersBound = false;

      const shouldRunTicker = () =>
        document.visibilityState === 'visible' && document.hasFocus();

      const persist = (state) => {
        const {
          storageKey,
          count,
          lastResetAt,
          refreshCounterInterval,
          refreshRate,
          refreshMaxTimes,
          liveCounter
        } = state;
        updateLocalStorageKey({
          key: SEVIO_STORAGE_KEY,
          nestedKey: storageKey,
          value: {
            count,
            lastResetAt,
            refreshCounterInterval,
            refreshRate,
            refreshMaxTimes,
            liveCounter
          }
        });
      };

      const maybeResetCounter = (state, now) => {
        if (now - state.lastResetAt >= state.refreshCounterInterval * 1000) {
          state.count = 0;
          state.lastResetAt = now;
          persist(state);
        }
      };

      const isAdActive = (state) => shouldRunTicker() && state.inView;

      const tick = () => {
        if (!shouldRunTicker()) return;
        const now = Date.now();

        for (const ad of sevioAds) {
          const state = refreshRegistry.get(ad.id);
          if (!state || ad.doNotRefresh) continue;

          if (isAdActive(state)) {
            maybeResetCounter(state, now);
            state.liveCounter += 1;
            persist(state);

            const refreshRateSeconds = Math.ceil(state.refreshRate / 1000);
            if (
              state.count < state.refreshMaxTimes &&
              state.liveCounter >= refreshRateSeconds
            ) {
              requestBids({
                adUnitCode: ad.id,
                zoneType: ad.adType,
                ad,
                isRefresh: true
              });

              state.liveCounter = 0;
              state.count += 1;
              persist(state);
            }
          }
        }
      };

      const startTimerIfNeeded = () => {
        if (!globalRefreshTimer && shouldRunTicker()) {
          globalRefreshTimer = setInterval(tick, 1000);
        }
      };
      const stopTimerIfRunning = () => {
        if (globalRefreshTimer && !shouldRunTicker()) {
          clearInterval(globalRefreshTimer);
          globalRefreshTimer = null;
        }
      };

      const bindGlobalListeners = () => {
        if (listenersBound) return;
        listenersBound = true;

        const onVisibility = () => {
          if (shouldRunTicker()) startTimerIfNeeded();
          else stopTimerIfRunning();
        };
        const onFocus = () => startTimerIfNeeded();
        const onBlur = () => stopTimerIfRunning();

        document.addEventListener('visibilitychange', onVisibility);
        window.addEventListener('focus', onFocus);
        window.addEventListener('blur', onBlur);
      };

      const initialInViewGuess = (el) => {
        if (!el) return true;
        const r = el.getBoundingClientRect();
        const vw = window.innerWidth || document.documentElement.clientWidth;
        const vh = window.innerHeight || document.documentElement.clientHeight;
        const ix = Math.max(0, Math.min(r.right, vw) - Math.max(r.left, 0));
        const iy = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
        const intersectionArea = Math.max(0, ix) * Math.max(0, iy);
        const elArea = Math.max(1, r.width * r.height);
        return intersectionArea / elArea >= 0.5;
      };

      // --- Reset all liveCounters immediately on initialization ---
      const resetLiveCountersOnUnload = () => {
        const allStates =
          JSON.parse(localStorage.getItem(SEVIO_STORAGE_KEY)) || {};
        Object.keys(allStates).forEach((key) => {
          if (
            allStates[key] &&
            typeof allStates[key].liveCounter === 'number'
          ) {
            allStates[key].liveCounter = 0;
          }
        });
        localStorage.setItem(SEVIO_STORAGE_KEY, JSON.stringify(allStates));
      };
      resetLiveCountersOnUnload(); // ✅ called once when manager is created

      // Register one ad instance
      return function registerAdForGlobalRefresh(ad, instanceIndex) {
        bindGlobalListeners();

        const zoneConfig = findZoneConfig(ad) || {};
        const refreshParams = zoneConfig.refresh || {};
        const refreshRate = refreshParams.refreshRate
          ? refreshParams.refreshRate * 1000
          : Number.MAX_SAFE_INTEGER;
        const refreshMaxTimes =
          typeof refreshParams.refreshMaxTimes === 'number'
            ? refreshParams.refreshMaxTimes
            : 0;
        const refreshCounterInterval =
          typeof refreshParams.refreshCounterInterval === 'number'
            ? refreshParams.refreshCounterInterval
            : Number.MAX_SAFE_INTEGER;

        const storageKey = `refreshParams_${ad.zone}_${instanceIndex}`;
        const stored =
          readLocalStorageKey({
            key: SEVIO_STORAGE_KEY,
            nestedKey: storageKey
          }) || {};

        const nodes = document.querySelectorAll(`div[data-zone="${ad.zone}"]`);
        const element = nodes[instanceIndex] || nodes[0] || null;

        const state = {
          storageKey,
          id: ad.id,
          adType: ad.adType,
          zoneConfig,
          count: typeof stored.count === 'number' ? stored.count : 0,
          lastResetAt:
            typeof stored.lastResetAt === 'number'
              ? stored.lastResetAt
              : Date.now(),
          liveCounter:
            typeof stored.liveCounter === 'number' ? stored.liveCounter : 0,
          refreshRate,
          refreshMaxTimes,
          refreshCounterInterval,
          element,
          inView: true,
          io: null
        };

        if (element) {
          state.io = new IntersectionObserver(
            (entries) => {
              const entry = entries[0];
              if (!entry) return;
              state.inView =
                entry.isIntersecting && entry.intersectionRatio >= 0.5;
            },
            { root: null, threshold: 0.5 }
          );
          state.io.observe(element);
          state.inView = initialInViewGuess(element);
        }

        refreshRegistry.set(ad.id, state);
        persist(state);
        startTimerIfNeeded();

        return {
          stop: () => {
            const s = refreshRegistry.get(ad.id);
            if (!s) return;
            if (s.io && s.element) s.io.disconnect();
            refreshRegistry.delete(ad.id);
          },
          getCount: () => state.count,
          getLiveCounter: () => state.liveCounter
        };
      };
    }

    // Create the manager once and capture its register function
    const registerAdForGlobalRefresh = createGlobalRefreshManager();

    const renderWithRefresh = ({ ad }) => {
      // Instance index per zone
      if (zoneIdTracker[ad.zone] === undefined) zoneIdTracker[ad.zone] = 0;
      else zoneIdTracker[ad.zone] += 1;
      const instanceIndex = zoneIdTracker[ad.zone];

      // One initial request only
      requestBids({
        adUnitCode: ad.id,
        zoneType: ad.adType,
        ad,
        isRefresh: false
      });

      // Future refreshes handled by the single global manager
      return registerAdForGlobalRefresh(ad, instanceIndex);
    };
    /* Refresh Ads End */

    const inventoryWaiters = {}; // map: inventoryId -> Array<{ resolve, timer }>
    const cmpWaiters = {}; // map: inventoryId -> Array<{ resolve, timer }>
    const cmpInProgress = new Set(); // inventoryIds currently running configureCmp

    const waitForInventoryConfig = (inventoryId, timeout = 5000) => {
      const existing = inventoriesConfig[inventoryId];
      if (existing && !existing.loading) {
        return Promise.resolve(existing);
      }

      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          // remove this waiter from the array
          const arr = inventoryWaiters[inventoryId];
          if (arr) {
            inventoryWaiters[inventoryId] = arr.filter(
              (w) => w.resolve !== resolve
            );
            if (inventoryWaiters[inventoryId].length === 0)
              delete inventoryWaiters[inventoryId];
          }
          reject(new Error(`Timeout waiting for inventory ${inventoryId}`));
        }, timeout);

        inventoryWaiters[inventoryId] = inventoryWaiters[inventoryId] || [];
        inventoryWaiters[inventoryId].push({ resolve, timer });
      });
    };

    // Ensure CMP is configured for an inventory, only once.
    // Returns a Promise that resolves when configureCmp finished (or immediately if already configured).
    const ensureCmpConfigured = (inventoryId, cmp, timeout = 5000) => {
      // nothing to do if cmp is falsy
      if (!cmp) return Promise.resolve();

      const inv = inventoriesConfig[inventoryId];
      if (inv && inv.cmpConfigured) {
        return Promise.resolve();
      }

      // if configuration is already in progress for this inventory, join the waiters
      if (cmpInProgress.has(inventoryId)) {
        return new Promise((resolve, reject) => {
          const timer = setTimeout(() => {
            const arr = cmpWaiters[inventoryId];
            if (arr) {
              cmpWaiters[inventoryId] = arr.filter(
                (w) => w.resolve !== resolve
              );
              if (cmpWaiters[inventoryId].length === 0)
                delete cmpWaiters[inventoryId];
            }
            reject(
              new Error(
                `Timeout waiting for CMP configuration for ${inventoryId}`
              )
            );
          }, timeout);

          cmpWaiters[inventoryId] = cmpWaiters[inventoryId] || [];
          cmpWaiters[inventoryId].push({ resolve, timer, reject });
        });
      }

      // otherwise, start the one-time configure and notify waiters on completion
      cmpInProgress.add(inventoryId);

      return (async () => {
        try {
          await configureCmp(cmp);
          inventoriesConfig[inventoryId].cmpConfigured = true;

          const arr = cmpWaiters[inventoryId];
          if (arr) {
            arr.forEach(({ resolve, timer }) => {
              clearTimeout(timer);
              try {
                resolve();
              } catch {
                /* ignore */
              }
            });
            delete cmpWaiters[inventoryId];
          }
        } catch (err) {
          // on error, reject any waiters so callers can handle it
          const arr = cmpWaiters[inventoryId];
          if (arr) {
            arr.forEach(({ /*resolve,*/ timer, reject }) => {
              clearTimeout(timer);
              try {
                if (reject) reject(err);
              } catch {
                /* ignore */
              }
            });
            delete cmpWaiters[inventoryId];
          }
          throw err;
        } finally {
          cmpInProgress.delete(inventoryId);
        }
      })();
    };

    // === END Helper methods ===

    const processOne = async (ad) => {
      try {
        sevioAds.push(ad);

        // Only call the endpoint once per inventory
        const storedInvCfg = inventoriesConfig[ad.inventoryId];
        if (
          !storedInvCfg ||
          (!storedInvCfg.loading &&
            Date.now() - storedInvCfg.loadedAt >= INV_CFG_REFRESH_INTERVAL_MS)
        ) {
          setInventoryConfig(ad.inventoryId, { loading: true });
          const invCfg = JSON.parse(
            await doGetRequest(
              `${PREBID_CONFIG}/config/p/${ad.accountId}/i/${ad.inventoryId}/`
            )
          );

          // Notify any waiters that config is ready (resolves with invCfg)
          const arr = inventoryWaiters[ad.inventoryId];
          if (arr) {
            arr.forEach(({ resolve, timer }) => {
              clearTimeout(timer);
              try {
                resolve(invCfg);
              } catch {
                /* ignore */
              }
            });
            delete inventoryWaiters[ad.inventoryId];
          }

          if (!invCfg) {
            setInventoryConfig(ad.inventoryId, null);
            return;
          }

          setInventoryConfig(ad.inventoryId, {
            ...invCfg,
            loadedAt: Date.now()
          });
        }

        // Wait for config to be ready (instant if already loaded)
        const cfg = await waitForInventoryConfig(ad.inventoryId);
        await ensureCmpConfigured(ad.inventoryId, cfg.cmp);
        scheduleInventoryConfigRefresh(ad);
        await configureAd(ad);
      } catch (err) {
        if (sevioDebugActive)
          console.log(`[SEVIODEBUG] Error processing ad: ${ad.zone}`, err);
      }
    };

    const flush = async () => {
      while (sevioQueue.length) await processOne(sevioQueue.shift());
    };

    // Schedule exactly one flush, ASAP (microtask). Fallback to Promise.
    let scheduled = false;
    const scheduleFlush = () => {
      if (scheduled) return;
      scheduled = true;
      const qmt = window.queueMicrotask || ((fn) => Promise.resolve().then(fn));
      qmt(() => {
        scheduled = false;
        flush();
      });
    };

    // ---- your push() now just queues and schedules one near-immediate flush ----
    const push = (adsArray) => {
      adsArray.forEach((ad) => {
        const adPlaceholder = getPlaceholderByZoneId(ad.zone);

        if (adPlaceholder) {
          const id = `${SLOT_ID_PREFIX}-${crypto.randomUUID()}`;
          sevioQueue.push({ ...ad, id });
          adPlaceholder.id = id;
        }
      });
      scheduleFlush();
    };

    // ---- at init: convert any preloaded window.sevioads entries, then flush once ----
    if (Array.isArray(window.sevioads)) window.sevioads.forEach(push);
    scheduleFlush();
    if (!sevioDebugActive && Array.isArray(window._pbjsGlobals)) {
      window._pbjsGlobals = window._pbjsGlobals.filter(
        (v) => v !== 'sevioPbjs'
      );
    }
    // We will expose only 'push' method outside the module
    return {
      push
    };
  })();

  // END ---
})();
