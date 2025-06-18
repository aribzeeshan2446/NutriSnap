'use client'; // Make AppShell a client component to use hooks

import type { PropsWithChildren } from 'react';
import Script from 'next/script';
import { Header } from './header'; 
import { useTheme } from '@/hooks/use-theme'; // Import useTheme hook

export function AppShell({ children }: PropsWithChildren) {
  const { theme } = useTheme(); // Get the current theme

  const widgetStyle: React.CSSProperties = theme === 'dark' 
    ? {
        '--widget-bg-color': 'var(--card)', // Using card background for the widget
        '--widget-text-color': 'var(--card-foreground)',
        '--widget-border-color': 'var(--border)',
        '--widget-primary-color': 'var(--primary)',
        '--widget-button-bg-color': 'var(--primary)',
        '--widget-button-text-color': 'var(--primary-foreground)',
        '--widget-input-bg-color': 'var(--input)',
        '--widget-input-text-color': 'var(--foreground)',
      } 
    : {};

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-transparent p-4 pt-0 md:p-6 lg:p-8">
        {children}
      </main>
      {/* ElevenLabs Convai Widget */}
      <elevenlabs-convai 
        agent-id="agent_01jxyjjvykfm6v7ffjmwhn9t8d"
        data-theme={theme}
        style={widgetStyle}
      ></elevenlabs-convai>
      <Script 
        src="https://unpkg.com/@elevenlabs/convai-widget-embed" 
        strategy="afterInteractive"
        async
        type="text/javascript"
      />
      {/* Optional: Footer component could go here */}
    </div>
  );
}
