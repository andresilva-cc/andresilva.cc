import type { TranslateFunction } from '@/types/i18n';
import type { Project } from '@/types/Project';

export const ProjectsRepository = (t: TranslateFunction) => ({
  getAll(): Array<Project> {
    return [
      {
        title: t('projects.andresilvacc.title'),
        description: t('projects.andresilvacc.description'),
        links: [{ url: 'https://github.com/andresilva-cc/andresilva.cc' }],
        featured: true,
        technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
      },
      {
        title: t('projects.customBurger.title'),
        description: t('projects.customBurger.description'),
        links: [{ url: 'https://customburger.andresilva.cc/' }],
        featured: true,
        technologies: ['TypeScript', 'Vue.js', 'Nuxt', 'Tailwind CSS'],
      },
      {
        title: t('projects.injektion.title'),
        description: t('projects.injektion.description'),
        links: [{ url: 'https://github.com/andresilva-cc/injektion' }],
        featured: true,
        technologies: ['TypeScript'],
      },
      {
        title: t('projects.pocVueUniversalComponent.title'),
        description: t('projects.pocVueUniversalComponent.description'),
        links: [{ url: 'https://github.com/andresilva-cc/poc-vue-universal-component' }],
        featured: false,
        technologies: ['Vue.js'],
      },
      {
        title: t('projects.expressApiTemplate.title'),
        description: t('projects.expressApiTemplate.description'),
        links: [{ url: 'https://github.com/andresilva-cc/express-api-template' }],
        featured: false,
        technologies: ['TypeScript', 'Node.js', 'Express', 'Sequelize'],
      },
      {
        title: t('projects.reflectionFunction.title'),
        description: t('projects.reflectionFunction.description'),
        links: [{ url: 'https://github.com/andresilva-cc/reflection-function' }],
        featured: false,
        technologies: ['TypeScript'],
      },
      {
        title: t('projects.crcmg.title'),
        description: t('projects.crcmg.description'),
        links: [{ url: 'https://crcmg.org.br/' }],
        featured: false,
        technologies: ['Adobe XD'],
      },
      {
        title: t('projects.firebirdPermissions.title'),
        description: t('projects.firebirdPermissions.description'),
        links: [{ url: 'https://github.com/andresilva-cc/firebird-add-permissions-to-multiple-databases' }],
        featured: false,
        technologies: ['Shell Script'],
      },
      {
        title: t('projects.nativescriptSpotify.title'),
        description: t('projects.nativescriptSpotify.description'),
        links: [{ url: 'https://github.com/Nuxstep/nativescript-plugins/tree/master/packages/nativescript-spotify' }],
        featured: false,
        technologies: ['TypeScript', 'NativeScript'],
      },
      {
        title: t('projects.teseu.title'),
        description: t('projects.teseu.description'),
        links: [
          { name: 'Teseu-App', url: 'https://github.com/andresilva-cc/Teseu-App' },
          { name: 'Teseu-API', url: 'https://github.com/andresilva-cc/Teseu-API' },
          { name: 'Teseu-Web', url: 'https://github.com/andresilva-cc/Teseu-Web' },
        ],
        featured: false,
        technologies: ['Vue.js', 'Nuxt', 'Vuetify', 'NativeScript', 'Sass', 'Node.js', 'Express', 'Sequelize'],
      },
      {
        title: t('projects.confea.title'),
        description: t('projects.confea.description'),
        links: [{ url: 'https://www.confea.org.br/' }],
        featured: false,
        technologies: ['Drupal'],
      },
      {
        title: t('projects.oac.title'),
        description: t('projects.oac.description'),
        links: [
          { name: 'OAC-API', url: 'https://github.com/andresilva-cc/OAC-API' },
          { name: 'OAC-FrontEnd', url: 'https://github.com/andresilva-cc/OAC-FrontEnd' },
        ],
        featured: false,
        technologies: ['Vue.js', 'Nuxt', 'Konva', 'Vuesax', 'Node.js', 'Express'],
      },
      {
        title: t('projects.marketplaceBridge.title'),
        description: t('projects.marketplaceBridge.description'),
        featured: false,
        technologies: ['Vue.js', 'Nuxt', 'Vuetify', 'Node.js'],
      },
      {
        title: t('projects.voucherPrinter.title'),
        description: t('projects.voucherPrinter.description'),
        links: [{ url: 'https://github.com/andresilva-cc/voucher-printer' }],
        featured: false,
        technologies: ['Node.js', 'Express', 'Pug.js'],
      },
    ];
  },
});
