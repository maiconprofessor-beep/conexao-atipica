'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function CadastrarRecursoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Clínicas',
    city: 'Caxias do Sul',
    state: 'RS',
    address: '',
    phone: '',
    description: '',
    lat: '',
    lng: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const { error } = await supabase.from('resources_map').insert([
        {
          name: formData.name,
          category: formData.category,
          city: formData.city,
          state: formData.state,
          address: formData.address,
          phone: formData.phone,
          description: formData.description,
          lat: parseFloat(formData.lat) || -29.168,
          lng: parseFloat(formData.lng) || -51.179,
        },
      ]);

      if (error) throw error;

      alert('Local cadastrado com sucesso!');
      router.push('/mapa');
    } catch (err: any) {
      alert('Erro ao cadastrar local: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0b0f19] text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                Guia Local
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                ✨ Cadastrar Novo Recurso
              </h1>
            </div>
            <Link
              href="/mapa"
              className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl"
            >
              ← Voltar ao Mapa
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Nome do Local *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Clínica Espaço Crescer"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Categoria *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all cursor-pointer"
                >
                  <option value="Clínicas">🩺 Clínicas</option>
                  <option value="Escolas inclusivas">🏫 Escolas inclusivas</option>
                  <option value="Associações">🤝 Associações</option>
                  <option value="Centros de atendimento">🏥 Centros de atendimento</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Telefone / WhatsApp
                </label>
                <input
                  type="text"
                  placeholder="(54) 99999-9999"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Endereço Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Rua, número - Bairro"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Cidade *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Cidade"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Latitude (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="-29.168"
                  value={formData.lat}
                  onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Longitude (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="-51.179"
                  value={formData.lng}
                  onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Descrição do Serviço
              </label>
              <textarea
                rows={4}
                placeholder="Descreva as especialidades ou informações relevantes..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm rounded-2xl transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Cadastrando Local...' : 'Salvar Local no Mapa'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}