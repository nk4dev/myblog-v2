import type { Route } from './+types/not-found';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { NaviLink } from 'stories/Link';

export function meta({ }: Route.MetaArgs) {
  return [{ title: 'Not Found' }];
}

export default function NotFound() {
  return (
    <HomeLayout {...baseOptions()}>
      <div className='flex flex-col items-center justify-center'>
        <main className='flex flex-col items-center h-100 w-200 bg-red-400 justify-center'>
          <h1 className='text-4xl font-bold'>HMM...</h1>
          <h2 className='text-lg'>the page you are looking for does not exist.</h2>
          <NaviLink href='/' label='back to Home'/>
        </main>
      </div>
    </HomeLayout>
  );
}
