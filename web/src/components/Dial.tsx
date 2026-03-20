import { useEffect, useMemo, useRef, useState } from "react";
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
    scale: 0.94,
  },
  second: {
    frame: spritesheetFrames.arrow2,
    width: spritesheetFrames.arrow2.width,
    height: spritesheetFrames.arrow2.height,
    pivotX: spritesheetFrames.arrow2.pivotX,
    pivotY: spritesheetFrames.arrow2.pivotY,
    scale: 0.94,
  },
  third: {
    frame: spritesheetFrames.arrow3,
    width: spritesheetFrames.arrow3.width,
    height: spritesheetFrames.arrow3.height,
    pivotX: spritesheetFrames.arrow3.pivotX,
    pivotY: spritesheetFrames.arrow3.pivotY,
    scale: 0.96,
  },
  answer: {
    frame: spritesheetFrames.arrow4,
    width: spritesheetFrames.arrow4.width,
    height: spritesheetFrames.arrow4.height,
    pivotX: spritesheetFrames.arrow4.pivotX,
    pivotY: spritesheetFrames.arrow4.pivotY,
    scale: 0.96,
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
  const [centerHoldProgress, setCenterHoldProgress] = useState(0);
  const holdStateRef = useRef<{
    pointerId: number;
    startedAt: number;
    frame: number;
    completed: boolean;
  } | null>(null);
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

  function cancelCenterHold() {
    const holdState = holdStateRef.current;

    if (holdState?.frame) {
      window.cancelAnimationFrame(holdState.frame);
    }

    holdStateRef.current = null;
    setCenterHoldProgress(0);
  }

  function startCenterHold(pointerId: number, target: SVGCircleElement) {
    if (!meditativeMode || !interactive || !onAsk) {
      return;
    }

    const durationMs = 1200;

    const holdState = {
      pointerId,
      startedAt: performance.now(),
      frame: 0,
      completed: false,
    };

    const tick = () => {
      const nextProgress = Math.min((performance.now() - holdState.startedAt) / durationMs, 1);

      setCenterHoldProgress(nextProgress);

      if (nextProgress >= 1) {
        holdState.completed = true;
        holdStateRef.current = holdState;
        onAsk();
        return;
      }

      holdState.frame = window.requestAnimationFrame(tick);
      holdStateRef.current = holdState;
    };

    cancelCenterHold();
    holdStateRef.current = holdState;
    target.setPointerCapture(pointerId);
    holdState.frame = window.requestAnimationFrame(tick);
  }

  function inspectByPointer(clientX: number, clientY: number) {
    const svg = svgRef.current;

    if (!svg) {
      return;
    }

    const rect = svg.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * DIAL_GEOMETRY.width;
    const y = ((clientY - rect.top) / rect.height) * DIAL_GEOMETRY.height;
    const nextSymbol = pointToSymbolIndex(x, y);

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
    if (!interactive) {
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

  return (
    <div className="dial-shell">
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

        {meditativeMode ? (
          <g className="dial-center-trigger">
            <circle
              className={`dial-center-hold ${centerHoldProgress > 0 ? "is-holding" : ""}`}
              cx={DIAL_GEOMETRY.centerX}
              cy={DIAL_GEOMETRY.centerY}
              r={56}
              onClick={(event) => {
                event.stopPropagation();
              }}
              onPointerCancel={(event) => {
                if (holdStateRef.current?.pointerId === event.pointerId) {
                  event.stopPropagation();
                  cancelCenterHold();
                }
              }}
              onPointerDown={(event) => {
                event.stopPropagation();
                startCenterHold(event.pointerId, event.currentTarget);
              }}
              onPointerLeave={(event) => {
                if (holdStateRef.current?.pointerId === event.pointerId) {
                  event.stopPropagation();
                  cancelCenterHold();
                }
              }}
              onPointerUp={(event) => {
                if (holdStateRef.current?.pointerId === event.pointerId) {
                  event.stopPropagation();
                  if (holdStateRef.current?.completed) {
                    holdStateRef.current = null;
                    setCenterHoldProgress(0);
                  } else {
                    cancelCenterHold();
                  }
                }
              }}
              opacity={0.001}
            />
            <circle
              className="dial-center-progress"
              cx={DIAL_GEOMETRY.centerX}
              cy={DIAL_GEOMETRY.centerY}
              r={52}
              style={{
                opacity: centerHoldProgress > 0 ? 0.85 : 0.16,
                transform: `translate(${DIAL_GEOMETRY.centerX}px, ${DIAL_GEOMETRY.centerY}px) scale(${0.92 + centerHoldProgress * 0.1}) translate(${-DIAL_GEOMETRY.centerX}px, ${-DIAL_GEOMETRY.centerY}px)`,
              }}
            />
          </g>
        ) : null}

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
      </svg>
    </div>
  );
}
