import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import { AddonContext } from '@/features/addon/providers/AddonContext.ts';
import { appSettingsAtom } from '@/atoms/app-settings.ts';
import { useAtomValue } from 'jotai';
import { getStreamUrl } from '@/utils/stremio';
import { useStyletron } from 'baseui';
import {
  isDASHProvider,
  MediaPlayer,
  MediaPlayerInstance,
  MediaProvider,
  MediaProviderAdapter,
  MediaSrc,
  Poster,
} from '@vidstack/react';
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default';
import { Button } from 'baseui/button';
import { ArrowLeft } from 'lucide-react';
import DASH from 'dashjs';

export default function PlayerPage() {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const plugin = searchParams.get('plugin');
  const url = searchParams.get('url');
  const id = searchParams.get('id');
  const type = searchParams.get('type');

  const addons = useContext(AddonContext);
  const suppliedAddon = addons.find((res) => res.config.id === plugin);

  const [css, $theme] = useStyletron();

  useEffect(() => {
    if (!plugin || !url || !id || !type) {
      navigate('/');
    }
  }, [id, navigate, plugin, suppliedAddon, type, url]);

  const appSettings = useAtomValue(appSettingsAtom);

  const [state, setState] = useState<{
    urls: string[];
  }>({
    urls: [],
  });

  useEffect(() => {
    const isHackEnable = appSettings.addons.find(
      (res) => res.url === suppliedAddon?.installUrl,
    );

    if (isHackEnable?.hack?.enable) {
      if (url) {
        getStreamUrl(isHackEnable.hack.realDebridApiKey, url)
          .then((docs) => {
            if (!docs) {
              return null;
            }

            const sortedUrls = docs.sort((a, b) => {
              const extA = a.split('.').pop();
              const extB = b.split('.').pop();
              return sortOrder[extA as never] - sortOrder[extB as never];
            });

            setState({
              urls: sortedUrls,
            });
          })
          .catch((e: unknown) => {
            console.error(e);
          });
      }
    } else {
      if (url) {
        setState({
          urls: [url],
        });
      }
    }
  }, [appSettings.addons, id, suppliedAddon?.installUrl, type, url]);

  const ref = useRef<MediaPlayerInstance>(null);

  const [seekTime, setSeekTime] = useState(0);

  return (
    <div
      className={css({
        backgroundColor: $theme.colors.backgroundPrimary,
        fontFamily: $theme.typography.font450.fontFamily,
        color: $theme.colors.primaryA,
      })}
    >
      <div
        className={css({
          top: 0,
          left: 0,
          padding: '12px',
          zIndex: 1,
          position: 'fixed',
        })}
      >
        <Button kind="secondary" shape="circle" $as={Link} to="/">
          <ArrowLeft />
        </Button>
      </div>
      <MediaPlayer
        ref={ref}
        onSeeking={(ev) => {
          const t = Math.floor(ev);
          setSeekTime(t);
        }}
        className={css({
          height: '100vh',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: $theme.colors.backgroundPrimary,
        })}
        viewType="video"
        streamType="on-demand"
        crossOrigin
        playsInline
        onProviderSetup={onProviderSetup}
        autoPlay={true}
        onProviderChange={onProviderChange}
        src={
          state.urls.map((res) => {
            if (res.endsWith('.m3u8')) {
              return {
                src: res,
                type: 'application/vnd.apple.mpegurl',
              };
            }

            if (res.endsWith('.mpd')) {
              return {
                src: res + '?t=' + seekTime.toString(),
                type: 'application/dash+xml',
              };
            }

            if (res.endsWith('.mp4')) {
              return {
                src: res,
                type: 'video/mp4',
              };
            }

            if (res.endsWith('.webm')) {
              return {
                src: res,
                type: 'video/webm',
              };
            }

            return { src: res, type: '' };
          }) as MediaSrc[]
        }
      >
        <MediaProvider>
          <Poster
            className="vds-poster"
            src={`https://images.metahub.space/background/medium/${id}/img`}
          />
        </MediaProvider>
        <DefaultVideoLayout icons={defaultLayoutIcons} />
      </MediaPlayer>
    </div>
  );
}

function onProviderChange(provider: MediaProviderAdapter | null) {
  if (isDASHProvider(provider)) {
    provider.library = DASH;
  }
}

function onProviderSetup(provider: MediaProviderAdapter) {
  if (isDASHProvider(provider)) {
    console.log(provider.ctor); // `dashjs` constructor
    console.log(provider.instance); // `dashjs` instance
  }
}
const sortOrder: Record<string, number> = {
  mpd: 0,
  m3u8: 1,
  webm: 2,
  mp4: 3,
};
