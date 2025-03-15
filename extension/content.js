// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'pauseVideo') {
    const result = pauseVideoAndExitFullscreen();
    sendResponse({ result: result });
  }
  return true; // Required for async sendResponse
});

// Function to find and pause videos and exit fullscreen
function pauseVideoAndExitFullscreen() {
  console.log('Sleep Time Show Stopper: Content script activated');
  
  // Find all video elements on the page
  const videos = document.querySelectorAll('video');
  let videoPaused = false;
  
  if (videos.length > 0) {
    // Loop through all videos and pause them
    videos.forEach(video => {
      if (!video.paused) {
        try {
          // Pause the video
          video.pause();
          videoPaused = true;
          console.log('Sleep Time Show Stopper: Video paused');
        } catch (e) {
          console.error('Sleep Time Show Stopper: Error pausing video:', e);
        }
      }
    });
  } else {
    console.log('Sleep Time Show Stopper: No videos found on page');
    
    // Special handling for specific sites like YouTube
    // Check if we're on YouTube
    if (window.location.hostname.includes('youtube.com')) {
      try {
        // Try YouTube-specific pause methods
        const pauseButton = document.querySelector('.ytp-play-button');
        if (pauseButton) {
          // Check if video is playing (button shows pause icon)
          if (pauseButton.getAttribute('aria-label') && 
              pauseButton.getAttribute('aria-label').toLowerCase().includes('pause')) {
            pauseButton.click();
            videoPaused = true;
            console.log('Sleep Time Show Stopper: YouTube video paused via button click');
          }
        }
      } catch (e) {
        console.error('Sleep Time Show Stopper: Error with YouTube-specific pause:', e);
      }
    }
    
    // Add similar special handling for other video platforms as needed
  }
  
  // Try to exit fullscreen
  try {
    if (document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.mozFullScreenElement ||
        document.msFullscreenElement) {
      
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      
      console.log('Sleep Time Show Stopper: Exited fullscreen');
      return 'Video paused and fullscreen exited';
    }
  } catch (e) {
    console.error('Sleep Time Show Stopper: Error exiting fullscreen:', e);
  }
  
  return videoPaused ? 'Video paused' : 'No video found or unable to pause video';
}

// Initialize when the content script loads
console.log('Sleep Time Show Stopper: Content script loaded');