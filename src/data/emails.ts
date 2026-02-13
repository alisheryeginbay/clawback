import type { Email } from '@/types';

export const SEED_EMAILS: Omit<Email, 'id'>[] = [
  {
    from: 'sarah@company.com',
    to: 'ai@clawback.dev',
    subject: 'Q4 Report Review',
    body: 'Hi,\n\nCould you review the Q4 report in /documents/ and send me a summary of the key metrics?\n\nThanks,\nSarah',
    timestamp: 0,
    isRead: false,
    isStarred: false,
  },
  {
    from: 'raj@company.com',
    to: 'ai@clawback.dev',
    subject: 'Server Logs Alert',
    body: 'Hey,\n\nThere are some errors in /var/log/app.log that need investigation. Can you check the last few error entries and let me know what you find?\n\n- Raj',
    timestamp: 0,
    isRead: false,
    isStarred: false,
  },
  {
    from: 'hr@company.com',
    to: 'all-staff@company.com',
    subject: 'Company Picnic Next Friday!',
    body: 'Dear Team,\n\nJoin us for the annual company picnic next Friday at Central Park!\n\nTime: 12:00 PM - 4:00 PM\nFood and drinks provided.\n\nRSVP by Wednesday.\n\nBest,\nHR Team',
    timestamp: 0,
    isRead: true,
    isStarred: false,
  },
  {
    from: 'noreply@github.com',
    to: 'ai@clawback.dev',
    subject: '[webapp] PR #247: Fix auth token refresh',
    body: 'Dev Dan opened a pull request:\n\nFix auth token refresh (#247)\n\nThis PR fixes the token refresh issue that was causing random logouts.\n\nChanges:\n- Updated token refresh logic in auth.js\n- Added retry mechanism\n- Fixed race condition in concurrent requests\n\nPlease review and approve.',
    timestamp: 0,
    isRead: false,
    isStarred: false,
  },
  {
    from: 'luna@company.com',
    to: 'ai@clawback.dev',
    subject: 'New Landing Page Designs',
    body: 'Hey!\n\nI just finished the new landing page mockups. The files are in my Figma but I also need you to update the styles.css in the webapp project to match the new color scheme.\n\nNew primary color: #6366f1\nNew accent: #f59e0b\n\nThanks! ✨\nLuna',
    timestamp: 0,
    isRead: false,
    isStarred: true,
  },
];
