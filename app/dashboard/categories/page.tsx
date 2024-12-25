'use client';

import { Button } from '@/components/ui/button';
import { CategoryList } from '@/components/categories/category-list';
import { PlusCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { CreateCategoryDialog } from '@/components/categories/create-category-dialog';
import useCategoryStore from '@/stores/category-store';
export default function CategoriesPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const {getCategories,categories,isProcessing} = useCategoryStore();

  const getCategoriesCall = useCallback(async() =>{
    // Fetch categories from the server
    await getCategories();

  }, [getCategories]);

  useEffect(() => {
    getCategoriesCall();
  }, [getCategoriesCall]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
        <Button onClick={() => setShowCreateDialog(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <CategoryList categories={categories}/>
      <CreateCategoryDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog} 
      />
    </div>
  );
}