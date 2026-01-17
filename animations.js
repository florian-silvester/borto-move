/* ═══════════════════════════════════════════════════════════════════════════
   ANIMATIONS.JS - BORTO WEBFLOW PROJECT
   ═══════════════════════════════════════════════════════════════════════════
   
   !SYNOPSIS!
   
   This file handles all JavaScript animations and interactions for the Borto
   website, with full Barba.js page transition support.
   
   STRUCTURE:
   
   1. GLOBAL CSS INJECTION (IIFE)
      - Initial styles for CV, exhibitions, thumbnails, work lists
   
   2. FONT LOADING DETECTION
      - Prevents font flash on initial page load
   
   3. UTILITY FUNCTIONS
      - Slater.js module loader
      - Bracketed text italic replacement
   
   4. GLOBAL SCRIPTS (run on all pages)
      - initBackButton()              - Back navigation (.nav_back_link, .is-back)
      - initThemeToggle()              - Dark/light mode (#Toggle button, localStorage)
      - initYearFormatter()            - Format dates, hide duplicate years (desktop)
      - initCVCleanup()                - Split CV <br> into <p>, wrap years in <span>
      - initExhibitionSorting()        - Sort by artist/year (#Artist, #Year buttons)
      - initHeadroom()                 - Auto-hide nav on scroll (Headroom.js)
   
   5. PAGE-SPECIFIC SCRIPTS
      - initStaggerAnimation()             - GSAP stagger fade-up for list items (exhibitions, artists, news)
      - initExhibitionHoverThumbnails()    - Show preview thumb on item hover (desktop)
      - initNewsHoverThumbnails()          - Show preview thumb on news items hover (desktop)
      - initLogoScrollAnimation()          - Logo animation on scroll (home bottom page)
      - initLogoDrawAnimation()            - SVG stroke draw animation for logo (home zig)
      - initZigPageLayout()                - Random alignment & featured image marking (home zig)
      - initZigScrollAnimation()           - Individual ScrollTrigger for zig items (home zig)
      - initSwiper()                       - Swiper slider for artist detail images
      - initCVReadMore()                   - Expand/collapse CV (.cv_read_cta button)
      - initSortExhibitionsByYear()        - Auto-sort exhibitions newest→oldest
      - initExhibitionDetailScripts()      - Grid toggle, work hover, work modals
      - initMeasurementDimensions()        - Format artwork dimensions (W×H×D)
      - initOldHomePageScripts()           - Logo animation, grid/flex toggle, home image fade (old home)
      - initHomePageScripts()              - Logo animation first → Logo fade out → Image fade in
   
   6. BARBA.JS PAGE TRANSITIONS
      - injectPageSpecificCSS()   - Dynamic CSS injection per page type
      - Barba hooks                - before/after/enter transition handlers
   
   7. INITIALIZATION
      - initPageScripts()         - Main orchestrator, called on load + Barba
   
   ═══════════════════════════════════════════════════════════════════════════ */


/* ═══════════════════════════════════════════════════════════════════════════
   0. IMMEDIATE THEME APPLICATION (before anything else)
   ═══════════════════════════════════════════════════════════════════════════ */

(function() {
  // Apply theme IMMEDIATELY when script loads to prevent any flash
  const storedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", storedTheme);
  if (document.body) {
    document.body.setAttribute("data-theme", storedTheme);
  } else {
    // If body doesn't exist yet, apply when it does
    document.addEventListener('DOMContentLoaded', function() {
      document.body.setAttribute("data-theme", storedTheme);
    });
  }
})();

/* ═══════════════════════════════════════════════════════════════════════════
   1. GLOBAL CSS INJECTION (IIFE)
   ═══════════════════════════════════════════════════════════════════════════ */

(function() {
  const style = document.createElement('style');
  style.textContent = `
    /* Reset margin and padding for paragraphs */
    .cv_entry p {
      margin: 0;
      padding: 0;
      display: flex;
      align-items: flex-start;
    }

    /* Style for the span containing the year */
    .cv_entry p span:first-child {
      min-width: 5ch;
      margin-right: 0.5em;
      white-space: nowrap;
    }

    /* Hide exhibition parent items initially */
    .g_exhibition_item {
      opacity: 0;
    }

    /* Show after animations are ready */
    body.animations-ready .g_exhibition_item {
      opacity: 1;
    }

    /* Set initial state for stagger animation */
    .g_exhibition_item_inner {
      opacity: 0;
      transform: translateY(20px);
    }

    /* Hide preview thumbnails by default */
    .g_preview_thumb_wrap {
      opacity: 0;
      visibility: hidden;
      pointer-events: none; /* prevent overlay interactions when hidden */
    }
    
    /* Show thumbnails on mobile/tablet (Webflow sets opacity: 0 by default) */
    @media (max-width: 1024px) {
      .work_list_thumb_wrap {
        opacity: 1 !important;
        visibility: visible !important;
      }
    }
    
    /* Hide news items initially for scroll animation */
    .news_item_wrap {
      opacity: 0;
      transform: translateY(20px);
    }
    
    /* Hide home image initially for fade-in animation */
    .home_img {
      opacity: 0;
    }
    
    /* Hide work list and press sections initially - will fade in after exhibition images */
    .work_list_wrap,
    .press_wrap {
      opacity: 0;
    }
  `;
  document.head.appendChild(style);
})();


/* ═══════════════════════════════════════════════════════════════════════════
   2. FONT LOADING DETECTION
   ═══════════════════════════════════════════════════════════════════════════
   
   Prevents FOUT (Flash of Unstyled Text) by adding .fonts-loaded class once
   custom fonts are ready. Skips on Barba transitions (fonts stay in memory).
   
   ═══════════════════════════════════════════════════════════════════════════ */

(function() {
  // Mark fonts as loaded immediately if using Barba (fonts stay in memory)
  if (typeof barba !== 'undefined') {
    document.documentElement.classList.add('fonts-loaded');
    return;
  }
  
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function() {
      document.documentElement.classList.add('fonts-loaded');
    });
  } else {
    // Fallback: add class after short delay if Font Loading API not supported
    setTimeout(function() {
      document.documentElement.classList.add('fonts-loaded');
    }, 100);
  }
})();

/* ═══════════════════════════════════════════════════════════════════════════
   3. UTILITY FUNCTIONS
   ═══════════════════════════════════════════════════════════════════════════
   
   Legacy code placeholders and comments for removed functionality.
   
   ═══════════════════════════════════════════════════════════════════════════ */

/* CV: Removed auto-italics for bracketed text */
/* Slater.app imports REMOVED - all code is now in animations.js */

/* ─────────────────────────────────────────────────────────────────────────────
   OLD CODE REMOVED - All exhibition interactions now handled by:
   - initExhibitionDetailScripts() (grid toggle, work modals, hover thumbnails)
   ───────────────────────────────────────────────────────────────────────────── */

/* ───────────────────────────────────────────────────────────────────────────
   initMeasurementDimensions() - Artwork Dimensions Formatter
   ─────────────────────────────────────────────────────────────────────────── 
   Formats artwork dimensions (W × H × D) by hiding empty values and separators.
   - Hides .dim-val elements that don't contain digits
   - Shows correct number of .dim-sep separators between values
   - Called on exhibition detail pages from initPageScripts()
   ─────────────────────────────────────────────────────────────────────────── */

function initMeasurementDimensions() {
  const measurementGroups = document.querySelectorAll('.g_measurement_wrap');
  if (!measurementGroups.length) return;

  measurementGroups.forEach(group => {
    const vals = Array.from(group.querySelectorAll('.dim-val'));
    const seps = Array.from(group.querySelectorAll('.dim-sep'));

    // Hide empty values
    vals.forEach(v => {
      const t = (v.textContent || '').trim();
      if (!/\d/.test(t)) v.style.display = 'none';
    });

    // Collect non-empty values
    const nonEmptyVals = vals.filter(v => v.style.display !== 'none');

    // Hide all separators first
    seps.forEach(s => s.style.display = 'none');

    // Show exactly (#values - 1) separators, left to right
    if (nonEmptyVals.length >= 2 && seps[0]) seps[0].style.display = '';
    if (nonEmptyVals.length >= 3 && seps[1]) seps[1].style.display = '';
  });
}



// Register the ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);


/* ───────────────────────────────────────────────────────────────────────────
   initExhibitionHoverThumbnails() - Preview Thumbnail Hover (List Pages)
   ─────────────────────────────────────────────────────────────────────────── 
   Shows/hides preview thumbnails on hover for exhibition/artist list items.
   - Desktop (>1024px): Hover on .g_exhibition_item_inner to show thumbnail + .g_view
   - Mobile/Tablet: Thumbnails and view elements visible by default
   - Animates .g_preview_thumb_wrap (opacity, y, visibility) and .g_view (opacity)
   - Hides thumbnail on scroll
   - Re-initializes on window resize
   ─────────────────────────────────────────────────────────────────────────── */

function initExhibitionHoverThumbnails() {
  const items = document.querySelectorAll('.g_exhibition_item_inner');
  let lastPreviewThumb = null; // Currently visible thumbnail (if any)
  let isDesktop; // Tracks the current mode (desktop vs. mobile/tablet)
  let handlers = []; // Store event listener references for clean-up

  // This function will hide any visible thumbnail (used on scroll, etc.)
  function hideThumbnail() {
    if (lastPreviewThumb) {
      gsap.to(lastPreviewThumb, { 
        opacity: 0, 
        y: 30, 
        visibility: 'hidden', 
        duration: 0.5,
        ease: "power1.out" 
      });
      lastPreviewThumb = null;
    }
  }

  function setupDesktop() {
    const previewThumbs = document.querySelectorAll('.g_preview_thumb_wrap');
    // Hide all thumbnails by default
    previewThumbs.forEach((previewThumb) => {
      gsap.set(previewThumb, { opacity: 0, y: 50, visibility: 'hidden' });
    });

    // Hide all title stickies by default
    const titleStickies = document.querySelectorAll('.exhibition_title_sticky');
    titleStickies.forEach((titleSticky) => {
      gsap.set(titleSticky, { opacity: 0 });
    });
    
    // Hide all .g_view elements by default
    const gViews = document.querySelectorAll('.g_view');
    gViews.forEach((gView) => {
      gsap.set(gView, { opacity: 0 });
    });

    items.forEach((item) => {
      // Get the associated preview thumbnail, title sticky, and view element
      const exhibitionItem = item.closest('.g_exhibition_item');
      const previewThumb = exhibitionItem.querySelector('.g_preview_thumb_wrap');
      const titleSticky = exhibitionItem.querySelector('.exhibition_title_sticky');
      const gView = item.querySelector('.g_view');

      // Show thumbnail, title sticky, and view element when mouse enters
      const hoverEnter = () => {
        // Kill any in-progress animations on this thumbnail to prevent stuck states
        gsap.killTweensOf(previewThumb);
        
        // If a different thumbnail is already visible, hide it first
        if (lastPreviewThumb && lastPreviewThumb !== previewThumb) {
          gsap.killTweensOf(lastPreviewThumb);
          gsap.to(lastPreviewThumb, { 
            opacity: 0, 
            y: 30, 
            visibility: 'hidden', 
            duration: 0.9,
            ease: "circ.out" 
          });
        }

        // Animate the thumbnail into view
        gsap.fromTo(previewThumb, 
          { opacity: 0, y: 30, visibility: 'visible' },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.9,
            ease: "circ.out"
          }
        );

        // Fade in title sticky if it exists
        if (titleSticky) {
          gsap.killTweensOf(titleSticky);
          gsap.fromTo(titleSticky, 
            { opacity: 0 },
            { 
              opacity: 1, 
              duration: 0.9,
              ease: "circ.out"
            }
          );
        }
        
        // Fade in .g_view element if it exists
        if (gView) {
          gsap.killTweensOf(gView);
          gsap.fromTo(gView, 
            { opacity: 0 },
            { 
              opacity: 1, 
              duration: 0.9,
              ease: "circ.out"
            }
          );
        }

        // Update the reference to the currently visible thumbnail
        lastPreviewThumb = previewThumb;
      };

      // Hide thumbnail, title sticky, and view element when mouse leaves the item
      const hoverLeave = () => {
        // Kill any in-progress animations before hiding
        gsap.killTweensOf(previewThumb);
        gsap.to(previewThumb, { 
          opacity: 0, 
          y: 30, 
          visibility: 'hidden', 
          duration: 0.9,
          ease: "circ.out" 
        });
        
        // Fade out title sticky if it exists
        if (titleSticky) {
          gsap.killTweensOf(titleSticky);
          gsap.to(titleSticky, { 
            opacity: 0, 
            duration: 0.9,
            ease: "circ.out" 
          });
        }
        
        // Fade out .g_view element if it exists
        if (gView) {
          gsap.killTweensOf(gView);
          gsap.to(gView, { 
            opacity: 0, 
            duration: 0.9,
            ease: "circ.out" 
          });
        }
        
        if (lastPreviewThumb === previewThumb) {
          lastPreviewThumb = null;
        }
      };

      item.addEventListener('mouseenter', hoverEnter);
      item.addEventListener('mouseleave', hoverLeave);

      // Save the handlers (along with the event type) so they can be removed later
      handlers.push({ item: item, type: 'mouseenter', handler: hoverEnter });
      handlers.push({ item: item, type: 'mouseleave', handler: hoverLeave });
    });

    // Add a scroll listener to hide any visible thumbnail when scrolling away
    window.addEventListener('scroll', hideThumbnail);
    handlers.push({ item: window, type: 'scroll', handler: hideThumbnail });
  }

  function setupMobile() {
    // For mobile/tablet, clear GSAP inline styles (making thumbnails and titles visible by default)
    const previewThumbs = document.querySelectorAll('.g_preview_thumb_wrap');
    previewThumbs.forEach(previewThumb => {
      gsap.set(previewThumb, { clearProps: 'all' });
    });
    
    const titleStickies = document.querySelectorAll('.exhibition_title_sticky');
    titleStickies.forEach(titleSticky => {
      gsap.set(titleSticky, { clearProps: 'all' });
    });
    
    const gViews = document.querySelectorAll('.g_view');
    gViews.forEach(gView => {
      gsap.set(gView, { clearProps: 'all' });
    });
    
    lastPreviewThumb = null;
  }

  // Remove any event listeners added in desktop mode
  function removeDesktopHandlers() {
    handlers.forEach(obj => {
      obj.item.removeEventListener(obj.type, obj.handler);
    });
    handlers = [];
    lastPreviewThumb = null;
  }

  // Set up or tear down event handlers based on viewport width
  function handleResize() {
    const newIsDesktop = window.innerWidth > 1024; // Adjust breakpoint as needed

    if (newIsDesktop !== isDesktop) {
      if (newIsDesktop) {
        removeDesktopHandlers(); // Clean up (if switching from mobile/tablet)
        setupDesktop();
      } else {
        removeDesktopHandlers();
        setupMobile();
      }
      isDesktop = newIsDesktop;
    }
  }

  // Initial execution and listen for window resize
  handleResize();
  window.addEventListener('resize', handleResize);
}

