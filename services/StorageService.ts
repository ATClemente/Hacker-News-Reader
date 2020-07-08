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