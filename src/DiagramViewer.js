import React from "react";

import { Diagram, ProvideStencilsetContext } from "@signavio/diagram";
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

const isSelected = shape => selectedShapeIds.indexOf(shape.id) >= 0;
const setSelected = shape => ({ ...shape, selected: true });
const reduceOpacity = shape => ({ ...shape, opacity: 0.4 });
const highlightOrFade = shape =>
  isSelected(shape) ? setSelected(shape) : reduceOpacity(shape);

// We further edit the JSON object to set `selected` and `opacity` properties of individual shapes.
const diagramState = {
  canvas: updateNodes(canvas, highlightOrFade),
  edges: updateEdges(edges, highlightOrFade)
};
const selectionStyles = {
  selectionColor: "rgb(173,15,91)",
  selectionOpacity: 0.9,
  selectionSpread: 5.5
};

const DiagramViewer = ({ selectedShapes }) => (
  <ProvideStencilsetContext stencilset={bpmnStencilset}>
    <Diagram {...diagramState} {...selectionStyles} />
  </ProvideStencilsetContext>
);

export default DiagramViewer;
