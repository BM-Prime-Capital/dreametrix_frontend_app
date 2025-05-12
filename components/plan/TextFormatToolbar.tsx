import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import { 
  Bold, Italic, Underline, 
  AlignLeft, AlignCenter, AlignRight, 
  List, ListOrdered, Undo2, Redo2, 
  Paintbrush, Type, ChevronDown, Save, X 
} from 'lucide-react';
import { Toggle } from '../../ui/Toggle';
import { TextStyles } from '../../types/lessonPlan';

interface TextFormatToolbarProps {
  currentStyles: TextStyles;
  onStyleChange: (styles: Partial<TextStyles>) => void;
  onSave: () => void;
  onCancel: () => void;
}

const TextFormatToolbar: React.FC<TextFormatToolbarProps> = ({
  currentStyles,
  onStyleChange,
  onSave,
  onCancel
}) => {
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);

  const fonts = ['Arial', 'Calibri', 'Times New Roman', 'Verdana'];
  const sizes = ['8', '10', '11', '12', '14', '16', '18', '20', '24'];

  const handleFontSelect = (font: string) => {
    onStyleChange({ fontFamily: font });
    setShowFontDropdown(false);
  };

  const handleSizeSelect = (size: string) => {
    onStyleChange({ fontSize: size });
    setShowSizeDropdown(false);
  };

  const handleListClick = (type: 'bullet' | 'number') => {
    const currentContent = document.querySelector('textarea');
    if (!currentContent) return;

    const start = currentContent.selectionStart;
    const end = currentContent.selectionEnd;
    const text = currentContent.value;
    const selectedText = text.substring(start, end);
    
    const lines = selectedText.split('\n');
    const newLines = lines.map((line, index) => {
      if (line.trim() === '') return line;
      return type === 'bullet' ? `• ${line}` : `${index + 1}. ${line}`;
    });
    
    const newText = text.substring(0, start) + newLines.join('\n') + text.substring(end);
    currentContent.value = newText;
    
    // Trigger content change
    const event = new Event('input', { bubbles: true });
    currentContent.dispatchEvent(event);
  };

  return (
    <div className="border border-gray-300 mb-2 bg-gray-50 rounded-md">
      {/* First row */}
      <div className="flex border-b border-gray-300 p-1">
        {/* Font dropdown */}
        <div className="relative">
          <Button 
            variant="ghost" 
            className="h-8 px-2 text-xs gap-1"
            onClick={() => setShowFontDropdown(!showFontDropdown)}
          >
            <Type className="h-4 w-4" />
            <span>{currentStyles.fontFamily}</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
          {showFontDropdown && (
            <div className="absolute z-50 mt-1 bg-white border border-gray-300 rounded-md shadow-lg py-1 w-40">
              {fonts.map(font => (
                <button 
                  key={font} 
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => handleFontSelect(font)}
                  style={{ fontFamily: font }}
                >
                  {font}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Size dropdown */}
        <div className="relative">
          <Button 
            variant="ghost" 
            className="h-8 px-2 text-xs gap-1"
            onClick={() => setShowSizeDropdown(!showSizeDropdown)}
          >
            <span>{currentStyles.fontSize}</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
          {showSizeDropdown && (
            <div className="absolute z-50 mt-1 bg-white border border-gray-300 rounded-md shadow-lg py-1 w-20">
              {sizes.map(size => (
                <button 
                  key={size} 
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => handleSizeSelect(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Formatting buttons */}
        <div className="flex border-l border-gray-300 ml-1 pl-1">
          <Toggle
            pressed={currentStyles.isBold}
            onPressedChange={(pressed) => onStyleChange({ isBold: pressed })}
            aria-label="Toggle bold"
          >
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={currentStyles.isItalic}
            onPressedChange={(pressed) => onStyleChange({ isItalic: pressed })}
            aria-label="Toggle italic"
          >
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={currentStyles.isUnderline}
            onPressedChange={(pressed) => onStyleChange({ isUnderline: pressed })}
            aria-label="Toggle underline"
          >
            <Underline className="h-4 w-4" />
          </Toggle>
        </div>

        {/* Alignment buttons */}
        <div className="flex border-l border-gray-300 ml-1 pl-1">
          <Toggle
            pressed={currentStyles.textAlign === 'left'}
            onPressedChange={(pressed) => pressed && onStyleChange({ textAlign: 'left' })}
            aria-label="Align left"
          >
            <AlignLeft className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={currentStyles.textAlign === 'center'}
            onPressedChange={(pressed) => pressed && onStyleChange({ textAlign: 'center' })}
            aria-label="Align center"
          >
            <AlignCenter className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={currentStyles.textAlign === 'right'}
            onPressedChange={(pressed) => pressed && onStyleChange({ textAlign: 'right' })}
            aria-label="Align right"
          >
            <AlignRight className="h-4 w-4" />
          </Toggle>
        </div>

        {/* List buttons */}
        <div className="flex border-l border-gray-300 ml-1 pl-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => handleListClick('bullet')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => handleListClick('number')}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Second row */}
      <div className="flex p-1 justify-between">
        <div className="flex">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Redo2 className="h-4 w-4" />
          </Button>
          <div className="border-l border-gray-300 ml-1 pl-1 flex">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Paintbrush className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            Annuler
          </Button>
          <Button onClick={onSave}>
            <Save className="mr-2 h-4 w-4" />
            Enregistrer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TextFormatToolbar;