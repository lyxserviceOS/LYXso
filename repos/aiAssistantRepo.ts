// repos/aiAssistantRepo.ts
// Dummy-lag som vi kobler til GPT-API senere
export async function sendAIAssistantMessage(message: string) {
  // Foreløpig bare logger vi – i neste versjon kobles OpenAI/LYXba
  console.log("[AI-assistent] melding sendt:", message);
  return {
    reply:
      "Hei! Dette er din LYXso AI-assistent. Jeg kan hjelpe deg med kundeservice, oppfølging og kampanjer.",
  };
}
