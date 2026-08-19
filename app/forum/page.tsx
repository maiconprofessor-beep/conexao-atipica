'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { supabase } from '@/lib/supabaseClient';

interface Reply {
  id: string;
  created_at: string;
  user_name: string;
  content: string;
}

interface Post {
  id: string;
  created_at: string;
  title: string;
  content: string;
  author_name?: string;
  category: string;
  post_replies?: Reply[];
}

export default function MuralGeralPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingPost, setSubmittingPost] = useState(false);

  // Estados para novo post
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Dúvidas Gerais');
  const [authorName, setAuthorName] = useState('');

  // Estado para respostas ativas por post
  const [replyInputs, setReplyInputs] = useState<{ [key: string]: string }>({});
  const [replyAuthors, setReplyAuthors] = useState<{ [key: string]: string }>({});
  const [submittingReplyId, setSubmittingReplyId] = useState<string | null>(null);

  const assuntos = [
    'Dúvidas Gerais',
    'Troca de Experiências',
    'Notícias & Informativos',
    'Desabafos & Apoio',
    'Sugestões',
  ];

  // Buscar Posts e suas Respostas
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          post_replies (
            id,
            created_at,
            user_name,
            content
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setPosts(data);
    } catch (err: any) {
      console.error('Erro ao buscar publicações:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Criar Novo Post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setSubmittingPost(true);
    try {
      const { error } = await supabase.from('posts').insert([
        {
          title: newTitle,
          content: newContent,
          category: newCategory,
          author_name: authorName.trim() || 'Membro da Comunidade',
        },
      ]);

      if (error) throw error;

      setNewTitle('');
      setNewContent('');
      setAuthorName('');
      setNewCategory('Dúvidas Gerais');
      fetchPosts();
    } catch (err: any) {
      alert('Erro ao publicar: ' + (err.message || 'Tente novamente.'));
    } finally {
      setSubmittingPost(false);
    }
  };

  // Enviar Resposta para um Post
  const handleSendReply = async (postId: string) => {
    const text = replyInputs[postId];
    if (!text || !text.trim()) return;

    setSubmittingReplyId(postId);
    try {
      const author = replyAuthors[postId]?.trim() || 'Membro da Comunidade';

      const { error } = await supabase.from('post_replies').insert([
        {
          post_id: postId,
          content: text.trim(),
          user_name: author,
        },
      ]);

      if (error) throw error;

      setReplyInputs({ ...replyInputs, [postId]: '' });
      fetchPosts();
    } catch (err: any) {
      alert('Erro ao enviar resposta: ' + (err.message || 'Tente novamente.'));
    } finally {
      setSubmittingReplyId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-100 selection:text-blue-900 font-sans antialiased">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        <div className="mx-auto max-w-4xl space-y-6">
          
          {/* Cabeçalho Claro e Limpo */}
          <header className="rounded-2xl bg-white p-6 md:p-8 border border-slate-200 shadow-sm space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Espaço Aberto
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Mural Geral
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Compartilhe ideias, tire dúvidas, troque experiências e interaja com as publicações dos membros da comunidade.
            </p>
          </header>

          {/* Formulário para Nova Publicação */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-sm">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">Nova Publicação</h2>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Seu Nome / Apelido
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Maria S."
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Assunto / Categoria *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
                  >
                    {assuntos.map((nome) => (
                      <option key={nome} value={nome}>
                        {nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Título da Publicação *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Resuma o tema da sua mensagem..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Mensagem *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Escreva detalhes sobre o que gostaria de abordar ou perguntar..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none resize-none transition-colors"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={submittingPost}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors disabled:opacity-50"
                >
                  {submittingPost ? 'Publicando...' : 'Publicar no Mural'}
                </button>
              </div>
            </form>
          </div>

          {/* Feed de Posts do Mural */}
          {loading ? (
            <div className="flex justify-center py-12 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              Carregando mural de mensagens...
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 text-xs">
              Nenhuma publicação cadastrada até o momento.
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => {
                const author = post.author_name || 'Membro da Comunidade';
                const initial = author.charAt(0).toUpperCase();

                return (
                  <div
                    key={post.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 space-y-4 shadow-sm hover:border-blue-200 transition-colors"
                  >
                    {/* Cabeçalho do Post */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl border border-blue-100 bg-blue-50 flex items-center justify-center shrink-0 text-blue-700 text-xs font-bold">
                          {initial}
                        </div>
                        <div>
                          <h3 className="font-bold text-xs text-slate-900 leading-tight">
                            {author}
                          </h3>
                          <span className="text-[11px] text-slate-400">
                            {new Date(post.created_at).toLocaleDateString('pt-BR')} às{' '}
                            {new Date(post.created_at).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Badge do Assunto */}
                      <span className="self-start md:self-auto text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-md tracking-wide uppercase">
                        {post.category || 'Geral'}
                      </span>
                    </div>

                    {/* Conteúdo do Post */}
                    <div className="space-y-1.5">
                      <h4 className="text-sm font-bold text-slate-900">{post.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                        {post.content}
                      </p>
                    </div>

                    {/* SEÇÃO DE RESPOSTAS / COMENTÁRIOS */}
                    <div className="pt-3 border-t border-slate-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Respostas ({post.post_replies?.length || 0})
                        </span>
                      </div>

                      {/* Lista de Respostas */}
                      {post.post_replies && post.post_replies.length > 0 && (
                        <div className="space-y-2 pl-3 border-l-2 border-slate-100">
                          {post.post_replies.map((reply) => (
                            <div
                              key={reply.id}
                              className="rounded-xl bg-slate-50 border border-slate-200/60 p-3 space-y-1"
                            >
                              <div className="flex justify-between items-center text-[11px]">
                                <span className="font-bold text-slate-800">{reply.user_name}</span>
                                <span className="text-slate-400">
                                  {new Date(reply.created_at).toLocaleDateString('pt-BR')}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed">{reply.content}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Campo de Resposta (Input) */}
                      <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-2.5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <input
                            type="text"
                            placeholder="Seu nome (opcional)"
                            value={replyAuthors[post.id] || ''}
                            onChange={(e) =>
                              setReplyAuthors({ ...replyAuthors, [post.id]: e.target.value })
                            }
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-colors"
                          />
                          <div className="md:col-span-2 flex space-x-2">
                            <input
                              type="text"
                              placeholder="Escreva uma resposta..."
                              value={replyInputs[post.id] || ''}
                              onChange={(e) =>
                                setReplyInputs({ ...replyInputs, [post.id]: e.target.value })
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSendReply(post.id);
                              }}
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-colors"
                            />
                            <button
                              onClick={() => handleSendReply(post.id)}
                              disabled={submittingReplyId === post.id}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
                            >
                              {submittingReplyId === post.id ? '...' : 'Responder'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}