import { useEffect, useMemo, useRef, useState } from "react";
import type { HandId } from "../domain/types";
import {
  DIAL_GEOMETRY,
  describeRingSlice,
  pointToSymbolIndex,
} from "../lib/geometry";

interface DialProps {
  hands: Record<HandId, number>;
  activeHand: HandId;
  answerHandSymbolId: number | null;
  countdownProgress: number;
  interactive: boolean;
  onInspectSymbol: (symbolId: number) => void;
  onFocusHand: (handId: HandId) => void;
  onNudgeHand: (handId: HandId, direction: number) => void;
}

const ATLAS_SIZE = {
  width: 1024,
  height: 1024,
};

const ATLAS_HREF = "/assets/graphics-lib.png";

const atlasFrames = {
  device: { x: 111, y: 0, width: 549, height: 593, pivotX: 274.5, pivotY: 313.15 },
  glare: { x: 199, y: 593, width: 316, height: 316, pivotX: 158.45, pivotY: 159.4 },
  wheelIdle: { x: 660, y: 0, width: 199, height: 103, pivotX: 101.65, pivotY: 92 },
  wheelActive: { x: 0, y: 593, width: 199, height: 103, pivotX: 101.65, pivotY: 92 },
};

const handAssets: Record<
  HandId | "answer",
  {
    href: string;
    width: number;
    height: number;
    pivotX: number;
    pivotY: number;
    scale: number;
  }
> = {
  "query-1": {
    href: "/assets/arrow1.png",
    width: 53,
    height: 313,
    pivotX: 24.63,
    pivotY: 195.81,
    scale: 0.7,
  },
  "query-2": {
    href: "/assets/arrow2.png",
    width: 43,
    height: 318,
    pivotX: 19.78,
    pivotY: 196.72,
    scale: 0.725,
  },
  "query-3": {
    href: "/assets/arrow3.png",
    width: 26,
    height: 329,
    pivotX: 12.77,
    pivotY: 238.14,
    scale: 0.67,
  },
  answer: {
    href: "/assets/arrow4.png",
    width: 42,
    height: 394,
    pivotX: 20.19,
    pivotY: 253.64,
    scale: 0.635,
  },
};

const wheelConfigs: Array<{
  handId: HandId;
  offsetX: number;
  offsetY: number;
  rotationDeg: number;
}> = [
  { handId: "query-1", offsetX: -245, offsetY: 145, rotationDeg: -120 },
  { handId: "query-2", offsetX: 3, offsetY: -289, rotationDeg: 0 },
  { handId: "query-3", offsetX: 243, offsetY: 148, rotationDeg: 120 },
];

function normalizeAngleDifference(target: number, current: number) {
  return ((((target - current) % 360) + 540) % 360) - 180;
}

function renderAtlasCrop(
  frame: { x: number; y: number; width: number; height: number },
  offsetX: number,
  offsetY: number,
) {
  return (
    <image
      href={ATLAS_HREF}
      x={Math.round(-frame.x + offsetX)}
      y={Math.round(-frame.y + offsetY)}
      width={ATLAS_SIZE.width}
      height={ATLAS_SIZE.height}
      preserveAspectRatio="none"
    />
  );
}

