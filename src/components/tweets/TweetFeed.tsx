
import React, { useState } from 'react';
import { Tweet } from './TweetCard';
import TweetCard from './TweetCard';
import TweetDialog from './TweetDialog';
import TweetFilters from './TweetFilters';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

interface TweetFeedProps {
  tweets: Tweet[];
  totalTweets: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onFilterChange: (filters: any) => void;
}

const TweetFeed: React.FC<TweetFeedProps> = ({ 
  tweets, 
  totalTweets,
  currentPage,
  totalPages,
  onPageChange,
  onFilterChange
}) => {
  const [selectedTweet, setSelectedTweet] = useState<Tweet | null>(null);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">التغريدات ({totalTweets.toLocaleString()})</h3>
      </div>
      
      <TweetFilters onFilterChange={onFilterChange} />
      
      <div className="space-y-4">
        {tweets.map(tweet => (
          <TweetCard 
            key={tweet.id} 
            tweet={tweet} 
            onClick={setSelectedTweet}
          />
        ))}
      </div>
      
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) onPageChange(currentPage - 1);
              }}
              className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum: number;
            
            // Handle cases with many pages
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else {
              if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
            }
            
            return (
              <PaginationItem key={pageNum}>
                <PaginationLink 
                  href="#" 
                  isActive={currentPage === pageNum}
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(pageNum);
                  }}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          
          <PaginationItem>
            <PaginationNext 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) onPageChange(currentPage + 1);
              }}
              className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      
      <TweetDialog 
        tweet={selectedTweet} 
        isOpen={selectedTweet !== null}
        onClose={() => setSelectedTweet(null)}
      />
    </div>
  );
};

export default TweetFeed;
