export interface ShopItem {
  id: string
  name: string
  category: string
  cost: number
  description: string
  weight?: string
  properties?: string
}

export const ITEMS: ShopItem[] = [
  // ── Armas cuerpo a cuerpo simples ──
  { id: 'club', name: 'Porra', category: 'Armas simples cuerpo a cuerpo', cost: 1, description: 'Arma contundente básica.', weight: '1 kg', properties: 'Ligera' },
  { id: 'dagger', name: 'Daga', category: 'Armas simples cuerpo a cuerpo', cost: 2, description: 'Hoja corta y equilibrada.', weight: '0,5 kg', properties: 'Ligera, arrojadiza (alcance 6/18)' },
  { id: 'handaxe', name: 'Hacha de mano', category: 'Armas simples cuerpo a cuerpo', cost: 5, description: 'Hacha pequeña de una mano.', weight: '1 kg', properties: 'Ligera, arrojadiza (alcance 6/18)' },
  { id: 'spear', name: 'Lanza', category: 'Armas simples cuerpo a cuerpo', cost: 1, description: 'Arma larga con punta.', weight: '1,5 kg', properties: 'Versátil (1d8), arrojadiza (alcance 6/18)' },

  // ── Armas cuerpo a cuerpo marciales ──
  { id: 'longsword', name: 'Espada larga', category: 'Armas marciales cuerpo a cuerpo', cost: 15, description: 'Espada versátil de una mano y media.', weight: '2 kg', properties: 'Versátil (1d10)' },
  { id: 'greatsword', name: 'Espada grande', category: 'Armas marciales cuerpo a cuerpo', cost: 50, description: 'Imponente hoja de dos manos.', weight: '3 kg', properties: 'Pesada, a dos manos' },
  { id: 'battleaxe', name: 'Hacha de batalla', category: 'Armas marciales cuerpo a cuerpo', cost: 10, description: 'Hacha de guerra de una mano.', weight: '2 kg', properties: 'Versátil (1d10)' },
  { id: 'warhammer', name: 'Martillo de guerra', category: 'Armas marciales cuerpo a cuerpo', cost: 15, description: 'Martillo de una mano contundente.', weight: '2 kg', properties: 'Versátil (1d10)' },
  { id: 'rapier', name: 'Estoque', category: 'Armas marciales cuerpo a cuerpo', cost: 25, description: 'Espada fina y precisa.', weight: '1 kg', properties: 'Fina' },
  { id: 'greataxe', name: 'Gran hacha', category: 'Armas marciales cuerpo a cuerpo', cost: 30, description: 'Hacha enorme de dos manos.', weight: '3,5 kg', properties: 'Pesada, a dos manos' },

  // ── Armas a distancia simples ──
  { id: 'shortbow', name: 'Arco corto', category: 'Armas simples a distancia', cost: 25, description: 'Arco ligero y fácil de usar.', weight: '1 kg', properties: 'A distancia (alcance 24/96), a dos manos' },
  { id: 'sling', name: 'Honda', category: 'Armas simples a distancia', cost: 1, description: 'Correa para lanzar piedras.', weight: '-', properties: 'A distancia (alcance 9/36)' },
  { id: 'light_crossbow', name: 'Ballesta ligera', category: 'Armas simples a distancia', cost: 25, description: 'Ballesta pequeña y portátil.', weight: '2,5 kg', properties: 'A distancia (alcance 24/96), a dos manos, recarga' },

  // ── Armas a distancia marciales ──
  { id: 'longbow', name: 'Arco largo', category: 'Armas marciales a distancia', cost: 50, description: 'Arco de gran alcance.', weight: '1,5 kg', properties: 'A distancia (alcance 36/150), a dos manos, pesada' },
  { id: 'heavy_crossbow', name: 'Ballesta pesada', category: 'Armas marciales a distancia', cost: 50, description: 'Ballesta de gran potencia.', weight: '5 kg', properties: 'A distancia (alcance 30/120), a dos manos, pesada, recarga' },

  // ── Armaduras ligeras ──
  { id: 'padded', name: 'Armadura acolchada', category: 'Armaduras ligeras', cost: 5, description: 'Armadura de tela acolchada.', weight: '4 kg', properties: 'CA 11 + DES' },
  { id: 'leather', name: 'Armadura de cuero', category: 'Armaduras ligeras', cost: 10, description: 'Armadura flexible de cuero endurecido.', weight: '5 kg', properties: 'CA 11 + DES' },
  { id: 'studded', name: 'Armadura de cuero tachonado', category: 'Armaduras ligeras', cost: 45, description: 'Cuero reforzado con remaches metálicos.', weight: '6 kg', properties: 'CA 12 + DES' },

  // ── Armaduras intermedias ──
  { id: 'hide', name: 'Armadura de pieles', category: 'Armaduras intermedias', cost: 10, description: 'Pieles gruesas de animales.', weight: '6 kg', properties: 'CA 12 + DES (máx 2)' },
  { id: 'chain_shirt', name: 'Camisote de mallas', category: 'Armaduras intermedias', cost: 50, description: 'Camiseta de anillas de metal.', weight: '10 kg', properties: 'CA 13 + DES (máx 2)' },
  { id: 'scale_mail', name: 'Armadura de escamas', category: 'Armaduras intermedias', cost: 50, description: 'Escamas de metal superpuestas.', weight: '22 kg', properties: 'CA 14 + DES (máx 2)' },
  { id: 'breastplate', name: 'Coraza', category: 'Armaduras intermedias', cost: 400, description: 'Peto metálico que cubre el torso.', weight: '10 kg', properties: 'CA 14 + DES (máx 2)' },
  { id: 'half_plate', name: 'Armadura de placas semicompleta', category: 'Armaduras intermedias', cost: 750, description: 'Placas metálicas combinadas con cuero.', weight: '20 kg', properties: 'CA 15 + DES (máx 2)' },

  // ── Armaduras pesadas ──
  { id: 'ring_mail', name: 'Armadura de anillas', category: 'Armaduras pesadas', cost: 30, description: 'Anillas de metal cosidas a un soporte.', weight: '20 kg', properties: 'CA 14' },
  { id: 'chain_mail', name: 'Cota de mallas', category: 'Armaduras pesadas', cost: 75, description: 'Malla metálica completa.', weight: '25 kg', properties: 'CA 16, FUE 13' },
  { id: 'splint', name: 'Armadura de bandas', category: 'Armaduras pesadas', cost: 200, description: 'Bandas metálicas sobre cuero.', weight: '30 kg', properties: 'CA 17, FUE 15' },
  { id: 'plate', name: 'Armadura de placas', category: 'Armaduras pesadas', cost: 1500, description: 'La mejor protección: placas de acero.', weight: '30 kg', properties: 'CA 18, FUE 15' },

  // ── Escudos ──
  { id: 'shield', name: 'Escudo', category: 'Escudos', cost: 10, description: 'Escudo de madera o metal.', weight: '3 kg', properties: '+2 CA' },

  // ── Equipo de aventura ──
  { id: 'backpack', name: 'Mochila', category: 'Equipo de aventura', cost: 2, description: 'Mochila para transportar equipo.', weight: '0,5 kg' },
  { id: 'rations', name: 'Raciones (1 día)', category: 'Equipo de aventura', cost: 5, description: 'Comida y agua para un día.', weight: '1 kg' },
  { id: 'torch', name: 'Antorcha', category: 'Equipo de aventura', cost: 1, description: 'Ilumina 5m durante 1 hora.', weight: '0,5 kg' },
  { id: 'rope', name: 'Cuerda de cáñamo (15m)', category: 'Equipo de aventura', cost: 1, description: 'Cuerda resistente de 15 metros.', weight: '5 kg' },
  { id: 'healing_potion', name: 'Poción de curación', category: 'Equipo de aventura', cost: 50, description: 'Recupera 2d4+2 PG.', weight: '0,5 kg' },
  { id: 'candle', name: 'Vela', category: 'Equipo de aventura', cost: 1, description: 'Ilumina 2m durante 1 hora.', weight: '-' },
  { id: 'chalk', name: 'Tiza (1 pieza)', category: 'Equipo de aventura', cost: 1, description: 'Útil para marcar superficies.', weight: '-' },
  { id: 'grappling_hook', name: 'Garfio', category: 'Equipo de aventura', cost: 2, description: 'Garfio de escalada.', weight: '2 kg' },
  { id: 'hammer', name: 'Martillo', category: 'Equipo de aventura', cost: 1, description: 'Martillo de uso general.', weight: '2 kg' },
  { id: 'pitons', name: 'Pitones (10)', category: 'Equipo de aventura', cost: 5, description: 'Clavos para escalada.', weight: '2,5 kg' },
  { id: 'bedroll', name: 'Saco de dormir', category: 'Equipo de aventura', cost: 1, description: 'Para dormir al raso.', weight: '3 kg' },
  { id: 'waterskin', name: 'Odre', category: 'Equipo de aventura', cost: 2, description: 'Recipiente para agua.', weight: '2,5 kg (lleno)' },
  { id: 'tinderbox', name: 'Yesca y pedernal', category: 'Equipo de aventura', cost: 5, description: 'Para encender fuego.', weight: '0,5 kg' },
]
