# dotenv-extended-prepare
[![Dependencies](https://img.shields.io/badge/dependencies-none-green)](# "zero dependency")

## Reason

> Development convenience. Almost every new project has its .env schemas/examples/samples or defaults. Usually, after cloning a new repository, the developer has to not just enter environment variables, but also search for their names, check which ones are already set by default and create an .env file.

This package protects developers from manually doing boring stuff — isn't that what we're here for?

Just run `npm i` on a new repo, and `.env` preset will be sitting in the top-level directory for you to fill it.

### Preview:

> The newly created preset contains required variable names with `=` on line end.
>
> The default variables are commented out with `#` on line start.

```ps1
NODE_ENV=
# PORT=
# npm_package_name=
TOKEN=
```

## Usage

1. Install `dotenv-extended-prepare` as a development dependency:

```ps1
npm i -D dotenv-extended-prepare
```

2. Specify a `prepare` script in your package file (it will run on `npm i`)

```yml
# package.json

"scripts": {
  "prepare": "dotenv-extended-prepare"
}
```

### Bonuses

- One-liner for adding "prepare" to `package.json`:

```sh1
node -e "let pkg=require('./package.json'); pkg.scripts.prepare=pkg.scripts.prepare??'dotenv-extended-prepare'; require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2));"
```