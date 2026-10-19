import liveGig from '../assets/live-gig.png'
import logo from '../assets/logo.png'
import { band } from '../content'

const shots = [
  {
    src: liveGig,
    alt: `${band.name} live: keyboard, guitar, and drums under stage lights`,
    caption: 'Live — Armagh nights',
  },
  {
    src: logo,
    alt: `${band.name} wordmark`,
    caption: 'The wordmark',
  },
]

export function Photos() {
  return (
    <article className="page">
      <p className="kicker">Photos</p>
      <h1>From the room</h1>
      <p className="lede">A small gallery to start. More shots can land in the same S3 bucket later.</p>
      <div className="gallery">
        {shots.map((shot) => (
          <figure key={shot.caption}>
            <img src={shot.src} alt={shot.alt} />
            <figcaption>{shot.caption}</figcaption>
          </figure>
        ))}
      </div>
    </article>
  )
}
