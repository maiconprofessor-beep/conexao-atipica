export default function Logo({ className = "h-10", showText = true }: { className?: string; showText?: boolean }) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Símbolo do Infinito Conectado (SVG) */}
      <svg
        viewBox="0 0 200 120"
        className="h-full w-auto aspect-square overflow-visible shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradiente do Infinito */}
          <linearGradient id="infinity-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" />   {/* Indigo light */}
            <stop offset="50%" stopColor="#c084fc" />  {/* Purple light */}
            <stop offset="100%" stopColor="#38bdf8" /> {/* Sky blue */}
          </linearGradient>

          {/* Brilho suave (Glow Effect) */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Gradiente para os nós de luz */}
          <radialGradient id="node-glow">
            <stop offset="0%" stopColor="#34d399" /> {/* Emerald neon */}
            <stop offset="100%" stopColor="#059669" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Camada com brilho difuso ao fundo */}
        <path
          d="M 50,60 C 20,20 0,60 50,60 C 100,60 100,20 150,20 C 200,20 180,100 150,100 C 100,100 100,60 50,60 C 0,60 20,100 50,100 C 100,100 100,60 150,60"
          stroke="url(#infinity-gradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.3"
          filter="url(#glow)"
        />

        {/* Linha principal do Infinito */}
        <path
          d="M 50,60 C 20,20 0,60 50,60 C 100,60 100,20 150,20 C 200,20 180,100 150,100 C 100,100 100,60 50,60 C 0,60 20,100 50,100 C 100,100 100,60 150,60"
          stroke="url(#infinity-gradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Pontos/Nós de Conexão na Trilha */}
        {/* Nó Central (Cruzamento) */}
        <circle cx="100" cy="60" r="7" fill="#34d399" className="animate-pulse" />
        <circle cx="100" cy="60" r="12" fill="url(#node-glow)" opacity="0.8" />

        {/* Nó Superior Esquerdo */}
        <circle cx="42" cy="38" r="5" fill="#f472b6" />
        
        {/* Nó Inferior Direito */}
        <circle cx="158" cy="82" r="5" fill="#fbbf24" />

        {/* Nó Extremidade Direita */}
        <circle cx="175" cy="55" r="4" fill="#38bdf8" />

        {/* Nó Extremidade Esquerda */}
        <circle cx="25" cy="65" r="4" fill="#a78bfa" />
      </svg>

      {/* Nome e Slogan da Marca (Opcional via prop showText) */}
      {showText && (
        <div className="flex flex-col">
          <span className="text-lg font-black tracking-tight text-white leading-none">
            Conexão<span className="text-indigo-400">Atípica</span>
          </span>
          <span className="text-[10px] font-medium tracking-wider text-slate-400 uppercase mt-1">
            Rede & Comunidade
          </span>
        </div>
      )}
    </div>
  );
}