const nav = document.querySelector("nav");
let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function updateNavState() {
    if (!nav) return;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const menu = document.getElementById("nav-links");
    const menuOpen = menu && menu.classList.contains("show-menu");
    const progressBar = nav.querySelector(".nav-progress-bar");

    nav.classList.toggle("nav-scrolled", scrollTop > 12);
    if (progressBar) {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = scrollable > 0 ? scrollTop / scrollable : 0;
        progressBar.style.transform = `scaleX(${Math.min(Math.max(ratio, 0), 1)})`;
    }

    if (menuOpen || scrollTop < 90 || scrollTop < lastScrollTop) {
        nav.style.top = "0";
    } else {
        nav.style.top = "-92px";
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}

window.addEventListener("scroll", updateNavState, { passive: true });
window.addEventListener("load", updateNavState);

function resolveBasePath() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes("/services/") || path.includes("/blogs/")) return "../";
    return "";
}

function normalizePageFromHref(href) {
    if (!href) return "";
    const cleaned = href.split("#")[0].split("?")[0];
    const segments = cleaned.split("/").filter(Boolean);
    return (segments.pop() || "").toLowerCase();
}

function getCurrentPageName() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes("/blogs/")) return "blogs.html";
    if (path.includes("/services/")) return "index.html";

    const segments = path.split("/").filter(Boolean);
    const current = segments.pop() || "index.html";
    if (!current.endsWith(".html")) return "index.html";
    return current.toLowerCase();
}

function initHeaderEnhancements() {
    const headerNav = document.querySelector("nav");
    if (!headerNav) return;

    headerNav.classList.add("site-nav");

    const menu = document.getElementById("nav-links");
    if (menu) {
        const currentPage = getCurrentPageName();
        menu.querySelectorAll("a").forEach((link) => {
            const page = normalizePageFromHref(link.getAttribute("href"));
            if (!page || !page.endsWith(".html")) return;
            link.classList.toggle("active", page === currentPage);
        });

        if (!menu.querySelector(".nav-cta-link")) {
            const ctaItem = document.createElement("li");
            ctaItem.className = "nav-cta-item";
            ctaItem.innerHTML = `<a href="${resolveBasePath()}contact.html" class="nav-cta-link">Get Proposal</a>`;
            menu.appendChild(ctaItem);
        }
    }

    if (!headerNav.querySelector(".nav-progress")) {
        const progress = document.createElement("div");
        progress.className = "nav-progress";
        progress.innerHTML = '<span class="nav-progress-bar"></span>';
        headerNav.appendChild(progress);
    }
}

function initModernFooter() {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const base = resolveBasePath();
    const year = new Date().getFullYear();

    footer.classList.add("site-footer");
    footer.innerHTML = `
        <div class="footer-inner">
            <div class="footer-grid">
                <section class="footer-brand">
                    <h3>JSparks Digitalization</h3>
                    <p>Growth-focused digital marketing and web experiences for businesses in Pollachi and beyond.</p>
                    <a href="mailto:jsparksdigitalization@gmail.com" class="footer-mail">jsparksdigitalization@gmail.com</a>
                </section>
                <section class="footer-col">
                    <h4>Company</h4>
                    <a href="${base}index.html">Home</a>
                    <a href="${base}about.html">About Us</a>
                    <a href="${base}blogs.html">Blogs</a>
                    <a href="${base}partners.html">Our Clients</a>
                    <a href="${base}contact.html">Contact</a>
                </section>
                <section class="footer-col">
                    <h4>Services</h4>
                    <a href="${base}services/web-development.html">Web Development</a>
                    <a href="${base}services/social-media-marketing.html">Social Media Marketing</a>
                    <a href="${base}services/search-engine-optimization.html">SEO</a>
                    <a href="${base}services/ad-campaign-strategy.html">Ad Campaign Strategy</a>
                </section>
                <section class="footer-col">
                    <h4>Connect</h4>
                    <a href="https://www.instagram.com/jsparks_digitalization/" target="_blank" rel="noopener noreferrer">Instagram</a>
                    <a href="https://www.facebook.com/profile.php?id=61586018085382" target="_blank" rel="noopener noreferrer">Facebook</a>
                    <a href="https://www.linkedin.com/in/jsparks-digitalization-pollachi/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                    <a href="mailto:jsparksdigitalization@gmail.com">Email Us</a>
                </section>
            </div>
            <div class="footer-bottom">
                <p>&copy; ${year} JSparks Digitalization. All rights reserved.</p>
                <p>Pollachi, Tamil Nadu</p>
            </div>
        </div>
    `;
}

function toggleMenu() {
    const menu = document.getElementById("nav-links");
    const popupButton = document.querySelector(".popup-toggle");
    if (!menu) return;

    menu.classList.toggle("show-menu");
    const isOpen = menu.classList.contains("show-menu");
    if (popupButton) popupButton.setAttribute("aria-expanded", String(isOpen));
    updateNavState();
}

