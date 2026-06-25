import { useState } from 'react'
import { Container, Row, Col, Carousel, Accordion } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Lightbox from '../components/Lightbox'

interface Edition {
  title: string
  body: string
}

const editions: Edition[] = [
  {
    title: 'Primera Edicion',
    body: `A principios de los anos 1970, Gary Gygax habia descubierto un juego de tablero
australiano titulado Dungeon. Poco mas tarde descubrio otro juego de tablero,
pero estadounidense y titulado Dragon. Fue de estos dos titulos que se inspiro
para crear, junto a Dave Arneson, el que no iba a tardar en convertirse en el
primer juego de rol en ser comercializado, cuya primera "version", Dungeons &
Dragons, fue publicada en 1974.`,
  },
  {
    title: 'Segunda Edicion',
    body: `Advanced Dungeons & Dragons, cuyos tres primeros libros fueron publicados en
1977, 1978 y 1979, tuvo una segunda edicion en 1989 y una revision de la misma
en 1996. En 1991 TSR hizo una reedicion ampliada del Basic Set de 1977 titulada
The New Easy to Master Dungeons & Dragons.`,
  },
  {
    title: 'Tercera Edicion',
    body: `Ambos juegos, Dungeons & Dragons y Advanced Dungeons & Dragons fueron publicados
hasta la decada de los 90, pero en 2000 se puso fin a esta diferenciacion de dos
series de juegos diferentes y se inicio una nueva y unica edicion, la tercera,
que aplicaba el principio de la serie Advanced Dungeons & Dragon (tres libros
basicos), pero que eliminaba el termino Advanced del titulo.`,
  },
  {
    title: 'Tercera Edicion Revisada',
    body: `En 2003 se publico una "revision" de la tercera edicion, conocida con el nombre
de Dungeons & Dragons 3.5. Es una revision del sistema d20 original que consiste
en introducir una serie de modificaciones que mejoran la experiencia de juego.`,
  },
  {
    title: 'Cuarta Edicion',
    body: `El 16 de agosto de 2007 Wizards of the Coast anuncio la salida, para junio de
2008, de la cuarta edicion del juego. Esta nueva version cambio radicalmente
el sistema de reglas respecto a las anteriores versiones, simplificando bastante
el modo de juego.`,
  },
  {
    title: 'Quinta Edicion',
    body: `Las Reglas basicas de la quinta edicion es un PDF gratuito que contiene reglas
completas para jugar. El Starter Set fue lanzado el 15 de julio de 2014. La
quinta edicion vuelve a tener solo tres libros de reglas basicas. En Espana se
lanzo esta Quinta edicion en 2017.`,
  },
]

export default function Info() {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)

  return (
    <Container className="mt-4">
      {lightbox && <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />}

      <h2>Historia</h2>
      <Row className="justify-content-md-start">
        <Col md={12}>
          <p className="textcont">
            Dungeons &amp; Dragons (en espanol: Dragones y mazmorras o Calabozos y dragones)
            es un juego de rol de fantasia heroica actualmente publicado por Wizards of
            the Coast. El juego original fue disenado en Estados Unidos por Gary Gygax y
            Dave Arneson y publicado por primera vez en 1974 por la compania de Gygax,
            Tactical Studies Rules (TSR).
          </p>
        </Col>
      </Row>

      <Row className="justify-content-md-center">
        <Col md={8} className="mb-4">
          <Carousel>
            <Carousel.Item interval={6000}>
              <img
                className="d-block w-100 carousel-img"
                src="/images/galeria/800/WallpaperDog-21_1200x800.png"
                alt="Aventureros"
                onClick={() => setLightbox({ src: '/images/galeria/800/WallpaperDog-21_1200x800.png', alt: 'Aventureros' })}
                style={{ cursor: 'pointer' }}
              />
            </Carousel.Item>
            <Carousel.Item interval={6000}>
              <img
                className="d-block w-100 carousel-img"
                src="/images/galeria/800/baldurs32_1201x800.png"
                alt="Baldurs Gate 3"
                onClick={() => setLightbox({ src: '/images/galeria/800/baldurs32_1201x800.png', alt: 'Baldurs Gate 3' })}
                style={{ cursor: 'pointer' }}
              />
            </Carousel.Item>
            <Carousel.Item interval={6000}>
              <img
                className="d-block w-100 carousel-img"
                src="/images/galeria/800/DnDHEL_1024_682_1200x800.png"
                alt="DnD Honor entre ladrones"
                onClick={() => setLightbox({ src: '/images/galeria/800/DnDHEL_1024_682_1200x800.png', alt: 'DnD Honor entre ladrones' })}
                style={{ cursor: 'pointer' }}
              />
            </Carousel.Item>
            <Carousel.Item interval={6000}>
              <img
                className="d-block w-100 carousel-img"
                src="/images/galeria/800/WallpaperDog-32_1200x800.png"
                alt="Combate dragon"
                onClick={() => setLightbox({ src: '/images/galeria/800/WallpaperDog-32_1200x800.png', alt: 'Combate dragon' })}
                style={{ cursor: 'pointer' }}
              />
            </Carousel.Item>
            <Carousel.Item interval={6000}>
              <img
                className="d-block w-100 carousel-img"
                src="/images/galeria/800/DND-serie-animada_1200x800.png"
                alt="Serie animada"
                onClick={() => setLightbox({ src: '/images/galeria/800/DND-serie-animada_1200x800.png', alt: 'Serie animada' })}
                style={{ cursor: 'pointer' }}
              />
            </Carousel.Item>
          </Carousel>
        </Col>
      </Row>

      <Row className="justify-content-md-start">
        <Col md={12}>
          <p className="textcont">
            Desde su aparicion este juego ha sido publicado a lo largo de un gran numero
            de ediciones y muchas de ellas han sido traducidas al castellano, pero
            conservando siempre en las traducciones el titulo original en ingles:
            Dungeons &amp; Dragons.
          </p>
        </Col>
      </Row>

      <h3>Ediciones de Dungeons and Dragons</h3>
      <Accordion>
        {editions.map((ed, i) => (
          <Accordion.Item eventKey={String(i)} key={i}>
            <Accordion.Header>{ed.title}</Accordion.Header>
            <Accordion.Body>
              <p className="textcont">{ed.body}</p>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      <div style={{ marginTop: '2rem' }}>
        <nav style={{ '--bs-breadcrumb-divider': "'>'" } as React.CSSProperties} aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/principal">Home</Link></li>
            <li className="breadcrumb-item active" style={{ color: 'greenyellow' }} aria-current="page">Informacion</li>
          </ol>
        </nav>
      </div>
    </Container>
  )
}
