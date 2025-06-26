'use client'

import { useAppSelector } from '@/app/hooks'
import { selectProfileFirstName, selectProfileRole, selectProfileNickname, selectProfileLastName, selectProfileWorkplace, selectProfileDescription } from '@/features/profile/profileSlice'
import { Badge, HStack, IconButton, Stack, Text } from '@chakra-ui/react'
import { Card } from '@saas-ui/react'
import { HiAtSymbol } from 'react-icons/hi'
import { PiLineVerticalThin } from "react-icons/pi";
import "./ProfileHeader.scss";
import { useLocation } from 'react-router-dom'
import { LuPencil } from 'react-icons/lu'

export const ProfileHeader = () => {

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

  return (
    <Card.Root className="card">
        <Card.Header>
        {isAuthor && (
            <HStack gap="1" className="actions">
                <IconButton
                    variant="ghost"
                    size="sm"
                    aria-label="Редактировать пост"
                >
                    <LuPencil size={16} />
                </IconButton>
            </HStack>
        )}
        </Card.Header>
      <Card.Body className="card-body">
        <Stack alignItems="center" justifyContent="center" gap="12px">
            <Badge variant="solid" colorPalette="green" size="md" paddingInline={2}>
            <HiAtSymbol />
                {profileNickname}
            </Badge>

            <Text fontWeight="semibold" textStyle="lg">
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
            <Text fontWeight="semibold" textStyle="sm">
                {profileDescription}
            </Text>
        </Stack>
      </Card.Body>
    </Card.Root>
  )
}
