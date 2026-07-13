#!/usr/bin/env python3
"""
Genera src/data/items.ts a partir de los JSON descargados de D&D 5e SRD API.
Traduce nombres y categorías al español.
"""
import json
import sys
import os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ── Diccionarios de traducción ──

CATEGORIES_EQUIP = {
    'weapon': 'Armas',
    'armor': 'Armaduras',
    'adventuring-gear': 'Equipo de aventura',
    'tools': 'Herramientas',
    'mounts-and-vehicles': 'Monturas y vehículos',
    'gear': 'Equipo',
    'kit': 'Kit',
}

WEAPON_CATEGORIES = {
    'Simple Melee': 'Armas simples cuerpo a cuerpo',
    'Simple Ranged': 'Armas simples a distancia',
    'Martial Melee': 'Arma marcial cuerpo a cuerpo',
    'Martial Ranged': 'Arma marcial a distancia',
}

ARMOR_CATEGORIES = {
    'Light': 'Armadura ligera',
    'Medium': 'Armadura intermedia',
    'Heavy': 'Armadura pesada',
    'Shield': 'Escudo',
}

MAGIC_ITEM_CATEGORIES = {
    'armor': 'Armaduras mágicas',
    'weapon': 'Armas mágicas',
    'wondrous-items': 'Objetos maravillosos',
    'potion': 'Pociones',
    'scroll': 'Pergaminos',
    'ring': 'Anillos',
    'rod': 'Bastones',
    'staff': 'Cetros',
    'wand': 'Varitas',
    'ammunition': 'Munición mágica',
}

RARITIES = {
    'Common': 'Común',
    'Uncommon': 'Poco común',
    'Rare': 'Raro',
    'Very Rare': 'Muy raro',
    'Legendary': 'Legendario',
    'Artifact': 'Artefacto',
    'Varies': 'Variable',
}

DAMAGE_TYPES = {
    'slashing': 'cortante',
    'piercing': 'perforante',
    'bludgeoning': 'contundente',
    'fire': 'fuego',
    'cold': 'frío',
    'lightning': 'rayo',
    'thunder': 'trueno',
    'poison': 'veneno',
    'acid': 'ácido',
    'necrotic': 'necrótico',
    'psychic': 'psíquico',
    'radiant': 'radiante',
    'force': 'fuerza',
    'sonic': 'sónico',
}

WEAPON_PROPERTIES = {
    'versatile': 'versátil',
    'finesse': 'fina',
    'light': 'ligera',
    'heavy': 'pesada',
    'two-handed': 'a dos manos',
    'thrown': 'arrojadiza',
    'reach': 'alcance',
    'loading': 'recarga',
    'ammunition': 'munición',
    'special': 'especial',
    'martial': 'marcial',
    'simple': 'simple',
}

UNITS = {
    'gp': 'po',
    'sp': 'pl',
    'cp': 'pc',
    'ep': 'pe',
    'pp': 'pp',
}

