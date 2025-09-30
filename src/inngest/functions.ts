import { createAgent, openai } from "@inngest/agent-kit"
import { inngest } from "./client"

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event }) => {
    const codeWriterAgent = createAgent({
      name: "Code writer",
      system: "You are an expert TypeScript programmer",
      model: openai({
        baseUrl: "https://openrouter.ai/api/v1",
        apiKey: process.env.DEEPSEEK_V3_API_KEY,
        model: "deepseek/deepseek-chat-v3.1:free",
      }),
    })

    const { output } = await codeWriterAgent.run(
      `Write the following snippet: ${event.data.value}`
    )

    return { message: output }
  }
)
