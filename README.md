# mike-tully.com

## Local setup

- Clone the repo with `git` (run `git clone git@github.com:miketully/miketully.github.io.git`)
- Install `node` (version 7), `bower` (run `npm i -g bower`) and `yarn` (run `npm i -g yarn`)
- In the repo directory, install dependencies by running `yarn && bower i`

## Local development

```
cd miketully.github.io
npm run dev
```

Only make changes to files in the `src` directory.

When you're finished making changes, stop the dev server by typing `CTRL`+`C`

## Deployment

Before staging, committing, and pushing your changes to git, compile the files in the `src` directory by running:

```
npm run build
```
