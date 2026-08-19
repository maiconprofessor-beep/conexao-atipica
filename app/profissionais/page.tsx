'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { supabase } from '@/lib/supabaseClient';

interface Professional {
  id: string;
  full_name: string;
  specialty: string;
  registration_number: string;
  bio?: string;
  email: string;
  phone?: string;
}

export default function ProfissionaisPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [successMessage, setSuccessMessage] = useState(false);
  const [professionals, setProfessionals] = useState<Professional[]>([]);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    specialty: 'Psicologia',
    registration_number: '',
    bio: '',
  });

  const categorias = [
    {
      titulo: 'Psicólogos',
      chave: 'Psicologia',
      descricao: 'Acolhimento emocional, suporte para saúde mental e orientação psicológica.',
    },
    {
      titulo: 'Terapeutas Ocupacionais',
      chave: 'Terapia Ocupacional',
      descricao: 'Desenvolvimento de autonomia, integração sensorial e adaptações para a rotina.',
    },
    {
      titulo: 'Fonoaudiólogos',
      chave: 'Fonoaudiologia',
      descricao: 'Aprimoramento da comunicação, linguagem, fala e alimentação.',
    },
    {
      titulo: 'Psicopedagogos',
      chave: 'Psicopedagogia',
      descricao: 'Estratégias de aprendizagem, apoio ao desenvolvimento cognitivo e adaptações escolares.',
    },
    {
      titulo: 'Advogados Especializados',
      chave: 'Direito / Advocacia',
      descricao: 'Orientações jurídicas sobre direitos, acesso a tratamentos, benefícios e legislação.',
    },
  ];

  const fetchProfessionals = async () => {
    try {
      setFetching(true);
      const { data, error } = await supabase
        .from('professional_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setProfessionals(data);
    } catch (err: any) {
      console.error('Erro ao buscar profissionais:', err.message);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('professional_applications')
        .insert([formData]);

      if (error) throw error;

      setSuccessMessage(true);
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        specialty: 'Psicologia',
        registration_number: '',
        bio: '',
      });

      fetchProfessionals();
    } catch (err: any) {
      alert('Erro ao enviar cadastro: ' + (err.message || 'Tente novamente.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-100 selection:text-blue-900 font-sans antialiased">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        <div className="mx-auto max-w-5xl space-y-6">
          
          {/* Cabeçalho Claro */}
          <header className="rounded-2xl bg-white p-6 md:p-8 border border-slate-200 shadow-sm space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Rede de Suporte
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Apoio Profissional
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Área dedicada para conectar nossa comunidade a profissionais parceiros que desejam contribuir. 
              Os profissionais disponibilizados poderão produzir conteúdos educativos e responder dúvidas gerais das famílias.
            </p>
          </header>

          {/* Banner Chamada para Cadastro */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1 max-w-xl">
              <h3 className="font-bold text-base text-slate-900">
                Atua na área e deseja colaborar?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Junte-se à nossa rede voluntária para compartilhar conhecimento, orientar a comunidade e impactar famílias.
              </p>
            </div>
            <button
              onClick={() => {
                setSuccessMessage(false);
                setIsModalOpen(true);
              }}
              className="whitespace-nowrap px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
            >
              Solicitar Cadastramento
            </button>
          </div>

          {/* Seções por Categoria / Função */}
          {fetching ? (
            <div className="text-center py-12 text-slate-400 text-xs tracking-wider uppercase font-medium">
              Carregando rede de profissionais...
            </div>
          ) : (
            <div className="space-y-6">
              {categorias.map((cat) => {
                const profsDaCategoria = professionals.filter(
                  (p) => p.specialty === cat.chave
                );

                return (
                  <div key={cat.chave} className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-sm">
                    {/* Cabeçalho da Categoria */}
                    <div className="border-b border-slate-100 pb-3 space-y-1">
                      <h2 className="text-base font-bold text-slate-900">{cat.titulo}</h2>
                      <p className="text-xs text-slate-500">{cat.descricao}</p>
                    </div>

                    {/* Lista de Profissionais nessa Categoria */}
                    {profsDaCategoria.length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-2">
                        Nenhum profissional cadastrado nesta categoria até o momento.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                        {profsDaCategoria.map((prof) => (
                          <div
                            key={prof.id}
                            className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3 hover:border-blue-300 hover:bg-white transition-all shadow-2xs"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <h3 className="font-bold text-sm text-slate-900">{prof.full_name}</h3>
                                <span className="inline-block mt-1 text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 tracking-wide">
                                  {prof.registration_number}
                                </span>
                              </div>
                            </div>

                            {prof.bio && (
                              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                                {prof.bio}
                              </p>
                            )}

                            <div className="pt-3 border-t border-slate-200/60 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
                              <span className="truncate">
                                <strong className="text-slate-400 uppercase text-[9px] block">E-mail</strong>
                                {prof.email}
                              </span>
                              {prof.phone && (
                                <span>
                                  <strong className="text-slate-400 uppercase text-[9px] block">Contato</strong>
                                  {prof.phone}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Aviso Legal Sóbrio */}
          <div className="rounded-2xl border border-slate-200 bg-slate-100 p-4 text-center">
            <p className="text-xs text-slate-500">
              <strong className="text-slate-700">Nota Informativa:</strong> As interações nesta área possuem caráter estritamente educativo, não substituindo consultas, diagnósticos ou acompanhamentos terapêuticos formais.
            </p>
          </div>
        </div>
      </main>

      {/* MODAL DE CADASTRO DO PROFISSIONAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 md:p-8 text-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              Fechar
            </button>

            {successMessage ? (
              <div className="text-center py-6 space-y-4">
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  Status: Concluído
                </span>
                <h3 className="text-xl font-bold text-slate-900">Cadastro Realizado</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Seu perfil já se encontra registrado e visível na respectiva especialidade dentro da plataforma.
                </p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="mt-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
                >
                  Visualizar Lista
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6 space-y-1">
                  <h2 className="text-lg font-bold text-slate-900">Cadastro de Profissional Parceiro</h2>
                  <p className="text-xs text-slate-500">
                    Preencha as informações abaixo para disponibilizar seu perfil profissional na plataforma.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Nome Completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Dr(a). Nome Sobrenome"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">E-mail *</label>
                      <input
                        type="email"
                        required
                        placeholder="profissional@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Telefone / WhatsApp</label>
                      <input
                        type="text"
                        placeholder="(00) 00000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Especialidade / Função *</label>
                      <select
                        value={formData.specialty}
                        onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none transition-all cursor-pointer"
                      >
                        <option value="Psicologia">Psicólogo(a)</option>
                        <option value="Terapia Ocupacional">Terapeuta Ocupacional</option>
                        <option value="Fonoaudiologia">Fonoaudiólogo(a)</option>
                        <option value="Psicopedagogia">Psicopedagogo(a)</option>
                        <option value="Direito / Advocacia">Advogado(a) Especializado(a)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Nº de Registro Profissional *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: CRP 00/000000"
                        value={formData.registration_number}
                        onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Resumo Profissional</label>
                    <textarea
                      rows={3}
                      placeholder="Descreva brevemente sua experiência e áreas de atuação..."
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs rounded-xl border border-slate-200 transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all disabled:opacity-50"
                    >
                      {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}