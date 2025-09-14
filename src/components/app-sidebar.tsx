import * as React from 'react';
import {
  IconDatabase,
  IconInnerShadowTop,
  IconCoin,
} from '@tabler/icons-react';

import { NavContent } from '@/components/nav-content.tsx';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const data = {
  user: {
    name: 'Ritchie',
    email: 'admin@ritchie-invest.com',
    avatar: '/avatars/shadcn.jpg',
  },
  main: [
    {
      name: 'Chapitres',
      url: '/',
      icon: IconDatabase,
    },
    {
      name: 'Tickers',
      url: '/tickers',
      icon: IconCoin,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Ritchie CRM</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavContent items={data.main} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
