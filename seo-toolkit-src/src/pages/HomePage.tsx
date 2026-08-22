import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { tools } from '@/tools';
import { ToolCard } from '@/components/ToolCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Sparkles, Zap, ShieldCheck, ArrowRight, Heart, ExternalLink } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { UsageIndicator } from '@/components/UsageIndicator';
import { ProUpgradeCard } from '@/components/ProUpgradeCard';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(tools.map(t => t.category)));

  const filteredTools = useMemo(() => {
    return tools.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            t.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory ? t.category === activeCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const featuredTools = tools.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background z-[-1]" />
          <div className="container mx-auto px-4 md:px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4">
              <Sparkles className="w-4 h-4" /> Professional SEO Tools, Free Forever
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto text-balance animate-in fade-in slide-in-from-bottom-5 delay-100">
              Optimize your site with <span className="text-primary">calm precision</span>.
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 delay-200">
              A complete suite of 20 client-side SEO utilities designed for bloggers, agencies, and creators. No signup required. Fast, precise, and secure.
            </p>
            
            <div className="max-w-xl mx-auto relative animate-in fade-in slide-in-from-bottom-7 delay-300">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input 
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  // Scroll to grid if typing
                  if (e.target.value) {
                    document.getElementById('tools-grid')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                placeholder="Search for a tool (e.g. Meta tags, Sitemap, Alt text...)" 
                className="h-14 pl-12 rounded-full border-2 border-primary/20 focus-visible:border-primary shadow-sm text-lg"
              />
            </div>
            
            <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm font-medium text-muted-foreground animate-in fade-in slide-in-from-bottom-8 delay-500">
              <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> Lightning Fast</div>
              <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-primary" /> 100% Private (Runs in browser)</div>
              <div className="flex items-center gap-2"><span className="text-primary font-bold">20</span> Powerful Tools</div>
            </div>
          </div>
        </section>

        {/* Featured Tools */}
        {!searchQuery && !activeCategory && (
          <section className="py-16 bg-muted/30 border-y">
            <div className="container mx-auto px-4 md:px-6">
              <h2 className="text-3xl font-bold mb-8 text-center">Featured Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredTools.map(tool => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Tools Grid */}
        <section id="tools-grid" className="py-20 scroll-mt-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">All SEO Tools</h2>
                <p className="text-muted-foreground">Find everything you need to rank higher.</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={activeCategory === null ? 'default' : 'outline'} 
                  onClick={() => setActiveCategory(null)}
                  className="rounded-full"
                  size="sm"
                >
                  All
                </Button>
                {categories.map(cat => (
                  <Button 
                    key={cat}
                    variant={activeCategory === cat ? 'default' : 'outline'} 
                    onClick={() => setActiveCategory(cat)}
                    className="rounded-full"
                    size="sm"
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            {filteredTools.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTools.map(tool => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed rounded-2xl">
                <Search className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No tools found</h3>
                <p className="text-muted-foreground mb-4">Try a different search term or category.</p>
                <Button variant="outline" onClick={() => { setSearchQuery(''); setActiveCategory(null); }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </section>

        <section className="pb-20"><div className="container mx-auto px-4 md:px-6"><UsageIndicator /></div></section>
        <ProUpgradeCard />

        {/* Benefits Section */}
        <section className="py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto text-white">
                  <Zap className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-semibold">Fast & Free</h3>
                <p className="text-primary-foreground/80 leading-relaxed">
                  Basic generators, checkers, schemas, and audits remain free. Advanced computing features will be clearly marked Pro.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto text-white">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-semibold">No Signup Required</h3>
                <p className="text-primary-foreground/80 leading-relaxed">
                  Your free-tool data never leaves your browser. We don't track your keywords or save your URLs. True privacy by default.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto text-white">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-semibold">Professional Grade</h3>
                <p className="text-primary-foreground/80 leading-relaxed">
                  Built by SEO experts. Every tool follows the latest Google guidelines and best practices for 2025.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-20 border-b">
          <div className="container mx-auto px-4 md:px-6">
            <div className="bg-card border rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto shadow-sm">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Improve your productivity and spirituality</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                SabrTime is more than just SEO tools. It's a platform dedicated to helping you build better habits, track your prayers, and find balance.
              </p>
              <Button asChild size="lg" className="h-12 px-8 text-base">
                <a href="https://sabrtime.in" target="_blank" rel="noopener noreferrer">
                  Visit SabrTime <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-muted/20">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl">
            <h2 className="text-3xl font-bold mb-10 text-center">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="bg-card px-6 border rounded-lg mb-4">
                <AccordionTrigger className="text-left font-semibold hover:no-underline hover:text-primary">Are these tools really free?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Yes, the core tools are free with no required signup. Advanced Pro features are planned for users who need deeper analysis, bulk processing, or reports, but simple browser-based tools will remain accessible.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="bg-card px-6 border rounded-lg mb-4">
                <AccordionTrigger className="text-left font-semibold hover:no-underline hover:text-primary">Do you store my data?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  No. All calculations, generations, and checks happen entirely within your browser (client-side). We do not send your text or URLs to any server. Your "Recent Results" are stored only in your local browser storage.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="bg-card px-6 border rounded-lg mb-4">
                <AccordionTrigger className="text-left font-semibold hover:no-underline hover:text-primary">How accurate is the Keyword Density Checker?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  It uses standard exact-match calculation, which is great for a baseline. However, remember that modern search engines also use NLP and semantic understanding, so always write for humans first, not just exact keyword density.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="bg-card px-6 border rounded-lg mb-4">
                <AccordionTrigger className="text-left font-semibold hover:no-underline hover:text-primary">Can I use the schema generators for commercial websites?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Absolutely. The JSON-LD schema generated by our tools is perfectly valid for any commercial, personal, or organizational website and follows Schema.org guidelines.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5" className="bg-card px-6 border rounded-lg mb-4">
                <AccordionTrigger className="text-left font-semibold hover:no-underline hover:text-primary">How often are the tools updated?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  We constantly review the tools against the latest Google Search Central documentation to ensure outputs like meta lengths and schema structures remain compliant with best practices.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6" className="bg-card px-6 border rounded-lg mb-4">
                <AccordionTrigger className="text-left font-semibold hover:no-underline hover:text-primary">What is SabrTime?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  SabrTime is an Islamic productivity and prayer app brand dedicated to helping individuals find peace, focus, and productivity in their daily lives. This SEO Toolkit is a free resource provided by our team.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Newsletter UI */}
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <h2 className="text-3xl font-bold">Stay Updated</h2>
              <p className="text-muted-foreground">Get the latest SEO tips and tool updates delivered to your inbox.</p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => { e.preventDefault(); alert("Thanks for subscribing! (UI Only Demo)"); }}>
                <Input type="email" placeholder="Enter your email address" required className="h-12" />
                <Button type="submit" className="h-12 px-8">Subscribe</Button>
              </form>
              <p className="text-xs text-muted-foreground">We respect your privacy. Unsubscribe at any time.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}