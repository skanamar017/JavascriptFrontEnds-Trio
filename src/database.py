import sqlite3
from typing import Optional, List
from pydantic import BaseModel
import os
import math
import random
from flask import Flask, request, jsonify

app = Flask(__name__)

class Trainer(BaseModel):
    id: Optional[int] = None
    name: str
    age: Optional[int] = None
    gender: Optional[str] = None
    occupation: Optional[str] = None

class TrainerPokemon(BaseModel):
    id: Optional[int] = None
    trainer_id: int
    pokemon_id: int
    nickname: Optional[str] = None
    level: int
    # Individual Values (IVs) - Generation 1 uses 0-15 range
    iv_attack: int = 0
    iv_defense: int = 0
    iv_speed: int = 0
    iv_special: int = 0
    # Effort Values (EVs) - Generation 1 uses 0-65535 range
    ev_hp: int = 0
    ev_attack: int = 0
    ev_defense: int = 0
    ev_speed: int = 0
    ev_special: int = 0

class PokemonStats(BaseModel):
    hp: int
    attack: int
    defense: int
    speed: int
    special: int

class Gen1StatCalculator:
    @staticmethod
    def calculate_hp_iv(attack_iv: int, defense_iv: int, speed_iv: int, special_iv: int) -> int:
        """Calculate HP IV from other IVs in Generation 1"""
        return ((attack_iv % 2) * 8 + (defense_iv % 2) * 4 + 
                (speed_iv % 2) * 2 + (special_iv % 2))
    
    @staticmethod
    def calculate_hp_stat(base_hp: int, level: int, hp_iv: int, hp_ev: int) -> int:
        """Calculate HP stat using Generation 1 formula"""
        return int(((base_hp + hp_iv + math.sqrt(hp_ev) / 8 + 50) * level / 50) + 10)
    
    @staticmethod
    def calculate_other_stat(base_stat: int, level: int, iv: int, ev: int) -> int:
        """Calculate Attack/Defense/Speed/Special stats using Generation 1 formula"""
        return int(((base_stat + iv + math.sqrt(ev) / 8) * level / 50) + 5)
    
    @staticmethod
    def calculate_all_stats(base_stats: dict, level: int, ivs: dict, evs: dict) -> PokemonStats:
        """Calculate all stats for a Pokémon using Generation 1 formulas"""
        # Calculate HP IV from other IVs
        hp_iv = Gen1StatCalculator.calculate_hp_iv(
            ivs['attack'], ivs['defense'], ivs['speed'], ivs['special']
        )
        
        # Calculate all stats
        hp = Gen1StatCalculator.calculate_hp_stat(
            base_stats['hp'], level, hp_iv, evs['hp']
        )
        attack = Gen1StatCalculator.calculate_other_stat(
            base_stats['attack'], level, ivs['attack'], evs['attack']
        )
        defense = Gen1StatCalculator.calculate_other_stat(
            base_stats['defense'], level, ivs['defense'], evs['defense']
        )
        speed = Gen1StatCalculator.calculate_other_stat(
            base_stats['speed'], level, ivs['speed'], evs['speed']
        )
        special = Gen1StatCalculator.calculate_other_stat(
            base_stats['special'], level, ivs['special'], evs['special']
        )
        
        return PokemonStats(
            hp=hp, attack=attack, defense=defense, speed=speed, special=special
        )
    
    @staticmethod
    def generate_random_ivs() -> dict:
        """Generate random IVs for a new Pokémon (0-15 range)"""
        return {
            'attack': random.randint(0, 15),
            'defense': random.randint(0, 15),
            'speed': random.randint(0, 15),
            'special': random.randint(0, 15)
        }

