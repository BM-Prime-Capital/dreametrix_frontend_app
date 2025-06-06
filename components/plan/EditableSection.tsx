import React from 'react';
import { Button } from '../../ui/Button';
import { Edit } from 'lucide-react';
import { SectionKey, TextStyles } from '../../types/lessonPlan';

interface EditableSectionProps {
  title?: string;
  content: string;
  styles: TextStyles;
  isEditing: boolean;
  sectionKey: SectionKey; 
  titleNumber?: number;
  titleUnderline?: boolean;
  onContentChange: (value: string) => void;
  onStartEditing: (section: SectionKey) => void;
}

const EditableSection: React.FC<EditableSectionProps> = ({
  title,
  content,
  styles,
  isEditing,
  sectionKey,
  titleNumber,
  titleUnderline,
  onStartEditing,
  onContentChange
}) => {
  const applyTextStyle = () => {
    let style = "";
    if (styles.isBold) style += "font-bold ";
    if (styles.isItalic) style += "italic ";
    if (styles.isUnderline) style += "underline ";
    if (styles.textAlign === 'center') style += "text-center ";
    if (styles.textAlign === 'right') style += "text-right ";
    
    return style;
  };

  const getInlineStyles = () => {
    return {
      fontFamily: styles.fontFamily,
      fontSize: `${styles.fontSize}px`
    };
  };

  return (
    <div className="relative">
      {title && (
        <div className="flex items-center mb-2">
          {titleNumber !== undefined && (
            <div className="bg-black text-white rounded-full h-6 w-6 flex items-center justify-center mr-2">
              {titleNumber}
            </div>
          )}
          <div className={`font-bold ${titleUnderline ? 'underline' : ''}`}>{title}</div>
        </div>
      )}
      
      {isEditing ? (
        <textarea
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          className={`w-full p-2 border rounded-sm ${applyTextStyle()}`}
          style={getInlineStyles()}
          rows={content.split('\n').length + 1}
        />
      ) : (
        <div 
          className={`text-sm whitespace-pre-line ${applyTextStyle()}`}
          style={getInlineStyles()}
        >
          {content}
        </div>
      )}
      
      {!isEditing && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onStartEditing(sectionKey)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default EditableSection;