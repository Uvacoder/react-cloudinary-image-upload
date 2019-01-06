import React, { useState, useEffect } from "react";
import Dropzone from "react-dropzone";
import "./App.css";

export default function App() {
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);

  useEffect(() => {
    getImages();
  }, []);

  const getImages = async () => {
    try {
      setLoadingImages(true);
      const res = await fetch("http://localhost:4000/images");
      if (!res.ok) {
        throw new Error();
      }
      const data = await res.json();
      setImages(data.resources);
      setLoadingImages(false);
    } catch (err) {
      console.error("Error getting uploaded images", err.message);
      setLoadingImages(false);
    }
  };

  const onDrop = files => {
    // setFiles(files);
    const filesWithPreview = files.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    );
    setFiles(filesWithPreview);
  };

  const uploadFiles = async () => {
    const imageData = new FormData();
    files.forEach((file, i) => {
      imageData.set(i, file);
    });
    setUploadingImage(true);
    const res = await fetch("http://localhost:4000/upload", {
      method: "POST",
      body: imageData
    });
    const uploadedImages = await res.json();
    const newImages = [...uploadedImages, ...images];
    setImages(newImages);
    setUploadingImage(false);
  };

  return (
    <div className="container">
      <Dropzone onDrop={onDrop}>
        {({ getRootProps, getInputProps, isDragActive }) => {
          return (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="drag-active">Drop image here</p>
              ) : (
                <p>Drop your image here, or click to select image for upload</p>
              )}
            </div>
          );
        }}
      </Dropzone>
      <ListFiles files={files} />
      {files.length > 0 && (
        <div className="align-center">
          <button
            className="bttn-unite bttn-md bttn-primary"
            onClick={uploadFiles}
          >
            {uploadingImage ? "Uploading..." : "Upload"}
          </button>
          <button
            className="bttn-unite bttn-md bttn-danger"
            onClick={() => setFiles([])}
          >
            Remove
          </button>
        </div>
      )}
      <ListImages images={images} loadingImages={loadingImages} />
    </div>
  );
}

const ListImages = ({ images, loadingImages }) =>
  loadingImages ? (
    <div>Loading images...</div>
  ) : (
    <>
      <h2>Uploaded Images</h2>
      <div className="image-container">
        {images.map((image, i) => (
          <img
            className="image-uploaded"
            alt="Uploaded file"
            key={i}
            src={image.url}
          />
        ))}
      </div>
    </>
  );

const ListFiles = ({ files }) =>
  files.map(file => (
    <div key={file.name} className="container">
      <img className="image-preview" src={file.preview} alt="File to upload" />
      <p>
        {file.name} - {file.size} bytes
      </p>
    </div>
  ));
