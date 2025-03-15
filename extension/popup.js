document.addEventListener('DOMContentLoaded', function() {
  const startTimerButton = document.getElementById('startTimer');
  const cancelTimerButton = document.getElementById('cancelTimer');
  const hoursInput = document.getElementById('hours');
  const minutesInput = document.getElementById('minutes');
  const statusDiv = document.getElementById('status');
  
  // Set input constraints
  hoursInput.addEventListener('change', function() {
    // Ensure hours is a non-negative integer
    let value = parseInt(this.value);
    if (isNaN(value) || value < 0) {
      this.value = 0;
    } else if (value > 24) {
      this.value = 24;
    } else {
      this.value = Math.floor(value);
    }
  });
  
  minutesInput.addEventListener('change', function() {
    // Ensure minutes is a non-negative integer between 0 and 59
    let value = parseInt(this.value);
    if (isNaN(value) || value < 0) {
      this.value = 0;
    } else if (value > 59) {
      this.value = 59;
    } else {
      this.value = Math.floor(value);
    }
  });
  
  // Check if timer is already running
  chrome.storage.local.get(['timerActive', 'endTime', 'hours', 'minutes'], function(result) {
    if (result.timerActive) {
      updateUIForActiveTimer(result.endTime);
      
      // Restore saved values if available
      if (result.hours !== undefined) {
        hoursInput.value = result.hours;
      }
      if (result.minutes !== undefined) {
        minutesInput.value = result.minutes;
      }
    }
  });
  
  startTimerButton.addEventListener('click', function() {
    const hours = parseInt(hoursInput.value) || 0;
    const minutes = parseInt(minutesInput.value) || 0;
    
    // Calculate total time in milliseconds
    const totalTime = (hours * 60 * 60 + minutes * 60) * 1000;
    
    if (totalTime <= 0) {
      alert('Please enter a time greater than 0');
      return;
    }
    
    const endTime = Date.now() + totalTime;
    
    // Save timer info to storage
    chrome.storage.local.set({
      timerActive: true,
      endTime: endTime,
      hours: hours,
      minutes: minutes
    }, function() {
      // Send message to background script to start timer
      chrome.runtime.sendMessage({
        action: 'startTimer',
        endTime: endTime
      });
      
      updateUIForActiveTimer(endTime);
    });
  });
  
  cancelTimerButton.addEventListener('click', function() {
    // Send message to background script to cancel timer
    chrome.runtime.sendMessage({
      action: 'cancelTimer'
    });
    
    // Update UI
    startTimerButton.style.display = 'block';
    cancelTimerButton.style.display = 'none';
    statusDiv.textContent = 'Timer cancelled';
    statusDiv.className = 'status inactive';
    
    // Clear storage
    chrome.storage.local.set({
      timerActive: false,
      endTime: null
    });
  });
  
  function updateUIForActiveTimer(endTime) {
    startTimerButton.style.display = 'none';
    cancelTimerButton.style.display = 'block';
    
    const remainingTime = Math.max(0, endTime - Date.now());
    const remainingHours = Math.floor(remainingTime / (1000 * 60 * 60));
    const remainingMinutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const remainingSeconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
    
    statusDiv.textContent = `Timer active: ${remainingHours}h ${remainingMinutes}m ${remainingSeconds}s remaining`;
    statusDiv.className = 'status active';
    
    // Update the countdown every second
    if (remainingTime > 0) {
      setTimeout(function() {
        updateUIForActiveTimer(endTime);
      }, 1000);
    }
  }
});