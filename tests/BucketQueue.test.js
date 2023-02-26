let {BQueue} = require("../utils/BucketQueue.js"); 
const { testLogger } = require("./testLogger.js");


test("insert elements with random priority values to the queue and test if every successor have lower priority than its prior",()=>{
  for(let i = 0 ; i < 10000 ; i++){
    let rand = parseInt(Math.random()*1000);
    testLogger.info("random number "+rand);
    BQueue.insert({priority: rand})
  }

  testLogger.info("queue length "+BQueue.count);

  for(let i = 0 ; i < 10000 ; i+=2){
    let prior = BQueue.poll();
    testLogger.info("prior "+prior.priority);
    let successor = BQueue.poll();
    testLogger.info("successor "+successor.priority);
    expect(prior.priority >= successor.priority).toBe(true);
  }
})

test("insert elements with priorities from 0 to 100 and poll the again in correct order",()=>{
  for(let i = 0 ; i < 1000; i++){
    BQueue.insert({priority: i, name: "el-"+i});
  }

  for(let i = 1000 -1 ; i >= 0 ; i--){
    expect(BQueue.poll().priority).toBe(i);
  }
})