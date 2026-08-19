'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { label: 'Painel', href: '/dashboard' },
    { label: 'Mapa de Recursos', href: '/mapa' },
    { label: 'Salas por Perfil', href: '/salas' },
    { label: 'Biblioteca', href: '/biblioteca' },
    { label: 'Apoio Profissional', href: '/apoio' },
    { label: 'Agenda Inteligente', href: '/agenda' },
    { label: 'Mural Geral', href: '/mural' },
    { label: 'Meu Perfil', href: '/perfil' },
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Erro ao sair:', error);
      router.push('/');
    }
  };

  return (
    <aside
      className={`sticky top-0 h-screen shrink-0 bg-white border-r border-slate-100 transition-all duration-300 flex flex-col z-40 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3.5 top-7 bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 w-7 h-7 rounded-full flex items-center justify-center text-xs shadow-xs transition-colors cursor-pointer z-50"
        title={collapsed ? 'Expandir menu' : 'Recolher menu'}
      >
        {collapsed ? '›' : '‹'}
      </button>

      {}
      <div className="p-6 flex items-center">
        <Link href="/dashboard" className="flex flex-col whitespace-nowrap overflow-hidden">
          <span className="font-black text-blue-600 text-xl leading-tight tracking-tight">
            Atípica
          </span>
          {!collapsed && (
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
              Rede & Comunidade
            </span>
          )}
        </Link>
      </div>

      {}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-150 ${
                isActive
                  ? 'bg-blue-50/80 text-blue-600 shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {}
      <div className="p-3 border-t border-slate-100 space-y-1">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-start px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-150 cursor-pointer"
          title={collapsed ? 'Sair' : undefined}
        >
          <span className="truncate">Sair</span>
        </button>

        {!collapsed && (
          <p className="text-[10px] text-slate-400 text-center pt-2">
            © Conexão Atípica
          </p>
        )}
      </div>
    </aside>
  );
}