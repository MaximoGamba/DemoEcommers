import { useState, useEffect } from 'react';
import ropa4 from '../assets/ropa4.webp';
import ropa5 from '../assets/ropa5.jfif';
import ropa6 from '../assets/ropa6.webp';
import './ImageCarousel.css';

const images = [
  {
    src: ropa4,
    title: 'Moda Masculina',
    subtitle: 'Estilo y elegancia para el hombre moderno'
  },
  {
    src: ropa5,
    title: 'Colección Premium',
    subtitle: 'Calidad y diseño en cada prenda'
  },
  {
    src: ropa6,
    title: 'Tendencias 2024',
    subtitle: 'Descubrí las últimas tendencias en moda'
  }
];

function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play del carrusel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="image-carousel">
      <div className="carousel-container">
        {images.map((image, index) => (
          <div
            key={index}
            className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${image.src})` }}
          >
            <div className="carousel-overlay"></div>
            <div className="carousel-content">
              <h2 className="carousel-title">{image.title}</h2>
              <p className="carousel-subtitle">{image.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Flechas de navegación */}
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

      {/* Indicadores */}
      <div className="carousel-indicators">
        {images.map((_, index) => (
          <button
            key={index}
            className={`carousel-indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Ir a imagen ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default ImageCarousel;









