import React, { useState, useRef, ReactNode, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Leaf, Recycle, Trash2, ThumbsUp, ArrowUp, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

interface ChatInterfaceProps {
  children?: ReactNode;
  onSendMessage: (message: string) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
  onSuggestedQuestionClick?: (question: string) => void;
}

export function ChatInterface({
  children,
  onSendMessage,
  inputValue,
  setInputValue,
  placeholder = "Apa yang ingin Anda ketahui?",
  isLoading = false,
  className,
  onSuggestedQuestionClick,
}: ChatInterfaceProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    // Auto-focus input pada load
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim()) {
        onSendMessage(inputValue);
      }
    }
  };

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
        {children}
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="border-t border-border p-4 bg-background/80 backdrop-blur-sm sticky bottom-0"
      >
        <div className="relative flex items-center max-w-2xl mx-auto">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className={cn(
              "pr-10 py-6 bg-background border-gray-300 dark:border-gray-700 rounded-2xl shadow-sm transition-all duration-300",
              isFocused ? "ring-2 ring-primary/30 border-primary" : "",
              isLoading ? "opacity-70" : ""
            )}
            disabled={isLoading}
          />
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="absolute right-2"
          >
            <Button
              onClick={() => {
                if (inputValue.trim()) {
                  onSendMessage(inputValue);
                }
              }}
              disabled={!inputValue.trim() || isLoading}
              className="rounded-2xl w-8 h-8 p-0 hover:bg-primary/20 transition-colors duration-200"
              variant={inputValue.trim() ? "default" : "ghost"}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-4 w-4" />
                </motion.div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </motion.div>
        </div>
        
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className="ml-auto text-xs text-muted-foreground">
            PilaRahan AI
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function WelcomeMessage({ username = "Pengguna" }) {
  const timeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "pagi";
    if (hour < 18) return "siang";
    return "malam";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center text-center py-12"
    >
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-4 text-primary"
      >
        <Leaf className="h-12 w-12" />
      </motion.div>
      <motion.h1 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-2xl font-semibold mb-2"
      >
        Selamat {timeOfDay()}, {username}.
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-muted-foreground mb-6"
      >
        Bagaimana saya bisa membantu Anda dengan pengelolaan sampah hari ini?
      </motion.p>
    </motion.div>
  );
}

export function SuggestedQuestions({ onQuestionClick }: { onQuestionClick: (question: string) => void }) {
  const questions = [
    { text: "Bagaimana cara mendaur ulang botol plastik?"},
    { text: "Apa dampak sampah elektronik terhadap lingkungan?"},
    { text: "Tips mengurangi sampah rumah tangga?"},
    { text: "Lokasi tempat daur ulang terdekat?"},
    { text: "Cara membuat kompos dari sampah dapur?"},
    { text: "Apa itu konsep zero waste?"},
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 max-w-2xl mx-auto mb-12"
    >
      {questions.map((question, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 + index * 0.1, duration: 0.3 }}
        >
          <Card 
            className="border border-border/50 hover:border-primary/50 hover:bg-primary/5 hover:shadow-md transition-all duration-200 cursor-pointer"
            onClick={() => onQuestionClick(question.text)}
          >
            <CardContent className="p-3">
              <div className="flex items-center text-sm">
                <span>{question.text}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}


export function FeedbackButtons({ messageId }: { messageId: string }) {
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);
  
  const handleFeedback = (type: 'like' | 'dislike') => {
    setFeedback(type);
    setShowThankYou(true);
    
    // Sembunyikan pesan terima kasih setelah 2 detik
    setTimeout(() => {
      setShowThankYou(false);
    }, 2000);
  };
  
  return (
    <div className="flex items-center gap-2 mt-2">
      <AnimatePresence>
        {showThankYou ? (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-primary"
          >
            Terima kasih atas umpan balik Anda!
          </motion.span>
        ) : (
          <>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`rounded-2xl p-1 ${feedback === 'like' ? 'bg-primary/20 text-primary' : ''}`}
                onClick={() => handleFeedback('like')}
              >
                <ThumbsUp className="h-3 w-3" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`rounded-full p-1 ${feedback === 'dislike' ? 'bg-destructive/20 text-destructive' : ''}`}
                onClick={() => handleFeedback('dislike')}
              >
                <ThumbsUp className="h-3 w-3 rotate-180" />
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ScrollToBottomButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed bottom-20 right-4 z-10"
    >
      <Button
        onClick={onClick}
        className="rounded-full w-10 h-10 shadow-md bg-primary hover:bg-primary/90"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </motion.div>
  );
}