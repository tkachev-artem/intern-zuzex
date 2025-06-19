'use client'

import { Button, Menu } from '@saas-ui/react'
import { HiFilter } from 'react-icons/hi'

type DirectionState = {
    frontend: boolean;
    backend: boolean;
    qa: boolean;
    design: boolean;
    management: boolean;
    marketing: boolean;
}

type FilterProps = {
    direction: DirectionState;
    setDirection: (direction: DirectionState) => void;
}

export const Filter = ({ direction, setDirection }: FilterProps) => {

    return (
        <Menu.Root closeOnSelect={false}>
      <Menu.Trigger asChild>
        <Button variant="outline" size="sm">
          <HiFilter /> Фильтры
        </Button>
      </Menu.Trigger>
      <Menu.Content minW="10rem">
        <Menu.CheckboxItem
          checked={direction.frontend}
          onCheckedChange={(checked) => {setDirection({ ...direction, frontend: checked })}}
          value="frontend"
          startElement={<Menu.ItemIndicator />}
        >
          Фронтенд
        </Menu.CheckboxItem>
        <Menu.CheckboxItem
          checked={direction.backend}
          onCheckedChange={(checked) => {
            setDirection({ ...direction, backend: checked }) 
          }}
          value="backend"
          startElement={<Menu.ItemIndicator />}
        >
          Бэкенд
        </Menu.CheckboxItem>
        <Menu.CheckboxItem
          checked={direction.qa}
          onCheckedChange={(checked) => {setDirection({ ...direction, qa: checked })}}
          value="qa"
          startElement={<Menu.ItemIndicator />}
        >
          Тестирование
        </Menu.CheckboxItem>
        <Menu.CheckboxItem
          checked={direction.design}
          onCheckedChange={(checked) => {setDirection({ ...direction, design: checked })}}
          value="design"
          startElement={<Menu.ItemIndicator />}
        >
          Дизайн
        </Menu.CheckboxItem>
        <Menu.CheckboxItem
          checked={direction.management}
          onCheckedChange={(checked) => {setDirection({ ...direction, management: checked })}}
          value="management"
          startElement={<Menu.ItemIndicator />}
        >
          Менеджмент
        </Menu.CheckboxItem>
        <Menu.CheckboxItem
            checked={direction.marketing}
          onCheckedChange={(checked) => {setDirection({ ...direction, marketing: checked })}}
          value="marketing"
          startElement={<Menu.ItemIndicator />}
        >
          Маркетинг
        </Menu.CheckboxItem>
      </Menu.Content>
    </Menu.Root>
  )
}

export default Filter; 
export type { DirectionState };