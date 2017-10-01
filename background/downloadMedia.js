(function () {

  function handleDownload(id) {
    console.log(`Started downloading: ${id}`);
  }

  function handleError(error) {
    console.log(`Download failed: ${error}`);
  }

  function compileDownloads(media) {
    return media.map((url) => {
      return {
        url,
        filename: url.split('/').pop(),
        conflictAction: 'uniquify'
      };
    });
  }

  function downloadMedia({ media }) {
    function stagger(downloadObjs) {
      downloadObjs.splice(0, 5).forEach((obj) => {
        browser.downloads.download(obj)
          .then(handleDownload)
          .catch(handleError);
      });
      setTimeout(stagger, 2000, downloadObjs);
    }
    stagger(compileDownloads(media));
  }

  browser.runtime.onMessage.addListener(downloadMedia);

}());
