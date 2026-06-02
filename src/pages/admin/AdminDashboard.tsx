import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Users, TrendingUp, UserCheck, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/common/PageHeader";

interface DashboardStats {
  totalUsers: number;
  freeUsers: number;
  basicUsers: number;
  premiumUsers: number;
  enterpriseUsers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    freeUsers: 0,
    basicUsers: 0,
    premiumUsers: 0,
    enterpriseUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('subscription_tier');

      if (error) throw error;

      const stats = {
        totalUsers: profiles?.length || 0,
        freeUsers: profiles?.filter(p => p.subscription_tier === 'free').length || 0,
        basicUsers: profiles?.filter(p => p.subscription_tier === 'basic').length || 0,
        premiumUsers: profiles?.filter(p => p.subscription_tier === 'premium').length || 0,
        enterpriseUsers: profiles?.filter(p => p.subscription_tier === 'enterprise').length || 0,
      };

      setStats(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "載入失敗",
        description: "無法載入統計資料",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "總註冊用戶",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-500"
    },
    {
      title: "免費版用戶",
      value: stats.freeUsers,
      icon: UserCheck,
      color: "text-gray-500"
    },
    {
      title: "付費用戶",
      value: stats.basicUsers + stats.premiumUsers + stats.enterpriseUsers,
      icon: TrendingUp,
      color: "text-green-500"
    },
    {
      title: "企業版用戶",
      value: stats.enterpriseUsers,
      icon: DollarSign,
      color: "text-purple-500"
    }
  ];

  return (
    <div className="flex-1 bg-background text-foreground">
      <PageHeader
        breadcrumb={{
          category: "後台管理",
          page: "儀表板"
        }}
        title="管理後台"
        description="查看系統使用統計與用戶數據"
      />

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-2">
                    {loading ? "..." : stat.value}
                  </p>
                </div>
                <stat.icon className={`h-12 w-12 ${stat.color}`} />
              </div>
            </Card>
          ))}
        </div>

        {/* Subscription Breakdown */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">訂閱方案分布</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">免費版</span>
              <div className="flex items-center gap-3">
                <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gray-500 transition-all duration-500"
                    style={{ width: `${stats.totalUsers > 0 ? (stats.freeUsers / stats.totalUsers * 100) : 0}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-12 text-right">{stats.freeUsers}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">基礎版</span>
              <div className="flex items-center gap-3">
                <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${stats.totalUsers > 0 ? (stats.basicUsers / stats.totalUsers * 100) : 0}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-12 text-right">{stats.basicUsers}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">專業版</span>
              <div className="flex items-center gap-3">
                <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ width: `${stats.totalUsers > 0 ? (stats.premiumUsers / stats.totalUsers * 100) : 0}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-12 text-right">{stats.premiumUsers}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">企業版</span>
              <div className="flex items-center gap-3">
                <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 transition-all duration-500"
                    style={{ width: `${stats.totalUsers > 0 ? (stats.enterpriseUsers / stats.totalUsers * 100) : 0}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-12 text-right">{stats.enterpriseUsers}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
