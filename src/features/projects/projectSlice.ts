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

// Состояние теперь пустое, так как проекты хранятся в портфолио пользователей
const initialState: Project[] = [];

const projectSlice = createAppSlice({
    name: "projects",
    initialState,

    reducers: create => ({
        // Загрузка всех проектов из портфолио всех пользователей
        loadAllProjects: create.reducer(
            (state: Project[]) => {
                const projects = projectLocalAPI.getProjects();
                state.length = 0;
                state.push(...projects);
            }
        ),
        
        // Загрузка проектов конкретного пользователя
        loadUserProjects: create.reducer(
            (state: Project[], action: PayloadAction<string>) => {
                const userNickname = action.payload;
                const projects = projectLocalAPI.getProjectsByUser(userNickname);
                state.length = 0;
                state.push(...projects);
            }
        ),

        // Создание проекта больше не используется напрямую
        // Проекты создаются через authLocalAPI.addProjectToUserPortfolio
        makeProject: create.reducer(
            (state: Project[], action: PayloadAction<{project: Project, userNickname: string}>) => {
                const { project, userNickname } = action.payload;
                state.push(project);
                projectLocalAPI.createProject(project, userNickname);
            }
        ),
        
        updateProject: create.reducer(
            (state: Project[], action: PayloadAction<{project: Project, userNickname?: string}>) => {
                const { project, userNickname } = action.payload;
                const index = state.findIndex(p => p.id === project.id);
                if (index !== -1) {
                    state[index] = project;
                }
                projectLocalAPI.updateProject(project, userNickname);
            }
        ),
        
        deleteProject: create.reducer(
            (state: Project[], action: PayloadAction<{projectId: string, userNickname?: string}>) => {
                const { projectId, userNickname } = action.payload;
                const index = state.findIndex(p => p.id === projectId);
                if (index !== -1) {
                    state.splice(index, 1);
                }
                projectLocalAPI.deleteProject(projectId, userNickname);
            }
        )
    }),

    selectors: {
        selectProjects: (state: Project[]) => state,
    }
})

export const { loadAllProjects, loadUserProjects, makeProject, updateProject, deleteProject } = projectSlice.actions;
export const { selectProjects } = projectSlice.selectors;
export { projectSlice };
export type { Project, ProjectLink };