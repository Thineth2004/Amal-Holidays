import {
    createInquiryRepo,
    getAllInquiriesRepo,
    markAsReviewedRepo
} from "../repositories/inquiryRepository";

export const createInquiry = async (data: any) => {
    return await createInquiryRepo(data);
};

export const getAllInquiries = async () => {
    return await getAllInquiriesRepo();
};

export const markAsReviewed = async (id: number) => {
    return await markAsReviewedRepo(id);
};
