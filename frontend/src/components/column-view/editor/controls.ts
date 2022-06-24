import { ButtonGroup, Button } from "@blueprintjs/core";
import h from "react-hyperscript";

enum Direction {
  Up = "up",
  Down = "down",
}

interface NavigationControlProps {
  moveCursor: (direction: Direction) => void;
  editingInterval?: number;
}

const DivisionNavigationControl = (props: NavigationControlProps) => {
  const { moveCursor } = props;
  return h(ButtonGroup, { vertical: true, small: true }, [
    h(Button, {
      small: true,
      icon: "caret-up",
      onClick: () => moveCursor(Direction.Up),
    }),
    h(Button, {
      small: true,
      icon: "caret-down",
      onClick: () => moveCursor(Direction.Down),
    }),
  ]);
};

export { DivisionNavigationControl, Direction };
