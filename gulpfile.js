var gulp = require('gulp');

gulp.task('default', function () {
    gulp.src(
        ['bower_components/angular/angular.min.js',
            'bower_components/angular-toastr/dist/angular-toastr.tpls.min.js',
            'bower_components/angular-ui-sortable/sortable.min.js',
            'bower_components/angular-animate/angular-animate.min.js',
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/jquery-ui/jquery-ui.min.js',
            'bower_components/bootstrap/dist/js/bootstrap.min.js'])
        .pipe(gulp.dest('Scripts/libs/'));

    gulp.src(
        ['bower_components/bootstrap/dist/css/bootstrap.min.css',
            'bower_components/angular-toastr/dist/angular-toastr.min.css'])
        .pipe(gulp.dest('Content/libs/css'));

    gulp.src(['bower_components/bootstrap/fonts/**/*']).pipe(gulp.dest('Content/libs/fonts'));
});