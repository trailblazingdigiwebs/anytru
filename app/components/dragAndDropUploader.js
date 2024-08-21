import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
// import Image from 'next/image';
import '../styles/dragAndDropUploader.css';

const DragAndDropUploader = ({ onFileSelected }) => {
    const [preview, setPreview] = useState(null);

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
            onFileSelected(file, previewUrl);
        }
    }, [onFileSelected]);

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div className="drag-and-drop">
            {!preview && (
                <div className="upload grid items-center justify-center" {...getRootProps()}>
                    <input {...getInputProps()} />
                    <div className="uploadimg">
                        <img src="/images/upload-cloud.png" alt="Upload Image"  />
                        <h2>Drag & Drop</h2>
                    </div>
                    <div className="uploadtext">
                        <p>or select files from device</p>
                        <p className="uploadlimit">File Format supported - jpg, jpeg, png</p>
                        <p className="uploadlimit">Max. 5MB</p>
                    </div>
                </div>
            )}
            <div>
                {preview && <img src={preview} alt="Preview" className="preview" />}
            </div>
            <p className="uploadHelpText">For best results, use high-quality images on a solid color background.</p>
        </div>
    );
};

export default DragAndDropUploader;
