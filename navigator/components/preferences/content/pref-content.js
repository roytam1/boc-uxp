/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var minMinValue;
var maxMinValue;

var gDictCount = 0;
var gLastSelectedLang;

/**
 * When starting up, obtain min and max values for the zoom-range controls
 * from the first and last values of the zoom-levels array.
 */
function Startup()
{
  let minElement  = document.getElementById("minZoom");
  let maxElement  = document.getElementById("maxZoom");
  let minMaxLimit = 200;
  let maxMinLimit = 50;  // allow reasonable amounts of overlap
  let zoomValues  = Services.prefs.getCharPref("toolkit.zoomManager.zoomValues")
                            .split(",").map(parseFloat);
  zoomValues.sort((a, b) => a - b);

  let firstValue  = Math.round(100 * zoomValues[0]);
  let lastValue   = Math.round(100 * zoomValues[zoomValues.length - 1]);

  minMinValue     = firstValue;
  minElement.min  = minMinValue;
  minElement.max  = lastValue  > minMaxLimit ? minMaxLimit : lastValue;

  maxMinValue     = firstValue < maxMinLimit ? maxMinLimit : firstValue;
  maxElement.min  = maxMinValue;
  maxElement.max  = lastValue;

  if ("@mozilla.org/spellchecker;1" in Components.classes)
    InitLanguageMenu();
  else
  {
    document.getElementById("generalSpelling").hidden = true;
    document.getElementById("mailSpelling").hidden = true;
    document.getElementById("noSpellCheckLabel").hidden = false;
  }
}

/**
 * Suspend "min" value while manually typing in a number.
 */
function DisableMinCheck(element)
{
  element.min = 0;
}

/**
 * Modify the maxZoom setting if minZoom was chosen to be larger than it.
 */
function AdjustMaxZoom()
{
  let minElement  = document.getElementById("minZoom");
  let maxElement  = document.getElementById("maxZoom");
  let maxPref     = document.getElementById("zoom.maxPercent");

  if(minElement.valueNumber > maxElement.valueNumber)
    maxPref.value = minElement.value;

  minElement.min  = minMinValue;
}

/**
 * Modify the minZoom setting if maxZoom was chosen to be smaller than it,
 * adjusting maxZoom first if it's below maxMinValue.
 */
function AdjustMinZoom()
{
  let minElement  = document.getElementById("minZoom");
  let maxElement  = document.getElementById("maxZoom");
  let minPref     = document.getElementById("zoom.minPercent");
  let maxValue    = maxElement.valueNumber < maxMinValue ?
                    maxMinValue : maxElement.valueNumber;

  if(maxValue < minElement.valueNumber)
    minPref.value = maxValue;

  maxElement.min  = maxMinValue;
}

/**
 * When the user toggles the layers.acceleration.disabled pref,
 * sync its new value to the gfx.direct2d.disabled pref too.
 */
function updateHardwareAcceleration(aVal)
{
  if (/^Win/.test(navigator.platform)) {
    document.getElementById("gfx.direct2d.disabled").value = aVal;
  }
}


function InitLanguageMenu() {
  var spellChecker = Components.classes["@mozilla.org/spellchecker/engine;1"]
                               .getService(Components.interfaces.mozISpellCheckingEngine);

  var o1 = {};
  var o2 = {};

  // Get the list of dictionaries from the spellchecker.
  spellChecker.getDictionaryList(o1, o2);

  var dictList = o1.value;
  var count    = o2.value;

  // If dictionary count hasn't changed then no need to update the menu.
  if (gDictCount == count)
    return;

  // Store current dictionary count.
  gDictCount = count;

  // Load the string bundles that will help us map
  // RFC 1766 strings to UI strings.

  // Load the language string bundle.
  var languageBundle = document.getElementById("languageNamesBundle");
  var regionBundle = null;
  // If we have a language string bundle, load the region string bundle.
  if (languageBundle)
    regionBundle = document.getElementById("regionNamesBundle");

  var menuStr2;
  var isoStrArray;
  var langId;
  var langLabel;

  for (let i = 0; i < count; i++) {
    try {
      langId = dictList[i];
      isoStrArray = dictList[i].split(/[-_]/);

      if (languageBundle && isoStrArray[0])
        langLabel = languageBundle.getString(isoStrArray[0].toLowerCase());

      if (regionBundle && langLabel && isoStrArray.length > 1 && isoStrArray[1]) {
        menuStr2 = regionBundle.getString(isoStrArray[1].toLowerCase());
        if (menuStr2)
          langLabel += "/" + menuStr2;
      }

      if (langLabel && isoStrArray.length > 2 && isoStrArray[2])
        langLabel += " (" + isoStrArray[2] + ")";

      if (!langLabel)
        langLabel = langId;
    } catch (ex) {
      // getString throws an exception when a key is not found in the
      // bundle. In that case, just use the original dictList string.
      langLabel = langId;
    }
    dictList[i] = [langLabel, langId];
  }

  // sort by locale-aware collation
  dictList.sort(
    function compareFn(a, b) {
      return a[0].localeCompare(b[0]);
    }
  );

  var languageMenuList = document.getElementById("languageMenuList");
  // Remove any languages from the list.
  var languageMenuPopup = languageMenuList.firstChild;
  while (languageMenuPopup.firstChild.localName != "menuseparator")
    languageMenuPopup.firstChild.remove();

  var curLang  = languageMenuList.value;
  var defaultItem = null;

  for (let i = 0; i < count; i++) {
    let item = languageMenuList.insertItemAt(i, dictList[i][0], dictList[i][1]);
    if (curLang && dictList[i][1] == curLang)
      defaultItem = item;
  }

  // Now make sure the correct item in the menu list is selected.
  if (defaultItem) {
    languageMenuList.selectedItem = defaultItem;
    gLastSelectedLang = defaultItem;
  }
}

function SelectLanguage(aTarget) {
  gLastSelectedLang = aTarget;
}