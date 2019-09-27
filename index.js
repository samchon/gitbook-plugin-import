const fetch = require("node-fetch");
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

async function download(url)
{
    try
    {
        let response = await fetch(url, { method: "GET" });
        return await response.text();
    }
    catch
    {
        return null;
    }
}

async function importFiles(rawPath, body)
{
    const OPENER = '<!-- @import("';
    const CLOSER = '") -->';

    rawPath = PathUtil.dirname(rawPath);
    let pathList = betweens(body, OPENER, CLOSER);

    for (let path of pathList)
    {
        let realPath = path;
        let sections = [];
        let pos = path.lastIndexOf("#L");

        if (pos !== -1)
        {
            let chars = betweens(path.substr(pos + 1), "L");
            if (chars.length === 2 && chars[0].substr(-1) === "-")
                chars[0] = chars[0].substr(0, chars.length - 1);
            
            sections = chars.map(str => Number(str));
            --sections[0];

            realPath = path.substr(0, pos);
        }

        let content = path.indexOf("://") !== -1
            ? await download(realPath)
            : await read(PathUtil.isAbsolute(realPath) ? realPath : rawPath + "/" + realPath);
        if (content === null)
            continue;

        if (sections.length)
        {
            let lines = content.split("\r\n").join("\n").split("\n");
            lines = lines.slice(...sections);

            content = lines.join("\n");
        }
        body = body.replace(OPENER + path + CLOSER, content);
    }
    return body;
}

function replaceTemplates(ret)
{
    const OPENER = "<!-- @templates(";
    const CLOSER = ") -->";

    let jsonList = betweens(ret, OPENER, CLOSER);
    for (let json of jsonList)
        try
        {
            let templates = JSON.parse(json);
            console.log(templates);

            for (let tuple of templates)
            {
                let from = `\${{ ${tuple[0]} }}`;
                let to = tuple[1];

                ret = ret.split(from).join(to);
            }
        }
        catch {}
    return ret;
}

module.exports = {
    hooks: {
        "page:before": async page =>
        {
            page.content = await importFiles(page.rawPath, page.content);
            page.content = replaceTemplates(page.content);
            
            return page;
        }
    }
};