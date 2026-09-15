'use client';

import {Button} from '@astryxdesign/core/Button';
import {Divider} from '@astryxdesign/core/Divider';
import {Icon} from '@astryxdesign/core/Icon';
import {HStack, VStack} from '@astryxdesign/core/Layout';
import {Heading, Text} from '@astryxdesign/core/Text';
import {Toast} from '@astryxdesign/core/Toast';
import {CheckCircleIcon, XMarkIcon} from '@heroicons/react/20/solid';
import dynamic from 'next/dynamic';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {InstrumentErrorBoundary} from '@/components/process-instrument/InstrumentErrorBoundary';
import {InstrumentFallback} from '@/components/process-instrument/InstrumentFallback';
import type {InstrumentMode} from '@/components/process-instrument/ProcessInstrumentGraph';
import {
  GET_AG_URL,
  LAND_EYEBROW,
  LAND_HEADLINE,
  LAND_LEDE,
  PROCESS_CHAPTERS,
  shipToastBody,
  type ProcessChapter,
  type ProcessChapterId,
} from '@/lib/process-chapters';

const ProcessInstrumentGraph = dynamic(
  () =>
    import('@/components/process-instrument/ProcessInstrumentGraph').then(
      (m) => m.ProcessInstrumentGraph,
    ),
  {
    ssr: false,
    loading: () => (
      <InstrumentFallback
        className="ag-instrument-canvas"
        reason="loading"
      />
    ), // designed empty while chunk loads — never flat SVG kit
  },
);

export type ProcessInstrumentViewProps = {
  /** Public `/` shows Get AG; admin twin does not (F7). */
  showGetAg?: boolean;
  /** Measured ships this week — toast only when > 0; count stays measured. */
  measuredShipsThisWeek?: number;
  /** Optional QA override: land | hover | inspect | twitch */
  initialMode?: InstrumentMode;
  initialChapter?: ProcessChapterId | null;
};

function resolveQaFromSearch(): {
  mode?: InstrumentMode;
  chapter?: ProcessChapterId;
} {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const qa = params.get('qa');
  if (qa === 'hover') return {mode: 'hover', chapter: 'stills'};
  if (qa === 'inspect') return {mode: 'inspect', chapter: 'stills'};
  if (qa === 'twitch') return {mode: 'twitch', chapter: 'ship'};
  if (qa === 'land') return {mode: 'land'};
  return {};
}

