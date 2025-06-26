import { createAppSlice } from "@/app/createAppSlice";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Project } from "../projects/projectSlice";
import { storageLocalAPI } from "@/LocalAPI/storage/storageLocalAPI";

type UserProfile = {
    id: string;
    firstName: string;
    lastName: string;
    nickname: string;
    role: string;
    description?: string;
    workplace?: string;
    portfolio: Project[];
}

const initialState: UserProfile = {
    id: "",
    firstName: "",
    lastName: "",
    nickname: "",
    role: "",
    description: "",
    workplace: "",
    portfolio: [],
}

const profileSlice = createAppSlice({
    name: "profile",
    initialState,

    reducers: create => ({
        getProfile: create.reducer(
            (state: UserProfile, action: PayloadAction<string>) => {

                const user = storageLocalAPI.getProfile(action.payload);
                state.id = user.id;
                state.firstName = user.firstName;
                state.lastName = user.lastName;
                state.nickname = user.nickname;
                state.role = user.role;
                state.description = user.description ?? "";
                state.workplace = user.workplace ?? "";
                state.portfolio = [];
                
                console.log("Профиль загружен:", user);

            }
        ),

        addWorkplace: create.reducer(
            (state: UserProfile, action: PayloadAction<string>) => {
                state.workplace = action.payload;
            }
        ),

        addDescription: create.reducer(
            (state: UserProfile, action: PayloadAction<string>) => {
                state.description = action.payload;
            }
        )
    }),

    selectors: {
        selectProfile: (state: UserProfile) => state,
        selectProfileID: (state: UserProfile) => state.id,
        selectProfileFirstName: (state: UserProfile) => state.firstName,
        selectProfileLastName: (state: UserProfile) => state.lastName,
        selectProfileNickname: (state: UserProfile) => state.nickname,
        selectProfileRole: (state: UserProfile) => state.role,
        selectProfileDescription: (state: UserProfile) => state.description,
        selectProfileWorkplace: (state: UserProfile) => state.workplace,
        selectProfilePortfolio: (state: UserProfile) => state.portfolio,
    }
})

export const { getProfile, addWorkplace, addDescription } = profileSlice.actions;
export const { selectProfile, selectProfileID, selectProfileFirstName, selectProfileLastName, selectProfileNickname, selectProfileRole, selectProfileDescription, selectProfileWorkplace, selectProfilePortfolio } = profileSlice.selectors;
export { profileSlice };
export type { UserProfile };