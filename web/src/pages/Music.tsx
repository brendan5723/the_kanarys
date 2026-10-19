import { band, musicEmbeds } from '../content'

function EmbedFrame({ title, src }: { title: string; src: string }) {
  return (
    <div className="embed">
      <iframe
        title={title}
        src={src}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}

export function Music() {
  const hasAny =
    Boolean(musicEmbeds.youtubeUrl) ||
    Boolean(musicEmbeds.spotifyUrl) ||
    Boolean(musicEmbeds.bandcampUrl)

  return (
    <article className="page">
      <p className="kicker">Music</p>
      <h1>Listen in</h1>
      <p className="lede">
        Blues rock, three-piece. Drop YouTube, Spotify, or Bandcamp URLs into{' '}
        <code>web/src/content.ts</code> when you have them.
      </p>
      {musicEmbeds.youtubeUrl ? (
        <EmbedFrame title={`${band.name} on YouTube`} src={musicEmbeds.youtubeUrl} />
      ) : null}
      {musicEmbeds.spotifyUrl ? (
        <EmbedFrame title={`${band.name} on Spotify`} src={musicEmbeds.spotifyUrl} />
      ) : null}
      {musicEmbeds.bandcampUrl ? (
        <EmbedFrame title={`${band.name} on Bandcamp`} src={musicEmbeds.bandcampUrl} />
      ) : null}
      {!hasAny ? (
        <p className="panel">
          No public embeds wired yet. Until then, shout at us on{' '}
          <a href={band.facebook} rel="noreferrer" target="_blank">
            Facebook
          </a>
          .
        </p>
      ) : null}
    </article>
  )
}
