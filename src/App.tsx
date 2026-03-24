/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Terminal, 
  ArrowRight, 
  Palette, 
  Type as TypeIcon, 
  Layout, 
  MessageSquare,
  RefreshCcw,
  ChevronRight,
  Library,
  Bookmark,
  Settings,
  Edit3
} from 'lucide-react';

// --- Types ---

interface StyleGuide {
  tomDeVoz: {
    descricao: string;
    exemplos: string[];
  };
  paletaCores: {
    nome: string;
    hex: string;
    explicacao: string;
  }[];
  tipografia: {
    titulo: string;
    corpo: string;
  };
  componentesLayout: {
    estiloBotoes: string;
    header: string;
    layout: string;
  };
  heroImagePrompt: string;
}

// --- Components ---

const Navbar = () => (
  <header className="w-full top-0 sticky z-50 bg-gradient-to-b from-background to-transparent">
    <div className="flex justify-between items-center px-8 py-6 max-w-screen-2xl mx-auto">
      <div className="flex items-center gap-3">
        <Sparkles className="text-primary w-8 h-8" />
        <h1 className="text-2xl font-bold tracking-tighter text-white font-headline">The Curator</h1>
      </div>
      <div className="flex items-center gap-6">
        <nav className="hidden md:flex gap-8 items-center">
          <a className="text-primary font-label text-sm tracking-widest uppercase" href="#">Estúdio</a>
          <a className="text-on-surface-variant hover:text-white transition-colors duration-300 font-label text-sm tracking-widest uppercase" href="#">Biblioteca</a>
          <a className="text-on-surface-variant hover:text-white transition-colors duration-300 font-label text-sm tracking-widest uppercase" href="#">Curadorias</a>
        </nav>
        <div className="h-10 w-10 rounded-full bg-surface-container-high overflow-hidden border border-white/10">
          <img 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsbcv-FB6Vub50otW2b9agHf5CnpJKt-9NAlLxzS6Hb6RadLtvgftmmMyP9QRwXH8gYMzcO_OHL_364m-0obeKh7hadbcJYCGA22r-CCludalFs2j-KVM1cH_OmF5wgZQzuz7hp5VOpdDTWZujg7e1mzR75xfzfjb1-Y9nqnXH0C71FtSX1iJ1ECBJUaI8msZmdhypoeODzA2Qm13yzUozqRTIgSobCcLeRnWJSVHE_9iHHE5GPrd2am4LR5XC2J-mXt3h81ZkSbOx" 
            alt="Profile"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </div>
  </header>
);

const BottomNav = () => (
  <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-4 bg-background/80 backdrop-blur-xl border-t border-white/5 shadow-[0px_-24px_48px_rgba(0,0,0,0.5)] md:hidden">
    <button className="flex flex-col items-center justify-center bg-primary/10 text-primary rounded-full px-6 py-2">
      <Edit3 size={20} />
      <span className="font-label text-[10px] uppercase tracking-widest mt-1">Estúdio</span>
    </button>
    <button className="flex flex-col items-center justify-center text-on-surface-variant px-6 py-2 hover:bg-white/5 rounded-full transition-all">
      <Library size={20} />
      <span className="font-label text-[10px] uppercase tracking-widest mt-1">Biblioteca</span>
    </button>
    <button className="flex flex-col items-center justify-center text-on-surface-variant px-6 py-2 hover:bg-white/5 rounded-full transition-all">
      <Bookmark size={20} />
      <span className="font-label text-[10px] uppercase tracking-widest mt-1">Curadorias</span>
    </button>
    <button className="flex flex-col items-center justify-center text-on-surface-variant px-6 py-2 hover:bg-white/5 rounded-full transition-all">
      <Settings size={20} />
      <span className="font-label text-[10px] uppercase tracking-widest mt-1">Configurações</span>
    </button>
  </nav>
);

