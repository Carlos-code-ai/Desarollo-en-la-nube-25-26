import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

const useSuitAnimations = () => {
  // 1. Crear una referencia para el contenedor de la grid
  const containerRef = useRef(null);

  useGSAP(() => {
    // Si el contenedor no existe, no hacemos nada.
    if (!containerRef.current) return;

    // Animación de entrada para las tarjetas dentro del contenedor
    gsap.from(".suit-card", { // La clase target sigue siendo la misma
      opacity: 0,
      y: 50,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.15,
      scrollTrigger: {
        // 2. Usar la referencia directa como disparador para máxima precisión
        trigger: containerRef.current,
        start: 'top 85%', // Ajustamos ligeramente el inicio para mejor visibilidad
        toggleActions: 'play none none none',
      },
    });

  // 3. El scope y las dependencias aseguran que GSAP se ejecute en el contexto correcto
  }, { scope: containerRef, dependencies: [] });

  // 4. Devolver la referencia para que el componente la pueda usar
  return { containerRef };
};

export default useSuitAnimations;
