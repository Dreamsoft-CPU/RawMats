export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  supplier: {
    id: string;
    businessName: string;
  };
  favorites: {
    id: string;
    userId: string;
  }[];
}

export interface Favorite {
  id: string;
  userId: string;
  product: Product;
}

export interface AlbumFavorite {
  id: string;
  albumId: string;
  favoriteId: string;
  favorite: Favorite;
}

export interface Album {
  id: string;
  name: string;
  userId: string;
  AlbumFavorite: AlbumFavorite[];
}

export interface AlbumAndFavoriteData {
  Album: Album[];
  Favorite: Favorite[];
}

export interface AlbumAndFavoritesListProps {
  albumAndFavoriteData: AlbumAndFavoriteData;
  userId: string;
}
