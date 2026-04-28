// ─── VUELOS ──────────────────────────────────────────────────────────────────
export const flights = [
  {
    id: 'f1', type: 'flight',
    from: 'Madrid (MAD)', to: 'París (CDG)',
    airline: 'Iberia', logo: '✈',
    departure: '08:25', arrival: '10:45',
    duration: '2h 20m', stops: 'Directo',
    price: 189, originalPrice: 240,
    class: 'Economy', rating: 4.6,
    tags: ['Popular', 'Mejor precio'],
    color: 'rgba(255,255,255,0.7)'
  },
  {
    id: 'f2', type: 'flight',
    from: 'Madrid (MAD)', to: 'Londres (LHR)',
    airline: 'Vueling', logo: '✈',
    departure: '14:10', arrival: '16:30',
    duration: '2h 20m', stops: 'Directo',
    price: 145, originalPrice: 195,
    class: 'Economy', rating: 4.3,
    tags: ['Oferta'],
    color: 'rgba(200,200,200,0.6)'
  },
  {
    id: 'f3', type: 'flight',
    from: 'Madrid (MAD)', to: 'Roma (FCO)',
    airline: 'Ryanair', logo: '✈',
    departure: '06:00', arrival: '08:30',
    duration: '2h 30m', stops: 'Directo',
    price: 99, originalPrice: 130,
    class: 'Economy', rating: 3.9,
    tags: ['Low cost'],
    color: 'rgba(150,150,150,0.8)'
  },
  {
    id: 'f4', type: 'flight',
    from: 'Madrid (MAD)', to: 'Nueva York (JFK)',
    airline: 'Iberia Plus', logo: '✈',
    departure: '11:30', arrival: '15:00',
    duration: '8h 30m', stops: 'Directo',
    price: 620, originalPrice: 820,
    class: 'Business', rating: 4.9,
    tags: ['Premium', 'Larga distancia'],
    color: 'rgba(255,255,255,0.9)'
  },
  {
    id: 'f5', type: 'flight',
    from: 'Madrid (MAD)', to: 'Tokio (NRT)',
    airline: 'Japan Airlines', logo: '✈',
    departure: '20:00', arrival: '16:30+1',
    duration: '13h 30m', stops: '1 escala',
    price: 890, originalPrice: 1100,
    class: 'Economy', rating: 4.8,
    tags: ['Asia', 'Top valorado'],
    color: 'rgba(220,220,220,0.7)'
  },
  {
    id: 'f6', type: 'flight',
    from: 'Madrid (MAD)', to: 'Dubai (DXB)',
    airline: 'Emirates', logo: '✈',
    departure: '09:00', arrival: '19:30',
    duration: '7h 30m', stops: 'Directo',
    price: 510, originalPrice: 680,
    class: 'Economy', rating: 4.7,
    tags: ['Lujo', 'Recomendado'],
    color: 'rgba(240,240,240,0.85)'
  }
];

// ─── HOTELES ─────────────────────────────────────────────────────────────────
export const hotels = [
  {
    id: 'h1', type: 'hotel',
    name: 'Grand Hôtel du Palais',
    city: 'París', country: 'Francia',
    stars: 5, rating: 4.9, reviews: 2841,
    pricePerNight: 420, originalPrice: 550,
    amenities: ['Spa', 'Pool', 'Gym', 'Restaurant', 'Bar'],
    description: 'Lujo histórico con decoración monocromática, a pasos del Louvre.',
    tags: ['Lujo', 'Spa', 'Centro'],
    color: 'rgba(255,255,255,0.8)',
    nights: 3
  },
  {
    id: 'h2', type: 'hotel',
    name: 'The Monochrome, Paris',
    city: 'París', country: 'Francia',
    stars: 4, rating: 4.6, reviews: 1203,
    pricePerNight: 220, originalPrice: 280,
    amenities: ['Restaurant', 'Bar', 'WiFi', 'Gym'],
    description: 'Hotel boutique de diseño minimalista en el corazón de Le Marais.',
    tags: ['Boutique', 'Design', 'Minimal'],
    color: 'rgba(180,180,180,0.7)',
    nights: 3
  },
  {
    id: 'h3', type: 'hotel',
    name: 'Glass Tower London',
    city: 'Londres', country: 'Reino Unido',
    stars: 4, rating: 4.7, reviews: 5412,
    pricePerNight: 185, originalPrice: 230,
    amenities: ['Bar', 'WiFi', 'Gym', 'Canteen'],
    description: 'Diseño inteligente de cristal con vistas únicas a la ciudad.',
    tags: ['Design', 'Vistas', 'Smart'],
    color: 'rgba(255,255,255,0.6)',
    nights: 3
  },
  {
    id: 'h4', type: 'hotel',
    name: 'Rome Cavalieri',
    city: 'Roma', country: 'Italia',
    stars: 5, rating: 4.9, reviews: 3201,
    pricePerNight: 580, originalPrice: 720,
    amenities: ['Spa', 'Pool', 'Gym', 'Fine Dining', 'Bar'],
    description: 'El hotel más exclusivo de Roma con vistas panorámicas.',
    tags: ['Lujo', 'Vistas', 'Premium'],
    color: 'rgba(255,255,255,0.9)',
    nights: 3
  },
  {
    id: 'h5', type: 'hotel',
    name: 'Armani Hotel Dubai',
    city: 'Dubai', country: 'EAU',
    stars: 5, rating: 4.8, reviews: 1876,
    pricePerNight: 750, originalPrice: 950,
    amenities: ['Spa', 'Pool', 'Gym', 'Fine Dining', 'Lounge'],
    description: 'Minimalismo y elegancia diseñados por Giorgio Armani.',
    tags: ['Ultra Lujo', 'Icónico', 'Moda'],
    color: 'rgba(230,230,230,0.85)',
    nights: 3
  },
  {
    id: 'h6', type: 'hotel',
    name: 'Park Hyatt Tokyo',
    city: 'Tokio', country: 'Japón',
    stars: 5, rating: 4.9, reviews: 2204,
    pricePerNight: 620, originalPrice: 800,
    amenities: ['Spa', 'Pool', 'Gym', 'Jazz Bar', 'Fine Dining'],
    description: 'Icónico hotel donde la ciudad se ve a través de enormes ventanales.',
    tags: ['Icónico', 'Premium', 'Vistas'],
    color: 'rgba(200,200,200,0.75)',
    nights: 3
  }
];

