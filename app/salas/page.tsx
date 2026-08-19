'use client';

import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

const SALAS = [
  {
    id: 'espectro-nivel-1',
    nome: 'Espectro Nível 1',
    descricao: 'Espaço de troca para famílias e pessoas com autismo nível 1 de suporte.',
  },
  {
    id: 'espectro-nivel-2',
    nome: 'Espectro Nível 2',
    descricao: 'Apoio, terapias e vivências focadas no autismo nível 2 de suporte.',
  },
  {
    id: 'espectro-nivel-3',
    nome: 'Espectro Nível 3',
    descricao: 'Rede de acolhimento e cuidados para autismo nível 3 de suporte.',
  },
  {
    id: 'tdah',
    nome: 'TDAH',
    descricao: 'Dicas de rotina, foco, manejo comportamental e experiências sobre TDAH.',
  },
  {
    id: 'sindrome-de-down',
    nome: 'Síndrome de Down',
    descricao: 'Compartilhamento de conquistas, estímulo precoce e inclusão.',
  },
  {
    id: 'deficiencia-intelectual',
    nome: 'Deficiência Intelectual',
    descricao: 'Trocas sobre autonomia, aprendizagem e desenvolvimento.',
  },
  {
    id: 'multiplas-deficiencias',
    nome: 'Múltiplas Deficiências',
    descricao: 'Acolhimento para famílias com desafios e necessidades combinadas.',
  },
  {
    id: 'diagnostico-recente',
    nome: 'Diagnóstico Recente',
    descricao: 'Primeiros passos, laudos, orientação e acolhimento para quem acabou de chegar.',
  },
];

export default function SalasPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-100 selection:text-blue-900 font-sans antialiased">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        <div className="mx-auto max-w-6xl space-y-6">
          
          {/* Header Claro */}
          <header className="rounded-2xl bg-white p-6 md:p-8 border border-slate-200 shadow-sm space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Comunidade & Interação
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Salas por Perfil
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Selecione uma sala temática para conversar e compartilhar experiências com membros e profissionais que vivenciam contextos semelhantes.
            </p>
          </header>

          {/* Grid de Salas Claras */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SALAS.map((sala) => (
              <div
                key={sala.id}
                onClick={() => router.push(`/salas/${sala.id}`)}
                className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <h2 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {sala.nome}
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {sala.descricao}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-700 transition-colors">
                  <span>Acessar sala</span>
                  <span className="text-slate-400 group-hover:text-slate-600 transition-colors">
                    Entrar →
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}