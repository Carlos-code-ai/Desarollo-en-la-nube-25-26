
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hook personalizado para aplicar animaciones de entrada escalonadas
 * a las tarjetas de los trajes en el catálogo cuando el usuario hace scroll.
 */
const useSuitAnimations = () => {
  useGSAP(() => {
    // Seleccionamos todas las tarjetas de trajes
    const suitCards = gsap.utils.toArray('.suit-card');

    if (suitCards.length === 0) return;

    // Animación de entrada para cada tarjeta
    gsap.from(suitCards, {
      opacity: 0,       // Empiezan invisibles
      y: 50,            // Ligeramente desplazadas hacia abajo
      duration: 0.6,    // Duración de la animación
      ease: 'power3.out', // Curva de easing para una transición suave
      stagger: 0.15,    // Retraso entre la animación de cada tarjeta
      scrollTrigger: {
        trigger: '.grid', // El contenedor de las tarjetas actúa como disparador
        start: 'top 80%', // La animación empieza cuando el 80% superior del grid entra en el viewport
        toggleActions: 'play none none none', // Solo se ejecuta una vez al entrar
      },
    });

  }, { dependencies: [] }); // El array vacío asegura que solo se ejecute una vez
};

export default useSuitAnimations;
