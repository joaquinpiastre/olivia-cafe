// Íconos de marcas (lucide ya no los incluye)
type P = { className?: string };

export function InstagramIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8v3h2.5V21h3z" />
    </svg>
  );
}

export function WhatsAppIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2a9.9 9.9 0 0 0-8.4 15.1L2 22l5.03-1.6A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-2.98.95.97-2.9-.2-.3a8.2 8.2 0 1 1 6.7 3.58Zm4.5-6.1c-.25-.12-1.46-.72-1.69-.8-.23-.09-.39-.12-.56.12-.16.25-.64.8-.78.97-.14.16-.29.18-.54.06a6.7 6.7 0 0 1-3.3-2.88c-.25-.43.25-.4.72-1.33.08-.16.04-.3-.02-.42-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.41-.56-.42h-.47c-.16 0-.43.06-.65.3-.23.25-.86.84-.86 2.05s.88 2.38 1 2.55c.12.16 1.73 2.65 4.2 3.72 1.56.67 2.17.73 2.95.62.48-.07 1.46-.6 1.67-1.17.2-.58.2-1.07.14-1.17-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  );
}

export function OliveMark({ className }: P) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path d="M9 40c4-12 11-21 28-29" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <g fill="currentColor">
        <ellipse cx="17" cy="31" rx="2.6" ry="5.4" transform="rotate(-48 17 31)" />
        <ellipse cx="23" cy="24" rx="2.6" ry="5.4" transform="rotate(-48 23 24)" />
        <ellipse cx="31" cy="18" rx="2.6" ry="5.4" transform="rotate(-48 31 18)" />
        <ellipse cx="25" cy="33" rx="2.6" ry="5.4" transform="rotate(42 25 33)" />
        <ellipse cx="32" cy="26" rx="2.6" ry="5.4" transform="rotate(42 32 26)" />
        <ellipse cx="38" cy="19" rx="2.2" ry="4.6" transform="rotate(42 38 19)" />
      </g>
    </svg>
  );
}
