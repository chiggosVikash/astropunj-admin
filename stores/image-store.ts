import {create} from 'zustand';

export interface IImageStore {
    base64: string;
    fileName?: string;
    directory?: string;
    setBase64Image: (image: string,fileName:string,directory:string) => void;
    clearBase64: () => void;
}

const useImageStore = create<IImageStore>((set) => ({
    base64: '',
    fileName: '',
    directory: '',
    setBase64Image: (image: string,fileName:string,directory:string) => {
        set({ base64: image,fileName,directory });
    },
    clearBase64: () => set({ base64: '',fileName:'',directory:'' }),
}));

export default useImageStore;