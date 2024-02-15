# Use wave package (native to Python) for reading the received audio file
import wave
import sys 
from Crytpography import decoding
import os 

carrier_dest=os.getcwd()+'\\uploads\\'
carrier_audio = sys.argv[1]
key = sys.argv[2]

song = wave.open(carrier_dest+carrier_audio, mode='rb')
# Convert audio to byte array
frame_bytes = bytearray(list(song.readframes(song.getnframes())))

# Extract the LSB of each byte
extracted = [frame_bytes[i] & 1 for i in range(len(frame_bytes))]
# Convert byte array back to string
string = "".join(chr(int("".join(map(str,extracted[i:i+8])),2)) for i in range(0,len(extracted),8))
# Cut off at the filler characters
decoded = string.split("###")[0]

# Print the extracted text
print(decoding(decoded,key))
song.close()