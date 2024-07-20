// import { fetch } from "node-fetch";
// const apiUrl = "https://api-inference.huggingface.co/models/gpt2"; // API endpoint on your server
const apiRequest = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: 'Hello!!!!'},
        ],
        model: "gpt-4o-mini",
        max_tokens: 100
    })
};
const API_TOKEN = "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"

export function myFunction(text) {
    console.log(text);
};

export async function getResponseAsync(text){
    try {
        const response = await `get Response: ${text}`
        // return response
    }
    catch (error){
        console.error(`Error: ${error}`)
    }
    return response
};
const apiUrl = "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct";
// const apiUrl = "https://api-inference.huggingface.co/models/gpt2";
export async function getResponse(text){
    let newTextTranslate = `
<|start_header_id|>system<|end_header_id|>
You are a helpful English to French translator. 
You should translate the text in triple backticks to French.
Only output the French translation.
<|eot_id|>

<|start_header_id|>user<|end_header_id|>
\`\`\`Hello\`\`\`<|eot_id|>

<|start_header_id|>assistant<|end_header_id|>
Bonjour<|eot_id|>

<|start_header_id|>user<|end_header_id|>
\`\`\`${text}\`\`\`<|eot_id|>

<|start_header_id|>assistant<|end_header_id|>
`.trim()
    let newTextRomantic = `
<|start_header_id|>system<|end_header_id|>
You are my romantic partner. You respond with utmost love and affection.
<|eot_id|>

<|start_header_id|>user<|end_header_id|>
\`\`\`Hello\`\`\`<|eot_id|>

<|start_header_id|>assistant<|end_header_id|>
Hello my love! 😍<|eot_id|>

<|start_header_id|>user<|end_header_id|>
\`\`\`${text}\`\`\`<|eot_id|>

<|start_header_id|>assistant<|end_header_id|>
`.trim()
    console.log(newTextRomantic)
    try{
        const response = await fetch(
            apiUrl,
            {
                headers: { 
                    Authorization: `Bearer ${API_TOKEN}`,
                    "Content-Type": "application/json" // Correct content type for JSON 
                },
                method: "POST",
                body: JSON.stringify({ 
                    inputs: newTextRomantic,
        
                    parameters: {
                        temperature: 0.1,
                        max_new_tokens: 100,
                        return_full_text: false,
                    }

                }),
            }
        );
        const result = await response.json();
        return result;
    }
    catch (error){
        // console.log('Errrorrrr')
        console.error(`Error: ${error}`)
    }
};




export async function makeApiCall(userMessage) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: userMessage},
                ],
                model: "gpt-4o-mini",
                max_tokens: 100
            })
        });
    
        const data = await response.json();
        console.log(data);
        return data
    } catch (error) {
        console.error('Error:', error);
        console.error(error);
    }
};
