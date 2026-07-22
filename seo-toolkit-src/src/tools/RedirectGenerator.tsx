import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToolResult } from '../components/ToolResult';
import { useRecentResults, RecentResultsPanel } from '../components/RecentResults';
import { Code2 } from 'lucide-react';

export default function RedirectGenerator() {
  const [fromUrl, setFromUrl] = useState('');
  const [toUrl, setToUrl] = useState('');
  const [redirectType, setRedirectType] = useState('301');
  const [serverType, setServerType] = useState('apache');
  
  const [result, setResult] = useState('');
  const { results: history, addResult, clearResults } = useRecentResults('redirect-generator');

  const generate = () => {
    if (!fromUrl || !toUrl) return;

    let code = '';
    const fromPath = fromUrl.replace(/^https?:\/\/[^\/]+/, ''); // extract path if full URL provided

    if (serverType === 'apache') {
      code = `RewriteEngine On\nRewriteRule ^${fromPath.replace(/^\//, '')}$ ${toUrl} [R=${redirectType},L]`;
    } else if (serverType === 'nginx') {
      const directive = redirectType === '301' ? 'permanent' : 'redirect';
      code = `rewrite ^${fromPath}$ ${toUrl} ${directive};`;
    } else if (serverType === 'cloudflare') {
      code = `// Cloudflare Page Rule or Bulk Redirect\nSource: ${fromUrl || '*example.com' + fromPath}\nTarget: ${toUrl}\nStatus Code: ${redirectType}`;
    }

    setResult(code);
    addResult(code);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Old URL (From)</Label>
          <Input value={fromUrl} onChange={e => setFromUrl(e.target.value)} placeholder="/old-page or https://..." />
        </div>
        <div className="space-y-2">
          <Label>New URL (To)</Label>
          <Input value={toUrl} onChange={e => setToUrl(e.target.value)} placeholder="https://newdomain.com/new-page" />
        </div>
        
        <div className="space-y-2">
          <Label>Redirect Type</Label>
          <Select value={redirectType} onValueChange={setRedirectType}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="301">301 - Moved Permanently (SEO Recommended)</SelectItem>
              <SelectItem value="302">302 - Found / Temporary</SelectItem>
              <SelectItem value="307">307 - Temporary Redirect</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Server Type</Label>
          <Select value={serverType} onValueChange={setServerType}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="apache">Apache (.htaccess)</SelectItem>
              <SelectItem value="nginx">Nginx (nginx.conf)</SelectItem>
              <SelectItem value="cloudflare">Cloudflare</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={generate} disabled={!fromUrl || !toUrl} className="w-full">
        <Code2 className="mr-2 h-4 w-4" /> Generate Redirect Code
      </Button>

      {result && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Generated Redirect Rule</h3>
          <ToolResult content={result} isCode />
        </div>
      )}

      <RecentResultsPanel toolSlug="redirect-generator" results={history} onClear={clearResults} />
    </div>
  );
}