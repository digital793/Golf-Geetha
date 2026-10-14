import React from 'react';
import { useTranslation } from '../i18n';
import { useCms } from '../cms/CmsContext';

export const AuthorPage = ({ onNavigate }) => {
  const { t } = useTranslation();
  const { sections } = useCms();
  const author = sections.author || {};

  return (
    <div className="author-page-root">
      <div className="author-page-inner">
        <div className="author-media-col">
          <div className="author-portrait-wrap">
            <img
              src={author.photo}
              alt={t('Nazeer Tajudeen, author of Golf Gita')}
              className="author-portrait-img"
              loading="eager"
            />
          </div>
        </div>

        <div className="author-info-col">
          <h1 className="author-name-title">{author.name}</h1>

          <div className="author-bio-body">
            <p>
              {t(author.bio_1)}
            </p>
            <p>
              {t(author.bio_2)}
            </p>
            <p>
              {t(author.bio_3)}
            </p>
          </div>

          <blockquote className="author-pull-quote">
            “{t(author.quote)}”
          </blockquote>

          <div className="author-action-wrap">
            <button
              className="btn-author-enquire"
              onClick={() => {
                if (onNavigate) onNavigate('speaking');
              }}
            >
              <span>{t(author.cta)}</span>
              <span className="author-gold-dot" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorPage;
