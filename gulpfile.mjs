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
import { join } from "path";
import browserSync from "browser-sync";

const bs = browserSync.create();
const sass = gulpSass(dartSass);

const path = {
    scss: {
        src: {
            main: "style/style.scss",
            components: "style/components/*.scss",
            common: "style/common/*.scss",
        },
        dest: "style/css/",
    },
    css: {
        src: "style/css/style.css",
        dest: "style/css/",
        dest2: "dest/",
    },
    html: {
        src: "resources",
        dest: "dest/website",
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

const injectCssToHtml = async () => {
    const cssPath = join(path.css.dest2, "style.min.css");
    const styleTagId = "custom_css";

    try {
        const files = await fs.readdir(path.html.dest);
        if (files.length === 0) {
            return;
        }
    } catch (e) {
        console.warn(`Directory ${path.html.dest} does not exist or is empty, skipping CSS injection.`);
        return;
    }

    try {
        await fs.mkdir(path.html.dest, { recursive: true });
        await fs.cp(path.html.src, path.html.dest, { recursive: true, force: true });

        const css = await fs.readFile(cssPath, "utf8");
        const htmlFileName = await fs.readdir(path.html.dest)
            .then(files => files.find(file => file.endsWith(".html") || file.endsWith(".mhtml")));
        if (!htmlFileName) {
            throw new Error(`HTML file not found in ${path.html.dest}`);
        }

        const htmlFilePath = join(path.html.dest, htmlFileName);
        let html = await fs.readFile(htmlFilePath, "utf8");

        html = html.replace(
            new RegExp(`<style id="${styleTagId}" type="text/css">[\\s\\S]*?</style>`, "g"),
            `<style id="${styleTagId}" type="text/css">${css}</style>`
        );

        await fs.writeFile(htmlFilePath, html, "utf8");
    } catch (e) {
        console.error("Error injecting CSS into HTML:", e);
    }
};

const build = series(clear, sassBuild, cssMin, injectCssToHtml);

const watchFiles = () => {
    gulpWatch(path.scss.src.main, build);
    gulpWatch(path.scss.src.components, { delay: 500 }, build);
    gulpWatch(path.scss.src.common, { delay: 500 }, build);
};

const serve = async () => {
    const htmlFileName = await fs.readdir(path.html.dest)
        .then(files => files.find(file => file.endsWith(".html") || file.endsWith(".mhtml")));

    if (!htmlFileName) {
        throw new Error(`HTML file not found in ${path.html.dest}`);
    }

    const startPath = join(path.html.dest, htmlFileName)
        .replace(/\\/g, "/")
        .replace(/\/\//g, "/");

    bs.init({
        server: path.html.dest,
        open: false,
        notify: false,
        startPath,
        port: 8080,
    });

    bs.watch(startPath).on("change", bs.reload);
};

export { clear, build, serve };
export const watch = series(build, watchFiles);
