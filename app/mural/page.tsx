'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { supabase } from '@/lib/supabaseClient';

interface Comment {
  id: string;
  author_name: string;
  author_role: string;
  content: string;
  created_at: string;
  user_id?: string;
}

interface Post {
  id: string;
  user_id?: string;
  author_name: string;
  author_role: string;
  category: string;
  content: string;
  created_at: string;
  likes: number;
  comments: Comment[];
}

export default function MuralPage() {
  const [posts, setPosts] = useState<Post[]>([
    
  ]);

  const [newPostContent, setNewPostContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Geral');
  const [filterCategory, setFilterCategory] = useState('Todas');
  const [isPublishing, setIsPublishing] = useState(false);
  
  const [currentUserName, setCurrentUserName] = useState('Membro Conexão');
  const [currentUserRole, setCurrentUserRole] = useState('Pai/Mãe');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Armazena o ID dos posts cujos comentários estão abertos na tela
  const [expandedPostIds, setExpandedPostIds] = useState<Record<string, boolean>>({});

  // Armazena os textos de novos comentários por ID de post
  const [newCommentTexts, setNewCommentTexts] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setCurrentUserId(session.user.id);
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, role')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profile) {
            setCurrentUserName(profile.full_name || 'Membro Conexão');
            setCurrentUserRole(profile.role || 'Pai/Mãe');
          }
        }
      } catch (err) {
        console.error('Erro ao buscar dados do perfil:', err);
      }
    };

    fetchUser();
  }, []);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    setIsPublishing(true);

    const newPost: Post = {
      id: Date.now().toString(),
      user_id: currentUserId || undefined,
      author_name: currentUserName,
      author_role: currentUserRole,
      category: selectedCategory,
      content: newPostContent,
      created_at: 'Agora mesmo',
      likes: 0,
      comments: [],
    };

    setTimeout(() => {
      setPosts([newPost, ...posts]);
      setNewPostContent('');
      setIsPublishing(false);
    }, 300);
  };

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const toggleComments = (postId: string) => {
    setExpandedPostIds((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleAddComment = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = newCommentTexts[postId];
    if (!text || !text.trim()) return;

    const newComment: Comment = {
      id: 'c_' + Date.now(),
      author_name: currentUserName,
      author_role: currentUserRole,
      content: text.trim(),
      created_at: 'Agora mesmo',
      user_id: currentUserId || undefined,
    };

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      })
    );

    // Limpa o campo do comentário
    setNewCommentTexts((prev) => ({ ...prev, [postId]: '' }));

    // Garante que a seção fique aberta ao comentar
    setExpandedPostIds((prev) => ({ ...prev, [postId]: true }));
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.filter((c) => c.id !== commentId),
          };
        }
        return post;
      })
    );
  };

  const filteredPosts =
    filterCategory === 'Todas'
      ? posts
      : posts.filter((post) => post.category === filterCategory);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        <div className="mx-auto max-w-4xl space-y-6">
          
          {/* HEADER DA PÁGINA */}
          <header className="rounded-3xl bg-white p-6 md:p-8 border border-slate-200/80 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Mural Geral
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  Espaço livre de acolhimento, trocas de experiências e apoio mútuo.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold w-fit">
                💬 {posts.length} publicações
              </span>
            </div>
          </header>

          {/* FORMULÁRIO DE NOVA PUBLICAÇÃO */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                👥
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{currentUserName}</p>
                <p className="text-[11px] text-slate-400 font-medium">{currentUserRole}</p>
              </div>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3">
              <textarea
                rows={3}
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Compartilhe uma dúvida, vitória ou desabafo com a comunidade..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none transition-all resize-none"
              />

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-600 whitespace-nowrap">
                    Categoria:
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 font-medium focus:bg-white focus:border-blue-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Geral">Geral</option>
                    <option value="Dicas de Rotina">Dicas de Rotina</option>
                    <option value="Orientação">Orientação</option>
                    <option value="Vivência">Vivência</option>
                    <option value="Escola & Educação">Escola & Educação</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isPublishing || !newPostContent.trim()}
                  className="rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 text-xs shadow-md shadow-blue-500/10 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isPublishing ? 'Publicando...' : 'Publicar no Mural'}
                </button>
              </div>
            </form>
          </div>

          {/* FILTRO DE CATEGORIAS */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {['Todas', 'Geral', 'Dicas de Rotina', 'Orientação', 'Vivência', 'Escola & Educação'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* LISTA DE POSTAGENS */}
          <div className="space-y-4">
            {filteredPosts.map((post) => {
              const isExpanded = !!expandedPostIds[post.id];
              const commentCount = post.comments.length;

              return (
                <article
                  key={post.id}
                  className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-3 hover:border-slate-300 transition-all"
                >
                  {/* CABEÇALHO DO POST */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                        👤
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-900">{post.author_name}</h3>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {post.author_role} • {post.created_at}
                        </p>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                      {post.category}
                    </span>
                  </div>

                  {/* CONTEÚDO DO POST */}
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal pt-1">
                    {post.content}
                  </p>

                  {/* BOTÕES DE AÇÃO */}
                  <div className="flex items-center gap-4 pt-2 border-t border-slate-100 text-xs">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 font-bold transition-colors cursor-pointer"
                    >
                      <span>❤️</span>
                      <span>{post.likes}</span>
                    </button>

                    <button
                      onClick={() => toggleComments(post.id)}
                      className={`flex items-center gap-1.5 font-bold transition-colors cursor-pointer ${
                        isExpanded ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'
                      }`}
                    >
                      <span>💬</span>
                      <span>{commentCount} {commentCount === 1 ? 'comentário' : 'comentários'}</span>
                    </button>
                  </div>

                  {/* SEÇÃO DE COMENTÁRIOS EXPANSÍVEL */}
                  {isExpanded && (
                    <div className="pt-3 mt-3 border-t border-slate-100 space-y-4">
                      
                      {/* LISTA DE COMENTÁRIOS EXISTENTES */}
                      {post.comments.length > 0 ? (
                        <div className="space-y-3 pl-2 sm:pl-4 border-l-2 border-slate-100">
                          {post.comments.map((comment) => (
                            <div
                              key={comment.id}
                              className="rounded-2xl bg-slate-50/80 p-3.5 border border-slate-100 space-y-1.5 relative group"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center">
                                    👤
                                  </div>
                                  <span className="text-xs font-bold text-slate-900">
                                    {comment.author_name}
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    • {comment.author_role}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-slate-400">
                                    {comment.created_at}
                                  </span>

                                  {/* BOTÃO EXCLUIR COMENTÁRIO */}
                                  <button
                                    onClick={() => handleDeleteComment(post.id, comment.id)}
                                    className="text-[11px] font-bold text-slate-400 hover:text-red-600 transition-colors cursor-pointer px-1.5 py-0.5 rounded-md hover:bg-red-50"
                                    title="Excluir comentário"
                                  >
                                    🗑️ Excluir
                                  </button>
                                </div>
                              </div>

                              <p className="text-xs text-slate-700 leading-normal pl-8">
                                {comment.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic py-1 pl-2">
                          Nenhum comentário ainda. Seja o primeiro a comentar!
                        </p>
                      )}

                      {/* FORMULÁRIO DE NOVO COMENTÁRIO */}
                      <form
                        onSubmit={(e) => handleAddComment(post.id, e)}
                        className="flex items-center gap-2 pt-1"
                      >
                        <input
                          type="text"
                          placeholder="Escreva um comentário carinhoso e respeitoso..."
                          value={newCommentTexts[post.id] || ''}
                          onChange={(e) =>
                            setNewCommentTexts({
                              ...newCommentTexts,
                              [post.id]: e.target.value,
                            })
                          }
                          className="flex-1 rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                        />
                        <button
                          type="submit"
                          disabled={!newCommentTexts[post.id]?.trim()}
                          className="rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold px-4 py-2.5 text-xs transition-all cursor-pointer whitespace-nowrap shadow-xs"
                        >
                          Enviar 💬
                        </button>
                      </form>

                    </div>
                  )}
                </article>
              );
            })}
          </div>

        </div>
      </main>
    </div>
  );
}