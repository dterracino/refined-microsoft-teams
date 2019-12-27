const crossPlatformBrowser = window.browser || window.msBrowser || window.chrome || browser || msBrowser || chrome;

var s = document.createElement('script');
s.src = crossPlatformBrowser.runtime.getURL('scripts/bulk-add-team-members.js');
s.onload = function () {
  this.remove();
};
(document.head || document.documentElement).appendChild(s);