import { useTranslations } from 'next-intl';
import { RichTextProps } from '@/components/RichText';

// eslint-disable-next-line react-hooks/rules-of-hooks
const t = useTranslations();
export type TranslateFunction = typeof t;

export type RichTextChildren = RichTextProps['children'];
