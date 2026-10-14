import React from 'react';
import { useTranslation } from '../i18n';
import { useCms } from '../cms/CmsContext';

export const ArticlesPage = ({ onArticleClick }) => {
  const { t } = useTranslation();
  const { articles, sections } = useCms();
  const home = sections.home_ui || {};
  const visible = (articles || []).filter((article) => article.is_active);

  return (
    <div className="articles-page-root">
      <section className="articles-page-hero">
        <p className="articles-page-kicker">{t(home.articles_label || 'From the course notes')}</p>
        <h1 className="articles-page-title">{t(home.articles_heading || 'Recent articles')}</h1>
        <p className="articles-page-intro">
          {t('Notes from the course: the inner game, hole by hole.')}
        </p>
      </section>
      <section className="articles-page-grid-wrap">
        <div className="articles-card-grid">
          {visible.map((article) => (
            <button
              type="button"
              key={article.id}
              className="figma-article-card articles-page-card"
              onClick={() => onArticleClick?.(article)}
            >
              <div className="article-photo-container">
                <img src={article.image} alt={t(article.title)} loading="lazy" />
              </div>
              <div className="article-text-container">
                {(article.category || article.hole_tag) && (
                  <p className="article-card-meta">
                    {[article.category, article.hole_tag].filter(Boolean).join(' · ')}
                  </p>
                )}
                <h3 className="article-card-title">{t(article.title)}</h3>
                <p className="article-card-desc">{t(article.description)}</p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ArticlesPage;
