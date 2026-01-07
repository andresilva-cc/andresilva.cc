import { Article } from '@/components/Article';
import { Text } from '@/components/Text';
import { useRepositories } from '@/hooks/useRepositories';

export const metadata = {
  title: 'Articles | Andre Silva',
};

export default async function Articles() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { articlesRepository } = useRepositories();
  const articles = await articlesRepository.getAll();

  return (
    <>
      <div className="pl-4">
        <Text variant="h2-mono" element="h1">
          Articles
        </Text>
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
