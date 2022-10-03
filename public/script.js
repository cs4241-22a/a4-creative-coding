const margin = { top: 50, right: 50, bottom: 50, left: 50 },
  height = 300,
  width = 300;

let pokemonList = [];

window.onload = function () {
  fetch("./pokedex.json")
    .then(function (resp) {
      return resp.json();
    })
    .then(function (data) {
      console.log(data);
      data["pokemon"].forEach(function (dset) {
        var pikaPokemon = {
          name: dset["name"],
          type: dset["type"],
          id: dset["id"],
          img: dset["img"],
          candy: dset["candy"],
          candy_count: dset["candy_count"],
        };
        pokemonList.push(pikaPokemon);
      });
    });
};

var counter = 0;
function powerOn(){
    counter = 0;
    const textLine = document.createElement("p");
    alert(textLine.innerHTML = "Welcome to the Kanto Region Pokédex, please click the black screen (Rotom) "
    + "to get started.")
}

function prevPokemon(){
    if ((document.getElementById("prevButton").click = true) && (document.getElementById("innerScreen").click = true) && (counter > 0)){
        counter--;
        alert("You are going back a Pokémon entry in the Pokédex.\nClick the black screen (Rotom) when ready.");
    } else
        alert("There's no Pokémon before this.");
}

function lastPokemon(){
    if ((document.getElementById("lastButton").click = true) && (document.getElementById("innerScreen").click = true)){
        alert("You are going to the last Pokémon entry in the Pokédex.\nClick the black screen (Rotom) when ready.");
        counter = 150
    } else
        alert("There's no Pokémon after this.");
}

function nextPokemon(){
    if ((document.getElementById("nextButton").click = true) && (document.getElementById("innerScreen").click = true) && (counter < 150)){
        counter++;
        alert("You are going to No. " + (counter+1) + " in the Pokédex.\nClick the black screen (Rotom) when ready.");
    } else
        alert("There's no Pokémon beyond this point yet");
}

function whoseThatPokemon(){
    const pokePic = document.createElement("img");
    pokePic.src = pokemonList[counter].img;
    document.getElementById("pokeImg").appendChild(pokePic); 
    alert("Click on the green circle when the pokémon appears!\nTo move to the next Pokémon click the yellow and then click the black screen again!");
}

function itsThatPokemonData(){
    alert("Who's that Pokemon?");
    var candyCost;
    const pokeName = document.createElement("p");
    const pokeType = document.createElement("p");
    const pokeData = document.createElement("p");
    
    pokeName.innerHTML = pokemonList[counter].id + "." + pokemonList[counter].name;
    pokeType.innerHTML = pokemonList[counter].type;
    if (pokemonList[counter].candy_count !== undefined){
        pokeData.innerHTML = "Candy Needed to Evolve: " + pokemonList[counter].candy_count;
    } else {
        pokeData.innerHTML = "Candy Needed to Evolve: " + 0;
    }
    
    document.getElementById("pokemonName").appendChild(pokeName);
    document.getElementById("pokemonType").appendChild(pokeType);
    document.getElementById("pokeDataList").appendChild(pokeData);
}

function showHideInstruct() {
  var x = document.getElementById("instructions");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}