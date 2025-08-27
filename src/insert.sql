


-- remove Fairy typing and replace with gen 1 typing
-- Sample Data for Pokemon Table
-- Format: ('Name', 'Type1', 'Type2', HP, Attack, Defense, Special, Speed)
INSERT INTO Pokemon
    (pokedex_number, name, type1, type2, base_hp, base_attack, base_defense, base_special, base_speed, entry)
VALUES
    (1, 'Bulbasaur', 'Grass', 'Poison', 45, 49, 49, 65, 45, 'A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.'),
    (2, 'Ivysaur', 'Grass', 'Poison', 60, 62, 63, 80, 60, 'When the bulb on its back grows large, it appears to lose the ability to stand on its hind legs.'),
    (3, 'Venusaur', 'Grass', 'Poison', 80, 82, 83, 100, 80, 'The plant blooms when it is absorbing solar energy. It stays on the move to seek sunlight.'),
    (4, 'Charmander', 'Fire', NULL, 39, 52, 43, 50, 65, 'Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.'),
    (5, 'Charmeleon', 'Fire', NULL, 58, 64, 58, 65, 80, 'When it swings its burning tail, it elevates the temperature to unbearably high levels.'),
    (6, 'Charizard', 'Fire', 'Flying', 78, 84, 78, 85, 100, 'Spits fire that is hot enough to melt boulders. Known to cause forest fires unintentionally.'),
    (7, 'Squirtle', 'Water', NULL, 44, 48, 65, 50, 43, 'After birth, its back swells and hardens into a shell. Powerfully sprays foam from its mouth.'),
    (8, 'Wartortle', 'Water', NULL, 59, 63, 80, 65, 58, 'Often hides in water to stalk unwary prey. For swimming fast, it moves its ears to maintain balance.'),
    (9, 'Blastoise', 'Water', NULL, 79, 83, 100, 85, 78, 'A brutal Pokémon with pressurized water jets on its shell. They are used for high speed tackles.'),
    (10, 'Caterpie', 'Bug', NULL, 45, 30, 35, 20, 45, 'Its short feet are tipped with suction pads that enable it to cling to any surface.'),
    (11, 'Metapod', 'Bug', NULL, 50, 20, 55, 25, 30, 'A steel-hard shell protects its vulnerable body. It prepares for its upcoming transformation.'),
    (12, 'Butterfree', 'Bug', 'Flying', 60, 45, 50, 80, 70, 'In battle, it flaps its wings at high speed to release highly toxic dust.'),
    (13, 'Weedle', 'Bug', 'Poison', 40, 35, 30, 20, 50, 'Often found in forests, eating leaves. The more toxic its honey, the sweeter its pollen.'),
    (14, 'Kakuna', 'Bug', 'Poison', 45, 25, 50, 25, 35, 'Almost incapable of moving, this Pokémon can only harden its shell to protect itself.'),
    (15, 'Beedrill', 'Bug', 'Poison', 65, 90, 40, 45, 75, 'It can take down a whole tree in one blow. It uses its sharp stinger to defeat foes.'),
    (16, 'Pidgey', 'Normal', 'Flying', 40, 45, 40, 35, 56, 'A common sight in forests and woods. It flaps its wings at ground level to kick up blinding sand.'),
    (17, 'Pidgeotto', 'Normal', 'Flying', 63, 60, 55, 50, 71, 'In the wild, it is said to nest in tall trees. It can fly at speeds of 50 mph.'),
    (18, 'Pidgeot', 'Normal', 'Flying', 83, 80, 75, 70, 101, 'This Pokémon is full of life. It constantly flies around its large territory in search of prey.'),
    (19, 'Rattata', 'Normal', NULL, 30, 56, 35, 25, 72, 'Bites anything when it attacks. Small and very quick, it is a common sight in many places.'),
    (20, 'Raticate', 'Normal', NULL, 55, 81, 60, 50, 97, 'Its hind feet are webbed. They act as flippers, so it can swim in rivers.'),
    (21, 'Spearow', 'Normal', 'Flying', 40, 60, 30, 31, 70, "A bird Pokémon that is very common in the Kanto region."),
    (22, 'Fearow', 'Normal', 'Flying', 65, 90, 65, 61, 100, "A Pokémon that is known for its aggressive nature and sharp beak."),
    (23, 'Ekans', 'Poison', NULL, 35, 60, 44, 40, 55, "A snake Pokémon that can be found in grassy areas."),
    (24, 'Arbok', 'Poison', NULL, 60, 95, 69, 65, 80, "A large snake Pokémon that is known for its intimidating presence."),
    (25, 'Pikachu', 'Electric', NULL, 35, 55, 40, 50, 90, "An Electric-type Pokémon that is known for its cute appearance."),
    (26, 'Raichu', 'Electric', NULL, 60, 90, 55, 50, 110, "An evolved form of Pikachu, known for its speed and agility."),
    (27, 'Sandshrew', 'Ground', NULL, 50, 75, 85, 20, 40, "A small, mouse-like Pokémon that is known for its burrowing abilities."),
    (28, 'Sandslash', 'Ground', NULL, 75, 100, 110, 35, 65, "An evolved form of Sandshrew, known for its sharp claws and defensive capabilities."),
    (29, 'Nidoran♀', 'Poison', NULL, 55, 47, 52, 40, 41, "A small, female Pokémon that is known for its timid nature."),
    (30, 'Nidorina', 'Poison', NULL, 70, 62, 67, 55, 56, "An evolved form of Nidoran♀, known for its nurturing behavior."),
    (31, 'Nidoqueen', 'Poison', 'Ground', 90, 82, 87, 75, 76, "A powerful Pokémon that is known for its maternal instincts."),
    (32, 'Nidoran♂', 'Poison', NULL, 46, 57, 40, 40, 50, "A small, male Pokémon that is known for its aggressive behavior."),
    (33, 'Nidorino', 'Poison', NULL, 61, 72, 57, 55, 65, "An evolved form of Nidoran♂, known for its sharp horn."),
    (34, 'Nidoking', 'Poison', 'Ground', 81, 102, 76, 85, 85, "A powerful Pokémon that is known for its strength and ferocity."),
    (35, 'Clefairy', 'Fairy', NULL, 70, 45, 48, 60, 35, "A cute Pokémon that is known for its playful nature."),
    (36, 'Clefable', 'Fairy', NULL, 95, 70, 73, 85, 60, "An evolved form of Clefairy, known for its magical abilities."),
    (37, 'Vulpix', 'Fire', NULL, 38, 41, 40, 50, 65, "A small fox-like Pokémon that is known for its beautiful fur."),
    (38, 'Ninetales', 'Fire', NULL, 73, 76, 75, 81, 100, "An evolved form of Vulpix, known for its nine fiery tails."),
    (39, 'Jigglypuff', 'Normal', 'Fairy', 115, 45, 20, 25, 20, "A balloon-like Pokémon that is known for its singing ability."),
    (40, 'Wigglytuff', 'Normal', 'Fairy', 140, 70, 45, 50, 45, "An evolved form of Jigglypuff, known for its large size and strength."),
    (41, 'Zubat', 'Poison', 'Flying', 40, 45, 35, 30, 40, "A bat-like Pokémon that is known for its ability to navigate in the dark."),
    (42, 'Golbat', 'Poison', 'Flying', 75, 80, 70, 65, 90, "An evolved form of Zubat, known for its sharp fangs and speed."),
    (43, 'Oddish', 'Grass', 'Poison', 45, 50, 55, 75, 30, "A small, plant-like Pokémon that is known for its ability to blend in with foliage."),
    (44, 'Gloom', 'Grass', 'Poison', 60, 65, 70, 85, 40, "An evolved form of Oddish, known for its foul odor."),
    (45, 'Vileplume', 'Grass', 'Poison', 75, 80, 85, 100, 50, "An evolved form of Gloom, known for its large flower and spore attacks."),
    (46, 'Paras', 'Bug', 'Grass', 35, 70, 55, 35, 25, "A mushroom-like Pokémon that is known for its parasitic nature."),
    (47, 'Parasect', 'Bug', 'Grass', 60, 95, 80, 60, 30, "An evolved form of Paras, known for its large mushroom and spore attacks."),
    (48, 'Venonat', 'Bug', 'Poison', 60, 55, 50, 40, 45, "A small, insect-like Pokémon that is known for its large eyes."),
    (49, 'Venomoth', 'Bug', 'Poison', 70, 65, 60, 90, 90, "An evolved form of Venonat, known for its powerful wings and poison."),
    (50, 'Diglett', 'Ground', NULL, 10, 55, 25, 35, 95, "A small, mole-like Pokémon that is known for its burrowing abilities."),
    (51, 'Dugtrio', 'Ground', NULL, 35, 80, 50, 70, 120, "An evolved form of Diglett, known for its speed and digging abilities."),
    (52, 'Meowth', 'Normal', NULL, 40, 45, 35, 40, 90, "A cat-like Pokémon that is known for its ability to walk on two legs."),
    (53, 'Persian', 'Normal', NULL, 65, 70, 60, 65, 115, "An evolved form of Meowth, known for its elegance and speed."),
    (54, 'Psyduck', 'Water', NULL, 50, 52, 48, 50, 55, "A duck-like Pokémon that is known for its constant headaches."),
    (55, 'Golduck', 'Water', NULL, 80, 82, 78, 80, 85, "An evolved form of Psyduck, known for its swimming abilities."),
    (56, 'Mankey', 'Fighting', NULL, 40, 80, 35, 35, 70, "A monkey-like Pokémon that is known for its aggressive nature."),
    (57, 'Primeape', 'Fighting', NULL, 65, 105, 60, 60, 95, "An evolved form of Mankey, known for its speed and ferocity."),
    (58, 'Growlithe', 'Fire', NULL, 55, 70, 45, 50, 60, "A puppy-like Pokémon that is known for its loyalty and bravery."),
    (59, 'Arcanine', 'Fire', NULL, 90, 110, 80, 80, 95, "An evolved form of Growlithe, known for its majestic appearance and speed."),
    (60, 'Poliwag', 'Water', NULL, 40, 50, 40, 40, 90, "A small, tadpole-like Pokémon that is known for its ability to swim."),
    (61, 'Poliwhirl', 'Water', NULL, 65, 65, 65, 50, 90, "An evolved form of Poliwag, known for its ability to create whirlpools."),
    (62, 'Poliwrath', 'Water', 'Fighting', 90, 95, 95, 70, 70, "An evolved form of Poliwhirl, known for its strength and fighting abilities."),
    (63, 'Abra', 'Psychic', NULL, 25, 20, 15, 105, 90, "A psychic Pokémon that is known for its ability to teleport."),
    (64, 'Kadabra', 'Psychic', NULL, 40, 35, 30, 120, 105, "An evolved form of Abra, known for its increased psychic powers."),
    (65, 'Alakazam', 'Psychic', NULL, 55, 50, 45, 135, 120, "An evolved form of Kadabra, known for its high intelligence and psychic abilities."),
    (66, 'Machop', 'Fighting', NULL, 70, 80, 50, 35, 35, "A muscular Pokémon that trains its body to become stronger."),
    (67, 'Machoke', 'Fighting', NULL, 80, 100, 70, 50, 45, "An evolved form of Machop, known for its strength and training."),
    (68, 'Machamp', 'Fighting', NULL, 90, 130, 80, 65, 55, "An evolved form of Machoke, known for its incredible power and fighting skills."),
    (69, 'Bellsprout', 'Grass', 'Poison', 50, 75, 35, 70, 40, "A plant-like Pokémon that is known for its ability to ensnare prey."),
    (70, 'Weepinbell', 'Grass', 'Poison', 65, 90, 50, 85, 55, "An evolved form of Bellsprout, known for its bell-shaped body."),
    (71, 'Victreebel', 'Grass', 'Poison', 80, 105, 65, 100, 70, "An evolved form of Weepinbell, known for its large, carnivorous flower."),
    (72, 'Tentacool', 'Water', 'Poison', 40, 40, 35, 50, 70, "A jellyfish-like Pokémon that is known for its stinging tentacles."),
    (73, 'Tentacruel', 'Water', 'Poison', 80, 70, 65, 80, 100, "An evolved form of Tentacool, known for its large size and powerful stings."),
    (74, 'Geodude', 'Rock', 'Ground', 40, 80, 100, 30, 20, "A rock-like Pokémon that is known for its strength and toughness."),
    (75, 'Graveler', 'Rock', 'Ground', 55, 95, 115, 45, 35, "An evolved form of Geodude, known for its increased size and power."),
    (76, 'Golem', 'Rock', 'Ground', 80, 110, 130, 55, 45, "An evolved form of Graveler, known for its incredible power and defense."),
    (77, 'Ponyta', 'Fire', NULL, 50, 65, 40, 50, 60, "A horse-like Pokémon that is known for its speed and fiery mane."),
    (78, 'Rapidash', 'Fire', NULL, 65, 100, 70, 80, 105, "An evolved form of Ponyta, known for its incredible speed and agility."),
    (79, 'Slowpoke', 'Water', 'Psychic', 90, 65, 65, 40, 15, "A slow-moving Pokémon that is known for its laid-back nature."),
    (80, 'Slowbro', 'Water', 'Psychic', 95, 75, 110, 80, 30, "An evolved form of Slowpoke, known for its increased strength and intelligence."),
    (81, 'Magnemite', 'Electric', NULL, 25, 35, 70, 95, 45, "A Pokémon that is known for its ability to generate powerful magnetic fields."),
    (82, 'Magneton', 'Electric', NULL, 50, 60, 95, 120, 70, "An evolved form of Magnemite, known for its three-headed magnetic structure."),
    (83, 'Farfetchd', 'Normal', 'Flying', 52, 65, 55, 58, 60, "A Pokémon that is known for carrying a leek as a weapon."),
    (84, 'Doduo', 'Normal', 'Flying', 35, 85, 45, 35, 75, "A two-headed Pokémon that is known for its speed and agility."),
    (85, 'Dodrio', 'Normal', 'Flying', 60, 110, 70, 60, 100, "An evolved form of Doduo, known for its three heads and incredible speed."),
    (86, 'Seel', 'Water', NULL, 65, 45, 55, 45, 45, "A seal-like Pokémon that is known for its swimming ability."),
    (87, 'Dewgong', 'Water', 'Ice', 90, 70, 80, 70, 70, "An evolved form of Seel, known for its graceful swimming and ice attacks."),
    (88, 'Grimer', 'Poison', NULL, 80, 80, 50, 40, 25, "A sludge-like Pokémon that is known for its toxic body."),
    (89, 'Muk', 'Poison', NULL, 105, 105, 75, 65, 50, "An evolved form of Grimer, known for its larger size and increased toxicity."),
    (90, 'Shellder', 'Water', NULL, 30, 65, 100, 45, 40, "A bivalve Pokémon that is known for its hard shell."),
    (91, 'Cloyster', 'Water', 'Ice', 50, 95, 180, 70, 70, "An evolved form of Shellder, known for its powerful ice attacks."),
    (92, 'Gastly', 'Ghost', 'Poison', 30, 35, 30, 100, 80, "A ghostly Pokémon that is known for its ability to envelop opponents in darkness."),
    (93, 'Haunter', 'Ghost', 'Poison', 45, 50, 45, 115, 95, "An evolved form of Gastly, known for its mischievous nature and ability to phase through walls."),
    (94, 'Gengar', 'Ghost', 'Poison', 60, 65, 60, 130, 110, "An evolved form of Haunter, known for its cunning and ability to steal the life of its opponents."),
    (95, 'Onix', 'Rock', 'Ground', 35, 45, 160, 30, 70, "A rock and steel-type Pokémon that is known for its incredible defense and ability to burrow underground."),
    (96, 'Drowzee', 'Psychic', NULL, 60, 48, 45, 90, 42, "A Pokémon that is known for its ability to induce sleep in others."),
    (97, 'Hypno', 'Psychic', NULL, 85, 73, 70, 115, 67, "An evolved form of Drowzee, known for its hypnotic abilities."),
    (98, 'Krabby', 'Water', NULL, 30, 105, 90, 25, 50, "A small crab-like Pokémon that is known for its pincers."),
    (99, 'Kingler', 'Water', NULL, 55, 130, 115, 50, 75, "An evolved form of Krabby, known for its large claws."),
    (100, 'Voltorb', 'Electric', NULL, 40, 30, 50, 55, 100, "A Pokémon that resembles a Poké Ball and is known for its electric attacks."),
    (101, 'Electrode', 'Electric', NULL, 60, 50, 70, 80, 150, "An evolved form of Voltorb, known for its speed and explosive attacks."),
    (102, 'Exeggcute', 'Grass', 'Psychic', 60, 40, 80, 60, 40, "A group of six eggs that are known for their psychic abilities."),
    (103, 'Exeggutor', 'Grass', 'Psychic', 95, 95, 85, 125, 55, "An evolved form of Exeggcute, known for its powerful psychic attacks."),
    (104, 'Cubone', 'Ground', NULL, 50, 50, 95, 40, 35, "A Pokémon that is known for wearing the skull of its deceased mother."),
    (105, 'Marowak', 'Ground', NULL, 60, 80, 110, 50, 45, "An evolved form of Cubone, known for its bone-based attacks."),
    (106, 'Hitmonlee', 'Fighting', NULL, 50, 120, 53, 35, 87, "A Pokémon that is known for its powerful kicking attacks."),
    (107, 'Hitmonchan', 'Fighting', NULL, 50, 105, 79, 35, 76, "A Pokémon that is known for its punching attacks and boxing skills."),
    (108, 'Lickitung', 'Normal', NULL, 90, 55, 75, 60, 30, "A Pokémon that is known for its long tongue and ability to lick opponents."),
    (109, 'Koffing', 'Poison', NULL, 40, 65, 95, 60, 35, "A Pokémon that is known for the toxic gas it releases."),
    (110, 'Weezing', 'Poison', NULL, 65, 90, 120, 85, 60, "An evolved form of Koffing, known for its multiple gas-filled bodies."),
    (111, 'Rhyhorn', 'Ground', 'Rock', 80, 85, 95, 30, 25, "A Pokémon that is known for its tough hide and powerful charge."),
    (112, 'Rhydon', 'Ground', 'Rock', 105, 130, 120, 45, 40, "An evolved form of Rhyhorn, known for its strength and horn."),
    (113, 'Chansey', 'Normal', NULL, 250, 5, 5, 105, 50, "A Pokémon that is known for its healing abilities and egg."),
    (114, 'Tangela', 'Grass', NULL, 65, 55, 115, 100, 60, "A Pokémon that is known for its blue vines and ability to ensnare opponents."),
    (115, 'Kangaskhan', 'Normal', NULL, 105, 95, 80, 40, 90, "A Pokémon that is known for its protective nature and strong maternal instincts."),
    (116, 'Horsea', 'Water', NULL, 30, 40, 70, 70, 60, "A Pokémon that is known for its horse-like appearance and ability to swim."),
    (117, 'Seadra', 'Water', NULL, 55, 65, 95, 95, 85, "An evolved form of Horsea, known for its speed and agility in the water."),
    (118, 'Goldeen', 'Water', NULL, 45, 67, 60, 50, 63, "A Pokémon that is known for its beautiful fins and swimming ability."),
    (119, 'Seaking', 'Water', NULL, 80, 92, 65, 80, 68, "An evolved form of Goldeen, known for its large horns and strength."),
    (120, 'Staryu', 'Water', NULL, 30, 45, 55, 70, 85, "A star-shaped Pokémon that is known for its ability to regenerate."),
    (121, 'Starmie', 'Water', 'Psychic', 60, 75, 85, 100, 115, "An evolved form of Staryu, known for its speed and psychic abilities."),
    (122, 'Mr. Mime', 'Psychic', 'Fairy', 40, 45, 65, 100, 90, "A Pokémon that is known for its mime skills and ability to create barriers."),
    (123, 'Scyther', 'Bug', 'Flying', 70, 110, 80, 55, 105, "A Pokémon that is known for its speed and sharp scythes."),
    (124, 'Jynx', 'Ice', 'Psychic', 65, 50, 35, 115, 95, "A Pokémon that is known for its singing abilities and ice attacks."),
    (125, 'Electabuzz', 'Electric', NULL, 65, 83, 57, 95, 105, "A Pokémon that is known for its electric attacks and agility."),
    (126, 'Magmar', 'Fire', NULL, 65, 95, 57, 100, 93, "A Pokémon that is known for its fiery attacks and hot temper."),
    (127, 'Pinsir', 'Bug', NULL, 65, 125, 100, 55, 85, "A Pokémon that is known for its powerful pincers and aggressive nature."),
    (128, 'Tauros', 'Normal', NULL, 75, 100, 95, 40, 110, "A Pokémon that is known for its strength and wild temperament."),
    (129, 'Magikarp', 'Water', NULL, 20, 10, 55, 20, 80, "A Pokémon that is known for its uselessness, but can evolve into a powerful form."),
    (130, 'Gyarados', 'Water', 'Flying', 95, 125, 79, 60, 81, "An evolved form of Magikarp, known for its ferocity and power."),
    (131, 'Lapras', 'Water', 'Ice', 130, 85, 80, 95, 60, "A Pokémon that is known for its gentle nature and ability to ferry people across water."),
    (132, 'Ditto', 'Normal', NULL, 48, 48, 48, 48, 48, "A Pokémon that is known for its ability to transform into other Pokémon."),
    (133, 'Eevee', 'Normal', NULL, 55, 55, 50, 45, 55, "A Pokémon that is known for its multiple evolution options."),
    (134, 'Vaporeon', 'Water', NULL, 130, 65, 60, 110, 65, "An evolved form of Eevee, known for its aquatic abilities."),
    (135, 'Jolteon', 'Electric', NULL, 65, 65, 60, 110, 130, "An evolved form of Eevee, known for its speed and electric attacks."),
    (136, 'Flareon', 'Fire', NULL, 65, 130, 60, 95, 65, "An evolved form of Eevee, known for its fiery attacks."),
    (137, 'Porygon', 'Normal', NULL, 65, 60, 70, 75, 40, "A Pokémon that is known for its ability to convert its body into data."),
    (138, 'Omanyte', 'Rock', 'Water', 35, 40, 100, 90, 35, "A Pokémon that is known for its spiral shell and ancient origins."),
    (139, 'Omastar', 'Rock', 'Water', 70, 60, 125, 115, 55, "An evolved form of Omanyte, known for its powerful tentacles."),
    (140, 'Kabuto', 'Rock', 'Water', 30, 80, 90, 55, 55, "A Pokémon that is known for its hard shell and swift movements."),
    (141, 'Kabutops', 'Rock', 'Water', 60, 115, 105, 70, 80, "An evolved form of Kabuto, known for its scythe-like arms."),
    (142, 'Aerodactyl', 'Rock', 'Flying', 80, 105, 65, 60, 130, "A Pokémon that is known for its ancient origins and flying abilities."),
    (143, 'Snorlax', 'Normal', NULL, 160, 110, 65, 65, 30, "A Pokémon that is known for its massive size and lazy nature."),
    (144, 'Articuno', 'Ice', 'Flying', 90, 85, 100, 95, 85, "A legendary Pokémon that is known for its ice abilities and graceful flight."),
    (145, 'Zapdos', 'Electric', 'Flying', 90, 90, 85, 125, 100, "A legendary Pokémon that is known for its electric abilities and speed."),
    (146, 'Moltres', 'Fire', 'Flying', 90, 100, 90, 125, 90, "A legendary Pokémon that is known for its fire abilities and majestic wings."),
    (147, 'Dratini', 'Dragon', NULL, 41, 64, 45, 50, 50, "A Pokémon that is known for its serpentine shape and gentle nature."),
    (148, 'Dragonair', 'Dragon', NULL, 61, 84, 65, 70, 70, "An evolved form of Dratini, known for its elegance and power."),
    (149, 'Dragonite', 'Dragon', 'Flying', 91, 134, 95, 100, 80, "An evolved form of Dragonair, known for its strength and speed."),
    (150, 'Mewtwo', 'Psychic', NULL, 106, 110, 90, 154, 130, "A genetically engineered Pokémon, known for its powerful psychic abilities."),
    (151, 'Mew', 'Psychic', NULL, 100, 100, 100, 100, 100, "A mythical Pokémon, known for its ability to learn any move.");






