import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToolResult } from '../components/ToolResult';
import { useRecentResults, RecentResultsPanel } from '../components/RecentResults';
import { Checkbox } from '@/components/ui/checkbox';
import { Code2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function RobotsTxtGenerator() {
  const [defaultRule, setDefaultRule] = useState('Allow');
  const [delay, setDelay] = useState('');
  const [sitemap, setSitemap] = useState('');
  const [blockAI, setBlockAI] = useState(false);
  const [customRules, setCustomRules] = useState('');
  
  const [result, setResult] = useState('');
  const { results: history, addResult, clearResults } = useRecentResults('robots-txt-generator');

  const generate = () => {
    let txt = `User-agent: *\n`;
    
    if (defaultRule === 'Disallow') {
      txt += `Disallow: /\n`;
    } else {
      txt += `Allow: /\n`;
    }

    if (delay) {
      txt += `Crawl-delay: ${delay}\n`;
    }

    if (blockAI) {
      txt += `\n# Block AI Crawlers\n`;
      const aiBots = ['GPTBot', 'ChatGPT-User', 'Google-Extended', 'Anthropic-bot', 'Claude-Web', 'CCBot', 'Omgilibot', 'Omgili'];
      aiBots.forEach(bot => {
        txt += `User-agent: ${bot}\nDisallow: /\n`;
      });
    }

    if (customRules.trim()) {
      txt += `\n# Custom Rules\n${customRules.trim()}\n`;
    }

    if (sitemap.trim()) {
      txt += `\nSitemap: ${sitemap.trim()}\n`;
    }

    setResult(txt);
    addResult(txt);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Default Access for all Search Engines</Label>
          <Select value={defaultRule} onValueChange={setDefaultRule}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Allow">Allow All (Default)</SelectItem>
              <SelectItem value="Disallow">Disallow All</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Crawl-delay (seconds) - Optional</Label>
          <Input type="number" min="1" value={delay} onChange={e => setDelay(e.target.value)} placeholder="e.g. 10" />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>XML Sitemap URL (Optional)</Label>
          <Input value={sitemap} onChange={e => setSitemap(e.target.value)} placeholder="https://example.com/sitemap.xml" />
        </div>

        <div className="md:col-span-2 space-y-4 border p-4 rounded-lg bg-muted/20">
          <div className="flex items-center space-x-2">
            <Checkbox id="blockAi" checked={blockAI} onCheckedChange={(c) => setBlockAI(!!c)} />
            <div className="grid gap-1.5 leading-none">
              <label htmlFor="blockAi" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Block AI Crawlers & Scrapers
              </label>
              <p className="text-sm text-muted-foreground">
                Prevents OpenAI, Google Extended, Anthropic, and others from scraping your site.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Custom Disallow/Allow Rules (Optional)</Label>
          <Textarea 
            value={customRules} 
            onChange={e => setCustomRules(e.target.value)} 
            placeholder="Disallow: /admin/\nDisallow: /private/\nAllow: /public/"
            className="min-h-[100px] font-mono text-sm"
          />
        </div>
      </div>

      <Button onClick={generate} className="w-full">
        <Code2 className="mr-2 h-4 w-4" /> Generate robots.txt
      </Button>

      {result && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Generated robots.txt</h3>
          <ToolResult content={result} filename="robots.txt" isCode />
        </div>
      )}

      <RecentResultsPanel toolSlug="robots-txt-generator" results={history} onClear={clearResults} />
    </div>
  );
}