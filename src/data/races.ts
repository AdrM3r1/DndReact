export interface Subrace {
  name: string
  description: string
  modifiers: string
  traits: string
}

export interface RaceInfo {
  id: string
  name: string
  description: string
  traits: string
  modifiers: string
  speed: string
  icon: string
  subraces?: Subrace[]
}

export const races: RaceInfo[] = [
  {
    id: 'Draco',
    name: 'DRACONIDO',
    description: `Tu herencia draconida se manifiesta en una serie de rasgos que compartes con otros draconidos. Los draconidos tienden hacia los extremos en la guerra cosmica entre el bien y el mal. La mayoria son buenos, pero los que se ponen de lado del mal pueden ser terriblemente malignos.`,
    traits: `Linaje dracónico. Elige un tipo de dragon (Azul/Relampago, Blanco/Frio, Bronce/Relampago, Cobre/Acido, Oro/Fuego, Oropel/Fuego, Plata/Frio, Negro/Acido, Rojo/Fuego, Verde/Veneno). Ataque de aliento: accion para exhalar energia (2d6, aumenta con nivel). Resistencia al daño segun tu linaje.`,
    modifiers: '+2 Fuerza, +1 Carisma',
    speed: '30 pies',
    icon: '/images/iconItems/races/Draco.png',
  },
  {
    id: 'Elf',
    name: 'ELFO',
    description: `Los elfos circulan libremente por las tierras de los humanos, donde siempre son bienvenidos pero nunca se encuentran como en casa. Son gentes conocidas por su poesia, baile, canto, saber y artes magicas, y gustan de las cosas cuya belleza sea natural y sencilla.`,
    traits: `Vision en la oscuridad (60 pies). Linaje feerico: ventaja en salvaciones contra hechizado, no puedes ser dormido por magia. Trance: 4h de meditacion = 8h de sueno. Competencia: Percepcion.`,
    modifiers: '+2 Destreza',
    speed: '30 pies',
    icon: '/images/iconItems/races/Elf.png',
    subraces: [
      {
        name: 'ALTO ELFO',
        description: `Posees una mente aguda y un dominio de, al menos, los conceptos basicos de la magia.`,
        modifiers: '+1 Inteligencia. Competencia: Arco corto, Espada corta, Espada larga y Arco largo.',
        traits: `Truco: conoces un truco de la lista de mago (Inteligencia). Idioma adicional a eleccion.`,
      },
    ],
  },
  {
    id: 'Dwarf',
    name: 'ENANO',
    description: `Los enanos son conocidos por su habilidad en el arte de la guerra, su gran resistencia a los castigos, su conocimiento de los secretos de la tierra, su dedicacion al trabajo y su capacidad para beber cerveza.`,
    traits: `Vision en la oscuridad (60 pies). Fortaleza enana: ventaja en salvaciones contra veneno, resistencia a daño por veneno. Afinidad con la piedra: competencia doble en Historia (mamposteria). Velocidad enana: tu velocidad no se reduce por armadura pesada. Competencia: Hacha de mano, Hacha de batalla, Martillo de guerra, Martillo ligero + herramientas de artesano.`,
    modifiers: '+2 Constitucion',
    speed: '25 pies',
    icon: '/images/iconItems/races/Dwarf.png',
    subraces: [
      {
        name: 'ENANO DE LAS COLINAS',
        description: `Los enanos de las colinas tienen unos sentidos agudos, una gran intuicion y una fortaleza increible.`,
        modifiers: '+1 Sabiduria. +(Nivel) Puntos de Golpe.',
        traits: `Vision en la oscuridad (60 pies). Fortaleza enana. Afinidad con la piedra. Velocidad enana.`,
      },
    ],
  },
  {
    id: 'Gnome',
    name: 'GNOMO',
    description: `Los gnomos son bienvenidos en todas partes como tecnicos, alquimistas e inventores, pero muchos de ellos prefieren quedarse entre los suyos aunque sus habilidades esten muy demandadas.`,
    traits: `Vision en la oscuridad (60 pies). Astucia de gnomo: ventaja en salvaciones de Inteligencia, Sabiduria y Carisma contra magia.`,
    modifiers: '+2 Inteligencia',
    speed: '25 pies',
    icon: '/images/iconItems/races/Gnome.png',
    subraces: [
      {
        name: 'GNOMO DE LAS ROCAS',
        description: `Tienes una creatividad y una dureza naturales que superan las de otros gnomos.`,
        modifiers: '+1 Constitucion. Competencia: Herramientas de artesano (constructor).',
        traits: `Conocimiento de artificiero: competencia doble en Historia (objetos magicos/tecnologicos). Constructor: puedes crear mecanismos Diminutos (juguete, encendedor, caja de musica).`,
      },
    ],
  },
  {
    id: 'Human',
    name: 'HUMANO',
    description: `En los registros de la mayoria de los mundos, los humanos son la mas joven de las razas comunes. Han llegado comparativamente tarde al mundo y sus vidas son mas cortas que las de enanos, elfos y dragones.`,
    traits: `Edad: madurez ~20 años, viven <1 siglo. Alineamiento: sin tendencia. Tamano: Mediano.`,
    modifiers: '+1 a todas las caracteristicas (Fuerza, Destreza, Constitucion, Inteligencia, Sabiduria, Carisma)',
    speed: '30 pies',
    icon: '/images/iconItems/races/Human.png',
  },
  {
    id: 'Halfing',
    name: 'MEDIANO',
    description: `La mayoria de los medianos son neutrales buenos. Como norma general, tienen buen corazon y son amables, odian ver a otros sufrir y no toleran la opresion.`,
    traits: `Agilidad de los medianos: moverte por espacio de criaturas de tamano mayor. Valiente: ventaja en salvaciones para no asustarte. Afortunado: reroll 1s en 1d20 (ataque, habilidad, salvacion).`,
    modifiers: '+2 Destreza',
    speed: '25 pies',
    icon: '/images/iconItems/races/Halfing.png',
    subraces: [
      {
        name: 'MEDIANO PIESLIGEROS',
        description: `Los piesligeros pueden ocultarse facilmente, incluso utilizando a otras personas como cobertura. Son amables y se llevan bien con los demas.`,
        modifiers: '+1 Carisma.',
        traits: `Sigiloso por naturaleza: puedes esconderte incluso cuando solo te oculta una criatura de tamano superior.`,
      },
    ],
  },
  {
    id: 'HalfElf',
    name: 'SEMIELFO',
    description: `Tu personaje semielfo tiene algunas caracteristicas en comun con los elfos y otras que son unicas para los semielfos. Valoran tanto la libertad personal como la expresion de la creatividad.`,
    traits: `Vision en la oscuridad (60 pies). Ancestro feerico: ventaja en salvaciones contra hechizado, no puedes ser dormido por magia.`,
    modifiers: '+2 Carisma. +1 a dos caracteristicas a escoger. Competencia: dos habilidades a escoger.',
    speed: '30 pies',
    icon: '/images/iconItems/races/HalfElf.png',
  },
  {
    id: 'HalfOrc',
    name: 'SEMIORCO',
    description: `Tu personaje semiorco tiene ciertos rasgos que derivan de su ancestro orco. Los semiorcos heredan la tendencia hacia el caos de sus progenitores orcos.`,
    traits: `Vision en la oscuridad (60 pies). Aguante incansable: cuando tus PG se reducen a 0 pero no mueres, quedate con 1 PG (1/descanso prolongado). Ataques salvajes: en critico cuerpo a cuerpo, reroll 1 dado de daño. Competencia: Intimidar.`,
    modifiers: '+2 Fuerza, +1 Constitucion',
    speed: '30 pies',
    icon: '/images/iconItems/races/HalfOrc.png',
  },
  {
    id: 'Tief',
    name: 'TIEFLING',
    description: `Puede que los tieflings no tengan una tendencia innata hacia el mal, pero muchos de ellos acaban ahi. Maligna o no, una fuerza externa inclina a muchos tieflings hacia un alineamiento caotico.`,
    traits: `Vision en la oscuridad (60 pies). Legado infernal: Taumaturgia (truco), Reprension infernal (nivel 3), Oscuridad (nivel 5). Resistencia infernal: resistencia a daño por fuego.`,
    modifiers: '+2 Carisma, +1 Inteligencia',
    speed: '30 pies',
    icon: '/images/iconItems/races/Tiefling.png',
  },
]
