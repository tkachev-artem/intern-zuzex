import { useState } from 'react'
import { Card, HStack, IconButton, Text } from '@chakra-ui/react'
import { Dialog } from '@saas-ui/react'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { deleteProject, type Project } from '@/features/projects/projectSlice'
import { selectUser, selectUserNickname } from '@/features/auth/authSlice'
import { selectProfilePortfolio, removeProjectFromPortfolio } from '@/features/profile/profileSlice'
import { authLocalAPI } from '@/LocalAPI'
import { ProjectCard } from '@/components/ProjectCard/ProjectCard'
import { ProjectForm } from '@/components/ProjectForm'
import { ProjectDetail } from '@/components/ProjectDetail/ProjectDetail'
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [viewingProject, setViewingProject] = useState<Project | null>(null)
  
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

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setEditingProject(null)
  }

  const handleViewProject = (project: Project) => {
    setViewingProject(project)
    setIsDetailModalOpen(true)
  }

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false)
    setViewingProject(null)
  }

  const handleEditFromDetail = (project: Project) => {
    setViewingProject(null)
    setIsDetailModalOpen(false)
    setEditingProject(project)
    setIsEditModalOpen(true)
  }

  const handleDeleteFromDetail = (projectId: string) => {
    handleDeleteProject(projectId)
    setIsDetailModalOpen(false)
    setViewingProject(null)
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
                      colorPalette="green"
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
        <div className={`portfolio-grid${userProjects.length === 1 ? ' portfolio-grid-one' : ''}`}>
          {userProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              showActions={showActions && currentUser?.id === userId}
              onDelete={handleDeleteProject}
              onEdit={handleEditProject}
              onView={handleViewProject}
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

      {/* Модальное окно для редактирования проекта */}
      <Dialog.Root open={isEditModalOpen}>
        <Dialog.Backdrop />
        <Dialog.Content className="dialog-modal">
          <Dialog.Header className="dialog-header">
            <Dialog.Title className="dialog-title">
              Редактировать проект
            </Dialog.Title>
            <Dialog.CloseButton onClick={handleCloseEditModal} />
          </Dialog.Header>
          <Dialog.Body className="dialog-body">
            <ProjectForm 
              editingProject={editingProject ?? undefined} 
              onProjectUpdated={handleCloseEditModal} 
            />
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Root>

      {/* Модальное окно для детального просмотра проекта */}
      {viewingProject && (
        <ProjectDetail
          project={viewingProject}
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          onEdit={handleEditFromDetail}
          onDelete={handleDeleteFromDetail}
          showActions={showActions && currentUser?.id === userId}
          authorNickname={nickname}
        />
      )}
    </div>
  )
} 