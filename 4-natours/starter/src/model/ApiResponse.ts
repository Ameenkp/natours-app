import { Tour } from './Tour';

export interface ApiResponse {
  status: string;
  results: number;
  data: {
    tours: Tour[];
  };
}
