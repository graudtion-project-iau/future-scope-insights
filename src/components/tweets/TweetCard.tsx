import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { Tweet } from '@/types/search';

const TweetCard: React.FC<{ tweet: Tweet }> = ({ tweet }) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" gap={2}>
          <Avatar
            src={tweet.user.profileImage}
            alt={tweet.user.name}
            sx={{ width: 48, height: 48 }}
          />
          <Box flex={1}>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="subtitle1" fontWeight="bold">
                {tweet.user.name}
              </Typography>
              {tweet.user.verified && (
                <Typography color="primary" component="span">
                  ✓
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary">
                @{tweet.user.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                · {formatDistanceToNow(new Date(tweet.date), { addSuffix: true })}
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ mt: 1 }}>
              {tweet.text}
            </Typography>

            {tweet.media && tweet.media.length > 0 && (
              <Box display="grid" gap={1} sx={{ mt: 2 }}>
                {tweet.media.map((media, index) => (
                  <Box key={index} sx={{ width: '100%', height: 200, overflow: 'hidden', borderRadius: 1 }}>
                    {media.type === 'image' ? (
                      <img
                        src={media.url}
                        alt={`Media ${index + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : media.type === 'video' ? (
                      <video
                        src={media.url}
                        controls
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : null}
                  </Box>
                ))}
              </Box>
            )}

            <Box display="flex" gap={3} mt={2}>
              <Typography variant="body2" color="text.secondary">
                {formatNumber(tweet.replies)} Replies
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatNumber(tweet.retweets)} Retweets
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatNumber(tweet.likes)} Likes
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TweetCard;
