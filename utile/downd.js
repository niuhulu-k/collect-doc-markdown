const { exec } = require('child_process');
const fs = require('fs');

// Create a promise-based function to clone a Git project
const cloneProject = (project) => {
  return new Promise((resolve, reject) => {
    const path ='docPackages/' + project.match(/(?<=static\/).*?(?=.git)/g)[0]
    const command = `git clone ${project} ${path}`
    const childProcess = exec(command);
    childProcess.on('close', () => {
      resolve();
    });
    childProcess.on('error', (error) => {
      reject(error);
    });
  });
};

// Use async/await to download and clone the Git projects
module.exports = async function downloadGitProjects (gitProjects) {
  try {
    for (const project of gitProjects) {
      await cloneProject(project);
    }
    console.log('All projects cloned successfully.');
  } catch (error) {
    console.error('Error occurred:', error);
  }
};