/* ───────────────────────────────────────────────────────────────────────────
   initNewsHoverThumbnails() - Preview Thumbnail Hover (News Page)
   ─────────────────────────────────────────────────────────────────────────── 
   Shows/hides preview thumbnails on hover for news items.
   - Desktop (>1024px): Hover on .news_item_wrap to show thumbnail
   - Mobile/Tablet: Thumbnails visible by default
   - Animates .work_list_thumb_wrap with GSAP (opacity, y, visibility)
   - Hides thumbnail on scroll
   - Re-initializes on window resize
   ─────────────────────────────────────────────────────────────────────────── */

function initNewsHoverThumbnails() {
  console.log('🎬 initNewsHoverThumbnails() called');
  const items = document.querySelectorAll('.news_item_wrap');
  console.log('  Found .news_item_wrap items:', items.length);
  if (!items.length) {
    console.log('  ⚠️ No news items found, exiting');
    return;
  }
  
  let lastPreviewThumb = null; // Currently visible thumbnail (if any)
  let isDesktop; // Tracks the current mode (desktop vs. mobile/tablet)
  let handlers = []; // Store event listener references for clean-up

  // This function will hide any visible thumbnail (used on scroll, etc.)
  function hideThumbnail() {
    if (lastPreviewThumb) {
      gsap.to(lastPreviewThumb, { 
        opacity: 0, 
        y: 50, 
        visibility: 'hidden', 
        duration: 0.5,
        ease: "power1.out" 
      });
      lastPreviewThumb = null;
    }
  }

  function setupDesktop() {
    console.log('  🖥️ Setting up desktop mode');
    const previewThumbs = document.querySelectorAll('.work_list_thumb_wrap');
    console.log('    Found .work_list_thumb_wrap elements (all):', previewThumbs.length);
    
    // Try to find News_item parent for each thumb
    const newsItems = document.querySelectorAll('.News_item');
    console.log('    Found .News_item parents:', newsItems.length);
    
    // Hide all thumbnails by default
    previewThumbs.forEach((previewThumb) => {
      gsap.set(previewThumb, { opacity: 0, y: 50, visibility: 'hidden' });
    });

    items.forEach((item, index) => {
      // news_item_wrap and work_list_thumb_wrap are SIBLINGS inside News_item
      // So we need to get the parent News_item first
      const newsItem = item.parentElement; // Direct parent should be News_item
      const previewThumb = newsItem ? newsItem.querySelector('.work_list_thumb_wrap') : null;

      console.log(`    Item ${index}:`, {
        newsItem: newsItem ? newsItem.className : 'not found',
        previewThumb: !!previewThumb
      });

      if (!previewThumb) {
        console.log(`      ⚠️ No thumbnail found for item ${index}`);
        return;
      }

      // Show thumbnail when mouse enters
      const hoverEnter = () => {
        console.log('      🔥 HOVER ENTER triggered on item', index);
        
        // Kill any in-progress animations on this thumbnail to prevent stuck states
        gsap.killTweensOf(previewThumb);
        
        // If a different thumbnail is already visible, hide it first
        if (lastPreviewThumb && lastPreviewThumb !== previewThumb) {
          console.log('        Hiding previous thumbnail');
          gsap.killTweensOf(lastPreviewThumb);
          gsap.to(lastPreviewThumb, { 
            opacity: 0, 
            y: 50, 
            visibility: 'hidden', 
            duration: 0.9,
            ease: "circ.out" 
          });
        }

        console.log('        Showing thumbnail with animation');
        // Animate the thumbnail FROM offset position to its natural position
        gsap.set(previewThumb, { visibility: 'visible', opacity: 1, y: 0 });
        gsap.from(previewThumb, { 
          opacity: 0, 
          y: 50, 
          duration: 0.9,
          ease: "circ.out"
        });

        // Update the reference to the currently visible thumbnail
        lastPreviewThumb = previewThumb;
      };

      // Hide thumbnail when mouse leaves the item
      const hoverLeave = () => {
        // Kill any in-progress animations before hiding
        gsap.killTweensOf(previewThumb);
        gsap.to(previewThumb, { 
          opacity: 0, 
          y: 30, 
          visibility: 'hidden', 
          duration: 0.9,
          ease: "circ.out" 
        });
        
        if (lastPreviewThumb === previewThumb) {
          lastPreviewThumb = null;
        }
      };

      item.addEventListener('mouseenter', hoverEnter);
      item.addEventListener('mouseleave', hoverLeave);

      // Save the handlers (along with the event type) so they can be removed later
      handlers.push({ item: item, type: 'mouseenter', handler: hoverEnter });
      handlers.push({ item: item, type: 'mouseleave', handler: hoverLeave });
    });

    // Add a scroll listener to hide any visible thumbnail when scrolling away
    window.addEventListener('scroll', hideThumbnail);
    handlers.push({ item: window, type: 'scroll', handler: hideThumbnail });
  }

  function setupMobile() {
    // For mobile/tablet, clear GSAP inline styles (making thumbnails visible by default)
    const previewThumbs = document.querySelectorAll('.News_item .work_list_thumb_wrap');
    previewThumbs.forEach(previewThumb => {
      gsap.set(previewThumb, { clearProps: 'all' });
    });
    
    lastPreviewThumb = null;
  }

  // Remove any event listeners added in desktop mode
  function removeDesktopHandlers() {
    handlers.forEach(obj => {
      obj.item.removeEventListener(obj.type, obj.handler);
    });
    handlers = [];
    lastPreviewThumb = null;
  }

  // Set up or tear down event handlers based on viewport width
  function handleResize() {
    const newIsDesktop = window.innerWidth > 1024; // Adjust breakpoint as needed

    if (newIsDesktop !== isDesktop) {
      if (newIsDesktop) {
        removeDesktopHandlers(); // Clean up (if switching from mobile/tablet)
        setupDesktop();
      } else {
        removeDesktopHandlers();
        setupMobile();
      }
      isDesktop = newIsDesktop;
    }
  }

  // Initial execution and listen for window resize
  handleResize();
  window.addEventListener('resize', handleResize);
}

/* ───────────────────────────────────────────────────────────────────────────
   initLogoScrollAnimation() - Logo animation triggered on scroll
   ─────────────────────────────────────────────────────────────────────────── 
   Triggers the logo animation when scrolled into view.
   - Used on "home bottom" page
   - Same animation as homepage logo splash
   - Triggered via ScrollTrigger when logo enters viewport
   ─────────────────────────────────────────────────────────────────────────── */

function initLogoScrollAnimation() {
  const logoWrap = document.querySelector(".logo_wrap");
  if (!logoWrap) {
    console.log('⚠️ Logo wrap not found for scroll animation');
    return;
  }
  
  console.log('🎬 Setting up logo scroll animation');
  
  // Set initial state
  gsap.set(".logo_wrap", { opacity: 1 });
  gsap.set(".svg-letter", { opacity: 0, y: 400 });
  
  // Create ScrollTrigger for logo
  ScrollTrigger.create({
    trigger: logoWrap,
    start: 'top 70%', // Trigger when logo is 70% down the viewport
    once: true,
    markers: false,
    onEnter: () => {
      console.log('✅ Logo ScrollTrigger FIRED - animating');
      
      gsap.to(".svg-letter", {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.04,
        ease: "expo.inOut"
      });
    }
  });
}

/* ───────────────────────────────────────────────────────────────────────────
   initZigScrollAnimation() - ScrollTrigger fade-in/move-up for zig items
   ─────────────────────────────────────────────────────────────────────────── 
   Animates .current_grid_item elements with fade-in and upward movement when
   scrolled into view. Same as artist works animation. Runs on home-zig page.
   ─────────────────────────────────────────────────────────────────────────── */

function initZigScrollAnimation() {
  const items = document.querySelectorAll('.current_grid_item');
  if (!items.length) return;

  console.log('🎬 Setting up scroll animations for', items.length, 'zig items');

  items.forEach(function(item, index) {
    console.log('  ➜ Creating ScrollTrigger for zig item', index + 1);
    
    // Create separate ScrollTrigger - EXACT SAME AS ARTIST PAGE
    ScrollTrigger.create({
      trigger: item,
      start: 'top 60%',
      once: true,
      markers: false,
      onEnter: () => {
        console.log('✅ Zig item', index + 1, 'entering viewport - animating');
        
        // EXACT SAME AS ARTIST PAGE - fromTo with explicit FROM and TO
        gsap.fromTo(item, 
          { opacity: 0, y: 100 }, // FROM: below and invisible
          { 
            opacity: 1,
            y: 0, // TO: natural CSS position
            duration: 2.0,
            ease: 'power2.out',
            onComplete: () => console.log('  ✓ Animation completed for zig item', index + 1)
          }
        );
      }
    });
  });

  // Wait for images to load before refreshing ScrollTrigger
  const images = document.querySelectorAll('.current_img');
  console.log('🖼️ Waiting for', images.length, 'images to load...');
  
  let loadedCount = 0;
  const checkImagesLoaded = () => {
    loadedCount++;
    console.log('  Image loaded:', loadedCount, '/', images.length);
    
    if (loadedCount >= images.length) {
      console.log('✅ All images loaded, refreshing ScrollTrigger...');
      ScrollTrigger.refresh();
    }
  };
  
  if (images.length === 0) {
    setTimeout(() => ScrollTrigger.refresh(), 100);
  } else {
    images.forEach(img => {
      if (img.complete) {
        checkImagesLoaded();
      } else {
        img.addEventListener('load', checkImagesLoaded);
        img.addEventListener('error', checkImagesLoaded);
      }
    });
    
    // Fallback: refresh after 2 seconds regardless
    setTimeout(() => {
      console.log('⏱️ Timeout reached, forcing ScrollTrigger refresh...');
      ScrollTrigger.refresh();
    }, 2000);
  }
}

/* ───────────────────────────────────────────────────────────────────────────
   initLogoDrawAnimation() - SVG stroke draw animation for logo
   ─────────────────────────────────────────────────────────────────────────── 
   Animates SVG logo letters with stroke drawing effect on page load.
   Each letter is drawn in sequence with stagger. Runs on home-zig page.
   ─────────────────────────────────────────────────────────────────────────── */

function initLogoDrawAnimation() {
  // Check if DrawSVG plugin is available
  if (typeof DrawSVGPlugin === 'undefined') {
    console.log('⚠️ DrawSVG plugin not loaded - using fallback animation');
    return;
  }
  
  const svgLetters = document.querySelectorAll('.svg-letter');
  const trigger = document.querySelector('.current_wrap');
  
  if (!svgLetters.length) {
    console.log('⚠️ No SVG letters found for draw animation');
    return;
  }
  
  if (!trigger) {
    console.log('⚠️ No .current_wrap trigger found for draw animation');
    return;
  }
  
  console.log('🎨 Setting up DrawSVG animation for', svgLetters.length, 'letters with ScrollTrigger');
  
  // Register plugins
  gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger);
  
  // Store original fill values and hide fill initially
  const paths = document.querySelectorAll('.svg-letter path');
  paths.forEach(path => {
    // Store original fill
    path.dataset.originalFill = path.getAttribute('fill') || 'currentColor';
    // Hide fill during drawing
    path.style.fill = 'none';
  });
  
  // Set all paths to 0% drawn initially
  gsap.set('.svg-letter path', { drawSVG: '0%' });
  
  // Create ScrollTrigger animation
  gsap.to('.svg-letter path', {
    drawSVG: '100%',
    duration: 1.2,
    stagger: 0.08, // Stagger between each path
    ease: 'power2.inOut',
    scrollTrigger: {
      trigger: '.current_wrap',
      start: 'top 80%', // Start when top of .current_wrap hits 80% of viewport
      once: true, // Only play once
      onEnter: () => console.log('🎨 Logo draw animation triggered')
    },
    onComplete: () => {
      // Restore fill after drawing completes
      paths.forEach(path => {
        path.style.fill = path.dataset.originalFill;
      });
      console.log('✅ Logo draw animation complete');
    }
  });
}