# Traducciones completas de nombres de objetos mágicos
MAGIC_NAME_TRANSLATIONS = {
    'Adamantine Armor': 'Armadura de adamantino',
    'Air Elemental Gem': 'Gema elemental de aire',
    'Amulet of Health': 'Amuleto de salud',
    'Amulet of Proof against Detection and Location': 'Amuleto de protección contra detección y localización',
    'Amulet of the Planes': 'Amuleto de los planos',
    'Anchor Feather Token': 'Ficha pluma de ancla',
    'Animated Shield': 'Escudo animado',
    'Apparatus of the Crab': 'Aparato del cangrejo',
    'Armor of Invulnerability': 'Armadura de invulnerabilidad',
    'Armor of Resistance': 'Armadura de resistencia',
    'Armor of Vulnerability': 'Armadura de vulnerabilidad',
    'Armor, +1': 'Armadura +1',
    'Armor, +2': 'Armadura +2',
    'Armor, +3': 'Armadura +3',
    'Armor, +1, +2, or +3': 'Armadura +1, +2 o +3',
    'Arrow of Slaying': 'Flecha de aniquilación',
    'Arrow-Catching Shield': 'Escudo atrapaflechas',
    'Bag of Beans': 'Bolsa de frijoles',
    'Bag of Devouring': 'Bolsa devoradora',
    'Bag of Holding': 'Bolsa de almacenamiento',
    'Bag of Tricks': 'Bolsa de trucos',
    'Gray Bag of Tricks': 'Bolsa de trucos gris',
    'Rust Bag of Tricks': 'Bolsa de trucos oxidada',
    'Tan Bag of Tricks': 'Bolsa de trucos marrón',
    'Bead of Force': 'Burbuja de fuerza',
    'Belt of Cloud Giant Strength': 'Cinturón de fuerza de gigante de nube',
    'Belt of Dwarvenkind': 'Cinturón de los enanos',
    'Belt of Fire Giant Strength': 'Cinturón de fuerza de gigante de fuego',
    'Belt of Frost Giant Strength': 'Cinturón de fuerza de gigante de escarcha',
    'Belt of Giant Strength': 'Cinturón de fuerza de gigante',
    'Belt of Hill Giant Strength': 'Cinturón de fuerza de gigante de colina',
    'Belt of Stone Giant Strength': 'Cinturón de fuerza de gigante de piedra',
    'Belt of Storm Giant Strength': 'Cinturón de fuerza de gigante de tormenta',
    'Berserker Axe': 'Hacha de berserker',
    'Bird Feather Token': 'Ficha pluma de pájaro',
    'Black Dragon Scale Mail': 'Cota de escamas de dragón negro',
    'Blue Dragon Scale Mail': 'Cota de escamas de dragón azul',
    'Boots of Elvenkind': 'Botas élficas',
    'Boots of Levitation': 'Botas de levitación',
    'Boots of Speed': 'Botas de velocidad',
    'Boots of Striding and Springing': 'Botas de zancada y salto',
    'Boots of the Winterlands': 'Botas de las tierras invernales',
    'Bowl of Commanding Water Elementals': 'Cuenco de mando de elementales de agua',
    'Bracers of Archery': 'Brazales de arquería',
    'Bracers of Defense': 'Brazales de defensa',
    'Brass Dragon Scale Mail': 'Cota de escamas de dragón de latón',
    'Brass Horn of Valhalla': 'Cuerno de Valhalla de latón',
    'Brazier of Commanding Fire Elementals': 'Brasero de mando de elementales de fuego',
    'Bronze Dragon Scale Mail': 'Cota de escamas de dragón de bronce',
    'Bronze Griffon Figurine of Wondrous Power': 'Figurina de grito de bronce de poder maravilloso',
    'Bronze Horn of Valhalla': 'Cuerno de Valhalla de bronce',
    'Brooch of Shielding': 'Broche de escudo',
    'Broom of Flying': 'Escoba voladora',
    'Candle of Invocation': 'Vela de invocación',
    'Cape of the Mountebank': 'Capa del equilibrista',
    'Carpet of Flying': 'Alfombra voladora',
    'Carpet of Flying (3 ft. × 5 ft.)': 'Alfombra voladora (1m × 1,5m)',
    'Carpet of Flying (4 ft. × 6 ft.)': 'Alfombra voladora (1,2m × 1,8m)',
    'Carpet of Flying (5 ft. × 7 ft.)': 'Alfombra voladora (1,5m × 2m)',
    'Carpet of Flying (6 ft. × 9 ft.)': 'Alfombra voladora (1,8m × 2,7m)',
    'Censer of Controlling Air Elementals': 'Incensario de control de elementales de aire',
    'Chime of Opening': 'Címbalo de apertura',
    'Circlet of Blasting': 'Diadema de explosión',
    'Cloak of Arachnida': 'Capa de arácnido',
    'Cloak of Displacement': 'Capa de desplazamiento',
    'Cloak of Elvenkind': 'Capa élfica',
    'Cloak of Protection': 'Capa de protección',
    'Cloak of the Bat': 'Capa del murciélago',
    'Cloak of the Manta Ray': 'Capa del mantarraya',
    'Copper Dragon Scale Mail': 'Cota de escamas de dragón de cobre',
    'Crystal Ball': 'Bola de cristal',
    'Crystal Ball of Mind Reading': 'Bola de cristal de lectura mental',
    'Crystal Ball of Telepathy': 'Bola de cristal de telepatía',
    'Crystal Ball of True Seeing': 'Bola de cristal de visión verdadera',
    'Cube of Force': 'Cubo de fuerza',
    'Cubic Gate': 'Puerta cúbica',
    'Dagger of Venom': 'Daga de veneno',
    'Dancing Sword': 'Espada danzante',
    'Decanter of Endless Water': 'Decantador de agua infinita',
    'Deck of Illusions': 'Baraja de ilusiones',
    'Deck of Many Things': 'Baraja de muchas cosas',
    'Defender': 'Defensor',
    'Demon Armor': 'Armadura de demonio',
    'Dimensional Shackles': 'Grilletes dimensionales',
    'Dragon Scale Mail': 'Cota de escamas de dragón',
    'Dragon Slayer': 'Matabdragones',
    'Dust of Disappearance': 'Polvo de invisibilidad',
    'Dust of Dryness': 'Polvo de sequedad',
    'Dust of Sneezing and Choking': 'Polvo de estornudos y asfixia',
    'Dwarven Plate': 'Armadura de placas enana',
    'Dwarven Thrower': 'Lanza enano',
    'Earth Elemental Gem': 'Gema elemental de tierra',
    'Ebony Fly Figurine of Wondrous Power': 'Figurina de mosca de ébano de poder maravilloso',
    'Efficient Quiver': 'Carcaj eficiente',
    'Efreeti Bottle': 'Botella de efreeti',
    'Elemental Gem': 'Gema elemental',
    'Elven Chain': 'Cadena élfica',
    'Eversmoking Bottle': 'Botella de humo perpetuo',
    'Eyes of Charming': 'Ojos de encantamiento',
    'Eyes of Minute Seeing': 'Ojos de visión minuciosa',
    'Eyes of the Eagle': 'Ojos del águila',
    'Fan Feather Token': 'Ficha pluma de abanico',
    'Feather Token': 'Ficha pluma',
    'Figurine of Wondrous Power': 'Figurina de poder maravilloso',
    'Fire Elemental Gem': 'Gema elemental de fuego',
    'Flame Tongue': 'Lengua de llama',
    'Folding Boat': 'Barco plegable',
    'Frost Brand': 'Marca de escarcha',
    'Gauntlets of Ogre Power': 'Guantes de poder ogro',
    'Gem of Brightness': 'Gema de brillo',
    'Gem of Seeing': 'Gema de visión',
    'Giant Slayer': 'Mata gigantes',
    'Glamoured Studded Leather Armor': 'Armadura de cuero tachonado glamorado',
    'Gloves of Missile Snaring': 'Guantes de interceptación',
    'Gloves of Swimming and Climbing': 'Guantes de natación y escalada',
    'Goggles of Night': 'Gafas de la noche',
    'Gold Dragon Scale Mail': 'Cota de escamas de dragón dorado',
    'Golden Lions Figurine of Wondrous Power': 'Figurina de leones dorados de poder maravilloso',
    'Green Dragon Scale Mail': 'Cota de escamas de dragón verde',
    'Hammer of Thunderbolts': 'Martillo de truenos',
    'Handy Haversack': 'Mochila de herramientas',
    'Hat of Disguise': 'Sombrero de disfraz',
    'Headband of Intellect': 'Diadema de intelecto',
    'Helm of Brilliance': 'Yelmo de brillantez',
    'Helm of Comprehending Languages': 'Yelmo de comprensión de idiomas',
    'Helm of Telepathy': 'Yelmo de telepatía',
    'Helm of Teleportation': 'Yelmo de teletransporte',
    'Holy Avenger': 'Santo vengador',
    'Horn of Blasting': 'Cuerno de estruendo',
    'Horn of Valhalla': 'Cuerno de Valhalla',
    'Horseshoes of Speed': 'Herraduras de velocidad',
    'Horseshoes of a Zephyr': 'Herraduras de céfiro',
    'Immovable Rod': 'Bastón inamovible',
    'Instant Fortress': 'Fortaleza instantánea',
    'Ioun Stone': 'Piedra Ioun',
    'Ioun Stone of Absorption': 'Piedra Ioun de absorción',
    'Ioun Stone of Agility': 'Piedra Ioun de agilidad',
    'Ioun Stone of Awareness': 'Piedra Ioun de conciencia',
    'Ioun Stone of Fortitude': 'Piedra Ioun de fortaleza',
    'Ioun Stone of Greater Absorption': 'Piedra Ioun de mayor absorción',
    'Ioun Stone of Insight': 'Piedra Ioun de intuición',
    'Ioun Stone of Intellect': 'Piedra Ioun de intelecto',
    'Ioun Stone of Leadership': 'Piedra Ioun de liderazgo',
    'Ioun Stone of Mastery': 'Piedra Ioun de maestría',
    'Ioun Stone of Protection': 'Piedra Ioun de protección',
    'Ioun Stone of Regeneration': 'Piedra Ioun de regeneración',
    'Ioun Stone of Reserve': 'Piedra Ioun de reserva',
    'Ioun Stone of Strength': 'Piedra Ioun de fuerza',
    'Ioun Stone of Sustenance': 'Piedra Ioun de sustento',
    'Iron Bands of Binding': 'Bandas de hierro de atadura',
    'Iron Flask': 'Botella de hierro',
    'Iron Horn of Valhalla': 'Cuerno de Valhalla de hierro',
    'Ivory Goats Figurine of Wondrous Power': 'Figurina de cabras de marfil de poder maravilloso',
    'Javelin of Lightning': 'Jabalina de rayos',
    'Lantern of Revealing': 'Linterna de revelación',
    'Luck Blade': 'Hoja de la suerte',
    'Mace of Disruption': 'Maza de disrupción',
    'Mace of Smiting': 'Maza de castigo',
    'Mace of Terror': 'Maza de terror',
    'Mantle of Spell Resistance': 'Manto de resistencia a hechizos',
    'Manual of Bodily Health': 'Manual de salud corporal',
    'Manual of Clay Golems': 'Manual de gólem de arcilla',
    'Manual of Flesh Golems': 'Manual de gólem de carne',
    'Manual of Gainful Exercise': 'Manual de ejercicio productivo',
    'Manual of Golems': 'Manual de gólems',
    'Manual of Iron Golems': 'Manual de gólem de hierro',
    'Manual of Quickness of Action': 'Manual de rapidez de acción',
    'Manual of Stone Golems': 'Manual de gólem de piedra',
    'Marble Elephant Figurine of Wondrous Power': 'Figurina de elefante de mármol de poder maravilloso',
    'Marvelous Pigments': 'Pigmentos maravillosos',
    'Medallion of Thoughts': 'Medallón de pensamientos',
    'Mirror of Life Trapping': 'Espejo de captura vital',
    'Mithral Armor': 'Armadura de mithril',
    'Necklace of Adaptation': 'Collar de adaptabilidad',
    'Necklace of Fireballs': 'Collar de bolas de fuego',
    'Necklace of Prayer Beads': 'Collar de cuentas de oración',
    'Nine Lives Stealer': 'Robavidas',
    'Oathbow': 'Arco de juramento',
    'Obsidian Steed Figurine of Wondrous Power': 'Figurina de corcel de obsidiana de poder maravilloso',
    'Oil of Etherealness': 'Aceite de eterealidad',
    'Oil of Sharpness': 'Aceite de filo',
    'Oil of Slipperiness': 'Aceite de resbaladizo',
    'Onyx Dog Figurine of Wondrous Power': 'Figurina de perro de ónix de poder maravilloso',
    'Orb of Dragonkind': 'Orbe de los dragones',
    'Pearl of Power': 'Perla de poder',
    'Periapt of Health': 'Periapt de salud',
    'Periapt of Proof against Poison': 'Periapt de protección contra veneno',
    'Periapt of Wound Closure': 'Periapt de curación de heridas',
    'Philter of Love': 'Filtro de amor',
    'Pipes of Haunting': 'Flautas de asombro',
    'Pipes of the Sewers': 'Flautas de las cloacas',
    'Plate Armor of Etherealness': 'Armadura de placas de eterealidad',
    'Portable Hole': 'Hoyo portátil',
    'Potion of Acid Resistance': 'Poción de resistencia al ácido',
    'Potion of Animal Friendship': 'Poción de amistad animal',
    'Potion of Clairvoyance': 'Poción de clarividencia',
    'Potion of Climbing': 'Poción de escalada',
    'Potion of Cloud Giant Strength': 'Poción de fuerza de gigante de nube',
    'Potion of Cold Resistance': 'Poción de resistencia al frío',
    'Potion of Diminution': 'Poción de diminución',
    'Potion of Fire Giant Strength': 'Poción de fuerza de gigante de fuego',
    'Potion of Fire Resistance': 'Poción de resistencia al fuego',
    'Potion of Flying': 'Poción de vuelo',
    'Potion of Force Resistance': 'Poción de resistencia a la fuerza',
    'Potion of Frost Giant Strength': 'Poción de fuerza de gigante de escarcha',
    'Potion of Gaseous Form': 'Poción de forma gaseosa',
    'Potion of Giant Strength': 'Poción de fuerza de gigante',
    'Potion of Greater Healing': 'Poción de curación mayor',
    'Potion of Growth': 'Poción de crecimiento',
    'Potion of Healing': 'Poción de curación',
    'Potion of Heroism': 'Poción de heroísmo',
    'Potion of Hill Giant Strength': 'Poción de fuerza de gigante de colina',
    'Potion of Invisibility': 'Poción de invisibilidad',
    'Potion of Lightning Resistance': 'Poción de resistencia al rayo',
    'Potion of Mind Reading': 'Poción de lectura mental',
    'Potion of Necrotic Resistance': 'Poción de resistencia necrótica',
    'Potion of Poison': 'Poción de veneno',
    'Potion of Poison Resistance': 'Poción de resistencia al veneno',
    'Potion of Psychic Resistance': 'Poción de resistencia psíquica',
    'Potion of Radiant Resistance': 'Poción de resistencia radiante',
    'Potion of Resistance': 'Poción de resistencia',
    'Potion of Speed': 'Poción de velocidad',
    'Potion of Stone Giant Strength': 'Poción de fuerza de gigante de piedra',
    'Potion of Storm Giant Strength': 'Poción de fuerza de gigante de tormenta',
    'Potion of Superior Healing': 'Poción de curación superior',
    'Potion of Supreme Healing': 'Poción de curación suprema',
    'Potion of Thunder Resistance': 'Poción de resistencia al trueno',
    'Potion of Water Breathing': 'Poción de respiración acuática',
    'Red Dragon Scale Mail': 'Cota de escamas de dragón rojo',
    'Restorative Ointment': 'Ungüento restaurador',
    'Ring of Acid Resistance': 'Anillo de resistencia al ácido',
    'Ring of Air Elemental Command': 'Anillo de mando de elementales de aire',
    'Ring of Animal Influence': 'Anillo de influencia animal',
    'Ring of Cold Resistance': 'Anillo de resistencia al frío',
    'Ring of Djinni Summoning': 'Anillo de invocación de djinni',
    'Ring of Earth Elemental Command': 'Anillo de mando de elementales de tierra',
    'Ring of Elemental Command': 'Anillo de mando elemental',
    'Ring of Evasion': 'Anillo de evasión',
    'Ring of Feather Falling': 'Anillo de plumas',
    'Ring of Fire Elemental Command': 'Anillo de mando de elementales de fuego',
    'Ring of Fire Resistance': 'Anillo de resistencia al fuego',
    'Ring of Force Resistance': 'Anillo de resistencia a la fuerza',
    'Ring of Free Action': 'Anillo de acción libre',
    'Ring of Invisibility': 'Anillo de invisibilidad',
    'Ring of Jumping': 'Anillo de salto',
    'Ring of Lightning Resistance': 'Anillo de resistencia al rayo',
    'Ring of Mind Shielding': 'Anillo de escudo mental',
    'Ring of Necrotic Resistance': 'Anillo de resistencia necrótica',
    'Ring of Poison Resistance': 'Anillo de resistencia al veneno',
    'Ring of Protection': 'Anillo de protección',
    'Ring of Psychic Resistance': 'Anillo de resistencia psíquica',
    'Ring of Radiant Resistance': 'Anillo de resistencia radiante',
    'Ring of Regeneration': 'Anillo de regeneración',
    'Ring of Resistance': 'Anillo de resistencia',
    'Ring of Shooting Stars': 'Anillo de estrellas fugaces',
    'Ring of Spell Storing': 'Anillo de almacenamiento de hechizos',
    'Ring of Spell Turning': 'Anillo de devolución de hechizos',
    'Ring of Swimming': 'Anillo de natación',
    'Ring of Telekinesis': 'Anillo de telekinesis',
    'Ring of Three Wishes': 'Anillo de tres deseos',
    'Ring of Thunder Resistance': 'Anillo de resistencia al trueno',
    'Ring of Warmth': 'Anillo de calidez',
    'Ring of Water Elemental Command': 'Anillo de mando de elementales de agua',
    'Ring of Water Walking': 'Anillo de caminar sobre el agua',
    'Ring of X-ray Vision': 'Anillo de visión de rayos X',
    'Ring of the Ram': 'Anillo del carnero',
    'Robe of Eyes': 'Túnica de ojos',
    'Robe of Scintillating Colors': 'Túnica de colores centelleantes',
    'Robe of Stars': 'Túnica de estrellas',
    'Robe of Useful Items': 'Túnica de objetos útiles',
    'Robe of the Archmagi': 'Túnica del archimago',
    'Rod of Absorption': 'Bastón de absorción',
    'Rod of Alertness': 'Bastón de alerta',
    'Rod of Lordly Might': 'Bastón de poderío señorial',
    'Rod of Rulership': 'Bastón de mando',
    'Rod of Security': 'Bastón de seguridad',
    'Rope of Climbing': 'Cuerda de escalada',
    'Rope of Entanglement': 'Cuerda de enredo',
    'Scarab of Protection': 'Escarabajo de protección',
    'Scimitar of Speed': 'Cimitarra de velocidad',
    'Serpentine Owl Figurine of Wondrous Power': 'Figurina de búho serpentino de poder maravilloso',
    'Shield of Missile Attraction': 'Escudo de atracción de proyectiles',
    'Silver Dragon Scale Mail': 'Cota de escamas de dragón plateado',
    'Silver Horn of Valhalla': 'Cuerno de Valhalla de plata',
    'Silver Raven Figurine of Wondrous Power': 'Figurina de cuervo de plata de poder maravilloso',
    'Slippers of Spider Climbing': 'Zapatillas de escalada arácnida',
    'Sovereign Glue': 'Pegamento soberano',
    'Spell Scroll': 'Pergamino de hechizo',
    'Spell Scroll (1st)': 'Pergamino de hechizo (1er nivel)',
    'Spell Scroll (2nd)': 'Pergamino de hechizo (2do nivel)',
    'Spell Scroll (3rd)': 'Pergamino de hechizo (3er nivel)',
    'Spell Scroll (4th)': 'Pergamino de hechizo (4to nivel)',
    'Spell Scroll (5th)': 'Pergamino de hechizo (5to nivel)',
    'Spell Scroll (6th)': 'Pergamino de hechizo (6to nivel)',
    'Spell Scroll (7th)': 'Pergamino de hechizo (7mo nivel)',
    'Spell Scroll (8th)': 'Pergamino de hechizo (8vo nivel)',
    'Spell Scroll (9th)': 'Pergamino de hechizo (9no nivel)',
    'Spell Scroll (Cantrip)': 'Pergamino de hechizo (truco)',
    'Spellguard Shield': 'Escudo guardaguardias',
    'Sphere of Annihilation': 'Esfera de aniquilación',
    'Staff of Charming': 'Cetro de encantamiento',
    'Staff of Fire': 'Cetro de fuego',
    'Staff of Frost': 'Cetro de hielo',
    'Staff of Healing': 'Cetro de curación',
    'Staff of Power': 'Cetro de poder',
    'Staff of Striking': 'Cetro de golpe',
    'Staff of Swarming Insects': 'Cetro de insectos enjambres',
    'Staff of Thunder and Lightning': 'Cetro de trueno y rayo',
    'Staff of Withering': 'Cetro de marchitamiento',
    'Staff of the Magi': 'Cetro del mago',
    'Staff of the Python': 'Cetro de la serpiente',
    'Staff of the Woodlands': 'Cetro de los bosques',
    'Stone of Controlling Earth Elementals': 'Piedra de control de elementales de tierra',
    'Stone of Good Luck (Luckstone)': 'Piedra de buena suerte (piedra de la suerte)',
    'Sun Blade': 'Hoja solar',
    'Swan Boat Feather Token': 'Ficha pluma de barco cisne',
    'Sword of Life Stealing': 'Espada de robo de vida',
    'Sword of Sharpness': 'Espada de filo',
    'Sword of Wounding': 'Espada de herida',
    'Talisman of Pure Good': 'Talismán de bondad pura',
    'Talisman of Ultimate Evil': 'Talismán de mal supremo',
    'Talisman of the Sphere': 'Talismán de la esfera',
    'Tan Bag of Tricks': 'Bolsa de trucos marrón',
    'Tome of Clear Thought': 'Tomo de pensamiento claro',
    'Tome of Leadership and Influence': 'Tomo de liderazgo e influencia',
    'Tome of Understanding': 'Tomo de comprensión',
    'Tree Feather Token': 'Ficha pluma de árbol',
    'Trident of Fish Command': 'Tridente de mando de peces',
    'Universal Solvent': 'Solvente universal',
    'Vicious Weapon': 'Arma viciosa',
    'Vorpal Sword': 'Espada vorpal',
    'Wand of Binding': 'Varita de atadura',
    'Wand of Enemy Detection': 'Varita de detección de enemigos',
    'Wand of Fear': 'Varita de miedo',
    'Wand of Fireballs': 'Varita de bolas de fuego',
    'Wand of Lightning Bolts': 'Varita de rayos',
    'Wand of Magic Detection': 'Varita de detección mágica',
    'Wand of Magic Missiles': 'Varita de proyectiles mágicos',
    'Wand of Paralysis': 'Varita de parálisis',
    'Wand of Polymorph': 'Varita de polimorfismo',
    'Wand of Secrets': 'Varita de secretos',
    'Wand of the War Mage': 'Varita del mago de guerra',
    'Wand of the War Mage, +1': 'Varita del mago de guerra +1',
    'Wand of the War Mage, +2': 'Varita del mago de guerra +2',
    'Wand of the War Mage, +3': 'Varita del mago de guerra +3',
    'Wand of the War Mage, +1, +2, or +3': 'Varita del mago de guerra +1, +2 o +3',
    'Wand of Web': 'Varita de red',
    'Wand of Wonder': 'Varita de maravillas',
    'Water Elemental Gem': 'Gema elemental de agua',
    'Weapon, +1': 'Arma +1',
    'Weapon, +2': 'Arma +2',
    'Weapon, +3': 'Arma +3',
    'Weapon, +1, +2, or +3': 'Arma +1, +2 o +3',
    'Well of Many Worlds': 'Pozo de muchos mundos',
    'Whip Feather Token': 'Ficha pluma de látigo',
    'White Dragon Scale Mail': 'Cota de escamas de dragón blanco',
    'Wind Fan': 'Abanico de viento',
    'Winged Boots': 'Botas aladas',
    'Wings of Flying': 'Alas de vuelo',
    'Block of incense': 'Bloque de incienso',
    'Little bag of sand': 'Bolsita de arena',
}


