import React from 'react';
import { 
  Type, AlignLeft, Link as LinkIcon, Image, HelpCircle, Building2, 
  FileText, Map, Bot, Share2, BarChart2, Hash, BookOpen, Network, 
  CheckSquare, Tag, CornerRightDown, Code2, ClipboardList 
} from 'lucide-react';
import { SiX } from 'react-icons/si';

import MetaTitleGenerator from './MetaTitleGenerator';
import MetaDescriptionGenerator from './MetaDescriptionGenerator';
import SeoSlugGenerator from './SeoSlugGenerator';
import ImageAltTextGenerator from './ImageAltTextGenerator';
import FaqSchemaGenerator from './FaqSchemaGenerator';
import OrganizationSchemaGenerator from './OrganizationSchemaGenerator';
import ArticleSchemaGenerator from './ArticleSchemaGenerator';
import SitemapGenerator from './SitemapGenerator';
import RobotsTxtGenerator from './RobotsTxtGenerator';
import OpenGraphGenerator from './OpenGraphGenerator';
import TwitterCardGenerator from './TwitterCardGenerator';
import KeywordDensityChecker from './KeywordDensityChecker';
import WordCounter from './WordCounter';
import ReadabilityChecker from './ReadabilityChecker';
import InternalLinkSuggestion from './InternalLinkSuggestion';
import SeoChecklist from './SeoChecklist';
import CanonicalTagGenerator from './CanonicalTagGenerator';
import RedirectGenerator from './RedirectGenerator';
import JsonLdValidator from './JsonLdValidator';
import SeoAuditChecklist from './SeoAuditChecklist';

export interface ToolDefinition {
  slug: string;
  name: string;
  icon: React.ElementType;
  category: 'Content' | 'Meta Tags' | 'Schema' | 'Technical' | 'Analytics';
  description: string;
  component: React.ComponentType;
}

export const tools: ToolDefinition[] = [
  { slug: 'meta-title-generator', name: 'Meta Title Generator', icon: Type, category: 'Meta Tags', description: 'Generate optimized meta titles for your pages.', component: MetaTitleGenerator },
  { slug: 'meta-description-generator', name: 'Meta Description Generator', icon: AlignLeft, category: 'Meta Tags', description: 'Create engaging meta descriptions that drive clicks.', component: MetaDescriptionGenerator },
  { slug: 'seo-slug-generator', name: 'SEO Slug Generator', icon: LinkIcon, category: 'Technical', description: 'Convert text into clean, SEO-friendly URL slugs.', component: SeoSlugGenerator },
  { slug: 'image-alt-text-generator', name: 'Image Alt Text Generator', icon: Image, category: 'Content', description: 'Write descriptive and SEO-optimized alt text for images.', component: ImageAltTextGenerator },
  { slug: 'faq-schema-generator', name: 'FAQ Schema Generator', icon: HelpCircle, category: 'Schema', description: 'Generate JSON-LD FAQ schema markup.', component: FaqSchemaGenerator },
  { slug: 'organization-schema-generator', name: 'Organization Schema Generator', icon: Building2, category: 'Schema', description: 'Create JSON-LD markup for your business or organization.', component: OrganizationSchemaGenerator },
  { slug: 'article-schema-generator', name: 'Article Schema Generator', icon: FileText, category: 'Schema', description: 'Generate JSON-LD article schema for blog posts.', component: ArticleSchemaGenerator },
  { slug: 'sitemap-generator', name: 'Sitemap.xml Generator', icon: Map, category: 'Technical', description: 'Create an XML sitemap for your website.', component: SitemapGenerator },
  { slug: 'robots-txt-generator', name: 'Robots.txt Generator', icon: Bot, category: 'Technical', description: 'Generate a robots.txt file to guide search engine crawlers.', component: RobotsTxtGenerator },
  { slug: 'open-graph-generator', name: 'Open Graph Generator', icon: Share2, category: 'Meta Tags', description: 'Create Open Graph meta tags for better social sharing.', component: OpenGraphGenerator },
  { slug: 'twitter-card-generator', name: 'Twitter Card Generator', icon: SiX, category: 'Meta Tags', description: 'Generate Twitter Card meta tags for optimal display on X.', component: TwitterCardGenerator },
  { slug: 'keyword-density-checker', name: 'Keyword Density Checker', icon: BarChart2, category: 'Analytics', description: 'Analyze your content to find keyword frequency and density.', component: KeywordDensityChecker },
  { slug: 'word-counter', name: 'Word Counter', icon: Hash, category: 'Content', description: 'Count words, characters, sentences, and paragraphs.', component: WordCounter },
  { slug: 'readability-checker', name: 'Readability Checker', icon: BookOpen, category: 'Analytics', description: 'Check the reading level and ease of your content.', component: ReadabilityChecker },
  { slug: 'internal-link-suggestion', name: 'Internal Link Suggestion', icon: Network, category: 'Content', description: 'Find internal linking opportunities within your content.', component: InternalLinkSuggestion },
  { slug: 'seo-checklist', name: 'SEO Checklist Tool', icon: CheckSquare, category: 'Analytics', description: 'A comprehensive checklist to optimize a specific page.', component: SeoChecklist },
  { slug: 'canonical-tag-generator', name: 'Canonical Tag Generator', icon: Tag, category: 'Technical', description: 'Generate canonical tags to prevent duplicate content issues.', component: CanonicalTagGenerator },
  { slug: 'redirect-generator', name: 'Redirect Generator', icon: CornerRightDown, category: 'Technical', description: 'Create correct server redirect rules (Apache, Nginx, etc.).', component: RedirectGenerator },
  { slug: 'json-ld-validator', name: 'JSON-LD Validator', icon: Code2, category: 'Schema', description: 'Validate and format your JSON-LD schema markup.', component: JsonLdValidator },
  { slug: 'seo-audit-checklist', name: 'SEO Audit Checklist', icon: ClipboardList, category: 'Analytics', description: 'A detailed 30+ point checklist for a full website SEO audit.', component: SeoAuditChecklist }
];
