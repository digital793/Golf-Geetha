import React from 'react';
import { X, ArrowRight } from 'lucide-react';
import { useTranslation } from '../i18n';
import { useCms } from '../cms/CmsContext';
import { trackPlatformClick } from '../cms/tracking';

export const WhereToBuyModal = ({ isOpen, onClose, page = 'unknown' }) => {
  const { t } = useTranslation();
  const { platforms, sections } = useCms();
  if (!isOpen) return null;

  const stores = (platforms || []).filter((store) => store.is_active);
  const modal = sections.buy_modal || {};

  return (
    <div
      className="modal-overlay where-to-buy-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="where-to-buy-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Row */}
        <div className="where-to-buy-header">
          <h3 className="where-to-buy-title">{t(modal.title)}</h3>
          <button
            className="where-to-buy-close-btn"
            onClick={onClose}
            aria-label={t('Close modal')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Retailer Cards List */}
        <div className="where-to-buy-list">
          {stores.map((store) => (
            <div key={store.slug} className="retailer-row-card">
              {/* Store Icon */}
              <div className="retailer-icon-wrap">
                <img
                  src={store.icon}
                  alt={store.name}
                  className="retailer-logo-img"
                />
              </div>

              {/* Store Info */}
              <div className="retailer-info-col">
                <h4 className="retailer-name-title">{store.name}</h4>
                <p className="retailer-formats-desc">{store.formats}</p>
              </div>

              {/* Action Button */}
              <div className="retailer-action-col">
                <a
                  href={store.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-retailer-buy"
                  onClick={() => trackPlatformClick(store.slug, 'modal', page)}
                >
                  <span>{t(modal.cta)}</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhereToBuyModal;
