## mUSIC OF THE PEERS

A Browser based geneartive music experience 

### stack
Javascript / Electron / A-Frame / 

### install run 

-open terminal and type npm install
- open shell and generate key. This generates a key for ssl for a year. To regenerate run the command again.
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem

#### test locally
Terminal write command (make sure cert is generated^)
- npm run dev 

#### Electron builds

Terminal write command
- npm run dist

To create a distribution build with electron (Windows, Linux, Mobile App (Android / Apple)) Not fully tested for all build types yet. Build is of the public folder with entry point index.html (The entry point for your game)

### Componenets:
aframe-particle-system-component
aframe-play-sound-on-event