/* ───────────────────────────────────────────────────────────────────────────
   initZigPageLayout() - Random alignment and featured image marking
   ─────────────────────────────────────────────────────────────────────────── 
   For "Home zig" page:
   - Adds .is-main class to .current_img elements that are marked as "featured" in CMS
   - Randomly assigns alignment classes to .current_grid_item:
     u-vflex-left-top | u-vflex-center-top | u-vflex-right-top
   - Ensures no two consecutive items have the same alignment
   ─────────────────────────────────────────────────────────────────────────── */

function initZigPageLayout() {
  const gridItems = document.querySelectorAll('.current_grid_item');
  if (!gridItems.length) return;

  const alignmentChoices = ['u-vflex-left-top', 'u-vflex-center-top', 'u-vflex-right-top'];
  let previousAlignment = null;

  gridItems.forEach(function(item, index) {
    // Remove any existing alignment classes
    item.classList.remove('u-vflex-left-top', 'u-vflex-center-top', 'u-vflex-right-top');
    
    // Pick a random alignment that differs from the previous one
    let pick;
    let attempts = 0;
    do {
      pick = alignmentChoices[Math.floor(Math.random() * alignmentChoices.length)];
      attempts++;
    } while (pick === previousAlignment && attempts < 10);
    
    item.classList.add(pick);
    previousAlignment = pick;
    
    // Check if this item has a featured image and add .is-main class
    const currentImg = item.querySelector('.current_img');
    if (currentImg) {
      // Check if item has featured attribute (bound to Item Style field)
      const isFeatured = item.getAttribute('featured') === 'featured';
      
      if (isFeatured) {
        currentImg.classList.add('is-main');
        console.log('  ✨ Added .is-main to featured image in item', index);
      }
    }
  });
  
  console.log('✅ Zig page layout randomized:', gridItems.length, 'items');
}

/* ───────────────────────────────────────────────────────────────────────────
   initRandomizeArtistWorksAlignment() - Random left/center/right alignment
   ─────────────────────────────────────────────────────────────────────────── 
   Assigns one of three classes to each .artist_works_item except the first:
   .align-left | .align-center | .align-right. Runs on artist pages and after
   Barba transitions via initPageScripts().
   ─────────────────────────────────────────────────────────────────────────── */

function initRandomizeArtistWorksAlignment() {
  const items = document.querySelectorAll('.artist_works_layout .artist_works_item');
  if (!items.length) return;

  const choices = ['align-left', 'align-center', 'align-right'];
  let previousAlignment = null;

  items.forEach(function(item, index) {
    // Skip first item: remains 100% width per earlier rule
    if (index === 0) return;

    item.classList.remove('align-left', 'align-center', 'align-right');
    
    // Pick a random alignment that differs from the previous one
    let pick;
    let attempts = 0;
    do {
      pick = choices[Math.floor(Math.random() * choices.length)];
      attempts++;
    } while (pick === previousAlignment && attempts < 10);
    
    item.classList.add(pick);
    previousAlignment = pick;
  });
}

/* ───────────────────────────────────────────────────────────────────────────
   initArtistWorksScrollAnimation() - ScrollTrigger fade-in/move-up
   ─────────────────────────────────────────────────────────────────────────── 
   Animates .artist_works_item elements with fade-in and upward movement when
   scrolled into view. Runs on artist pages and reinitializes after Barba.
   ─────────────────────────────────────────────────────────────────────────── */

function initArtistWorksScrollAnimation() {
  const items = document.querySelectorAll('.artist_works_layout .artist_works_item');
  if (!items.length) return;

  console.log('🎬 Setting up scroll animations for', items.length, 'items');

  items.forEach(function(item, index) {
    console.log('  ➜ Creating ScrollTrigger for item', index + 1);
    
    // Create separate ScrollTrigger
    const trigger = ScrollTrigger.create({
      trigger: item,
      start: 'top 85%',
      once: true,
      markers: false,
      onEnter: () => {
        console.log('✅ Item', index + 1, 'entering viewport - animating');
        
        // Animate FROM below TO natural position
        const animation = gsap.fromTo(item, 
          { opacity: 0, y: 50 },
          { 
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power1.out',
            onStart: () => console.log('  🎬 Animation started for item', index + 1),
            onComplete: () => console.log('  ✓ Animation completed for item', index + 1)
          }
        );
        
        console.log('  Animation object:', animation);
      }
    });
    console.log('  ✓ ScrollTrigger created for item', index + 1, trigger);
  });

  // Wait for images to load before refreshing ScrollTrigger
  const images = document.querySelectorAll('.artist_works_layout .artist_works_img');
  console.log('🖼️ Waiting for', images.length, 'images to load...');
  
  let loadedCount = 0;
  const checkImagesLoaded = () => {
    loadedCount++;
    console.log('  Image loaded:', loadedCount, '/', images.length);
    
    if (loadedCount >= images.length) {
      console.log('✅ All images loaded, refreshing ScrollTrigger...');
      ScrollTrigger.refresh();
      
      const allTriggers = ScrollTrigger.getAll();
      console.log('🔄 ScrollTrigger refreshed');
      console.log('📊 Total items:', items.length);
      console.log('📊 Total ScrollTriggers created:', allTriggers.length);
      
      const artistWorksTriggers = allTriggers.filter(t => 
        t.trigger && t.trigger.classList && t.trigger.classList.contains('artist_works_item')
      );
      console.log('📊 Artist works triggers:', artistWorksTriggers.length);
      
      artistWorksTriggers.forEach((trigger, i) => {
        console.log(`  Trigger ${i + 1}:`, trigger.trigger, 'start:', trigger.start, 'enabled:', trigger.enabled);
      });
    }
  };
  
  if (images.length === 0) {
    // No images, just refresh normally
    setTimeout(() => ScrollTrigger.refresh(), 100);
  } else {
    images.forEach(img => {
      if (img.complete) {
        checkImagesLoaded();
      } else {
        img.addEventListener('load', checkImagesLoaded);
        img.addEventListener('error', checkImagesLoaded); // Count errors too
      }
    });
    
    // Fallback: refresh after 2 seconds regardless
    setTimeout(() => {
      console.log('⏱️ Timeout reached, forcing ScrollTrigger refresh...');
      ScrollTrigger.refresh();
    }, 2000);
  }
}


/* Headroom Navigation - Global (home, exhibitions, and others) */
/* ═══════════════════════════════════════════════════════════════════════════
   4. GLOBAL SCRIPTS (Run on all pages)
   ═══════════════════════════════════════════════════════════════════════════ */

/* ───────────────────────────────────────────────────────────────────────────
   initBackButton() - Back Navigation Handler
   ─────────────────────────────────────────────────────────────────────────── 
   Uses event delegation to handle back button clicks (nav_back_link, is-back).
   Persists across Barba transitions.
   ─────────────────────────────────────────────────────────────────────────── */

function initBackButton() {
  // Use event delegation so it works after Barba transitions
  // Remove old listener first
  if (window.backButtonHandler) {
    document.removeEventListener('click', window.backButtonHandler);
  }
  
  window.backButtonHandler = function(e) {
    // Check if clicked element or its parent is a back button
    const target = e.target.closest('.nav_back_link, .nav_menu_item.is-back');
    if (target) {
      e.preventDefault();
      window.history.back();
    }
  };
  
  document.addEventListener('click', window.backButtonHandler);
}

function initHeadroom() {
  if (typeof Headroom === 'undefined') {
    console.log('⚠️ Headroom library not loaded');
    return;
  }
  
  var nav = document.getElementById("nav");
  if (!nav) {
    console.log('⚠️ Nav element not found');
    return;
  }
  
  // Check if we're on homepage, exhibitions list, or imprint - if so, skip Headroom
  var pathname = window.location.pathname;
  var isHomePage = pathname === '/' || pathname === '';
  var isOldHomePage = pathname === '/old-home' || pathname === '/old-home/';
  var isExhibitionsList = pathname === '/exhibitions' || pathname === '/exhibitions/';
  var isImprintPage = pathname === '/imprint' || pathname === '/imprint/';
  
  if (isHomePage || isOldHomePage || isExhibitionsList || isImprintPage) {
    console.log('⏭️ Skipping Headroom on ' + (isHomePage ? 'homepage' : isOldHomePage ? 'old-home' : isExhibitionsList ? 'exhibitions list' : 'imprint'));
    // Clean up any existing instance
    if (nav.headroomInstance) {
      try {
        nav.headroomInstance.destroy();
      } catch(e) {
        console.log('⚠️ Error destroying Headroom:', e);
      }
      nav.headroomInstance = null;
      nav.dataset.headroomInit = '0';
    }
    return;
  }
  
  // Destroy existing Headroom instance if it exists
  if (nav.headroomInstance) {
    console.log('🔄 Destroying existing Headroom instance');
    try {
      nav.headroomInstance.destroy();
    } catch(e) {
      console.log('⚠️ Error destroying Headroom:', e);
    }
    nav.headroomInstance = null;
    nav.dataset.headroomInit = '0';
  }
  
  // Skip if already initialized (but no instance stored)
  if (nav.dataset.headroomInit === '1') {
    console.log('⚠️ Headroom already marked as initialized but no instance found');
    return;
  }
  
  console.log('✅ Initializing Headroom...');

    var isExhibitionDetail = pathname.includes('/exhibitions/') && pathname !== '/exhibitions' && pathname !== '/exhibitions/';
    var isArtistDetail = pathname.includes('/artists/') && pathname !== '/artists' && pathname !== '/artists/';
    var shouldAutoHide = isExhibitionDetail;
    
    var headroomInstance;
    var settings = {
      offset: (isExhibitionDetail || isArtistDetail) ? 100 : 120, // Lower offset = more reactive
      tolerance: (isExhibitionDetail || isArtistDetail) ? { up: 60, down: 20 } : { up: 40, down: 20 }, // up: higher = less sensitive to scroll up
      classes: {
        pinned: "nav-pinned",
        unpinned: "nav-unpinned"
      }
      // Auto-hide removed - nav will stay visible when you scroll up
    };

  var headroomInstance = new Headroom(nav, settings);
  headroomInstance.init();
  nav.headroomInstance = headroomInstance; // Store reference for cleanup
  nav.dataset.headroomInit = '1';

  window.addEventListener('resize', function() {
    if (headroomInstance) headroomInstance.update();
  });
}

// Note: initHeadroom() is now called from initPageScripts() instead of DOMContentLoaded
// to work properly with Barba.js transitions

/* ========================================
   PAGE INITIALIZATION FUNCTIONS
   ======================================== */

// Master function to initialize all page-specific scripts
/* ═══════════════════════════════════════════════════════════════════════════
   7. INITIALIZATION - MAIN ORCHESTRATOR
   ═══════════════════════════════════════════════════════════════════════════ */

/* ───────────────────────────────────────────────────────────────────────────
   initPageScripts() - Main Orchestrator
   ─────────────────────────────────────────────────────────────────────────── 
   Called on initial load AND after every Barba transition.
   Detects current page type and initializes appropriate scripts.
   ─────────────────────────────────────────────────────────────────────────── */

