import { useState, useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function ReadabilityChecker() {
  const [content, setContent] = useState('');

  const stats = useMemo(() => {
    const text = content.trim();
    if (!text) return null;

    const words: string[] = text.match(/\b\w+\b/g) || [];
    const numWords = words.length;
    if (numWords === 0) return null;

    const numSentences = text.split(/[.!?]+/).filter(Boolean).length || 1;
    
    // Syllable counting approximation
    const countSyllables = (word: string) => {
      word = word.toLowerCase();
      if (word.length <= 3) return 1;
      word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
      word = word.replace(/^y/, '');
      const match = word.match(/[aeiouy]{1,2}/g);
      return match ? match.length : 1;
    };

    const numSyllables: number = words.reduce((acc: number, word: string) => acc + countSyllables(word), 0);

    // Flesch-Kincaid Reading Ease
    // 206.835 - 1.015 * (total words / total sentences) - 84.6 * (total syllables / total words)
    const score = 206.835 - 1.015 * (numWords / numSentences) - 84.6 * (numSyllables / numWords);
    
    // Flesch-Kincaid Grade Level
    const grade = 0.39 * (numWords / numSentences) + 11.8 * (numSyllables / numWords) - 15.59;

    let label = '';
    let color = '';
    if (score >= 90) { label = 'Very Easy'; color = 'text-green-500'; }
    else if (score >= 80) { label = 'Easy'; color = 'text-green-500'; }
    else if (score >= 70) { label = 'Fairly Easy'; color = 'text-green-500'; }
    else if (score >= 60) { label = 'Standard'; color = 'text-yellow-500'; }
    else if (score >= 50) { label = 'Fairly Difficult'; color = 'text-yellow-500'; }
    else if (score >= 30) { label = 'Difficult'; color = 'text-red-500'; }
    else { label = 'Very Difficult'; color = 'text-red-500'; }

    return {
      score: score.toFixed(1),
      grade: grade.toFixed(1),
      avgWordsPerSentence: (numWords / numSentences).toFixed(1),
      avgSyllablesPerWord: (numSyllables / numWords).toFixed(2),
      label,
      color,
    };
  }, [content]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 border rounded-xl bg-card text-card-foreground shadow-sm flex flex-col justify-center lg:col-span-2">
            <div className="text-sm font-medium text-muted-foreground mb-2">Flesch-Kincaid Reading Ease</div>
            <div className="flex items-baseline gap-3">
              <span className={`text-5xl font-bold ${stats.color}`}>{stats.score}</span>
              <span className={`text-lg font-medium ${stats.color}`}>{stats.label}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-2">Target score for most audiences is 60-70.</div>
          </div>
          
          <div className="p-4 border rounded-xl bg-card text-card-foreground shadow-sm flex flex-col justify-center">
            <div className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Est. Grade Level</div>
            <div className="text-2xl font-bold">{stats.grade}</div>
          </div>

          <div className="p-4 border rounded-xl bg-card text-card-foreground shadow-sm flex flex-col justify-center">
            <div className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Words / Sentence</div>
            <div className="text-2xl font-bold">{stats.avgWordsPerSentence}</div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>Text Content</Label>
        <Textarea 
          value={content} 
          onChange={e => setContent(e.target.value)} 
          placeholder="Paste text here to analyze readability..."
          className="min-h-[300px] text-base leading-relaxed"
        />
      </div>
    </div>
  );
}