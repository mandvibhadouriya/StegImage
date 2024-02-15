# Use wave package (native to Python) for reading the received audio file
import wave
import sys 
from Crytpography import encoding
import os
# read wave audio file
carrier_dest=os.getcwd()+'\\uploads\\'
carrier_audio= sys.argv[1]
data= sys.argv[2]
key = sys.argv[3]

string = encoding(data,key)
song = wave.open(carrier_dest+carrier_audio, mode='rb')
# Read frames and convert to byte array
frame_bytes = bytearray(list(song.readframes(song.getnframes())))

# The "secret" text message
# Append dummy data to fill out rest of the bytes. Receiver shall detect and remove these characters.
string = string + int((len(frame_bytes)-(len(string)*8*8))/8) *'#'
# Convert text to bit array
bits = list(map(int, ''.join([bin(ord(i)).lstrip('0b').rjust(8,'0') for i in string])))

# Replace LSB of each byte of the audio data by one bit from the text bit array
for i, bit in enumerate(bits):
    frame_bytes[i] = (frame_bytes[i] & 254) | bit
# Get the modified bytes
frame_modified = bytes(frame_bytes)

# Write bytes to a new wave audio file
with wave.open(carrier_dest+'enc'+carrier_audio, 'wb') as fd:
    fd.setparams(song.getparams())
    fd.writeframes(frame_modified)
song.close()