import type { ProjectsRepository, ProjectsRepositoryResponse } from '../projects-repository';

export class StaticProjectsRepository implements ProjectsRepository {
  getAll(): Array<ProjectsRepositoryResponse> {
    return [
      {
        title: 'claude-code-multi-account',
        description: 'Auto-switches Claude Code accounts by directory — no keychain writes',
        links: [{ name: 'github', url: 'https://github.com/andresilva-cc/claude-code-multi-account' }],
        featured: false,
        technologies: ['Shell Script'],
      },
      {
        title: 'Infinity',
        description: 'AI experts that join your Google Meet calls and contribute live',
        links: [{ name: 'site', url: 'https://meet.agentairforce.com' }],
        featured: true,
        technologies: ['TypeScript', 'Python', 'Next.js', 'Tailwind CSS', 'LiveKit', 'Gemini'],
      },
      {
        title: 'andresilva.cc',
        description: 'The personal website that you are seeing right now',
        links: [{ name: 'github', url: 'https://github.com/andresilva-cc/andresilva.cc' }],
        featured: false,
        technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
      },
      {
        title: 'Grafex',
        description: 'Images as code — write JSX compositions, export as images',
        links: [
          { name: 'site', url: 'https://grafex.dev/' },
          { name: 'github', url: 'https://github.com/grafex-dev/grafex' },
        ],
        featured: true,
        technologies: ['TypeScript', 'Node.js'],
      },
      {
        title: 'Calcloak',
        description: 'Mirrors personal calendar events into a work calendar as private busy blocks',
        links: [{ name: 'site', url: 'https://calcloak.com/' }],
        featured: true,
        technologies: ['TypeScript', 'React', 'Node.js', 'Tailwind CSS'],
      },
      {
        title: 'EyesUp',
        description: 'Tracks the 20-20-20 rule and reminds you to rest your eyes while working',
        links: [
          { name: 'site', url: 'https://eyesup.andresilva.cc/' },
          { name: 'eyesup-web', url: 'https://github.com/andresilva-cc/eyesup-web' },
          { name: 'eyesup-sync', url: 'https://github.com/andresilva-cc/eyesup-sync' },
        ],
        featured: false,
        technologies: ['TypeScript', 'Vue.js', 'Nuxt', 'Tailwind CSS', 'Node.js', 'WebSocket'],
      },
      {
        title: 'Rendering Modes Demo',
        description: 'Side-by-side demo of CSR, SSR, SSG, and ISR rendering modes in Nuxt 3',
        links: [
          { name: 'site', url: 'https://renderingmodes.andresilva.cc/' },
          { name: 'github', url: 'https://github.com/andresilva-cc/demo-nuxt3-rendering-modes' },
        ],
        featured: false,
        technologies: ['Vue.js', 'Nuxt'],
      },
      {
        title: 'CustomBurger',
        description: 'A small project for building your own burger from layered ingredients',
        links: [
          { name: 'site', url: 'https://customburger.andresilva.cc/' },
          { name: 'github', url: 'https://github.com/andresilva-cc/customburger' },
        ],
        featured: false,
        technologies: ['TypeScript', 'Vue.js', 'Nuxt', 'Tailwind CSS'],
      },
      {
        title: 'poc-vue-universal-component',
        description: 'Proof of concept for a single component that runs on Vue 2 and Vue 3',
        links: [{ name: 'github', url: 'https://github.com/andresilva-cc/poc-vue-universal-component' }],
        featured: false,
        technologies: ['Vue.js'],
      },
      {
        title: 'Injektion',
        description: 'Decorator-less dependency injection for JavaScript and TypeScript',
        links: [{ name: 'github', url: 'https://github.com/andresilva-cc/injektion' }],
        featured: false,
        technologies: ['TypeScript'],
      },
      {
        title: 'Reflection Function',
        description: 'Reads names and parameters from functions and classes at runtime',
        links: [{ name: 'github', url: 'https://github.com/andresilva-cc/reflection-function' }],
        featured: false,
        technologies: ['TypeScript'],
      },
      {
        title: 'CRCMG',
        description: 'Website design for the Regional Accounting Council of Minas Gerais',
        links: [{ name: 'site', url: 'https://crcmg.org.br/' }],
        featured: false,
        technologies: ['Adobe XD'],
      },
      {
        title: 'Express API Template',
        description: 'A starter template for building REST APIs with Express and TypeScript',
        links: [{ name: 'github', url: 'https://github.com/andresilva-cc/express-api-template' }],
        featured: false,
        technologies: ['TypeScript', 'Node.js', 'Express', 'Sequelize'],
      },
      {
        title: 'Firebird Permissions',
        description: 'A shell script that grants user permissions across Firebird databases',
        links: [{ name: 'github', url: 'https://github.com/andresilva-cc/firebird-add-permissions-to-multiple-databases' }],
        featured: false,
        technologies: ['Shell Script'],
      },
      {
        title: 'NativeScript Spotify',
        description: 'A NativeScript plugin that wraps the Spotify App Remote SDK',
        links: [{ name: 'github', url: 'https://github.com/Nuxstep/nativescript-plugins/tree/master/packages/nativescript-spotify' }],
        featured: false,
        technologies: ['TypeScript', 'NativeScript'],
      },
      {
        title: 'Teseu',
        description: 'A collaborative app for reporting criminal incidents in real time',
        links: [
          { name: 'teseu-app', url: 'https://github.com/andresilva-cc/Teseu-App' },
          { name: 'teseu-api', url: 'https://github.com/andresilva-cc/Teseu-API' },
          { name: 'teseu-web', url: 'https://github.com/andresilva-cc/Teseu-Web' },
        ],
        featured: false,
        technologies: ['Vue.js', 'Nuxt', 'Vuetify', 'NativeScript', 'Sass', 'Node.js', 'Express', 'Sequelize'],
      },
      {
        title: 'OAC - Obstacle Avoiding Car',
        description: 'Train a neural network to drive a car around obstacles, then watch it run',
        links: [
          { name: 'oac-api', url: 'https://github.com/andresilva-cc/OAC-API' },
          { name: 'oac-frontend', url: 'https://github.com/andresilva-cc/OAC-FrontEnd' },
        ],
        featured: false,
        technologies: ['Vue.js', 'Nuxt', 'Konva', 'Vuesax', 'Node.js', 'Express'],
      },
      {
        title: 'Voucher-Printer',
        description: 'Generates Wi-Fi hotspot vouchers and prints them on a thermal printer',
        links: [{ name: 'github', url: 'https://github.com/andresilva-cc/voucher-printer' }],
        featured: false,
        technologies: ['Node.js', 'Express', 'Pug.js'],
      },
      {
        title: 'CONFEA',
        description: 'The website for Brazil\'s Federal Council of Engineering and Agronomy',
        links: [{ name: 'site', url: 'https://www.confea.org.br/' }],
        featured: false,
        technologies: ['Drupal'],
      },
      {
        title: 'Marketplace Bridge',
        description: 'Integration connecting the Nuvemshop store platform to SkyHub',
        featured: false,
        technologies: ['Vue.js', 'Nuxt', 'Vuetify', 'Node.js'],
      },
    ];
  }
}
