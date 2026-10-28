import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { Logo } from '@/components/site/Logo';
import { LoginForm } from './LoginForm';

export const metadata = { title: 'Ingresar' };
export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  if (await getSession()) redirect('/admin');
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center"><Logo size="lg" /></div>
        <div className="card">
          <h1 className="text-center text-3xl">Panel de administración</h1>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
