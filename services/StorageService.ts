import AsyncStorage from '@react-native-community/async-storage';

//Storage Keys: 
const READ_ITEMS_KEY = 'readItems';
const HIDDEN_ITEMS_KEY = 'hiddenItems';
const SAVED_ITEMS_KEY = 'savedItems'; 
//


//Read item data
export async function getReadItems(): Promise<number[]>{
  try {
      const value = await AsyncStorage.getItem(READ_ITEMS_KEY);
      if(value !== null) {
        return JSON.parse(value);
      }
      return [];
  } catch(e) {
    // error reading value
    return[];
  }
}

export async function addReadItem(itemId: number): Promise<void>{
  let readItems = await getReadItems();
  if(!readItems.includes(itemId)){
      readItems.push(itemId);
      AsyncStorage.setItem(READ_ITEMS_KEY, JSON.stringify(readItems));
  }
}

export async function removeReadItem(itemId: number): Promise<void>{
  let readItems = await getReadItems();
  let indexToRemove = readItems.indexOf(itemId);
  if(indexToRemove > -1){
    readItems.splice(indexToRemove, 1);
    AsyncStorage.setItem(READ_ITEMS_KEY, JSON.stringify(readItems));
  }
}

export async function clearReadItems(){
  AsyncStorage.removeItem(READ_ITEMS_KEY);
}


//Hidden Item data
export async function getHiddenItems(): Promise<number[]>{
  try {
      const value = await AsyncStorage.getItem(HIDDEN_ITEMS_KEY);
      if(value !== null) {
        return JSON.parse(value);
      }
      return [];
  } catch(e) {
    // error reading value
    return[];
  }
}

export async function addHiddenItem(itemId: number): Promise<void>{
  let hiddenItems = await getHiddenItems();
  if(!hiddenItems.includes(itemId)){
    hiddenItems.push(itemId);
    AsyncStorage.setItem(HIDDEN_ITEMS_KEY, JSON.stringify(hiddenItems));
  }
}

export async function clearHiddenItems(){
  AsyncStorage.removeItem(HIDDEN_ITEMS_KEY);
}


//Saved Item data
export async function getSavedItems(): Promise<number[]>{
  try {
    const value = await AsyncStorage.getItem(SAVED_ITEMS_KEY);
    if(value !== null) {
      return JSON.parse(value);
    }
    return [];
  } catch(e) {
    // error reading value
    return[];
  }
}

export async function addSavedItem(itemId: number): Promise<void>{
  let savedItems = await getSavedItems();
  if(!savedItems.includes(itemId)){
    savedItems.push(itemId);
    AsyncStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify(savedItems));
  }
}

export async function removeSaveItem(itemId: number): Promise<void>{
  let savedItems = await getSavedItems();
  let indexToRemove = savedItems.indexOf(itemId);
  if(indexToRemove > -1){
    savedItems.splice(indexToRemove, 1);
    AsyncStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify(savedItems));
  }
}

export async function clearSavedItems(){
  AsyncStorage.removeItem(SAVED_ITEMS_KEY);
}


export async function clearAllData(){
  AsyncStorage.clear();
}