class PokemonDatabase:
    def __init__(self, db_path: str = "pokemon.db"):
        self.db_path = db_path
        self.init_db()

    def init_db(self):
        """Initialize the database using create 4.sql and insert 7.sql"""
        if not os.path.exists(self.db_path):
            with sqlite3.connect(self.db_path) as conn:
                conn.execute("PRAGMA foreign_keys = ON")
                for sql_file in ["create.sql", "insert.sql"]:
                    with open(sql_file, "r") as f:
                        sql_script = f.read()
                    conn.executescript(sql_script)
                conn.commit()


    def create_trainer(self, trainer: Trainer) -> Trainer:
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute(
                "INSERT INTO Trainers (name, age, gender, occupation) VALUES (?, ?, ?, ?)",
                (trainer.name, trainer.age, trainer.gender, trainer.occupation)
            )
            trainer.id = cursor.lastrowid
            conn.commit()
        return trainer

    def get_trainer(self, trainer_id: int) -> Optional[Trainer]:
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.execute("SELECT * FROM Trainers WHERE id = ?", (trainer_id,))
            row = cursor.fetchone()
            if row:
                return Trainer(**dict(row))
        return None

    def get_all_trainers(self) -> List[Trainer]:
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.execute("SELECT * FROM Trainers")
            rows = cursor.fetchall()
            return [Trainer(**dict(row)) for row in rows]

    def update_trainer(self, trainer_id: int, trainer: Trainer) -> Optional[Trainer]:
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                "UPDATE Trainers SET name = ?, age = ?, gender = ?, occupation = ? WHERE id = ?",
                (trainer.name, trainer.age, trainer.gender, trainer.occupation, trainer_id)
            )
            if conn.total_changes == 0:
                return None
            conn.commit()
            trainer.id = trainer_id
            return trainer

    def delete_trainer(self, trainer_id: int) -> bool:
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("DELETE FROM Trainers WHERE id = ?", (trainer_id,))
            conn.execute("DELETE FROM TrainerPokemon WHERE trainer_id = ?", (trainer_id,))
            deleted = conn.total_changes > 0
            conn.commit()
            return deleted




    def create_trainer_pokemon(self, tp: TrainerPokemon) -> TrainerPokemon:
        """Create a new trainer pokemon with randomly generated IVs if not provided"""
        # Always generate random IVs if they're all 0 (default values)
        if (tp.iv_attack == 0 and tp.iv_defense == 0 and 
            tp.iv_speed == 0 and tp.iv_special == 0):
            random_ivs = Gen1StatCalculator.generate_random_ivs()
            tp.iv_attack = random_ivs['attack']
            tp.iv_defense = random_ivs['defense'] 
            tp.iv_speed = random_ivs['speed']
            tp.iv_special = random_ivs['special']

        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute(
                """INSERT INTO TrainerPokemon 
                   (trainer_id, pokemon_id, nickname, level,
                    iv_attack, iv_defense, iv_speed, iv_special,
                    ev_hp, ev_attack, ev_defense, ev_speed, ev_special) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (tp.trainer_id, tp.pokemon_id, tp.nickname, tp.level,
                 tp.iv_attack, tp.iv_defense, tp.iv_speed, tp.iv_special,
                 tp.ev_hp, tp.ev_attack, tp.ev_defense, tp.ev_speed, tp.ev_special)
            )
            tp.id = cursor.lastrowid
            conn.commit()
        return tp

    def get_trainer_pokemon(self, tp_id: int) -> Optional[TrainerPokemon]:
        '''
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.execute("SELECT * FROM TrainerPokemon WHERE trainer_id = ?", (trainer_id,))
            rows = cursor.fetchall()
            return [TrainerPokemon(**dict(row)) for row in rows]
        '''
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.execute("SELECT * FROM TrainerPokemon WHERE id = ?", (tp_id,))
            row = cursor.fetchone()
            if row:
                return TrainerPokemon(**dict(row))
            return None


    def get_all_trainer_pokemons(self) -> List[TrainerPokemon]:
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.execute("SELECT * FROM TrainerPokemon")
            rows = cursor.fetchall()
            return [TrainerPokemon(**dict(row)) for row in rows]
        
    def get_trainer_pokemons_by_trainer_id(self, trainer_id: int) -> List[TrainerPokemon]:
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.execute("SELECT * FROM TrainerPokemon WHERE trainer_id = ?", (trainer_id,))
            rows = cursor.fetchall()
            return [TrainerPokemon(**dict(row)) for row in rows]



    def update_trainer_pokemon(self, tp_id: int, tp: TrainerPokemon) -> Optional[TrainerPokemon]:
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                """UPDATE TrainerPokemon 
                   SET trainer_id = ?, pokemon_id = ?, nickname = ?, level = ?,
                   WHERE id = ?""",
                (tp.trainer_id, tp.pokemon_id, tp.nickname, tp.level, tp_id)
            )
            if conn.total_changes == 0:
                return None
            conn.commit()
            tp.id = tp_id
            return tp

    def delete_trainer_pokemon(self, tp_id: int) -> bool:
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("DELETE FROM TrainerPokemon WHERE id = ?", (tp_id,))
            deleted = conn.total_changes > 0
            conn.commit()
            return deleted

    def get_pokemon_base_stats(self, pokemon_id: int) -> Optional[dict]:
        """Get base stats for a Pokémon species"""
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.execute(
                "SELECT base_hp, base_attack, base_defense, base_special, base_speed FROM Pokemon WHERE id = ?", 
                (pokemon_id,)
            )
            row = cursor.fetchone()
            if row:
                return {
                    'hp': row['base_hp'],
                    'attack': row['base_attack'], 
                    'defense': row['base_defense'],
                    'special': row['base_special'],
                    'speed': row['base_speed']
                }
            return None

    def calculate_trainer_pokemon_stats(self, tp_id: int) -> Optional[PokemonStats]:
        """Calculate actual stats for a trainer's Pokémon"""
        # Get trainer pokemon data
        tp = self.get_trainer_pokemon(tp_id)
        if not tp:
            return None
            
        # Get base stats
        base_stats = self.get_pokemon_base_stats(tp.pokemon_id)
        if not base_stats:
            return None
            
        # Prepare IVs and EVs dictionaries
        ivs = {
            'attack': tp.iv_attack,
            'defense': tp.iv_defense,
            'speed': tp.iv_speed,
            'special': tp.iv_special
        }
        
        evs = {
            'hp': tp.ev_hp,
            'attack': tp.ev_attack,
            'defense': tp.ev_defense,
            'speed': tp.ev_speed,
            'special': tp.ev_special
        }
        
        # Calculate and return stats
        return Gen1StatCalculator.calculate_all_stats(base_stats, tp.level, ivs, evs)

    def get_trainer_pokemon_with_stats(self, tp_id: int) -> Optional[dict]:
        """Get trainer pokemon data with calculated stats"""
        tp = self.get_trainer_pokemon(tp_id)
        if not tp:
            return None
            
        stats = self.calculate_trainer_pokemon_stats(tp_id)
        if not stats:
            return None
            
        # Get Pokemon name and other details
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.execute(
                "SELECT name, pokedex_number, type1, type2 FROM Pokemon WHERE id = ?",
                (tp.pokemon_id,)
            )
            pokemon_row = cursor.fetchone()
            
        result = tp.dict()
        result['calculated_stats'] = stats.dict()
        if pokemon_row:
            result['pokemon_name'] = pokemon_row['name']
            result['pokedex_number'] = pokemon_row['pokedex_number']
            result['type1'] = pokemon_row['type1']
            result['type2'] = pokemon_row['type2']
            
        return result

    def update_trainer_pokemon_evs(self, tp_id: int, ev_gains: dict) -> bool:
        """Update a trainer pokemon's EVs (useful for training)"""
        tp = self.get_trainer_pokemon(tp_id)
        if not tp:
            return False
            
        # Calculate new EVs (capped at 65535)
        new_ev_hp = min(65535, tp.ev_hp + ev_gains.get('hp', 0))
        new_ev_attack = min(65535, tp.ev_attack + ev_gains.get('attack', 0))
        new_ev_defense = min(65535, tp.ev_defense + ev_gains.get('defense', 0))
        new_ev_speed = min(65535, tp.ev_speed + ev_gains.get('speed', 0))
        new_ev_special = min(65535, tp.ev_special + ev_gains.get('special', 0))
        
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                """UPDATE TrainerPokemon 
                   SET ev_hp = ?, ev_attack = ?, ev_defense = ?, ev_speed = ?, ev_special = ?
                   WHERE id = ?""",
                (new_ev_hp, new_ev_attack, new_ev_defense, new_ev_speed, new_ev_special, tp_id)
            )
            updated = conn.total_changes > 0
            conn.commit()
            return updated

    @app.route("/Pokemon/", methods=["GET"])
    def get_all_pokemon():
        # Optional: filter by query param, e.g., ?type=Fire
        poke_type = request.args.get("type")
        with sqlite3.connect("pokemon.db") as conn:
            conn.row_factory = sqlite3.Row
            if poke_type:
                cursor = conn.execute("SELECT * FROM Pokemon WHERE type1 = ? OR type2 = ?", (poke_type, poke_type))
            else:
                cursor = conn.execute("SELECT * FROM Pokemon")
            rows = cursor.fetchall()
            result = [dict(row) for row in rows]
        return jsonify(result), 200

