import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const zip = new AdmZip();
const packageDir = path.join(process.cwd(), 'lumo-package');

zip.addLocalFolder(packageDir, 'lumo-package');

const outPublicPath = path.join(publicDir, 'lumo-bundle.zip');
const outRootPath = path.join(process.cwd(), 'lumo-bundle.zip');

zip.writeZip(outPublicPath);
zip.writeZip(outRootPath);

console.log('ZIP Created Successfully at:');
console.log('1. ' + outPublicPath);
console.log('2. ' + outRootPath);
