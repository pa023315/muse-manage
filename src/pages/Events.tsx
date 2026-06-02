import { useState } from "react";
import { Calendar, MapPin, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import FilterButtons from "@/components/common/FilterButtons";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Mock data for banners
const bannerData = [
  {
    id: 1,
    title: "創作者市集",
    subtitle: "發現原創設計作品",
    image: "/placeholder.svg",
    color: "bg-gradient-to-r from-purple-500 to-pink-500"
  },
  {
    id: 2,
    title: "設計工作坊",
    subtitle: "提升創作技能",
    image: "/placeholder.svg",
    color: "bg-gradient-to-r from-blue-500 to-cyan-500"
  },
  {
    id: 3,
    title: "藝術展覽",
    subtitle: "當代藝術精選",
    image: "/placeholder.svg",
    color: "bg-gradient-to-r from-green-500 to-teal-500"
  }
];

// Mock data for events
const eventsData = [
  {
    id: 1,
    name: "【CWT-K48】(高雄場)",
    date: "2025年9月6日/7日",
    location: "新光三越高雄左營店10F國際活動展演中心",
    address: "高雄市左營區高鐵路123號10樓",
    category: "同人",
    image: "/placeholder.svg",
    externalUrl: "https://example.com"
  },
  {
    id: 2,
    name: "【CWT-T34】(台中場)",
    date: "2025年9月13日/14日",
    location: "臺中世界貿易中心二館",
    address: "台中市西屯區天保街60號",
    category: "同人",
    image: "/placeholder.svg",
    externalUrl: "https://example.com"
  },
  {
    id: 3,
    name: "創意設計工作坊",
    date: "2025年9月20日",
    location: "台北文創大樓",
    address: "台北市信義區菸廠路88號",
    category: "工作坊",
    image: "/placeholder.svg",
    externalUrl: "https://example.com"
  },
  {
    id: 4,
    name: "週末創作市集",
    date: "2025年9月21日-22日",
    location: "華山1914文化創意產業園區",
    address: "台北市中正區八德路一段1號",
    category: "市集",
    image: "/placeholder.svg",
    externalUrl: "https://example.com"
  }
];

const categories = [
  { id: "all", label: "全部", active: true },
  { id: "doujin", label: "同人", active: false },
  { id: "market", label: "市集", active: false },
  { id: "exhibition", label: "展覽", active: false },
  { id: "course", label: "課程", active: false },
  { id: "party", label: "派對", active: false },
  { id: "music", label: "音樂", active: false },
  { id: "workshop", label: "工作坊", active: false },
  { id: "other", label: "其他", active: false }
];

const timeFilters = [
  { id: "all", label: "全部日期", active: true },
  { id: "today", label: "今天", active: false },
  { id: "weekend", label: "本週末", active: false },
  { id: "week", label: "7天內", active: false },
  { id: "month", label: "30天內", active: false }
];

export default function Events() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTime, setSelectedTime] = useState("all");

  const handleCategoryFilter = (filterId: string) => {
    setSelectedCategory(filterId);
  };

  const handleTimeFilter = (filterId: string) => {
    setSelectedTime(filterId);
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        breadcrumb={{
          category: "活動",
          page: "活動列表"
        }}
      />

      <div className="space-y-6 p-6">
        {/* Banner Carousel */}
        <div className="relative">
          <Carousel className="w-full max-w-full">
            <CarouselContent>
              {bannerData.map((banner) => (
                <CarouselItem key={banner.id}>
                  <Card className="border-0">
                    <CardContent className="p-0">
                      <div className={`${banner.color} rounded-lg p-8 text-white relative overflow-hidden h-48`}>
                        <div className="relative z-10">
                          <h2 className="text-3xl font-bold mb-2">{banner.title}</h2>
                          <p className="text-lg opacity-90">{banner.subtitle}</p>
                        </div>
                        <div className="absolute inset-0 bg-black/10"></div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>

        {/* 篩選器 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">篩選</h3>
          
          {/* 類別篩選 */}
          <div>
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">類別</h4>
            <FilterButtons
              filters={categories.map(cat => ({
                id: cat.id,
                label: cat.label,
                active: selectedCategory === cat.id
              }))}
              onFilterClick={handleCategoryFilter}
            />
          </div>

          {/* 時間篩選 */}
          <div>
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">時間</h4>
            <FilterButtons
              filters={timeFilters.map(time => ({
                id: time.id,
                label: time.label,
                active: selectedTime === time.id
              }))}
              onFilterClick={handleTimeFilter}
            />
          </div>
        </div>

        {/* 近日活動 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">近日活動</h3>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {eventsData.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  {/* 活動圖片 */}
                  <div className="relative h-48 bg-muted">
                    <img 
                      src={event.image} 
                      alt={event.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge 
                      variant="secondary" 
                      className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm"
                    >
                      {event.category}
                    </Badge>
                  </div>
                  
                  {/* 活動資訊 */}
                  <div className="p-4 space-y-3">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-lg leading-tight line-clamp-2">{event.name}</h4>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span>{event.date}</span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-start text-sm">
                          <MapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium line-clamp-1">{event.location}</div>
                            <div className="text-muted-foreground line-clamp-1">{event.address}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(event.externalUrl, '_blank')}
                      className="w-full flex items-center justify-center gap-1"
                    >
                      <span>了解詳情</span>
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}