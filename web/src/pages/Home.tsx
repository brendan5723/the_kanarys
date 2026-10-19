import { Link } from 'react-router-dom'
import liveGig from '../assets/live-gig.png'
import logo from '../assets/logo.png'
import { band } from '../content'

export function Home() {
  return (
    <>
      <section className="logo-strip">
        <img src={logo} alt={`${band.name} wordmark`} />
      </section>
      <section className="hero">
        <p className="kicker">{band.tagline}</p>
        <h1>{band.members.join(', ')}</h1>
        <p className="lede">
          A three-piece from Armagh City. Keys, guitar, and drums in small rooms with
          coloured lights and loud amps.
        </p>
        <div className="actions">
          <Link className="btn" to="/music">
            Listen
          </Link>
          <Link className="btn btn-ghost" to="/contact">
            Get in touch
          </Link>
        </div>
      </section>
      <figure className="featured">
        <img src={liveGig} alt={`${band.name} playing live: keys, guitar, and drums`} />
        <figcaption>Live in the room — keys, guitar, drums.</figcaption>
      </figure>
    </>
  )
}
