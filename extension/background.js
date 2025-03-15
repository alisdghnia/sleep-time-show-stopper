// Variable to store the timer ID
let timerId = null;

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'startTimer') {
    startTimer(request.endTime);
    sendResponse({status: 'Timer started'});
  } else if (request.action === 'cancelTimer') {
    cancelTimer();
    sendResponse({status: 'Timer cancelled'});
  }
  return true; // Required for async sendResponse
});

// Check if there's an active timer when the extension starts
chrome.storage.local.get(['timerActive', 'endTime'], function(result) {
  if (result.timerActive && result.endTime) {
    const now = Date.now();
    if (result.endTime > now) {
      startTimer(result.endTime);
    } else {
      // Timer has already expired, clean up
      chrome.storage.local.set({
        timerActive: false,
        endTime: null
      });
    }
  }
});

function startTimer(endTime) {
  // Cancel any existing timer
  cancelTimer();
  
  const timeUntilEnd = endTime - Date.now();
  
  if (timeUntilEnd <= 0) {
    executeActions();
    return;
  }
  
  // Set a new timer
  timerId = setTimeout(function() {
    executeActions();
  }, timeUntilEnd);
  
  console.log(`Timer set for ${timeUntilEnd}ms (${new Date(endTime).toLocaleTimeString()})`);
}

function cancelTimer() {
  if (timerId !== null) {
    clearTimeout(timerId);
    timerId = null;
    console.log('Timer cancelled');
  }
}

function executeActions() {
  console.log('Timer expired, executing actions');
  
  // Get the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs.length === 0) {
      console.error('No active tab found');
      
      // Try to get any tab as a fallback
      chrome.tabs.query({}, function(allTabs) {
        if (allTabs.length > 0) {
          // Try to find a tab that might be playing video (like YouTube, Netflix, etc.)
          const videoSites = ['youtube', 'netflix', 'hulu', 'disney', 'prime', 'video', 'player', 'watch'];
          const potentialVideoTab = allTabs.find(tab => 
            videoSites.some(site => tab.url.toLowerCase().includes(site))
          );
          
          const targetTab = potentialVideoTab || allTabs[0];
          console.log('Falling back to tab:', targetTab.url);
          sendPauseMessage(targetTab.id);
        } else {
          console.error('No tabs found at all');
          resetTimerState();
        }
      });
      return;
    }
    
    const activeTab = tabs[0];
    sendPauseMessage(activeTab.id);
  });
}

function sendPauseMessage(tabId) {
  // First try using the content script
  chrome.tabs.sendMessage(tabId, { action: 'pauseVideo' }, function(response) {
    // Check if we got a response from the content script
    if (chrome.runtime.lastError) {
      console.log('Content script not ready or error occurred:', chrome.runtime.lastError);
      
      // If content script didn't respond, inject and execute the script directly
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: controlVideoPlayback
      }).then(results => {
        console.log('Script execution results:', results);
        resetTimerState();
      }).catch(err => {
        console.error('Error executing script:', err);
        resetTimerState();
      });
    } else {
      // Content script responded
      console.log('Content script response:', response);
      resetTimerState();
    }
  });
}

function resetTimerState() {
  // Reset timer state
  chrome.storage.local.set({
    timerActive: false,
    endTime: null
  });
}

// This function will be injected into the page as a backup
function controlVideoPlayback() {
  console.log('Sleep Time Show Stopper: Direct script injection attempting to control video');
  
  // Find all video elements on the page
  const videos = document.querySelectorAll('video');
  let actionTaken = false;
  
  if (videos.length > 0) {
    // Loop through all videos and pause them
    videos.forEach(video => {
      if (!video.paused) {
        try {
          // Pause the video
          video.pause();
          actionTaken = true;
          console.log('Sleep Time Show Stopper: Video paused via direct injection');
        } catch (e) {
          console.error('Sleep Time Show Stopper: Error pausing video:', e);
        }
      }
    });
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
      
      console.log('Sleep Time Show Stopper: Exited fullscreen via direct injection');
    }
  } catch (e) {
    console.error('Sleep Time Show Stopper: Error exiting fullscreen:', e);
  }
  
  return actionTaken ? 'Video playback controlled successfully' : 'No video found or unable to control playback';
}