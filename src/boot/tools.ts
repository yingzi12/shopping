import pica from "pica";
import { compressAccurately } from 'image-conversion';

export function tansParams(params: { [x: string]: any; }) {
    let result = ''
    for (const propName of Object.keys(params)) {
        const value = params[propName];
        const part = encodeURIComponent(propName) + "=";
        if (value !== null && value !== "" && typeof (value) !== "undefined") {
            if (typeof value === 'object') {
                for (const key of Object.keys(value)) {
                    if (value[key] !== null && value[key] !== "" && typeof (value[key]) !== 'undefined') {
                        const params = propName + '[' + key + ']';
                        const subPart = encodeURIComponent(params) + "=";
                        result += subPart + encodeURIComponent(value[key]) + "&";
                    }
                }
            } else {
                result += part + encodeURIComponent(value) + "&";
            }
        }
    }
    return result
}
export function compressIfNeeded(file) {
  if (file.size > 500 * 1024) {
    return compressImage(file).catch(error => {
      console.error('Compression failed', error);
      return file;
    });
  } else {
    return file;
  }
}

export  function compressIfNeededBatch(files: FileList): File[] {
    const processedFiles: File[] = []; // 用于存储处理后的文件

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (file.size > 500 * 1024) {
            // 尝试压缩文件并处理可能的错误
            try {
                const compressedFile =  compressImage(file);
                processedFiles.push(compressedFile);
            } catch (error) {
                console.error('Compression failed for', file.name, error);
                // 如果压缩失败，仍然将原始文件加入列表
                processedFiles.push(file);
            }
        } else {
            // 直接添加小于等于指定大小的文件
            processedFiles.push(file);
        }
    }

    // 所有文件处理完毕后，返回处理后的文件列表
    return processedFiles;
}

// 压缩图片的函数
export function compressImage(file) {
  // console.log("---------compressImage---------------");
  const picaInstance = pica();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let targetWidth = img.width;
        let targetHeight = img.height;
        if (img.width > 1920) {
          targetWidth = 1920;
          targetHeight = (img.height / img.width) * 1920;
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        picaInstance.resize(img, canvas, {
          unsharpAmount: 80,
          unsharpRadius: 0.6,
          unsharpThreshold: 2
        })
          .then(resizedCanvas => picaInstance.toBlob(resizedCanvas, 'image/jpeg', 0.8))
          .then(blob => {
            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
          })
          .catch(error => {
            reject(error);
          });
      };
      img.onerror = () => reject(new Error('Image load error'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('FileReader error'));
    reader.readAsDataURL(file);
  });
}


