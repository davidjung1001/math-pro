import ResourcesClient from './ResourcesClient';
import { Metadata } from 'next';

export const metadata = {
  title: 'SAT Math & PSAT Info | Stilly Math Pro',
  description: 'Understand the SAT, PSAT, and key math subjects. Learn how to prepare for the SAT Math section and boost your score.',
  keywords: [
    'SAT Math practice',
    'SAT practice test',
    'PSAT National Merit',
    'SAT Math tutoring',
    'summer math prep',
    'algebra SAT',
    'geometry SAT',
    'SAT score ranges',
  ],
};

export default function ResourcesPage() {
  return <ResourcesClient />;
}
