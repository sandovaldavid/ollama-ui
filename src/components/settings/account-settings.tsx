import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AccountSettingsProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AccountSettings({ open, onOpenChange }: AccountSettingsProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Configuración de cuenta</DialogTitle>
                    <DialogDescription>
                        Actualiza la configuración de tu cuenta aquí.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nombre</Label>
                        <Input id="name" placeholder="Tu nombre" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Correo electrónico</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="tu@email.com"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="model">Modelo predeterminado</Label>
                        <Input
                            id="model"
                            placeholder="deepseek-coder:6.7b"
                            defaultValue="deepseek-coder:6.7b"
                        />
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button>Guardar cambios</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
