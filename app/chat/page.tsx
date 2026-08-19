'use client';

import { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import { supabase } from '@/lib/supabaseClient';

interface Message {
  id: string;
  created_at: string;
  room_id: string;
  user_name: string;
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [roomId, setRoomId] = useState('geral');
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Rolar para a última mensagem automaticamente
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Carregar nome do usuário logado
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserName(user.email.split('@')[0]);
      } else {
        setUserName('Visitante_' + Math.floor(Math.random() * 1000));
      }
    };
    fetchUser();
  }, []);

  // Buscar histórico e escutar mensagens em TEMPO REAL
  useEffect(() => {
    setLoading(true);

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      if (error) console.error('Erro ao buscar mensagens:', error);
      else setMessages(data || []);
      
      setLoading(false);
      setTimeout(scrollToBottom, 100);
    };

    fetchMessages();

    const channel = supabase
      .channel(`chat_room_${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => [...prev, newMsg]);
          setTimeout(scrollToBottom, 50);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  // Enviar mensagem
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msgToSend = newMessage.trim();
    setNewMessage('');

    const { error } = await supabase.from('chat_messages').insert([
      {
        room_id: roomId,
        user_name: userName || 'Anônimo',
        content: msgToSend,
      },
    ]);

    if (error) {
      console.error('Erro ao enviar mensagem:', error.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 selection:bg-slate-200 selection:text-slate-900 font-sans antialiased">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8 flex flex-col h-screen overflow-hidden">
        <div className="mx-auto w-full max-w-5xl flex flex-col h-full space-y-4">
          
          {/* Topo do Chat */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-slate-100 border border-slate-200 text-slate-600">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                Conexão em Tempo Real
              </div>
              <h1 className="text-xl font-semibold text-slate-900 mt-1">Sala de Bate-Papo</h1>
            </div>

            {/* Seleção de Sala */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Canal:</span>
              <select
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3 py-2 focus:bg-white focus:border-slate-400 focus:outline-none cursor-pointer transition-all"
              >
                <option value="geral">Geral</option>
                <option value="autismo">Suporte Autismo</option>
                <option value="tdah">Conversa TDAH</option>
                <option value="pais">Espaço dos Pais</option>
              </select>
            </div>
          </div>

          {/* Área de Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-full text-slate-400 text-xs font-medium">
                Carregando histórico...
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs space-y-1">
                <p>Nenhuma mensagem nesta sala ainda.</p>
                <p className="text-[11px] text-slate-400">Envie uma mensagem para iniciar a conversa.</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.user_name === userName;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <span className="text-[11px] font-semibold text-slate-600">
                        {msg.user_name}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div
                      className={`max-w-[80%] sm:max-w-[65%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                        isMe
                          ? 'bg-slate-900 text-white rounded-tr-none font-normal'
                          : 'bg-slate-100 text-slate-800 border border-slate-200/80 rounded-tl-none'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form / Input para Envio */}
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              placeholder={`Enviar mensagem como ${userName}...`}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 focus:outline-none transition-all shadow-2xs"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-semibold rounded-xl transition-all shadow-2xs shrink-0 cursor-pointer"
            >
              Enviar
            </button>
          </form>

        </div>
      </main>
    </div>
  );
}