import React, { useState, useRef } from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Image, Type, Trash2 } from 'lucide-react';
import './TextEditor.css';

export default function TextEditor() {
  const [content, setContent] = useState('');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState('16');
  const [images, setImages] = useState([]);
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  const fontFamilies = [
    'Arial',
    'Georgia',
    'Times New Roman',
    'Courier New',
    'Verdana',
    'Helvetica',
    'Comic Sans MS',
    'Trebuchet MS',
    'Impact'
  ];

  const fontSizes = ['12', '14', '16', '18', '20', '24', '28', '32', '36', '48'];

  const applyStyle = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleFontFamilyChange = (e) => {
    const newFont = e.target.value;
    setFontFamily(newFont);
    applyStyle('fontName', newFont);
  };

  const handleFontSizeChange = (e) => {
    const newSize = e.target.value;
    setFontSize(newSize);
    const sizeMap = {
      '12': '1', '14': '2', '16': '3', '18': '4',
      '20': '5', '24': '6', '28': '6', '32': '7',
      '36': '7', '48': '7'
    };
    applyStyle('fontSize', sizeMap[newSize] || '3');
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        
        reader.onload = (event) => {
          const imageData = {
            id: Date.now() + Math.random(),
            src: event.target.result,
            name: file.name,
            size: (file.size / 1024).toFixed(2) + ' KB'
          };
          
          setImages(prev => [...prev, imageData]);
          
          const img = `<img src="${event.target.result}" style="max-width: 100%; height: auto; margin: 10px 0;" alt="${file.name}" />`;
          document.execCommand('insertHTML', false, img);
        };
        
        reader.readAsDataURL(file);
      }
    });
    
    e.target.value = '';
  };

  const deleteImage = (imageId) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="editor-container">
      <div className="editor-wrapper">
        <div className="editor-card">
          {/* Header */}
          <div className="editor-header">
            <h1 className="editor-title">
              <Type className="title-icon" />
              Rich Text Editor
            </h1>
            <p className="editor-subtitle">Create and style your content with ease</p>
          </div>

          {/* Toolbar */}
          <div className="editor-toolbar">
            <div className="toolbar-content">
              {/* Font Family */}
              <div className="toolbar-group">
                <label className="toolbar-label">Font:</label>
                <select
                  value={fontFamily}
                  onChange={handleFontFamilyChange}
                  className="toolbar-select"
                >
                  {fontFamilies.map(font => (
                    <option key={font} value={font} style={{ fontFamily: font }}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>

              {/* Font Size */}
              <div className="toolbar-group">
                <label className="toolbar-label">Size:</label>
                <select
                  value={fontSize}
                  onChange={handleFontSizeChange}
                  className="toolbar-select"
                >
                  {fontSizes.map(size => (
                    <option key={size} value={size}>{size}px</option>
                  ))}
                </select>
              </div>

              {/* Divider */}
              <div className="toolbar-divider"></div>

              {/* Text Formatting */}
              <div className="toolbar-buttons">
                <button
                  onClick={() => applyStyle('bold')}
                  className="toolbar-button"
                  title="Bold"
                >
                  <Bold className="button-icon" />
                </button>
                <button
                  onClick={() => applyStyle('italic')}
                  className="toolbar-button"
                  title="Italic"
                >
                  <Italic className="button-icon" />
                </button>
                <button
                  onClick={() => applyStyle('underline')}
                  className="toolbar-button"
                  title="Underline"
                >
                  <Underline className="button-icon" />
                </button>
              </div>

              {/* Divider */}
              <div className="toolbar-divider"></div>

              {/* Alignment */}
              <div className="toolbar-buttons">
                <button
                  onClick={() => applyStyle('justifyLeft')}
                  className="toolbar-button"
                  title="Align Left"
                >
                  <AlignLeft className="button-icon" />
                </button>
                <button
                  onClick={() => applyStyle('justifyCenter')}
                  className="toolbar-button"
                  title="Align Center"
                >
                  <AlignCenter className="button-icon" />
                </button>
                <button
                  onClick={() => applyStyle('justifyRight')}
                  className="toolbar-button"
                  title="Align Right"
                >
                  <AlignRight className="button-icon" />
                </button>
              </div>

              {/* Divider */}
              <div className="toolbar-divider"></div>

              {/* Image Upload */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="image-upload-button"
              >
                <Image className="button-icon" />
                Add Image
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="file-input-hidden"
              />
            </div>
          </div>

          {/* Editor Area */}
          <div className="editor-content">
            <div
              ref={editorRef}
              contentEditable
              onInput={handleContentChange}
              className="editor-area"
              style={{
                fontFamily: fontFamily,
                fontSize: fontSize + 'px'
              }}
              placeholder="Start typing here..."
            />
          </div>

          {/* Image Manager */}
          {images.length > 0 && (
            <div className="image-manager">
              <h2 className="image-manager-title">
                <Image className="button-icon" />
                Image Storage ({images.length})
              </h2>
              <div className="image-grid">
                {images.map(image => (
                  <div key={image.id} className="image-card">
                    <img
                      src={image.src}
                      alt={image.name}
                      className="image-thumbnail"
                    />
                    <div className="image-info">
                      <p className="image-name" title={image.name}>
                        {image.name}
                      </p>
                      <p className="image-size">{image.size}</p>
                    </div>
                    <button
                      onClick={() => deleteImage(image.id)}
                      className="image-delete-button"
                      title="Delete image"
                    >
                      <Trash2 className="delete-icon" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}