
const fs =  require('fs');
const path =  require('path');
const  url = require('url');
const { rimraf} = require('rimraf')
const gitClone = require('./utile/index');

const res = JSON.parse(fs.readFileSync(path.join(__dirname, '/jsdoc.json'), 'utf-8'));

	if (res.gitUrl.length > 0) {
		if (fs.existsSync('docPackages')) {
			rimraf.sync(path.join(__dirname, '/docPackages'));
		}
		fs.mkdirSync(`docPackages`);
	
		res.gitUrl.forEach(item=>{
			const path = item.match(/(?<=static\/).*?(?=.git)/g)[0]
			gitClone(item, `docPackages/${path}`, {
				progress: (evt) => {
					console.log(evt);
				}
			}, () => {
				console.log("done!");
			});
		})
	}


// gitClone('https://git.caibeike.net/static/caibeike-b-static.git', 'docPackages/2', {
// 	progress: (evt) => {
// 		console.log(evt);
// 	}
// }, () => {
// 	console.log("done!");
// });