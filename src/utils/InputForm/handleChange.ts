import type { Ref } from 'vue'

// Kích hoạt click vào input file bị ẩn
export function triggerAttachmentFileUpload(inputRef: HTMLInputElement | null) {
  inputRef?.click()
}

// Xử lý khi người dùng chọn file
export function handleAttachmentFileChange(
  event: Event,
  attachmentFiles: Ref<File[]>,
  onFilesChanged: (files: File[]) => void 
) {
  const files = (event.target as HTMLInputElement).files
  if (files) {
    const newFiles = Array.from(files)

    for (const file of newFiles) {
      const alreadyExists = attachmentFiles.value.some(
        (f) => f.name === file.name && f.size === file.size
      )
      if (!alreadyExists) {
        attachmentFiles.value.push(file)
      }
    }

    // Reset input
    (event.target as HTMLInputElement).value = ''

    // Gọi callback để cập nhật modelValue
    onFilesChanged(attachmentFiles.value)
  }
}


export function handleFileChange(
  event: Event,
  fileRef: Ref<File | null>,
  fileNameRef: Ref<string | null>,
  previewUrlRef?: Ref<string>
) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    fileRef.value = file
    fileNameRef.value = file.name

    if (file.type === 'application/pdf' && previewUrlRef) {
      previewUrlRef.value = URL.createObjectURL(file)
    }
    console.log('File selected:', file)
  } else {
    fileRef.value = null
    fileNameRef.value = null
    if (previewUrlRef) previewUrlRef.value = ''
  }
}
