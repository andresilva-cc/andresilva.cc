import { Text } from '@/components/Text';

export default function Home() {
  return (
    <>
      <Text variant="h1" className="text-secondary-500 text-5xl md:text-6xl">
        André Silva
      </Text>

      <Text variant="h2-sans" className="text-primary-500 mt-8 text-xl md:text-2xl">
        Front-end Engineering Consultant @ Atlas Technologies
      </Text>

      <Text variant="body-1" className="mt-8">
        A software engineer with professional experience in web and mobile applications
      </Text>
    </>
  );
}
