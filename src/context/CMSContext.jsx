import React, { createContext, useContext, useState, useEffect } from 'react';

const CMSContext = createContext();

const INITIAL_DATA = {
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
      title: 'Emirates Hills Grand Estate',
      location: 'Emirates Hills, Dubai',
      area: '15,000',
      price: '18,500,000',
      category: 'Residential',
      badge: 'EXCLUSIVE',
      gradient: 'linear-gradient(135deg, #0a1f0a 0%, #0d2b12 40%, #091a09 100%)',
      accent: '#1a4d1a',
      features: ['Sea View', 'Corner Plot', 'Freehold'],
    },
    {
      title: 'Palm Jumeirah Frond Plot',
      location: 'Palm Jumeirah, Dubai',
      area: '8,500',
      price: '12,200,000',
      category: 'Residential',
      badge: 'PRIME',
      gradient: 'linear-gradient(135deg, #021929 0%, #032438 40%, #01131e 100%)',
      accent: '#044266',
      features: ['Beachfront', 'Private Access', 'Freehold'],
    },
    {
      title: 'Business Bay Canal Front',
      location: 'Business Bay, Dubai',
      area: '22,000',
      price: '9,750,000',
      category: 'Commercial',
      badge: 'HOT',
      gradient: 'linear-gradient(135deg, #0d0a1f 0%, #151030 40%, #090714 100%)',
      accent: '#2a2060',
      features: ['Canal View', 'G+50 Permitted', 'Freehold'],
    },
    {
      title: 'MBR City Prime Plot',
      location: 'Mohammed Bin Rashid City',
      area: '30,000',
      price: '7,800,000',
      category: 'Mixed Use',
      badge: 'NEW',
      gradient: 'linear-gradient(135deg, #0a0f1f 0%, #101828 40%, #080d1a 100%)',
      accent: '#1a2a50',
      features: ['Master Plan', 'Flexible Zoning', 'Freehold'],
    },
    {
      title: 'Jumeirah Bay Island',
      location: 'Jumeirah Bay Island, Dubai',
      area: '12,000',
      price: '24,000,000',
      category: 'Residential',
      badge: 'ULTRA PRIME',
      gradient: 'linear-gradient(135deg, #011a1a 0%, #022828 40%, #010f0f 100%)',
      accent: '#044040',
      features: ['Island Living', '360° Views', 'Ultra-Premium'],
    },
    {
      title: 'Downtown Dubai Plot',
      location: 'Downtown Dubai, Sheikh Zayed Rd',
      area: '6,000',
      price: '32,000,000',
      category: 'Commercial',
      badge: 'LANDMARK',
      gradient: 'linear-gradient(135deg, #1a0a00 0%, #2a1200 40%, #140800 100%)',
      accent: '#4a2000',
      features: ['Burj Khalifa View', 'High ROI', 'Freehold'],
    },
  ],
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

export const CMSProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('capita_cms_data');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  const updateData = (newData) => {
    const updated = { ...data, ...newData };
    setData(updated);
    localStorage.setItem('capita_cms_data', JSON.stringify(updated));
  };

  const addProperty = (property) => {
    const updatedProperties = [property, ...data.properties];
    updateData({ properties: updatedProperties });
  };

  const updateProperty = (index, property) => {
    const updatedProperties = [...data.properties];
    updatedProperties[index] = property;
    updateData({ properties: updatedProperties });
  };

  const deleteProperty = (index) => {
    const updatedProperties = data.properties.filter((_, i) => i !== index);
    updateData({ properties: updatedProperties });
  };

  return (
    <CMSContext.Provider value={{ data, updateData, addProperty, updateProperty, deleteProperty }}>
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
