import { useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUserTie, faUserFriends, faBook, faBookOpen,
  faRocket, faHeart, faTools, faDiceD20, faDesktop,
  faStar, faPlay, faPaintBrush, faSmile, faList,
} from '@fortawesome/free-solid-svg-icons'
import { classes } from '../data/classes'
import { races } from '../data/races'

function GuideSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="container" style={{ marginBottom: '2rem' }}>
      <h4>{title}</h4>
      <div className="textcont">{children}</div>
    </div>
  )
}

function SubItem({ icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <strong>
        <FontAwesomeIcon icon={icon} style={{ width: '20px', marginRight: '8px', color: '#d4af37' }} />
        {title}
      </strong>
      <div style={{ paddingLeft: '28px' }}>{children}</div>
    </div>
  )
}

function ClassCard({ c }: { c: (typeof classes)[number] }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <h6 id={c.id}>
        <img style={{ height: '65px', padding: '5px' }} src={c.icon} alt="" />- {c.name}
      </h6>
      <p className="textcont">{c.description}</p>
      <p className="textcont">
        Equipo: Ademas del que obtengas por tu trasfondo, empiezas con el siguiente equipo:
      </p>
      <ul className="textcont">
        {c.equipment.split(';').map((item, i) => (
          <li key={i}>{item.trim()}</li>
        ))}
      </ul>
      <p className="textcont">
        Origen:{' '}
        <a href="https://nivel20.com/games/dnd-5/rulebooks/4-reglas-basicas" target="_blank" rel="noreferrer">
          Reglas Basicas <img src="/images/iconItems/link.png" alt="" />
        </a>
        <br />
        Puntos de Golpe: {c.hitDice}
        <br />
        Requisitos para multiclase: {c.requirements}
      </p>
      {c.magic && (
        <p className="textcont">
          Magia
          <br />
          {c.magic.split('|').map((line, i) => (
            <span key={i}>
              - {line.trim()}
              <br />
            </span>
          ))}
        </p>
      )}
    </div>
  )
}

function RaceCard({ r }: { r: (typeof races)[number] }) {
  return (
    <>
      <Col md={6}>
        <h6 id={r.id}>
          {r.name}
          <hr />
        </h6>
        <img style={{ height: '150px', padding: '5px' }} src={r.icon} alt="" />
        <br />
        <p className="textcont">{r.description}</p>
        <p className="textcont">
          Origen:{' '}
          <a href="https://nivel20.com/games/dnd-5/rulebooks/4-reglas-basicas" target="_blank" rel="noreferrer">
            Reglas Basicas <img src="/images/iconItems/link.png" alt="" />
          </a>
          <br />
          Rasgos raciales {r.name}
          <br />
          Velocidad. {r.speed}
          <br />
          {r.traits.split('|').map((t, i) => (
            <span key={i}>
              {t.trim()}
              <br />
            </span>
          ))}
        </p>
      </Col>
      <Col md={6}>
        <p className="textcont">
          <br />
          Modificadores.
          <br />
          {r.modifiers}
          <br />
          Idiomas. Puedes hablar, leer y escribir comun y el idioma de tu raza.
        </p>
      </Col>
    </>
  )
}

const sid = { textDecoration: 'none' }

