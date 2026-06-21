import { Container, Row, Col, Accordion } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import DiceRoller from '../components/DiceRoller'
import CoinFlip from '../components/CoinFlip'

interface ResourceLink {
  text: string
  url: string
}

interface ResourceColumn {
  heading: string
  links: ResourceLink[]
}

interface ResourceSection {
  title: string
  columns: ResourceColumn[]
}

const resourceSections: ResourceSection[] = [
  {
    title: 'Webs para empezar a jugar',
    columns: [
      {
        heading: 'Mapas y aventuras',
        links: [
          { text: 'Empezar a jugar', url: 'https://www.hobbyconsolas.com/reportajes/como-comenzar-jugar-dungeons-dragons-no-morir-intento-536599' },
          { text: 'Aventuras gratuitas', url: 'https://www.espadayescudo.com/blog/aventuras-gratis-para-dungeons-and-dragons/' },
          { text: 'Web para jugar DnD online', url: 'https://tarrasque.io/' },
          { text: 'Creador de Tokens', url: 'https://rolladvantage.com/tokenstamp/' },
        ],
      },
      {
        heading: 'Todo para tu PJ',
        links: [
          { text: 'Calculadora puntos', url: 'https://chicken-dinner.com/5e/5e-point-buy.html' },
          { text: 'Generador de nombre de fantasia', url: 'https://es.fantasynamegenerators.com/' },
          { text: 'Guia DnD (ENG)', url: 'http://dnd5e.wikidot.com/' },
          { text: 'Guia DnD (ESP)', url: 'https://forgottenrealms.fandom.com/wiki/Main_Page' },
        ],
      },
      {
        heading: 'Contenido adicional',
        links: [
          { text: 'Mega web de DnD y rol', url: 'https://donjon.bin.sh/5e/' },
          { text: 'Assets gratis para mapas', url: 'https://www.forgotten-adventures.net/product-category/map-making/' },
          { text: 'Software para crear mapas (FREE)', url: 'https://deepnight.net/tools/rpg-map/' },
        ],
      },
    ],
  },
  {
    title: 'Webs algo mas avanzadas',
    columns: [
      {
        heading: 'Mapas y mas',
        links: [
          { text: 'Generador aleatorio de mapas', url: 'https://davesmapper.com/' },
          { text: 'Generador aleatorio de mazmorras', url: 'https://og.myth-weavers.com/generate_dungeon.php' },
          { text: 'Generador completo (ENG)', url: 'https://www.thievesguild.cc/' },
        ],
      },
      {
        heading: 'NPCs, eventos y tiendas',
        links: [
          { text: 'Generador de NPCs (ENG)', url: 'https://www.dndspeak.com/random-npc-generator/' },
          { text: 'Generador de elemento aleatorio', url: 'https://donjon.bin.sh/5e/random/#type=npc' },
          { text: 'Tiendas de varios tipos', url: 'https://www.thievesguild.cc/shops/' },
        ],
      },
      {
        heading: 'Criaturas y Bestias',
        links: [
          { text: 'Monstruos y criaturas (ESP)', url: 'https://dr-eigenvalue.github.io/bestiary/' },
          { text: 'Monstruos y criaturas (ENG)', url: 'https://nivel20.com/games/dnd-5/creatures' },
          { text: 'Constructor peleas (ENG)', url: 'https://koboldplus.club/#/encounter-builder' },
        ],
      },
    ],
  },
  {
    title: 'Extras',
    columns: [
      {
        heading: 'Tutoriales sobre como jugar',
        links: [
          { text: 'Aprende DnD en 20 minutos', url: 'https://www.youtube.com/watch?v=lkjoLmStBUI' },
          { text: 'Canal de DnD en espanol completo', url: 'https://www.youtube.com/@doble_20/playlists' },
          { text: 'Como ser buen jugador', url: 'https://www.youtube.com/watch?v=T4n8_PQjz_Y' },
          { text: 'Como ser buen DM', url: 'https://www.youtube.com/watch?v=cNO5UX7U-sk&t=90s' },
        ],
      },
      {
        heading: 'Sesiones Live de DnD',
        links: [
          { text: 'Critical Role', url: 'https://www.youtube.com/@criticalrole/videos' },
          { text: 'Tales from the Stinky Dragon', url: 'https://www.youtube.com/@stinkydragonpod' },
          { text: 'La Mazmorra de Pacheco', url: 'https://www.youtube.com/@LaMazmorradePacheco/videos' },
        ],
      },
      {
        heading: 'Tienda',
        links: [
          { text: 'Dados (Amz)', url: 'https://www.amazon.es/Dados-Rol/s?k=Dados+De+Rol' },
          { text: 'Dados (Aliex)', url: 'https://es.aliexpress.com/w/wholesale-dados-de-d%26d.html' },
          { text: 'Sets, libros y/o packs (Amz)', url: 'https://www.amazon.es/s?k=dnd+starter+set' },
          { text: 'DnD Beyond', url: 'https://www.dndbeyond.com/marketplace/bundles' },
          { text: 'Roll20', url: 'https://marketplace.roll20.net/browse/search?sortby=popular' },
          { text: 'Figuras personalizadas', url: 'https://www.heroforge.com/' },
        ],
      },
    ],
  },
]

