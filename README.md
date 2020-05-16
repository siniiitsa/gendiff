# Gendiff

A CLI application that compares two configuration files, then computes a difference between them and shows it in the terminal, similar to `git diff` command.

[![Node CI](https://github.com/siniiitsa/frontend-project-lvl2/workflows/Node%20CI/badge.svg)](https://github.com/siniiitsa/frontend-project-lvl2/actions)
[![Maintainability](https://api.codeclimate.com/v1/badges/4c9931ddd90cd1bd16cd/maintainability)](https://codeclimate.com/github/siniiitsa/frontend-project-lvl2/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/4c9931ddd90cd1bd16cd/test_coverage)](https://codeclimate.com/github/siniiitsa/frontend-project-lvl2/test_coverage)

## How to install

To install gendiff on your computer, you should:

1. Download or clone this repository
2. Open a terminal window in the project folder and run:

```
npm link
```

This will install Gendiff as a global npm package you can run in a terminal window.

## How to use

Gendiff supports json, yaml and ini file formats. To generate the difference between two files, you need to go to your terminal window and type in:

```
gendiff filepath-1.json filepath-2.json
```

Note that Gendiff accepts both relative and absolute paths. By default Gendiff will output the difference in a tree-like format. You can change the output format providing an optional --format option with a specific format name:

```
gendiff --format tree filepath-1.ini filepath-2.ini
gendiff --format plain filepath-1.json filepath-2.json
gendiff --format json filepath-1.yml filepath-2.yml
```

Nothing prevents you from comparing two files of different formats, like this:

```
gendiff filepath-1.yml filepath-2.json
gendiff filepath-1.ini filepath-2.yaml
```

To access gendiff help, run this:

```
gendiff --help
```
