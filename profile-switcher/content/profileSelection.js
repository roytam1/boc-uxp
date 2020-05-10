/* -*- Mode: C; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*-
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

Components.utils.import("resource://gre/modules/Services.jsm");

var gProfileBundle;
var gBrandBundle;
var gProfileService;
var gPromptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                               .getService(Components.interfaces.nsIPromptService);
var gProfileManagerMode = "selection";
var gDialogParams = window.arguments[0]
                          .QueryInterface(Components.interfaces.nsIDialogParamBlock);

function StartUp()
{
  gProfileBundle = document.getElementById("bundle_profile");
  gBrandBundle = document.getElementById("bundle_brand");
  if (gDialogParams.objects) {
    document.documentElement.getButton("accept").setAttribute("label",
      document.documentElement.getAttribute("buttonlabelstart"));
    document.documentElement.getButton("cancel").setAttribute("label",
      document.documentElement.getAttribute("buttonlabelexit"));
    document.getElementById('offlineState').hidden = false;
    gDialogParams.SetInt(0, 0);
  }

  gProfileService = Components.classes["@mozilla.org/toolkit/profile-service;1"]
                              .getService(Components.interfaces.nsIToolkitProfileService);
  var profileEnum = gProfileService.profiles;
  var selectedProfile = null;
  try {
    selectedProfile = gProfileService.selectedProfile;
  }
  catch (ex) {
  }
  while (profileEnum.hasMoreElements()) {
    AddItem(profileEnum.getNext().QueryInterface(Components.interfaces.nsIToolkitProfile),
            selectedProfile);
  }

  var autoSelect = document.getElementById("autoSelect");
  if (Services.prefs.getBoolPref("profile.manage_only_at_launch"))
    autoSelect.hidden = true;
  else
    autoSelect.checked = gProfileService.startWithLastProfile;
}

// function : <profileSelection.js>::AddItem();
// purpose  : utility function for adding items to a tree.
function AddItem(aProfile, aProfileToSelect)
{
  var tree = document.getElementById("profiles");
  var treeitem = document.createElement("treeitem");
  var treerow = document.createElement("treerow");
  var treecell = document.createElement("treecell");
  var treetip = document.getElementById("treetip");
  var profileDir = gProfileService.getProfileByName(aProfile.name).rootDir;

  treecell.setAttribute("label", aProfile.name);
  treerow.appendChild(treecell);
  treeitem.appendChild(treerow);
  treeitem.setAttribute("tooltip", profileDir.path);
  treetip.setAttribute("value", profileDir.path);
  tree.lastChild.appendChild(treeitem);
  treeitem.profile = aProfile;
  if (aProfile == aProfileToSelect) {
    var profileIndex = tree.view.getIndexOfItem(treeitem);
    tree.view.selection.select(profileIndex);
    tree.treeBoxObject.ensureRowIsVisible(profileIndex);
  }
}

// function : <profileSelection.js>::AcceptDialog();
// purpose  : sets the current profile to the selected profile (user choice: "Start Mozilla")
function AcceptDialog()
{
  var autoSelect = document.getElementById("autoSelect");
    gProfileService.startWithLastProfile = autoSelect.checked;
    gProfileService.flush();

  var profileTree = document.getElementById("profiles");
  var selected = profileTree.view.getItemAtIndex(profileTree.currentIndex);

  if (!gDialogParams.objects) {
    var dirServ = Components.classes['@mozilla.org/file/directory_service;1']
                            .getService(Components.interfaces.nsIProperties);
    var profD = dirServ.get("ProfD", Components.interfaces.nsIFile);
    var profLD = dirServ.get("ProfLD", Components.interfaces.nsIFile);

    if (selected.profile.rootDir.equals(profD) &&
        selected.profile.localDir.equals(profLD))
      return true;
  }

  try {
    var profileLock = selected.profile.lock({});
    gProfileService.selectedProfile = selected.profile;
    gProfileService.defaultProfile = selected.profile;
    gProfileService.flush();
    if (gDialogParams.objects) {
      gDialogParams.objects.insertElementAt(profileLock, 0);
      gProfileService.startOffline = document.getElementById("offlineState").checked;
      gDialogParams.SetInt(0, 1);
      gDialogParams.SetString(0, selected.profile.name);
      return true;
    }
    profileLock.unlock();
  } catch (e) {
    var brandName = gBrandBundle.getString("brandShortName");
    var message = gProfileBundle.getFormattedString("dirLocked",
                                                    [brandName, selected.profile.name]);
    gPromptService.alert(window, null, message);
    return false;
  }

  // Although switching profile works by performing a restart internally,
  // the user is quitting the old profile, so make it look like a quit.
  var cancelQuit = Components.classes["@mozilla.org/supports-PRBool;1"]
                             .createInstance(Components.interfaces.nsISupportsPRBool);
  Components.classes["@mozilla.org/observer-service;1"]
            .getService(Components.interfaces.nsIObserverService)
            .notifyObservers(cancelQuit, "quit-application-requested", null);
  if (cancelQuit.data)
    return false;

  try {
    var env = Components.classes["@mozilla.org/process/environment;1"]
                        .getService(Components.interfaces.nsIEnvironment);
    env.set("XRE_PROFILE_NAME", selected.profile.name);
    env.set("XRE_PROFILE_PATH", selected.profile.rootDir.path);
    env.set("XRE_PROFILE_LOCAL_PATH", selected.profile.localDir.path);
    var app = Components.classes["@mozilla.org/toolkit/app-startup;1"]
                        .getService(Components.interfaces.nsIAppStartup);
    app.quit(app.eAttemptQuit | app.eRestart);
    return true;
  }
  catch (e) {
    env.set("XRE_PROFILE_NAME", "");
    env.set("XRE_PROFILE_PATH", "");
    env.set("XRE_PROFILE_LOCAL_PATH", "");
    return false;
  }
}

// handle key event on tree
function HandleKeyEvent(aEvent)
{
  if (gProfileManagerMode != "manager")
    return;

}

function HandleClickEvent(aEvent)
{
  if (aEvent.button == 0 && aEvent.target.parentNode.view.selection.count != 0 && AcceptDialog()) {
    window.close();
    return true;
  }

  return false;
}

function HandleToolTipEvent(aEvent)
{
  var treeTip = document.getElementById("treetip");
  var tree = document.getElementById("profiles");

  var cell = tree.treeBoxObject.getCellAt(aEvent.clientX, aEvent.clientY);
  if (cell.row < 0)
    aEvent.preventDefault();
  else
    treeTip.label = tree.view.getItemAtIndex(cell.row).tooltip;
}
