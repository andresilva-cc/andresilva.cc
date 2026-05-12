import { Article } from '@/components/article';
import { Text } from '@/components/text';
import { getRepositories } from '@/repositories';

export const metadata = {
  title: 'Articles | André Silva',
};

export default async function Articles() {
  const { articlesRepository } = getRepositories();
  const articles = await articlesRepository.getAll();

  return (
    <>
      <div className="pl-4">
        <Text variant="h1" as="h1">
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
