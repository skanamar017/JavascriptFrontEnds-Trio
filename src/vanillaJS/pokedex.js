const apiBase = "http://127.0.0.1:5000";
let allPokemon = [];
let filteredPokemon = [];

// DOM elements
const pokemonGrid = document.getElementById('pokemonGrid');
const loadingMessage = document.getElementById('loadingMessage');
const errorMessage = document.getElementById('errorMessage');
const typeFilter = document.getElementById('typeFilter');
const searchFilter = document.getElementById('searchFilter');
const sortBy = document.getElementById('sortBy');
const pokemonCount = document.getElementById('pokemonCount');

// Initialize the Pokédex
document.addEventListener('DOMContentLoaded', function() {
    fetchAllPokemon();
    setupEventListeners();
});

function setupEventListeners() {
    typeFilter.addEventListener('change', filterPokemon);
    searchFilter.addEventListener('input', filterPokemon);
    sortBy.addEventListener('change', sortPokemon);
}

async function fetchAllPokemon() {
    try {
        showLoading(true);
        const response = await fetch(`${apiBase}/Pokemon/`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        allPokemon = await response.json();
        filteredPokemon = [...allPokemon];
        
        console.log(`Loaded ${allPokemon.length} Pokémon`);
        
        populateTypeFilter();
        sortPokemon();
        displayPokemon();
        showLoading(false);
        
    } catch (error) {
        console.error('Error fetching Pokémon:', error);
        showError(`Failed to load Pokédex: ${error.message}`);
        showLoading(false);
    }
}

function populateTypeFilter() {
    const types = new Set();
    
    allPokemon.forEach(pokemon => {
        if (pokemon.type1) types.add(pokemon.type1);
        if (pokemon.type2) types.add(pokemon.type2);
    });
    
    const sortedTypes = Array.from(types).sort();
    
    // Clear existing options (except "All Types")
    typeFilter.innerHTML = '<option value="">All Types</option>';
    
    sortedTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        typeFilter.appendChild(option);
    });
}

function filterPokemon() {
    const selectedType = typeFilter.value;
    const searchTerm = searchFilter.value.toLowerCase();
    
    filteredPokemon = allPokemon.filter(pokemon => {
        // Type filter
        const matchesType = !selectedType || 
            pokemon.type1 === selectedType || 
            pokemon.type2 === selectedType;
        
        // Search filter
        const matchesSearch = !searchTerm || 
            pokemon.name.toLowerCase().includes(searchTerm) ||
            pokemon.pokedex_number.toString().includes(searchTerm);
        
        return matchesType && matchesSearch;
    });
    
    sortPokemon();
    displayPokemon();
}

function sortPokemon() {
    const sortField = sortBy.value;
    
    filteredPokemon.sort((a, b) => {
        if (sortField === 'name') {
            return a.name.localeCompare(b.name);
        } else {
            return a[sortField] - b[sortField];
        }
    });
    
    displayPokemon();
}

function displayPokemon() {
    pokemonGrid.innerHTML = '';
    
    // Update count
    pokemonCount.textContent = `Showing ${filteredPokemon.length} of ${allPokemon.length} Pokémon`;
    
    if (filteredPokemon.length === 0) {
        pokemonGrid.innerHTML = '<div class="error">No Pokémon found matching your criteria.</div>';
        return;
    }
    
    filteredPokemon.forEach(pokemon => {
        const pokemonCard = createPokemonCard(pokemon);
        pokemonGrid.appendChild(pokemonCard);
    });
}

function createPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.className = 'pokemon-card';
    card.onclick = () => showPokemonDetails(pokemon);
    
    const types = [pokemon.type1, pokemon.type2].filter(type => type);
    const typeBadges = types.map(type => 
        `<span class="type-badge type-${type.toLowerCase()}">${type}</span>`
    ).join('');
    
    card.innerHTML = `
        <div class="pokemon-header">
            <div class="pokemon-name">${pokemon.name}</div>
            <div class="pokemon-number">#${pokemon.pokedex_number}</div>
        </div>
        
        <div class="pokemon-types">
            ${typeBadges}
        </div>
        
        <div class="pokemon-stats">
            <div class="stat">
                <span>HP:</span>
                <span><strong>${pokemon.base_hp}</strong></span>
            </div>
            <div class="stat">
                <span>Attack:</span>
                <span><strong>${pokemon.base_attack}</strong></span>
            </div>
            <div class="stat">
                <span>Defense:</span>
                <span><strong>${pokemon.base_defense}</strong></span>
            </div>
            <div class="stat">
                <span>Speed:</span>
                <span><strong>${pokemon.base_speed}</strong></span>
            </div>
            <div class="stat">
                <span>Special:</span>
                <span><strong>${pokemon.base_special}</strong></span>
            </div>
        </div>
        
        ${pokemon.entry ? `<div class="pokemon-entry">"${pokemon.entry}"</div>` : ''}
    `;
    
    return card;
}

function showPokemonDetails(pokemon) {
    // Create a modal or detailed view
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        border-radius: 15px;
        padding: 30px;
        max-width: 500px;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
    `;
    
    const types = [pokemon.type1, pokemon.type2].filter(type => type);
    const typeBadges = types.map(type => 
        `<span class="type-badge type-${type.toLowerCase()}">${type}</span>`
    ).join('');
    
    modalContent.innerHTML = `
        <button onclick="this.closest('.modal').remove()" style="
            position: absolute;
            top: 15px;
            right: 15px;
            background: #e74c3c;
            color: white;
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            cursor: pointer;
            font-size: 18px;
        ">×</button>
        
        <div style="text-align: center; margin-bottom: 20px;">
            <h2>${pokemon.name}</h2>
            <div style="background: #e74c3c; color: white; padding: 5px 15px; border-radius: 20px; display: inline-block;">
                Pokédex #${pokemon.pokedex_number}
            </div>
        </div>
        
        <div style="margin: 20px 0; text-align: center;">
            ${typeBadges}
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0;">
            <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 10px;">
                <div style="font-weight: bold; color: #e74c3c;">HP</div>
                <div style="font-size: 1.5em; font-weight: bold;">${pokemon.base_hp}</div>
            </div>
            <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 10px;">
                <div style="font-weight: bold; color: #e74c3c;">Attack</div>
                <div style="font-size: 1.5em; font-weight: bold;">${pokemon.base_attack}</div>
            </div>
            <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 10px;">
                <div style="font-weight: bold; color: #e74c3c;">Defense</div>
                <div style="font-size: 1.5em; font-weight: bold;">${pokemon.base_defense}</div>
            </div>
            <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 10px;">
                <div style="font-weight: bold; color: #e74c3c;">Speed</div>
                <div style="font-size: 1.5em; font-weight: bold;">${pokemon.base_speed}</div>
            </div>
        </div>
        
        <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 10px; margin: 15px 0;">
            <div style="font-weight: bold; color: #e74c3c;">Special</div>
            <div style="font-size: 1.5em; font-weight: bold;">${pokemon.base_special}</div>
        </div>
        
        ${pokemon.entry ? `
            <div style="margin-top: 20px; padding: 20px; background: #e8f5e8; border-radius: 10px; border-left: 4px solid #27ae60;">
                <h4 style="margin: 0 0 10px 0; color: #27ae60;">Description</h4>
                <p style="margin: 0; font-style: italic; line-height: 1.5;">"${pokemon.entry}"</p>
            </div>
        ` : ''}
    `;
    
    modal.className = 'modal';
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function showLoading(show) {
    loadingMessage.style.display = show ? 'block' : 'none';
    pokemonGrid.style.display = show ? 'none' : 'grid';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    pokemonGrid.style.display = 'none';
}

// Add some utility functions for type filtering from URL params
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        type: params.get('type'),
        search: params.get('search')
    };
}

function applyUrlFilters() {
    const params = getUrlParams();
    
    if (params.type) {
        typeFilter.value = params.type;
    }
    
    if (params.search) {
        searchFilter.value = params.search;
    }
    
    if (params.type || params.search) {
        filterPokemon();
    }
}

// Apply URL filters after loading
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for the data to load, then apply URL filters
    setTimeout(applyUrlFilters, 1000);
});