function initPageScripts() {
  console.log('🔄 Initializing page scripts...');
  
  const pathname = window.location.pathname;
  const isArtistPage = pathname.includes('/artists/') && !pathname.endsWith('/artists');
  const isArtistsList = pathname === '/artists' || pathname === '/artists/';
  const isExhibitionDetail = pathname.includes('/exhibitions/') && !pathname.endsWith('/exhibitions');
  const isExhibitionsList = pathname === '/exhibitions' || pathname === '/exhibitions/';
  const isOldHome = pathname === '/old-home' || pathname === '/old-home/';
  const isNewsPage = pathname === '/news' || pathname === '/news/';
  const isHomeBottom = pathname === '/home-bottom' || pathname === '/home-bottom/';
  const isHomeZig = pathname === '/home-zig' || pathname === '/home-zig/';
  const isHome = pathname === '/' || pathname === '';
  
  // Global scripts (run on all pages)
  initBackButton(); // Back navigation
  initHeadroom();
  initThemeToggle();
  initYearFormatter();
  initCVCleanup();
  initExhibitionSorting();
  initNewsHoverThumbnails(); // News items can appear on multiple pages
  
  // Page-specific scripts
  if (isArtistsList || isExhibitionsList || isArtistPage || isNewsPage || isOldHome || isHome || isHomeBottom) {
    initStaggerAnimation(); // Stagger for exhibitions, artists, news, home, and home-bottom!
    setTimeout(() => initExhibitionHoverThumbnails(), 300); // Wait for stagger
  }
  
  if (isArtistPage) {
    // Skip page_main fade-in to avoid conflict with scroll animations
    
    initSwiper();
    initCVReadMore();
    initSortExhibitionsByYear();
    initRandomizeArtistWorksAlignment();
    initArtistWorksScrollAnimation();
  }
  
  if (isExhibitionDetail) {
    // Fade in exhibition detail page - animate .show_wrap children instead of .page_main
    // (because .work_list_thumb_wrap has position:fixed and breaks with parent transform)
    const pageMain = document.querySelector('.page_main');
    const showWrap = document.querySelector('.show_wrap');
    
    // IMMEDIATELY hide work list and press sections to prevent flicker
    const workListWrap = document.querySelector('.work_list_wrap');
    const pressWrap = document.querySelector('.press_wrap');
    if (workListWrap) gsap.set(workListWrap, { opacity: 0 });
    if (pressWrap) gsap.set(pressWrap, { opacity: 0 });
    
    if (pageMain && getComputedStyle(pageMain).opacity === '0') {
      // Just fade in page_main without transform
      gsap.to(pageMain, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
    
    // Animate show_wrap items with upward movement
    if (showWrap) {
      const showItems = showWrap.querySelectorAll('.show_item');
      if (showItems.length > 0) {
        const images = showWrap.querySelectorAll('img.show_img');
        let hasShown = false;
        
        const showItems_anim = () => {
          if (hasShown) return;
          hasShown = true;
          gsap.from(showItems, {
            opacity: 0,
            y: 50,
            duration: 1.2,
            delay: 0.2,
            stagger: 0.05,
            ease: 'power1.out',
            onComplete: () => {
              // After show_wrap animation, fade in work list and press sections
              if (workListWrap) {
                gsap.to(workListWrap, {
                  opacity: 1,
                  duration: 0.6,
                  ease: 'power2.out'
                });
              }
              if (pressWrap) {
                gsap.to(pressWrap, {
                  opacity: 1,
                  duration: 0.6,
                  delay: 0.2,
                  ease: 'power2.out'
                });
              }
            }
          });
        };
        
        // Show after first image loads or timeout
        if (images.length > 0) {
          const firstImage = images[0];
          if (firstImage.complete) {
            requestAnimationFrame(showItems_anim);
          } else {
            firstImage.addEventListener('load', showItems_anim);
            setTimeout(showItems_anim, 400);
          }
        } else {
          requestAnimationFrame(showItems_anim);
        }
      }
    }
    
    initExhibitionDetailScripts();
    initMeasurementDimensions(); // Format artwork dimensions
  }
  
  if (isOldHome) {
    initOldHomePageScripts();
  }
  
  if (isHome) {
    initHomePageScripts(); // Logo first, then image fade-in
  }
  
  if (isHomeBottom) {
    // Home image fade-in animation
    const homeImg = document.querySelector(".home_img");
    if (homeImg) {
      gsap.fromTo(".home_img", 
        { opacity: 0, scale: 1.02 },
        { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" }
      );
    }
    
    initLogoScrollAnimation(); // Logo animation on scroll for home bottom page
  }
  
  if (isHomeZig) {
    // Skip initial page intro animation - use scroll triggers instead
    
    initLogoDrawAnimation(); // SVG draw animation on page load
    initZigPageLayout(); // Random alignment and featured image marking
    initZigScrollAnimation(); // Individual ScrollTrigger for each item
  }
  
  console.log('✅ Page scripts initialized');
}

// Placeholder functions (will be defined or already exist below)
// initStaggerAnimation() - already defined below (line ~928)
// initExhibitionHoverThumbnails() - already defined below (line ~1170)

/* ───────────────────────────────────────────────────────────────────────────
   initThemeToggle() - Dark/Light Mode Toggle
   ─────────────────────────────────────────────────────────────────────────── 
   Manages theme switching between dark and light modes.
   - Reads theme from localStorage (defaults to "light")
   - Applies theme to document.documentElement, .page_wrap elements and body
   - Uses event delegation for #Toggle button
   - Persists theme choice in localStorage
   ─────────────────────────────────────────────────────────────────────────── */

function initThemeToggle() {
  const pageWrapElements = document.querySelectorAll(".page_wrap");
  
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    pageWrapElements.forEach(el => el.setAttribute("data-theme", theme));
    document.body.setAttribute("data-theme", theme);
  }
  
  const storedTheme = localStorage.getItem("theme") || "light";
  applyTheme(storedTheme);
  
  // Event delegation - remove old listener
  if (window.themeToggleHandler) {
    document.removeEventListener('click', window.themeToggleHandler);
  }
  
  window.themeToggleHandler = function(e) {
    if (e.target.closest('#Toggle')) {
      const newTheme = localStorage.getItem("theme") === "dark" ? "light" : "dark";
      localStorage.setItem("theme", newTheme);
      applyTheme(newTheme);
    }
  };
  
  document.addEventListener('click', window.themeToggleHandler);
}

/* ───────────────────────────────────────────────────────────────────────────
   initYearFormatter() - Date Formatting & Duplicate Year Hiding
   ─────────────────────────────────────────────────────────────────────────── 
   Formats exhibition dates and hides consecutive duplicate years.
   - Converts DD.MM.YY dates to YYYY format
   - Hides consecutive repeating years (desktop only) via opacity: 0
   - Shows all years on mobile/tablet (<= 1024px)
   - Handles both .g_exhibition_item .g_date and .cv_entry .g_date
   - Re-runs on window resize
   ─────────────────────────────────────────────────────────────────────────── */

function initYearFormatter() {
  // Year formatting logic - runs on page load
  // Apply immediately (pre-animation) to avoid flicker
  requestAnimationFrame(function() {
    const exhibitionDates = document.querySelectorAll('.g_exhibition_item .g_date');
    const cvDates = document.querySelectorAll('.cv_entry .g_date');

    function updateDateDisplay() {
      const isTabletOrSmaller = window.innerWidth <= 1024;
      let previousExhibitionYear = null;
      
      exhibitionDates.forEach(function(dateElement) {
        const dateText = dateElement.textContent.trim();
        const dateParts = dateText.split('.');
        let year = dateParts[2];

        if (year && year.length === 2) {
          year = parseInt(year, 10) < 50 ? '20' + year : '19' + year;
          dateElement.textContent = year;
        } else if (!year) {
          year = dateText;
        }

        if (isTabletOrSmaller) {
          dateElement.style.opacity = '1';
        } else {
          if (year === previousExhibitionYear) {
            dateElement.style.opacity = '0';
          } else {
            dateElement.style.opacity = '1';
            previousExhibitionYear = year;
          }
        }
      });

      let previousCVYear = null;
      cvDates.forEach(function(dateElement) {
        const year = dateElement.textContent.trim();
        if (isTabletOrSmaller) {
          dateElement.style.opacity = '1';
        } else {
          if (year === previousCVYear) {
            dateElement.style.opacity = '0';
          } else {
            dateElement.style.opacity = '1';
            previousCVYear = year;
          }
        }
      });
    }

    updateDateDisplay();
    window.addEventListener('resize', updateDateDisplay);
  });
}

/* ───────────────────────────────────────────────────────────────────────────
   initCVCleanup() - CV Paragraph Splitting & Year Wrapping
   ─────────────────────────────────────────────────────────────────────────── 
   Processes CV entries from Sanity CMS block content.
   - Removes all <em> and <i> tags (strips italics)
   - Splits multi-entry paragraphs separated by <br> into individual <p> tags
   - Wraps years (YYYY) at start of lines with <span class="g_date">
   - Creates proper paragraph structure for flex layout alignment
   ─────────────────────────────────────────────────────────────────────────── */

function initCVCleanup() {
  const cvContainer = document.querySelector('.cv_entry');
  if (!cvContainer) return;
  
  const paragraphs = cvContainer.querySelectorAll('p');
  paragraphs.forEach(function(entry) {
    if (entry.querySelector('.g_date')) return;
    
    let html = entry.innerHTML;
    html = html.replace(/<em>/gi, '').replace(/<\/em>/gi, '');
    html = html.replace(/<i>/gi, '').replace(/<\/i>/gi, '');
    
    if (html.includes('<br>')) {
      const lines = html.split(/<br\s*\/?>/i).filter(line => line.trim() !== '');
      if (lines.length > 1) {
        const fragment = document.createDocumentFragment();
        lines.forEach(function(line) {
          const newP = document.createElement('p');
          newP.className = entry.className;
          const trimmed = line.trim();
          if (/^\d{4}/.test(trimmed)) {
            line = line.replace(/^(\s*)(\d{4})(\s*)/, '$1<span class="g_date">$2</span>$3');
          }
          newP.innerHTML = line;
          fragment.appendChild(newP);
        });
        entry.parentNode.replaceChild(fragment, entry);
      } else {
        const trimmed = html.trim();
        if (/^\d{4}/.test(trimmed)) {
          html = html.replace(/^(\s*)(\d{4})(\s*)/, '$1<span class="g_date">$2</span>$3');
        }
        entry.innerHTML = html;
      }
    } else {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      const textContent = tempDiv.textContent || tempDiv.innerText;
      const trimmed = textContent.trim();
      if (/^\d{4}/.test(trimmed)) {
        html = html.replace(/^(\s*)(\d{4})(\s*)/, '$1<span class="g_date">$2</span>$3');
      }
      entry.innerHTML = html;
    }
  });
}

/* ───────────────────────────────────────────────────────────────────────────
   initExhibitionSorting() - Artist/Year Sort Toggle (Exhibition Lists)
   ─────────────────────────────────────────────────────────────────────────── 
   Enables sorting of exhibition list by artist name or start date.
   - Toggle buttons: #Artist and #Year
   - Sorts .g_exhibitions_collection children
   - Reads data-artist and data-start-date attributes
   - Toggles between ascending/descending on each click
   - Uses event delegation for Barba compatibility
   ─────────────────────────────────────────────────────────────────────────── */

function initExhibitionSorting() {
  let sortAscArtist = true;
  let sortAscStartDate = true;

  function sortItems(attribute, sortAsc) {
    const container = document.querySelector('.g_exhibitions_collection');
    if (!container) return;
    
    const items = Array.from(container.children);
    items.sort(function(a, b) {
      let aVal = a.getAttribute('data-' + attribute);
      let bVal = b.getAttribute('data-' + attribute);
      
      if (attribute === 'start-date') {
        let aTime = new Date(aVal).getTime();
        let bTime = new Date(bVal).getTime();
        if (isNaN(aTime) || isNaN(bTime)) return 0;
        return sortAsc ? aTime - bTime : bTime - aTime;
      }
      return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
    items.forEach(item => container.appendChild(item));
  }

  // Event delegation - remove old listener
  if (window.exhibitionSortHandler) {
    document.removeEventListener('click', window.exhibitionSortHandler);
  }
  
  window.exhibitionSortHandler = function(e) {
    const artistBtn = e.target.closest('#Artist');
    const yearBtn = e.target.closest('#Year');
    
    if (artistBtn) {
      sortItems("artist", sortAscArtist);
      sortAscArtist = !sortAscArtist;
    } else if (yearBtn) {
      sortItems("start-date", sortAscStartDate);
      sortAscStartDate = !sortAscStartDate;
    }
  };
  
  document.addEventListener('click', window.exhibitionSortHandler);
}


/* ═══════════════════════════════════════════════════════════════════════════
   5. PAGE-SPECIFIC SCRIPTS
   ═══════════════════════════════════════════════════════════════════════════
   
   Functions that run only on specific page types (artists, exhibitions, home).
   Called conditionally by initPageScripts() based on current URL.
   
   ═══════════════════════════════════════════════════════════════════════════ */

/* ───────────────────────────────────────────────────────────────────────────
   initStaggerAnimation() - Exhibition/Artist/News List Item Reveals
   ─────────────────────────────────────────────────────────────────────────── 
   Animates list items with staggered fade-up on page load.
   - .g_exhibition_item_inner: artist lists, exhibition lists, artist detail pages
   - .news_item_wrap: news page, homepage news sections
   Runs immediately after page transition.
   ─────────────────────────────────────────────────────────────────────────── */

function initStaggerAnimation() {
  const exhibitionItems = document.querySelectorAll('.g_exhibition_item_inner');
  const newsItems = document.querySelectorAll('.news_item_wrap');
  
  if (exhibitionItems.length) {
    document.body.classList.add('animations-ready');
    gsap.to('.g_exhibition_item_inner', {
      opacity: 1,
      y: 0,
      stagger: 0.02, // Fast stagger
      duration: 0.2, // Quick duration
      ease: 'power1.out' // Snappy ease
    });
  }
  
  if (newsItems.length) {
    gsap.to('.news_item_wrap', {
      opacity: 1,
      y: 0,
      stagger: 0.02, // Fast stagger (same as exhibitions)
      duration: 0.2, // Quick duration (same as exhibitions)
      ease: 'power1.out' // Snappy ease (same as exhibitions)
    });
  }
}

function initSwiper() {
  // Exit early if not on artist page
  const pathname = window.location.pathname;
  if (!pathname.includes('/artists/') || pathname === '/artists' || pathname === '/artists/') {
    console.log('Not on artist detail page, skipping Swiper');
    return;
  }
  
  if (typeof Swiper === 'undefined') {
    console.log('Swiper not available');
    return;
  }
  
  // Use longer delay to ensure DOM and Swiper are fully ready
  setTimeout(function() {
    function numberWithZero(num) {
      return num < 10 ? "0" + num : num;
    }

    // Query elements - match working script selectors
    const sliderCaption = document.querySelector('.slider_caption');
    const swiperNumberCurrent = document.querySelector('.swiper-number-current');
    const swiperNumberTotal = document.querySelector('.swiper-number-total');
    const sliderGallery = document.querySelector('.slider-gallery_component');
    const swiperElement = sliderGallery ? sliderGallery.querySelector('.swiper.is-slider-bg') : null;

    console.log('Looking for slider elements:', {
      gallery: sliderGallery ? 'found' : 'not found',
      swiper: swiperElement ? 'found' : 'not found',
      caption: sliderCaption ? 'found' : 'not found',
      numberCurrent: swiperNumberCurrent ? 'found' : 'not found',
      numberTotal: swiperNumberTotal ? 'found' : 'not found',
      existingInstance: swiperElement && swiperElement.swiper ? 'yes' : 'no'
    });

    if (!sliderGallery || !swiperElement) {
      console.log('Slider gallery or swiper element not found');
      return;
    }
    
    // CRITICAL: Completely destroy and cleanup existing Swiper instances
    if (window.artistSwiper) {
      console.log('Destroying existing global Swiper instance');
      try {
        window.artistSwiper.destroy(true, true);
        delete window.artistSwiper;
      } catch (e) {
        console.error('Error destroying global Swiper:', e);
      }
    }
    
    if (swiperElement.swiper) {
      console.log('Destroying existing element Swiper instance');
      try {
        swiperElement.swiper.destroy(true, true);
        delete swiperElement.swiper;
      } catch (e) {
        console.error('Error destroying element Swiper:', e);
      }
    }

    // Calculate total slides
    const totalSlides = swiperElement.querySelectorAll('.swiper-slide.is-slider-bg').length;
    if (swiperNumberTotal) {
      swiperNumberTotal.textContent = numberWithZero(totalSlides);
    }

    console.log('Creating new Swiper instance');
    
    // Store in window to prevent duplicates across Barba transitions
    const bgSwiper = window.artistSwiper = new Swiper(swiperElement, {
      slidesPerView: "auto",
      speed: 400,
      effect: "fade",
      allowTouchMove: true,
      loop: true,
      loopedSlides: 3,
      centeredSlides: true,
      preventClicks: false,
      preventClicksPropagation: false,
      slideActiveClass: "is-active",
      slideDuplicateActiveClass: "is-active",
      mousewheel: {
        forceToAxis: true,
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      navigation: {
        nextEl: sliderGallery.querySelector('.swiper-next'),
        prevEl: sliderGallery.querySelector('.swiper-prev')
      }
      // Autoplay removed - was causing errors
    });

    function updateCaption() {
      const activeSlide = bgSwiper.slides[bgSwiper.realIndex];
      const imgElement = activeSlide ? activeSlide.querySelector('.swiper_img') : null;
      const imgAltText = imgElement ? imgElement.getAttribute("alt") : '';
      
      if (sliderCaption && imgAltText) {
        // Replace [text] with italic spans
        const formattedCaption = imgAltText.replace(/\[(.*?)\]/g, '<span class="g-italic">$1</span>');
        sliderCaption.innerHTML = formattedCaption;
      } else if (sliderCaption) {
        sliderCaption.textContent = '';
      }
    }

    // Wait a moment before attaching event handlers to ensure Swiper is fully ready
    setTimeout(function() {
      // Click handler for navigation
      const swiperClickArea = sliderGallery.querySelector('.swiper.is-slider-bg');
      if (swiperClickArea) {
        swiperClickArea.onclick = function(e) {
          const rect = this.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const containerWidth = rect.width;
          
          if (clickX < containerWidth / 2) {
            bgSwiper.slidePrev();
          } else {
            bgSwiper.slideNext();
          }
        };
      }

      bgSwiper.on("slideChange", function () {
        const slideNumber = numberWithZero(bgSwiper.realIndex + 1);
        if (swiperNumberCurrent) {
          swiperNumberCurrent.textContent = slideNumber;
        }
        updateCaption();
      });

      updateCaption();
      console.log('✅ Swiper fully initialized and ready for interaction');
    }, 100);
    
    console.log('✅ Swiper instance created with', totalSlides, 'slides');
  }, 500); // Longer delay for Swiper to be fully ready
}

/* ───────────────────────────────────────────────────────────────────────────
   initCVReadMore() - CV Expand/Collapse Toggle (Artist Detail)
   ─────────────────────────────────────────────────────────────────────────── 
   Expands/collapses CV content with Read More/Less button.
   - Toggles .cv_entry_wrap maxHeight between 50vh and full height
   - Shows/hides .cv_fade element (gradient overlay)
   - Updates button text between "Read More" and "Read Less"
   - Uses event delegation on .cv_read_cta
   ─────────────────────────────────────────────────────────────────────────── */

function initCVReadMore() {
  const cvEntryWrap = document.querySelector('.cv_entry_wrap');
  const cvEntry = document.querySelector('.cv_entry');
  const cvFade = document.querySelector('.cv_fade');
  
  if (!cvEntryWrap || !cvEntry || !cvFade) return;
  
  let isExpanded = false;
  
  // Event delegation - remove old listener
  if (window.cvReadMoreHandler) {
    document.removeEventListener('click', window.cvReadMoreHandler);
  }
  
  window.cvReadMoreHandler = function(e) {
    const readCTA = e.target.closest('.cv_read_cta');
    if (readCTA) {
      isExpanded = !isExpanded;
      const fullHeight = cvEntry.scrollHeight + "px";
      
      if (isExpanded) {
        gsap.to(cvEntryWrap, { maxHeight: fullHeight, duration: 0.8, ease: "power2.inOut" });
        cvFade.style.display = 'none';
        readCTA.textContent = 'Read Less';
        cvEntryWrap.classList.add('expanded');
      } else {
        gsap.to(cvEntryWrap, { maxHeight: '50vh', duration: 0.8, ease: "power2.inOut" });
        cvFade.style.display = 'block';
        readCTA.textContent = 'Read More';
        cvEntryWrap.classList.remove('expanded');
      }
    }
  };
  
  document.addEventListener('click', window.cvReadMoreHandler);
}

/* ───────────────────────────────────────────────────────────────────────────
   initSortExhibitionsByYear() - Auto-Sort Exhibitions by Year (Artist Detail)
   ─────────────────────────────────────────────────────────────────────────── 
   Automatically sorts artist's exhibition list by year (newest first).
   - Runs once on page load for artist detail pages
   - Reads [data-year] attribute from .w-dyn-item elements
   - Sorts descending (newest to oldest)
   - Re-appends items in sorted order
   ─────────────────────────────────────────────────────────────────────────── */

function initSortExhibitionsByYear() {
  const list = document.querySelector('.g_exhibitions_collection');
  if (!list) return;
  
  const items = Array.from(list.querySelectorAll('.w-dyn-item'));
  items.sort((a, b) => {
    const aYear = parseInt(a.querySelector('[data-year]')?.dataset.year || '0');
    const bYear = parseInt(b.querySelector('[data-year]')?.dataset.year || '0');
    return bYear - aYear; // Descending
  });
  items.forEach(it => list.appendChild(it));
}

/* ───────────────────────────────────────────────────────────────────────────
   initExhibitionDetailScripts() - Exhibition Detail Page Interactions
   ─────────────────────────────────────────────────────────────────────────── 
   Handles all exhibition detail page functionality:
   - Grid/Fullscreen toggle (#grid-toggle button)
   - Image click navigation in grid view
   - Work list hover thumbnails (.work_list_thumb_wrap)
   - Work modal system (.works_modal)
   
   Uses event delegation for Barba compatibility.
   ─────────────────────────────────────────────────────────────────────────── */

function initExhibitionDetailScripts() {
  console.log('Initializing exhibition detail scripts...');
  
  // 1. Three view mode toggles: Full, Medium, Grid
  const container = document.querySelector('.show_inner');
  
  if (!container) return;

  // Helper to detect current view mode
  function getCurrentViewMode() {
    if (container.classList.contains('u-grid-column-4')) return 'grid';
    const images = document.querySelectorAll('.show_img');
    const hasIsMedium = Array.from(images).some(img => img.classList.contains('is-medium'));
    return hasIsMedium ? 'medium' : 'full';
  }

  // Helper to find the currently visible item in viewport
  function getCurrentlyVisibleItem() {
    const showItems = document.querySelectorAll('.show_item');
    const viewportCenter = window.innerHeight / 2;
    
    let closestItem = null;
    let closestDistance = Infinity;
    
    showItems.forEach(item => {
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.top + (rect.height / 2);
      const distance = Math.abs(itemCenter - viewportCenter);
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestItem = item;
      }
    });
    
    return closestItem;
  }

  // View mode functions
  function showFullView(clickedItem = null, preservePosition = false) {
    console.log('Switching to Full View');
    const showItems = document.querySelectorAll('.show_item');
    const images = document.querySelectorAll('.show_img');
    
    // Store current visible item if preserving position
    const itemToScrollTo = preservePosition ? getCurrentlyVisibleItem() : clickedItem;
    
    // Pause Headroom during transition
    const nav = document.getElementById('nav');
    if (nav && nav.headroomInstance) {
      nav.headroomInstance.freeze();
    }
    
    gsap.killTweensOf(showItems);
    gsap.killTweensOf(container);
    
    gsap.to(showItems, {
      scale: 0.9,
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        // Only scroll to top if not preserving position and no clicked item
        if (!itemToScrollTo) {
          window.scrollTo(0, 0);
        }
        
        // Full: u-vflex-center-top u-gap-row-main
        container.classList.remove('u-grid-column-4');
        container.classList.add('u-vflex-center-top', 'u-gap-row-main');
        
        // Remove .is-medium from images
        images.forEach(image => {
          image.classList.remove('is-medium');
        });
        
        // Reset GSAP transforms
        gsap.set(showItems, { clearProps: "all" });
        
        // If we have an item to scroll to, scroll to it first
        if (itemToScrollTo) {
          itemToScrollTo.scrollIntoView({ behavior: 'auto', block: 'center' });
        }
        
        // Animate all items with stagger
        gsap.from(showItems, {
          opacity: 0,
          y: 50,
          duration: 1.2,
          ease: "power1.out",
          stagger: 0.05,
          onComplete: () => {
            // Resume Headroom after transition
            if (nav && nav.headroomInstance) {
              nav.headroomInstance.unfreeze();
            }
          }
        });
      }
    });
  }

  function showMediumView(preservePosition = false) {
    console.log('Switching to Medium View');
    const showItems = document.querySelectorAll('.show_item');
    const images = document.querySelectorAll('.show_img');
    
    // Store current visible item if preserving position
    const itemToScrollTo = preservePosition ? getCurrentlyVisibleItem() : null;
    
    // Pause Headroom during transition
    const nav = document.getElementById('nav');
    if (nav && nav.headroomInstance) {
      nav.headroomInstance.freeze();
    }
    
    gsap.killTweensOf(showItems);
    gsap.killTweensOf(container);
    
    gsap.to(showItems, {
      scale: 0.9,
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        // Only scroll to top if not preserving position
        if (!itemToScrollTo) {
          window.scrollTo(0, 0);
        }
        
        // Medium: u-vflex-center-top u-gap-row-main (same container as Full)
        container.classList.remove('u-grid-column-4');
        container.classList.add('u-vflex-center-top', 'u-gap-row-main');
        
        // Add .is-medium to images
        images.forEach(image => {
          image.classList.add('is-medium');
        });
        
        // Reset GSAP transforms
        gsap.set(showItems, { clearProps: "all" });
        
        // If we have an item to scroll to, scroll to it first
        if (itemToScrollTo) {
          itemToScrollTo.scrollIntoView({ behavior: 'auto', block: 'center' });
        }
        
        // Animate all items with stagger
        gsap.from(showItems, {
          opacity: 0,
          y: 50,
          duration: 1.2,
          ease: "power1.out",
          stagger: 0.05,
          onComplete: () => {
            // Resume Headroom after transition
            if (nav && nav.headroomInstance) {
              nav.headroomInstance.unfreeze();
            }
          }
        });
      }
    });
  }

  function showGridView() {
    console.log('Switching to Grid View');
    const showItems = document.querySelectorAll('.show_item');
    const images = document.querySelectorAll('.show_img');
    
    // Pause Headroom during transition
    const nav = document.getElementById('nav');
    if (nav && nav.headroomInstance) {
      nav.headroomInstance.freeze();
    }
    
    gsap.killTweensOf(showItems);
    gsap.killTweensOf(container);
    
    gsap.to(showItems, {
      scale: 0.9,
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        window.scrollTo(0, 0);
        
        // Grid: u-grid-column-4
        container.classList.remove('u-vflex-center-top', 'u-gap-row-main');
        container.classList.add('u-grid-column-4');
        
        // Remove .is-medium from images
        images.forEach(image => {
          image.classList.remove('is-medium');
        });
        
        // Reset GSAP transforms
        gsap.set(showItems, { clearProps: "all" });
        
        // Stagger back in
        gsap.from(showItems, {
          opacity: 0,
          y: 50,
          duration: 1.2,
          ease: "power1.out",
          stagger: 0.1,
          onComplete: () => {
            // Resume Headroom after transition
            if (nav && nav.headroomInstance) {
              nav.headroomInstance.unfreeze();
            }
          }
        });
      }
    });
  }

  // Helper to update active states on toggle buttons
  function updateToggleActiveStates(activeMode) {
    const fullBtn = document.querySelector('#Full');
    const mediumBtn = document.querySelector('#Medium');
    const gridBtn = document.querySelector('#Grid');
    
    // Remove active class from all buttons
    if (fullBtn) fullBtn.classList.remove('is-active');
    if (mediumBtn) mediumBtn.classList.remove('is-active');
    if (gridBtn) gridBtn.classList.remove('is-active');
    
    // Add active class to current mode
    if (activeMode === 'full' && fullBtn) fullBtn.classList.add('is-active');
    if (activeMode === 'medium' && mediumBtn) mediumBtn.classList.add('is-active');
    if (activeMode === 'grid' && gridBtn) gridBtn.classList.add('is-active');
  }
  
  // Set initial active state
  updateToggleActiveStates(getCurrentViewMode());

  // Use event delegation for toggle buttons - works after Barba transitions
  // Remove old listener first
  if (window.exhibitionDetailHandler) {
    document.removeEventListener('click', window.exhibitionDetailHandler);
  }
  
  window.exhibitionDetailHandler = function(e) {
    const currentMode = getCurrentViewMode();
    
    // Check for Full view button
    const fullBtn = e.target.closest('#Full');
    if (fullBtn) {
      console.log('Full View Button Clicked');
      // Preserve position when switching from Medium to Full
      const preservePosition = currentMode === 'medium';
      showFullView(null, preservePosition);
      updateToggleActiveStates('full');
      return;
    }
    
    // Check for Medium view button
    const mediumBtn = e.target.closest('#Medium');
    if (mediumBtn) {
      console.log('Medium View Button Clicked');
      // Preserve position when switching from Full to Medium
      const preservePosition = currentMode === 'full';
      showMediumView(preservePosition);
      updateToggleActiveStates('medium');
      return;
    }
    
    // Check for Grid view button
    const gridBtn = e.target.closest('#Grid');
    if (gridBtn) {
      console.log('Grid View Button Clicked');
      showGridView();
      updateToggleActiveStates('grid');
      return;
    }
    
    // Check for image click - toggle between views
    const clickedImage = e.target.closest('.show_img');
    if (clickedImage) {
      e.preventDefault();
      
      if (currentMode === 'grid') {
        // Grid → Full (with clicked item)
        console.log('Image clicked in grid view - switching to Full');
        const clickedItem = clickedImage.closest('.show_item');
        showFullView(clickedItem, false);
        updateToggleActiveStates('full');
      } else if (currentMode === 'medium') {
        // Medium → Full (with clicked item)
        console.log('Image clicked in medium view - switching to Full');
        const clickedItem = clickedImage.closest('.show_item');
        showFullView(clickedItem, false);
        updateToggleActiveStates('full');
      } else if (currentMode === 'full') {
        // Full → Medium (preserve position)
        console.log('Image clicked in full view - switching back to Medium');
        showMediumView(true);
        updateToggleActiveStates('medium');
      }
    }
  };
  
  document.addEventListener('click', window.exhibitionDetailHandler);

  // 2. Work list hover thumbnails - Fixed for Barba
  let lastWorkThumb = null;
  let workHandlers = window.workHandlers || [];

  function hideWorkThumbnail() {
    if (lastWorkThumb) {
      gsap.to(lastWorkThumb, { 
        opacity: 0, 
        y: 30, 
        visibility: 'hidden', 
        duration: 0.5,
        ease: "power1.out" 
      });
      lastWorkThumb = null;
    }
  }
  
  // Remove old handlers
  workHandlers.forEach(obj => {
    obj.item.removeEventListener(obj.type, obj.handler);
  });
  workHandlers = [];

  function setupWorkHoverDesktop() {
    // Re-query fresh elements from DOM
    const workItems = document.querySelectorAll('.work_list_caption_wrap');
    const workThumbs = document.querySelectorAll('.work_list_thumb_wrap');
    
    console.log('Setting up work hover for', workItems.length, 'items');
    
    // Hide all thumbnails by default
    workThumbs.forEach(thumb => {
      gsap.set(thumb, { opacity: 0, y: 50, visibility: 'hidden' });
    });

    workItems.forEach((item, index) => {
      const thumb = item.parentElement.querySelector('.work_list_thumb_wrap');
      
      if (!thumb) {
        console.warn('No thumb found for work item', index);
        return;
      }

      const hoverEnter = () => {
        console.log('🔍 Thumb element:', thumb);
        console.log('🔍 Thumb computed style:', window.getComputedStyle(thumb));
        console.log('🔍 Thumb display:', window.getComputedStyle(thumb).display);
        console.log('🔍 Thumb position:', window.getComputedStyle(thumb).position);
        
        // Kill any in-progress animations on this thumbnail to prevent stuck states
        gsap.killTweensOf(thumb);
        
        // If another thumbnail is already visible, hide it first
        if (lastWorkThumb && lastWorkThumb !== thumb) {
          gsap.killTweensOf(lastWorkThumb);
          gsap.to(lastWorkThumb, { 
            opacity: 0, 
            y: 30, 
            visibility: 'hidden', 
            duration: 0.9,
            ease: "circ.out" 
          });
        }

        // Animate the current thumbnail into view
        gsap.fromTo(thumb, 
          { opacity: 0, y: 30, visibility: 'visible' },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.9,
            ease: "circ.out" 
          }
        );

        lastWorkThumb = thumb;
      };

      const hoverLeave = () => {
        // Kill any in-progress animations before hiding
        gsap.killTweensOf(thumb);
        gsap.to(thumb, { 
          opacity: 0, 
          y: 30, 
          visibility: 'hidden', 
          duration: 0.9,
          ease: "circ.out" 
        });
        if (lastWorkThumb === thumb) {
          lastWorkThumb = null;
        }
      };

      item.addEventListener('mouseenter', hoverEnter);
      item.addEventListener('mouseleave', hoverLeave);
      workHandlers.push({ item, type: 'mouseenter', handler: hoverEnter });
      workHandlers.push({ item, type: 'mouseleave', handler: hoverLeave });
    });

    window.addEventListener('scroll', hideWorkThumbnail);
    workHandlers.push({ item: window, type: 'scroll', handler: hideWorkThumbnail });
    
    // Store globally for cleanup on next call
    window.workHandlers = workHandlers;
  }

  if (window.innerWidth > 1024) {
    setupWorkHoverDesktop();
  }

  // 3. Work list modal - use inline handler
  const workItemsForModal = document.querySelectorAll('.work_list_caption_wrap');
  workItemsForModal.forEach(item => {
    item.onclick = function() {
      const modal = item.querySelector('.works_modal');
      if (modal && modal.classList.contains('closed')) {
        document.body.style.overflow = 'hidden';
        modal.classList.remove('closed');
        modal.classList.add('open');
        gsap.fromTo(modal, 
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
        );
        
        const closeModal = function(e) {
          const modal = e.currentTarget;
          gsap.to(modal, {
            opacity: 0,
            scale: 0.8,
            duration: 0.5,
            ease: "power2.in",
            onComplete: function() {
              modal.classList.remove('open');
              modal.classList.add('closed');
              gsap.set(modal, { clearProps: "all" });
              document.body.style.overflow = '';
            }
          });
          modal.removeEventListener('click', closeModal);
        };
        
        modal.addEventListener('click', closeModal);
      }
    };
  });

  // 4. Work modal (different from work list modal) - use inline handler
  document.querySelectorAll('.works_item').forEach(item => {
    item.onclick = function () {
      const modal = item.querySelector('.works_modal');
      if (!modal || !modal.classList.contains('closed')) return;
      
      document.body.style.overflow = 'hidden';
      modal.classList.remove('closed');
      modal.classList.add('open');
      gsap.fromTo(modal, 
        { opacity: 0, scale: 0.8 }, 
        { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
      );
      
      const closeModal = function(e) {
        const modal = e.currentTarget;
        gsap.to(modal, {
          opacity: 0,
          scale: 0.8,
          duration: 0.5,
          ease: "power2.in",
          onComplete: function () {
            modal.classList.remove('open');
            modal.classList.add('closed');
            gsap.set(modal, { clearProps: 'all' });
            document.body.style.overflow = '';
          }
        });
        modal.removeEventListener('click', closeModal);
      };
      
      modal.addEventListener('click', closeModal);
    };
  });

  console.log('✅ Exhibition detail scripts initialized');
}

function initOldHomePageScripts() {
  console.log('Initializing old home page scripts...');
  
  const logoWrap = document.querySelector(".logo_wrap");
  const homeImg = document.querySelector(".home_img");
  
  // Home image fade-in (animates every time you visit homepage)
  if (homeImg) {
    gsap.fromTo(".home_img", 
      { 
        opacity: 0, 
        scale: 1.02 
      },
      { 
        opacity: 1, 
        scale: 1,
        duration: 1.2,
        ease: "power2.out"
      }
    );
  }
  
  // Logo animation (animates every time you visit homepage)
  if (logoWrap) {
    // Reset logo for animation
    logoWrap.style.display = "block";
    gsap.set(".logo_wrap", { opacity: 1 });
    
    const tl = gsap.timeline({ delay: 0.3 }); // Small delay to let image start fading in first
    tl.from(".svg-letter", {
      y: 400,
      duration: 0.7, // Longer duration for smoother feel
      opacity: 0,
      stagger: 0.04, // Less stagger = more overlap between letters
      ease: "expo.inOut"
    });
    tl.to(".logo_wrap", {
      opacity: 0,
      duration: 0.5,
      delay: 1,
      onComplete: () => {
        logoWrap.style.display = "none";
        ScrollTrigger.refresh();
      }
    });
  }
  
  // ScrollTrigger animations
  gsap.registerPlugin(ScrollTrigger);
  const scrollItems = document.querySelectorAll('.home_flex_item');
  
  if (scrollItems.length) {
    scrollItems.forEach((item) => {
      gsap.fromTo(
        item, 
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
            toggleActions: "play none none none",
          }
        }
      );
    });
  }
  
  // Home grid/flex toggle
  const homeContainer = document.querySelector('.home_inner');
  const homeToggleButton = document.querySelector('.nav_toggle');
  
  if (!homeContainer || !homeToggleButton) {
    console.log('Home toggle elements not found, skipping...');
    return;
  }
  
  const homeItems = document.querySelectorAll('.home_item');
  let isHomeGridView = false;
  
  function resetHomeTransformations() {
    homeItems.forEach(item => {
      gsap.set(item, { clearProps: "all" });
    });
  }
  
  // Helper to update home toggle active state
  function updateHomeToggleActiveState(isGrid) {
    const homeToggleButton = document.querySelector('.nav_toggle');
    if (!homeToggleButton) return;
    
    if (isGrid) {
      homeToggleButton.classList.add('is-active');
    } else {
      homeToggleButton.classList.remove('is-active');
    }
  }
  
  // Set initial active state (flex layout by default)
  updateHomeToggleActiveState(false);
  
  function showHomeGridView() {
    console.log("Switching to Home Grid View");
    
    gsap.killTweensOf(homeItems);
    gsap.killTweensOf(homeContainer);
    
    gsap.to(homeItems, {
      scale: 0.9,
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        window.scrollTo(0, 0);
        
        // Switch layout classes
        homeContainer.classList.remove('u-vflex-left-top');
        homeContainer.classList.add('u-grid-custom');
        
        // Add .no-margin to captions
        homeItems.forEach(item => {
          const captionWrap = item.querySelector('.home_caption_wrap');
          if (captionWrap) {
            captionWrap.classList.add('no-margin');
          }
        });
        
        // Animate back in
        gsap.fromTo(homeItems,
          { opacity: 0, y: 30, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.1
          }
        );
        
        isHomeGridView = true;
        updateHomeToggleActiveState(true);
      }
    });
  }
  
  function showHomeFullScreenView() {
    console.log("Switching to Home Full-Screen Flex Layout");
    
    gsap.killTweensOf(homeItems);
    gsap.killTweensOf(homeContainer);
    
    gsap.to(homeItems, {
      scale: 0.9,
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        // Switch layout classes
        homeContainer.classList.remove('u-grid-custom');
        homeContainer.classList.add('u-vflex-left-top');
        
        // Remove .no-margin from captions
        homeItems.forEach(item => {
          const captionWrap = item.querySelector('.home_caption_wrap');
          if (captionWrap) {
            captionWrap.classList.remove('no-margin');
          }
        });
        
        // Animate back in
        gsap.fromTo(homeItems,
          { opacity: 0, y: 30, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.1
          }
        );
        
        isHomeGridView = false;
        updateHomeToggleActiveState(false);
      }
    });
  }
  
  // Event delegation for toggle button
  if (window.homeToggleHandler) {
    document.removeEventListener('click', window.homeToggleHandler);
  }
  
  window.homeToggleHandler = function(e) {
    if (e.target.closest('.nav_toggle')) {
      console.log("Home Toggle Button Clicked");
      if (isHomeGridView) {
        showHomeFullScreenView();
      } else {
        showHomeGridView();
      }
    }
  };
  
  document.addEventListener('click', window.homeToggleHandler);
  
  console.log('✅ Old home page scripts initialized');
}

