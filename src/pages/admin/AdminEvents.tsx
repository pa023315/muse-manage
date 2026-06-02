import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/common/PageHeader";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  event_type: string | null;
  capacity: number | null;
  current_registrations: number;
  is_active: boolean;
}

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_date: "",
    location: "",
    event_type: "",
    capacity: "",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "載入失敗",
        description: "無法載入活動列表",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const eventData = {
        title: formData.title,
        description: formData.description || null,
        event_date: formData.event_date,
        location: formData.location || null,
        event_type: formData.event_type || null,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
      };

      if (editingEvent) {
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', editingEvent.id);

        if (error) throw error;

        toast({
          title: "更新成功",
          description: "活動已更新"
        });
      } else {
        const { error } = await supabase
          .from('events')
          .insert([eventData]);

        if (error) throw error;

        toast({
          title: "新增成功",
          description: "活動已新增"
        });
      }

      setDialogOpen(false);
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: "操作失敗",
        description: "無法儲存活動",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || "",
      event_date: event.event_date,
      location: event.location || "",
      event_type: event.event_type || "",
      capacity: event.capacity?.toString() || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除此活動嗎？')) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "刪除成功",
        description: "活動已刪除"
      });

      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "刪除失敗",
        description: "無法刪除活動",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      event_date: "",
      location: "",
      event_type: "",
      capacity: "",
    });
    setEditingEvent(null);
  };

  return (
    <div className="flex-1 bg-background text-foreground">
      <PageHeader
        breadcrumb={{
          category: "後台管理",
          page: "活動管理"
        }}
        title="活動管理"
        description="新增與編輯系統活動"
        primaryAction={{
          label: "新增活動",
          onClick: () => {
            resetForm();
            setDialogOpen(true);
          }
        }}
      />

      <div className="p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg">{event.title}</h3>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(event)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(event.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
              <div className="text-sm space-y-1">
                <p><span className="font-medium">日期：</span>{format(new Date(event.event_date), 'yyyy-MM-dd')}</p>
                {event.location && <p><span className="font-medium">地點：</span>{event.location}</p>}
                {event.event_type && <p><span className="font-medium">類型：</span>{event.event_type}</p>}
                {event.capacity && (
                  <p><span className="font-medium">容量：</span>{event.current_registrations}/{event.capacity}</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingEvent ? '編輯活動' : '新增活動'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">活動名稱 *</Label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="description">活動描述</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="event_date">活動日期 *</Label>
              <Input
                id="event_date"
                type="date"
                required
                value={formData.event_date}
                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="location">地點</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="event_type">活動類型</Label>
              <Input
                id="event_type"
                value={formData.event_type}
                onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="capacity">容量人數</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                取消
              </Button>
              <Button type="submit">
                {editingEvent ? '更新' : '新增'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
