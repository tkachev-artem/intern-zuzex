type UniqueData = {
    nickname: string
    email: string
}

const uniqueData: UniqueData[] = [
    {
        nickname: "tkachevtech",
        email: "tkachev.tech@yandex.ru"
    }
]

export const getUniqueNickname = (nickname: string) => {
    return uniqueData.find(data => data.nickname === nickname )
}

export const getUniqueEmail = (email: string) => {
    return uniqueData.find(data => data.email === email )
}
