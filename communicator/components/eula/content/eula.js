Components.utils.import("resource://gre/modules/Communicator.jsm");

function Startup() {
  main = document.getElementById("main");
  let textbox = document.createElement("textbox");
  textbox.setAttribute("id", "eula");
  textbox.setAttribute("readonly", "true");
  textbox.setAttribute("multiline", "true");
  textbox.setAttribute("cols", "80");
  textbox.setAttribute("rows", "20");
  textbox.setAttribute("style", "resize: none; font-family: -moz-fixed;");
  textbox.setAttribute("value",
                       Communicator.readfile("GreD", "license.txt"));
  main.appendChild(textbox);
}

function onAccept() {
  Communicator.service.prefs.setBoolPref("app.eula.accepted", true);
}

function onCancel() {
  Communicator.service.startup.quit(Communicator.service.startup.eForceQuit);
}

