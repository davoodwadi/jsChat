import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import { getResponseServer } from "./apiModule.js";

const systemTemplate = `<|start_header_id|>system<|end_header_id|>\n{text}<|eot_id|>\n\n`;
const systemMessage = `You are a helpful assistant. You respond with brief, to the point, and useful responses.`;
const systemPrompt = systemTemplate.replace('{text}', systemMessage);
const userTemplate = `<|start_header_id|>user<|end_header_id|>\n\`\`\`{text}\`\`\`<|eot_id|>\n\n`;
const assistantTag = `<|start_header_id|>assistant<|end_header_id|>\n`
const assistantEOT = `<|eot_id|>\n\n`
const assistantPrompt = `${assistantTag}{text}${assistantEOT}`

async function handleDOMContentLoaded() {

    let query = `nested bullet point list of places to visit in italy. don't forget emojis`
    let pretext = systemPrompt + userTemplate.replace('{text}', query) + assistantTag;
    // console.log(pretext)
    let llmResponse = await getResponseServer(pretext)

    console.log(llmResponse);
    let markedOutput = marked.parse(llmResponse);
    console.log(markedOutput);
    document.getElementById('markdown-content').innerHTML = markedOutput;
    document.getElementById('raw-content').innerHTML = llmResponse;
};
document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);