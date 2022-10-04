
## Ray Tracing Display Example
by Shen Fang
https://a4-francarsen.glitch.me

This project renders spheres and planes into image on canvas using ray tracing
User can use control pane to modify the color and positions to two separate balls 
and the reflection/shadow would update with it

I implemented webgl through canvas to display the 3D ray tracing scene

The difficulty I faced was getting the image refreshing every time the value gets updated
When I try to render to canvas every frame, my graphic card is overloading for the amount of calculation
and the tweak pane doesn't have any update function to call from
So, I decided to compare variable values of each frame to that of the previous frame, and only render when it changes