INSERT INTO Moves
    (name, type, power, accuracy)
VALUES
    -- Normal Moves
    ('Tackle', 'Normal', 40, 100),
    ('Body Slam', 'Normal', 85, 100),
    ('Double-Edge', 'Normal', 120, 100),
    ('Hyper Beam', 'Normal', 150, 90),
    ('Mega Punch', 'Normal', 80, 85),
    ('Mega Kick', 'Normal', 120, 75),
    ('Quick Attack', 'Normal', 40, 100),
    ('Seismic Toss', 'Normal', NULL, 100),
    ('Slam', 'Normal', 80, 75),
    ('Substitute', 'Normal', NULL, NULL),
    ('Take Down', 'Normal', 90, 85),
    ('Tail Whip', 'Normal', NULL, 100),
    ('Growl', 'Normal', NULL, 100),
    ('Defense Curl', 'Normal', NULL, NULL),
    ('Soft-Boiled', 'Normal', NULL, NULL),
    ('Rage', 'Normal', 20, 100),

    -- Fire Moves
    ('Ember', 'Fire', 40, 100),
    ('Flamethrower', 'Fire', 90, 100),
    ('Fire Blast', 'Fire', 110, 85),
    ('Fire Spin', 'Fire', 35, 85),

    -- Water Moves
    ('Water Gun', 'Water', 40, 100),
    ('Surf', 'Water', 90, 100),
    ('Hydro Pump', 'Water', 110, 80),
    ('Bubble', 'Water', 40, 100),
    ('BubbleBeam', 'Water', 65, 100),
    ('Mist', 'Water', NULL, NULL),

    -- Grass Moves
    ('Vine Whip', 'Grass', 45, 100),
    ('Razor Leaf', 'Grass', 55, 95),
    ('Growth', 'Grass', NULL, NULL),
    ('Leech Seed', 'Grass', NULL, 90),
    ('Stun Spore', 'Grass', NULL, 75),
    ('Sleep Powder', 'Grass', NULL, 75),
    ('PoisonPowder', 'Grass', NULL, 75),

    -- Electric Moves
    ('Thunder Shock', 'Electric', 40, 100),
    ('Thunderbolt', 'Electric', 90, 100),
    ('Thunder Wave', 'Electric', NULL, 90),
    ('Thunder', 'Electric', 110, 70),

    -- Ice Moves
    ('Ice Beam', 'Ice', 90, 100),
    ('Blizzard', 'Ice', 110, 70),
    ('Aurora Beam', 'Ice', 65, 100),
    ('Wrap', 'Ice', 15, 90),

    -- Fighting Moves
    ('Karate Chop', 'Fighting', 50, 100),
    ('Low Kick', 'Fighting', NULL, 100),
    ('Counter', 'Fighting', NULL, 100),
    ('Submission', 'Fighting', 80, 80),

    -- Poison Moves
    ('Poison Sting', 'Poison', 15, 100),
    ('Toxic', 'Poison', NULL, 90),
    ('Acid', 'Poison', 40, 100),
    ('Smokescreen', 'Poison', NULL, 100),

    -- Ground Moves
    ('Dig', 'Ground', 80, 100),
    ('Earthquake', 'Ground', 100, 100),

    -- Flying Moves
    ('Gust', 'Flying', 40, 100),
    ('Fly', 'Flying', 90, 95),
    ('Wing Attack', 'Flying', 60, 100),

    -- Psychic Moves
    ('Confusion', 'Psychic', 50, 100),
    ('Psychic', 'Psychic', 90, 100),
    ('Hypnosis', 'Psychic', NULL, 60),
    ('Psywave', 'Psychic', NULL, 100),
    ('Teleport', 'Psychic', NULL, NULL),

    -- Bug Moves
    ('String Shot', 'Bug', NULL, 95),
    ('Leech Life', 'Bug', 80, 100),
    ('Twineedle', 'Bug', 25, 100),
    ('Bug Bite', 'Bug', 60, 100),

    -- Rock Moves
    ('Rock Throw', 'Rock', 50, 90),
    ('Rock Slide', 'Rock', 75, 90),
    ('Self-Destruct', 'Rock', 200, 100),
    ('Explosion', 'Rock', 250, 100),

    -- Ghost Moves
    ('Lick', 'Ghost', 30, 100),
    ('Night Shade', 'Ghost', NULL, 100),

    -- Dragon Moves
    ('Dragon Rage', 'Dragon', NULL, 100),
    ('Dragon Breath', 'Dragon', 60, 100);





