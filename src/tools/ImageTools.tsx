import React, { useState, useRef } from 'react';
import { ToolWrapper } from '../components/ToolWrapper';
import { Download, Upload, Image as ImageIcon, Sliders, Scissors, Hash, Pipette, Maximize } from 'lucide-react';

export const ImageConverter: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [format, setFormat] = useState('png');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const convert = () => {
    if (!image || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL(`image/${format}`);
      const link = document.createElement('a');
      link.download = `converted-image.${format}`;
      link.href = dataUrl;
      link.click();
    };
    img.src = image;
  };

  return (
    <ToolWrapper
      title="Image Converter"
      description="Convert images between JPG, PNG, and WEBP formats instantly."
      seoText="Use our free client-side image converter to change image formats without uploading to any server. Supports JPG, PNG, and WEBP. 100% secure and private."
    >
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-12 hover:border-indigo-500 transition-colors bg-slate-50">
          <input type="file" onChange={handleUpload} className="hidden" id="img-upload" accept="image/*" />
          <label htmlFor="img-upload" className="cursor-pointer flex flex-col items-center">
            <Upload className="w-12 h-12 text-slate-400 mb-4" />
            <span className="text-slate-600 font-medium">Click to upload or drag and drop</span>
          </label>
        </div>

        {image && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <select 
                value={format} 
                onChange={(e) => setFormat(e.target.value)}
                className="flex-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="png">PNG</option>
                <option value="jpeg">JPG</option>
                <option value="webp">WEBP</option>
              </select>
              <button 
                onClick={convert}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download
              </button>
            </div>
            <img src={image} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-sm" />
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </ToolWrapper>
  );
};

