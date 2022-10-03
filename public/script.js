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
