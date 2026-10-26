import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Sparkles, CheckCircle2, Trophy, Star, ArrowRight, RotateCcw, ShieldCheck } from 'lucide-react';

export type ScenarioOption = { id: string; text: string };

export type ScenarioNode = {
  id: string;
  type: 'scenario';
  setting: 'school' | 'home';
  communication_goal: string;
  difficulty: 1 | 2 | 3;
  video_id: string;
  start_seconds: number;
  end_seconds: number;
  interaction_points: Array<{
    at_seconds: number;
    prompt: string;
    options: ScenarioOption[];
    correct_option_id: string;
  }>;
  related_scenario_ids: string[];
};

type ScenarioPlayerProps = {
  scenario: ScenarioNode;
  language?: 'en' | 'swa';
  reducedMotion?: boolean;
  quietMode?: boolean;
  allScenarios?: ScenarioNode[];
  onSelectRelatedScenario?: (scenarioId: string) => void;
  onCorrect: () => void;
  onIncorrect: () => void;
  onCompleted: () => void;
};

type YouTubePlayer = {
  destroy: () => void;
  pauseVideo: () => void;
  playVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
};

type YouTubePlayerEvent = {
  target: YouTubePlayer;
  data: number;
};

type YouTubeApi = {
  Player: new (
    element: HTMLElement,
    options: {
      host?: string;
      videoId: string;
      playerVars: Record<string, string | number>;
      events: {
        onReady: (event: YouTubePlayerEvent) => void;
        onStateChange: (event: YouTubePlayerEvent) => void;
        onError: () => void;
      };
    }
  ) => YouTubePlayer;
  PlayerState: { ENDED: number };
};

declare global {
  interface Window {
    YT?: YouTubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const YOUTUBE_API_SRC = 'https://www.youtube.com/iframe_api';
let youtubeApiPromise: Promise<YouTubeApi> | null = null;

function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${YOUTUBE_API_SRC}"]`);
    window.onYouTubeIframeAPIReady = () => {
      if (window.YT) resolve(window.YT);
    };

    if (!existing) {
      const script = document.createElement('script');
      script.src = YOUTUBE_API_SRC;
      script.async = true;
      script.onerror = () => reject(new Error('YouTube IFrame API failed to load'));
      document.body.appendChild(script);
    }
  });

  return youtubeApiPromise;
}

