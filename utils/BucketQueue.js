// import { Prioritized } from "./types";

const { logger } = require("./logger");



/**
 * BucketQueue is an array based implementation of PriorityQueue
 * it is fast and suitable for numbers
 */
class BucketQueue {
    // highest Priority
    peak = 0;
    // lowest priority
    tail = 0;
    count = 0;
    arr = [];

    insert (el){

        if(el.priority >= (this.isEmpty()?Number.MIN_VALUE:this.peak))
        {
            logger.info("updating peak "+this.peak+" to "+el.priority);
            this.peak = el.priority;
        }
        if(el.priority <= (this.isEmpty()?Number.MAX_VALUE:this.tail))
        {
            logger.info("updating tail"+this.tail+" to "+el.priority);
            this.tail = el.priority;
        }

        // check if list correspanding to that priority is null, if yes initialize it first
        if(!(this.arr[el.priority]))
        this.arr[el.priority]= [];
        logger.info(" inserting "+ el+" at "+el.priority);
        this.arr[el.priority].push(el);
        logger.info("new queue",this.arr);
        this.count++;
    }

    peek(){
        // returns the first element inserted in the bucket
        logger.info("PEAKING",this.arr[this.peak][0]);
        return this.arr[this.peak][0];
    }
    
    poll(){
        let prev_peak = this.arr[this.peak]?.shift()??null;
        logger.info("polling",prev_peak);
        for(let i = this.peak ; i >= 0; i--)
        {
            if(this.arr[i]?.length > 0){
                this.peak = i; 
                logger.info("new peak",this.peak);
                break;
            }
        }
        this.count--;
        return prev_peak;
    }

    isEmpty(){
        return (this.count== 0);
    } 

}

let bq = new BucketQueue();

exports.BQueue = bq;
