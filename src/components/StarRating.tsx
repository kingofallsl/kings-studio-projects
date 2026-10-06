import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number; // e.g. 0.0 or 4.5
  ratingCount: number; // e.g. 0 or 1
  userRating?: number; // what the current user voted (1 to 5)
  onRate?: (star: number) => void;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  interactive?: boolean;
  isWood?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating = 0,
  ratingCount = 0,
  userRating,
  onRate,
  size = 'md',
  showDetails = true,
  interactive = true,
  isWood = false,
}) => {
  const [hoverStar, setHoverStar] = useState<number | null>(null);

  // Format rating: strictly 0.0 if rating is 0 or NaN
  const displayRating = typeof rating === 'number' && !isNaN(rating) && rating > 0
    ? rating.toFixed(1)
    : '0.0';

  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  const starScore = hoverStar !== null ? hoverStar : rating;

  const getStarRatingLabel = (star: number) => {
    switch (star) {
      case 1: return '1 Star - Needs Work';
      case 2: return '2 Stars - Decent';
      case 3: return '3 Stars - Good';
      case 4: return '4 Stars - Great';
      case 5: return '5 Stars - Masterpiece!';
      default: return '';
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* 5-star interactive buttons */}
      <div
        className="flex items-center gap-1"
        onMouseLeave={() => setHoverStar(null)}
      >
        {[1, 2, 3, 4, 5].map((starIndex) => {
          // Fill logic:
          const isFilled = starScore >= starIndex;
          const isPartiallyFilled = !isFilled && starScore > starIndex - 1 && starScore < starIndex;
          const isUserVote = userRating === starIndex;

          return (
            <button
              key={starIndex}
              type="button"
              disabled={!interactive || !onRate}
              onClick={(e) => {
                e.stopPropagation();
                if (interactive && onRate) {
                  onRate(starIndex);
                }
              }}
              onMouseEnter={() => interactive && onRate && setHoverStar(starIndex)}
              className={`transition-all duration-150 relative ${
                interactive && onRate
                  ? 'cursor-pointer hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-sm'
                  : 'cursor-default'
              }`}
              title={interactive && onRate ? `Rate ${starIndex} Star${starIndex > 1 ? 's' : ''}` : `${displayRating} / 5.0`}
              aria-label={`Rate ${starIndex} out of 5 stars`}
            >
              <Star
                className={`${starSizes[size]} transition-colors ${
                  isFilled
                    ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                    : isPartiallyFilled
                    ? 'fill-amber-400/60 text-amber-400'
                    : isWood
                    ? 'text-[#7a4624]/40 hover:text-amber-400'
                    : 'text-zinc-600 hover:text-amber-400/80'
                }`}
              />
              {isUserVote && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Numeric Score and Count */}
      {showDetails && (
        <div className="flex items-center gap-1.5 text-xs font-mono tabular-nums">
          <span className="font-bold text-amber-400 text-sm tracking-tight">
            {displayRating}
          </span>
          <span className={`${isWood ? 'text-[#874b24]' : 'text-zinc-400'} text-[11px]`}>
            / 5.0
          </span>
          <span className={`text-[11px] ${isWood ? 'text-[#7a4624]' : 'text-zinc-400'}`}>
            ({ratingCount} {ratingCount === 1 ? 'rating' : 'ratings'})
          </span>

          {userRating && (
            <span className="ml-1 text-[10px] font-sans px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 font-semibold">
              You voted: {userRating}★
            </span>
          )}

          {hoverStar !== null && interactive && onRate && (
            <span className="ml-1 text-[11px] font-sans text-amber-300 animate-fade-in font-medium">
              • {getStarRatingLabel(hoverStar)}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