/* ───────────────────────────────────────────────────────────────────────────
   initHomePageScripts() - Home Page Animations
   ─────────────────────────────────────────────────────────────────────────── 
   Modified sequence: Logo animation first → Logo fade out → Image fade in
   Features: Random starting image + crossfade slideshow between featured images
   ─────────────────────────────────────────────────────────────────────────── */

function initHomePageScripts() {
  console.log('Initializing home page scripts...');
  
  const logoWrap = document.querySelector(".logo_wrap");
  const homeItems = document.querySelectorAll(".home_item");
  
  // ═══════════════════════════════════════════════════════════════════════════
  // FEATURED IMAGE SLIDESHOW - Random start + crossfade cycle
  // ═══════════════════════════════════════════════════════════════════════════
  
  let slideshowInterval = null;
  let currentSlideIndex = 0;
  const SLIDESHOW_DURATION = 6000; // 6 seconds per image
  const FADE_DURATION = 1.2; // 1.2 second crossfade
  
  // ═══════════════════════════════════════════════════════════════════════════
  // FEATURED IMAGE SLIDESHOW - Completely independent of logo animation
  // ═══════════════════════════════════════════════════════════════════════════
  
  function initFeaturedSlideshow() {
    if (homeItems.length === 0) return;
    
    // Show .home_img inside each item (CSS hides it by default with opacity: 0)
    homeItems.forEach((item) => {
      const homeImg = item.querySelector('.home_img');
      if (homeImg) {
        gsap.set(homeImg, { opacity: 1 });
      }
    });
    
    if (homeItems.length === 1) {
      // Single image - just show it
      gsap.set(homeItems[0], { opacity: 1 });
      console.log('✅ Single home image shown');
      return;
    }
    
    // Multiple images - setup slideshow
    console.log(`Found ${homeItems.length} home_items, initializing slideshow...`);
    
    // Pick random starting index
    currentSlideIndex = Math.floor(Math.random() * homeItems.length);
    console.log(`Starting slideshow at random index: ${currentSlideIndex}`);
    
    // Set all items: show random one, hide others
    homeItems.forEach((item, index) => {
      gsap.set(item, { 
        opacity: index === currentSlideIndex ? 1 : 0,
        zIndex: index === currentSlideIndex ? 2 : 1
      });
    });
    
    // Start the slideshow cycle
    slideshowInterval = setInterval(nextSlide, SLIDESHOW_DURATION);
    console.log('✅ Home featured slideshow started');
  }
  
  function nextSlide() {
    if (homeItems.length <= 1) return;
    
    const currentItem = homeItems[currentSlideIndex];
    const nextIndex = (currentSlideIndex + 1) % homeItems.length;
    const nextItem = homeItems[nextIndex];
    
    // Crossfade: fade in next, fade out current
    gsap.to(nextItem, {
      opacity: 1,
      duration: FADE_DURATION,
      ease: "power2.inOut"
    });
    
    gsap.to(currentItem, {
      opacity: 0,
      duration: FADE_DURATION,
      ease: "power2.inOut"
    });
    
    currentSlideIndex = nextIndex;
  }
  
  // Clean up slideshow on page leave (for Barba.js)
  window.cleanupHomeSlideshow = function() {
    if (slideshowInterval) {
      clearInterval(slideshowInterval);
      slideshowInterval = null;
    }
  };
  
  // ═══════════════════════════════════════════════════════════════════════════
  // LOGO ANIMATION FIRST, THEN SLIDESHOW
  // ═══════════════════════════════════════════════════════════════════════════
  
  if (logoWrap) {
    // Hide all images during logo animation
    homeItems.forEach(item => {
      gsap.set(item, { opacity: 0 });
    });
    
    // Reset logo for animation
    logoWrap.style.display = "block";
    gsap.set(".logo_wrap", { opacity: 1 });
    
    const tl = gsap.timeline();
    
    // Logo letters animate in
    tl.from(".svg-letter", {
      y: 400,
      duration: 0.7,
      opacity: 0,
      stagger: 0.04,
      ease: "expo.inOut"
    });
    
    // Logo stays visible (2 seconds)
    tl.to({}, { duration: 2 });
    
    // Logo fades out
    tl.to(".logo_wrap", {
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        logoWrap.style.display = "none";
        ScrollTrigger.refresh();
        // NOW start the slideshow after logo is done
        initFeaturedSlideshow();
      }
    });
  } else {
    // No logo - start slideshow immediately
    initFeaturedSlideshow();
  }
  
  // ScrollTrigger animations
  gsap.registerPlugin(ScrollTrigger);
  const scrollItems = document.querySelectorAll('.home_flex_item');
  
  if (scrollItems.length) {
    scrollItems.forEach((item) => {
      gsap.fromTo(
        item, 
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
            toggleActions: "play none none none",
          }
        }
      );
    });
  }
  
  // Home grid/flex toggle
  const homeContainer = document.querySelector('.home_inner');
  const homeToggleButton = document.querySelector('.nav_toggle');
  
  if (!homeContainer || !homeToggleButton) {
    console.log('Home toggle elements not found, skipping...');
    return;
  }
  
  // Note: homeItems already declared at top of initHomePageScripts()
  let isHomeGridView = false;
  
  function resetHomeTransformations() {
    homeItems.forEach(item => {
      gsap.set(item, { clearProps: "all" });
    });
  }
  
  // Helper to update home toggle active state
  function updateHomeToggleActiveState(isGrid) {
    const homeToggleButton = document.querySelector('.nav_toggle');
    if (!homeToggleButton) return;
    
    if (isGrid) {
      homeToggleButton.classList.add('is-active');
    } else {
      homeToggleButton.classList.remove('is-active');
    }
  }
  
  // Set initial active state (flex layout by default)
  updateHomeToggleActiveState(false);
  
  function showHomeGridView() {
    console.log("Switching to Home Grid View");
    
    gsap.killTweensOf(homeItems);
    gsap.killTweensOf(homeContainer);
    
    gsap.to(homeItems, {
      scale: 0.9,
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        window.scrollTo(0, 0);
        
        // Switch layout classes
        homeContainer.classList.remove('u-vflex-left-top');
        homeContainer.classList.add('u-grid-custom');
        
        // Add .no-margin to captions
        homeItems.forEach(item => {
          const captionWrap = item.querySelector('.home_caption_wrap');
          if (captionWrap) {
            captionWrap.classList.add('no-margin');
          }
        });
        
        // Animate back in
        gsap.fromTo(homeItems,
          { opacity: 0, y: 30, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.1
          }
        );
        
        isHomeGridView = true;
        updateHomeToggleActiveState(true);
      }
    });
  }
  
  function showHomeFullScreenView() {
    console.log("Switching to Home Full-Screen Flex Layout");
    
    gsap.killTweensOf(homeItems);
    gsap.killTweensOf(homeContainer);
    
    gsap.to(homeItems, {
      scale: 0.9,
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        // Switch layout classes
        homeContainer.classList.remove('u-grid-custom');
        homeContainer.classList.add('u-vflex-left-top');
        
        // Remove .no-margin from captions
        homeItems.forEach(item => {
          const captionWrap = item.querySelector('.home_caption_wrap');
          if (captionWrap) {
            captionWrap.classList.remove('no-margin');
          }
        });
        
        // Animate back in
        gsap.fromTo(homeItems,
          { opacity: 0, y: 30, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.1
          }
        );
        
        isHomeGridView = false;
        updateHomeToggleActiveState(false);
      }
    });
  }
  
  // Event delegation for toggle button
  if (window.homeToggleHandler) {
    document.removeEventListener('click', window.homeToggleHandler);
  }
  
  window.homeToggleHandler = function(e) {
    if (e.target.closest('.nav_toggle')) {
      console.log("Home Toggle Button Clicked");
      if (isHomeGridView) {
        showHomeFullScreenView();
      } else {
        showHomeGridView();
      }
    }
  };
  
  document.addEventListener('click', window.homeToggleHandler);
  
  console.log('✅ Home page scripts initialized');
}

