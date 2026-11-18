// ═══════════════════════════════════════════════════════
// ScreenMind — Proxy IA (Cloudflare Worker)
// La clé API est stockée ICI (variable secrète du Worker),
// elle n'apparaît jamais dans le site ni dans GitHub.
//
// Déploiement :
//  1. dash.cloudflare.com → Workers & Pages → Créer
//  2. Coller ce fichier dans l'éditeur → Déployer
//  3. Paramètres → Variables et Secrets → ajouter OPENROUTER_KEY
//  4. Copier l'URL du Worker (https://screenmind.xxx.workers.dev)
// ═══════════════════════════════════════════════════════

const MODELS = [
    'nvidia/nemotron-3.5-super-vl:free',
    'google/gemma-4-26b-a4b-it:free'
];

export default {
    async fetch(request, env) {
        const origin = request.headers.get('Origin') || '*';
        const cors = {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Type': 'application/json; charset=utf-8'
        };

        if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
        if (request.method !== 'POST') return new Response('ScreenMind proxy OK', { headers: cors });

        let prompt, image, model, audio, mime;
        try {
            const body = await request.json();
            prompt = body.prompt;
            image = body.image;
            model = body.model;
            audio = body.audio;
            mime = body.mime;
        } catch (e) {
            return new Response(JSON.stringify({ error: 'JSON invalide' }), { status: 400, headers: cors });
        }

        // ── Transcription audio (Groq Whisper) ──
        if (audio) {
            if (!env.GROQ_KEY) {
                return new Response(JSON.stringify({ error: 'GROQ_KEY manquante sur le Worker (ajoute-la dans Variables and Secrets)' }), { status: 500, headers: cors });
            }
            try {
                const bin = atob(audio);
                const bytes = new Uint8Array(bin.length);
                for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
                const fd = new FormData();
                fd.append('file', new Blob([bytes], { type: mime || 'audio/mpeg' }), 'audio.mp3');
                fd.append('model', 'whisper-large-v3');
                const r = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
                    method: 'POST',
                    headers: { 'Authorization': 'Bearer ' + env.GROQ_KEY },
                    body: fd
                });
                const data = await r.json().catch(() => ({}));
                if (!r.ok) {
                    const msg = (data.error && (data.error.message || data.error)) || ('HTTP ' + r.status);
                    return new Response(JSON.stringify({ error: typeof msg === 'string' ? msg : JSON.stringify(msg) }), { status: r.status, headers: cors });
                }
                return new Response(JSON.stringify({ text: (data.text || '').trim() }), { status: 200, headers: cors });
            } catch (e) {
                return new Response(JSON.stringify({ error: 'Transcription : ' + e }), { status: 500, headers: cors });
            }
        }

        if (!prompt) {
            return new Response(JSON.stringify({ error: 'Requête invalide (prompt manquant)' }), { status: 400, headers: cors });
        }
        if (!env.OPENROUTER_KEY) {
            return new Response(JSON.stringify({ error: 'OPENROUTER_KEY manquante sur le Worker' }), { status: 500, headers: cors });
        }

        const models = [model].concat(MODELS).filter((m, i, a) => m && a.indexOf(m) === i);
        let lastError = null;

        for (const m of models) {
            let res;
            try {
                const content = image
                    ? [
                        { type: 'text', text: prompt },
                        { type: 'image_url', image_url: { url: 'data:' + (image.mime || 'image/png') + ';base64,' + image.b64 } }
                    ]
                    : prompt;
                res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + env.OPENROUTER_KEY,
                        'HTTP-Referer': 'https://fr3nchh.github.io',
                        'X-Title': 'ScreenMind'
                    },
                    body: JSON.stringify({
                        model: m,
                        messages: [{ role: 'user', content: content }],
                        temperature: 0.3
                    })
                });
            } catch (e) {
                lastError = 'Réseau : ' + e;
                continue;
            }

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                const msg = (data.error && (data.error.message || data.error)) || ('HTTP ' + res.status);
                lastError = typeof msg === 'string' ? msg : JSON.stringify(msg);
                if (res.status === 404 || res.status === 429 || res.status >= 500) continue;  // on tente le modèle suivant
                break;
            }

            let content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
            if (Array.isArray(content)) content = content.map(c => (c && c.text) || '').join('');
            content = (content || '').trim();

            if (content) {
                return new Response(JSON.stringify({ text: content, model: m }), { status: 200, headers: cors });
            }
            lastError = 'Réponse vide du modèle ' + m;
        }

        return new Response(JSON.stringify({ error: lastError || 'Erreur inconnue' }), { status: 502, headers: cors });
    }
};
