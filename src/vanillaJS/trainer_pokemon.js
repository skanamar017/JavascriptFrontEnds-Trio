const apiBase = "http://127.0.0.1:5001";
const urlParams = new URLSearchParams(window.location.search);
const trainerId = urlParams.get('trainerId');
const tpList = document.getElementById('tpList');
const addTPForm = document.getElementById('addTPForm');
const trainerHeader = document.getElementById('trainerHeader');

function fetchTrainerInfo() {
  fetch(`${apiBase}/Trainers/${trainerId}`)
    .then(res => res.json())
    .then(trainer => {
      trainerHeader.innerHTML = `
        <h3>${trainer.name}'s Pokémon</h3>
        <button onclick="window.location='trainer_details.html?trainerId=${trainerId}'">Back to Trainer Details</button>
      `;
    });
}

function fetchTrainerPokemon() {
  console.log('Fetching Pokemon for trainer:', trainerId);
  fetch(`${apiBase}/Trainers/${trainerId}/TrainerPokemon/`)
    .then(res => {
      console.log('Response status:', res.status);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(tpArr => {
      console.log('Received Pokemon data:', tpArr);
      tpList.innerHTML = '';
      if (!Array.isArray(tpArr) || tpArr.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No Pokémon found for this trainer.';
        tpList.appendChild(li);
        return;
      }
      
      // Fetch detailed stats for each Pokemon
      Promise.all(tpArr.map(tp => 
        fetch(`${apiBase}/Trainers/${trainerId}/TrainerPokemon/${tp.id}/stats`)
          .then(res => res.json())
          .catch(err => {
            console.error('Error fetching stats for Pokemon', tp.id, err);
            return tp; // Fallback to basic data
          })
      )).then(detailedPokemon => {
        detailedPokemon.forEach(pokemon => {
          const li = document.createElement('li');
          
          // Create a more detailed display with stats
          const pokemonInfo = document.createElement('div');
          pokemonInfo.className = 'pokemon-info-card';
          
          const basicInfo = document.createElement('div');
          basicInfo.className = 'pokemon-basic-info';
          basicInfo.innerHTML = `
            <h4 style="color: #1976d2; cursor: pointer; text-decoration: underline;" 
                onclick="viewPokemonDetails(${pokemon.id}, ${pokemon.pokemon_id})">
              ${pokemon.nickname || pokemon.pokemon_name || 'Unknown'} 
              <span style="color: #666;">(${pokemon.pokemon_name || 'Unknown Species'})</span>
            </h4>
            <p><strong>Level:</strong> ${pokemon.level}</p>
            <p><strong>Types:</strong> ${pokemon.type1}${pokemon.type2 ? ' / ' + pokemon.type2 : ''}</p>
          `;
          
          pokemonInfo.appendChild(basicInfo);
          
          // Display calculated stats if available - moved to right after basic info
          if (pokemon.calculated_stats) {
            const statsDiv = document.createElement('div');
            statsDiv.className = 'pokemon-stats-display';
            statsDiv.innerHTML = `
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 10px 0;">
                <div class="stat-item">
                  <strong>HP:</strong> ${pokemon.calculated_stats.hp}/${pokemon.calculated_stats.hp}
                </div>
                <div class="stat-item">
                  <strong>Attack:</strong> ${pokemon.calculated_stats.attack}
                </div>
                <div class="stat-item">
                  <strong>Defense:</strong> ${pokemon.calculated_stats.defense}
                </div>
                <div class="stat-item">
                  <strong>Speed:</strong> ${pokemon.calculated_stats.speed}
                </div>
                <div class="stat-item">
                  <strong>Special:</strong> ${pokemon.calculated_stats.special}
                </div>
              </div>
            `;
            pokemonInfo.appendChild(statsDiv);
          }
          
          // Display IVs
          const ivsDiv = document.createElement('div');
          ivsDiv.className = 'pokemon-ivs';
          ivsDiv.innerHTML = `
            <details>
              <summary><strong>Individual Values (IVs)</strong></summary>
              <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; margin-top: 5px;">
                <span>ATK: ${pokemon.iv_attack || 0}/15</span>
                <span>DEF: ${pokemon.iv_defense || 0}/15</span>
                <span>SPD: ${pokemon.iv_speed || 0}/15</span>
                <span>SPC: ${pokemon.iv_special || 0}/15</span>
              </div>
            </details>
          `;
          
          // Display EVs
          const evsDiv = document.createElement('div');
          evsDiv.className = 'pokemon-evs';
          evsDiv.innerHTML = `
            <details>
              <summary><strong>Effort Values (EVs)</strong></summary>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; margin-top: 5px; font-size: 0.9em;">
                <span>HP: ${pokemon.ev_hp || 0}</span>
                <span>ATK: ${pokemon.ev_attack || 0}</span>
                <span>DEF: ${pokemon.ev_defense || 0}</span>
                <span>SPD: ${pokemon.ev_speed || 0}</span>
                <span>SPC: ${pokemon.ev_special || 0}</span>
              </div>
            </details>
          `;
          
          pokemonInfo.appendChild(ivsDiv);
          pokemonInfo.appendChild(evsDiv);
          
          // Action buttons
          const buttonDiv = document.createElement('div');
          buttonDiv.style.marginTop = '10px';
          
          const editBtn = document.createElement('button');
          editBtn.textContent = 'Edit';
          editBtn.onclick = () => editTP(pokemon);
          
          const delBtn = document.createElement('button');
          delBtn.textContent = 'Delete';
          delBtn.style.backgroundColor = '#e74c3c';
          delBtn.onclick = () => deleteTP(pokemon.id);
          
          buttonDiv.append(editBtn, delBtn);
          pokemonInfo.appendChild(buttonDiv);
          
          li.appendChild(pokemonInfo);
          tpList.appendChild(li);
        });
      });
    });
}

addTPForm.addEventListener('submit', e => {
  e.preventDefault();
  const pokemon_id = document.getElementById('pokemonId').value;
  const nickname = document.getElementById('nickname').value;
  const level = document.getElementById('level').value;
  
  const pokemonData = {
    trainer_id: trainerId,
    pokemon_id: pokemon_id,
    nickname: nickname,
    level: level,
    // Remove all IV fields - let backend generate random IVs
    // EVs start at 0
    ev_hp: 0,
    ev_attack: 0,
    ev_defense: 0,
    ev_speed: 0,
    ev_special: 0
  };
  
  fetch(`${apiBase}/Trainers/${trainerId}/TrainerPokemon/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pokemonData)
  }).then(res => res.json())
  .then(result => {
    if (result.error) {
      alert('Error adding Pokémon: ' + result.error);
    } else {
      fetchTrainerPokemon();
      addTPForm.reset();
    }
  })
  .catch(err => {
    console.error('Error:', err);
    alert('Failed to add Pokémon');
  });
});

function editTP(tp) {
  const nickname = prompt("Edit nickname:", tp.nickname);
  const level = prompt("Edit level:", tp.level);
  if (!nickname || !level) return;
  fetch(`${apiBase}/Trainers/${trainerId}/TrainerPokemon/${tp.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ trainer_id: trainerId, pokemon_id: tp.pokemon_id, nickname, level })
  }).then(fetchTrainerPokemon);
}

function deleteTP(tpId) {
  if (confirm('Delete this Pokémon?')) {
    fetch(`${apiBase}/Trainers/${trainerId}/TrainerPokemon/${tpId}`, { method: 'DELETE' })
      .then(fetchTrainerPokemon);
  }
}

function viewPokemonDetails(tpId, pokemonId) {
  window.location = `trainer_pokemon_details.html?trainerId=${trainerId}&tpId=${tpId}&pokemonId=${pokemonId}`;
}

fetchTrainerInfo();
fetchTrainerPokemon();