'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Sidebar from '@/components/Sidebar';

interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  profiles?: {
    full_name: string | null;
    role: string | null;
    avatar_url: string | null;
  } | null;
}

export default function ForumPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Geral');
  const [submitting, setSubmitting] = useState(false);

  const fetchPosts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setUserId(user.id);

    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles(full_name, role, avatar_url)')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPosts(data as unknown as Post[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !title.trim() || !content.trim()) return;

    setSubmitting(true);

    const { error } = await supabase.from('posts').insert([
      {
        user_id: userId,
        title,
        content,
        category,
      },
    ]);

    if (!error) {
      setTitle('');
      setContent('');
      await fetchPosts();
    }
    setSubmitting(false);
  };

  const handleDeletePost = async (postId: string) => {
    const { error } = await supabase.from('posts').delete().eq('id', postId);
    if (!error) {
      setPosts(posts.filter((p) => p.id !== postId));
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider font-sans">
        Carregando mural...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-100 selection:text-blue-900 font-sans antialiased">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        <div className="mx-auto max-w-4xl space-y-6">
          
          {/* Cabeçalho */}
          <header className="rounded-2xl bg-white p-6 md:p-8 border border-slate-200 shadow-sm space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Comunicação Interna
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Mural Geral
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Espaço compartilhado para publicação de comunicados, dúvidas, relatos e atualizações de toda a comunidade.
            </p>
          </header>

          {/* Form de publicação */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-sm">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">Nova Publicação</h2>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Título do assunto"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <textarea
                  rows={3}
                  placeholder="Escreva seu relato, comunicado ou dúvida..."
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none resize-none transition-colors"
                />
              </div>

              <div className="flex justify-between items-center pt-1">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="Geral">Geral</option>
                  <option value="Dúvida">Dúvida</option>
                  <option value="Relato">Relato</option>
                  <option value="Aviso">Aviso</option>
                </select>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Publicando...' : 'Publicar'}
                </button>
              </div>
            </form>
          </div>

          {/* Lista de publicações */}
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 text-xs">
                Nenhuma publicação no mural até o momento.
              </div>
            ) : (
              posts.map((post) => {
                const authorName = post.profiles?.full_name || 'Membro da Comunidade';
                const initial = authorName.charAt(0).toUpperCase();

                return (
                  <div
                    key={post.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 space-y-4 shadow-sm hover:border-blue-200 transition-colors"
                  >
                    {/* Cabeçalho do Post com Foto e Autor */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl border border-blue-100 bg-blue-50 flex items-center justify-center shrink-0 overflow-hidden text-blue-700 text-xs font-bold">
                          {post.profiles?.avatar_url ? (
                            <img
                              src={post.profiles.avatar_url}
                              alt={authorName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span>{initial}</span>
                          )}
                        </div>

                        <div>
                          <h3 className="font-bold text-slate-900 text-xs leading-tight">
                            {authorName}
                          </h3>
                          {post.profiles?.role && (
                            <span className="text-[10px] font-bold text-slate-500 tracking-wide uppercase">
                              {post.profiles.role}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-md tracking-wide uppercase">
                          {post.category}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(post.created_at).toLocaleDateString('pt-BR')}
                        </span>
                        {userId === post.user_id && (
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="text-xs text-red-500 hover:text-red-700 font-semibold transition-colors ml-1"
                          >
                            Excluir
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-sm font-bold text-slate-900">{post.title}</h4>
                      <p className="text-slate-600 text-xs whitespace-pre-line leading-relaxed">
                        {post.content}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}