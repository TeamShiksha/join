import { Button } from "./ui/button";

interface UploadedFilesProps {
  uploadFiles: { name: string; url: string }[];
}

export const UploadedFiles = ({ uploadFiles }: UploadedFilesProps) => {
  const handleDownload = async (file: { name: string; url: string }) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = file.url;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = 512;
      canvas.height = 512;

      if (ctx) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        );
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;

        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

        canvas.toBlob((blob) => {
          if (blob) {
            const downloadUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = `resized_${file.name}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(downloadUrl);
          }
        }, "image/jpeg");
      }
    };
  };

  return (
    <div>
      {uploadFiles.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mt-6">
            Uploaded Files
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 overflow-y-auto max-h-96">
            {uploadFiles.map((file, index) => (
              <div key={index} className="space-y-2 text-center">
                {file.url ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-32 object-cover rounded-md shadow"
                  />
                ) : (
                  <div className="w-full h-32 flex items-center justify-center bg-gray-200 rounded-md shadow">
                    <p className="text-sm text-gray-600">Unsupported</p>
                  </div>
                )}
                <p className="text-sm text-gray-700 truncate">{file.name}</p>
                {file.url && (
                  <Button onClick={() => handleDownload(file)}>
                    Download 512x512
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
