import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ToolResult } from '../components/ToolResult';
import { useRecentResults, RecentResultsPanel } from '../components/RecentResults';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

export default function SeoSlugGenerator() {
  const [title, setTitle] = useState('');
  const [separator, setSeparator] = useState('-');
  const [slug, setSlug] = useState('');
  const { results: history, addResult, clearResults } = useRecentResults('seo-slug-generator');

  useEffect(() => {
    if (!title) {
      setSlug('');
      return;
    }
    
    // Convert to lowercase
    let newSlug = title.toLowerCase();
    
    // Replace accented chars
    newSlug = newSlug.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    // Replace non-alphanumeric chars with spaces
    newSlug = newSlug.replace(/[^a-z0-9\s-]/g, ' ');
    
    // Replace spaces and multiple separators with single separator
    newSlug = newSlug.trim().replace(/\s+/g, separator);
    
    setSlug(newSlug);
  }, [title, separator]);

  const handleSave = () => {
    if (slug) addResult(slug);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Post or Page Title</Label>
          <Input 
            id="title" 
            placeholder="e.g. 10 Best SEO Tips for 2025!" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />
        </div>

        <div className="space-y-3">
          <Label>Separator</Label>
          <RadioGroup value={separator} onValueChange={setSeparator} className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="-" id="hyphen" />
              <Label htmlFor="hyphen">Hyphen (-)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="_" id="underscore" />
              <Label htmlFor="underscore">Underscore (_)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="+" id="plus" />
              <Label htmlFor="plus">Plus (+)</Label>
            </div>
          </RadioGroup>
          <p className="text-xs text-muted-foreground mt-1">
            Note: Google recommends hyphens (-) for URL slugs.
          </p>
        </div>
      </div>

      {slug && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Generated Slug</h3>
            <Button size="sm" variant="outline" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" /> Save to History
            </Button>
          </div>
          <ToolResult content={slug} />
        </div>
      )}

      <RecentResultsPanel toolSlug="seo-slug-generator" results={history} onClear={clearResults} />
    </div>
  );
}