/* ═══════════════════════════════════════════════════════════════════════════
   6. BARBA.JS PAGE TRANSITIONS
   ═══════════════════════════════════════════════════════════════════════════
   
   Handles smooth page transitions without full page reloads (SPA-like).
   Injects page-specific CSS dynamically and re-initializes scripts after
   each transition.
   
   ═══════════════════════════════════════════════════════════════════════════ */

// Ensure .page_main fades in on first page load (before Barba takes over)
(function() {
  window.addEventListener('load', function() {
    const pathname = window.location.pathname;
    const isHomeZig = pathname === '/home-zig' || pathname === '/home-zig/';
    const isHome = pathname === '/' || pathname === '';
    
    // Skip page_main fade on home-zig and home (they handle their own animations)
    if (isHomeZig || isHome) {
      console.log('Skipping .page_main fade on ' + (isHomeZig ? 'home-zig' : 'home'));
      return;
    }
    
    const pageMain = document.querySelector('.page_main');
    if (pageMain) {
      const currentOpacity = getComputedStyle(pageMain).opacity;
      console.log('Initial .page_main opacity:', currentOpacity);
      
      // Fade in smoothly with GSAP
      gsap.to(pageMain, {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out'
      });
      console.log('Fading in .page_main on initial load');
    }
  });
})();

