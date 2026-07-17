export interface AttachmentAction {
  id: string;
  label: string;
  type: 'camera' | 'image' | 'audio' | 'document';
}

export const attachmentActions: AttachmentAction[];