export default function App() {
  const [userInput, setUserInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [styleGuide, setStyleGuide] = useState<StyleGuide | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateStyle = async (input: string) => {
    if (!input.trim()) return;
    
    setIsGenerating(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `Você é um especialista em design e comunicação digital. Com base na descrição do usuário: '${input}', gere um guia de estilo completo.
        O guia deve ser focado em: TOM DE VOZ, PALETA DE CORES, TIPOGRAFIA, COMPONENTES E LAYOUT.
        
        Retorne APENAS um JSON válido seguindo este esquema:
        {
          "tomDeVoz": { "descricao": "string", "exemplos": ["string", "string"] },
          "paletaCores": [
            { "nome": "string", "hex": "string", "explicacao": "string" },
            { "nome": "string", "hex": "string", "explicacao": "string" },
            { "nome": "string", "hex": "string", "explicacao": "string" },
            { "nome": "string", "hex": "string", "explicacao": "string" }
          ],
          "tipografia": { "titulo": "string", "corpo": "string" },
          "componentesLayout": { "estiloBotoes": "string", "header": "string", "layout": "string" },
          "heroImagePrompt": "um prompt em inglês para gerar uma imagem abstrata de alta qualidade que represente esse estilo visual"
        }`,
        config: {
          responseMimeType: "application/json",
        }
      });

      const data = JSON.parse(response.text || '{}');
      setStyleGuide(data);
    } catch (err) {
      console.error(err);
      setError("Ocorreu um erro ao gerar seu estilo. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setStyleGuide(null);
    setUserInput('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow flex flex-col items-center justify-center px-6 max-w-5xl mx-auto w-full pt-12 pb-32">
        <AnimatePresence mode="wait">
          {!styleGuide && !isGenerating ? (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              {/* Hero Branding */}
              <div className="text-center mb-16 space-y-4">
                <span className="font-label text-secondary uppercase tracking-[0.3em] text-xs font-bold">Motor de Design IA</span>
                <h2 className="text-5xl md:text-7xl font-headline font-bold tracking-tight text-white leading-tight">
                  Defina sua identidade <span className="italic text-primary">estética</span>.
                </h2>
                <p className="text-on-surface-variant max-w-xl mx-auto text-lg font-body">
                  Precisão técnica encontra alma editorial. Descreva uma visão e eu gerarei seu ecossistema de estilo completo.
                </p>
              </div>

              {/* Conversational Input Section */}
              <div className="w-full relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur opacity-25 group-focus-within:opacity-100 transition duration-1000"></div>
                <div className="relative bg-surface-container-high rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 shadow-2xl">
                  <div className="flex-grow w-full px-6 py-4">
                    <textarea 
                      className="w-full bg-transparent border-none focus:ring-0 text-xl font-headline text-white placeholder-on-surface-variant/50 resize-none" 
                      placeholder="Crie um estilo cyberpunk sombrio e melancólico..." 
                      rows={1}
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          generateStyle(userInput);
                        }
                      }}
                    />
                  </div>
                  <button 
                    onClick={() => generateStyle(userInput)}
                    disabled={!userInput.trim()}
                    className="signature-gradient text-on-primary font-bold px-10 py-5 rounded-full flex items-center gap-2 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:scale-100"
                  >
                    <span className="font-label tracking-widest text-sm uppercase">Gerar</span>
                    <Terminal size={18} />
                  </button>
                </div>
              </div>

              {/* Suggested Chips */}
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                {[
                  { label: 'Cyberpunk Sombrio', icon: <Sparkles size={14} /> },
                  { label: 'Geométrico Bauhaus', icon: <Layout size={14} /> },
                  { label: 'Etéreo Orgânico', icon: <Palette size={14} /> },
                  { label: 'Monografia Vintage', icon: <Edit3 size={14} /> }
                ].map((chip) => (
                  <button 
                    key={chip.label}
                    onClick={() => {
                      setUserInput(chip.label);
                      generateStyle(chip.label);
                    }}
                    className="bg-surface-container-highest text-on-surface-variant px-6 py-3 rounded-full text-sm font-label hover:bg-primary/20 hover:text-primary transition-all flex items-center gap-2"
                  >
                    {chip.icon}
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Visual Inspiration Bento */}
              <div className="mt-24 w-full grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-8 h-80 rounded-xl overflow-hidden relative group">
                  <img 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAssdgyTV__jETQYUV-5KwwnDiliHtrkjVBy-viPM-j17uJzXyPiMyUw8iUKAgeUIgzfk0xuekWEsxJGui5NeGCTOiRrl5kGtExEikyH4lLgxETdIs8kwT1eI0vnSUXidn2fJmzhHnbcJs6bjWhJWMUdJ11Qju45vNTrdd44WOsKHT2bjkACBaFftrgfbdTWxN6aIpmvqgoS-ACh-7e84sFz5Jn5H9219NCbZYwh_22BivWbAAu55cm8oWdw4Ccg88u32l7ptYy_SYa" 
                    alt="Abstract flow"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                    <span className="font-label text-secondary text-xs font-bold uppercase tracking-widest mb-2">Relatório de Tendências</span>
                    <h3 className="font-headline text-2xl font-bold">O Vazio Etéreo</h3>
                  </div>
                </div>
                <div className="md:col-span-4 h-80 bg-surface-container-low rounded-xl p-8 flex flex-col justify-between border border-white/5">
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary"></div>
                      <div className="w-8 h-8 rounded-full bg-secondary"></div>
                      <div className="w-8 h-8 rounded-full bg-surface-container-highest"></div>
                    </div>
                    <h4 className="font-headline text-xl">Paleta Técnica v.04</h4>
                    <p className="text-sm text-on-surface-variant font-body">Uma curadoria de tons de alto contraste para interfaces de precisão.</p>
                  </div>
                  <button className="text-primary font-label text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
                    Ver Detalhes <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : isGenerating ? (
            <motion.div 
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center space-y-8"
            >
              <div className="relative">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="w-32 h-32 rounded-full border-t-2 border-primary border-opacity-50"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="text-primary w-8 h-8 animate-pulse" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-headline italic">Curando sua estética...</h3>
                <p className="text-on-surface-variant font-label uppercase tracking-widest text-xs">A IA está processando sua visão</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full space-y-12"
            >
              {/* Result Header */}
              <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-8">
                <div className="space-y-2">
                  <span className="font-label text-primary uppercase tracking-widest text-xs">Identidade Gerada</span>
                  <h2 className="text-4xl md:text-6xl font-headline font-bold">{userInput}</h2>
                </div>
                <button 
                  onClick={reset}
                  className="flex items-center gap-2 text-on-surface-variant hover:text-white transition-all font-label text-xs uppercase tracking-widest"
                >
                  <RefreshCcw size={14} />
                  Recomeçar
                </button>
              </div>

              {/* Grid Layout for Result */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Left Column: Visuals */}
                <div className="md:col-span-7 space-y-8">
                  {/* Hero Preview */}
                  <div className="aspect-video rounded-xl overflow-hidden relative group">
                    <img 
                      src={`https://picsum.photos/seed/${encodeURIComponent(styleGuide?.heroImagePrompt || 'abstract')}/1200/800`}
                      alt="Generated Aesthetic"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                      <div className="glass-panel p-4 rounded-lg">
                        <p className="text-xs font-label uppercase tracking-widest opacity-70">Direção Visual</p>
                        <p className="text-sm italic">{styleGuide?.heroImagePrompt}</p>
                      </div>
                    </div>
                  </div>

                  {/* Color Palette */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Palette className="text-primary" size={20} />
                      <h4 className="font-headline text-xl">Paleta de Cores</h4>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {styleGuide?.paletaCores.map((color, idx) => (
                        <div key={idx} className="space-y-2">
                          <div 
                            className="h-24 rounded-lg shadow-inner flex items-end p-2"
                            style={{ backgroundColor: color.hex }}
                          >
                            <span className="text-[10px] font-label font-bold mix-blend-difference text-white uppercase">{color.hex}</span>
                          </div>
                          <p className="text-xs font-bold font-label uppercase">{color.nome}</p>
                          <p className="text-[10px] text-on-surface-variant leading-tight">{color.explicacao}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Details */}
                <div className="md:col-span-5 space-y-8">
                  {/* Tom de Voz */}
                  <div className="bg-surface-container-low p-8 rounded-xl border border-white/5 space-y-6">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="text-secondary" size={20} />
                      <h4 className="font-headline text-xl">Tom de Voz</h4>
                    </div>
                    <p className="text-on-surface-variant text-sm leading-relaxed">{styleGuide?.tomDeVoz.descricao}</p>
                    <div className="space-y-3">
                      <p className="text-[10px] font-label uppercase tracking-widest opacity-50">Exemplos</p>
                      {styleGuide?.tomDeVoz.exemplos.map((ex, idx) => (
                        <div key={idx} className="flex gap-3 items-start">
                          <ChevronRight className="text-primary shrink-0 mt-1" size={14} />
                          <p className="text-sm italic text-white/80">"{ex}"</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Typography */}
                  <div className="bg-surface-container-low p-8 rounded-xl border border-white/5 space-y-6">
                    <div className="flex items-center gap-2">
                      <TypeIcon className="text-primary" size={20} />
                      <h4 className="font-headline text-xl">Tipografia</h4>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <p className="text-[10px] font-label uppercase tracking-widest opacity-50">Títulos: {styleGuide?.tipografia.titulo}</p>
                        <p className="text-3xl" style={{ fontFamily: styleGuide?.tipografia.titulo }}>A raposa rápida e marrom</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-label uppercase tracking-widest opacity-50">Corpo: {styleGuide?.tipografia.corpo}</p>
                        <p className="text-sm leading-relaxed opacity-80" style={{ fontFamily: styleGuide?.tipografia.corpo }}>
                          O design é a alma de tudo o que é criado pelo homem. Ele não é apenas o que parece e o que se sente. O design é como funciona.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Layout & Components */}
                  <div className="bg-surface-container-low p-8 rounded-xl border border-white/5 space-y-6">
                    <div className="flex items-center gap-2">
                      <Layout className="text-secondary" size={20} />
                      <h4 className="font-headline text-xl">Componentes & Layout</h4>
                    </div>
                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-on-surface-variant">Botões</span>
                        <span className="font-bold">{styleGuide?.componentesLayout.estiloBotoes}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-on-surface-variant">Cabeçalho</span>
                        <span className="font-bold">{styleGuide?.componentesLayout.header}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-on-surface-variant">Layout Geral</span>
                        <span className="font-bold">{styleGuide?.componentesLayout.layout}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav />
      
      {/* Floating Action for Desktop */}
      <button 
        onClick={reset}
        className="hidden md:flex fixed bottom-12 right-12 signature-gradient h-16 w-16 items-center justify-center rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all z-40"
      >
        <RefreshCcw className="text-on-primary" size={28} />
      </button>

      {error && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-6 py-3 rounded-full font-label text-sm shadow-xl z-50">
          {error}
        </div>
      )}
    </div>
  );
}
