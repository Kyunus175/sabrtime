import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToolResult } from '../components/ToolResult';
import { useRecentResults, RecentResultsPanel } from '../components/RecentResults';
import { Badge } from '@/components/ui/badge';
import { RefreshCw } from 'lucide-react';

export default function MetaDescriptionGenerator() {
  const [keyword, setKeyword] = useState('');
  const [pageType, setPageType] = useState('Blog');
  const [results, setResults] = useState<string[]>([]);
  const { results: history, addResult, clearResults } = useRecentResults('meta-description-generator');

  const generate = () => {
    if (!keyword) return;
    const k = keyword.trim();
    
    let generated: string[] = [];

    if (pageType === 'Blog') {
      generated = [
        `Discover everything you need to know about ${k} in our comprehensive guide. Learn top strategies, expert tips, and actionable advice. Read more!`,
        `Looking for insights on ${k}? This article covers the essentials, breaks down complex concepts, and helps you master the basics quickly and easily.`,
        `Stay ahead of the curve with our latest post on ${k}. We explore current trends, practical examples, and proven methods for success. Click to learn more.`
      ];
    } else if (pageType === 'Product') {
      generated = [
        `Shop the best ${k} available today. Enjoy top-tier quality, great prices, and fast shipping. Upgrade your experience and order yours now!`,
        `Looking for a reliable ${k}? Our premium selection offers unmatched durability and performance. Discover the perfect fit for your needs today.`,
        `Get the most out of your purchase with our highly-rated ${k}. Designed for excellence, it’s exactly what you’ve been searching for. Buy now.`
      ];
    } else if (pageType === 'Service') {
      generated = [
        `Need professional ${k} services? Our expert team delivers top-quality results tailored to your specific goals. Contact us today for a free consultation.`,
        `We specialize in comprehensive ${k} solutions designed to save you time and money. Trust our experienced professionals to get the job done right.`,
        `Transform your business with our top-rated ${k}. We provide reliable, affordable, and expert services guaranteed to exceed your expectations.`
      ];
    } else if (pageType === 'Homepage') {
      generated = [
        `Welcome to our site! We are your premier destination for ${k}. Explore our extensive resources, products, and expert insights tailored just for you.`,
        `Your trusted source for all things related to ${k}. We provide industry-leading solutions, high-quality products, and dedicated customer support.`,
        `Discover the ultimate platform for ${k}. From expert advice to premium offerings, we have everything you need to achieve your goals effectively.`
      ];
    }

    setResults(generated);
    addResult(generated.join('\n\n'));
  };

  const getLengthColor = (len: number) => {
    if (len < 120) return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
    if (len <= 160) return 'bg-green-500/10 text-green-600 dark:text-green-400';
    return 'bg-red-500/10 text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="keyword">Target Keyword (Required)</Label>
          <Input 
            id="keyword" 
            placeholder="e.g. SEO optimization services" 
            value={keyword} 
            onChange={(e) => setKeyword(e.target.value)} 
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="pageType">Page Type</Label>
          <Select value={pageType} onValueChange={setPageType}>
            <SelectTrigger>
              <SelectValue placeholder="Select page type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Blog">Blog Post / Article</SelectItem>
              <SelectItem value="Product">Product Page</SelectItem>
              <SelectItem value="Service">Service Page</SelectItem>
              <SelectItem value="Homepage">Homepage</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={generate} disabled={!keyword} className="w-full md:w-auto">
        <RefreshCw className="mr-2 h-4 w-4" /> Generate Descriptions
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
                  <span className="text-muted-foreground">Optimal: 120-160 chars</span>
                </div>
                <ToolResult content={res} />
              </div>
            ))}
          </div>
        </div>
      )}

      <RecentResultsPanel toolSlug="meta-description-generator" results={history} onClear={clearResults} />
    </div>
  );
}
