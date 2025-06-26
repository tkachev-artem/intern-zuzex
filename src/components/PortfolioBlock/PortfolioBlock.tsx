import { useState } from 'react'
import { Card, HStack, IconButton, Text } from '@chakra-ui/react'
import { Dialog } from '@saas-ui/react'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { deleteProject } from '@/features/projects/projectSlice'
import { selectUser, selectUserNickname } from '@/features/auth/authSlice'
import { selectProfilePortfolio, removeProjectFromPortfolio } from '@/features/profile/profileSlice'
import { authLocalAPI } from '@/LocalAPI'
import { ProjectCard } from '@/components/ProjectCard/ProjectCard'
import { ProjectForm } from '@/components/ProjectForm'
import './PortfolioBlock.scss'
import '../Dialog/Dialog.scss'
import { LuCirclePlus } from 'react-icons/lu'
import { useLocation } from 'react-router-dom'

type PortfolioBlockProps = {
  userId?: string
  showActions?: boolean
  title?: string
}

export const PortfolioBlock = ({userId, showActions = false }: PortfolioBlockProps) => {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  
  const dispatch = useAppDispatch()
  const portfolioProjects = useAppSelector(selectProfilePortfolio)
  const currentUser = useAppSelector(selectUser)
  const userNickname = useAppSelector(selectUserNickname)

  const location = useLocation();

  const isMyProfile = location.pathname === '/profile';
  const nickname = isMyProfile ? currentUser?.nickname : location.pathname.split('/').pop(); 
  const isAuthor = isMyProfile || currentUser?.nickname === nickname;
  
  // Используем проекты из портфолио пользователя
  const userProjects = portfolioProjects

  const handleDeleteProject = (projectId: string) => {
    // Удаляем из общего массива проектов
    dispatch(deleteProject(projectId))
    // Удаляем из портфолио пользователя
    dispatch(removeProjectFromPortfolio(projectId))
    
    // Также удаляем из портфолио пользователя в localStorage
    if (userNickname) {
      authLocalAPI.removeProjectFromUserPortfolio(userNickname, projectId)
    }
  }

  const handleAddProject = () => {
    setIsProjectModalOpen(true)
  }

  const handleCloseProjectModal = () => {
    setIsProjectModalOpen(false)
  }

  return (
    <div className="portfolio-block">
      <Card.Root padding='20px' maxWidth='800px' minWidth='800px'>

      <Card.Header>
      {isAuthor && (
              <HStack gap="1" className="profile-actions">
                  <IconButton
                      variant="ghost"
                      size="sm"
                      aria-label="Добавить проект"
                      onClick={handleAddProject}
                  >
                      <LuCirclePlus size={18}/>
                  </IconButton>
              </HStack>
          )}
      </Card.Header>
      {/* Заголовок блока */}
      <div className="portfolio-header">
        <Text textStyle="xl" className="portfolio-title">
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
      </Card.Root>

      {/* Модальное окно для добавления проекта */}
      <Dialog.Root open={isProjectModalOpen}>
        <Dialog.Backdrop />
        <Dialog.Content className="dialog-modal">
          <Dialog.Header className="dialog-header">
            <Dialog.Title className="dialog-title">
              Создать новый проект
            </Dialog.Title>
            <Dialog.CloseButton onClick={handleCloseProjectModal} />
          </Dialog.Header>
          <Dialog.Body className="dialog-body">
            <ProjectForm onProjectUpdated={handleCloseProjectModal} />
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  )
} 