export function Dial({
  hands,
  activeHand,
  answerHandSymbolId,
  countdownProgress,
  interactive,
  onInspectSymbol,
  onFocusHand,
  onNudgeHand,
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
    "query-1": 0,
    "query-2": 0,
    "query-3": 0,
  });
  const [displayAngles, setDisplayAngles] = useState<Record<HandId, number>>({
    "query-1": hands["query-1"] * 10,
    "query-2": hands["query-2"] * 10,
    "query-3": hands["query-3"] * 10,
  });
  const [displayAnswerAngle, setDisplayAnswerAngle] = useState(
    answerHandSymbolId != null ? answerHandSymbolId * 10 : 0,
  );
  const answerAngleRef = useRef(displayAnswerAngle);
  const glareX = Math.round(DIAL_GEOMETRY.centerX - atlasFrames.glare.pivotX);
  const glareY = Math.round(DIAL_GEOMETRY.centerY - atlasFrames.glare.pivotY);
  const circumference = 2 * Math.PI * DIAL_GEOMETRY.progressRadius;
  const targetAngles = useMemo(
    () => ({
      "query-1": hands["query-1"] * 10,
      "query-2": hands["query-2"] * 10,
      "query-3": hands["query-3"] * 10,
    }),
    [hands],
  );

  useEffect(() => {
    setDisplayAngles(targetAngles);
  }, [targetAngles]);

  useEffect(() => {
    answerAngleRef.current = displayAnswerAngle;
  }, [displayAnswerAngle]);

  useEffect(() => {
    if (answerHandSymbolId == null) {
      return;
    }

    let frame = 0;
    const target = answerHandSymbolId * 10;
    const from = answerAngleRef.current;
    const diff = normalizeAngleDifference(target, from);
    const duration = 430;
    const startedAt = performance.now();

    const tick = () => {
      const elapsed = performance.now() - startedAt;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextAngle = from + diff * eased;

      answerAngleRef.current = nextAngle;
      setDisplayAnswerAngle(nextAngle);

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      } else {
        answerAngleRef.current = target;
        setDisplayAnswerAngle(target);
      }
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [answerHandSymbolId]);

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
      "query-1": 0,
      "query-2": 0,
      "query-3": 0,
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
            <rect x="0" y="0" width={atlasFrames.device.width} height={atlasFrames.device.height} />
          </clipPath>
          <clipPath id="dial-glare-clip">
            <rect
              x={glareX}
              y={glareY}
              width={atlasFrames.glare.width}
              height={atlasFrames.glare.height}
            />
          </clipPath>
          {wheelConfigs.map(({ handId }) => (
            <clipPath id={`dial-wheel-clip-${handId}`} key={`clip-${handId}`}>
              <rect
                x={-atlasFrames.wheelIdle.pivotX}
                y={-atlasFrames.wheelIdle.pivotY}
                width={atlasFrames.wheelIdle.width}
                height={atlasFrames.wheelIdle.height}
                rx="12"
                ry="12"
              />
            </clipPath>
          ))}
          <radialGradient id="countdown-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,242,204,0.42)" />
            <stop offset="70%" stopColor="rgba(255,242,204,0.08)" />
            <stop offset="100%" stopColor="rgba(255,242,204,0)" />
          </radialGradient>
          <filter id="hand-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,0.34)" />
          </filter>
          <filter id="answer-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="rgba(255, 236, 169, 0.78)" />
          </filter>
        </defs>

        <g clipPath="url(#dial-device-clip)">{renderAtlasCrop(atlasFrames.device, 0, 0)}</g>

        <circle
          cx={DIAL_GEOMETRY.centerX}
          cy={DIAL_GEOMETRY.centerY}
          r={DIAL_GEOMETRY.progressRadius}
          fill="url(#countdown-glow)"
          opacity={0.78}
        />
        <circle
          cx={DIAL_GEOMETRY.centerX}
          cy={DIAL_GEOMETRY.centerY}
          r={DIAL_GEOMETRY.progressRadius}
          fill="none"
          stroke="rgba(255, 246, 211, 0.12)"
          strokeWidth="4"
        />
        <circle
          cx={DIAL_GEOMETRY.centerX}
          cy={DIAL_GEOMETRY.centerY}
          r={DIAL_GEOMETRY.progressRadius}
          fill="none"
          stroke="rgba(255, 239, 190, 0.84)"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - countdownProgress)}
          strokeLinecap="round"
          transform={`rotate(-90 ${DIAL_GEOMETRY.centerX} ${DIAL_GEOMETRY.centerY})`}
        />

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

        {(["query-1", "query-2", "query-3"] as HandId[]).map((handId) => {
          const asset = handAssets[handId];

          return (
            <g
              key={handId}
              transform={`translate(${DIAL_GEOMETRY.centerX} ${DIAL_GEOMETRY.centerY}) rotate(${displayAngles[handId]})`}
              filter="url(#hand-shadow)"
              opacity={activeHand === handId ? 1 : 0.84}
            >
              <image
                href={asset.href}
                x={-asset.pivotX * asset.scale}
                y={-asset.pivotY * asset.scale}
                width={asset.width * asset.scale}
                height={asset.height * asset.scale}
              />
            </g>
          );
        })}

        {answerHandSymbolId != null ? (
          <g
            transform={`translate(${DIAL_GEOMETRY.centerX} ${DIAL_GEOMETRY.centerY}) rotate(${displayAnswerAngle})`}
            filter="url(#answer-glow)"
            opacity={0.98}
          >
            <image
              href={handAssets.answer.href}
              x={-handAssets.answer.pivotX * handAssets.answer.scale}
              y={-handAssets.answer.pivotY * handAssets.answer.scale}
              width={handAssets.answer.width * handAssets.answer.scale}
              height={handAssets.answer.height * handAssets.answer.scale}
            />
          </g>
        ) : null}

        {wheelConfigs.map(({ handId, offsetX, offsetY, rotationDeg }) => {
          const frame =
            draggingHand === handId && wheelFramePhase[handId] === 1
              ? atlasFrames.wheelActive
              : atlasFrames.wheelIdle;
          const wheelX = DIAL_GEOMETRY.centerX + offsetX;
          const wheelY = DIAL_GEOMETRY.centerY + offsetY;

          return (
            <g
              key={handId}
              className={`dial-wheel ${draggingHand === handId ? "is-dragging" : ""}`}
              transform={`translate(${wheelX} ${wheelY}) rotate(${rotationDeg})`}
            >
              <g clipPath={`url(#dial-wheel-clip-${handId})`}>
                {renderAtlasCrop(frame, -frame.pivotX, -frame.pivotY)}
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

        <image
          href="/assets/center.png"
          x={DIAL_GEOMETRY.centerX - 17.5}
          y={DIAL_GEOMETRY.centerY - 17.5}
          width="35"
          height="35"
        />

        <g clipPath="url(#dial-glare-clip)" opacity="0.82">
          {renderAtlasCrop(atlasFrames.glare, glareX, glareY)}
        </g>
      </svg>
    </div>
  );
}
