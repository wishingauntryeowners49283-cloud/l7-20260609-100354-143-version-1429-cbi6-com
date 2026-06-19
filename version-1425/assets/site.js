const bySelector = (selector, root = document) => root.querySelector(selector);
const allBySelector = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function setupMenu() {
  const button = bySelector('[data-menu-button]');
  const menu = bySelector('[data-mobile-menu]');

  if (!button || !menu) {
    return;
  }

  button.addEventListener('click', () => {
    menu.classList.toggle('is-open');
  });
}

function setupHero() {
  const hero = bySelector('[data-hero]');

  if (!hero) {
    return;
  }

  const slides = allBySelector('[data-hero-slide]', hero);
  const dots = allBySelector('[data-hero-dot]', hero);
  let index = 0;
  let timer = null;

  const show = (nextIndex) => {
    index = (nextIndex + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('active', slideIndex === index);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === index);
    });
  };

  const restart = () => {
    if (timer) {
      window.clearInterval(timer);
    }

    timer = window.setInterval(() => show(index + 1), 5200);
  };

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener('click', () => {
      show(dotIndex);
      restart();
    });
  });

  if (slides.length > 1) {
    restart();
  }
}

function setupSearch() {
  allBySelector('[data-search-scope]').forEach((scope) => {
    const input = bySelector('[data-search-input]', scope);
    const count = bySelector('[data-search-count]', scope);
    const cards = allBySelector('[data-card]', scope);

    if (!input || cards.length === 0) {
      return;
    }

    const update = () => {
      const value = input.value.trim().toLowerCase();
      let visible = 0;

      cards.forEach((card) => {
        const text = `${card.dataset.title || ''} ${card.dataset.meta || ''}`.toLowerCase();
        const matched = value === '' || text.includes(value);
        card.hidden = !matched;

        if (matched) {
          visible += 1;
        }
      });

      if (count) {
        count.textContent = value ? `${visible} 个匹配结果` : '';
      }
    };

    input.addEventListener('input', update);
    update();
  });
}

function attachHls(video, source) {
  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = source;
    return;
  }

  const Hls = window.Hls;

  if (Hls && Hls.isSupported()) {
    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true
    });

    hls.loadSource(source);
    hls.attachMedia(video);
    return;
  }

  video.src = source;
}

function initializePlayer(options) {
  const video = bySelector(options.videoSelector);
  const button = bySelector(options.buttonSelector);
  let ready = false;

  if (!video || !button || !options.source) {
    return;
  }

  const start = async () => {
    if (!ready) {
      ready = true;
      attachHls(video, options.source);
    }

    button.classList.add('is-hidden');

    try {
      await video.play();
    } catch (error) {
      button.classList.remove('is-hidden');
    }
  };

  button.addEventListener('click', start);

  video.addEventListener('click', () => {
    if (!ready || video.paused) {
      start();
    }
  });

  video.addEventListener('play', () => {
    button.classList.add('is-hidden');
  });
}

window.initializePlayer = initializePlayer;

setupMenu();
setupHero();
setupSearch();

if (window.__PLAYER_OPTIONS) {
  initializePlayer(window.__PLAYER_OPTIONS);
}
