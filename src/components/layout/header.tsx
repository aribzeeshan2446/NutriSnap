
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons, AppIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useUserSettings } from '@/hooks/use-user-settings';
import type { UserSettings } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ThemeToggle } from './ThemeToggle';
import { useState, useEffect } from 'react';

interface NavItem {
  href: string;
  label: string;
  icon: keyof typeof Icons;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: 'Dashboard' },
  { href: '/log', label: 'Calorie Log', icon: 'Log' },
  { href: '/settings', label: 'Settings', icon: 'Settings' },
];

// Extracted DesktopNav to use usePathname internally
function DesktopNav() {
  const pathname = usePathname();
  return (
    <nav className="hidden items-center gap-2 md:flex">
      {navItems.map((item) => (
        <Link key={item.href} href={item.href} passHref legacyBehavior>
          <Button
            variant={pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/') ? 'secondary' : 'ghost'}
            className="text-sm font-medium"
            size="sm"
          >
            <AppIcon name={item.icon} className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        </Link>
      ))}
    </nav>
  );
}

// Extracted MobileNav to use usePathname internally
function MobileNav({ settings, getUserInitials }: { settings: UserSettings; getUserInitials: (name?: string) => string }) {
  const pathname = usePathname();
  return (
    <div className="md:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
             <Avatar className="h-8 w-8">
               <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                 {getUserInitials(settings.name)}
               </AvatarFallback>
             </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="font-normal focus:bg-transparent cursor-default -mb-1">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {getUserInitials(settings.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-medium leading-none">{settings.name || 'User'}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    NutriSnap User
                  </p>
                </div>
              </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} passHref legacyBehavior>
              <DropdownMenuItem className={pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/') ? 'bg-accent text-accent-foreground focus:bg-accent focus:text-accent-foreground' : ''}>
                <AppIcon name={item.icon} className="mr-2 h-4 w-4" />
                {item.label}
              </DropdownMenuItem>
            </Link>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function Header() {
  const { settings } = useUserSettings();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const getUserInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase();
  }

  const showUserSpecificUI = hasMounted;

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between gap-4 border-b bg-card/50 backdrop-blur-xl px-4 md:px-6">
      <Link href="/dashboard" className="flex items-center gap-2 group transition-opacity hover:opacity-80">
        <Icons.Flame className="h-7 w-7 text-primary" />
        <span className="text-2xl font-bold text-foreground hidden sm:inline-block">NutriSnap</span>
      </Link>

      <DesktopNav />

      <div className="flex items-center gap-3">
        <ThemeToggle />

        {showUserSpecificUI && (
          <>
            {/* User Menu (Avatar only on Desktop) */}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getUserInitials(settings.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem className="font-normal focus:bg-transparent cursor-default">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{settings.name || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        NutriSnap User
                      </p>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <MobileNav settings={settings} getUserInitials={getUserInitials} />
          </>
        )}

        {!showUserSpecificUI && (
          <>
            {/* Placeholder for avatar/menu if needed during initial mount (showUserSpecificUI is false) */}
            <div className="flex items-center justify-center h-9 w-9 rounded-full bg-muted animate-pulse md:hidden">
              <Icons.Menu className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="hidden md:flex items-center justify-center h-9 w-9 rounded-full bg-muted animate-pulse">
            </div>
          </>
        )}
      </div>
    </header>
  );
}
