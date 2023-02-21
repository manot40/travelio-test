declare global {
  var mongoose: {
    promise: Promise<import('mongoose')> | null;
    conn: Awaited<import('mongoose')> | null;
  };
}

type Res<T = {}> = {
  success: boolean;
  result: T[];
  totalItems?: number;
  totalPage?: number;
};

type GoogleAPIRes<T = {}> = {
  kind: string;
  totalItems: number;
  items: T[];
};

type Favorite = {
  _id: string;
  title: string;
  authors: string[];
  publisher: string;
  publishedDate: Date;
  description: string;
  ratingsCount: number;
  averageRating: number;
  image: string;
};

type VolumeInfo = {
  title: string;
  authors: string[];
  publisher: string;
  publishedDate: string;
  description: string;
  ratingsCount: number;
  averageRating: number;
  canonicalVolumeLink: string;
  imageLinks: {
    smallThumbnail: string;
    thumbnail: string;
  };
};

type Book = {
  id: string;
  kind: string;
  volumeInfo: VolumeInfo;
};
