import { getLocale, getTranslations } from 'next-intl/server';

import { Article } from '@/components/Article';
import { Text } from '@/components/Text';
import { useRepositories } from '@/hooks/useRepositories';
import { Info } from '@phosphor-icons/react/dist/ssr/index';

export async function generateMetadata() {
  const t = await getTranslations();

  return {
    title: `${t('articles.title')} | André Silva`,
  };
}

export default async function Articles() {
  const t = await getTranslations();
  const locale = await getLocale();

  const { articlesRepository } = useRepositories();
  const articles = await articlesRepository.getAll();

  return (
    <>
      <div className="pl-4">
        <Text variant="h2-mono" element="h1">
          { t('articles.title') }
        </Text>

        { locale !== 'en' && (
        <div className="flex gap-2 mt-4 text-auxiliary-500">
          <Info size={18} weight="bold" />
          <Text variant="body-2">
            { t('articles.englishOnly') }
          </Text>
        </div>
        )}
      </div>
      <ul className="flex flex-col gap-4 mt-6">
        { articles.map((article) => (
          <li key={article.id}>
            <Article
              title={article.title}
              publishedAt={article.published_at}
              readingTime={article.reading_time_minutes}
              commentsCount={article.comments_count}
              reactionsCount={article.public_reactions_count}
              url={article.url}
              tags={article.tag_list}
            />
          </li>
        )) }
      </ul>
    </>
  );
}
