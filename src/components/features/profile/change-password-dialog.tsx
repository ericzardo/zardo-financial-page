"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { changePasswordSchema, ChangePasswordData } from "@/schemas/user";

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChangePasswordDialog({ open, onOpenChange }: ChangePasswordDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordData) => {
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    console.log("FORM SUBMETIDO COM SUCESSO:", data);

    toast.success("Senha alterada com sucesso!", {
      description: "Utilize sua nova senha no próximo acesso.",
    });

    setIsSubmitting(false);
    onOpenChange(false);
    reset();
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) reset();
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-100 border-none shadow-xl [&>button]:cursor-pointer">
        <DialogHeader>
          <DialogTitle>Alterar Senha</DialogTitle>
          <DialogDescription>
            Digite sua senha atual e a nova senha para continuar.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          
          {/* Senha Atual */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Senha Atual</Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="••••••••"
              {...register("currentPassword")}
              className={errors.currentPassword ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.currentPassword && (
              <p className="text-sm font-medium text-destructive animate-pulse">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* Nova Senha */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nova Senha</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="••••••••"
              {...register("newPassword")}
              className={errors.newPassword ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.newPassword && (
              <p className="text-sm font-medium text-destructive animate-pulse">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirmar Nova Senha */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              className={errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.confirmPassword && (
              <p className="text-sm font-medium text-destructive animate-pulse">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              Cancelar
            </Button>
            
            <Button 
              type="submit"
              disabled={isSubmitting} 
              className="cursor-pointer"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Alterar Senha
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}