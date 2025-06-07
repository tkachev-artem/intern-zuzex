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

export function getUniqueNickname(nickname: string) {
    return uniqueData.find(data => data.nickname === nickname )
}

export function getUniqueEmail(email: string) {
    return uniqueData.find(data => data.email === email )
}
