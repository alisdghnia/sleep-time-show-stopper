// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'pauseVideo') {
    const result = pauseAllVideos();
    sendResponse({ success: result.success, message: result.message });
  }
  return true; // Keep the message channel open for async response
});

// Function to find and pause all videos
function pauseAllVideos() {
  console.log('Simple Video Pauser: Attempting to pause videos');
  
  let videosPaused = 0;
  let message = 'No videos found';
  
  try {
    // Find all video elements
    const videos = document.querySelectorAll('video');
    
    if (videos.length > 0) {
      videos.forEach(video => {
        if (!video.paused) {
          try {
            video.pause();
            videosPaused++;
            console.log('Simple Video Pauser: Video paused');
          } catch (e) {
            console.error('Simple Video Pauser: Error pausing video:', e);
          }
        }
      });
      
      if (videosPaused > 0) {
        message = `Paused ${videosPaused} video(s)`;
      } else {
        message = 'Found videos, but they were already paused';
      }
    }
    
    // If no videos found or paused, try common player buttons
    if (videosPaused === 0) {
      // Common play/pause button selectors
      const buttonSelectors = [
        '.ytp-play-button', // YouTube
        '[aria-label="Pause"]', // Common accessibility label
        '[title="Pause"]', // Common title attribute
        '.vjs-play-control', // Video.js
        '.play-pause-button', // Generic
        '.jwplayer .jw-icon-playback' // JW Player
      ];
      
      for (const selector of buttonSelectors) {
        const button = document.querySelector(selector);
        if (button) {
          try {
            button.click();
            videosPaused++;
            message = `Clicked pause button: ${selector}`;
            console.log(`Simple Video Pauser: Clicked ${selector}`);
            break;
          } catch (e) {
            console.error(`Simple Video Pauser: Error clicking ${selector}:`, e);
          }
        }
      }
    }
    
    // Also try to exit fullscreen
    if (document.fullscreenElement) {
      try {
        document.exitFullscreen();
        message += ' and exited fullscreen';
        console.log('Simple Video Pauser: Exited fullscreen');
      } catch (e) {
        console.error('Simple Video Pauser: Error exiting fullscreen:', e);
      }
    }
    
  } catch (error) {
    console.error('Simple Video Pauser: Error in pauseAllVideos:', error);
    message = 'Error: ' + error.message;
  }
  
  return { 
    success: videosPaused > 0,
    message: message
  };
}