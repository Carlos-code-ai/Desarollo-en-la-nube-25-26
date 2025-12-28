
/**
 * Adapts raw suit data from Firebase to a consistent, predictable object structure
 * that the rest of the application can reliably use.
 * This prevents crashes and visual bugs from inconsistent field names.
 *
 * @param {object} suit - The raw suit object from Firebase.
 * @param {string} id - The Firebase key for the suit, used as its ID.
 * @returns {object|null} A standardized suit object or null if the input is invalid.
 */
export const adaptSuitData = (suit, id) => {
  if (!suit || typeof suit !== 'object') return null;

  // --- Base Structure ---
  const adaptedSuit = {
    id: id,
    name: suit.name || suit.nombre || 'Traje sin Nombre',
    price: suit.price || suit.precio || 0,
    size: suit.size || suit.talla || 'Talla Única',
    imageUrls: suit.imageUrls || suit.fotos || suit.imagenes || (suit.imageUrl ? [suit.imageUrl] : []),
    description: suit.description || '',
    createdAt: suit.createdAt || 0,
    ownerId: suit.ownerId || suit.propietarioId || suit.usuario || null,
    availability: suit.availability || [],
    location: suit.location || suit.ciudad || '',
  };

  // --- Data Sanitization and Type Coercion ---

  // Ensure price is a clean number
  if (typeof adaptedSuit.price === 'string') {
    adaptedSuit.price = parseFloat(adaptedSuit.price.replace(',', '.').trim());
  }
  if (isNaN(adaptedSuit.price)) {
    adaptedSuit.price = 0;
  }

  // Ensure imageUrls is an array and has a placeholder if empty
  if (!Array.isArray(adaptedSuit.imageUrls)) {
      adaptedSuit.imageUrls = [];
  }
  if (adaptedSuit.imageUrls.length === 0) {
      adaptedSuit.imageUrls.push('https://via.placeholder.com/400x500.png?text=Sin+Imagen');
  }

  return adaptedSuit;
};
