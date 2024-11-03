export const MenuRepository = () => ({
  getAll() {
    return [
      { name: 'menu.home', path: '/', hideOnDesktop: true },
      { name: 'menu.about', path: '/about' },
      { name: 'menu.articles', path: 'https://dev.to/andresilva-cc/' },
      { name: 'menu.career', path: '/career' },
      { name: 'menu.projects', path: '/projects' },
    ];
  },
});
