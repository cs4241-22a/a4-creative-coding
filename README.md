## Mandelbrot Set Visualizer

Link: https://a4-siddhartha-pradhan.glitch.me/

- The goal of this application is to generate a colorful mandelbrot set based on user input. Users can select various colors and parameters to alter the generation of the mandelbrot set.
- The largest challege I faced was trying to imporve the performance of the render function, which has to loop over each visible pixel and perform multiple iterations of calculation on each pixel (based on max_iteration). 
  - One significant area of performance hindering was being caused by the use of squareroot, which I later removed and utilized the squared value instead
  - Web Workers have been used to improve performance and have multithreading support.
- The instructions are given on the website. Please note that the mandelbrot set generation takes time and may cause the website to appear frozen for a couple seconds. (This can be improved by utilizing optimizations for this generative algorithm, for example utilizing the fact that the set is reflective on x-axis, using fast-rendering techniques (by creating pixel array, rather than drawing 1 pixel at a time))
