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

  function downloadAllMedia(media) {
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

  function downloadImage(url, filename) {
    const props = { url, filename, conflictAction: 'uniquify' };
    browser.downloads.download(props)
      .then(handleDownload)
      .catch(handleError);
  }

  function checkType(response) {
    switch (response.type) {
      case 'single': downloadImage(response.url, response.filename); break;
      case 'all': downloadAllMedia(response.media); break;
    }
  }

  browser.runtime.onMessage.addListener(checkType);

}());
