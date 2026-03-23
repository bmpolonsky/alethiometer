import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
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

interface DialProps {
  hands: Record<HandId, number>;
  answerHandAngle: number;
  interactive: boolean;
  meditativeMode?: boolean;
  onInspectSymbol: (symbolId: number) => void;
  onFocusHand: (handId: HandId) => void;
  onNudgeHand: (handId: HandId, direction: number) => void;
  onAsk?: () => void;
}

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

export function Dial({
  hands,
  answerHandAngle,
  interactive,
  meditativeMode = false,
  onInspectSymbol,
  onFocusHand,
  onNudgeHand,
  onAsk,
}: DialProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
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
    lastX: number;
    lastY: number;
    wheelRotationRad: number;
  } | null>(null);
  const [draggingHand, setDraggingHand] = useState<HandId | null>(null);
  const [wheelFramePhase, setWheelFramePhase] = useState<Record<HandId, 0 | 1>>({
    first: 0,
    second: 0,
    third: 0,
  });
  const [displayAngles, setDisplayAngles] = useState<Record<HandId, number>>({
    first: hands.first * 10,
    second: hands.second * 10,
    third: hands.third * 10,
  });
  const [holdProgress, setHoldProgress] = useState(0);
  const [isAskAnimating, setIsAskAnimating] = useState(false);
  const glareX = Math.round(DIAL_GEOMETRY.centerX - spritesheetFrames.glare.pivotX);
  const glareY = Math.round(DIAL_GEOMETRY.centerY - spritesheetFrames.glare.pivotY);
  const targetAngles = useMemo(
    () => ({
      first: hands.first * 10,
      second: hands.second * 10,
      third: hands.third * 10,
    }),
    [hands],
  );

  useEffect(() => {
    setDisplayAngles(targetAngles);
  }, [targetAngles]);

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

  function cancelMeditativeAskHold() {
    if (askHoldTimeoutRef.current) {
      window.clearTimeout(askHoldTimeoutRef.current);
      askHoldTimeoutRef.current = null;
    }

    if (askHoldRef.current?.frame) {
      window.cancelAnimationFrame(askHoldRef.current.frame);
    }

    askHoldRef.current = null;
    setHoldProgress(0);
  }

  function startMeditativeAsk() {
    if (!meditativeMode || !interactive || !onAsk || isAskAnimating) {
      return;
    }

    setIsAskAnimating(true);
    askAnimationTimeoutRef.current = window.setTimeout(() => {
      askAnimationTimeoutRef.current = null;
      setHoldProgress(0);
      setIsAskAnimating(false);
      onAsk();
    }, MEDITATIVE_ASK_ANIMATION_MS);
  }

  function beginMeditativeAskHold(pointerId: number, target: SVGCircleElement) {
    if (!meditativeMode || !interactive || !onAsk || isAskAnimating) {
      return;
    }

    cancelMeditativeAskHold();
    askHoldRef.current = {
      pointerId,
      triggered: false,
      startedAt: performance.now(),
      frame: 0,
    };
    setHoldProgress(0);
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

      setHoldProgress(nextProgress);
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
      setHoldProgress(1);
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
      onInspectSymbol(nextSymbol);
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
    if (!interactive || isAskAnimating) {
      return;
    }

    onFocusHand(handId);
    dragStateRef.current = {
      handId,
      pointerId,
      residuePixels: 0,
      lastX: clientX,
      lastY: clientY,
      wheelRotationRad: (wheelRotationDeg * Math.PI) / 180,
    };
    setDraggingHand(handId);
    setWheelFramePhase((current) => ({
      ...current,
      [handId]: 1,
    }));
    target.setPointerCapture(pointerId);
  }

  function moveWheelDrag(clientX: number, clientY: number) {
    const dragState = dragStateRef.current;

    if (!dragState) {
      return;
    }

    const dx = clientX - dragState.lastX;
    const dy = clientY - dragState.lastY;
    const delta =
      Math.cos(dragState.wheelRotationRad) * dx +
      Math.sin(dragState.wheelRotationRad) * dy;

    if (Math.abs(delta) > 0.3) {
      setWheelFramePhase((current) => ({
        ...current,
        [dragState.handId]: current[dragState.handId] === 0 ? 1 : 0,
      }));
    }

    const totalPixels = dragState.residuePixels + delta;
    const pixelsPerSymbol = 11;
    const steps =
      totalPixels > 0
        ? Math.floor(totalPixels / pixelsPerSymbol)
        : Math.ceil(totalPixels / pixelsPerSymbol);

    if (steps !== 0) {
      onNudgeHand(dragState.handId, steps);
      dragState.residuePixels = totalPixels - steps * pixelsPerSymbol;
    } else {
      dragState.residuePixels = totalPixels;
    }

    dragState.lastX = clientX;
    dragState.lastY = clientY;
  }

  function stopWheelDrag() {
    dragStateRef.current = null;
    setDraggingHand(null);
    setWheelFramePhase({
      first: 0,
      second: 0,
      third: 0,
    });
  }

  const dialShellStyle = {
    "--dial-hold-scale": String(1 + holdProgress * 0.07),
    "--dial-hold-brightness": String(1 + holdProgress * 0.08),
  } as CSSProperties;

  return (
    <div className={`dial-shell ${isAskAnimating ? "is-asking" : ""}`} style={dialShellStyle}>
      <svg
        ref={svgRef}
        className="dial"
        viewBox={`0 0 ${DIAL_GEOMETRY.width} ${DIAL_GEOMETRY.height}`}
        onClick={(event) => inspectByPointer(event.clientX, event.clientY)}
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
          <filter id="hand-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,0.34)" />
          </filter>
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
              transform={`translate(${DIAL_GEOMETRY.centerX} ${DIAL_GEOMETRY.centerY}) rotate(${displayAngles[handId]})`}
              filter="url(#hand-shadow)"
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
          transform={`translate(${DIAL_GEOMETRY.centerX} ${DIAL_GEOMETRY.centerY}) rotate(${answerHandAngle})`}
          filter="url(#hand-shadow)"
          opacity={0.98}
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
          const frame =
            draggingHand === handId && wheelFramePhase[handId] === 1
              ? spritesheetFrames.wheelActive
              : spritesheetFrames.wheelIdle;
          const wheelX = DIAL_GEOMETRY.centerX + offsetX;
          const wheelY = DIAL_GEOMETRY.centerY + offsetY;

          return (
            <g
              key={handId}
              className={`dial-wheel ${draggingHand === handId ? "is-dragging" : ""}`}
              transform={`translate(${wheelX} ${wheelY}) rotate(${rotationDeg})`}
            >
              <g clipPath={`url(#dial-wheel-clip-${handId})`}>
                {renderSpritesheetCrop(frame, -frame.pivotX, -frame.pivotY)}
              </g>
              <rect
                className="dial-wheel-hit"
                x={-frame.pivotX}
                y={-frame.pivotY}
                width={frame.width}
                height={frame.height}
                rx="12"
                ry="12"
                onClick={(event) => {
                  if (isAskAnimating) {
                    return;
                  }

                  event.stopPropagation();
                  onFocusHand(handId);
                }}
                onPointerDown={(event) => {
                  event.stopPropagation();
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
                    moveWheelDrag(event.clientX, event.clientY);
                  }
                }}
                onPointerUp={(event) => {
                  if (dragStateRef.current?.pointerId === event.pointerId) {
                    event.stopPropagation();
                    stopWheelDrag();
                  }
                }}
                onPointerCancel={(event) => {
                  if (dragStateRef.current?.pointerId === event.pointerId) {
                    event.stopPropagation();
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

        {meditativeMode ? (
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
  );
}
