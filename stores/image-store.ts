import {create} from 'zustand';

export interface IImageStore {
    base64: string;
    fileName?: string;
    directory?: string;
    imageFile?: File;
    setBase64Image: (image: string,fileName:string,directory:string) => void;
    addImageFile: (file: File) => void;
    clearBase64: () => void;
    clearImageFile: () => void;
}

const useImageStore = create<IImageStore>((set) => ({
    base64: '',
    fileName: '',
    directory: '',
    imageFile: undefined,
    setBase64Image: (image: string,fileName:string,directory:string) => {
        set({ base64: image,fileName,directory });
    },
    addImageFile: (file: File) => {
        set({ imageFile: file });
    },
    clearImageFile: () => set({ imageFile: undefined }),
    clearBase64: () => set({ base64: '',fileName:'',directory:'' }),
}));

export default useImageStore;