# Create a global database instance for the routes
db = PokemonDatabase()

@app.route("/trainer_pokemon/<int:tp_id>/stats", methods=["GET"])
def get_trainer_pokemon_stats(tp_id: int):
    """Get calculated stats for a trainer's Pokémon"""
    stats = db.calculate_trainer_pokemon_stats(tp_id)
    if stats:
        return jsonify(stats.dict()), 200
    return jsonify({"error": "Trainer Pokémon not found"}), 404

@app.route("/trainer_pokemon/<int:tp_id>/details", methods=["GET"])
def get_trainer_pokemon_details(tp_id: int):
    """Get trainer Pokémon data with calculated stats"""
    details = db.get_trainer_pokemon_with_stats(tp_id)
    if details:
        return jsonify(details), 200
    return jsonify({"error": "Trainer Pokémon not found"}), 404

@app.route("/trainer_pokemon/<int:tp_id>/train", methods=["POST"])
def train_pokemon(tp_id: int):
    """Update a Pokémon's EVs (training)"""
    data = request.get_json()
    if not data or 'ev_gains' not in data:
        return jsonify({"error": "ev_gains required in request body"}), 400
    
    success = db.update_trainer_pokemon_evs(tp_id, data['ev_gains'])
    if success:
        # Return updated stats
        updated_details = db.get_trainer_pokemon_with_stats(tp_id)
        return jsonify({
            "message": "Training successful!",
            "updated_pokemon": updated_details
        }), 200
    return jsonify({"error": "Training failed"}), 400

@app.route("/pokemon/<int:pokemon_id>/base_stats", methods=["GET"])
def get_pokemon_base_stats_route(pokemon_id: int):
    """Get base stats for a Pokémon species"""
    base_stats = db.get_pokemon_base_stats(pokemon_id)
    if base_stats:
        return jsonify(base_stats), 200
    return jsonify({"error": "Pokémon not found"}), 404

@app.route("/calculate_stats", methods=["POST"])
def calculate_stats_endpoint():
    """Calculate stats given base stats, level, IVs, and EVs"""
    data = request.get_json()
    required_fields = ['base_stats', 'level', 'ivs', 'evs']
    
    if not data or not all(field in data for field in required_fields):
        return jsonify({"error": "Required fields: base_stats, level, ivs, evs"}), 400
    
    try:
        stats = Gen1StatCalculator.calculate_all_stats(
            data['base_stats'], data['level'], data['ivs'], data['evs']
        )
        return jsonify(stats.dict()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400