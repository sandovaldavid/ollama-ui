import { useState } from 'react';
import { User } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AccountSettings } from '@/components/settings/account-settings';

export function Navbar() {
    const [showSettings, setShowSettings] = useState(false);

    return (
        <nav className="border-b">
            <div className="flex h-16 items-center px-4">
                <div className="flex-1">
                    <a href="/">
                        <h1 className="text-xl font-bold">DeepSeek Chat</h1>
                    </a>
                </div>
                <div className="flex items-center gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="relative h-10 w-10 rounded-full"
                            >
                                <Avatar>
                                    <AvatarFallback>
                                        <User className="h-5 w-5" />
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => setShowSettings(true)}
                            >
                                Configurar cuenta
                            </DropdownMenuItem>
                            <DropdownMenuItem>Cerrar sesión</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <AccountSettings
                open={showSettings}
                onOpenChange={setShowSettings}
            />
        </nav>
    );
}
