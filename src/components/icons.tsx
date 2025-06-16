import {
  LayoutDashboard,
  ClipboardList,
  Settings,
  Utensils,
  HeartPulse,
  CalendarDays,
  BarChart3,
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  PlusCircle,
  User,
  Apple,
  Leaf,
  Flame,
  LogIn,
  LogOut,
  Camera,
  Loader2,
  SwitchCamera,
  Menu,
  Sun,
  Moon,
  Grape,
  Citrus,
  Cherry,
  // MessageCircle, // Removed for chat
  // Send, // Removed for chat
  type LucideProps,
} from 'lucide-react';

export const Icons = {
  Dashboard: LayoutDashboard,
  Log: ClipboardList,
  Settings: Settings,
  Food: Utensils,
  Health: HeartPulse,
  Calendar: CalendarDays,
  Chart: BarChart3,
  Upload: UploadCloud,
  PlaceholderImage: ImageIcon,
  Delete: Trash2,
  Add: PlusCircle,
  User: User,
  Apple: Apple,
  Leaf: Leaf,
  Flame: Flame,
  LogIn: LogIn,
  LogOut: LogOut,
  Camera: Camera,
  Loader2: Loader2,
  SwitchCamera: SwitchCamera,
  Menu: Menu,
  Sun: Sun,
  Moon: Moon,
  Grape: Grape,
  Citrus: Citrus,
  Cherry: Cherry,
  ClipboardList: ClipboardList,
  // Chat: MessageCircle, // Removed
  // Send: Send, // Removed
};

export type Icon = keyof typeof Icons;

interface AppIconProps extends LucideProps {
  name: Icon;
}

export function AppIcon({ name, ...props }: AppIconProps) {
  const IconComponent = Icons[name];
  if (!IconComponent) {
    // Fallback to a default icon if the specified icon is not found
    // This prevents rendering errors if an icon name is misspelled or missing
    console.warn(`Icon "${name}" not found in Icons object. Falling back to Settings icon.`);
    return <Icons.Settings {...props} />; // Or any other default icon
  }
  return <IconComponent {...props} />;
}
