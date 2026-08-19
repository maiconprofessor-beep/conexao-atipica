'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Lista de tentativas para o formato do nome do arquivo
  const [imageIndex, setImageIndex] = useState(0);
  const imageSources = [
    '/laco-autismo.jpg',
    '/laco-autismo.png',
    '/laco-autismo.jpg.png',
    '/laco-autismo.jpeg'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        router.push('/perfil');
      }
    } catch (err: any) {
      console.error('Erro no login:', err);
      setErrorMessage(
        err?.message === 'Invalid login credentials'
          ? 'E-mail ou senha incorretos. Por favor, tente novamente.'
          : err?.message || 'Ocorreu um erro ao fazer login.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 sm:p-8 font-sans antialiased">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* LADO ESQUERDO: LAÇO ATÍPICO DE QUEBRA-CABEÇA */}
        <div className="lg:col-span-6 flex justify-center items-center py-6">
          <div className="relative w-full max-w-md drop-shadow-2xl hover:scale-[1.02] transition-transform duration-300 flex justify-center">
            <img
              src={imageSources[imageIndex]}
              alt="Laço de Conscientização do Autismo"
              onError={() => {
                if (imageIndex < imageSources.length - 1) {
                  setImageIndex(imageIndex + 1);
                }
              }}
              className="w-full max-w-xs sm:max-w-sm md:max-w-md h-auto filter drop-shadow-[0_25px_25px_rgba(0,0,0,0.25)] object-contain"
            />
          </div>
        </div>

        {/* LADO DIREITO: CARD FLUTUANTE DE LOGIN */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-slate-100 space-y-6">
            
            {/* Título e Subtítulo */}
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Que bom ter você aqui.
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm font-normal">
                Entre para continuar sua conversa com calma e no seu próprio tempo.
              </p>
            </div>

            {/* Mensagem de Erro */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold leading-relaxed">
                {errorMessage}
              </div>
            )}

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* E-mail */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs font-bold text-slate-700">
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                />
              </div>

              {/* Senha */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-xs font-bold text-slate-700">
                    Senha
                  </label>
                  <a href="#" className="text-[11px] font-bold text-blue-600 hover:underline">
                    Esqueci minha senha
                  </a>
                </div>
                <div className="relative flex items-center">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all pr-16"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  >
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
              </div>

              {/* Checkbox Manter Conectado */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="remember" className="text-xs text-slate-600 cursor-pointer select-none">
                  Manter minha sessão conectada
                </label>
              </div>

              {/* Botão de Entrar */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 text-xs sm:text-sm shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2 group mt-2"
              >
                <span>{loading ? 'Entrando...' : 'Entrar'}</span>
                {!loading && <span className="group-hover:translate-x-0.5 transition-transform">→</span>}
              </button>
            </form>

            {/* Divisor */}
            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <span className="relative bg-white px-3 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                OU
              </span>
            </div>

            {/* Criar Conta */}
            <div className="text-center space-y-2">
              <p className="text-xs text-slate-500">Ainda não possui uma conta?</p>
              <Link
                href="/cadastro"
                className="w-full inline-block rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold py-3 px-6 text-xs sm:text-sm transition-colors text-center shadow-xs cursor-pointer"
              >
                Criar minha conta
              </Link>
            </div>

            {/* Rodapé de Direitos */}
            <div className="text-center text-[10px] text-slate-400 pt-2">
              © 2026 Conexão Atípica. Todos os direitos reservados.
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}