def translate_name(name: str) -> str:
    """Traduce nombres de equipment/magic items al español."""
    # Buscar traducción directa en diccionario de objetos mágicos
    if name in MAGIC_NAME_TRANSLATIONS:
        return MAGIC_NAME_TRANSLATIONS[name]

    # Traducciones por patrón para equipamiento
    PATTERN_TRANSLATIONS = {
        'Barding: ': '',
        'Pack': 'paquete',
    }

    translations = {
        # Armas simples cuerpo a cuerpo
        'Club': 'Porra',
        'Dagger': 'Daga',
        'Greatclub': 'Garrote',
        'Handaxe': 'Hacha de mano',
        'Javelin': 'Jabalina',
        'Light hammer': 'Martillo ligero',
        'Mace': 'Maza',
        'Quarterstaff': 'Bastón',
        'Sickle': 'Hoz',
        'Spear': 'Lanza',
        # Armas simples a distancia
        'Light crossbow': 'Ballesta ligera',
        'Dart': 'Dardo',
        'Shortbow': 'Arco corto',
        'Sling': 'Honda',
        # Armas marciales cuerpo a cuerpo
        'Battleaxe': 'Hacha de batalla',
        'Flail': 'Manguento',
        'Glaive': 'Glaive',
        'Greataxe': 'Gran hacha',
        'Greatsword': 'Espadón',
        'Halberd': 'Alabarda',
        'Lance': 'Lanza de caballería',
        'Longsword': 'Espada larga',
        'Maul': 'Maza grande',
        'Morningstar': 'Estrella del alba',
        'Pike': 'Pica',
        'Rapier': 'Estoque',
        'Scimitar': 'Cimitarra',
        'Shortsword': 'Espada corta',
        'Trident': 'Tridente',
        'War pick': 'Pico de guerra',
        'Warhammer': 'Martillo de guerra',
        'Whip': 'Látigo',
        # Armas marciales a distancia
        'Blowgun': 'Cerbatana',
        'Hand crossbow': 'Ballesta de mano',
        'Heavy crossbow': 'Ballesta pesada',
        'Longbow': 'Arco largo',
        'Net': 'Red',
        # Armaduras
        'Padded armor': 'Armadura acolchada',
        'Leather armor': 'Armadura de cuero',
        'Studded leather armor': 'Armadura de cuero tachonado',
        'Hide armor': 'Armadura de pieles',
        'Chain shirt': 'Camisote de mallas',
        'Scale mail': 'Armadura de escamas',
        'Breastplate': 'Coraza',
        'Half plate armor': 'Armadura de placas semicompleta',
        'Ring mail': 'Armadura de anillas',
        'Chain mail': 'Cota de mallas',
        'Splint armor': 'Armadura de bandas',
        'Plate armor': 'Armadura de placas',
        'Shield': 'Escudo',
        # Equipo de aventura
        'Backpack': 'Mochila',
        'Ball bearings (bag of 1,000)': 'Bolitas de metal (bolsa de 1.000)',
        'Barrel': 'Barril',
        'Bedroll': 'Saco de dormir',
        'Bell': 'Campana',
        'Blanket': 'Manta',
        'Block and tackle': 'Polipasto',
        'Bucket': 'Cubo',
        'Candle': 'Vela',
        'Case': 'Estuche',
        'Chain (10 feet)': 'Cadena (3 metros)',
        'Chalk (1 piece)': 'Tiza (1 pieza)',
        'Chest': 'Cofre',
        'Clothes, common': 'Ropa común',
        'Clothes, costume': 'Ropa de disfraz',
        'Clothes, fine': 'Ropa fina',
        'Clothes, traveler\'s': 'Ropa de viajero',
        'Crossbow bolts (20)': 'Virotes (20)',
        'Fishing tackle': 'Equipo de pesca',
        'Flask or tankard': 'Frasco o jara',
        'Grappling hook': 'Garfio',
        'Hammer': 'Martillo',
        'Hammer, sledge': 'Martillo de percusión',
        'Healing potion': 'Poción de curación',
        'Holy water (flask)': 'Agua bendita (frasco)',
        'Ink (1 ounce bottle)': 'Tintero (frasco de 30 ml)',
        'Ink pen': 'Pluma',
        'Jug or pitcher': 'Jarra',
        'Ladder (10-foot)': 'Escalera (3 metros)',
        'Lamp': 'Lámpara',
        'Lantern, bullseye': 'Linterna de arco',
        'Lantern, hooded': 'Linterna con capucha',
        'Lock': 'Cerradura',
        'Manacles': 'Grilletes',
        'Mess kit': 'Juego de comida',
        'Mirror, steel': 'Espejo de acero',
        'Oil (flask)': 'Aceite (frasco)',
        'Paper (one sheet)': 'Papel (1 hoja)',
        'Parchment (one sheet)': 'Pergamino (1 hoja)',
        'Pole (10-foot)': 'Palo (3 metros)',
        'Pot, iron': 'Olla de hierro',
        'Potion of healing': 'Poción de curación',
        'Pouch': 'Bolsa',
        'Ram, portable': 'Ariete portátil',
        'Rations (1 day)': 'Raciones (1 día)',
        'Rope, hempen (50 feet)': 'Cuerda de cáñamo (15 metros)',
        'Rope, silk (50 feet)': 'Cuerda de seda (15 metros)',
        'Sack': 'Saco',
        'Sealing wax': 'Lacre',
        'Signal whistle': 'Silbato de señal',
        'Signet ring': 'Anillo con sello',
        'Soap (1 pound)': 'Jabón (0,5 kg)',
        'Spikes, iron (10)': 'Púas de hierro (10)',
        'Tinderbox': 'Yesca y pedernal',
        'Torch': 'Antorcha',
        'Vial': 'Vial',
        'Waterskin': 'Odre',
        'Whetstone': 'Afilador',
        # Equipamiento misceláneo
        'Amulet': 'Amuleto',
        'Basket': 'Cesta',
        'Book': 'Libro',
        'Bottle, glass': 'Botella de vidrio',
        'Caltrops': 'Cascabeles',
        'Censer': 'Incensario',
        'Chain Mail': 'Cota de mallas',
        'Chain Shirt': 'Camisote de mallas',
        'Crowbar': 'Palanca',
        'Crystal': 'Cristal',
        'Dice Set': 'Juego de dados',
        'Emblem': 'Emblema',
        'Glaive': 'Glaive',
        'Half Plate Armor': 'Armadura de placas semicompleta',
        'Hide Armor': 'Armadura de pieles',
        'Horn': 'Cuerno',
        'Hourglass': 'Ampolleta',
        'Hunting trap': 'Trampa de caza',
        'Leather Armor': 'Armadura de cuero',
        'Magnifying glass': 'Lupa',
        'Orb': 'Orbe',
        'Padded Armor': 'Armadura acolchada',
        'Perfume (vial)': 'Perfume (vial)',
        'Pick, miner\'s': 'Pico de minero',
        'Piton': 'Pico',
        'Plate Armor': 'Armadura de placas',
        'Playing Card Set': 'Baraja de cartas',
        'Poison, basic (vial)': 'Veneno básico (vial)',
        'Quiver': 'Carcaj',
        'Reliquary': 'Relicario',
        'Ring Mail': 'Armadura de anillas',
        'Robes': 'Túnica',
        'Scale Mail': 'Armadura de escamas',
        'Scale, merchant\'s': 'Balanza de mercader',
        'Shovel': 'Pala',
        'Sling bullet': 'Bala de honda',
        'Small knife': 'Cuchillo pequeño',
        'Soap': 'Jabón',
        'Spellbook': 'Libro de hechizos',
        'Spike, iron': 'Púa de hierro',
        'Splint Armor': 'Armadura de bandas',
        'Spyglass': 'Catalejo',
        'Studded Leather Armor': 'Armadura de cuero tachonado',
        'Tent, two-person': 'Tienda de dos personas',
        'Vestments': 'Vestimentas sagradas',
        'Wand': 'Varita',
        'String (10 feet)': 'Hilo (3 metros)',
        # Armas
        'Crossbow, hand': 'Ballesta de mano',
        'Crossbow, heavy': 'Ballesta pesada',
        'Crossbow, light': 'Ballesta ligera',
        'Blowgun needle': 'Aguja de cerbatana',
        # Herramientas
        'Alchemist\'s Supplies': 'Útiles de alquimista',
        'Brewer\'s Supplies': 'Útiles de cervecero',
        'Calligrapher\'s Supplies': 'Útiles de calígrafo',
        'Carpenter\'s Tools': 'Herramientas de carpintero',
        'Cartographer\'s Tools': 'Herramientas de cartógrafo',
        'Climber\'s Kit': 'Kit de escalada',
        'Cobbler\'s Tools': 'Herramientas de zapatero',
        'Disguise Kit': 'Kit de disfraz',
        'Forgery Kit': 'Kit de falsificación',
        'Glassblower\'s Tools': 'Herramientas de soplador de vidrio',
        'Healer\'s Kit': 'Kit de curandero',
        'Herbalism Kit': 'Kit de herbolaria',
        'Jeweler\'s Tools': 'Herramientas de joyero',
        'Leatherworker\'s Tools': 'Herramientas de peletero',
        'Mason\'s Tools': 'Herramientas de albañil',
        'Mess Kit': 'Juego de comida',
        'Navigator\'s Tools': 'Útiles de navegación',
        'Painter\'s Supplies': 'Útiles de pintor',
        'Poisoner\'s Kit': 'Kit de envenenador',
        'Potter\'s Tools': 'Herramientas de alfarero',
        'Smith\'s Tools': 'Herramientas de herrero',
        'Thieves\' Tools': 'Herramientas de ladrón',
        'Tinker\'s Tools': 'Herramientas de relojero',
        'Weaver\'s Tools': 'Herramientas de tejedor',
        'Woodcarver\'s Tools': 'Herramientas de tallador',
        # Instrumentos musicales
        'Bagpipes': 'Gaita',
        'Drum': 'Tambor',
        'Dulcimer': 'Cítara',
        'Flute': 'Flauta',
        'Horn': 'Cuerno',
        'Lute': 'Laúd',
        'Lyre': 'Lira',
        'Pan flute': 'Flauta de Pan',
        'Shawm': 'Chirimía',
        'Viol': 'Violín',
        # Paquetes
        'Burglar\'s Pack': 'Paquete de ladrón',
        'Diplomat\'s Pack': 'Paquete de diplomático',
        'Dungeoneer\'s Pack': 'Paquete de explorador',
        'Entertainer\'s Pack': 'Paquete de artista',
        'Explorer\'s Pack': 'Paquete de explorador',
        'Priest\'s Pack': 'Paquete de sacerdote',
        'Scholar\'s Pack': 'Paquete de erudito',
        # Monturas y vehículos
        'Animal Feed (1 day)': 'Alimento para animales (1 día)',
        'Camel': 'Camello',
        'Donkey': 'Burro',
        'Elephant': 'Elefante',
        'Horse, draft': 'Caballo de tiro',
        'Horse, riding': 'Caballo de montar',
        'Mastiff': 'Mastín',
        'Mule': 'Mula',
        'Pony': 'Ponni',
        'Saddle, Exotic': 'Silla exótica',
        'Saddle, Military': 'Silla militar',
        'Saddle, Pack': 'Silla de carga',
        'Saddle, Riding': 'Silla de montar',
        'Sled': 'Trineo',
        'Warhorse': 'Caballo de guerra',
        # Barding
        'Barding: Breastplate': 'Armadura de caballería: Coraza',
        'Barding: Chain mail': 'Armadura de caballería: Cota de mallas',
        'Barding: Chain shirt': 'Armadura de caballería: Camisote de mallas',
        'Barding: Half plate': 'Armadura de caballería: Placas semicompletas',
        'Barding: Hide': 'Armadura de caballería: Pieles',
        'Barding: Leather': 'Armadura de caballería: Cuero',
        'Barding: Padded': 'Armadura de caballería: Acolchada',
        'Barding: Plate': 'Armadura de caballería: Placas',
        'Barding: Ring mail': 'Armadura de caballería: Anillas',
        'Barding: Scale mail': 'Armadura de caballería: Escamas',
        'Barding: Splint': 'Armadura de caballería: Bandas',
        'Barding: Studded Leather': 'Armadura de caballería: Cuero tachonado',
        # Barcos
        'Longship': 'Barco largo',
        'Sailing ship': 'Barco velero',
        'Warship': 'Barco de guerra',
        # Herramientas
        'Crowbar': 'Palanca',
        # Herramientas
        'Alchemist\'s supplies': 'Útiles de alquimista',
        'Artisan\'s tools': 'Herramientas de artesano',
        'Brewer\'s supplies': 'Útiles de cervecero',
        'Calligrapher\'s supplies': 'Útiles de calígrafo',
        'Carpenter\'s tools': 'Herramientas de carpintero',
        'Cartographer\'s tools': 'Herramientas de cartógrafo',
        'Cobbler\'s tools': 'Herramientas de zapatero',
        'Cook\'s utensils': 'Utensilios de cocinero',
        'Disguise kit': 'Kit de disfraz',
        'Forgery kit': 'Kit de falsificación',
        'Gaming set': 'Juego de mesa',
        'Herbalism kit': 'Kit de herbolaria',
        'Healer\'s kit': 'Kit de curandero',
        'Jeweler\'s tools': 'Herramientas de joyero',
        'Leatherworker\'s tools': 'Herramientas de peletero',
        'Luthier\'s tools': 'Herramientas de lutier',
        'Mason\'s tools': 'Herramientas de albañil',
        'Musician\'s instruments': 'Instrumentos musicales',
        'Navigator\'s tools': 'Útiles de navegación',
        'Painter\'s supplies': 'Útiles de pintor',
        'Poisoner\'s kit': 'Kit de envenenador',
        'Potter\'s tools': 'Herramientas de alfarero',
        'Smith\'s tools': 'Herramientas de herrero',
        'Thieves\' tools': 'Herramientas de ladrón',
        'Tinker\'s tools': 'Herramientas de relojero',
        'Weaver\'s tools': 'Herramientas de tejedor',
        'Woodcarver\'s tools': 'Herramientas de tallador',
        'Calligrapher\'s supplies': 'Útiles de calígrafo',
        # Otros
        'Abacus': 'Ábaco',
        'Acid (vial)': 'Ácido (vial)',
        'Alchemist\'s fire (flask)': 'Fuego de alquimista (frasco)',
        'Antitoxin (vial)': 'Antitoxina (vial)',
        'Arrow': 'Flecha',
        'Blowgun needles': 'Agujas de cerbatana',
        'Bolt': 'Virote',
        'Bullets, sling': 'Balas de honda',
        'Crossbow bolt': 'Virote',
        'Pebble': 'Canto rodado',
        'Torch': 'Antorcha',
        'Animal feed (1 day)': 'Alimento para animales (1 día)',
        'Bit and bridle': 'Brida',
        'Carriage': 'Carruaje',
        'Cart': 'Carro',
        'Chariot': 'Carro de guerra',
        'Galley': 'Galeón',
        'Keelboat': 'Barcaza',
        'Longship': 'Longship',
        'Rowboat': 'Barco a remos',
        'Saddle': 'Silla de montar',
        'Saddlebags': 'Alforjas',
        'Stabling (1 day)': 'Establo (1 día)',
        'Wagon': 'Carro de caballos',
        # Mágicos
        'Adamantine Armor': 'Armadura de adamantino',
        'Amulet of Health': 'Amuleto de salud',
        'Amulet of Proof against Detection and Location': 'Amuleto de protección contra detección y localización',
        'Amulet of the Planes': 'Amuleto de los planos',
        'Animated Shield': 'Escudo animado',
        'Bag of Holding': 'Bolsa de almacenamiento',
        'Belt of Dwarvenkind': 'Cinturón de los enanos',
        'Belt of Hill Giant Strength': 'Cinturón de fuerza de gigante de colina',
        'Berserker Axe': 'Hacha de berserker',
        'Boots of Elvenkind': 'Botas élficas',
        'Boots of Speed': 'Botas de velocidad',
        'Boots of Striding and Springing': 'Botas de zancada y salto',
        'Bracers of Archery': 'Brazales de arquería',
        'Brooch of Shielding': 'Broche de escudo',
        'Broom of Flying': 'Escoba voladora',
        'Cape of the Mountebank': 'Capa del equilibrista',
        'Cloak of Displacement': 'Capa de desplazamiento',
        'Cloak of Protection': 'Capa de protección',
        'Crystal Ball': 'Bola de cristal',
        'Dancing Sword': 'Espada danzante',
        'Devil\'s Eye Brooch': 'Ojo del diablo',
        'Gauntlets of Ogre Power': 'Guantes de poder ogro',
        'Gloves of Missile Snaring': 'Guantes de interceptación',
        'Gloves of Swimming and Climbing': 'Guantes de natación y escalada',
        'Goggles of Night': 'Gafas de la noche',
        'Hammer of Thunderbolts': 'Martillo de truenos',
        'Helm of Brilliance': 'Yelmo de brillantez',
        'Helm of Telepathy': 'Yelmo de telepatía',
        'Helm of Teleportation': 'Yelmo de teletransporte',
        'Horn of Blasting': 'Cuerno de estruendo',
        'Horn of Valhalla': 'Cuerno de Valhalla',
        'Instrument of the Bards': 'Instrumento de los bardos',
        'Ioun Stone': 'Piedra Ioun',
        'Javelin of Lightning': 'Jabalina de rayos',
        'Luck Blade': 'Hoja de la suerte',
        'Mace of Disruption': 'Maza de disrupción',
        'Mace of Smiting': 'Maza de castigo',
        'Mace of Terror': 'Maza de terror',
        'Medallion of Thoughts': 'Medallón de pensamientos',
        'Necklace of Adaptability': 'Collar de adaptabilidad',
        'Necklace of Strangulation': 'Collar de estrangulación',
        'Oil of Etherealness': 'Aceite de eterealidad',
        'Oil of Slipperiness': 'Aceite de resbaladizo',
        'Periapt of Health': 'Periapt de salud',
        'Periapt of Proof against Poison': 'Periapt de protección contra veneno',
        'Periapt of Wound Closure': 'Periapt de curación de heridas',
        'Phylactery': 'Filacteria',
        'Pipe of Smoke Monsters': 'Pipa de monstruos de humo',
        'Plate Armor of Etherealness': 'Armadura de placas de eterealidad',
        'Potion of Climbing': 'Poción de escalada',
        'Potion of Growth': 'Poción de crecimiento',
        'Potion of Healing': 'Poción de curación',
        'Potion of Poison': 'Poción de veneno',
        'Ring of Evasion': 'Anillo de evasión',
        'Ring of Feather Falling': 'Anillo de plumas',
        'Ring of Free Action': 'Anillo de acción libre',
        'Ring of Mind Shielding': 'Anillo de escudo mental',
        'Ring of Protection': 'Anillo de protección',
        'Ring of Regeneration': 'Anillo de regeneración',
        'Ring of Spell Storing': 'Anillo de almacenamiento de hechizos',
        'Ring of the Ram': 'Anillo del carnero',
        'Ring of Three Wishes': 'Anillo de tres deseos',
        'Ring of Truth Telling': 'Anillo de verdad',
        'Robe of Eyes': 'Túnica de ojos',
        'Robe of Stars': 'Túnica de estrellas',
        'Robe of the Archmagi': 'Túnica del archimago',
        'Rod of Alertness': 'Bastón de alerta',
        'Rod of Rulership': 'Bastón de mando',
        'Rod of the Pact Keeper': 'Bastón del guardián del pacto',
        'Scimitar of Speed': 'Cimitarra de velocidad',
        'Shield, +1': 'Escudo +1',
        'Shield, +2': 'Escudo +2',
        'Shield, +3': 'Escudo +3',
        'Shield of Missile Attraction': 'Escudo de atracción de proyectiles',
        'Slippers of Spider Climbing': 'Zapatillas de escalada arácnida',
        'Staff of Charming': 'Cetro de encantamiento',
        'Staff of Fire': 'Cetro de fuego',
        'Staff of Frost': 'Cetro de hielo',
        'Staff of Power': 'Cetro de poder',
        'Staff of Striking': 'Cetro de golpe',
        'Staff of Swarming Insects': 'Cetro de insectos enjambres',
        'Staff of the Magi': 'Cetro del mago',
        'Staff of the Woodlands': 'Cetro de los bosques',
        'Staff of Withering': 'Cetro de marchitamiento',
        'Sword of Sharpness': 'Espada de filo',
        'Sword of Vengeance': 'Espada de venganza',
        'Sword of Wounding': 'Espada de herida',
        'Tentacle Rod': 'Bastón tentáculo',
        'Tome of Clear Thought': 'Tomo de pensamiento claro',
        'Tome of Leadership and Influence': 'Tomo de liderazgo e influencia',
        'Tome of Understanding': 'Tomo de comprensión',
        'Wand of Binding': 'Varita de atadura',
        'Wand of Enemy Detection': 'Varita de detección de enemigos',
        'Wand of Fireballs': 'Varita de bolas de fuego',
        'Wand of Lightning Bolts': 'Varita de rayos',
        'Wand of Magic Detection': 'Varita de detección mágica',
        'Wand of Magic Missiles': 'Varita de proyectiles mágicos',
        'Wand of Paralysis': 'Varita de parálisis',
        'Wand of Wonder': 'Varita de maravillas',
        'Weapon, +1': 'Arma +1',
        'Weapon, +2': 'Arma +2',
        'Weapon, +3': 'Arma +3',
        'Winged Boots': 'Botas aladas',
        'Wings of Flying': 'Alas de vuelo',
        # Misc equipment
        'Alms box': 'Caja de limosna',
        'Block and tackle': 'Polipasto',
        'Component pouch': 'Bolsa de componentes',
        'Holy symbol': 'Símbolo sagrado',
        'Arcane focus': 'Enfoque arcano',
        'Druidic focus': 'Enfoque druídico',
        'Sprig of mistletoe': 'Rama de muérdago',
        'Totem': 'Tótem',
        'Wooden staff': 'Bastón de madera',
        'Yew wand': 'Varita de tejo',
        'Playing card set': 'Baraja de cartas',
        'Dice set': 'Juego de dados',
    }
    return translations.get(name, name)


