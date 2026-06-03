import dialogUtils from "./DialogUtils";

export default class FileUtils {

    static downloadBlob(blob: Blob, fileName: string) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName || 'file.blob';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    }

    static async downloadFromUrl(fileUrl: string, name: string) {
        try {
            const link = document.createElement('a');
            link.style.display = 'none';
            link.download = name;

            const blob = await fetch(fileUrl).then(res => res.blob());
            const url = window.URL.createObjectURL(blob);
            link.href = url;
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);
        }
        catch (error) {
            dialogUtils.showResponseError(error, 'DOWNLOAD_FILE_FROM_URL')
        }
    }

    static getFileName(url: string) {
        return url.substring(url.lastIndexOf('/') + 1);
    }

    static getFileExtension(url: string) {
        return url.substring(url.lastIndexOf('.') + 1);
    }

}
