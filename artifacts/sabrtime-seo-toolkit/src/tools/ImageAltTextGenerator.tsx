import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToolResult } from '../components/ToolResult';
import { useRecentResults, RecentResultsPanel } from '../components/RecentResults';
import { RefreshCw } from 'lucide-react';

export default function ImageAltTextGenerator() {
  const [topic, setTopic] = useState('');
  const [context, setContext] = useState('Blog');
  const [results, setResults] = useState<string[]>([]);
  const { results: history, addResult, clearResults } = useRecentResults('image-alt-text-generator');

  const generate = () => {
    if (!topic) return;
    const t = topic.trim();
    
    let generated: string[] = [];

    if (context === 'Product') {
      generated = [
        `${t} - Front view showing key features`,
        `High-quality ${t} used in daily application`,
        `Detailed close-up of ${t} material and design`,
        `${t} in lifestyle setting`,
        `${t} with packaging and accessories`
      ];
    } else if (context === 'Blog') {
      generated = [
        `Illustration explaining the concept of ${t}`,
        `Person demonstrating ${t} step-by-step`,
        `Infographic showing statistics about ${t}`,
        `Example of ${t} in a real-world scenario`,
        `Chart detailing the benefits of ${t}`
      ];
    } else if (context === 'Decoration') {
      generated = [
        `Decorative background featuring ${t}`,
        `Abstract visual representation of ${t}`,
        `Atmospheric photo setting the mood for ${t}`,
        `Minimalist design incorporating ${t} elements`,
        `Stylized artwork of ${t}`
      ];
    }

    setResults(generated);
    addResult(generated.join('\n\n'));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="topic">Image Subject/Topic</Label>
          <Input 
            id="topic" 
            placeholder="e.g. A person typing on a laptop" 
            value={topic} 
            onChange={(e) => setTopic(e.target.value)} 
          />
          <p className="text-xs text-muted-foreground mt-1">
            Describe what's literally in the image.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="context">Image Context</Label>
          <Select value={context} onValueChange={setContext}>
            <SelectTrigger>
              <SelectValue placeholder="Select context" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Blog">Blog Post / Article (Informative)</SelectItem>
              <SelectItem value="Product">eCommerce Product (Descriptive)</SelectItem>
              <SelectItem value="Decoration">Design / Decorative (Atmospheric)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={generate} disabled={!topic} className="w-full md:w-auto">
        <RefreshCw className="mr-2 h-4 w-4" /> Generate Alt Text
      </Button>

      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Generated Suggestions</h3>
          <p className="text-sm text-muted-foreground">
            Tip: Never start with "image of" or "picture of" — screen readers do that automatically.
          </p>
          <div className="grid gap-3">
            {results.map((res, i) => (
              <ToolResult key={i} content={res} />
            ))}
          </div>
        </div>
      )}

      <RecentResultsPanel toolSlug="image-alt-text-generator" results={history} onClear={clearResults} />
    </div>
  );
}
