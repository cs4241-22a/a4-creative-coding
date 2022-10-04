
Reagan Brunelle

## US Population 1960-2021

glitch link

This project uses d3.js and other smaller js data visualization techniques to create a few data displays for the US population since 1960, and show that although the population is growing, the rate of growth is slowing down. The first is a bar chart race of the population growth in each decade. It is noticable that the 1990s grows faster than the others. Also not that the 2020s uses mostly predicted values. The start and end year can be selected using tweakpane, as well as the step which will speed it up. Below the bar race, we can see the changes in rate of growth which confirms a peak in rate of increase in the 90s and a heavy decrease in rate of growth this century. Next, there is a continuous population growth graph to show that on a large scacle, poulation growth appears linear, but if a closer look is taken, the spike in the 90s and hault in the 2020s is evident. Lastly, all specific population values per year are displayed at the bottom using a simple svg bar chart. The color of this chart can be changed using the tweakpane as well.

One of the hardest parts of using d3 was the differences between versions 3 and 4. I went with version 4, but many exmaples were in version 3, so I was very confused why I couldn't get basic functions to work sometimes. Additionally, reading json data from an external json file was difficult at first.

Additional Instructions:
- The start and end years do not correlate to actual years, but the cadence in the decades. It will stop one after the selected end. 
- color should only affect that last bar graph