INSERT INTO Trainers
    (name, age, gender, occupation)
VALUES
    ('Ash', 10, 'Male', 'Pokemon Trainer'),
    ('Misty', 12, 'Female', 'Water Gym Leader'),
    ('Brock', 15, 'Male', 'Rock Gym Leader'),
    ('Lt. Surge', 35, 'Male', 'Electric Gym Leader'),
    ('Erika', 27, 'Female', 'Grass Gym Leader'),
    ('Koga', 40, 'Male', 'Poison Gym Leader'),
    ('Sabrina', 28, 'Female', 'Psychic Gym Leader'),
    ('Blaine', 50, 'Male', 'Fire Gym Leader'),
    ('Giovanni', 45, 'Male', 'Ground Gym Leader'),
    ('Lorelei', 30, 'Female', 'Ice Elite Four');


INSERT INTO TrainerPokemon
    (trainer_id, pokemon_id, nickname, level, current_hp)
VALUES
    -- Ash's Pokémon
    (1, 25, 'Sparky', 10, 35),
    -- Pikachu
    (1, 1, 'Leafy', 8, 45),
    -- Bulbasaur
    (1, 4, 'Flare', 9, 39),
    -- Charmander
    (1, 7, 'Bubbles', 8, 44),
    -- Squirtle

    -- Misty's Pokémon
    (2, 120, 'Sting', 12, 38),
    -- Staryu
    (2, 121, 'Shelly', 14, 50),
    -- Starmie
    (2, 54, 'Quackers', 10, 40),
    -- Psyduck

    -- Brock's Pokémon
    (3, 95, 'Onixy', 15, 90),
    -- Onix
    (3, 74, 'Geodude', 12, 40),
    -- Geodude
    (3, 41, 'Zubats', 10, 30),
    -- Zubat (if he caught one)

    -- Lt. Surge's Pokémon
    (4, 26, 'Bolt', 20, 50),
    -- Raichu
    (4, 25, 'Sparky Jr.', 18, 45),
    -- Pikachu

    -- Erika's Pokémon
    (5, 71, 'Vile', 16, 60),
    -- Victreebel
    (5, 43, 'Oddy', 14, 45),
    -- Oddish

    -- Koga's Pokémon
    (6, 110, 'Weezy', 17, 55),
    -- Weezing
    (6, 89, 'Muk', 18, 65),
    -- Muk
    (6, 48, 'Venonat', 12, 40),
    -- Venonat

    -- Sabrina's Pokémon
    (7, 65, 'Alak', 20, 55),
    -- Alakazam
    (7, 64, 'Kadabra', 18, 50),
    -- Kadabra

    -- Blaine's Pokémon
    (8, 126, 'Magmy', 18, 50),
    -- Magmar
    (8, 77, 'Ponyta', 16, 55),
    -- Ponyta

    -- Giovanni's Pokémon
    (9, 112, 'Rokky', 22, 90),
    -- Rhydon
    (9, 34, 'Nido', 20, 65),
    -- Nidoking

    -- Lorelei's Pokémon
    (10, 121, 'Stary', 18, 50),
    -- Starmie
    (10, 91, 'Cloy', 16, 45);       -- Cloyster
