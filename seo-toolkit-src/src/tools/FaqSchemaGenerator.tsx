import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ToolResult } from '../components/ToolResult';
import { useRecentResults, RecentResultsPanel } from '../components/RecentResults';
import { Plus, Trash2, Code2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface FAQ {
  id: number;
  q: string;
  a: string;
}

export default function FaqSchemaGenerator() {
  const [faqs, setFaqs] = useState<FAQ[]>([
    { id: 1, q: '', a: '' },
    { id: 2, q: '', a: '' }
  ]);
  const [schema, setSchema] = useState('');
  const { results: history, addResult, clearResults } = useRecentResults('faq-schema-generator');

  const updateFaq = (id: number, field: 'q' | 'a', value: string) => {
    setFaqs(faqs.map(faq => faq.id === id ? { ...faq, [field]: value } : faq));
  };

  const addFaq = () => {
    setFaqs([...faqs, { id: Date.now(), q: '', a: '' }]);
  };

  const removeFaq = (id: number) => {
    if (faqs.length <= 1) return;
    setFaqs(faqs.filter(faq => faq.id !== id));
  };

  const generate = () => {
    const validFaqs = faqs.filter(faq => faq.q.trim() && faq.a.trim());
    if (validFaqs.length === 0) return;

    const schemaObj = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": validFaqs.map(faq => ({
        "@type": "Question",
        "name": faq.q.trim(),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a.trim()
        }
      }))
    };

    const result = `<script type="application/ld+json">\n${JSON.stringify(schemaObj, null, 2)}\n</script>`;
    setSchema(result);
    addResult(result);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={faq.id} className="p-4 border rounded-lg bg-muted/20 relative group">
            <div className="absolute top-2 right-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:text-destructive h-8 w-8"
                onClick={() => removeFaq(faq.id)}
                disabled={faqs.length <= 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor={`q-${faq.id}`}>Question {index + 1}</Label>
                <Input 
                  id={`q-${faq.id}`}
                  placeholder="e.g. How much does shipping cost?" 
                  value={faq.q} 
                  onChange={(e) => updateFaq(faq.id, 'q', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`a-${faq.id}`}>Answer</Label>
                <Textarea 
                  id={`a-${faq.id}`}
                  placeholder="e.g. Standard shipping is free for all orders over $50." 
                  value={faq.a} 
                  onChange={(e) => updateFaq(faq.id, 'a', e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={addFaq} variant="outline" className="flex-1">
          <Plus className="mr-2 h-4 w-4" /> Add Question
        </Button>
        <Button onClick={generate} className="flex-1 bg-primary text-primary-foreground">
          <Code2 className="mr-2 h-4 w-4" /> Generate Schema
        </Button>
      </div>

      {schema && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Generated JSON-LD Schema</h3>
          <ToolResult content={schema} isCode />
        </div>
      )}

      <RecentResultsPanel toolSlug="faq-schema-generator" results={history} onClear={clearResults} />
    </div>
  );
}
