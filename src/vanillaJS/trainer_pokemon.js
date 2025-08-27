const apiBase = "http://127.0.0.1:5000";
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
      tpArr.forEach(tp => {
        const li = document.createElement('li');
        li.innerHTML = `<span style="cursor:pointer; color: #1976d2; text-decoration: underline;" onclick="viewPokemonDetails(${tp.id}, ${tp.pokemon_id})">${tp.nickname} (Level: ${tp.level}, HP: ${tp.current_hp})</span>`;
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => editTP(tp);
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.onclick = () => deleteTP(tp.id);
        li.append(editBtn, delBtn);
        tpList.appendChild(li);
      });
    });
}

addTPForm.addEventListener('submit', e => {
  e.preventDefault();
  const pokemon_id = document.getElementById('pokemonId').value;
  const nickname = document.getElementById('nickname').value;
  const level = document.getElementById('level').value;
  const current_hp = document.getElementById('currentHp').value;
  fetch(`${apiBase}/Trainers/${trainerId}/TrainerPokemon/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ trainer_id: trainerId, pokemon_id, nickname, level, current_hp })
  }).then(() => {
    fetchTrainerPokemon();
    addTPForm.reset();
  });
});

function editTP(tp) {
  const nickname = prompt("Edit nickname:", tp.nickname);
  const level = prompt("Edit level:", tp.level);
  const current_hp = prompt("Edit HP:", tp.current_hp);
  if (!nickname || !level || !current_hp) return;
  fetch(`${apiBase}/Trainers/${trainerId}/TrainerPokemon/${tp.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ trainer_id: trainerId, pokemon_id: tp.pokemon_id, nickname, level, current_hp })
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