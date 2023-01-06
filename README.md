# Interactive Sphere-ish Visualizer

[https://2usvrz.csb.app/](https://2usvrz.csb.app/)

Note: The project name is a4-cindy-trac. However, codesandbox does not allow me to change the hosting link. I started the assignment by playing around with an example on codesandbox and then struggled to move it over to Glitch. Although I did not use Glitch for hosting, you can still see all the files I authored at this [link](https://codesandbox.io/s/a4-cindy-trac-2usvrz?file=/src/index.js).

## Goal

I used the following frameworks and libraries to a visualizer that allows users to have an interactive experience. The user is able to view and edit a geometric shape. 
- [Three.js](https://threejs.org/): a library for 3D graphics / VR experiences
- [Tweakpane](https://cocopon.github.io/tweakpane/): a compact pane library to edit parameters and monitor value changes
- [WebGL (Web Graphics Library)](https://cocopon.github.io/tweakpane/): a library for rendering interactive 2D and 3D graphics

The user can:
- drag to move the shape
- adjust where the camera is
- change the shape color and toggle its wireframe mode
- adjust the position, rotation, and scale of the shape

## Challenges

- I originally started playing around with the aforementioned libraries on codesandbox.io. By the time I made significant headway, I struggled to migrate the code over to Glitch with an Express server.
- With this assignment, I was already way past the initial due date. It was a struggle to figure out when to be done with the project. I kept wanting to explore the libraries and implement more features. If I had more brain power to dedicate to this project, I would look into allowing the user to change the radius and number of width/height segments of the geometric shape.
- One thing that surprised me was how nice of a tool Tweakpane is. When I last did a computer graphics project, I would manually create buttons or have to set user actions to different keys. Tweakpane streamlines creating a pane to edit and monitor parameters.
