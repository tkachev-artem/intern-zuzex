import type { Project } from "@/features/projects/projectSlice";
import { storageLocalAPI } from "@/LocalAPI/storage/storageLocalAPI";

//функция получения всех проектов (read)
const getProjects = () : Project[] => {
    const data = storageLocalAPI.getStorageData();
    if (!data) return [];
    return data.projects ?? [];
}

//функция создания проекта (create)
const createProject = (project: Project): void => {
    const projects = getProjects();
    projects.push(project);

    const currentData = storageLocalAPI.getStorageData();
    storageLocalAPI.saveStorageData(
        currentData?.users ?? [],
        currentData?.auth.isAuthenticated ?? false,
        currentData?.auth.user ?? "",
        currentData?.posts ?? [],
        projects
    );
}

//функция обновления проекта (update)
const updateProject = (updated: Project): void => {
    const projects = getProjects();
    const index = projects.findIndex(project => project.id === updated.id);
    if (index !== -1) {
      projects[index] = updated;
      const currentData = storageLocalAPI.getStorageData();
      storageLocalAPI.saveStorageData(
        currentData?.users ?? [],
        currentData?.auth.isAuthenticated ?? false,
        currentData?.auth.user ?? "",
        currentData?.posts ?? [],
        projects
      );
    }
}

//функция удаления проекта (delete)
const deleteProject = (id: string): void => {
    const projects = getProjects();
    const index = projects.findIndex(project => project.id === id);
  
    // Если проект найден, удаляем его из массива
    if (index !== -1) {
      projects.splice(index, 1);
      const currentData = storageLocalAPI.getStorageData();
      storageLocalAPI.saveStorageData(
        currentData?.users ?? [],
        currentData?.auth.isAuthenticated ?? false,
        currentData?.auth.user ?? "",
        currentData?.posts ?? [],
        projects
      );
    }
  };

//экспорт функций
export const projectLocalAPI = {getProjects, createProject, updateProject, deleteProject};