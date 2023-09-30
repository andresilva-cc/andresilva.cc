import { useTranslations } from 'next-intl';

// eslint-disable-next-line react-hooks/rules-of-hooks
const t = useTranslations();
export type TranslateFunction = typeof t;
