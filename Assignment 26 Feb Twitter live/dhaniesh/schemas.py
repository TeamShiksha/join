from pydantic import BaseModel


class BookMetadata(BaseModel):
    pages: int
    stockLeft: int
    price: float
    discount: int
    edition: int


class NewBookIn(BaseModel):
    title: str
    author: str
    publicationYear: int
    genre: str
    rating: float
    description: str
    metadata: BookMetadata


class NewBookOut(NewBookIn):
    id: int
