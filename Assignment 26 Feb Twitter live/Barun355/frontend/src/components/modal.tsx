import { useEffect, useRef } from "react";

const Modal = ({ isOpen, onClose, onAction, onCancel, children }: { isOpen: boolean, onClose: () => void, onAction: () => void, onCancel: () => void, children: React.ReactNode}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal(); // Open the modal
    } else {
      dialogRef.current?.close(); // Close the modal
    }
  }, [isOpen]);

  const handleAction = () => {
    onAction(); // Call the action function
    onClose(); // Close the modal
  };

  const handleCancel = () => {
    onCancel(); // Call the cancel function
    onClose(); // Close the modal
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="p-6 rounded-lg shadow-lg backdrop:bg-gray-900 backdrop:opacity-50"
    >
      <div className="flex flex-col space-y-4">
        {children} {/* Render children inside the modal */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleAction}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default Modal;