const express = require("express");

const { askGemini } = require("./services/gemini");
const { sendWhatsAppMessage } = require("./services/whatsapp");

const systemPrompt = require("./prompts/systemPrompt");

const { logInfo, logError } = require("./utils/logger");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

const VERIFY_TOKEN = "business_guidance_2026";
// Home Route
app.get("/", (req, res) => {
    res.send("🚀 Business Guidance AI is Running!");
});

// WhatsApp Webhook Verification
app.get("/webhook", (req, res) => {

    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {

        logInfo("Webhook Verified Successfully");

        return res.status(200).send(challenge);

    }

    logError("Webhook Verification Failed");

    return res.sendStatus(403);

});
// WhatsApp Webhook Receiver
app.post("/webhook", async (req, res) => {

    try {

        logInfo("WhatsApp Webhook Received");

        const body = req.body;

        if (
            body.object &&
            body.entry &&
            body.entry.length > 0
        ) {

            const change = body.entry[0].changes?.[0];

            if (change && change.value.messages) {

                const message = change.value.messages[0];

                // फक्त Text Messages Handle करा
                if (message.type !== "text") {
                    return res.sendStatus(200);
                }

                const from = message.from;
                const userMessage = message.text.body;

                logInfo(`Message From: ${from}`);
                logInfo(`Message: ${userMessage}`);

                // Prompt तयार करा
                const prompt = `
${systemPrompt}

User Question:
${userMessage}
`;

                // Gemini AI ला प्रश्न
                const aiReply = await askGemini(prompt);

                // WhatsApp वर उत्तर पाठवा
                await sendWhatsAppMessage(from, aiReply);

                logInfo("Reply Sent Successfully");
            }
        }

        return res.sendStatus(200);

    } catch (error) {

        logError(error);

        return res.sendStatus(500);

    }

});
// Test API
app.post("/ask", async (req, res) => {

    try {

        const { message } = req.body;

        const prompt = `
${systemPrompt}

User Question:
${message}
`;

        const aiReply = await askGemini(prompt);

        res.json({
            reply: aiReply
        });

    } catch (error) {

        logError(error);

        res.status(500).json({
            error: "AI Error"
        });

    }

});

// Start Server
app.listen(PORT, () => {

    logInfo(`🚀 Server running on port ${PORT}`);

});