
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
    price: suit.price || suit.precioDia || suit.precio || 0,
    size: suit.size || suit.talla || 'Talla Única',
    imageUrls: suit.imagenes || (suit.imageUrl ? [suit.imageUrl] : suit.imageUrls || suit.fotos || []),
    description: suit.description || suit.descripcion || '',
    createdAt: suit.createdAt || suit.timestamp || 0,
    ownerId: suit.ownerId || suit.propietarioId || suit.usuario || null,
    location: suit.location || suit.ciudad || '',
    // FIX: Recognize all common variations for availability: `availability`, `isAvailable`, `disponibilidad`
    availability: suit.availability !== undefined ? suit.availability : (suit.isAvailable !== undefined ? suit.isAvailable : suit.disponibilidad),
    ...suit, // Pass through any other fields to be safe
  };

  // --- Data Sanitization and Type Coercion ---

  // Ensure price is a clean number
  if (typeof adaptedSuit.price === 'string') {
    adaptedSuit.price = parseFloat(adaptedSuit.price.replace(',', '.').trim());
  }
  if (isNaN(adaptedSuit.price)) {
    adaptedSuit.price = 0;
  }

  // Ensure imageUrls is an array. If it's empty after trying all sources, add a placeholder.
  if (!Array.isArray(adaptedSuit.imageUrls) || adaptedSuit.imageUrls.length === 0) {
      adaptedSuit.imageUrls = ['https://via.placeholder.com/400x500.png?text=Sin+Imagen'];
  }

  return adaptedSuit;
};
