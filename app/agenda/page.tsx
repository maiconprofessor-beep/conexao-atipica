'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { supabase } from '@/lib/supabaseClient';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  event_time?: string;
  category: string;
  location_link?: string;
}

export default function AgendaPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: new Date().toISOString().split('T')[0],
    event_time: '19:00',
    category: 'Eventos da plataforma',
    location_link: '',
  });

  const categorias = [
    { nome: 'Eventos da plataforma', chave: 'Eventos da plataforma' },
    { nome: 'Datas importantes', chave: 'Datas importantes' },
    { nome: 'Palestras', chave: 'Palestras' },
    { nome: 'Reuniões virtuais', chave: 'Reuniões virtuais' },
  ];

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;
      if (data) setEvents(data);
    } catch (err: any) {
      console.error('Erro ao buscar eventos:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase.from('events').insert([formData]);
      if (error) throw error;

      setIsModalOpen(false);
      setFormData({
        title: '',
        description: '',
        event_date: new Date().toISOString().split('T')[0],
        event_time: '19:00',
        category: 'Eventos da plataforma',
        location_link: '',
      });
      fetchEvents();
    } catch (err: any) {
      alert('Erro ao agendar evento: ' + (err.message || 'Tente novamente.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-100 selection:text-blue-900 font-sans antialiased">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        <div className="mx-auto max-w-5xl space-y-6">
          
          {/* Cabeçalho */}
          <header className="rounded-2xl bg-white p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                Organização & Programação
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Agenda Oficial
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm max-w-xl leading-relaxed">
                Acompanhe encontros, palestras, marcos e reuniões importantes agendados para a comunidade.
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="whitespace-nowrap px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all self-start md:self-auto cursor-pointer"
            >
              + Novo Evento
            </button>
          </header>

          {/* Legenda de Categorias */}
          <div className="flex flex-wrap gap-2 pt-1">
            {categorias.map((cat) => (
              <span
                key={cat.nome}
                className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-medium shadow-2xs"
              >
                {cat.nome}
              </span>
            ))}
          </div>

          {/* Lista de Eventos Agendados */}
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs tracking-wider uppercase font-medium">
              Carregando compromissos...
            </div>
          ) : events.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-2 shadow-sm">
              <h3 className="font-semibold text-sm text-slate-900">Nenhum evento agendado</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Novos encontros e reuniões virtuais serão disponibilizados nesta lista em breve.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 hover:border-slate-300 transition-all shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 tracking-wide">
                        {evt.category}
                      </span>

                      <div className="text-xs text-slate-500 font-medium bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                        {new Date(evt.event_date + 'T00:00:00').toLocaleDateString('pt-BR')} {evt.event_time ? `às ${evt.event_time.slice(0, 5)}` : ''}
                      </div>
                    </div>

                    <h3 className="font-bold text-base text-slate-900">{evt.title}</h3>

                    {evt.description && (
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {evt.description}
                      </p>
                    )}
                  </div>

                  {evt.location_link && (
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px]">Local / Plataforma</span>
                      <a
                        href={evt.location_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 font-semibold text-xs underline underline-offset-4"
                      >
                        Acessar Link
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* MODAL DE NOVO EVENTO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 md:p-8 text-slate-800 shadow-xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-sm font-semibold cursor-pointer"
            >
              Fechar
            </button>

            <div className="mb-6 space-y-1">
              <h2 className="text-lg font-bold text-slate-900">Cadastrar Novo Evento</h2>
              <p className="text-xs text-slate-500">
                Adicione datas e reuniões para exibição no calendário da comunidade.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Título do Evento *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Roda de Conversa sobre Comunicação"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Data *</label>
                  <input
                    type="date"
                    required
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Horário</label>
                  <input
                    type="time"
                    value={formData.event_time}
                    onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de Evento *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                >
                  {categorias.map((c) => (
                    <option key={c.chave} value={c.chave}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Link da Sala / Transmissão</label>
                <input
                  type="url"
                  placeholder="https://meet.google.com/..."
                  value={formData.location_link}
                  onChange={(e) => setFormData({ ...formData, location_link: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Descrição / Detalhes</label>
                <textarea
                  rows={3}
                  placeholder="Descreva sobre o que será tratado neste encontro..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none transition-all resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs rounded-xl border border-slate-200 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {submitting ? 'Salvando...' : 'Salvar Evento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}