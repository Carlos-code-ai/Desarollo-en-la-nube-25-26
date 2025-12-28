import React from 'react';

const Footer = () => {
  const legalUrl = "https://es.wikipedia.org/wiki/Cookie_(inform%C3%A1tica)";
  const gmailUrl = "https://mail.google.com/mail/?view=cm&fs=1&to=readytowear@gmail.com";

  return (
    <footer className="bg-blue-900 text-gray-300 pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Contacto Column */}
        <div>
          <h3 className="font-semibold text-white text-lg mb-4">Contacto</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <span className="material-icons-outlined">Email</span>
              <a href={gmailUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">readytowear@gmail.com</a>
            </li>
            <li className="flex items-center gap-3">
              <span className="material-icons-outlined">Whatsapp</span>
              <a href="https://wa.me/34612345678" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">+34 612 345 678</a>
            </li>
          </ul>
        </div>

        {/* Legal Column */}
        <div>
          <h3 className="font-semibold text-white text-lg mb-4">Legal</h3>
          <ul className="space-y-3">
            <li><a href={legalUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Términos y Condiciones</a></li>
            <li><a href={legalUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Políticas de Privacidad</a></li>
            <li><a href={legalUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Política de Cookies</a></li>
          </ul>
        </div>

        {/* Social Media Column */}
        <div>
          <h3 className="font-semibold text-white text-lg mb-4">Redes Sociales</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Facebook</a>
          </div>
        </div>

      </div>
      <div className="mt-12 text-center text-gray-400 border-t border-gray-700 pt-8">
        <p>&copy; {new Date().getFullYear()} Ready2Wear. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
