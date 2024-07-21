// import fetch from "node-fetch";
import { getResponseServer } from "./apiModule.js";
let bot_default_message = `To ensure that messages in the chat interface wrap and display as multiline when the text is too long to fit in one line, you need to update the CSS to allow for word wrapping and handling overflow appropriately.

Here’s how you can adjust the CSS to ensure that messages are displayed in multiple lines within the chat interface: `

const apiUrl = "https://api-inference.huggingface.co/models/gpt2"; // API endpoint on your server

document.addEventListener('DOMContentLoaded', (globalEvent) => {
const messagesContainer = document.getElementById('messages');

// set message ids
// here we are overwriting the ids in html
let messageElement = document.getElementById('first-message')

let idCounter = 0
for (let messageElement of messagesContainer.children){  
    messageElement.role = messageElement.classList['2']
    messageElement.counter = idCounter
    messageElement.name = `${messageElement.role}-${idCounter}`
    // autoResizeTextarea()
    idCounter++
}
 
// add evenListener
messageElement.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default behavior of adding a new line
        
        logEvent(event.target.textContent.trim());
        console.log(`div: ${messageElement.textContent.trim()}`)
        event.target.blur();
        // autoResizeTextarea();
        }
    });

async function logEvent(text){
    const target = event.target

    if ((target.counter+1)<idCounter && target.role==='user'){ //old and user
        // console.log(`old convo ${target.counter}-${idCounter}`);
        // bot already exists at target.counter + 1; put text there
        // const responseGPT = await makeApiCall(target.textContent.trim());
        // const final_text = responseGPT.message.content.trim();
        let final_text = await getResponseServer(text.trim());
        final_text = final_text.trim()
        // final_text = JSON.stringify(final_text);
        // final_text = final_text[0].generated_text.trim()
        // console.log(final_text)
        messagesContainer.children[target.counter+1].textContent = final_text // bot textarea; 0 indexing
        // autoResizeTextarea(); // readjust the boxes 
        // messagesContainer.children[target.counter+1].scrollIntoView({ behavior: 'smooth', block: 'end' });
        scrollToLatestMessage(messagesContainer.children[target.counter+1]);
        // scrollToTopOfLastMessage();
    } else if ( target.role==='user') { // latest and user
        // const responseGPT = await makeApiCall(target.textContent.trim());
        // const final_text = responseGPT.message.content.trim();
        // const final_text = bot_default_message.trim();
        let final_text = await getResponseServer(text.trim());
        final_text = final_text.trim()
        // final_text = JSON.stringify(final_text);
        // final_text = final_text[0].generated_text.trim()
        console.log(final_text)
        let messageElement = addMessage('bot', final_text); // add bot textarea
        
        // messageElement.scrollIntoView({ behavior: 'smooth', block: 'end' }); // scroll bot
        scrollToLatestMessage(messageElement);
        
        messageElement = addMessage('user', ''); // add user text area
        // autoResizeTextarea(); // readjust the boxes
        messageElement.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent the default behavior of adding a new line
        
                logEvent(event.target.textContent.trim());

                event.target.blur();
                // autoResizeTextarea(); // readjust the boxes
                }
            });// listen to user
    };
}

function addMessage(sender, text) {
    const messageElement = document.createElement('div');
    messagesContainer.appendChild(messageElement);
    // autoResizeTextarea();
    messageElement.classList.add('message', sender);
    messageElement.textContent = text;
    messageElement.style.width = "100%"
    messageElement.style.height = "auto"
    messageElement.contentEditable = true
    
    messageElement.role = messageElement.classList['1'];
    messageElement.name = `${messageElement.role}-${idCounter}`
    messageElement.counter = idCounter;
    idCounter++
    return messageElement
}

async function makeApiCall(userMessage) {
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
}

function scrollToLatestMessage(latestMessage) {
    const chatContainer = document.getElementById('messages');

    // Adjust scroll position to show some of the previous messages
    const offset = 200; // Adjust this value as needed
    // console.log(`before scrolltop${chatContainer.scrollTop}`)
    chatContainer.scrollTop = latestMessage.offsetTop - offset;
    // console.log(`after scrolltop${chatContainer.scrollTop}`)
}

function scrollToTopOfLastMessage() {
    const lastMessage = messagesContainer.lastElementChild;
    // lastMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function showChildren(){
    // loop through messagesContainer
    console.log('*'.repeat(20))
    for (child of messagesContainer.children){
        console.log(child.counter)
    }
    console.log('*'.repeat(20))
    // 
}


})