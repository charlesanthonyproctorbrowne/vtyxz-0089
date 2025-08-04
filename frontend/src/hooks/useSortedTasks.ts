import { useMemo } from 'react';
import { Task } from '../types';

export function useSortedTasks(tasks: Task[], sortBy: string, sortOrder: 'asc' | 'desc'): Task[] {
  return useMemo(() => {
    if (!sortBy) return tasks;

    return [...tasks].sort((a, b) => {
      let aValue: any = a[sortBy as keyof Task];
      let bValue: any = b[sortBy as keyof Task];

      // Handle date sorting
      if (sortBy === 'dueDate') {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }

      // Handle string sorting
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [tasks, sortBy, sortOrder]);
}
