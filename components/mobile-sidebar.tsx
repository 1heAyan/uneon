"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import styled from "styled-components"; // Import the styled-components library

// Import the icons used in the routes
import { LayoutDashboard, MessagesSquare, Code, Settings, Plus } from "lucide-react";

interface Route {
    label: string;
    icon?: React.ElementType;
    href: string;
    color?: string;
    pro?: boolean;
}

interface MobileSidebarProps {
    apiLimitCount: number;
    isPro: boolean;
}

const BotNavContainer = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height:6.3rem;
    background-color: #f0f0f0;
    padding: 1rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-shadow: 0px -1px 5px rgba(0, 0, 0, 0.2);

    /* Media query for hiding the bot nav on larger screens */
    @media screen and (min-width: 768px) {
        display: none;
    }
    @media screen and (max-width: 474px) {
        height:5rem;
    }
`;

const BotNavLink = styled.a`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
    color: inherit;
    font-size: 0.75rem;

    svg {
        margin-bottom: 0.25rem;
    }
`;

const MobileSidebar = ({ apiLimitCount = 0, isPro = false }: MobileSidebarProps) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    const routes = [
        {
          icon: LayoutDashboard,
          href: '/dashboard',
          color: "text-sky-500"
        },
        {
          icon: MessagesSquare,
          href: '/conversation',
          color: "text-violet-500",
        },
        {
          icon: Code,
          href: '/ai-companion',
          color: "text-violet-500",
        },
        {
          icon: Settings,
          href: '/settings',
        },
        {

        }
      
      ];

    return (
        <BotNavContainer>
            {routes.map((route, index) => (
                <BotNavLink
                    key={index}
                    href={route.href}
                    className={route.color ? route.color : ""}
                >
                    {/* Render the route icon if available */}
                    {route.icon && <route.icon />}
                </BotNavLink>
            ))}
        </BotNavContainer>
    );
};

export default MobileSidebar;
