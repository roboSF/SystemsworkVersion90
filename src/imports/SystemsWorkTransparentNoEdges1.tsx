import svgPaths from "./svg-6mmb23yxr5";

function IsolationMode() {
  return (
    <div className="absolute bottom-0 left-[50.46%] right-[32.83%] top-0" data-name="Isolation Mode">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 172 172">
        <g id="Isolation Mode">
          <path d={svgPaths.p3f969400} fill="var(--fill-0, #EE3124)" id="Vector" />
          <path d={svgPaths.p2eefc400} fill="var(--fill-0, white)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}



function Layer2() {
  return (
    <div className="absolute contents inset-0" data-name="Layer 2">
      <IsolationMode />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents inset-0" data-name="Group">
      <Layer2 />
    </div>
  );
}

export default function SystemsWorkTransparentNoEdges1() {
  return (
    <div className="relative size-full" data-name="systems@work_transparent_no_edges 1">
      <Group />
    </div>
  );
}