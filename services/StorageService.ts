import AsyncStorage from '@react-native-community/async-storage';


export async function getReadItems(): Promise<number[]>{
  try {
      const value = await AsyncStorage.getItem('readItems');
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
      AsyncStorage.setItem('readItems', JSON.stringify(readItems));
  }
}

export async function clearReadItems(){
  AsyncStorage.removeItem('readItems');
}

export async function getHiddenItems(): Promise<number[]>{
  try {
      const value = await AsyncStorage.getItem('hiddenItems');
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
      AsyncStorage.setItem('hiddenItems', JSON.stringify(hiddenItems));
  }
}

export async function clearHiddenItems(){
  AsyncStorage.removeItem('hiddenItems');
}

export async function clearAllData(){
  AsyncStorage.clear();
}