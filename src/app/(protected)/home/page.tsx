'use client';

import { useAuth } from '@/src/context/AuthContext';
import LogoutButton from '@/src/components/ui/LogoutButton';
import Register from '@/src/components/register';

export default function DashboardPage() {
  const { user } = useAuth();

  const isSysAdmin = user?.role === 'sysadmin';

  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-8">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-5xl flex flex-col md:flex-row gap-8">
        
        {/* Lado Esquerdo - Perfil do Utilizador Logado */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Olá, {user?.name}!
          </h1>
          <p className="text-gray-600 mb-8 font-bold">
            {isSysAdmin ? 'Painel de Administrador' : 'Área do Usuário'}
          </p>

          <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-8 text-left">
            <h2 className="text-sm font-semibold text-blue-800 uppercase tracking-wider mb-2">
              Seus Dados de Sessão:
            </h2>
            <p className="text-sm text-blue-900"><strong>Nome:</strong> {user?.name}</p>
            <p className="text-sm text-blue-900"><strong>Email:</strong> {user?.email}</p>
            <p className="text-sm text-blue-900"><strong>Permissão:</strong> {user?.role}</p>
          </div>

          <LogoutButton customClass="w-full justify-center" />
        </div>

        {/* Lado Direito - Ferramentas de Admin (Apenas para o sysadmin) */}
        {isSysAdmin && (
          <div className="flex-1 bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-bold text-secondary-700 border-b border-gray-200 pb-2 mb-4">
              Ferramentas do Sistema
            </h2>
            <p className="text-sm text-gray-600">
              Utilize o formulário abaixo para registrar novos usuários na plataforma.
            </p>
            <Register />
          </div>
        )}

      </div>
    </main>
  );
}