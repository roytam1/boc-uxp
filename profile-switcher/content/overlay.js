/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

function toProfileManager()
{
  var promgrWin = Services.wm.getMostRecentWindow("mozilla:profileSelection");
  if (promgrWin) {
    promgrWin.focus();
  } else {
    var params = Components.classes["@mozilla.org/embedcomp/dialogparam;1"]
                 .createInstance(Components.interfaces.nsIDialogParamBlock);

    params.SetNumberStrings(1);
    params.SetString(0, "menu");
    window.openDialog("chrome://profile-switcher/content/profileSelection.xul",
                "",
                "centerscreen,chrome,titlebar,centerscreen,modal",
                params);
  }
  // Here, we don't care about the result code
  // that was returned in the param block.
}


