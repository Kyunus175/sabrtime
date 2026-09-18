import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ToolResult } from '../components/ToolResult';
import { useRecentResults, RecentResultsPanel } from '../components/RecentResults';
import { Code2, Plus, Trash2 } from 'lucide-react';

export default function OrganizationSchemaGenerator() {
  const [data, setData] = useState({
    name: '',
    url: '',
    logo: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  });
  
  const [socials, setSocials] = useState<string[]>(['']);
  const [schema, setSchema] = useState('');
  const { results: history, addResult, clearResults } = useRecentResults('org-schema-generator');

  const updateData = (field: string, value: string) => {
    setData({ ...data, [field]: value });
  };

  const updateSocial = (index: number, value: string) => {
    const newSocials = [...socials];
    newSocials[index] = value;
    setSocials(newSocials);
  };

  const addSocial = () => setSocials([...socials, '']);
  const removeSocial = (index: number) => {
    if (socials.length <= 1) return;
    setSocials(socials.filter((_, i) => i !== index));
  };

  const generate = () => {
    if (!data.name || !data.url) return;

    const validSocials = socials.filter(s => s.trim() !== '');

    const schemaObj: any = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": data.name,
      "url": data.url,
    };

    if (data.logo) schemaObj.logo = data.logo;
    
    if (data.phone || data.email) {
      schemaObj.contactPoint = {
        "@type": "ContactPoint"
      };
      if (data.phone) schemaObj.contactPoint.telephone = data.phone;
      if (data.email) schemaObj.contactPoint.email = data.email;
      schemaObj.contactPoint.contactType = "customer service";
    }

    if (data.street || data.city || data.country) {
      schemaObj.address = {
        "@type": "PostalAddress",
      };
      if (data.street) schemaObj.address.streetAddress = data.street;
      if (data.city) schemaObj.address.addressLocality = data.city;
      if (data.state) schemaObj.address.addressRegion = data.state;
      if (data.zip) schemaObj.address.postalCode = data.zip;
      if (data.country) schemaObj.address.addressCountry = data.country;
    }

    if (validSocials.length > 0) {
      schemaObj.sameAs = validSocials;
    }

    const result = `<script type="application/ld+json">\n${JSON.stringify(schemaObj, null, 2)}\n</script>`;
    setSchema(result);
    addResult(result);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 md:col-span-2">
          <h3 className="font-semibold border-b pb-2">Core Details</h3>
        </div>
        <div className="space-y-2">
          <Label>Organization Name *</Label>
          <Input value={data.name} onChange={e => updateData('name', e.target.value)} placeholder="e.g. SabrTime" />
        </div>
        <div className="space-y-2">
          <Label>Website URL *</Label>
          <Input value={data.url} onChange={e => updateData('url', e.target.value)} placeholder="https://sabrtime.in" />
        </div>
        <div className="space-y-2">
          <Label>Logo URL</Label>
          <Input value={data.logo} onChange={e => updateData('logo', e.target.value)} placeholder="https://..." />
        </div>
        
        <div className="space-y-4 md:col-span-2 mt-4">
          <h3 className="font-semibold border-b pb-2">Contact Details</h3>
        </div>
        <div className="space-y-2">
          <Label>Phone Number</Label>
          <Input value={data.phone} onChange={e => updateData('phone', e.target.value)} placeholder="+1-800-555-0199" />
        </div>
        <div className="space-y-2">
          <Label>Email Address</Label>
          <Input value={data.email} onChange={e => updateData('email', e.target.value)} placeholder="hello@sabrtime.in" />
        </div>

        <div className="space-y-4 md:col-span-2 mt-4">
          <h3 className="font-semibold border-b pb-2">Address</h3>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Street Address</Label>
          <Input value={data.street} onChange={e => updateData('street', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>City</Label>
          <Input value={data.city} onChange={e => updateData('city', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>State / Region</Label>
          <Input value={data.state} onChange={e => updateData('state', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Zip / Postal Code</Label>
          <Input value={data.zip} onChange={e => updateData('zip', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Country</Label>
          <Input value={data.country} onChange={e => updateData('country', e.target.value)} />
        </div>

        <div className="space-y-4 md:col-span-2 mt-4">
          <h3 className="font-semibold border-b pb-2">Social Profiles</h3>
          {socials.map((social, idx) => (
            <div key={idx} className="flex gap-2">
              <Input 
                value={social} 
                onChange={e => updateSocial(idx, e.target.value)} 
                placeholder="https://twitter.com/yourbrand" 
              />
              <Button variant="outline" size="icon" onClick={() => removeSocial(idx)} disabled={socials.length <= 1}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={addSocial} size="sm">
            <Plus className="h-4 w-4 mr-2" /> Add Social Profile
          </Button>
        </div>
      </div>

      <Button onClick={generate} disabled={!data.name || !data.url} className="w-full">
        <Code2 className="mr-2 h-4 w-4" /> Generate Organization Schema
      </Button>

      {schema && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Generated JSON-LD Schema</h3>
          <ToolResult content={schema} isCode />
        </div>
      )}

      <RecentResultsPanel toolSlug="org-schema-generator" results={history} onClear={clearResults} />
    </div>
  );
}