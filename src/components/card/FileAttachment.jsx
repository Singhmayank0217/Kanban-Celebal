"use client";

import { useState } from "react";
import { TrashIcon, DownloadIcon, FileIcon } from "../icons/Icons";

const FileAttachment = ({ attachment, onRemove }) => {
  const [imageError, setImageError] = useState(false);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const getFileType = (filename) => {
    const extension = filename.split(".").pop()?.toLowerCase();
    const imageTypes = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
    return imageTypes.includes(extension) ? "image" : "file";
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = attachment.url;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isImage = getFileType(attachment.name) === "image" && !imageError;

  return (
    <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex-shrink-0">
        {isImage ? (
          <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 dark:bg-gray-700">
            <img
              src={attachment.url || "/placeholder.svg"}
              alt={attachment.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
            <FileIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {attachment.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {formatFileSize(attachment.size)}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={handleDownload}
          className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          title="Download"
        >
          <DownloadIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => onRemove(attachment.id)}
          className="p-1 rounded text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          title="Remove"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default FileAttachment;
