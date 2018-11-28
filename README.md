## capstone-2018
This was my senior capstone project. It's pretty buggy and the code is poorly written. It wasn't made to be maintainable, scalable, or readable. You've been warned.

### Server Setup
The web server (nginx) runs on docker, so you only need to have docker installed on the server side. You'll need to modify `capstone.nginx.conf` to reverse-proxy to the device that's sniffing the WLAN frames.
I have an ansible playbook that configures the server to how it stood my demo. It's made to configure an Amazon linux instance. You'll need to run the self-signed cert generation script, requiring OpenSSL to be installed. You could also modify the `docker-compose.yml` to throw an existing cert/key into the container.

### Sniffer Setup
You will need 2 wifi cards to run the sniffer code. One wifi card will sniff wifi packets promiscuously in monitor mode (hindering the ability to maintain a wifi connection) and the other will be connected to wifi to communicate with the server.

`server.py` may need to be modified to set your desired wifi card into monitor mode. Your specific distro may do this differently. 

**The login is bogus. It was merely implemented as a mock up for a demonstration. The username is root and the password is "capstone".**
  