export default function ScenarioPlayer({
  scenario,
  language = 'en',
  reducedMotion = false,
  allScenarios = [],
  onSelectRelatedScenario,
  onCorrect,
  onIncorrect,
  onCompleted
}: ScenarioPlayerProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const pollRef = useRef<number | null>(null);
  const hasStartedRef = useRef(false);
  const completedInteractionsRef = useRef<Set<number>>(new Set());
  const completedRef = useRef(false);

  const [status, setStatus] = useState<'idle' | 'loading' | 'playing' | 'question' | 'unavailable' | 'completed'>('idle');
  const [activeInteractionIndex, setActiveInteractionIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const interactionPoints = useMemo(() => scenario.interaction_points || [], [scenario]);
  const activeInteraction =
    activeInteractionIndex !== null ? interactionPoints[activeInteractionIndex] || null : null;
  const hasPlayableVideo = Boolean(scenario.video_id && scenario.end_seconds > scenario.start_seconds);

  const pairedScenarios = useMemo(() => {
    return (scenario.related_scenario_ids || [])
      .map(id => allScenarios.find(s => s.id === id))
      .filter((s): s is ScenarioNode => Boolean(s));
  }, [scenario.related_scenario_ids, allScenarios]);

  useEffect(() => {
    setStatus('idle');
    setActiveInteractionIndex(null);
    completedInteractionsRef.current = new Set();
    completedRef.current = false;
    setFeedback('');
    setShowCelebration(false);
    setSelectedOptionId(null);
    hasStartedRef.current = false;

    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
      if (playerRef.current?.destroy) playerRef.current.destroy();
      pollRef.current = null;
      playerRef.current = null;
    };
  }, [scenario.id]);

  const triggerInteractionAtIndex = (idx: number) => {
    if (completedInteractionsRef.current.has(idx)) return;
    playerRef.current?.pauseVideo();
    setActiveInteractionIndex(idx);
    setSelectedOptionId(null);
    setStatus('question');
  };

  const completeScenario = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    if (pollRef.current) window.clearInterval(pollRef.current);
    pollRef.current = null;
    setShowCelebration(true);
    setStatus('completed');
    onCompleted();
  };

  const showFallback = () => {
    console.warn('Scenario video unavailable:', scenario.video_id || '(empty video_id)');
    hasStartedRef.current = true;
    setStatus('unavailable');
  };

  const startFallbackQuestion = () => {
    hasStartedRef.current = true;
    setStatus('question');
    setActiveInteractionIndex(0);
  };

  const startVideo = async () => {
    if (!hasPlayableVideo) {
      showFallback();
      return;
    }

    setStatus('loading');
    try {
      const YT = await loadYouTubeApi();
      if (!hostRef.current) return;

      if (!playerRef.current) {
        playerRef.current = new YT.Player(hostRef.current, {
          host: 'https://www.youtube-nocookie.com',
          videoId: scenario.video_id,
          playerVars: {
            start: scenario.start_seconds,
            end: scenario.end_seconds,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            autoplay: 0
          },
          events: {
            onReady: event => {
              hasStartedRef.current = true;
              setStatus('playing');
              event.target.seekTo(scenario.start_seconds, true);
              event.target.playVideo();
            },
            onStateChange: event => {
              if (
                event.data === YT.PlayerState.ENDED &&
                completedInteractionsRef.current.size >= interactionPoints.length
              ) {
                completeScenario();
              }
            },
            onError: () => showFallback()
          }
        });
      } else {
        hasStartedRef.current = true;
        setStatus('playing');
        playerRef.current.seekTo(scenario.start_seconds, true);
        playerRef.current.playVideo();
      }

      if (pollRef.current) window.clearInterval(pollRef.current);
      pollRef.current = window.setInterval(() => {
        const player = playerRef.current;
        if (!player?.getCurrentTime) return;
        const current = player.getCurrentTime();

        // Check if any pending interaction point has been reached
        for (let i = 0; i < interactionPoints.length; i++) {
          const pt = interactionPoints[i];
          if (!completedInteractionsRef.current.has(i) && current >= pt.at_seconds) {
            triggerInteractionAtIndex(i);
            return;
          }
        }

        if (
          completedInteractionsRef.current.size >= interactionPoints.length &&
          current >= scenario.end_seconds
        ) {
          completeScenario();
        }
      }, 250);
    } catch {
      showFallback();
    }
  };

  const chooseOption = (optionId: string) => {
    if (!activeInteraction || activeInteractionIndex === null) return;
    setSelectedOptionId(optionId);

    if (optionId === activeInteraction.correct_option_id) {
      setFeedback(
        language === 'en'
          ? 'Correct — clear and respectful communication choice!'
          : 'Sahihi — chaguo bora na lenye heshima la mawasiliano!'
      );
      completedInteractionsRef.current.add(activeInteractionIndex);
      setShowCelebration(true);
      onCorrect();

      window.setTimeout(
        () => {
          setShowCelebration(false);
          setActiveInteractionIndex(null);
          setSelectedOptionId(null);
          if (!hasPlayableVideo || status === 'unavailable') {
            completeScenario();
          } else {
            setStatus('playing');
            playerRef.current?.seekTo(activeInteraction.at_seconds + 0.5, true);
            playerRef.current?.playVideo();
          }
        },
        reducedMotion ? 400 : 1100
      );
      return;
    }

    // Gentle supportive retry: rewind 4 seconds (3-5s window) preceding the interaction point
    setFeedback(
      language === 'en'
        ? 'Let us watch that moment one more time (rewinding 4 seconds) and try the calmest response.'
        : 'Hebu tutazame tena sekunde 4 zilizopita kisha tujaribu jibu tulivu.'
    );
    onIncorrect();
    if (hasPlayableVideo && status !== 'unavailable') {
      const rewindTarget = Math.max(scenario.start_seconds, activeInteraction.at_seconds - 4);
      window.setTimeout(() => {
        playerRef.current?.seekTo(rewindTarget, true);
        playerRef.current?.playVideo();
        setActiveInteractionIndex(null);
        setSelectedOptionId(null);
        setStatus('playing');
      }, 900);
    }
  };

  const allAnswered =
    interactionPoints.length > 0 &&
    completedInteractionsRef.current.size >= interactionPoints.length;

  return (
    <section
      className="bg-white dark:bg-[#231E1A] border border-[#C77700]/15 dark:border-white/10 rounded-[28px] p-5 shadow-xs relative overflow-hidden"
      aria-label="Autism World scenario player"
    >
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[11px] font-bold text-[#C77700]">
            <span>Autism World Scenario</span>
            <span aria-hidden="true">·</span>
            <span className="text-gray-500 dark:text-gray-400 font-mono tabular-nums">
              {scenario.start_seconds}s–{scenario.end_seconds}s
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 text-[#2F6B4F]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>youtube-nocookie.com</span>
            </span>
          </div>

          {allAnswered && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2F6B4F]">
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'en' ? 'Scenario Mastered' : 'Tukio Limekamilika'}</span>
            </span>
          )}
        </div>

        <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#2D3748] dark:text-[#F5EFEB] capitalize">
          {scenario.setting}: {scenario.communication_goal}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {language === 'en'
            ? 'Bounded practice with no autoplay. Video pauses automatically at the interaction timestamp so you can choose a response.'
            : 'Mazoezi yenye mipaka bila kuanza yenyewe. Video husimama kwenye sekunde maalum ili uchague jibu sahihi.'}
        </p>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-[#2D3748] min-h-[280px] flex items-center justify-center text-white">
        {hasPlayableVideo && <div ref={hostRef} className="absolute inset-0 w-full h-full" />}

        {!hasStartedRef.current && status !== 'loading' && (
          <div className="relative z-10 flex flex-col items-center gap-3 p-6 text-center">
            <button
              onClick={startVideo}
              className="bg-[#E89B2E] text-[#2D3748] px-6 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider hover:bg-[#d88d22] transition-colors cursor-pointer shadow-md"
            >
              {language === 'en' ? 'Start Scenario' : 'Anza Tukio la Video'}
            </button>
            <button
              onClick={startFallbackQuestion}
              className="text-[11px] font-semibold text-white/80 hover:text-white underline cursor-pointer"
            >
              {language === 'en'
                ? 'Or practice the social response prompt directly'
                : 'Au fanya mazoezi ya swali moja kwa moja'}
            </button>
          </div>
        )}

        {status === 'loading' && (
          <p className="relative z-10 text-sm font-bold">
            {language === 'en' ? 'Loading privacy-enhanced video…' : 'Inapakia video…'}
          </p>
        )}

        {status === 'unavailable' && !activeInteraction && (
          <div className="relative z-10 max-w-md text-center p-6 bg-[#2D3748]/95 rounded-2xl border border-white/15">
            <p className="text-lg font-bold font-serif">
              {language === 'en' ? 'Scenario Video Unavailable' : 'Video ya Tukio Haipatikani'}
            </p>
            <p className="text-xs text-white/80 mt-2 leading-relaxed">
              {language === 'en'
                ? `The embedded video (${scenario.video_id || 'unassigned'}) could not be loaded on this connection. You can still complete the social communication prompt below.`
                : `Video (${scenario.video_id || 'hakuna'}) haijaweza kupakiwa. Bado unaweza kufanya mazoezi ya swali la mawasiliano hapa chini.`}
            </p>
            <button
              onClick={startFallbackQuestion}
              className="mt-4 bg-[#E89B2E] text-[#2D3748] px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider hover:bg-[#d88d22] transition-colors cursor-pointer"
            >
              {language === 'en' ? 'Practice Communication Prompt' : 'Jibu Swali la Mawasiliano'}
            </button>
          </div>
        )}

        {activeInteraction && (
          <div className="absolute inset-0 z-20 bg-[#2D3748]/95 flex items-center justify-center p-5">
            <div className="bg-[#FFF8EE] dark:bg-[#231E1A] text-[#2D3748] dark:text-[#F5EFEB] rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-[#C77700]/25 relative">
              {showCelebration && selectedOptionId === activeInteraction.correct_option_id && (
                <div className="absolute inset-0 z-30 bg-[#2F6B4F] rounded-2xl flex flex-col items-center justify-center p-6 text-white text-center">
                  <div className="w-14 h-14 rounded-full bg-[#E89B2E] text-[#2D3748] flex items-center justify-center mb-3">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold font-serif mb-1">
                    {language === 'en' ? 'Wonderful Choice!' : 'Chaguo Bora Kabisa!'}
                  </h4>
                  <p className="text-xs text-white/90 max-w-xs">
                    {language === 'en'
                      ? 'Clear social communication builds confidence at school and home.'
                      : 'Mawasiliano mazuri hujenga kujiamini shuleni na nyumbani.'}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] font-bold text-[#C77700] mb-2">
                <span>
                  {language === 'en' ? 'Interaction Prompt' : 'Swali la Mawasiliano'} (@{activeInteraction.at_seconds}s)
                </span>
                <span className="capitalize">{scenario.setting}</span>
              </div>

              <p className="text-base sm:text-lg font-bold font-serif mb-4">
                {activeInteraction.prompt}
              </p>

              <div className="grid gap-2.5">
                {activeInteraction.options.map(option => {
                  const isSelected = selectedOptionId === option.id;
                  const isCorrect = option.id === activeInteraction.correct_option_id;

                  let buttonStyle =
                    'bg-white dark:bg-stone-900 hover:bg-[#E89B2E]/15 border border-[#C77700]/25 text-[#2D3748] dark:text-[#F5EFEB]';
                  if (isSelected && isCorrect) {
                    buttonStyle = 'bg-[#2F6B4F] text-white border-[#2F6B4F]';
                  } else if (isSelected && !isCorrect) {
                    buttonStyle =
                      'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-amber-400';
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => chooseOption(option.id)}
                      className={`text-left rounded-xl px-4 py-3 text-xs sm:text-sm font-bold transition-colors flex items-center justify-between cursor-pointer ${buttonStyle}`}
                    >
                      <span>{option.text}</span>
                      {isSelected && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-white shrink-0 ml-2" />
                      )}
                      {isSelected && !isCorrect && (
                        <RotateCcw className="w-4 h-4 text-amber-700 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {status === 'completed' && (
          <div className="relative z-10 text-center p-6 bg-[#2D3748]/95 rounded-2xl max-w-md">
            <div className="w-16 h-16 rounded-full bg-[#E89B2E]/20 border border-[#E89B2E] text-[#E89B2E] flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-8 h-8 text-[#E89B2E]" />
            </div>
            <p className="text-xl font-bold font-serif">
              {language === 'en' ? 'Scenario Complete!' : 'Tukio Limekamilika!'}
            </p>
            <p className="text-xs text-white/85 mt-1">
              {language === 'en'
                ? 'Exposure and recall scheduling have been updated for this child profile.'
                : 'Maendeleo na ratiba ya kurejelea imesasishwa kwa mtoto huyu.'}
            </p>
            <div className="flex justify-center gap-1.5 mt-3 text-amber-300">
              <Star className="w-4 h-4 fill-amber-300" />
              <Star className="w-4 h-4 fill-amber-300" />
              <Star className="w-4 h-4 fill-amber-300" />
            </div>
          </div>
        )}
      </div>

      {feedback && (
        <div
          className={`mt-3 p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
            allAnswered
              ? 'bg-[#2F6B4F]/10 text-[#2F6B4F] border border-[#2F6B4F]/20'
              : 'bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800'
          }`}
          role="status"
        >
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Paired Cue Transfer Scenarios (School <-> Home Generalization) */}
      {pairedScenarios.length > 0 && onSelectRelatedScenario && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold text-[#2F6B4F] block">
              {language === 'en'
                ? 'Cue Transfer Practice (Different Setting)'
                : 'Uhamisho wa Mawasiliano (Mazingira Mengine)'}
            </span>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              {language === 'en'
                ? 'Practice the same social communication skill in a paired setting to test generalization:'
                : 'Jaribu ujuzi huu katika mazingira yanayohusiana (Shuleni ↔ Nyumbani):'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {pairedScenarios.map(rel => (
              <button
                key={rel.id}
                onClick={() => onSelectRelatedScenario(rel.id)}
                className="px-3 py-2 rounded-xl bg-[#FFF8EE] dark:bg-stone-900 hover:bg-[#C77700]/10 border border-[#C77700]/25 text-xs font-bold text-[#2D3748] dark:text-[#F5EFEB] flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <span className="capitalize">{rel.setting}:</span>
                <span className="truncate max-w-[180px]">{rel.communication_goal}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C77700] shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
