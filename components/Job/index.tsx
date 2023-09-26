import { ReactNode } from 'react';
import { Chip } from '@/components/Chip';
import { Text } from '@/components/Text';
import { toMonthYear } from '@/utils/date';
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
  return (
    <div className="sm:grid md:grid md:grid-cols-12 md:gap-8">
      <div className="md:col-span-3 lg:col-span-2 md:text-right mb-2 md:mb-0">
        <Text variant="caption" className="text-auxiliary-500">
          { `${toMonthYear(startDate)} — ${endDate ? toMonthYear(endDate) : 'Present'}` }
        </Text>
      </div>

      <div className="md:col-span-9 lg:col-span-10">
        <Text variant="h3" className="text-secondary-500">
          { `${title} @ ${company}` }
        </Text>
        <Text variant="body-2" asChild className="mt-2 list-dash list-inside">
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
