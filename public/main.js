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
    var ctx = cvs.getContext('2d');
    //ctx.imageSmoothingEnabled = false;

    function step(){
        if(timestamp == undefined){
            initialize();
        } else {
            timestamp = Date.now();
            var interval = timestamp - lastTimestamp;
            if(interval > settings.maxInterval){
                interval = settings.maxInterval;
            }
            ctx.clearRect(0, 0, cvsWidth, cvsHeight);
            run(ctx, interval);
        }
        lastTimestamp = timestamp;
        window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
});

function initialize(){
    timestamp = Date.now();
    state = {
        agents: []
    };
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

    for(var i=0; i<10; i++){
        state.agents.push(new Dude());
    }
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
        if(agent instanceof Dude) console.log(agent.color);
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
        if(closestDude != null && distanceBetween(this, closestDude) < settings.minimumDudeDistance){
            this.moveAway(closestDude, settings.dudeSpeed * interval);
        } else if(closestFood != null){
            this.moveTowards(closestFood, settings.dudeSpeed * interval);
            if(distanceBetween(this, closestFood) <= settings.maximumEatDistance){
                this.energy += closestFood.energy;
                closestFood.destroy();
            }
        }
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