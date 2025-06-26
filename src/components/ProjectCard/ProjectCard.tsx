import { Button, Text, Image } from '@chakra-ui/react'
import { Card } from '@saas-ui/react'
import { HiExternalLink, HiCode } from 'react-icons/hi'
import type { Project } from '@/features/projects/projectSlice'
import './ProjectCard.scss'

type ProjectCardProps = {
  project: Project
  onDelete?: (id: string) => void
  showActions?: boolean
}

export const ProjectCard = ({ project, onDelete, showActions = false }: ProjectCardProps) => {
  
  return (
    <Card.Root className="project-card">
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
