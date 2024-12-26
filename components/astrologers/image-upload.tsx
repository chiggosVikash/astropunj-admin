'use client';

import { CameraIcon, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import useImageStore from '@/stores/image-store';

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (base64: string) => void;
  value: string;
}

export function ImageUpload({
  disabled,
  onChange,
  value,
}: ImageUploadProps) {
  // const [base64, setBase64] = useState(value);

  const { setBase64Image,base64,clearBase64 } = useImageStore();

  const handleChange = useCallback(
    (base64: string) => {
      onChange(base64);
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (files: File[]) => {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        setBase64Image(event.target.result,file.name,'astrologers');
        handleChange(event.target.result);
      };
      reader.readAsDataURL(file);
    },
    [handleChange,setBase64Image]
  );

  const handleRemove = useCallback(() => {
    clearBase64();
    handleChange('');
  }, [handleChange,clearBase64]);

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    onDrop: handleDrop,
    disabled,
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
  });

  return (
    <div
      {...getRootProps({
        className: 'w-full p-4 text-center border-2 border-dashed rounded-lg cursor-pointer',
      })}
    >
      <input {...getInputProps()} />
      {base64 ? (
        <div className="relative">
          <div className="flex items-center justify-center">
            <Image
              src={base64}
              height={100}
              width={100}
              alt="Uploaded image"
              className="rounded-lg"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4">
          <CameraIcon className="h-10 w-10 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </div>
        </div>
      )}
    </div>
  );
}
