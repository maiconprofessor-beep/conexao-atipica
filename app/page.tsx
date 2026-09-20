'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Fraunces, Inter } from 'next/font/google';

// Mesma dupla tipográfica usada no dashboard e no mapa de recursos.
// Ideal centralizar em /app/layout.tsx quando for aplicar em todo o site.
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
});

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [demoInput, setDemoInput] = useState('');

  const bannerSlides = [
    {
      id: 1,
      tag: 'PLANO DE ACOLHIMENTO',
      title: 'Você não precisa caminhar só na jornada atípica',
      description:
        'Uma comunidade viva e acolhedora para compartilhar vivências, encontrar informações de qualidade e ter apoio em todas as etapas.',
      highlightTitle: '100% Gratuito',
      highlightSub: 'Rede Colaborativa',
      bgGradient: 'from-[#4F6F58] via-[#3E5A47] to-[#242D26]',
      accentBg: 'bg-[#F0CE8C] text-[#4A3B14]',
      buttonText: 'Quero fazer parte',
      buttonLink: '/cadastro',
      cardInfo: 'Acolhimento contínuo para pais, mães e cuidadores',
      emoji: '🧩',
    },
    {
      id: 2,
      tag: 'REDE DE ESPECIALISTAS E PAIS',
      title: 'Troca de experiências práticas e apoio profissional',
      description:
        'Conecte-se a psicólogos, terapeutas ocupacionais, educadores e famílias que compartilham estratégias reais do dia a dia.',
      highlightTitle: 'Orientação',
      highlightSub: 'Qualificada',
      bgGradient: 'from-[#5A6AA3] via-[#454F80] to-[#262B44]',
      accentBg: 'bg-[#DBE0F2] text-[#33395A]',
      buttonText: 'Conhecer a comunidade',
      buttonLink: '/cadastro',
      cardInfo: 'Salas temáticas por autismo, TDAH e síndromes raras',
      emoji: '🎓',
    },
    {
      id: 3,
      tag: 'BIBLIOTECA & DIREITOS',
      title: 'Informação clara sobre rotina, saúde e direitos',
      description:
        'Acesse guias práticos, artigos revisados e conteúdos simplificados para ajudar na escola, no plano de saúde e nas terapias.',
      highlightTitle: 'Direitos &',
      highlightSub: 'Guias Práticos',
      bgGradient: 'from-[#A15C52] via-[#7E4038] to-[#2E1E1B]',
      accentBg: 'bg-[#EBD6D1] text-[#5A332C]',
      buttonText: 'Acessar plataforma',
      buttonLink: '/cadastro',
      cardInfo: 'Material atualizado e construído com responsabilidade',
      emoji: '📚',
    },
    {
      id: 4,
      tag: 'AMBIENTE PRIVADO E SEGURO',
      title: 'Um espaço respeitoso e livre de julgamentos',
      description:
        'Compartilhe suas dúvidas e vitórias em um ambiente privado e moderado, com total respeito à sua família.',
      highlightTitle: 'Segurança',
      highlightSub: '& Privacidade',
      bgGradient: 'from-[#33362F] via-[#2A2C26] to-[#1C1E19]',
      accentBg: 'bg-[#CFE0D2] text-[#2F3E33]',
      buttonText: 'Criar minha conta',
      buttonLink: '/cadastro',
      cardInfo: 'Suporte 100% humanizado e acolhedor',
      emoji: '🔒',
    },
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

  const slide = bannerSlides[currentSlide];

  return (
    <div
      className={`${fraunces.variable} ${inter.variable} min-h-screen bg-[#F7F4EF] text-[#33362F] [font-family:var(--font-inter)] antialiased selection:bg-[#CFE0D2] selection:text-[#2F3E33] flex flex-col justify-between`}
    >
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#F7F4EF]/90 backdrop-blur-md border-b border-[#E8E2D8] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 cursor-pointer">
            <div className="h-9 w-9 rounded-xl bg-[#6B8F71] text-white font-bold flex items-center justify-center text-sm">
              🧩
            </div>
            <span className="[font-family:var(--font-fraunces)] font-medium text-[#2F3E33] text-base tracking-tight">
              Conexão Atípica
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-xs font-semibold text-[#5A5748] hover:text-[#4F6F58] transition-colors cursor-pointer inline-block"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="px-5 py-2.5 rounded-xl bg-[#6B8F71] hover:bg-[#5C7E63] text-white font-semibold text-xs shadow-sm shadow-[#6B8F71]/20 transition-colors cursor-pointer inline-block"
            >
              Quero fazer parte
            </Link>
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="space-y-10 py-8 flex-1">
        {/* CARROSSEL */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6">
          <div
            className="relative overflow-hidden rounded-[2rem] shadow-[0_16px_50px_rgba(51,54,47,0.18)] transition-all duration-500"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className={`bg-gradient-to-br ${slide.bgGradient} text-white p-8 sm:p-12 md:p-16 relative transition-all duration-700 min-h-[420px] flex flex-col justify-between`}
            >
              <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-[0.08] pointer-events-none hidden md:flex items-center justify-center">
                <span className="text-[150px] select-none">{slide.emoji}</span>
              </div>

              <button
                onClick={prevSlide}
                aria-label="Slide anterior"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center text-sm backdrop-blur-md transition-all z-20 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                ‹
              </button>
              <button
                onClick={nextSlide}
                aria-label="Próximo slide"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center text-sm backdrop-blur-md transition-all z-20 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                ›
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center z-10 my-auto">
                <div className="md:col-span-8 space-y-5">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/25 bg-white/15 backdrop-blur-md text-[11px] font-semibold uppercase tracking-wider text-white">
                    <span aria-hidden>{slide.emoji}</span>
                    <span>{slide.tag}</span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl md:text-5xl [font-family:var(--font-fraunces)] italic font-medium tracking-tight leading-tight text-white">
                    {slide.title}
                  </h1>

                  <p className="text-white/80 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl font-normal">
                    {slide.description}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <Link
                      href={slide.buttonLink}
                      className="px-6 py-3.5 rounded-2xl bg-[#FBFAF7] hover:bg-white text-[#2F3E33] font-bold text-xs sm:text-sm shadow-lg transition-all cursor-pointer flex items-center gap-2 group"
                    >
                      <span>{slide.buttonText}</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>

                    <span className="text-[11px] text-white/70 font-medium">{slide.cardInfo}</span>
                  </div>
                </div>

                <div className="md:col-span-4 flex justify-center md:justify-end">
                  <div
                    className={`w-40 h-40 sm:w-48 sm:h-48 rounded-full ${slide.accentBg} p-6 flex flex-col items-center justify-center text-center shadow-xl transform hover:scale-105 transition-transform border-4 border-white/15`}
                  >
                    <span className="text-xl sm:text-2xl font-bold leading-tight tracking-tight">
                      {slide.highlightTitle}
                    </span>
                    <span className="text-[11px] sm:text-xs font-semibold opacity-80 uppercase tracking-wider mt-1">
                      {slide.highlightSub}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 pt-6 z-10">
                {bannerSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Ir para slide ${index + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      currentSlide === index ? 'w-10 bg-white' : 'w-3 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Selos de confiança — reforço rápido de conversão logo abaixo do banner */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
            {[
              { icon: '🧩', label: '100% gratuito' },
              { icon: '🔒', label: 'Ambiente moderado' },
              { icon: '🤝', label: 'Sem julgamentos' },
            ].map((selo) => (
              <span
                key={selo.label}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#E8E2D8] text-[#5A5748] text-xs font-medium"
              >
                <span aria-hidden>{selo.icon}</span>
                {selo.label}
              </span>
            ))}
          </div>
        </section>

        {/* DEMONSTRAÇÃO AO VIVO */}
        <section id="como-funciona" className="max-w-6xl mx-auto px-6">
          <div className="rounded-[2rem] bg-white border border-[#E8E2D8] p-6 sm:p-8 shadow-[0_8px_30px_rgba(51,54,47,0.06)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#4F6F58]">
                Interação em tempo real
              </span>
              <h2 className="text-2xl sm:text-3xl [font-family:var(--font-fraunces)] font-medium text-[#2F3E33] tracking-tight">
                Veja como as famílias conversam na comunidade
              </h2>
              <p className="text-xs sm:text-sm text-[#8A8578] leading-relaxed">
                Um espaço dinâmico onde você pode tirar dúvidas, receber mensagens de acolhimento e
                compartilhar momentos com quem vive a mesma realidade.
              </p>

              <div className="pt-2">
                <Link
                  href="/cadastro"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#6B8F71] hover:bg-[#5C7E63] text-white font-semibold text-xs shadow-md shadow-[#6B8F71]/20 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6B8F71] focus-visible:ring-offset-2"
                >
                  <span>Participar das conversas</span>
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-2xl bg-[#FBFAF7] border border-[#EFEBE2] p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-[#EFEBE2] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#6B8F71] animate-pulse" aria-hidden />
                    <span className="text-xs font-semibold text-[#2F3E33]">Rede Conexão ao vivo</span>
                  </div>
                  <span className="text-[10px] text-[#8A8578] font-semibold uppercase">Moderação ativa</span>
                </div>

                <div className="space-y-2.5 text-xs py-1">
                  <div className="max-w-[88%] rounded-2xl bg-[#EAF1EA] border border-[#CFE0D2] p-3 text-[#2F3E33] leading-relaxed">
                    <strong>Mãe de Primeira Viagem:</strong> Alguém aqui passou por dificuldades no
                    processo de adaptação escolar pós-diagnóstico?
                  </div>
                  <div className="ml-auto max-w-[88%] rounded-2xl bg-[#6B8F71] text-white p-3 leading-relaxed font-medium">
                    <strong>Pai Atípico:</strong> Por aqui mudou tudo quando alinhamos a rotina visual
                    com a mediação escolar. Posso te contar como fizemos!
                  </div>
                  <div className="max-w-[88%] rounded-2xl bg-white border border-[#E8E2D8] p-3 text-[#5A5748] leading-relaxed">
                    <strong>Acolhimento Conexão:</strong> Estamos juntos nisso. Você não está sozinha
                    nesse processo!
                  </div>
                </div>

                <div className="relative flex items-center pt-1">
                  <input
                    type="text"
                    placeholder="Escreva sua dúvida ou desabafo..."
                    value={demoInput}
                    onChange={(e) => setDemoInput(e.target.value)}
                    className="w-full rounded-xl border border-[#E8E2D8] bg-white px-4 py-2.5 text-xs text-[#33362F] placeholder-[#B3AE9F] focus:border-[#6B8F71] focus:ring-2 focus:ring-[#6B8F71]/20 focus:outline-none transition-all pr-10"
                  />
                  <Link
                    href="/cadastro"
                    aria-label="Continuar cadastro para enviar mensagem"
                    className="absolute right-1.5 h-7 w-7 rounded-lg bg-[#6B8F71] hover:bg-[#5C7E63] text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                  >
                    →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* RODAPÉ */}
      <footer className="border-t border-[#E8E2D8] bg-white py-6 text-xs text-[#8A8578]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-[#EAF1EA] text-[#4F6F58] font-bold flex items-center justify-center text-xs">
              🧩
            </div>
            <span className="[font-family:var(--font-fraunces)] font-medium text-[#2F3E33] text-sm">
              Conexão Atípica
            </span>
          </div>
          <p className="text-[11px] text-[#B3AE9F]">© 2026 Conexão Atípica. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
