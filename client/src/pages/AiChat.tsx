import React, { useState, useRef, useEffect } from "react";

import { cn } from "@/lib/utils";
import { Bot, Loader2, Leaf } from "lucide-react";
import { 
  ChatInterface, 
  WelcomeMessage,  
  SuggestedQuestions,
  FeedbackButtons,
  ScrollToBottomButton
} from "@/components/ui/chat-interface";
import { motion, AnimatePresence } from "framer-motion";
import { NavbarWrapper } from "@/components/Navbar";
import { getAiChatResponse, getEnvironmentalTips } from "@/lib/aiChat";
import Markdown from "markdown-to-jsx";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  environmentalTips?: string[];
}

export default function AiChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll ke pesan terbaru saat ada pesan baru
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Deteksi scroll untuk menampilkan tombol scroll to bottom
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom && messages.length > 0);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Sembunyikan saran pertanyaan setelah pengguna mengirim pesan
    setShowSuggestions(false);

    // Tambahkan pesan pengguna ke daftar pesan
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setApiKeyError(null);

    try {
      // Tambahkan logging untuk debugging
      console.log("Mengirim permintaan ke Gemini API:", content);
      
      // Dapatkan respons dari AI dengan timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Permintaan timeout setelah 30 detik")), 30000)
      );
      
      const responsePromise = getAiChatResponse(content);
      const response = await Promise.race([responsePromise, timeoutPromise]);
      
      console.log("Respons dari Gemini API:", response);
      
      // Verifikasi bahwa respons valid
      if (!response) {
        throw new Error("Tidak ada respons dari AI");
      }
      
      // Dapatkan tips lingkungan berdasarkan konteks percakapan
      let environmentalTips: string[] = [];
      try {
        environmentalTips = await getEnvironmentalTips(content);
      } catch (error) {
        console.error("Error saat mendapatkan tips lingkungan:", error);
      }
      
      // Tambahkan pesan AI ke daftar pesan
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.toString(),
        sender: "ai",
        timestamp: new Date(),
        environmentalTips: environmentalTips.length > 0 ? environmentalTips : undefined,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error detail:", error);
      
      // Tambahkan pesan error yang lebih informatif
      let errorMessage = "Kesalahan tidak diketahui";
      
      if (error instanceof Error) {
        errorMessage = error.message;
        console.error("Stack trace:", error.stack);
        
        // Cek apakah error terkait dengan API key
        if (errorMessage.includes("API key") || errorMessage.includes("authentication")) {
          setApiKeyError("API key Gemini tidak valid atau tidak ditemukan. Pastikan VITE_GEMINI_API_KEY telah diatur dengan benar di file .env");
        }
      }
      
      // Cek apakah error terkait dengan koneksi
      const isConnectionError = errorMessage.includes("network") || 
                               errorMessage.includes("connection") ||
                               errorMessage.includes("timeout");
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: isConnectionError 
          ? `Maaf, terjadi masalah koneksi saat menghubungi layanan Gemini AI. Silakan periksa koneksi internet Anda dan coba lagi.`
          : `Maaf, terjadi kesalahan saat memproses permintaan Anda: ${errorMessage}. Silakan coba lagi nanti.`,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestionClick = (question: string) => {
    handleSendMessage(question);
  };

  // Fungsi untuk mengetik ulang pesan
  const handleRetry = () => {
    if (messages.length > 0) {
      const lastUserMessage = [...messages].reverse().find(m => m.sender === "user");
      if (lastUserMessage) {
        setInputValue(lastUserMessage.content);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Gunakan NavbarWrapper yang sudah ada */}
      <NavbarWrapper />
      
      {/* Container utama dengan padding top untuk memberikan ruang pada navbar */}
      <div className="flex-1 container max-w-4xl mx-auto px-4 pt-20 pb-4">
        {apiKeyError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Error API Key</p>
            <p>{apiKeyError}</p>
          </div>
        )}
        
        <ChatInterface
          onSendMessage={handleSendMessage}
          inputValue={inputValue}
          setInputValue={setInputValue}
          placeholder="Tanyakan tentang pengelolaan sampah..."
          isLoading={isLoading}
          className="flex-1 h-[calc(100vh-5rem)]" 
          onSuggestedQuestionClick={handleSuggestedQuestionClick}
        >
          <div 
            ref={messagesContainerRef}
            className="h-full overflow-y-auto scroll-smooth"
          >
            {messages.length === 0 ? (
              <>
                <WelcomeMessage />
                {showSuggestions && (
                  <div className="animate-fadeIn">
                    <SuggestedQuestions onQuestionClick={handleSuggestedQuestionClick} />
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-6 pb-4">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className={cn(
                          "flex flex-col rounded-lg p-4 transition-all duration-200 hover:shadow-md",
                          message.sender === "user"
                            ? "ml-auto bg-primary/10 text-foreground rounded-tr-none max-w-[80%]"
                            : "mr-auto bg-secondary/10 text-foreground rounded-tl-none max-w-[80%]"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {message.sender === "ai" ? (
                            <Leaf className="h-5 w-5 text-primary" />
                          ) : null}
                          <span className="text-xs opacity-70">
                            {message.sender === "user" ? "Anda" : "PilaRahan AI"} • {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        {message.sender === "user" ? (
                          <div className="whitespace-pre-line">{message.content}</div>
                        ) : (
                          <div className="markdown-content prose prose-sm max-w-none dark:prose-invert prose-headings:mb-2 prose-headings:mt-4 prose-p:my-2 prose-pre:my-0 prose-pre:p-0">
                            <Markdown
                              options={{
                                overrides: {
                                  pre: {
                                    component: ({ children, ...props }) => (
                                      <div className="not-prose my-4 overflow-hidden rounded-lg border bg-background/40">
                                        <pre {...props} className="overflow-x-auto p-4">
                                          {children}
                                        </pre>
                                      </div>
                                    ),
                                  },
                                  code: {
                                    component: ({ children, ...props }) => (
                                      <code {...props} className="rounded-sm bg-muted px-1 py-0.5 font-mono text-sm">
                                        {children}
                                      </code>
                                    ),
                                  },
                                },
                              }}
                            >
                              {message.content}
                            </Markdown>
                          </div>
                        )}
                        
                        {/* Tampilkan tips lingkungan jika ada */}
                        {message.sender === "ai" && message.environmentalTips && message.environmentalTips.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-primary/20">
                            <p className="font-medium text-sm text-primary mb-2">Tips Lingkungan:</p>
                            <ul className="space-y-1">
                              {message.environmentalTips.map((tip, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                  <Leaf className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {message.sender === "ai" && <FeedbackButtons messageId={message.id} />}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center p-4 bg-background/80 rounded-lg shadow-sm max-w-[80%] mr-auto"
                  >
                    <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
                    <span className="text-sm text-muted-foreground">PilaRahan AI sedang berpikir...</span>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          <AnimatePresence>
            {showScrollButton && (
              <ScrollToBottomButton onClick={scrollToBottom} />
            )}
          </AnimatePresence>
        </ChatInterface>
      </div>
    </div>
  );
}