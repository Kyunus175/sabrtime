import { ArrowRight, BarChart3, FileDown, Layers3, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const packages = [{ name: 'Starter', price: '₹49', credits: '50 credits' }, { name: 'Growth', price: '₹99', credits: '150 credits' }, { name: 'Pro', price: '₹199', credits: '500 credits' }];
const features = [[BarChart3, 'Advanced audits', 'Technical SEO checks across your pages.'], [Layers3, 'Bulk analysis', 'Review multiple URLs and metadata together.'], [FileDown, 'Exportable reports', 'Save clear reports for your own workflow.']] as const;

export function ProUpgradeCard() {
  return <section id="pro-tools" className="scroll-mt-24 py-20 border-y bg-muted/20"><div className="container mx-auto px-4 md:px-6"><div className="mx-auto max-w-5xl">
    <div className="mb-8 text-center"><Badge variant="secondary" className="mb-4 gap-1 bg-primary/10 text-primary"><Sparkles className="h-3.5 w-3.5" /> Pro tools · Coming Soon</Badge><h2 className="text-3xl font-bold md:text-4xl">Need deeper SEO analysis?</h2><p className="mx-auto mt-3 max-w-2xl text-muted-foreground">Unlock advanced audits, bulk analysis, keyword insights and downloadable reports when Pro features launch.</p></div>
    <div className="grid gap-4 sm:grid-cols-3">{features.map(([Icon, title, description]) => <Card key={title} className="bg-card/70"><CardContent className="p-5"><Icon className="mb-3 h-5 w-5 text-primary" /><h3 className="font-semibold">{title}</h3><p className="mt-1 text-sm text-muted-foreground">{description}</p></CardContent></Card>)}</div>
    <Card className="mt-6 border-primary/20 bg-card"><CardHeader className="pb-3"><CardTitle className="text-lg">Credit packages</CardTitle><p className="text-sm text-muted-foreground">Payment is not active yet. No charge will be made.</p></CardHeader><CardContent><div className="grid gap-3 sm:grid-cols-3">{packages.map(item => <div key={item.name} className="flex items-center justify-between rounded-lg border p-3"><div><p className="font-medium">{item.name}</p><p className="text-xs text-muted-foreground">{item.credits}</p></div><div className="text-right"><p className="font-semibold">{item.price}</p><Badge variant="outline" className="mt-1 text-[10px]">Coming Soon</Badge></div></div>)}</div><Button variant="outline" className="mt-5 w-full sm:w-auto" disabled>Explore Pro <ArrowRight className="ml-2 h-4 w-4" /></Button></CardContent></Card>
  </div></div></section>;
}