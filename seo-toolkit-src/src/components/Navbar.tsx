import { Link, useLocation } from 'wouter';
import { Moon, Sun, Search, Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { tools } from '@/tools';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [, setLocation] = useLocation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredTools = searchQuery 
    ? tools.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.category.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline-block">SabrTime SEO Toolkit</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Popover open={searchOpen} onOpenChange={setSearchOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-search-mobile">
                <Search className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[100vw] p-2" align="center">
              <div className="flex flex-col gap-2">
                <Input 
                  placeholder="Search tools..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                {searchQuery && (
                  <div className="max-h-[300px] overflow-y-auto mt-2 flex flex-col gap-1">
                    {filteredTools.length > 0 ? filteredTools.map(t => (
                      <Button
                        key={t.slug}
                        variant="ghost"
                        className="justify-start w-full text-left"
                        onClick={() => {
                          setSearchOpen(false);
                          setLocation(`/tool/${t.slug}`);
                          setSearchQuery('');
                        }}
                      >
                        <t.icon className="h-4 w-4 mr-2" />
                        {t.name}
                      </Button>
                    )) : (
                      <div className="text-sm text-muted-foreground p-2 text-center">No tools found</div>
                    )}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          <div className="hidden md:flex relative group items-center">
            <Search className="h-4 w-4 absolute left-3 text-muted-foreground" />
            <Input 
              placeholder="Search tools..." 
              className="pl-9 w-[250px] lg:w-[300px] bg-muted/50 border-none focus-visible:ring-1 focus-visible:bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <div className="absolute top-full mt-2 w-full bg-popover border rounded-md shadow-lg flex flex-col max-h-[400px] overflow-y-auto z-50">
                {filteredTools.length > 0 ? filteredTools.map(t => (
                  <button
                    key={t.slug}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted text-left transition-colors"
                    onClick={() => {
                      setLocation(`/tool/${t.slug}`);
                      setSearchQuery('');
                    }}
                  >
                    <div className="p-1.5 bg-primary/10 rounded-md text-primary">
                      <t.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.category}</div>
                    </div>
                  </button>
                )) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">No matching tools</div>
                )}
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="ml-2"
            data-testid="button-theme-toggle"
          >
            {mounted && theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button asChild className="hidden sm:flex ml-2">
            <a href="https://sabrtime.in" target="_blank" rel="noopener noreferrer">
              Visit SabrTime <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
