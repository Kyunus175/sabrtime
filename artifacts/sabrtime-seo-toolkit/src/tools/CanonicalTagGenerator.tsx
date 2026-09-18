import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ToolResult } from '../components/ToolResult';
import { useRecentResults, RecentResultsPanel } from '../components/RecentResults';
import { Code2, Save } from 'lucide-react';

export default function CanonicalTagGenerator() {
  const [url, setUrl] = useState('');
  const { results: history, addResult, clearResults } = useRecentResults('canonical-tag-generator');

  const tag = url ? `<link rel="canonical" href="${url}" />` : '';

  const handleSave = () => {
    if (tag) addResult(tag);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Canonical URL</Label>
          <Input 
            value={url} 
            onChange={e => setUrl(e.target.value)} 
            placeholder="https://example.com/preferred-page-url" 
          />
          <p className="text-sm text-muted-foreground mt-2">
            The canonical URL is the preferred version of a web page that search engines should index.
          </p>
        </div>
      </div>

      {tag && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Generated Canonical Tag</h3>
            <Button size="sm" variant="outline" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" /> Save to History
            </Button>
          </div>
          <ToolResult content={tag} isCode />
        </div>
      )}

      <RecentResultsPanel toolSlug="canonical-tag-generator" results={history} onClear={clearResults} />
    </div>
  );
}