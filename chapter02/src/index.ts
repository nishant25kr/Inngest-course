import express from "express"
import { serve } from "inngest/express"
import { inngest } from "./inngest/client";
import { helloWorld, multistepdemo } from "./inngest/functions";

const app = express();
const PORT = 3000;

app.use(express.json())

app.use(
    "/api/inngest",
    serve(
        { client: inngest, functions: [helloWorld, multistepdemo] }
    )
)

app.get("/", (req, res) => {
    res.json(
        {
            status: "Healthy",
            message: "Express + Inngest server is running"
        }
    )
})

app.post('/test', async (req, res) => {
    try {
        console.log("Sending test event")
        const { ids } = await inngest.send(
            {
                name: "test/hello-world",
                // data: {
                //     name: req.body.name || "Nishant",
                // }
            }
        )
        console.log("Event sent with id",ids[0]);
        res.json(
            {
                message: "event send successfullt",
                id:ids[0],
            }
        )

    } catch (error) {
        console.log(error)
    }
})

app.post('/test-multi', async (req,res) => {
    try {
        
        console.log("seding multi step test request")
        const {ids} = await inngest.send({
            name: "test/multi-step-demo",
            data: {
                userId: 2121,
                action: "demo"
            }
        })
        console.log("Event send with id : ",ids[0]);

        res.send(ids)

    } catch (error) {
        console.log(error);      
    }
})

app.listen(PORT, () => {
    console.log("Express app is running at : ", PORT)
})