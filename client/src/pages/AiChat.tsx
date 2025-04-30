import React, { useState, useRef, useEffect } from "react";
import { getAiChatResponse } from "@/lib/aiChat";
import { cn } from "@/lib/utils";
import { Bot, Loader2, Leaf } from "lucide-react";
import { 
  ChatInterface, 
  WelcomeMessage, 
  ActionButtons, 
  SuggestedQuestions,
  FeedbackButtons,
  ScrollToBottomButton
} from "@/components/ui/chat-interface";
import { motion, AnimatePresence } from "framer-motion";
import { NavbarWrapper } from "@/components/Navbar";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export default function AiChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
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

    try {
      // Dapatkan respons dari AI
      const response = await getAiChatResponse(content);
      
      // Format respons AI
      let aiResponseContent = response.message;
      
      // Tambahkan tips lingkungan jika ada
      if (response.environmentalTips && response.environmentalTips.length > 0) {
        aiResponseContent += "\n\nTips Lingkungan:\n";
        response.environmentalTips.forEach((tip, index) => {
          aiResponseContent += `${index + 1}. ${tip}\n`;
        });
      }

      // Tambahkan pesan AI ke daftar pesan
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponseContent,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      
      // Tambahkan pesan error
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Maaf, terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi nanti.",
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
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
                <ActionButtons />
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
                        <div className="whitespace-pre-line">{message.content}</div>
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