/* ───────────────────────────────────────────────────────────────────────────
   injectPageSpecificCSS() - Dynamic CSS Injection
   ─────────────────────────────────────────────────────────────────────────── 
   Detects page type from URL and injects appropriate CSS:
   - home: Nav headroom styles
   - artist-detail: Headroom, nav styles
   - exhibition-detail: Headroom, alternating work layout, image sizing
   - exhibitions-list: Stagger animation states, thumbnail hiding
   - artists-list: Stagger animation states
   
   Removes old page-specific styles before injecting new ones.
   ─────────────────────────────────────────────────────────────────────────── */

function injectPageSpecificCSS(pathname) {
  let namespace = 'default';
  
  if (pathname === '/' || pathname === '') {
    namespace = 'home';
  } else if (pathname === '/old-home' || pathname === '/old-home/') {
    namespace = 'old-home';
  } else if (pathname.includes('/artists/') && !pathname.endsWith('/artists')) {
    namespace = 'artist-detail';
  } else if (pathname === '/artists' || pathname === '/artists/') {
    namespace = 'artists-list';
  } else if (pathname.includes('/exhibitions/') && !pathname.endsWith('/exhibitions')) {
    namespace = 'exhibition-detail';
  } else if (pathname === '/exhibitions' || pathname === '/exhibitions/') {
    namespace = 'exhibitions-list';
  } else if (pathname === '/contact' || pathname === '/contact/') {
    namespace = 'contact';
  } else if (pathname === '/home-zig' || pathname === '/home-zig/') {
    namespace = 'home-zig';
  }
  
  console.log('Injecting CSS for namespace:', namespace, 'pathname:', pathname);
  
  // Remove old page-specific styles
  const oldStyles = document.querySelectorAll('style[data-page-specific]');
  console.log('Removing', oldStyles.length, 'old page-specific styles');
  oldStyles.forEach(el => el.remove());
  
  // Define page-specific CSS
  let pageSpecificCSS = '';
  
  switch(namespace) {
    case 'artists-list':
      pageSpecificCSS = `
        /* Hide exhibition parent items initially */
        .g_exhibition_item {
          opacity: 0;
        }

        /* Show after animations are ready */
        body.animations-ready .g_exhibition_item {
          opacity: 1;
        }

        /* Set initial state for stagger animation */
        .g_exhibition_item_inner {
          opacity: 0;
          transform: translateY(20px);
        }

        /* Hide preview thumbnails by default (desktop) */
        .g_preview_thumb_wrap {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }
        
        /* Show thumbnails on mobile/tablet */
        @media (max-width: 1024px) {
          .g_preview_thumb_wrap {
            opacity: 1 !important;
            visibility: visible !important;
            pointer-events: auto !important;
          }
          .g_preview_thumb_wrap .g_image {
            opacity: 1 !important;
            visibility: visible !important;
          }
        }
      `;
      break;
      
    case 'artist-detail':
      pageSpecificCSS = `
        /* Nav - Headroom transitions */
        #nav {
          width: 100%;
          transition: transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1);
          will-change: transform;
        }

        .nav-pinned {
          transform: translateY(0);
        }

        .nav-unpinned {
          transform: translateY(calc(-1 * var(--size--12rem)));
        }

        /* For tablet and mobile devices */
        @media screen and (max-width: 991px) {
          .nav-unpinned {
            transform: translateY(calc(-1 * var(--size--24rem)));
          }
        }

        /* Artist works image sizing (step-by-step, no masonry) */
        .artist_works_layout .artist_works_item:first-child .artist_works_img_wrap {
          width: 100%;
        }
        .artist_works_layout .artist_works_item:not(:first-child) .artist_works_img_wrap {
          max-width: 100% !important;
          width: fit-content !important; /* Safari: let wrapper shrink to image */
          max-height: 85vh !important;
        }
        /* Shrink images to fit inside wrapper */
        .artist_works_layout .artist_works_item:first-child .artist_works_img {
          max-width: 100% !important;
          height: auto !important;
          width: 100% !important;
          display: block;
          object-fit: contain;
        }
        .artist_works_layout .artist_works_item:not(:first-child) .artist_works_img {
          max-width: 100% !important;
          max-height: 85vh !important;
          height: auto !important;
          width: auto !important;
          display: block !important;
          object-fit: contain !important;
        }
        /* Artist works alignment (class-driven, randomized via JS) */
        .artist_works_layout .artist_works_item {
          display: flex;
          flex-direction: column;
          opacity: 0;
        }
        .artist_works_layout .artist_works_item.align-left { align-items: flex-start; }
        .artist_works_layout .artist_works_item.align-center { align-items: center; }
        .artist_works_layout .artist_works_item.align-right { align-items: flex-end; }
        
        /* Show exhibition preview thumbnails on mobile/tablet (no hover) */
        @media (max-width: 1024px) {
          .g_preview_thumb_wrap {
            opacity: 1 !important;
            visibility: visible !important;
            pointer-events: auto !important;
          }
          .g_preview_thumb_wrap .g_image {
            opacity: 1 !important;
            visibility: visible !important;
          }
        }
      `;
      break;
      
    case 'exhibition-detail':
      pageSpecificCSS = `
        /* Initial state for fade-in animation */
        .page_main {
          opacity: 0;
        }
        
        /* Nav - Headroom transitions - Extra smooth for exhibition detail */
        #nav {
          width: 100%;
          transition: transform 0.8s cubic-bezier(0.4, 0.0, 0.2, 1);
          will-change: transform;
        }

        .nav-pinned {
          transform: translateY(0);
        }

        .nav-unpinned {
          transform: translateY(calc(-1 * var(--size--12rem)));
        }

        /* For tablet and mobile devices */
        @media screen and (max-width: 991px) {
          .nav-unpinned {
            transform: translateY(calc(-1 * var(--size--24rem)));
          }
        }
        
        /* Works item alternating layout */
        .works_item:nth-child(odd) .works_img_wrap {
          order: 1;
        }
        .works_item:nth-child(odd) .works_caption_wrap {
          order: 2;
        }

        .works_item:nth-child(even) .works_img_wrap {
          order: 2;
        }
        .works_item:nth-child(even) .works_caption_wrap {
          order: 1;
        }
        
        /* Desktop only - scaled down images limited to 100vh */
        @media (min-width: 992px) {
          img.show_img[image-display="scaled down"] {
            max-height: 100vh !important;
            width: auto !important;
            height: auto !important;
            object-fit: scale-down !important;
            max-width: 100% !important;
          }
        }

        /* Fullscreen images - no restrictions */
        img.show_img[image-display="fullscreen"] {
          /* Let images be their natural size */
        }
      `;
      break;
      
    case 'exhibitions-list':
      pageSpecificCSS = `
        /* Hide exhibition parent items initially */
        .g_exhibition_item {
          opacity: 0;
        }

        /* Show after animations are ready */
        body.animations-ready .g_exhibition_item {
          opacity: 1;
        }

        /* Set initial state for stagger animation */
        .g_exhibition_item_inner {
          opacity: 0;
          transform: translateY(20px);
        }

        /* Hide preview thumbnails by default (desktop) */
        .g_preview_thumb_wrap {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }
        
        /* Show thumbnails on mobile/tablet */
        @media (max-width: 1024px) {
          .g_preview_thumb_wrap {
            opacity: 1 !important;
            visibility: visible !important;
            pointer-events: auto !important;
          }
          .g_preview_thumb_wrap .g_image {
            opacity: 1 !important;
            visibility: visible !important;
          }
        }
        
        /* Artist name divider logic */
        .artist_name_outer .g_artist_divider { 
          display: none; 
        }
        .artist_name_outer .w-dyn-item:not(:last-child) .g_artist_divider { 
          display: inline; 
        }
      `;
      break;
      
    case 'home':
      pageSpecificCSS = `
        /* No Headroom CSS needed - Headroom disabled on homepage */
      `;
      break;
      
    case 'old-home':
      pageSpecificCSS = `
        /* No Headroom CSS needed - Headroom disabled on old-home */
      `;
      break;
      
    case 'home-zig':
      pageSpecificCSS = `
        /* Nav - Headroom transitions */
        #nav {
          width: 100%;
          transition: transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1);
          will-change: transform;
        }

        .nav-pinned {
          transform: translateY(0);
        }

        .nav-unpinned {
          transform: translateY(calc(-1 * var(--size--12rem)));
        }

        /* For tablet and mobile devices */
        @media screen and (max-width: 991px) {
          .nav-unpinned {
            transform: translateY(calc(-1 * var(--size--24rem)));
          }
        }
        
        /* Grid items initially hidden for ScrollTrigger animation */
        .current_grid_item {
          display: flex;
          flex-direction: column;
          opacity: 0;
        }
        
        /* Alignment classes applied by JS - similar to artist works */
        .current_grid_item.u-vflex-left-top { align-items: flex-start; }
        .current_grid_item.u-vflex-center-top { align-items: center; }
        .current_grid_item.u-vflex-right-top { align-items: flex-end; }
      `;
      break;
  }
  
  // Inject the CSS (always, not just if > 100 chars)
  if (pageSpecificCSS.trim()) {
    const style = document.createElement('style');
    style.setAttribute('data-page-specific', 'true');
    style.textContent = pageSpecificCSS;
    document.head.appendChild(style);
    console.log('✅ Injected CSS for namespace:', namespace);
  }
  
  return namespace;
}

