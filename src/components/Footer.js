
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-surface text-on-surface-variant pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Contacto Column */}
        <div>
          <h3 className="font-semibold text-on-surface text-lg mb-4">Contacto</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <span className="material-icons-outlined">email</span>
              <a href="mailto:readytowear@gmail.com" className="hover:text-primary transition-colors">readytowear@gmail.com</a>
            </li>
            <li className="flex items-center gap-3">
              <span className="material-icons-outlined">whatsapp</span>
              <a href="https://wa.me/34612345678" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">+34 612 345 678</a>
            </li>
          </ul>
        </div>

        {/* Legal Column */}
        <div>
          <h3 className="font-semibold text-on-surface text-lg mb-4">Legal</h3>
          <ul className="space-y-3">
            <li><Link to="/terms" className="hover:text-primary transition-colors">Términos y Condiciones</Link></li>
            <li><Link to="/privacy" className="hover:text-primary transition-colors">Políticas de Privacidad</Link></li>
            <li><Link to="/returns" className="hover:text-primary transition-colors">Política de Devoluciones</Link></li>
          </ul>
        </div>

        {/* Follow Us Column */}
        <div>
          <h3 className="font-semibold text-on-surface text-lg mb-4">Síguenos</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c-4.01.083-4.514.19-6.104.864A4.848 4.848 0 002.865 6.22c-.673 1.59-.78 2.094-.864 6.104-.083 4.01.031 4.514.864 6.104a4.848 4.848 0 003.355 3.355c1.59.673 2.094.78 6.104.864 4.01-.083 4.514-.19 6.104-.864a4.848 4.848 0 003.355-3.355c.673-1.59.78-2.094.864-6.104.083-4.01-.031-4.514-.864-6.104a4.848 4.848 0 00-3.355-3.355C16.829 2.19 16.325 2.083 12.315 2zm-1.01 1.75a.75.75 0 01.75-.75h.001c4.008.085 4.46.192 5.968.832a3.348 3.348 0 012.518 2.518c.64 1.508.747 1.96.832 5.968a.75.75 0 01-1.5.01c-.084-3.86-.18-4.25-.74-5.63a1.848 1.848 0 00-1.38-1.38c-1.38-.56-1.77-.656-5.63-.74a.75.75 0 01-.75-.75zM12 7a5 5 0 100 10 5 5 0 000-10zm-3.25 5a3.25 3.25 0 116.5 0 3.25 3.25 0 01-6.5 0zM16.5 6a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z" clipRule="evenodd" />
                </svg>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Instagram</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-12 pt-8 border-t border-outline/20 text-center text-sm">
        <p>&copy; 2025 readytowear — All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
