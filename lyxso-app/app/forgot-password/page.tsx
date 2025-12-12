import RecoverForm from '@/components/auth/RecoverForm';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Glemt passord?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Skriv inn e-postadressen din, så sender vi deg en lenke for å tilbakestille passordet.
          </p>
        </div>
        
        <RecoverForm />
        
        <div className="text-center">
          <Link 
            href="/login" 
            className="text-sm text-primary-600 hover:text-primary-500"
          >
            Tilbake til pålogging
          </Link>
        </div>
      </div>
    </div>
  );
}
