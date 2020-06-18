const base = require('@high-standards-nodejs/base');
const path = require('path');
const latestVersion = require('latest-version');

(async() => {
    await base.checkAcceptedHighStandards();

    const packageJsonOfConfig = base.getInitiatingProjectPackageJson();
    
    if (!packageJsonOfConfig.engines) packageJsonOfConfig.engines = {};
    if (!packageJsonOfConfig.engines.node) packageJsonOfConfig.engines.node = `>=${process.versions.node}`;
    
    const templateContent = JSON.parse(
        base.getTemplate(
            __dirname, 
            'package.json', 
            {
                newestTypescriptVersion: await latestVersion('typescript'),
                nodeEngineVersion: `${packageJsonOfConfig.engines.node.replace(/^\W+/, '')}`
            }
        )
    );
    
    if (!packageJsonOfConfig.dependencies) packageJsonOfConfig.dependencies = {};
    
    [
        'typescript',
        '@types/node',
    ]
    .forEach((packageName) => {
        packageJsonOfConfig.dependencies[packageName] = templateContent.dependencies[packageName];
    })
    console.log(process.versions.node)
    base.writeFile(
        path.join(
            base.getProjectRoot(), 
            'package.json'
        ),
        JSON.stringify(packageJsonOfConfig, null, 2)
    );
})()