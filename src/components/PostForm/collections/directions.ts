import { createListCollection } from '@chakra-ui/react';

export const directions = createListCollection({
  items: [
    { label: 'Frontend', value: 'Фронтенд' },
    { label: 'Backend', value: 'Бэкенд' },
    { label: 'QA', value: 'Тестирование' },
    { label: 'Design', value: 'Дизайн' },
    { label: 'Management', value: 'Менеджмент' },
    { label: 'Marketing', value: 'Маркетинг' },
  ],
});
