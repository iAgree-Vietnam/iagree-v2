export const HiddenFileInputs: React.FC<{
  documentInputRef: React.RefObject<HTMLInputElement>
  imageInputRef: React.RefObject<HTMLInputElement>
  videoInputRef: React.RefObject<HTMLInputElement>
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>, fileType: "files" | "images" | "videos") => void
}> = ({ documentInputRef, imageInputRef, videoInputRef, onFileSelect }) => {
  return (
    <>
      <input
        ref={documentInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.txt,.zip,.rar"
        style={{ display: "none" }}
        onChange={(e) => onFileSelect(e, "files")}
      />
      <input
        ref={imageInputRef}
        type="file"
        multiple
        accept=".jpg,.jpeg,.png,.gif,.webp"
        style={{ display: "none" }}
        onChange={(e) => onFileSelect(e, "images")}
      />
      <input
        ref={videoInputRef}
        type="file"
        multiple
        accept=".mp4,.webm,.ogg,.mov"
        style={{ display: "none" }}
        onChange={(e) => onFileSelect(e, "videos")}
      />
    </>
  )
}

