export function slugifyProfileName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getProfilePath(role: 'user' | 'reporter', name: string) {
  return `/${role === 'reporter' ? 'reporters' : 'users'}/${slugifyProfileName(name)}`;
}
