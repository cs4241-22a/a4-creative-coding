var theme = "default";
var size = "default";
var direction = "default";
var color = "default";
var height = "default";
var background = "default";
var audio = document.getElementById("audio");
audio.src = "https://cdn.glitch.global/a380b1ae-c608-4abb-85e6-10fadca576e1/BTS%20(%EB%B0%A9%ED%83%84%EC%86%8C%EB%85%84%EB%8B%A8)%20-%20Black%20Swan%20(Instrumental%20by%20NUMERO).mp3?v=1664659706427"
audio.crossOrigin = "anonymous";

var context = new AudioContext();
var src = context.createMediaElementSource(audio);
var analyser = context.createAnalyser();

//canvas
var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");

src.connect(analyser);
analyser.connect(context.destination);

analyser.fftSize = 256;

var bufferLength = analyser.frequencyBinCount;
console.log(bufferLength);

var dataArray = new Uint8Array(bufferLength);

var WIDTH = canvas.width;
var HEIGHT = canvas.height;

var barWidth = (WIDTH / bufferLength) * 2.5;
var barHeight;
var x = 0;

var playPromise = audio.play();
console.log(playPromise);

function renderFrame() {
  requestAnimationFrame(renderFrame);
  
  x = 0;
  
  analyser.getByteFrequencyData(dataArray)
  
  //background color options
  if(background === "skyBlue") {
    ctx.fillStyle = "#87CEEB";
  } else if (background === "goldenYellow") {
    ctx.fillStyle = "#FFC000";
  } else if (background === "darkOrange") {
    ctx.fillStyle = "#FF8C00";
  } else {
    ctx.fillStyle = "#000";
  }
  
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  
  //sizes of bars on frame
  if(size === "large") {
    barWidth = (WIDTH / bufferLength) * 7;
  } else if(size === "medium") {
    barWidth = (WIDTH / bufferLength) * 5;
  } else if (size === "small") {
    barWidth = WIDTH / bufferLength;
  } else {
    barWidth = (WIDTH / bufferLength) * 2.5;
  }
  //height bars can go to
  for (var i = 0; i < bufferLength; i++) {
    if (height === "high") {
      barHeight = dataArray[i] * 2.5;
    } else if (height === "low") {
      barHeight = dataArray[i] * 0.5;
    } else if (height === "medium") {
      barHeight = dataArray[i] *  1.5;
    }
      else {
      barHeight = dataArray[i];
    }
    
    var r = 255;
    var g = 255;
    var b = 255;
    
    //color gradients
    if(color === "low") {
      r = (i / bufferLength) * 500;
      g = (i / bufferLength) * 500;
      b = (i / bufferLength) * 500;
    } else if (color === "high") {
      r = (i / bufferLength) * 1000;
      g = (i / bufferLength) * 1000;
      b = (i / bufferLength) * 1000;
    }
    //themes for bars
    if (theme === "summer") {
      if (color === "low") {
        r = barHeight + 250 * (i / bufferLength);
        g = 250 * (i / bufferLength);
        b = 0;
      } else if (color === "high") {
        r = barHeight + i / bufferLength;
        g = i / bufferLength;
        b = 50;
      } else {
        r = barHeight + 25 * (i / bufferLength);
        g = 250 * (i / bufferLength);
        b = 50;
      }
    } else if (theme === "winter") {
      if (color === "low") {
        r = 0;
        g = 250 * (i / bufferLength);
        b = barHeight + 250 * (i / bufferLength);
      } else if (color === "high") {
        r = 50;
        g = i / bufferLength;
        b = barHeight + i / bufferLength;
      } else {
        r = 50;
        g = 250 * (i / bufferLength);
        b = barHeight + 25 * (i / bufferLength);
      } 
    }
    
    ctx.fillStyle = "rgb(" + r + ", "+ g + ", " + b + ")";
  
    //direction bars are going in on frame
    if (direction === "top") {
      ctx.fillRect(x, 0, barWidth, barHeight);
    } else if (direction === "center") {
      ctx.fillRect(x, HEIGHT / 2 - barHeight / 2, barWidth, barHeight);
    } else {
      ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
    }
    
    x += barWidth + 1;
    
  }
  
}


//alert box and loading everything in window
window.onload = function() {
  alert ("An audio visualizer for the instrumental of Black Swan by BTS. You can modify different things on the display. Press the Load button after making changes. Also press load if frame doesn't appear at first.");
  document.getElementById("load").addEventListener("click", function() {
    theme = document.getElementById("theme").value;
    size = document.getElementById("size").value;
    direction = document.getElementById("direction").value;
    color = document.getElementById("color").value;
    height = document.getElementById("height").value;
    background = document.getElementById("background").value;
    
    context.resume().then(() => {
      renderFrame();
      console.log("Playback resumed: successfully");
    });
  });
  
  if (playPromise !== undefined) {
    playPromise
    .then(_ => {
      audio.load();
      audio.play();
      renderFrame();
    });
    playPromise.catch(error => {
      alert("click the load button after modifying any of the categories")
    });
  }
  
  var help = document.getElementById("help");
  help.onclick = function() {
    alert("An audio visualizer for the instrumental of Black Swan by BTS. You can modify different things on the display. Press the Load button after making changes. Also press load if frame doesn't appear at first.")
  }
}