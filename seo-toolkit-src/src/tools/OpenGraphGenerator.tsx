import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToolResult } from '../components/ToolResult';
import { useRecentResults, RecentResultsPanel } from '../components/RecentResults';
import { Code2 } from 'lucide-react';

export default function OpenGraphGenerator() {
  const [data, setData] = useState({
    title: '',
    description: '',
    url: '',
    image: '',
    type: 'website',
    siteName: '',
  });
  
  const [result, setResult] = useState('');
  const { results: history, addResult, clearResults } = useRecentResults('open-graph-generator');

  const updateData = (field: string, value: string) => {
    setData({ ...data, [field]: value });
  };

  const generate = () => {
    if (!data.title || !data.url) return;

    let tags = `<!-- Open Graph Meta Tags -->\n`;
    tags += `<meta property="og:title" content="${data.title.replace(/"/g, '&quot;')}" />\n`;
    tags += `<meta property="og:type" content="${data.type}" />\n`;
    tags += `<meta property="og:url" content="${data.url}" />\n`;
    
    if (data.image) {
      tags += `<meta property="og:image" content="${data.image}" />\n`;
    }
    
    if (data.description) {
      tags += `<meta property="og:description" content="${data.description.replace(/"/g, '&quot;')}" />\n`;
    }
    
    if (data.siteName) {
      tags += `<meta property="og:site_name" content="${data.siteName.replace(/"/g, '&quot;')}" />\n`;
    }

    setResult(tags);
    addResult(tags);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <Label>Page Title *</Label>
          <Input value={data.title} onChange={e => updateData('title', e.target.value)} placeholder="e.g. SabrTime SEO Toolkit" />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label>Page Description</Label>
          <Textarea 
            value={data.description} 
            onChange={e => updateData('description', e.target.value)} 
            placeholder="A brief description of your page..."
          />
        </div>

        <div className="space-y-2">
          <Label>Page URL *</Label>
          <Input value={data.url} onChange={e => updateData('url', e.target.value)} placeholder="https://..." />
        </div>

        <div className="space-y-2">
          <Label>Image URL</Label>
          <Input value={data.image} onChange={e => updateData('image', e.target.value)} placeholder="https://.../image.jpg" />
        </div>

        <div className="space-y-2">
          <Label>Object Type</Label>
          <Select value={data.type} onValueChange={v => updateData('type', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="website">Website (Default)</SelectItem>
              <SelectItem value="article">Article</SelectItem>
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="profile">Profile</SelectItem>
              <SelectItem value="video.other">Video</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Site Name</Label>
          <Input value={data.siteName} onChange={e => updateData('siteName', e.target.value)} placeholder="e.g. SabrTime" />
        </div>
      </div>

      <Button onClick={generate} disabled={!data.title || !data.url} className="w-full">
        <Code2 className="mr-2 h-4 w-4" /> Generate Open Graph Tags
      </Button>

      {result && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Generated Tags</h3>
          <ToolResult content={result} isCode />
        </div>
      )}

      <RecentResultsPanel toolSlug="open-graph-generator" results={history} onClear={clearResults} />
    </div>
  );
}