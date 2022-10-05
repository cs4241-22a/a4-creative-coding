//Global variables
var state, settings, timestamp, lastTimestamp,
    cvsWidth = 500, cvsHeight = 500;

//Wait for the page to load before starting
window.addEventListener('load', function(){

    //Initialize stuff
    var cvs = document.getElementById('main-canvas');
    cvs.width = cvsWidth;
    cvs.height = cvsHeight;
    cvs.style.width = `${cvsWidth}px`;
    cvs.style.height = `${cvsHeight}px`;
    document.oncontextmenu = (e)=>{e.preventDefault();}
    cvs.addEventListener('mousedown', function(event){
        event.preventDefault();
        var coords = getCursorPosition(cvs, event);
        handleClick(event, coords.x, coords.y);
        return false;
    });
    var ctx = cvs.getContext('2d');
    //ctx.imageSmoothingEnabled = false;

    alert("Welcome! This is a simulation of agents (\"dudes\") that require food to live. Left click to spawn a bunch of bonus food. Right click to delete nearby food and dudes.\n\nModifying the controls below the canvas will change the simulation (hover over the labels to see descriptions). You can get some pretty crazy results, so watch out! The reset button will restart the simulation with your new parameters from the start.");

    function step(){
        if(timestamp == undefined){
            initialize();
        } else {
            timestamp = Date.now();
            var interval = timestamp - lastTimestamp;
            if(interval > settings.maxInterval){
                interval = settings.maxInterval;
            }
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, cvsWidth, cvsHeight);
            run(ctx, interval);
        }
        lastTimestamp = timestamp;
        window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
});

function initialize(){
    //Set initial state of simulation
    timestamp = Date.now();
    state = {
        agents: []
    };
    //Settings to control the simulation
    if(!settings)
    settings = {
        randomFoodChance: 10 / 60,
        minFoodEnergy: 10,
        maxFoodEnergy: 50,
        startingDudes: 10,
        startingDudeEnergy: 100,
        maximumDudeEnergy: 200,
        dudeSpeed: 0.1,
        energyLossRate: 0.1,
        minimumDudeDistance: 10,
        maxInterval: 100,
        maximumEatDistance: 2,
        newDudeEnergyPercentage: 0.5
    };
    //Settings to control the settings
    var metaSettings = {
        randomFoodChance: {
            min: 0,
            max: 1,
            step: 0.05,
            type:'range',
            desc:'The chance for food to randomly spawn per tick',
            readableName:'Random Food Chance'
        },
        minFoodEnergy: {
            desc:'The minimum amount of energy that food can provide',
            readableName:'Minimum Food Energy'
        },
        maxFoodEnergy: {
            desc:'The maximum amount of energy that food can provide',
            readableName:'Maximum Food Energy'
        },
        startingDudes: {
            desc:'The number of dudes to start the simulation with',
            readableName:'Starting Dudes'
        },
        startingDudeEnergy: {
            desc:'The amount of energy a dude starts with',
            readableName:'Starting Dude Energy'
        },
        maximumDudeEnergy: {
            desc:'The amount of energy before a dude splits into two bros',
            readableName:'Maximum Dude Energy'
        },
        dudeSpeed: {
            min: 0,
            max: 2,
            step: 0.05,
            type:'range',
            desc:'The speed of the dudes',
            readableName:'Dude Speed'
        },
        energyLossRate: {
            min: 0,
            max: 2,
            step: 0.05,
            type:'range',
            desc:'The rate at which dudes lose energy (measured by distance, not time)',
            readableName:'Energy Loss Rate'
        },
        minimumDudeDistance: {
            min: 0,
            max: 50,
            type:'range',
            desc:'The minimum distance the dudes will try to stay from each other',
            readableName:'Minimum Dude Distance'
        },
        maxInterval: {    //maxInterval controls the behavior when the page is unfocused; agents jump far when returning focus (ie. jumping outside
            type:'hidden' //the canvas) if this is unbounded, and it's not super interesting to change it when it is bounded, so this isn't user-controllable
        },
        maximumEatDistance: {
            min: 0,
            max: 50,
            type:'range',
            desc:'The maximum distance a dude can eat a food from',
            readableName:'Maximum Eat Distance'
        },
        newDudeEnergyPercentage: {
            min: 0,
            max: 1,
            step: 0.05,
            type:'range',
            desc:'The percentage of its energy that a dude gives up when making a bro (splitting)',
            readableName:'New Dude Energy Percentage'
        }
    };

    //Initialize dudes
    for(var i=0; i<settings.startingDudes; i++){
        state.agents.push(new Dude());
    }

    //Reset settings pane
    var settingsPane = document.getElementById('settings-pane');
    settingsPane.innerHTML = ''; //Clear any existing nodes, eg. if already initialized before
    document.getElementById('reset-button').onclick = initialize; //Use this method of handler assignment to prevent duplicates
    
    //Auto-populate settings pane
    Object.entries(settings).forEach((setting)=>{
        var name = setting[0];
        var value = setting[1];
        var meta = metaSettings[name];
        if(!meta.type){
            meta.type = 'number';
        }
        if(!meta.min){
            meta.min = 0;
        }
        if(!meta.max){
            meta.max = 10000;
        }
        if(!meta.step){
            meta.step = 1;
        }
        if(!meta.desc){
            meta.desc = '';
        }
        if(!meta.readableName){
            meta.readableName = name;
        }
        if(meta.type == 'number' || meta.type == 'range'){
            var settingWrapper = document.createElement('div');
            var setting = document.createElement('input');
            setting.type = meta.type;
            setting.min = meta.min;
            setting.max = meta.max;
            setting.value = value;
            setting.name = name;
            setting.step = meta.step;
            var label = document.createElement('label');
            label.for = name;
            label.innerText = meta.readableName+':';
            label.title = meta.desc;
            setting.addEventListener('change', function(event){
                settings[name] = event.target.value;
                console.log(settings[name]);
                console.log(event.target.value);
            });
            settingWrapper.appendChild(label);
            settingWrapper.appendChild(setting);
            settingsPane.appendChild(settingWrapper);
        } else if(meta.type == 'hidden'){
            //Don't make a settings control
        }
    });
}

