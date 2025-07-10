import { cva, type VariantProps } from 'class-variance-authority';

export const sidebarVariants = cva(
  // Ajoute ici les variantes si tu en as besoin pour Sidebar
  '',
  {
    variants: {},
    defaultVariants: {},
  },
);

export type SidebarVariants = VariantProps<typeof sidebarVariants>;
