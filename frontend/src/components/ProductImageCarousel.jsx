import { useState, useEffect } from 'react';
import './ProductImageCarousel.css';

function ProductImageCarousel({ imagenes, imagenPrincipal }) {
  // Combinar imagen principal con imágenes adicionales
  const allImages = [];
  
  // Si hay imagen principal, agregarla primero
  if (imagenPrincipal) {
    allImages.push({
      url: imagenPrincipal,
      descripcion: 'Imagen principal',
      esPrincipal: true
    });
  }
  
  // Agregar imágenes adicionales ordenadas por orden
  if (imagenes && imagenes.length > 0) {
    const sortedImages = [...imagenes].sort((a, b) => (a.orden || 0) - (b.orden || 0));
    allImages.push(...sortedImages);
  }
  
  // Si no hay imágenes, usar placeholder
  if (allImages.length === 0) {
    allImages.push({
      url: 'https://via.placeholder.com/400x500?text=Sin+imagen',
      descripcion: 'Sin imagen',
      esPrincipal: false
    });
  }

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [imagenes, imagenPrincipal]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? allImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === allImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (allImages.length === 1) {
    return (
      <div className="product-image-carousel">
        <div className="carousel-single-image">
          <img
            src={allImages[0].url}
            alt={allImages[0].descripcion || 'Producto'}
            className="product-carousel-image"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="product-image-carousel">
      <div className="carousel-container">
        {allImages.map((image, index) => (
          <div
            key={index}
            className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
          >
            <img
              src={image.url}
              alt={image.descripcion || `Imagen ${index + 1}`}
              className="product-carousel-image"
            />
          </div>
        ))}
      </div>
      
      {allImages.length > 1 && (
        <>
          <button 
            className="carousel-arrow carousel-arrow-left"
            onClick={goToPrevious}
            aria-label="Imagen anterior"
          >
            ‹
          </button>
          <button 
            className="carousel-arrow carousel-arrow-right"
            onClick={goToNext}
            aria-label="Imagen siguiente"
          >
            ›
          </button>
          
          <div className="carousel-indicators">
            {allImages.map((_, index) => (
              <button
                key={index}
                className={`carousel-indicator ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>
          
          <div className="carousel-thumbnails">
            {allImages.map((image, index) => (
              <button
                key={index}
                className={`carousel-thumbnail ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={image.descripcion || `Imagen ${index + 1}`}
              >
                <img
                  src={image.url}
                  alt={image.descripcion || `Miniatura ${index + 1}`}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ProductImageCarousel;









