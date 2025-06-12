import { dest, src, series, watch as gulpWatch } from "gulp";
import gulpSass from "gulp-sass";
import * as dartSass from "sass";
import rename from "gulp-rename";
import cleanCSS from "gulp-clean-css";
import csso from "gulp-csso";
import postcss from "gulp-postcss";
import sortMediaQueries from "postcss-sort-media-queries";
import fs from "fs/promises";
import autoprefixer from "gulp-autoprefixer";

const sass = gulpSass(dartSass);

const path = {
    scss: {
        src: {
            main: "style/style.scss",
            components: "style/components/*.scss",
        },
        dest: "style/css/",
    },
    css: {
        src: "style/css/style.css",
        dest: "style/css/",
        dest2: "dest/",
    },
};

const clear = async () => {
    try {
        await fs.rm(path.css.dest, { recursive: true, force: true });
    } catch (e) {
        // Ignore errors if directory does not exist
    }
};

const sassBuild = () => {
    return src(path.scss.src.main)
        .pipe(sass.sync().on("error", sass.logError))
        .pipe(postcss([
            sortMediaQueries()
        ]))
        .pipe(autoprefixer())
        .pipe(cleanCSS({ format: "beautify" }))
        .pipe(dest(path.scss.dest));
};

const cssMin = () => {
    return src(path.css.src, { allowEmpty: true })
        .pipe(postcss([]))
        .pipe(csso())
        .pipe(rename({ suffix: ".min" }))
        .pipe(dest(path.css.dest))
        .pipe(dest(path.css.dest2));
};

const build = series(clear, sassBuild, cssMin);

const watchFiles = () => {
    gulpWatch(path.scss.src.main, build);
    gulpWatch(path.scss.src.components, { delay: 500 }, build);
};

export { clear, build };
export const watch = series(build, watchFiles);
