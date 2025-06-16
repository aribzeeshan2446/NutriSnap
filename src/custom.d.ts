// This file is used to declare custom HTML elements for TypeScript JSX.

declare namespace JSX {
  interface IntrinsicElements {
    'elevenlabs-convai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { 
      'agent-id'?: string;
      theme?: 'light' | 'dark'; // Previous attempt, kept for reference if needed
      'data-theme'?: 'light' | 'dark'; // New attempt for theming
      // Add other attributes the widget might accept here
      // e.g., style?: React.CSSProperties;
    }, HTMLElement>;
  }
}

// If you have other custom elements, you can declare them here as well.
// export {}; // Add this line if you get an error about 'JSX' not being found or if the file is treated as a script.
// However, for ambient declarations, an export is often not needed if the file is correctly picked up by tsconfig.