function run(ctx, interval){
    if(Math.random() < settings.randomFoodChance){
        state.agents.push(new Food());
    }
    state.agents.forEach(agent => agent.tick(interval));
    render(ctx);
    //console.log(interval);
}

function render(ctx){
    state.agents.forEach(agent => {
        //if(agent instanceof Dude) console.log(agent.color);
        ctx.fillStyle = agent.color;
        //console.log(agent.color);
        ctx.beginPath();
        ctx.arc(agent.x, agent.y, 5, 0, 2 * Math.PI);
        ctx.fill();
    });
}

class Agent {
    x = cvsWidth/2;
    y = cvsHeight/2;
    energy = 0;
    color = 'black';

    moveTowards(target, distance){
        var angle = Math.atan2((target.y - this.y), (target.x - this.x));
        this.x += distance * Math.cos(angle);
        this.y += distance * Math.sin(angle);
        this.energy -= distance * settings.energyLossRate;
    }

    moveAway(target, distance){
        var angle = Math.atan2((target.y - this.y), (target.x - this.x)) + Math.PI;
        this.x += distance * Math.cos(angle);
        this.y += distance * Math.sin(angle);
        this.energy -= distance * settings.energyLossRate;
    }

    move(){
        //Do nothing by default
    }

    tick(interval){
        this.move();
    }

    destroy(){
        var idx = state.agents.findIndex(agent => agent == this);
        state.agents.splice(idx, 1); //Remove this agent from the array of agents
    }
}

class Food extends Agent {
    color = 'green';

    constructor(x, y, energy){
        super(x, y, energy);
        this.x = x || randBetween(0, cvsWidth);
        this.y = y || randBetween(0, cvsHeight);
        this.energy = energy || randBetween(settings.minFoodEnergy, settings.maxFoodEnergy);
        var percentEnergy = (this.energy - settings.minFoodEnergy)/(settings.maxFoodEnergy - settings.minFoodEnergy);
        this.color = `rgb(0, ${Math.round(percentEnergy * 128 + 127)}, 0)`; //Foods with higher energy are brighter green
    }
}

class Dude extends Agent {
    color = 'blue'

    constructor(x, y, energy){
        super(x, y, energy);
        this.x = x || randBetween(0, cvsWidth);
        this.y = y || randBetween(0, cvsHeight);
        this.energy = energy || settings.startingDudeEnergy;
        var percentEnergy = this.energy / settings.maximumDudeEnergy;
        this.color = `rgb(0, 0, ${Math.round(percentEnergy * 128 + 127)})`; //Dudes with higher energy are brighter blue
    }

    tick(interval){
        this.move(interval);

        if(this.energy > settings.maximumDudeEnergy){
            var newDudeEnergy = settings.newDudeEnergyPercentage * this.energy;
            this.energy -= newDudeEnergy;
            state.agents.push(new Dude(this.x + randBetween(10,-10), this.y+ randBetween(10,-10), newDudeEnergy));
        }
        
        if(this.energy <= 0){
            this.destroy();
        }

        //Update color to current color
        var percentEnergy = this.energy / settings.maximumDudeEnergy;
        this.color = `rgb(0, 0, ${Math.round(percentEnergy * 128 + 127)})`;
    }

    move(interval){
        var closestFood = getClosestAgent(this, agent => agent instanceof Food);
        var closestDude = getClosestAgent(this, agent => agent instanceof Dude);
        var moved = false;
        if(closestDude != null && distanceBetween(this, closestDude) < settings.minimumDudeDistance){
            this.moveAway(closestDude, settings.dudeSpeed * interval);
            moved = true;
        }
        if(closestFood != null){
            if(!moved){
                this.moveTowards(closestFood, settings.dudeSpeed * interval);
            }
            if(distanceBetween(this, closestFood) <= settings.maximumEatDistance){
                this.energy += closestFood.energy;
                closestFood.destroy();
            }
        }
    }

    destroy(){
        state.agents.push(new Food(this.x, this.y));
        super.destroy();
    }
}

function randBetween(min, max){
    return Math.floor(Math.random()*(max-min) + min);
}

function distanceBetween(agent1, agent2){
    return Math.sqrt(Math.pow(agent2.x - agent1.x, 2) + Math.pow(agent2.y - agent1.y, 2));
}

function getClosestAgent(source, filter){
    var closestAgent = null;
    var closestAgentDistance = Infinity;
    state.agents.forEach(agent => {
        if(filter(agent) && agent != source){
            if(closestAgent == null || distanceBetween(source, agent) < closestAgentDistance){
                closestAgent = agent;
                closestAgentDistance = distanceBetween(source, agent);
            }
        }
    });
    return closestAgent;
}

//From https://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element
function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return {x,y};
}

function handleClick(event, x, y){
    if(event.button == 0){
        for(var i=0; i<25; i++){
            state.agents.push(new Food(x + randBetween(10, -10), y + randBetween(10, -10)));
        }
    } else if(event.button == 2){
        state.agents.forEach(agent => {
            if(distanceBetween(agent, {x,y}) < 100){
                agent.destroy();
            }
        });
    }
}