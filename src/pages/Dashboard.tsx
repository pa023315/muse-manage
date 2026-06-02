import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import {
  FolderOpen,
  Clock,
  CheckCircle,
  DollarSign,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  Bell,
} from "lucide-react";
import PageHeader from "@/components/common/PageHeader";

const mockKPIData = {
  totalProjects: 42,
  activeProjects: 18,
  completedProjects: 24,
  unpaidRevenue: 328500,
};

const mockRevenueData = [
  { month: '1月', revenue: 45000 },
  { month: '2月', revenue: 52000 },
  { month: '3月', revenue: 48000 },
  { month: '4月', revenue: 61000 },
  { month: '5月', revenue: 55000 },
  { month: '6月', revenue: 67000 },
  { month: '7月', revenue: 59000 },
  { month: '8月', revenue: 73000 },
  { month: '9月', revenue: 68000 },
  { month: '10月', revenue: 81000 },
  { month: '11月', revenue: 76000 },
  { month: '12月', revenue: 89000 },
];

const mockUpcomingEvents = [
  { 
    id: 1, 
    title: "設計展參展", 
    date: "2024-09-15", 
    type: "exhibition",
    priority: "high" 
  },
  { 
    id: 2, 
    title: "客戶簡報會議", 
    date: "2024-09-18", 
    type: "meeting",
    priority: "medium" 
  },
  { 
    id: 3, 
    title: "作品集更新截止", 
    date: "2024-09-20", 
    type: "deadline",
    priority: "high" 
  },
];

export default function Dashboard() {
  const formatCurrency = useMemo(() => {
    return (amount: number) => new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0,
    }).format(amount);
  }, []);

  const memoizedRevenueData = useMemo(() => mockRevenueData, []);
  const memoizedKPIData = useMemo(() => mockKPIData, []);
  const memoizedUpcomingEvents = useMemo(() => mockUpcomingEvents, []);

  return (
    <div className="flex-1">
      <PageHeader
        breadcrumb={{
          category: "首頁",
          page: "儀表板"
        }}
      />
      
      <div className="space-y-6 p-6">
        {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm transition-shadow bg-white rounded-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-muted-foreground">總案件數</p>
              <p className="text-xs text-muted-foreground">本月</p>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">
              {memoizedKPIData.totalProjects}
            </div>
            <p className="text-sm text-green-600 font-medium">+12%</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm transition-shadow bg-white rounded-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-muted-foreground">進行中</p>
              <p className="text-xs text-muted-foreground">本月</p>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">
              {memoizedKPIData.activeProjects}
            </div>
            <p className="text-sm text-orange-600 font-medium">進行中</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm transition-shadow bg-white rounded-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-muted-foreground">已完成</p>
              <p className="text-xs text-muted-foreground">本月</p>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">
              {memoizedKPIData.completedProjects}
            </div>
            <p className="text-sm text-green-600 font-medium">+8%</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm transition-shadow bg-white rounded-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-muted-foreground">未付款收益</p>
              <p className="text-xs text-muted-foreground">本月</p>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">
              {formatCurrency(memoizedKPIData.unpaidRevenue)}
            </div>
            <p className="text-sm text-red-600 font-medium">待收款</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              12個月收入趨勢
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={memoizedRevenueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="month" 
                  className="text-xs fill-muted-foreground"
                />
                <YAxis 
                  className="text-xs fill-muted-foreground"
                  tickFormatter={(value) => `${value / 1000}K`}
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), '收入']}
                  labelClassName="text-foreground"
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  isAnimationActive={false}
                  dot={false}
                  activeDot={{ r: 4, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              本週活動
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {memoizedUpcomingEvents.map((event) => (
              <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors">
                <div className={`rounded-full p-1 ${
                  event.priority === 'high' 
                    ? 'bg-destructive/10 text-destructive' 
                    : 'bg-warning/10 text-warning'
                }`}>
                  <Bell className="h-3 w-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">
                    {event.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(event.date).toLocaleDateString('zh-TW', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <Badge 
                  variant={event.priority === 'high' ? 'destructive' : 'secondary'}
                  className="text-xs"
                >
                  {event.priority === 'high' ? '高' : '中'}
                </Badge>
              </div>
            ))}
            
            <Button variant="outline" className="w-full" size="sm">
              查看全部活動
            </Button>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}