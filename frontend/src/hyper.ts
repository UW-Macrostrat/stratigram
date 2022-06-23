import { hyperStyled } from "@macrostrat/hyper";
import styles from "./**/*.styl";

const allStyles = Object.assign({}, ...styles.map((s) => s.default));

const h = hyperStyled(allStyles);

export default h;
export * from "@macrostrat/hyper";
