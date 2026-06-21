export interface ClassInfo {
  id: string
  name: string
  description: string
  hitDice: string
  requirements: string
  equipment: string
  magic?: string
  icon: string
}

export const classes: ClassInfo[] = [
  {
    id: 'Barbaro',
    name: 'BARBARO',
    description: `Para algunos, su rabia brota de la comunion con espi­ritus de animales salvajes. Otros recurren a su hirviente reserva de ira frente a un mundo lleno de dolor. Para los barbaros, la furia es un poder que no solo les proporciona un frenesi ciego en la batalla, sino tambien extraordinarios reflejos, resistencia y proezas de fuerza.`,
    hitDice: 'd12',
    requirements: 'Fuerza 13',
    equipment: `(a) un hacha a dos manos o (b) cualquier arma cuerpo a cuerpo marcial; (a) dos hachas de mano o (b) cualquier arma sencilla; un paquete de explorador y cuatro jabalinas.`,
    icon: '/images/iconItems/class/barb.png',
  },
  {
    id: 'Bardo',
    name: 'BARDO',
    description: `Ya sea un erudito, un poeta o un canalla, un bardo teje su magia a traves de sus palabras y su musica para inspirar a los aliados, desmoralizar a los enemigos, manipular mentes, crear ilusiones e incluso sanar heridas.`,
    hitDice: 'd8',
    requirements: 'Carisma 13',
    equipment: `(a) un estoque, (b) una espada larga o (c) cualquier arma sencilla; (a) un paquete de diplomatico o (b) un paquete de artista; (a) un laud o (b) cualquier otro instrumento musical; armadura de cuero y una daga.`,
    magic: `Lanzador puro | Conjuros conocidos | Nivel max: 9 | Trucos: Si | Aptitud: Carisma | Lista: Conjuros de bardo`,
    icon: '/images/iconItems/class/bard.png',
  },
  {
    id: 'Brujo',
    name: 'BRUJO',
    description: `Los brujos son buscadores del conocimiento que se encuentra escondido en el multiverso. A traves de pactos hechos con seres poderosos de poder sobrenatural, los brujos desatan efectos magicos tanto sutiles como espectaculares y recolectan secretos arcanos para potenciar su propio poder.`,
    hitDice: 'd8',
    requirements: 'Carisma 13',
    equipment: `(a) una ballesta ligera y 20 virotes o (b) cualquier arma sencilla; (a) un saquito de componentes o (b) un canalizador arcano; (a) un paquete de erudito o (b) un paquete de explorador de mazmorras; una armadura.`,
    magic: `Lanzador de pacto | Conjuros conocidos | Nivel max: 5 | Trucos: Si | Aptitud: Carisma | Lista: Conjuros de brujo`,
    icon: '/images/iconItems/class/brujo.png',
  },
  {
    id: 'Clerigo',
    name: 'CLERIGO',
    description: `Los clerigos son intermediarios entre el mundo mortal y los distantes planos divinos. Tan diferentes entre ellos como los dioses a los que sirven, los clerigos se esfuerzan por personificar las obras de sus deidades. No son sacerdotes ordinarios, un clerigo se encuentra imbuido de magia divina.`,
    hitDice: 'd8',
    requirements: 'Sabiduria 13',
    equipment: `(a) una maza o (b) un martillo de guerra (si eres competente); (a) una cota de escamas, (b) una armadura de cuero o (c) una cota de malla; (a) una ballesta ligera y 20 virotes o (b) cualquier arma sencilla; (a) un paquete de sacerdote o (b) un paquete de explorador; un escudo y un simbolo sagrado.`,
    magic: `Lanzador puro | Conjuros preparados | Nivel max: 9 | Trucos: Si | Aptitud: Sabiduria | Lista: Conjuros de clerigo`,
    icon: '/images/iconItems/class/clerigo.png',
  },
  {
    id: 'Druida',
    name: 'DRUIDA',
    description: `Ya sea invocando a las fuerzas elementales o emulando a las criaturas del mundo animal, los druidas son la personificacion de la resistencia, astucia y furia de la naturaleza. Dicen no tener un dominio sobre la naturaleza. En lugar de eso, se ven como una extension de la voluntad indomable de la misma.`,
    hitDice: 'd8',
    requirements: 'Sabiduria 13',
    equipment: `(a) un escudo de madera o (b) cualquier arma sencilla; (a) una cimitarra o (b) cualquier arma cuerpo a cuerpo sencilla; armadura de cuero, un paquete de explorador y un canalizador druidico.`,
    magic: `Lanzador puro | Conjuros preparados | Nivel max: 9 | Trucos: Si | Aptitud: Sabiduria | Lista: Conjuros de druida`,
    icon: '/images/iconItems/class/druida.png',
  },
  {
    id: 'Explorador',
    name: 'EXPLORADOR',
    description: `Lejos del bullicio de las ciudades y pueblos, mas alla de las defensas que mantienen a las granjas mas lejanas protegidas de los terrores de la naturaleza, en medio de tupidos bosques sin caminos y a traves de enormes y vacias llanuras, los exploradores mantienen su interminable guardia.`,
    hitDice: 'd10',
    requirements: 'Destreza 13 y Sabiduria 13',
    equipment: `(a) una cota de escamas o (b) una armadura de cuero; (a) dos espadas cortas o (b) dos armas cuerpo a cuerpo sencillas; (a) un paquete de explorador de mazmorras o (b) un paquete de explorador; un arco largo y una aljaba con 20 flechas.`,
    magic: `Lanzador medio | Conjuros conocidos | Nivel max: 5 | Trucos: No | Aptitud: Sabiduria | Lista: Conjuros de explorador`,
    icon: '/images/iconItems/class/explor.png',
  },
  {
    id: 'Guerrero',
    name: 'GUERRERO',
    description: `Todos los guerreros comparten un dominio magistral de las armas y armaduras, y un exhaustivo conocimiento de las habilidades del combate. Ademas, estan muy relacionados con la muerte, tanto repartiendola como mirandola fijamente, desafiantes.`,
    hitDice: 'd10',
    requirements: 'Fuerza 13 o Destreza 13',
    equipment: `(a) una cota de malla o (b) una armadura de cuero, un arco largo y 20 flechas; (a) un arma marcial y un escudo o (b) dos armas marciales; (a) una ballesta ligera y 20 virotes o (b) dos hachas de mano; (a) un paquete de explorador de mazmorras o (b) un paquete de explorador.`,
    icon: '/images/iconItems/class/guerrero.png',
  },
  {
    id: 'Hechicero',
    name: 'HECHICERO',
    description: `Los hechiceros tienen una magia innata, conferida por una linea de sangre exotica, una influencia de otro mundo o la exposicion a fuerzas cosmicas desconocidas. Uno no puede estudiar hechiceria como quien estudia un lenguaje, mas de lo que uno puede aprender a vivir una vida legendaria. Nadie elige la hechiceria, el poder elige al hechicero.`,
    hitDice: 'd6',
    requirements: 'Carisma 13',
    equipment: `(a) una ballesta ligera y 20 virotes o (b) cualquier arma sencilla; (a) un saquito de componentes o (b) un canalizador arcano; (a) un paquete de explorador de mazmorras o (b) un paquete de explorador; dos dagas.`,
    magic: `Lanzador puro | Conjuros conocidos | Nivel max: 9 | Trucos: Si | Aptitud: Carisma | Lista: Conjuros de hechicero`,
    icon: '/images/iconItems/class/hechiz.png',
  },
  {
    id: 'Mago',
    name: 'MAGO',
    description: `Los magos son los practicantes supremos de la magia, definidos y unidos como una clase por los hechizos que conjuran. A partir de la sutil onda de la magia que impregna el cosmos, los magos lanzan explosivos hechizos de fuego, arcos voltaicos, sutiles enganos y brutales formas de control mental.`,
    hitDice: 'd6',
    requirements: 'Inteligencia 13',
    equipment: `(a) un baston o (b) una daga; (a) un saquito de componentes o (b) un canalizador arcano; (a) un paquete de erudito o (b) un paquete de explorador; un libro de conjuros.`,
    magic: `Lanzador puro | Conjuros preparados | Nivel max: 9 | Trucos: Si | Aptitud: Inteligencia | Lista: Conjuros de mago`,
    icon: '/images/iconItems/class/mago.png',
  },
  {
    id: 'Monje',
    name: 'MONJE',
    description: `Cualquiera que sea su disciplina, los monjes estan unidos por su habilidad para utilizar magimante la energia que corre por sus cuerpos. Ya sea canalizada en una impactante demostracion de proeza marcial o en el sutil enfoque en la habilidad defensiva y la velocidad, esta energia impulsa todo lo que el monje hace.`,
    hitDice: 'd8',
    requirements: 'Destreza 13 y Sabiduria 13',
    equipment: `(a) una espada corta o (b) cualquier arma sencilla; (a) un paquete de explorador de mazmorras o (b) un paquete de explorador; 10 dardos.`,
    icon: '/images/iconItems/class/monje.png',
  },
  {
    id: 'Paladin',
    name: 'PALADIN',
    description: `Sean cuales sean sus origenes y sus misiones, los paladines estan unidos por sus juramentos para luchar en contra de las fuerzas del mal. El juramento de un paladin es un lazo muy poderoso. Es una fuente de poder que convierte a un devoto guerrero en un campeon bendecido.`,
    hitDice: 'd10',
    requirements: 'Fuerza 13 y Carisma 13',
    equipment: `(a) un arma marcial y un escudo o (b) dos armas marciales; (a) cinco jabalinas o (b) cualquier arma cuerpo a cuerpo sencilla; (a) un paquete de sacerdote o (b) un paquete de explorador; una cota de malla y un simbolo sagrado.`,
    magic: `Lanzador medio | Conjuros preparados | Nivel max: 5 | Trucos: No | Aptitud: Carisma | Lista: Conjuros de paladin`,
    icon: '/images/iconItems/class/paladin.png',
  },
  {
    id: 'Picaro',
    name: 'PICARO',
    description: `Los picaros confian sus habilidades, el sigilo y las vulnerabilidades de sus oponentes para lograr sacar ventaja en cualquier situacion. Tienen un don para encontrar la solucion a practicamente cualquier problema, demostrando un ingenio y versatilidad que es la piedra angular de cualquier buen grupo de aventureros.`,
    hitDice: 'd8',
    requirements: 'Destreza 13',
    equipment: `(a) un estoque o (b) una espada corta; (a) un arco corto y una aljaba de 20 flechas o (b) una espada corta; (a) un paquete de ladron, (b) un paquete de explorador de mazmorras o (c) un paquete de explorador; (a) una armadura de cuero, dos dagas y herramientas de ladron.`,
    icon: '/images/iconItems/class/picaro.png',
  },
]
