import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, ArrowRight, Bot, Compass, ShoppingBag, ShieldCheck } from 'lucide-react';
import { ChatMessage, User } from '../types';
import { Translate } from './Translate';

interface CustomerSupportChatProps {
  user: User;
  t?: (key: string) => string;
  langId?: string;
}

export default function CustomerSupportChat({ user, t, langId = 'en' }: CustomerSupportChatProps) {
  const translate = t || ((s: string) => s);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      sender: 'model',
      text: translate(`Hi ${user.name}! 🌟 I am your MapStore Support Assistant. How can I reach you with help today? I can help with seller verification, order tracking, platform commission questions, or product details.`),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const messageToSend = customText || inputText.trim();
    if (!messageToSend) return;

    if (!customText) setInputText('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          userProfile: user
        })
      });

      if (!response.ok) {
        throw new Error('Service response failed');
      }

      const data = await response.json();

      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        sender: 'model',
        text: data.text || "I'm sorry, I'm experiencing technical issues. How else can I help you?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error('Error querying support agent:', error);
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'model',
        text: "I might be offline or undergoing updates. Please ask about MapStore flat 7% commissions, real credit card orders, ID scans, or seller status, and our offline intelligence will reply instantly!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const QUICK_QUESTIONS = [
    { text: "What is MapStore commission?", icon: ShoppingBag },
    { text: "How do I verify as a seller?", icon: ShieldCheck },
    { text: "How can I track my orders?", icon: Compass }
  ];

  return (
    <Translate langId={langId}>
      <div className="fixed bottom-6 right-6 z-50 font-sans" id="support-chat-root">
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg cursor-pointer transition-transform relative group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        id="btn-trigger-support"
      >
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5eead4] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#5eead4]"></span>
        </span>
        <MessageSquare className="w-6 h-6" />
      </motion.button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="absolute bottom-20 right-0 w-[calc(100vw-40px)] sm:w-[360px] md:w-[400px] h-[480px] sm:h-[550px] bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            id="window-support-panel"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">{translate("MapStore Support")}</h3>
                  <p className="text-[10px] text-white/80 tracking-widest uppercase">{translate("Reaching you")}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/15 p-1.5 rounded-xl transition-colors cursor-pointer"
                id="btn-close-support"
              >
                <X className="w-5 h-5 animate-pulse" />
              </button>
            </div>

            {/* Chat Body messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-zinc-900/40">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-sm ${
                      msg.sender === 'user'
                        ? 'bg-emerald-500 text-white rounded-br-none'
                        : 'bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-200 shadow-xs border border-gray-100 dark:border-zinc-800 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                    <span className="block text-[9px] mt-1 opacity-60 text-right">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl rounded-bl-none p-4 shadow-xs flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Context buttons */}
            {messages.length === 1 && (
              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800/60 flex flex-wrap gap-2">
                <span className="text-[10px] text-gray-400 block w-full mb-1">{translate("Frequently asked advice:")}</span>
                {QUICK_QUESTIONS.map((q, idx) => {
                  const IconComp = q.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(undefined, q.text)}
                      className="flex items-center gap-1 text-[11px] bg-white hover:bg-emerald-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 font-medium px-2.5 py-1.5 rounded-full border border-gray-100 dark:border-zinc-700/60 transition-colors text-gray-700 dark:text-zinc-200 cursor-pointer"
                    >
                      <IconComp className="w-3.5 h-3.5 text-emerald-500" />
                      {translate(q.text)}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Input Form Footer */}
            <form
              onSubmit={handleSendMessage}
              className="p-3.5 bg-white dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-800 flex gap-2"
              id="form-support-text"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={translate("Type your message...")}
                className="flex-1 border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 rounded-xl px-3 py-2 text-sm text-gray-800 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-400"
              />
              <button
                type="submit"
                className="p-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl cursor-pointer transition-colors"
                id="btn-send-support"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </Translate>
  );
}
