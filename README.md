<div align="center">

  # [dotenv-extended](https://www.npmjs.com/package/dotenv-extended)-prepare
</div>

[![Dependencies](https://img.shields.io/badge/dependencies-none-brightgreen)](# "zero dependency")
<a href="https://www.npmjs.com/package/dotenv-extended-prepare?activeTab=versions"><img align="right" alt="npm" src="https://img.shields.io/npm/dw/dotenv-extended-prepare?labelColor=white&color=cd0d0d&logo=npm"></a>

<div align="center">
  
Protects developers from manually doing boring stuff — isn't that what we're here for?
  
<br />

Just run `npm i` on a new repo, and `.env` preset will be sitting in the top-level directory for you to fill it.

> .env is created based on `.env.defaults` and `.env.schema`
</div>

## Preview

```ps1
NODE_ENV=
# PORT=
# npm_package_name=
TOKEN=
```

> Variables from `.env.defaults` are taken as _optional_ — commented out with `#` on line start.

> The `.env.schema` variables definitely want you to __fill them__ in.

## Quick start

### For personal usage

1. Perform a global installation:

```ps1
npm i -g dotenv-extended-prepare
```

2. Simply run it after cloning another genius repo telling you to scrap around the files looking for variable names

```ps1
dotenv-extended-prepare
```

### For automatically respecting the time of other developers

1. Install `dotenv-extended-prepare` as a development dependency:

```ps1
npm i -D dotenv-extended-prepare
```

2. Specify a `postinstall` script in your package file — it will run on `npm i`

```yml
# package.json

"scripts": {
  "postinstall": "dotenv-extended-prepare"
}
```

> If you need to specify a custom path or name to schemas/defaults, or you don't use `dotenv-extended` at all, or you prefer using regular OG `dotenv` like our grandpas did and your env sample is named `.env.example` — just wait a couple of days. I'm planning to add more names for auto-search and some configuration.

## Why?

I like high development convenience. Almost every new project has its .env schemas/examples/samples or defaults. Usually, after cloning a new repository, the developer has to not just enter environment variables, but also search for their names, check which ones are already set by default and create an .env file.

This package is actively maintained. Give it a star, and maybe share some thoughts by opening an issue.
## Bonuses

- A safe one-liner for adding "postinstall" to `package.json`:

```ps1
npm set-script postinstall "dotenv-extended-prepare"
```
