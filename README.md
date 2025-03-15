# Sleep Time Show Stopper

This repository contains two versions of a solution to automatically pause videos after a set time:

1. **Python Script**: A script that uses PyAutoGUI to control the mouse and keyboard
2. **Chrome Extension**: Two versions of a browser extension that pauses videos directly

## 1. Python Script (main.py)

A simple Python script that waits for a specified time, then moves the mouse, clicks, and presses ESC to pause a video and exit fullscreen mode.

### Requirements

- Python 3.x
- PyAutoGUI library (`pip install pyautogui`)

### Usage

```bash
python main.py
```

The script will wait for the configured time (default: 0.6 hours), then perform the actions.

## 2. Chrome Extensions

Two versions of Chrome extensions are included:

### Version 1: Sleep Time Show Stopper (extension directory)

The original extension that pauses videos and exits fullscreen after a set time.

Key features:
- Set a timer up to 5 hours
- Automatically pause playing videos
- Exit fullscreen mode when timer expires
- Works with most standard video players and streaming sites

### Version 2: Simple Video Pauser (simple_video_pauser directory)

An enhanced version that includes screenshot capabilities, allowing you to:
- Take screenshots when videos are paused
- Take manual screenshots at any time
- View and manage screenshots from the extension popup

## Installation Instructions

### For Chrome Extensions:

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top-right corner
3. Click "Load unpacked" and select either:
   - The `extension` directory for the original extension
   - The `simple_video_pauser` directory for the enhanced version

### For the Python Script:

1. Ensure you have Python installed
2. Install PyAutoGUI: `pip install pyautogui`
3. Run the script: `python main.py`

## Usage Instructions

### Original Extension:
1. Click the extension icon in the Chrome toolbar
2. Enter the desired hours and minutes for the timer
3. Click "Start Timer"
4. Continue watching your video
5. When the timer expires, the video will pause and exit fullscreen mode

### Simple Video Pauser:
1. Click the extension icon
2. Enter timer duration
3. Choose whether to take a screenshot when pausing
4. Click "Start Timer"
5. View your screenshots in the extension popup

## Comparison

| Feature | Python Script | Original Extension | Simple Video Pauser |
|---------|--------------|-------------------|-------------------|
| System Access | Controls mouse and keyboard | Browser-only access | Browser-only access |
| Setup | Requires Python and dependencies | No dependencies | No dependencies |
| Flexibility | Works with any application | Browser videos only | Browser videos only |
| Reliability | May be affected by window focus | More reliable for web videos | More reliable for web videos |
| Screenshots | No | No | Yes |
| Custom Timer | Fixed in code | Up to 5 hours | Up to 5 hours |

## Recommended Option

The **Simple Video Pauser** Chrome extension (in the `simple_video_pauser` directory) is recommended for most users because it:
- Doesn't require any programming knowledge
- Works directly in the browser
- Includes screenshot capabilities
- Is more reliable for web-based videos

## Repository Structure
```
.
├── README.md                        # This file
├── main.py                          # Python script version
├── extension                        # Original extension files
│   ├── manifest.json                # Extension configuration
│   ├── popup.html                   # Timer UI
│   ├── popup.js                     # Timer logic
│   ├── background.js                # Core timer functionality
│   ├── content.js                   # Video playback control
│   └── images                       # Extension icons
├── simple_video_pauser              # Enhanced extension with screenshots
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.js
│   ├── background.js
│   ├── content.js
│   └── images
```
