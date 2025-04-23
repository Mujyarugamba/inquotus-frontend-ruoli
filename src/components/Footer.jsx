import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ padding: '2rem', backgroundColor: '#f8f9fa', textAlign: 'center' }}>
      <div style={{ marginBottom: '1rem' }}>
        <p>&copy; 2025 Inquotus. Tutti i diritti riservati.</p>
        <p>
          <Link to="/privacy-policy" style={{ marginRight: '1rem' }}>Privacy Policy</Link>
          <Link to="/terms-and-conditions" style={{ marginRight: '1rem' }}>Termini e Condizioni</Link>
          <Link to="/cookie-policy" style={{ marginRight: '1rem' }}>Cookie Policy</Link>
        </p>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <p><strong>Contatti:</strong> support@inquotus.com | Tel: +39 123 456 7890</p>
        <p>Seguici sui social:</p>
        <div>
          <a href="https://www.facebook.com/Inquotus" target="_blank" rel="noopener noreferrer" style={{ marginRight: '1rem' }}>
            <img src="facebook-icon.png" alt="Facebook" style={{ width: '24px' }} />
          </a>
          <a href="https://www.instagram.com/Inquotus" target="_blank" rel="noopener noreferrer" style={{ marginRight: '1rem' }}>
            <img src="instagram-icon.png" alt="Instagram" style={{ width: '24px' }} />
          </a>
          <a href="https://www.linkedin.com/company/Inquotus" target="_blank" rel="noopener noreferrer" style={{ marginRight: '1rem' }}>
            <img src="linkedin-icon.png" alt="LinkedIn" style={{ width: '24px' }} />
          </a>
          <a href="https://www.youtube.com/c/Inquotus" target="_blank" rel="noopener noreferrer" style={{ marginRight: '1rem' }}>
            <img src="youtube-icon.png" alt="YouTube" style={{ width: '24px' }} />
          </a>
          <a href="https://www.google.com/business/Inquotus" target="_blank" rel="noopener noreferrer" style={{ marginRight: '1rem' }}>
            <img src="google-my-business-icon.png" alt="Google My Business" style={{ width: '24px' }} />
          </a>
        </div>
      </div>
      <div>
        <p><strong>Sicurezza dei Dati Personali:</strong> La piattaforma Inquotus adotta misure avanzate per proteggere i tuoi dati personali e di pagamento. Scopri di più nella nostra <Link to="/privacy-policy">Privacy Policy</Link>.</p>
      </div>
    </footer>
  );
};

export default Footer;
