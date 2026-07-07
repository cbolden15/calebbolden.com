'use client';

type OpenChatButtonProps = {
  label: string;
};

export default function OpenChatButton({ label }: OpenChatButtonProps) {
  return (
    <button
      type="button"
      className="btn-ink btn-roll"
      onClick={() => window.dispatchEvent(new Event('open-chat'))}
    >
      <span className="roll-box">
        <span className="roll-a">{label}</span>
        <span className="roll-b" aria-hidden="true">
          {label}
        </span>
      </span>
    </button>
  );
}
