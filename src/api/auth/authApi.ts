type AuthData = {
    nickname: string
    password: string
}

const authData: AuthData[] = [
    {
        nickname: "tkachevtech",
        password: "123456789A"
    }
]

export const getAuthData = (nickname: string, password: string) => {
    return authData.find(data => data.nickname === nickname && data.password === password)
}
