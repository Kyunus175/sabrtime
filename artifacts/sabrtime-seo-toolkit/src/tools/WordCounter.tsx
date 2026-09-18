import { useState, useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function WordCounter() {
  const [content, setContent] = useState('');

  const stats = useMemo(() => {
    const text = content.trim();
    if (!text) {
      return { words: 0, chars: 0, charsNoSpaces: 0, sentences: 0, paragraphs: 0, readTime: 0, speakTime: 0 };
    }

    const words = text.match(/\b\w+\b/g)?.length || 0;
    const chars = content.length; // use raw content for chars with space
    const charsNoSpaces = content.replace(/\s+/g, '').length;
    const sentences = text.split(/[.!?]+/).filter(Boolean).length;
    const paragraphs = text.split(/\n+/).filter(Boolean).length;
    
    // Average reading speed: 238 words per minute
    // Average speaking speed: 130 words per minute
    const readTime = Math.ceil(words / 238);
    const speakTime = Math.ceil(words / 130);

    return { words, chars, charsNoSpaces, sentences, paragraphs, readTime, speakTime };
  }, [content]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Words" value={stats.words} />
        <StatCard label="Characters" value={stats.chars} />
        <StatCard label="Sentences" value={stats.sentences} />
        <StatCard label="Paragraphs" value={stats.paragraphs} />
        <StatCard label="Chars (no spaces)" value={stats.charsNoSpaces} />
        <StatCard label="Reading Time" value={`${stats.readTime} min`} />
        <StatCard label="Speaking Time" value={`${stats.speakTime} min`} />
      </div>

      <div className="space-y-2">
        <Label>Text Content</Label>
        <Textarea 
          value={content} 
          onChange={e => setContent(e.target.value)} 
          placeholder="Start typing or paste your text here..."
          className="min-h-[300px] text-base leading-relaxed"
        />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string, value: string | number }) {
  return (
    <div className="p-4 border rounded-xl bg-card text-card-foreground shadow-sm flex flex-col justify-center">
      <div className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}