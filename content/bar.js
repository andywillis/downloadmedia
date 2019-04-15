(async () => {

  function createContainer() {
    const bar = document.createElement('div');
    bar.style.height = '12px';
    bar.classList.add('completedContainer');
    bar.style.backgroundColor = '#98c0bf';
    bar.style.position = 'sticky';
    bar.style.top = '0px';
    bar.style.zIndex = 1201;
    return bar;
  }

  function createBar() {
    const bar = document.createElement('div');
    bar.style.height = '10px';
    bar.classList.add('completedBar');
    bar.style.backgroundColor = '#3c6eaf';
    bar.style.borderTop = '1px solid #5079ad';
    bar.style.borderBottom = '1px solid #5079ad';
    bar.style.borderRight = '1px solid #5079ad';
    bar.style.width = '0px';
    return bar;
  }

  const completedBarContainer = createContainer();
  const completedBarElement = createBar();

  completedBarContainer.appendChild(completedBarElement);
  document.querySelector('a[name="top"]').appendChild(completedBarContainer);

  const completedBar = document.querySelector('.completedBar');

  async function fadeout(count) {
    return new Promise((resolve) => {
      const loop = (n) => {
        if (n === 0) resolve(true);
        if (n > 0) {
          const style = window.getComputedStyle(completedBar);
          const opacity = style.getPropertyValue('opacity');
          completedBar.style.opacity = opacity - 0.1;
          setTimeout(() => loop(--n), 100);
        }
      };
      loop(count);
    });
  }

  browser.runtime.onMessage.addListener(async ({ trigger, percentageComplete }) => {
    if (trigger === 'updateCompletedBar') {
      completedBar.style.width = `${percentageComplete}%`;
      if (percentageComplete === 100) {
        await fadeout(10);
        completedBar.style.width = '0px';
        completedBar.style.opacity = 1;
      }
    }
  });

})();
