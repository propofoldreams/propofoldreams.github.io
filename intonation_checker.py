import sounddevice as sd
import numpy as np

# 1. Setup our audio settings
# 44100 is the standard sample rate (how many times a second the mic checks the sound)
SAMPLE_RATE = 44100 
# We process the sound in small chunks so the computer doesn't get overwhelmed
BLOCK_SIZE = 2048   

# 2. Create a function to handle the audio chunks
def listen_to_chunk(indata, frames, time, status):
    """This function runs automatically every time the mic captures a chunk of sound."""
    if status:
        print(f"Mic status: {status}")
    
    # Let's calculate the volume of the chunk just to test that the mic is working
    # indata is a list of numbers representing the sound waves
    volume = np.linalg.norm(indata) * 10
    
    # If the volume is high enough, we know you are playing!
    if volume > 1.0:
        print(f"I hear you! Volume is at {volume:.2f}")
    else:
        print("Quiet...")

# 3. Turn on the microphone
print("Starting the microphone...")

# This block opens the mic and connects it to our 'listen_to_chunk' function
with sd.InputStream(callback=listen_to_chunk, channels=1, samplerate=SAMPLE_RATE, blocksize=BLOCK_SIZE):
    print("Microphone is on! Play a note.")
    print("Press the ENTER key to stop the program.\n")
    input() # This keeps the program running until you press Enter