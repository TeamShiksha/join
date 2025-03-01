import { z } from 'zod';

export const getAllBooksSchema = z.object({
    query: z.object({
        genre: z.string()
            .min(1, 'Genre must not be empty')
            .optional()
    })
});

export const getBookByIdSchema = z.object({
    params: z.object({
        id: z.string()
            .min(1, 'Book ID is required')
    })
});

const metadataSchema = z.record(
    z.string(),
    z.number({
        required_error: "Metadata value must be a number",
        invalid_type_error: "Metadata value must be a number"
    })
);

export const addBookSchema = z.object({
    body: z.object({
        title: z.string()
            .min(1, 'Title is required')
            .max(100, 'Title must be less than 100 characters'),
        author: z.string()
            .min(1, 'Author is required')
            .max(50, 'Author name must be less than 50 characters'),
        publicationYear: z.number()
            .int('Publication year must be an integer')
            .min(1000, 'Publication year must be after 1000'),
        genre: z.string()
            .min(1, 'Genre is required')
            .max(50, 'Genre must be less than 50 characters'),
        rating: z.number()
            .min(0, 'Rating must be at least 0')
            .max(5, 'Rating must not exceed 5'),
        description: z.string()
            .min(1, 'Description is required')
            .max(1000, 'Description must be less than 1000 characters'),
        metadata: metadataSchema
    })
});

export const updateRatingSchema = z.object({
    params: z.object({
        id: z.string()
            .min(1, 'Book ID is required')
    }),
    body: z.object({
        rating: z.number()
            .min(0, 'Rating must be at least 0')
            .max(5, 'Rating must not exceed 5')
    })
});

export const getStatisticsSchema = z.object({
    query: z.object({}).strict(),
    params: z.object({}).strict(),
    body: z.object({}).strict()
});

const operatorEnum = z.enum(['>', '<', '==', '>=', '<=']);
const searchOperatorEnum = z.enum(['AND', 'OR']);

export const searchBooksSchema = z.object({
    query: z.object({
        operator: searchOperatorEnum,
    }),
    body: z.object({
        filters: z.array(z.object({
            field: z.string().min(1, 'Field name is required'),
            operator: operatorEnum,
            value: z.number({
                required_error: "Value is required",
                invalid_type_error: "Value must be a number"
            })
        })).min(1, 'At least one filter is required')
    })
});