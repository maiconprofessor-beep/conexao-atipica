'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { supabase } from '@/lib/supabaseClient';

interface ResourceLocation {
  id: string;
  name: string;
  category: string;
  city: string;
  state: string;
  address: string;
  phone?: string;
  description?: string;
  lat: number;
  lng: number;
}

export default function MapaRecursosPage() {
  const [locations, setLocations] = useState<ResourceLocation[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [selectedCity, setSelectedCity] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<ResourceLocation | null>(null);

  const categorias = [
    { nome: 'Clínicas' },
    { nome: 'Escolas inclusivas' },
    { nome: 'Associações' },
    { nome: 'Centros de atendimento' },
  ];

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('resources_map').select('*');

      if (error) throw error;
      if (data) {
        setLocations(data);
        if (data.length > 0) setSelectedItem(data[0]);
      }
    } catch (err: any) {
      console.error('Erro ao buscar recursos:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const cidadesDisponiveis = Array.from(new Set(locations.map((loc) => loc.city)));

  const filteredLocations = locations.filter((loc) => {
    const matchCategory = selectedCategory === 'Todas' || loc.category === selectedCategory;
    const matchCity = selectedCity === 'Todas' || loc.city === selectedCity;
    const matchText =
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (loc.description && loc.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchCategory && matchCity && matchText;
  });

  const getCategoryBadge = (catName: string) => {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wide uppercase bg-blue-50 text-blue-700 border border-blue-100">
        {catName}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-100 selection:text-blue-900 font-sans antialiased">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        <div className="mx-auto max-w-7xl space-y-6">
          
          {/* Header Claro */}
          <div className="rounded-2xl bg-white p-6 md:p-8 border border-slate-200 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Guia Local & Mapeamento
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Mapa de Recursos
                </h1>
                <p className="text-slate-600 text-xs sm:text-sm max-w-2xl leading-relaxed">
                  Consulte e conecte-se a unidades de atendimento, instituições de ensino, associações e centros de apoio técnico na sua região.
                </p>
              </div>

              {/* Botão de Ação */}
              <Link
                href="/mapa/cadastrar"
                className="inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold text-white transition-all rounded-xl bg-blue-600 hover:bg-blue-700 shrink-0 shadow-sm"
              >
                Cadastrar Novo Local
              </Link>
            </div>
          </div>

          {/* Área de Filtros */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              
              {/* Campo de Busca */}
              <div className="md:col-span-5">
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                  Buscar no mapa
                </label>
                <input
                  type="text"
                  placeholder="Nome, endereço ou palavra-chave..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Categoria */}
              <div className="md:col-span-4">
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                  Categoria
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="Todas">Todas as Categorias</option>
                  {categorias.map((c) => (
                    <option key={c.nome} value={c.nome}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cidade */}
              <div className="md:col-span-3">
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                  Cidade
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="Todas">Todas as Cidades</option>
                  {cidadesDisponiveis.map((cidade) => (
                    <option key={cidade} value={cidade}>
                      {cidade}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Layout Principal de 2 Colunas */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Coluna Esquerda: Listagem */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Locais Disponíveis ({filteredLocations.length})
                </h2>
              </div>

              {loading ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-2 shadow-sm">
                  <p className="text-xs text-slate-500 font-medium">Carregando dados do mapa...</p>
                </div>
              ) : filteredLocations.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-2 shadow-sm">
                  <p className="font-semibold text-xs text-slate-800">Nenhum resultado localizado</p>
                  <p className="text-[11px] text-slate-500">
                    Ajuste os filtros de pesquisa para visualizar novos pontos de apoio.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
                  {filteredLocations.map((loc) => {
                    const isSelected = selectedItem?.id === loc.id;
                    return (
                      <div
                        key={loc.id}
                        onClick={() => setSelectedItem(loc)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                          isSelected
                            ? 'bg-blue-50/50 border-blue-400 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          {getCategoryBadge(loc.category)}
                          <span className="text-[11px] font-semibold text-slate-400">
                            {loc.city}/{loc.state}
                          </span>
                        </div>

                        <div>
                          <h3 className="font-bold text-sm text-slate-900">
                            {loc.name}
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{loc.address}</p>
                        </div>

                        {loc.phone && (
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                            <span>{loc.phone}</span>
                            <span className="text-blue-600 font-semibold hover:underline">
                              Detalhes
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Coluna Direita: Detalhes & Mapa Embed */}
            <div className="lg:col-span-7">
              {selectedItem ? (
                <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6 space-y-5 shadow-sm">
                  
                  {/* Topo do Detalhamento */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="space-y-1">
                      {getCategoryBadge(selectedItem.category)}
                      <h2 className="text-lg font-bold text-slate-900 mt-1">{selectedItem.name}</h2>
                    </div>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${selectedItem.name} ${selectedItem.address} ${selectedItem.city}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors border border-slate-200 shrink-0 self-start sm:self-auto"
                    >
                      Abrir no Google Maps
                    </a>
                  </div>

                  {/* Blocos de Informação */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Endereço
                      </span>
                      <p className="text-xs font-semibold text-slate-800">{selectedItem.address}</p>
                      <p className="text-[11px] text-slate-500">{selectedItem.city} - {selectedItem.state}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Contato / Telefone
                      </span>
                      <p className="text-xs font-semibold text-slate-800">{selectedItem.phone || 'Não informado'}</p>
                      <p className="text-[11px] text-slate-500">Atendimento presencial / local</p>
                    </div>
                  </div>

                  {selectedItem.description && (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Sobre o Local
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed">{selectedItem.description}</p>
                    </div>
                  )}

                  {/* Mapa Embarcado */}
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 h-[280px] bg-slate-100">
                    <iframe
                      title="Mapa do Local"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://maps.google.com/maps?q=${selectedItem.lat},${selectedItem.lng}&z=15&output=embed`}
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                  <p className="text-xs text-slate-500">
                    Selecione um local na lista ao lado para visualizar os detalhes de atendimento e endereço.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}