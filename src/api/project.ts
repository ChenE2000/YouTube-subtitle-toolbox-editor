import http from "./http";

class ProjectDataService {
    async getAll() {
        return await http.get("/project/all");
    }

}
const projectDataService = new ProjectDataService();
export default projectDataService;