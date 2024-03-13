export const ArticlesRepository = () => ({
  getAll() {
    return [
      {
        id: 0,
        title: 'Universal Components with Vue.js',
        slug: 'universal-components-with-vuejs',
        summary: 'How I developed a Proof of Concept of universal components in Vue.js and its trade-offs',
        postedAt: new Date(2024, 2, 1),
      },
      {
        id: 1,
        title: 'My Experience as a Front-end Engineering Consultant',
        slug: 'my-experience-as-a-front-end-engineering-consultant',
        summary: 'What I learned in 2 years as a consultant and why I chose to quit',
        postedAt: new Date(2023, 11, 16),
      },
      {
        id: 2,
        title: 'Building a Component Library',
        slug: 'building-a-component-library',
        summary: 'How we built a Component Library in Atlas Technologies and some of the challenges along the way',
        postedAt: new Date(2023, 6, 30),
      },
      {
        id: 3,
        title: 'Upgrading Multiple Projects to Vue 3',
        slug: 'upgrading-multiple-projects-to-vue-3',
        summary: 'The migration to Vue 3 is not easy, even more when there are multiple projects with dependencies. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
        postedAt: new Date(2023, 0, 19),
      },
    ];
  },
});