function initRevealAnimations() {
    const revealSelectors = [
        ".hero",
        ".services-header",
        ".service-card",
        ".blogs-header-section",
        ".blog-card",
        ".intro-section",
        ".founder-card",
        ".detail-row",
        ".team-card",
        ".contact-hero",
        ".contact-card",
        ".partner-logo",
        ".work-item",
        ".service-page",
        ".service-links-grid a",
        ".blog-container",
        ".site-footer",
    ];

    const revealTargets = revealSelectors.flatMap((selector) =>
        Array.from(document.querySelectorAll(selector))
    );
    const uniqueTargets = Array.from(new Set(revealTargets));

    const staggerGroups = [
        ".services-grid",
        ".blog-grid",
        ".founder-grid",
        ".team-grid",
        ".contact-grid",
        ".partner-grid",
        ".work-list",
        ".service-links-grid",
    ];

    staggerGroups.forEach((groupSelector) => {
        document.querySelectorAll(groupSelector).forEach((group) => {
            Array.from(group.children).forEach((child, index) => {
                if (!child.style.getPropertyValue("--reveal-delay")) {
                    child.style.setProperty(
                        "--reveal-delay",
                        `${Math.min(index * 70, 420)}ms`
                    );
                }
            });
        });
    });

    uniqueTargets.forEach((el) => {
        if (el.hasAttribute("data-aos")) return;
        el.classList.add("reveal-item");
    });

    const observerTargets = uniqueTargets.filter(
        (el) => el.classList.contains("reveal-item")
    );

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        observerTargets.forEach((el) => el.classList.add("is-visible"));
        return;
    }

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.14,
            rootMargin: "0px 0px -8% 0px",
        }
    );

    observerTargets.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
            el.classList.add("is-visible");
            return;
        }
        revealObserver.observe(el);
    });
}

function initMagneticEffects() {
    if (prefersReducedMotion || !window.matchMedia("(pointer:fine)").matches) return;

    const magneticTargets = document.querySelectorAll(
        ".service-read-more, .contact-cta, .back-btn, .blog-read-more, .social-btn, .cookie-btn, button"
    );

    magneticTargets.forEach((target) => {
        target.classList.add("magnetic-target");

        target.addEventListener("mousemove", (event) => {
            const rect = target.getBoundingClientRect();
            const x = event.clientX - rect.left - rect.width / 2;
            const y = event.clientY - rect.top - rect.height / 2;
            const tx = Math.max(Math.min((x / rect.width) * 18, 8), -8);
            const ty = Math.max(Math.min((y / rect.height) * 18, 8), -8);

            target.style.setProperty("--mx", `${tx}px`);
            target.style.setProperty("--my", `${ty}px`);
        });

        target.addEventListener("mouseleave", () => {
            target.style.setProperty("--mx", "0px");
            target.style.setProperty("--my", "0px");
        });
    });
}

function initTiltCards() {
    if (prefersReducedMotion || !window.matchMedia("(pointer:fine)").matches) return;

    const cards = document.querySelectorAll(
        ".service-card, .blog-card, .founder-card, .team-card, .contact-card, .work-item, .partner-logo"
    );

    cards.forEach((card) => {
        card.classList.add("interactive-card");

        card.addEventListener("mousemove", (event) => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateY = ((x - centerX) / centerX) * 4;
            const rotateX = -((y - centerY) / centerY) * 4;

            card.style.setProperty("--card-rotate-x", `${rotateX.toFixed(2)}deg`);
            card.style.setProperty("--card-rotate-y", `${rotateY.toFixed(2)}deg`);
        });

        card.addEventListener("mouseleave", () => {
            card.style.setProperty("--card-rotate-x", "0deg");
            card.style.setProperty("--card-rotate-y", "0deg");
        });
    });
}

function initCursorGlow() {
    if (prefersReducedMotion || !window.matchMedia("(pointer:fine)").matches) return;

    const cursorGlow = document.createElement("div");
    cursorGlow.className = "cursor-glow";
    document.body.appendChild(cursorGlow);

    let glowX = 0;
    let glowY = 0;
    let frameRequested = false;

    function paintGlow() {
        cursorGlow.style.transform = `translate3d(${glowX - 90}px, ${glowY - 90}px, 0)`;
        frameRequested = false;
    }

    window.addEventListener("pointermove", (event) => {
        glowX = event.clientX;
        glowY = event.clientY;
        if (!frameRequested) {
            window.requestAnimationFrame(paintGlow);
            frameRequested = true;
        }
    });

    window.addEventListener("pointerdown", () => {
        cursorGlow.classList.add("active");
        window.setTimeout(() => cursorGlow.classList.remove("active"), 180);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initHeaderEnhancements();
    initModernFooter();
    updateNavState();
    initRevealAnimations();
    initMagneticEffects();
    initTiltCards();
    initCursorGlow();

    const menu = document.getElementById("nav-links");
    if (menu) {
        menu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                menu.classList.remove("show-menu");
                updateNavState();
            });
        });
    }
});

