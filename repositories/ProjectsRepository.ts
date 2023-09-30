import type { TranslateFunction } from '@/types/i18n';

export const ProjectsRepository = (t: TranslateFunction) => ({
  getAll() {
    return [
      {
        title: 'andresilva.cc',
        description: t('projects.andresilvacc.description'),
        url: 'https://github.com/andresilva-cc/andresilva.cc',
        featured: true,
        technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
      },
      {
        title: 'CustomBurger',
        description: t('projects.customBurger.description'),
        url: 'https://customburger.andresilva.cc/',
        featured: true,
        technologies: ['TypeScript', 'Vue.js', 'Nuxt', 'Tailwind CSS'],
      },
      {
        title: 'Injektion',
        description: t('projects.injektion.description'),
        url: 'https://github.com/andresilva-cc/injektion',
        featured: true,
        technologies: ['TypeScript'],
      },
      {
        title: 'poc-vue-universal-component',
        description: t('projects.pocVueUniversalComponent.description'),
        url: 'https://github.com/andresilva-cc/poc-vue-universal-component',
        featured: false,
        technologies: ['Vue.js'],
      },
      {
        title: 'Express API Template',
        description: t('projects.expressApiTemplate.description'),
        url: 'https://github.com/andresilva-cc/express-api-template',
        featured: false,
        technologies: ['TypeScript', 'Node.js', 'Express', 'Sequelize'],
      },
      {
        title: 'Reflection Function',
        description: t('projects.reflectionFunction.description'),
        url: 'https://github.com/andresilva-cc/reflection-function',
        featured: false,
        technologies: ['TypeScript'],
      },
      {
        title: 'Firebird - Add permissions to multiple databases',
        description: t('projects.firebirdPermissions.description'),
        url: 'https://github.com/andresilva-cc/firebird-add-permissions-to-multiple-databases',
        featured: false,
        technologies: ['Shell Script'],
      },
      {
        title: 'NativeScript Spotify',
        description: t('projects.nativescriptSpotify.description'),
        url: 'https://github.com/Nuxstep/nativescript-plugins/tree/master/packages/nativescript-spotify',
        featured: false,
        technologies: ['TypeScript', 'NativeScript'],
      },
      {
        title: 'Teseu',
        description: t('projects.teseu.description'),
        url: 'https://github.com/andresilva-cc/Teseu-App',
        featured: false,
        technologies: ['Vue.js', 'Nuxt', 'Vuetify', 'NativeScript', 'Sass', 'Node.js', 'Express', 'Sequelize'],
      },
      {
        title: 'OAC - Obstacle Avoiding Car',
        description: t('projects.oac.description'),
        url: 'https://github.com/andresilva-cc/OAC-API',
        featured: false,
        technologies: ['Vue.js', 'Nuxt', 'Konva', 'Vuesax', 'Node.js', 'Express'],
      },
      {
        title: 'Voucher-Printer',
        description: t('projects.voucherPrinter.description'),
        url: 'https://github.com/andresilva-cc/voucher-printer',
        featured: false,
        technologies: ['Node.js', 'Express', 'Pug.js'],
      },
    ];
  },
});
