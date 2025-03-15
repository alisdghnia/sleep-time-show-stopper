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

### Version 1: Sleep Time Show Stopper (root directory)

The original extension that pauses videos and exits fullscreen after a set time.

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
   - The root directory for the original extension
   - The `simple_video_pauser` directory for the enhanced version

### For the Python Script:

1. Ensure you have Python installed
2. Install PyAutoGUI: `pip install pyautogui`
3. Run the script: `python main.py`

## Comparison

| Feature | Python Script | Chrome Extension |
|---------|--------------|------------------|
| System Access | Controls mouse and keyboard | Browser-only access |
| Setup | Requires Python and dependencies | No dependencies |
| Flexibility | Works with any application | Browser videos only |
| Reliability | May be affected by window focus | More reliable for web videos |
| Screenshots | No | Yes (in enhanced version) |

## Recommended Option

The **Simple Video Pauser** Chrome extension (in the `simple_video_pauser` directory) is recommended for most users because it:
- Doesn't require any programming knowledge
- Works directly in the browser
- Includes screenshot capabilities
- Is more reliable for web-based videos

## License

MIT License