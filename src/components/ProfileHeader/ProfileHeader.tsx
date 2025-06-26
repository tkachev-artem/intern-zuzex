'use client'

import { useState } from 'react'
import { useAppSelector } from '@/app/hooks'
import { selectProfileFirstName, selectProfileRole, selectProfileNickname, selectProfileLastName, selectProfileWorkplace, selectProfileDescription } from '@/features/profile/profileSlice'
import { Badge, HStack, IconButton, Stack, Text } from '@chakra-ui/react'
import { Card, Dialog } from '@saas-ui/react'
import { HiAtSymbol } from 'react-icons/hi'
import { PiLineVerticalThin } from "react-icons/pi";
import "./ProfileHeader.scss";
import '../Dialog/Dialog.scss'
import { useLocation } from 'react-router-dom'
import { LuPencil } from 'react-icons/lu'
import { ProfileEditForm } from '../ProfileEditForm'

export const ProfileHeader = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  //const profileID = useAppSelector(selectProfileID);
  const profileFirstName = useAppSelector(selectProfileFirstName);
  const profileLastName = useAppSelector(selectProfileLastName);
  const profileNickname = useAppSelector(selectProfileNickname);
  const profileRole = useAppSelector(selectProfileRole);
  const profileWorkplace = useAppSelector(selectProfileWorkplace);
  const profileDescription = useAppSelector(selectProfileDescription);

  const location = useLocation();

  const isMyProfile = location.pathname === '/profile';
  const nickname = isMyProfile ? profileNickname : location.pathname.split('/').pop(); 
  const isAuthor = isMyProfile || profileNickname === nickname;

  const handleEditProfile = () => {
    setIsEditModalOpen(true)
  }

  const handleProfileUpdated = () => {
    setIsEditModalOpen(false)
  }

  return (
    <>
      <Card.Root className="profile-card">
          <Card.Header>
          {isAuthor && (
              <HStack gap="1" className="profile-actions">
                  <IconButton
                      variant="ghost"
                      size="sm"
                      aria-label="Редактировать профиль"
                      onClick={handleEditProfile}
                  >
                      <LuPencil size={16} />
                  </IconButton>
              </HStack>
          )}
          </Card.Header>
      <Card.Body className="profile-card-body">
        <Stack alignItems="center" justifyContent="center" gap="12px">
            <Badge variant="solid" colorPalette="green" size="lg" paddingInline={2}>
            <HiAtSymbol />
                {profileNickname}
            </Badge>

            <Text fontWeight="semibold" textStyle="xl">
                {profileFirstName} {profileLastName}
            </Text>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="center">
                <Text fontWeight="semibold" textStyle="md" color="fg.muted">
                    {profileRole}
                </Text>

                {profileWorkplace && (
                    <>
                        <PiLineVerticalThin />
                        <Text fontWeight="semibold" textStyle="md" color="fg.muted">
                            {profileWorkplace}
                        </Text>
                    </>
                )}
        </Stack>

        <Stack alignItems="center" justifyContent="center">
            <Text fontWeight="semibold" textStyle="md">
                {profileDescription}
            </Text>
        </Stack>
      </Card.Body>
    </Card.Root>

    {/* Модальное окно редактирования профиля */}
    <Dialog.Root open={isEditModalOpen}>
      <Dialog.Backdrop />
      <Dialog.Content className="dialog-modal">
        <Dialog.Header className="dialog-header">
          <Dialog.Title className="dialog-title">
            Редактирование профиля
          </Dialog.Title>
          <Dialog.CloseButton onClick={() => { setIsEditModalOpen(false) }} />
        </Dialog.Header>
        <Dialog.Body className="dialog-body">
          <ProfileEditForm onProfileUpdated={handleProfileUpdated} />
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  </>
  )
}
