import React, { useState, useEffect } from 'react';
import { trainerAPI } from '../services/api';
import './Trainers.css';
import TrainerPokemon from './TrainerPokemon';

function Trainers() {
  // State to hold the trainers data
  const [trainers, setTrainers] = useState([]);
  // State to track loading status
  const [loading, setLoading] = useState(true);
  // State to handle any errors
  const [error, setError] = useState(null);
  // State for the new trainer form
  const [showForm, setShowForm] = useState(false);
  const [newTrainer, setNewTrainer] = useState({
    name: '',
    age: '',
    gender: '',
    occupation: ''
  });
  // State for form submission
  const [submitting, setSubmitting] = useState(false);
  // State for editing trainers
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [editTrainerData, setEditTrainerData] = useState({
    name: '',
    age: '',
    gender: '',
    occupation: ''
  });
  // State for viewing Pokemon
  const [viewingPokemon, setViewingPokemon] = useState(null);

  // useEffect runs when component mounts (loads)
  useEffect(() => {
    fetchTrainers();
  }, []); // Empty array means this runs once when component loads

  // Function to fetch trainers from API
  const fetchTrainers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call our API service
      const data = await trainerAPI.getAllTrainers();
      console.log('Fetched trainers:', data);
      
      // Update state with the data
      setTrainers(data);
    } catch (err) {
      console.error('Error fetching trainers:', err);
      setError('Failed to load trainers. Make sure your Flask server is running on port 5001.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes for new trainer
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTrainer(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form input changes for editing trainer
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditTrainerData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission for new trainer
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newTrainer.name.trim()) {
      alert('Trainer name is required!');
      return;
    }

    try {
      setSubmitting(true);
      
      // Prepare data for API (convert empty strings to null for optional fields)
      const trainerData = {
        name: newTrainer.name.trim(),
        age: newTrainer.age ? parseInt(newTrainer.age) : null,
        gender: newTrainer.gender || null,
        occupation: newTrainer.occupation || null
      };

      // Call API to create trainer
      const createdTrainer = await trainerAPI.createTrainer(trainerData);
      console.log('Created trainer:', createdTrainer);

      // Reset form
      setNewTrainer({
        name: '',
        age: '',
        gender: '',
        occupation: ''
      });
      setShowForm(false);

      // Refresh the trainers list
      await fetchTrainers();

    } catch (err) {
      console.error('Error creating trainer:', err);
      alert('Failed to create trainer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Start editing a trainer
  const startEditing = (trainer) => {
    setEditingTrainer(trainer.id);
    setEditTrainerData({
      name: trainer.name,
      age: trainer.age || '',
      gender: trainer.gender || '',
      occupation: trainer.occupation || ''
    });
    setShowForm(false); // Close add form if open
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingTrainer(null);
    setEditTrainerData({
      name: '',
      age: '',
      gender: '',
      occupation: ''
    });
  };

  // Handle edit form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!editTrainerData.name.trim()) {
      alert('Trainer name is required!');
      return;
    }

    try {
      setSubmitting(true);
      
      // Prepare data for API
      const trainerData = {
        name: editTrainerData.name.trim(),
        age: editTrainerData.age ? parseInt(editTrainerData.age) : null,
        gender: editTrainerData.gender || null,
        occupation: editTrainerData.occupation || null
      };

      // Call API to update trainer
      const updatedTrainer = await trainerAPI.updateTrainer(editingTrainer, trainerData);
      console.log('Updated trainer:', updatedTrainer);

      // Cancel editing
      cancelEditing();

      // Refresh the trainers list
      await fetchTrainers();

    } catch (err) {
      console.error('Error updating trainer:', err);
      alert('Failed to update trainer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle trainer deletion
  const handleDelete = async (trainerId, trainerName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete trainer "${trainerName}"? This action cannot be undone.`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await trainerAPI.deleteTrainer(trainerId);
      console.log('Deleted trainer:', trainerId);
      
      // Refresh the trainers list
      await fetchTrainers();
      
      // Cancel editing if we were editing this trainer
      if (editingTrainer === trainerId) {
        cancelEditing();
      }

    } catch (err) {
      console.error('Error deleting trainer:', err);
      alert('Failed to delete trainer. Please try again.');
    }
  };

  // Show loading message
  if (loading) {
    return <div className="trainers-container">Loading trainers...</div>;
  }

  // Show error message
  if (error) {
    return (
      <div className="trainers-container">
        <div className="error-message">{error}</div>
        <button onClick={fetchTrainers} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  // If viewing Pokemon, show only the TrainerPokemon component
  if (viewingPokemon) {
    return (
      <TrainerPokemon 
        trainer={viewingPokemon} 
        onBack={() => setViewingPokemon(null)} 
      />
    );
  }

  // Otherwise, show the trainers list
  return (
    <div className="trainers-container">
      <div className="trainers-header">
        <h2>Pokemon Trainers ({trainers.length})</h2>
        <button 
          onClick={() => {
            setShowForm(!showForm);
            if (editingTrainer) cancelEditing(); // Cancel editing if adding new trainer
          }} 
          className="add-trainer-button"
        >
          {showForm ? 'Cancel' : 'Add New Trainer'}
        </button>
      </div>

      {/* Add Trainer Form */}
      {showForm && !editingTrainer && (
        <div className="trainer-form">
          <h3>Add New Trainer</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name (required):</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newTrainer.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="age">Age:</label>
              <input
                type="number"
                id="age"
                name="age"
                value={newTrainer.age}
                onChange={handleInputChange}
                min="1"
                max="100"
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender:</label>
              <select
                id="gender"
                name="gender"
                value={newTrainer.gender}
                onChange={handleInputChange}
              >
                <option value="">Select...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="occupation">Occupation:</label>
              <input
                type="text"
                id="occupation"
                name="occupation"
                value={newTrainer.occupation}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-buttons">
              <button 
                type="submit" 
                disabled={submitting}
                className="submit-button"
              >
                {submitting ? 'Creating...' : 'Create Trainer'}
              </button>
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      {trainers.length === 0 ? (
        <p>No trainers found. Add some trainers to get started!</p>
      ) : (
        <div className="trainers-grid">
          {trainers.map((trainer) => (
            <div key={trainer.id} className="trainer-card">
              {editingTrainer === trainer.id ? (
                // Edit form
                <div className="edit-form">
                  <h3>Edit Trainer</h3>
                  <form onSubmit={handleEditSubmit}>
                    <div className="form-group">
                      <label htmlFor={`edit-name-${trainer.id}`}>Name (required):</label>
                      <input
                        type="text"
                        id={`edit-name-${trainer.id}`}
                        name="name"
                        value={editTrainerData.name}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor={`edit-age-${trainer.id}`}>Age:</label>
                      <input
                        type="number"
                        id={`edit-age-${trainer.id}`}
                        name="age"
                        value={editTrainerData.age}
                        onChange={handleEditInputChange}
                        min="1"
                        max="100"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor={`edit-gender-${trainer.id}`}>Gender:</label>
                      <select
                        id={`edit-gender-${trainer.id}`}
                        name="gender"
                        value={editTrainerData.gender}
                        onChange={handleEditInputChange}
                      >
                        <option value="">Select...</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor={`edit-occupation-${trainer.id}`}>Occupation:</label>
                      <input
                        type="text"
                        id={`edit-occupation-${trainer.id}`}
                        name="occupation"
                        value={editTrainerData.occupation}
                        onChange={handleEditInputChange}
                      />
                    </div>

                    <div className="form-buttons">
                      <button 
                        type="submit" 
                        disabled={submitting}
                        className="submit-button"
                      >
                        {submitting ? 'Updating...' : 'Update Trainer'}
                      </button>
                      <button 
                        type="button" 
                        onClick={cancelEditing}
                        className="cancel-button"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                // Display trainer info
                <>
                  <h3>{trainer.name}</h3>
                  <div className="trainer-details">
                    {trainer.age && <p><strong>Age:</strong> {trainer.age}</p>}
                    {trainer.gender && <p><strong>Gender:</strong> {trainer.gender}</p>}
                    {trainer.occupation && <p><strong>Occupation:</strong> {trainer.occupation}</p>}
                  </div>
                  <div className="trainer-actions">
                    <button 
                      onClick={() => setViewingPokemon(trainer)}
                      className="pokemon-button"
                    >
                      View Pokemon
                    </button>
                    <button 
                      onClick={() => startEditing(trainer)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(trainer.id, trainer.name)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Trainers;