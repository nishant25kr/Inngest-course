import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
    { id: "Hello world" },
    { event: 'test/hello-world' },
    async ({ event, step }) => {
        console.log("Event name : ", event.name)
        console.log("Event data : ", event.data)

        //steps
        const response1 = await step.run(
            "create-greeting",
            async () => {
                const name = event.data.name;
                console.log("Hello", name);
                return name;
            }
        )

        console.log("Sleeping for 2sec");

        await step.sleep("short delay", "2s");

        return {
            message: response1,
            timeStamp: Date.now(),
            eventId: event.id,
        }
    }
)

export const multistepdemo = inngest.createFunction(
    { id: "Multi-step-demo" },
    { event: "test/multi-step-demo" },
    async ({ event, step }) => {
        const step1Result = await step.run("fetch-data", async () => {
            console.log("Fetching data....");
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return { data: "Important Data", userId: event.data.userId };
        });

        console.log("Step 1 completed", step1Result);

        const step2Result = await step.run("process-data", async () => {
            console.log("Processing data...");
            return {
                processed: true,
                originalData: step1Result.data,
                processedAt: Date.now(),
            };
        })

        console.log("Step 2 completed", step2Result);

        await step.sleep("await-before-final", "3s");

        const step3Result = await step.run("save-result", async () => {
            console.log("step3: saving data...");

            return {
                saved: true,
                location: "database",
            };
        });

        return {
            message: "Multi step workdflow completed",
            results: {
                step1: step1Result,
                step2: step2Result,
                step3: step3Result,
            },
        };
    }
)