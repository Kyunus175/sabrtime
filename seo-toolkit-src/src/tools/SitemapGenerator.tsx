import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToolResult } from '../components/ToolResult';
import { useRecentResults, RecentResultsPanel } from '../components/RecentResults';
import { Code2, Plus, Trash2 } from 'lucide-react';

interface PageEntry {
  id: number;
  path: string;
  priority: string;
  changefreq: string;
  lastmod: string;
}

export default function SitemapGenerator() {
  const [baseUrl, setBaseUrl] = useState('https://sabrtime.in');
  const [pages, setPages] = useState<PageEntry[]>([
    { id: 1, path: '/', priority: '1.0', changefreq: 'daily', lastmod: new Date().toISOString().split('T')[0] },
    { id: 2, path: '/about', priority: '0.8', changefreq: 'monthly', lastmod: new Date().toISOString().split('T')[0] }
  ]);
  const [sitemap, setSitemap] = useState('');
  const { results: history, addResult, clearResults } = useRecentResults('sitemap-generator');

  const updatePage = (id: number, field: keyof PageEntry, value: string) => {
    setPages(pages.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const addPage = () => {
    setPages([...pages, { 
      id: Date.now(), 
      path: '/new-page', 
      priority: '0.5', 
      changefreq: 'monthly', 
      lastmod: new Date().toISOString().split('T')[0] 
    }]);
  };

  const removePage = (id: number) => {
    if (pages.length <= 1) return;
    setPages(pages.filter(p => p.id !== id));
  };

  const generate = () => {
    if (!baseUrl) return;
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    pages.forEach(p => {
      const path = p.path.startsWith('/') ? p.path : `/${p.path}`;
      xml += `  <url>\n`;
      xml += `    <loc>${cleanBaseUrl}${path}</loc>\n`;
      if (p.lastmod) xml += `    <lastmod>${p.lastmod}</lastmod>\n`;
      if (p.changefreq) xml += `    <changefreq>${p.changefreq}</changefreq>\n`;
      if (p.priority) xml += `    <priority>${p.priority}</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    setSitemap(xml);
    addResult(xml);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Base Website URL</Label>
          <Input value={baseUrl} onChange={e => setBaseUrl(e.target.value)} placeholder="https://example.com" />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg flex items-center justify-between">
          Pages
          <Button variant="outline" size="sm" onClick={addPage}>
            <Plus className="h-4 w-4 mr-2" /> Add Page
          </Button>
        </h3>
        
        <div className="grid gap-4">
          {pages.map((page, index) => (
            <div key={page.id} className="p-4 border rounded-lg bg-muted/20 relative group grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="absolute -top-3 -right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="destructive" size="icon" className="h-8 w-8 rounded-full shadow-md" onClick={() => removePage(page.id)} disabled={pages.length <= 1}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2 md:col-span-5">
                <Label>Path / URL Slug</Label>
                <Input value={page.path} onChange={e => updatePage(page.id, 'path', e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Priority</Label>
                <Input value={page.priority} onChange={e => updatePage(page.id, 'priority', e.target.value)} type="number" step="0.1" min="0" max="1" />
              </div>
              <div className="space-y-2 md:col-span-3">
                <Label>Change Freq</Label>
                <Select value={page.changefreq} onValueChange={v => updatePage(page.id, 'changefreq', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'].map(f => (
                      <SelectItem key={f} value={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Last Mod</Label>
                <Input type="date" value={page.lastmod} onChange={e => updatePage(page.id, 'lastmod', e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={generate} disabled={!baseUrl} className="w-full">
        <Code2 className="mr-2 h-4 w-4" /> Generate XML Sitemap
      </Button>

      {sitemap && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Generated sitemap.xml</h3>
          <ToolResult content={sitemap} filename="sitemap.xml" isCode />
        </div>
      )}

      <RecentResultsPanel toolSlug="sitemap-generator" results={history} onClear={clearResults} />
    </div>
  );
}