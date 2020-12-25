import * as React from "react"

function MailIcon(props: any) {
  return (
    <svg
      aria-hidden="true"
      width="1em"
      height="1em"
      style={{
        msTransform: "rotate(360deg)",
        WebkitTransform: "rotate(360deg)",
      }}
      viewBox="0 0 36 36"
      transform="rotate(360)"
      {...props}
    >
      <path
        fill="#CCD6DD"
        d="M36 27a4 4 0 01-4 4H4a4 4 0 01-4-4V9a4 4 0 014-4h28a4 4 0 014 4v18z"
      />
      <path
        fill="#99AAB5"
        d="M11.95 17.636L.637 28.949c-.027.028-.037.063-.06.091.34.57.814 1.043 1.384 1.384.029-.023.063-.033.09-.06L13.365 19.05a1 1 0 00-1.415-1.414M35.423 29.04c-.021-.028-.033-.063-.06-.09L24.051 17.636a1 1 0 10-1.415 1.414l11.313 11.314c.026.026.062.037.09.06a3.978 3.978 0 001.384-1.384"
      />
      <path
        fill="#99AAB5"
        d="M32 5H4a4 4 0 00-4 4v1.03l14.528 14.496a4.882 4.882 0 006.884 0L36 10.009V9a4 4 0 00-4-4z"
      />
      <path
        fill="#E1E8ED"
        d="M32 5H4A3.992 3.992 0 00.405 7.275l14.766 14.767a4 4 0 005.657 0L35.595 7.275A3.991 3.991 0 0032 5z"
      />
      <path
        fill="#66757F"
        d="M15 9.27c0-.73.365-1.27 1-1.27h3.62c.839 0 1.174.49 1.174 1 0 .496-.349 1-1.035 1h-2.708v2h2.533c.716 0 1.065.489 1.065 1 0 .496-.366 1-1.065 1h-2.533v2h2.84c.699 0 1.037.489 1.037 1 0 .496-.353 1-1.037 1h-3.766C15.482 18 15 17.469 15 16.812V9.27z"
      />
    </svg>
  )
}

export default MailIcon
