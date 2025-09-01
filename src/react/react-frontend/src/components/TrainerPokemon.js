import React, { useState, useEffect } from 'react';
import { trainerPokemonAPI, pokemonAPI } from '../services/api';
import './TrainerPokemon.css';

function TrainerPokemon({ trainer, onBack }) {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State for add Pokemon form
  const [showAddForm, setShowAddForm] = useState(false);
  const [availablePokemon, setAvailablePokemon] = useState([]);
  const [newPokemon, setNewPokemon] = useState({
    pokemon_id: '',
    nickname: '',
    level: 5
  });
  const [submitting, setSubmitting] = useState(false);
  // State for editing Pokemon
  const [editingPokemon, setEditingPokemon] = useState(null);
  const [editPokemonData, setEditPokemonData] = useState({
    nickname: '',
    level: 5
  });

  useEffect(() => {
    fetchTrainerPokemon();
    fetchAvailablePokemon();
  }, [trainer.id]);

  const fetchTrainerPokemon = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching Pokemon for trainer:', trainer.id);
      const data = await trainerPokemonAPI.getTrainerPokemon(trainer.id);
      console.log('Raw API response:', data);
      console.log('First Pokemon data:', data[0]); // Log the first Pokemon to see its structure
      
      setPokemon(data);
    } catch (err) {
      console.error('Error fetching trainer Pokemon:', err);
      setError('Failed to load Pokemon for this trainer.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailablePokemon = async () => {
    try {
      const data = await pokemonAPI.getAllPokemon();
      console.log('Fetched available Pokemon:', data);
      setAvailablePokemon(data);
    } catch (err) {
      console.error('Error fetching available Pokemon:', err);
    }
  };

  // Handle form input changes for new Pokemon
  const handleAddPokemonInputChange = (e) => {
    const { name, value } = e.target;
    setNewPokemon(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form input changes for editing Pokemon
  const handleEditPokemonInputChange = (e) => {
    const { name, value } = e.target;
    setEditPokemonData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle adding Pokemon to trainer
  const handleAddPokemon = async (e) => {
    e.preventDefault();
    
    if (!newPokemon.pokemon_id) {
      alert('Please select a Pokemon!');
      return;
    }

    if (newPokemon.level < 1 || newPokemon.level > 100) {
      alert('Level must be between 1 and 100!');
      return;
    }

    try {
      setSubmitting(true);
      
      // Prepare data for API
      const pokemonData = {
        pokemon_id: parseInt(newPokemon.pokemon_id),
        nickname: newPokemon.nickname.trim() || null,
        level: parseInt(newPokemon.level)
      };

      // Call API to add Pokemon to trainer
      const addedPokemon = await trainerPokemonAPI.addPokemonToTrainer(trainer.id, pokemonData);
      console.log('Added Pokemon to trainer:', addedPokemon);

      // Reset form
      setNewPokemon({
        pokemon_id: '',
        nickname: '',
        level: 5
      });
      setShowAddForm(false);

      // Refresh the Pokemon list
      await fetchTrainerPokemon();

    } catch (err) {
      console.error('Error adding Pokemon to trainer:', err);
      alert('Failed to add Pokemon. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Start editing a Pokemon
  const startEditingPokemon = (pokemonItem) => {
    setEditingPokemon(pokemonItem.id);
    setEditPokemonData({
      nickname: pokemonItem.nickname || '',
      level: pokemonItem.level
    });
    setShowAddForm(false); // Close add form if open
  };

  // Cancel editing Pokemon
  const cancelEditingPokemon = () => {
    setEditingPokemon(null);
    setEditPokemonData({
      nickname: '',
      level: 5
    });
  };

  // Handle edit Pokemon form submission
  const handleEditPokemon = async (e) => {
    e.preventDefault();
    
    if (editPokemonData.level < 1 || editPokemonData.level > 100) {
      alert('Level must be between 1 and 100!');
      return;
    }

    try {
      setSubmitting(true);
      
      // Prepare data for API
      const pokemonData = {
        nickname: editPokemonData.nickname.trim() || null,
        level: parseInt(editPokemonData.level)
      };

      // Call API to update Pokemon
      const updatedPokemon = await trainerPokemonAPI.updateTrainerPokemon(trainer.id, editingPokemon, pokemonData);
      console.log('Updated Pokemon:', updatedPokemon);

      // Cancel editing
      cancelEditingPokemon();

      // Refresh the Pokemon list
      await fetchTrainerPokemon();

    } catch (err) {
      console.error('Error updating Pokemon:', err);
      alert('Failed to update Pokemon. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Pokemon deletion
  const handleDeletePokemon = async (pokemonId, pokemonName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to remove ${pokemonName} from ${trainer.name}'s team? This action cannot be undone.`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await trainerPokemonAPI.deleteTrainerPokemon(trainer.id, pokemonId);
      console.log('Deleted Pokemon:', pokemonId);
      
      // Refresh the Pokemon list
      await fetchTrainerPokemon();
      
      // Cancel editing if we were editing this Pokemon
      if (editingPokemon === pokemonId) {
        cancelEditingPokemon();
      }

    } catch (err) {
      console.error('Error deleting Pokemon:', err);
      alert('Failed to remove Pokemon. Please try again.');
    }
  };

  // Get selected Pokemon details for display
  const getSelectedPokemonInfo = () => {
    if (!newPokemon.pokemon_id) return null;
    return availablePokemon.find(p => p.id === parseInt(newPokemon.pokemon_id));
  };

  if (loading) {
    return (
      <div className="trainer-pokemon-container">
        <div className="trainer-pokemon-header">
          <button onClick={onBack} className="back-button">← Back to Trainers</button>
          <h2>Loading {trainer.name}'s Pokemon...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trainer-pokemon-container">
        <div className="trainer-pokemon-header">
          <button onClick={onBack} className="back-button">← Back to Trainers</button>
          <h2>{trainer.name}'s Pokemon Team</h2>
        </div>
        <div className="error-message">{error}</div>
        <button onClick={fetchTrainerPokemon} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  const selectedPokemonInfo = getSelectedPokemonInfo();

  return (
    <div className="trainer-pokemon-container">
      <div className="trainer-pokemon-header">
        <button onClick={onBack} className="back-button">← Back to Trainers</button>
        <div className="trainer-info">
          <h2>{trainer.name}'s Pokemon Team</h2>
          <p className="pokemon-count">{pokemon.length} Pokemon</p>
        </div>
        <button 
          onClick={() => {
            setShowAddForm(!showAddForm);
            if (editingPokemon) cancelEditingPokemon(); // Cancel editing if adding new Pokemon
          }} 
          className="add-pokemon-button"
        >
          {showAddForm ? 'Cancel' : 'Add Pokemon'}
        </button>
      </div>

      {/* Add Pokemon Form */}
      {showAddForm && !editingPokemon && (
        <div className="add-pokemon-form">
          <h3>Add Pokemon to {trainer.name}'s Team</h3>
          <form onSubmit={handleAddPokemon}>
            <div className="form-group">
              <label htmlFor="pokemon_id">Select Pokemon (required):</label>
              <select
                id="pokemon_id"
                name="pokemon_id"
                value={newPokemon.pokemon_id}
                onChange={handleAddPokemonInputChange}
                required
              >
                <option value="">Choose a Pokemon...</option>
                {availablePokemon.map((p) => (
                  <option key={p.id} value={p.id}>
                    #{p.id.toString().padStart(3, '0')} - {p.name} ({p.type1}{p.type2 ? ` / ${p.type2}` : ''})
                  </option>
                ))}
              </select>
            </div>

            {selectedPokemonInfo && (
              <div className="selected-pokemon-preview">
                <h4>Selected: {selectedPokemonInfo.name}</h4>
                <p><strong>Type:</strong> {selectedPokemonInfo.type1}{selectedPokemonInfo.type2 ? ` / ${selectedPokemonInfo.type2}` : ''}</p>
                <p><strong>Base Stats:</strong> HP: {selectedPokemonInfo.hp}, ATK: {selectedPokemonInfo.attack}, DEF: {selectedPokemonInfo.defense}, SPD: {selectedPokemonInfo.speed}, SPC: {selectedPokemonInfo.special}</p>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="nickname">Nickname (optional):</label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={newPokemon.nickname}
                onChange={handleAddPokemonInputChange}
                placeholder="Leave blank to use Pokemon name"
                maxLength="20"
              />
            </div>

            <div className="form-group">
              <label htmlFor="level">Level (1-100):</label>
              <input
                type="number"
                id="level"
                name="level"
                value={newPokemon.level}
                onChange={handleAddPokemonInputChange}
                min="1"
                max="100"
                required
              />
            </div>

            <div className="form-buttons">
              <button 
                type="submit" 
                disabled={submitting}
                className="submit-button"
              >
                {submitting ? 'Adding Pokemon...' : 'Add Pokemon'}
              </button>
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </form>
          <p className="form-note">
            <strong>Note:</strong> IVs (Individual Values) will be randomly generated for this Pokemon.
          </p>
        </div>
      )}

      {pokemon.length === 0 ? (
        <div className="no-pokemon">
          <p>This trainer doesn't have any Pokemon yet.</p>
          <p>Click "Add Pokemon" to get started!</p>
        </div>
      ) : (
        <div className="pokemon-grid">
          {pokemon.map((p) => (
            <div key={p.id} className="pokemon-card">
              {editingPokemon === p.id ? (
                // Edit form for Pokemon
                <div className="edit-pokemon-form">
                  <h3>Edit {p.nickname || p.pokemon_name}</h3>
                  <form onSubmit={handleEditPokemon}>
                    <div className="form-group">
                      <label htmlFor={`edit-nickname-${p.id}`}>Nickname (optional):</label>
                      <input
                        type="text"
                        id={`edit-nickname-${p.id}`}
                        name="nickname"
                        value={editPokemonData.nickname}
                        onChange={handleEditPokemonInputChange}
                        placeholder="Leave blank to use Pokemon name"
                        maxLength="20"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor={`edit-level-${p.id}`}>Level (1-100):</label>
                      <input
                        type="number"
                        id={`edit-level-${p.id}`}
                        name="level"
                        value={editPokemonData.level}
                        onChange={handleEditPokemonInputChange}
                        min="1"
                        max="100"
                        required
                      />
                    </div>

                    <div className="form-buttons">
                      <button 
                        type="submit" 
                        disabled={submitting}
                        className="submit-button"
                      >
                        {submitting ? 'Updating...' : 'Update Pokemon'}
                      </button>
                      <button 
                        type="button" 
                        onClick={cancelEditingPokemon}
                        className="cancel-button"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                  <p className="form-note">
                    <strong>Note:</strong> Changing the level will recalculate stats but keep the same IVs.
                  </p>
                </div>
              ) : (
                // Display Pokemon info
                <>
                  <div className="pokemon-header">
                    <h3>{p.nickname || p.pokemon_name}</h3>
                    {p.nickname && <p className="pokemon-species">({p.pokemon_name})</p>}
                  </div>
                  
                  <div className="pokemon-info">
                    <p><strong>Level:</strong> {p.level}</p>
                    <p><strong>Type:</strong> {p.type1}{p.type2 ? ` / ${p.type2}` : ''}</p>
                  </div>

                  <div className="pokemon-stats">
                    <h4>Stats</h4>
                    <div className="stats-grid">
                      <div className="stat">
                        <span className="stat-name">HP</span>
                        <span className="stat-value">{p.calculated_hp}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-name">Attack</span>
                        <span className="stat-value">{p.calculated_attack}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-name">Defense</span>
                        <span className="stat-value">{p.calculated_defense}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-name">Speed</span>
                        <span className="stat-value">{p.calculated_speed}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-name">Special</span>
                        <span className="stat-value">{p.calculated_special}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pokemon-ivs">
                    <h4>IVs (Individual Values)</h4>
                    <div className="ivs-grid">
                      <span>ATK: {p.iv_attack}</span>
                      <span>DEF: {p.iv_defense}</span>
                      <span>SPD: {p.iv_speed}</span>
                      <span>SPC: {p.iv_special}</span>
                    </div>
                  </div>

                  <div className="pokemon-actions">
                    <button 
                      onClick={() => startEditingPokemon(p)}
                      className="edit-pokemon-button"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeletePokemon(p.id, p.nickname || p.pokemon_name)}
                      className="delete-pokemon-button"
                    >
                      Remove
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

export default TrainerPokemon;