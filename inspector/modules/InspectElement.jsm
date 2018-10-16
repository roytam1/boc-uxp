var EXPORTED_SYMBOLS = ["InspectElement"];

Components.utils.import("resource://gre/modules/Services.jsm");

var InspectElement = {
  ww: Services.ww,     // nsIWindowWatcher
  wm: Services.wm,     // nsIWindowMediator

  get isWinNT() {
    var os = Services.appinfo.OS;
    return os == "WINNT" ? true : false;
  },

  handleEvent: function(e) {
    // Shift + 右键 响应
    if (!e.shiftKey || e.button != 2) return;
    try {
      e.stopPropagation();
      e.preventDefault();
    } catch (ex) {}
    if (e.type != "click") return;
    let elem = e.originalTarget;
    let shadowElem = e.target;
    let win = e.currentTarget;
    this.inspect(win, elem, shadowElem);
  },
  inspect: function(win, elem, shadowElem) {
    win.openDialog("chrome://inspector/content/", "_blank",
             "chrome, all, dialog=no", elem);
    this.closePopup(elem, win);
  },
  closePopup: function (elem, win) {
    var parent = elem.parentNode;
    var list = [];
    while (parent != win && parent != null) {
      if (parent.localName == "menupopup" || parent.localName == "popup") {
        list.push(parent);
      }
      parent = parent.parentNode;
    }
    var len = list.length;
    if (!len) return;
    list[len - 1].hidePopup();
  },

  aListener: {
    onOpenWindow: function (aWindow) {
      var win = aWindow.docShell.QueryInterface(
            Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIDOMWindow);
      win.addEventListener("load", function _() {
        this.removeEventListener("load", _, false);
        win.addEventListener("click", InspectElement, true);
        // fix context menu bug in linux
        if (InspectElement.isWinNT) return;
        //win.addEventListener("mousedown", InspectElement, true);
        win.addEventListener("mouseup", InspectElement, false);
        win.addEventListener("contextmenu", InspectElement, true);
      }, false);
    },
    onCloseWindow: function (aWindow) {},
    onWindowTitleChange: function (aWindow, aTitle) {},
  },

  init: function () {
    this.wm.addListener(this.aListener);
    var cw = this.ww.getWindowEnumerator();
    while (cw.hasMoreElements()) {
      var win = cw.getNext().QueryInterface(Components.interfaces.nsIDOMWindow);
      win.addEventListener("click", InspectElement, true);
      // fix context menu bug in linux
      if (this.isWinNT) continue;
      //win.addEventListener("mousedown", InspectElement, true);
      win.addEventListener("mouseup", InspectElement, false);
      win.addEventListener("contextmenu", InspectElement, true);
    }
  },
  uninit: function () {
    this.wm.removeListener(this.aListener);
    var cw = this.ww.getWindowEnumerator();
    while (cw.hasMoreElements()) {
      var win = cw.getNext().QueryInterface(Components.interfaces.nsIDOMWindow);
      win.removeEventListener("click", InspectElement, true);
      if (this.isWinNT) continue;
      //win.removeEventListener("mousedown", InspectElement, true);
      win.removeEventListener("mouseup", InspectElement, false);
      win.removeEventListener("contextmenu", InspectElement, true);
    }
  }
}