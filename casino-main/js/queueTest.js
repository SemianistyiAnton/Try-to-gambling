import { queueWiothPriority } from '../../casino-lib/index.js';

const queue = new queueWiothPriority();

queue.enqueue("Player Vasya (Regular)", 1);
queue.enqueue("Player Petya (Regular)", 1);
queue.enqueue("Player Elon Musk (Super-VIP)", 100);
queue.enqueue("Player John (Regular)", 1);
queue.enqueue("Player Bill (VIP)", 50);

console.log("--- Queue test ---");


//просто пошук у черзі, без видалення

console.log("Oldest:", queue.peek('oldest')); // перший по часу додавання

console.log("Newest:", queue.peek('newest')); // останній доданий

//гравця буде видалено з черги після вибору

console.log("Highest priority:", queue.dequeue('highest')); // найвищий пріорітет

console.log("Next VIP:", queue.dequeue('highest')); // знов вищий коли, минулий... Грає? 

console.log("Lowest priority:", queue.dequeue('lowest')); // Найменший пріорітет, має буте перший доданний