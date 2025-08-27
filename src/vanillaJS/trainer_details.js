const apiBase = "http://127.0.0.1:5001";
const urlParams = new URLSearchParams(window.location.search);
const trainerId = urlParams.get('trainerId');
const trainerInfo = document.getElementById('trainerInfo');
const viewPokemonBtn = document.getElementById('viewPokemonBtn');

function fetchTrainerDetails() {
  fetch(`${apiBase}/Trainers/${trainerId}`)
    .then(res => res.json())
    .then(trainer => {
      trainerInfo.innerHTML = `
        <h2>${trainer.name}</h2>
        <p><strong>ID:</strong> ${trainer.id}</p>
        ${trainer.age ? `<p><strong>Age:</strong> ${trainer.age}</p>` : ''}
        ${trainer.gender ? `<p><strong>Gender:</strong> ${trainer.gender}</p>` : ''}
        ${trainer.occupation ? `<p><strong>Occupation:</strong> ${trainer.occupation}</p>` : ''}
      `;
    })
    .catch(err => {
      trainerInfo.innerHTML = '<p>Error loading trainer details.</p>';
    });
}

viewPokemonBtn.onclick = () => {
  window.location = `trainer_pokemon.html?trainerId=${trainerId}`;
};

fetchTrainerDetails();
