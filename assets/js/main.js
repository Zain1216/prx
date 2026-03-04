/**
* PRX Research - Animation JS
* Futuristic Medical Innovation Theme
* Enhanced with GSAP and Lenis Smooth Scroll
*/

(function() {
  "use strict";

  // Wait for DOM and all scripts to load
  window.addEventListener('load', function() {
    
    // Initialize GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Initialize Lenis Smooth Scroll (with fallback)
    if (typeof Lenis !== 'undefined') {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      // Integrate Lenis with GSAP ScrollTrigger
      if (typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      }
    }

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  
  // First, set active class based on current page URL
  const setActivePage = () => {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('#navbar .nav-link');
    
    navLinks.forEach(link => {
      const linkPath = link.getAttribute('href');
      if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };
  
  // Run on page load
  setActivePage();
  
  // Also keep scroll-based active state for single-page navigation
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Toggle .scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header')
  let selectTopbar = select('#topbar')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('scrolled')
      } else {
        selectHeader.classList.remove('scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /**
   * Hide topbar when scrolling down past 100px, show when at top
   */
  if (selectTopbar) {
    const handleTopbarScroll = () => {
      if (window.scrollY > 100) {
        selectTopbar.classList.add('topbar-hidden');
      } else {
        selectTopbar.classList.remove('topbar-hidden');
      }
    };
    
    window.addEventListener('load', handleTopbarScroll);
    onscroll(document, handleTopbarScroll);
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  const mobileNavToggle = select('.mobile-nav-toggle');
  const navbar = select('#navbar');
  const navbarClose = select('.navbar-close');
  const navBackdrop = select('.nav-backdrop');
  
  if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', function() {
      navbar.classList.toggle('active');
      navBackdrop.classList.toggle('active');
      document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    });
  }
  
  // Close menu when clicking close button
  if (navbarClose) {
    navbarClose.addEventListener('click', function() {
      navbar.classList.remove('active');
      navBackdrop.classList.remove('active');
      document.body.style.overflow = ''; // Re-enable scrolling
    });
  }
  
  // Close menu when clicking backdrop
  if (navBackdrop) {
    navBackdrop.addEventListener('click', function() {
      navbar.classList.remove('active');
      navBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
  
  // Close menu when pressing Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navbar && navbar.classList.contains('active')) {
      navbar.classList.remove('active');
      navBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  // Preloader - remove immediately
  (function() {
    var preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.style.transition = 'opacity 0.5s ease';
      preloader.style.opacity = '0';
      setTimeout(function() {
        preloader.style.display = 'none';
        preloader.remove();
      }, 500);
    }
  })();

  // Preloader fallback - force remove after 3 seconds max
  setTimeout(function() {
    var preloader = document.getElementById('preloader');
    if (preloader && preloader.parentNode) {
      preloader.remove();
    }
  }, 3000);

  /**
   * Initiate glightbox 
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },
      1200: {
        slidesPerView: 2,
        spaceBetween: 20
      }
    }
  });

  /**
   * Initiate Pure Counter 
   */
  new PureCounter();

  // ===========================================
  // CUSTOM ANIMATIONS - NEW THEME
  // ===========================================

  // Hero Animations with staggered reveal
  function initHeroAnimations() {
    const heroSection = select('#hero');
    if (!heroSection) return;

    // Animate hero content with staggered reveal
    const heroContent = heroSection.querySelector('.container');
    if (heroContent) {
      const heroElements = heroContent.children;
      gsap.fromTo(heroElements, 
        { opacity: 0, y: 40 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          stagger: 0.15,
          ease: 'power3.out',
          delay: 0.3
        }
      );
    }

    // Hero button animation
    const heroBtn = select('#tt');
    if (heroBtn) {
      gsap.fromTo(heroBtn,
        { opacity: 0, scale: 0.8 },
        { 
          opacity: 1, 
          scale: 1, 
          duration: 0.8, 
          delay: 1,
          ease: 'back.out(1.7)'
        }
      );
    }

    // Floating elements animation
    const floatingElements = heroSection.querySelectorAll('.floating-element');
    if (floatingElements.length > 0) {
      gsap.fromTo(floatingElements,
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.2,
          delay: 0.5,
          ease: 'back.out(1.7)'
        }
      );
    }
  }

  // Initialize hero animations
  initHeroAnimations();

  // ===========================================
  // SCROLL ANIMATIONS
  // ===========================================

  // Section Title Animation
  const sectionTitles = select('.section-title', true);
  if (sectionTitles && typeof gsap !== 'undefined') {
    sectionTitles.forEach(title => {
      gsap.fromTo(title,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: title,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }

  // Why Us Section - Content Box Animation
  const whyUsContent = select('#why-us .content');
  if (whyUsContent && typeof gsap !== 'undefined') {
    gsap.fromTo(whyUsContent,
      { opacity: 0, x: -60 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        scrollTrigger: {
          trigger: whyUsContent,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  // Icon Boxes Animation with stagger
  const iconBoxes = select('#why-us .icon-box', true);
  if (iconBoxes && typeof gsap !== 'undefined') {
    gsap.fromTo(iconBoxes,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.12,
        scrollTrigger: {
          trigger: '#why-us',
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  // About Section Animations
  const aboutSection = select('#about');
  if (aboutSection && typeof gsap !== 'undefined') {
    // Image animation
    const aboutImage = aboutSection.querySelector('.col-xl-5 img');
    if (aboutImage) {
      gsap.fromTo(aboutImage,
        { opacity: 0, x: 60 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          scrollTrigger: {
            trigger: aboutSection,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    // Icon boxes in about section
    const aboutIconBoxes = select('#about .icon-box', true);
    if (aboutIconBoxes) {
      gsap.fromTo(aboutIconBoxes,
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.15,
          scrollTrigger: {
            trigger: aboutSection,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
  }

  // Services Section Animation
  const servicesSection = select('.about1');
  if (servicesSection && typeof gsap !== 'undefined') {
    const servicesImage = servicesSection.querySelector('img');
    const servicesContent = servicesSection.querySelector('.content');
    
    if (servicesImage) {
      gsap.fromTo(servicesImage,
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          scrollTrigger: {
            trigger: servicesSection,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    if (servicesContent) {
      gsap.fromTo(servicesContent,
        { opacity: 0, x: 60 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          delay: 0.3,
          scrollTrigger: {
            trigger: servicesSection,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    // Service list items
    const serviceItems = servicesSection.querySelectorAll('.content ul li');
    if (serviceItems.length > 0) {
      gsap.fromTo(serviceItems,
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.1,
          scrollTrigger: {
            trigger: servicesContent,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
  }

  // Appointment Section Animation
  const appointmentSection = select('#appointment');
  if (appointmentSection && typeof gsap !== 'undefined') {
    gsap.fromTo(appointmentSection,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: appointmentSection,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  // Departments/Specialties Animation
  const departmentsSection = select('#Sub-Specialties');
  if (departmentsSection && typeof gsap !== 'undefined') {
    // Tab navigation items
    const tabItems = departmentsSection.querySelectorAll('.nav-link');
    if (tabItems.length > 0) {
      gsap.fromTo(tabItems,
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.08,
          scrollTrigger: {
            trigger: departmentsSection,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    // Tab content
    const tabPanes = departmentsSection.querySelectorAll('.tab-pane');
    if (tabPanes.length > 0) {
      tabPanes.forEach((pane, index) => {
        gsap.fromTo(pane,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            scrollTrigger: {
              trigger: departmentsSection,
              start: 'top 70%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    }
  }

  // Contact Section Animation
  const contactSection = select('#contact');
  if (contactSection && typeof gsap !== 'undefined') {
    gsap.fromTo(contactSection,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: contactSection,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  // Footer Animation
  const footer = select('#footer');
  if (footer && typeof gsap !== 'undefined') {
    gsap.fromTo(footer,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: footer,
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  // Slider/Partners Animation
  const slider = select('.slider');
  if (slider && typeof gsap !== 'undefined') {
    gsap.fromTo(slider,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: slider,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  // FAQ Section Animation
  const faqSection = select('#faq');
  if (faqSection && typeof gsap !== 'undefined') {
    const faqItems = faqSection.querySelectorAll('.faq-list li');
    if (faqItems.length > 0) {
      gsap.fromTo(faqItems,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          scrollTrigger: {
            trigger: faqSection,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
  }

  // Services Page Animation (Sponsors page)
  const servicesPage = select('#services');
  if (servicesPage && typeof gsap !== 'undefined') {
    const serviceBoxes = servicesPage.querySelectorAll('.icon-box');
    if (serviceBoxes.length > 0) {
      gsap.fromTo(serviceBoxes,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          scrollTrigger: {
            trigger: servicesPage,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
  }

  // Features Section Animation
  const featuresSection = select('#features');
  if (featuresSection && typeof gsap !== 'undefined') {
    gsap.fromTo(featuresSection,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: featuresSection,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  // Add parallax effect to hero video
  const heroVideo = select('#hero-video');
  if (heroVideo) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        gsap.to(heroVideo, {
          y: scrollY * 0.3,
          duration: 0.1
        });
      }
    });
  }

  // Card hover effects
  const cards = select('.card', true);
  if (cards) {
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { y: -10, duration: 0.3, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { y: 0, duration: 0.3, ease: 'power2.out' });
      });
    });
  }

  // Info boxes hover effect
  const infoBoxes = select('.contact .info', true);
  if (infoBoxes) {
    infoBoxes.forEach(box => {
      box.addEventListener('mouseenter', () => {
        gsap.to(box, { y: -5, duration: 0.3, ease: 'power2.out' });
      });
      box.addEventListener('mouseleave', () => {
        gsap.to(box, { y: 0, duration: 0.3, ease: 'power2.out' });
      });
    });
  }

  // Form submit handler for contact form
  const contactForms = document.querySelectorAll('.php-email-form');
  contactForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const loading = this.querySelector('.loading');
      const errorMessage = this.querySelector('.error-message');
      const sentMessage = this.querySelector('.sent-message');
      
      // Hide all messages first
      if (loading) loading.style.display = 'none';
      if (errorMessage) errorMessage.style.display = 'none';
      if (sentMessage) sentMessage.style.display = 'none';
      
      // Show loading
      if (loading) {
        loading.style.display = 'block';
      }
      
      // Simulate form submission
      setTimeout(() => {
        if (loading) loading.style.display = 'none';
        
        if (sentMessage) {
          sentMessage.style.display = 'block';
        }
        
        this.reset();
        
        setTimeout(() => {
          if (sentMessage) {
            sentMessage.style.display = 'none';
          }
        }, 5000);
      }, 1500);
    });
  });

  // Initialize all scroll animations
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }

  }); // End of window.load event listener

})();

