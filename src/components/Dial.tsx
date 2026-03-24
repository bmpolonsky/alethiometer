import { useEffect, useMemo, useRef, useState } from "react";
import { appController } from "../app/services/appController";
import { readingService } from "../app/services/readingService";
import { sessionService } from "../app/services/sessionService";
import { questionStore } from "../app/store/questionStore";
import {
  answerHandAngleStore,
  answerSymbolsStore,
  readingStatusStore,
} from "../app/store/readingStore";
import {
  graphicsSpritesheetFrames,
  graphicsSpritesheetHref,
  graphicsSpritesheetSize,
} from "../domain/graphicsSpritesheet";
import type { HandId } from "../domain/types";
import {
  DIAL_GEOMETRY,
  describeRingSlice,
  pointToSymbolIndex,
} from "../lib/geometry";

const spritesheetFrames = graphicsSpritesheetFrames;

const handAssets: Record<
  HandId | "answer",
  {
    frame: { x: number; y: number; width: number; height: number; pivotX: number; pivotY: number };
    width: number;
    height: number;
    pivotX: number;
    pivotY: number;
    scale: number;
  }
> = {
  first: {
    frame: spritesheetFrames.arrow1,
    width: spritesheetFrames.arrow1.width,
    height: spritesheetFrames.arrow1.height,
    pivotX: spritesheetFrames.arrow1.pivotX,
    pivotY: spritesheetFrames.arrow1.pivotY,
    scale: 1,
  },
  second: {
    frame: spritesheetFrames.arrow2,
    width: spritesheetFrames.arrow2.width,
    height: spritesheetFrames.arrow2.height,
    pivotX: spritesheetFrames.arrow2.pivotX,
    pivotY: spritesheetFrames.arrow2.pivotY,
    scale: 1,
  },
  third: {
    frame: spritesheetFrames.arrow3,
    width: spritesheetFrames.arrow3.width,
    height: spritesheetFrames.arrow3.height,
    pivotX: spritesheetFrames.arrow3.pivotX,
    pivotY: spritesheetFrames.arrow3.pivotY,
    scale: 1,
  },
  answer: {
    frame: spritesheetFrames.arrow4,
    width: spritesheetFrames.arrow4.width,
    height: spritesheetFrames.arrow4.height,
    pivotX: spritesheetFrames.arrow4.pivotX,
    pivotY: spritesheetFrames.arrow4.pivotY,
    scale: 1,
  },
};

const wheelConfigs: Array<{
  handId: HandId;
  offsetX: number;
  offsetY: number;
  rotationDeg: number;
}> = [
  { handId: "first", offsetX: -245, offsetY: 145, rotationDeg: -120 },
  { handId: "second", offsetX: 2, offsetY: -290, rotationDeg: 0 },
  { handId: "third", offsetX: 241, offsetY: 146, rotationDeg: 120 },
];

const MEDITATIVE_ASK_RADIUS = 146;
const MEDITATIVE_ASK_HOLD_MS = 1600;
const MEDITATIVE_ASK_ANIMATION_MS = 620;

function formatRotationAngle(angle: number) {
  const normalized = ((angle % 360) + 360) % 360;

  return Math.round(normalized);
}

function renderSpritesheetCrop(
  frame: { x: number; y: number; width: number; height: number },
  offsetX: number,
  offsetY: number,
) {
  return (
    <image
      href={graphicsSpritesheetHref}
      x={Math.round(-frame.x + offsetX)}
      y={Math.round(-frame.y + offsetY)}
      width={graphicsSpritesheetSize.width}
      height={graphicsSpritesheetSize.height}
      preserveAspectRatio="none"
    />
  );
}

