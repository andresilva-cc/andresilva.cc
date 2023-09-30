import { useTranslations } from 'next-intl';
import clsx from 'clsx';
import { Project, ProjectProps } from '@/components/Project';
import { Text } from '@/components/Text';

export default function Projects() {
  const t = useTranslations('projects');

  const projects: Array<ProjectProps> = [
    {
      title: 'andresilva.cc',
      description: t('andresilvacc.description'),
      url: 'https://github.com/andresilva-cc/andresilva.cc',
      featured: true,
      technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    },
    {
      title: 'CustomBurger',
      description: t('customBurger.description'),
      url: 'https://customburger.andresilva.cc/',
      featured: true,
      technologies: ['TypeScript', 'Vue.js', 'Nuxt', 'Tailwind CSS'],
    },
    {
      title: 'Injektion',
      description: t('injektion.description'),
      url: 'https://github.com/andresilva-cc/injektion',
      featured: true,
      technologies: ['TypeScript'],
    },
    {
      title: 'poc-vue-universal-component',
      description: t('pocVueUniversalComponent.description'),
      url: 'https://github.com/andresilva-cc/poc-vue-universal-component',
      featured: false,
      technologies: ['Vue.js'],
    },
    {
      title: 'Express API Template',
      description: t('expressApiTemplate.description'),
      url: 'https://github.com/andresilva-cc/express-api-template',
      featured: false,
      technologies: ['TypeScript', 'Node.js', 'Express', 'Sequelize'],
    },
    {
      title: 'Reflection Function',
      description: t('reflectionFunction.description'),
      url: 'https://github.com/andresilva-cc/reflection-function',
      featured: false,
      technologies: ['TypeScript'],
    },
    {
      title: 'Firebird - Add permissions to multiple databases',
      description: t('firebirdPermissions.description'),
      url: 'https://github.com/andresilva-cc/firebird-add-permissions-to-multiple-databases',
      featured: false,
      technologies: ['Shell Script'],
    },
    {
      title: 'NativeScript Spotify',
      description: t('nativescriptSpotify.description'),
      url: 'https://github.com/Nuxstep/nativescript-plugins/tree/master/packages/nativescript-spotify',
      featured: false,
      technologies: ['TypeScript', 'NativeScript'],
    },
    {
      title: 'Teseu',
      description: t('teseu.description'),
      url: 'https://github.com/andresilva-cc/Teseu-App',
      featured: false,
      technologies: ['Vue.js', 'Nuxt', 'Vuetify', 'NativeScript', 'Sass', 'Node.js', 'Express', 'Sequelize'],
    },
    {
      title: 'OAC - Obstacle Avoiding Car',
      description: t('oac.description'),
      url: 'https://github.com/andresilva-cc/OAC-API',
      featured: false,
      technologies: ['Vue.js', 'Nuxt', 'Konva', 'Vuesax', 'Node.js', 'Express'],
    },
    {
      title: 'Voucher-Printer',
      description: t('voucherPrinter.description'),
      url: 'https://github.com/andresilva-cc/voucher-printer',
      featured: false,
      technologies: ['Node.js', 'Express', 'Pug.js'],
    },
  ];

  const featuredProjects = projects.filter((project) => project.featured);
  const allProjects = projects.filter((project) => !project.featured);

  const gridClasses = 'grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4';

  return (
    <>
      <Text variant="h2-mono" element="h1">
        { t('title') }
      </Text>
      <Text variant="h3" element="h2" className="mt-8">
        { t('featuredProjects') }
      </Text>
      <ul
        className={clsx(
          gridClasses,
          'mt-4',
        )}
      >
        { featuredProjects.map((project) => (
          // eslint-disable-next-line react/no-array-index-key
          <li key={project.title}>
            <Project
              title={project.title}
              description={project.description}
              url={project.url}
              featured={project.featured}
              technologies={project.technologies}
            />
          </li>
        )) }
      </ul>
      <Text variant="h3" element="h2" className="mt-8">
        { t('allProjects') }
      </Text>
      <ul
        className={clsx(
          gridClasses,
          'mt-4',
        )}
      >
        { allProjects.map((project) => (
          // eslint-disable-next-line react/no-array-index-key
          <li key={project.title}>
            <Project
              title={project.title}
              description={project.description}
              url={project.url}
              featured={project.featured}
              technologies={project.technologies}
            />
          </li>
        )) }
      </ul>
    </>
  );
}
