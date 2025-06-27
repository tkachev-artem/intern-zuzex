import { createAppSlice } from "@/app/createAppSlice";
import type { PayloadAction } from "@reduxjs/toolkit";

//импортируем функции из LocalAPI 
import { projectLocalAPI } from "@/LocalAPI";

type ProjectLink = {
    name: string;
    url: string;
}

type Project = {
    id: string;
    title: string;
    description?: string;
    links: ProjectLink[];
    previewImage?: string;
}

const initialState: Project[] = projectLocalAPI.getProjects();

const projectSlice = createAppSlice({
    name: "projects",
    initialState,

    reducers: create => ({
        makeProject: create.reducer(
            (state: Project[], action: PayloadAction<Project>) => {
                state.push(action.payload);
                projectLocalAPI.createProject(action.payload); //сохраняем проект в localStorage
            }
        ),
        updateProject: create.reducer(
            (state: Project[], action: PayloadAction<Project>) => {
                const index = state.findIndex(project => project.id === action.payload.id);
                if (index !== -1) {
                    state[index] = action.payload;
                }
                projectLocalAPI.updateProject(action.payload); //обновляем проект в localStorage
            }
        ),
        deleteProject: create.reducer(
            (state: Project[], action: PayloadAction<string>) => {
                // Используем правильный способ обновления состояния с Immer
                const index = state.findIndex(project => project.id === action.payload);
                if (index !== -1) {
                    state.splice(index, 1);
                }
                projectLocalAPI.deleteProject(action.payload); //удаляем проект из localStorage
            }
        )
    }),

    selectors: {
        selectProjects: (state: Project[]) => state,
    }
})

export const { makeProject, updateProject, deleteProject } = projectSlice.actions;
export const { selectProjects } = projectSlice.selectors;
export { projectSlice };
export type { Project, ProjectLink };