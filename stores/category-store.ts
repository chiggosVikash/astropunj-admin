import apiClient from '@/lib/axiosInstance';
import { endpoints } from '@/lib/endpoints';
import { Category } from '@/lib/types';
import {create} from 'zustand';
import useErrorStore from './error-handler-store';

interface ICategoryStore{
    isProcessing: boolean;
    success: boolean;
    categories: Category[];
    getCategories: () => Promise<void>;
    createCategory: (category: Category) => Promise<void>;
}

const useCategoryStore = create<ICategoryStore>((set) => ({
    isProcessing: true,
    success: false,
    categories: [],
    createCategory: async (category: Category) => {
        try{
            set({isProcessing: true});
            const response = await apiClient.post(endpoints.category, category);
            if(response.status === 201){
                set({isProcessing: false, success: true});
                return;
            }
            throw new Error('Failed to create category');
        }catch(error){
            useErrorStore.getState().setError(error);
            console.log('Error:', error);
        }
    },
    getCategories: async () => {
        set({isProcessing: true});
        try {
            const response = await apiClient.get(endpoints.categories)
            if(response.status === 200){
                const dataResponse = response.data;
                set({categories: dataResponse.data, isProcessing: false, success: true});
            }
            // set({categories: data, isProcessing: false});
        } catch (error) {
            set({isProcessing: false, success: false});
            useErrorStore.getState().setError(error);
            console.log('Failed to fetch categories:', error);
            // Handle error appropriately
        }
    },
}));

export default useCategoryStore;

