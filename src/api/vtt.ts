import http from "./http";

class VttDataService {
    async downloadVtt(link: string, id: string) {
        return await http.post(`/vtt/parse_to_file/${id}`, {
            value: link
        });
    }
    async getParsedVtt(id: string) {
        return await http.get(`/vtt/parsed/${id}`);
    }
    async updateVtt(id: string, filename: string,data: any) {
        console.log({
            id: id,
            filename: filename,
            data: data
        })
        return await http.post(`/vtt/save`, {
            id: id,
            filename: filename,
            data: data
        });
    }
    async download(id: string, filename: string) {
        return await http.get(`/vtt/download/${id}/${filename}}`);
    }
}
const vttDataService = new VttDataService();
export default vttDataService;