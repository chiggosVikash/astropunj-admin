'use client';

import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { Card } from '@/components/ui/card';
import { CategoryItem } from './category-item';
import { useEffect, useState } from 'react';
import { mockCategories } from '@/lib/mock-data';
import { Category } from '@/lib/types';

interface CategoryListProps {
  categories: Category[];
}

export function CategoryList({ categories }: CategoryListProps) {
  const [categoriList, setCategoryList] = useState<Category[]>([]);

  useEffect(() => {
    const getCategoriesFromProps = async () => {
      const datas: Category[] = await categories;
      setCategoryList(datas);
    };

    getCategoriesFromProps();
  }, [categories]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items:Category[] = Array.from(categoriList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCategoryList(items);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="categories">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-4"
          >
            {categoriList.map((category, index) => (
              <Draggable
                key={category?.id ?? index.toString()}
                draggableId={category.id ?? index.toString()}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <CategoryItem category={category} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}