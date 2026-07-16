/* ============================================================
   Garden Groves — Interactions & Smooth Scroll
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---- Element References ----
  const navbar      = document.getElementById('navbar');
  const hamburger   = document.getElementById('navHamburger');
  const mobileMenu  = document.getElementById('navMobileMenu');
  const mobileLinks = mobileMenu.querySelectorAll('.navbar__mobile-link');

  // ---- Scroll → Compact Navbar ----
  const SCROLL_THRESHOLD = 60;

  const handleScroll = () => {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  // Passive listener for performance
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Run once on load in case the page is already scrolled
  handleScroll();

  // ---- Hamburger Toggle ----
  const openMenu = () => {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    document.body.classList.add('menu-open');
  };

  const closeMenu = () => {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    document.body.classList.remove('menu-open');
  };

  const toggleMenu = () => {
    const isOpen = hamburger.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  };

  hamburger.addEventListener('click', toggleMenu);

  // ---- Close mobile menu when a link is clicked ----
  mobileLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      closeMenu();
      // Smooth scroll with offset for mobile links too
      smoothScrollTo(e, link);
    });
  });

  // ---- Close on Escape key ----
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger.classList.contains('open')) {
      closeMenu();
      hamburger.focus();
    }
  });

  // ---- Smooth Scroll with Navbar Offset ----
  const getNavHeight = () => navbar.offsetHeight + 12; // 12px extra breathing room

  const smoothScrollTo = (e, anchor) => {
    const href = anchor.getAttribute('href');

    // Redirect #book to WhatsApp / contact section
    if (href === '#book') {
      e.preventDefault();
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        const top = contactSection.getBoundingClientRect().top + window.scrollY - getNavHeight();
        window.scrollTo({ top, behavior: 'smooth' });
      }
      return;
    }

    // Normal section scroll with offset
    if (href && href.startsWith('#') && href.length > 1) {
      const target = document.getElementById(href.slice(1));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - getNavHeight();
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  };

  // ---- Active link highlighting ----
  const navLinks = document.querySelectorAll('.navbar__link');
  const allNavAnchors = document.querySelectorAll('.navbar__link, .navbar__cta-desktop');

  const setActiveLink = (hash) => {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === hash);
    });
  };

  // Click handlers — smooth scroll for all nav links
  allNavAnchors.forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href) setActiveLink(href);
      smoothScrollTo(e, anchor);
    });
  });

  // Hero CTAs also smooth-scroll
  document.querySelectorAll('.hero__btn').forEach(btn => {
    btn.addEventListener('click', (e) => smoothScrollTo(e, btn));
  });

  // ---- Scroll Spy — auto-highlight active section ----
  const sections = document.querySelectorAll('section[id]');

  if (sections.length && 'IntersectionObserver' in window) {
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveLink('#' + entry.target.id);
          }
        });
      },
      { rootMargin: `-${getNavHeight()}px 0px -40% 0px`, threshold: 0 }
    );

    sections.forEach(section => spyObserver.observe(section));
  } else {
    setActiveLink('#home');
  }

  // ---- Scroll-Reveal for Offering Cards ----
  const revealElements = document.querySelectorAll('.offering-card');

  if (revealElements.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target); // animate only once
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show all immediately
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // ---- Signature Menu — Tab Switching ----
  const tabButtons = document.querySelectorAll('.menu__tab');
  const tabPanels  = document.querySelectorAll('.menu__panel');

  if (tabButtons.length && tabPanels.length) {
    const switchTab = (targetTab) => {
      // Deactivate all tabs
      tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });

      // Hide all panels
      tabPanels.forEach(panel => {
        panel.classList.remove('active');
      });

      // Activate the clicked tab
      targetTab.classList.add('active');
      targetTab.setAttribute('aria-selected', 'true');

      // Show the corresponding panel (re-triggers the CSS animation)
      const panelId = targetTab.getAttribute('aria-controls');
      const targetPanel = document.getElementById(panelId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    };

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn));
    });

    // Keyboard support — arrow keys to navigate tabs
    tabButtons.forEach((btn, index) => {
      btn.addEventListener('keydown', (e) => {
        let newIndex = index;

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          newIndex = (index + 1) % tabButtons.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          newIndex = (index - 1 + tabButtons.length) % tabButtons.length;
        }

        if (newIndex !== index) {
          switchTab(tabButtons[newIndex]);
          tabButtons[newIndex].focus();
        }
      });
    });
  }
});
