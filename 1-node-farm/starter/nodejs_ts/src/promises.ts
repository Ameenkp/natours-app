import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

export const readAndWrite = async function readAndWrite(inputFilePath: string, outputFilePath: string) {
  try {
    const data = await readFileAsync(inputFilePath, 'utf-8');
    const parsedData: Product[] = JSON.parse(data);
    console.log('Number of products :', parsedData.length);

    await writeFileAsync(outputFilePath, data);
  } catch (error) {
    console.error('error :', (error as Error).message);
    throw new Error((error as Error).message);
  }
  return 'Everything is Done 😼';
};
