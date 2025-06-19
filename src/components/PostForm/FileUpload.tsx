'use client'

import { Heading, Text } from '@chakra-ui/react'
import { FileUpload } from '@saas-ui/react'

export const PhotoPreviewUpload = () => {
  return (
    <FileUpload.Root maxW="xl" alignItems="stretch" maxFiles={10}>
      <FileUpload.Dropzone>
        <Heading size="md">Перетащите изображения сюда для загрузки</Heading>
        <Text color="fg.muted">.png, .jpg до 5MB</Text>
      </FileUpload.Dropzone>
      <FileUpload.List />
    </FileUpload.Root>
  )
} 