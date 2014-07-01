var { ActionButton } = require('sdk/ui/button/action');
var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require('sdk/panel');
var self = require('sdk/self');
var tabs = require('sdk/tabs');

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
  icon: icon_states.disabled,
  onChange: handleChange
});

var disabled_panel = panels.Panel({
  contentURL: self.data.url("disabled.html"),
  contentStyle: "body { border: 3px solid blue; }",
  onHide: handleHide
});

var enabled_panel = panels.Panel({
  contentURL: self.data.url("enabled.html"),
  contentStyle: "body { border: 3px solid blue; }",
  onHide: handleHide
});

var blocking_panel = panels.Panel({
  contentURL: self.data.url("blocking.html"),
  contentStyle: "body { border: 3px solid blue; }",
  onHide: handleHide
});

function handleChange(state) {
  console.log(tabs.activeTab.url);
  if (state.checked) {
    if (tabs.activeTab.url == "http://www.mozilla.org/en-US/") {
      disabled_panel.show({ position: button });
      button.state("window", { icon: icon_states.disabled });
    } else if (tabs.activeTab.url == "http://www.yucata.de/en") {
      enabled_panel.show({ position: button });
      button.state("window", { icon: icon_states.enabled_not_blocking });
    } else {
      blocking_panel.show({ position: button });
      button.state("window", { icon: icon_states.enabled_blocking });
    }
  }
}

function handleHide() {
  button.state('window', {checked: false});
}