// ─── EXPERIENCIAS ─────────────────────────────────────────────────────────────
export const experiences = [
  {
    id: 'e1', type: 'experience',
    name: 'Cena a Ciegas',
    city: 'París', category: 'Gastronomía',
    duration: '3h', groupSize: 'Máx. 12 personas',
    price: 89, originalPrice: 110,
    rating: 4.9, reviews: 3120,
    description: 'Descubre los sabores sin distracciones visuales. Experiencia en total oscuridad.',
    tags: ['Foodie', 'Único', 'Grupo'],
    emoji: '♨',
    color: 'rgba(100,100,100,0.8)'
  },
  {
    id: 'e2', type: 'experience',
    name: 'Acceso VIP Torre Eiffel',
    city: 'París', category: 'Cultura',
    duration: '2h', groupSize: 'Máx. 8 personas',
    price: 149, originalPrice: 185,
    rating: 5.0, reviews: 982,
    description: 'Magia en blanco y negro al amanecer desde la Torre Eiffel, con champán.',
    tags: ['VIP', 'Exclusivo'],
    emoji: '♕',
    color: 'rgba(255,255,255,0.9)'
  },
  {
    id: 'e3', type: 'experience',
    name: 'Fotografía en Roma',
    city: 'Roma', category: 'Cultura',
    duration: '4h', groupSize: 'Máx. 6 personas',
    price: 115, originalPrice: 140,
    rating: 4.8, reviews: 2410,
    description: 'Aprende fotografía en blanco y negro por las calles de Roma con un profesional.',
    tags: ['Arte', 'Cultura', 'Caminar'],
    emoji: '⛶',
    color: 'rgba(180,180,180,0.7)'
  },
  {
    id: 'e4', type: 'experience',
    name: 'Safari de Buceo Nocturno',
    city: 'Dubai', category: 'Aventura',
    duration: '6h', groupSize: 'Máx. 10 personas',
    price: 210, originalPrice: 270,
    rating: 4.7, reviews: 1530,
    description: 'Explora arrecifes en la oscuridad del mar en Dubai.',
    tags: ['Aventura', 'Mar', 'Nocturno'],
    emoji: '𓇼',
    color: 'rgba(80,80,80,0.9)'
  },
  {
    id: 'e5', type: 'experience',
    name: 'Ceremonia Zen',
    city: 'Tokio', category: 'Bienestar',
    duration: '2h', groupSize: 'Máx. 4 personas',
    price: 95, originalPrice: 120,
    rating: 4.9, reviews: 1891,
    description: 'Sumérgete en la meditación zen guiado por un maestro en un templo minimalista.',
    tags: ['Zen', 'Minimal', 'Exclusivo'],
    emoji: '☯',
    color: 'rgba(255,255,255,0.85)'
  },
  {
    id: 'e6', type: 'experience',
    name: 'Recorrido en Lancha Blanca',
    city: 'Londres', category: 'Aventura',
    duration: '2h', groupSize: 'Máx. 12 personas',
    price: 79, originalPrice: 95,
    rating: 4.6, reviews: 3890,
    description: 'Surca el Támesis a toda velocidad a bordo de una moderna lancha monocromática.',
    tags: ['Velocidad', 'Vistas', 'Adrenalina'],
    emoji: '☼',
    color: 'rgba(210,210,210,0.8)'
  }
];
