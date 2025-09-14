import { useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { useFaceApi } from "./hooks/useFaceApi";

const App = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [encoding, setEncoding] = useState<number[] | null>(null);
  const { modelsLoaded } = useFaceApi();

  // Activar cámara
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("No se pudo acceder a la cámara", err);
    }
  };

  // Capturar frame como imagen
  const captureImage = async () => {
    if (!modelsLoaded) {
      alert("⚠️ Los modelos aún no están cargados");
      return;
    }

    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL("image/png");
    setImage(dataUrl);

    // Procesar rostro con face-api
    const detection = await faceapi
      .detectSingleFace(canvas)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (detection) {
      const vector = Array.from(detection.descriptor); // encoding como array
      setEncoding(vector);
      console.log("✅ Encoding generado:", vector);
    } else {
      console.warn("⚠️ No se detectó ningún rostro");
    }
  };

  // Enviar a API
  const enviarDatos = async () => {
    if (!image || !encoding) {
      alert("Primero captura una foto y espera el encoding.");
      return;
    }

    const blob = await (await fetch(image)).blob(); // convertir base64 → blob
    const formData = new FormData();
    formData.append("nombre", "Empleado de prueba");
    formData.append("encoding", JSON.stringify(encoding));
    formData.append("foto", blob, "captura.png");

    try {
      const res = await fetch("http://localhost:8000/api/empleados", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log("Respuesta API:", data);
    } catch (err) {
      console.error("Error al enviar datos:", err);
    }
  };

  return (
    <div>
      <button onClick={startCamera}>Activar Cámara</button>
      <video ref={videoRef} autoPlay style={{ width: "300px" }} />
      <button onClick={captureImage}>Capturar Foto</button>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {image && <img src={image} alt="captura" width="300" />}
      {encoding && <p>✅ Encoding generado ({encoding.length} valores)</p>}

      <button onClick={enviarDatos}>Enviar a API</button>
    </div>
  );
};

export default App;
