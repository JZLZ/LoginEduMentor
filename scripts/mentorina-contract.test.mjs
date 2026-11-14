import assert from "node:assert/strict"

import { test } from "node:test"

import { resolve } from "node:path"

import { fileURLToPath } from "node:url"

import { createServer } from "vite"

const frontendRoot = resolve(fileURLToPath(new URL("..", import.meta.url)))

const expectedResponse =
  "Resposta de contrato: Olá, estudante! Vamos resolver passo a passo."

test("frontend preserves the Mentorina API response in the chat message", async () => {
  const vite = await createServer({
    configFile: false,

    root: frontendRoot,

    server: { middlewareMode: true },

    appType: "custom",

    logLevel: "silent",
  })

  const originalFetch = globalThis.fetch

  const originalLocalStorage = Object.getOwnPropertyDescriptor(
    globalThis,
    "localStorage",
  )

  let capturedRequest

  try {
    const { MENTORINA_CONFIG, sendMessage } = await vite.ssrLoadModule(
      "/src/services/mentorinaApi.ts",
    )

    assert.equal(MENTORINA_CONFIG.USE_MOCK, false)

    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,

      value: {
        getItem: (key) => (key === "sherlock_auth_token" ? "test-jwt" : null),
      },
    })

    globalThis.fetch = async (url, options) => {
      capturedRequest = { url: String(url), options }

      return new Response(
        JSON.stringify({
          conversation_id: "conversation-contract",

          response: expectedResponse,

          tools_used: [],

          tokens_used: 12,
        }),

        { status: 200, headers: { "Content-Type": "application/json" } },
      )
    }

    const result = await sendMessage(
      "conversation-contract",

      "Como começo a resolver?",
    )

    assert.equal(result.botMessage.text, expectedResponse)

    assert.equal(
      capturedRequest.url,

      `${MENTORINA_CONFIG.MENTORINA_API_URL}/api/v1/chat`,
    )

    assert.equal(
      new Headers(capturedRequest.options.headers).get("Authorization"),

      "Bearer test-jwt",
    )

    assert.equal(
      JSON.parse(capturedRequest.options.body).message,

      "Como começo a resolver?",
    )
  } finally {
    globalThis.fetch = originalFetch

    if (originalLocalStorage) {
      Object.defineProperty(globalThis, "localStorage", originalLocalStorage)
    } else {
      delete globalThis.localStorage
    }

    await vite.close()
  }
})
