import { AlertTriangle, LoaderCircle } from "lucide-react";

export default function ConfirmationModal({
  isModalOpen,
  setIsModalOpen,
  handleConfirm,
  isPending,
  message,
  title,
}: {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleConfirm: () => void;
  isPending: boolean;
  message: string;
  title: string;
}) {
  return (
    <div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-100 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-100 text-center animate-in fade-in zoom-in duration-200">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-600 mb-6">{message}</p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  handleConfirm();
                  setIsModalOpen(false)
                }}
                disabled={isPending}
                className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isPending ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  "confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
