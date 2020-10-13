let project_folder = "dist";
let source_folder ="#src";

let path = {
	build: {
		html: project_folder + "/",
		css: project_folder + "/css/",
		js: project_folder + "/js/",
		img: project_folder + "/Assets/images/",
		fonts: project_folder + "/fonts/",
	},
	src: {
		html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
		css: source_folder + "/scss/**/style.scss",
		js: source_folder + "/js/script.js",
		img: source_folder + "/Assets/images/**/*.{jpg,png,svg,gif,ico,webp}",
		fonts: source_folder + "/fonts/*.ttf",
	},
	watch: {
		html: source_folder + "/**/*.html",
		css: source_folder + "/scss/**/*.scss",
		js: source_folder + "/js/**/*.js",
		img: source_folder + "/Assets/images/**/*.{jpg,png,svg,gif,ico,webp}",
	},
	clean: "./" + project_folder + "/"
};

let { src, dest } = require("gulp");
let	gulp = require("gulp");
let	browsersync = require("browser-sync").create();
let	fileiclude = require("gulp-file-include");
let	del = require("del");
let	scss = require("gulp-sass");
let	autoprefixer = require("gulp-autoprefixer");
let	group_media = require("gulp-group-css-media-queries");
let	clean_css = require("gulp-clean-css");
let	rename = require("gulp-rename");
let	uglify = require("gulp-uglify-es").default;
// let	babel = require("gulp-babel");
let	imagemin = require("gulp-imagemin");

function browserSync(params){
	browsersync.init(
	{
		server:{
			baseDir: "./" + project_folder + "/"
		},
		port:3000,
	}
	)
}

function html(){
	return src(path.src.html)
	.pipe(fileiclude())
	.pipe(dest(path.build.html))
	.pipe(browsersync.stream())

}

function css(){
	return src(path.src.css)
	.pipe(
		scss({
			outputStyle: "expanded"
		})
	)
	.pipe(
		group_media()
	)
	.pipe(
		autoprefixer({
			overrideBrowserlist: ["last 5 versions"],
			cascade: true
		})
	)
	.pipe(dest(path.build.css))
	.pipe(clean_css())
	.pipe(
		rename({
			extname: ".min.css"
		})
	)
	.pipe(dest(path.build.css))
	.pipe(browsersync.stream())
}

function js(){
	return src(path.src.js)
	.pipe(fileiclude())
	.pipe(dest(path.build.js))
	.pipe(uglify())
	// .pipe(babel({
	// 	presets: ['@babel/env']
	// }))
	.pipe(
		rename({
			extname: ".min.js"
		})
	)
	.pipe(dest(path.build.js))
	.pipe(browsersync.stream())

}

function images(){
	return src(path.src.img)
	.pipe(imagemin({
		progressive: true,
		svgoPlugins: [{ removeViewBox: false}],
		interlaced: true,
		optimizationLevel: 3 // 0 to 7
	}))
	.pipe(dest(path.build.img))
	.pipe(browsersync.stream())

}

function watchFiles(params){
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.img], images);
}

function clean(params) {
	return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(js, css, html, images));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.js = js;
exports.images = images;
exports.css = css;
exports.html = html;
// exports.img = img;
exports.build = build;
exports.watch = watch;
exports.default = watch;