import { OnshapeInsertable } from "./models/OnshapeInsertable";

export default class FavoritesService {
  static instance: any =  null;

  favIds: string[] = [];

  constructor() {
    this.favIds = JSON.parse(localStorage.getItem("FavoriteIds") ?? "[]") as string[];
  }

    /**
   * @returns {FavoritesService}
   */
  static getInstance() {
    if (FavoritesService.instance == null) {
      FavoritesService.instance = new FavoritesService();
    }
    return this.instance;
  }

  static serialId(item: OnshapeInsertable): string {
    return `${item.documentId}/${item.elementId}/${item.partId ?? ""}`;
  }

  public toggleFavorite(item: OnshapeInsertable) {
    let id: string = FavoritesService.serialId(item);
    if (this.favIds.includes(id)) {
      this.favIds = this.favIds.filter(i => { return i !== id; });
    } else {
      this.favIds.push(id);
    }
    
    localStorage.setItem("FavoriteIds", JSON.stringify(this.favIds));
  }
  
  public isInFavorites(item: OnshapeInsertable): boolean {
    let id: string = FavoritesService.serialId(item);
    return this.favIds.includes(id);
  }

  public getFavoritePartIds(): string[] {
    return this.favIds;
  }
}