export function ProcessInstrumentView({
  showGetAg = true,
  measuredShipsThisWeek = 0,
  initialMode = 'land',
  initialChapter = null,
}: ProcessInstrumentViewProps) {
  const [mode, setMode] = useState<InstrumentMode>(initialMode);
  const [activeChapter, setActiveChapter] = useState<ProcessChapterId | null>(
    initialChapter,
  );
  const [toastOpen, setToastOpen] = useState(false);
  const [toastDismissed, setToastDismissed] = useState(false);

  useEffect(() => {
    const qa = resolveQaFromSearch();
    if (qa.mode) setMode(qa.mode);
    if (qa.chapter) setActiveChapter(qa.chapter);
    if (qa.mode === 'twitch') setToastOpen(true);
  }, []);

  useEffect(() => {
    // Toast only on real measured ships — not decorative on empty feeds.
    // QA ?qa=twitch forces the F5 still. Count copy stays measured (2).
    if (toastDismissed) return;
    if (measuredShipsThisWeek > 0 && mode !== 'land') {
      // keep existing
    }
    if (measuredShipsThisWeek > 0 && mode === 'twitch') {
      setToastOpen(true);
    }
  }, [measuredShipsThisWeek, mode, toastDismissed]);

  useEffect(() => {
    if (measuredShipsThisWeek <= 0 || toastDismissed) return;
    // Quiet presence: after land settles, show measured ship toast once.
    const id = window.setTimeout(() => {
      setMode((m) => (m === 'land' ? 'twitch' : m));
      setToastOpen(true);
    }, 2200);
    return () => window.clearTimeout(id);
  }, [measuredShipsThisWeek, toastDismissed]);

  const panelChapter: ProcessChapter | null = useMemo(() => {
    if (!activeChapter) return null;
    return PROCESS_CHAPTERS.find((c) => c.id === activeChapter) ?? null;
  }, [activeChapter]);

  const onChapterEnter = useCallback((id: ProcessChapterId) => {
    setActiveChapter(id);
    setMode((m) => (m === 'inspect' ? 'inspect' : 'hover'));
  }, []);

  const onChapterLeave = useCallback(() => {
    setMode((m) => {
      if (m === 'inspect' || m === 'twitch') return m;
      setActiveChapter(null);
      return 'land';
    });
  }, []);

  const onChapterClick = useCallback((id: ProcessChapterId) => {
    setActiveChapter(id);
    setMode('inspect');
  }, []);

  const closePanel = useCallback(() => {
    setActiveChapter(null);
    setMode((m) => (m === 'twitch' ? 'twitch' : 'land'));
  }, []);

  const dismissToast = useCallback(() => {
    setToastOpen(false);
    setToastDismissed(true);
    setMode((m) => (m === 'twitch' ? 'land' : m));
  }, []);

  const showPanel = mode === 'hover' || mode === 'inspect';
  const shipTwitch = mode === 'twitch' && toastOpen;

  return (
    <VStack
      gap={0}
      width="100%"
      minHeight="100dvh"
      className="ag-void-shell"
      style={{
        background: 'var(--ag-void)',
        color: 'var(--ag-ink)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <HStack
        gap={3}
        hAlign="between"
        vAlign="center"
        paddingInline={5}
        paddingBlock={4}
        width="100%"
        className="ag-void-nav"
        style={{position: 'relative', zIndex: 3}}
      >
        <HStack gap={2} vAlign="center">
          <span className="ag-brand-mark" aria-hidden />
          <Text
            type="body"
            weight="medium"
            className="ag-brand-wordmark"
            style={{
              fontFamily: 'var(--font-family-display)',
              letterSpacing: '-0.01em',
            }}
          >
            Agentic Governance
          </Text>
        </HStack>
        {showGetAg ? (
          <Button
            label="Get AG"
            variant="primary"
            size="sm"
            href={GET_AG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ag-get-ag"
          />
        ) : null}
      </HStack>

      <HStack
        gap={8}
        vAlign="stretch"
        paddingInline={5}
        paddingBlockEnd={6}
        width="100%"
        className="ag-void-body"
        style={{
          position: 'relative',
          zIndex: 2,
          flex: 1,
          alignItems: 'flex-start',
        }}
      >
        <VStack
          gap={5}
          maxWidth={420}
          width="100%"
          className="ag-void-copy"
          style={{position: 'relative', zIndex: 2}}
        >
          <VStack gap={3}>
            <Text
              type="supporting"
              className="ag-eyebrow"
              style={{
                color: 'var(--ag-sage)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-family-body)',
              }}
            >
              {LAND_EYEBROW}
            </Text>
            <Heading
              level={1}
              className="ag-display-headline"
              style={{
                fontFamily: 'var(--font-family-display)',
                fontWeight: 500,
                fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                lineHeight: 1.1,
                color: 'var(--ag-ink)',
                letterSpacing: '-0.02em',
                textWrap: 'balance',
              }}
            >
              {LAND_HEADLINE}
            </Heading>
            <Text
              type="body"
              style={{
                color: 'var(--ag-sage-lift)',
                fontFamily: 'var(--font-family-body)',
                maxWidth: '36ch',
              }}
            >
              {LAND_LEDE}
            </Text>
          </VStack>

          <VStack gap={0} width="100%" className="ag-chapter-list">
            {PROCESS_CHAPTERS.map((chapter, index) => {
              const selected = activeChapter === chapter.id;
              return (
                <VStack key={chapter.id} gap={0} width="100%">
                  {index > 0 ? (
                    <Divider className="ag-chapter-rule" />
                  ) : null}
                  <button
                    type="button"
                    className={`ag-chapter-row${selected ? ' is-active' : ''}`}
                    onMouseEnter={() => onChapterEnter(chapter.id)}
                    onMouseLeave={onChapterLeave}
                    onFocus={() => onChapterEnter(chapter.id)}
                    onBlur={onChapterLeave}
                    onClick={() => onChapterClick(chapter.id)}
                  >
                    <HStack gap={3} vAlign="start" width="100%">
                      <Text
                        type="supporting"
                        style={{
                          color: 'var(--ag-sage)',
                          fontFamily: 'var(--font-family-display)',
                          minWidth: '2ch',
                        }}
                      >
                        {chapter.number}
                      </Text>
                      <VStack gap={1} hAlign="start">
                        <Text
                          weight="medium"
                          style={{
                            fontFamily: 'var(--font-family-display)',
                            color: 'var(--ag-ink)',
                            fontSize: '1.05rem',
                          }}
                        >
                          {chapter.title}
                        </Text>
                        <Text
                          type="supporting"
                          style={{
                            color: 'var(--ag-sage)',
                            fontFamily: 'var(--font-family-body)',
                          }}
                        >
                          {chapter.blurb}
                        </Text>
                      </VStack>
                    </HStack>
                  </button>
                </VStack>
              );
            })}
          </VStack>
        </VStack>

        <VStack
          gap={0}
          className="ag-instrument-stage"
          style={{
            flex: 1,
            minHeight: 'var(--ag-instrument-min-h)',
            position: 'relative',
            alignSelf: 'stretch',
          }}
        >
          <InstrumentErrorBoundary className="ag-instrument-canvas">
            <ProcessInstrumentGraph
              mode={mode === 'twitch' ? 'land' : mode}
              activeChapter={activeChapter}
              shipTwitch={shipTwitch}
              className="ag-instrument-canvas"
            />
          </InstrumentErrorBoundary>
        </VStack>
      </HStack>

      {showPanel && panelChapter ? (
        <VStack
          gap={2}
          className="ag-narrative-panel"
          padding={4}
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 'var(--spacing-6)',
            transform: 'translateX(-50%)',
            zIndex: 4,
            width: 'min(420px, calc(100% - var(--spacing-8)))',
            background: 'var(--ag-panel)',
            border: '1px solid var(--ag-panel-border)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <HStack gap={3} hAlign="between" vAlign="start" width="100%">
            <VStack gap={2} hAlign="start">
              <Text
                type="supporting"
                style={{
                  color: 'var(--ag-sage)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-family-body)',
                }}
              >
                {mode === 'inspect' && panelChapter.inspectLabel
                  ? panelChapter.inspectLabel
                  : `CHAPTER ${panelChapter.number}`}
              </Text>
              <Heading
                level={2}
                style={{
                  fontFamily: 'var(--font-family-display)',
                  color: 'var(--ag-ink)',
                  fontSize: '1.5rem',
                  fontWeight: 500,
                }}
              >
                {mode === 'inspect' && panelChapter.inspectTitle
                  ? panelChapter.inspectTitle
                  : panelChapter.title}
              </Heading>
              <Text
                type="body"
                style={{
                  color: 'var(--ag-sage-lift)',
                  fontFamily: 'var(--font-family-body)',
                }}
              >
                {mode === 'inspect' && panelChapter.id === 'stills'
                  ? 'A brief went out. Design made stills. A challenge came back. Two updates made it onto the board.'
                  : panelChapter.story}
              </Text>
            </VStack>
            <Button
              label="Close"
              variant="ghost"
              size="sm"
              isIconOnly
              icon={<Icon icon={XMarkIcon} size="sm" color="inherit" />}
              onClick={closePanel}
            />
          </HStack>
        </VStack>
      ) : null}

      {toastOpen ? (
        <VStack
          className="ag-ship-toast"
          style={{
            position: 'absolute',
            right: 'var(--spacing-5)',
            bottom: 'var(--spacing-5)',
            zIndex: 5,
            width: 'min(360px, calc(100% - var(--spacing-8)))',
          }}
        >
          <Toast
            type="info"
            isAutoHide={false}
            autoHideDuration={8000}
            onDismiss={dismissToast}
            body={
              <HStack gap={3} vAlign="center">
                <Icon icon={CheckCircleIcon} size="md" />
                <Text
                  type="body"
                  style={{fontFamily: 'var(--font-family-body)'}}
                >
                  {shipToastBody(measuredShipsThisWeek)}
                </Text>
              </HStack>
            }
            endContent={
              <Button
                label="Dismiss"
                variant="ghost"
                size="sm"
                isIconOnly
                icon={<Icon icon={XMarkIcon} size="sm" color="inherit" />}
                onClick={dismissToast}
              />
            }
          />
        </VStack>
      ) : null}
    </VStack>
  );
}
