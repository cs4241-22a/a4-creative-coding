A4 - Creative Coding
===
## Yinuo Zhao - Avicii Visualiser

https://aviciivisualiser.herokuapp.com/

This application allows the user to visualise the audio progression on the song "Without You" by Avicii.

The user is allowed to control the music via play/pause, volume, and playback speed, while also being able to interact 
with the visualiser itself and change its colours.

I found this assignment to be rather challenging in that a lot of the WebAudio and Canvas js functions I was unfamiliar 
with and had to learn on the spot. The tutorial link provided on GitHub helped with this process however and I was soon
able to use the Canvas music API to draw out a visualiser for any song file uploaded within the public directory. 
It was however still a challenge to get the bars just right with the Canvas API, and a lot of trial and error was used
to achieve the final outcome. Trying to find out how to make the visualiser bars stop when the music was paused
was also a big obstacle to overcome.


## Input Parameters for User Control
- Start and Stop buttons for User to control music and visualiser output
- Playback Volume adjuster slider to control music volume
- 4 Colour selectors that change each corresponding bar section in the visualiser
- Playback Speed adjuster slider to control playback speed (works quite well with Avicii)