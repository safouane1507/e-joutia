// Palette de couleurs + données fictives (avis, badges) de e-joutia

export const colors = {
  primary: '#D9764A',
  primaryDark: '#B85C32',
  secondary: '#1F8A70',
  background: '#F8F5F0',
  surface: '#FFFFFF',
  text: '#2D2A26',
  textMuted: '#8A8581',
  border: '#E5E0DA',
  error: '#D64545',
  star: '#F5A623',
  badgeBackground: '#EAF6F2',
  badgeText: '#1F8A70',
};

export const TRUST_BADGES = [
  { id: 'verified', label: 'Profil vérifié', icon: 'shield-checkmark' },
  { id: 'fast-reply', label: 'Répond rapidement', icon: 'flash' },
];

export const MOCK_REVIEWS = [
  {
    id: '1',
    author: 'Sara El Amrani',
    avatar: 'https://api.dicebear.com/7.x/micah/png?seed=Sara',
    rating: 5,
    comment: "Très bon échange, l'objet était exactement comme sur les photos. Vendeur sérieux et ponctuel !",
    date: '02 mai 2026',
  },
  {
    id: '2',
    author: 'Yassine Bouzid',
    avatar: 'https://api.dicebear.com/7.x/micah/png?seed=Yassine',
    rating: 4,
    comment: 'Bonne communication, léger retard au rendez-vous mais rien de grave.',
    date: '21 avril 2026',
  },
  {
    id: '3',
    author: 'Imane Tazi',
    avatar: 'https://api.dicebear.com/7.x/micah/png?seed=Imane',
    rating: 5,
    comment: 'Je recommande, prix juste et produit en parfait état.',
    date: '08 avril 2026',
  },
  {
    id: '4',
    author: 'Omar Idrissi',
    avatar: 'https://api.dicebear.com/7.x/micah/png?seed=Omar',
    rating: 4,
    comment: 'Transaction simple et rapide, merci !',
    date: '19 mars 2026',
  },
];

export const getAverageRating = (reviews) =>
  reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
