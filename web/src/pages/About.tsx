import { band } from '../content'

export function About() {
  return (
    <article className="page">
      <p className="kicker">About</p>
      <h1>Three friends from Armagh</h1>
      <p className="lede">
        {band.name} were a blues rock band: {band.members.join(', ')}. We grew up in{' '}
        {band.hometown} and learned the songs the usual way — in rooms that were too
        small, too loud, and exactly right.
      </p>
      <div className="split">
        <section>
          <h2>The lineup</h2>
          <ul className="member-list">
            {band.members.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2>The sound</h2>
          <ul className="member-list">
            {band.instruments.map((instrument) => (
              <li key={instrument}>{instrument}</li>
            ))}
          </ul>
        </section>
      </div>
      <p>
        This site is the first one we ever had. It is also a working AWS sandbox: static
        files on S3, CloudFront in front, and a single Lambda for the contact form.
      </p>
    </article>
  )
}
