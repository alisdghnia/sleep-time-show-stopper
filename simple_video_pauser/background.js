// Variable to store the timer ID
let timerId = null;
let screenshotOptions = {
  takeScreenshot: true,
  captureFullPage: false
};

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'startTimer') {
    // Store screenshot options
    if (request.takeScreenshot !== undefined) {
      screenshotOptions.takeScreenshot = request.takeScreenshot;
    }
    if (request.captureFullPage !== undefined) {
      screenshotOptions.captureFullPage = request.captureFullPage;
    }
    
    startTimer(request.endTime);
    sendResponse({status: 'Timer started'});
  } else if (request.action === 'cancelTimer') {
    cancelTimer();
    sendResponse({status: 'Timer cancelled'});
  } else if (request.action === 'takeScreenshot') {
    captureScreenshot(request.captureFullPage)
      .then(result => {
        sendResponse(result);
      })
      .catch(error => {
        console.error('Error taking screenshot:', error);
        sendResponse({success: false, error: error.message});
      });
    return true; // Will respond asynchronously
  }
  return true; // Required for async sendResponse
});

// Check if there's an active timer when the extension starts
chrome.storage.local.get(['timerActive', 'endTime', 'takeScreenshot', 'captureFullPage'], function(result) {
  if (result.takeScreenshot !== undefined) {
    screenshotOptions.takeScreenshot = result.takeScreenshot;
  }
  if (result.captureFullPage !== undefined) {
    screenshotOptions.captureFullPage = result.captureFullPage;
  }
  
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

async function executeActions() {
  console.log('Timer expired, executing actions');
  
  // Take a screenshot first if enabled
  if (screenshotOptions.takeScreenshot) {
    try {
      const screenshotResult = await captureScreenshot(screenshotOptions.captureFullPage);
      console.log('Screenshot taken:', screenshotResult);
    } catch (error) {
      console.error('Error taking screenshot:', error);
    }
  }
  
  // Get the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs.length === 0) {
      console.error('No active tab found');
      resetTimerState();
      return;
    }
    
    const activeTab = tabs[0];
    
    // Send message to content script
    chrome.tabs.sendMessage(activeTab.id, { action: 'pauseVideo' }, function(response) {
      console.log('Content script response:', response || 'No response');
      
      // Reset timer state
      resetTimerState();
    });
  });
}

function resetTimerState() {
  // Reset timer state
  chrome.storage.local.set({
    timerActive: false,
    endTime: null
  });
}

// Function to capture a screenshot
async function captureScreenshot(captureFullPage = false) {
  try {
    // Get the active tab
    const tabs = await chrome.tabs.query({active: true, currentWindow: true});
    
    if (tabs.length === 0) {
      throw new Error('No active tab found');
    }
    
    const activeTab = tabs[0];
    
    // Basic viewport screenshot
    const dataUrl = await chrome.tabs.captureVisibleTab(null, {format: 'png'});
    
    // If full page screenshot is requested, we need to do additional work
    // This is a simplified implementation - full implementation would require
    // scrolling and stitching multiple screenshots
    let screenshotType = captureFullPage ? 'full_page' : 'viewport';
    
    // Store the screenshot in local storage
    const screenshot = {
      dataUrl: dataUrl,
      timestamp: Date.now(),
      url: activeTab.url,
      title: activeTab.title,
      type: screenshotType
    };
    
    // Get existing screenshots
    const result = await chrome.storage.local.get(['screenshots']);
    const screenshots = result.screenshots || [];
    
    // Add new screenshot (limit to 10 most recent)
    screenshots.unshift(screenshot);
    if (screenshots.length > 10) {
      screenshots.pop();
    }
    
    // Save updated screenshots
    await chrome.storage.local.set({ screenshots: screenshots });
    
    // Notify popup if open
    chrome.runtime.sendMessage({
      action: 'screenshotTaken',
      screenshot: screenshot
    }).catch(() => {
      // Ignore errors - popup might not be open
    });
    
    return { success: true, dataUrl: dataUrl };
  } catch (error) {
    console.error('Error capturing screenshot:', error);
    return { success: false, error: error.message };
  }
}