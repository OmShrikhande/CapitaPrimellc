const INITIAL_DATA = {
  theme: {
    primary: '#c5a059',
    secondary: '#060606',
    accent: '#ffffff',
    mode: 'dark',
  },
  hero: {
    label: "Dubai's Premier Land Consultancy",
    titleLine1: "Where",
    titleLine2: "Visionaries",
    titleLine3: "Invest in the",
    titleLine4: "Golden Horizon",
    description: "Exclusive access to Dubai's most coveted land plots. From Palm Jumeirah fronds to downtown commercial masterpieces — we connect elite investors with tomorrow's landmarks.",
    ctaPrimary: "Explore Listings",
    ctaSecondary: "Book Consultation",
    locations: ['Palm Jumeirah', 'Emirates Hills', 'Creek Harbour', 'MBR City']
  },
  stats: [
    { value: 4.2, suffix: 'B+', prefix: 'AED ', label: 'Total Transaction Volume', decimal: true },
    { value: 18, suffix: '+', prefix: '', label: 'Years of Excellence', decimal: false },
    { value: 650, suffix: '+', prefix: '', label: 'Satisfied Investors', decimal: false },
    { value: 1200, suffix: '+', prefix: '', label: 'Prime Plots Transacted', decimal: false },
  ],
  properties: [
    {
      id: 'p1',
      title: 'Emirates Hills Grand Estate',
      location: 'Emirates Hills, Dubai',
      area: '15,000',
      price: '18,500,000',
      category: 'Residential',
      badge: 'EXCLUSIVE',
      gradient: 'linear-gradient(135deg, #0a1f0a 0%, #0d2b12 40%, #091a09 100%)',
      accent: '#1a4d1a',
      features: ['Sea View', 'Corner Plot', 'Freehold'],
      isVisible: true,
      gallery: ['/flaw.png'],
      specs: {
        zoning: 'Residential',
        permit: 'G+2',
        coverage: '65%',
        ownership: 'Freehold'
      }
    },
    {
      id: 'p2',
      title: 'Palm Jumeirah Frond Plot',
      location: 'Palm Jumeirah, Dubai',
      area: '8,500',
      price: '12,200,000',
      category: 'Residential',
      badge: 'PRIME',
      gradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 40%, #050505 100%)',
      accent: '#c5a059',
      features: ['Beachfront', 'Private Access', 'Freehold'],
      isVisible: true,
      gallery: ['/flaw.png'],
      specs: {
        zoning: 'Residential',
        permit: 'G+1',
        coverage: '50%',
        ownership: 'Freehold'
      }
    },
    {
      id: 'p3',
      title: 'Business Bay Canal Front',
      location: 'Business Bay, Dubai',
      area: '22,000',
      price: '9,750,000',
      category: 'Commercial',
      badge: 'HOT',
      gradient: 'linear-gradient(135deg, #0f0a05 0%, #1a1510 40%, #080502 100%)',
      accent: '#8B6B14',
      features: ['Canal View', 'G+50 Permitted', 'Freehold'],
      isVisible: true,
      gallery: ['/flaw.png'],
      specs: {
        zoning: 'Commercial',
        permit: 'G+50',
        coverage: '100%',
        ownership: 'Freehold'
      }
    },
  ],
  offers: [
    {
      id: 'o1',
      title: 'Ramadan Special: Zero DLD Fees',
      description: 'Book any prime plot this month and we cover 100% of your DLD registration fees.',
      expiry: '2024-04-30',
      isVisible: false,
    },
    {
      id: 'o2',
      title: 'Bulk Investment Discount',
      description: 'Get up to 15% discount on purchasing 3 or more plots in MBR City.',
      expiry: '2024-12-31',
      isVisible: true,
    }
  ],
  popupSettings: {
    enabled: true,
    delaysInSeconds: [0, 60, 120],
  },
  services: [
    {
      title: 'Land Acquisition',
      desc: 'Strategic sourcing and securing of prime Dubai land plots aligned with your investment vision and return objectives.',
    },
    {
      title: 'Investment Strategy',
      desc: 'Data-driven portfolio optimization tailored to maximize ROI across Dubai\'s rapidly evolving real estate landscape.',
    },
    {
      title: 'Legal & Compliance',
      desc: 'End-to-end RERA registration, DLD documentation, and regulatory compliance handled by our expert legal team.',
    },
    {
      title: 'Market Intelligence',
      desc: 'Proprietary analytics and real-time market data to identify emerging opportunities before they reach the public market.',
    },
  ],
  about: {
    label: "Our Legacy",
    titleLine1: "Two Decades of Shaping",
    titleLine2: "Dubai's Landscape",
    description1: "Founded in 2006 in the heart of the Burj Khalifa District, Capita Prime LLC was born from a singular vision: to redefine how the world's elite access and invest in Dubai's most prestigious land assets.",
    description2: "Today, with over AED 4.2 billion in completed transactions and a clientele that spans 42 nationalities, we stand as Dubai's most trusted name in bespoke land investment advisory.",
    values: [
      { label: 'Integrity', desc: 'Transparent dealings, always.' },
      { label: 'Precision', desc: 'Every detail matters.' },
      { label: 'Discretion', desc: 'Your privacy is sacred.' },
      { label: 'Excellence', desc: 'Nothing less, always more.' },
    ],
    certifications: [
      'RERA Certified Agency',
      'DLD Registered',
      'ISO 9001 Compliant',
      'Member — Dubai Chamber',
    ],
    quote: "Where the desert meets ambition, we build legacies.",
    estYear: "2006",
    teamSize: "45+"
  },
  testimonials: [
    {
      quote: "Capita Prime LLC transformed my understanding of Dubai's land market. Their off-market access and due diligence process is unmatched. The Palm Jumeirah plot they secured for me has appreciated 180% in three years.",
      name: 'Khalid Al Mansoori',
      title: 'Private Equity Investor, Abu Dhabi',
      initials: 'KM',
    },
    {
      quote: "As a London-based fund manager overseeing a $2B real estate portfolio, I needed a partner who understood both international standards and local nuances. Capita Prime exceeds every expectation — every single time.",
      name: 'James Whitfield',
      title: 'Fund Manager, Whitfield Capital, London',
      initials: 'JW',
    },
    {
      quote: "Our Singapore office has allocated over SGD 400M to Dubai land through Capita Prime. Their market intelligence, legal coordination, and speed of execution is genuinely world-class. A rare firm.",
      name: 'Priya Krishnamurthy',
      title: 'Director of Investments, Meridian SWF, Singapore',
      initials: 'PK',
    },
  ]
};

module.exports = { INITIAL_DATA };
