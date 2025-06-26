import { createAppSlice } from "@/app/createAppSlice";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Project } from "../projects/projectSlice";
import { storageLocalAPI } from "@/LocalAPI/storage/storageLocalAPI";
import { authLocalAPI } from "@/LocalAPI/auth/authLocalAPI";

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
                state.portfolio = user.portfolio;
            }
        ),

        getProfileByNickname: create.reducer(
            (state: UserProfile, action: PayloadAction<string>) => {

                const user = storageLocalAPI.getProfileByNickname(action.payload);
                state.id = user.id;
                state.firstName = user.firstName;
                state.lastName = user.lastName;
                state.nickname = user.nickname;
                state.role = user.role;
                state.description = user.description ?? "";
                state.workplace = user.workplace ?? "";
                state.portfolio = user.portfolio;
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
        ),

        updateProfile: create.reducer(
            (state: UserProfile, action: PayloadAction<Partial<UserProfile>>) => {
                Object.assign(state, action.payload);
                
                const updatedUser = {
                    id: state.id,
                    nickname: state.nickname,
                    firstName: state.firstName,
                    lastName: state.lastName,
                    password: authLocalAPI.getUserByNickname(state.nickname)?.password ?? "",
                    role: state.role,
                    email: authLocalAPI.getUserByNickname(state.nickname)?.email ?? "",
                    createdAt: authLocalAPI.getUserByNickname(state.nickname)?.createdAt ?? "",
                    description: state.description,
                    workplace: state.workplace,
                    portfolio: state.portfolio
                };
                
                authLocalAPI.updateUser(updatedUser);
            }
        ),

        addProjectToPortfolio: create.reducer(
            (state: UserProfile, action: PayloadAction<Project>) => {
                state.portfolio.push(action.payload);
            }
        ),

        updateProjectInPortfolio: create.reducer(
            (state: UserProfile, action: PayloadAction<Project>) => {
                const index = state.portfolio.findIndex(project => project.id === action.payload.id);
                if (index !== -1) {
                    state.portfolio[index] = action.payload;
                }
            }
        ),
        removeProjectFromPortfolio: create.reducer(
            (state: UserProfile, action: PayloadAction<string>) => {
                state.portfolio = state.portfolio.filter(project => project.id !== action.payload);
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

export const { getProfile, getProfileByNickname, addWorkplace, addDescription, updateProfile, addProjectToPortfolio, updateProjectInPortfolio, removeProjectFromPortfolio } = profileSlice.actions;
export const { selectProfile, selectProfileID, selectProfileFirstName, selectProfileLastName, selectProfileNickname, selectProfileRole, selectProfileDescription, selectProfileWorkplace, selectProfilePortfolio } = profileSlice.selectors;
export { profileSlice };
export type { UserProfile };