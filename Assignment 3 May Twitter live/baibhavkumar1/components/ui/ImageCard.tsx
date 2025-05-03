import { ImageMetadata } from '@/types';
import { Button } from './Button';
import Image from 'next/image';

interface ImageCardProps {
    image: ImageMetadata;
    onProcess: (imageId: string) => void;
    onDownload: (imageId: string) => void;
}

export function ImageCard({ image, onProcess, onDownload }: ImageCardProps) {
    const isProcessed = image.status === 'processed';
    const isFailed = image.status === 'failed';
    
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            {/* Image Preview */}
            <div className="relative aspect-square">
                <Image
                    src={image.originalPath}
                    alt={image.originalName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
            </div>

            {/* Image Details */}
            <div className="p-4">
                <h3 className="font-medium text-gray-900 truncate" title={image.originalName}>
                    {image.originalName}
                </h3>
                
                <div className="mt-2 space-y-2 text-sm text-gray-500">
                    <p>
                        Size: {(image.size / 1024).toFixed(2)} KB
                    </p>
                    <p>
                        Dimensions: {image.dimensions.width} x {image.dimensions.height}
                    </p>
                    <p>
                        Status: <StatusBadge status={image.status} />
                    </p>
                </div>

                {/* Actions */}
                <div className="mt-4 space-x-2 flex">
                    {!isProcessed && !isFailed && (
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => onProcess(image.id)}
                            className="flex-1"
                        >
                            Process
                        </Button>
                    )}
                    
                    {isProcessed && (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onDownload(image.id)}
                            className="flex-1"
                        >
                            Download
                        </Button>
                    )}
                    
                    {isFailed && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onProcess(image.id)}
                            className="flex-1"
                        >
                            Retry
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

// Status Badge Component
function StatusBadge({ status }: { status: ImageMetadata['status'] }) {
    const styles = {
        uploaded: 'bg-blue-100 text-blue-800',
        processed: 'bg-green-100 text-green-800',
        failed: 'bg-red-100 text-red-800'
    };

    const labels = {
        uploaded: 'Uploaded',
        processed: 'Processed',
        failed: 'Failed'
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
            {labels[status]}
        </span>
    );
}