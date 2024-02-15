import base64
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.fernet import Fernet, InvalidToken

def ifspaces(message):
    message= message.split()
    if not len(message)==1:
        string='+'.join(message)
        return string  

    return str(message)

def spaceremover(message):
    if '+' in message:
        message=message.split('+')
        print(message)
        return ' '.join(message)
        
        
    return message



def key_gen(password):
    password_provided = password  # This is input in the form of a string
    password = password_provided.encode()  # Convert to type bytes
    salt = b'salt_'  # CHANGE THIS - recommend using a key from os.urandom(16), must be of type bytes
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
        backend=default_backend()
    )
    key = base64.urlsafe_b64encode(kdf.derive(password)) 
    return key 

def encoding(message,password):
    message=ifspaces(message)
    print(message)
    key=key_gen(password)
    f = Fernet(key)
    encrypted = f.encrypt(message.encode()) 
    return encrypted.decode()

def decoding(message,password):
    key = key_gen(password)
    f = Fernet(key)
    try :
        decrypted = f.decrypt(message.encode())
        decrypted = spaceremover(decrypted.decode())
        print(decrypted)
        return decrypted
    
    except InvalidToken as e :
        return 'Invalid Password'
    
   
