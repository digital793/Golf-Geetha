import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { useCms } from '../cms/CmsContext';

export const DiscoverPage = () => {
  const { t } = useTranslation();
  const { sections, lists } = useCms();
  const page = sections.discover || {};
  const options = lists.quiz_options || [];
  const [selected, setSelected] = useState('');
  const [done, setDone] = useState(false);

  return (
    <div className="discover-page-root">
      <section className="discover-hero">
        <p className="discover-kicker">{t(page.kicker)}</p>
        <p className="discover-progress">{t(page.progress)}</p>
        <h1 className="discover-question">{t(page.question)}</h1>

        {!done ? (
          <>
            <div className="discover-options">
              {options.map((item) => (
                <button
                  key={item.id || item.title}
                  type="button"
                  className={`discover-option ${selected === item.title ? 'is-selected' : ''}`}
                  onClick={() => setSelected(item.title)}
                >
                  {t(item.title)}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="discover-next"
              disabled={!selected}
              onClick={() => setDone(true)}
            >
              {t(page.next)}
            </button>
          </>
        ) : (
          <p className="discover-coming-soon">{t(page.coming_soon)}</p>
        )}
      </section>
    </div>
  );
};

export default DiscoverPage;
