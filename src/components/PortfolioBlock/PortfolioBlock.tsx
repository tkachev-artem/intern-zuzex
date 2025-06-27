import { useState } from 'react'
import { Card, HStack, IconButton, Text } from '@chakra-ui/react'
import { Dialog } from '@saas-ui/react'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import type { Project } from '@/features/projects/projectSlice'
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
  
  // используем проекты из портфолио пользователя
  const userProjects = portfolioProjects

  // удаление проекта из портфолио
  const handleDeleteProject = (projectId: string) => {
    dispatch(removeProjectFromPortfolio(projectId))
    if (userNickname) {
      authLocalAPI.removeProjectFromUserPortfolio(userNickname, projectId)
    }
  }

  // открытие модального окна для добавления проекта
  const handleAddProject = () => {
    setIsProjectModalOpen(true)
  }

  // закрытие модального окна для добавления проекта
  const handleCloseProjectModal = () => {
    setIsProjectModalOpen(false)
  }

  // открытие модального окна для редактирования проекта
  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setIsEditModalOpen(true)
  }

  // закрытие модального окна для редактирования проекта
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setEditingProject(null)
  }

  // открытие модального окна для просмотра проекта
  const handleViewProject = (project: Project) => {
    setViewingProject(project)
    setIsDetailModalOpen(true)
  }

  // закрытие модального окна для просмотра проекта
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false)
    setViewingProject(null)
  }

  // переход к редактированию из детального просмотра
  const handleEditFromDetail = (project: Project) => {
    setViewingProject(null)
    setIsDetailModalOpen(false)
    setEditingProject(project)
    setIsEditModalOpen(true)
  }

  // удаление проекта из детального просмотра
  const handleDeleteFromDetail = (projectId: string) => {
    handleDeleteProject(projectId)
    setIsDetailModalOpen(false)
    setViewingProject(null)
  }

  return (
    <div className="portfolio-block">
      <Card.Root 
        padding={{ base: '16px', md: '20px' }} 
        width="100%"
        maxWidth="800px"
      >

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
      {/* заголовок блока */}
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

      {/* сетка проектов */}
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

      {/* модальное окно для добавления проекта */}
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

      {/* модальное окно для редактирования проекта */}
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

      {/* модальное окно для детального просмотра проекта */}
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