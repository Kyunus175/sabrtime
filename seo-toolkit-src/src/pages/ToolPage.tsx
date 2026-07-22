import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'wouter';
import { tools } from '@/tools';
import { Button } from '@/components/ui/button';
import { ToolCard } from '@/components/ToolCard';
import { ArrowLeft, Home } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NotFound from './not-found';
import { Badge } from '@/components/ui/badge';

export default function ToolPage() {
  const { slug } = useParams<{ slug: string }>();
  const [mounted, setMounted] = useState(false);
  const [, setLocation] = useLocation();

  const tool = tools.find(t => t.slug === slug);

  useEffect(() => {
    setMounted(true);
    
    if (tool) {
      document.title = `${tool.name} — Free Online SEO Tool | SabrTime`;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute('content', tool.description);
      }
      
      // Add to recent history
      try {
        const historyStr = localStorage.getItem('seo-recent-tools') || '[]';
        let history = JSON.parse(historyStr) as string[];
        history = [slug, ...history.filter(s => s !== slug)].slice(0, 5);
        localStorage.setItem('seo-recent-tools', JSON.stringify(history));
      } catch (e) {}
    }
  }, [tool, slug]);

  if (!mounted) return null;
  
  if (!tool) {
    return <NotFound />;
  }

  const ToolComponent = tool.component;
  const Icon = tool.icon;

  // Get 3 related tools from the same category, excluding the current one
  const relatedTools = tools
    .filter(t => t.category === tool.category && t.slug !== tool.slug)
    .slice(0, 3);
  
  // If not enough in category, fill with other categories
  if (relatedTools.length < 3) {
    const extraTools = tools
      .filter(t => t.slug !== tool.slug && !relatedTools.find(rt => rt.slug === t.slug))
      .slice(0, 3 - relatedTools.length);
    relatedTools.push(...extraTools);
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-muted/10">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center text-sm text-muted-foreground mb-8 animate-in fade-in slide-in-from-left-4">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" /> Home
            </Link>
            <span className="mx-2">/</span>
            <span>{tool.category}</span>
            <span className="mx-2">/</span>
            <span className="text-foreground font-medium truncate">{tool.name}</span>
          </nav>

          <Button variant="ghost" onClick={() => setLocation('/')} className="mb-6 -ml-4 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tools
          </Button>

          {/* Tool Header */}
          <div className="bg-card border rounded-2xl p-6 md:p-10 mb-8 shadow-sm animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="p-4 bg-primary/10 rounded-2xl text-primary shrink-0 w-16 h-16 flex items-center justify-center">
                <Icon className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{tool.name}</h1>
                  <Badge variant="secondary" className="w-fit">{tool.category}</Badge>
                </div>
                <p className="text-lg text-muted-foreground max-w-2xl">{tool.description}</p>
              </div>
            </div>
          </div>

          {/* Tool Implementation Container */}
          <div className="bg-card border rounded-2xl p-6 md:p-10 shadow-sm min-h-[400px]">
            <ToolComponent />
          </div>

          {/* Related Tools */}
          <div className="mt-20 pt-10 border-t">
            <h2 className="text-2xl font-bold mb-8">Related Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedTools.map(t => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}