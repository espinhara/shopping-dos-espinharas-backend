export default function (): string {
  return Math.floor(Math.random() * 2176782335).toString(36).toUpperCase().padStart(6, '0');
}