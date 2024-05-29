// Set the base directory to the current directory
global.base_dir = __dirname;

// Define a global function to get the absolute path from the base directory
global.abs_path = function (path) {
    return base_dir + path;
}

// Define a global function to include modules using absolute paths
global.include = function (file) {
    return require(abs_path('/' + file));
}
