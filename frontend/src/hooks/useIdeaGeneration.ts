import { useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { generateVentureStream } from '../services/ai.service';
import toast from 'react-hot-toast';

export function useIdeaGeneration() {
  const {
    session,
    settings,
    isGenerating,
    generationProgress,
    streamingText,
    setGenerating,
    setGenerationProgress,
    appendStreamingText,
    clearStreamingText,
    saveGenerated,
  } = useAppStore();

  const generate = useCallback(async () => {
    if (!session || session.ideas.length === 0) {
      toast.error('Necesitás al menos una idea para generar el venture');
      return;
    }

    if (!settings.apiKey) {
      toast.error('Configurá tu API Key de Anthropic primero');
      return;
    }

    if (isGenerating) return;

    setGenerating(true);
    clearStreamingText();
    setGenerationProgress('Iniciando análisis...');

    try {
      const venture = await generateVentureStream(
        session,
        settings.apiKey,
        (text) => appendStreamingText(text),
        (msg) => setGenerationProgress(msg)
      );

      saveGenerated(venture);
      toast.success(`¡${venture.ventureName} ha sido creado!`, {
        icon: '🚀',
        duration: 5000,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al generar';
      toast.error(msg);
      setGenerationProgress('');
    } finally {
      setGenerating(false);
    }
  }, [
    session,
    settings.apiKey,
    isGenerating,
    setGenerating,
    clearStreamingText,
    setGenerationProgress,
    appendStreamingText,
    saveGenerated,
  ]);

  return {
    generate,
    isGenerating,
    generationProgress,
    streamingText,
    canGenerate: Boolean(session?.ideas.length && settings.apiKey && !isGenerating),
  };
}
