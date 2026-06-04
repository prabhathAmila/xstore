document.addEventListener('DOMContentLoaded', () => {
  // ----------------------------------------------------
  // 1. Initialize AOS (Animate on Scroll)
  // ----------------------------------------------------
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }

  // ----------------------------------------------------
  // 2. Overlapping sticky navbar on scroll
  // ----------------------------------------------------
  const navbar = document.getElementById('navbar');
  const demosSection = document.getElementById('demos');

  const handleScroll = () => {
    const navbarHeight = navbar ? navbar.offsetHeight : 75;

    if (window.scrollY > 20) {
      navbar.classList.add('sticky');
    } else {
      navbar.classList.remove('sticky');
    }

    if (demosSection && navbar) {
      const rect = demosSection.getBoundingClientRect();
      // Enter dark theme if the top of demos-section reaches/overlaps the navbar,
      // and the bottom of the section hasn't scrolled past the navbar yet.
      if (rect.top <= navbarHeight && rect.bottom >= navbarHeight) {
        navbar.classList.add('navbar-dark-theme');
      } else {
        navbar.classList.remove('navbar-dark-theme');
      }
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run initially in case page starts scrolled

  // ----------------------------------------------------
  // 3. Mobile Navigation Menu Toggle
  // ----------------------------------------------------
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const menuIcon = menuToggle ? menuToggle.querySelector('i') : null;

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      document.body.classList.toggle('menu-open');
      if (navMenu.classList.contains('open')) {
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-xmark');
      } else {
        menuIcon.classList.remove('fa-xmark');
        menuIcon.classList.add('fa-bars');
      }
    });

    // Close mobile menu when clicking nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        document.body.classList.remove('menu-open');
        if (menuIcon) {
          menuIcon.classList.remove('fa-xmark');
          menuIcon.classList.add('fa-bars');
        }
      });
    });
  }

  // ----------------------------------------------------
  // 4. GSAP Typewriter Animation for Hero Title
  // ----------------------------------------------------
  const typingText = document.getElementById('typing-text');
  const titleString = "#1 Most Complete WooCommerce Theme";

  if (typingText && typeof gsap !== 'undefined') {
    // Clear default text
    typingText.textContent = "";

    let textObj = { val: 0 };

    // Dynamic typing effect using GSAP
    gsap.to(textObj, {
      val: titleString.length,
      duration: 2.2,
      ease: "power1.inOut",
      onUpdate: () => {
        typingText.textContent = titleString.slice(0, Math.floor(textObj.val));
      },
      onComplete: () => {
        // Keep cursor static or blink
        const cursor = document.querySelector('.typing-cursor');
        if (cursor) {
          cursor.style.animation = "blink 0.8s infinite";
        }
      }
    });
  } else if (typingText) {
    // Fallback typewriter if GSAP didn't load
    let index = 0;
    typingText.textContent = "";

    const typeFallback = () => {
      if (index < titleString.length) {
        typingText.textContent += titleString.charAt(index);
        index++;
        setTimeout(typeFallback, 60);
      }
    };
    typeFallback();
  }

  // ----------------------------------------------------
  // 5. Initialize SwiperJS with Custom Stack Cards Effect
  // ----------------------------------------------------
  if (typeof Swiper !== 'undefined') {
    const swiper = new Swiper('.hero-swiper', {
      // Use creative effect for stacked flat deck aesthetic matching the upload
      effect: 'creative',
      grabCursor: true,
      creativeEffect: {
        limitProgress: 5, // Show up to 5 slides in the stack
        prev: {
          // Active slide slides down a small position and fades out
          translate: [0, '32px', -100], // X, Y, Z
          opacity: 0,
        },
        next: {
          // Next slides in the stack are shifted vertically upwards and scaled down
          translate: [0, '-40px', -100], // X, Y, Z
          scale: 0.93,
          opacity: 1, // Ensure they are fully visible
        },
      },
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
        pauseOnMouseEnter: false
      },
      speed: 600, // Smooth transition duration
      loop: true,
      watchSlidesProgress: true, // Required for creative stack calculations
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: false
      }
    });

    // Add 3D card tilt rotation offset on mouse movement over the container
    const swiperContainer = document.querySelector('.hero-gallery-wrapper');
    const activeSlide = document.querySelector('.hero-swiper');

    if (swiperContainer && activeSlide) {
      swiperContainer.addEventListener('mousemove', (e) => {
        const rect = swiperContainer.getBoundingClientRect();
        const x = e.clientX - rect.left - (rect.width / 2);
        const y = e.clientY - rect.top - (rect.height / 2);

        const tiltX = (y / (rect.height / 2)) * -6; // Max 6deg
        const tiltY = (x / (rect.width / 2)) * 6;  // Max 6deg

        activeSlide.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
        activeSlide.style.transition = 'transform 0.1s ease';
      });

      swiperContainer.addEventListener('mouseleave', () => {
        activeSlide.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
        activeSlide.style.transition = 'transform 0.5s ease';
      });
    }
  }

  // ----------------------------------------------------
  // 6. GSAP + ScrollTrigger Stats Counter Animation
  // ----------------------------------------------------
  const counters = document.querySelectorAll('.counter-num');

  if (counters.length > 0 && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const hasComma = counter.getAttribute('data-comma') === 'true';

      let countObj = { val: 0 };

      gsap.to(countObj, {
        val: target,
        duration: 2.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: counter,
          start: "top 90%", // starts when counter is 90% from the top of viewport
          toggleActions: "play none none none"
        },
        onUpdate: () => {
          let currentVal = Math.floor(countObj.val);
          if (hasComma) {
            counter.textContent = currentVal.toLocaleString('en-US');
          } else {
            counter.textContent = currentVal;
          }
        },
        onComplete: () => {
          if (hasComma) {
            counter.textContent = target.toLocaleString('en-US');
          } else {
            counter.textContent = target;
          }
        }
      });
    });
  } else if (counters.length > 0) {
    // Fallback using Intersection Observer if GSAP/ScrollTrigger is not available
    const counterObserverOptions = {
      threshold: 0.5
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseFloat(counter.getAttribute('data-target'));
          const hasComma = counter.getAttribute('data-comma') === 'true';

          let current = 0;
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          const stepTime = duration / steps;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              clearInterval(timer);
              counter.textContent = hasComma ? target.toLocaleString('en-US') : target;
            } else {
              let displayVal = Math.floor(current);
              counter.textContent = hasComma ? displayVal.toLocaleString('en-US') : displayVal;
            }
          }, stepTime);

          observer.unobserve(counter);
        }
      });
    }, counterObserverOptions);

    counters.forEach(counter => {
      counterObserver.observe(counter);
    });
  }

  // ----------------------------------------------------
  // 7. Demos Filter and Search Logic
  // ----------------------------------------------------
  const demoSearch = document.getElementById('demo-search');
  const categoryItems = document.querySelectorAll('.category-item');
  const demoCards = document.querySelectorAll('.demo-card');
  const noResults = document.getElementById('no-results');

  let currentFilter = 'all';
  let searchQuery = '';

  const filterDemos = () => {
    let visibleCount = 0;

    demoCards.forEach(card => {
      const cardCategories = card.getAttribute('data-category').split(' ');
      const cardTitle = card.getAttribute('data-title');

      const matchesCategory = (currentFilter === 'all' || cardCategories.includes(currentFilter));
      const matchesSearch = cardTitle.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.classList.remove('hidden');
        // Ensure layout calculations run, then fade in
        requestAnimationFrame(() => {
          card.classList.remove('fade-out');
          card.classList.add('fade-in');
        });
        visibleCount++;
      } else {
        card.classList.add('fade-out');
        card.classList.remove('fade-in');

        // Hide card layout once opacity transition completes
        const handleTransitionEnd = (e) => {
          if (e.propertyName === 'opacity' && card.classList.contains('fade-out')) {
            card.classList.add('hidden');
            card.removeEventListener('transitionend', handleTransitionEnd);
          }
        };
        card.addEventListener('transitionend', handleTransitionEnd);
      }
    });

    // Toggle 'no results' view
    if (visibleCount === 0) {
      noResults.classList.add('visible');
    } else {
      noResults.classList.remove('visible');
    }
  };

  // Category filter click event
  categoryItems.forEach(item => {
    item.addEventListener('click', () => {
      categoryItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      currentFilter = item.getAttribute('data-filter');
      filterDemos();
    });
  });

  // Real-time search query input event
  if (demoSearch) {
    demoSearch.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      filterDemos();
    });
  }

  // ----------------------------------------------------
  // 8. Logo Marquee Swiper Initialization (Seamless Loop Slider)
  // ----------------------------------------------------
  if (typeof Swiper !== 'undefined') {
    const logoSwiper = new Swiper('.logo-marquee-swiper', {
      slidesPerView: 2,
      spaceBetween: 20,
      loop: true,
      speed: 5000, // Duration of transition between slides (5 seconds for slow marquee feel)
      allowTouchMove: true, // Allows drag/swipe interaction
      autoplay: {
        delay: 0, // Continuous rolling loop (0ms delay)
        disableOnInteraction: false,
      },
      breakpoints: {
        480: {
          slidesPerView: 3,
          spaceBetween: 20
        },
        768: {
          slidesPerView: 4,
          spaceBetween: 30
        },
        991: {
          slidesPerView: 6,
          spaceBetween: 40
        }
      }
    });

    // Pause continuous scrolling on mouse hover for accessibility
    const logoSwiperContainer = document.querySelector('.logo-marquee-section');
    if (logoSwiperContainer && logoSwiper.autoplay) {
      logoSwiperContainer.addEventListener('mouseenter', () => {
        logoSwiper.autoplay.stop();
      });
      logoSwiperContainer.addEventListener('mouseleave', () => {
        logoSwiper.autoplay.start();
      });
    }
  }

  // ----------------------------------------------------
  // 9. Testimonials Swiper Initialization
  // ----------------------------------------------------
  if (typeof Swiper !== 'undefined') {
    const testimonialsSwiper = new Swiper('.testimonials-swiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 6000,
        disableOnInteraction: false,
      },
      speed: 700,
      navigation: {
        nextEl: '.nav-btn-next',
        prevEl: '.nav-btn-prev',
      },
      pagination: {
        el: '.testimonials-pagination',
        clickable: true,
      },
      breakpoints: {
        576: {
          slidesPerView: 1,
          spaceBetween: 20
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 24
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 30
        }
      }
    });
  }

  // ----------------------------------------------------
  // 10. FAQ Accordion Interactivity
  // ----------------------------------------------------
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const answer = item.querySelector('.faq-answer');
      const isActive = item.classList.contains('active');

      // Close other open accordions in the same column for compactness
      const siblingItems = item.parentElement.querySelectorAll('.faq-item');
      siblingItems.forEach(sibling => {
        if (sibling !== item) {
          sibling.classList.remove('active');
          const siblingAnswer = sibling.querySelector('.faq-answer');
          if (siblingAnswer) {
            siblingAnswer.style.maxHeight = null;
          }
        }
      });

      // Toggle current item active state and compute dynamic heights
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + "px";
      } else {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      }
    });
  });
});