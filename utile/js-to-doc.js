const fs =  require('fs');
const path =  require('path');
const { rimraf} = require('rimraf')
const jsdoc2md = require('jsdoc-to-markdown')

module.exports = function walkSync(currentDirPath, callback, level, target) {
    fs.readdirSync(currentDirPath, { withFileTypes: true }).forEach(function (dirent) {
        const filePath = path.join( currentDirPath, dirent.name);
        let targetPath = target;
        if (level === 1) {
            if (dirent.isDirectory() || /\.(js|mjs|jsx|ts|tsx)$/.test(dirent.name)) {
                const splitPath = dirent.name.split('.');
                if (splitPath[1]) {
                    targetPath = path.join(target, splitPath[0] + '-' + splitPath[1]);
                } else {
                    targetPath = path.join(target, splitPath[0]);
                }
                fs.mkdirSync(targetPath);
            }
        }
        if (dirent.isFile() && /\.(js|mjs|jsx|ts|tsx)$/.test(dirent.name)) {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const commentRegex = /\/\*\*(.*?)\*\//g; // 示例：匹配/** ... */格式的注释
            const sFile = JSON.stringify(fileContent);
            if (commentRegex.test(sFile)) {
                const templateDate = jsdoc2md.getTemplateDataSync({
                    // source: fileContent,
                    configure: 'jsdoc.json',
                    files: path.join(currentDirPath, dirent.name),
                });
                jsdoc2md.render({ data: templateDate }).then(res => {
                    if (res) {
                        fs.writeFile(
                            path.join(
                                targetPath,
                                path.basename(path.resolve(filePath, '../')) +
                                    '-' +
                                    path.basename(filePath).split('.')[0] +
                                    '.md',
                            ),
                            res,
                            function (err) {
                                console.log(err);
                            },
                        );
                    }
                });
            }
        } else if (dirent.isDirectory()) {
            walkSync(path.join(currentDirPath, dirent.name), callback, 2, targetPath);
        }
    });
}
// if (res.includes.length > 0) {
//     if (fs.existsSync('docs')) {
//         rimraf.sync(path.join(__dirname, '/docs'));
//     }
//     fs.mkdirSync(`docs`);
//     res.includes.forEach(item => {
//         const project = item.match(/^.*?(?=\/)/g)[0]
//         console.log(project)
//         // const _subFolder = path.join(__dirname, '/docs', path.basename(item));
//         // fs.mkdirSync(_subFolder);
//         // walkSync(item, function (filePath) {}, 1, _subFolder);
//     });
// }
