'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { supabase } from '@/lib/supabaseClient';

interface Profile {
  id: string;
  full_name?: string;
  fullName?: string;
  role: string;
  updated_at?: string;
}

interface Post {
  id: string;
  author_name: string;
  author_role: string;
  category: string;
  content: string;
  created_at: string;
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'posts'>('users');

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profile?.role === 'admin') {
            setIsAdmin(true);
            fetchData();
          }
        }
      } catch (err) {
        console.error('Erro ao verificar permissão:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  const fetchData = async () => {
    const { data: usersData } = await supabase.from('profiles').select('*');
    if (usersData) setProfiles(usersData);

    const { data: postsData } = await supabase.from('posts').select('*');
    if (postsData) setPosts(postsData);
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (!error) {
        setProfiles((prev) =>
          prev.map((p) => (p.id === userId ? { ...p, role: newRole } : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('Excluir esta publicação permanentemente?')) return;

    try {
      const { error } = await supabase.from('posts').delete().eq('id', postId);
      if (!error) {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-xs font-bold text-slate-500">
        Verificando credenciais de administrador...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        <div className="mx-auto max-w-5xl space-y-6">
          
          <header className="rounded-3xl bg-slate-900 text-white p-6 md:p-8 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-500 text-white">
                  Acesso Restrito
                </span>
                <h1 className="text-2xl sm:text-3xl font-black mt-2">Painel do Administrador</h1>
                <p className="text-slate-400 text-xs sm:text-sm mt-1">
                  Gerenciamento global de usuários, moderadores e conteúdo do sistema.
                </p>
              </div>
              <div className="text-4xl">👑</div>
            </div>
          </header>

          {!isAdmin ? (
            <div className="rounded-3xl bg-red-50 border border-red-200 p-8 text-center space-y-2">
              <h2 className="text-lg font-bold text-red-800">Acesso Não Autorizado</h2>
              <p className="text-xs text-red-600 max-w-md mx-auto">
                Seu usuário não possui o cargo de <strong>admin</strong> na tabela <code>profiles</code>. Altere a coluna <code>role</code> para <code>admin</code> no Supabase para acessar esta página.
              </p>
            </div>
          ) : (
            <>
              {/* NAVEGAÇÃO DE ABAS */}
              <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
                <button
                  onClick={() => setActiveTab('users')}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'users'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  👥 Usuários ({profiles.length})
                </button>
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'posts'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  📝 Moderação de Posts ({posts.length})
                </button>
              </div>

              {/* ABA DE USUÁRIOS */}
              {activeTab === 'users' && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Gerenciar Permissões de Usuários
                  </h2>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold">
                          <th className="py-3 px-2">Nome</th>
                          <th className="py-3 px-2">Cargo Atual</th>
                          <th className="py-3 px-2">Alterar Cargo</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {profiles.map((profile) => (
                          <tr key={profile.id} className="hover:bg-slate-50/50">
                            <td className="py-3 px-2 font-bold text-slate-800">
                              {profile.full_name || profile.fullName || 'Usuário Sem Nome'}
                            </td>
                            <td className="py-3 px-2">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                profile.role === 'admin'
                                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                  : 'bg-slate-100 text-slate-700'
                              }`}>
                                {profile.role || 'Pai/Mãe'}
                              </span>
                            </td>
                            <td className="py-3 px-2">
                              <select
                                value={profile.role || 'Pai/Mãe'}
                                onChange={(e) => handleUpdateRole(profile.id, e.target.value)}
                                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 font-medium focus:bg-white focus:border-blue-500 focus:outline-none cursor-pointer"
                              >
                                <option value="Pai/Mãe">Pai/Mãe</option>
                                <option value="Pessoa Neurodivergente">Pessoa Neurodivergente</option>
                                <option value="Profissional da Saúde">Profissional da Saúde</option>
                                <option value="Educador">Educador</option>
                                <option value="admin">👑 Admin Global</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ABA DE POSTS */}
              {activeTab === 'posts' && (
                <div className="space-y-3">
                  {posts.length === 0 ? (
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center text-xs text-slate-500">
                      Nenhuma publicação encontrada para moderar.
                    </div>
                  ) : (
                    posts.map((post) => (
                      <div
                        key={post.id}
                        className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs space-y-2 flex items-start justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">{post.author_name}</span>
                            <span className="text-[10px] text-slate-400">• {post.category}</span>
                          </div>
                          <p className="text-xs text-slate-700">{post.content}</p>
                        </div>

                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors whitespace-nowrap cursor-pointer"
                        >
                          🗑️ Excluir
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}

        </div>
      </main>
    </div>
  );
}