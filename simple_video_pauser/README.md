# Simple Video Pauser

A Chrome extension that automatically pauses videos after a specified time and can capture screenshots.

## Features

- Set a timer to automatically pause videos after a specified number of minutes
- Capture screenshots when videos are paused or manually at any time
- Store and manage recent screenshots
- Works with most video platforms including YouTube, Netflix, and standard HTML5 video players

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top-right corner
3. Click "Load unpacked" and select the `simple_video_pauser` folder

## Usage

### Video Pausing

1. Click on the extension icon in your Chrome toolbar
2. Enter the number of minutes you want to wait before pausing the video
3. Optionally enable/disable screenshot capture
4. Click "Start Timer"
5. Go to a website with a video (like YouTube, Netflix, etc.) and play the video
6. The extension will automatically pause the video after the specified time

### Screenshot Features

- **Automatic Screenshots**: By default, the extension will take a screenshot when it pauses a video. You can toggle this feature on/off.
- **Full Page Screenshots**: Optionally capture the entire page instead of just the visible portion.
- **Manual Screenshots**: Click "Take Screenshot Now" to capture the current tab immediately.
- **Screenshot Management**: View or delete recent screenshots directly from the extension popup.

## Screenshot Options

- **Take screenshot when pausing**: Automatically capture a screenshot when the timer expires and the video is paused
- **Capture full page**: Capture the entire webpage, not just the visible portion (note: this is a simplified implementation)
- **View**: Open the screenshot in a new tab
- **Delete**: Remove the screenshot from storage

## Testing Steps

1. Install the extension as described above
2. Go to YouTube (https://www.youtube.com) and find a video to watch
3. Start the video and make it fullscreen if desired
4. Click on the extension icon and set a short timer (e.g., 1 minute)
5. Make sure "Take screenshot when pausing" is checked
6. Click "Start Timer" and observe the countdown
7. When the timer expires, the extension should:
   - Capture a screenshot
   - Pause the video
   - Exit fullscreen mode (if in fullscreen)
8. Click on the extension icon again to view the captured screenshot

## Technical Details

The screenshot feature uses the Chrome `tabs.captureVisibleTab` API to capture what's currently visible in the browser. The full page capture is a basic implementation and may not capture content outside the viewport in all cases.

## Troubleshooting

If the extension doesn't work properly:

1. Check the browser console for error messages:
   - Right-click anywhere on the page and select "Inspect"
   - Click on the "Console" tab
   - Look for messages from "Simple Video Pauser"

2. Make sure the extension has the necessary permissions:
   - Go to `chrome://extensions/`
   - Click on "Details" for the Simple Video Pauser extension
   - Ensure "Site access" is set to "On all sites"

3. Try refreshing the page after starting the timer

4. If screenshots aren't working:
   - Make sure you're on a regular web page (not a chrome:// or extension page)
   - Try using the manual screenshot button to see if that works
   - Check the console for any screenshot-related errors