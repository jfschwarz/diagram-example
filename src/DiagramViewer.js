import React from "react";

import {
  SvgDiagram,
  DecorationDiagram,
  ProvideStencilsetContext,
  Layered
} from "@signavio/diagram";
import bpmnStencilset, {
  transformSignavioJSON
} from "@signavio/stencilset-bpmn2.0";

import diagram from "./exampleSignavioDiagram.json";
import { updateNodes, updateEdges } from "./update";

// The React diagram viewer internally uses a JSON format that is slightly different
// to the Signavio exchange format. So we have to transform it first.
const { canvas, edges } = transformSignavioJSON(diagram);

const selectedShapeIds = [
  "sid-E52733C4-146E-4C2A-AF31-32B0F9547998",
  "sid-2EB962AB-43BF-44D2-8639-86CA8560FE69",
  "sid-7B5AC9B3-B2D4-4CB9-830C-5BCFC5C62542",
  "sid-02982065-15FD-4BCF-90D0-A71BE15835F8",
  "sid-D68EB790-6185-4C93-AF81-A9A4EBC1C67C"
];

const decorations = {
  "sid-E52733C4-146E-4C2A-AF31-32B0F9547998": <button>🎉</button>,
  "sid-7B5AC9B3-B2D4-4CB9-830C-5BCFC5C62542": <button>🎉</button>
};

const isSelected = shape => selectedShapeIds.indexOf(shape.id) >= 0;
const addHighlight = shape => ({
  ...shape,
  highlight: {
    stroke: "rgba(173,15,91, 0.5)",
    strokeWidth: 8
  }
});
const reduceOpacity = shape => ({ ...shape, opacity: 0.4 });
const highlightOrFade = shape =>
  isSelected(shape) ? addHighlight(shape) : reduceOpacity(shape);

const addDecoration = shape => ({
  ...shape,
  decoration: [
    {
      position: "bottom right", // only supported on nodes, values have form: 'top|middle|bottom left|center|right'
      align: "bottom right",
      children: decorations[shape.id]
    }
  ]
});
const decorate = shape =>
  decorations[shape.id] ? addDecoration(shape) : shape;

const addClickListener = shape => ({
  ...shape,
  cursor: "pointer",
  onClick: event => {
    event.stopPropagation();
    console.log(`clicked ${shape.type} ${shape.id}`);
  }
});

// compose all update functions
const processShape = shape =>
  decorate(highlightOrFade(addClickListener(shape)));
// iterate all shapes and apply the composed update function
const diagramState = {
  canvas: updateNodes(canvas, processShape),
  edges: updateEdges(edges, processShape)
};

const DiagramViewer = ({ selectedShapes }) => (
  <ProvideStencilsetContext stencilset={bpmnStencilset}>
    <Layered {...diagramState} layers={[SvgDiagram, DecorationDiagram]} />
  </ProvideStencilsetContext>
);

export default DiagramViewer;
