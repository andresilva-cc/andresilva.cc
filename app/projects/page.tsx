import clsx from 'clsx';
import { Project, ProjectProps } from '@/components/Project';
import { Text } from '@/components/Text';

const projects: Array<ProjectProps> = [
  {
    title: 'andresilva.cc',
    description: 'The personal website that you are seeing right now',
    url: 'https://github.com/andresilva-cc/andresilva.cc',
    featured: true,
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
  },
  {
    title: 'CustomBurger',
    description: 'A small project where you can build your own burger :)',
    url: 'https://customburger.andresilva.cc/',
    featured: true,
    technologies: ['TypeScript', 'Vue.js', 'Nuxt', 'Tailwind CSS'],
  },
  {
    title: 'Injektion',
    description: 'Decorator-less dependency injection for JavaScript and TypeScript',
    url: 'https://github.com/andresilva-cc/injektion',
    featured: true,
    technologies: ['TypeScript'],
  },
  {
    title: 'poc-vue-universal-component',
    description: 'Proof of Concept of Universal Components in Vue.js',
    url: 'https://github.com/andresilva-cc/poc-vue-universal-component',
    featured: false,
    technologies: ['Vue.js'],
  },
  {
    title: 'Express API Template',
    description: 'An always evolving project template for creating APIs using Express, TypeScript, and Sequelize',
    url: 'https://github.com/andresilva-cc/express-api-template',
    featured: false,
    technologies: ['TypeScript', 'Node.js', 'Express', 'Sequelize'],
  },
  {
    title: 'Reflection Function',
    description: 'Function reflection for JavaScript and TypeScript',
    url: 'https://github.com/andresilva-cc/reflection-function',
    featured: false,
    technologies: ['TypeScript'],
  },
  {
    title: 'Firebird - Add permissions to multiple databases',
    description: 'A script that add permissions to multiple Firebird databases',
    url: 'https://github.com/andresilva-cc/firebird-add-permissions-to-multiple-databases',
    featured: false,
    technologies: ['Shell Script'],
  },
  {
    title: 'NativeScript Spotify',
    description: 'Integrate Spotify App Remote SDK into your NativeScript app',
    url: 'https://github.com/Nuxstep/nativescript-plugins/tree/master/packages/nativescript-spotify',
    featured: false,
    technologies: ['TypeScript', 'NativeScript'],
  },
  {
    title: 'Teseu',
    description: 'A collaborative application for notification of criminal occurrences in real-time',
    url: 'https://github.com/andresilva-cc/Teseu-App',
    featured: false,
    technologies: ['Vue.js', 'Nuxt', 'Vuetify', 'NativeScript', 'Sass', 'Node.js', 'Express', 'Sequelize'],
  },
  {
    title: 'OAC - Obstacle Avoiding Car',
    description: 'An application where you instruct an Artificial Neural Network to drive a car while avoiding obstacles',
    url: 'https://github.com/andresilva-cc/OAC-API',
    featured: false,
    technologies: ['Vue.js', 'Nuxt', 'Konva', 'Vuesax', 'Node.js', 'Express'],
  },
  {
    title: 'Voucher-Printer',
    description: 'Hotspot voucher printer via MikroTik RouterBoard API',
    url: 'https://github.com/andresilva-cc/voucher-printer',
    featured: false,
    technologies: ['Node.js', 'Express', 'Pug.js'],
  },
];

export default function Projects() {
  const featuredProjects = projects.filter((project) => project.featured);
  const allProjects = projects.filter((project) => !project.featured);

  const gridClasses = 'grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4';

  return (
    <>
      <Text variant="h2-mono" element="h1">
        Projects
      </Text>
      <Text variant="h3" element="h2" className="mt-8">
        Featured Projects
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
        All Projects
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
