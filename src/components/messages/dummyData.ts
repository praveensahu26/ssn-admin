export interface AttachmentAction {
  id: string;
  label: string;
  type: 'camera' | 'image' | 'audio' | 'document';
}

export const attachmentActions: AttachmentAction[] = [
  { id: 'camera', label: 'Camera', type: 'camera' },
  { id: 'image', label: 'Images', type: 'image' },
  { id: 'audio', label: 'Audio', type: 'audio' },
  { id: 'file', label: 'File', type: 'document' },
];
