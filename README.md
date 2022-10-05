## Circular Modular Audio Visualizer

Mark Renzi
https://a4-mark-renzi.glitch.me

Include a very brief summary of your project here. Images are encouraged when needed, along with concise, high-level text. Be sure to include:

- The application was designed to learn mroe about audio visualization from raw frequency data using WebAudio and Canvas. This class is the first time I've used html, css, or js, so this was a really good excuse for me to learn a lot about them and I enjoyed the project.
- The biggest challenges I faced were designing an algorithm that smoothly drew a path between points using quadraticCurveTo() so that I could avoid dynamically defining control points of bezier curves. I originally designed the visualizer drawing rectangles in a circle, which was nice to rotate the matrix, but using a path, I needed to convert polar coordinates to cartesian coordinates, and this took hours to get working perfectly, especially when I wanted to smooth the gaps between the points. Eventually the final challenge was some learning required to use a fade-in transition through css on my HUD, or settings menu.
- I wanted the main screen to be as simple as possible. It says click to start, and then explains that you can click or tap anywhere else to show/hide settings. The settings are names somewhat descriptively but the most interesting part of this app is testing what everything does. I recommend testing all of the themes before even touching the colors or adjustment sliders.

- There are so many fun combinations, but the stylized theme with the white background has to be my favorite:
  ![Stylized theme with white background](https://cdn.discordapp.com/attachments/121797037942374400/1027356026535682048/Screenshot_109.png)
