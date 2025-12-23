import {Inngest} from "inngest"

const inggest = new Inngest({id: "hello-world-app"})

const helloFunction = inggest.createFunction(
    {id: "hello-world-app"},
    {event: "test/hello"},
    async ({event, step}) => {
        console.log("hello from inngest");
        console.log("event name : ",event.name);
        console.log("event data : ",event.data);
        
        return {
            message: `Hello ${event.data.name || "user"}`,
            recievedAt: Date().toString()
        }
    }
)

console.log("Function creation Done", helloFunction.id());

const multiStepFunction = inggest.createFunction(
    {id: "multi-step-demo"},
    {event: "demo/multi-step"},
    async ({event,step}) => {
        //step1: First task(it can be any task like DB conection or data fetching from API)
        //for example->

        const response1 = await step.run(
            "step-1", async () => {
                console.log("Executed step 1")
                return {data: "Result from step 1"}
            }
        )
        console.log("Step 1 is completed");

        //step2: we will sleep for 5 sec

        await step.sleep(
            "step-2",
            "5s",
        )

        console.log("step 2 is completed");

        //step3: 
        const response3 = await step.run(
            "step-3",async () => {
                console.log("step 3 is executing")
                return {
                    data: "Result from step 3",
                    previous: response1
                }
            }
        )
        console.log("step 3 completed", response3);
        
        return {
            message: "Multi step function completed",
            result: [response1,response3]
        }
    }
)
console.log("Function creation Done", multiStepFunction.id());

