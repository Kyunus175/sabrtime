import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Network, Plus, Trash2 } from 'lucide-react';

interface LinkTarget {
  id: number;
  keyword: string;
  url: string;
}

export default function InternalLinkSuggestion() {
  const [content, setContent] = useState('');
  const [targets, setTargets] = useState<LinkTarget[]>([
    { id: 1, keyword: 'seo strategy', url: '/seo-strategy-guide' },
    { id: 2, keyword: 'content marketing', url: '/content-marketing' }
  ]);
  const [suggestions, setSuggestions] = useState<{phrase: string, url: string, context: string}[]>([]);

  const addTarget = () => {
    setTargets([...targets, { id: Date.now(), keyword: '', url: '' }]);
  };

  const removeTarget = (id: number) => {
    setTargets(targets.filter(t => t.id !== id));
  };

  const updateTarget = (id: number, field: keyof LinkTarget, value: string) => {
    setTargets(targets.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const analyze = () => {
    const text = content.toLowerCase();
    const found: {phrase: string, url: string, context: string}[] = [];

    targets.forEach(target => {
      const kw = target.keyword.toLowerCase().trim();
      if (!kw || !target.url) return;

      const idx = text.indexOf(kw);
      if (idx !== -1) {
        // extract context
        const start = Math.max(0, idx - 40);
        const end = Math.min(text.length, idx + kw.length + 40);
        const contextStr = content.substring(start, end).replace(/\n/g, ' ');
        
        found.push({
          phrase: target.keyword,
          url: target.url,
          context: `...${contextStr}...`
        });
      }
    });

    setSuggestions(found);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="font-semibold border-b pb-2 flex justify-between items-center">
            Your Existing Pages
            <Button variant="outline" size="sm" onClick={addTarget}>
              <Plus className="h-4 w-4 mr-2" /> Add Page
            </Button>
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add the keywords and URLs you want to link to.
          </p>
          
          <div className="space-y-3">
            {targets.map(target => (
              <div key={target.id} className="flex gap-2 items-start">
                <div className="space-y-2 flex-1">
                  <Input placeholder="Target Keyword" value={target.keyword} onChange={e => updateTarget(target.id, 'keyword', e.target.value)} />
                  <Input placeholder="Target URL" value={target.url} onChange={e => updateTarget(target.id, 'url', e.target.value)} />
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeTarget(target.id)} className="mt-1">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold border-b pb-2">New Article Content</h3>
          <div className="space-y-2">
            <Label>Paste the content you are writing</Label>
            <Textarea 
              value={content} 
              onChange={e => setContent(e.target.value)} 
              placeholder="Paste your new article here to find internal linking opportunities..."
              className="min-h-[300px]"
            />
          </div>
          <Button onClick={analyze} disabled={!content.trim()} className="w-full">
            <Network className="mr-2 h-4 w-4" /> Find Link Opportunities
          </Button>
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="space-y-4 border-t pt-8">
          <h3 className="font-semibold text-lg">Suggested Internal Links</h3>
          <div className="grid gap-4">
            {suggestions.map((s, i) => (
              <div key={i} className="p-4 border rounded-lg bg-card">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-primary">{s.phrase}</span>
                  <span className="text-sm text-muted-foreground">{s.url}</span>
                </div>
                <div className="text-sm italic text-muted-foreground">
                  {s.context}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {content.trim() && suggestions.length === 0 && (
        <div className="p-4 bg-muted/50 rounded-lg text-center text-muted-foreground">
          No matching keywords found in the content. Try adding more target pages or different keywords.
        </div>
      )}
    </div>
  );
}