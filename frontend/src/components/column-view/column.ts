import { Component, useContext } from "react";
import { IntervalEditor } from "./editor";
import {
  SVG,
  ColumnAxis,
  ColumnProvider,
  ColumnContext,
  GrainsizeAxis,
  FaciesProvider,
  AssetPathContext,
  GrainsizeLayoutProvider,
  GeologicPatternProvider,
  SymbolColumn,
  DivisionEditOverlay,
  ColumnImage,
  LithologyColumn,
  LithologyBoxes,
  GeneralizedSectionColumn,
  CoveredOverlay,
  FaciesColumnInner,
  NotesColumn,
} from "@macrostrat/column-components";
import h from "~/hyper";
import T from "prop-types";
import defaultFacies from "./default-facies.json";
import { ColumnNotesManager } from "./notes";
import { useAPIQuery, APISchema, apiClient } from "~/system";

import { animateScroll as scroll } from "react-scroll";
import { Spinner } from "@blueprintjs/core";
const patterns = {};
const assetPaths = {};

const ColumnSVG = function (props) {
  const { width: innerWidth, margin, children, ...rest } = props;
  const { pixelHeight } = useContext(ColumnContext);
  const { left, right, top, bottom } = margin;
  const height = pixelHeight + (top + bottom);
  const width = innerWidth + (left + right);
  return h(
    SVG,
    {
      width,
      height,
      className: "section",
      ...rest,
    },
    h(
      "g.backdrop",
      {
        transform: `translate(${left},${top})`,
      },
      children
    )
  );
};

const MainColumn = function ({ generalized, lithologyWidth: width, ...rest }) {
  if (generalized) {
    return h(GeneralizedSectionColumn, rest);
  }
  return h(LithologyColumn, { width, ...rest });
};

//componentDidMount: =>
//{margin} = @props
//scroll.scrollTo(margin.top)

function StratColumnView(props) {
  let {
    margin = {
      left: 30,
      top: 30,
      right: 10,
      bottom: 30,
    },
    column_id,
    clickedHeight,
    showFacies = false,
    inEditMode,
    generalized,
    editingInterval,
    height,
    addInterval,
    removeInterval,
    editInterval,
    onUpdate,
    columnImage = null,
    hideDetailColumn = false,
    surfaces,
  } = props;

  const shouldShowNotes = editingInterval == null && !hideDetailColumn;

  const lithologyWidth = 40;
  const columnWidth = 212;
  const grainsizeScaleStart = 132;
  const notesWidth = 480;
  const notesMargin = 30;
  const editorMargin = 30;
  const notesOffset = columnWidth + notesMargin;
  let containerWidth = columnWidth;
  const left = margin.left;

  if (hideDetailColumn) {
    editingInterval = null;
  }

  if (shouldShowNotes) {
    containerWidth = notesOffset + notesWidth;
  }

  return h(
    ColumnProvider,
    {
      divisions: surfaces,
      range: [0, height],
      pixelsPerMeter: 20,
    },
    [
      h("div.column-container", [
        h(
          GrainsizeLayoutProvider,
          {
            width: columnWidth,
            grainsizeScaleStart,
          },
          [
            h.if(!generalized && columnImage)(ColumnImage, {
              left: left + lithologyWidth,
              top: margin.top,
              src: columnImage,
            }),
            h.if(inEditMode)(DivisionEditOverlay, {
              top: margin.top,
              left: margin.left,
              width: 200,
              onClick: editInterval,
              color: "dodgerblue",
              editingInterval,
            }),
            h(
              ColumnSVG,
              {
                width: containerWidth,
                margin,
                style: { zIndex: 10, position: "relative" },
              },
              [
                h(MainColumn, { generalized, lithologyWidth }, [
                  h.if(showFacies)(FaciesColumnInner),
                  h(CoveredOverlay),
                  h(LithologyBoxes),
                ]),
                h(SymbolColumn, { left: 90, symbols: [] }),
                h(ColumnAxis),
                h(GrainsizeAxis),
                // Notes column
                h.if(shouldShowNotes)(ColumnNotesManager, {
                  column_id,
                  offset: notesOffset,
                  width: notesWidth,
                }),
              ]
            ),
          ]
        ),
      ]),
      h.if(editingInterval)(IntervalEditor, {
        interval: editingInterval,
        height: clickedHeight,
        closeDialog: () => {
          return editInterval(null);
        },
        addInterval,
        removeInterval,
        setEditingInterval: editInterval,
        onUpdate,
      }),
    ]
  );
}

StratColumnView.propTypes = {
  inEditMode: T.bool.isRequired,
  generalized: T.bool,
  editingInterval: T.object,
  surfaces: T.arrayOf(T.object).isRequired,
  notes: T.arrayOf(T.object).isRequired,
  editInterval: T.func.isRequired,
  addInterval: T.func.isRequired,
  height: T.number.isRequired,
  hideDetailColumn: T.bool,
  columnImage: T.string,
};

const resolvePattern = (id) => {
  const vizBaseURL = "https://visualization-assets.s3.amazonaws.com";
  const patternBaseURL = vizBaseURL + "/geologic-patterns/png";
  return `${patternBaseURL}/${id}.png`;
};

const __StratOuter = function (props) {
  return h(
    GeologicPatternProvider,
    { resolvePattern },
    h(
      "div.column-editor",
      h(FaciesProvider, { initialFacies: defaultFacies }, [
        h(StratColumnView, props),
      ])
    )
  );
};

export { __StratOuter as StratColumn };
