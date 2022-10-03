# a4-jacob-vansteyn
## Creative Coding: Interactive Multimedia Experiences
### Canvas Audio Visualizer Demo

https://a4-jacob-vansteyn.herokuapp.com/

A demonstration of using the html canvas object and javascript to display a simple 2d audio visualizer.
I chose to use the song "Heavenly Father" by Bon Iver for this project.
The player implements audio controls and a canvas to display the visualizer which includes:
  - Real-time visualization of audio output
  - Color coded frequency bars (by decibel)
  - Spline (smoothed) line for maximum decibals for all frequencies
  - Bootstrap components for layout
  - Express backend

The challenges I faced were fairly minimal in this project. The main hurdle was learning how to interact with the canvas through JS and figuring out how to perform more complex interaction & generate splines.
For the splines, an actual smoothing alrorithm gets complex quickly, so I chose to use a "hacky" shortcut and estimate node positions instead of trying to explicitly go through points.

Use instructions:
Simply play the audio using the media controls. Scrubbing resets the frame in real-time to update the visualizer.