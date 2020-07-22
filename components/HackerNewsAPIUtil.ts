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
        let bestStories = await axios({
            method: 'get',
            url: endPointURl
        });
        return bestStories.data;
    }
    catch(e){
        console.log(e);
    }
};

export async function getNewStories(){
    let endPointURl = URLS.HN_API + "/newstories.json"

    try{
        let newStories = await axios({
            method: 'get',
            url: endPointURl
        });
        return newStories.data;
    }
    catch(e){
        console.log(e);
    }
};

export async function getAskStories(){
    let endPointURl = URLS.HN_API + "/askstories.json"

    try{
        let askStories = await axios({
            method: 'get',
            url: endPointURl
        });
        return askStories.data;
    }
    catch(e){
        console.log(e);
    }
};

export async function getShowStories(){
    let endPointURl = URLS.HN_API + "/showstories.json"

    try{
        let showStories = await axios({
            method: 'get',
            url: endPointURl
        });
        return showStories.data;
    }
    catch(e){
        console.log(e);
    }
};

export async function getJobStories(){
    let endPointURl = URLS.HN_API + "/jobstories.json"

    try{
        let jobStories = await axios({
            method: 'get',
            url: endPointURl
        });
        return jobStories.data;
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

export async function getProfile(user: string){
    let endPointURl = URLS.HN_API + "/user/" + user + ".json";

    try{
        let profileData = await axios({
            method: 'get',
            url: endPointURl
        });
        return profileData.data;
    }
    catch(e){
        console.log(e);
    }
}