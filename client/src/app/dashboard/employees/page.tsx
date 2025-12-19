import type { Metadata } from 'next';
import { config } from '@/config';
import EmployeesClient from './EmployeesClient';

export const metadata: Metadata = {
  title: `Employees | Dashboard | ${config.site.name}`,
};

export default function Page() {
 return <EmployeesClient />
}
