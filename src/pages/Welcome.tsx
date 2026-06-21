import { useNavigate } from 'react-router-dom'

export default function Welcome() {
  const navigate = useNavigate()
  return (
    <div className="welcome-page">
      <div id="indexcontent">
        <img id="imgIndex" src="/images/dndMinimal-removebg-preview-cropped.png" alt="" />
        <div>
          <h2 className="title">The Iris of The Beholder</h2>
          <button className="enter" onClick={() => navigate('/principal')}>
            Bienvenido
          </button>
        </div>
      </div>
    </div>
  )
}
