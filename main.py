import pyautogui
import time
import sys

def main():
    # Wait for the set time (0.6 * 60 * 60 seconds)
    print("Script started. Will perform actions after 0.6 hour.")
    print(f"Current time: {time.strftime('%H:%M:%S')}")
    print(f"Will execute at: {time.strftime('%H:%M:%S', time.localtime(time.time() + 0.6 * 60 * 60))}")
    
    time.sleep(0.6 * 60 * 60)  # 0.6 hours in seconds
    
    # Get current mouse position
    current_x, current_y = pyautogui.position()
    
    # Move mouse slightly (10 pixels to the right)
    pyautogui.moveTo(current_x + 10, current_y, duration=0.5)
    print("Mouse moved")
    
    # Wait a moment
    time.sleep(0.5)
    
    # Click to pause video
    pyautogui.click()
    print("Mouse clicked")
    
    # Wait a moment
    time.sleep(0.5)
    
    # Press ESC to exit fullscreen
    pyautogui.press('esc')
    print("ESC key pressed")
    
    print("All actions completed. Exiting script.")
    
    # Exit the script
    sys.exit()

if __name__ == "__main__":
    # Add a small delay to allow user to switch to the correct window if needed
    print("Starting in 5 seconds. Switch to your video window now.")
    for i in range(5, 0, -1):
        print(f"{i}...")
        time.sleep(1)
    
    main()