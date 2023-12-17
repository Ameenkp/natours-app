import { TourDocument } from './tourModel';

export interface TourDto extends TourDocument {
  page: number;
  limit: number;
  sort: string;
  total: number;
  fields: string[];
}
