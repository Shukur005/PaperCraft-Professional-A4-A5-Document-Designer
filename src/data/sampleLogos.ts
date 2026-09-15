// Pre-made high quality vector SVG logos for quick letterhead & document design
export interface SampleLogo {
  id: string;
  name: string;
  category: 'medical' | 'business' | 'education' | 'retail' | 'seal';
  svgDataUri: string;
}

export const SAMPLE_LOGOS: SampleLogo[] = [
  {
    id: 'med-cross',
    name: 'Medical Cross & Pulse',
    category: 'medical',
    svgDataUri: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <circle cx="50" cy="50" r="46" fill="#0284c7" />
        <rect x="42" y="22" width="16" height="56" rx="4" fill="#ffffff" />
        <rect x="22" y="42" width="56" height="16" rx="4" fill="#ffffff" />
        <path d="M28 50 L40 50 L45 36 L52 64 L58 44 L63 50 L72 50" fill="none" stroke="#0284c7" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    `)}`
  },
  {
    id: 'hospital-caduceus',
    name: 'Hospital Emblem',
    category: 'medical',
    svgDataUri: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <circle cx="50" cy="50" r="46" fill="#0f766e" />
        <path d="M50 18 L50 82" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
        <circle cx="50" cy="18" r="8" fill="#facc15" />
        <path d="M26 36 C42 28 58 44 50 56 C42 68 58 80 50 82" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
        <path d="M74 36 C58 28 42 44 50 56 C58 68 42 80 50 82" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
      </svg>
    `)}`
  },
  {
    id: 'corp-shield',
    name: 'Corporate Hex Shield',
    category: 'business',
    svgDataUri: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <polygon points="50,10 90,32 90,72 50,92 10,72 10,32" fill="#1e293b" />
        <polygon points="50,22 78,38 78,66 50,80 22,66 22,38" fill="#3b82f6" />
        <path d="M35 50 L45 60 L68 36" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `)}`
  },
  {
    id: 'school-crest',
    name: 'Academy Crest & Book',
    category: 'education',
    svgDataUri: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <path d="M50 10 C80 10 90 25 90 55 C90 75 65 92 50 96 C35 92 10 75 10 55 C10 25 20 10 50 10 Z" fill="#831843" />
        <path d="M50 32 L28 44 L50 56 L72 44 Z" fill="#fef08a" stroke="#ffffff" stroke-width="2"/>
        <path d="M36 50 L36 64 C36 70 50 74 50 74 C50 74 64 70 64 64 L64 50" fill="none" stroke="#fef08a" stroke-width="3"/>
        <circle cx="50" cy="24" r="4" fill="#ffffff" />
      </svg>
    `)}`
  },
  {
    id: 'retail-bag',
    name: 'Retail Store & Crown',
    category: 'retail',
    svgDataUri: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect x="18" y="32" width="64" height="58" rx="8" fill="#ea580c" />
        <path d="M34 32 V24 C34 16 66 16 66 24 V32" fill="none" stroke="#c2410c" stroke-width="6" stroke-linecap="round" />
        <polygon points="50,44 58,62 76,62 62,72 68,88 50,78 32,88 38,72 24,62 42,62" fill="#fef08a" />
      </svg>
    `)}`
  },
  {
    id: 'certified-seal',
    name: 'Golden Quality Seal',
    category: 'seal',
    svgDataUri: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <circle cx="50" cy="50" r="44" fill="#ca8a04" stroke="#eab308" stroke-width="4" stroke-dasharray="4 2"/>
        <circle cx="50" cy="50" r="36" fill="#854d0e" />
        <path d="M34 50 L45 61 L66 38" fill="none" stroke="#fef08a" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M40 85 L32 98 L50 92 L68 98 L60 85" fill="#ca8a04" />
      </svg>
    `)}`
  }
];
