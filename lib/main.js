var { ActionButton } = require('sdk/ui/button/action');
var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require('sdk/panel');
var self = require('sdk/self');
var tabs = require('sdk/tabs');
var prefs = require("sdk/simple-prefs");

const icon_states = {
  disabled: {
    "16": "./light-gray/circle-outline-16.png",
    "32": "./light-gray/circle-outline-32.png",
  },
  enabled_not_blocking: {
    "16": "./gray/circle-outline-16.png",
    "32": "./gray/circle-outline-32.png"
  },
  enabled_blocking: {
    "16": "./gray/circle-16.png",
    "32": "./gray/circle-32.png"
  }
};

var button = ToggleButton({
  id: "my-button",
  label: "default label",
  icon: icon_states.enabled_not_blocking,
  onChange: handleChange
});

var disabled_panel = panels.Panel({
  contentURL: self.data.url("disabled.html"),
  height: 50,
  onHide: handleHide
});

var enabled_panel = panels.Panel({
  contentURL: self.data.url("enabled.html"),
  height: 50,
  onHide: handleHide
});

var blocking_panel = panels.Panel({
  contentURL: self.data.url("blocking.html"),
  height: 50,
  onHide: handleHide
});

var success_doorhanger = panels.Panel({
  contentURL: self.data.url("success.html"),
  onHide: handleHide
});

function onPrefChange(prefName) {
  console.log("Got pref change");
  let anchor = document.getElementById("PanelUI-menu-button");
  success_doorhanger.show({ position: anchor });
}
  
function switchIcon() {
  console.log("switchIcon", tabs.activeTab.url);
  if (tabs.activeTab.url.indexOf("disabled") != -1) {
    button.state("window", { icon: icon_states.disabled });
  } else if (tabs.activeTab.url.indexOf("enabled") != -1) {
    button.state("window", { icon: icon_states.enabled_not_blocking });
  } else if (tabs.activeTab.url.indexOf("blocked") != -1) {
    button.state("window", { icon: icon_states.enabled_blocking });
  } else if (tabs.activeTab.url.indexOf("success") != -1) {
    console.log("showing doorhanger");
    var win = require("sdk/window/utils").getMostRecentBrowserWindow();
    let doc = win.document;
    let anchor = doc.getElementById("PanelUI-menu-button");
    console.log("got anchor", anchor.offsetLeft, anchor.offsetTop);
    // Ugh, doesn't work
    success_doorhanger.show({ position: {
                                top: 0,
                                right: 0,
                                bottom: 500,
                                left: 500 }
                            });
  } else {
    handleHide();
  }
}

tabs.on("ready", switchIcon);

function handleChange(state) {
  console.log("state", JSON.stringify(state, undefined, 2));
  if (state.checked) {
    switchIcon();
    if (tabs.activeTab.url.indexOf("disabled") != -1) {
      disabled_panel.show({ position: button });
    } else if (tabs.activeTab.url.indexOf("enabled") != -1) {
      enabled_panel.show({ position: button });
    } else if (tabs.activeTab.url.indexOf("blocked") != -1) {
      console.log("position", JSON.stringify(button, undefined, 2));
      blocking_panel.show({ position: button });
    }
  }
}

function handleHide() {
  button.state('window', {checked: false});
}
