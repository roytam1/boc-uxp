/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the "License"). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

#filter substitution

{
  let Cc = Components.classes;
  let Ci = Components.interfaces;
  let Cr = Components.results;
  let Cu = Components.utils;

  // Use UIReady event to initialize in Fennec (bug 531071)
  let eventName = Cu.import("resource://@ADDON_CHROME_NAME@/modules/Utils.jsm", null).Utils.isFennec ? "UIReady" : "load";

  window.addEventListener(eventName, function()
  {
    window.removeEventListener(eventName, arguments.callee, false);

    if (!("@adblockplus.org/abp/public;1" in Cc))
    {
      // Force initialization (in Fennec we won't be initialized at this point)
      Cu.import("resource://@ADDON_CHROME_NAME@/modules/Bootstrap.jsm", null).Bootstrap.startup();
    }

    Cu.import("resource://@ADDON_CHROME_NAME@/modules/AppIntegration.jsm", null).AppIntegration.addWindow(window);
  }, false);
}