// Cookie consent + basic visitor tracking
(function () {
    const CONSENT_COOKIE = "jsparks_cookie_consent";
    const PROMPT_SHOWN_COOKIE = "jsparks_cookie_prompt_shown";
    const ENTRY_RECORDED_COOKIE = "jsparks_entry_recorded";
    const VISITOR_ID_COOKIE = "jsparks_visitor_id";
    const ENTRY_PAGE_COOKIE = "jsparks_entry_page";
    const ENTRY_TIME_COOKIE = "jsparks_entry_time";

    function setCookie(name, value, days) {
        const maxAge = days * 24 * 60 * 60;
        document.cookie =
            encodeURIComponent(name) +
            "=" +
            encodeURIComponent(value) +
            "; max-age=" +
            maxAge +
            "; path=/; SameSite=Lax";
    }

    function getCookie(name) {
        const nameEq = encodeURIComponent(name) + "=";
        const parts = document.cookie.split(";");
        for (let i = 0; i < parts.length; i++) {
            let c = parts[i].trim();
            if (c.indexOf(nameEq) === 0) {
                return decodeURIComponent(c.substring(nameEq.length));
            }
        }
        return null;
    }

    function setStoredValue(key, value, days) {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            // Ignore storage errors and rely on cookies.
        }
        setCookie(key, value, days);
    }

    function getStoredValue(key) {
        try {
            const localValue = localStorage.getItem(key);
            if (localValue !== null) return localValue;
        } catch (e) {
            // Ignore storage errors and rely on cookies.
        }
        return getCookie(key);
    }

    function randomId() {
        return (
            "v_" +
            Date.now().toString(36) +
            "_" +
            Math.random().toString(36).slice(2, 10)
        );
    }

    function trackVisitor() {
        if (getStoredValue(ENTRY_RECORDED_COOKIE) === "true") return;

        let visitorId = getStoredValue(VISITOR_ID_COOKIE);
        if (!visitorId) {
            visitorId = randomId();
            setStoredValue(VISITOR_ID_COOKIE, visitorId, 180);
        }

        const now = new Date().toISOString();
        setStoredValue(ENTRY_PAGE_COOKIE, window.location.pathname, 180);
        setStoredValue(ENTRY_TIME_COOKIE, now, 180);
        setStoredValue(ENTRY_RECORDED_COOKIE, "true", 180);

        // Optional debug object for admin/dev checks in console.
        window.JSparksVisitorData = {
            visitorId: visitorId,
            entryPage: window.location.pathname,
            entryTime: now,
            oneTimeEntryRecorded: true,
        };
    }

    function setConsent(value) {
        setStoredValue(CONSENT_COOKIE, value, 365);
    }

    function removeBanner() {
        const banner = document.getElementById("cookie-consent-banner");
        const overlay = document.getElementById("cookie-consent-overlay");
        if (banner) banner.remove();
        if (overlay) overlay.remove();
    }

    function renderBanner() {
        if (document.getElementById("cookie-consent-banner")) return;
        setStoredValue(PROMPT_SHOWN_COOKIE, "true", 365);

        const overlay = document.createElement("div");
        overlay.id = "cookie-consent-overlay";
        overlay.className = "cookie-overlay";

        const banner = document.createElement("div");
        banner.id = "cookie-consent-banner";
        banner.className = "cookie-banner";
        banner.innerHTML =
            '<h3>We value your privacy</h3>' +
            '<p>We use cookies to understand website visits and improve your experience.</p>' +
            '<div class="cookie-actions">' +
            '<button type="button" class="cookie-btn cookie-accept">Accept All</button>' +
            '<button type="button" class="cookie-btn cookie-decline">Decline</button>' +
            "</div>";

        document.body.appendChild(overlay);
        document.body.appendChild(banner);
        requestAnimationFrame(function () {
            banner.classList.add("show");
            overlay.classList.add("show");
        });

        const acceptBtn = banner.querySelector(".cookie-accept");
        const declineBtn = banner.querySelector(".cookie-decline");

        acceptBtn.addEventListener("click", function () {
            setConsent("accepted");
            trackVisitor();
            removeBanner();
        });

        declineBtn.addEventListener("click", function () {
            setConsent("declined");
            removeBanner();
        });
    }

    const consent = getStoredValue(CONSENT_COOKIE);
    if (consent === "accepted") {
        trackVisitor();
    } else if (
        consent !== "declined" &&
        getStoredValue(PROMPT_SHOWN_COOKIE) !== "true"
    ) {
        window.addEventListener("load", renderBanner);
    }
})();
