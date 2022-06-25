/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import h from "./main.module.styl";
import { StatefulComponent } from "@macrostrat/ui-components";

import { StratColumn } from "./column";
import { SettingsPanel } from "../../legacy-ui/settings";
import { Page } from "../../legacy-ui/enum";
import { Panel } from "../ui-panel";

import defaultColumnData from "~/example-data/Naukluft-Section-J.json";
import testImage from "~/example-data/Naukluft-Section-J.png";

const createID = () => "_" + Math.random().toString(36).substr(2, 9);

const AboutPanel = (props) =>
  h(Panel, { title: "About", ...props }, [h("div", "This is an app")]);

class ColumnView extends StatefulComponent {
  constructor(props) {
    super(props);
    this.updateColumnData = this.updateColumnData.bind(this);
    this.editInterval = this.editInterval.bind(this);
    this.surfaceIndex = this.surfaceIndex.bind(this);
    this.updateInterval = this.updateInterval.bind(this);
    this.cancelEditInterval = this.cancelEditInterval.bind(this);
    this.addInterval = this.addInterval.bind(this);
    this.removeInterval = this.removeInterval.bind(this);
    this.setPage = this.setPage.bind(this);
    this.isChanged = this.isChanged.bind(this);
    this.resetDemoData = this.resetDemoData.bind(this);
    const preparedData = this.prepareColumnData(defaultColumnData);
    this.state = {
      columnImage: testImage,
      defaultData: preparedData,
      columnData: preparedData,
      inEditMode: true,
      showFacies: true,
      generalized: false,
      editingInterval: null,
      clickedHeight: null,
      currentPage: Page.MAIN,
    };
  }

  render() {
    let {
      generalized,
      inEditMode,
      editingInterval,
      editingNote,
      clickedHeight,
      columnData,
      currentPage,
      column_id,
    } = this.state;
    const { surfaces, notes, height } = columnData;

    if (!inEditMode || currentPage === Page.SETTINGS) {
      editingInterval = null;
    }

    return h("div.column-main", [
      h("div.cs-main", [
        h(StratColumn, {
          surfaces,
          column_id,
          height,
          generalized,
          inEditMode,
          notes,
          editInterval: this.editInterval,
          addInterval: this.addInterval,
          removeInterval: this.removeInterval,
          editingInterval,
          clickedHeight,
          onUpdate: this.updateInterval,
          hideDetailColumn: currentPage !== Page.MAIN,
          columnImage: this.state.columnImage,
        }),
        h.if(currentPage === Page.SETTINGS)(SettingsPanel, {
          inEditMode,
          generalized,
          onClose: this.setPage(Page.SETTINGS),
          resetDemoData: this.isChanged() ? this.resetDemoData : null,
          updateState: this.updateState,
        }),
        h.if(currentPage === Page.ABOUT)(AboutPanel, {
          onClose: this.setPage(Page.ABOUT),
        }),
      ]),
    ]);
  }

  prepareSurface(totalHeight) {
    return function (surface, i, allSurfaces) {
      if (surface.id == null) {
        surface.id = createID();
      }
      try {
        surface.top = allSurfaces[i + 1].bottom;
      } catch (error) {
        surface.top = totalHeight;
      }
      return surface;
    };
  }

  prepareColumnData(columnData) {
    columnData.height = 60;
    columnData.surfaces.sort((a, b) => a.bottom - b.bottom);
    const v = columnData.surfaces.map(this.prepareSurface(columnData.height));
    columnData.surfaces = v;

    return columnData;
  }

  updateColumnData(spec) {
    return this.updateState({ columnData: spec });
  }

  // Interval management
  editInterval(obj) {
    if (!this.state.inEditMode) {
      return;
    }
    if (obj == null) {
      return this.cancelEditInterval();
    }
    let { height, division } = obj;
    if (division === this.state.editingInterval) {
      division = null;
    }

    return this.updateState({
      currentPage: { $set: Page.MAIN },
      editingInterval: { $set: division },
      clickedHeight: { $set: height },
    });
  }

  surfaceIndex(id) {
    const s = this.state.columnData.surfaces;
    return s.findIndex((d) => d.id === id);
  }

  updateInterval(interval, newItems) {
    const { id } = interval;
    const ix = this.surfaceIndex(id);
    if (ix === -1) {
      return;
    }
    const surface = this.state.columnData.surfaces[ix];
    const spec = {};
    for (let k in newItems) {
      const v = newItems[k];
      if (surface[k] === v) {
        continue;
      }
      spec[k] = { $set: v };
    }
    console.log(ix, spec);
    return this.updateState({
      columnData: { surfaces: { [ix]: spec } },
      editingInterval: spec,
    });
  }

  cancelEditInterval() {
    return this.updateState({ editingInterval: { $set: null } });
  }

  addInterval(height) {
    if (this.props.update == null) {
      return;
    }
    const { surfaces } = this.props.data;
    const editingInterval = { bottom: height };
    surfaces.push(editingInterval);
    surfaces.sort((a, b) => a.bottom - b.bottom);
    return this.updateState({ editingInterval: { $set: editingInterval } });
  }

  removeInterval(id) {}

  setPage(nextPage) {
    return () => {
      if (this.state.currentPage === nextPage) {
        nextPage = Page.MAIN;
      }
      return this.updateState({ currentPage: { $set: nextPage } });
    };
  }

  isChanged() {
    return (
      this.state.columnData !== this.defaultData ||
      this.state.columnImage !== testImage
    );
  }

  resetDemoData() {
    return this.updateState({
      columnData: { $set: this.defaultData },
      columnImage: { $set: testImage },
      editingInterval: { $set: null },
    });
  }
}

export { ColumnView };
