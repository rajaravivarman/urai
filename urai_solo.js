import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

let prompt = process.argv.slice(2).join(" ");

prompt = prompt ? prompt : "hello world";

function typewriter(text, delay = 50) {
    text = text + "\n"
    for (let i = 0; i < text.length; i++) {
        setTimeout(() => {
            process.stdout.write(text[i]);
        }, delay * i);
    }
}

//typewriter("hello")
//console.log(prompt);

const openai = new OpenAIApi(configuration);

async function talkToGpt() {
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: prompt}]
    });
    return completion.data.choices[0].message.content.replace("\n\n","")
}

talkToGpt().then((data) =>
    typewriter(data)
)

