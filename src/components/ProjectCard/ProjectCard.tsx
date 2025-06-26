import { Button, Text, Image, HStack, IconButton } from '@chakra-ui/react'
import { Card } from '@saas-ui/react'
import { HiExternalLink, HiCode } from 'react-icons/hi'
import type { Project } from '@/features/projects/projectSlice'
import './ProjectCard.scss'
import { LuPencil } from 'react-icons/lu'
import { useLocation } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import { selectUser } from '@/features/auth/authSlice'

type ProjectCardProps = {
  project: Project
  onDelete?: (id: string) => void
  showActions?: boolean
}

export const ProjectCard = ({ project, onDelete, showActions = false }: ProjectCardProps) => {

  const location = useLocation();
  const currentUser = useAppSelector(selectUser)
  const isMyProfile = location.pathname === '/profile';
  const nickname = isMyProfile ? currentUser?.nickname : location.pathname.split('/').pop(); 
  const isAuthor = isMyProfile || currentUser?.nickname === nickname;
  
  return (
    <Card.Root className="project-card">
      <Card.Header>
      {isAuthor && (
              <HStack gap="1" className="profile-actions">
                  <IconButton
                      variant="ghost"
                      size="sm"
                      aria-label="Добавить проект"
                      //onClick={handleAddProject}
                  >
                    <LuPencil size={16}/>
                  </IconButton>
              </HStack>
          )}
      </Card.Header>
      <Card.Body className="project-card-body">
        {/* Превью изображения */}
        {project.previewImage && (
          <div className="project-preview">
            <Image
              src={project.previewImage}
              alt={`${project.title} preview`}
              className="project-image"
            />
          </div>
        )}

        {/* Заголовок проекта */}
        <div className="project-header">
          <div className="project-title-section">
            <Text fontWeight="600" textStyle="lg" className="project-title">
              {project.title}
            </Text>
          </div>
        </div>

        {/* Описание проекта */}
        {project.description && (
          <Text textStyle="sm" color="fg.muted" className="project-description">
            {project.description}
          </Text>
        )}

        {/* Нижняя секция с ссылками */}
        <div className="project-footer">
          {/* Ссылки и действия */}
          <div className="project-controls">
            {/* Ссылки на проект */}
            {project.links.length > 0 && (
              <div className="project-links">
                {project.links.map((link, index) => {
                  const isGitHub = link.toLowerCase().includes('github')
                  return (
                    <Button
                      key={index}
                      size="xs"
                      variant="ghost"
                      className="project-link-button"
                      onClick={() => {
                        window.open(link, '_blank')
                      }}
                    >
                      {isGitHub ? (
                        <>
                          <HiCode />
                          Code
                        </>
                      ) : (
                        <>
                          <HiExternalLink />
                          Demo
                        </>
                      )}
                    </Button>
                  )
                })}
              </div>
            )}

            {/* Действия с проектом (для владельца) */}
            {showActions && onDelete && (
              <Button
                size="xs"
                colorPalette="red"
                variant="ghost"
                onClick={() => {
                  onDelete(project.id)
                }}
                className="project-delete-button"
              >
                Удалить
              </Button>
            )}
          </div>
        </div>
      </Card.Body>
    </Card.Root>
  )
}
