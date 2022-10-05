
## 3D Boids

Link to my website: https://cjacobson32.github.io/cs4241_Assignment_4/

This project is a 3d simulation of boids with flocking behavior. You can use the gizmo to move a cursor around and repel
the boids as they fly.

### Challenges
I had an initial understanding of the algorithm for flocking boids in 2D, however converting these to 3D in the notation
Babylon JS was not trivial. Babylon ended up having several technicalities such as simulation-time and render-time being
separate. This meant I had to handle position/velocity updates separate from the viewport's framerate. This was a major
shift to ways in which I had previously implemented this algorithm which was tied to the viewport's framerate.

There were also some struggles I had with performance. This app initially ran at about 2fps on my machine. A major
optimization I implemented was chunking. Each boid initially had to check their distance from every other boid on the
screen. This resulted in an `O(n^2)` runtime. To improve this, I divided the scene into a 3d grid of cubic chunks whose
side length was the same as the max distance boids would detect one another. This way boids would only have to check their
chunks and their neighboring chunks. This increased the performance by an order of magnitude, I started getting 30fps or
more.

I did have a system for rendering the chunks to the viewport to demonstrate how the optimization worked, but it lagged
the whole scene far more than the boids did, so I opted not to include it in the submission.

