(function () {
  var mobileButton = document.querySelector('.mobile-toggle');
  var mobileMenu = document.querySelector('.mobile-menu');
  if (mobileButton && mobileMenu) {
    mobileButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var activeIndex = 0;
  function setHero(index) {
    if (!slides.length) return;
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === activeIndex);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === activeIndex);
    });
  }
  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      setHero(index);
    });
  });
  if (slides.length > 1) {
    setInterval(function () {
      setHero(activeIndex + 1);
    }, 5200);
  }

  var filterInput = document.querySelector('[data-filter-input]');
  var filterCount = document.querySelector('[data-filter-count]');
  var filterCards = Array.prototype.slice.call(document.querySelectorAll('[data-filter-card]'));
  function applyFilter() {
    if (!filterInput || !filterCards.length) return;
    var keyword = filterInput.value.trim().toLowerCase();
    var visible = 0;
    filterCards.forEach(function (card) {
      var haystack = (card.getAttribute('data-filter-card') || '').toLowerCase();
      var matched = !keyword || haystack.indexOf(keyword) !== -1;
      card.classList.toggle('hidden-card', !matched);
      if (matched) visible += 1;
    });
    if (filterCount) filterCount.textContent = String(visible);
  }
  if (filterInput) {
    filterInput.addEventListener('input', applyFilter);
    applyFilter();
  }

  window.initPlayer = function (source) {
    var player = document.querySelector('.movie-player');
    if (!player) return;
    var video = player.querySelector('video');
    var overlay = player.querySelector('.player-overlay');
    var started = false;
    function attach() {
      if (!video || started) return;
      started = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(source);
        hls.attachMedia(video);
        video.hlsPlayer = hls;
      } else {
        video.src = source;
      }
    }
    function playMovie() {
      attach();
      if (overlay) overlay.classList.add('is-hidden');
      if (video) {
        video.controls = true;
        var promise = video.play();
        if (promise && promise.catch) {
          promise.catch(function () {
            if (overlay) overlay.classList.remove('is-hidden');
          });
        }
      }
    }
    if (overlay) overlay.addEventListener('click', playMovie);
    if (video) {
      video.addEventListener('click', function () {
        if (!started) playMovie();
      });
    }
  };
})();
