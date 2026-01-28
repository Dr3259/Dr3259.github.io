"use client";

export async function extractTextFromBlob(blob: Blob, lang: "eng" | "chi_sim" = "eng"): Promise<string> {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker({
    workerPath: "https://unpkg.com/tesseract.js@v4.0.2/dist/worker.min.js",
    corePath: "https://unpkg.com/tesseract.js-core@v4.0.2/tesseract-core.wasm.js",
    langPath: "https://tessdata.projectnaptha.com/4.0.0",
  });
  await worker.loadLanguage(lang);
  await worker.initialize(lang);
  const url = URL.createObjectURL(blob);
  const result = await worker.recognize(url);
  URL.revokeObjectURL(url);
  await worker.terminate();
  const text = result?.data?.text || "";
  return text.trim();
}
