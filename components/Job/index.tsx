import { ReactNode } from 'react';
import { useFormatter, useTranslations } from 'next-intl';
import { Chip } from '@/components/Chip';
import { Text } from '@/components/Text';
import { JobLink } from '../JobLink';

export interface JobProps {
  title: string
  company: string
  startDate: Date
  endDate?: Date
  links?: Array<{
    name: string,
    url: string
  }>
  technologies: Array<string>
  children: ReactNode
}

export function Job({
  title, company, startDate, endDate = undefined, links = undefined, technologies, children,
}: JobProps) {
  const t = useTranslations('career');
  const format = useFormatter();

  const formattedStartDate = format.dateTime(startDate, {
    year: 'numeric',
    month: 'short',
  }).replace('. de', '');

  const formattedEndDate = endDate
    ? format.dateTime(endDate, {
      year: 'numeric',
      month: 'short',
    }).replace('. de', '')
    : t('present');

  return (
    <div className="md:grid md:grid-cols-job md:gap-8">
      <div className="md:text-right mb-2 md:mb-0">
        <Text variant="caption" className="text-auxiliary-500">
          { `${formattedStartDate} — ${formattedEndDate}` }
        </Text>
      </div>

      <div>
        <Text variant="h3" className="text-secondary-500">
          { `${title} @ ${company}` }
        </Text>
        <Text variant="body-2" element="div" className="mt-2 [&>ul]:list-dash [&>ul]:list-inside">
          { children }
        </Text>

        { links && (
          <div className="flex gap-4 mt-4">
            { links.map((link) => (
              <JobLink href={link.url} key={link.url}>
                { link.name }
              </JobLink>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-4">
          { technologies.map((technology) => (
            <Chip key={technology}>{ technology }</Chip>
          ))}
        </div>
      </div>
    </div>
  );
}
