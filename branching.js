import { getResponseServer } from "./apiModule.js";
let bot_default_message = `To ensure that messages in the chat interface wrap and display as multiline when the text is too long to fit in one line, you need to update the CSS to allow for word wrapping and handling overflow appropriately.

Here’s how you can adjust the CSS to ensure that messages are displayed in multiple lines within the chat interface: `
const systemTemplate = `<|start_header_id|>system<|end_header_id|>\n{text}<|eot_id|>\n\n`;
const systemMessage = `You are a helpful assistant. You respond with brief, to the point, and useful responses.`;
const systemPrompt = systemTemplate.replace('{text}', systemMessage);
const userTemplate = `<|start_header_id|>user<|end_header_id|>\n\`\`\`{text}\`\`\`<|eot_id|>\n\n`;
const assistantTag = `<|start_header_id|>assistant<|end_header_id|>\n`
const assistantEOT = `<|eot_id|>\n\n`
const assistantPrompt = `${assistantTag}{text}${assistantEOT}`

async function handleDOMContentLoaded() {
    let messageElement = document.getElementById('first-message')
    let container = messageElement.parentElement;
    // console.log(messageElement.textContent)

    const dots = createDots();
    
    let idCounter = 0;
    
    messageElement.role = 'user'
    messageElement.counter = idCounter
    messageElement.name = `${messageElement.role}-${idCounter}`
    idCounter++

    // branch-container logic:
    // branch
    //  user
    //  bot
    //  branch-container
    //      branch
    //          user
    //          bot        
    // event listener for first-message
    messageElement.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the default behavior of adding a new line
            // add branch-container if it doesn't have it
            // add branch
            // add bot
            // (optional) add empty user
            logEvent(event);
            event.target.oldContent = event.target.textContent
            // console.log(event.target.parentElement)
            // console.log(`div entered: ${event.target.textContent.trim()}`)
            event.target.blur();
        }});
    //
    async function logEvent(event){
        let target = event.target
        let branch = target.parentElement
        let branchContainer = branch.parentElement
        // console.log(branch.classList.contains('branch'))
        // console.log(branchContainer.classList.contains('branch-container'))
        
        console.log(`oldContent: ${target.oldContent}`)
        const oldContent = target.oldContent
        console.log(`triggeredBefore ${target.triggeredBefore}`)

        if ((target.triggeredBefore) && target.role==='user'){//old and user
            console.log('old box')
            // add new branch
            branch = document.createElement('div')
            branch.classList.add('branch')
            branchContainer.appendChild(branch)
            // add modified target
            messageElement = await createMessageElement('user');
            messageElement.textContent = target.textContent;
            messageElement.oldContent = messageElement.textContent
            messageElement.triggeredBefore = true;
            branch.appendChild(messageElement);
            // set the old content
            console.log(`setting target's content to ${oldContent}`)
            target.textContent = oldContent


            // add dots
            branch.appendChild(dots)

            // get llm messages
            const elementArray = createElementArray(messageElement)
            // console.log(elementArray)
            let messages = createMessageChain(elementArray)
            messages += assistantTag
            console.log(messages)

            // add bot and empty user 
            messageElement = await createMessageElement('bot', messages);
            branch.replaceChild(messageElement, dots)
            // branch.appendChild(messageElement);

            // // set the old content
            // console.log(`setting target's content to ${oldContent}`)
            // target.textContent = oldContent
            
            // create branch-container within branch.        
            let newBranchContainer = document.createElement('div');
            newBranchContainer.classList.add('branch-container');
            branch.appendChild(newBranchContainer);
            // create branch within newcontainer
            let newBranch = document.createElement('div');
            newBranch.classList.add('branch');
            newBranchContainer.appendChild(newBranch)

            messageElement = await createMessageElement('user');
            newBranch.appendChild(messageElement);

            
        } else if ( target.role==='user') { // latest and user
            console.log('fresh text')
            // add branch
            // branch = document.createElement('div')
            // branch.classList.add('branch')
            // branchContainer.appendChild(branch)
            //
            // branch.appendChild(target)
            // add dots to the branch
            branch.appendChild(dots)
            // get llm messages
            const elementArray = createElementArray(target)
            // console.log(elementArray)
            let messages = createMessageChain(elementArray)
            messages += assistantTag
            console.log(messages)

            // add bot message and followup user message
            messageElement = await createMessageElement('bot', messages);
            branch.replaceChild(messageElement, dots)
            // branch.appendChild(messageElement);


            // create branch-container within branch.        
            let newBranchContainer = document.createElement('div');
            newBranchContainer.classList.add('branch-container');
            branch.appendChild(newBranchContainer);
            // create branch within newcontainer
            let newBranch = document.createElement('div');
            newBranch.classList.add('branch');
            newBranchContainer.appendChild(newBranch)

            messageElement = await createMessageElement('user');
            newBranch.appendChild(messageElement);

        }
        target.triggeredBefore = true
        
    
    };

    
    function getBranchContainer(el){
        for (let child of el.children){
            if (child.classList.contains('branch-container')){
                return child
            }
        }
        return false
    }

    async function createMessageElement(role, pretext){
        let messageElement = document.createElement('div');
        if (role==='bot'){
            messageElement.classList.add('message', role);
            // messageElement.textContent = pretext + '\n\n' + (await getDummyMessage())
            messageElement.textContent = await getResponseServer(pretext)
        } else {
            messageElement.classList.add('editable', 'message', role);
            messageElement.contentEditable = true;
            messageElement.setAttribute('data-placeholder', 'New message')
            // event listener
            messageElement.addEventListener('keydown', function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault(); // Prevent the default behavior of adding a new line
                    // add branch-container if it doesn't have it
                    // add branch
                    // add bot
                    // (optional) add empty user
                    logEvent(event);
                    event.target.oldContent = event.target.textContent;
                    // console.log(event.target.parentElement)
                    // console.log(`div entered: ${event.target.textContent.trim()}`)
                    event.target.blur();
                }});
            //
        }
        messageElement.role = role;
        messageElement.name = `${messageElement.role}-${idCounter}`
        messageElement.counter = idCounter;
        idCounter++
        // console.log(`role: ${messageElement.role}`)
        return messageElement
    }


    async function getDummyMessage() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(bot_default_message);
            }, 1000); // 0.5 second delay
        });
    }

    function createDots(){
        const dots = document.createElement('div');
        dots.classList.add('message', 'bot', 'dots-message');
        const dotsContainer = document.createElement('div');
        dotsContainer.classList.add('dots-container');
        
        const singleDot1 = document.createElement('div')
        singleDot1.classList.add('dot')
        const singleDot2 = document.createElement('div')
        singleDot2.classList.add('dot')
        const singleDot3 = document.createElement('div')
        singleDot3.classList.add('dot')
        
        //connect them together
        dots.appendChild(dotsContainer)
        dotsContainer.appendChild(singleDot1)
        dotsContainer.appendChild(singleDot2)
        dotsContainer.appendChild(singleDot3)    
        return dots
    };
    
    

    function addMessageElementToArrayReverse(el, messageElementArray){
        for (let i = el.children.length - 1; i >= 0; i--) {
            const child = el.children[i];
            if (child.classList.contains('message') && (!child.classList.contains('dots-message'))){
                messageElementArray.push(child)
            }
            
    }};

    function createElementArray(lastElement){
        let messageElementArray = []
        let element = lastElement;
        while (element.id!=="chat-container"){
            // console.log(element.classList);
            addMessageElementToArrayReverse(element, messageElementArray);
            element = element.parentElement;
        }
        messageElementArray = messageElementArray.reverse()
        // each element from top to bottom
        console.log('*'.repeat(20))
        console.log('messageElementArray')
        console.log(messageElementArray[0].textContent)
        return messageElementArray
    }
    
    // console.log(element.children)

    // create message from chain elements 

    function createMessageChain(messageElementArray){
        let chainMessages = systemPrompt
        for (let el of messageElementArray){
            if (el.classList.contains('user')){
                // console.log(`user: ${el.textContent}`);
                chainMessages += userTemplate.replace('{text}', el.textContent);
            } else {
                // console.log(`bot: ${el.textContent}`);
                chainMessages += assistantPrompt.replace('{text}', el.textContent);
        }}
        return chainMessages
    }

    
    
    // console.log(assistantPrompt.replace('{text}', 'Hey'))
};

// Add event listener for DOMContentLoaded and call the async function
document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);