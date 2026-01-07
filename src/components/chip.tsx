import { ReactNode } from 'react';
import { Text } from '@/components/text';

export interface ChipProps {
  children: ReactNode;
}

export function Chip({ children }: ChipProps) {
  return (
    <Text variant="body-3" asChild>
      <span className="px-1.5 py-1 text-primary-500 border border-primary-500 rounded">
        { children }
      </span>
    </Text>
  );
}
