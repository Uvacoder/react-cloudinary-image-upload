import React, { useState, useEffect } from "react";
import Dropzone from "react-dropzone";
import MagicGrid from "magic-grid";
import "./App.css";

export default function App() {
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    getImages();
  }, []);

  const getImages = async () => {
    try {
      const res = await fetch("http://localhost:4000/images");
      if (!res.ok) {
        throw new Error();
      }
      const data = await res.json();
      setImages(data.resources);
    } catch (err) {
      console.error("Error getting uploaded images", err.message);
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
    setUploading(true);
    const res = await fetch("http://localhost:4000/upload", {
      method: "POST",
      body: imageData
    });
    const data = await res.json();
    setUploading(false);
    console.log(data);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <ListImages images={images} />
      <Dropzone onDrop={onDrop}>
        {({ getRootProps, getInputProps, isDragActive }) => {
          return (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p
                  style={{
                    fontWeight: "bold",
                    border: "3px dashed red",
                    padding: "0.2em"
                  }}
                >
                  Drop image here
                </p>
              ) : (
                <p>Drop your image here, or click to select image for upload</p>
              )}
            </div>
          );
        }}
      </Dropzone>
      <ListFiles files={files} />
      {files.length > 0 && (
        <button onClick={uploadFiles}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      )}
    </div>
  );
}

const ListImages = ({ images }) =>
  images.map(image => (
    <img style={{ width: "400px" }} key={image.id} src={image.url} />
  ));

const ListFiles = ({ files }) =>
  files.map(file => (
    <div
      key={file.name}
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <img
        style={{
          borderRadius: "50%",
          width: "100px",
          height: "100px",
          objectFit: "cover"
        }}
        src={file.preview}
        alt="File to upload"
      />
      <p>
        {file.name} - {file.size} bytes
      </p>
    </div>
  ));
