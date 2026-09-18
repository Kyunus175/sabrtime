import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ToolDefinition } from '@/tools';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ToolCardProps {
  tool: ToolDefinition;
}

export function ToolCard({ tool }: ToolCardProps) {
  const Icon = tool.icon;
  return (
    <Card className="flex flex-col h-full hover-elevate transition-all border-muted hover:border-primary/50 group">
      <CardHeader className="flex-1 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform">
            <Icon className="w-6 h-6" />
          </div>
          <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground">
            {tool.category}
          </Badge>
        </div>
        <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">{tool.name}</CardTitle>
        <CardDescription className="text-sm line-clamp-2">
          {tool.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="pt-0">
        <Button asChild variant="ghost" className="w-full justify-between text-muted-foreground group-hover:text-foreground">
          <Link href={`/tool/${tool.slug}`}>
            Open Tool <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
