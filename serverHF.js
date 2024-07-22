// server.js
import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';

import fetch from 'node-fetch';

const app = express();
const port = 4000;

app.use(cors());
// Middleware to parse JSON bodies
app.use(express.json());
const openai = new OpenAI();

const myVariable = process.env.HF_TOKEN;
// HF-api endpoint
const hfUrl =  "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct";
// Endpoint to handle OpenAI API requests
app.post('/api/hf/completions', async (req, res) => {
    try {
        // const { inputs, parameters } = req.body;
        console.log('req.body');
        console.log(req.body);

        const options = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${myVariable}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        };
        console.log('options')
        console.log(options)
        let response = await fetch(hfUrl, options)
        response = await response.json()
        console.log('response')
        console.log(response)
        res.json(response)

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/hf/completions', async (req, res) => {
    try {
        console.log('welcome to node.js')
        res.json('welcome to njs')

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
