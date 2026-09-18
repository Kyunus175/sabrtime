import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ToolResult } from '../components/ToolResult';
import { Code2, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function JsonLdValidator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{formatted: string, isValid: boolean, error: string | null, types: string[]}>({
    formatted: '',
    isValid: false,
    error: null,
    types: []
  });

  const validate = () => {
    if (!input.trim()) return;

    try {
      // Clean input if it has <script> tags
      let jsonStr = input.trim();
      jsonStr = jsonStr.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '');
      
      const parsed = JSON.parse(jsonStr);
      
      const hasContext = parsed['@context'] === 'https://schema.org' || parsed['@context'] === 'http://schema.org';
      const type = parsed['@type'];
      
      const typesFound: string[] = [];
      if (type) {
        if (Array.isArray(type)) typesFound.push(...type);
        else typesFound.push(type);
      }
      
      // Also look inside graph or mainEntity
      if (parsed['@graph'] && Array.isArray(parsed['@graph'])) {
        parsed['@graph'].forEach((item: any) => {
          if (item['@type']) typesFound.push(item['@type']);
        });
      }

      setResult({
        formatted: `<script type="application/ld+json">\n${JSON.stringify(parsed, null, 2)}\n</script>`,
        isValid: hasContext && typesFound.length > 0,
        error: !hasContext ? "Missing or incorrect @context. Should be 'https://schema.org'" : 
               typesFound.length === 0 ? "Missing @type declaration." : null,
        types: Array.from(new Set(typesFound))
      });
    } catch (e: any) {
      setResult({
        formatted: '',
        isValid: false,
        error: `Invalid JSON format: ${e.message}`,
        types: []
      });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Paste JSON-LD Code</Label>
          <Textarea 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            placeholder='{"@context": "https://schema.org", "@type": "Organization", ...}'
            className="min-h-[250px] font-mono text-sm"
          />
        </div>
      </div>

      <Button onClick={validate} disabled={!input.trim()} className="w-full">
        <Code2 className="mr-2 h-4 w-4" /> Validate & Format
      </Button>

      {result.error !== null && !result.isValid && (
        <div className="p-4 border border-red-500/50 bg-red-500/10 text-red-600 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 mt-0.5" />
          <div>
            <h4 className="font-semibold">Validation Error</h4>
            <p className="text-sm mt-1">{result.error}</p>
          </div>
        </div>
      )}

      {result.isValid && (
        <div className="space-y-6">
          <div className="p-4 border border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400 rounded-lg flex items-start gap-3">
            <CheckCircle className="h-5 w-5 mt-0.5" />
            <div>
              <h4 className="font-semibold">Valid JSON-LD Schema</h4>
              <div className="text-sm mt-2 flex items-center gap-2 flex-wrap">
                Detected Types:
                {result.types.map(t => (
                  <Badge key={t} variant="secondary" className="bg-green-500/20 text-green-700 dark:text-green-400">{t}</Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Formatted Code</h3>
            <ToolResult content={result.formatted} isCode />
          </div>
        </div>
      )}
    </div>
  );
}