import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface AuditItem {
  id: string;
  label: string;
  desc: string;
  checked: boolean;
}

interface AuditSection {
  name: string;
  items: AuditItem[];
}

const defaultAudit: AuditSection[] = [
  {
    name: 'Technical SEO',
    items: [
      { id: 't1', label: 'Robots.txt is configured correctly', desc: 'Ensure search engines can crawl important pages and are blocked from private areas.', checked: false },
      { id: 't2', label: 'XML Sitemap exists and is submitted to Google Search Console', desc: 'Helps search engines discover your pages.', checked: false },
      { id: 't3', label: 'HTTPS is enforced (No mixed content)', desc: 'Secure connection is a ranking factor.', checked: false },
      { id: 't4', label: 'Canonical tags are present on all pages', desc: 'Prevents duplicate content issues.', checked: false },
      { id: 't5', label: 'No 404 errors for important internal links', desc: 'Broken links hurt user experience and crawl budget.', checked: false },
      { id: 't6', label: 'Mobile responsiveness is perfect', desc: 'Google uses mobile-first indexing.', checked: false },
      { id: 't7', label: 'Core Web Vitals scores are passing', desc: 'LCP, FID, and CLS should be in the "Good" range.', checked: false },
    ]
  },
  {
    name: 'On-Page SEO',
    items: [
      { id: 'o1', label: 'Unique, optimized Title Tags for every page', desc: '50-60 characters, front-loaded with main keyword.', checked: false },
      { id: 'o2', label: 'Unique Meta Descriptions with CTA', desc: '120-160 characters, compelling for click-throughs.', checked: false },
      { id: 'o3', label: 'H1 tags are unique per page and contain main keyword', desc: 'Only one H1 per page.', checked: false },
      { id: 'o4', label: 'Logical H2/H3 heading structure', desc: 'Helps readers and search engines understand content hierarchy.', checked: false },
      { id: 'o5', label: 'URLs are short, descriptive, and use hyphens', desc: 'Avoid numbers and random characters in slugs.', checked: false },
      { id: 'o6', label: 'Images have descriptive Alt Text', desc: 'Crucial for accessibility and image search.', checked: false },
    ]
  },
  {
    name: 'Content Quality',
    items: [
      { id: 'c1', label: 'No duplicate or thin content', desc: 'Pages should offer unique value.', checked: false },
      { id: 'c2', label: 'Content matches search intent', desc: 'Informational, navigational, or transactional.', checked: false },
      { id: 'c3', label: 'Readability is appropriate for audience', desc: 'Use short paragraphs, lists, and clear language.', checked: false },
      { id: 'c4', label: 'Internal linking is utilized effectively', desc: 'Link to related content using descriptive anchor text.', checked: false },
    ]
  },
  {
    name: 'Link Building & Authority',
    items: [
      { id: 'l1', label: 'No toxic or spammy backlinks', desc: 'Audit backlinks and disavow if necessary.', checked: false },
      { id: 'l2', label: 'External links to authoritative sources', desc: 'Shows you reference credible information.', checked: false },
      { id: 'l3', label: 'Social sharing buttons are present on articles', desc: 'Encourages organic content distribution.', checked: false },
    ]
  },
  {
    name: 'Local SEO (If applicable)',
    items: [
      { id: 'lo1', label: 'Google Business Profile is claimed and optimized', desc: 'Complete information, photos, and regular updates.', checked: false },
      { id: 'lo2', label: 'Name, Address, Phone (NAP) is consistent', desc: 'Across your website and all directories.', checked: false },
      { id: 'lo3', label: 'Local Organization Schema is implemented', desc: 'Helps search engines understand your local business details.', checked: false },
    ]
  }
];

export default function SeoAuditChecklist() {
  const [audit, setAudit] = useState<AuditSection[]>(defaultAudit);

  useEffect(() => {
    const stored = localStorage.getItem('seo-full-audit-state');
    if (stored) {
      try { setAudit(JSON.parse(stored)); } catch(e) {}
    }
  }, []);

  const toggleItem = (sectionIndex: number, itemId: string) => {
    const updated = [...audit];
    const section = updated[sectionIndex];
    const itemIndex = section.items.findIndex(i => i.id === itemId);
    if (itemIndex > -1) {
      section.items[itemIndex].checked = !section.items[itemIndex].checked;
      setAudit(updated);
      localStorage.setItem('seo-full-audit-state', JSON.stringify(updated));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const resetAudit = () => {
    if(confirm('Are you sure you want to reset the entire audit?')) {
      setAudit(defaultAudit);
      localStorage.removeItem('seo-full-audit-state');
    }
  };

  const totalItems = audit.reduce((acc, sec) => acc + sec.items.length, 0);
  const checkedItems = audit.reduce((acc, sec) => acc + sec.items.filter(i => i.checked).length, 0);
  const score = Math.round((checkedItems / totalItems) * 100) || 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-primary/5 border border-primary/20 rounded-xl">
        <div className="space-y-2 flex-1">
          <h3 className="text-xl font-bold">Overall Audit Score: {score}%</h3>
          <Progress value={score} className="h-3 max-w-md bg-primary/20" />
          <p className="text-sm text-muted-foreground">{checkedItems} out of {totalItems} checks passed</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint} className="print:hidden">
            <Printer className="w-4 h-4 mr-2" /> Print Report
          </Button>
          <Button variant="ghost" onClick={resetAudit} className="print:hidden text-muted-foreground hover:text-destructive">
            Reset
          </Button>
        </div>
      </div>

      <div className="grid gap-8">
        {audit.map((section, sIdx) => {
          const secTotal = section.items.length;
          const secChecked = section.items.filter(i => i.checked).length;
          
          return (
            <div key={section.name} className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h2 className="text-xl font-semibold">{section.name}</h2>
                <span className="text-sm font-medium px-3 py-1 bg-muted rounded-full">
                  {secChecked} / {secTotal}
                </span>
              </div>
              <div className="grid gap-3">
                {section.items.map(item => (
                  <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                    <Checkbox 
                      id={item.id} 
                      checked={item.checked} 
                      onCheckedChange={() => toggleItem(sIdx, item.id)}
                      className="mt-1"
                    />
                    <div className="space-y-1 flex-1">
                      <label 
                        htmlFor={item.id} 
                        className={`text-sm font-medium cursor-pointer ${item.checked ? 'text-muted-foreground line-through' : ''}`}
                      >
                        {item.label}
                      </label>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}