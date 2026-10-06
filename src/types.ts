export const JAVA_VERSIONS = [
  '1.16', '1.16.1', '1.16.2', '1.16.3', '1.16.4', '1.16.5',
  '1.17', '1.18', '1.19', '1.20',
  '1.21', '1.21.1', '1.21.2', '1.21.3', '1.21.4', '1.21.5', '1.21.6', '1.21.7', '1.21.8', '1.21.9', '1.21.10', '1.21.11',
  '26.1', '26.1.1', '26.1.2', '26.2', '26.3'
];

export const BEDROCK_VERSIONS = [
  '1.16.0', '1.16.20', '1.16.40', '1.16.100', '1.16.200', '1.16.220',
  '1.17.0', '1.18.0', '1.19.0', '1.20.0',
  '1.21.0', '1.21.10', '1.21.20', '1.21.30', '1.21.40', '1.21.50', '1.21.60', '1.21.70', '1.21.80', '1.21.90', '1.21.100', '1.21.110',
  '26.0', '26.10', '26.20', '26.30', '26.50'
];

export interface ProjectVersion {
  id: string;
  version: string;
  loader: string;
  game: string;
  date: string;
}

export interface ProjectFile {
  id: string;
  fileName: string;
  title: string;
  fileSize?: number;
  fileData?: string;
  versions?: string[]; // Selected Java / Bedrock versions
  description?: string;
  youtubeUrl?: string;
  bugReportUrl?: string;
  isPremium?: boolean;
  price?: number;
  workingEnvironment?: 'Client side only' | 'Server only' | 'Both';
  versionName?: string;
  uploadDate?: string;
}

export interface ProjectChangelog {
  id: string;
  version: string;
  date: string;
  text: string;
}

export interface Project {
  id: string;
  title: string;
  type: 'Shaders' | 'Mods' | 'Modpacks' | 'Resource Packs' | 'Addons';
  description: string;
  thumbnail: string;
  bannerUrl?: string;
  screenshots?: string[]; // Unlimited screenshots/pictures
  showDescInBanner?: boolean;
  releaseDate: string;
  tags: string[]; // Limited to max 4 tags
  versions: ProjectVersion[];
  files?: ProjectFile[];
  gallery?: string[];
  downloads: number;
  rating: number; // Star rating (starts at 0.0)
  ratingCount: number; // Number of ratings (starts at 0)
  userRatings?: Record<string, number>;
  changelog?: ProjectChangelog[];
  minecraftVersionText?: string;
  workingEnvironment?: 'Client side only' | 'Server only' | 'Both';
  fileName?: string;
  fileData?: string;
  fileSize?: number;
  youtubeUrl?: string; // Project trailer video link
  bugReportUrl?: string; // Project bugs report clickable working link
  isPremium?: boolean;
  price?: number;
}

export interface TrailerConfig {
  title: string;
  youtubeUrl: string;
  description: string;
  channelUrl: string;
}

export interface CreatorProfile {
  name: string;
  gamerTag: string;
  title: string;
  bio: string;
  avatarUrl: string;
  youtubeUrl: string;
  discordUrl: string;
  twitterUrl: string;
  facebookUrl: string;
  redditUrl: string;
}

export interface UserAuth {
  name: string;
  email: string;
  profileImage?: string | null;
  joinedAt?: string;
  isCreator?: boolean;
}
