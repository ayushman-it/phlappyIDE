<?php
// TCM One Backend Configuration

return [
    'app_name' => 'TCM One — Flappy AI Ecosystem',
    'environment' => 'development',
    'groq_api_key' => getenv('GROQ_API_KEY') ?: '',
    'groq_model' => 'groq/compound',
    'groq_api_url' => 'https://api.groq.com/openai/v1/chat/completions',
];
