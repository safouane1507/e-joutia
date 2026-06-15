// Données fictives utilisées par l'écran "Profil Public" (PROJET 1).
// Dans une future version, ces données proviendront d'une API.

export const TRUST_BADGES = [
  { id: 'verified', label: 'Profil vérifié', icon: 'shield-checkmark' },
  { id: 'fast-reply', label: 'Répond rapidement', icon: 'flash' },
];

export const MOCK_REVIEWS = [
  {
    id: '1',
    author: 'Sara El Amrani',
    avatar: 'https://i.pravatar.cc/150?img=47',
    rating: 5,
    comment:
      'Très bon échange, l\'objet était exactement comme sur les photos. Vendeur sérieux et ponctuel !',
    date: '02 mai 2026',
  },
  {
    id: '2',
    author: 'Yassine Bouzid',
    avatar: 'https://i.pravatar.cc/150?img=12',
    rating: 4,
    comment: 'Bonne communication, léger retard au rendez-vous mais rien de grave.',
    date: '21 avril 2026',
  },
  {
    id: '3',
    author: 'Imane Tazi',
    avatar: 'https://i.pravatar.cc/150?img=32',
    rating: 5,
    comment: 'Je recommande, prix juste et produit en parfait état.',
    date: '08 avril 2026',
  },
  {
    id: '4',
    author: 'Omar Idrissi',
    avatar: 'https://i.pravatar.cc/150?img=15',
    rating: 4,
    comment: 'Transaction simple et rapide, merci !',
    date: '19 mars 2026',
  },
];

// Calcule la note moyenne (sur 5) à partir de la liste d'avis
export const getAverageRating = (reviews) => {
  if (!reviews.length) return 0;
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return total / reviews.length;
};
