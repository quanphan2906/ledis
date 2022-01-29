# Ledis

A simple, light-weight version of Redis. Built with Vue 3.

# Design

Ledis runs entirely on a single web page, and requires no back-end server or database. This means the state of the app does not persist between page reloads.

Design of Ledis is broken down into 2 parts:

1. User interface (UI)
2. Mock server

## UI

The UI was built with Vue 3. The component structure is simple:

-   `App`
    -   `CommandLine`
    -   `Line`

`CommandLine` is the component that wraps around the (black) console area. Each `Line` contains a previous command or the result of a previous command.

## Mock server

In the `mock-server` folder, I create a `database` variable to act as the database of the app (this "database" is not preserved between page reloads of course). Along with this constant is multiple functions that modify the mock database.

There are two reasons why I save the state of the app into a JS variable instead of a reactive object in the `App` component:

1. I want the mock server to resemble a real server as much as possible, and an app with a back-end server will not save its database live in the front-end.
2. I have already had a reactive object (`result`) in the `App` component to determine what should be rendered in the `Line` component(s) and when `App` should re-render, so declaring another reactive object to serve as a database is redundant.

# My workflow

**Step 1**: Build user interface with Vue \
**Step 2**: Build mock-server \
**Step 3**: Testing with `vue-test-utils` and `jest` \
**Step 4**: Final UI touch up

# What did I learn?

This is my _first_ time writing tests for a Vue application. I used `vue-test-utils` and `jest`. I learnt how to conduct unit testing with each component in the Vue application, and with each function in the mock server.

# Notes

## Syntax

1. If the user passes more arguments than required a command, the program will ignore the redundant arguments. For example, `DEL` requires 1 argument. If the user passes 2 arguments (e.g `DEL hello name`), the program will ignore the second argument.

2. The command line is case-sensitive.

## Miscellanous

1. When a timeout is set, the key will be expired. If the user sets the timeout for `key1` as `5`, `key1` will be deleted after 5 seconds.
