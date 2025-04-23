
import React, { useState } from 'react';
import { Filter, Download, Share2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const ActionButtons = () => {
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  
  const exportFormats = [
    { id: 'pdf', name: 'PDF', icon: '📄' },
    { id: 'excel', name: 'Excel', icon: '📊' },
    { id: 'image', name: 'صورة', icon: '🖼️' },
  ];

  const shareOptions = [
    { id: 'twitter', name: 'تويتر', icon: '𝕏' },
    { id: 'whatsapp', name: 'واتساب', icon: '📱' },
    { id: 'email', name: 'البريد الإلكتروني', icon: '✉️' },
  ];
  
  return (
    <div className="flex flex-wrap justify-between items-center mb-6">
      <div className="flex space-x-2 rtl:space-x-reverse mb-4 sm:mb-0">
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          تصفية النتائج
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "hidden sm:flex items-center gap-2",
                !date && "text-muted-foreground"
              )}
            >
              <Calendar className="h-4 w-4" />
              {date ? format(date, "PPP", { locale: arSA }) : "اختر التاريخ"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex space-x-2 rtl:space-x-reverse">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => setExportDialogOpen(true)}
        >
          <Download className="h-4 w-4" />
          تحميل التقرير
        </Button>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => setShareDialogOpen(true)}
        >
          <Share2 className="h-4 w-4" />
          مشاركة
        </Button>
      </div>
      
      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">اختر صيغة التحميل</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-4">
            {exportFormats.map((format) => (
              <Button
                key={format.id}
                variant="outline"
                className="h-24 flex flex-col items-center justify-center gap-2"
                onClick={() => setExportDialogOpen(false)}
              >
                <span className="text-2xl">{format.icon}</span>
                <span>{format.name}</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">مشاركة التحليل</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-4">
            {shareOptions.map((option) => (
              <Button
                key={option.id}
                variant="outline"
                className="h-24 flex flex-col items-center justify-center gap-2"
                onClick={() => setShareDialogOpen(false)}
              >
                <span className="text-2xl">{option.icon}</span>
                <span>{option.name}</span>
              </Button>
            ))}
          </div>
          <DialogFooter className="flex-col sm:flex-col gap-2">
            <div className="relative w-full">
              <input
                className="w-full p-2 pr-24 border rounded-md"
                value="https://futvi.com/share/analysis-123"
                readOnly
              />
              <Button
                className="absolute right-1 top-1"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText("https://futvi.com/share/analysis-123");
                }}
              >
                نسخ الرابط
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActionButtons;
