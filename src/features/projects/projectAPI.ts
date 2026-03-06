import { data } from "react-router";
import { apiService } from "../../api/apiService";
import { API_ENDPOINTS } from "../../api/endpoints";

export interface Project{
    id: number,
    Name : string,
    Description : string,
    ClientName : string,
    ProjectValue : number,
    StartDate : Date,
    EndDate : Date,
    Status : boolean,
    ManagedByPartnerId : number,
    ProfileId : number,
    TechnologyStack : string,
    ManagerName : string,
    ManagerEmail : string,
    ManagerContact : string,
    LeaveApplyWay : string,
    ClientManagerName : string,
    ClientManagerEmail : string,
    ClientManagerContact : string,
    IsSmooth : boolean,
    MobileNumberUsed : number,
    InterviewingUserId : number,
    IsToolUsed : boolean
}
export interface RegisterProjectPayload {
      Name : string,
    Description : string,
    ClientName : string,
    ProjectValue : number,
    StartDate : Date,
    EndDate : Date,
    Status : boolean,
    ManagedByPartnerId : number,
    ProfileId : number,
    TechnologyStack : string,
    ManagerName : string,
    ManagerEmail : string,
    ManagerContact : string,
    LeaveApplyWay : string,
    ClientManagerName : string,
    ClientManagerEmail : string,
    ClientManagerContact : string,
    IsSmooth : boolean,
    MobileNumberUsed : number,
    InterviewingUserId : number,
    IsToolUsed : boolean
}

export const getAllProjects = async () => {
    const res = await apiService.get<{data : Project[]}>(
        API_ENDPOINTS.PROJECT.GET_ALL
    );
    return res.data;
};

export const registerProject = (data : RegisterProjectPayload) =>
    apiService.post(API_ENDPOINTS.PROJECT.CREATE,data);

export const deleteProject = (id : number) =>
    apiService.delete(API_ENDPOINTS.PROJECT.DELETE(id));

export const getProjectById = (id : number) =>
    apiService.get(API_ENDPOINTS.PROJECT.GET_BY_ID(id));

export const updateProject = ( id: number) =>
    apiService.put(API_ENDPOINTS.PROJECT.UPDATE(id),data);

export const patchProject = (id : number) =>
    apiService.patch(API_ENDPOINTS.PROJECT.PATCH(id));

