import { Link } from 'wouter';
import { tools } from '@/tools';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  // Group tools by category for footer
  const categories = Array.from(new Set(tools.map(t => t.category)));

  return (
    <footer className="bg-muted py-12 md:py-16 mt-20 border-t">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="font-bold text-lg">SabrTime SEO Toolkit</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm mb-6 leading-relaxed">
              Professional-grade SEO utilities for bloggers, small businesses, and content creators. 
              Free to use. No signup required. Runs completely in your browser.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <span className="font-semibold">Powered by SabrTime</span>
              <a href="https://sabrtime.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Visit SabrTime Website →
              </a>
            </div>
          </div>
          
          {categories.slice(0, 3).map((category) => (
            <div key={category}>
              <h3 className="font-semibold mb-4">{category}</h3>
              <ul className="space-y-3">
                {tools.filter(t => t.category === category).slice(0, 5).map(tool => (
                  <li key={tool.slug}>
                    <Link href={`/tool/${tool.slug}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div>&copy; {currentYear} SabrTime. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <a href="https://sabrtime.in/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="https://sabrtime.in/terms" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
