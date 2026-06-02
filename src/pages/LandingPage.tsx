import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Users, TrendingUp, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const features = [
    {
      icon: Users,
      title: "客戶管理",
      description: "完整的客戶資料管理系統，輕鬆追蹤客戶需求與專案進度"
    },
    {
      icon: TrendingUp,
      title: "專案追蹤",
      description: "從洽詢到完成，全方位掌握專案狀態與收益"
    },
    {
      icon: Shield,
      title: "安全可靠",
      description: "企業級資料安全保護，讓您安心使用"
    },
    {
      icon: Zap,
      title: "高效便捷",
      description: "直覺的操作介面，快速上手無需培訓"
    }
  ];

  const pricingTiers = [
    {
      name: "免費版",
      tier: "free",
      price: "NT$ 0",
      period: "永久免費",
      features: [
        "最多 10 個專案",
        "基本客戶管理",
        "報表匯出",
        "社群支援"
      ]
    },
    {
      name: "基礎版",
      tier: "basic",
      price: "NT$ 990",
      period: "每月",
      features: [
        "最多 50 個專案",
        "進階客戶管理",
        "廠商資源管理",
        "活動報名功能",
        "優先客服支援"
      ],
      popular: true
    },
    {
      name: "專業版",
      tier: "premium",
      price: "NT$ 2,990",
      period: "每月",
      features: [
        "無限專案數量",
        "完整功能存取",
        "API 串接",
        "客製化報表",
        "專屬客戶經理",
        "24/7 技術支援"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg" />
            <span className="font-bold text-xl">Creator ERP</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm hover:text-primary transition-colors">功能特色</a>
            <a href="#pricing" className="text-sm hover:text-primary transition-colors">方案價格</a>
            <Link to="/dashboard">
              <Button variant="outline" size="sm">登入系統</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          專為創作者打造的<br />專案管理系統
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          整合客戶洽詢、報價製作、專案追蹤、收益管理於一身<br />
          讓您專注於創作，我們處理其他一切
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/dashboard">
            <Button size="lg" className="gap-2">
              開始使用 <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Button size="lg" variant="outline">了解更多</Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">強大功能，一應俱全</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">選擇最適合您的方案</h2>
          <p className="text-center text-muted-foreground mb-12">無隱藏費用，隨時可升級或降級</p>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <Card 
                key={index} 
                className={`p-6 ${tier.popular ? 'border-primary shadow-lg scale-105' : ''}`}
              >
                {tier.popular && (
                  <div className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full mb-4 inline-block">
                    最受歡迎
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-muted-foreground ml-2">{tier.period}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  variant={tier.popular ? "default" : "outline"}
                >
                  選擇方案
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">準備好開始了嗎？</h2>
          <p className="text-xl mb-8 opacity-90">立即註冊，免費試用所有功能</p>
          <Link to="/dashboard">
            <Button size="lg" variant="secondary" className="gap-2">
              免費開始使用 <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Creator ERP. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
