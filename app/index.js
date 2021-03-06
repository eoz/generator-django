'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var randomString = require('randomstring');

var foldername = path.basename(process.cwd());


var DjangoGenerator = module.exports = function DjangoGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(DjangoGenerator, yeoman.generators.Base);

DjangoGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [{
    name: 'siteName',
    message: 'Whats the name of the website?',
    default: foldername
  }, {
    name: 'author',
    message: 'Who is the creator?',
    default: 'dummy'
  }, {
    name: 'projectRepo',
    message: 'Whats the repo clone URL?'
  },{
    name: 'djangoVersion',
    message: 'Which version of Django would you like to use?',
    type: 'list',
    choices: ['1.5', '1.6', '1.7'],
    default: 2
  }];

  this.prompt(prompts, function (props) {
    this.siteName = props.siteName;
    this.author = props.author;
    this.projectRepo = props.projectRepo;
    var versionMap = {
        '1.5': '>=1.5,<1.6',
        '1.6': '>=1.6,<1.7',
        '1.7': '>=1.7,<1.8',
    };
    this.djangoVersion = versionMap[props.djangoVersion];

    cb();
  }.bind(this));
};

DjangoGenerator.prototype.createSecret = function createSecret() {
    this.secret = randomString.generate(48);
};

DjangoGenerator.prototype.app = function app() {
  // Apps folder.
  this.mkdir('apps');

  // Settings folder.
  this.mkdir('settings');

  // Requirements folder.
  this.mkdir('requirements');

  // Libs and bins folder.
  this.mkdir('bin');
  this.mkdir('libs');

  // Templates folder.
  this.mkdir('templates');
  this.mkdir('templates/layout');

  // Static files folder.
  this.mkdir('static');
  this.mkdir('static/js');
  this.mkdir('static/css');
  this.mkdir('static/img');
  this.mkdir('static/vendor');
};

DjangoGenerator.prototype.git = function git() {
  this.template('_gitignore', '.gitignore');
};

DjangoGenerator.prototype.bower = function bower() {
  this.copy('bowerrc', '.bowerrc');
  this.template('_bower.json', 'bower.json');
};

DjangoGenerator.prototype.bin = function bin() {
  this.copy('bin/watchmedo.sh', 'bin/watchmedo.sh');
};

DjangoGenerator.prototype.requirements = function requirements() {
  this.template('requirements/common', 'requirements/COMMON');
  this.copy('requirements/testing', 'requirements/TESTING');
  this.copy('requirements/development', 'requirements/DEVELOPMENT');
  this.copy('requirements/production', 'requirements/PRODUCTION');
};

DjangoGenerator.prototype.settings = function settings() {
  this.copy('settings/gitignore', 'settings/.gitignore');
  this.copy('init.py', 'settings/__init__.py');
  this.template('settings/_common.py', 'settings/common.py');
  this.template('settings/_testing.py', 'settings/testing.py');
  this.template('settings/_development.py', 'settings/development.py');
};

DjangoGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
  this.template('_readme.md', 'README.md');
  this.copy('urls.py', 'urls.py');
  this.copy('_wsgi.py', 'wsgi.py');
  this.copy('manage.py', 'manage.py');
  this.copy('init.py', '__init__.py');
  this.template('_fabfile.py', 'fabfile.py');
  this.template('_package.json', 'package.json');
};
