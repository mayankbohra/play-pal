import socket

# Get the local machine name
host_name = socket.gethostname()
local_ip = socket.gethostbyname(host_name)

# Define your REDIRECT_URI based on the environment
if local_ip == "192.168.55.184":  # Your local network IP
    REDIRECT_URI = "http://192.168.55.184:8000/spotify/redirect"
else:  # Fallback to localhost
    REDIRECT_URI = "http://127.0.0.1:8000/spotify/redirect"

CLIENT_ID = "b347d4388ed9467e9a40d1f1211620b7"
CLIENT_SECRET = "3f65a547ec63486a8c7bf8463a25948a"
