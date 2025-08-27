import sqlite3
from typing import Optional, List
from pydantic import BaseModel
import os
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
    current_hp: int

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
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute(
                "INSERT INTO TrainerPokemon (trainer_id, pokemon_id, nickname, level, current_hp) VALUES (?, ?, ?, ?, ?)",
                (tp.trainer_id, tp.pokemon_id, tp.nickname, tp.level, tp.current_hp)
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
                   SET trainer_id = ?, pokemon_id = ?, nickname = ?, level = ?, current_hp = ?
                   WHERE id = ?""",
                (tp.trainer_id, tp.pokemon_id, tp.nickname, tp.level, tp.current_hp, tp_id)
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