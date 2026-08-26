import React, { ReactNode } from 'react';
import { useLiveEdit, EditTarget } from '../../../context/LiveEditContext';

interface EditableWrapperProps {
  targetId: string;
  targetType: EditTarget['type'];
  title: string;
  pageId?: string;
  data?: any;
  children: ReactNode;
  className?: string;
}

export const EditableWrapper: React.FC<EditableWrapperProps> = ({
  targetId,
  targetType,
  title,
  pageId,
  data,
  children,
  className = '',
}) => {
  const { isLiveEditMode, activeTarget, openEditor } = useLiveEdit();

  if (!isLiveEditMode) {
    return <div className={className}>{children}</div>;
  }

  const isSelected = activeTarget?.id === targetId;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openEditor({
      type: targetType,
      id: targetId,
      title,
      pageId,
      data,
    });
  };

  return (
    <div
      onClick={handleClick}
      className={`group/live-edit relative transition-all duration-200 cursor-pointer ${className} ${
        isSelected
          ? 'ring-4 ring-orange-500/80 ring-offset-2 dark:ring-offset-slate-950 rounded-2xl shadow-xl'
          : 'hover:ring-2 hover:ring-orange-400/70 hover:shadow-lg'
      }`}
    >
      {/* Floating Edit Badge */}
      <div
        className={`absolute top-2 right-2 z-40 transition-all flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs shadow-xl backdrop-blur-md ${
          isSelected
            ? 'bg-orange-500 text-white opacity-100 scale-105'
            : 'bg-slate-950/85 hover:bg-orange-500 text-white opacity-0 group-hover/live-edit:opacity-100'
        }`}
      >
        <span>✏️</span>
        <span>Edit {title}</span>
      </div>

      {children}
    </div>
  );
};

export default EditableWrapper;
