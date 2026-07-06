export default function Footer() {
  // Title-block footer: hairline rule, mono metadata, nothing boxed.
  return (
    <footer className="chat-offset" style={{ borderTop: '1px solid var(--color-hairline)' }}>
      <div className="mx-auto flex w-[90%] max-w-[1200px] flex-col gap-2 py-8 sm:flex-row sm:items-baseline sm:justify-between">
        <span className="anno">Caleb Bolden</span>
        <span style={{ fontSize: 13, color: 'var(--color-ink-faint)' }}>
          &copy; 2026 Caleb Bolden. Services provided by Vora Technologies LLC.
        </span>
      </div>
    </footer>
  );
}
