# Combined Trainer and Pokémon info endpoint

from flask import Flask, request, jsonify
from database import PokemonDatabase, Trainer, TrainerPokemon
from typing import List
import json
import sqlite3
from flask_cors import CORS
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
db = PokemonDatabase()


@app.route("/", methods=["GET"])
def read_root():
    return jsonify({"message": "Welcome to the Simple User API!"})


@app.route("/Trainers/<int:trainer_id>/WithPokemon", methods=["GET"])
def get_trainer_with_pokemon(trainer_id):
    trainer = db.get_trainer(trainer_id)
    if not trainer:
        return jsonify({"error": "Trainer not found"}), 404
    tps = db.get_trainer_pokemons_by_trainer_id(trainer_id)
    return jsonify({
        "trainer": trainer.model_dump(),
        "pokemon": [tp.model_dump() for tp in tps]
    }), 200


# Trainer Endpoints
@app.route("/Trainers/", methods=["POST"])
def create_trainer():
    data = request.get_json()
    trainer = Trainer(**data)
    try:
        created = db.create_trainer(trainer)
        return jsonify(created.model_dump()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/Trainers/<int:trainer_id>", methods=["GET"])
def get_trainer(trainer_id):
    trainer = db.get_trainer(trainer_id)
    if trainer:
        return jsonify(trainer.model_dump()), 200
    return jsonify({"error": "Trainer not found"}), 404

@app.route("/Trainers/", methods=["GET"])
def get_all_trainers():
    trainers = db.get_all_trainers()
    return jsonify([t.model_dump() for t in trainers]), 200

@app.route("/Trainers/<int:trainer_id>", methods=["PUT"])
def update_trainer(trainer_id):
    data = request.get_json()
    trainer = Trainer(**data)
    updated = db.update_trainer(trainer_id, trainer)
    if updated:
        return jsonify(updated.model_dump()), 200
    return jsonify({"error": "Trainer not found"}), 404

@app.route("/Trainers/<int:trainer_id>", methods=["DELETE"])
def delete_trainer(trainer_id):
    if db.delete_trainer(trainer_id):
        return jsonify({"message": "Trainer deleted successfully"}), 200
    return jsonify({"error": "Trainer not found"}), 404

# TrainerPokemon Endpoints
@app.route("/Trainers/<int:trainer_id>/TrainerPokemon/", methods=["POST"])
def create_trainer_pokemon(trainer_id):
    data = request.get_json()
    tp = TrainerPokemon(**data)
    try:
        created = db.create_trainer_pokemon(tp)
        return jsonify(created.model_dump()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/Trainers/<int:trainer_id>/TrainerPokemon/<int:tp_id>", methods=["GET"])
def get_trainer_pokemon(trainer_id, tp_id):
    tp = db.get_trainer_pokemon(tp_id)
    if tp:
        return jsonify(tp.model_dump()), 200
    return jsonify({"error": "TrainerPokemon not found"}), 404

@app.route("/Trainers/<int:trainer_id>/TrainerPokemon/", methods=["GET"])
@app.route("/Trainers/<int:trainer_id>/TrainerPokemon", methods=["GET"])
def get_trainer_pokemons(trainer_id):
    print(f"[DEBUG] get_trainer_pokemons called for trainer_id={trainer_id}")
    tps = db.get_trainer_pokemons_by_trainer_id(trainer_id)
    return jsonify([tp.model_dump() for tp in tps]), 200

@app.route("/Trainers/<int:trainer_id>/TrainerPokemon/<int:tp_id>", methods=["PUT"])
def update_trainer_pokemon(trainer_id, tp_id):
    data = request.get_json()
    tp = TrainerPokemon(**data)
    updated = db.update_trainer_pokemon(tp_id, tp)
    if updated:
        return jsonify(updated.model_dump()), 200
    return jsonify({"error": "TrainerPokemon not found"}), 404

@app.route("/Trainers/<int:trainer_id>/TrainerPokemon/<int:tp_id>", methods=["DELETE"])
def delete_trainer_pokemon(trainer_id, tp_id):
    if db.delete_trainer_pokemon(tp_id):
        return jsonify({"message": "TrainerPokemon deleted successfully"}), 200
    return jsonify({"error": "TrainerPokemon not found"}), 404

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

if __name__ == "__main__":
    app.run(debug=True)
