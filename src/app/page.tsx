import fs from 'fs';
import path from 'path';
import ClientScrollyWrapper from './ClientScrollyWrapper';

function getSequenceUrls(sequenceName: string): string[] {
  try {
    const dirPath = path.join(process.cwd(), 'public', sequenceName);
    const files = fs.readdirSync(dirPath);
    const imageFiles = files
      .filter((file) => {
        const ext = file.toLowerCase();
        return ext.endsWith('.webp') || ext.endsWith('.png') || ext.endsWith('.jpg') || ext.endsWith('.jpeg');
      })
      .sort((a, b) => a.localeCompare(b));
    return imageFiles.map((file) => `/${sequenceName}/${file}`);
  } catch {
    return [];
  }
}

export default function Home() {
  const sequence2Urls = getSequenceUrls('sequence2');

  return (
    <ClientScrollyWrapper
      sequence2Urls={sequence2Urls}
    />
  );
}
