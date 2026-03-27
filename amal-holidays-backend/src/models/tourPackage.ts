export interface TourPackage {
  package_id: number;
  title: string;
  description: string;
  price: number;
  capacity: number;
  available_slots: number;
  destination_id: number;
  start_date: Date;
  end_date: Date;
}