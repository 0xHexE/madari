import { forwardRef, useEffect, useMemo, useState } from 'react';
import { useStyletron } from 'baseui';
import { useAtom } from 'jotai';
import { activeTitle } from '@/features/listing/atoms/active-title.ts';
import { MovieInfo } from '@/features/addon/service/Addon.tsx';

const SimpleMovieCard = forwardRef<
  HTMLDivElement,
  {
    data: MovieInfo;
    listId: string;
    index: number;
    height: number;
    width: number;
  }
>(({ data, listId, index, height, width }, ref) => {
  const [css, theme] = useStyletron();
  const [active, setActiveCard] = useAtom(activeTitle);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isImageError, setIsImageError] = useState(false);

  const isActive = useMemo(() => {
    return active?.index === index && active.categoryId === listId;
  }, [index, listId, active?.categoryId, active?.index]);

  useEffect(() => {
    if (!isActive) {
      return;
    }
  }, [isActive, ref]);

  const posterUrl = `https://images.metahub.space/poster/medium/${data.imdb_id}/img`;

  const shimmerStyles = css({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.backgroundTertiary,
    transform: 'translateZ(0)', // Force GPU acceleration
    willChange: 'background-position', // Optimize for animation
    ':before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      right: 0,
      bottom: 0,
      background: `linear-gradient(
        90deg,
        transparent 0%,
        ${theme.colors.backgroundSecondary}40 20%,
        ${theme.colors.backgroundSecondary}60 60%,
        transparent 100%
      )`,
      animation:
        'shimmerAnimation 2.5s infinite cubic-bezier(0.4, 0.0, 0.2, 1)',
    },
    '@keyframes shimmerAnimation': {
      '0%': {
        transform: 'translateX(0)',
      },
      '100%': {
        transform: 'translateX(200%)',
      },
    },
  });

  return (
    <div
      ref={ref}
      className={css({
        position: 'relative',
        flexShrink: 0,
        width: width.toString() + 'px',
        padding: '4px', // Added padding for better outline visibility
      })}
      onBlur={() => {
        setActiveCard(undefined);
      }}
      onFocus={() => {
        setActiveCard({
          index,
          categoryId: listId,
          id: data.id,
        });
      }}
      data-card-type="show-card"
      data-movie={data.id}
      data-index={index}
      data-category={listId}
    >
      <div
        className={css({
          position: 'relative',
          width: width.toString() + 'px',
          height: height.toString() + 'px',
          borderRadius: '8px',
          overflow: 'hidden',
          transition: 'all 300ms cubic-bezier(0.4, 0.0, 0.2, 1)',
          outline: isActive ? '4px solid #FFFFFF' : 'none',
          outlineOffset: '2px',
          backgroundColor: theme.colors.backgroundTertiary,
          transform: 'translateZ(0)', // Force GPU acceleration
        })}
        tabIndex={0}
      >
        {!imageLoaded && !isImageError && <div className={shimmerStyles} />}
        <img
          src={posterUrl}
          alt={data.name}
          className={css({
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 400ms cubic-bezier(0.4, 0.0, 0.2, 1)',
            transform: 'translateZ(0)', // Force GPU acceleration
            willChange: 'opacity', // Optimize for animation
          })}
          loading="lazy"
          onLoad={() => {
            setImageLoaded(true);
          }}
          onError={() => {
            setIsImageError(true);
          }}
        />
      </div>
    </div>
  );
});

export default SimpleMovieCard;