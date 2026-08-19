'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Pai/Mãe');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [imageIndex, setImageIndex] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
  const imageSources = [
    '/laco-autismo.jpg',
    '/laco-autismo.png',
    '/laco-autismo.jpg.png',
    '/laco-autismo.jpeg'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem. Verifique e tente novamente.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      // 1. Cadastra o usuário no Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes('invalid') || signUpError.message.includes('Email address')) {
          setErrorMessage('Por favor, insira um endereço de e-mail válido.');
          setLoading(false);
          return;
        }
        throw signUpError;
      }

      // 2. Realiza o login automático imediatamente para estabelecer o token no navegador
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      const user = signInData?.user || signUpData?.user;

      if (user) {
        // 3. Upsert do perfil do usuário no banco de dados
        await supabase.from('profiles').upsert({
          id: user.id,
          full_name: fullName,
          role,
          updated_at: new Date().toISOString(),
        });
      }

      // 4. Redireciona para o perfil logado
      router.push('/perfil');
    } catch (err: any) {
      console.error('Erro durante o cadastro:', err);
      setErrorMessage(
        err?.message || 'Ocorreu um erro ao criar a conta. Verifique os dados e tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 sm:p-8 font-sans antialiased">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* LADO ESQUERDO: LAÇO ATÍPICO COM SISTEMA DE FALLBACK DA IMAGEM */}
        <div className="lg:col-span-6 flex justify-center items-center py-6">
          <div className="relative w-full max-w-md drop-shadow-2xl hover:scale-[1.02] transition-transform duration-300 flex justify-center">
            {!imageFailed ? (
              <img
                src={imageSources[imageIndex]}
                alt="Laço de Conscientização do Autismo"
                onError={() => {
                  if (imageIndex < imageSources.length - 1) {
                    setImageIndex(imageIndex + 1);
                  } else {
                    setImageFailed(true);
                  }
                }}
                className="w-full max-w-xs sm:max-w-sm md:max-w-md h-auto filter drop-shadow-[0_25px_25px_rgba(0,0,0,0.25)] object-contain"
              />
            ) : (
              /* Fallback em SVG caso a imagem da pasta public não seja localizada */
              <svg
                viewBox="0 0 200 320"
                className="w-full max-w-xs sm:max-w-sm md:max-w-md h-auto filter drop-shadow-[0_20px_20px_rgba(0,0,0,0.2)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 20 C60 20 20 60 20 120 C20 180 70 240 100 300 C130 240 180 180 180 120 C180 60 140 20 100 20 Z"
                  fill="#0055B8"
                />
                <path
                  d="M100 20 C80 20 50 50 35 90 C60 130 100 180 100 300 C100 250 140 150 165 90 C150 50 120 20 100 20 Z"
                  fill="#FFC72C"
                />
                <path
                  d="M40 100 C60 140 100 200 100 300 C80 240 30 160 40 100 Z"
                  fill="#E4002B"
                />
                <path
                  d="M160 100 C140 140 100 200 100 300 C120 240 170 160 160 100 Z"
                  fill="#00A3E0"
                />
              </svg>
            )}
          </div>
        </div>

        {/* LADO DIREITO: CARD FLUTUANTE DE CADASTRO */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-slate-100 space-y-6">
            
            {/* Título e Subtítulo */}
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Criar sua conta
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm font-normal">
                Faça parte da nossa comunidade atípica em menos de 1 minuto.
              </p>
            </div>

            {/* Mensagem de Erro Inline */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold leading-relaxed">
                {errorMessage}
              </div>
            )}

            {/* Formulário de Registro */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Nome Completo */}
              <div className="space-y-1.5">
                <label htmlFor="fullName" className="block text-xs font-bold text-slate-700">
                  Nome Completo
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  placeholder="Ex: Maria Silva"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                />
              </div>

              {/* Papel / Vínculo */}
              <div className="space-y-1.5">
                <label htmlFor="role" className="block text-xs font-bold text-slate-700">
                  Qual seu vínculo com a comunidade?
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all cursor-pointer"
                >
                  <option value="Pai/Mãe">Mãe / Pai / Responsável Atípico</option>
                  <option value="Pessoa Neurodivergente">Pessoa Neurodivergente / Autista</option>
                  <option value="Profissional da Saúde">Profissional da Saúde</option>
                  <option value="Educador">Educador(a)</option>
                  <option value="Apoiador">Apoiador(a)</option>
                </select>
              </div>

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
                <label htmlFor="password" className="block text-xs font-bold text-slate-700">
                  Senha
                </label>
                <div className="relative flex items-center">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Mínimo 6 caracteres"
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

              {/* Confirmar Senha */}
              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="block text-xs font-bold text-slate-700">
                  Confirmar Senha
                </label>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Repita sua senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                />
              </div>

              {/* Botão de Concluir Cadastro */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 text-xs sm:text-sm shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2 group mt-2"
              >
                <span>{loading ? 'Criando conta...' : 'Concluir Cadastro'}</span>
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

            {/* Link para Login */}
            <div className="text-center space-y-2">
              <p className="text-xs text-slate-500">Já possui uma conta?</p>
              <Link
                href="/login"
                className="w-full inline-block rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold py-3 px-6 text-xs sm:text-sm transition-colors text-center shadow-xs cursor-pointer"
              >
                Fazer Login
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