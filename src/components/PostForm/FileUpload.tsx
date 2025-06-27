// компонент для загрузки фото (используется библиотека saas ui)
'use client'

import { Button, Heading, Stack, Text, Image} from '@chakra-ui/react'
import { FileUpload } from '@saas-ui/react'

// тип пропсов для компонента загрузки фото
type PhotoUploadProps = {
  image: string | undefined
  setImage: (image: string | undefined) => void
  setIsLoading: (loading: boolean) => void
}

type FileAcceptDetails = {
  files: File[]
}

const FORMAT_FILE = ['png', 'jpg', 'jpeg'] as const

export const PhotoPreviewUpload = ({ image, setImage, setIsLoading }: PhotoUploadProps) => {

  // обработчик загрузки файла
  const handleFileUpload = (details: FileAcceptDetails) => {
    const file = details.files[0] // получаем файл из массива

    // проверка размера файла (максимум 5MB)
    if (file.size > 5 * 1024 * 1024)  {
      console.log('ошибка: файл слишком большой') 
      return
    }

    const fileFormat = file.name.split('.').pop()?.toLowerCase()

    // проверяем формат файла
    if (!fileFormat || !FORMAT_FILE.includes(fileFormat as typeof FORMAT_FILE[number])) {
      console.log('ошибка: неверный формат файла')
      return
    }

    setIsLoading(true)

    const reader = new FileReader()
    reader.onload = () => {
      setImage(reader.result as string)
      setIsLoading(false)
      console.log('файл загружен')
    }
    reader.onerror = () => {
      console.log('ошибка: не удалось загрузить файл')
      setIsLoading(false)
    }
    reader.readAsDataURL(file)
  }

  // обработчик удаления изображения
  const handleFileDelete = () => {
    setImage(undefined)
  }

  return (
    <FileUpload.Root
      key={image ? 'with-image' : 'no-image'}
      maxW="100%"
      alignItems="center"
      maxFiles={1}
      onFileAccept={handleFileUpload}
    >
      
      {/* область для перетаскивания файлов */}
      <FileUpload.Dropzone>
        <Heading size="md" padding={2}>Перетащите изображения сюда для загрузки</Heading>
        <Text color="fg.muted">.png, .jpg до 5MB</Text>
      </FileUpload.Dropzone>
      
      {/* превью загруженного изображения */}
      {image && (
        <Stack direction="column" alignItems="center" gap={2}>
          <Image src={image} alt="Preview" />
          <Button onClick={handleFileDelete} variant="outline" size="lg" paddingInline={10}>Удалить</Button>
          <FileUpload.List />
        </Stack>
      )}

    </FileUpload.Root>
  )
} 