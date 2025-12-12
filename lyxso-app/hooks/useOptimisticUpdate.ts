// hooks/useOptimisticUpdate.ts
import { useState } from 'react';

export function useOptimisticUpdate<T>(initialData: T) {
  const [data, setData] = useState<T>(initialData);
  const [isUpdating, setIsUpdating] = useState(false);

  const updateOptimistically = async (
    newData: T,
    updateFn: () => Promise<void>
  ) => {
    const previousData = data;
    setData(newData);
    setIsUpdating(true);

    try {
      await updateFn();
    } catch (error) {
      // Rollback on error
      setData(previousData);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  return { data, isUpdating, updateOptimistically, setData };
}
