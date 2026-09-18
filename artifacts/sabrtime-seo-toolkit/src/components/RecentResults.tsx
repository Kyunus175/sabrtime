import { useEffect, useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, Clock, Copy, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RecentResult {
  id: string;
  content: string;
  timestamp: number;
}

export function useRecentResults(toolSlug: string) {
  const [results, setResults] = useState<RecentResult[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(`seo-tool-results-${toolSlug}`);
    if (stored) {
      try {
        setResults(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse recent results', e);
      }
    }
  }, [toolSlug]);

  const addResult = (content: string) => {
    // Avoid exact duplicates
    if (results.length > 0 && results[0].content === content) return;

    const newResult: RecentResult = {
      id: Math.random().toString(36).substring(2, 9),
      content,
      timestamp: Date.now(),
    };
    
    const updated = [newResult, ...results].slice(0, 3);
    setResults(updated);
    localStorage.setItem(`seo-tool-results-${toolSlug}`, JSON.stringify(updated));
  };

  const clearResults = () => {
    setResults([]);
    localStorage.removeItem(`seo-tool-results-${toolSlug}`);
  };

  return { results, addResult, clearResults };
}

export function RecentResultsPanel({ toolSlug, results, onClear }: { toolSlug: string; results: RecentResult[]; onClear: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  if (results.length === 0) return null;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full mt-8 border rounded-lg bg-card text-card-foreground shadow-sm"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 p-0 h-auto hover:bg-transparent hover:text-primary">
            <Clock className="h-4 w-4" />
            <span className="font-medium">Recent Results</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </Button>
        </CollapsibleTrigger>
        {isOpen && (
          <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground hover:text-destructive h-8 px-2">
            <Trash2 className="h-3.5 w-3.5 mr-1" /> Clear
          </Button>
        )}
      </div>
      <CollapsibleContent className="p-4 space-y-4">
        {results.map((result) => (
          <div key={result.id} className="relative group p-3 bg-muted/30 rounded-md border text-sm">
            <div className="line-clamp-3 text-muted-foreground pr-8">
              {result.content}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => {
                navigator.clipboard.writeText(result.content);
                toast({ title: "Copied previous result" });
              }}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
            <div className="text-[10px] text-muted-foreground/60 mt-2 text-right">
              {new Date(result.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
