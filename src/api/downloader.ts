import http from "./http";

class DownloaderDataService {
    async meta(id: string) {
        return await http.get(`/downloader/meta/${id}`);
    }
    async downloadVideo(id: string, quality: string) {
        return await http.post(`/downloader/video_to_server`, {
            id: id, 
            quality: quality
        });
    }
    
}
const downloaderDataService = new DownloaderDataService();
export default downloaderDataService;