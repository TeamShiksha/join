export const getBookSchema = {
  querystring: {
    type: "object",
    properties: {
      genre: { type: "string" },
    },
    additionalProperties: false,
  },
};

export const createBookSchema = {
  body: {
    type: "object",
    required: [
      "title",
      "author",
      "publicationYear",
      "genre",
      "rating",
      "description",
      "metadata",
    ], // ✅ Removed "id"
    properties: {
      title: { type: "string" },
      author: { type: "string" },
      publicationYear: { type: "number" },
      genre: { type: "string" },
      rating: { type: "number" },
      description: { type: "string" },
      metadata: {
        type: "object",
        properties: {
          pages: { type: "number" },
          stockLeft: { type: "number" },
          price: { type: "number" },
          discount: { type: "number" },
          edition: { type: "number" },
        },
        required: ["pages", "stockLeft", "price", "discount", "edition"],
      },
    },
  },
};

export const updateBookRatingSchema = {
  body: {
    type: "object",
    required: ["rating"],
    properties: {
      rating: { type: "number", minimum: 0, maximum: 5 },
    },
  },
};
