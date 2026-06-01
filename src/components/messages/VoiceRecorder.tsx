import { Mic, Pause, Send, X } from 'lucide-react';

interface VoiceRecorderProps {
  duration: string;
  onCancel: () => void;
  onSend: () => void;
}

const bars = [12, 18, 10, 26, 18, 32, 16, 22, 14, 28, 20, 34, 16, 24, 12, 30, 18, 26, 14, 20, 12];

export default function VoiceRecorder({ duration, onCancel, onSend }: VoiceRecorderProps) {
  return (
    <div className="flex w-full items-center gap-2 transition-all duration-300">
      <button
        type="button"
        aria-label="Cancel voice recording"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-btn-primary text-white transition-transform hover:scale-[1.02]"
        onClick={onCancel}
      >
        <X className="h-5 w-5" />
      </button>

      <div className="flex h-10 min-w-0 flex-1 items-center gap-3 rounded-lg bg-btn-primary px-3 text-white">
        <button type="button" aria-label="Pause recording" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15">
          <Pause className="h-4 w-4 fill-white" />
        </button>
        <div className="flex min-w-0 flex-1 items-center justify-center gap-0.5">
          {bars.map((height, index) => (
            <span
              key={`${height}-${index}`}
              className="w-1 rounded-full bg-white/90 motion-safe:animate-pulse"
              style={{ height: `${height}px`, animationDelay: `${index * 60}ms` }}
            />
          ))}
        </div>
        <span className="min-w-[42px] text-right text-xs-custom font-semibold">{duration}</span>
        <Mic className="h-4 w-4 shrink-0" />
      </div>

      <button
        type="button"
        aria-label="Send voice message"
        className="flex h-10 w-12 shrink-0 items-center justify-center rounded-lg bg-btn-primary text-white transition-transform hover:scale-[1.02]"
        onClick={onSend}
      >
        <Send className="h-5 w-5" />
      </button>
    </div>
  );
}
