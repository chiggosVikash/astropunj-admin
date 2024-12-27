import apiClient from "@/lib/axiosInstance";
import { endpoints } from "@/lib/endpoints";
import { Astrologer } from "@/lib/types";
import { create } from "zustand";
import useImageStore from "./image-store";

export interface IAstrologerStore {
  astrologers: Astrologer[];
  isProcessing: boolean;
  success: boolean;
  signImageUpload: (
    public_key: string,
    folder: string
  ) => Promise<ImageUploadSignResponse>;
  uploadImage: (uploadInfo: ImageUploadSignResponse) => Promise<string>;
  saveAstrologer: (astrologer: Astrologer) => Promise<void>;
  setProcessing: (isProcessing: boolean) => void;
}

export interface ImageUploadSignResponse {
  apiKey: string;
  timestamp: number;
  signature: string;
}

const useAstrologerStore = create<IAstrologerStore>((set,get) => ({
  astrologers: [],
  isProcessing: false,
  success: false,


  setProcessing: (isProcessing: boolean) => {
    set({ isProcessing });
  },
  saveAstrologer: async (astrologer: Astrologer) => {
    try {
      set({ isProcessing: true });
     
        console.log(astrologer);
      const response = await apiClient.post(endpoints.astrologer, astrologer);
      if (response.status === 201) {
        set({ isProcessing: false, success: true });
      } else {
        throw new Error("Failed to save astrologer");
      }
    } catch (e) {
      set({ isProcessing: false, success: false });
      throw new Error("Failed to save astrologer");
    }
  },
  signImageUpload: async (public_key: string, folder: string) => {
    try {
      const response = await apiClient.post(endpoints.imageUploadSign, {
        public_key,
        folder,
      });
      console.log(response.data);
      if (response.status === 200) {
        return {
          apiKey: response.data.apiKey,
          timestamp: response.data.timestamp,
          signature: response.data.signature,
        };
      }
      throw new Error("Failed to sign image upload");
    } catch (e) {
      throw new Error("Failed to sign image upload");
    }
  },
  uploadImage: async (uploadInfo) => {
    try {
      const imageBase64 = useImageStore.getState().base64;
      const fileName = useImageStore.getState().fileName;
      if (!imageBase64) {
        throw new Error("No image to upload");
      }
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      if (!cloudName) {
        throw new Error("Cloudinary cloud name not found");
      }

      const formData = new FormData();
      formData.append("file", imageBase64);
      formData.append("api_key", uploadInfo.apiKey);
      formData.append("timestamp", uploadInfo.timestamp.toString());
      formData.append("signature", uploadInfo.signature);
      formData.append("upload_preset", "astropunj");
      formData.append("public_id", fileName || uploadInfo.timestamp.toString());

      console.log("Api key", uploadInfo.apiKey);
      console.log("Timestamp", uploadInfo.timestamp);
      console.log("Signature", uploadInfo.signature);
      console.log("File name", fileName);
      
      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(
          errorData.error.message || "Failed to upload to Cloudinary"
        );
      }
      const responseData = await uploadResponse.json();
      console.log(responseData);
      return responseData.secure_url;
    } catch (e) {
      throw new Error("Failed to upload image");
    }
  },

  
}));

export default useAstrologerStore;
