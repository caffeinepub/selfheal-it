export interface QuickAction {
  type: 'command' | 'instructions';
  command?: string;
  instructions?: string;
}

export interface RunbookStep {
  description: string;
  expectedOutcome: string;
  decisionPoint?: string;
  quickAction?: QuickAction;
}

export interface Runbook {
  id: string;
  category: string;
  issueName: string;
  symptoms: string[];
  steps: RunbookStep[];
}

export const RUNBOOK_CATALOG: Runbook[] = [
  {
    id: 'network-wifi-basic',
    category: 'network',
    issueName: 'Wi-Fi Connection Issues',
    symptoms: ['Cannot connect to Wi-Fi', 'Connected but no internet access'],
    steps: [
      {
        description: 'Check if Wi-Fi is enabled on your device',
        expectedOutcome: 'Wi-Fi toggle is turned on',
        quickAction: {
          type: 'instructions',
          instructions: 'Windows: Click the network icon in system tray\nMac: Click Wi-Fi icon in menu bar\nEnsure Wi-Fi is enabled',
        },
      },
      {
        description: 'Forget and reconnect to the network',
        expectedOutcome: 'Successfully reconnected to Wi-Fi',
        quickAction: {
          type: 'instructions',
          instructions: 'Windows: Settings > Network & Internet > Wi-Fi > Manage known networks > Forget\nMac: System Preferences > Network > Wi-Fi > Advanced > Remove network',
        },
      },
      {
        description: 'Restart your network adapter',
        expectedOutcome: 'Network adapter restarted successfully',
        quickAction: {
          type: 'command',
          command: 'netsh wlan disconnect && netsh wlan connect',
          instructions: 'Run this command in Command Prompt (Windows) or restart Wi-Fi from settings',
        },
      },
      {
        description: 'Restart your router',
        expectedOutcome: 'Router restarted and connection restored',
        quickAction: {
          type: 'instructions',
          instructions: 'Unplug your router for 30 seconds, then plug it back in. Wait 2-3 minutes for it to fully restart.',
        },
      },
    ],
  },
  {
    id: 'network-slow-speed',
    category: 'network',
    issueName: 'Slow Network Speed',
    symptoms: ['Slow network speed', 'Intermittent connection drops'],
    steps: [
      {
        description: 'Check your internet speed',
        expectedOutcome: 'Speed test completed',
        quickAction: {
          type: 'instructions',
          instructions: 'Visit speedtest.net and run a speed test. Note down the download and upload speeds.',
        },
      },
      {
        description: 'Move closer to the router',
        expectedOutcome: 'Signal strength improved',
        decisionPoint: 'If speed improves significantly, the issue is likely distance or interference',
      },
      {
        description: 'Check for bandwidth-heavy applications',
        expectedOutcome: 'Identified applications using high bandwidth',
        quickAction: {
          type: 'instructions',
          instructions: 'Windows: Open Task Manager > Performance > Network\nMac: Activity Monitor > Network tab\nClose any unnecessary applications using high bandwidth',
        },
      },
      {
        description: 'Flush DNS cache',
        expectedOutcome: 'DNS cache cleared',
        quickAction: {
          type: 'command',
          command: 'ipconfig /flushdns',
          instructions: 'Windows: Run this command in Command Prompt\nMac: sudo dscacheutil -flushcache',
        },
      },
    ],
  },
  {
    id: 'network-no-internet',
    category: 'network',
    issueName: 'Connected but No Internet',
    symptoms: ['Connected but no internet access'],
    steps: [
      {
        description: 'Verify other devices can connect',
        expectedOutcome: 'Determined if issue is device-specific or network-wide',
        decisionPoint: 'If other devices work, the issue is with your device. If not, it\'s a network issue.',
      },
      {
        description: 'Release and renew IP address',
        expectedOutcome: 'New IP address obtained',
        quickAction: {
          type: 'command',
          command: 'ipconfig /release && ipconfig /renew',
          instructions: 'Windows: Run these commands in Command Prompt\nMac: System Preferences > Network > Advanced > TCP/IP > Renew DHCP Lease',
        },
      },
      {
        description: 'Reset network settings',
        expectedOutcome: 'Network settings reset to defaults',
        quickAction: {
          type: 'command',
          command: 'netsh winsock reset && netsh int ip reset',
          instructions: 'Windows: Run these commands in Command Prompt as Administrator, then restart\nMac: Delete network preferences and restart',
        },
      },
      {
        description: 'Check DNS settings',
        expectedOutcome: 'DNS configured correctly',
        quickAction: {
          type: 'instructions',
          instructions: 'Try using Google DNS (8.8.8.8 and 8.8.4.4) or Cloudflare DNS (1.1.1.1)\nWindows: Network settings > Change adapter options > Properties > IPv4 > DNS\nMac: System Preferences > Network > Advanced > DNS',
        },
      },
    ],
  },
  {
    id: 'vpn-connection-failed',
    category: 'vpn',
    issueName: 'VPN Connection Failed',
    symptoms: ['VPN won\'t connect', 'Cannot access company resources'],
    steps: [
      {
        description: 'Verify VPN credentials',
        expectedOutcome: 'Credentials are correct',
        quickAction: {
          type: 'instructions',
          instructions: 'Check that your username and password are correct. Try logging into the company portal to verify.',
        },
      },
      {
        description: 'Check internet connection',
        expectedOutcome: 'Internet is working without VPN',
        decisionPoint: 'If internet doesn\'t work, fix internet connection first before troubleshooting VPN',
      },
      {
        description: 'Restart VPN client',
        expectedOutcome: 'VPN client restarted',
        quickAction: {
          type: 'instructions',
          instructions: 'Close the VPN application completely and reopen it. Try connecting again.',
        },
      },
      {
        description: 'Check firewall settings',
        expectedOutcome: 'VPN is allowed through firewall',
        quickAction: {
          type: 'instructions',
          instructions: 'Windows: Windows Security > Firewall & network protection > Allow an app through firewall\nMac: System Preferences > Security & Privacy > Firewall > Firewall Options\nEnsure your VPN client is allowed',
        },
      },
    ],
  },
  {
    id: 'vpn-slow-connection',
    category: 'vpn',
    issueName: 'VPN Slow Performance',
    symptoms: ['VPN is very slow', 'VPN disconnects frequently'],
    steps: [
      {
        description: 'Test connection speed without VPN',
        expectedOutcome: 'Baseline speed established',
        quickAction: {
          type: 'instructions',
          instructions: 'Disconnect VPN and run a speed test at speedtest.net. Note the results.',
        },
      },
      {
        description: 'Try a different VPN server',
        expectedOutcome: 'Connected to alternative server',
        quickAction: {
          type: 'instructions',
          instructions: 'In your VPN client, select a different server location, preferably one geographically closer to you.',
        },
      },
      {
        description: 'Change VPN protocol',
        expectedOutcome: 'Using different protocol',
        quickAction: {
          type: 'instructions',
          instructions: 'In VPN settings, try switching between protocols (OpenVPN, IKEv2, WireGuard). Each has different performance characteristics.',
        },
      },
      {
        description: 'Disable split tunneling',
        expectedOutcome: 'All traffic routed through VPN',
        quickAction: {
          type: 'instructions',
          instructions: 'In VPN settings, disable split tunneling to ensure all traffic goes through the VPN tunnel.',
        },
      },
    ],
  },
  {
    id: 'vpn-access-denied',
    category: 'vpn',
    issueName: 'VPN Access Issues',
    symptoms: ['Cannot access company resources'],
    steps: [
      {
        description: 'Verify VPN connection is active',
        expectedOutcome: 'VPN shows as connected',
        quickAction: {
          type: 'instructions',
          instructions: 'Check your VPN client to ensure it shows as connected. Look for a green indicator or "Connected" status.',
        },
      },
      {
        description: 'Test access to company portal',
        expectedOutcome: 'Can access company intranet',
        decisionPoint: 'If you can access the portal but not specific resources, the issue may be permissions-based',
      },
      {
        description: 'Check IP address assignment',
        expectedOutcome: 'Received company IP range',
        quickAction: {
          type: 'command',
          command: 'ipconfig',
          instructions: 'Windows: Run ipconfig in Command Prompt\nMac: ifconfig\nVerify you have an IP address in your company\'s range',
        },
      },
      {
        description: 'Clear DNS cache while on VPN',
        expectedOutcome: 'DNS cache cleared',
        quickAction: {
          type: 'command',
          command: 'ipconfig /flushdns',
          instructions: 'While connected to VPN, flush DNS cache to resolve any stale entries.',
        },
      },
    ],
  },
  {
    id: 'email-cannot-send',
    category: 'email',
    issueName: 'Cannot Send Emails',
    symptoms: ['Cannot send emails'],
    steps: [
      {
        description: 'Check if you can receive emails',
        expectedOutcome: 'Determined if issue is send-only or both',
        decisionPoint: 'If you can\'t receive either, the issue may be with your account or connection',
      },
      {
        description: 'Verify outbox for stuck messages',
        expectedOutcome: 'Checked outbox status',
        quickAction: {
          type: 'instructions',
          instructions: 'Open your email client and check the Outbox folder. Delete any stuck messages and try sending a new test email.',
        },
      },
      {
        description: 'Check email account settings',
        expectedOutcome: 'SMTP settings verified',
        quickAction: {
          type: 'instructions',
          instructions: 'Verify SMTP server settings:\n- Server address\n- Port (usually 587 or 465)\n- Authentication enabled\n- Username and password correct',
        },
      },
      {
        description: 'Test with webmail',
        expectedOutcome: 'Determined if issue is client-specific',
        quickAction: {
          type: 'instructions',
          instructions: 'Try sending an email through your email provider\'s web interface (e.g., outlook.com, gmail.com). If this works, the issue is with your email client.',
        },
      },
    ],
  },
  {
    id: 'email-cannot-receive',
    category: 'email',
    issueName: 'Cannot Receive Emails',
    symptoms: ['Cannot receive emails'],
    steps: [
      {
        description: 'Check spam/junk folder',
        expectedOutcome: 'Verified emails aren\'t being filtered',
        quickAction: {
          type: 'instructions',
          instructions: 'Check your Spam, Junk, or Trash folders. If you find emails there, mark them as "Not Spam".',
        },
      },
      {
        description: 'Verify mailbox isn\'t full',
        expectedOutcome: 'Mailbox has available space',
        quickAction: {
          type: 'instructions',
          instructions: 'Check your mailbox storage quota. Delete old emails or attachments if you\'re near the limit.',
        },
      },
      {
        description: 'Check email forwarding rules',
        expectedOutcome: 'No unwanted forwarding rules',
        quickAction: {
          type: 'instructions',
          instructions: 'In your email settings, check for any forwarding or filtering rules that might be redirecting your emails.',
        },
      },
      {
        description: 'Restart email client',
        expectedOutcome: 'Email client restarted',
        quickAction: {
          type: 'instructions',
          instructions: 'Close your email application completely and reopen it. Try manually checking for new messages.',
        },
      },
    ],
  },
  {
    id: 'email-client-wont-open',
    category: 'email',
    issueName: 'Email Client Won\'t Open',
    symptoms: ['Email client won\'t open'],
    steps: [
      {
        description: 'Check if process is already running',
        expectedOutcome: 'Identified if app is stuck',
        quickAction: {
          type: 'instructions',
          instructions: 'Windows: Open Task Manager (Ctrl+Shift+Esc) and look for your email client. End the task if found.\nMac: Open Activity Monitor and force quit the email app if it\'s running.',
        },
      },
      {
        description: 'Restart your computer',
        expectedOutcome: 'Computer restarted',
        quickAction: {
          type: 'instructions',
          instructions: 'Save all your work and restart your computer. Try opening the email client again.',
        },
      },
      {
        description: 'Repair email client installation',
        expectedOutcome: 'Application repaired',
        quickAction: {
          type: 'instructions',
          instructions: 'Windows: Settings > Apps > Find your email client > Advanced options > Repair\nMac: Reinstall the application from the App Store or company portal',
        },
      },
      {
        description: 'Check for updates',
        expectedOutcome: 'Application updated',
        quickAction: {
          type: 'instructions',
          instructions: 'Check if there are any pending updates for your email client. Install them and restart the application.',
        },
      },
    ],
  },
  {
    id: 'printer-not-found',
    category: 'printer',
    issueName: 'Printer Not Found',
    symptoms: ['Printer not found', 'Printer offline'],
    steps: [
      {
        description: 'Check printer power and connections',
        expectedOutcome: 'Printer is powered on and connected',
        quickAction: {
          type: 'instructions',
          instructions: 'Verify:\n- Printer is plugged in and powered on\n- USB cable is securely connected (if wired)\n- Printer is on the same Wi-Fi network (if wireless)',
        },
      },
      {
        description: 'Restart the printer',
        expectedOutcome: 'Printer restarted',
        quickAction: {
          type: 'instructions',
          instructions: 'Turn off the printer, wait 30 seconds, then turn it back on. Wait for it to fully initialize.',
        },
      },
      {
        description: 'Remove and re-add printer',
        expectedOutcome: 'Printer reinstalled',
        quickAction: {
          type: 'instructions',
          instructions: 'Windows: Settings > Devices > Printers & scanners > Remove device > Add printer\nMac: System Preferences > Printers & Scanners > Remove (-) > Add (+)',
        },
      },
      {
        description: 'Update printer drivers',
        expectedOutcome: 'Latest drivers installed',
        quickAction: {
          type: 'instructions',
          instructions: 'Visit the printer manufacturer\'s website and download the latest drivers for your printer model and operating system.',
        },
      },
    ],
  },
  {
    id: 'printer-queue-stuck',
    category: 'printer',
    issueName: 'Print Queue Stuck',
    symptoms: ['Print jobs stuck in queue'],
    steps: [
      {
        description: 'Cancel all print jobs',
        expectedOutcome: 'Print queue cleared',
        quickAction: {
          type: 'instructions',
          instructions: 'Windows: Settings > Devices > Printers & scanners > Open queue > Cancel all documents\nMac: System Preferences > Printers & Scanners > Open Print Queue > Delete all jobs',
        },
      },
      {
        description: 'Restart print spooler service',
        expectedOutcome: 'Print spooler restarted',
        quickAction: {
          type: 'command',
          command: 'net stop spooler && net start spooler',
          instructions: 'Windows: Run these commands in Command Prompt as Administrator\nMac: Restart your computer',
        },
      },
      {
        description: 'Clear print spooler folder',
        expectedOutcome: 'Spooler files deleted',
        quickAction: {
          type: 'instructions',
          instructions: 'Windows: Navigate to C:\\Windows\\System32\\spool\\PRINTERS and delete all files\nMac: Delete files in /var/spool/cups',
        },
      },
      {
        description: 'Restart printer and computer',
        expectedOutcome: 'Both devices restarted',
        quickAction: {
          type: 'instructions',
          instructions: 'Turn off the printer, restart your computer, then turn the printer back on. Try printing again.',
        },
      },
    ],
  },
  {
    id: 'printer-quality-issues',
    category: 'printer',
    issueName: 'Poor Print Quality',
    symptoms: ['Poor print quality'],
    steps: [
      {
        description: 'Check ink or toner levels',
        expectedOutcome: 'Verified consumable levels',
        quickAction: {
          type: 'instructions',
          instructions: 'Check the printer display or print a status page to see ink/toner levels. Replace if low.',
        },
      },
      {
        description: 'Run printer cleaning cycle',
        expectedOutcome: 'Print heads cleaned',
        quickAction: {
          type: 'instructions',
          instructions: 'Access printer maintenance menu (usually on the printer display or in printer software) and run the cleaning cycle.',
        },
      },
      {
        description: 'Check print quality settings',
        expectedOutcome: 'Settings optimized',
        quickAction: {
          type: 'instructions',
          instructions: 'In your print dialog, ensure quality is set to "Best" or "High" rather than "Draft" or "Economy".',
        },
      },
      {
        description: 'Print alignment page',
        expectedOutcome: 'Print heads aligned',
        quickAction: {
          type: 'instructions',
          instructions: 'Run the printer alignment utility from the maintenance menu to ensure proper alignment.',
        },
      },
    ],
  },
  {
    id: 'performance-slow-startup',
    category: 'performance',
    issueName: 'Slow Computer Startup',
    symptoms: ['Computer is very slow', 'Programs freeze frequently'],
    steps: [
      {
        description: 'Check startup programs',
        expectedOutcome: 'Identified unnecessary startup items',
        quickAction: {
          type: 'instructions',
          instructions: 'Windows: Task Manager > Startup tab > Disable unnecessary programs\nMac: System Preferences > Users & Groups > Login Items > Remove unnecessary items',
        },
      },
      {
        description: 'Run disk cleanup',
        expectedOutcome: 'Temporary files removed',
        quickAction: {
          type: 'instructions',
          instructions: 'Windows: Search for "Disk Cleanup" and run it, select all file types\nMac: Use built-in storage management or a tool like CleanMyMac',
        },
      },
      {
        description: 'Check for malware',
        expectedOutcome: 'System scanned for threats',
        quickAction: {
          type: 'instructions',
          instructions: 'Run a full system scan with your antivirus software. If you don\'t have one, use Windows Defender or download Malwarebytes.',
        },
      },
      {
        description: 'Check available disk space',
        expectedOutcome: 'Verified sufficient free space',
        quickAction: {
          type: 'instructions',
          instructions: 'Ensure you have at least 15-20% of your disk space free. Delete large files or move them to external storage if needed.',
        },
      },
    ],
  },
  {
    id: 'performance-high-cpu',
    category: 'performance',
    issueName: 'High CPU Usage',
    symptoms: ['High CPU usage', 'Programs freeze frequently'],
    steps: [
      {
        description: 'Identify resource-heavy processes',
        expectedOutcome: 'Found processes using high CPU',
        quickAction: {
          type: 'instructions',
          instructions: 'Windows: Task Manager > Processes tab > Sort by CPU\nMac: Activity Monitor > CPU tab\nNote which processes are using the most CPU',
        },
      },
      {
        description: 'Close unnecessary applications',
        expectedOutcome: 'Reduced active processes',
        quickAction: {
          type: 'instructions',
          instructions: 'Close any applications you\'re not actively using, especially browsers with many tabs, video conferencing apps, or resource-intensive programs.',
        },
      },
      {
        description: 'Check for Windows updates',
        expectedOutcome: 'System updated',
        quickAction: {
          type: 'instructions',
          instructions: 'Windows: Settings > Update & Security > Check for updates\nMac: System Preferences > Software Update\nInstall any pending updates',
        },
      },
      {
        description: 'Restart your computer',
        expectedOutcome: 'System resources refreshed',
        quickAction: {
          type: 'instructions',
          instructions: 'Save all work and restart your computer. This clears memory and stops background processes.',
        },
      },
    ],
  },
  {
    id: 'performance-disk-space',
    category: 'performance',
    issueName: 'Low Disk Space',
    symptoms: ['Not enough disk space', 'Computer is very slow'],
    steps: [
      {
        description: 'Check disk space usage',
        expectedOutcome: 'Identified space usage',
        quickAction: {
          type: 'instructions',
          instructions: 'Windows: Settings > System > Storage\nMac: Apple menu > About This Mac > Storage\nSee what\'s taking up space',
        },
      },
      {
        description: 'Empty recycle bin',
        expectedOutcome: 'Recycle bin emptied',
        quickAction: {
          type: 'instructions',
          instructions: 'Windows: Right-click Recycle Bin > Empty Recycle Bin\nMac: Finder > Empty Trash',
        },
      },
      {
        description: 'Remove large or old files',
        expectedOutcome: 'Freed up disk space',
        quickAction: {
          type: 'instructions',
          instructions: 'Look for:\n- Old downloads\n- Large video files\n- Duplicate files\n- Old installers\nMove them to external storage or delete them',
        },
      },
      {
        description: 'Uninstall unused applications',
        expectedOutcome: 'Removed unnecessary programs',
        quickAction: {
          type: 'instructions',
          instructions: 'Windows: Settings > Apps > Apps & features\nMac: Finder > Applications > Drag to Trash\nRemove programs you no longer use',
        },
      },
    ],
  },
  {
    id: 'account-forgot-password',
    category: 'account',
    issueName: 'Forgot Password',
    symptoms: ['Forgot password', 'Cannot login'],
    steps: [
      {
        description: 'Try password reset link',
        expectedOutcome: 'Reset email received',
        quickAction: {
          type: 'instructions',
          instructions: 'On the login page, click "Forgot Password" and enter your email address. Check your email for the reset link.',
        },
      },
      {
        description: 'Check spam folder',
        expectedOutcome: 'Located reset email',
        quickAction: {
          type: 'instructions',
          instructions: 'If you don\'t see the reset email in your inbox, check your Spam or Junk folder.',
        },
      },
      {
        description: 'Verify email address',
        expectedOutcome: 'Confirmed correct email',
        decisionPoint: 'If you\'re not receiving the reset email, you may be using a different email address than you think',
      },
      {
        description: 'Contact IT support',
        expectedOutcome: 'Support ticket created',
        quickAction: {
          type: 'instructions',
          instructions: 'If you still can\'t reset your password, contact IT support with your username and employee ID for manual reset.',
        },
      },
    ],
  },
  {
    id: 'account-locked',
    category: 'account',
    issueName: 'Account Locked',
    symptoms: ['Account locked', 'Cannot login'],
    steps: [
      {
        description: 'Wait 30 minutes',
        expectedOutcome: 'Account automatically unlocked',
        quickAction: {
          type: 'instructions',
          instructions: 'Most systems automatically unlock accounts after 30 minutes. Wait and try again.',
        },
      },
      {
        description: 'Verify you\'re using correct credentials',
        expectedOutcome: 'Confirmed username and password',
        quickAction: {
          type: 'instructions',
          instructions: 'Double-check that you\'re entering the correct username (not email) and password. Check for Caps Lock.',
        },
      },
      {
        description: 'Check for password expiration',
        expectedOutcome: 'Determined if password expired',
        decisionPoint: 'If your password has expired, you\'ll need to reset it through the proper channels',
      },
      {
        description: 'Contact IT support for unlock',
        expectedOutcome: 'Account unlocked by IT',
        quickAction: {
          type: 'instructions',
          instructions: 'Contact IT support with your username and employee ID. They can unlock your account immediately.',
        },
      },
    ],
  },
  {
    id: 'account-mfa-reset',
    category: 'account',
    issueName: 'MFA Reset Required',
    symptoms: ['Need to reset MFA', 'Cannot login'],
    steps: [
      {
        description: 'Try backup codes',
        expectedOutcome: 'Logged in with backup code',
        quickAction: {
          type: 'instructions',
          instructions: 'If you saved backup codes when setting up MFA, try using one of those to log in.',
        },
      },
      {
        description: 'Use alternative MFA method',
        expectedOutcome: 'Authenticated with alternative method',
        quickAction: {
          type: 'instructions',
          instructions: 'If you set up multiple MFA methods (SMS, email, authenticator app), try using an alternative method.',
        },
      },
      {
        description: 'Access account recovery',
        expectedOutcome: 'Started recovery process',
        quickAction: {
          type: 'instructions',
          instructions: 'Look for "Can\'t access your authentication method?" or similar link on the login page and follow the recovery process.',
        },
      },
      {
        description: 'Contact IT for MFA reset',
        expectedOutcome: 'MFA reset by IT',
        quickAction: {
          type: 'instructions',
          instructions: 'Contact IT support with your username and employee ID. They can reset your MFA after verifying your identity.',
        },
      },
    ],
  },
];

export function getRunbookById(id: string): Runbook | undefined {
  return RUNBOOK_CATALOG.find((rb) => rb.id === id);
}

export function getRunbooksByCategory(category: string): Runbook[] {
  return RUNBOOK_CATALOG.filter((rb) => rb.category === category);
}
