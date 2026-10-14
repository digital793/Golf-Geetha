import React from 'react';
import { useTranslation } from '../i18n';
import { useCms } from '../cms/CmsContext';

export const ArticlesSection = ({ onArticleClick, onNavigate }) => {
  const { t } = useTranslation();
  const { articles, sections } = useCms();
  const home = sections.home_ui || {};
  const visibleArticles = (articles || []).filter((article) => article.is_active);
  return (
    <section className="figma-articles-section" id="articles">
      <div className="articles-main-container">
        <div className="articles-top-header">
          <div>
            {home.articles_label ? <p className="articles-kicker">{t(home.articles_label)}</p> : null}
            <h2 className="articles-heading-title">{t(home.articles_heading || 'Recent articles')}</h2>
          </div>
          <a
            href="/articles"
            className="articles-view-all-link"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('articles');
              else onArticleClick?.(visibleArticles[0]);
            }}
          >
            {t(home.articles_link || 'All articles →')}
          </a>
        </div>

        {/* 3 Article Cards */}
        <div className="articles-card-grid">
          {visibleArticles.map((article) => (
            <div
              key={article.id}
              className="figma-article-card"
              onClick={() => onArticleClick?.(article)}
              style={{ cursor: 'pointer' }}
            >
              <div className="article-photo-container">
                <img
                  src={article.image}
                  alt={t(article.title)}
                  loading="lazy"
                />
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
