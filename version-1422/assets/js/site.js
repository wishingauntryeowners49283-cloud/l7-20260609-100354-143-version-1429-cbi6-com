(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var menuPanel = document.querySelector('[data-menu-panel]');

    if (menuButton && menuPanel) {
        menuButton.addEventListener('click', function () {
            menuPanel.classList.toggle('is-open');
        });
    }

    function markMissingImage(img) {
        var parent = img.closest('a, button, .hero-slide');
        if (parent) {
            parent.classList.add('image-fallback');
            if (!parent.getAttribute('aria-label')) {
                parent.setAttribute('aria-label', img.getAttribute('alt') || '');
            }
        }
    }

    document.querySelectorAll('img').forEach(function (img) {
        if (img.complete && img.naturalWidth === 0) {
            markMissingImage(img);
        }
        img.addEventListener('error', function () {
            markMissingImage(img);
        });
    });

    var carousel = document.querySelector('[data-hero-carousel]');
    if (carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
        var current = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === current);
            });
        }

        function startTimer() {
            clearInterval(timer);
            timer = setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        var prev = carousel.querySelector('[data-hero-prev]');
        var next = carousel.querySelector('[data-hero-next]');

        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(current - 1);
                startTimer();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                showSlide(current + 1);
                startTimer();
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                showSlide(index);
                startTimer();
            });
        });

        showSlide(0);
        startTimer();
    }

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    function setupFilters(scope) {
        var input = scope.querySelector('[data-filter-input]');
        var year = scope.querySelector('[data-filter-year]');
        var type = scope.querySelector('[data-filter-type]');
        var list = document.querySelector('[data-filter-list]');
        var empty = document.querySelector('[data-empty-state]');

        if (!list) {
            return;
        }

        var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card, .ranking-card'));

        function apply() {
            var query = normalize(input ? input.value : '');
            var yearValue = year ? year.value : '';
            var typeValue = type ? type.value : '';
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = normalize(card.getAttribute('data-search'));
                var cardYear = card.getAttribute('data-year') || '';
                var cardType = card.getAttribute('data-type') || '';
                var matched = true;

                if (query && haystack.indexOf(query) === -1) {
                    matched = false;
                }

                if (yearValue && cardYear !== yearValue) {
                    matched = false;
                }

                if (typeValue && cardType.indexOf(typeValue) === -1) {
                    matched = false;
                }

                card.style.display = matched ? '' : 'none';
                if (matched) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle('is-visible', visible === 0);
            }
        }

        if (input) {
            input.addEventListener('input', apply);
        }
        if (year) {
            year.addEventListener('change', apply);
        }
        if (type) {
            type.addEventListener('change', apply);
        }

        var params = new URLSearchParams(window.location.search);
        var queryValue = params.get('q');
        if (queryValue && input) {
            input.value = queryValue;
        }

        apply();
    }

    document.querySelectorAll('[data-filter-scope]').forEach(setupFilters);

    function setupPlayer(player) {
        var video = player.querySelector('video[data-video-url]');
        var button = player.querySelector('[data-play-button]');
        if (!video || !button) {
            return;
        }

        var source = video.getAttribute('data-video-url');
        var ready = false;
        var hlsInstance = null;

        function attachSource() {
            if (ready || !source) {
                return;
            }
            ready = true;

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: false
                });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
            } else {
                video.src = source;
            }
        }

        function playVideo() {
            attachSource();
            player.classList.add('is-playing');
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {
                    player.classList.remove('is-playing');
                });
            }
        }

        button.addEventListener('click', function (event) {
            event.preventDefault();
            playVideo();
        });

        video.addEventListener('play', function () {
            player.classList.add('is-playing');
        });

        video.addEventListener('pause', function () {
            if (!video.currentTime) {
                player.classList.remove('is-playing');
            }
        });

        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }

    document.querySelectorAll('[data-player]').forEach(setupPlayer);
})();
