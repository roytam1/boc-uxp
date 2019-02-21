/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the "License"). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cr = Components.results;
const Cu = Components.utils;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");

/**
 * Application startup/shutdown observer, triggers init()/uninit() methods
 * @constructor
 */
function Initializer() {}
Initializer.prototype =
{
  classDescription: "DOMi initializer",
  contractID: "@mozilla.org/domi/startup;1",
  classID: Components.ID("{87fcf1f0-959f-4ee7-abba-889478e93775}"),
  _xpcom_categories: [{ category: "app-startup", service: true }],

  QueryInterface: XPCOMUtils.generateQI([Ci.nsIObserver, Ci.nsISupportsWeakReference]),

  observe: function(subject, topic, data)
  {
    let observerService = Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService);
    switch (topic)
    {
      case "app-startup":
       observerService.addObserver(this, "profile-after-change", true);
        break;
      case "profile-after-change":
        observerService.addObserver(this, "quit-application", true);
        Cu.import("resource://inspector/InspectElement.jsm");
        InspectElement.init();
        break;
      case "quit-application":
        try {
          // This will fail if component was added via chrome.manifest (Gecko 2.0)
          observerService.removeObserver(this, "profile-after-change");
        }catch(e) {}
        observerService.removeObserver(this, "quit-application");
        InspectElement.uninit();
        break;
    }
  }
};

if (XPCOMUtils.generateNSGetFactory)
  var NSGetFactory = XPCOMUtils.generateNSGetFactory([Initializer]);
else
  var NSGetModule = XPCOMUtils.generateNSGetModule([Initializer]);
