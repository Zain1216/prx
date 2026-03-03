/**
* PRX Research - Animation JS
* Enhanced with GSAP, Three.js and Lenis Smooth Scroll
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
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header')
  let selectTopbar = select('#topbar')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
        if (selectTopbar) {
          selectTopbar.classList.add('topbar-scrolled')
        }
        document.body.classList.add('topbar-scrolled')
      } else {
        selectHeader.classList.remove('header-scrolled')
        if (selectTopbar) {
          selectTopbar.classList.remove('topbar-scrolled')
        }
        document.body.classList.remove('topbar-scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
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
  if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', function() {
      const navbar = select('#navbar');
      navbar.classList.toggle('active');
      this.classList.toggle('bi-list');
      this.classList.toggle('bi-x');
    });
  }

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

  // Preloader - remove immediately to prevent getting stuck
  (function() {
    var preloader = document.getElementById('preloader');
    if (preloader) {
      // Add fade out transition
      preloader.style.transition = 'opacity 0.3s ease';
      preloader.style.opacity = '0';
      
      // Remove from DOM after transition
      setTimeout(function() {
        preloader.style.display = 'none';
        preloader.remove();
      }, 300);
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
   * Initiate Gallery Lightbox 
   */
  const galelryLightbox = GLightbox({
    selector: '.galelry-lightbox'
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
  // CUSTOM ANIMATIONS
  // ===========================================

  // Hero Animations
  function initHeroAnimations() {
    const heroSection = select('#hero');
    if (!heroSection) return;

    // Animate hero content
    const heroContent = heroSection.querySelector('.container');
    if (heroContent) {
      gsap.fromTo(heroContent.children, 
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          stagger: 0.2,
          ease: 'power3.out'
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
          delay: 0.8,
          ease: 'back.out(1.7)'
        }
      );
    }
  }

  // Initialize Three.js Particle Animation
  function initThreeJS() {
    const heroSection = select('#hero');
    if (!heroSection) return;

    // Create canvas for Three.js
    const canvas = document.createElement('canvas');
    canvas.id = 'hero-canvas';
    heroSection.insertBefore(canvas, heroSection.firstChild);

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, heroSection.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Create material
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x1977cc,
      transparent: true,
      opacity: 0.6,
    });

    // Create mesh
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 3;

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
      mouseX = event.clientX / window.innerWidth - 0.5;
      mouseY = event.clientY / window.innerHeight - 0.5;
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate particles
      particlesMesh.rotation.y += 0.001;
      particlesMesh.rotation.x += 0.0005;

      // Mouse influence
      particlesMesh.rotation.y += mouseX * 0.05;
      particlesMesh.rotation.x += mouseY * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, heroSection.offsetHeight);
    });
  }

  // Initialize Three.js on load
  window.addEventListener('load', () => {
    // Small delay to ensure DOM is ready
    setTimeout(initThreeJS, 100);
  });

  // ===========================================
  // SCROLL ANIMATIONS
  // ===========================================

  // Section Title Animation
  const sectionTitles = select('.section-title', true);
  if (sectionTitles) {
    sectionTitles.forEach(title => {
      gsap.fromTo(title,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: title,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }

  // Why Us Section - Content Box Animation
  const whyUsContent = select('#why-us .content');
  if (whyUsContent) {
    gsap.fromTo(whyUsContent,
      { opacity: 0, x: -50 },
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
  if (iconBoxes) {
    gsap.fromTo(iconBoxes,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
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
  if (aboutSection) {
    gsap.fromTo(aboutSection,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: aboutSection,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  // Icon boxes in about section
  const aboutIconBoxes = select('#about .icon-box', true);
  if (aboutIconBoxes) {
    gsap.fromTo(aboutIconBoxes,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.2,
        scrollTrigger: {
          trigger: aboutSection,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  // Services Section Animation
  const servicesSection = select('.about1');
  if (servicesSection) {
    const servicesImage = servicesSection.querySelector('img');
    const servicesContent = servicesSection.querySelector('.content');
    
    if (servicesImage) {
      gsap.fromTo(servicesImage,
        { opacity: 0, x: -50 },
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
        { opacity: 0, x: 50 },
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
  }

  // Appointment Section Animation
  const appointmentSection = select('#appointment');
  if (appointmentSection) {
    gsap.fromTo(appointmentSection,
      { opacity: 0, y: 50 },
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
  if (departmentsSection) {
    // Tab navigation items
    const tabItems = departmentsSection.querySelectorAll('.nav-link');
    if (tabItems.length > 0) {
      gsap.fromTo(tabItems,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.1,
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
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: index * 0.1,
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
  if (contactSection) {
    gsap.fromTo(contactSection,
      { opacity: 0, y: 50 },
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
  if (footer) {
    gsap.fromTo(footer,
      { opacity: 0, y: 30 },
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

  // Footer links hover animation
  const footerLinks = select('#footer .footer-links ul li', true);
  if (footerLinks) {
    footerLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        gsap.to(link, { x: 5, duration: 0.2 });
      });
      link.addEventListener('mouseleave', () => {
        gsap.to(link, { x: 0, duration: 0.2 });
      });
    });
  }

  // Slider/Partners Animation
  const slider = select('.slider');
  if (slider) {
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

  // Button hover effects
  const buttons = select('button, .btn, .appointment-btn, .appointment-btn1', true);
  if (buttons) {
    buttons.forEach(btn => {
      btn.classList.add('btn-animate');
    });
  }

  // Card animations
  const cards = select('.card', true);
  if (cards) {
    cards.forEach(card => {
      card.classList.add('card-animate');
    });
  }

  // Icon box animations
  const iconBoxElements = select('.icon-box', true);
  if (iconBoxElements) {
    iconBoxElements.forEach(box => {
      box.classList.add('icon-box-animate');
    });
  }

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    const header = select('#header');
    if (header) {
      if (window.scrollY > 50) {
        header.style.backdropFilter = 'blur(10px)';
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
      } else {
        header.style.backdropFilter = 'none';
        header.style.background = '#fff';
        header.style.boxShadow = '0px 2px 15px rgba(25, 119, 204, 0.1)';
      }
    }
  });

  // Back to top button with animation
  const backToTop = select('.back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      gsap.to(window, { scrollTo: { y: 0 }, duration: 1, ease: 'power3.inOut' });
    });
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

  // Initialize all scroll animations
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }

  }); // End of window.load event listener

})();

