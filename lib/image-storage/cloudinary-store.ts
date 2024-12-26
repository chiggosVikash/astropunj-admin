import {getCldImageUrl} from 'next-cloudinary'
import apiClient from '../axiosInstance'
import { endpoints } from '../endpoints'

export class CloudinaryStore {

    private static instance: CloudinaryStore

    private constructor(){};

    static getInstance(){
        if(!CloudinaryStore.instance){
            CloudinaryStore.instance = new CloudinaryStore()
        }
        return CloudinaryStore.instance
    }

    async signImageUpload({public_key, folder}:{public_key:string,folder:string}):Promise<any>{
        try{
           const response = await apiClient.post(endpoints.imageUploadSign,{public_key, folder})
           if(response.status === 200){
               return 
           }

        }catch(e){
            throw new Error("Failed to sign image upload")
        }
    }
}