def translate_description(name: str, item: dict) -> str:
    """Genera descripción en español basada en los datos del item."""
    cat = item.get('equipment_category', {}).get('index', '')

    if cat == 'weapon':
        damage = item.get('damage', {})
        dice = damage.get('damage_dice', '?')
        dtype = DAMAGE_TYPES.get(damage.get('damage_type', {}).get('index', ''), '?')
        props = item.get('properties', [])
        prop_names = [WEAPON_PROPERTIES.get(p.get('index', ''), p.get('index', '')) for p in props]

        desc_parts = [f'Arma que inflige {dice} de daño {dtype}.']
        if prop_names:
            desc_parts.append(f'Propiedades: {", ".join(prop_names)}.')
        return ' '.join(desc_parts)

    elif cat == 'armor':
        ac = item.get('armor_class', {})
        base = ac.get('base', '?')
        dex = '+DES' if ac.get('dex_bonus') else ''
        max_bonus = ac.get('max_bonus')
        if max_bonus:
            ac_str = f'CA {base} + DES (máx {max_bonus})'
        elif dex:
            ac_str = f'CA {base} + DES'
        else:
            ac_str = f'CA {base}'

        parts = [f'Armadura con {ac_str}.']
        if item.get('str_minimum'):
            parts.append(f'Requiere FUE {item["str_minimum"]}.')
        if item.get('stealth_disadvantage'):
            parts.append('Desventaja en Sigilo.')
        return ' '.join(parts)

    elif cat == 'adventuring-gear' or cat == 'gear' or cat == 'kit':
        return translate_name(name)

    elif cat == 'tools':
        return translate_name(name)

    else:
        return translate_name(name)


