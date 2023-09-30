import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default,
  defaultTranslationValues: {
    strong: (chunks) => <strong>{ chunks }</strong>,
    p: (chunks) => <p>{ chunks }</p>,
    ul: (chunks) => <ul>{ chunks }</ul>,
    li: (chunks) => <li>{ chunks }</li>,
  },
}));
