import { getTranslations } from 'next-intl/server';

import { Article } from '@/components/Article';
import { Text } from '@/components/Text';
import { useRepositories } from '@/hooks/useRepositories';

export async function generateMetadata() {
  const t = await getTranslations();

  return {
    title: `${t('articles.title')} | André Silva`,
  };
}

export default async function Articles() {
  const t = await getTranslations();
  const { articlesRepository } = useRepositories();
  const articles = await articlesRepository.getAll();

  return (
    <>
      <div className="md:grid md:grid-cols-job md:gap-8">
        <Text variant="h2-mono" element="h1" className="col-start-2">
          { t('articles.title') }
        </Text>
      </div>
      <ul className="flex flex-col gap-8 mt-8">
        { articles.map((article) => (
          <li key={article.id}>
            <Article
              id={article.id}
              title={article.title}
              description={article.description}
              publishDate={article.readable_publish_date}
              slug={article.slug}
            />
          </li>
        )) }
      </ul>
    </>
  );
}
