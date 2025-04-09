import type { ProjectsRepository } from '../ProjectsRepository';

export class StaticProjectsRepository implements ProjectsRepository {
  getAll() {
    return [
      {
        title: 'projects.andresilvacc.title',
        description: 'projects.andresilvacc.description',
        links: [{ url: 'https://github.com/andresilva-cc/andresilva.cc' }],
        featured: true,
        technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
      },
      {
        title: 'projects.customBurger.title',
        description: 'projects.customBurger.description',
        links: [{ url: 'https://customburger.andresilva.cc/' }],
        featured: true,
        technologies: ['TypeScript', 'Vue.js', 'Nuxt', 'Tailwind CSS'],
      },
      {
        title: 'projects.injektion.title',
        description: 'projects.injektion.description',
        links: [{ url: 'https://github.com/andresilva-cc/injektion' }],
        featured: true,
        technologies: ['TypeScript'],
      },
      {
        title: 'projects.eyesup.title',
        description: 'projects.eyesup.description',
        links: [
          { name: 'Website', url: 'https://eyesup.andresilva.cc/' },
          { name: 'eyesup-web', url: 'https://github.com/andresilva-cc/eyesup-web' },
          { name: 'eyesup-sync', url: 'https://github.com/andresilva-cc/eyesup-sync' },
        ],
        featured: false,
        technologies: ['Vue.js'],
      },
      {
        title: 'projects.renderingModesDemo.title',
        description: 'projects.renderingModesDemo.description',
        links: [
          { name: 'Website', url: 'https://renderingmodes.andresilva.cc/' },
          { name: 'GitHub', url: 'https://github.com/andresilva-cc/demo-nuxt3-rendering-modes' },
        ],
        featured: false,
        technologies: ['Vue.js', 'Nuxt'],
      },
      {
        title: 'projects.pocVueUniversalComponent.title',
        description: 'projects.pocVueUniversalComponent.description',
        links: [{ url: 'https://github.com/andresilva-cc/poc-vue-universal-component' }],
        featured: false,
        technologies: ['Vue.js'],
      },
      {
        title: 'projects.expressApiTemplate.title',
        description: 'projects.expressApiTemplate.description',
        links: [{ url: 'https://github.com/andresilva-cc/express-api-template' }],
        featured: false,
        technologies: ['TypeScript', 'Node.js', 'Express', 'Sequelize'],
      },
      {
        title: 'projects.reflectionFunction.title',
        description: 'projects.reflectionFunction.description',
        links: [{ url: 'https://github.com/andresilva-cc/reflection-function' }],
        featured: false,
        technologies: ['TypeScript'],
      },
      {
        title: 'projects.crcmg.title',
        description: 'projects.crcmg.description',
        links: [{ url: 'https://crcmg.org.br/' }],
        featured: false,
        technologies: ['Adobe XD'],
      },
      {
        title: 'projects.firebirdPermissions.title',
        description: 'projects.firebirdPermissions.description',
        links: [{ url: 'https://github.com/andresilva-cc/firebird-add-permissions-to-multiple-databases' }],
        featured: false,
        technologies: ['Shell Script'],
      },
      {
        title: 'projects.nativescriptSpotify.title',
        description: 'projects.nativescriptSpotify.description',
        links: [{ url: 'https://github.com/Nuxstep/nativescript-plugins/tree/master/packages/nativescript-spotify' }],
        featured: false,
        technologies: ['TypeScript', 'NativeScript'],
      },
      {
        title: 'projects.teseu.title',
        description: 'projects.teseu.description',
        links: [
          { name: 'Teseu-App', url: 'https://github.com/andresilva-cc/Teseu-App' },
          { name: 'Teseu-API', url: 'https://github.com/andresilva-cc/Teseu-API' },
          { name: 'Teseu-Web', url: 'https://github.com/andresilva-cc/Teseu-Web' },
        ],
        featured: false,
        technologies: ['Vue.js', 'Nuxt', 'Vuetify', 'NativeScript', 'Sass', 'Node.js', 'Express', 'Sequelize'],
      },
      {
        title: 'projects.confea.title',
        description: 'projects.confea.description',
        links: [{ url: 'https://www.confea.org.br/' }],
        featured: false,
        technologies: ['Drupal'],
      },
      {
        title: 'projects.oac.title',
        description: 'projects.oac.description',
        links: [
          { name: 'OAC-API', url: 'https://github.com/andresilva-cc/OAC-API' },
          { name: 'OAC-FrontEnd', url: 'https://github.com/andresilva-cc/OAC-FrontEnd' },
        ],
        featured: false,
        technologies: ['Vue.js', 'Nuxt', 'Konva', 'Vuesax', 'Node.js', 'Express'],
      },
      {
        title: 'projects.marketplaceBridge.title',
        description: 'projects.marketplaceBridge.description',
        featured: false,
        technologies: ['Vue.js', 'Nuxt', 'Vuetify', 'Node.js'],
      },
      {
        title: 'projects.voucherPrinter.title',
        description: 'projects.voucherPrinter.description',
        links: [{ url: 'https://github.com/andresilva-cc/voucher-printer' }],
        featured: false,
        technologies: ['Node.js', 'Express', 'Pug.js'],
      },
    ];
  }
}
