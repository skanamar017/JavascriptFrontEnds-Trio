const apiBase = "http://127.0.0.1:5001";
const urlParams = new URLSearchParams(window.location.search);
const trainerId = urlParams.get('trainerId');
const tpId = urlParams.get('tpId');
const pokemonId = urlParams.get('pokemonId');
const pokemonInfo = document.getElementById('pokemonInfo');
const speciesInfo = document.getElementById('speciesInfo');

function fetchPokemonDetails() {
  // Get trainer's Pokemon details
  fetch(`${apiBase}/Trainers/${trainerId}/TrainerPokemon/${tpId}`)
    .then(res => res.json())
    .then(tp => {
      pokemonInfo.innerHTML = `
        <h2>${tp.nickname || 'Unnamed'}</h2>
        <p><strong>Level:</strong> ${tp.level}</p>
        <p><strong>Current HP:</strong> ${tp.current_hp}</p>
        <p><strong>Trainer ID:</strong> ${tp.trainer_id}</p>
        <p><strong>Pokémon Species ID:</strong> ${tp.pokemon_id}</p>
      `;
    })
    .catch(err => {
      pokemonInfo.innerHTML = '<p>Error loading Pokémon details.</p>';
    });
  
  // Get Pokemon species information
  fetch(`${apiBase}/Pokemon/`)
    .then(res => res.json())
    .then(allPokemon => {
      const species = allPokemon.find(p => p.id === parseInt(pokemonId) || p.pokedex_number === parseInt(pokemonId));
      if (species) {
        speciesInfo.innerHTML = `
          <h3>Species Information</h3>
          <p><strong>Name:</strong> ${species.name}</p>
          <p><strong>Pokédex #:</strong> ${species.pokedex_number}</p>
          <p><strong>Type:</strong> ${species.type1}${species.type2 ? '/' + species.type2 : ''}</p>
          <p><strong>Base HP:</strong> ${species.base_hp}</p>
          <p><strong>Base Attack:</strong> ${species.base_attack}</p>
          <p><strong>Base Defense:</strong> ${species.base_defense}</p>
          <p><strong>Base Special:</strong> ${species.base_special}</p>
          <p><strong>Base Speed:</strong> ${species.base_speed}</p>
          <p><strong>Description:</strong> ${species.entry || 'No description available.'}</p>
        `;
      } else {
        speciesInfo.innerHTML = '<p>Species information not found.</p>';
      }
    })
    .catch(err => {
      speciesInfo.innerHTML = '<p>Error loading species information.</p>';
    });
}

document.getElementById('backToPokemonList').onclick = () => {
  window.location = `trainer_pokemon.html?trainerId=${trainerId}`;
};

document.getElementById('backToTrainerDetails').onclick = () => {
  window.location = `trainer_details.html?trainerId=${trainerId}`;
};

fetchPokemonDetails();
