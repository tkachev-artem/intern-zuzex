import { Text } from '@chakra-ui/react'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { selectProjects, deleteProject } from '@/features/projects/projectSlice'
import { selectUser } from '@/features/auth/authSlice'
import { ProjectCard } from '@/components/ProjectCard/ProjectCard'
import './PortfolioBlock.scss'

type PortfolioBlockProps = {
  userId?: string
  showActions?: boolean
  title?: string
}

export const PortfolioBlock = ({userId, showActions = false }: PortfolioBlockProps) => {
  
  const dispatch = useAppDispatch()
  const projects = useAppSelector(selectProjects)
  const currentUser = useAppSelector(selectUser)
  
  // Фильтруем проекты для конкретного пользователя (если нужно)
  // Пока что показываем все проекты, так как в текущей структуре нет связи проект-пользователь
  const userProjects = projects

  const handleDeleteProject = (projectId: string) => {
    dispatch(deleteProject(projectId))
  }

  return (
    <div className="portfolio-block">
      {/* Заголовок блока */}
      <div className="portfolio-header">
        <Text fontWeight="600" textStyle="xl" className="portfolio-title">
          Портфолио
        </Text>
        
        {userProjects.length === 0 && (
          <Text color="fg.muted" textStyle="sm" className="portfolio-empty">
            Пока нет проектов в портфолио
          </Text>
        )}
      </div>

      {/* Сетка проектов */}
      {userProjects.length > 0 && (
        <div className="portfolio-grid">
          {userProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              showActions={showActions && currentUser?.id === userId}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      )}
    </div>
  )
} 