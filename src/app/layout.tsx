'use client';

import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { AppShell } from '@/components/layout/app-shell';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from './providers';
import { IntroAnimation } from '@/components/layout/intro-animation';
import React, { useEffect, useState, useCallback } from 'react';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';

export const metadataObject: Metadata = {
  title: 'NutriSnap',
  description: 'Track your nutrition with a snap!',
};

const INTRO_DURATION = 3000;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [clientHasMounted, setClientHasMounted] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    setClientHasMounted(true);
  }, []);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  const bodyClassName = cn(
    'antialiased',
    (clientHasMounted && !showIntro) ? '' : 'bg-slate-900'
  );

  return (
    <html lang="en" className={`${theme} ${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        <title>{String(metadataObject.title)}</title>
        <meta name="description" content={String(metadataObject.description)} />
      </head>
      <body className={bodyClassName}>
        {clientHasMounted && (
          <div className="animated-bg-container fixed inset-0 -z-10 overflow-hidden">
            <div className="blob-1"></div>
            <div className="blob-2"></div>
            <div className="blob-3"></div>
            <div className="particle-container">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={`particle-${i}`}
                  className="particle"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 10}s`,
                    animationDuration: `${5 + Math.random() * 10}s`,
                    width: `${Math.random() * 2 + 1}px`,
                    height: `${Math.random() * 2 + 1}px`,
                    ['--random-x-drift' as string]: Math.random(),
                  } as React.CSSProperties}
                ></div>
              ))}
            </div>
          </div>
        )}
        
        {/* Always render the main interface, but control visibility */}
        {clientHasMounted && (
          <div className={cn(
            "transition-opacity duration-500 ease-in-out",
            showIntro ? "opacity-0 pointer-events-none" : "opacity-100"
          )}>
            <Providers>
              <AppShell>{children}</AppShell>
            </Providers>
          </div>
        )}
        
        {/* Render intro animation on top when needed */}
        {clientHasMounted && showIntro && (
          <IntroAnimation duration={INTRO_DURATION} onComplete={handleIntroComplete} />
        )}
        
        {clientHasMounted && <Toaster />}
      </body>
    </html>
  );
}
