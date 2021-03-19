import { OnshapeInsertable } from "./models/OnshapeInsertable";
import { getOnshapeInsertablesThumbsFromApi } from './api'

export async function loadThumbs(insertables: OnshapeInsertable[]) {
    if(!thumbsSaved) {
        let thumbs = await getOnshapeInsertablesThumbsFromApi(insertables);
        saveThumbs(insertables, thumbs);
    }
}

function thumbsSaved(insertables: OnshapeInsertable[]): boolean {
    const img = localStorage.getItem(insertables[0].elementId);
    return img != null;
}

async function loadThumbsFromStorage(insertables: OnshapeInsertable[]) {

}

async function saveThumbs(insertables: OnshapeInsertable[], thumbs: OnshapeInsertable[]) {
    
}