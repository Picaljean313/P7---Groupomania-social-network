import colors from "./colors";

export const themes = {
  original : {
    background: `linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), linear-gradient(0.25turn, ${colors.primary}, ${colors.secondary}, ${colors.tertiary})` 
  },
  cliffs : {
    background: "linear-gradient(rgba(255,255,255,0.6), rgba(255,255,255,0.6)), url('/images/themes/cliffs.jpeg')"
  },
  sea : {
    background: "linear-gradient(rgba(255,255,255,0.6), rgba(255,255,255,0.6)), url('/images/themes/sea.jpeg')"
  },
  christmas : {
    background: "linear-gradient(rgba(255,255,255,0.6), rgba(255,255,255,0.6)), url('/images/themes/christmas.jpeg')"
  },
  river : {
    background: "linear-gradient(rgba(255,255,255,0.6), rgba(255,255,255,0.6)), url('/images/themes/river.jpeg')"
  },
  sun : {
    background: "linear-gradient(rgba(255,255,255,0.6), rgba(255,255,255,0.6)), url('/images/themes/sun.jpeg')"
  }
};