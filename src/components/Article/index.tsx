import {
  CalendarBlank, CaretDoubleRight, ChatCircleDots, Clock, Heart,
} from '@phosphor-icons/react/dist/ssr';

import { Text } from '@/components/Text';
import type { Article as ArticleType } from '@/types/Article';
import { useFormatter, useTranslations } from 'next-intl';
import { Chip } from '../Chip';

export interface ArticleProps {
  title: ArticleType['title']
  publishedAt: ArticleType['published_at']
  readingTime: ArticleType['reading_time_minutes']
  commentsCount: ArticleType['comments_count']
  reactionsCount: ArticleType['public_reactions_count']
  url: ArticleType['url']
  tags: ArticleType['tag_list']
}

export function Article({
  title, readingTime, publishedAt, commentsCount, reactionsCount, url, tags,
}: ArticleProps) {
  const t = useTranslations();

  const format = useFormatter();
  const formattedPublishedAt = format.dateTime(new Date(publishedAt), {
    dateStyle: 'short',
  });

  return (
    <a
      href={url}
      target="_blank"
      className="group flex flex-col gap-2 p-4 rounded-lg bg-primary-300/0 hover:bg-primary-300/5 active:bg-primary-300/10 select-none transition-colors hover:transition-none duration-300"
    >
      <Text
        variant="h3"
        className="text-secondary-500 hover:text-secondary-400 active:text-secondary-300 transition-colors"
      >
        { title }
      </Text>

      <Text
        variant="body-2"
        element="div"
        className="flex flex-wrap leading-[13px] gap-x-6 md:gap-x-8"
      >
        <div className="flex gap-2 items-center">
          <CalendarBlank weight="bold" size={16} />
          { formattedPublishedAt }
        </div>

        <div className="flex gap-2 items-center">
          <Clock weight="bold" size={16} />
          <span className="hidden md:inline">
            { t('articles.readingTime', { minutes: readingTime }) }
          </span>
          <span className="md:hidden">
            { readingTime }
            {' '}
            min
          </span>
        </div>

        <div className="flex gap-2 items-center">
          <ChatCircleDots weight="bold" size={16} />
          <span className="hidden md:inline">
            { t('articles.comments', { count: commentsCount }) }
          </span>
          <span className="md:hidden">
            { commentsCount }
          </span>
        </div>

        <div className="flex gap-2 items-center">
          <Heart weight="bold" size={16} />
          <span className="hidden md:inline">
            { t('articles.reactions', { count: reactionsCount }) }
          </span>
          <span className="md:hidden">
            { reactionsCount }
          </span>
        </div>
      </Text>

      <div className="flex flex-wrap gap-2 mt-2">
        { tags.map((tag) => (
          <Chip key={tag}>{ tag }</Chip>
        ))}
      </div>

      <Text
        variant="caption"
        className="flex gap-2 items-center mt-4 text-auxiliary-500 group-hover:translate-x-1 transition-transform"
      >
        { t('articles.readOn') }
        {' '}
        dev.to
        <CaretDoubleRight weight="bold" size={14} />
      </Text>
    </a>
  );
}
