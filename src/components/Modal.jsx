import React from 'react';
import { X } from 'lucide-react';
import { useTranslation } from '../i18n';

export const Modal = ({ isOpen, onClose, title, children }) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label={t('Close modal')}>
          <X size={22} />
        </button>

        {title && (
          <h3
            style={{
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: '22px',
              color: '#39194C',
              marginBottom: '1rem',
              textTransform: 'uppercase'
            }}
          >
            {title}
          </h3>
        )}

        <div style={{ color: '#4a443d', fontSize: '1.05rem', lineHeight: '1.6' }}>
          {children}
        </div>
      </div>
    </div>
  );
};
