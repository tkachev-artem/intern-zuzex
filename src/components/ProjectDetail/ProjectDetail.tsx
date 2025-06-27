'use client'

import { Button, Text, Image, HStack, VStack } from '@chakra-ui/react'
import { Dialog } from '@saas-ui/react'
import type { Project } from '@/features/projects/projectSlice'
import { useAppSelector } from '@/app/hooks'
import { selectUser } from '@/features/auth/authSlice'
import { useLocation } from 'react-router-dom'
import { LuUnlink, LuPencil, LuTrash2, LuX } from 'react-icons/lu'
import './ProjectDetail.scss'
import '../Dialog/Dialog.scss'

type ProjectDetailProps = {
  project: Project
  isOpen: boolean
  onClose: () => void
  onEdit?: (project: Project) => void
  onDelete?: (id: string) => void
  showActions?: boolean
  authorNickname?: string
}

export const ProjectDetail = ({ 
  project, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete, 
  showActions = false,
}: ProjectDetailProps) => {
  const location = useLocation()
  const currentUser = useAppSelector(selectUser)
  
  const isMyProfile = location.pathname === '/profile'
  const nickname = isMyProfile ? currentUser?.nickname : location.pathname.split('/').pop()
  const isAuthor = isMyProfile || currentUser?.nickname === nickname

  const handleEdit = () => {
    if (onEdit) {
      onEdit(project)
    }
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(project.id)
      onClose()
    }
  }

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Backdrop onClick={onClose} />
      <Dialog.Content className="dialog-modal project-detail-modal">
        <Dialog.Header className="dialog-header">
          <HStack justify="space-between" width="full">
            <HStack gap="2">
              {isAuthor && showActions && (
                <>
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleEdit}
                    >
                      <LuPencil size={16} />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      colorPalette="red"
                      onClick={handleDelete}
                    >
                      <LuTrash2 size={16} />
                    </Button>
                  )}
                </>
              )}
            </HStack>

            <Button 
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <LuX size={16} />
            </Button>
          </HStack>
        </Dialog.Header>

        <Dialog.Body className="dialog-body project-detail-body">
          <VStack gap="20px" alignItems="stretch">
            {/* превью изображения */}
            {project.previewImage && (
              <div className="project-detail-preview">
                <Image
                  src={project.previewImage}
                  alt={`${project.title} preview`}
                  className="project-detail-image"
                  borderRadius="lg"
                />
              </div>
            )}

            {/* заголовок */}
            <VStack gap="3" alignItems="stretch">
              <Text textStyle="2xl" fontWeight="bold" className="project-detail-title">
                {project.title}
              </Text>
            </VStack>

            {/* описание проекта */}
            {project.description && (
              <VStack gap="3" alignItems="stretch">
                <Text textStyle="lg" fontWeight="semibold">
                  Описание
                </Text>
                <Text textStyle="md" color="fg.muted" className="project-detail-description">
                  {project.description}
                </Text>
              </VStack>
            )}

            {/* ссылки на проект */}
            {project.links.length > 0 && (
              <VStack gap="3" alignItems="stretch">
                <Text textStyle="lg" fontWeight="semibold">
                  Ссылки на проект
                </Text>
                <div className="project-detail-links">
                  {project.links.map((link, index) => (
                    <Button
                      key={index}
                      size="md"
                      variant="outline"
                      onClick={() => window.open(link.url, '_blank')}
                      className="project-detail-link"
                    > 
                      <LuUnlink size={16} />
                      <VStack gap="1" alignItems="flex-start">
                        <Text fontWeight="semibold">
                          {link.name || 'Ссылка'}
                        </Text>
                        <Text fontSize="sm" color="fg.muted" textDecoration="underline">
                          {link.url}
                        </Text>
                      </VStack>
                    </Button>
                  ))}
                </div>
              </VStack>
            )}
          </VStack>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  )
} 