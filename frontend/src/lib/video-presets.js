export const videoPresets = {
  youtube: {
    label: 'YouTube',
    title: 'Best quality preset',
    description: 'Merges audio and video into a clean MP4 download.',
    hint: 'Best for long-form uploads and higher resolutions.'
  },
  tiktok: {
    label: 'TikTok',
    title: 'Short-form MP4 preset',
    description: 'Prioritizes a fast MP4-friendly stream for clips.',
    hint: 'Best for vertical short videos and social sharing.'
  },
  instagram: {
    label: 'Instagram',
    title: 'Reels and posts preset',
    description: 'Keeps reels and public posts in a shareable MP4 flow.',
    hint: 'Best for reels, stories, and public feed videos.'
  },
  facebook: {
    label: 'Facebook',
    title: 'Public post preset',
    description: 'Uses a general-purpose download profile for public videos.',
    hint: 'Best for open Facebook video posts.'
  },
  x: {
    label: 'X',
    title: 'Public post preset',
    description: 'Balances quality and compatibility for X videos.',
    hint: 'Best for public video posts on X.'
  },
  linkedin: {
    label: 'LinkedIn',
    title: 'Professional post preset',
    description: 'Uses a balanced MP4 profile for public LinkedIn videos.',
    hint: 'Best for public feed posts and embeds.'
  }
};

export function getVideoPreset(platform) {
  return videoPresets[platform] || videoPresets.youtube;
}
