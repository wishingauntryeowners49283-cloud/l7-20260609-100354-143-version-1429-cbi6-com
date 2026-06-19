(function () {
    const mobileToggle = document.querySelector(".mobile-toggle");
    const mobilePanel = document.querySelector(".mobile-panel");

    if (mobileToggle && mobilePanel) {
        mobileToggle.addEventListener("click", function () {
            const isOpen = mobilePanel.classList.toggle("is-open");
            mobileToggle.setAttribute("aria-expanded", String(isOpen));
        });
    }

    const hero = document.querySelector(".hero-carousel");

    if (hero) {
        const slides = Array.from(hero.querySelectorAll(".hero-slide"));
        const dots = Array.from(hero.querySelectorAll(".hero-dot"));
        const prev = hero.querySelector(".hero-prev");
        const next = hero.querySelector(".hero-next");
        let index = 0;
        let timer = null;

        function show(target) {
            if (!slides.length) {
                return;
            }

            index = (target + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === index);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === index);
            });
        }

        function restart() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                show(dotIndex);
                restart();
            });
        });

        if (prev) {
            prev.addEventListener("click", function () {
                show(index - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
                restart();
            });
        }

        restart();
    }

    function bindSiteSearch(inputId, resultsId) {
        const input = document.getElementById(inputId);
        const results = document.getElementById(resultsId);

        if (!input || !results || !Array.isArray(window.SITE_SEARCH_DATA)) {
            return;
        }

        function close() {
            results.classList.remove("is-open");
            results.innerHTML = "";
        }

        input.addEventListener("input", function () {
            const value = input.value.trim().toLowerCase();

            if (!value) {
                close();
                return;
            }

            const matches = window.SITE_SEARCH_DATA.filter(function (item) {
                return item.text.toLowerCase().includes(value);
            }).slice(0, 10);

            if (!matches.length) {
                results.innerHTML = "<a><strong>未找到匹配内容</strong><span>换个关键词试试</span></a>";
                results.classList.add("is-open");
                return;
            }

            results.innerHTML = matches.map(function (item) {
                return "<a href="" + item.url + ""><strong>" + item.title + "</strong><span>" + item.meta + "</span></a>";
            }).join("");
            results.classList.add("is-open");
        });

        const form = input.closest("form");

        if (form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                const first = results.querySelector("a[href]");

                if (first) {
                    window.location.href = first.getAttribute("href");
                }
            });
        }

        document.addEventListener("click", function (event) {
            if (!results.contains(event.target) && event.target !== input) {
                close();
            }
        });
    }

    bindSiteSearch("siteSearchInput", "siteSearchResults");
    bindSiteSearch("mobileSearchInput", "mobileSearchResults");
    bindSiteSearch("quickSearchInput", "quickSearchResults");

    document.querySelectorAll(".filter-scope").forEach(function (scope) {
        const input = scope.querySelector(".page-filter-input");
        const chips = Array.from(scope.querySelectorAll(".filter-chip"));
        const cards = Array.from(scope.querySelectorAll(".movie-card"));
        let activeFilter = "all";
        let keyword = "";

        function apply() {
            cards.forEach(function (card) {
                const text = (card.getAttribute("data-search") || "").toLowerCase();
                const chipMatch = activeFilter === "all" || text.includes(activeFilter.toLowerCase());
                const keywordMatch = !keyword || text.includes(keyword.toLowerCase());
                card.classList.toggle("is-hidden", !(chipMatch && keywordMatch));
            });
        }

        chips.forEach(function (chip) {
            chip.addEventListener("click", function () {
                chips.forEach(function (item) {
                    item.classList.remove("active");
                });
                chip.classList.add("active");
                activeFilter = chip.getAttribute("data-filter") || "all";
                apply();
            });
        });

        if (input) {
            input.addEventListener("input", function () {
                keyword = input.value.trim();
                apply();
            });

            const form = input.closest("form");
            if (form) {
                form.addEventListener("submit", function (event) {
                    event.preventDefault();
                    keyword = input.value.trim();
                    apply();
                });
            }
        }
    });
}());
