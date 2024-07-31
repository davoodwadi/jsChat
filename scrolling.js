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

// get screen width
const screenWidth = window.innerWidth;
const baseMessageWidth = screenWidth/2;

async function handleDOMContentLoaded() {
    let messageElement = document.getElementById('first-message')
    let topBranch = messageElement.parentElement;
    const messagesContainer = document.getElementById('messages')
    const chatContainer = document.getElementById('chat-container')

    // focus on first input on loading
    const chatBox = document.getElementById('chat-box')
    chatBox.scrollIntoView({ behavior: 'smooth', block: 'start' })

    // set initial canvas width
    let canvasWidth = screenWidth;
    const setCanvasWidth = (width) => {
        document.body.style.width = `${width}px`
    };
    setCanvasWidth(canvasWidth);
    console.log('documentBody.width')
    console.log(document.body.style.width)    

    const dots = createDots();
    
    let idCounter = 0;
    
    messageElement.style.width = `${baseMessageWidth}px`
    messageElement.role = 'user'
    messageElement.counter = idCounter
    messageElement.name = `${messageElement.role}-${idCounter}`
    idCounter++

    const getWidthTopBranch = ()=>{
    // get top branch width
    console.log('window.innerWidth')
    console.log(window.innerWidth)
    console.log('messagesContainer.scrollWidth')
    console.log(messagesContainer.scrollWidth)
    console.log('chatContainer.scrollWidth')
    console.log(chatContainer.scrollWidth)

    
    // let topWidthsArray = Array.from(topBranch.children)
    // topWidthsArray = topWidthsArray.map(el => el.style.width)
    // topWidthsArray = topWidthsArray.map(el => parseFloat(el.split('px')[0]))
    // console.log('topWidthsArray')
    // console.log(topWidthsArray)
    // let topWidths = topWidthsArray.reduce((accumulator, current)=> accumulator+current, 0)
    // console.log('topWidths')
    // console.log(topWidths)
    return messagesContainer.scrollWidth
    }

    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    async function generateRandomVariableText(){
        var words =["The sky", "above", "the port","was", "the color of television", "tuned", "to", "a dead channel", ".", "All", "this happened", "more or less","." ,"I", "had", "the story", "bit by bit", "from various people", "and", "as generally", "happens", "in such cases", "each time", "it", "was", "a different story","." ,"It", "was", "a pleasure", "to", "burn"];
        var text = [];
        var x = getRandomNumber(3,10);
        while(--x) text.push(words[Math.floor(Math.random() * words.length)]);
        const tFinal = text.join(' ');
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(tFinal);
            }, 1000); // 0.5 second delay
        });
    }
        
    
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
        let messageElementInputBranch
        // console.log(branch.classList.contains('branch'))
        // console.log(branchContainer.classList.contains('branch-container'))
        
        // console.log(`oldContent: ${target.oldContent}`)
        const oldContent = target.oldContent
        // console.log(`triggeredBefore ${target.triggeredBefore}`)

        if ((target.triggeredBefore) && target.role==='user'){//old and user
            console.log('old box')
            // add new branch
            branch = document.createElement('div')
            branch.classList.add('branch')
            branchContainer.appendChild(branch)
            // add modified target
            messageElementInputBranch = await createMessageElement('user');
            // modified text
            messageElementInputBranch.textContent = target.textContent;
            // replace old content
            messageElementInputBranch.oldContent = messageElementInputBranch.textContent
            messageElementInputBranch.triggeredBefore = true;
            branch.appendChild(messageElementInputBranch);
            
            // set the old content
            console.log(`setting target's content to ${oldContent}`)
            // put original message in original box
            target.textContent = oldContent

            // get parent user of the target
            const parentBranch = target.parentElement.parentElement.parentElement; // has user and bot
            const parentChildrenArray = Array.from(parentBranch.children);
            const parentMessage = parentChildrenArray.filter(child => child.classList.contains('message'));
            const branchContainerCurrent = parentChildrenArray.filter(child => child.classList.contains('branch-container'))[0];
            console.log('before')
            console.log(parentMessage.map(el => el.style.width));
            console.log(parentMessage)
            let numSiblings = branchContainerCurrent.children.length;
            console.log('numSiblings')
            console.log(numSiblings)
            // double parent message width
            parentMessage.map(el => el.style.width = `auto`)
            parentMessage.map(el => el.style.width = `${baseMessageWidth*(numSiblings+0.2)}px`)
            // parentMessage.map(el => el.style.width = `${baseMessageWidth*2}px`)
            console.log('after')
            console.log(parentMessage.map(el => el.style.width));

            // add dots
            branch.appendChild(dots)

            // get llm messages
            const elementArray = createElementArray(messageElementInputBranch)
            // console.log(elementArray)
            let messages = createMessageChain(elementArray)
            messages += assistantTag
            console.log(messages)

            // add bot and empty user
            const messageElementBot = await createMessageElement('bot', messages);
            branch.replaceChild(messageElementBot, dots)
            
            
            // create branch-container within branch.        
            let newBranchContainer = document.createElement('div');
            newBranchContainer.classList.add('branch-container');
            branch.appendChild(newBranchContainer);
            // create branch within newcontainer
            let newBranch = document.createElement('div');
            newBranch.classList.add('branch');
            newBranchContainer.appendChild(newBranch)

            const messageElementInputNew = await createMessageElement('user');
            newBranch.appendChild(messageElementInputNew);
            
            
        } else if ( target.role==='user') { // latest and user
            console.log('fresh text')
            // messageElementInputBranch = target;
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
            messageElementInputBranch = messageElement;
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
        target.triggeredBefore = true;
        const horizontalWidth = getWidthTopBranch();
        setCanvasWidth(horizontalWidth);

        // focus on the new branch
        // messageElementInputBranch.setAttribute('tabindex', '-1'); // Make it focusable
        messageElementInputBranch.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'center' })
        // console.log('focused on input')
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
            messageElement.classList.add('editable', 'message', role);
            messageElement.style.width = `${baseMessageWidth}px`
            messageElement.contentEditable = true;
            // messageElement.textContent = pretext + '\n\n' + (await getDummyMessage())
            messageElement.textContent = await generateRandomVariableText()
            // messageElement.textContent = await getResponseServer(pretext)
        } else {
            messageElement.classList.add('editable', 'message', role);
            messageElement.style.width = `${baseMessageWidth}px`
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
        idCounter++;
        // console.log(`role: ${messageElement.role}`)
        // messageElement.style.width = '500px'
        // console.log('messageElement.style.width');
        // console.log(messageElement.style.width);
        return messageElement
    };


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