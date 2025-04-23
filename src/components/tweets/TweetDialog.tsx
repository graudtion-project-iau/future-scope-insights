
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageSquare, Repeat, Share, X } from 'lucide-react';
import { Tweet } from './TweetCard';
import { Button } from '@/components/ui/button';

interface TweetDialogProps {
  tweet: Tweet | null;
  isOpen: boolean;
  onClose: () => void;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

const getSentimentColor = (sentiment: string): string => {
  switch (sentiment) {
    case 'positive':
      return 'bg-green-100 text-green-800';
    case 'negative':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-yellow-100 text-yellow-800';
  }
};

const TweetDialog: React.FC<TweetDialogProps> = ({ tweet, isOpen, onClose }) => {
  if (!tweet) return null;

  const formattedDate = formatDistanceToNow(new Date(tweet.date), {
    addSuffix: true,
    locale: arSA
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-left rtl:text-right">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Avatar className="h-12 w-12 border">
                <AvatarImage src={tweet.user.profileImage} alt={tweet.user.name} />
                <AvatarFallback>{tweet.user.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              
              <div>
                <div className="flex items-center gap-1">
                  <DialogTitle className="text-base">{tweet.user.name}</DialogTitle>
                  {tweet.user.verified && (
                    <span className="text-blue-500">
                      <svg className="h-4 w-4 inline" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                      </svg>
                    </span>
                  )}
                </div>
                <DialogDescription className="mt-0">{tweet.user.username}</DialogDescription>
              </div>
            </div>
            
            <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0" onClick={onClose}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-base whitespace-pre-wrap">{tweet.text}</p>
          
          {tweet.media && tweet.media.length > 0 && (
            <div className={`grid gap-2 ${tweet.media.length > 1 ? 'grid-cols-2' : ''}`}>
              {tweet.media.map((media, index) => (
                <div key={index} className="rounded-md overflow-hidden bg-gray-100 aspect-video">
                  {media.type === 'image' ? (
                    <img 
                      src={media.url} 
                      alt="Tweet media" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video 
                      src={media.url} 
                      controls
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
          
          <div className="text-sm text-gray-500">
            {new Date(tweet.date).toLocaleString('ar-SA')} · {formattedDate}
          </div>
          
          <div className="py-2 border-y flex items-center gap-2">
            <Badge className={`${getSentimentColor(tweet.sentiment)} font-normal`}>
              {tweet.sentiment === 'positive' ? 'إيجابي' : 
               tweet.sentiment === 'negative' ? 'سلبي' : 'محايد'}
            </Badge>
            
            <span className="text-sm text-gray-500">
              {tweet.user.followers.toLocaleString()} متابع
            </span>
          </div>
          
          <div className="flex items-center justify-between py-1 text-gray-500">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <span>{formatNumber(tweet.replies)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Repeat className="h-5 w-5" />
              <span>{formatNumber(tweet.retweets + tweet.quotes)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              <span>{formatNumber(tweet.likes)}</span>
            </div>
            
            <div>
              <Share className="h-5 w-5" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TweetDialog;