def build_properties_string(item: dict) -> str:
    """Construye string de propiedades para armas."""
    cat = item.get('equipment_category', {}).get('index', '')

    if cat == 'weapon':
        damage = item.get('damage', {})
        dice = damage.get('damage_dice', '')
        dtype = DAMAGE_TYPES.get(damage.get('damage_type', {}).get('index', ''), '')
        two_handed = item.get('two_handed_damage', {})
        props = [WEAPON_PROPERTIES.get(p.get('index', ''), p.get('index', '')) for p in item.get('properties', [])]

        parts = []
        if dice:
            parts.append(f'{dice} {dtype}')
        if two_handed:
            td = two_handed.get('damage_dice', '')
            tt = DAMAGE_TYPES.get(two_handed.get('damage_type', {}).get('index', ''), '')
            parts.append(f'2 manos: {td} {tt}')
        if item.get('range', {}).get('normal'):
            r = item['range']['normal']
            long = item.get('range', {}).get('long')
            if long:
                parts.append(f'Alcance {r}/{long}')
            else:
                parts.append(f'Alcance {r}')
        if props:
            parts.append(', '.join(props))
        return ' | '.join(parts)

    elif cat == 'armor':
        ac = item.get('armor_class', {})
        base = ac.get('base', '?')
        dex = '+DES' if ac.get('dex_bonus') else ''
        max_b = ac.get('max_bonus')
        if max_b:
            return f'CA {base} + DES (máx {max_b})'
        elif dex:
            return f'CA {base} + DES'
        return f'CA {base}'

    return ''


