
import { cn } from "@/lib/utils";
import { Copy, Trash2 } from "lucide-react";

interface YetiMessageBubbleProps {
  sender: "user" | "yeti";
  message: string;
  time?: string;
  id: string;
  onDelete: (id: string) => void;
}

export function YetiMessageBubble({ sender, message, time }: YetiMessageBubbleProps) {
  const isUser = sender === "user";
  
  return (
    <div className={cn(
      "flex gap-2 sm:gap-3 group",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <div className="flex-shrink-0">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center p-1">
            <img src="/lovable-uploads/3100851d-7687-4018-afec-eca365e692df.png" alt="Yeti AI" className="w-full h-full object-contain" />
          </div>
        </div>
      )}
      
      <div className={cn(
        "max-w-[85%] sm:max-w-[80%] md:max-w-[70%] rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-sm relative transition-all duration-200 hover:shadow-md",
        isUser
          ? "bg-blue-600 text-white rounded-br-lg hover:bg-blue-700"
          : "bg-white border border-slate-200 text-slate-900 rounded-bl-lg hover:border-slate-300"
      )}>
        <div className="flex justify-between items-start gap-2">
          <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words user-select-text flex-1">{message}</div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(message);
              }}
              className="p-1 rounded-full hover:bg-black/10 transition-colors"
              aria-label="Copy message"
            >
              <Copy size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
              className="p-1 rounded-full hover:bg-black/10 transition-colors"
              aria-label="Delete message"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
        {time && (
          <div className={cn(
            "text-xs mt-1 sm:mt-2 opacity-70",
            isUser ? "text-blue-100" : "text-slate-500"
          )}>
            {time}
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white text-xs sm:text-sm">
            👤
          </div>
        </div>
      )}
    </div>
  );
}
