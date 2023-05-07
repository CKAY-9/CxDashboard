export const transGameToText = (game: string) => {
    const trans: any = {
        "gmod": "Garry's Mod",
        "mc": "Minecraft"
    }

    return trans[game];
}