export default function HowToPlay() {
  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      el?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  const classNav = classes.map((c) => (
    <li key={c.id}>
      <a href={`#${c.id}`} style={sid}>{c.name}</a>
    </li>
  ))

  const raceNav = races.map((r) => (
    <li key={r.id}>
      <a href={`#${r.id}`} style={sid}>{r.name}</a>
    </li>
  ))

  return (
    <div style={{ position: 'relative' }}>
      <nav className="howtoplay">
        <h3>Menu</h3>
        <ul>
          <li><a href="#primerPaso" style={sid}>Por donde empezar</a></li>
          <li><a href="#clases" style={sid}>Clases</a></li>
          <ul style={{ columns: 2 }}>
            {classNav}
          </ul>
          <li><a href="#razas" style={sid}>Razas</a></li>
          <ul style={{ columns: 2 }}>
            {raceNav}
          </ul>
        </ul>
      </nav>
      <nav className="sm-howtoplay">
        <ul>
          <li><a href="#primerPaso" style={sid}>Por donde empezar</a></li>
          <li><a href="#clases" style={sid}>Clases</a></li>
          <ul style={{ columns: 2 }}>
            {classNav}
          </ul>
          <li><a href="#razas" style={sid}>Razas</a></li>
          <ul style={{ columns: 2 }}>
            {raceNav}
          </ul>
        </ul>
      </nav>
      <Container className="mt-4 howtoplay-content">
        <Row>
          <Col md={12}>
            <h2 id="primerPaso">Como comenzar a jugar a Dungeons & Dragons</h2>
          </Col>
        </Row>
        <Row className="justify-content-md-start">
          <Col md={12}>
            <GuideSection title="Reune a tu grupo antes de continuar">
              <p>
                Dungeons & Dragons se juega en compa&ntilde;&iacute;a. Necesit&aacute;is al menos dos personas
                (aunque m&aacute;s jugadores = m&aacute;s diversi&oacute;n).
              </p>
              <SubItem icon={faUserTie} title="El Master (DM)">
                <p>
                  Crea la historia, dirige la narrativa e interpreta a los personajes que no son los jugadores.
                  Su labor es conducir la trama para que los jugadores puedan centrarse en sus personajes.
                </p>
              </SubItem>
              <SubItem icon={faUserFriends} title="Los jugadores">
                <p>
                  Cada uno maneja un personaje &uacute;nico. Pod&eacute;is elegir entre m&uacute;ltiples razas
                  (elfos, enanos, humanos, draconidos&hellip;) y clases (mago, palad&iacute;n, bardo&hellip;).
                </p>
              </SubItem>
              <SubItem icon={faStar} title="Consejo para crear personaje">
                <p>
                  Elegid una combinaci&oacute;n que os guste: un tiefling cl&eacute;rigo, una semielfa barda,
                  un humano guerrero&hellip; Lo ideal es que el grupo est&eacute; equilibrado, pero lo importante
                  es pasarlo bien con el personaje que elij&aacute;is.
                </p>
              </SubItem>
            </GuideSection>

            <GuideSection title="Las reglas estan para ayudarte">
              <SubItem icon={faBook} title="Los 3 manuales b&aacute;sicos">
                <ul style={{ marginBottom: '1rem' }}>
                  <li><strong>Manual del Jugador</strong> &mdash; creaci&oacute;n de personaje, combate, turnos.</li>
                  <li><strong>Gu&iacute;a del Dungeon Master</strong> &mdash; consejos para dirigir partidas.</li>
                  <li><strong>Manual de Monstruos</strong> &mdash; bestiario de criaturas.</li>
                </ul>
              </SubItem>
              <SubItem icon={faTools} title="Las reglas son flexibles">
                <p>
                  No teng&aacute;is miedo de cambiar las reglas o usar reglas caseras. Si algo se vuelve
                  complicado o resta diversi&oacute;n, adaptadlo. Lo importante es que el grupo se divierta.
                </p>
              </SubItem>
              <SubItem icon={faPlay} title="Enfoque de la partida">
                <p>
                  &iquest;Pref&eacute;ris interpretaci&oacute;n, combate o una mezcla? Todo vale.
                  No hace falta ser actor profesional, pero &ldquo;meteros en el personaje&rdquo; ayuda
                  a disfrutar m&aacute;s la experiencia.
                </p>
              </SubItem>
            </GuideSection>

            <GuideSection title="Como empezar una partida">
              <SubItem icon={faRocket} title="Caja de inicio">
                <p>
                  Incluye un manual resumido, una aventura lista para jugar, personajes pregenerados
                  y un juego de dados. Es la forma m&aacute;s f&aacute;cil de probar D&D sin agobios.
                </p>
              </SubItem>
              <SubItem icon={faList} title="Primera partida corta">
                <p>
                  Para grupos nuevos, lo mejor es empezar con una historia que dure 1-2 sesiones.
                  As&iacute; jugadores y Master se conocen y se adaptan a la din&aacute;mica del grupo.
                </p>
              </SubItem>
              <SubItem icon={faBookOpen} title="Aventuras oficiales">
                <p>
                  Hay muchas historias listas para jugar, como <em>La Maldici&oacute;n de Strahd</em> o
                  <em> Waterdeep: El Golpe de los Dragones</em>. Son ideales para aprender c&oacute;mo
                  estructurar una campa&ntilde;a.
                </p>
              </SubItem>
              <SubItem icon={faPaintBrush} title="Crea tu propio mundo">
                <p>
                  &iquest;Prefieres inventarlo todo? Adelante. Usa un escenario conocido como
                  Reinos Olvidados o crea el tuyo desde cero. Las aventuras oficiales pueden servirte
                  de inspiraci&oacute;n.
                </p>
              </SubItem>
            </GuideSection>

            <GuideSection title="El buen rollo es fundamental">
              <p>
                Lo m&aacute;s importante para disfrutar de D&D es que haya buen ambiente en el grupo.
                Habr&aacute; momentos tensos, pero la clave es la colaboraci&oacute;n y el respeto mutuo.
              </p>
              <SubItem icon={faHeart} title="No es Master vs Jugadores">
                <p>
                  D&D no se &ldquo;gana&rdquo;. Todos colabor&aacute;is para mover la trama.
                  Si alguien sabotea al grupo o busca siempre el protagonismo, habladlo abiertamente.
                </p>
              </SubItem>
              <SubItem icon={faSmile} title="Consejos para una buena mesa">
                <ul style={{ marginBottom: 0 }}>
                  <li>Prestad atenci&oacute;n durante las descripciones del Master.</li>
                  <li>Respetad el tiempo que el Master dedica a preparar la partida.</li>
                  <li>Si algo no se entiende, ped&iacute; ayuda sin miedo.</li>
                  <li>Como Master, no tortureis a los jugadores; vuestro rol es hacer el juego divertido para todos.</li>
                </ul>
              </SubItem>
            </GuideSection>

            <GuideSection title="Herramientas de oficio">
              <SubItem icon={faDiceD20} title="En fisico">
                <p>
                  Necesitar&eacute;is fichas de personaje, dados variados (un par de sets bastan),
                  l&aacute;pices y una libreta para apuntar lugares, nombres y res&uacute;menes de la sesi&oacute;n.
                </p>
              </SubItem>
              <SubItem icon={faDesktop} title="En digital">
                <p>
                  <strong>D&amp;D Beyond</strong> tiene todos los libros oficiales y hojas de personaje digitales.
                  <strong> Roll20</strong> permite jugar online con mapas, fichas y tiradas de dados integradas.
                </p>
              </SubItem>
              <SubItem icon={faPlay} title="YouTube">
                <p>
                  <em>Handbooker Helper</em> (Critical Role) explica las bases del juego en ingl&eacute;s.
                  <em> Game Master Tips</em> (Geek &amp; Sundry) ofrece consejos de direcci&oacute;n.
                  Hay much&iacute;simos canales en espa&ntilde;ol para seguir aprendiendo.
                </p>
              </SubItem>
            </GuideSection>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <h4>Video que explica como se juega</h4>
            <iframe
              style={{ marginBottom: '35px', maxWidth: '100%' }}
              width="560"
              height="420"
              src="https://www.youtube.com/embed/lkjoLmStBUI"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
            <h4>Video que ensena como rellenar la tabla de personaje de la quinta edicion</h4>
            <iframe
              style={{ marginBottom: '5px', maxWidth: '100%' }}
              width="560"
              height="420"
              src="https://www.youtube.com/embed/IlWed5Ur7bI"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <h2 id="clases">Clases</h2>
            {classes.slice(0, 6).map((c) => (
              <ClassCard key={c.id} c={c} />
            ))}
          </Col>
          <Col md={6}>
            <div style={{ paddingTop: '22px' }}>
              <br /><br />
              {classes.slice(6).map((c) => (
                <ClassCard key={c.id} c={c} />
              ))}
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <br />
            <h2 id="razas">Razas</h2>
            <br />
            {races.map((r) => (
              <Row key={r.id}>
                <RaceCard r={r} />
                {r.subraces?.map((_sr, i) => (
                  <Col md={12} key={`sub-title-${i}`}>
                    <h6>SUBRAZAS</h6>
                    <p className="textcont">
                      Algunas razas tienen subrazas. Los miembros de una subraza poseen los rasgos de la raza
                      principal anadiendo los rasgos especificos de su subraza.
                    </p>
                  </Col>
                ))}
                {r.subraces?.map((sr, i) => (
                  <Col md={6} key={`sr-${i}`}>
                    <h6>{sr.name}</h6>
                    <hr />
                    <p className="textcont">
                      {sr.description}
                      <br />
                      Origen:{' '}
                      <a href="https://nivel20.com/games/dnd-5/rulebooks/4-reglas-basicas" target="_blank" rel="noreferrer">
                        Reglas Basicas <img src="/images/iconItems/link.png" alt="" />
                      </a>
                      <br />
                      Modificadores.
                      <br />
                      {sr.modifiers}
                      <br />
                      {sr.traits.split('|').map((t, j) => (
                        <span key={j}>
                          {t.trim()}
                          <br />
                        </span>
                      ))}
                    </p>
                  </Col>
                ))}
              </Row>
            ))}
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <nav style={{ '--bs-breadcrumb-divider': "'>'" } as React.CSSProperties} aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/">Home</a>
                </li>
                <li className="breadcrumb-item active" style={{ color: 'greenyellow' }} aria-current="page">
                  Como Jugar
                </li>
              </ol>
            </nav>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
