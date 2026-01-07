import { ReactNode } from 'react';
import { Chip } from '@/components/chip';
import { Link } from '@/components/link';
import { Text } from '@/components/text';

export interface JobProps {
  title: string;
  company: string;
  startDate: Date;
  endDate?: Date;
  links?: Array<{
    name: string;
    url: string;
  }>;
  technologies: Array<string>;
  children: ReactNode;
}

export function Job({
  title, company, startDate, endDate = undefined, links = undefined, technologies, children,
}: JobProps) {
  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
  });

  const formattedStartDate = dateFormatter.format(startDate);
  const formattedEndDate = endDate ? dateFormatter.format(endDate) : 'Present';

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
              <Link href={link.url} key={link.url}>
                { link.name }
              </Link>
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
