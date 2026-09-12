import type { PublicMedia } from '@/lib/work/types';
import styles from './Showcase.module.css';

function timestamp(seconds: number) {
  const milliseconds = Math.round(seconds * 1000);
  return `${String(Math.floor(milliseconds / 3_600_000)).padStart(2, '0')}:${String(Math.floor(milliseconds / 60_000) % 60).padStart(2, '0')}:${String(Math.floor(milliseconds / 1000) % 60).padStart(2, '0')}.${String(milliseconds % 1000).padStart(3, '0')}`;
}

/** Server media only. The containing shell owns the walkthrough and recovery link. */
export default function ProjectMedia({ media, primary = false }: { media: PublicMedia; primary?: boolean }) {
  // Native media loading is supported by Chromium 148+; this narrow attribute
  // object bridges the older React type declaration without a client island.
  const videoLoading: { loading: 'eager' | 'lazy' } = { loading: primary ? 'eager' : 'lazy' };
  const captions = media.kind === 'video'
    ? `WEBVTT\n\n${media.captions.map(cue => `${timestamp(cue.start)} --> ${timestamp(cue.end)}\n${cue.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r?\n/g, ' ')}\n`).join('\n')}`
    : null;

  return (
    <figure className={styles.media} data-project-media={media.kind}>
      {media.kind === 'image' ? (
        // Reviewed local bytes and native failure behavior are intentional here.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={media.src} alt={media.alt} width={media.width} height={media.height} loading={primary ? 'eager' : 'lazy'} decoding="async" />
      ) : (
        <video {...videoLoading} controls preload="none" poster={media.poster} width={media.width} height={media.height} aria-label={media.alt}>
          <source src={media.src} type={media.src.endsWith('.webm') ? 'video/webm' : 'video/mp4'} />
          <track kind="captions" src={`data:text/vtt;charset=utf-8,${encodeURIComponent(captions!)}`} srcLang="en" label="English" default />
          Your browser cannot play this video. Read the transcript below.
        </video>
      )}
      <figcaption className="anno">{media.kind} · {media.caption}</figcaption>
      {media.kind === 'image' ? (
        <a className="link-draw text-sm text-[var(--color-blue)]" href={media.src}>Open full-size image</a>
      ) : (
        <div className="mt-4">
          <p className="anno anno-blue">Transcript</p>
          <p className="mt-2 text-base leading-relaxed">{media.transcript}</p>
        </div>
      )}
    </figure>
  );
}