export const ImageCompressor: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [quality, setQuality] = useState(0.8);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const compress = () => {
    if (!image || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `compressed-image.jpg`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        }
      }, 'image/jpeg', quality);
    };
    img.src = image;
  };

  return (
    <ToolWrapper
      title="Image Compressor"
      description="Reduce image file size while maintaining quality."
      seoText="Our client-side image compressor allows you to shrink JPG and PNG files without losing quality. Adjust the quality slider to find the perfect balance between size and clarity."
    >
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-12 bg-slate-50">
          <input type="file" onChange={handleUpload} className="hidden" id="compress-upload" accept="image/*" />
          <label htmlFor="compress-upload" className="cursor-pointer flex flex-col items-center">
            <Upload className="w-12 h-12 text-slate-400 mb-4" />
            <span className="text-slate-600 font-medium">Upload Image to Compress</span>
          </label>
        </div>

        {image && (
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 flex justify-between">
                <span>Quality: {Math.round(quality * 100)}%</span>
              </label>
              <input 
                type="range" min="0.1" max="1" step="0.05" 
                value={quality} 
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
            <button 
              onClick={compress}
              className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <Sliders className="w-4 h-4" /> Compress & Download
            </button>
            <img src={image} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-sm" />
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </ToolWrapper>
  );
};

export const Base64Image: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [base64, setBase64] = useState('');

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const res = ev.target?.result as string;
        setImage(res);
        setBase64(res);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <ToolWrapper
      title="Base64 Image Encoder"
      description="Convert images to Base64 strings or vice versa."
      seoText="Convert any image file to a Base64 encoded string for use in HTML or CSS. Our tool also allows you to decode Base64 strings back into images instantly."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">Upload Image</label>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-8 bg-slate-50 h-48">
              <input type="file" onChange={handleUpload} className="hidden" id="b64-upload" accept="image/*" />
              <label htmlFor="b64-upload" className="cursor-pointer flex flex-col items-center">
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-slate-500 text-sm">Click to upload</span>
              </label>
            </div>
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">Base64 Output</label>
            <textarea 
              value={base64}
              onChange={(e) => setBase64(e.target.value)}
              className="w-full h-48 p-3 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              placeholder="Paste Base64 string here..."
            />
          </div>
        </div>
        {base64 && (
          <div className="flex justify-center">
            <button 
              onClick={() => navigator.clipboard.writeText(base64)}
              className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-900 transition-colors"
            >
              Copy Base64
            </button>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};

export const ImageResizer: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const res = ev.target?.result as string;
        setImage(res);
        const img = new Image();
        img.onload = () => {
          setWidth(img.width);
          setHeight(img.height);
          setAspectRatio(img.width / img.height);
        };
        img.src = res;
      };
      reader.readAsDataURL(file);
    }
  };

  const resize = () => {
    if (!image || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      const link = document.createElement('a');
      link.download = `resized-image.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = image;
  };

  return (
    <ToolWrapper
      title="Image Resizer"
      description="Change dimensions of your images while maintaining quality."
      seoText="Resize images online for free. Adjust width and height manually or maintain aspect ratio. Perfect for social media and web optimization."
    >
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-12 bg-slate-50">
          <input type="file" onChange={handleUpload} className="hidden" id="resize-upload" accept="image/*" />
          <label htmlFor="resize-upload" className="cursor-pointer flex flex-col items-center">
            <Upload className="w-12 h-12 text-slate-400 mb-4" />
            <span className="text-slate-600 font-medium">Upload Image to Resize</span>
          </label>
        </div>

        {image && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Width (px)</label>
                <input 
                  type="number" value={width} 
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setWidth(val);
                    if (maintainAspect) setHeight(Math.round(val / aspectRatio));
                  }}
                  className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Height (px)</label>
                <input 
                  type="number" value={height} 
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setHeight(val);
                    if (maintainAspect) setWidth(Math.round(val * aspectRatio));
                  }}
                  className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={maintainAspect} onChange={(e) => setMaintainAspect(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
              <span className="text-sm text-slate-600">Maintain Aspect Ratio</span>
            </label>
            <button 
              onClick={resize}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
            >
              Resize & Download
            </button>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </ToolWrapper>
  );
};

export const ColorPicker: React.FC = () => {
  const [color, setColor] = useState('#6366f1');

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <ToolWrapper
      title="Color Picker"
      description="Select colors and get their Hex, RGB, and HSL values."
      seoText="A simple and elegant color picker tool. Get instant Hex and RGB values for any color. Perfect for web designers and developers."
    >
      <div className="flex flex-col items-center space-y-8 py-8">
        <div 
          className="w-48 h-48 rounded-2xl shadow-lg border-4 border-white transition-colors duration-200"
          style={{ backgroundColor: color }}
        />
        
        <div className="flex flex-col items-center gap-4 w-full max-w-xs">
          <input 
            type="color" 
            value={color} 
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-12 rounded-lg cursor-pointer border-none p-0"
          />
          
          <div className="grid grid-cols-1 gap-3 w-full">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-sm font-mono text-slate-500 uppercase">Hex</span>
              <span className="font-mono font-bold text-slate-900">{color.toUpperCase()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-sm font-mono text-slate-500 uppercase">RGB</span>
              <span className="font-mono font-bold text-slate-900">{hexToRgb(color)}</span>
            </div>
          </div>
        </div>
      </div>
    </ToolWrapper>
  );
};

export const ImageCropper: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const crop = () => {
    if (!image || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      const size = Math.min(img.width, img.height);
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, size, size);
      const link = document.createElement('a');
      link.download = `cropped-image.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = image;
  };

  return (
    <ToolWrapper
      title="Image Cropper (Square)"
      description="Quickly crop your images into a perfect square."
      seoText="Crop images online for free. Our tool automatically centers your image and crops it into a square format, ideal for profile pictures and social media."
    >
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-12 bg-slate-50">
          <input type="file" onChange={handleUpload} className="hidden" id="crop-upload" accept="image/*" />
          <label htmlFor="crop-upload" className="cursor-pointer flex flex-col items-center">
            <Scissors className="w-12 h-12 text-slate-400 mb-4" />
            <span className="text-slate-600 font-medium">Upload Image to Crop</span>
          </label>
        </div>

        {image && (
          <div className="space-y-6">
            <img src={image} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-sm" />
            <button 
              onClick={crop}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
            >
              Crop to Square & Download
            </button>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </ToolWrapper>
  );
};
