import { useState } from "react";
import { Check, CreditCard, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { StripeCheckoutButton } from "./StripeCheckoutButton";

type PaymentOption = "vista" | "parcelado";

interface PaymentOptionsProps {
  amount: number;
  className?: string;
}

export const PaymentOptions = ({ amount, className }: PaymentOptionsProps) => {
  const [selectedOption, setSelectedOption] = useState<PaymentOption | null>(null);

  const options = [
    {
      id: "vista" as PaymentOption,
      title: "À Vista",
      price: amount,
      displayPrice: `R$ ${amount.toFixed(2)}`,
      discount: "Melhor preço",
      icon: Sparkles,
      badge: "Mais vantajoso",
      badgeColor: "bg-green-500",
    },
    {
      id: "parcelado" as PaymentOption,
      title: "Parcelado",
      price: amount,
      displayPrice: `12x de R$ ${(amount / 12).toFixed(2)}`,
      discount: "Sem juros",
      icon: CreditCard,
      badge: "Flexível",
      badgeColor: "bg-blue-500",
    },
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-display font-bold">Escolha sua forma de pagamento</h3>
        <p className="text-muted-foreground">
          Selecione a opção que melhor se adequa a você
        </p>
      </div>

      {/* Payment Options Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedOption === option.id;

          return (
            <Card
              key={option.id}
              className={cn(
                "relative cursor-pointer transition-all duration-300 hover:shadow-lg",
                isSelected
                  ? "ring-2 ring-primary shadow-lg scale-105"
                  : "hover:border-primary/50"
              )}
              onClick={() => setSelectedOption(option.id)}
            >
              {/* Badge */}
              {option.badge && (
                <div
                  className={cn(
                    "absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white shadow-lg",
                    option.badgeColor
                  )}
                >
                  {option.badge}
                </div>
              )}

              <CardContent className="p-6 space-y-4">
                {/* Icon and Title */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center",
                        isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{option.title}</h4>
                      <p className="text-sm text-muted-foreground">{option.discount}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-5 h-5 text-primary-foreground" />
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="text-center py-4 border-t border-b">
                  <div className="text-3xl font-bold text-primary">
                    {option.displayPrice}
                  </div>
                  {option.id === "parcelado" && (
                    <div className="text-sm text-muted-foreground mt-1">
                      Total: R$ {option.price.toFixed(2)}
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-2">
                  {option.id === "vista" ? (
                    <>
                      <li className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>Pagamento único</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>Acesso imediato</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>Melhor custo-benefício</span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-blue-500" />
                        <span>Parcelas sem juros</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-blue-500" />
                        <span>Acesso imediato</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-blue-500" />
                        <span>Até 12x no cartão</span>
                      </li>
                    </>
                  )}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* CTA Button */}
      {selectedOption && (
        <div className="flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <StripeCheckoutButton
            priceType="oneTime"
            size="lg"
            className="bg-gradient-gold hover:shadow-gold-lg shadow-gold transition-all duration-300 text-base px-12 py-7 h-auto font-bold uppercase tracking-wider"
          >
            {selectedOption === "vista" ? (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Pagar à Vista - R$ {amount.toFixed(2)}
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-2" />
                Parcelar em até 12x
              </>
            )}
          </StripeCheckoutButton>
        </div>
      )}

      {/* Info */}
      <div className="text-center text-sm text-muted-foreground">
        <p>🔒 Pagamento 100% seguro via Stripe</p>
        <p className="mt-1">Você será redirecionado para finalizar a compra</p>
      </div>
    </div>
  );
};


