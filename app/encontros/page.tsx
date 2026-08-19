'use client';

import Sidebar from '@/components/Sidebar';

export default function EncontrosPage() {
  const encontros = [
    {
      titulo: 'Palestras',
      descricao: 'Apresentações enriquecedoras com profissionais especializados da saúde e da educação.',
    },
    {
      titulo: 'Lives',
      descricao: 'Transmissões ao vivo, dinâmicas e interativas para tirar dúvidas em tempo real.',
    },
    {
      titulo: 'Rodas de Conversa',
      descricao: 'Espaço seguro de escuta, acolhimento e troca sincera de experiências entre famílias.',
    },
    {
      titulo: 'Workshops',
      descricao: 'Oficinas práticas focadas no aprendizado de ferramentas e estratégias para o dia a dia.',
    },
    {
      titulo: 'Eventos Especiais',
      descricao: 'Programações comemorativas, painéis temáticos e grandes encontros com convidados.',
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-100 selection:text-blue-900 font-sans antialiased">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        <div className="mx-auto max-w-5xl space-y-6">
          
          {/* Header Claro e Limpo */}
          <header className="rounded-2xl bg-white p-6 md:p-8 border border-slate-200 shadow-sm space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Atividades & Eventos
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Encontros Online
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Unimos conhecimento técnico e vivência prática para fortalecer nossa comunidade. 
              Realizados com a participação de profissionais convidados e relatos transformadores de famílias.
            </p>
          </header>

          {/* Lista de Atividades */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {encontros.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-200 hover:shadow-md space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-slate-900">
                    {item.titulo}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                    Sessão
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.descricao}
                </p>
              </div>
            ))}
          </div>

          {/* Destaque / Nota de Rodapé */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-center">
            <p className="text-xs text-blue-900 font-medium">
              Todos os encontros contam com momentos abertos para perguntas e troca de relatos.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}