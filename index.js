#!/usr/bin/env node

const chalk = require('chalk');
const fs = require('fs');
const download = require('download-git-repo');
const { exec } = require('child_process');

const currentNodeVersion = process.versions.node;
const semver = currentNodeVersion.split('.');
const major = semver[0];

if (major < 8) {
  console.error(
    chalk.red(
      `You are running Node ${currentNodeVersion}.\n`
        + 'React Kathamo requires Node 8 or higher. \n'
        + 'Please update your version of Node.',
    ),
  );
  process.exit(1);
}

const projectName = process.argv.slice(2, 3)[0];

if (!projectName) {
  console.error(chalk.red('Missing project directory name.'));
  process.exit(1);
}

const projectPath = `${process.cwd()}/${projectName}`;

if (fs.existsSync(projectPath)) {
  console.log(chalk.red(`Unable to create ${projectPath}.\nProject directory already exists.`));
  process.exit(1);
}

console.log(`\nCreating ${projectName}...`);

download(
  'direct:https://github.com/debashisbarman/react-kathamo/archive/master.zip',
  projectPath,
  {
    clone: false,
  },
  (err) => {
    if (err) {
      console.log(err);
      console.error(chalk.red(`Unable to create ${projectName} in ${projectPath}.`));
      process.exit(1);
    }

    console.log('\nInstalling project dependencies...');

    exec(`cd ${projectPath} && npm install`, (err) => {
      if (err) {
        console.log(
          chalk.red('Unable to install project dependencies.\nPlease install them manually.'),
        );
        process.exit(1);
      }

      console.log(
        `\nSuccess! Created ${projectName} in ${projectPath}\n\n`
          + `Inside that directory, you can run several commands.\n\n${chalk.cyan('  npm start')}\n`
          + '    Starts the development server.'
          + `\n\n${chalk.cyan('  npm run build')}\n`
          + '    Bundles the app into static files for production.\n\n'
          + `We suggest that you begin by typing:\n\n${chalk.cyan(
            '  cd ',
          )}${projectName}\n${chalk.cyan('  npm start')}\n\n`
          + 'Happy coding!',
      );
    });
  },
);
