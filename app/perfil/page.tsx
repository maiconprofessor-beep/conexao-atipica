'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Sidebar from '@/components/Sidebar';

export default function ProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Pai/Mãe');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          setEmail(session.user.email || '');

          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, role, bio, avatar_url')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profile) {
            setFullName(profile.full_name || session.user.user_metadata?.full_name || '');
            setRole(profile.role || session.user.user_metadata?.role || 'Pai/Mãe');
            setBio(profile.bio || '');
            setAvatarUrl(profile.avatar_url || null);
          } else {
            setFullName(session.user.user_metadata?.full_name || '');
            setRole(session.user.user_metadata?.role || 'Pai/Mãe');
          }
        } else {
          // Valores padrão para demonstração visual
          setEmail('usuario@conexaoatipica.com.br');
          setFullName('Membro Conexão');
          setRole('Pai/Mãe');
        }
      } catch (err) {
        console.error('Erro ao carregar perfil:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    // Listener para mudanças na sessão do Supabase em tempo real
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setEmail(session.user.email || '');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setMessage(null);

      if (!e.target.files || e.target.files.length === 0) return;

      const file = e.target.files[0];
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        const localPreview = URL.createObjectURL(file);
        setAvatarUrl(localPreview);
        setMessage({ type: 'success', text: 'Foto atualizada localmente!' });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;
      setAvatarUrl(publicUrl);

      await supabase
        .from('profiles')
        .upsert({ id: user.id, avatar_url: publicUrl, updated_at: new Date().toISOString() });

      setMessage({ type: 'success', text: 'Foto atualizada com sucesso!' });
    } catch (err: any) {
      console.error('Erro no upload da foto:', err);
      setMessage({ type: 'error', text: 'Erro ao enviar foto. Tente novamente.' });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            full_name: fullName,
            role,
            bio,
            avatar_url: avatarUrl,
            updated_at: new Date().toISOString(),
          });

        if (error) throw error;
      }

      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
    } catch (err: any) {
      console.error('Erro ao salvar:', err);
      setMessage({ type: 'error', text: 'Erro ao salvar alterações.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600 font-sans">
        <p className="text-xs font-bold animate-pulse">Carregando perfil...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        <div className="mx-auto max-w-4xl space-y-6">
          
          <header className="rounded-3xl bg-white p-6 md:p-8 border border-slate-200/80 shadow-2xs">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Meu Perfil
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Personalize suas informações de exibição na comunidade Conexão Atípica.
            </p>
          </header>

          {message && (
            <div
              className={`rounded-2xl p-4 text-xs font-bold border shadow-2xs ${
                message.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* CARD COM FOTO E BADGE DE PERFIL */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 flex flex-col items-center text-center space-y-4 shadow-2xs">
              <div className="relative group">
                <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-blue-500 bg-slate-100 flex items-center justify-center shadow-xs">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Foto de Perfil" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">👤</span>
                  )}
                </div>

                <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer shadow-md transition-all">
                  <span className="text-xs">📷</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>

              {uploading && <p className="text-xs text-blue-600 animate-pulse font-bold">Enviando foto...</p>}

              <div>
                <h3 className="text-base font-bold text-slate-900">{fullName || 'Seu Nome'}</h3>
                <span className="inline-block mt-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-blue-50 border border-blue-100 text-blue-700">
                  {role}
                </span>
              </div>

              <p className="text-xs text-slate-500 italic leading-relaxed">
                "{bio || 'Escreva uma breve apresentação na sua biografia...'}"
              </p>
            </div>

            {/* FORMULÁRIO DE EDIÇÃO */}
            <div className="lg:col-span-2 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xs">
              <form onSubmit={handleSaveProfile} className="space-y-5">
                <h2 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3 uppercase tracking-wider">
                  Informações do Perfil
                </h2>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    E-mail de Acesso
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500 cursor-not-allowed text-xs font-medium"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">E-mail associado à sua conta de acesso.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nome Completo / Exibição
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Maria Silva"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 text-xs focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Perfil / Vínculo
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 text-xs focus:bg-white focus:border-blue-500 focus:outline-none transition-all cursor-pointer"
                  >
                    <option value="Pai/Mãe">Mãe / Pai / Responsável Atípico</option>
                    <option value="Pessoa Neurodivergente">Pessoa Neurodivergente / Autista</option>
                    <option value="Profissional da Saúde">Profissional da Saúde</option>
                    <option value="Educador">Educador(a)</option>
                    <option value="Apoiador">Apoiador(a)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Sobre você (Bio)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Conte um pouco sobre sua jornada ou vivência..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 text-xs focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-2xl bg-blue-600 hover:bg-blue-700 px-6 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/10 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {saving ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}