'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'Artigos' | 'E-books' | 'Cartilhas' | 'Vídeos' | 'Podcasts' | 'Guias';
  url: string;
  verifiedBy?: string;
}

const MOCK_RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'Guia de Direitos no Diagnóstico Recente',
    description: 'Passo a passo sobre isenções, BPC/LOAS e documentação necessária para famílias.',
    type: 'Guias',
    url: '#',
    verifiedBy: 'Dr. Roberto Lima (Advogado Especialista em Direito à Saúde)',
  },
  {
    id: '2',
    title: 'Compreendendo o PEI (Plano de Ensino Individualizado)',
    description: 'Manual prático para pais e educadores sobre elaboração e acompanhamento do PEI na escola.',
    type: 'Cartilhas',
    url: '#',
    verifiedBy: 'Prof.ª Carla Mendez (Pedagoga e Especialista em Inclusão)',
  },
  {
    id: '3',
    title: 'Estratégias para Seletividade Alimentar no TEA',
    description: 'E-book informativo sobre acolhimento sensorial, apresentação de alimentos e rotina.',
    type: 'E-books',
    url: '#',
    verifiedBy: 'Dra. Patricia Costa (Nutricionista Materno-Infantil)',
  },
  {
    id: '4',
    title: 'Rotinas Visuais e Previsibilidade na Infância',
    description: 'Vídeo explicativo mostrando na prática como montar e utilizar quadros de rotina em casa.',
    type: 'Vídeos',
    url: '#',
    verifiedBy: 'Lucas Andrade (Terapeuta Ocupacional)',
  },
  {
    id: '5',
    title: 'Saúde Mental dos Cuidadores: Evitando o Burnout Parental',
    description: 'Episódio em áudio com reflexões e ferramentas práticas para gerenciamento do estresse.',
    type: 'Podcasts',
    url: '#',
    verifiedBy: 'Dra. Camila Rocha (Psicóloga Clínica)',
  },
  {
    id: '6',
    title: 'Manejo de Crises e Desregulação Sensorial',
    description: 'Artigo técnico sobre diferenças entre birra e crise sensorial, e como intervir com segurança.',
    type: 'Artigos',
    url: '#',
    verifiedBy: 'Dr. Fernando Souza (Neuropediatra)',
  },
];

const CATEGORIES = ['Todos', 'Artigos', 'E-books', 'Cartilhas', 'Vídeos', 'Podcasts', 'Guias'];

export default function BibliotecaPage() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResources = MOCK_RESOURCES.filter((item) => {
    const matchesCategory = selectedCategory === 'Todos' || item.type === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-100 selection:text-blue-900 font-sans antialiased">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        <div className="mx-auto max-w-6xl space-y-6">
          
          {/* Header Claro e Profissional */}
          <header className="rounded-2xl bg-white p-6 md:p-8 border border-slate-200 shadow-xs space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Acervo Técnico & Didático
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Biblioteca de Conteúdo
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Materiais informativos, e-books, vídeos e guias com curadoria e revisão técnica de especialistas.
            </p>
          </header>

          {/* Barra de Busca e Filtros */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs space-y-4">
            <input
              type="text"
              placeholder="Buscar por título ou assunto (ex: PEI, alimentação, direitos)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition-all shadow-2xs"
            />

            {/* Categorias (Filtros Rápidos) */}
            <div className="flex flex-wrap gap-2 pt-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grade de Materiais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-400 shadow-xs">
                Nenhum material localizado para os critérios informados.
              </div>
            ) : (
              filteredResources.map((resource) => (
                <div
                  key={resource.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-blue-50 border border-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                        {resource.type}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {resource.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {resource.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    {/* Validação por Especialista */}
                    {resource.verifiedBy && (
                      <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-2.5 text-[11px] text-slate-700">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                          Revisão Técnica
                        </span>
                        <span className="leading-tight block font-medium">
                          {resource.verifiedBy}
                        </span>
                      </div>
                    )}

                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center rounded-xl bg-slate-900 hover:bg-slate-800 text-white py-2.5 text-xs font-semibold transition-colors shadow-2xs"
                    >
                      Acessar Material
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </main>
    </div>
  );
}