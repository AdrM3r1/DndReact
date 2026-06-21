import { Container, Row, Col } from 'react-bootstrap'

export default function Home() {
  return (
    <Container
      className="d-flex flex-column justify-content-center"
      style={{ minHeight: 'calc(100vh - 280px)' }}
    >
      <Row className="align-items-center g-5 py-4">
        <Col md={6}>
          <div className="shadow p-3 mb-5 bg-body-tertiary rounded">
            <img
              src="/images/galeria/dmplayers.jpg"
              className="rounded img-fluid"
              alt="DM and players"
              loading="lazy"
            />
          </div>
        </Col>
        <Col md={6}>
          <p className="textcont">
            Bienvenido a The Iris of The Beholder. <br />
            Esta web esta dedicada a DND, un juego de rol de fantasia en la que tu
            junto a tus amigos participais en una campana para conseguir riquezas,
            fama, acabar con el mal, o quizas poder...
          </p>
        </Col>
      </Row>

      <Row className="align-items-center g-5 py-4">
        <Col md={7}>
          <p className="textcont">
            &ldquo;Dragones y Mazmorras&rdquo; (o Dungeons &amp; Dragons en ingles) contiene diversas
            especies, razas y clases que puedes elegir en la aventura en la que te
            adentraras seras quien tu quieras ser, te gustaria ser un minotauro que
            sea un paladin, o quizas un elfo que sea un mago, o a lo mejor quieres
            ser un enano barbaro? la decision esta al alcance de tu mano.
          </p>
        </Col>
        <Col md={5}>
          <div className="shadow p-3 mb-5 bg-body-tertiary rounded">
            <img
              src="/images/galeria/dmsession.jpg"
              className="rounded img-fluid"
              alt="DM session"
              loading="lazy"
            />
          </div>
        </Col>
      </Row>
    </Container>
  )
}
