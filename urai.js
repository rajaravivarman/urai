import readline from 'readline';
import { Configuration, OpenAIApi } from "openai";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const MODEL = 'gpt-3.5-turbo';
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const typewriter = async (text, delay=50) => {
    for (let i = 0; i < text.length; i++) {
        process.stdout.write(text.charAt(i));
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    console.log();
};
const chatgpt = async () => {
    const history = [];
    while (true) {
        const prompt = await new Promise(resolve => {
            rl.question('> ', resolve);
        });
        if (prompt === 'exit') {
            rl.close();
            break;
        }
        const messages = [];
        for (const [prompt, response] of history) {
            messages.push({ role: "user", content: prompt });
            messages.push({ role: "assistant", content: response });
        }
        messages.push({ role: "user", content: prompt });
        const result = await openai.createChatCompletion({
            model: MODEL,
            messages: messages
        });
        const response = result.data.choices[0].message.content;
        history.push([prompt, response]);
        await typewriter(response.replace("\n\n",""), 50);
    }
};

chatgpt();
