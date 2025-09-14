import { useEffect, useState } from "react";
import * as faceapi from "face-api.js";

export const useFaceApi = () => {
    const [modelsLoaded, setModelsLoaded] = useState(false);

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = '/models'; // Asegúrate de que esta ruta sea correcta

            try {
                await Promise.all([
                    faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                ]);
                console.log("✅ Modelos de FaceAPI cargados");
                setModelsLoaded(true);
            } catch (error) {
                console.error("❌ Error cargando modelos:", error);
            }
        };

        loadModels();
    }, []);

    return { modelsLoaded };
};