function showStoreInfo() {
  Swal.fire({
    title: 'Atencion',
    html: `<p style="font-size:16px">
      Antes de comprar cualquier cosa, para jugar DnD no hace falta una gran inversion.
      Acordad un limite en el grupo para no sobrepasar vuestro presupuesto.
    </p>
    <p style="font-size:16px">Recordad es entretenerse con los amigos y no endeudarse en gastar por gastar.</p>
    <p style="font-size:16px">Con las pequeñas herramientas que dispone esta web podeis hacer muchas cosas y pasarlo bien.</p>
    <p style="font-size:16px">
      Por ejemplo si vas a jugar en persona, imprimid las hojas, usad la imaginacion
      y con un boton o un dedal (como en monopoly) ser vuestro personaje...
    </p>
    <span style="font-size:14px;color:rgb(222,234,234)">
      Antes de comprar por internet revisa tus tiendas locales
    </span>`,
    confirmButtonText: 'Aceptar',
    confirmButtonColor: '#d4af37',
  })
}

export default function Utilities() {
  return (
    <Container className="mt-4">
      <h2>Hoja para personajes</h2>
      <Row className="mb-4">
        <Col md={6}>
          <p>Hojas para imprimir</p>
          <ul>
            <li><a href="/docs/DnD-3.5_Esp.pdf" target="_blank" rel="noreferrer">Hoja de personaje 3.5 (ESP)</a></li>
            <li><a href="/docs/DnD-5e_Esp.pdf" target="_blank" rel="noreferrer">Hoja de personaje 5e (ESP)</a></li>
          </ul>
        </Col>
        <Col md={6}>
          <p>Hojas editables e imprimibles</p>
          <ul>
            <li><a href="/docs/DnD_3.5_CharacterSheet-Fillable.pdf" target="_blank" rel="noreferrer">Hoja de personaje 3.5 (ESP)</a></li>
            <li><a href="/docs/DnD_5E_CharacterSheet-Fillable.pdf" target="_blank" rel="noreferrer">Hoja de personaje 5e (ENG)</a></li>
          </ul>
        </Col>
      </Row>

      <h2>Dados de rol</h2>
      <DiceRoller />

      <h2>Coin Flip</h2>
      <CoinFlip />

      <h2>Enlaces</h2>
      <Accordion>
        {resourceSections.map((section, i) => (
          <Accordion.Item eventKey={String(i)} key={i}>
            <Accordion.Header>{section.title}</Accordion.Header>
            <Accordion.Body>
              <Row>
                {section.columns.map((col, j) => (
                  <Col md={4} key={j}>
                    <p>
                      {col.heading}
                      {col.heading === 'Tienda' && (
                        <span
                          onClick={showStoreInfo}
                          style={{ cursor: 'pointer', display: 'inline-block', marginLeft: 6 }}
                        >&#10068;</span>
                      )}
                    </p>
                    <ul>
                      {col.links.map((link, k) => (
                        <li key={k}>
                          <a href={link.url} target="_blank" rel="noreferrer" style={{ display: 'inline' }}>
                            {link.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </Col>
                ))}
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      <div style={{ marginTop: '2rem' }}>
        <nav style={{ '--bs-breadcrumb-divider': "'>'" } as React.CSSProperties} aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/principal">Home</Link></li>
            <li className="breadcrumb-item active" style={{ color: 'greenyellow' }} aria-current="page">Herramientas</li>
          </ol>
        </nav>
      </div>
    </Container>
  )
}
