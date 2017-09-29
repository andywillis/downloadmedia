(function () {

  function onExecuted({ tabId }) {
    browser.tabs.sendMessage(tabId, { grabImages: true });
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  function loader(tabId) {
    const file = './content/dblclick-image-download.js';
    browser.tabs.executeScript(tabId, { file })
      .then(function (value) { onExecuted({ value, tabId }); })
      .catch(onError);
  }

  function handleActivated({ tabId }) {
    loader(tabId);
  }

  function handleUpdated(tabId) {
    loader(tabId);
  }

  browser.tabs.onUpdated.addListener(handleUpdated);
  browser.tabs.onActivated.addListener(handleActivated);

}());
