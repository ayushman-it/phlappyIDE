<?php
namespace Backend\Providers\LLM;

require_once __DIR__ . '/LLMProviderInterface.php';

class GroqProvider implements LLMProviderInterface
{
    private string $apiKey;
    private string $apiUrl;
    private string $model;

    public function __construct(string $apiKey, string $model = 'groq/compound')
    {
        $this->apiKey = $apiKey;
        $this->model = $model;
        $this->apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
    }

    public function generateLesson(string $topic, string $language = 'Hinglish', string $difficulty = 'Beginner', string $environment = 'HTML_CSS_JS'): array
    {
        $systemPrompt = "You are Flappy AI Teacher for TCM One. Output JSON ONLY with keys: title, environment, steps.";
        $userPrompt = "Create detailed interactive lesson for topic: {$topic}, difficulty: {$difficulty}, language: {$language}, environment: {$environment}.";

        $payload = [
            'model' => $this->model,
            'response_format' => ['type' => 'json_object'],
            'messages' => [
                ['role' => 'system', 'content' => $systemPrompt],
                ['role' => 'user', 'content' => $userPrompt]
            ]
        ];

        $ch = curl_init($this->apiUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $this->apiKey,
            'Content-Type: application/json'
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200) {
            throw new \Exception("Groq API error HTTP " . $httpCode . ": " . $response);
        }

        $data = json_decode($response, true);
        $content = $data['choices'][0]['message']['content'] ?? '{}';

        return json_decode($content, true) ?: [];
    }
}
