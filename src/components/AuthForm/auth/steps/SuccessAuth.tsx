// Redux hooks
import { useAppDispatch, useAppSelector } from "@/app/hooks"

// Redux actions и selectors для авторизации
import {
  logout,
  selectUser,
  selectUserRole,
  selectUserNickname,
  selectUserToken,
} from "@/features/auth/authSlice"

import { Center, HStack, VStack, Heading, Text, Button, Badge } from "@chakra-ui/react"
import { Card } from "@saas-ui/react"

export const SuccessAuth = () => {

    const dispatch = useAppDispatch()

    const user = useAppSelector(selectUser)
    const userNickname = useAppSelector(selectUserNickname)
    const userRole = useAppSelector(selectUserRole)
    const userToken = useAppSelector(selectUserToken)

    if (!user) return null;
    
    const handleLogout = () => {
        dispatch(logout())
    }
    return (
        <Center width="full" minHeight="100vh" bg="gray.50" padding="4">
          <Card.Root size="lg" width="md" maxWidth="500px">
            <Card.Header textAlign="center">
              <Heading size="lg" color="green.600">
                Вы авторизованны в систем
              </Heading>
            </Card.Header>
  
            <Card.Body gap="6">
              <Card.Root variant="outline" bg="gray.50">
                <Card.Body gap="4">
                  <HStack justify="space-between">
                    <Text fontWeight="medium" color="gray.600">
                      ID:
                    </Text>
                    <Badge
                      variant="outline"
                      fontFamily="mono"
                      fontSize="sm"
                      bg="white"
                      px="2"
                      py="1"
                    >
                      {user.id}
                    </Badge>
                  </HStack>
  
                  <HStack justify="space-between">
                    <Text fontWeight="medium" color="gray.600">
                      Никнейм:
                    </Text>
                    <Text fontWeight="semibold" color="gray.900">
                      {userNickname}
                    </Text>
                  </HStack>
  
                  <HStack justify="space-between">
                    <Text fontWeight="medium" color="gray.600">
                      Роль:
                    </Text>
                    <Badge
                      colorScheme={
                        userRole === "Frontend Developer" ? "blue" : "green"
                      }
                      variant="solid"
                      px="3"
                      py="1"
                      borderRadius="full"
                    >
                      {userRole}
                    </Badge>
                  </HStack>
  
                  <VStack align="stretch" gap="2">
                    <Text fontWeight="medium" color="gray.600">
                      Токен:
                    </Text>
                    <Card.Root variant="outline" bg="white">
                      <Card.Body p="2">
                        <Text
                          fontSize="xs"
                          fontFamily="mono"
                          color="gray.700"
                          wordBreak="break-all"
                        >
                          {userToken}
                        </Text>
                      </Card.Body>
                    </Card.Root>
                  </VStack>
                </Card.Body>
              </Card.Root>
  
              <VStack gap="3">
                <Text color="gray.700" textAlign="center">
                  Добро пожаловать в систему!
                </Text>
  
                <Button
                  onClick={handleLogout}
                  colorScheme="red"
                  variant="solid"
                  width="full"
                  size="md"
                >
                  Выйти
                </Button>
              </VStack>
            </Card.Body>
          </Card.Root>
        </Center>
      )
}

export default SuccessAuth