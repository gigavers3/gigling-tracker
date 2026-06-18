export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { races, wins, id } = req.body;
    const apiKey = process.env.OPENROUTER_API_KEY;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "google/gemini-2.5-flash",
                "messages": [
                    {
                        "role": "system",
                        "content": "Ти — Gigus Maximus, ШІ-антагоніст гри Gigaverse. Твій тон: саркастичний, дотепний, трохи зверхній. Спілкуйся українською мовою. Коротко (1-2 речення) прокоментуй статистику перегонів гравця."
                    },
                    {
                        "role": "user",
                        "content": `Мій Гіглінг #${id} пробіг ${races} гонок з 60 і виграв ${wins} із них.`
                    }
                ]
            })
        });

        const data = await response.json();
        const aiMessage = data.choices[0].message.content;
        return res.status(200).json({ comment: aiMessage });

    } catch (error) {
        return res.status(500).json({ error: "Помилка зв'язку з ШІ" });
    }
}
