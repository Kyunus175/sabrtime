import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToolResult } from '../components/ToolResult';
import { useRecentResults, RecentResultsPanel } from '../components/RecentResults';
import { Code2 } from 'lucide-react';

export default function ArticleSchemaGenerator() {
  const [data, setData] = useState({
    type: 'Article',
    url: '',
    headline: '',
    image: '',
    description: '',
    authorName: '',
    authorType: 'Person',
    publisherName: '',
    publisherLogo: '',
    datePublished: '',
    dateModified: ''
  });
  
  const [schema, setSchema] = useState('');
  const { results: history, addResult, clearResults } = useRecentResults('article-schema-generator');

  const updateData = (field: string, value: string) => {
    setData({ ...data, [field]: value });
  };

  const generate = () => {
    if (!data.headline || !data.url) return;

    const schemaObj: any = {
      "@context": "https://schema.org",
      "@type": data.type,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": data.url
      },
      "headline": data.headline,
    };

    if (data.image) schemaObj.image = [data.image];
    if (data.datePublished) schemaObj.datePublished = new Date(data.datePublished).toISOString();
    if (data.dateModified) schemaObj.dateModified = new Date(data.dateModified).toISOString();
    if (data.authorName) {
      schemaObj.author = {
        "@type": data.authorType,
        "name": data.authorName
      };
    }
    if (data.publisherName) {
      schemaObj.publisher = {
        "@type": "Organization",
        "name": data.publisherName
      };
      if (data.publisherLogo) {
        schemaObj.publisher.logo = {
          "@type": "ImageObject",
          "url": data.publisherLogo
        };
      }
    }
    if (data.description) schemaObj.description = data.description;

    const result = `<script type="application/ld+json">\n${JSON.stringify(schemaObj, null, 2)}\n</script>`;
    setSchema(result);
    addResult(result);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Article Type</Label>
          <Select value={data.type} onValueChange={v => updateData('type', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Article">Article (Default)</SelectItem>
              <SelectItem value="BlogPosting">Blog Post</SelectItem>
              <SelectItem value="NewsArticle">News Article</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Article URL *</Label>
          <Input value={data.url} onChange={e => updateData('url', e.target.value)} placeholder="https://..." />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Headline *</Label>
          <Input value={data.headline} onChange={e => updateData('headline', e.target.value)} placeholder="Article title" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Description</Label>
          <Textarea value={data.description} onChange={e => updateData('description', e.target.value)} placeholder="Short summary..." />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Featured Image URL</Label>
          <Input value={data.image} onChange={e => updateData('image', e.target.value)} placeholder="https://..." />
        </div>

        <div className="space-y-4 md:col-span-2 mt-4 border-t pt-4">
          <h3 className="font-semibold">Author Details</h3>
        </div>
        <div className="space-y-2">
          <Label>Author Name</Label>
          <Input value={data.authorName} onChange={e => updateData('authorName', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Author Type</Label>
          <Select value={data.authorType} onValueChange={v => updateData('authorType', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Person">Person</SelectItem>
              <SelectItem value="Organization">Organization</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4 md:col-span-2 mt-4 border-t pt-4">
          <h3 className="font-semibold">Publisher Details</h3>
        </div>
        <div className="space-y-2">
          <Label>Publisher Name</Label>
          <Input value={data.publisherName} onChange={e => updateData('publisherName', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Publisher Logo URL</Label>
          <Input value={data.publisherLogo} onChange={e => updateData('publisherLogo', e.target.value)} />
        </div>

        <div className="space-y-4 md:col-span-2 mt-4 border-t pt-4">
          <h3 className="font-semibold">Dates</h3>
        </div>
        <div className="space-y-2">
          <Label>Date Published</Label>
          <Input type="date" value={data.datePublished} onChange={e => updateData('datePublished', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Date Modified</Label>
          <Input type="date" value={data.dateModified} onChange={e => updateData('dateModified', e.target.value)} />
        </div>
      </div>

      <Button onClick={generate} disabled={!data.headline || !data.url} className="w-full">
        <Code2 className="mr-2 h-4 w-4" /> Generate Article Schema
      </Button>

      {schema && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Generated JSON-LD Schema</h3>
          <ToolResult content={schema} isCode />
        </div>
      )}

      <RecentResultsPanel toolSlug="article-schema-generator" results={history} onClear={clearResults} />
    </div>
  );
}