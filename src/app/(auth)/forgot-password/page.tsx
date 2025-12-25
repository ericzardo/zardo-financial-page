"use client";

import { useState } from "react";
import Link from "next/link"; 
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, ArrowLeft } from "lucide-react";

import { AuthLayout } from "@/components/layout/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { forgotPasswordSchema, ForgotPasswordData } from "@/schemas/auth";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    setIsLoading(true);
    
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    console.log("Password reset requested for:", data.email);
    
    setIsLoading(false);
    setIsSuccess(true);
  };

  return (
    <AuthLayout>
      {isSuccess ? (
        <div className="text-center space-y-6 animate-fade-up">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center animate-in zoom-in duration-300">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              Verifique seu e-mail
            </h1>
            <p className="text-muted-foreground max-w-xs mx-auto">
              Enviamos um link de recuperação para 
              <span className="font-medium text-foreground block mt-1">
                {form.getValues("email")}
              </span>
            </p>
          </div>

          <Button asChild className="w-full cursor-pointer" size="lg">
            <Link href="/login">Voltar para Login</Link>
          </Button>
          
          <p className="text-sm text-muted-foreground">
            Não recebeu?{" "}
            <button 
              onClick={() => setIsSuccess(false)}
              className="font-medium text-primary hover:underline cursor-pointer"
            >
              Tentar novamente
            </button>
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-2xl font-bold text-foreground">
              Recuperar Senha
            </h1>
            <p className="text-muted-foreground">
              Digite seu e-mail para receber as instruções de redefinição.
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="seu@email.com"
                        type="email"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full cursor-pointer" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar Link"
                )}
              </Button>
            </form>
          </Form>

          {/* Back Link */}
          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Login
            </Link>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}