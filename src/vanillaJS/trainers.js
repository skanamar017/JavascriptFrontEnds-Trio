const apiBase = "http://127.0.0.1:5000";
const trainersList = document.getElementById('trainersList');
const addTrainerForm = document.getElementById('addTrainerForm');

function fetchTrainers() {
  fetch(`${apiBase}/Trainers/`)
    .then(res => res.json())
    .then(trainers => {
      trainersList.innerHTML = '';
      trainers.forEach(trainer => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="clickable-trainer">${trainer.name} (id: ${trainer.id})</span>`;
        li.querySelector('.clickable-trainer').onclick = () => window.location = `trainer_details.html?trainerId=${trainer.id}`;
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => editTrainer(trainer);
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.onclick = () => deleteTrainer(trainer.id);
        li.append(editBtn, delBtn);
        trainersList.appendChild(li);
      });
    });
}

addTrainerForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('trainerName').value;
  const age = document.getElementById('trainerAge').value;
  const gender = document.getElementById('trainerGender').value;
  const occupation = document.getElementById('trainerOccupation').value;
  
  if (!name) return alert("Name is required!");
  
  const trainerData = { name };
  if (age) trainerData.age = Number(age);
  if (gender) trainerData.gender = gender;
  if (occupation) trainerData.occupation = occupation;
  
  fetch(`${apiBase}/Trainers/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(trainerData)
  }).then(() => {
    fetchTrainers();
    addTrainerForm.reset();
  });
});

function editTrainer(trainer) {
  const name = prompt("Edit name:", trainer.name);
  if (!name) return;
  const ageInput = prompt("Edit age:", trainer.age || "");
  const age = ageInput === "" ? null : Number(ageInput);
  const gender = prompt("Edit gender (Male, Female, Other):", trainer.gender || "");
  const occupation = prompt("Edit occupation:", trainer.occupation || "");
  
  const trainerData = { name };
  if (age) trainerData.age = age;
  if (gender) trainerData.gender = gender;
  if (occupation) trainerData.occupation = occupation;
  
  fetch(`${apiBase}/Trainers/${trainer.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(trainerData)
  }).then(fetchTrainers);
}

function deleteTrainer(id) {
  if (confirm('Delete this trainer?')) {
    fetch(`${apiBase}/Trainers/${id}`, { method: 'DELETE' })
      .then(fetchTrainers);
  }
}

fetchTrainers();