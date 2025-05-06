import { Text } from '@/components/Text';
import { Link } from '@/i18n/routing';
import type { Article as ArticleType } from '@/types/Article';

export interface ArticleProps extends Pick<ArticleType, 'id' | 'title' | 'description' | 'slug'> {
  publishDate: string
}

export function Article({
  id, title, description, publishDate, slug,
}: ArticleProps) {
  const url = `/article/${id}/${slug}`;

  return (
    <div className="md:grid md:grid-cols-job md:gap-8">
      <div className="md:text-right mb-2 md:mb-0">
        <Text variant="caption" className="text-auxiliary-500">
          { publishDate }
        </Text>
      </div>

      <div>
        <Text variant="h3" asChild className="text-secondary-500 hover:text-secondary-400 active:text-secondary-300 transition-colors">
          <Link href={url}>
            { title }
          </Link>
        </Text>
        <Text variant="body-2" element="div" className="mt-2">
          { description }
        </Text>
      </div>
    </div>
  );
}
