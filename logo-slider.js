document.addEventListener('DOMContentLoaded', function() {
  // Configuration options (easy to change)
  const config = {
    speed: 1, // Animation speed (pixels per frame)
    direction: 'right', // Initial direction ('left' or 'right')
    pauseOnHover: true, // Pause animation when hovering over slider
    reverseOnEnd: true, // Reverse direction when reaching end
    pauseDuration: 0, // Milliseconds to pause at each end (0 for no pause)
  };

  // Get DOM elements
  const slider = document.getElementById('logoSlider');
  const track = document.getElementById('logoTrack');
  const logos = document.querySelectorAll('.imageslide');
  
  // Clone logos for seamless looping
  logos.forEach(logo => {
    track.appendChild(logo.cloneNode(true));
  });

  // Animation state
  let animationId;
  let isPaused = false;
  let currentPosition = 0;
  let currentDirection = config.direction;

  // Start animation
  function startAnimation() {
    if (animationId) cancelAnimationFrame(animationId);
    
    function animate() {
      if (isPaused) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      
      // Calculate movement
      const movement = currentDirection === 'right' ? -config.speed : config.speed;
      currentPosition += movement;
      
      // Check if we need to reverse or reset
      const trackWidth = track.scrollWidth / 2; // Since we cloned elements
      const sliderWidth = slider.offsetWidth;
      
      if (currentDirection === 'right' && -currentPosition >= trackWidth - sliderWidth) {
        // Reached right end
        if (config.reverseOnEnd) {
          currentDirection = 'left';
          if (config.pauseDuration > 0) {
            isPaused = true;
            setTimeout(() => isPaused = false, config.pauseDuration);
          }
        } else {
          currentPosition = 0;
        }
      } else if (currentDirection === 'left' && currentPosition >= 0) {
        // Reached left end
        if (config.reverseOnEnd) {
          currentDirection = 'right';
          if (config.pauseDuration > 0) {
            isPaused = true;
            setTimeout(() => isPaused = false, config.pauseDuration);
          }
        } else {
          currentPosition = -(trackWidth - sliderWidth);
        }
      }
      
      // Apply transformation
      track.style.transform = `translateX(${currentPosition}px)`;
      
      // Continue animation
      animationId = requestAnimationFrame(animate);
    }
    
    animate();
  }

  // Pause on hover if enabled
  if (config.pauseOnHover) {
    slider.addEventListener('mouseenter', () => isPaused = true);
    slider.addEventListener('mouseleave', () => isPaused = false);
  }

  // Start the animation
  startAnimation();

  // Expose controls for easy debugging (optional)
  window.logoSliderControls = {
    setSpeed: (newSpeed) => { config.speed = newSpeed; },
    setDirection: (newDir) => { currentDirection = newDir; },
    togglePause: () => { isPaused = !isPaused; },
    restart: () => { 
      currentPosition = 0;
      currentDirection = config.direction;
    }
  };
});

