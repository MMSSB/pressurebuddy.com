    const cookieMessage = document.getElementById('cookieMessage');
    const acceptBtn = document.getElementById('acceptCookies');
    const declineBtn = document.getElementById('declineCookies');

    // Check if user already made a choice
    const userChoice = localStorage.getItem('cookieConsent');

    if (!userChoice) {
      // Show message after a short delay
      setTimeout(() => {
        cookieMessage.classList.add('active');
      }, 2000);
    }

    // Handle Accept
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      hideMessage();
    });

    // Handle Decline
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      // Optional: disable non-essential cookies here
      hideMessage();
    });

    function hideMessage() {
      cookieMessage.classList.remove('active');
      setTimeout(() => {
        cookieMessage.style.display = 'none';
      }, 500);
    }
