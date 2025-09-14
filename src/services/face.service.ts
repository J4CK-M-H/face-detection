import api from "./api.service";

const faceDetected = async () => {


}


const uploadImage = async (url: string, name?: string) => {

    const blob = await (await fetch(url)).blob();
    const fd = new FormData();
    fd.append("file", blob, "captura.png");
    if (name) fd.append("name", name);

    const res = await api.post(``, {
        method: "POST",
        body: fd,
    });

    // return res.data;
    console.log(fd)
}

export const faceService = {
    faceDetected,
    uploadImage
}