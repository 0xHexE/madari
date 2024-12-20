import { atomWithStorage } from 'jotai/utils';

interface GeneralSettings {
  performance: boolean;
  language: string;
  noAnimation: boolean;
}

interface PlayerSettings {
  defaultSubtitlesLanguage: string;
  defaultSubtitlesSize: number;
  subtitlesColor: string;
  subtitlesBackgroundColor: string;
  subtitlesOutlineColor: string;
  defaultAudioLanguage: string;
  fileExtensionPreference: string[];
}

interface AudioSettings {
  defaultAudioTrack: string;
  surroundSound: boolean;
}

export const generalSettingsAtom = atomWithStorage<GeneralSettings>(
  'general_settings',
  {
    performance: false,
    language: 'en',
    noAnimation: false,
  },
);

export const playerSettingsAtom = atomWithStorage<PlayerSettings>(
  'player_settings',
  {
    defaultSubtitlesLanguage: 'eng',
    defaultSubtitlesSize: 100,
    subtitlesColor: '#FFFFFF',
    subtitlesBackgroundColor: '#000000',
    subtitlesOutlineColor: '#000000',
    defaultAudioLanguage: 'eng',
    fileExtensionPreference: [],
  },
);

export const audioSettingsAtom = atomWithStorage<AudioSettings>(
  'audio_settings',
  {
    defaultAudioTrack: 'eng',
    surroundSound: false,
  },
);
