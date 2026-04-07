export class queue {
    constructor(){
        this.element = [];
        this.numeratorOfEnter = 0;
    }

    /**
     * @arg {Number} priority
    */
    
    enqueque(item, priority){
        this.element.push (
            {
                item:item,
                priority: priority,
                id: this.numeratorOfEnter++
            }
        );
    }
}