import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Download, Share2, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface ToolResultProps {
  content: string;
  filename?: string;
  isCode?: boolean;
}

export function ToolResult({ content, filename = 'seo-result.txt', isCode = false }: ToolResultProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "The result has been copied to your clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Download started",
      description: `File ${filename} is downloading.`,
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SabrTime SEO Toolkit Result',
          text: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      handleCopy();
      toast({
        title: "Link Copied",
        description: "Your device doesn't support native sharing, copied link instead.",
      });
    }
  };

  return (
    <div className="relative group rounded-md overflow-hidden border bg-muted/30">
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur border rounded-md p-1">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopy} title="Copy">
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDownload} title="Download TXT">
          <Download className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleShare} title="Share">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-4 max-h-[500px] overflow-y-auto">
        {isCode ? (
          <pre className="text-sm font-mono text-foreground whitespace-pre-wrap break-words">{content}</pre>
        ) : (
          <div className="text-sm text-foreground whitespace-pre-wrap break-words">{content}</div>
        )}
      </div>
    </div>
  );
}
