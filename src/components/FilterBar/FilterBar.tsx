'use client'

import { Button, Menu } from '@saas-ui/react'
import { HiFilter } from 'react-icons/hi'

import './FilterBar.scss'

// тип состояния фильтра по направлениям
type DirectionState = {
    frontend: boolean;
    backend: boolean;
    qa: boolean;
    design: boolean;
    management: boolean;
    marketing: boolean;
}

type FilterBarProps = {
    direction: DirectionState;
    setDirection: (direction: DirectionState) => void;
}

export const FilterBar = ({ direction, setDirection }: FilterBarProps) => {

    return (
        <Menu.Root closeOnSelect={false}>
      <Menu.Trigger asChild>
        <Button variant="outline" size="lg" paddingInline="16px">
          <HiFilter /> Фильтры
        </Button>
      </Menu.Trigger>
      <Menu.Content minW="10rem">
        <Menu.CheckboxItem
          className="filter-checkbox"
          checked={direction.frontend}
          onCheckedChange={(checked) => {setDirection({ ...direction, frontend: checked })}}
          value="frontend"
          startElement={<Menu.ItemIndicator />}
        >
          Фронтенд
        </Menu.CheckboxItem>
        <Menu.CheckboxItem
          className="filter-checkbox"
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
          className="filter-checkbox"
          checked={direction.qa}
          onCheckedChange={(checked) => {setDirection({ ...direction, qa: checked })}}
          value="qa"
          startElement={<Menu.ItemIndicator />}
        >
          Тестирование
        </Menu.CheckboxItem>
        <Menu.CheckboxItem
          className="filter-checkbox"
          checked={direction.design}
          onCheckedChange={(checked) => {setDirection({ ...direction, design: checked })}}
          value="design"
          startElement={<Menu.ItemIndicator />}
        >
          Дизайн
        </Menu.CheckboxItem>
        <Menu.CheckboxItem
          className="filter-checkbox"
          checked={direction.management}
          onCheckedChange={(checked) => {setDirection({ ...direction, management: checked })}}
          value="management"
          startElement={<Menu.ItemIndicator />}
        >
          Менеджмент
        </Menu.CheckboxItem>
        <Menu.CheckboxItem
          className="filter-checkbox"
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

export default FilterBar; 
export type { DirectionState }; 