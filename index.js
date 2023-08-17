
const fs =  require('fs');
const path =  require('path');
const { exec } = require('child_process');
const { rimraf} = require('rimraf')
const walkSync = require('./utile/js-to-doc')

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

const main= async ()=>{
	const res = JSON.parse(fs.readFileSync(path.join(__dirname, '/jsdoc.json'), 'utf-8'))

	if (res.gitUrl.length > 0) {
		if (fs.existsSync('docPackages')) {
			rimraf.sync(path.join(__dirname, '/docPackages'));
		}
		fs.mkdirSync(`docPackages`);
		try {
			for (const project of res.gitUrl) {
				// clone 项目
				await cloneProject(project);

			}
			if (res.includes.length > 0) {
				if (fs.existsSync('docs')) {
					rimraf.sync(path.join(__dirname, '/docs'));
				}
				fs.mkdirSync(`docs`);
				// 创建项目文件
				res.includes.forEach(item => {
					const project = item.match(/^.*?(?=\/)/g)[0]
					const projectPath = `docs/${project}`
					if (!fs.existsSync(projectPath)) {
						fs.mkdirSync(projectPath);
					}
				});
				
				res.includes.forEach(item => {
				const project = item.match(/^.*?(?=\/)/g)[0]
				const _subFolder = path.join(__dirname, `/docs/${project}`, path.basename(item));
				const OriginPath = path.join(__dirname,'docPackages',item);
				fs.mkdirSync(_subFolder);
				console.log(OriginPath,_subFolder)
				 walkSync(OriginPath, function (filePath) {}, 1, _subFolder);
				});
			}
			} catch (error) {
			console.error('Error occurred:', error);
			}
	}
	
}
main()