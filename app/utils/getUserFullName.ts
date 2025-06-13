import {localStorageKey} from "@/constants/global";

export const getUserData = (): { full_name: string } => {
    try {
        const userData = localStorage.getItem(localStorageKey.USER_DATA)
        return userData
            ? JSON.parse(userData)
            : { full_name: "Guest" }
    } catch (error) {
        console.error("Error parsing user data:", error)
        return { full_name: "Guest" }
    }
}
