(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function initMobileMenu() {
    var button = document.querySelector('[data-mobile-menu-button]');
    var menu = document.querySelector('[data-mobile-menu]');
    if (!button || !menu) {
      return;
    }
    button.addEventListener('click', function () {
      menu.classList.toggle('open');
      button.classList.toggle('open');
    });
  }

  function initHeroCarousel() {
    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    if (slides.length <= 1) {
      return;
    }

    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        start();
      });
    });

    var hero = document.querySelector('.hero');
    if (hero) {
      hero.addEventListener('mouseenter', stop);
      hero.addEventListener('mouseleave', start);
    }

    show(0);
    start();
  }

  function normalize(text) {
    return String(text || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function initFilters() {
    var inputs = Array.prototype.slice.call(document.querySelectorAll('[data-filter-input]'));
    inputs.forEach(function (input) {
      var scope = input.closest('main') || document;
      var targets = Array.prototype.slice.call(scope.querySelectorAll('.movie-card, .rank-row, .category-overview-card, .compact-card'));
      var counter = scope.querySelector('[data-filter-count]');

      function applyFilter() {
        var query = normalize(input.value);
        var visible = 0;
        targets.forEach(function (target) {
          var haystack = normalize(target.getAttribute('data-search') || target.textContent);
          var matched = query === '' || haystack.indexOf(query) !== -1;
          target.hidden = !matched;
          if (matched) {
            visible += 1;
          }
        });
        if (counter) {
          counter.textContent = query ? '匹配 ' + visible + ' 条' : '共 ' + targets.length + ' 条';
        }
      }

      input.addEventListener('input', applyFilter);
      applyFilter();
    });
  }

  function updatePlayerStatus(root, message) {
    var status = root.querySelector('[data-player-status]');
    if (status) {
      status.textContent = message;
    }
  }

  function playVideo(video, root, source) {
    if (!source) {
      updatePlayerStatus(root, '未找到播放源。');
      return;
    }

    root.classList.add('is-playing');
    updatePlayerStatus(root, '正在加载 HLS 播放源…');

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      video.play().then(function () {
        updatePlayerStatus(root, '正在播放。');
      }).catch(function () {
        updatePlayerStatus(root, '浏览器阻止自动播放，请再次点击播放。');
      });
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });

      hls.loadSource(source);
      hls.attachMedia(video);

      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        video.play().then(function () {
          updatePlayerStatus(root, '正在播放。');
        }).catch(function () {
          updatePlayerStatus(root, '播放源已加载，请点击播放器继续播放。');
        });
      });

      hls.on(window.Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal) {
          updatePlayerStatus(root, '播放源加载异常，可刷新页面后重试。');
          try {
            hls.destroy();
          } catch (error) {
            // 保持静默，避免影响页面浏览。
          }
        }
      });

      root._hls = hls;
      return;
    }

    video.src = source;
    video.play().then(function () {
      updatePlayerStatus(root, '正在尝试使用浏览器原生播放能力。');
    }).catch(function () {
      updatePlayerStatus(root, '当前浏览器不支持 HLS，请更换支持 HLS 的浏览器或启用 hls.js。');
    });
  }

  function initPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));
    players.forEach(function (root) {
      var button = root.querySelector('[data-player-start]');
      var video = root.querySelector('video[data-src]');
      if (!button || !video) {
        return;
      }

      button.addEventListener('click', function () {
        var source = video.getAttribute('data-src');
        playVideo(video, root, source);
      });
    });
  }

  ready(function () {
    initMobileMenu();
    initHeroCarousel();
    initFilters();
    initPlayers();
  });
}());
