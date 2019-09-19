const FileSystem = require("fs");
const PathUtil = require("path");

function betweens(str, from, to)
{
    let ret = str.split(from);
    ret = ret.slice(1);

    for (let i = 0; i < ret.length; ++i)
    {
        let index = ret[i].indexOf(to);
        if (index !== -1)
            ret[i] = ret[i].substr(0, index);
    }
    return ret;
}

function read(path)
{
    return new Promise(resolve =>
    {
        FileSystem.readFile(path, "utf8", (err, ret) =>
        {
            if (err)
                resolve(null);
            else
                resolve(ret);
        });
    });
}

async function main(rawPath, body)
{
    const OPENER = '<!-- @import("';
    const CLOSER = '") -->';

    rawPath = PathUtil.dirname(rawPath);
    let pathList = betweens(body, OPENER, CLOSER);

    for (let path of pathList)
    {
        let realPath = PathUtil.isAbsolute(path)
            ? path
            : rawPath + "/" + path;
        
        let content = await read(realPath);
        if (content === null)
            continue;

        body = body.replace(OPENER + path + CLOSER, content);
    }
    return body;
}

module.exports = {
    hooks: {
        "page:before": async function (page)
        {
            page.content = await main(page.rawPath, page.content);
            return page;
        }
    }
};