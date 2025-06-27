import { Button, Text, Image } from '@chakra-ui/react'
import { Card } from '@saas-ui/react'
import type { Project } from '@/features/projects/projectSlice'
import './ProjectCard.scss'
import { LuUnlink } from 'react-icons/lu'

type ProjectCardProps = {
  project: Project
  showActions?: boolean
  onDelete?: (projectId: string) => void
  onEdit?: (project: Project) => void
  onView?: (project: Project) => void
}

export const ProjectCard = ({ 
  project, 
  onView,
}: ProjectCardProps) => {

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    
    if (onView) {
      onView(project);
    }
  };
  
  return (
    <Card.Root className="project-card" onClick={handleCardClick}>
      <Card.Body className="project-card-body">
        {/* превью изображения */}
        {project.previewImage && (
          <div className="project-preview">
            <Image
              src={project.previewImage}
              alt={`${project.title} preview`}
              className="project-image"
            />
          </div>
        )}

        {/* заголовок проекта */}
        <div className="project-header">
          <div className="project-title-section">
            <Text textStyle="lg" className="project-title">
              {project.title}
            </Text>
          </div>
        </div>

        {/* описание проекта */}
        {project.description && (
          <Text textStyle="sm" color="fg.muted" className="project-description">
            {project.description}
          </Text>
        )}

        {/* нижняя секция с ссылками */}
        <div className="project-footer">
          {/* ссылки и действия */}
          <div className="project-controls">
            {/* ссылки на проект */}
            {project.links.length > 0 && (
              <div className="project-links">
                {project.links.map((link, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant="ghost"
                    className="project-link-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(link.url, '_blank');
                    }}
                  >
                    <LuUnlink size={24} />
                    <Text fontSize="md" fontWeight="500">
                      {link.name || 'Ссылка'}
                    </Text>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card.Body>
    </Card.Root>
  )
}
