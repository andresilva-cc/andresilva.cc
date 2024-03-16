import { useFormatter } from 'next-intl';
import { Text } from '@/components/Text';
import { Link } from '@/navigation';

export interface ArticleProps {
  id: number,
  title: string,
  slug: string,
  summary: string,
  postedAt: Date
}

export function Article({
  id, title, slug, summary, postedAt,
}: ArticleProps) {
  const format = useFormatter();

  const formattedPostedAt = format.dateTime(postedAt, {
    dateStyle: 'long',
  });

  return (
    <Link
      href={`/articles/${id}/${slug}`}
      className="block group p-4 rounded-lg bg-primary-300 bg-opacity-0 hover:bg-opacity-5 active:bg-opacity-10 transition-colors hover:transition-none duration-300"
    >
      <div className="md:flex md:justify-between">
        <Text variant="h3" className="text-secondary-500 group-hover:text-secondary-400 group-active:text-secondary-300">{ title }</Text>
        <Text variant="caption" className="block mt-1 md:mt-0 text-auxiliary-500">{ formattedPostedAt }</Text>
      </div>
      <Text variant="body-2" className="mt-2">{ summary }</Text>
    </Link>
  );
}
