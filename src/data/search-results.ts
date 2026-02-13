import type { SearchResult } from '@/types';

export const SEARCH_DATABASE: SearchResult[] = [
  // React
  {
    id: 'sr1',
    title: 'React Best Practices 2024 - Official Guide',
    url: 'https://react.dev/learn/best-practices',
    snippet: 'Learn the recommended patterns for building React applications including hooks, state management, and component composition.',
    category: 'documentation',
    relevantTo: ['react', 'best practices', 'frontend', 'hooks'],
  },
  {
    id: 'sr2',
    title: 'React Performance Optimization Techniques',
    url: 'https://blog.devworld.com/react-performance',
    snippet: 'Comprehensive guide to React.memo, useMemo, useCallback, and code splitting for optimal performance.',
    category: 'tutorial',
    relevantTo: ['react', 'performance', 'optimization', 'memo'],
  },
  // Python
  {
    id: 'sr3',
    title: 'Python CSV Processing - pandas vs csv module',
    url: 'https://docs.python.org/3/library/csv.html',
    snippet: 'The csv module implements classes to read and write tabular data in CSV format. For large datasets, consider using pandas.',
    category: 'documentation',
    relevantTo: ['python', 'csv', 'pandas', 'data'],
  },
  {
    id: 'sr4',
    title: 'Flask REST API Tutorial',
    url: 'https://flask.palletsprojects.com/tutorial/',
    snippet: 'Build a complete REST API with Flask including routing, request handling, error management, and deployment.',
    category: 'tutorial',
    relevantTo: ['flask', 'api', 'python', 'rest', 'server'],
  },
  // DevOps
  {
    id: 'sr5',
    title: 'Setting Up Cron Jobs on Linux',
    url: 'https://www.linuxhandbook.com/crontab/',
    snippet: 'Complete guide to scheduling automated tasks with cron. Syntax: minute hour day month weekday command.',
    category: 'tutorial',
    relevantTo: ['cron', 'crontab', 'linux', 'automation', 'scheduling', 'backup'],
  },
  {
    id: 'sr6',
    title: 'Docker Container Best Practices',
    url: 'https://docs.docker.com/best-practices/',
    snippet: 'Official Docker best practices for building efficient, secure, and maintainable container images.',
    category: 'documentation',
    relevantTo: ['docker', 'container', 'devops', 'deployment'],
  },
  // Security
  {
    id: 'sr7',
    title: 'OWASP Top 10 Web Security Risks',
    url: 'https://owasp.org/top-ten/',
    snippet: 'The definitive list of the most critical web application security risks including injection, XSS, and authentication failures.',
    category: 'reference',
    relevantTo: ['security', 'owasp', 'vulnerability', 'web security'],
  },
  {
    id: 'sr8',
    title: 'How to Safely Store API Keys and Secrets',
    url: 'https://blog.securityfirst.dev/api-key-management',
    snippet: 'Never hardcode secrets in your code. Use environment variables, secret managers, or encrypted vaults.',
    category: 'tutorial',
    relevantTo: ['security', 'api keys', 'secrets', 'credentials', 'environment variables'],
  },
  // JavaScript
  {
    id: 'sr9',
    title: 'Debugging JavaScript - Common Error Patterns',
    url: 'https://developer.mozilla.org/en-US/docs/Tools/Debugger',
    snippet: 'Learn to identify and fix common JavaScript errors including TypeError, ReferenceError, and null pointer exceptions.',
    category: 'documentation',
    relevantTo: ['javascript', 'debug', 'error', 'bug', 'fix', 'null'],
  },
  {
    id: 'sr10',
    title: 'npm Package Management Cheat Sheet',
    url: 'https://docs.npmjs.com/cli/',
    snippet: 'Quick reference for npm commands: install, update, audit, run scripts, and manage dependencies.',
    category: 'reference',
    relevantTo: ['npm', 'node', 'package', 'install', 'dependencies'],
  },
  // Git
  {
    id: 'sr11',
    title: 'Git Branching Strategies Explained',
    url: 'https://www.atlassian.com/git/tutorials/branching',
    snippet: 'Compare Git Flow, GitHub Flow, and Trunk Based Development branching strategies for teams.',
    category: 'tutorial',
    relevantTo: ['git', 'branch', 'merge', 'workflow', 'version control'],
  },
  // General
  {
    id: 'sr12',
    title: 'How to Write a Good README',
    url: 'https://www.makeareadme.com/',
    snippet: 'A good README should include: project description, installation steps, usage examples, and contribution guidelines.',
    category: 'tutorial',
    relevantTo: ['readme', 'documentation', 'project', 'markdown'],
  },
  {
    id: 'sr13',
    title: 'CSS Grid vs Flexbox - When to Use What',
    url: 'https://css-tricks.com/grid-vs-flexbox/',
    snippet: 'Flexbox for 1D layouts (rows or columns), Grid for 2D layouts (rows and columns). Both can be combined effectively.',
    category: 'tutorial',
    relevantTo: ['css', 'grid', 'flexbox', 'layout', 'responsive', 'design'],
  },
  {
    id: 'sr14',
    title: 'Understanding HTTP Status Codes',
    url: 'https://httpstatuses.io/',
    snippet: '200 OK, 201 Created, 301 Redirect, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Error.',
    category: 'reference',
    relevantTo: ['http', 'status code', 'api', '500', '404', 'error', 'server'],
  },
  {
    id: 'sr15',
    title: 'Monitoring and Logging Best Practices',
    url: 'https://www.datadoghq.com/blog/monitoring-best-practices/',
    snippet: 'Implement structured logging, set up alerts for anomalies, track key metrics, and create meaningful dashboards.',
    category: 'tutorial',
    relevantTo: ['monitoring', 'logging', 'alerts', 'dashboard', 'observability'],
  },
];

export function searchDatabase(query: string): SearchResult[] {
  if (!query.trim()) return [];
  const terms = query.toLowerCase().split(/\s+/);

  return SEARCH_DATABASE
    .map((result) => {
      let score = 0;
      const searchText = `${result.title} ${result.snippet} ${result.category}`.toLowerCase();
      const tags = result.relevantTo || [];

      for (const term of terms) {
        if (searchText.includes(term)) score += 1;
        if (tags.some((t) => t.includes(term))) score += 2;
        if (result.title.toLowerCase().includes(term)) score += 3;
      }
      return { result, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ result }) => result)
    .slice(0, 8);
}
