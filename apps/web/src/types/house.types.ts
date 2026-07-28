export type HouseOccupancyStatus = 'dihuni' | 'tidak_dihuni';

export interface ActiveResidentRef {
  id: number;
  full_name: string;
  resident_status: string;
  since: string;
}

export interface House {
  id: number;
  house_number: string;
  occupancy_status: HouseOccupancyStatus;
  created_at?: string;
  updated_at?: string;
}

export interface HouseDetail extends House {
  active_resident: ActiveResidentRef | null;
}

export interface OccupancyRecord {
  id: number;
  house: {
    id: number;
    house_number: string;
  };
  resident: {
    id: number;
    full_name: string;
  };
  start_date: string;
  end_date: string | null;
  created_at?: string;
}

export interface HouseFilterParams {
  search?: string;
  occupancy_status?: HouseOccupancyStatus;
  sort?: string;
  page?: number;
  per_page?: number;
}
