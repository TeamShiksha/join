import { useState } from "react";
import { Input } from "./ui/input";
import { UploadedFiles } from "./UploadedFiles";

const FileUpload = () => {
  const [files, setFiles] = useState<{ name: string; url: string }[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []);

    const filePreviews = selectedFiles.map((file) => ({
      name: file.name,
      url: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
    }));

    setFiles(filePreviews);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800">
        Image Processor
      </h1>
      <p className="text-center text-sm">Convert Images to 512x512</p>
      <Input
        type="file"
        multiple
        onChange={handleFileChange}
        placeholder="Click Here to select multiple files"
      />

      <UploadedFiles uploadFiles={files} />
    </div>
  );
};

export default FileUpload;
