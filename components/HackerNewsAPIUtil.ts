import axios from 'axios';
import URLS from '../constants/Urls';

export async function getTopStories(){

    let endPointURl = URLS.HN_API + "/topstories.json"

    try{
        let topStories = await axios({
            method: 'get',
            url: endPointURl
        });
        return topStories.data;
    }
    catch(e){
        console.log(e);
    }


};

export async function getBestStories(){
    let endPointURl = URLS.HN_API + "/beststories.json"

    try{
        let topStories = await axios({
            method: 'get',
            url: endPointURl
        });
        return topStories.data;
    }
    catch(e){
        console.log(e);
    }
};

export async function getItem(id: number){
    let endPointURl = URLS.HN_API + "/item/" + id.toString() + ".json";

    try{
        let itemData = await axios({
            method: 'get',
            url: endPointURl
        });
        return itemData.data;
    }
    catch(e){
        console.log(e);
    }
}