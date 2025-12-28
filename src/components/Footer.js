import React from 'react';

// --- SVG Icons ---
// Using fixed, high-quality SVG icons for brand consistency.

const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
    </svg>
);

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.269.655 4.357 1.849 6.081l-1.214 4.439 4.545-1.185zM9.352 8.399c-.166-.278-.591-.38-.962-.38-.346 0-.58.011-.793.023-.27.014-.654.12-.99.46-.464.444-.752 1.011-.752 1.742 0 .74.323 1.385.442 1.58.118.195.234.331.474.582.479.508 1.154 1.217 2.149 2.11.815.722 1.636 1.173 2.122 1.446.484.273.85.344 1.125.312.322-.037.491-.188.653-.368.163-.178.502-.58.649-.809.147-.229.294-.368.413-.463.118-.095.21-.13.306-.13.095 0 .233.014.346.041.114.027.271.114.473.233.201.118.322.19.428.318.105.127.147.25.147.385s.011.512-.023.639c-.035.126-.201.252-.428.368-.227.117-1.137.53-1.322.591-.346.118-.664.163-.92.163-.647 0-1.249-.228-1.676-.591-.58-.507-1.229-1.136-1.956-1.986-.828-.934-1.428-1.944-1.788-2.614-.359-.67-.166-1.168-.111-1.31z" />
    </svg>
);

const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="url(#instagram-gradient)" viewBox="0 0 24 24">
        <defs>
            <radialGradient id="instagram-gradient" cx="0.3" cy="1" r="1">
                <stop offset="0%" stopColor="#FFD600" />
                <stop offset="50%" stopColor="#FF7A00" />
                <stop offset="100%" stopColor="#D62976" />
            </radialGradient>
        </defs>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.441 1.441 1.441 1.441-.645 1.441-1.441-.645-1.44-1.441-1.44z"/>
    </svg>
);

const Footer = () => {
  const legalUrl = "https://es.wikipedia.org/wiki/Cookie_(inform%C3%A1tica)";
  const gmailUrl = "https://mail.google.com/mail/?view=cm&fs=1&to=readytowear@gmail.com";
  const instagramUrl = "https://www.instagram.com/ready2wear";
  const whatsappUrl = "https://wa.me/34612345678"; // Replace with your number

  const SocialLink = ({ href, icon, label }) => (
    <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="flex items-center gap-3 text-on-surface-variant hover:text-primary transition-colors duration-200 group"
    >
        {icon}
        <span className="group-hover:underline">{label}</span>
    </a>
  );

  return (
    <footer className="bg-blue-900/40 text-on-surface-variant pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Contacto & Social */}
        <div>
          <h3 className="font-semibold text-on-surface text-lg mb-6">Contacto</h3>
          <ul className="space-y-4">
            <li><SocialLink href={gmailUrl} icon={<MailIcon />} label="readytowear@gmail.com" /></li>
            <li><SocialLink href={whatsappUrl} icon={<WhatsAppIcon />} label="+34 612 345 678" /></li>
            <li><SocialLink href={instagramUrl} icon={<InstagramIcon />} label="@ready2wear" /></li>
          </ul>
        </div>

        {/* Legal Column */}
        <div>
          <h3 className="font-semibold text-on-surface text-lg mb-6">Legal</h3>
          <ul className="space-y-4">
            <li><a href={legalUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline transition-colors">Términos y Condiciones</a></li>
            <li><a href={legalUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline transition-colors">Políticas de Privacidad</a></li>
            <li><a href={legalUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline transition-colors">Política de Cookies</a></li>
          </ul>
        </div>

        {/* About Column */}
        <div>
            <h3 className="font-semibold text-on-surface text-lg mb-6">Sobre Nosotros</h3>
            <p className="text-sm">
                Revolucionando la forma en que accedes a la moda. Alquila trajes de alta calidad para cualquier evento, de forma sostenible y económica.
            </p>
        </div>

      </div>
      <div className="mt-16 text-center text-on-surface-variant/70 border-t border-outline/20 pt-8">
        <p>&copy; {new Date().getFullYear()} Ready2Wear. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
