<?php
namespace Backend\Providers\LLM;

interface LLMProviderInterface
{
    public function generateLesson(string $topic, string $language, string $difficulty, string $environment): array;
}
