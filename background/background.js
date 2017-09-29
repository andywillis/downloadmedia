(function () {

  function handleDownload(id) {
    console.log(`Started downloading: ${id}`);
  }

  function handleError(error) {
    console.log(`Download failed: ${error}`);
  }

  /**
   * @function getDownload
   * @param  {type} url      Image URL
   * @param  {type} filename Filename of saved image
   */
  function getDownload({ url, filename }) {
    const props = { url, filename, conflictAction: 'uniquify' };
    browser.downloads.download(props)
      .then(handleDownload)
      .catch(handleError);
  }

  browser.runtime.onMessage.addListener(getDownload);

}());
