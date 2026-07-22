import { useState, useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

export default function KeywordDensityChecker() {
  const [content, setContent] = useState('');
  const [keyword, setKeyword] = useState('');

  const stats = useMemo(() => {
    if (!content.trim()) return null;

    const words = content.toLowerCase().match(/\b\w+\b/g) || [];
    const totalWords = words.length;

    if (!keyword.trim()) return { totalWords, count: 0, density: 0 };

    const targetKw = keyword.toLowerCase().trim();
    const targetWords = targetKw.split(/\s+/).length;

    let count = 0;
    
    if (targetWords === 1) {
      count = words.filter(w => w === targetKw).length;
    } else {
      // For multi-word keywords
      const normalizedContent = content.toLowerCase().replace(/\s+/g, ' ');
      let pos = 0;
      while (true) {
        pos = normalizedContent.indexOf(targetKw, pos);
        if (pos >= 0) {
          count++;
          pos += targetKw.length;
        } else {
          break;
        }
      }
    }

    const density = totalWords > 0 ? (count * targetWords / totalWords) * 100 : 0;

    return { totalWords, count, density };
  }, [content, keyword]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Target Keyword / Phrase</Label>
          <Input 
            value={keyword} 
            onChange={e => setKeyword(e.target.value)} 
            placeholder="e.g. seo tools"
          />
        </div>
        <div className="space-y-2">
          <Label>Content</Label>
          <Textarea 
            value={content} 
            onChange={e => setContent(e.target.value)} 
            placeholder="Paste your article or content here..."
            className="min-h-[250px]"
          />
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border rounded-xl bg-card text-card-foreground shadow-sm flex flex-col items-center justify-center text-center">
            <div className="text-sm font-medium text-muted-foreground mb-2">Total Words</div>
            <div className="text-4xl font-bold">{stats.totalWords}</div>
          </div>
          
          <div className="p-6 border rounded-xl bg-card text-card-foreground shadow-sm flex flex-col items-center justify-center text-center">
            <div className="text-sm font-medium text-muted-foreground mb-2">Keyword Appearances</div>
            <div className="text-4xl font-bold">{stats.count}</div>
          </div>
          
          <div className="p-6 border rounded-xl bg-card text-card-foreground shadow-sm flex flex-col justify-center">
            <div className="text-sm font-medium text-muted-foreground mb-2 text-center">Keyword Density</div>
            <div className="text-4xl font-bold text-center mb-4">{stats.density.toFixed(2)}%</div>
            <Progress 
              value={Math.min(stats.density * (100 / 3), 100)} 
              className={`h-2 ${stats.density > 3 ? '*:bg-red-500' : stats.density > 1 ? '*:bg-green-500' : '*:bg-yellow-500'}`} 
            />
            <div className="text-xs text-center mt-2 text-muted-foreground">
              {stats.density === 0 ? "Not found" : 
               stats.density < 1 ? "A bit low (Aim for 1-3%)" : 
               stats.density <= 3 ? "Optimal Density" : "Warning: Keyword Stuffing"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}