export function Dial() {
  const initialHands = questionStore.getState().hands;
  const initialAnswerHandAngle = answerHandAngleStore.getState();
  const initialReadingStatus = readingStatusStore.getState();
  const initialAnswerSymbols = answerSymbolsStore.getState();
  const dialShellRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const questionHandRefs = useRef<Record<HandId, SVGGElement | null>>({
    first: null,
    second: null,
    third: null,
  });
  const wheelGroupRefs = useRef<Record<HandId, SVGGElement | null>>({
    first: null,
    second: null,
    third: null,
  });
  const wheelVisualRefs = useRef<
    Record<
      HandId,
      {
        idle: SVGGElement | null;
        active: SVGGElement | null;
      }
    >
  >({
    first: { idle: null, active: null },
    second: { idle: null, active: null },
    third: { idle: null, active: null },
  });
  const answerHandRef = useRef<SVGGElement | null>(null);
  const askHoldTimeoutRef = useRef<number | null>(null);
  const askAnimationTimeoutRef = useRef<number | null>(null);
  const askHoldRef = useRef<{
    pointerId: number;
    triggered: boolean;
    startedAt: number;
    frame: number;
  } | null>(null);
  const dragStateRef = useRef<{
    handId: HandId;
    pointerId: number;
    residuePixels: number;
    lastLocalX: number;
    lastLocalY: number;
    wheelRotationRad: number;
  } | null>(null);
  const handsRef = useRef<Record<HandId, number>>(initialHands);
  const answerHandAngleRef = useRef(initialAnswerHandAngle);
  const interactiveRef = useRef(initialReadingStatus === "idle");
  const askEnabledRef = useRef(
    initialReadingStatus === "idle" && initialAnswerSymbols.length === 0,
  );
  const draggingHandRef = useRef<HandId | null>(null);
  const wheelFramePhaseRef = useRef<Record<HandId, 0 | 1>>({
    first: 0,
    second: 0,
    third: 0,
  });
  const [isAskAnimating, setIsAskAnimating] = useState(false);
  const [showAskTrigger, setShowAskTrigger] = useState(askEnabledRef.current);
  const glareX = Math.round(DIAL_GEOMETRY.centerX - spritesheetFrames.glare.pivotX);
  const glareY = Math.round(DIAL_GEOMETRY.centerY - spritesheetFrames.glare.pivotY);

  const initialDisplayAngles = useMemo(
    () => ({
      first: initialHands.first * 10,
      second: initialHands.second * 10,
      third: initialHands.third * 10,
    }),
    [initialHands.first, initialHands.second, initialHands.third],
  );

  function setQuestionHandTransform(handId: HandId, angle: number) {
    questionHandRefs.current[handId]?.setAttribute(
      "transform",
      `translate(${DIAL_GEOMETRY.centerX} ${DIAL_GEOMETRY.centerY}) rotate(${formatRotationAngle(angle)})`,
    );
  }

  function setAnswerHandTransform(angle: number) {
    answerHandRef.current?.setAttribute(
      "transform",
      `translate(${DIAL_GEOMETRY.centerX} ${DIAL_GEOMETRY.centerY}) rotate(${formatRotationAngle(angle)})`,
    );
  }

  function setWheelFramePhase(handId: HandId, phase: 0 | 1) {
    const visualRefs = wheelVisualRefs.current[handId];

    visualRefs.idle?.setAttribute("opacity", phase === 0 ? "1" : "0");
    visualRefs.active?.setAttribute("opacity", phase === 1 ? "1" : "0");
  }

  function setWheelDragging(handId: HandId, isDragging: boolean) {
    wheelGroupRefs.current[handId]?.classList.toggle("is-dragging", isDragging);
  }

  function resetWheelVisuals() {
    for (const handId of ["first", "second", "third"] as HandId[]) {
      setWheelDragging(handId, false);
      setWheelFramePhase(handId, 0);
      wheelFramePhaseRef.current[handId] = 0;
    }

    draggingHandRef.current = null;
  }

  function syncInteractionState() {
    const nextInteractive = readingStatusStore.getState() === "idle";
    const nextAskEnabled =
      nextInteractive && answerSymbolsStore.getState().length === 0;

    interactiveRef.current = nextInteractive;
    askEnabledRef.current = nextAskEnabled;
    setShowAskTrigger(nextAskEnabled);
  }

  useEffect(() => {
    return () => {
      if (askHoldTimeoutRef.current) {
        window.clearTimeout(askHoldTimeoutRef.current);
      }

      if (askAnimationTimeoutRef.current) {
        window.clearTimeout(askAnimationTimeoutRef.current);
      }

      if (askHoldRef.current?.frame) {
        window.cancelAnimationFrame(askHoldRef.current.frame);
      }

      resetWheelVisuals();
      setDialHoldProgress(0);
    };
  }, []);

  useEffect(() => {
    setQuestionHandTransform("first", handsRef.current.first * 10);
    setQuestionHandTransform("second", handsRef.current.second * 10);
    setQuestionHandTransform("third", handsRef.current.third * 10);
    setAnswerHandTransform(answerHandAngleRef.current);
    syncInteractionState();

    const unsubscribeQuestion = questionStore.subscribe(({ hands }) => {
      handsRef.current = hands;
      setQuestionHandTransform("first", hands.first * 10);
      setQuestionHandTransform("second", hands.second * 10);
      setQuestionHandTransform("third", hands.third * 10);
    });

    const unsubscribeAnswerHandAngle = answerHandAngleStore.subscribe((nextAngle) => {
      answerHandAngleRef.current = nextAngle;
      setAnswerHandTransform(nextAngle);
    });

    const unsubscribeReadingStatus = readingStatusStore.subscribe(() => {
      syncInteractionState();
    });

    const unsubscribeAnswerSymbols = answerSymbolsStore.subscribe(() => {
      syncInteractionState();
    });

    return () => {
      unsubscribeQuestion();
      unsubscribeAnswerHandAngle();
      unsubscribeReadingStatus();
      unsubscribeAnswerSymbols();
    };
  }, []);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (dragStateRef.current?.pointerId !== event.pointerId) {
        return;
      }

      if (event.cancelable) {
        event.preventDefault();
      }

      moveWheelDrag(event.clientX, event.clientY);
    };

    const handlePointerRelease = (event: PointerEvent) => {
      if (dragStateRef.current?.pointerId !== event.pointerId) {
        return;
      }

      if (event.cancelable) {
        event.preventDefault();
      }

      stopWheelDrag();
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: false });
    window.addEventListener("pointerup", handlePointerRelease, { passive: false });
    window.addEventListener("pointercancel", handlePointerRelease, { passive: false });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerRelease);
      window.removeEventListener("pointercancel", handlePointerRelease);
    };
  }, []);

  function getLocalPoint(clientX: number, clientY: number) {
    const svg = svgRef.current;

    if (!svg) {
      return null;
    }

    const rect = svg.getBoundingClientRect();

    return {
      x: ((clientX - rect.left) / rect.width) * DIAL_GEOMETRY.width,
      y: ((clientY - rect.top) / rect.height) * DIAL_GEOMETRY.height,
    };
  }

  function isWithinMeditativeAskZone(clientX: number, clientY: number) {
    const point = getLocalPoint(clientX, clientY);

    if (!point) {
      return false;
    }

    return (
      Math.hypot(point.x - DIAL_GEOMETRY.centerX, point.y - DIAL_GEOMETRY.centerY) <=
      MEDITATIVE_ASK_RADIUS
    );
  }

  function setDialHoldProgress(progress: number) {
    dialShellRef.current?.style.setProperty(
      "--dial-hold-scale",
      String(1 + progress * 0.07),
    );
    dialShellRef.current?.style.setProperty(
      "--dial-hold-glow-opacity",
      String(Math.min(progress * 0.48, 0.48)),
    );
  }

  function cancelMeditativeAskHold() {
    if (askHoldTimeoutRef.current) {
      window.clearTimeout(askHoldTimeoutRef.current);
      askHoldTimeoutRef.current = null;
    }

    if (askHoldRef.current?.frame) {
      window.cancelAnimationFrame(askHoldRef.current.frame);
    }

    askHoldRef.current = null;
    setDialHoldProgress(0);
  }

  function startMeditativeAsk() {
    if (!askEnabledRef.current || !interactiveRef.current || isAskAnimating) {
      return;
    }

    setIsAskAnimating(true);
    askAnimationTimeoutRef.current = window.setTimeout(() => {
      askAnimationTimeoutRef.current = null;
      setDialHoldProgress(0);
      setIsAskAnimating(false);
      readingService.ask();
    }, MEDITATIVE_ASK_ANIMATION_MS);
  }

  function beginMeditativeAskHold(pointerId: number, target: SVGCircleElement) {
    if (!askEnabledRef.current || !interactiveRef.current || isAskAnimating) {
      return;
    }

    cancelMeditativeAskHold();
    askHoldRef.current = {
      pointerId,
      triggered: false,
      startedAt: performance.now(),
      frame: 0,
    };
    setDialHoldProgress(0);
    target.setPointerCapture(pointerId);
    const tick = () => {
      const holdState = askHoldRef.current;

      if (!holdState || holdState.pointerId !== pointerId || holdState.triggered) {
        return;
      }

      const nextProgress = Math.min(
        (performance.now() - holdState.startedAt) / MEDITATIVE_ASK_HOLD_MS,
        1,
      );

      setDialHoldProgress(nextProgress);
      holdState.frame = window.requestAnimationFrame(tick);
      askHoldRef.current = holdState;
    };

    askHoldRef.current.frame = window.requestAnimationFrame(tick);
    askHoldTimeoutRef.current = window.setTimeout(() => {
      if (askHoldRef.current?.pointerId !== pointerId) {
        return;
      }

      if (askHoldRef.current.frame) {
        window.cancelAnimationFrame(askHoldRef.current.frame);
      }

      askHoldRef.current = {
        pointerId,
        triggered: true,
        startedAt: performance.now(),
        frame: 0,
      };
      askHoldTimeoutRef.current = null;
      setDialHoldProgress(1);
      startMeditativeAsk();
    }, MEDITATIVE_ASK_HOLD_MS);
  }

  function inspectByPointer(clientX: number, clientY: number) {
    const point = getLocalPoint(clientX, clientY);

    if (!point) {
      return;
    }

    const nextSymbol = pointToSymbolIndex(point.x, point.y);

    if (nextSymbol != null) {
      appController.inspectSymbolFromDial(nextSymbol);
    }
  }

  function startWheelDrag(
    handId: HandId,
    wheelRotationDeg: number,
    pointerId: number,
    clientX: number,
    clientY: number,
    target: SVGRectElement,
  ) {
    if (!interactiveRef.current || isAskAnimating) {
      return;
    }

    const localPoint = getLocalPoint(clientX, clientY);

    if (!localPoint) {
      return;
    }

    sessionService.focusHand(handId);
    dragStateRef.current = {
      handId,
      pointerId,
      residuePixels: 0,
      lastLocalX: localPoint.x,
      lastLocalY: localPoint.y,
      wheelRotationRad: (wheelRotationDeg * Math.PI) / 180,
    };
    draggingHandRef.current = handId;
    setWheelDragging(handId, true);
    wheelFramePhaseRef.current[handId] = 1;
    setWheelFramePhase(handId, 1);
    try {
      target.setPointerCapture(pointerId);
    } catch {
      // Some mobile browsers are inconsistent with pointer capture on SVG nodes.
    }
  }

  function moveWheelDrag(clientX: number, clientY: number) {
    const dragState = dragStateRef.current;

    if (!dragState) {
      return;
    }

    const localPoint = getLocalPoint(clientX, clientY);

    if (!localPoint) {
      return;
    }

    const dx = localPoint.x - dragState.lastLocalX;
    const dy = localPoint.y - dragState.lastLocalY;
    const delta =
      Math.cos(dragState.wheelRotationRad) * dx +
      Math.sin(dragState.wheelRotationRad) * dy;

    if (Math.abs(delta) > 0.3) {
      const nextPhase = wheelFramePhaseRef.current[dragState.handId] === 0 ? 1 : 0;

      wheelFramePhaseRef.current[dragState.handId] = nextPhase;
      setWheelFramePhase(dragState.handId, nextPhase);
    }

    const totalPixels = dragState.residuePixels + delta;
    const pixelsPerSymbol = 11;
    const steps =
      totalPixels > 0
        ? Math.floor(totalPixels / pixelsPerSymbol)
        : Math.ceil(totalPixels / pixelsPerSymbol);

    if (steps !== 0) {
      sessionService.nudgeHand(dragState.handId, steps);
      dragState.residuePixels = totalPixels - steps * pixelsPerSymbol;
    } else {
      dragState.residuePixels = totalPixels;
    }

    dragState.lastLocalX = localPoint.x;
    dragState.lastLocalY = localPoint.y;
  }

  function stopWheelDrag() {
    dragStateRef.current = null;
    resetWheelVisuals();
  }

  return (
    <div className={`dial-shell ${isAskAnimating ? "is-asking" : ""}`} ref={dialShellRef}>
      <div className="dial-stage">
        <svg
          ref={svgRef}
          className="dial"
          viewBox={`0 0 ${DIAL_GEOMETRY.width} ${DIAL_GEOMETRY.height}`}
          onClick={(event) => inspectByPointer(event.clientX, event.clientY)}
          onContextMenu={(event) => event.preventDefault()}
        >
        <defs>
          <clipPath id="dial-device-clip">
            <rect
              x="0"
              y="0"
              width={spritesheetFrames.device.width}
              height={spritesheetFrames.device.height}
            />
          </clipPath>
          <clipPath id="dial-glare-clip">
            <rect
              x={glareX}
              y={glareY}
              width={spritesheetFrames.glare.width}
              height={spritesheetFrames.glare.height}
            />
          </clipPath>
          {wheelConfigs.map(({ handId }) => (
            <clipPath id={`dial-wheel-clip-${handId}`} key={`clip-${handId}`}>
              <rect
                x={-spritesheetFrames.wheelIdle.pivotX}
                y={-spritesheetFrames.wheelIdle.pivotY}
                width={spritesheetFrames.wheelIdle.width}
                height={spritesheetFrames.wheelIdle.height}
                rx="12"
                ry="12"
              />
            </clipPath>
          ))}
        </defs>

        <g clipPath="url(#dial-device-clip)">
          {renderSpritesheetCrop(spritesheetFrames.device, 0, 0)}
        </g>

        {Array.from({ length: 36 }, (_, symbolId) => {
          const startAngle = symbolId * 10 - 5;
          const endAngle = symbolId * 10 + 5;
          const slicePath = describeRingSlice(
            DIAL_GEOMETRY.centerX,
            DIAL_GEOMETRY.centerY,
            DIAL_GEOMETRY.ringInnerRadius,
            DIAL_GEOMETRY.ringOuterRadius,
            startAngle,
            endAngle,
          );

          return (
            <path
              key={symbolId}
              d={slicePath}
              className="dial-slice-hit"
              fill="rgba(255,255,255,0.001)"
            />
          );
        })}

        {(["first", "second", "third"] as HandId[]).map((handId) => {
          const asset = handAssets[handId];

          return (
            <g
              key={handId}
              ref={(node) => {
                questionHandRefs.current[handId] = node;
              }}
              transform={`translate(${DIAL_GEOMETRY.centerX} ${DIAL_GEOMETRY.centerY}) rotate(${formatRotationAngle(initialDisplayAngles[handId])})`}
              opacity={1}
            >
              <svg
                x={-asset.pivotX * asset.scale}
                y={-asset.pivotY * asset.scale}
                width={asset.width * asset.scale}
                height={asset.height * asset.scale}
                viewBox={`0 0 ${asset.frame.width} ${asset.frame.height}`}
              >
                {renderSpritesheetCrop(asset.frame, 0, 0)}
              </svg>
            </g>
          );
        })}

        <g
          ref={answerHandRef}
          transform={`translate(${DIAL_GEOMETRY.centerX} ${DIAL_GEOMETRY.centerY}) rotate(${formatRotationAngle(initialAnswerHandAngle)})`}
          opacity={1}
        >
          <svg
            x={-handAssets.answer.pivotX * handAssets.answer.scale}
            y={-handAssets.answer.pivotY * handAssets.answer.scale}
            width={handAssets.answer.width * handAssets.answer.scale}
            height={handAssets.answer.height * handAssets.answer.scale}
            viewBox={`0 0 ${handAssets.answer.frame.width} ${handAssets.answer.frame.height}`}
          >
            {renderSpritesheetCrop(handAssets.answer.frame, 0, 0)}
          </svg>
        </g>

        {wheelConfigs.map(({ handId, offsetX, offsetY, rotationDeg }) => {
          const wheelX = DIAL_GEOMETRY.centerX + offsetX;
          const wheelY = DIAL_GEOMETRY.centerY + offsetY;

          return (
            <g
              key={handId}
              className="dial-wheel"
              ref={(node) => {
                wheelGroupRefs.current[handId] = node;
              }}
              transform={`translate(${wheelX} ${wheelY}) rotate(${rotationDeg})`}
            >
              <g
                clipPath={`url(#dial-wheel-clip-${handId})`}
                ref={(node) => {
                  wheelVisualRefs.current[handId].idle = node;
                }}
              >
                {renderSpritesheetCrop(
                  spritesheetFrames.wheelIdle,
                  -spritesheetFrames.wheelIdle.pivotX,
                  -spritesheetFrames.wheelIdle.pivotY,
                )}
              </g>
              <g
                clipPath={`url(#dial-wheel-clip-${handId})`}
                opacity="0"
                ref={(node) => {
                  wheelVisualRefs.current[handId].active = node;
                }}
              >
                {renderSpritesheetCrop(
                  spritesheetFrames.wheelActive,
                  -spritesheetFrames.wheelActive.pivotX,
                  -spritesheetFrames.wheelActive.pivotY,
                )}
              </g>
              <rect
                className="dial-wheel-hit"
                x={-spritesheetFrames.wheelIdle.pivotX}
                y={-spritesheetFrames.wheelIdle.pivotY}
                width={spritesheetFrames.wheelIdle.width}
                height={spritesheetFrames.wheelIdle.height}
                rx="12"
                ry="12"
                onClick={(event) => {
                  if (isAskAnimating) {
                    return;
                  }

                  event.stopPropagation();
                  sessionService.focusHand(handId);
                }}
                onPointerDown={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                  startWheelDrag(
                    handId,
                    rotationDeg,
                    event.pointerId,
                    event.clientX,
                    event.clientY,
                    event.currentTarget,
                  );
                }}
                onPointerMove={(event) => {
                  if (dragStateRef.current?.pointerId === event.pointerId) {
                    event.preventDefault();
                    moveWheelDrag(event.clientX, event.clientY);
                  }
                }}
                onPointerUp={(event) => {
                  if (dragStateRef.current?.pointerId === event.pointerId) {
                    event.stopPropagation();
                    event.preventDefault();
                    stopWheelDrag();
                  }
                }}
                onPointerCancel={(event) => {
                  if (dragStateRef.current?.pointerId === event.pointerId) {
                    event.stopPropagation();
                    event.preventDefault();
                    stopWheelDrag();
                  }
                }}
                onLostPointerCapture={() => {
                  stopWheelDrag();
                }}
              />
            </g>
          );
        })}
        <g clipPath="url(#dial-glare-clip)" opacity="1">
          {renderSpritesheetCrop(spritesheetFrames.glare, glareX, glareY)}
        </g>

        {showAskTrigger ? (
          <g className="dial-center-trigger">
            <circle
              cx={DIAL_GEOMETRY.centerX}
              cy={DIAL_GEOMETRY.centerY}
              r={MEDITATIVE_ASK_RADIUS}
              fill="transparent"
              pointerEvents="all"
              onClick={(event) => {
                event.stopPropagation();
              }}
              onPointerCancel={(event) => {
                if (askHoldRef.current?.pointerId === event.pointerId) {
                  event.stopPropagation();
                  cancelMeditativeAskHold();
                }
              }}
              onPointerDown={(event) => {
                event.stopPropagation();
                beginMeditativeAskHold(event.pointerId, event.currentTarget);
              }}
              onPointerMove={(event) => {
                if (
                  askHoldRef.current?.pointerId === event.pointerId &&
                  !askHoldRef.current.triggered &&
                  !isWithinMeditativeAskZone(event.clientX, event.clientY)
                ) {
                  event.stopPropagation();
                  cancelMeditativeAskHold();
                }
              }}
              onPointerUp={(event) => {
                if (askHoldRef.current?.pointerId === event.pointerId) {
                  event.stopPropagation();
                  if (!askHoldRef.current.triggered) {
                    cancelMeditativeAskHold();
                  }
                }
              }}
              onLostPointerCapture={() => {
                cancelMeditativeAskHold();
              }}
            />
          </g>
        ) : null}
        </svg>
      </div>
    </div>
  );
}
