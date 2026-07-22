import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToolResult } from '../components/ToolResult';
import { useRecentResults, RecentResultsPanel } from '../components/RecentResults';
import { Badge } from '@/components/ui/badge';
import { RefreshCw } from 'lucide-react';

export default function MetaTitleGenerator() {
  const [keyword, setKeyword] = useState('');
  const [brand, setBrand] = useState('');
  const [tone, setTone] = useState('Professional');
  const [results, setResults] = useState<string[]>([]);
  const { results: history, addResult, clearResults } = useRecentResults('meta-title-generator');

  const generate = () => {
    if (!keyword) return;
    const k = keyword.trim();
    const b = brand.trim() ? ` | ${brand.trim()}` : '';
    
    let generated: string[] = [];
    const year = new Date().getFullYear();

    if (tone === 'Professional') {
      generated = [
        `${k}: A Complete Guide${b}`,
        `Ultimate Guide to ${k} in ${year}${b}`,
        `${k} Explained: Everything You Need to Know${b}`,
        `Best Practices for ${k}${b}`,
        `${k} Services: Expert Solutions${b}`
      ];
    } else if (tone === 'Casual') {
      generated = [
        `How to Crush ${k} This Year${b}`,
        `The Easy Way to Handle ${k}${b}`,
        `5 Simple Tricks for Better ${k}${b}`,
        `${k} Made Simple${b}`,
        `Your Go-To Guide for ${k}${b}`
      ];
    } else if (tone === 'Question') {
      generated = [
        `What is ${k}? Complete Overview${b}`,
        `How Does ${k} Work? Explained${b}`,
        `Why is ${k} So Important?${b}`,
        `Looking for ${k}? Read This First${b}`,
        `Is ${k} Right for You?${b}`
      ];
    } else if (tone === 'Power') {
      generated = [
        `Master ${k} Instantly: Proven Strategies${b}`,
        `Top 10 Secrets to Unlocking ${k}${b}`,
        `Boost Your Results with ${k} Today${b}`,
        `The Only ${k} Guide You'll Ever Need${b}`,
        `Transform Your Strategy with ${k}${b}`
      ];
    }

    setResults(generated);
    addResult(generated.join('\n\n'));
  };

  const getLengthColor = (len: number) => {
    if (len < 50) return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
    if (len <= 60) return 'bg-green-500/10 text-green-600 dark:text-green-400';
    return 'bg-red-500/10 text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="keyword">Target Keyword (Required)</Label>
          <Input 
            id="keyword" 
            placeholder="e.g. seo toolkit" 
            value={keyword} 
            onChange={(e) => setKeyword(e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="brand">Brand Name (Optional)</Label>
          <Input 
            id="brand" 
            placeholder="e.g. SabrTime" 
            value={brand} 
            onChange={(e) => setBrand(e.target.value)} 
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="tone">Title Tone</Label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger>
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Professional">Professional & Authoritative</SelectItem>
              <SelectItem value="Casual">Casual & Approachable</SelectItem>
              <SelectItem value="Question">Question-Based</SelectItem>
              <SelectItem value="Power">Power & Action-Oriented</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={generate} disabled={!keyword} className="w-full md:w-auto">
        <RefreshCw className="mr-2 h-4 w-4" /> Generate Titles
      </Button>

      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Generated Suggestions</h3>
          <div className="grid gap-3">
            {results.map((res, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <Badge variant="outline" className={getLengthColor(res.length)}>
                    {res.length} chars
                  </Badge>
                  <span className="text-muted-foreground">Optimal: 50-60 chars</span>
                </div>
                <ToolResult content={res} />
              </div>
            ))}
          </div>
        </div>
      )}

      <RecentResultsPanel toolSlug="meta-title-generator" results={history} onClear={clearResults} />
    </div>
  );
}
