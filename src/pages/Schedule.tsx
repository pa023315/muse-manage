import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/common/PageHeader";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Download
} from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, addWeeks, subWeeks, addDays, subDays } from "date-fns";
import { zhTW } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Event {
  id: string;
  title: string;
  event_date: string;
  event_type?: string;
  location?: string;
  description?: string;
}

type ViewMode = "month" | "week" | "day";

export default function Schedule() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const { toast } = useToast();

  // Fetch events from database
  const { data: events = [] } = useQuery({
    queryKey: ["events", format(currentDate, "yyyy-MM")],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .gte("event_date", format(startOfMonth(currentDate), "yyyy-MM-dd"))
        .lte("event_date", format(endOfMonth(currentDate), "yyyy-MM-dd"))
        .order("event_date", { ascending: true });

      if (error) throw error;
      return data as Event[];
    },
  });

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter((event) => 
      isSameDay(new Date(event.event_date), date)
    );
  };

  // Navigation handlers
  const handlePrevious = () => {
    if (viewMode === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (viewMode === "week") {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(subDays(currentDate, 1));
    }
  };

  const handleNext = () => {
    if (viewMode === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (viewMode === "week") {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Get calendar title based on view mode
  const getCalendarTitle = () => {
    if (viewMode === "month") {
      return format(currentDate, "yyyy年 M月", { locale: zhTW });
    } else if (viewMode === "week") {
      const weekStart = startOfWeek(currentDate, { locale: zhTW });
      const weekEnd = endOfWeek(currentDate, { locale: zhTW });
      return `${format(weekStart, "M月d日", { locale: zhTW })} - ${format(weekEnd, "M月d日", { locale: zhTW })}`;
    } else {
      return format(currentDate, "yyyy年 M月d日 EEEE", { locale: zhTW });
    }
  };

  // Connect to Google Calendar
  const handleConnectGoogleCalendar = () => {
    toast({
      title: "Google Calendar 整合",
      description: "此功能需要設定 Google Calendar API。請參考說明文件進行設定。",
    });
  };

  // Export to Google Calendar
  const handleExportToGoogleCalendar = () => {
    toast({
      title: "匯出到 Google Calendar",
      description: "正在準備匯出事件...",
    });
  };

  // Get days for current view
  const viewDays = useMemo(() => {
    if (viewMode === "month") {
      const start = startOfWeek(startOfMonth(currentDate), { locale: zhTW });
      const end = endOfWeek(endOfMonth(currentDate), { locale: zhTW });
      return eachDayOfInterval({ start, end });
    } else if (viewMode === "week") {
      const start = startOfWeek(currentDate, { locale: zhTW });
      const end = endOfWeek(currentDate, { locale: zhTW });
      return eachDayOfInterval({ start, end });
    } else {
      return [currentDate];
    }
  }, [currentDate, viewMode]);

  return (
    <div className="flex-1 bg-background">
      <PageHeader
        breadcrumb={{
          category: "專案管理",
          page: "時程表"
        }}
        title="時程表"
        description="管理專案時程與活動排程"
      />

      <div className="p-6 space-y-6">
        {/* Calendar Controls */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={handleToday}
              >
                今天
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold ml-2">
                {getCalendarTitle()}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
                <TabsList>
                  <TabsTrigger value="month">月</TabsTrigger>
                  <TabsTrigger value="week">週</TabsTrigger>
                  <TabsTrigger value="day">日</TabsTrigger>
                </TabsList>
              </Tabs>

              <Button
                variant="outline"
                onClick={handleConnectGoogleCalendar}
                className="gap-2"
              >
                <CalendarIcon className="h-4 w-4" />
                連接 Google 日曆
              </Button>

              <Button
                variant="outline"
                onClick={handleExportToGoogleCalendar}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                匯出
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Main Calendar View */}
          <Card className="p-6">
            {viewMode === "month" && (
              <div className="space-y-4">
                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-muted-foreground">
                  {["日", "一", "二", "三", "四", "五", "六"].map((day) => (
                    <div key={day}>{day}</div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-2">
                  {viewDays.map((day) => {
                    const dayEvents = getEventsForDate(day);
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const isToday = isSameDay(day, new Date());
                    const isSelected = selectedDate && isSameDay(day, selectedDate);

                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => setSelectedDate(day)}
                        className={cn(
                          "min-h-[100px] p-2 text-left rounded-lg border transition-colors",
                          "hover:bg-accent",
                          isCurrentMonth ? "bg-background" : "bg-muted/50 text-muted-foreground",
                          isToday && "border-primary",
                          isSelected && "bg-accent"
                        )}
                      >
                        <div className={cn(
                          "text-sm font-medium mb-1",
                          isToday && "text-primary font-bold"
                        )}>
                          {format(day, "d")}
                        </div>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              className="text-xs p-1 rounded bg-primary/10 text-primary truncate"
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{dayEvents.length - 2} 更多
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {viewMode === "week" && (
              <div className="space-y-4">
                <div className="grid grid-cols-7 gap-2">
                  {viewDays.map((day) => {
                    const dayEvents = getEventsForDate(day);
                    const isToday = isSameDay(day, new Date());

                    return (
                      <div key={day.toISOString()} className="space-y-2">
                        <div className={cn(
                          "text-center p-2 rounded-lg",
                          isToday && "bg-primary text-primary-foreground"
                        )}>
                          <div className="text-xs">{format(day, "EEE", { locale: zhTW })}</div>
                          <div className="text-lg font-bold">{format(day, "d")}</div>
                        </div>
                        <div className="space-y-2">
                          {dayEvents.map((event) => (
                            <Card key={event.id} className="p-2">
                              <div className="text-sm font-medium">{event.title}</div>
                              {event.location && (
                                <div className="text-xs text-muted-foreground">{event.location}</div>
                              )}
                            </Card>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {viewMode === "day" && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="text-2xl font-bold">
                    {format(currentDate, "d")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(currentDate, "EEEE", { locale: zhTW })}
                  </div>
                </div>
                <div className="space-y-3">
                  {getEventsForDate(currentDate).map((event) => (
                    <Card key={event.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{event.title}</h3>
                          {event.event_type && (
                            <Badge variant="outline" className="mt-2">
                              {event.event_type}
                            </Badge>
                          )}
                          {event.location && (
                            <p className="text-sm text-muted-foreground mt-2">
                              📍 {event.location}
                            </p>
                          )}
                          {event.description && (
                            <p className="text-sm text-muted-foreground mt-2">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                  {getEventsForDate(currentDate).length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      此日期沒有安排任何活動
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>

          {/* Mini Calendar & Events */}
          <div className="space-y-6">
            <Card className="p-4">
              <h3 className="font-semibold mb-4">快速導航</h3>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date);
                    setCurrentDate(date);
                  }
                }}
                locale={zhTW}
                className="rounded-md border"
              />
            </Card>

            {selectedDate && (
              <Card className="p-4">
                <h3 className="font-semibold mb-4">
                  {format(selectedDate, "M月d日", { locale: zhTW })} 的活動
                </h3>
                <div className="space-y-2">
                  {getEventsForDate(selectedDate).map((event) => (
                    <div
                      key={event.id}
                      className="p-3 rounded-lg bg-accent space-y-1"
                    >
                      <div className="font-medium text-sm">{event.title}</div>
                      {event.event_type && (
                        <Badge variant="outline" className="text-xs">
                          {event.event_type}
                        </Badge>
                      )}
                    </div>
                  ))}
                  {getEventsForDate(selectedDate).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      無活動
                    </p>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
