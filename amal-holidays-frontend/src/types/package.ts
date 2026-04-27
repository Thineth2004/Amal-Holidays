export interface Package {
    pkg: {
        package_id: number;
        title: string;
        description: string;
        destination_name: string;
        price: number;
        duration: number;
        available_slots: number;
        capacity: number;
        start_date: Date;
        end_date: Date;
    }
}