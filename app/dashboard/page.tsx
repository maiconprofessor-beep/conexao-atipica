'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function DashboardPage() {
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        const nameFromEmail = user.email.split('@')[0];
        setUserName(nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1));
      }
    };
    getUser();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <div className="mx-auto max-w-5xl space-y-10">
          
          {/* Header principal */}
          <header className="border-b border-slate-200 pb-8 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-blue-600 uppercase">
              
            
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            {userName ? ` ${userName}` : ''}, Como vai você?
            </h1>

            <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
              Acompanhe suas conexões, acesse redes de suporte local e gerencie suas interações no ecossistema da plataforma.
            </p>
          </header>

          {/* Seção de Informações sem caixas e sem ícones */}
          <section className="space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Módulos Principais
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Opção 1: Chat ao Vivo */}
              <div className="group flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Chat ao Vivo
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Comunicação direta e instantânea com outros membros e especialistas da rede.
                  </p>
                </div>

                <Link
                  href="/chat"
                  className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors pt-2"
                >
                  Acessar sala de chat →
                </Link>
              </div>

              {/* Opção 2: Mapa de Recursos */}
              <div className="group flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Mapa de Recursos
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Localize unidades de suporte, clínicas parceiras e serviços especializados na sua região.
                  </p>
                </div>

                <Link
                  href="/mapa"
                  className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors pt-2"
                >
                  Consultar mapa →
                </Link>
              </div>

              {/* Opção 3: Mural Geral */}
              <div className="group flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Mural Geral
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Mural informativo para compartilhamento de experiências, avisos e conteúdos.
                  </p>
                </div>

                <Link
                  href="/forum"
                  className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors pt-2"
                >
                  Explorar mural →
                </Link>
              </div>

            </div>
          </section>

        </div>
      </main>
    </div>
  );
}