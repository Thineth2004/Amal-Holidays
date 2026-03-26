export interface Tour {
    tour_id: number;
    title: string;
    description: string;
    price: number;
    capacity: number;
    available_seats: number;
    start_date: Date;
    end_date: Date;
    guide_id?: number;
    driver_id?: number;
    created_at?: Date;
}