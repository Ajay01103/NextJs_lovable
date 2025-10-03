import { Sandbox } from "@e2b/code-interpreter"
import { createAgent, openai } from "@inngest/agent-kit"

import { inngest } from "./client"
import { getSandbox } from "./utils"

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("ajay-ai-vibe-coding-nextjs")

      return sandbox.sandboxId
    })

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

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId)
      const host = sandbox.getHost(3000)

      return `https://${host}`
    })

    return { message: output, sandboxUrl }
  }
)
