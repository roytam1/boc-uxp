/*global Components: false, EnigmailLog: false, EnigmailPrefs: false */
/*jshint -W097 */
/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

"use strict";

var EXPORTED_SYMBOLS = ["EnigmailTimer"];

const Cc = Components.classes;
const Ci = Components.interfaces;

var gTimerList = [];
var gTimerId = 0;

const EnigmailTimer = {
  /**
   * wait a defined number of miliseconds, then call a callback function
   * asynchronously
   *
   * @callbackFunction: Function - any function specification
   * @sleepTimeMs:      Number - optional number of miliseconds to delay
   *                             (0 if not specified)
   */
  setTimeout: function(callbackFunction, sleepTimeMs) {

    let timerId = "T-" + (gTimerId++);

    function callbackWrapper() {
      if (timerId in gTimerList) {
        delete gTimerList[timerId];
      }

      try {
        callbackFunction();
      }
      catch (ex) {}
    }

    let timer = Cc["@mozilla.org/timer;1"].createInstance(Ci.nsITimer);
    timer.initWithCallback(callbackWrapper,
      sleepTimeMs || 0,
      Ci.nsITimer.TYPE_ONE_SHOT);

    gTimerList[timerId] = timer;

    return timerId;
  }
};
