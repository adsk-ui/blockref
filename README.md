# blockref
Gulp plug-in for creating streams of files referenced by script tags

index.html:
```
<html>
<body>
<!-- build:js -->
<script src="src/one.js"></script>
<script src="src/two.js"></script>
<!-- endbuild -->
</body>
</html>
```
gulpfile.js:
```
var gulp = require('gulp');
var blockref = require('blockref');
gulp.src('index.html')
  .pipe(blockref('js', 'bundle.js'))
  .pipe(gulp.dest('build/'));
```
now the build directory looks like
```
build/
  one.js
  two.js
```
