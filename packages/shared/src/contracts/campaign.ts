import type { CampaignType } from './enums';

export interface Campaign {
  id: string;
  name: string;
  code: string;
  type: CampaignType;
  value: number;
  minOrderAmount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  bannerId?: string;
  productIds?: string[];
  createdAt: string;
}

export interface CreateCampaignInput {
  name: string;
  code: string;
  type: CampaignType;
  value: number;
  minOrderAmount?: number;
  startDate: string;
  endDate: string;
  isActive?: boolean;
  bannerId?: string;
  productIds?: string[];
}

export type UpdateCampaignInput = Partial<CreateCampaignInput>;

export interface PolicySection {
  id: string;
  title: string;
  content: string;
  sortOrder: number;
}

export interface AboutContent {
  brandStory: string;
  mission: string;
  team: { name: string; role: string; imageUrl: string }[];
}
