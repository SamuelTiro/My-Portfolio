/*** When you use "use strict";, you're 
 instructing the JavaScript engine to apply a stricter set of rules
 to the code, which can help catch common coding mistakes and prevent
 potentially problematic behavior.The entire construct (function() { "use strict"; ... }) 
 is immediately invoked, meaning it's executed as soon as it's defined.
The primary purpose of this pattern is to encapsulate code within a private scope,
 preventing variables and functions declared inside it from polluting the global scope.
 The "use strict"; directive inside the function enables strict mode specifically for the
 code within that function.This is a best practice in modern JavaScript development.*/


(function() {
  "use strict";

  /**
   * Easy selector helper function.
	 the "select" function simplifies the process of selecting
	 one or multiple elements from the DOM based on a provided selector.
	 By using this helper function, you can reduce repetitive code
	 and make it more concise and readable when working with
	 DOM elements in JavaScript.

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
   * Easy event listener function.
	 The "on" function simplifies the process of adding event listeners
	 to DOM elements. It supports both single-element and multiple-element
	 selections, making it easier to handle events on web pages.
	 This function can help reduce code duplication and improve
	 code readability when working with event handling in JavaScript.
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
   * Easy on scroll event listener.
	 the "onscroll" function simplifies the process of adding scroll event
	 listeners to DOM elements. It's a convenient way to handle scroll
	 events on specific elements, making it easier to create responsive
	 and interactive web features that respond to user scrolling behavior.
	 This can be useful for tasks like creating sticky navigation bars,
	 parallax effects, or triggering animations based on scroll position.
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll.
	 This part of the code is responsible for making the navigation links
	 in your header (navbar) change their active state as the user scrolls
	 down the page. It also handles the initial state of these links on page load.
   */
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
   * Scrolls to an element with header offset.
	 The "scrollto" function is responsible for smoothly scrolling
	 to an element on the page while taking into account the header's offset.
	 It ensures that the scrolled-to element is not obscured by the header.
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    if (!header.classList.contains('header-scrolled')) {
      offset -= 16
    }

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Toggle .header-scrolled class to #header when page is scrolled.
	 This part of the code controls the behavior of the header when the user scrolls
	 down the page. It adds the header-scrolled class to the header when the user
	 scrolls more than 100 pixels down the page. It also handles the initial state on page load.
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
      } else {
        selectHeader.classList.remove('header-scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /*** Back to top button.
	 This section handles the behavior of the "back-to-top" button.
	 It makes the button appear when the user scrolls more than 100
	 pixels down the page, and it scrolls back to the top of the page when clicked.
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
   * Mobile nav toggle.
	 This part of the code controls the mobile navigation toggle.
	 It toggles the visibility of the mobile navigation menu when 
	 the user clicks the mobile navigation toggle icon (hamburger menu).
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Mobile nav dropdowns activate.
	 For mobile navigation, this part of the code allows the user
	 to click on dropdown items to reveal the sub-menu items.
   */
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Scroll with ofset on links with a class name .scrollto.
	 This section allows links with the .scrollto class to smoothly 
	 scroll to their target when clicked. It also takes into account
	 the mobile navigation toggle behavior.
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
   * Scroll with ofset on page load with hash links in the url.
	 If there is a hash link in the URL when the page loads, this
	 code will scroll to the corresponding section on the page.
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Intro typed effect.
	 This code initializes a typing animation effect for the text
	 in the hero section.
   */
  const typed = select('.typed')
  if (typed) {
    let typed_strings = typed.getAttribute('data-typed-items')
    typed_strings = typed_strings.split(',')
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Initiate portfolio lightbox. 
	 It sets up the portfolio lightbox, allowing users to 
	 view portfolio images in a modal or lightbox when clicked.
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Testimonials slider.
	 This section initializes a Swiper slider for the testimonials
	 section, providing an automated slideshow with pagination.
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
    }
  });

  /**
   * Portfolio details slider.
	 Similar to the testimonials slider, this part initializes another
	 Swiper slider, but it's likely used for displaying details or 
	 additional images in the portfolio section.
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Preloader.
	 The preloader section is responsible for removing
	 the preloader when the page has finished loading.
   */
  let preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove()
    });
  }

  /**
   * Initiate Pure Counter.
	 Although not explicitly defined in this code, it 
	 appears to be referencing the initialization of a
	 Pure Counter library for counting numbers or statistics.
	 Ensure that the necessary library and HTML elements
	 are set up elsewhere in your project.
   */
  new PureCounter();

})()

/**The END */