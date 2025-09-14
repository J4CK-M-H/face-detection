import { useRef, useState } from "react"

const App = () => {

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);


  // Pedir permiso y mostrar cámara
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("No se pudo acceder a la cámara", err);
    }
  };

  // Capturar frame como imagen
  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/png");
    setImage(dataUrl); // Guardamos la imagen base64
  };

  return (
    <div>
      <button onClick={startCamera}>Activar Cámara</button>
      <video ref={videoRef} autoPlay style={{ width: "300px" }} />
      <button onClick={captureImage}>Capturar Foto</button>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {image && <img src={image} alt="captura" width="300" />}
    </div>
  )
}

export default App