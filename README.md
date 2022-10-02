# STL TO ASCII CONVERTER

## Hosting link: http://a4-arman-saduakas.glitch.me

The goal of this application is to easily create cool ASCII art from STL files. STL files are a way to represent a model in 3D space and are also utilized in 3D printing. The application is written in JavaScript and uses the three.js library to render the STL files. The application also utilizes Vite for modules/package control and html2canvas library for screenshot purposes. The user can upload an STL file and the application will render it in 3D ASCII. The user can then rotate the model either with their mouse or the rotate button, and take a screenshot of the model. The user can also zoom in and out with their mouse as well. Furthermore, the user can input text symbols and the model will be re-rendered using those symbols. In order to reset the ASCII symbols back to default there is a reset button. The application also has a download button and a "Copy to clipboard" that allows the user to download the screenshot as a JPG file or just copy the ASCII as text straight to their clipboard. 
The challenges that I've faced throughout the development of this application were mainly related to the rendering of the STL files. The three.js library is very powerful and has a lot of features, but it is also very complex and requires a lot of time to learn. I've also faced some issues with the html2canvas library, but I was able to solve them by reading the documentation and experimenting with the library.