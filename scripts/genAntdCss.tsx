import fs from 'fs';
import path from 'path';
import { extractStyle } from '@ant-design/cssinjs';
import { createHash } from 'crypto';
import type Entity from '@ant-design/cssinjs/lib/Cache';

export type DoExtraStyleOptions = {
    cache: Entity;
    dir?: string;
    baseFileName?: string;
};

export function doExtraStyle(options: DoExtraStyleOptions) {
    const {
        cache,
        dir = 'antd-output',
        baseFileName = 'antd.min',
    } = options;

    // const baseDir = path.resolve(__dirname, '../../static/css');
    const baseDir = path.resolve(process.cwd(), 'public', 'static', 'css');
    const outputCssPath = path.join(baseDir, dir);
    if (!fs.existsSync(outputCssPath)) {
        fs.mkdirSync(outputCssPath, { recursive: true });
    }

    const css = extractStyle(cache, true);
    if (!css) return '';

    const md5 = createHash('md5');
    const hash = md5.update(css).digest('hex');
    const fileName = `${baseFileName}.css`;
    const fullpath = path.join(outputCssPath, fileName);

    const res = `_next/static/css/${dir}/${fileName}`;
    if (fs.existsSync(fullpath)) return res;

    fs.writeFileSync(fullpath, css);

    return res;
}

function copyFile(sourcePath: string, destinationPath: string) {
    try {
        const sourceContent = fs.readFileSync(sourcePath, 'utf-8');
        fs.writeFileSync(destinationPath, sourceContent, 'utf-8');
    } catch (error: any) {
        console.error(`Lỗi khi sao chép tệp: ${error.message}`);
    }
}
