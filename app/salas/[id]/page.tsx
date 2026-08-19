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
  'espectro-nivel-1': 'Espectro Nível 1',
  'espectro-nivel-2': 'Espectro Nível 2',
  'espectro-nivel-3': 'Espectro Nível 3',
  'tdah': 'TDAH',
  'sindrome-de-down': 'Síndrome de Down',
  'deficiencia-intelectual': 'Deficiência Intelectual',
  'multiplas-deficiencias': 'Múltiplas Deficiências',
  'diagnostico-recente': 'Diagnóstico Recente',
};

export default function SalaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const salaId = resolvedParams.id;
  const salaNome = NORMALIZE_TITLES[salaId] || 'Sala de Apoio';

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
      .eq('category', salaNome)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPosts(data as unknown as Post[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [salaId]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !title.trim() || !content.trim()) return;

    setSubmitting(true);

    const { error } = await supabase.from('posts').insert([
      {
        user_id: userId,
        title,
        content,
        category: salaNome,
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
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        <p className="text-sm font-medium">Carregando sala...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-100 selection:text-blue-900 font-sans antialiased">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        <div className="mx-auto max-w-4xl space-y-6">
          
          {/* Header da Sala */}
          <div className="rounded-2xl bg-white p-6 md:p-8 border border-slate-200 shadow-sm space-y-2">
            <button 
              onClick={() => router.push('/salas')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-1"
            >
              ← Voltar para todas as salas
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Sala: {salaNome}
            </h1>
          </div>

          {/* Card de Publicação */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">Publicar nesta sala</h2>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <input
                type="text"
                placeholder="Título do assunto"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
              />
              <textarea
                rows={3}
                placeholder={`Compartilhe sua dúvida ou relato na sala de ${salaNome}...`}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none transition-all resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-all shadow-sm"
                >
                  {submitting ? 'Enviando...' : 'Publicar na Sala'}
                </button>
              </div>
            </form>
          </div>

          {/* Feed de Postagens */}
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 text-xs shadow-sm">
                Nenhum tópico criado nesta sala ainda. Seja o primeiro a compartilhar!
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-sm hover:border-slate-300 transition-all">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-blue-200 bg-slate-100 flex items-center justify-center shrink-0">
                        {post.profiles?.avatar_url ? (
                          <img
                            src={post.profiles.avatar_url}
                            alt={post.profiles.full_name || 'Autor'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-base text-slate-400">👤</span>
                        )}
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-900 text-xs leading-tight">
                          {post.profiles?.full_name || 'Membro da Comunidade'}
                        </h3>
                        {post.profiles?.role && (
                          <span className="inline-block mt-0.5 text-[10px] text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                            {post.profiles.role}
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="text-[11px] font-medium text-slate-400">
                      {new Date(post.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-sm font-bold text-slate-900">{post.title}</h4>
                    <p className="text-slate-600 text-xs whitespace-pre-line leading-relaxed">{post.content}</p>
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