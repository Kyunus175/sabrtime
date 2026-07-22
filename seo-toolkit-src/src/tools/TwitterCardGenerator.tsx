import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToolResult } from '../components/ToolResult';
import { useRecentResults, RecentResultsPanel } from '../components/RecentResults';
import { Code2 } from 'lucide-react';

export default function TwitterCardGenerator() {
  const [data, setData] = useState({
    cardType: 'summary_large_image',
    title: '',
    description: '',
    image: '',
    site: '',
    creator: '',
  });
  
  const [result, setResult] = useState('');
  const { results: history, addResult, clearResults } = useRecentResults('twitter-card-generator');

  const updateData = (field: string, value: string) => {
    setData({ ...data, [field]: value });
  };

  const generate = () => {
    if (!data.title) return;

    let tags = `<!-- Twitter Card Meta Tags -->\n`;
    tags += `<meta name="twitter:card" content="${data.cardType}" />\n`;
    tags += `<meta name="twitter:title" content="${data.title.replace(/"/g, '&quot;')}" />\n`;
    
    if (data.description) {
      tags += `<meta name="twitter:description" content="${data.description.replace(/"/g, '&quot;')}" />\n`;
    }
    
    if (data.image) {
      tags += `<meta name="twitter:image" content="${data.image}" />\n`;
    }
    
    if (data.site) {
      const siteHandle = data.site.startsWith('@') ? data.site : `@${data.site}`;
      tags += `<meta name="twitter:site" content="${siteHandle}" />\n`;
    }
    
    if (data.creator) {
      const creatorHandle = data.creator.startsWith('@') ? data.creator : `@${data.creator}`;
      tags += `<meta name="twitter:creator" content="${creatorHandle}" />\n`;
    }

    setResult(tags);
    addResult(tags);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <Label>Card Type</Label>
          <Select value={data.cardType} onValueChange={v => updateData('cardType', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="summary_large_image">Summary Card with Large Image</SelectItem>
              <SelectItem value="summary">Summary Card</SelectItem>
              <SelectItem value="app">App Card</SelectItem>
              <SelectItem value="player">Player Card</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Title *</Label>
          <Input value={data.title} onChange={e => updateData('title', e.target.value)} placeholder="e.g. SabrTime SEO Toolkit" />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label>Description</Label>
          <Textarea 
            value={data.description} 
            onChange={e => updateData('description', e.target.value)} 
            placeholder="A brief description of your page..."
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Image URL</Label>
          <Input value={data.image} onChange={e => updateData('image', e.target.value)} placeholder="https://.../image.jpg" />
        </div>

        <div className="space-y-2">
          <Label>Site Handle</Label>
          <Input value={data.site} onChange={e => updateData('site', e.target.value)} placeholder="@SabrTime" />
        </div>

        <div className="space-y-2">
          <Label>Creator Handle</Label>
          <Input value={data.creator} onChange={e => updateData('creator', e.target.value)} placeholder="@YourName" />
        </div>
      </div>

      <Button onClick={generate} disabled={!data.title} className="w-full">
        <Code2 className="mr-2 h-4 w-4" /> Generate Twitter Card Tags
      </Button>

      {result && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Generated Tags</h3>
          <ToolResult content={result} isCode />
        </div>
      )}

      <RecentResultsPanel toolSlug="twitter-card-generator" results={history} onClear={clearResults} />
    </div>
  );
}