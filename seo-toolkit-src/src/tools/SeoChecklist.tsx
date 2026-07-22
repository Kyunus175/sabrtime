import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

interface ChecklistGroup {
  name: string;
  items: ChecklistItem[];
}

const defaultChecklist: ChecklistGroup[] = [
  {
    name: 'On-Page SEO',
    items: [
      { id: 'op1', label: 'Primary keyword in Meta Title (front-loaded if possible)', checked: false },
      { id: 'op2', label: 'Meta Title is 50-60 characters', checked: false },
      { id: 'op3', label: 'Meta Description includes primary keyword and CTA', checked: false },
      { id: 'op4', label: 'Meta Description is 120-160 characters', checked: false },
      { id: 'op5', label: 'Primary keyword is in the URL slug', checked: false },
      { id: 'op6', label: 'Only one H1 tag is used on the page', checked: false },
      { id: 'op7', label: 'H2 and H3 tags are used to break up content logically', checked: false },
    ]
  },
  {
    name: 'Content Quality',
    items: [
      { id: 'cq1', label: 'Content fully answers the user\'s search intent', checked: false },
      { id: 'cq2', label: 'Primary keyword is in the first 100 words', checked: false },
      { id: 'cq3', label: 'Content is easy to read (short paragraphs, bullet points)', checked: false },
      { id: 'cq4', label: 'Images use descriptive ALT text containing relevant keywords', checked: false },
      { id: 'cq5', label: 'Content length is appropriate for the topic', checked: false },
    ]
  },
  {
    name: 'Internal & External Links',
    items: [
      { id: 'lk1', label: 'Includes 2-3 internal links to relevant pages', checked: false },
      { id: 'lk2', label: 'Internal links use descriptive anchor text', checked: false },
      { id: 'lk3', label: 'Includes 1-2 external links to authoritative sources', checked: false },
      { id: 'lk4', label: 'External links open in a new tab', checked: false },
    ]
  },
  {
    name: 'Technical Basics',
    items: [
      { id: 'tb1', label: 'Page URL is clean, short, and lowercase', checked: false },
      { id: 'tb2', label: 'Page loads quickly (optimized images)', checked: false },
      { id: 'tb3', label: 'Page is mobile-responsive', checked: false },
      { id: 'tb4', label: 'Appropriate Schema markup is implemented if applicable', checked: false },
    ]
  }
];

export default function SeoChecklist() {
  const [url, setUrl] = useState('');
  const [checklist, setChecklist] = useState<ChecklistGroup[]>(defaultChecklist);

  // Load from local storage based on URL
  useEffect(() => {
    if (!url) return;
    const stored = localStorage.getItem(`seo-checklist-${url}`);
    if (stored) {
      try {
        setChecklist(JSON.parse(stored));
      } catch(e) {}
    } else {
      setChecklist(defaultChecklist);
    }
  }, [url]);

  const toggleItem = (groupIndex: number, itemId: string) => {
    const updated = [...checklist];
    const group = updated[groupIndex];
    const itemIndex = group.items.findIndex(i => i.id === itemId);
    if (itemIndex > -1) {
      group.items[itemIndex].checked = !group.items[itemIndex].checked;
      setChecklist(updated);
      if (url) {
        localStorage.setItem(`seo-checklist-${url}`, JSON.stringify(updated));
      }
    }
  };

  const totalItems = checklist.reduce((acc, group) => acc + group.items.length, 0);
  const checkedItems = checklist.reduce((acc, group) => acc + group.items.filter(i => i.checked).length, 0);
  const progress = totalItems === 0 ? 0 : (checkedItems / totalItems) * 100;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-muted/30 p-6 rounded-xl border space-y-4">
        <div className="space-y-2">
          <Label>Target Page URL (Optional - to save progress)</Label>
          <Input 
            value={url} 
            onChange={e => setUrl(e.target.value)} 
            placeholder="https://yourwebsite.com/page-to-optimize" 
          />
        </div>
        
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Optimization Progress</span>
            <span className="text-muted-foreground">{checkedItems} / {totalItems} completed</span>
          </div>
          <Progress value={progress} className={`h-3 ${progress === 100 ? '*:bg-green-500' : '*:bg-primary'}`} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {checklist.map((group, groupIdx) => (
          <div key={group.name} className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2 flex justify-between">
              {group.name}
              <span className="text-sm font-normal text-muted-foreground">
                {group.items.filter(i => i.checked).length}/{group.items.length}
              </span>
            </h3>
            <div className="space-y-3">
              {group.items.map((item) => (
                <div key={item.id} className="flex items-start space-x-3">
                  <Checkbox 
                    id={item.id} 
                    checked={item.checked} 
                    onCheckedChange={() => toggleItem(groupIdx, item.id)}
                    className="mt-1"
                  />
                  <label 
                    htmlFor={item.id} 
                    className={`text-sm leading-relaxed cursor-pointer ${item.checked ? 'text-muted-foreground line-through' : 'text-foreground'}`}
                  >
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}