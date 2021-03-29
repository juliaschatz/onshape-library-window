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
        if(FavoritesService.instance == null) {
            FavoritesService.instance = new FavoritesService();
        }
        return this.instance;
    }

    public toggleFavorite(id: string) {
        if(this.favIds.includes(id)) {
            this.favIds = this.favIds.filter(i => { return i !== id; });
        } else {
            this.favIds.push(id);
        }
        
        localStorage.setItem("FavoriteIds", JSON.stringify(this.favIds));
    }
    
    public isInFavorites(id: string): boolean {
        return this.favIds.includes(id);
    }

    public getFavoritePartIds(): string[] {
        return this.favIds;
    }
}

