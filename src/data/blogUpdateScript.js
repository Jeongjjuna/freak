import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * 빌드할 때 /public/blog의 모든 md 파일을 읽고
 * json 형식으로 글 목록을 관리 합니다.
 */
const BLOG_FILE_PATH = '../../public/blog';
const BLOG_DATA_TARGET_PATH = './';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// public/blog 디렉토리 경로
const blogDir = path.resolve(__dirname, BLOG_FILE_PATH);

// blog 디렉토리 내의 .md 파일 목록 읽기
const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'));

// blogFileNames.json 파일에 저장
const json = JSON.stringify(files, null, 2);
const target = path.resolve(__dirname,  BLOG_DATA_TARGET_PATH);
fs.writeFileSync(path.resolve(target, 'blogFileNames.json'), json);