// Set namespace and initialize scripts on first load
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('[data-barba="container"]');
    if (!container) return;
    
    const pathname = window.location.pathname;
    const namespace = injectPageSpecificCSS(pathname);
    
    container.setAttribute('data-barba-namespace', namespace);
    console.log('Barba namespace set to:', namespace);
    
    // IMMEDIATELY apply theme BEFORE any animations to prevent flash
    const storedTheme = localStorage.getItem("theme") || "light";
    const pageWrapElements = document.querySelectorAll(".page_wrap");
    pageWrapElements.forEach(el => el.setAttribute("data-theme", storedTheme));
    document.body.setAttribute("data-theme", storedTheme);
    
    // Initialize all page scripts
    initPageScripts();

    // Also run nav intro animation on hard refresh (no Barba transition yet)
    try {
      const navWrap = document.querySelector('.nav_wrap');
      const title = document.querySelector('.nav_wrap .nav_title_wrap');
      const navBorder = document.querySelector('.g_border.is-nav');
      
      if (navWrap) {
        const navChildren = Array.from(document.querySelectorAll('.nav_wrap .nav_layout > *'))
          .filter(el => !el.classList.contains('nav_title_wrap'));
        if (title && getComputedStyle(title).opacity === '1') gsap.set(title, { opacity: 0 });
        navChildren.forEach(el => {
          if (getComputedStyle(el).opacity === '1') gsap.set(el, { opacity: 0 });
        });
        
        // Set border to 0 width initially
        if (navBorder) gsap.set(navBorder, { width: '0%' });
        
        const tl = gsap.timeline();
        if (navChildren.length) tl.to(navChildren, { opacity: 1, duration: 0.35, stagger: 0.08, ease: 'power1.out' }, 0.15);
        if (title) tl.to(title, { opacity: 1, duration: 0.45, ease: 'power1.out' }, '+=0.25');
        
        // Animate border from 0 to 100% during nav animation (slower)
        if (navBorder) tl.to(navBorder, { width: '100%', duration: 1.2, ease: 'power2.out' }, 0.15);
        
        tl.to({}, { duration: 0.5 }); // same pause for refresh
      }
    } catch (e) {
      console.log('Initial nav intro error:', e);
    }
  });
})();

// Initialize Barba.js
barba.init({
  transitions: [{
    name: 'fade-transition',
    
    leave(data) {
      console.log('Barba: leaving page');
      
      // Cleanup home slideshow if running
      if (typeof window.cleanupHomeSlideshow === 'function') {
        window.cleanupHomeSlideshow();
      }
      
      // Fade out the old page
      return gsap.to(data.current.container, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut'
      });
    },
    
    enter(data) {
      console.log('Barba: entering new page');
      // Scroll to top
      window.scrollTo(0, 0);
      
      const container = data.next.container;
      const navWrap = document.querySelector('.nav_wrap');
      const pageMain = container.querySelector('.page_main');
      
      // Make container visible
      container.style.visibility = 'visible';
      gsap.set(container, { opacity: 1 });
      
      // Do not hide page content here; existing page-level staggers depend on it
      
      /* NAV SIMPLE FADE SEQUENCE (no transforms/height changes) */
      
      if (navWrap) {
        console.log('🎬 Starting nav simple fade sequence');
        
        // Temporarily disable Headroom during transition
        const nav = document.getElementById('nav');
        if (nav && nav.headroomInstance) {
          nav.headroomInstance.freeze();
          console.log('  Headroom frozen');
        }
        
        // Get elements
        const actualHeight = navWrap.offsetHeight;
        const navTitleWrap = navWrap.querySelector('.nav_title_wrap');
        const navDropdownWrap = navWrap.querySelector('.nav_dropdown_wrap');
        const navBackground = navWrap.querySelector('.nav_background, .nav_background_mobile');
        
        console.log('  Original nav height:', actualHeight + 'px');
        console.log('  Nav title wrap found:', !!navTitleWrap);
        console.log('  Nav dropdown wrap found:', !!navDropdownWrap);
        console.log('  Nav background found:', !!navBackground);
        
        if (navTitleWrap) {
          const titleStyles = window.getComputedStyle(navTitleWrap);
          console.log('  Title position:', titleStyles.position, 'top:', titleStyles.top);
        }
        
        // Defer nav fade to Barba after() so Webflow/Headroom cannot override
        // Here we only ensure the nav is visible (content will fade later)
        gsap.set(navWrap, { opacity: 1 });
        return;
      } else {
        // SIMPLE FADE-IN (No nav animation) - Uncomment this to disable nav animation
        /*
        if (pageMain) {
          await gsap.to(pageMain, { 
            opacity: 1, 
            duration: 0.5, 
            ease: 'power2.out' 
          });
        }
        */
      }
    },
    
    after(data) {
      // Ensure fonts-loaded class stays on html element
      document.documentElement.classList.add('fonts-loaded');

      // Inject page-specific CSS and set namespace
      const pathname = window.location.pathname;
      const namespace = injectPageSpecificCSS(pathname);
      const newContainer = data.next.container;
      newContainer.setAttribute('data-barba-namespace', namespace);
      
      // IMMEDIATELY apply theme BEFORE any animations to prevent flash
      const storedTheme = localStorage.getItem("theme") || "light";
      const pageWrapElements = newContainer.querySelectorAll(".page_wrap");
      pageWrapElements.forEach(el => el.setAttribute("data-theme", storedTheme));
      document.body.setAttribute("data-theme", storedTheme);

      // Helper to run the original page setup (page-level animations, Webflow re-init)
      function runPageInit() {
        initPageScripts();
        if (window.Webflow) {
          window.Webflow.destroy();
          window.Webflow.ready();
          if (window.Webflow.require) {
            const ix2 = window.Webflow.require('ix2');
            if (ix2) ix2.init();
          }
        }
        console.log('Barba: Page transition complete, Webflow re-initialized');
      }

      // Nav fade sequencing BEFORE page-level animations
      try {
        const navWrap = document.querySelector('.nav_wrap');
        const title = document.querySelector('.nav_wrap .nav_title_wrap');
        const navBorder = document.querySelector('.g_border.is-nav');
        
        console.log('🎬 Barba transition - Nav border found:', !!navBorder, 'on page:', window.location.pathname);
        
        if (navWrap) {
          const navChildren = Array.from(document.querySelectorAll('.nav_wrap .nav_layout > *'))
            .filter(el => !el.classList.contains('nav_title_wrap'));
          if (title && getComputedStyle(title).opacity === '1') gsap.set(title, { opacity: 0 });
          navChildren.forEach(el => {
            if (getComputedStyle(el).opacity === '1') gsap.set(el, { opacity: 0 });
          });
          
          // Set border to 0 width initially
          if (navBorder) {
            console.log('  ✅ Border element found - animating');
            gsap.set(navBorder, { width: '0%' });
          } else {
            console.log('  ⚠️ Border element NOT found!');
          }
          
          const tl = gsap.timeline({ onComplete: runPageInit });
          if (navChildren.length) tl.to(navChildren, { opacity: 1, duration: 0.35, stagger: 0.08, ease: 'power1.out' }, 0.15);
          if (title) tl.to(title, { opacity: 1, duration: 0.45, ease: 'power1.out' }, '+=0.25');
          
          // Animate border from 0 to 100% during nav animation (slower)
          if (navBorder) {
            console.log('  🎨 Animating border from 0% to 100%');
            tl.to(navBorder, { width: '100%', duration: 1.2, ease: 'power2.out' }, 0.15);
          }
          
          // Small pause after title shows before triggering page animations
          tl.to({}, { duration: 0.5 });
          return; // defer init until timeline completes
        }
      } catch (e) {
        console.log('Nav fade sequence error:', e);
      }

      // Fallback if nav not found
      runPageInit();
    }
  }],
  
  // Prevent transition on same page
  prevent: ({ el }) => el.classList && el.classList.contains('no-barba')
});

console.log('Barba.js initialized with fade transition');
