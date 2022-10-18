let curGrid = []
let nextGrid = []
let sideLength = 20
let canvasLength = 400
let disableRClick = false
let running = false
let delay = 250

function main(){
  const canvas = window.document.getElementById("canvas")
  const context = canvas.getContext("2d")
  
  resetGrid(context)
  
  window.onmousedown = function(event){
    let button = event.button
    let pos = getMousePos(canvas, event)
    
    switch(button){
        //case for left click
      case 0:
        
        if (pos.x >= 0 && pos.x <= canvasLength && pos.y >= 0 && pos.y <= canvasLength){
          let roundX = pos.x - (pos.x % sideLength)
          let roundY = pos.y - (pos.y % sideLength)
          context.fillStyle = "green"
          context.fillRect(roundX, roundY, sideLength, sideLength)
          initGrid(context)
          curGrid[roundX / sideLength][roundY / sideLength] = 1
        }
        break;
        case 2:
        
        if (pos.x >= 0 && pos.x <= canvasLength && pos.y >= 0 && pos.y <= canvasLength){
          disableRClick = true
          let roundX = pos.x - (pos.x % sideLength)
          let roundY = pos.y - (pos.y % sideLength)
          context.fillStyle = "grey"
          context.fillRect(roundX, roundY, sideLength, sideLength)
          initGrid(context)
          curGrid[roundX / sideLength][roundY / sideLength] = 0
        }else{
          disableRClick = false
        }
        break;
    }
  }
  
  window.onkeydown = function(event){
    let key = event.key
    switch(key){
      case 's':
        //Start simulation
        running = true
        runSim(context)
        break;
      case 'p':
        //Pause simulation
        running = false
        break;
      case 'r':
        resetGrid(context)
        break;
    }
  }
  
  
  window.addEventListener('contextmenu', function (e) {
    if(disableRClick){
    e.preventDefault();
    }
  }, false);
}

function initGrid(context){
  //draw vertical lines
  for(let i = sideLength; i < canvasLength; i += sideLength){
    context.beginPath()
    context.moveTo(0, i)
    context.lineTo(canvasLength, i)
    context.strokeStyle = "#000000"
    context.stroke()
  }
  
  //draw horizontal lines
  for(let i = sideLength; i < canvasLength; i += sideLength){
    context.beginPath()
    context.moveTo(i, 0)
    context.lineTo(i, canvasLength)
    context.stroke()
  }
}

function initArray(){
  curGrid = new Array(sideLength).fill(0).map(() => new Array(sideLength).fill(0));
  nextGrid = new Array(sideLength).fill(0).map(() => new Array(sideLength).fill(0));
}

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

function resetGrid(context){
  running = false
  context.fillStyle = "grey";
  context.fillRect(0, 0, canvasLength, canvasLength);
  
  initGrid(context)
  initArray()
}

function updateGrid(context){
  for(let x = 0; x < sideLength; x++){
    for(let y = 0; y < sideLength; y++){
      let neighbors = 0
      if(x == 0 && y == 0){                                 //Top Left
        
        neighbors = curGrid[x+1][y] + 
                    curGrid[x+1][y+1] + 
                    curGrid[x][y+1]
        
      }else if(x == sideLength - 1 && y == sideLength - 1){ //Bottom Right
        
        neighbors = curGrid[x-1][y] + 
                    curGrid[x-1][y-1] + 
                    curGrid[x][y-1]
        
      }else if(x == 0 && y == sideLength - 1){              //Bottom Left
        
        neighbors = curGrid[x+1][y] + 
                    curGrid[x+1][y-1] + 
                    curGrid[x][y-1]
        
      }else if(x == sideLength - 1 && y == 0){              //Top Right
        
        neighbors = curGrid[x-1][y] + 
                    curGrid[x-1][y+1] + 
                    curGrid[x][y+1]
        
      }else if(x == 0){                                     //Left Column
        
        neighbors = curGrid[x+1][y] + 
                    curGrid[x+1][y-1] + 
                    curGrid[x][y-1] + 
                    curGrid[x+1][y+1] + 
                    curGrid[x][y+1]
        
      }else if(y == 0){                                     //Top Row
        
        neighbors = curGrid[x+1][y] + 
                    curGrid[x+1][y+1] + 
                    curGrid[x][y+1] + 
                    curGrid[x-1][y] + 
                    curGrid[x-1][y+1]
        
      }else if(x == sideLength - 1){                        //Right Column
        
        neighbors = curGrid[x-1][y] + 
                    curGrid[x-1][y+1] + 
                    curGrid[x][y+1] + 
                    curGrid[x-1][y-1] + 
                    curGrid[x][y-1]
        
      }else if(y == sideLength - 1){                        //Bottom Row
        
        neighbors = curGrid[x-1][y] + 
                    curGrid[x-1][y-1] + 
                    curGrid[x][y-1] + 
                    curGrid[x+1][y] + 
                    curGrid[x+1][y-1]
        
      }else{                                                //Central
        
        neighbors = curGrid[x-1][y] + 
                    curGrid[x-1][y-1] + 
                    curGrid[x][y-1] + 
                    curGrid[x+1][y] + 
                    curGrid[x+1][y-1] + 
                    curGrid[x-1][y+1] + 
                    curGrid[x+1][y+1] + 
                    curGrid[x][y+1]
        
      }
      switch(curGrid[x][y]){
        case 0:
          if(neighbors == 3){
            nextGrid[x][y] = 1
          }else{
            nextGrid[x][y] = 0
          }
          break;
        case 1:
          if(neighbors == 2 || neighbors == 3){
            nextGrid[x][y] = 1
          }else{
            nextGrid[x][y] = 0
          }
      }    
    }
  }
  swapGrids()
  drawGrid(context)
}

function drawGrid(context){
  for(let i = 0; i < sideLength; i++){
    for(let j = 0; j < sideLength; j++){
      if(curGrid[i][j] == 1){
        context.fillStyle = "green"
        context.fillRect(i * sideLength, j * sideLength, sideLength, sideLength)
      }else{
        context.fillStyle = "grey"
        context.fillRect(i * sideLength, j * sideLength, sideLength, sideLength)
      }
    }
  }
  initGrid(context)
}

async function runSim(context){
  while(running){
    updateGrid(context)
    
    await wait()
  }
}

function swapGrids(){
  for(let i = 0; i < sideLength; i++){
   for(let j = 0; j < sideLength; j++){
      curGrid[i][j] = nextGrid[i][j]
    }
  }
}

function wait() {
  console.log("waiting")
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved');
    }, delay);
  });
}






