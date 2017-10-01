(function () {

  function getCurrentTab() {
    return browser.tabs.query({ currentWindow: true, active: true });
  }

  function onCreated() {
    if (browser.runtime.lastError) {
      console.log(`Error: ${browser.runtime.lastError}`);
    } else {
      console.log('Item created successfully');
    }
  }

  function downloadMedia(menuInfo) {
    getCurrentTab().then(function (tabInfo) {
      browser.tabs.sendMessage(tabInfo[0].id, { type: menuInfo.menuItemId });
    });
  }

  browser.menus.create({
    id: 'pdf',
    title: 'Download PDFs',
    contexts: ['all'],
    onclick: downloadMedia
  }, onCreated);

  browser.menus.create({
    id: 'jpg',
    title: 'Download JPGs',
    contexts: ['all'],
    onclick: downloadMedia
  }, onCreated);

}());
