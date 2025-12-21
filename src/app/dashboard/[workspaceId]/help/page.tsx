"use client";

import { HelpCircle, MessageCircle } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    id: "1",
    question: "Como criar um workspace?",
    answer:
      "Para criar um novo workspace, vá até a tela inicial e clique no botão 'Criar Novo Workspace'. Preencha o nome e selecione a moeda desejada (BRL, USD ou EUR). Cada workspace representa um ambiente financeiro separado, ideal para organizar finanças pessoais, de empresas ou projetos diferentes.",
  },
  {
    id: "2",
    question: "Como funcionam as caixas de propósito?",
    answer:
      "As caixas de propósito (buckets) são uma forma de organizar seu dinheiro por objetivos. Cada caixa tem uma porcentagem de alocação automática - quando você registra uma receita, o dinheiro é distribuído automaticamente entre as caixas de acordo com essas porcentagens. Por exemplo, você pode ter 50% para despesas fixas, 30% para investimentos e 20% para lazer.",
  },
  {
    id: "3",
    question: "Como alterar minha senha?",
    answer:
      "Acesse seu perfil clicando no seu avatar no canto superior direito e selecione 'Perfil'. Na seção 'Segurança', clique em 'Alterar Senha'. Você precisará informar sua senha atual e depois definir uma nova senha segura.",
  },
  {
    id: "4",
    question: "O que é o 'Seguro para Gastar'?",
    answer:
      "O 'Seguro para Gastar' é o valor disponível para uso livre, sem comprometer suas metas financeiras. Ele é calculado subtraindo do seu saldo total os valores alocados em caixas essenciais (como emergência e contas fixas). Assim você sabe exatamente quanto pode gastar sem preocupações.",
  },
  {
    id: "5",
    question: "Como excluir um workspace?",
    answer:
      "Dentro do workspace que deseja excluir, vá em 'Configurações' no menu lateral. Role até a seção 'Zona de Perigo' e clique em 'Excluir Workspace'. Atenção: esta ação é irreversível e todos os dados (caixas e transações) serão perdidos permanentemente.",
  },
];

export default function HelpPage() {
  return (
    <div className="space-y-6 animate-fade-up">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Central de Ajuda</h1>
        <p className="mt-1 text-muted-foreground">
          Encontre respostas para suas dúvidas mais frequentes
        </p>
      </div>

      {/* FAQ Card */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <HelpCircle className="h-5 w-5 text-primary" />
            Perguntas Frequentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="border-border/60">
                <AccordionTrigger className="text-left hover:no-underline cursor-pointer py-4 text-sm font-medium transition-all hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-sm">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Contact Support Card */}
      <Card className="border-border/60 bg-secondary/10">
        <CardContent className="flex flex-col sm:flex-row items-center gap-4 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <MessageCircle className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-semibold text-foreground">
              Não encontrou o que procurava?
            </h3>
            <p className="text-sm text-muted-foreground">
              Entre em contato com nosso suporte para ajuda personalizada
            </p>
          </div>
          <Button variant="outline" className="cursor-pointer bg-background border-border hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-300">
            Falar com Suporte
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}