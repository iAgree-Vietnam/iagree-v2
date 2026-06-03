import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function Sign(props: any) {

    return (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', padding: 15 }}>
            {items.map((itemNumber) => {
                return (
                    <Draggable
                        key={itemNumber}
                        draggableId={'hello_' + itemNumber}
                        index={itemNumber}>
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                            >
                                <div style={{ marginBottom: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyItems: 'center', paddingTop: 20, paddingBottom: 20, textAlign: 'center', backgroundColor: 'red' }}>{itemNumber}</div>
                            </div>
                        )}
                    </Draggable>
                );
            })}
        </div>

    );
}

export default Sign;
