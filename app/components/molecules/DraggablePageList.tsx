import { useCallback, useRef, KeyboardEvent, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

interface DraggablePageListProps {
    pages: number[];
    onReorder: (pages: number[]) => void;
}

interface DraggablePageProps {
    id: number;
    index: number;
    moveCard: (dragIndex: number, hoverIndex: number) => void;
    isSelected: boolean;
    onSelect: (index: number) => void;
}

const ItemTypes = {
    PAGE: 'page',
};

function DraggablePage({ id, index, moveCard, isSelected, onSelect }: DraggablePageProps) {
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.PAGE,
        item: { type: ItemTypes.PAGE, id, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: ItemTypes.PAGE,
        hover(item: { type: string; id: number; index: number }) {
            if (item.index === index) {
                return;
            }
            moveCard(item.index, index);
            item.index = index;
        },
    });

    const ref = useCallback((node: HTMLDivElement | null) => {
        drag(drop(node));
    }, [drag, drop]);

    return (
        <div
            ref={ref}
            className={`
                relative border-2 rounded-lg p-4 cursor-move transition-all
                ${isDragging ? 'opacity-50' : 'opacity-100'}
                ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
                flex items-center justify-center
                min-h-[100px]
                focus:outline-none focus:ring-2 focus:ring-blue-500
            `}
            onClick={() => onSelect(index)}
            tabIndex={0}
            role="button"
            aria-label={`Page ${id}, position ${index + 1}`}
            aria-selected={isSelected}
        >
            <span className="text-lg font-medium text-gray-700">
                Page {id}
            </span>
            <div className="absolute top-1 right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center border border-gray-300">
                <span className="text-xs">{index + 1}</span>
            </div>
        </div>
    );
}

export default function DraggablePageList({ pages, onReorder }: DraggablePageListProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
        const newPages = [...pages];
        const [removed] = newPages.splice(dragIndex, 1);
        newPages.splice(hoverIndex, 0, removed);
        onReorder(newPages);
    }, [pages, onReorder]);

    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
        if (selectedIndex === null) return;

        switch (e.key) {
            case 'ArrowLeft':
                if (selectedIndex > 0) {
                    e.preventDefault();
                    moveCard(selectedIndex, selectedIndex - 1);
                    setSelectedIndex(selectedIndex - 1);
                }
                break;
            case 'ArrowRight':
                if (selectedIndex < pages.length - 1) {
                    e.preventDefault();
                    moveCard(selectedIndex, selectedIndex + 1);
                    setSelectedIndex(selectedIndex + 1);
                }
                break;
            case 'ArrowUp':
                if (selectedIndex >= 5) {
                    e.preventDefault();
                    moveCard(selectedIndex, selectedIndex - 5);
                    setSelectedIndex(selectedIndex - 5);
                }
                break;
            case 'ArrowDown':
                if (selectedIndex < pages.length - 5) {
                    e.preventDefault();
                    moveCard(selectedIndex, selectedIndex + 5);
                    setSelectedIndex(selectedIndex + 5);
                }
                break;
            case 'Home':
                if (selectedIndex > 0) {
                    e.preventDefault();
                    moveCard(selectedIndex, 0);
                    setSelectedIndex(0);
                }
                break;
            case 'End':
                if (selectedIndex < pages.length - 1) {
                    e.preventDefault();
                    moveCard(selectedIndex, pages.length - 1);
                    setSelectedIndex(pages.length - 1);
                }
                break;
        }
    }, [selectedIndex, pages.length, moveCard]);

    const handleSelect = useCallback((index: number) => {
        setSelectedIndex(index === selectedIndex ? null : index);
    }, [selectedIndex]);

    return (
        <div 
            ref={containerRef}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            onKeyDown={handleKeyDown}
            role="grid"
            aria-label="PDF pages grid"
        >
            {pages.map((page, index) => (
                <DraggablePage
                    key={page}
                    id={page}
                    index={index}
                    moveCard={moveCard}
                    isSelected={index === selectedIndex}
                    onSelect={handleSelect}
                />
            ))}
        </div>
    );
} 