def generate_ts(items_data: list, magic_items_data: list) -> str:
    """Genera el contenido del archivo TypeScript."""
    lines = []
    lines.append('export interface ShopItem {')
    lines.append("  id: string")
    lines.append("  name: string")
    lines.append("  category: string")
    lines.append("  cost: number")
    lines.append("  currency: string")
    lines.append("  description: string")
    lines.append("  weight: string")
    lines.append("  properties: string")
    lines.append("  rarity?: string")
    lines.append("}")
    lines.append("")
    lines.append("export const ITEMS: ShopItem[] = [")

    # ── Equipment ──
    lines.append("  // ════════════════════════════════════════")
    lines.append("  // EQUIPAMIENTO (SRD 5e)")
    lines.append("  // ════════════════════════════════════════")

    # Group equipment by category
    equip_by_cat = {}
    for item in items_data:
        cat_index = item.get('equipment_category', {}).get('index', 'unknown')
        cat_name = CATEGORIES_EQUIP.get(cat_index, cat_index)

        # Further subcategorize weapons
        if cat_index == 'weapon':
            wc = item.get('category_range', '')
            cat_name = WEAPON_CATEGORIES.get(wc, cat_name)
        elif cat_index == 'armor':
            ac = item.get('armor_category', '')
            cat_name = ARMOR_CATEGORIES.get(ac, cat_name)

        if cat_name not in equip_by_cat:
            equip_by_cat[cat_name] = []
        equip_by_cat[cat_name].append(item)

    # Order categories
    cat_order = [
        'Armas simples cuerpo a cuerpo', 'Armas simples a distancia',
        'Arma marcial cuerpo a cuerpo', 'Arma marcial a distancia',
        'Armadura ligera', 'Armadura intermedia', 'Armadura pesada', 'Escudo',
        'Equipo de aventura', 'Herramientas', 'Monturas y vehículos', 'Armas',
        'Armaduras', 'Equipo',
    ]

    for cat_name in cat_order:
        if cat_name not in equip_by_cat:
            continue
        items_in_cat = equip_by_cat[cat_name]
        lines.append(f"  // ── {cat_name} ──")
        for item in items_in_cat:
            idx = item.get('index', '')
            name_es = translate_name(item.get('name', idx))
            cost_qty = item.get('cost', {}).get('quantity', 0)
            cost_unit = item.get('cost', {}).get('unit', 'gp')
            currency = UNITS.get(cost_unit, cost_unit)
            weight_raw = item.get('weight', 0)
            weight_str = f'{weight_raw} kg' if weight_raw else '-'
            desc = translate_description(item.get('name', ''), item)
            props = build_properties_string(item)

            # Escape single quotes in strings
            name_esc = name_es.replace("'", "\\'")
            desc_esc = desc.replace("'", "\\'")
            props_esc = props.replace("'", "\\'")

            lines.append(f"  {{ id: '{idx}', name: '{name_esc}', category: '{cat_name}', cost: {cost_qty}, currency: '{currency}', description: '{desc_esc}', weight: '{weight_str}', properties: '{props_esc}' }},")

    # Add any remaining categories not in cat_order
    for cat_name, items_in_cat in equip_by_cat.items():
        if cat_name in cat_order:
            continue
        lines.append(f"  // ── {cat_name} ──")
        for item in items_in_cat:
            idx = item.get('index', '')
            name_es = translate_name(item.get('name', idx))
            cost_qty = item.get('cost', {}).get('quantity', 0)
            cost_unit = item.get('cost', {}).get('unit', 'gp')
            currency = UNITS.get(cost_unit, cost_unit)
            weight_raw = item.get('weight', 0)
            weight_str = f'{weight_raw} kg' if weight_raw else '-'
            desc = translate_description(item.get('name', ''), item)
            props = build_properties_string(item)

            name_esc = name_es.replace("'", "\\'")
            desc_esc = desc.replace("'", "\\'")
            props_esc = props.replace("'", "\\'")

            lines.append(f"  {{ id: '{idx}', name: '{name_esc}', category: '{cat_name}', cost: {cost_qty}, currency: '{currency}', description: '{desc_esc}', weight: '{weight_str}', properties: '{props_esc}' }},")

    # ── Magic Items ──
    lines.append("")
    lines.append("  // ════════════════════════════════════════")
    lines.append("  // OBJETOS MÁGICOS (SRD 5e)")
    lines.append("  // ════════════════════════════════════════")

    magic_by_cat = {}
    for item in magic_items_data:
        cat_index = item.get('equipment_category', {}).get('index', 'unknown')
        cat_name = MAGIC_ITEM_CATEGORIES.get(cat_index, cat_index)
        if cat_name not in magic_by_cat:
            magic_by_cat[cat_name] = []
        magic_by_cat[cat_name].append(item)

    magic_cat_order = [
        'Armaduras mágicas', 'Armas mágicas', 'Objetos maravillosos',
        'Pociones', 'Pergaminos', 'Anillos', 'Bastones', 'Cetros', 'Varitas',
        'Munición mágica',
    ]

    for cat_name in magic_cat_order:
        if cat_name not in magic_by_cat:
            continue
        items_in_cat = magic_by_cat[cat_name]
        lines.append(f"  // ── {cat_name} ──")
        for item in items_in_cat:
            idx = item.get('index', '')
            name_es = translate_name(item.get('name', idx))
            rarity = RARITIES.get(item.get('rarity', {}).get('name', ''), item.get('rarity', {}).get('name', ''))
            # Magic items usually don't have cost in the API, use 0 as placeholder
            # But common potions etc have standard prices
            cost = 0
            currency = 'po'

            # Build description from desc array
            desc_parts = item.get('desc', [])
            desc_lines = [d for d in desc_parts if not d.startswith(('Potion', 'Ring', 'Scroll', 'Wand', 'Rod', 'Staff', 'Wondrous', 'Armor', 'Weapon', 'Ammunition', 'Ring, very rare', 'Ring, rare', 'Ring, uncommon'))]
            desc = ' '.join(desc_lines).strip() if desc_lines else name_es
            # Truncate very long descriptions
            if len(desc) > 300:
                desc = desc[:297] + '...'

            name_esc = name_es.replace("'", "\\'")
            desc_esc = desc.replace("'", "\\'").replace('\n', ' ')

            lines.append(f"  {{ id: '{idx}', name: '{name_esc}', category: '{cat_name}', cost: {cost}, currency: '{currency}', description: '{desc_esc}', weight: '-', properties: '{rarity}', rarity: '{rarity}' }},")

    # Add any remaining magic categories
    for cat_name, items_in_cat in magic_by_cat.items():
        if cat_name in magic_cat_order:
            continue
        lines.append(f"  // ── {cat_name} ──")
        for item in items_in_cat:
            idx = item.get('index', '')
            name_es = translate_name(item.get('name', idx))
            rarity = RARITIES.get(item.get('rarity', {}).get('name', ''), item.get('rarity', {}).get('name', ''))
            cost = 0
            currency = 'po'
            desc_parts = item.get('desc', [])
            desc = ' '.join(desc_parts).strip() if desc_parts else name_es
            if len(desc) > 300:
                desc = desc[:297] + '...'
            name_esc = name_es.replace("'", "\\'")
            desc_esc = desc.replace("'", "\\'").replace('\n', ' ')
            lines.append(f"  {{ id: '{idx}', name: '{name_esc}', category: '{cat_name}', cost: {cost}, currency: '{currency}', description: '{desc_esc}', weight: '-', properties: '{rarity}', rarity: '{rarity}' }},")

    lines.append("]")
    return '\n'.join(lines)


def main():
    equip_path = os.path.join(BASE, 'src', 'data', 'raw_equipment.json')
    magic_path = os.path.join(BASE, 'src', 'data', 'raw_magic_items.json')

    if not os.path.exists(equip_path):
        print(f"Error: {equip_path} not found")
        sys.exit(1)
    if not os.path.exists(magic_path):
        print(f"Error: {magic_path} not found")
        sys.exit(1)

    with open(equip_path) as f:
        equip = json.load(f)
    with open(magic_path) as f:
        magic = json.load(f)

    print(f"Equipment: {len(equip)} items")
    print(f"Magic items: {len(magic)} items")

    ts_content = generate_ts(equip, magic)

    out_path = os.path.join(BASE, 'src', 'data', 'items.ts')
    with open(out_path, 'w') as f:
        f.write(ts_content)

    print(f"Generated {out_path}")
    print(f"Total items: {len(equip) + len(magic)}")


if __name__ == '__main__':
    main()
