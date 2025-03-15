#!/usr/bin/env python3
"""
Sleep Time Show Stopper
-----------------------
A simple Python script to pause videos and exit fullscreen mode after a set time.
"""

import time
import pyautogui
import sys
import argparse
from datetime import datetime, timedelta

def wait_and_pause_video(hours=0.6, test_mode=False):
    """
    Wait for the specified number of hours, then move the mouse,
    click, and press ESC to pause a video and exit fullscreen mode.
    
    Args:
        hours (float): Number of hours to wait
        test_mode (bool): If True, waits only 3 seconds instead of the specified hours
    """
    # Calculate wait time in seconds
    wait_time = 3 if test_mode else hours * 60 * 60
    
    # Calculate and display end time
    end_time = datetime.now() + timedelta(seconds=wait_time)
    print(f"Timer set for {'test mode (3 seconds)' if test_mode else f'{hours} hours'}")
    print(f"Video will be paused at approximately: {end_time.strftime('%H:%M:%S')}")
    
    try:
        # Wait for the specified time
        print(f"Waiting... Press Ctrl+C to cancel.")
        time.sleep(wait_time)
        
        # Get the current screen size
        screen_width, screen_height = pyautogui.size()
        
        # Move mouse to center of screen
        print("Moving mouse to center of screen...")
        pyautogui.moveTo(screen_width // 2, screen_height // 2)
        
        # Click to pause video
        print("Clicking to pause video...")
        pyautogui.click()
        
        # Wait a moment
        time.sleep(0.5)
        
        # Press ESC to exit fullscreen
        print("Pressing ESC to exit fullscreen...")
        pyautogui.press('esc')
        
        print("Done! Video should be paused and fullscreen exited.")
        
    except KeyboardInterrupt:
        print("\nOperation cancelled by user.")
        sys.exit(0)
    except Exception as e:
        print(f"An error occurred: {e}")
        sys.exit(1)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Pauses video and exits fullscreen after a set time")
    parser.add_argument("--hours", type=float, default=0.6, 
                      help="Number of hours to wait before pausing (default: 0.6)")
    parser.add_argument("--test", action="store_true", 
                      help="Test mode: wait only 3 seconds instead of full duration")
    
    args = parser.parse_args()
    
    wait_and_pause_video(args.hours, args.test)