import { User, Restaurant, Deal, UserRole, MenuItem } from './types';

// Helper functions for date manipulation
const addHours = (date: Date, h: number) => new Date(date.getTime() + h * 60 * 60 * 1000);
const subMinutes = (date: Date, m: number) => new Date(date.getTime() - m * 60 * 1000);

// --- MENU DATA ---
const MENU_TEMPLATES: Record<string, Array<Omit<MenuItem, 'id'>>> = {
  Pizza: [
    { name: 'Margherita Classico', description: 'San Marzano tomato sauce, mozzarella di bufala, fresh basil.', price: 10.50, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500', category: 'Main' },
    { name: 'Diavola Spicy', description: 'Tomato sauce, mozzarella, spicy salami, chili oil.', price: 13.00, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500', category: 'Main' },
    { name: 'Quattro Formaggi', description: 'Mozzarella, gorgonzola, parmesan, fontina.', price: 14.50, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500', category: 'Main' },
    { name: 'Tiramisu', description: 'Homemade with espresso and mascarpone.', price: 7.00, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500', category: 'Dessert' },
    { name: 'Italian Cola', description: '0.33l Glass Bottle', price: 3.50, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500', category: 'Drink' }
  ],
  Burgers: [
    { name: 'Classic Smash', description: 'Double beef patty, american cheese, pickles, house sauce.', price: 11.00, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500', category: 'Main' },
    { name: 'Truffle Burger', description: 'Beef patty, truffle mayo, caramelized onions, gruyere.', price: 14.00, image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500', category: 'Main' },
    { name: 'Crispy Chicken', description: 'Fried chicken breast, coleslaw, spicy mayo.', price: 12.50, image: 'https://images.unsplash.com/photo-1615297928064-24977384d0f9?w=500', category: 'Main' },
    { name: 'Loaded Fries', description: 'Fries with cheese sauce and bacon bits.', price: 6.50, image: 'https://images.unsplash.com/photo-1573080496987-8198896d21c0?w=500', category: 'Side' },
    { name: 'Vanilla Shake', description: 'Real vanilla bean milkshake.', price: 6.00, image: 'https://images.unsplash.com/photo-1579954115563-e72bf1381629?w=500', category: 'Drink' }
  ],
  Sushi: [
    { name: 'Salmon Nigiri Set', description: '6 pieces of fresh salmon nigiri.', price: 15.00, image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500', category: 'Main' },
    { name: 'Spicy Tuna Roll', description: '8 pieces inside-out roll with spicy tuna.', price: 12.00, image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=500', category: 'Main' },
    { name: 'Dragon Roll', description: 'Tempura shrimp topped with avocado and eel sauce.', price: 16.00, image: 'https://images.unsplash.com/photo-1617196019294-dc44dfacb251?w=500', category: 'Main' },
    { name: 'Miso Soup', description: 'Traditional soup with tofu and seaweed.', price: 4.50, image: 'https://images.unsplash.com/photo-1547592166-23acbe3a624b?w=500', category: 'Side' },
    { name: 'Green Tea Mochi', description: 'Rice cake ice cream (2 pcs).', price: 5.00, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500', category: 'Dessert' }
  ],
  Döner: [
    { name: 'Classic Döner Kebab', description: 'Veal kebab with salad and garlic sauce.', price: 7.50, image: 'https://images.unsplash.com/photo-1663456386866-990d79b90eb1?w=500', category: 'Main' },
    { name: 'Döner Box', description: 'Meat and fries with sauce in a box.', price: 8.00, image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=500', category: 'Main' },
    { name: 'Lahmacun', description: 'Turkish pizza with minced meat and parsley.', price: 6.00, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500', category: 'Main' },
    { name: 'Ayran', description: 'Yogurt drink.', price: 2.00, image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=500', category: 'Drink' },
    { name: 'Baklava', description: 'Sweet pastry with pistachios.', price: 4.00, image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=500', category: 'Dessert' }
  ],
  Mexican: [
    { name: 'Tacos Al Pastor', description: '3 corn tortillas with marinated pork and pineapple.', price: 12.00, image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500', category: 'Main' },
    { name: 'Beef Burrito', description: 'Large tortilla with rice, beans, beef, cheese.', price: 11.00, image: 'https://images.unsplash.com/photo-1566740933430-b5e70b06d2d5?w=500', category: 'Main' },
    { name: 'Guacamole & Chips', description: 'Fresh made guacamole with tortilla chips.', price: 8.00, image: 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?w=500', category: 'Side' },
    { name: 'Churros', description: 'Fried dough with cinnamon sugar and chocolate dip.', price: 6.00, image: 'https://images.unsplash.com/photo-1624371414361-e670edf4898d?w=500', category: 'Dessert' }
  ],
  Indian: [
    { name: 'Butter Chicken', description: 'Chicken in creamy tomato curry sauce.', price: 14.50, image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500', category: 'Main' },
    { name: 'Chicken Tikka Masala', description: 'Roasted chunks of chicken in spicy sauce.', price: 14.00, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500', category: 'Main' },
    { name: 'Garlic Naan', description: 'Oven-baked flatbread with garlic.', price: 3.50, image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500', category: 'Side' },
    { name: 'Mango Lassi', description: 'Yogurt based mango drink.', price: 4.00, image: 'https://images.unsplash.com/photo-1596450522039-b3a1a54199c9?w=500', category: 'Drink' }
  ],
  Thai: [
    { name: 'Pad Thai', description: 'Stir-fried rice noodles with egg, peanuts, and shrimp.', price: 13.50, image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=500', category: 'Main' },
    { name: 'Green Curry', description: 'Spicy coconut curry with vegetables and chicken.', price: 14.00, image: 'https://images.unsplash.com/photo-1626804475297-411d6a6616bf?w=500', category: 'Main' },
    { name: 'Spring Rolls', description: '3 crispy vegetable rolls with chili sauce.', price: 5.00, image: 'https://images.unsplash.com/photo-1544510808-91bcbee1df55?w=500', category: 'Side' },
    { name: 'Thai Iced Tea', description: 'Sweet tea with condensed milk.', price: 4.50, image: 'https://images.unsplash.com/photo-1592663528246-817e91e1d00c?w=500', category: 'Drink' }
  ],
  Vegan: [
    { name: 'Buddha Bowl', description: 'Quinoa, chickpeas, avocado, sweet potato.', price: 13.00, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500', category: 'Main' },
    { name: 'Avocado Toast', description: 'Sourdough bread with smashed avocado and seeds.', price: 9.50, image: 'https://images.unsplash.com/photo-1588137372308-15f75323ca8d?w=500', category: 'Main' },
    { name: 'Green Detox Smoothie', description: 'Spinach, apple, cucumber, ginger.', price: 6.50, image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=500', category: 'Drink' },
    { name: 'Raw Brownie', description: 'Gluten-free date and nut brownie.', price: 5.00, image: 'https://images.unsplash.com/photo-1590080874088-e564811771ce?w=500', category: 'Dessert' }
  ],
  Greek: [
    { name: 'Gyros Plate', description: 'Rotisserie pork with fries, salad and pita.', price: 15.00, image: 'https://images.unsplash.com/photo-1544336068-450f63a2c076?w=500', category: 'Main' },
    { name: 'Souvlaki', description: 'Grilled meat skewers with rice.', price: 14.00, image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=500', category: 'Main' },
    { name: 'Greek Salad', description: 'Cucumber, tomato, olives, feta cheese.', price: 9.00, image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500', category: 'Side' },
    { name: 'Ouzo', description: 'Anise-flavored aperitif (2cl).', price: 3.00, image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=500', category: 'Drink' }
  ],
  Korean: [
    { name: 'Bibimbap', description: 'Rice bowl with mixed vegetables, egg, and gochujang.', price: 14.00, image: 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=500', category: 'Main' },
    { name: 'Korean Fried Chicken', description: 'Crispy chicken glazed with spicy sauce.', price: 15.00, image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500', category: 'Main' },
    { name: 'Kimchi', description: 'Spicy fermented cabbage.', price: 4.00, image: 'https://images.unsplash.com/photo-1583224964978-2257b96070d4?w=500', category: 'Side' },
    { name: 'Soju', description: 'Original fresh soju bottle.', price: 8.00, image: 'https://images.unsplash.com/photo-1628151016142-d688c2242133?w=500', category: 'Drink' }
  ],
  German: [
    { name: 'Wiener Schnitzel', description: 'Breaded veal cutlet with potato salad.', price: 18.00, image: 'https://images.unsplash.com/photo-1599921841143-819065a55cc6?w=500', category: 'Main' },
    { name: 'Currywurst', description: 'Sausage with curry ketchup and fries.', price: 9.50, image: 'https://images.unsplash.com/photo-1592011432221-e1d0337c7674?w=500', category: 'Main' },
    { name: 'Pretzel', description: 'Fresh bavarian pretzel.', price: 2.50, image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcf8?w=500', category: 'Side' },
    { name: 'Helles Beer', description: '0.5l Draft Beer.', price: 4.50, image: 'https://images.unsplash.com/photo-1606214306048-a708a5b3a886?w=500', category: 'Drink' }
  ],
  Dessert: [
    { name: 'Nutella Crepe', description: 'Thin pancake filled with chocolate hazelnut spread.', price: 5.50, image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=500', category: 'Dessert' },
    { name: 'Waffle Deluxe', description: 'Belgian waffle with berries and cream.', price: 6.50, image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=500', category: 'Dessert' },
    { name: 'Chocolate Lava Cake', description: 'Warm cake with liquid center.', price: 7.00, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500', category: 'Dessert' },
    { name: 'Cappuccino', description: 'Italian coffee.', price: 3.50, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500', category: 'Drink' }
  ]
};

const generateMenu = (cuisine: string, restaurantId: string): MenuItem[] => {
  const items = MENU_TEMPLATES[cuisine] || MENU_TEMPLATES['Burgers']; // Fallback
  return items.map((item, index) => ({
    id: `${restaurantId}_m_${index}`,
    name: item.name,
    description: item.description,
    price: item.price,
    image: item.image,
    category: item.category as any
  }));
};

const STATIC_PROFILE_ICON = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcikiLz48cGF0aCBkPSJNNTAgMjVDNTguMjggMjUgNjUgMzEuNzIgNjUgNDBDNjUgNDguMjggNTguMjggNTUgNTAgNTVDNDEuNzIgNTUgMzUgNDguMjggMzUgNDBDMzUgMzEuNzIgNDEuNzIgMjUgNTAgMjVaTTUwIDYwQzY2LjU3IDYwIDgwIDczLjQzIDgwIDkwSDIwQzIwIDczLjQzIDMzLjQzIDYwIDUwIDYwWiIgZmlsbD0id2hpdGUiLz48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXIiIHgxPSI1MCIgeTE9IjAiIHgyPSI1MCIgeTI9IjEwMCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiMwMEU1RkYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMyOTc5RkYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48L3N2Zz4=";

export const MOCK_USER_CUSTOMER: User = {
  id: 'u1',
  role: UserRole.CUSTOMER,
  name: 'Admin',
  email: 'admin@sponti.com',
  profilePicture: STATIC_PROFILE_ICON,
  favorites: ['r1', 'r4', 'r10', 'r16'],
  pushEnabled: true
};

export const MOCK_USER_OWNER: User = {
  id: 'u2',
  role: UserRole.OWNER,
  name: 'Admin',
  email: 'admin@sponti.com',
  profilePicture: STATIC_PROFILE_ICON,
  favorites: [],
  pushEnabled: true
};

// Munich Center roughly at Lat: 48.137, Lng: 11.575
export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: 'r1',
    ownerId: 'u2',
    name: 'Luigi\'s Trattoria',
    description: 'Authentic Italian pasta and wood-fired pizza near Marienplatz.',
    phone: '+49 89 123456',
    location: { lat: 48.1375, lng: 11.5755 }, // Center
    address: 'Marienplatz 1, 80331 München',
    photos: ['https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=800&q=80', 'https://picsum.photos/800/600?random=2'],
    cuisineType: 'Pizza', 
    openingHours: '11:00 - 23:00',
    rating: 4.8,
    menu: generateMenu('Pizza', 'r1')
  },
  {
    id: 'r2',
    ownerId: 'u99',
    name: 'Burger & Bun',
    description: 'Smash burgers made from organic Bavarian beef.',
    phone: '+49 89 987654',
    location: { lat: 48.1420, lng: 11.5860 }, // Lehel area
    address: 'Thierschstraße 5, 80538 München',
    photos: ['https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80'],
    cuisineType: 'Burgers',
    openingHours: '12:00 - 22:00',
    rating: 4.5,
    menu: generateMenu('Burgers', 'r2')
  },
  {
    id: 'r3',
    ownerId: 'u98',
    name: 'Sushi Zen',
    description: 'Fresh sushi and sashimi. Peaceful atmosphere near English Garden.',
    phone: '+49 89 111222',
    location: { lat: 48.1510, lng: 11.5800 }, // Schwabing edge
    address: 'Leopoldstraße 9, 80802 München',
    photos: ['https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80'],
    cuisineType: 'Sushi',
    openingHours: '17:00 - 23:00',
    rating: 4.9,
    menu: generateMenu('Sushi', 'r3')
  },
  {
    id: 'r4',
    ownerId: 'u97',
    name: 'Döner-Imbiss',
    description: 'The best kebab in town with homemade sauce.',
    phone: '+49 89 333444',
    location: { lat: 48.1330, lng: 11.5650 }, // Near Sendlinger Tor
    address: 'Sendlinger-Tor-Platz 7, 80336 München',
    photos: ['https://images.unsplash.com/photo-1663456386866-990d79b90eb1?w=800&q=80'],
    cuisineType: 'Döner',
    openingHours: '10:00 - 02:00',
    rating: 4.6,
    menu: generateMenu('Döner', 'r4')
  },
  {
    id: 'r5',
    ownerId: 'u96',
    name: 'Sakura Sushi',
    description: 'Quick and delicious sushi rolls for lunch.',
    phone: '+49 89 555666',
    location: { lat: 48.1400, lng: 11.5600 }, // Maxvorstadt
    address: 'Augustenstraße 22, 80333 München',
    photos: ['https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80'],
    cuisineType: 'Sushi',
    openingHours: '11:00 - 21:00',
    rating: 4.3,
    menu: generateMenu('Sushi', 'r5')
  },
  {
    id: 'r6',
    ownerId: 'u95',
    name: 'Pizza Napoli',
    description: 'Traditional Neapolitan pizza from a stone oven.',
    phone: '+49 89 777888',
    location: { lat: 48.1280, lng: 11.5750 }, // Gärtnerplatz area
    address: 'Reichenbachstraße 14, 80469 München',
    photos: ['https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80'],
    cuisineType: 'Pizza',
    openingHours: '17:00 - 23:00',
    rating: 4.7,
    menu: generateMenu('Pizza', 'r6')
  },
  {
    id: 'r7',
    ownerId: 'u94',
    name: 'Burger Haus',
    description: 'Hearty burgers with a German twist.',
    phone: '+49 89 999000',
    location: { lat: 48.1360, lng: 11.5900 }, // Isartor area
    address: 'Isartorplatz 5, 80331 München',
    photos: ['https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800&q=80'],
    cuisineType: 'Burgers',
    openingHours: '11:30 - 22:30',
    rating: 4.4,
    menu: generateMenu('Burgers', 'r7')
  },
  {
    id: 'r8',
    ownerId: 'u93',
    name: 'El Taco Loco',
    description: 'Spicy Mexican street food and mezcal cocktails.',
    phone: '+49 89 888111',
    location: { lat: 48.1320, lng: 11.5810 }, // Glockenbachviertel
    address: 'Müllerstraße 44, 80469 München',
    photos: ['https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80'],
    cuisineType: 'Mexican',
    openingHours: '16:00 - 01:00',
    rating: 4.7,
    menu: generateMenu('Mexican', 'r8')
  },
  {
    id: 'r9',
    ownerId: 'u92',
    name: 'Golden Curry',
    description: 'Aromatic Indian curries and fresh naan bread.',
    phone: '+49 89 777222',
    location: { lat: 48.1450, lng: 11.5580 }, // Near Hauptbahnhof
    address: 'Schillerstraße 10, 80336 München',
    photos: ['https://images.unsplash.com/photo-1585937421612-70a008356f36?w=800&q=80'],
    cuisineType: 'Indian',
    openingHours: '11:00 - 22:00',
    rating: 4.2,
    menu: generateMenu('Indian', 'r9')
  },
  {
    id: 'r10',
    ownerId: 'u91',
    name: 'Siam Basil',
    description: 'Authentic Thai cuisine with varying spice levels.',
    phone: '+49 89 666555',
    location: { lat: 48.1550, lng: 11.5850 }, // Schwabing
    address: 'Feilitzschstraße 23, 80802 München',
    photos: ['https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&q=80'],
    cuisineType: 'Thai',
    openingHours: '12:00 - 23:00',
    rating: 4.8,
    menu: generateMenu('Thai', 'r10')
  },
  {
    id: 'r11',
    ownerId: 'u90',
    name: 'Bowl & Green',
    description: 'Healthy superfood bowls and cold-pressed juices.',
    phone: '+49 89 444333',
    location: { lat: 48.1390, lng: 11.5700 }, // City Center
    address: 'Kaufingerstraße 12, 80331 München',
    photos: ['https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80'],
    cuisineType: 'Vegan',
    openingHours: '09:00 - 20:00',
    rating: 4.5,
    menu: generateMenu('Vegan', 'r11')
  },
  {
    id: 'r12',
    ownerId: 'u89',
    name: 'Athena\'s Grill',
    description: 'Greek taverna serving gyros, souvlaki and ouzo.',
    phone: '+49 89 222111',
    location: { lat: 48.1300, lng: 11.5950 }, // Haidhausen
    address: 'Weißenburger Platz 5, 81667 München',
    photos: ['https://images.unsplash.com/photo-1544336068-450f63a2c076?w=800&q=80'],
    cuisineType: 'Greek',
    openingHours: '17:00 - 00:00',
    rating: 4.6,
    menu: generateMenu('Greek', 'r12')
  },
  {
    id: 'r13',
    ownerId: 'u88',
    name: 'Seoul Kitchen',
    description: 'Korean BBQ and Bibimbap bowls.',
    phone: '+49 89 999888',
    location: { lat: 48.1480, lng: 11.5650 }, // Maxvorstadt
    address: 'Theresienstraße 55, 80333 München',
    photos: ['https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=800&q=80'],
    cuisineType: 'Korean',
    openingHours: '12:00 - 22:30',
    rating: 4.7,
    menu: generateMenu('Korean', 'r13')
  },
  {
    id: 'r14',
    ownerId: 'u87',
    name: 'Bavarian Helles',
    description: 'Traditional beer hall with pretzels and sausages.',
    phone: '+49 89 121212',
    location: { lat: 48.1350, lng: 11.5760 }, // Viktualienmarkt
    address: 'Viktualienmarkt 3, 80331 München',
    photos: ['https://images.unsplash.com/photo-1606214306048-a708a5b3a886?w=800&q=80'],
    cuisineType: 'German',
    openingHours: '10:00 - 23:00',
    rating: 4.4,
    menu: generateMenu('German', 'r14')
  },
  {
    id: 'r15',
    ownerId: 'u86',
    name: 'Crepe City',
    description: 'Sweet and savory crepes, French style.',
    phone: '+49 89 343434',
    location: { lat: 48.1500, lng: 11.5900 }, // Schwabing
    address: 'Occamstraße 8, 80802 München',
    photos: ['https://images.unsplash.com/photo-1519676867240-f03562e64548?w=800&q=80'],
    cuisineType: 'Dessert',
    openingHours: '10:00 - 20:00',
    rating: 4.9,
    menu: generateMenu('Dessert', 'r15')
  },
  {
    id: 'r16',
    ownerId: 'u85',
    name: 'Smash & Grab',
    description: 'The juiciest smash burgers in the district.',
    phone: '+49 89 112233',
    location: { lat: 48.1405, lng: 11.5700 },
    address: 'Türkenstraße 50, 80799 München',
    photos: ['https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80'],
    cuisineType: 'Burgers',
    openingHours: '11:00 - 22:00',
    rating: 4.6,
    menu: generateMenu('Burgers', 'r16')
  },
  {
    id: 'r17',
    ownerId: 'u84',
    name: 'Vegan Burger Co',
    description: 'Plant-based patties that taste real.',
    phone: '+49 89 223344',
    location: { lat: 48.1350, lng: 11.5600 },
    address: 'Sonnenstraße 12, 80331 München',
    photos: ['https://images.unsplash.com/photo-1520072959219-c595dc3f3cea?w=800&q=80'],
    cuisineType: 'Burgers',
    openingHours: '11:00 - 21:00',
    rating: 4.3,
    menu: generateMenu('Burgers', 'r17')
  },
  {
    id: 'r18',
    ownerId: 'u83',
    name: 'Gelato Mio',
    description: 'Authentic Italian gelato made fresh daily.',
    phone: '+49 89 334455',
    location: { lat: 48.1390, lng: 11.5800 },
    address: 'Tal 20, 80331 München',
    photos: ['https://images.unsplash.com/photo-1560008581-09826d1de69e?w=800&q=80'],
    cuisineType: 'Dessert',
    openingHours: '10:00 - 22:00',
    rating: 4.9,
    menu: generateMenu('Dessert', 'r18')
  },
  {
    id: 'r19',
    ownerId: 'u82',
    name: 'Choco Luv',
    description: 'Chocolaterie and cakes.',
    phone: '+49 89 445566',
    location: { lat: 48.1290, lng: 11.5700 },
    address: 'Fraunhoferstraße 8, 80469 München',
    photos: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80'],
    cuisineType: 'Dessert',
    openingHours: '09:00 - 19:00',
    rating: 4.7,
    menu: generateMenu('Dessert', 'r19')
  },
  {
    id: 'r20',
    ownerId: 'u81',
    name: 'Mustafa\'s Gem',
    description: 'Famous vegetable kebabs.',
    phone: '+49 89 556677',
    location: { lat: 48.1430, lng: 11.5550 },
    address: 'Karlsplatz 5, 80335 München',
    photos: ['https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&q=80'],
    cuisineType: 'Döner',
    openingHours: '10:00 - 04:00',
    rating: 4.5,
    menu: generateMenu('Döner', 'r20')
  },
  {
    id: 'r21',
    ownerId: 'u80',
    name: 'Sultan Grill',
    description: 'Charcoal grilled skewers and Döner plates.',
    phone: '+49 89 667788',
    location: { lat: 48.1250, lng: 11.5900 },
    address: 'Rosenheimer Platz 3, 81669 München',
    photos: ['https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80'],
    cuisineType: 'Döner',
    openingHours: '11:00 - 23:00',
    rating: 4.4,
    menu: generateMenu('Döner', 'r21')
  },
  {
    id: 'r22',
    ownerId: 'u79',
    name: 'Oishi',
    description: 'Modern sushi bar with train.',
    phone: '+49 89 778899',
    location: { lat: 48.1520, lng: 11.5950 },
    address: 'Münchner Freiheit 7, 80802 München',
    photos: ['https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80'],
    cuisineType: 'Sushi',
    openingHours: '11:30 - 23:30',
    rating: 4.6,
    menu: generateMenu('Sushi', 'r22')
  },
  {
    id: 'r23',
    ownerId: 'u78',
    name: 'Dragon Roll',
    description: 'Fusion sushi rolls and asian tapas.',
    phone: '+49 89 889900',
    location: { lat: 48.1480, lng: 11.5500 },
    address: 'Nymphenburger Str. 20, 80335 München',
    photos: ['https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800&q=80'],
    cuisineType: 'Sushi',
    openingHours: '17:00 - 23:00',
    rating: 4.8,
    menu: generateMenu('Sushi', 'r23')
  },
  {
    id: 'r24',
    ownerId: 'u77',
    name: 'Pizza Pazza',
    description: 'Crazy good slices for on the go.',
    phone: '+49 89 990011',
    location: { lat: 48.1320, lng: 11.5700 },
    address: 'Sendlinger Str. 10, 80331 München',
    photos: ['https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80'],
    cuisineType: 'Pizza',
    openingHours: '11:00 - 22:00',
    rating: 4.3,
    menu: generateMenu('Pizza', 'r24')
  },
  {
    id: 'r25',
    ownerId: 'u76',
    name: 'Venezia',
    description: 'Romantic pizza place by the river.',
    phone: '+49 89 001122',
    location: { lat: 48.1300, lng: 11.5850 },
    address: 'Am Isarkanal 4, 80469 München',
    photos: ['https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=800&q=80'],
    cuisineType: 'Pizza',
    openingHours: '17:00 - 23:00',
    rating: 4.7,
    menu: generateMenu('Pizza', 'r25')
  }
];

export const MOCK_DEALS: Deal[] = [
  {
    id: 'd1',
    restaurantId: 'r1',
    title: 'Pasta Lunch',
    description: 'Any pasta dish for 8€ instead of 12€. Quick lunch!',
    discountType: 'fixed',
    discountValue: 4,
    originalPrice: 12,
    startTime: subMinutes(new Date(), 30).toISOString(),
    endTime: addHours(new Date(), 2).toISOString(),
    createdByAi: false,
    maxRedemptions: 20,
    redemptionsCount: 5,
    isActive: true
  },
  {
    id: 'd2',
    restaurantId: 'r3',
    title: 'Maki Happy Hour',
    description: '20% off all maki rolls.',
    discountType: 'percent',
    discountValue: 20,
    startTime: subMinutes(new Date(), 10).toISOString(),
    endTime: addHours(new Date(), 1).toISOString(),
    createdByAi: true,
    maxRedemptions: 50,
    redemptionsCount: 12,
    isActive: true
  },
  {
    id: 'd3',
    restaurantId: 'r4',
    title: 'Döner Deal',
    description: 'Big Döner + Drink for only 6€!',
    discountType: 'fixed',
    discountValue: 3,
    originalPrice: 9,
    startTime: subMinutes(new Date(), 5).toISOString(),
    endTime: addHours(new Date(), 3).toISOString(),
    createdByAi: false,
    maxRedemptions: 100,
    redemptionsCount: 15,
    isActive: true
  },
  {
    id: 'd4',
    restaurantId: 'r5',
    title: 'Sushi Box 50%',
    description: '50% off the large Lunch Box.',
    discountType: 'percent',
    discountValue: 50,
    startTime: subMinutes(new Date(), 45).toISOString(),
    endTime: addHours(new Date(), 0.5).toISOString(), // Ending soon
    createdByAi: true,
    maxRedemptions: 10,
    redemptionsCount: 8,
    isActive: true
  },
  {
    id: 'd5',
    restaurantId: 'r6',
    title: 'Pizza Party',
    description: 'Buy 2 get 1 Free on all pizzas.',
    discountType: 'percent',
    discountValue: 33,
    startTime: subMinutes(new Date(), 60).toISOString(),
    endTime: addHours(new Date(), 4).toISOString(),
    createdByAi: false,
    maxRedemptions: 30,
    redemptionsCount: 2,
    isActive: true
  },
  {
    id: 'd6',
    restaurantId: 'r7',
    title: 'Late Night Burger',
    description: 'Cheeseburger for 5€ after 20:00.',
    discountType: 'fixed',
    discountValue: 5,
    originalPrice: 10,
    startTime: addHours(new Date(), -1).toISOString(),
    endTime: addHours(new Date(), 5).toISOString(),
    createdByAi: true,
    maxRedemptions: 50,
    redemptionsCount: 20,
    isActive: true
  },
  // --- NEW DEALS ---
  {
    id: 'd7',
    restaurantId: 'r8',
    title: 'Taco Tuesday',
    description: '3 Tacos for the price of 2.',
    discountType: 'percent',
    discountValue: 33,
    startTime: subMinutes(new Date(), 10).toISOString(),
    endTime: addHours(new Date(), 5).toISOString(),
    createdByAi: false,
    maxRedemptions: 60,
    redemptionsCount: 5,
    isActive: true
  },
  {
    id: 'd8',
    restaurantId: 'r9',
    title: 'Curry Lunch',
    description: 'Butter Chicken + Naan for 10€.',
    discountType: 'fixed',
    discountValue: 4,
    originalPrice: 14,
    startTime: subMinutes(new Date(), 120).toISOString(),
    endTime: addHours(new Date(), 1).toISOString(),
    createdByAi: true,
    maxRedemptions: 25,
    redemptionsCount: 18,
    isActive: true
  },
  {
    id: 'd9',
    restaurantId: 'r10',
    title: 'Pad Thai Special',
    description: 'Authentic Pad Thai for only 8€.',
    discountType: 'fixed',
    discountValue: 5,
    originalPrice: 13,
    startTime: subMinutes(new Date(), 20).toISOString(),
    endTime: addHours(new Date(), 2).toISOString(),
    createdByAi: false,
    maxRedemptions: 40,
    redemptionsCount: 3,
    isActive: true
  },
  {
    id: 'd10',
    restaurantId: 'r11',
    title: 'Healthy Boost',
    description: '30% off all Superfood Bowls.',
    discountType: 'percent',
    discountValue: 30,
    startTime: subMinutes(new Date(), 15).toISOString(),
    endTime: addHours(new Date(), 3).toISOString(),
    createdByAi: true,
    maxRedemptions: 20,
    redemptionsCount: 1,
    isActive: true
  },
  {
    id: 'd11',
    restaurantId: 'r12',
    title: 'Gyros Platter',
    description: 'Large Gyros plate with extra tzatziki.',
    discountType: 'fixed',
    discountValue: 3,
    originalPrice: 15,
    startTime: subMinutes(new Date(), 5).toISOString(),
    endTime: addHours(new Date(), 4).toISOString(),
    createdByAi: false,
    maxRedemptions: 50,
    redemptionsCount: 0,
    isActive: true
  },
  {
    id: 'd12',
    restaurantId: 'r13',
    title: 'Bibimbap Deal',
    description: 'Free drink with every Bibimbap.',
    discountType: 'fixed',
    discountValue: 3,
    startTime: subMinutes(new Date(), 40).toISOString(),
    endTime: addHours(new Date(), 2).toISOString(),
    createdByAi: true,
    maxRedemptions: 15,
    redemptionsCount: 7,
    isActive: true
  },
  {
    id: 'd13',
    restaurantId: 'r14',
    title: 'Bavarian Treat',
    description: '0.5L Beer + Pretzel Combo for 5€.',
    discountType: 'fixed',
    discountValue: 4,
    originalPrice: 9,
    startTime: subMinutes(new Date(), 0).toISOString(),
    endTime: addHours(new Date(), 6).toISOString(),
    createdByAi: false,
    maxRedemptions: 100,
    redemptionsCount: 2,
    isActive: true
  },
  {
    id: 'd14',
    restaurantId: 'r15',
    title: 'Sweet Crepe',
    description: 'Nutella Crepe for just 3€.',
    discountType: 'fixed',
    discountValue: 2,
    originalPrice: 5,
    startTime: subMinutes(new Date(), 10).toISOString(),
    endTime: addHours(new Date(), 1.5).toISOString(),
    createdByAi: true,
    maxRedemptions: 50,
    redemptionsCount: 22,
    isActive: true
  },
  // --- DEALS FOR NEW RESTAURANTS ---
  {
    id: 'd15',
    restaurantId: 'r16',
    title: 'Double Smash',
    description: 'Double cheese smash burger for single price.',
    discountType: 'fixed',
    discountValue: 4,
    originalPrice: 11,
    startTime: subMinutes(new Date(), 30).toISOString(),
    endTime: addHours(new Date(), 3).toISOString(),
    createdByAi: false,
    maxRedemptions: 50,
    redemptionsCount: 10,
    isActive: true
  },
  {
    id: 'd16',
    restaurantId: 'r17',
    title: 'Vegan Monday',
    description: '25% off all plant-based burgers.',
    discountType: 'percent',
    discountValue: 25,
    startTime: subMinutes(new Date(), 60).toISOString(),
    endTime: addHours(new Date(), 8).toISOString(),
    createdByAi: true,
    maxRedemptions: 30,
    redemptionsCount: 4,
    isActive: true
  },
  {
    id: 'd17',
    restaurantId: 'r18',
    title: 'Gelato Happy Hour',
    description: '3 scoops for 3€.',
    discountType: 'fixed',
    discountValue: 2,
    originalPrice: 5,
    startTime: subMinutes(new Date(), 15).toISOString(),
    endTime: addHours(new Date(), 1).toISOString(),
    createdByAi: false,
    maxRedemptions: 100,
    redemptionsCount: 42,
    isActive: true
  },
  {
    id: 'd18',
    restaurantId: 'r19',
    title: 'Cake Time',
    description: 'Free coffee with every slice of cake.',
    discountType: 'fixed',
    discountValue: 3.5,
    startTime: subMinutes(new Date(), 90).toISOString(),
    endTime: addHours(new Date(), 2).toISOString(),
    createdByAi: true,
    maxRedemptions: 20,
    redemptionsCount: 8,
    isActive: true
  },
  {
    id: 'd19',
    restaurantId: 'r20',
    title: 'Gemüse Kebab',
    description: 'The famous veggie kebab for just 4€.',
    discountType: 'fixed',
    discountValue: 3,
    originalPrice: 7,
    startTime: subMinutes(new Date(), 45).toISOString(),
    endTime: addHours(new Date(), 2).toISOString(),
    createdByAi: false,
    maxRedemptions: 80,
    redemptionsCount: 65,
    isActive: true
  },
  {
    id: 'd20',
    restaurantId: 'r21',
    title: 'Grill Platter',
    description: 'Mixed grill for 2 people - 30% off.',
    discountType: 'percent',
    discountValue: 30,
    startTime: subMinutes(new Date(), 20).toISOString(),
    endTime: addHours(new Date(), 4).toISOString(),
    createdByAi: true,
    maxRedemptions: 10,
    redemptionsCount: 2,
    isActive: true
  },
  {
    id: 'd21',
    restaurantId: 'r22',
    title: 'Running Sushi',
    description: 'All you can eat for 15€ (1 hour).',
    discountType: 'fixed',
    discountValue: 5,
    originalPrice: 20,
    startTime: subMinutes(new Date(), 10).toISOString(),
    endTime: addHours(new Date(), 2).toISOString(),
    createdByAi: false,
    maxRedemptions: 30,
    redemptionsCount: 15,
    isActive: true
  },
  {
    id: 'd22',
    restaurantId: 'r23',
    title: 'Fusion Roll Set',
    description: 'Chef\'s special roll set - 8 pieces.',
    discountType: 'percent',
    discountValue: 20,
    startTime: subMinutes(new Date(), 30).toISOString(),
    endTime: addHours(new Date(), 3).toISOString(),
    createdByAi: true,
    maxRedemptions: 25,
    redemptionsCount: 6,
    isActive: true
  },
  {
    id: 'd23',
    restaurantId: 'r24',
    title: 'Quick Slice',
    description: '2 Slices + Soda for 5€.',
    discountType: 'fixed',
    discountValue: 3,
    originalPrice: 8,
    startTime: subMinutes(new Date(), 5).toISOString(),
    endTime: addHours(new Date(), 5).toISOString(),
    createdByAi: false,
    maxRedemptions: 50,
    redemptionsCount: 12,
    isActive: true
  },
  {
    id: 'd24',
    restaurantId: 'r25',
    title: 'Date Night',
    description: 'Large Pizza + Wine for 15€.',
    discountType: 'fixed',
    discountValue: 7,
    originalPrice: 22,
    startTime: subMinutes(new Date(), 120).toISOString(),
    endTime: addHours(new Date(), 4).toISOString(),
    createdByAi: true,
    maxRedemptions: 15,
    redemptionsCount: 3,
    isActive: true
  }
];
