export interface User {
    avatar: string,
    name: string,
    token: string,
    id: string,
    linkedServers: string[]
}

export interface ServerInfo {
    game: string,
    dashID: string,
    serverName: string,
    allowedUsers: string[],
    active: boolean
}
