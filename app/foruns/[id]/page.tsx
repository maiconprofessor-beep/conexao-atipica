'use client';

import { useEffect, useState, use } from 'react';
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

const NORMALIZE_TITLES: Record<string, string> = {
  'inclusao-escolar': 'Inclusão Escolar',
  'terapias': 'Terapias',
  'direitos-e-beneficios': 'Direitos e Benefícios',
  'saude-mental-dos-pais': 'Saúde Mental dos Pais',
  'alimentacao': 'Alimentação',
  'desenvolvimento-infantil': 'Desenvolvimento Infantil',
  'vida-adulta-e-autonomia': 'Vida Adulta e Autonomia',
  'mercado-de-trabalho': 'Mercado de Trabalho',
};

export default function ForumDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const forumId = resolvedParams.id;
  const forumNome = NORMALIZE_TITLES[forumId] || 'Fórum Temático';

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
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
      .eq('category', forumNome)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPosts(data as unknown as Post[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [forumId]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !title.trim() || !content.trim()) return;

    setSubmitting(true);

    const { error } = await supabase.from('posts').insert([
      {
        user_id: userId,
        title,
        content,
        category: forumNome,
      },
    ]);

    if (!error) {
      setTitle('');
      setContent('');
      await fetchPosts();
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        <p className="text-lg">Carregando fórum...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-900 text-white">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <button 
                onClick={() => router.push('/foruns')}
                className="text-xs text-indigo-400 hover:underline mb-2 block"
              >
                ← Voltar para todos os fóruns
              </button>
              <h1 className="text-2xl font-bold text-white">Fórum: {forumNome}</h1>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-6">
            <h2 className="text-lg font-bold mb-3">Publicar neste fórum</h2>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <input
                type="text"
                placeholder="Título da dúvida ou assunto"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none text-sm"
              />
              <textarea
                rows={3}
                placeholder={`Escreva seu relato ou dúvida sobre ${forumNome}...`}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none text-sm"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition-all"
                >
                  {submitting ? 'Enviando...' : 'Publicar no Fórum'}
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="rounded-xl border border-slate-800 bg-slate-800/20 p-8 text-center text-slate-400">
                Nenhuma publicação neste fórum temático ainda. Seja o primeiro a criar um tópico!
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="rounded-xl border border-slate-800 bg-slate-800/40 p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-indigo-500/50 bg-slate-950 flex items-center justify-center shrink-0">
                        {post.profiles?.avatar_url ? (
                          <img
                            src={post.profiles.avatar_url}
                            alt={post.profiles.full_name || 'Autor'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-lg">👤</span>
                        )}
                      </div>

                      <div>
                        <h3 className="font-bold text-white text-sm leading-tight">
                          {post.profiles?.full_name || 'Membro da Comunidade'}
                        </h3>
                        {post.profiles?.role && (
                          <span className="text-[11px] text-indigo-400 font-medium">
                            {post.profiles.role}
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="text-xs text-slate-500">
                      {new Date(post.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white mb-1">{post.title}</h4>
                    <p className="text-slate-300 text-sm whitespace-pre-line leading-relaxed">{post.content}</p>
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