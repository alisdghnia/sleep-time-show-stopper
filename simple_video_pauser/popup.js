document.addEventListener('DOMContentLoaded', function() {
  const startButton = document.getElementById('startTimer');
  const cancelButton = document.getElementById('cancelTimer');
  const minutesInput = document.getElementById('minutes');
  const statusDiv = document.getElementById('status');
  const takeScreenshotCheckbox = document.getElementById('takeScreenshot');
  const captureFullPageCheckbox = document.getElementById('captureFullPage');
  const takeManualScreenshotButton = document.getElementById('takeManualScreenshot');
  const screenshotsContainer = document.getElementById('screenshots');
  
  // Load saved preferences
  chrome.storage.local.get(['takeScreenshot', 'captureFullPage'], function(result) {
    if (result.takeScreenshot !== undefined) {
      takeScreenshotCheckbox.checked = result.takeScreenshot;
    }
    if (result.captureFullPage !== undefined) {
      captureFullPageCheckbox.checked = result.captureFullPage;
    }
  });
  
  // Save preferences when changed
  takeScreenshotCheckbox.addEventListener('change', function() {
    chrome.storage.local.set({
      takeScreenshot: takeScreenshotCheckbox.checked
    });
  });
  
  captureFullPageCheckbox.addEventListener('change', function() {
    chrome.storage.local.set({
      captureFullPage: captureFullPageCheckbox.checked
    });
  });
  
  // Check if timer is already running
  chrome.storage.local.get(['timerActive', 'endTime'], function(result) {
    if (result.timerActive) {
      updateUIForActiveTimer(result.endTime);
    }
  });
  
  // Load existing screenshots
  loadScreenshots();
  
  startButton.addEventListener('click', function() {
    const minutes = parseInt(minutesInput.value);
    
    if (isNaN(minutes) || minutes <= 0) {
      alert('Please enter a valid number of minutes');
      return;
    }
    
    const milliseconds = minutes * 60 * 1000;
    const endTime = Date.now() + milliseconds;
    
    // Save timer info and screenshot preferences to storage
    chrome.storage.local.set({
      timerActive: true,
      endTime: endTime,
      takeScreenshot: takeScreenshotCheckbox.checked,
      captureFullPage: captureFullPageCheckbox.checked
    }, function() {
      // Send message to background script to start timer
      chrome.runtime.sendMessage({
        action: 'startTimer',
        endTime: endTime,
        takeScreenshot: takeScreenshotCheckbox.checked,
        captureFullPage: captureFullPageCheckbox.checked
      });
      
      updateUIForActiveTimer(endTime);
    });
  });
  
  cancelButton.addEventListener('click', function() {
    // Send message to background script to cancel timer
    chrome.runtime.sendMessage({
      action: 'cancelTimer'
    });
    
    // Update UI
    startButton.style.display = 'block';
    cancelButton.style.display = 'none';
    statusDiv.textContent = 'Timer cancelled';
    statusDiv.className = '';
    
    // Clear storage
    chrome.storage.local.set({
      timerActive: false,
      endTime: null
    });
  });
  
  takeManualScreenshotButton.addEventListener('click', function() {
    takeManualScreenshotButton.disabled = true;
    takeManualScreenshotButton.textContent = 'Taking screenshot...';
    
    chrome.runtime.sendMessage({
      action: 'takeScreenshot',
      captureFullPage: captureFullPageCheckbox.checked
    }, function(response) {
      takeManualScreenshotButton.disabled = false;
      takeManualScreenshotButton.textContent = 'Take Screenshot Now';
      
      if (response && response.success) {
        // Refresh the screenshots list
        loadScreenshots();
      } else {
        alert('Failed to take screenshot: ' + (response ? response.error : 'Unknown error'));
      }
    });
  });
  
  // Listen for screenshot notifications from the background script
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'screenshotTaken') {
      loadScreenshots();
    }
    return true;
  });
  
  function updateUIForActiveTimer(endTime) {
    startButton.style.display = 'none';
    cancelButton.style.display = 'block';
    
    const updateStatus = function() {
      const remainingTime = Math.max(0, endTime - Date.now());
      const remainingMinutes = Math.floor(remainingTime / 60000);
      const remainingSeconds = Math.floor((remainingTime % 60000) / 1000);
      
      statusDiv.textContent = `Time remaining: ${remainingMinutes}m ${remainingSeconds}s`;
      statusDiv.className = 'active';
      
      if (remainingTime > 0) {
        setTimeout(updateStatus, 1000);
      }
    };
    
    updateStatus();
  }
  
  function loadScreenshots() {
    chrome.storage.local.get(['screenshots'], function(result) {
      const screenshots = result.screenshots || [];
      
      if (screenshots.length === 0) {
        screenshotsContainer.innerHTML = '<div class="empty-state">No screenshots taken yet</div>';
        return;
      }
      
      let html = '';
      screenshots.forEach(function(screenshot, index) {
        const date = new Date(screenshot.timestamp);
        const timeString = date.toLocaleTimeString();
        html += `
          <div class="screenshot-item">
            <span>${timeString}</span>
            <div>
              <button class="view-screenshot" data-index="${index}">View</button>
              <button class="delete-screenshot" data-index="${index}">Delete</button>
            </div>
          </div>
        `;
      });
      
      screenshotsContainer.innerHTML = html;
      
      // Add event listeners for view and delete buttons
      document.querySelectorAll('.view-screenshot').forEach(function(button) {
        button.addEventListener('click', function() {
          const index = parseInt(this.getAttribute('data-index'));
          const screenshot = screenshots[index];
          // Open the screenshot in a new tab
          chrome.tabs.create({ url: screenshot.dataUrl });
        });
      });
      
      document.querySelectorAll('.delete-screenshot').forEach(function(button) {
        button.addEventListener('click', function() {
          const index = parseInt(this.getAttribute('data-index'));
          screenshots.splice(index, 1);
          chrome.storage.local.set({ screenshots: screenshots }, function() {
            loadScreenshots();
          });
        });
      });
    });
  }
});