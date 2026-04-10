export class queueWiothPriority {
    constructor(){
        this.elements = [];
        this.numeratorOfEnter = 0;
    }

    /**
     * @arg {Number} priority
    */
    
    enqueue(item, priority){
        this.elements.push (
            {
                item:item,
                priority: priority,
                id: this.numeratorOfEnter++
            }
        );
    }

    enqueque(item, priority) {
        this.enqueue(item, priority);
    }
/**
     * @param {'highest' | 'lowest' | 'oldest' | 'newest'} mode 
     */
    _finder(mode) {
        if (this.elements.length === 0) return -1;

        if (mode === 'oldest') return 0; 
        if (mode === 'newest') return this.elements.length - 1;

        let requiredElement = 0;
        for (let i = 1; i < this.elements.length; i++) {
            if (mode === 'highest') {
                if (this.elements[i].priority > this.elements[requiredElement].priority) {
                    requiredElement = i;
                }
            } else if (mode === 'lowest') {
                if (this.elements[i].priority < this.elements[requiredElement].priority) {
                    requiredElement = i;
                }
            }
        }
        return requiredElement;
    }

    finder(mode) {
        return this._finder(mode);
    }

    /**
     * @param {'highest' | 'lowest' | 'oldest' | 'newest'} mode 
     */
    peek(mode) {
        const index = this._finder(mode);
        if (index === -1) return null;
        return this.elements[index].item;
    }

    geterFromArray(mode) {
        return this.peek(mode);
    }

    /**
     * @param {'highest' | 'lowest' | 'oldest' | 'newest'} mode 
     */
    dequeue(mode) {
        const index = this._finder(mode);
        if (index === -1) return null;
        
        const removedElement = this.elements.splice(index, 1)[0];
        return removedElement.item;
    }

    get size() {
        return this.elements.length;
    }

    isEmpty() {
        return this.elements.length === 0;
    }
    
}