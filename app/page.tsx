'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [demoInput, setDemoInput] = useState('');

  const bannerSlides = [
    {
      id: 1,
      tag: "PLANO DE ACOLHIMENTO",
      title: "Você não precisa caminhar só na jornada atípica",
      description: "Uma comunidade viva e acolhedora para compartilhar vivências, encontrar informações de qualidade e ter apoio para todas as etapas.",
      highlightTitle: "100% Gratuito",
      highlightSub: "Rede Colaborativa",
      bgGradient: "from-blue-600 via-indigo-600 to-slate-900",
      accentBg: "bg-amber-400 text-slate-950",
      pillBg: "bg-blue-500/30 text-blue-100 border-blue-400/30",
      buttonText: "Quero fazer parte",
      buttonLink: "/cadastro",
      cardInfo: "Acolhimento contínuo para pais, mães e cuidadores",
      emoji: "🧩"
    },
    {
      id: 2,
      tag: "REDE DE ESPECIALISTAS E PAIS",
      title: "Troca de experiências práticas e apoio profissional",
      description: "Conecte-se a psicólogos, terapeutas ocupacionais, educadores e famílias que compartilham estratégias reais do dia a dia.",
      highlightTitle: "Orientação",
      highlightSub: "Qualificada",
      bgGradient: "from-indigo-700 via-purple-700 to-slate-900",
      accentBg: "bg-emerald-400 text-slate-950",
      pillBg: "bg-purple-500/30 text-purple-100 border-purple-400/30",
      buttonText: "Conhecer a Comunidade",
      buttonLink: "/cadastro",
      cardInfo: "Salas temáticas por autismo, TDAH e síndromes raras",
      
    },
    {
      id: 3,
      tag: "BIBLIOTECA & DIREITOS",
      title: "Informação clara sobre rotina, saúde e direitos",
      description: "Acesse guias práticos, artigos revisados e conteúdos simplificados para ajudar na escola, no plano de saúde e nas terapias.",
      highlightTitle: "Direitos &",
      highlightSub: "Guias Práticos",
      bgGradient: "from-cyan-700 via-blue-800 to-slate-950",
      accentBg: "bg-rose-400 text-slate-950",
      pillBg: "bg-cyan-500/30 text-cyan-100 border-cyan-400/30",
      buttonText: "Acessar Plataforma",
      buttonLink: "/cadastro",
      cardInfo: "Material atualizado e construído com responsabilidade",
      
    },
    {
      id: 4,
      tag: "AMBIENTE PRIVADO E SEGURO",
      title: "Um espaço respeitoso e livre de julgamentos",
      description: "Compartilhe suas dúvidas e vitórias em um ambiente privado e moderado com total respeito à sua família.",
      highlightTitle: "Segurança",
      highlightSub: "& Privacidade",
      bgGradient: "from-slate-900 via-blue-950 to-indigo-950",
      accentBg: "bg-amber-300 text-slate-950",
      pillBg: "bg-slate-700/50 text-slate-200 border-slate-600/50",
      buttonText: "Criar Minha Conta",
      buttonLink: "/cadastro",
      cardInfo: "Suporte 100% humanizado e acolhedor",
      
    }
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  }, [bannerSlides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-blue-100 selection:text-blue-700 flex flex-col justify-between">
      
      {/* 1. HEADER / NAVBAR */}
      {}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/60 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 cursor-pointer">
            <div className="h-9 w-9 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
              🧩
            </div>
            <span className="font-bold text-slate-900 text-base tracking-tight">Conexão Atípica</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer inline-block"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer inline-block"
            >
              Quero fazer parte
            </Link>
          </div>
        </div>
      </header>

      {/* 2. CONTEÚDO PRINCIPAL (BANNER + INTERAÇÃO) */}
      {}
      <main className="space-y-12 py-8 flex-1">

        {/* CARROSSEL ANIMADO TIPO BANNER */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6">
          <div
            className="relative overflow-hidden rounded-3xl shadow-2xl transition-all duration-500"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className={`bg-gradient-to-r ${bannerSlides[currentSlide].bgGradient} text-white p-8 sm:p-12 md:p-16 relative transition-all duration-700 min-h-[420px] flex flex-col justify-between`}>
              
              <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none hidden md:flex items-center justify-center">
                <span className="text-[220px] select-none">{bannerSlides[currentSlide].emoji}</span>
              </div>

              <button
                onClick={prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center text-sm backdrop-blur-md transition-all z-20 cursor-pointer"
                title="Slide anterior"
              >
                ‹
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center text-sm backdrop-blur-md transition-all z-20 cursor-pointer"
                title="Próximo slide"
              >
                ›
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center z-10 my-auto">
                <div className="md:col-span-8 space-y-5">
                  <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border backdrop-blur-md text-[11px] font-bold uppercase tracking-wider ${bannerSlides[currentSlide].pillBg}`}>
                    <span>{bannerSlides[currentSlide].emoji}</span>
                    <span>{bannerSlides[currentSlide].tag}</span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-xs">
                    {bannerSlides[currentSlide].title}
                  </h1>

                  <p className="text-slate-200 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl font-normal">
                    {bannerSlides[currentSlide].description}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <Link
                      href={bannerSlides[currentSlide].buttonLink}
                      className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs sm:text-sm shadow-lg transition-all cursor-pointer flex items-center gap-2 group"
                    >
                      <span>{bannerSlides[currentSlide].buttonText}</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>

                    <span className="text-[11px] text-slate-300 font-medium">
                      {bannerSlides[currentSlide].cardInfo}
                    </span>
                  </div>
                </div>

                <div className="md:col-span-4 flex justify-center md:justify-end">
                  <div className={`w-40 h-40 sm:w-48 sm:h-48 rounded-full ${bannerSlides[currentSlide].accentBg} p-6 flex flex-col items-center justify-center text-center shadow-2xl transform hover:scale-105 transition-transform border-4 border-white/20`}>
                    <span className="text-xl sm:text-2xl font-black leading-tight tracking-tight">
                      {bannerSlides[currentSlide].highlightTitle}
                    </span>
                    <span className="text-[11px] sm:text-xs font-bold opacity-90 uppercase tracking-wider mt-1">
                      {bannerSlides[currentSlide].highlightSub}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 pt-6 z-10">
                {bannerSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      currentSlide === index
                        ? 'w-10 bg-white shadow-md'
                        : 'w-3 bg-white/40 hover:bg-white/70'
                    }`}
                    title={`Ir para slide ${index + 1}`}
                  />
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* SEÇÃO DE DEMONSTRAÇÃO AO VIVO */}
        <section className="max-w-6xl mx-auto px-6">
          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-600">INTERAÇÃO EM TEMPO REAL</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Veja como as famílias conversam na comunidade
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Um espaço dinâmico onde você pode tirar dúvidas, receber mensagens de acolhimento e compartilhar momentos com quem vive a mesma realidade.
              </p>

              <div className="pt-2">
                <Link
                  href="/cadastro"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  <span>Participar das conversas</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-slate-800">Rede Conexão Ao Vivo</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Moderação Ativa</span>
                </div>

                <div className="space-y-2.5 text-xs py-1">
                  <div className="max-w-[88%] rounded-2xl bg-blue-50 border border-blue-100 p-3 text-blue-950 leading-relaxed">
                    <strong>Mãe de Primeira Viagem:</strong> Alguém aqui passou por dificuldades no processo de adaptação escolar pós-diagnóstico?
                  </div>
                  <div className="ml-auto max-w-[88%] rounded-2xl bg-blue-600 text-white p-3 leading-relaxed font-medium shadow-xs">
                    <strong>Pai Atípico:</strong> Por aqui mudou tudo quando alinhamos a rotina visual com a mediação escolar. Posso te contar como fizemos!
                  </div>
                  <div className="max-w-[88%] rounded-2xl bg-white border border-slate-200 p-3 text-slate-700 leading-relaxed">
                    <strong>Acolhimento Conexão:</strong> Estamos juntos nisso. Você não está sozinha nesse processo!
                  </div>
                </div>

                <div className="relative flex items-center pt-1">
                  <input
                    type="text"
                    placeholder="Escreva sua dúvida ou desabafo..."
                    value={demoInput}
                    onChange={(e) => setDemoInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none transition-all pr-10"
                  />
                  <Link
                    href="/cadastro"
                    className="absolute right-1.5 h-7 w-7 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                  >
                    →
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* RODAPÉ SIMPLIFICADO */}
      {}
      <footer className="border-t border-slate-200/80 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">🧩</div>
            <span className="font-bold text-slate-900 text-sm">Conexão Atípica</span>
          </div>
          <p className="text-[11px] text-slate-400">© 2026 Conexão Atípica. Todos os direitos reservados.</p>
        </div>
      </footer>

    </div>
  );
}
