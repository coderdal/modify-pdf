import { useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';

interface DraggablePageListProps {
    pages: number[];
    onReorder: (pages: number[]) => void;
}

interface DraggablePageProps {
    id: number;
    index: number;
    moveCard: (dragIndex: number, hoverIndex: number) => void;
}

const ItemTypes = {
    PAGE: 'page',
};

function DraggablePage({ id, index, moveCard }: DraggablePageProps) {
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
                border-gray-300 hover:border-blue-400
                flex items-center justify-center
                min-h-[100px]
            `}
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
    const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
        const newPages = [...pages];
        const [removed] = newPages.splice(dragIndex, 1);
        newPages.splice(hoverIndex, 0, removed);
        onReorder(newPages);
    }, [pages, onReorder]);

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {pages.map((page, index) => (
                <DraggablePage
                    key={page}
                    id={page}
                    index={index}
                    moveCard={moveCard}
                />
            ))}
        </div>
    );
} 