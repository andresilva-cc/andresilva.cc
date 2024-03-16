import { useTranslations } from 'next-intl';
import { EnglishOnly } from '@/components/EnglishOnly';
import { Article } from '@/components/Article';
import { Text } from '@/components/Text';
import { useRepositories } from '@/hooks/useRepositories';

export default function Articles() {
  const t = useTranslations();
  const { articlesRepository } = useRepositories(t);
  const articles = articlesRepository.getAll();

  return (
    <>
      <Text variant="h2-mono" element="h1">
        { t('articles.title') }
      </Text>
      <EnglishOnly className="mt-4">
        Os artigos estão disponíveis apenas em inglês
      </EnglishOnly>
      <ul className="mt-4 flex flex-col gap-2">
        { articles.map((article) => (
          <li key={article.id}>
            <Article
              id={article.id}
              title={article.title}
              slug={article.slug}
              summary={article.summary}
              postedAt={article.postedAt}
            />
          </li>
        )) }
      </ul>
    </>
  );
}
