"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { Check } from "lucide-react"

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "$0",
      period: "/month",
      description: "Perfect for trying VastuVista",
      features: [
        "5 space analyses per month",
        "Basic Vastu recommendations",
        "Standard diagram visualization",
        "Mobile app access",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      description: "For architects and designers",
      features: [
        "Unlimited analyses",
        "Advanced recommendations engine",
        "High-res diagrams & exports",
        "Floor plan analyzer",
        "Team collaboration (up to 5 members)",
        "Priority support",
        "Custom reports",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "For large organizations",
      features: [
        "Everything in Professional",
        "Unlimited team members",
        "Custom integrations",
        "Dedicated support",
        "SLA guarantees",
        "White-label options",
        "Advanced analytics",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader currentPage="pricing" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan to optimize your architectural designs with Vastu principles
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {plans.map((plan, idx) => (
            <Card key={idx} className={`relative flex flex-col ${plan.popular ? "border-primary md:scale-105" : ""}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-sm">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl sm:text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <ul className="space-y-3 mb-6 flex-grow">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${
                    plan.popular ? "bg-primary hover:bg-primary/90 text-primary-foreground" : "border"
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I switch plans anytime?",
                a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.",
              },
              {
                q: "Do you offer refunds?",
                a: "We offer a 30-day money-back guarantee for all paid plans. No questions asked.",
              },
              {
                q: "Is there a free trial?",
                a: "Yes, all paid plans come with a 14-day free trial. No credit card required.",
              },
              {
                q: "Can I get a custom quote?",
                a: "Absolutely. Contact our sales team for enterprise solutions tailored to your needs.",
              },
            ].map((faq, idx) => (
              <div key={idx} className="border border-border rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
