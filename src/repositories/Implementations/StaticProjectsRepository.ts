import type { ProjectsRepository } from '../ProjectsRepository';

export class StaticProjectsRepository implements ProjectsRepository {
  getAll() {
    return [
      {
        title: 'andresilva.cc',
        description: 'The personal website that you are seeing right now',
        links: [{ url: 'https://github.com/andresilva-cc/andresilva.cc' }],
        featured: true,
        technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
      },
      {
        title: 'CustomBurger',
        description: 'A small project where you can build your own burger',
        links: [{ url: 'https://customburger.andresilva.cc/' }],
        featured: true,
        technologies: ['TypeScript', 'Vue.js', 'Nuxt', 'Tailwind CSS'],
      },
      {
        title: 'Injektion',
        description: 'Decorator-less dependency injection for JavaScript and TypeScript',
        links: [{ url: 'https://github.com/andresilva-cc/injektion' }],
        featured: true,
        technologies: ['TypeScript'],
      },
      {
        title: 'EyesUp',
        description: 'A minimal app that helps you follow the 20-20-20 rule and rest your eyes while working',
        links: [
          { name: 'Website', url: 'https://eyesup.andresilva.cc/' },
          { name: 'eyesup-web', url: 'https://github.com/andresilva-cc/eyesup-web' },
          { name: 'eyesup-sync', url: 'https://github.com/andresilva-cc/eyesup-sync' },
        ],
        featured: false,
        technologies: ['TypeScript', 'Vue.js', 'Nuxt', 'Tailwind CSS', 'Node.js', 'WebSocket'],
      },
      {
        title: 'Rendering Modes Demo',
        description: 'Demo of rendering modes in Nuxt 3',
        links: [
          { name: 'Website', url: 'https://renderingmodes.andresilva.cc/' },
          { name: 'GitHub', url: 'https://github.com/andresilva-cc/demo-nuxt3-rendering-modes' },
        ],
        featured: false,
        technologies: ['Vue.js', 'Nuxt'],
      },
      {
        title: 'poc-vue-universal-component',
        description: 'Proof of concept of universal components in Vue.js',
        links: [{ url: 'https://github.com/andresilva-cc/poc-vue-universal-component' }],
        featured: false,
        technologies: ['Vue.js'],
      },
      {
        title: 'Express API Template',
        description: 'An always evolving project template for creating APIs using Express, TypeScript, and Sequelize',
        links: [{ url: 'https://github.com/andresilva-cc/express-api-template' }],
        featured: false,
        technologies: ['TypeScript', 'Node.js', 'Express', 'Sequelize'],
      },
      {
        title: 'Reflection Function',
        description: 'Function reflection for JavaScript and TypeScript',
        links: [{ url: 'https://github.com/andresilva-cc/reflection-function' }],
        featured: false,
        technologies: ['TypeScript'],
      },
      {
        title: 'CRCMG',
        description: 'Design for the new website of Minas Gerais state\'s Regional Accounting Council (CRCMG)',
        links: [{ url: 'https://crcmg.org.br/' }],
        featured: false,
        technologies: ['Adobe XD'],
      },
      {
        title: 'Firebird - Add permissions to multiple databases',
        description: 'A script that add permissions to multiple Firebird databases',
        links: [{ url: 'https://github.com/andresilva-cc/firebird-add-permissions-to-multiple-databases' }],
        featured: false,
        technologies: ['Shell Script'],
      },
      {
        title: 'NativeScript Spotify',
        description: 'Integrate Spotify App Remote SDK into your NativeScript app',
        links: [{ url: 'https://github.com/Nuxstep/nativescript-plugins/tree/master/packages/nativescript-spotify' }],
        featured: false,
        technologies: ['TypeScript', 'NativeScript'],
      },
      {
        title: 'Teseu',
        description: 'A collaborative application for notification of criminal occurrences in real-time',
        links: [
          { name: 'Teseu-App', url: 'https://github.com/andresilva-cc/Teseu-App' },
          { name: 'Teseu-API', url: 'https://github.com/andresilva-cc/Teseu-API' },
          { name: 'Teseu-Web', url: 'https://github.com/andresilva-cc/Teseu-Web' },
        ],
        featured: false,
        technologies: ['Vue.js', 'Nuxt', 'Vuetify', 'NativeScript', 'Sass', 'Node.js', 'Express', 'Sequelize'],
      },
      {
        title: 'CONFEA',
        description: 'The new website of Brazil\'s Federal Council of Engineering and Agronomy (CONFEA)',
        links: [{ url: 'https://www.confea.org.br/' }],
        featured: false,
        technologies: ['Drupal'],
      },
      {
        title: 'OAC - Obstacle Avoiding Car',
        description: 'An application where you instruct an Artificial Neural Network to drive a car while avoiding obstacles',
        links: [
          { name: 'OAC-API', url: 'https://github.com/andresilva-cc/OAC-API' },
          { name: 'OAC-FrontEnd', url: 'https://github.com/andresilva-cc/OAC-FrontEnd' },
        ],
        featured: false,
        technologies: ['Vue.js', 'Nuxt', 'Konva', 'Vuesax', 'Node.js', 'Express'],
      },
      {
        title: 'Marketplace Bridge',
        description: 'Integration between the Nuvemshop e-commerce platform and SkyHub marketplace integrator',
        featured: false,
        technologies: ['Vue.js', 'Nuxt', 'Vuetify', 'Node.js'],
      },
      {
        title: 'Voucher-Printer',
        description: 'Hotspot voucher printer via MikroTik RouterBoard API',
        links: [{ url: 'https://github.com/andresilva-cc/voucher-printer' }],
        featured: false,
        technologies: ['Node.js', 'Express', 'Pug.js'],
      },
    ];
  }
}
