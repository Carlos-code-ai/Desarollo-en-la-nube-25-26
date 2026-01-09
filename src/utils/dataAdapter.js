// ../utils/dataAdapter.js

const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNnB4IiBmaWxsPSIjY2NjIj5TaW4gSW1hZ2VuPC90ZXh0Pjwvc3ZnPg==";

const toFirebaseStorageUrl = (fileName) => {
  if (!fileName || typeof fileName !== 'string' || fileName.startsWith('http')) {
    return fileName;
  }
  const bucket = "desarollogit-68916509-89c54.appspot.com";
  return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/images%2F${encodeURIComponent(fileName)}?alt=media`;
};

export const adaptSuitData = (suitData, suitId) => {
  if (!suitData || typeof suitData !== 'object') return null;

  let rawImageSources = [];
  if (Array.isArray(suitData.fotos) && suitData.fotos.length > 0) rawImageSources = suitData.fotos;
  else if (Array.isArray(suitData.imagenes) && suitData.imagenes.length > 0) rawImageSources = suitData.imagenes;
  else if (Array.isArray(suitData.imageUrls) && suitData.imageUrls.length > 0) rawImageSources = suitData.imageUrls;
  else if (typeof suitData.imageUrl === 'string' && suitData.imageUrl) rawImageSources = [suitData.imageUrl];
  else if (typeof suitData.foto === 'string' && suitData.foto) rawImageSources = [suitData.foto];

  const processedImageUrls = rawImageSources
    .map(src => toFirebaseStorageUrl(src))
    .filter(Boolean);

  const finalImageUrls = processedImageUrls.length > 0
    ? processedImageUrls
    : [placeholderImage];

  const mainImageUrl = finalImageUrls[0];

  let priceNum = 0;
  if (suitData.precio !== undefined) priceNum = Number(suitData.precio);
  else if (suitData.price !== undefined) priceNum = Number(suitData.price);
  if (typeof priceNum === 'string') priceNum = parseFloat(priceNum.replace(',', '.'));
  if (!Number.isFinite(priceNum)) priceNum = 0;

  const name = suitData.nombre || suitData.name || suitData.titulo || 'Traje sin Nombre';
  const size = suitData.talla || suitData.size || 'Talla Única';

  const adapted = {
    name: name,
    price: priceNum,
    imageUrl: mainImageUrl, 
    imageUrls: finalImageUrls, 
    createdAt: suitData.createdAt || suitData.timestamp || null,
    suitName: name,
    totalPrice: priceNum,
    suitImageUrl: mainImageUrl,
    description: suitData.descripcion || suitData.description || '',
    size: size,
    availability: suitData.disponibilidad !== undefined ? suitData.disponibilidad : true,
    ownerId: suitData.propietarioId || suitData.usuario || suitData.ownerId || null,
    brand: suitData.marca || '',
    location: suitData.ciudad || suitData.location || '',
  };

  // Ensure the ID is always attached
  return { ...adapted, id: suitId };
};
